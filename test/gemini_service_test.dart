import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mneme/services/gemini_service.dart';

void main() {
  test('analyzeUrl uses Gemini tools and parses structured JSON', () async {
    late http.Request captured;
    final client = MockClient((request) async {
      captured = request;
      return http.Response(
        jsonEncode({
          'candidates': [
            {
              'content': {
                'parts': [
                  {
                    'text': jsonEncode({
                      'title': 'Auto Layout thực chiến',
                      'summary': 'Tóm tắt nội dung từ URL.',
                      'category': 'Design',
                      'folder': 'UI/UX',
                      'source': 'Website',
                      'tags': ['Figma', 'Auto Layout'],
                    }),
                  },
                ],
              },
            },
          ],
        }),
        200,
        headers: {'content-type': 'application/json'},
      );
    });
    final service = GeminiService(apiKey: 'test-key', client: client);

    final result = await service.analyzeUrl(
      url: 'https://example.com/figma',
      suggestedCategory: 'Design',
      suggestedFolder: 'UI/UX',
    );

    expect(result.title, 'Auto Layout thực chiến');
    expect(result.tags, ['Figma', 'Auto Layout']);
    expect(captured.headers['x-goog-api-key'], 'test-key');
    expect(captured.url.query, isEmpty);
    final body = jsonDecode(captured.body) as Map<String, dynamic>;
    expect(body['tools'], [
      {'url_context': <String, dynamic>{}},
      {'google_search': <String, dynamic>{}},
    ]);
    final config = body['generationConfig'] as Map<String, dynamic>;
    expect(config['responseMimeType'], 'application/json');
    expect(config['responseSchema'], isA<Map<String, dynamic>>());
    service.close();
  });

  test('missing API key fails before making a network request', () async {
    var requested = false;
    final service = GeminiService(
      apiKey: '',
      client: MockClient((_) async {
        requested = true;
        return http.Response('{}', 200);
      }),
    );

    await expectLater(
      service.analyzeUrl(
        url: 'https://example.com',
        suggestedCategory: 'Design',
        suggestedFolder: 'UI/UX',
      ),
      throwsA(isA<GeminiException>()),
    );
    expect(requested, isFalse);
    service.close();
  });

  test('createNotebook parses persisted section content', () async {
    final service = GeminiService(
      apiKey: 'test-key',
      client: MockClient((request) async {
        expect(request.body, contains('https://example.com/source'));
        return http.Response(
          jsonEncode({
            'candidates': [
              {
                'content': {
                  'parts': [
                    {
                      'text': jsonEncode({
                        'title': 'Notebook Design System',
                        'description': 'Tổng hợp kiến thức thiết kế.',
                        'sections': [
                          {
                            'title': 'Nền tảng',
                            'body': 'Nội dung nền tảng đã được tổng hợp.',
                          },
                          {
                            'title': 'Thực hành',
                            'body': 'Các bước thực hành từ nguồn.',
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      }),
    );

    final notebook = await service.createNotebook(
      sources: const [
        GeminiNotebookSource(
          title: 'Nguồn',
          url: 'https://example.com/source',
          summary: 'Tóm tắt local',
        ),
      ],
    );

    expect(notebook.title, 'Notebook Design System');
    expect(notebook.sections, hasLength(2));
    expect(notebook.sections.last.title, 'Thực hành');
    service.close();
  });
}
