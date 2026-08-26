import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../../widgets/common.dart';

class AiSuggestionsScreen extends StatefulWidget {
  const AiSuggestionsScreen({super.key, required this.notebook});
  final Notebook notebook;
  @override
  State<AiSuggestionsScreen> createState() => _AiSuggestionsScreenState();
}

class _AiSuggestionsScreenState extends State<AiSuggestionsScreen> {
  bool added = false;
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFF2E1442),
    appBar: AppBar(foregroundColor: Colors.white),
    body: ListView(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      children: [
        Row(
          children: [
            MnemeImage(widget.notebook.image, size: 58),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.notebook.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 18,
                    ),
                  ),
                  Text(
                    widget.notebook.description,
                    maxLines: 2,
                    style: const TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 28),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Expanded(
                    child: Text(
                      'Video đề xuất',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  Text('Độ phù hợp ↓'),
                ],
              ),
              const SizedBox(height: 18),
              const _SuggestionTile(),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Vì sao AI đề xuất ?',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    _Reason('Nội dung đề cập đến Auto Layout'),
                    _Reason('Liên quan đến Constraint và Variants'),
                    _Reason('Bổ sung kiến thức'),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: added ? null : () => setState(() => added = true),
                  child: Text(added ? 'Đã thêm vào sổ tay' : 'Thêm vào sổ tay'),
                ),
              ),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {},
                  child: const Text('Chọn sổ tay khác'),
                ),
              ),
              Center(
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Bỏ qua',
                    style: TextStyle(color: AppColors.ink),
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

class _SuggestionTile extends StatelessWidget {
  const _SuggestionTile();
  @override
  Widget build(BuildContext context) => const Row(
    children: [
      MnemeImage('assets/images/suggestion.png', size: 80),
      SizedBox(width: 10),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Figma Tips & Tricks',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
            ),
            Text('TikTok · @abcdef', style: TextStyle(color: AppColors.muted)),
            Text(
              'https://chatgpt.com/',
              style: TextStyle(decoration: TextDecoration.underline),
            ),
          ],
        ),
      ),
      Column(
        children: [
          Text(
            '95%',
            style: TextStyle(
              color: AppColors.success,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
          Text(
            'Phù hợp',
            style: TextStyle(color: AppColors.success, fontSize: 12),
          ),
        ],
      ),
    ],
  );
}

class _Reason extends StatelessWidget {
  const _Reason(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 12),
    child: Row(
      children: [
        const Icon(Icons.check_circle, color: AppColors.success, size: 17),
        const SizedBox(width: 12),
        Expanded(child: Text(text)),
      ],
    ),
  );
}
