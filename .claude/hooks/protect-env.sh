#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:.*"\(.*\)"/\1/')

if [[ "$FILE_PATH" =~ \.env(\.local|\.production|\.development)?$ ]]; then
  echo "Blocked: cannot edit $FILE_PATH — .env files contain secrets" >&2
  exit 2
fi

exit 0
