#!/usr/bin/env bash
set -euo pipefail

rtk dart format --output=none --set-exit-if-changed lib test
rtk flutter analyze
rtk flutter test
rtk flutter build apk --debug
