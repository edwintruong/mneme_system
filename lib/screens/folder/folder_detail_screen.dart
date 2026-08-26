import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../../state/store_scope.dart';
import '../../state/mneme_store.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';

class FolderDetailScreen extends StatefulWidget {
  const FolderDetailScreen({super.key, required this.folder});
  final String folder;
  @override
  State<FolderDetailScreen> createState() => _FolderDetailScreenState();
}

class _FolderDetailScreenState extends State<FolderDetailScreen> {
  final selected = <int>{};
  bool get selecting => selected.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final links = store.links.where((l) => l.folder == widget.folder).toList();
    return Scaffold(
      appBar: AppBar(
        leading: selecting
            ? IconButton(
                onPressed: () => setState(selected.clear),
                icon: const FigmaIcon(FigmaAssets.close),
              )
            : const FigmaBackButton(),
        title: Text(selecting ? '${selected.length} đã chọn' : widget.folder),
        centerTitle: true,
        actions: selecting
            ? [
                IconButton(
                  onPressed: () => setState(() {
                    if (selected.length == links.length) {
                      selected.clear();
                    } else {
                      selected.addAll(links.map((e) => e.id));
                    }
                  }),
                  icon: const FigmaIcon(FigmaAssets.radioSelected),
                ),
              ]
            : [
                PopupMenuButton(
                  icon: const FigmaIcon(FigmaAssets.folderMore),
                  itemBuilder: (_) => const [
                    PopupMenuItem(child: Text('Đổi tên')),
                    PopupMenuItem(child: Text('Chỉnh sửa tag')),
                    PopupMenuItem(child: Text('Chia sẻ')),
                  ],
                ),
              ],
      ),
      floatingActionButton: selecting
          ? null
          : FloatingActionButton(
              onPressed: () {},
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              child: const FigmaIcon(FigmaAssets.plus, color: Colors.white),
            ),
      bottomNavigationBar: selecting
          ? SafeArea(
              minimum: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _move(context, store),
                      icon: const FigmaIcon(FigmaAssets.moveFolder),
                      label: const Text('Thêm vào folder'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: FilledButton.icon(
                      onPressed: () => _delete(context, store),
                      icon: const FigmaIcon(FigmaAssets.delete),
                      label: const Text('Xóa'),
                    ),
                  ),
                ],
              ),
            )
          : null,
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const SearchCard(),
          const SizedBox(height: 18),
          Row(
            children: [
              const MnemeImage(
                'assets/images/folder_design.png',
                size: 50,
                radius: 12,
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.folder,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
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
                  FigmaIcon(FigmaAssets.openBook, size: 64),
                  SizedBox(height: 16),
                  Text('Chưa có liên kết nào trong thư mục này'),
                ],
              ),
            )
          else
            ...links.map(
              (link) => _SelectableLink(
                link: link,
                selected: selected.contains(link.id),
                onToggle: () => setState(
                  () => selected.contains(link.id)
                      ? selected.remove(link.id)
                      : selected.add(link.id),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _move(BuildContext context, MnemeStore store) async {
    final folder = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              'Thêm vào folder',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            ...store.folders.map<Widget>(
              (f) => ListTile(
                leading: const MnemeImage(
                  'assets/images/folder_design.png',
                  size: 36,
                  radius: 9,
                ),
                title: Text(f),
                onTap: () => Navigator.pop(context, f),
              ),
            ),
          ],
        ),
      ),
    );
    if (folder != null) {
      await store.moveLinks(selected, folder);
      setState(selected.clear);
    }
  }

  Future<void> _delete(BuildContext context, MnemeStore store) async {
    final ok =
        await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Delete'),
            content: Text(
              '${selected.length} link sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Delete Selected Link'),
              ),
            ],
          ),
        ) ??
        false;
    if (ok) {
      await store.deleteLinks(selected);
      setState(selected.clear);
    }
  }
}

class _SelectableLink extends StatelessWidget {
  const _SelectableLink({
    required this.link,
    required this.selected,
    required this.onToggle,
  });
  final SavedLink link;
  final bool selected;
  final VoidCallback onToggle;
  @override
  Widget build(BuildContext context) => GestureDetector(
    onLongPress: onToggle,
    child: Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: selected ? AppColors.primarySoft : Colors.transparent,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          if (selected)
            const Padding(
              padding: EdgeInsets.only(right: 6),
              child: FigmaIcon(FigmaAssets.radioSelected),
            ),
          Expanded(
            child: IgnorePointer(
              ignoring: selected,
              child: LinkTile(link: link),
            ),
          ),
        ],
      ),
    ),
  );
}
