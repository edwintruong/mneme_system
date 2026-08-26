import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';
import 'notebook_analysis_screen.dart';

class SelectSourcesScreen extends StatefulWidget {
  const SelectSourcesScreen({super.key, this.fromFolder = false});
  final bool fromFolder;
  @override
  State<SelectSourcesScreen> createState() => _SelectSourcesScreenState();
}

class _SelectSourcesScreenState extends State<SelectSourcesScreen> {
  final selected = <int>{};
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      appBar: AppBar(
        leading: const FigmaBackButton(),
        title: const Text('Tạo sổ tay mới'),
        centerTitle: true,
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(20),
        child: FilledButton(
          onPressed: selected.isEmpty
              ? null
              : () => Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        NotebookAnalysisScreen(selectedCount: selected.length),
                  ),
                ),
          child: Text('Tiếp tục (${selected.length})'),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
        children: [
          const SearchCard(),
          const SizedBox(height: 16),
          const FilterChips(),
          const SizedBox(height: 18),
          Text(
            widget.fromFolder
                ? 'Chọn nội dung trong folder'
                : 'Chọn các nội dung để tổng hợp',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          ...store.links.map(
            (link) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: selected.contains(link.id)
                    ? Border.all(color: AppColors.primary, width: 2)
                    : null,
              ),
              child: InkWell(
                onTap: () => setState(
                  () => selected.contains(link.id)
                      ? selected.remove(link.id)
                      : selected.add(link.id),
                ),
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      FigmaIcon(
                        selected.contains(link.id)
                            ? FigmaAssets.radioSelected
                            : FigmaAssets.radio,
                      ),
                      const SizedBox(width: 10),
                      MnemeImage(link.image, size: 68, radius: 13),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(link.title, maxLines: 2),
                            const SizedBox(height: 6),
                            Text(
                              '${link.source} · ${link.folder}',
                              style: const TextStyle(color: AppColors.muted),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
