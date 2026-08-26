import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mneme/core/theme/app_theme.dart';
import 'package:mneme/widgets/common.dart';
import 'package:mneme/widgets/figma_icon.dart';

void main() {
  testWidgets('search card follows the Mneme visual language', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildAppTheme(),
        home: const Scaffold(body: SearchCard()),
      ),
    );
    expect(find.text('Enter search terms...'), findsOneWidget);
    expect(
      find.byWidgetPredicate(
        (widget) => widget is FigmaIcon && widget.asset == FigmaAssets.filter,
      ),
      findsOneWidget,
    );
  });
}
