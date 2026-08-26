import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import 'link_analysis_screen.dart';

class AddLinkScreen extends StatefulWidget {
  const AddLinkScreen({super.key});
  @override
  State<AddLinkScreen> createState() => _AddLinkScreenState();
}

class _AddLinkScreenState extends State<AddLinkScreen> {
  final controller = TextEditingController(
    text: 'https://www.youtube.com/watch?v=design-system',
  );
  String folder = 'UI/UX';
  bool saving = false;
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Thêm liên kết'), centerTitle: true),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(16),
        child: FilledButton(
          onPressed: saving
              ? null
              : () {
                  setState(() => saving = true);
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => LinkAnalysisScreen(
                        url: controller.text,
                        category: 'Design',
                        folder: folder,
                      ),
                    ),
                  );
                },
          child: Text(saving ? 'Đang phân tích...' : 'Lưu liên kết'),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text('Liên kết', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.link),
              suffixIcon: Icon(Icons.close),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [
                BoxShadow(color: Color(0x0F000000), blurRadius: 6),
              ],
            ),
            child: const Row(
              children: [
                MnemeImage('assets/images/add_preview.png', size: 80),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'How to build a design system',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      Text(
                        'Vorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        maxLines: 2,
                      ),
                      Text(
                        'figma.com',
                        style: TextStyle(color: AppColors.muted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Categories*',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.primarySoft, width: 2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                MnemeImage('assets/images/figma.png', size: 60),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Design',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Tag('Đề xuất bởi AI', primary: true),
                    ],
                  ),
                ),
                Icon(Icons.keyboard_arrow_down),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Folder', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: folder,
            items: store.folders
                .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                .toList(),
            onChanged: (v) => setState(() => folder = v ?? folder),
          ),
        ],
      ),
    );
  }
}
