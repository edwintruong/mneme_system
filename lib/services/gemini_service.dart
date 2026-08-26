import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

abstract final class GeminiConfig {
  static const apiKey = String.fromEnvironment('GEMINI_API_KEY');
  static const model = String.fromEnvironment(
    'GEMINI_MODEL',
    defaultValue: 'gemini-3.7-flash',
  );
}

class GeminiLinkDraft {
  const GeminiLinkDraft({
    required this.title,
    required this.summary,
    required this.category,
    required this.folder,
    required this.source,
    required this.tags,
  });

  final String title;
  final String summary;
  final String category;
  final String folder;
  final String source;
  final List<String> tags;
}

class GeminiNotebookSection {
  const GeminiNotebookSection({required this.title, required this.body});

  final String title;
  final String body;
}

class GeminiNotebookDraft {
  const GeminiNotebookDraft({
    required this.title,
    required this.description,
    required this.sections,
  });

  final String title;
  final String description;
  final List<GeminiNotebookSection> sections;
}

class GeminiException implements Exception {
  const GeminiException(this.message);
  final String message;

  @override
  String toString() => 'GeminiException: $message';
}

/// Small REST client used instead of the unmaintained legacy Dart Gemini SDK.
///
/// The key is sent in the `x-goog-api-key` header and is never written to disk.
/// URL Context and Google Search are server-side Gemini tools, so the client
/// does not scrape arbitrary pages itself.
class GeminiService {
  GeminiService({
    required String apiKey,
    this.model = GeminiConfig.model,
    http.Client? client,
    this.timeout = const Duration(seconds: 45),
  }) : _apiKey = apiKey.trim(),
       _client = client ?? http.Client();

  factory GeminiService.fromEnvironment() =>
      GeminiService(apiKey: GeminiConfig.apiKey);

  final String _apiKey;
  final String model;
  final http.Client _client;
  final Duration timeout;

  bool get isConfigured => _apiKey.isNotEmpty;

  Future<GeminiLinkDraft> analyzeUrl({
    required String url,
    required String suggestedCategory,
    required String suggestedFolder,
  }) async {
    final json = await _generateJson(
      prompt:
          '''
Bạn là bộ máy lưu trữ tri thức của Mneme. Hãy truy cập và đọc URL sau bằng URL Context hoặc Google Search:
$url

Trả lời bằng tiếng Việt. Tạo metadata ngắn gọn để lưu link:
- title: tiêu đề thực tế, tối đa 90 ký tự.
- summary: tóm tắt có ích trong 2-3 câu, tối đa 420 ký tự.
- category: nhóm chủ đề chính; ưu tiên "$suggestedCategory" nếu hợp lý.
- folder: thư mục cụ thể; ưu tiên "$suggestedFolder" nếu hợp lý.
- source: Website, YouTube, TikTok, Instagram hoặc Khác.
- tags: 2-5 tag ngắn, không có ký hiệu #.
Nếu URL không truy cập được, suy luận thận trọng từ URL và không bịa chi tiết cụ thể.
''',
      schema: const {
        'type': 'object',
        'properties': {
          'title': {'type': 'string'},
          'summary': {'type': 'string'},
          'category': {'type': 'string'},
          'folder': {'type': 'string'},
          'source': {
            'type': 'string',
            'enum': ['Website', 'YouTube', 'TikTok', 'Instagram', 'Khác'],
          },
          'tags': {
            'type': 'array',
            'items': {'type': 'string'},
          },
        },
        'required': [
          'title',
          'summary',
          'category',
          'folder',
          'source',
          'tags',
        ],
      },
      useExternalTools: true,
    );

    return GeminiLinkDraft(
      title: _requiredString(json, 'title'),
      summary: _requiredString(json, 'summary'),
      category: _requiredString(json, 'category'),
      folder: _requiredString(json, 'folder'),
      source: _requiredString(json, 'source'),
      tags: _stringList(json['tags']),
    );
  }

  Future<GeminiNotebookDraft> createNotebook({
    required List<GeminiNotebookSource> sources,
  }) async {
    if (sources.isEmpty) {
      throw const GeminiException('Notebook cần ít nhất một nguồn.');
    }
    final sourceText = sources
        .map(
          (source) =>
              '''
- Tiêu đề: ${source.title}
  URL: ${source.url}
  Tóm tắt local: ${source.summary}
''',
        )
        .join();
    final json = await _generateJson(
      prompt:
          '''
Bạn là biên tập viên notebook của Mneme. Hãy dùng URL Context và Google Search để đọc các nguồn có thể truy cập, sau đó tổng hợp thành một notebook tiếng Việt độc lập, chính xác và dễ trình bày trong demo.

Nguồn:
$sourceText

Yêu cầu:
- title: tên notebook súc tích, tối đa 70 ký tự.
- description: mô tả 2 câu về giá trị của notebook.
- sections: 3-6 mục theo trình tự logic.
- Mỗi body dài 70-180 từ, tổng hợp kiến thức thay vì chỉ liệt kê link.
- Không thêm dữ kiện cụ thể nếu nguồn không xác minh được.
''',
      schema: const {
        'type': 'object',
        'properties': {
          'title': {'type': 'string'},
          'description': {'type': 'string'},
          'sections': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'title': {'type': 'string'},
                'body': {'type': 'string'},
              },
              'required': ['title', 'body'],
            },
          },
        },
        'required': ['title', 'description', 'sections'],
      },
      useExternalTools: true,
    );

    final rawSections = json['sections'];
    if (rawSections is! List || rawSections.isEmpty) {
      throw const GeminiException('Gemini không trả về nội dung notebook.');
    }
    return GeminiNotebookDraft(
      title: _requiredString(json, 'title'),
      description: _requiredString(json, 'description'),
      sections: rawSections.map((item) {
        if (item is! Map) {
          throw const GeminiException('Section notebook không hợp lệ.');
        }
        final section = Map<String, dynamic>.from(item);
        return GeminiNotebookSection(
          title: _requiredString(section, 'title'),
          body: _requiredString(section, 'body'),
        );
      }).toList(),
    );
  }

  Future<Map<String, dynamic>> _generateJson({
    required String prompt,
    required Map<String, dynamic> schema,
    required bool useExternalTools,
  }) async {
    if (!isConfigured) {
      throw const GeminiException('GEMINI_API_KEY chưa được cấu hình.');
    }
    final uri = Uri.https(
      'generativelanguage.googleapis.com',
      '/v1beta/models/$model:generateContent',
    );
    final request = <String, dynamic>{
      'contents': [
        {
          'role': 'user',
          'parts': [
            {'text': prompt},
          ],
        },
      ],
      if (useExternalTools)
        'tools': [
          {'url_context': <String, dynamic>{}},
          {'google_search': <String, dynamic>{}},
        ],
      'generationConfig': {
        'temperature': 0.25,
        'responseMimeType': 'application/json',
        'responseSchema': schema,
      },
    };

    late http.Response response;
    try {
      response = await _client
          .post(
            uri,
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': _apiKey,
            },
            body: jsonEncode(request),
          )
          .timeout(timeout);
    } on TimeoutException {
      throw const GeminiException('Gemini phản hồi quá thời gian.');
    } on http.ClientException catch (error) {
      throw GeminiException('Không thể kết nối Gemini: ${error.message}');
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw GeminiException(_apiError(response));
    }
    final payload = _decodeObject(response.body, 'Gemini response');
    final candidates = payload['candidates'];
    if (candidates is! List || candidates.isEmpty) {
      final feedback = payload['promptFeedback'];
      throw GeminiException('Gemini không tạo nội dung: $feedback');
    }
    final first = candidates.first;
    if (first is! Map) {
      throw const GeminiException('Gemini candidate không hợp lệ.');
    }
    final content = first['content'];
    if (content is! Map || content['parts'] is! List) {
      throw const GeminiException('Gemini không trả về text.');
    }
    final text = (content['parts'] as List)
        .whereType<Map>()
        .where((part) => part['thought'] != true && part['text'] is String)
        .map((part) => part['text'] as String)
        .join()
        .trim();
    if (text.isEmpty) {
      throw const GeminiException('Gemini trả về nội dung rỗng.');
    }
    return _decodeObject(_stripJsonFence(text), 'Gemini JSON');
  }

  String _apiError(http.Response response) {
    try {
      final body = jsonDecode(response.body);
      if (body is Map && body['error'] is Map) {
        final message = (body['error'] as Map)['message'];
        if (message is String && message.isNotEmpty) {
          return 'Gemini ${response.statusCode}: $message';
        }
      }
    } on FormatException {
      // Fall through to the status-only error; never include arbitrary HTML.
    }
    return 'Gemini request thất bại (${response.statusCode}).';
  }

  static Map<String, dynamic> _decodeObject(String value, String label) {
    try {
      final decoded = jsonDecode(value);
      if (decoded is Map) return Map<String, dynamic>.from(decoded);
    } on FormatException catch (error) {
      throw GeminiException('$label không phải JSON hợp lệ: ${error.message}');
    }
    throw GeminiException('$label phải là một object.');
  }

  static String _stripJsonFence(String value) {
    final trimmed = value.trim();
    if (!trimmed.startsWith('```')) return trimmed;
    return trimmed
        .replaceFirst(RegExp(r'^```(?:json)?\s*'), '')
        .replaceFirst(RegExp(r'\s*```$'), '')
        .trim();
  }

  static String _requiredString(Map<String, dynamic> json, String key) {
    final value = json[key];
    if (value is String && value.trim().isNotEmpty) return value.trim();
    throw GeminiException('Thiếu trường $key trong Gemini JSON.');
  }

  static List<String> _stringList(Object? value) => value is List
      ? value.whereType<String>().map((item) => item.trim()).where((item) {
          return item.isNotEmpty;
        }).toList()
      : const [];

  void close() => _client.close();
}

class GeminiNotebookSource {
  const GeminiNotebookSource({
    required this.title,
    required this.url,
    required this.summary,
  });

  final String title;
  final String url;
  final String summary;
}
