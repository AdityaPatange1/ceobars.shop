#!/bin/bash
#
# Upload YT Singles to Vercel Blob Storage
#
# Usage: ./scripts/upload_yt_singles.sh
#

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
YT_DIR="$PROJECT_ROOT/outputs/yt_singles"
BLOB_URLS_FILE="$PROJECT_ROOT/outputs/yt_singles_blob_urls.json"

echo ""
echo "======================================================================"
echo "  CEO BARS - Upload YT Singles to Vercel Blob"
echo "======================================================================"
echo ""

# Load blob token
if [ -f "$PROJECT_ROOT/.env.local" ]; then
    export $(grep BLOB_READ_WRITE_TOKEN "$PROJECT_ROOT/.env.local" | xargs)
fi

if [ -z "$BLOB_READ_WRITE_TOKEN" ]; then
    echo "Error: BLOB_READ_WRITE_TOKEN not found"
    echo "Run: vercel env pull"
    exit 1
fi

# Find all master.mp3 and cover.jpg files
FILES=$(find "$YT_DIR" -type f \( -name "master.mp3" -o -name "cover.jpg" \) 2>/dev/null)
TOTAL=$(echo "$FILES" | wc -l | tr -d ' ')

echo "Found $TOTAL files to upload"
echo ""

# Start JSON
echo "{" > "$BLOB_URLS_FILE"
FIRST=true

COUNT=0
for FILE in $FILES; do
    COUNT=$((COUNT + 1))

    # Get relative path from outputs/yt_singles/
    REL_PATH="${FILE#$YT_DIR/}"
    BLOB_PATH="assets/yt-singles/$REL_PATH"

    echo -n "[$COUNT/$TOTAL] Uploading $REL_PATH..."

    # Upload to blob
    RESULT=$(vercel blob put "$FILE" -p "$BLOB_PATH" -f 2>&1)
    BLOB_URL=$(echo "$RESULT" | grep -oE 'https://[^ ]+\.blob\.vercel-storage\.com[^ ]*' | head -1)

    if [ -n "$BLOB_URL" ]; then
        echo " Done"

        # Add to JSON
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            echo "," >> "$BLOB_URLS_FILE"
        fi
        echo "  \"/assets/yt-singles/$REL_PATH\": \"$BLOB_URL\"" >> "$BLOB_URLS_FILE"
    else
        echo " Failed"
    fi
done

echo "" >> "$BLOB_URLS_FILE"
echo "}" >> "$BLOB_URLS_FILE"

# Fix JSON formatting
cat "$BLOB_URLS_FILE" | tr -d '\n' | sed 's/,  /,/g' | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print(json.dumps(d, indent=2))" > "$BLOB_URLS_FILE.tmp" && mv "$BLOB_URLS_FILE.tmp" "$BLOB_URLS_FILE"

echo ""
echo "======================================================================"
echo "  Upload Complete!"
echo "  Blob URLs saved to: $BLOB_URLS_FILE"
echo "======================================================================"
echo ""
echo "Next step:"
echo "Run: node scripts/add_yt_singles.js"
echo ""
