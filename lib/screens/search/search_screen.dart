import 'package:flutter/material.dart';

import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';
import '../../models/app_models.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String query = '';
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final results = store.links
        .where((link) => _semanticMatch(link, query))
        .toList();
    return Scaffold(
      appBar: AppBar(
        leading: const FigmaBackButton(),
        title: const Text('Tìm kiếm'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            autofocus: true,
            onChanged: (v) => setState(() => query = v),
            decoration: const InputDecoration(
              prefixIcon: Center(
                widthFactor: 1,
                child: FigmaIcon(FigmaAssets.search, size: 16),
              ),
              hintText: 'Tìm link, folder hoặc category...',
            ),
          ),
          const SizedBox(height: 18),
          if (query.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                results.isEmpty
                    ? 'Không tìm thấy nội dung phù hợp'
                    : 'Mneme hiểu ý bạn và tìm thấy ${results.length} kết quả',
              ),
            ),
          ...results.map((link) => LinkTile(link: link)),
        ],
      ),
    );
  }

  bool _semanticMatch(SavedLink link, String rawQuery) {
    final query = rawQuery.toLowerCase().trim();
    if (query.isEmpty) return true;
    final haystack =
        '${link.title} ${link.summary} ${link.folder} ${link.category} ${link.source}'
            .toLowerCase();
    final terms = query.split(RegExp(r'\s+')).where((term) => term.length > 2);
    if (terms.any(haystack.contains)) {
      return true;
    }
    const concepts = {
      'recipe': ['bánh', 'nồi chiên', 'công thức', 'nấu', 'đồ ăn'],
      'design': ['figma', 'auto layout', 'ui', 'ux', 'thiết kế', 'component'],
      'travel': ['du lịch', 'địa điểm', 'chuyến đi'],
    };
    for (final entry in concepts.entries) {
      if (entry.value.any(query.contains)) {
        if (entry.key == 'recipe' &&
            (haystack.contains('bánh') || haystack.contains('ẩm thực'))) {
          return true;
        }
        if (entry.key == 'design' &&
            (haystack.contains('figma') || haystack.contains('design'))) {
          return true;
        }
        if (entry.key == 'travel' && haystack.contains('travel')) {
          return true;
        }
      }
    }
    return false;
  }
}
