#!/usr/bin/env bash
set -euo pipefail

# Deploy Astro build to okad-agency-deploy (gh-pages).
# IMPORTANT: excludes standalone HTML cases and manual assets
# that are NOT part of the Astro build.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="${SCRIPT_DIR}/../dist"
DEPLOY="${HOME}/okad-agency-deploy"

if [ ! -d "$SRC" ]; then
  echo "ERROR: dist/ not found. Run 'npm run build' first." >&2
  exit 1
fi

if [ ! -d "$DEPLOY/.git" ]; then
  echo "ERROR: deploy repo not found at $DEPLOY" >&2
  exit 1
fi

cd "$DEPLOY"
git checkout gh-pages
git pull origin gh-pages

rsync -a --delete \
  --exclude='cases/ai-content-case/' \
  --exclude='cases/shuggle/' \
  --exclude='cases/diamondere/' \
  --exclude='cases/book-publisher/' \
  --exclude='cases/dreambound-career-training-ads/' \
  --exclude='cases/breakout-aid-skincare-ugc-ads/' \
  --exclude='cases/gut-health-brand-story-ads/' \
  --exclude='cases/edtech-app-ugc-social-content/' \
  --exclude='cases/collectibles-store-video-content-factory/' \
  --exclude='cases/baby-furniture-ai-product-visuals/' \
  --exclude='cases/datemyage-dating-app-scripts/' \
  --exclude='cases/swiss-skincare-high-volume-ads/' \
  --exclude='cases/tipaw-dog-supplement-story-ads/' \
  --exclude='images/cases/covers/' \
  --exclude='.git' \
  "$SRC/" "$DEPLOY/"

echo ""
echo "Synced. Review changes before committing:"
echo "  cd $DEPLOY && git status"
echo "  git add -A && git commit -m 'Updates' && git push"
