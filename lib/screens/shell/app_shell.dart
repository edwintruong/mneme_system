import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../activity/activity_screen.dart';
import '../add_link/add_link_screen.dart';
import '../home/home_screen.dart';
import '../notebook/notebook_screen.dart';
import '../profile/profile_screen.dart';
import '../../platform/share_intent_bridge.dart';

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
    floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    floatingActionButton: Container(
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [AppColors.primaryDark, Color(0xFF9F8AEB)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: FloatingActionButton(
        backgroundColor: Colors.transparent,
        elevation: 0,
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AddLinkScreen()),
        ),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    ),
    bottomNavigationBar: NavigationBar(
      height: 76,
      backgroundColor: Colors.white,
      indicatorColor: AppColors.primarySoft,
      selectedIndex: index,
      onDestinationSelected: (value) => setState(() => index = value),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home_rounded),
          label: 'Home',
        ),
        NavigationDestination(
          icon: Icon(Icons.menu_book_outlined),
          selectedIcon: Icon(Icons.menu_book_rounded),
          label: 'Sổ tay',
        ),
        NavigationDestination(
          icon: Icon(Icons.notifications_none),
          selectedIcon: Icon(Icons.notifications),
          label: 'Hoạt động',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Cá nhân',
        ),
      ],
    ),
  );
}
