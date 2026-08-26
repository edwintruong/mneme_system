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
    expect(tester.getSize(find.byType(SearchCard)).height, 70);
    expect(
      tester.getSize(
        find.byWidgetPredicate(
          (widget) => widget is FigmaIcon && widget.asset == FigmaAssets.filter,
        ),
      ),
      const Size.square(36),
    );
  });

  testWidgets('home filter chips keep the 2159 fixed-size contract', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildAppTheme(),
        home: const Scaffold(body: Center(child: FilterChips())),
      ),
    );

    final chipTaps = find.descendant(
      of: find.byType(FilterChips),
      matching: find.byType(InkWell),
    );
    expect(chipTaps, findsNWidgets(4));
    for (var i = 0; i < 4; i++) {
      expect(tester.getSize(chipTaps.at(i)), const Size(70, 28));
    }
  });
}
