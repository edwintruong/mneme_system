import 'package:flutter/material.dart';

import 'app.dart';
import 'data/local_database.dart';
import 'state/mneme_store.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final database = await LocalDatabase.open();
  final store = MnemeStore(database);
  await store.load();
  runApp(MnemeApp(store: store));
}
