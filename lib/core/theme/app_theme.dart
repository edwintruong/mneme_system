import 'package:flutter/material.dart';

abstract final class AppColors {
  static const background = Color(0xFFF8F6FD);
  static const primary = Color(0xFF7758E2);
  static const primaryDark = Color(0xFF613EEA);
  static const primarySoft = Color(0xFFF1EEFC);
  static const ink = Color(0xFF0E0727);
  static const muted = Color(0xFF9490A2);
  static const surfaceMuted = Color(0xFFF5F5F7);
  static const success = Color(0xFF31CF37);
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
    headlineSmall: TextStyle(
      fontSize: 24,
      height: 1.25,
      fontWeight: FontWeight.w500,
      color: AppColors.ink,
    ),
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
    bodyLarge: TextStyle(fontSize: 16, height: 1.5, color: AppColors.ink),
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
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: AppColors.primary),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      minimumSize: const Size(0, 48),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
    ),
  ),
);
