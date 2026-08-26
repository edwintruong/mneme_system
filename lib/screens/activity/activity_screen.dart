import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../widgets/figma_icon.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import '../notebook/ai_suggestions_screen.dart';

class ActivityScreen extends StatelessWidget {
  const ActivityScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 120),
        children: [
          Text('Hoạt động', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primarySoft,
                  child: FigmaIcon(FigmaAssets.ai, color: AppColors.primary),
                ),
                const SizedBox(height: 12),
                const Text(
                  'AI có gợi ý mới cho bạn',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
                ),
                const SizedBox(height: 6),
                const Text(
                  '2 video mới có thể bổ sung vào Figma Tips & Tricks',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppColors.muted),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: store.notebooks.isEmpty
                        ? null
                        : () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => AiSuggestionsScreen(
                                notebook: store.notebooks.first,
                              ),
                            ),
                          ),
                    child: const Text('Xem gợi ý'),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const SectionTitle('Đã lưu gần đây'),
          ...store.links.take(3).map((l) => LinkTile(link: l)),
        ],
      ),
    );
  }
}
