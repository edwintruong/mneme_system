import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../core/theme/figma_tokens.dart';
import '../../state/store_scope.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';
import '../folder/category_screen.dart';
import '../search/search_screen.dart';

const _home2159ImageRoot = 'assets/images/figma_2159';

const _home2159Recents = [
  (
    image: '$_home2159ImageRoot/2159_12771_recent_crepe.png',
    title: 'Công thức bánh crepe',
  ),
  (
    image: '$_home2159ImageRoot/2159_12771_recent_prompt.png',
    title: 'Tối ưu prompt AI',
  ),
  (
    image: '$_home2159ImageRoot/2159_12771_recent_movie.png',
    title: 'Phim hay mùa hè 2026',
  ),
];

const _home2159Categories = [
  (
    image: '$_home2159ImageRoot/2159_12771_category_study.png',
    title: 'Học tập & Công việc',
    count: 24,
  ),
  (
    image: '$_home2159ImageRoot/2159_12771_category_travel.png',
    title: 'Du lịch',
    count: 10,
  ),
  (
    image: '$_home2159ImageRoot/2159_12771_category_movie.png',
    title: 'Phim ảnh',
    count: 10,
  ),
  (
    image: '$_home2159ImageRoot/2159_12771_category_cake.png',
    title: 'Công thức bánh',
    count: 10,
  ),
];

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    this.showAddedToast = false,
    this.onOpenAddedLink,
  });

  final bool showAddedToast;
  final VoidCallback? onOpenAddedLink;

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return SafeArea(
      child: Stack(
        children: [
          Positioned.fill(
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
                    Container(
                      width: 36,
                      height: 36,
                      padding: const EdgeInsets.all(1.385),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE5E5EA),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: const MnemeImage(
                        '$_home2159ImageRoot/2159_12771_avatar.png',
                        size: 33.23,
                        radius: 16.615,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SearchCard(
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SearchScreen()),
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 20,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(FigmaRadii.card),
                    boxShadow: FigmaShadows.card,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const FilterChips(),
                      const SizedBox(height: 20),
                      const SectionTitle('Đã lưu gần đây'),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          for (var i = 0; i < _home2159Recents.length; i++) ...[
                            Expanded(
                              child: _Recent2159(item: _home2159Recents[i]),
                            ),
                            if (i != _home2159Recents.length - 1)
                              const SizedBox(width: 12),
                          ],
                        ],
                      ),
                      const SizedBox(height: 20),
                      const SectionTitle('Categories'),
                      const SizedBox(height: 10),
                      for (var i = 0; i < _home2159Categories.length; i++) ...[
                        InkWell(
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  CategoryScreen(category: store.categories[i]),
                            ),
                          ),
                          borderRadius: BorderRadius.circular(15),
                          child: _Category2159(
                            item: _home2159Categories[i],
                            showMore: i == _home2159Categories.length - 1,
                          ),
                        ),
                        if (i != _home2159Categories.length - 1)
                          const SizedBox(height: 10),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (showAddedToast)
            Positioned(
              left: 20,
              right: 19,
              top: 602,
              height: 85,
              child: _HomeAddedToast2159(onOpen: onOpenAddedLink),
            ),
        ],
      ),
    );
  }
}

class _HomeAddedToast2159 extends StatelessWidget {
  const _HomeAddedToast2159({this.onOpen});

  final VoidCallback? onOpen;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: AppColors.surfaceDefault,
      borderRadius: BorderRadius.circular(16),
      boxShadow: const [
        BoxShadow(
          color: Color(0x12000000),
          offset: Offset(0, 7),
          blurRadius: 16,
        ),
        BoxShadow(
          color: Color(0x0F000000),
          offset: Offset(0, 30),
          blurRadius: 30,
        ),
        BoxShadow(
          color: Color(0x0A000000),
          offset: Offset(0, 67),
          blurRadius: 40,
        ),
        BoxShadow(
          color: Color(0x03000000),
          offset: Offset(0, 120),
          blurRadius: 48,
        ),
      ],
    ),
    child: Row(
      children: [
        const FigmaIcon(FigmaAssets.homeAddedSuccess, size: 24),
        const SizedBox(width: 10),
        const Expanded(
          child: Text(
            'Đã thêm vào category “Self-care”',
            maxLines: 1,
            style: FigmaType.label16Regular,
          ),
        ),
        const SizedBox(width: 10),
        Semantics(
          button: true,
          child: InkWell(
            onTap: onOpen,
            child: const Text(
              'Mở',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 16,
                height: 22 / 16,
                letterSpacing: -.18,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

class _Recent2159 extends StatelessWidget {
  const _Recent2159({required this.item});

  final ({String image, String title}) item;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      MnemeImage(item.image, size: 80, radius: 15),
      const SizedBox(height: 9),
      SizedBox(
        width: double.infinity,
        child: Text(
          item.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: AppColors.ink,
            fontSize: 12,
            height: 16 / 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    ],
  );
}

class _Category2159 extends StatelessWidget {
  const _Category2159({required this.item, required this.showMore});

  final ({String image, String title, int count}) item;
  final bool showMore;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 80,
    child: Row(
      children: [
        MnemeImage(item.image, size: 80, radius: 15),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(item.title, style: FigmaType.body16Medium),
              const SizedBox(height: 8),
              Text(
                '${item.count} mục',
                style: const TextStyle(
                  color: AppColors.muted,
                  fontSize: 14,
                  height: 20 / 14,
                  letterSpacing: .4,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
        if (showMore)
          const SizedBox.square(
            dimension: 24,
            child: Center(
              child: RotatedBox(
                quarterTurns: 1,
                child: FigmaVector(
                  FigmaAssets.homeMoreVertical,
                  width: 2.5,
                  height: 12.5,
                ),
              ),
            ),
          ),
      ],
    ),
  );
}
