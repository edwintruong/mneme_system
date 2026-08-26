import 'package:flutter/services.dart';

abstract final class ShareIntentBridge {
  static const _channel = MethodChannel('mneme/share');

  static Future<String?> initialSharedText() async {
    try {
      return await _channel.invokeMethod<String>('getInitialSharedText');
    } on MissingPluginException {
      return null;
    }
  }

  static void listen(void Function(String text) onSharedText) {
    _channel.setMethodCallHandler((call) async {
      if (call.method == 'sharedText' && call.arguments is String) {
        onSharedText(call.arguments as String);
      }
    });
  }

  static void stopListening() => _channel.setMethodCallHandler(null);
}
