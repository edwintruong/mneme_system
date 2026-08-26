import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../data/local_database.dart';
import '../models/app_models.dart';
import '../services/gemini_service.dart';

class AiExecutionResult<T> {
  const AiExecutionResult({
    required this.value,
    required this.usedGemini,
    this.fallbackReason,
  });

  final T value;
  final bool usedGemini;
  final String? fallbackReason;
}

class MnemeStore extends ChangeNotifier {
  MnemeStore(this.database, {GeminiService? gemini})
    : gemini = gemini ?? GeminiService.fromEnvironment();
  final LocalDatabase database;
  final GeminiService gemini;
  List<MnemeCategory> categories = [];
  List<SavedLink> links = [];
  List<Notebook> notebooks = [];
  List<String> folders = [];

  Future<void> load() async {
    categories = (await database.db.query('categories'))
        .map(
          (r) => MnemeCategory(
            id: r['id'] as int,
            name: r['name'] as String,
            image: r['image'] as String,
            itemCount: r['item_count'] as int,
          ),
        )
        .toList();
    links = (await database.db.query('links', orderBy: 'id DESC'))
        .map(
          (r) => SavedLink(
            id: r['id'] as int,
            title: r['title'] as String,
            url: r['url'] as String,
            summary: r['summary'] as String,
            category: r['category'] as String,
            folder: r['folder'] as String,
            image: r['image'] as String,
            source: r['source'] as String,
            tags: _decodeStringList(r['tags'] as String? ?? '[]'),
            favorite: (r['favorite'] as int) == 1,
          ),
        )
        .toList();
    notebooks = (await database.db.query('notebooks', orderBy: 'id DESC'))
        .map(
          (r) => Notebook(
            id: r['id'] as int,
            title: r['title'] as String,
            description: r['description'] as String,
            image: r['image'] as String,
            itemCount: r['item_count'] as int,
            sections: _decodeSections(r['content'] as String? ?? '[]'),
          ),
        )
        .toList();
    folders = (await database.db.query(
      'folders',
      orderBy: 'id',
    )).map((r) => r['name'] as String).toList();
    notifyListeners();
  }

  Future<AiExecutionResult<SavedLink>> addLink({
    required String url,
    required String category,
    required String folder,
  }) async {
    GeminiLinkDraft? draft;
    String? fallbackReason;
    if (gemini.isConfigured) {
      try {
        draft = await gemini.analyzeUrl(
          url: url,
          suggestedCategory: category,
          suggestedFolder: folder,
        );
      } on GeminiException catch (error) {
        fallbackReason = error.message;
      }
    } else {
      fallbackReason = 'GEMINI_API_KEY chưa được cấu hình';
    }

    final resolvedCategory = draft?.category ?? category;
    final resolvedFolder = draft?.folder ?? folder;
    if (!folders.contains(resolvedFolder)) {
      await database.db.insert('folders', {
        'name': resolvedFolder,
        'category': resolvedCategory,
      });
    }
    final id = await database.db.insert('links', {
      'title': draft?.title ?? 'How to build a design system',
      'url': url,
      'summary': draft?.summary ?? 'Nội dung được Mneme phân tích và tự động tóm tắt để bạn xem lại nhanh.',
      'category': resolvedCategory,
      'folder': resolvedFolder,
      'image': _imageFor(resolvedCategory),
      'source': draft?.source ?? _sourceFor(url),
      'tags': jsonEncode(draft?.tags ?? const <String>[]),
      'favorite': 0,
    });
    await load();
    final link = links.firstWhere((item) => item.id == id);
    return AiExecutionResult(
      value: link,
      usedGemini: draft != null,
      fallbackReason: fallbackReason,
    );
  }

  Future<void> toggleFavorite(SavedLink link) async {
    await database.db.update(
      'links',
      {'favorite': link.favorite ? 0 : 1},
      where: 'id = ?',
      whereArgs: [link.id],
    );
    await load();
  }

  Future<void> deleteLink(int id) async {
    await database.db.delete('links', where: 'id = ?', whereArgs: [id]);
    await load();
  }

  Future<void> updateLink({
    required int id,
    required String title,
    required String folder,
  }) async {
    await database.db.update(
      'links',
      {'title': title, 'folder': folder},
      where: 'id = ?',
      whereArgs: [id],
    );
    await load();
  }

  Future<void> moveLinks(Iterable<int> ids, String folder) async {
    final batch = database.db.batch();
    for (final id in ids) {
      batch.update(
        'links',
        {'folder': folder},
        where: 'id = ?',
        whereArgs: [id],
      );
    }
    await batch.commit(noResult: true);
    await load();
  }

  Future<void> deleteLinks(Iterable<int> ids) async {
    final batch = database.db.batch();
    for (final id in ids) {
      batch.delete('links', where: 'id = ?', whereArgs: [id]);
    }
    await batch.commit(noResult: true);
    await load();
  }

  Future<void> addFolder(String name) async {
    await database.db.insert('folders', {'name': name, 'category': 'Design'});
    await load();
  }

  Future<AiExecutionResult<Notebook>> addNotebook(
    Iterable<int> sourceIds,
  ) async {
    final ids = sourceIds.toSet();
    final sources = links.where((link) => ids.contains(link.id)).toList();
    if (sources.isEmpty) {
      throw StateError('Notebook cần ít nhất một nguồn.');
    }

    GeminiNotebookDraft? draft;
    String? fallbackReason;
    if (gemini.isConfigured) {
      try {
        draft = await gemini.createNotebook(
          sources: sources
              .take(12)
              .map(
                (link) => GeminiNotebookSource(
                  title: link.title,
                  url: link.url,
                  summary: link.summary,
                ),
              )
              .toList(),
        );
      } on GeminiException catch (error) {
        fallbackReason = error.message;
      }
    } else {
      fallbackReason = 'GEMINI_API_KEY chưa được cấu hình';
    }

    final sections =
        draft?.sections
            .map(
              (section) =>
                  NotebookSection(title: section.title, body: section.body),
            )
            .toList() ??
        sources
            .map(
              (source) =>
                  NotebookSection(title: source.title, body: source.summary),
            )
            .toList();
    final id = await database.db.insert('notebooks', {
      'title': draft?.title ?? '${sources.first.folder} · Tổng hợp',
      'description':
          draft?.description ?? 'Sổ tay AI tổng hợp từ các nội dung đã chọn.',
      'image': sources.first.image,
      'item_count': sources.length,
      'content': jsonEncode(
        sections.map((section) => section.toJson()).toList(),
      ),
    });
    await load();
    final notebook = notebooks.firstWhere((item) => item.id == id);
    return AiExecutionResult(
      value: notebook,
      usedGemini: draft != null,
      fallbackReason: fallbackReason,
    );
  }

  static List<String> _decodeStringList(String value) {
    try {
      final decoded = jsonDecode(value);
      return decoded is List ? decoded.whereType<String>().toList() : const [];
    } on FormatException {
      return const [];
    }
  }

  static List<NotebookSection> _decodeSections(String value) {
    try {
      final decoded = jsonDecode(value);
      return decoded is List
          ? decoded
                .whereType<Map>()
                .map(
                  (item) =>
                      NotebookSection.fromJson(Map<String, dynamic>.from(item)),
                )
                .where(
                  (section) =>
                      section.title.isNotEmpty && section.body.isNotEmpty,
                )
                .toList()
          : const [];
    } on FormatException {
      return const [];
    }
  }

  static String _sourceFor(String url) {
    final host = Uri.tryParse(url)?.host.toLowerCase() ?? '';
    if (host.contains('youtube') || host.contains('youtu.be')) return 'YouTube';
    if (host.contains('tiktok')) return 'TikTok';
    if (host.contains('instagram')) return 'Instagram';
    return 'Website';
  }

  static String _imageFor(String category) {
    final normalized = category.toLowerCase();
    if (normalized.contains('du lịch') || normalized.contains('travel')) {
      return 'assets/images/travel.png';
    }
    if (normalized.contains('phim') || normalized.contains('movie')) {
      return 'assets/images/movies.png';
    }
    if (normalized.contains('ẩm thực') || normalized.contains('công thức')) {
      return 'assets/images/cake.png';
    }
    return 'assets/images/figma.png';
  }

  @override
  void dispose() {
    gemini.close();
    super.dispose();
  }
}
