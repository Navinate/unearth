#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:.*"\(.*\)"/\1/')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

if [[ "$FILE_PATH" =~ \.(ts|js|astro|svelte|css|json|md)$ ]]; then
  bunx prettier --write "$FILE_PATH" 2>/dev/null
fi

exit 0
