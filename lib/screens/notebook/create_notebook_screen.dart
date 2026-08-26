import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import 'notebook_detail_screen.dart';

class CreateNotebookScreen extends StatelessWidget {
  const CreateNotebookScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      backgroundColor: AppColors.primary,
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text('Tạo sổ tay mới'),
        centerTitle: true,
      ),
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
        ),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(18, 52, 18, 24),
          children: [
            Image.asset('assets/images/create_sources.png', height: 92),
            const SizedBox(height: 36),
            const Text(
              'Chọn nguồn để tạo sổ tay',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            const Text(
              'AI sẽ tổng hợp nội dung từ các nguồn bạn chọn\nthành một sổ tay có cấu trúc',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.muted),
            ),
            const SizedBox(height: 26),
            _SourceCard(
              image: 'assets/images/create_sources.png',
              title: 'Tạo từ các nội dung đã chọn',
              subtitle:
                  'Chọn nhiều video, bài viết hoặc website để AI tổng hợp',
              onTap: () => _create(context, store),
            ),
            const SizedBox(height: 16),
            _SourceCard(
              image: 'assets/images/create_folder.png',
              title: 'Tạo từ một folder lớn',
              subtitle: 'Chọn một folder từ category. AI sẽ tổng hợp toàn bộ nội dung bên trong',
              onTap: () => _create(context, store),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _create(BuildContext context, dynamic store) async {
    final notebook = await store.addNotebook('Figma Tips & Tricks');
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => NotebookDetailScreen(notebook: notebook),
        ),
      );
    }
  }
}

class _SourceCard extends StatelessWidget {
  const _SourceCard({
    required this.image,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });
  final String image, title, subtitle;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Image.asset(image, width: 56, height: 56, fit: BoxFit.contain),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    ),
  );
}
