import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import 'create_notebook_screen.dart';
import 'notebook_detail_screen.dart';

class NotebookScreen extends StatelessWidget {
  const NotebookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 14, 20, 120),
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Sổ tay',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              FilledButton.icon(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const CreateNotebookScreen(),
                  ),
                ),
                icon: const Icon(Icons.add_circle_outline),
                label: const Text('Tạo sổ tay'),
              ),
            ],
          ),
          const SizedBox(height: 64),
          const SearchCard(),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionTitle('Gần đây'),
                const SizedBox(height: 10),
                SizedBox(
                  height: 135,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: store.notebooks.length.clamp(0, 3),
                    separatorBuilder: (_, _) => const SizedBox(width: 12),
                    itemBuilder: (_, i) =>
                        _RecentNotebook(image: store.notebooks[i].image),
                  ),
                ),
                const SizedBox(height: 18),
                const SectionTitle('Sổ tay của bạn hết toàn năng'),
                ...store.notebooks.map(
                  (notebook) => ListTile(
                    contentPadding: const EdgeInsets.symmetric(vertical: 5),
                    leading: MnemeImage(notebook.image, size: 80),
                    title: Text(
                      notebook.title,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      '${notebook.itemCount} mục',
                      style: const TextStyle(color: AppColors.muted),
                    ),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            NotebookDetailScreen(notebook: notebook),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RecentNotebook extends StatelessWidget {
  const _RecentNotebook({required this.image});
  final String image;
  @override
  Widget build(BuildContext context) => SizedBox(
    width: 100,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Stack(
          alignment: Alignment.bottomRight,
          children: [
            MnemeImage(image, size: 100, radius: 18),
            Container(
              margin: const EdgeInsets.all(5),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.ink.withValues(alpha: .7),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                '17 video',
                style: TextStyle(fontSize: 9, color: Colors.white),
              ),
            ),
          ],
        ),
        const SizedBox(height: 7),
        const Text('Design', style: TextStyle(fontWeight: FontWeight.w600)),
      ],
    ),
  );
}
