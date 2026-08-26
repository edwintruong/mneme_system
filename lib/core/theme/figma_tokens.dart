import 'package:flutter/material.dart';

/// Flutter translation of the variables/styles attached to Figma section
/// `2143:4235`. Treat these as the app's CSS custom properties.
abstract final class FigmaColors {
  static const background = Color(0xFFF8F6FD);
  static const primary = Color(0xFF7758E2);
  static const primaryDark = Color(0xFF613EEA);
  static const primarySoft = Color(0xFFF1EEFC);
  static const ink = Color(0xFF0E0727);
  static const dark = Color(0xFF28303F);
  static const muted = Color(0xFF9490A2);
  static const neutral500 = Color(0xFFF5F5F7);
  static const surfaceDefault = Color(0xFFF7F7F8);
  static const success = Color(0xFF31CF37);
}

abstract final class FigmaSpacing {
  static const x1 = 4.0;
  static const x2 = 8.0;
  static const x2_5 = 10.0;
  static const x3 = 12.0;
  static const x4 = 16.0;
  static const x5 = 20.0;
  static const x6 = 24.0;
}

abstract final class FigmaRadii {
  static const searchField = 11.0;
  static const control = 14.0;
  static const thumbnail = 15.0;
  static const card = 20.0;
  static const chip = 24.0;
  static const searchCard = 30.0;
  static const device = 40.0;
}

abstract final class FigmaType {
  static const headingH3Medium = TextStyle(
    fontFamily: 'Roboto',
    fontSize: 24,
    height: 30 / 24,
    letterSpacing: -.15,
    fontWeight: FontWeight.w500,
    color: FigmaColors.ink,
  );

  static const label16Regular = TextStyle(
    fontFamily: 'Roboto',
    fontSize: 16,
    height: 22 / 16,
    letterSpacing: -.18,
    fontWeight: FontWeight.w400,
    color: FigmaColors.ink,
  );

  static const label12ExtraBold = TextStyle(
    fontFamily: 'Roboto',
    fontSize: 12,
    height: 16 / 12,
    letterSpacing: .4,
    fontWeight: FontWeight.w800,
    color: FigmaColors.ink,
  );

  static const label14Medium = TextStyle(
    fontFamily: 'Roboto',
    fontSize: 14,
    height: 20 / 14,
    letterSpacing: .4,
    fontWeight: FontWeight.w500,
    color: FigmaColors.ink,
  );

  static const body16Medium = TextStyle(
    fontFamily: 'Roboto',
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w500,
    color: FigmaColors.ink,
  );
}

abstract final class FigmaShadows {
  static const card = [
    BoxShadow(color: Color(0x0F000000), offset: Offset(0, 4), blurRadius: 8),
    BoxShadow(color: Color(0x0A000000), blurRadius: 4),
  ];
}
