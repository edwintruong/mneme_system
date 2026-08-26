import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/app_models.dart';
import '../activity/activity_screen.dart';
import '../add_link/add_link_screen.dart';
import '../home/home_screen.dart';
import '../link/link_detail_screen.dart';
import '../notebook/notebook_screen.dart';
import '../profile/profile_screen.dart';
import '../../platform/share_intent_bridge.dart';
import '../../widgets/figma_icon.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key, this.initialSharedText});
  final String? initialSharedText;
  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int index = 0;
  SavedLink? addedLink;
  Timer? toastTimer;
  @override
  void initState() {
    super.initState();
    ShareIntentBridge.listen(_openSharedText);
    if (widget.initialSharedText != null) {
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _openSharedText(widget.initialSharedText!),
      );
    }
  }

  @override
  void dispose() {
    toastTimer?.cancel();
    ShareIntentBridge.stopListening();
    super.dispose();
  }

  void _openSharedText(String text) =>
      unawaited(_openAddLink(initialUrl: text));

  Future<void> _openAddLink({String? initialUrl}) async {
    if (!mounted) return;
    final link = await Navigator.push<SavedLink>(
      context,
      MaterialPageRoute(builder: (_) => AddLinkScreen(initialUrl: initialUrl)),
    );
    if (!mounted || link == null) return;
    toastTimer?.cancel();
    setState(() {
      index = 0;
      addedLink = link;
    });
    toastTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) setState(() => addedLink = null);
    });
  }

  void _openAddedLink() {
    final link = addedLink;
    if (link == null) return;
    toastTimer?.cancel();
    setState(() => addedLink = null);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => LinkDetailScreen(link: link)),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: IndexedStack(
      index: index,
      children: [
        HomeScreen(
          showAddedToast: addedLink != null,
          onOpenAddedLink: _openAddedLink,
        ),
        const NotebookScreen(),
        const ActivityScreen(),
        const ProfileScreen(),
      ],
    ),
    extendBody: true,
    bottomNavigationBar: _FigmaBottomNavigation(
      selectedIndex: index,
      onSelected: (value) => setState(() => index = value),
      onAdd: () => unawaited(_openAddLink()),
    ),
  );
}

class _FigmaBottomNavigation extends StatelessWidget {
  const _FigmaBottomNavigation({
    required this.selectedIndex,
    required this.onSelected,
    required this.onAdd,
  });

  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 115,
    child: Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.topCenter,
      children: [
        Positioned(
          top: 40,
          child: FigmaVector(
            FigmaAssets.navBackground,
            width: MediaQuery.sizeOf(context).width + 38,
            height: 75,
            fit: BoxFit.fill,
          ),
        ),
        Positioned(
          top: 40,
          left: 16,
          right: 16,
          height: 75,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _item(
                    0,
                    'Home',
                    FigmaAssets.homeActive,
                    FigmaAssets.homeIdle,
                  ),
                  const SizedBox(width: 10),
                  _item(
                    1,
                    'Sổ tay',
                    FigmaAssets.notebookActive,
                    FigmaAssets.notebookIdle,
                  ),
                ],
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _item(
                    2,
                    'Hoạt động',
                    FigmaAssets.activityIdle,
                    FigmaAssets.activityIdle,
                  ),
                  const SizedBox(width: 10),
                  _item(
                    3,
                    'Cá nhân',
                    FigmaAssets.profileIdle,
                    FigmaAssets.profileIdle,
                  ),
                ],
              ),
            ],
          ),
        ),
        Positioned(
          top: 0,
          child: Semantics(
            button: true,
            label: 'Thêm liên kết',
            child: InkWell(
              onTap: onAdd,
              customBorder: const CircleBorder(),
              child: Container(
                width: 64,
                height: 64,
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [AppColors.primaryDark, Color(0xFF9F8AEB)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: const FigmaIcon(FigmaAssets.plus, size: 24),
              ),
            ),
          ),
        ),
      ],
    ),
  );

  Widget _item(
    int itemIndex,
    String label,
    String selectedAsset,
    String idleAsset,
  ) {
    final selected = selectedIndex == itemIndex;
    return InkWell(
      onTap: () => onSelected(itemIndex),
      child: SizedBox(
        width: 74,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.5),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              FigmaIcon(
                selected ? selectedAsset : idleAsset,
                size: 24,
                color: itemIndex > 1 && selected ? AppColors.primary : null,
              ),
              const SizedBox(height: 5),
              Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: selected ? AppColors.primary : AppColors.muted,
                  fontSize: 12,
                  height: 16 / 12,
                  letterSpacing: .4,
                  fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
