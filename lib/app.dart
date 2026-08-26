import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'screens/shell/app_shell.dart';
import 'state/mneme_store.dart';
import 'state/store_scope.dart';

class MnemeApp extends StatelessWidget {
  const MnemeApp({super.key, required this.store});
  final MnemeStore store;

  @override
  Widget build(BuildContext context) => StoreScope(
    store: store,
    child: MaterialApp(
      title: 'Mneme',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const AppShell(),
    ),
  );
}
