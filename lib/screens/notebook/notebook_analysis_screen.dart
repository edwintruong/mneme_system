import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../../state/mneme_store.dart';
import '../../state/store_scope.dart';
import '../../widgets/figma_icon.dart';
import 'notebook_detail_screen.dart';

class NotebookAnalysisScreen extends StatefulWidget {
  const NotebookAnalysisScreen({super.key, required this.selectedIds});
  final List<int> selectedIds;
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
    final creation = StoreScope.of(context).addNotebook(widget.selectedIds);
    for (var i = 1; i < steps.length; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 420));
      if (!mounted) return;
      setState(() => completed = i);
    }
    late AiExecutionResult<Notebook> result;
    try {
      result = await creation;
    } on Object catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Không thể tạo notebook: $error')));
      return;
    }
    if (!mounted) return;
    setState(() => completed = steps.length);
    await Future<void>.delayed(const Duration(milliseconds: 240));
    if (mounted) {
      final messenger = ScaffoldMessenger.of(context);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => NotebookDetailScreen(notebook: result.value),
        ),
      );
      messenger.showSnackBar(
        SnackBar(
          content: Text(
            result.usedGemini
                ? 'Gemini đã tổng hợp và viết notebook'
                : 'Đã tạo notebook demo local (${result.fallbackReason})',
          ),
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
            '${widget.selectedIds.length} nguồn đã được chọn',
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
