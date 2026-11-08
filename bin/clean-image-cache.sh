#!/usr/bin/env bash
#
# clean-image-cache.sh
#
# Deletes Next.js optimized image cache files older than 7 days.
# Run manually or hook into your deploy pipeline.
#
# Usage:
#   ./bin/clean-image-cache.sh            # defaults to .next/cache/images
#   ./bin/clean-image-cache.sh /path/to   # custom cache directory
#   CACHE_MAX_AGE=14 ./bin/clean-image-cache.sh  # custom age in days
#

set -euo pipefail

CACHE_DIR="${1:-.next/cache/images}"
MAX_AGE_DAYS="${CACHE_MAX_AGE:-7}"

if [ ! -d "$CACHE_DIR" ]; then
  echo "Cache directory not found: $CACHE_DIR (nothing to clean)"
  exit 0
fi

# Count files before cleanup
BEFORE=$(find "$CACHE_DIR" -type f | wc -l)

# Delete files older than MAX_AGE_DAYS
find "$CACHE_DIR" -type f -mtime "+${MAX_AGE_DAYS}" -delete

# Remove empty directories left behind
find "$CACHE_DIR" -type d -empty -delete 2>/dev/null || true

# Count files after cleanup
AFTER=$(find "$CACHE_DIR" -type f 2>/dev/null | wc -l)
REMOVED=$((BEFORE - AFTER))

echo "Image cache cleanup complete: removed $REMOVED files ($BEFORE -> $AFTER), max age: ${MAX_AGE_DAYS} days"
