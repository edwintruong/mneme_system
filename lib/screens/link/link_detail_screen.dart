import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import 'edit_link_screen.dart';

class LinkDetailScreen extends StatelessWidget {
  const LinkDetailScreen({super.key, required this.link});
  final SavedLink link;
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            onPressed: () => showModalBottomSheet<void>(
              context: context,
              builder: (_) => const SafeArea(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.share_outlined,
                        size: 34,
                        color: AppColors.primary,
                      ),
                      SizedBox(height: 14),
                      Text(
                        'Chia sẻ liên kết',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Đã tạo bản xem trước để showcase luồng chia sẻ.',
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            icon: const Icon(Icons.share_outlined),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: FilledButton(
                onPressed: () => ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('Mở link demo'))),
                child: const Text('Mở Link'),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              width: 48,
              height: 48,
              decoration: const BoxDecoration(
                color: AppColors.primarySoft,
                shape: BoxShape.circle,
              ),
              child: PopupMenuButton<String>(
                icon: const Icon(Icons.more_horiz, color: AppColors.primary),
                onSelected: (value) async {
                  if (value == 'edit') {
                    final changed = await Navigator.push<bool>(
                      context,
                      MaterialPageRoute(
                        builder: (_) => EditLinkScreen(link: link),
                      ),
                    );
                    if (changed == true && context.mounted) {
                      Navigator.pop(context);
                    }
                  } else if (value == 'favorite') {
                    await store.toggleFavorite(link);
                    if (context.mounted) Navigator.pop(context);
                  } else if (value == 'delete') {
                    final confirmed =
                        await showDialog<bool>(
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
                        ) ??
                        false;
                    if (confirmed) {
                      await store.deleteLink(link.id);
                      if (context.mounted) Navigator.pop(context);
                    }
                  }
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(value: 'edit', child: Text('Chỉnh sửa')),
                  PopupMenuItem(
                    value: 'favorite',
                    child: Text(link.favorite ? 'Bỏ yêu thích' : 'Yêu thích'),
                  ),
                  const PopupMenuItem(value: 'delete', child: Text('Xóa')),
                ],
              ),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.asset(
              'assets/images/link_hero.png',
              height: 164,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        link.title,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                    Icon(
                      link.favorite ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: AppColors.surfaceMuted, width: 2),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          link.url,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const Icon(Icons.copy_outlined),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                Text(link.summary),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    const Tag('Design', primary: true),
                    Tag(link.folder),
                    const Tag('Figma', primary: true),
                    const CircleAvatar(
                      radius: 16,
                      backgroundColor: AppColors.primary,
                      child: Icon(Icons.add, color: Colors.white, size: 18),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    const Icon(Icons.layers_outlined),
                    const SizedBox(width: 10),
                    const Expanded(child: Text('Nguồn')),
                    const Icon(Icons.play_circle, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(link.source),
                  ],
                ),
                const SizedBox(height: 14),
                const Row(
                  children: [
                    Icon(Icons.schedule),
                    SizedBox(width: 10),
                    Expanded(child: Text('Đã lưu')),
                    Text('2 giờ trước'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
