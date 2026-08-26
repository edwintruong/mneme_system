import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../activity/activity_screen.dart';
import '../add_link/add_link_screen.dart';
import '../home/home_screen.dart';
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
  final screens = const [
    HomeScreen(),
    NotebookScreen(),
    ActivityScreen(),
    ProfileScreen(),
  ];
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
    ShareIntentBridge.stopListening();
    super.dispose();
  }

  void _openSharedText(String text) {
    if (!mounted) return;
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => AddLinkScreen(initialUrl: text)),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: IndexedStack(index: index, children: screens),
    extendBody: true,
    bottomNavigationBar: _FigmaBottomNavigation(
      selectedIndex: index,
      onSelected: (value) => setState(() => index = value),
      onAdd: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const AddLinkScreen()),
      ),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  _item(
                    0,
                    'Home',
                    FigmaAssets.homeActive,
                    FigmaAssets.homeIdle,
                  ),
                  _item(
                    1,
                    'Sổ tay',
                    FigmaAssets.notebookActive,
                    FigmaAssets.notebookIdle,
                  ),
                ],
              ),
              Row(
                children: [
                  _item(
                    2,
                    'Hoạt động',
                    FigmaAssets.activityIdle,
                    FigmaAssets.activityIdle,
                  ),
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
        height: 75,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
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
    );
  }
}
