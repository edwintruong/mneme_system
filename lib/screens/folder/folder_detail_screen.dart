import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';

class FolderDetailScreen extends StatelessWidget {
  const FolderDetailScreen({super.key, required this.folder});
  final String folder;
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final links = store.links.where((l) => l.folder == folder).toList();
    return Scaffold(
      appBar: AppBar(
        title: Text(folder),
        centerTitle: true,
        actions: [
          PopupMenuButton(
            itemBuilder: (_) => const [
              PopupMenuItem(child: Text('Đổi tên')),
              PopupMenuItem(child: Text('Chỉnh sửa tag')),
              PopupMenuItem(child: Text('Chia sẻ')),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const SearchCard(),
          const SizedBox(height: 18),
          Row(
            children: [
              const Icon(
                Icons.folder_rounded,
                color: Color(0xFFB67BFF),
                size: 50,
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(folder, style: Theme.of(context).textTheme.titleLarge),
                  Text(
                    '${links.length} links',
                    style: const TextStyle(color: AppColors.muted),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 18),
          if (links.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: 100),
              child: Column(
                children: [
                  Icon(Icons.inbox_outlined, size: 64, color: AppColors.muted),
                  SizedBox(height: 16),
                  Text('Chưa có liên kết nào trong thư mục này'),
                ],
              ),
            )
          else
            ...links.map(
              (l) => Dismissible(
                key: ValueKey(l.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.all(20),
                  color: Colors.red,
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                confirmDismiss: (_) => showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Delete'),
                    content: const Text(
                      "This link will be permanently deleted. This action can't be undone.",
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      FilledButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete Link'),
                      ),
                    ],
                  ),
                ),
                onDismissed: (_) => store.deleteLink(l.id),
                child: LinkTile(link: l),
              ),
            ),
        ],
      ),
    );
  }
}
