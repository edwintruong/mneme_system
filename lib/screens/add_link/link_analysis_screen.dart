import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/mneme_store.dart';
import '../../state/store_scope.dart';

class LinkAnalysisScreen extends StatefulWidget {
  const LinkAnalysisScreen({
    super.key,
    required this.url,
    required this.category,
    required this.folder,
  });
  final String url, category, folder;
  @override
  State<LinkAnalysisScreen> createState() => _LinkAnalysisScreenState();
}

class _LinkAnalysisScreenState extends State<LinkAnalysisScreen> {
  int completed = 0;
  late MnemeStore store;
  static const steps = [
    'Đọc metadata và nội dung',
    'Nhận diện chủ đề',
    'Đề xuất category',
    'Gắn tag phù hợp',
    'Lưu vào thư viện',
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    store = StoreScope.of(context);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _analyze());
  }

  Future<void> _analyze() async {
    for (var i = 1; i <= steps.length; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 360));
      if (!mounted) return;
      setState(() => completed = i);
    }
    await store.addLink(
      url: widget.url,
      category: widget.category,
      folder: widget.folder,
    );
    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('AI đã phân loại và lưu liên kết')),
      );
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('AI đang phân tích'), centerTitle: true),
    body: Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 30),
          Image.asset(
            'assets/images/add_preview.png',
            width: 160,
            height: 160,
            fit: BoxFit.contain,
          ),
          const SizedBox(height: 24),
          const Text(
            'Share vào → AI tự sắp xếp',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          const Text(
            'Mneme đang đọc, phân loại và gắn tag cho nội dung của bạn.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.muted),
          ),
          const SizedBox(height: 28),
          ...List.generate(
            steps.length,
            (i) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                children: [
                  Icon(
                    i < completed
                        ? Icons.check_circle
                        : i == completed
                        ? Icons.sync
                        : Icons.circle_outlined,
                    color: i < completed
                        ? AppColors.success
                        : AppColors.primary,
                  ),
                  const SizedBox(width: 12),
                  Text(steps[i]),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          LinearProgressIndicator(
            value: completed / steps.length,
            minHeight: 7,
            borderRadius: BorderRadius.circular(8),
            color: AppColors.primary,
            backgroundColor: AppColors.primarySoft,
          ),
        ],
      ),
    ),
  );
}
