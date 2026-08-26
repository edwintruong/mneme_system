import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import '../folder/category_screen.dart';
import '../search/search_screen.dart';
import '../notebook/create_notebook_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 120),
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Xin chào, echs',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              const MnemeImage(
                'assets/images/avatar.png',
                size: 36,
                radius: 18,
              ),
            ],
          ),
          const SizedBox(height: 16),
          SearchCard(
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SearchScreen()),
            ),
          ),
          const SizedBox(height: 12),
          Material(
            color: AppColors.primarySoft,
            borderRadius: BorderRadius.circular(18),
            child: InkWell(
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreateNotebookScreen()),
              ),
              borderRadius: BorderRadius.circular(18),
              child: const Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      child: Icon(Icons.auto_awesome),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bạn đã lưu đủ nội dung về UI/UX',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                          SizedBox(height: 3),
                          Text(
                            'Tạo sổ tay để biến link rời rạc thành tri thức',
                            style: TextStyle(
                              color: AppColors.muted,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_right, color: AppColors.primary),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x0F000000),
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const FilterChips(),
                const SizedBox(height: 20),
                const SectionTitle('Đã lưu gần đây'),
                const SizedBox(height: 10),
                SizedBox(
                  height: 132,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: store.categories.take(3).length,
                    separatorBuilder: (_, _) => const SizedBox(width: 10),
                    itemBuilder: (_, i) => SizedBox(
                      width: 100,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          MnemeImage(
                            i == 0
                                ? 'assets/images/recent.png'
                                : store.categories[i].image,
                            size: 100,
                            radius: 18,
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Design',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                const SectionTitle('Categories'),
                const SizedBox(height: 4),
                ...store.categories.map(
                  (category) => InkWell(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CategoryScreen(category: category),
                      ),
                    ),
                    borderRadius: BorderRadius.circular(16),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 5),
                      child: Row(
                        children: [
                          MnemeImage(category.image),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  category.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 16,
                                  ),
                                ),
                                Text(
                                  '${category.itemCount} mục',
                                  style: const TextStyle(
                                    color: AppColors.muted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.chevron_right,
                            color: AppColors.muted,
                          ),
                        ],
                      ),
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
}
