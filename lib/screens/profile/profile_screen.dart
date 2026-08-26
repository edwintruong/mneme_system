import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../widgets/common.dart';

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
                leading: Icon(Icons.palette_outlined),
                title: Text('Giao diện'),
                trailing: Icon(Icons.chevron_right),
              ),
              Divider(height: 1),
              ListTile(
                leading: Icon(Icons.storage_outlined),
                title: Text('Dữ liệu local'),
                subtitle: Text('SQLite trên thiết bị'),
                trailing: Icon(Icons.check_circle, color: AppColors.success),
              ),
              Divider(height: 1),
              ListTile(
                leading: Icon(Icons.info_outline),
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
