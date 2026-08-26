import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';

class EditLinkScreen extends StatefulWidget {
  const EditLinkScreen({super.key, required this.link});
  final SavedLink link;
  @override
  State<EditLinkScreen> createState() => _EditLinkScreenState();
}

class _EditLinkScreenState extends State<EditLinkScreen> {
  late final TextEditingController title = TextEditingController(
    text: widget.link.title,
  );
  late String folder = widget.link.folder;

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chỉnh sửa liên kết'),
        centerTitle: true,
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(16),
        child: FilledButton(
          onPressed: () async {
            await store.updateLink(
              id: widget.link.id,
              title: title.text.trim(),
              folder: folder,
            );
            if (context.mounted) Navigator.pop(context, true);
          },
          child: const Text('Lưu thay đổi'),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            children: [
              MnemeImage(widget.link.image, size: 80),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  widget.link.url,
                  maxLines: 3,
                  style: const TextStyle(color: AppColors.muted),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Tên liên kết',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          TextField(controller: title),
          const SizedBox(height: 20),
          const Text('Folder', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: folder,
            items: store.folders
                .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                .toList(),
            onChanged: (value) => setState(() => folder = value ?? folder),
          ),
          const SizedBox(height: 20),
          const Text('Tags', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              Tag('Design', primary: true),
              Tag('UI/UX'),
              Tag('Figma', primary: true),
              CircleAvatar(
                radius: 16,
                backgroundColor: AppColors.primarySoft,
                child: Icon(Icons.add, color: AppColors.primary, size: 18),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
