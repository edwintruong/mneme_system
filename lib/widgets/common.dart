import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';
import '../models/app_models.dart';
import '../screens/link/link_detail_screen.dart';

class SearchCard extends StatelessWidget {
  const SearchCard({super.key, this.onTap});
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(30),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(30),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: Container(
                height: 46,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: AppColors.surfaceMuted,
                  borderRadius: BorderRadius.circular(11),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.search, size: 18),
                    SizedBox(width: 10),
                    Text(
                      'Enter search terms...',
                      style: TextStyle(color: AppColors.muted, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              width: 46,
              height: 46,
              decoration: const BoxDecoration(
                color: AppColors.surfaceMuted,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.filter_list_rounded),
            ),
          ],
        ),
      ),
    ),
  );
}

class FilterChips extends StatefulWidget {
  const FilterChips({super.key});
  @override
  State<FilterChips> createState() => _FilterChipsState();
}

class _FilterChipsState extends State<FilterChips> {
  int selected = 0;
  @override
  Widget build(BuildContext context) => Row(
    children: List.generate(4, (i) {
      final labels = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'];
      return Padding(
        padding: const EdgeInsets.only(right: 10),
        child: ChoiceChip(
          showCheckmark: false,
          selectedColor: AppColors.primarySoft,
          backgroundColor: AppColors.surfaceMuted,
          side: BorderSide.none,
          label: Text(
            labels[i],
            style: TextStyle(
              color: selected == i ? AppColors.primary : AppColors.muted,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
          selected: selected == i,
          onSelected: (_) => setState(() => selected = i),
        ),
      );
    }),
  );
}

class MnemeImage extends StatelessWidget {
  const MnemeImage(this.path, {super.key, this.size = 80, this.radius = 15});
  final String path;
  final double size;
  final double radius;
  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(radius),
    child: Image.asset(path, width: size, height: size, fit: BoxFit.cover),
  );
}

class LinkTile extends StatelessWidget {
  const LinkTile({super.key, required this.link, this.compact = false});
  final SavedLink link;
  final bool compact;
  @override
  Widget build(BuildContext context) => InkWell(
    onTap: () => Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => LinkDetailScreen(link: link)),
    ),
    borderRadius: BorderRadius.circular(16),
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              MnemeImage(link.image, size: compact ? 72 : 80, radius: 14),
              Container(
                margin: const EdgeInsets.all(4),
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.ink.withValues(alpha: .75),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '2:12',
                  style: TextStyle(color: Colors.white, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  link.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    decoration: TextDecoration.underline,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${link.source} · @abcdef',
                  style: const TextStyle(color: AppColors.muted, fontSize: 12),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  children: [
                    Tag(link.folder),
                    const Tag('Figma', primary: true),
                  ],
                ),
              ],
            ),
          ),
          const Icon(Icons.more_vert, size: 18),
        ],
      ),
    ),
  );
}

class Tag extends StatelessWidget {
  const Tag(this.label, {super.key, this.primary = false});
  final String label;
  final bool primary;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
    decoration: BoxDecoration(
      color: primary ? AppColors.primarySoft : AppColors.surfaceMuted,
      borderRadius: BorderRadius.circular(20),
    ),
    child: Text(
      label,
      style: TextStyle(
        color: primary ? AppColors.primary : AppColors.ink,
        fontSize: 12,
      ),
    ),
  );
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.title, {super.key, this.trailing});
  final String title;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(
        child: Text(
          title,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      trailing ?? const SizedBox.shrink(),
    ],
  );
}
