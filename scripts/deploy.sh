#!/usr/bin/env bash
# Production deploy to Vercel with retries: the CLI's upload step sometimes
# fails with "fetch failed" on flaky networks even though a retry succeeds.
set -u
cd "$(dirname "$0")/.."
for attempt in 1 2 3 4 5 6; do
  out=$(npx --yes vercel@latest deploy --prod --yes 2>&1)
  if echo "$out" | grep -q "Aliased"; then
    echo "$out" | grep -E "Production|Aliased"
    exit 0
  fi
  echo "Attempt $attempt failed: $(echo "$out" | grep -m1 -E 'Error' || echo 'unknown error')"
  sleep $((attempt * 5))
done
echo "Deploy failed after 6 attempts."
exit 1
