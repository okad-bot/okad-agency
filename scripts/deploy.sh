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
  --exclude='cases/ad-re-edits-five-brands/' \
  --exclude='cases/ai-content-case/' \
  --exclude='cases/alcohol-ugc-content/' \
  --exclude='cases/baby-furniture-ai-product-visuals/' \
  --exclude='cases/book-publisher/' \
  --exclude='cases/breakout-aid-skincare-ugc-ads/' \
  --exclude='cases/by-okad-camera-roll-creators/' \
  --exclude='cases/case-5public/' \
  --exclude='cases/case-bidmatrix/' \
  --exclude='cases/case-book-club/' \
  --exclude='cases/case-ckx/' \
  --exclude='cases/case-cosmowiki/' \
  --exclude='cases/case-cyberpulse/' \
  --exclude='cases/case-flipsystem-creatives/' \
  --exclude='cases/case-gently-branding-community/' \
  --exclude='cases/case-innowomen-branding/' \
  --exclude='cases/case-jardins-etretat-redesign-main/' \
  --exclude='cases/case-jumpman/' \
  --exclude='cases/case-jumpman-website-main/' \
  --exclude='cases/case-koster-pitch-deck/' \
  --exclude='cases/case-lingoculture/' \
  --exclude='cases/case-moboost-redesign/' \
  --exclude='cases/case-msu-sync/' \
  --exclude='cases/case-ocenka-real-estate-redesign/' \
  --exclude='cases/case-pitchdeck/' \
  --exclude='cases/case-robbo-scholl/' \
  --exclude='cases/case-samto-uxui/' \
  --exclude='cases/case-sardana/' \
  --exclude='cases/case-slp/' \
  --exclude='cases/case-starviral/' \
  --exclude='cases/case-tisa-school/' \
  --exclude='cases/case-trashpitch/' \
  --exclude='cases/case-trusto/' \
  --exclude='cases/case-uprest/' \
  --exclude='cases/case-upstream/' \
  --exclude='cases/collectibles-store-video-content-factory/' \
  --exclude='cases/community-app-launch-ads-upvote/' \
  --exclude='cases/creative-testing-ai-app-meta-ads/' \
  --exclude='cases/datemyage-dating-app-scripts/' \
  --exclude='cases/dating-com-creator-content/' \
  --exclude='cases/diamondere/' \
  --exclude='cases/drawing-app-faceless-ugc/' \
  --exclude='cases/dreambound-career-training-ads/' \
  --exclude='cases/edtech-app-ugc-social-content/' \
  --exclude='cases/fragstore-content-factory/' \
  --exclude='cases/gut-health-brand-story-ads/' \
  --exclude='cases/high-converting-video-ads-for-dtc-brands/' \
  --exclude='cases/high-roas-ugc-ads/' \
  --exclude='cases/longevity-supplement-story-ads/' \
  --exclude='cases/lookalikey-ugc-ads/' \
  --exclude='cases/myproteene/' \
  --exclude='cases/organic-video-content-1m-views/' \
  --exclude='cases/shuggle/' \
  --exclude='cases/smalltalk2me-social-content/' \
  --exclude='cases/static-ad-creatives-digital-products/' \
  --exclude='cases/supplement-brand-ugc-ad-testing/' \
  --exclude='cases/swiss-skincare-high-volume-ads/' \
  --exclude='cases/tipaw-dog-supplement-story-ads/' \
  --exclude='cases/ugc-creators-over-45/' \
  --exclude='cases/ux-research-bank-unistream/' \
  --exclude='cases/womens-health-supplement-ads/' \
  --exclude='cases/your-christian-date-broll-content/' \
  --exclude='cases/zentoes-walmart-launch-ads/' \
  --exclude='images/cases/covers/' \
  --exclude='.git' \
  "$SRC/" "$DEPLOY/"

echo ""
echo "Synced. Review changes before committing:"
echo "  cd $DEPLOY && git status"
echo "  git add -A && git commit -m 'Updates' && git push"
