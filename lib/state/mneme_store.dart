import 'package:flutter/foundation.dart';

import '../data/local_database.dart';
import '../models/app_models.dart';

class MnemeStore extends ChangeNotifier {
  MnemeStore(this.database);
  final LocalDatabase database;
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
          ),
        )
        .toList();
    folders = (await database.db.query(
      'folders',
      orderBy: 'id',
    )).map((r) => r['name'] as String).toList();
    notifyListeners();
  }

  Future<void> addLink({
    required String url,
    required String category,
    required String folder,
  }) async {
    await database.db.insert('links', {
      'title': 'How to build a design system',
      'url': url,
      'summary': 'Nội dung được Mneme phân tích và tự động tóm tắt để bạn xem lại nhanh.',
      'category': category,
      'folder': folder,
      'image': 'assets/images/figma.png',
      'source': 'YouTube',
      'favorite': 0,
    });
    await load();
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

  Future<void> addFolder(String name) async {
    await database.db.insert('folders', {'name': name, 'category': 'Design'});
    await load();
  }

  Future<Notebook> addNotebook(String title) async {
    final id = await database.db.insert('notebooks', {
      'title': title,
      'description': 'Sổ tay AI tổng hợp từ các nội dung đã chọn.',
      'image': 'assets/images/figma.png',
      'item_count': links.length,
    });
    await load();
    return notebooks.firstWhere((n) => n.id == id);
  }
}
