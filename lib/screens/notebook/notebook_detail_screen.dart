import 'package:flutter/material.dart';

import '../../models/app_models.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';
import 'ai_suggestions_screen.dart';

class NotebookDetailScreen extends StatelessWidget {
  const NotebookDetailScreen({super.key, required this.notebook});
  final Notebook notebook;
  static const _fallbackSections = [
    NotebookSection(
      title: 'Tổng quan',
      body: 'Sổ tay này tổng hợp các ý chính từ những nguồn đã chọn.',
    ),
    NotebookSection(
      title: 'Các ý quan trọng',
      body: 'Mở từng nguồn để xem thêm ví dụ và chi tiết triển khai.',
    ),
  ];
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      leading: const FigmaBackButton(),
      actions: [
        IconButton(
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AiSuggestionsScreen(notebook: notebook),
            ),
          ),
          icon: const FigmaIcon(FigmaAssets.moreHorizontal),
        ),
      ],
    ),
    bottomNavigationBar: SafeArea(
      minimum: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const FigmaIcon(FigmaAssets.share),
              label: const Text('Chia sẻ'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: FilledButton.icon(
              onPressed: () {},
              icon: const FigmaIcon(FigmaAssets.openBook),
              label: const Text('Xem sổ tay'),
            ),
          ),
        ],
      ),
    ),
    body: ListView(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 18),
      children: [
        Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF3A124F), Color(0xFF18122B)],
            ),
            borderRadius: BorderRadius.circular(28),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  MnemeImage(notebook.image, size: 85, radius: 20),
                  const Spacer(),
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .16),
                      shape: BoxShape.circle,
                    ),
                    child: const FigmaIcon(
                      FigmaAssets.star,
                      color: Colors.amber,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                notebook.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 24,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${notebook.itemCount} nguồn · notebook tổng hợp',
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 8),
              Text(
                notebook.description,
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 10),
              const Row(
                children: [
                  FigmaIcon(FigmaAssets.ai, size: 18, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    'Tạo bởi AI 2/2/2022',
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        const DefaultTabController(
          length: 2,
          child: TabBar(
            tabs: [
              Tab(text: 'Mục lục'),
              Tab(text: 'Thông tin'),
            ],
          ),
        ),
        const SizedBox(height: 8),
        ...(notebook.sections.isEmpty ? _fallbackSections : notebook.sections)
            .asMap()
            .entries
            .map(
              (entry) => ExpansionTile(
                tilePadding: const EdgeInsets.symmetric(horizontal: 20),
                trailing: const FigmaIcon(FigmaAssets.dropdown),
                title: Text(
                  '${entry.key + 1}.  ${entry.value.title}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 18),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(entry.value.body),
                    ),
                  ),
                ],
              ),
            ),
      ],
    ),
  );
}
