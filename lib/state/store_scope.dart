import 'package:flutter/widgets.dart';

import 'mneme_store.dart';

class StoreScope extends InheritedNotifier<MnemeStore> {
  const StoreScope({super.key, required MnemeStore store, required super.child})
    : super(notifier: store);
  static MnemeStore of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<StoreScope>()!.notifier!;
}
