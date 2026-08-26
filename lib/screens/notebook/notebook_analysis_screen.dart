import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/figma_icon.dart';
import 'notebook_detail_screen.dart';

class NotebookAnalysisScreen extends StatefulWidget {
  const NotebookAnalysisScreen({super.key, required this.selectedCount});
  final int selectedCount;
  @override
  State<NotebookAnalysisScreen> createState() => _NotebookAnalysisScreenState();
}

class _NotebookAnalysisScreenState extends State<NotebookAnalysisScreen> {
  int completed = 0;
  static const steps = [
    'Đọc nội dung đã chọn',
    'Nhận diện chủ đề chính',
    'Xây dựng mục lục',
    'Tóm tắt từng phần',
    'Hoàn thiện sổ tay',
  ];

  @override
  void initState() {
    super.initState();
    _runAnalysis();
  }

  Future<void> _runAnalysis() async {
    for (var i = 1; i <= steps.length; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 420));
      if (!mounted) return;
      setState(() => completed = i);
    }
    final notebook = await StoreScope.of(context)
        .addNotebook('Figma Tips & Tricks');
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => NotebookDetailScreen(notebook: notebook),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      leading: const FigmaBackButton(),
      title: const Text('Tạo sổ tay mới'),
      centerTitle: true,
    ),
    body: Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 16),
          Image.asset(
            'assets/images/create_sources.png',
            width: 160,
            height: 160,
          ),
          const SizedBox(height: 16),
          const Text(
            'AI đang phân tích nội dung',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            '${widget.selectedCount} nguồn đã được chọn',
            style: const TextStyle(color: AppColors.muted),
          ),
          const SizedBox(height: 26),
          ...List.generate(
            steps.length,
            (i) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 5),
              child: Row(
                children: [
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: FigmaAnalysisStatus(
                      key: ValueKey(i < completed),
                      done: i < completed,
                      inProgress: i == completed,
                      size: 22,
                    ),
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
            borderRadius: BorderRadius.circular(10),
            color: AppColors.primary,
            backgroundColor: AppColors.primarySoft,
          ),
        ],
      ),
    ),
  );
}
