#!/usr/bin/env bash
set -euo pipefail

if rtk rg -n "from ['\"](lucide-react|react-icons|@heroicons)|require\\(['\"](lucide-react|react-icons|@heroicons)" src; then
  rtk printf '%s\n' 'Icon libraries are forbidden; use an exact committed Figma SVG.'
  exit 1
fi

if rtk rg -n '<svg|<path' src; then
  rtk printf '%s\n' 'Inline or hand-authored SVG is forbidden; register an exported asset in FigmaIcon.'
  exit 1
fi

rtk npx tsc --noEmit
rtk npm run build
