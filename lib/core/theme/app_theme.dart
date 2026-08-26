import 'package:flutter/material.dart';

import 'figma_tokens.dart';

abstract final class AppColors {
  static const background = FigmaColors.background;
  static const primary = FigmaColors.primary;
  static const primaryDark = FigmaColors.primaryDark;
  static const primarySoft = FigmaColors.primarySoft;
  static const ink = FigmaColors.ink;
  static const muted = FigmaColors.muted;
  static const surfaceMuted = FigmaColors.neutral500;
  static const success = FigmaColors.success;
}

ThemeData buildAppTheme() => ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: AppColors.primary,
    surface: Colors.white,
  ),
  scaffoldBackgroundColor: AppColors.background,
  fontFamily: 'Roboto',
  textTheme: const TextTheme(
    headlineSmall: FigmaType.headingH3Medium,
    titleLarge: TextStyle(
      fontSize: 20,
      height: 1.25,
      fontWeight: FontWeight.w600,
      color: AppColors.ink,
    ),
    titleMedium: TextStyle(
      fontSize: 16,
      height: 1.35,
      fontWeight: FontWeight.w600,
      color: AppColors.ink,
    ),
    bodyLarge: FigmaType.body16Medium,
    bodyMedium: TextStyle(fontSize: 14, height: 1.45, color: AppColors.ink),
    labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.transparent,
    elevation: 0,
    foregroundColor: AppColors.ink,
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: AppColors.surfaceMuted,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(FigmaRadii.control),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(FigmaRadii.control),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(FigmaRadii.control),
      borderSide: const BorderSide(color: AppColors.primary),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      minimumSize: const Size(0, 48),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(FigmaRadii.control),
      ),
    ),
  ),
);
