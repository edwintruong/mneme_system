import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../widgets/common.dart';
import '../../widgets/figma_icon.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) => SafeArea(
    child: ListView(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 120),
      children: [
        Text('Cá nhân', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 28),
        const Center(
          child: MnemeImage('assets/images/avatar.png', size: 96, radius: 48),
        ),
        const SizedBox(height: 12),
        const Center(
          child: Text(
            'echs',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
        ),
        const Center(
          child: Text(
            'Demo local · không cần đăng nhập',
            style: TextStyle(color: AppColors.muted),
          ),
        ),
        const SizedBox(height: 28),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Column(
            children: [
              ListTile(
                leading: FigmaIcon(FigmaAssets.edit),
                title: Text('Giao diện'),
                trailing: FigmaIcon(FigmaAssets.chevronRight, size: 24),
              ),
              Divider(height: 1),
              ListTile(
                leading: FigmaIcon(FigmaAssets.layers),
                title: Text('Dữ liệu local'),
                subtitle: Text('SQLite trên thiết bị'),
                trailing: FigmaAnalysisStatus(done: true, inProgress: false),
              ),
              Divider(height: 1),
              ListTile(
                leading: FigmaIcon(FigmaAssets.openBook),
                title: Text('Mneme Showcase'),
                subtitle: Text('Version 1.0.0'),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
