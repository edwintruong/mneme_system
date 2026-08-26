#!/usr/bin/env bash
set -euo pipefail

if rtk rg -n 'Icons\.|\bIcon\(' lib test; then
  rtk printf '%s\n' 'Material Icons are forbidden; use an exact committed Figma SVG.'
  exit 1
fi

rtk dart format --output=none --set-exit-if-changed lib test
rtk flutter analyze
rtk flutter test
rtk flutter build apk --debug
