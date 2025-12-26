#!/bin/bash
#
# Upload audio assets to Vercel Blob using CLI
#
# Usage: BLOB_READ_WRITE_TOKEN=xxx ./scripts/upload-blob-cli.sh
#

# Continue on errors to process all files
# set -e

ASSETS_DIR="public/assets"
OUTPUT_FILE="outputs/blob-urls.json"

echo ""
echo "======================================================================"
echo "  CEO BARS - Vercel Blob Upload (CLI)"
echo "======================================================================"
echo ""

if [ -z "$BLOB_READ_WRITE_TOKEN" ]; then
    echo "Error: BLOB_READ_WRITE_TOKEN environment variable is required"
    echo ""
    echo "To get your token:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Select ceobars-shop project"
    echo "3. Go to Storage tab"
    echo "4. Click 'Connect Store' > 'Create New' > 'Blob'"
    echo "5. Copy the BLOB_READ_WRITE_TOKEN from the .env.local tab"
    echo ""
    echo "Then run:"
    echo "BLOB_READ_WRITE_TOKEN=xxx ./scripts/upload-blob-cli.sh"
    exit 1
fi

# Create output directory
mkdir -p outputs

# Start JSON file
echo "{" > "$OUTPUT_FILE"
first=true

# Find all media files
files=$(find "$ASSETS_DIR" -type f \( -name "*.mp3" -o -name "*.jpg" -o -name "*.png" \))
total=$(echo "$files" | wc -l | tr -d ' ')
count=0

echo "Found $total files to upload"
echo ""

for file in $files; do
    count=$((count + 1))
    relative_path="${file#public/}"

    echo -n "[$count/$total] Uploading $relative_path..."

    # Upload using vercel blob put
    result=$(vercel blob put "$file" -p "$relative_path" -f 2>&1)

    # Extract URL from result
    blob_url=$(echo "$result" | grep -oE 'https://[^ ]+\.blob\.vercel-storage\.com[^ ]*' | head -1)

    if [ -n "$blob_url" ]; then
        echo " Done"

        # Add to JSON (with proper comma handling)
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$OUTPUT_FILE"
        fi

        echo "  \"/$relative_path\": \"$blob_url\"" >> "$OUTPUT_FILE"
    else
        echo " Failed"
        echo "  Error: $result"
    fi
done

# Close JSON file
echo "" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo ""
echo "======================================================================"
echo "  Upload Complete!"
echo "  Mapping saved to: $OUTPUT_FILE"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "1. Run: npx ts-node scripts/update-tracks-blob.ts"
echo "2. Remove audio files from public/assets"
echo "3. Deploy to Vercel"
echo ""
