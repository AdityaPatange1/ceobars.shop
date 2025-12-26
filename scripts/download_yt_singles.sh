#!/bin/bash
#
# Download YouTube videos as MP3s and prepare for YT Singles collection
#
# Usage: ./scripts/download_yt_singles.sh
#

# Don't use set -e as it causes issues with subshells

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
YT_CHANNEL="https://www.youtube.com/@OfficialAdi55"
OUTPUT_DIR="$PROJECT_ROOT/outputs/yt_singles"
METADATA_FILE="$PROJECT_ROOT/outputs/yt_singles_metadata.json"

echo ""
echo "======================================================================"
echo "  CEO BARS - YouTube Singles Downloader"
echo "======================================================================"
echo ""

# Check dependencies
if ! command -v yt-dlp &> /dev/null; then
    echo "Error: yt-dlp is not installed"
    echo "Install with: brew install yt-dlp"
    exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    echo "Install with: brew install ffmpeg"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed"
    echo "Install with: brew install jq"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Fetching video list from $YT_CHANNEL..."
echo ""

# Download video metadata first
yt-dlp --flat-playlist --dump-json "$YT_CHANNEL/videos" 2>/dev/null | jq -s '.' > "$OUTPUT_DIR/channel_videos.json"

VIDEO_COUNT=$(jq 'length' "$OUTPUT_DIR/channel_videos.json")
echo "Found $VIDEO_COUNT videos"
echo ""

# Initialize metadata array if it doesn't exist or is empty
if [ ! -f "$METADATA_FILE" ] || [ ! -s "$METADATA_FILE" ]; then
    echo "[]" > "$METADATA_FILE"
fi

# Process each video using index-based loop to avoid subshell issues

for INDEX in $(seq 0 $((VIDEO_COUNT - 1))); do
    DISPLAY_INDEX=$((INDEX + 1))

    video=$(jq -c ".[$INDEX]" "$OUTPUT_DIR/channel_videos.json")

    VIDEO_ID=$(echo "$video" | jq -r '.id')
    VIDEO_TITLE=$(echo "$video" | jq -r '.title')
    VIDEO_URL="https://www.youtube.com/watch?v=$VIDEO_ID"

    # Create slug from title
    SLUG=$(echo "$VIDEO_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//' | cut -c1-60)

    TRACK_DIR="$OUTPUT_DIR/$SLUG"

    echo "[$DISPLAY_INDEX/$VIDEO_COUNT] Processing: $VIDEO_TITLE"

    # Skip if already processed
    if [ -f "$TRACK_DIR/master.mp3" ] && [ -f "$TRACK_DIR/cover.jpg" ]; then
        echo "  Already processed, skipping..."
        continue
    fi

    mkdir -p "$TRACK_DIR"

    # Download audio and thumbnail
    echo "  Downloading audio..."
    yt-dlp -x --audio-format mp3 --audio-quality 0 \
        --write-thumbnail --convert-thumbnails jpg \
        -o "$TRACK_DIR/raw.%(ext)s" \
        --write-info-json \
        "$VIDEO_URL" 2>/dev/null || {
        echo "  Failed to download, skipping..."
        continue
    }

    # Rename files
    if [ -f "$TRACK_DIR/raw.mp3" ]; then
        mv "$TRACK_DIR/raw.mp3" "$TRACK_DIR/original.mp3"
    fi

    # Find and rename thumbnail
    for thumb in "$TRACK_DIR"/raw.jpg "$TRACK_DIR"/raw.webp "$TRACK_DIR"/*.jpg "$TRACK_DIR"/*.webp; do
        if [ -f "$thumb" ] && [ "$thumb" != "$TRACK_DIR/cover.jpg" ]; then
            # Convert to jpg if webp
            if [[ "$thumb" == *.webp ]]; then
                ffmpeg -y -i "$thumb" "$TRACK_DIR/cover.jpg" 2>/dev/null
                rm -f "$thumb"
            else
                mv "$thumb" "$TRACK_DIR/cover.jpg" 2>/dev/null || true
            fi
            break
        fi
    done

    # Run mix/master chain
    if [ -f "$TRACK_DIR/original.mp3" ]; then
        echo "  Running mix/master chain..."

        # Convert to WAV for processing
        ffmpeg -y -i "$TRACK_DIR/original.mp3" -acodec pcm_s24le -ar 48000 -ac 2 "$TRACK_DIR/input.wav" 2>/dev/null

        # First pass - analyze loudness
        LOUDNORM_OUTPUT=$(ffmpeg -i "$TRACK_DIR/input.wav" -af \
            'highpass=f=30:poles=2,lowshelf=g=2:f=80:t=q:w=0.707,equalizer=f=3000:t=q:w=1.5:g=1.5,highshelf=g=1:f=12000:t=q:w=0.707,acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,loudnorm=I=-14:LRA=11:TP=-1:print_format=json' \
            -f null - 2>&1 | grep -A 20 '{' | head -21)

        MEASURED_I=$(echo "$LOUDNORM_OUTPUT" | jq -r '.input_i // "-14"' 2>/dev/null || echo "-14")
        MEASURED_LRA=$(echo "$LOUDNORM_OUTPUT" | jq -r '.input_lra // "11"' 2>/dev/null || echo "11")
        MEASURED_TP=$(echo "$LOUDNORM_OUTPUT" | jq -r '.input_tp // "-1"' 2>/dev/null || echo "-1")
        MEASURED_THRESH=$(echo "$LOUDNORM_OUTPUT" | jq -r '.input_thresh // "-24"' 2>/dev/null || echo "-24")

        # Second pass - apply processing
        ffmpeg -y -i "$TRACK_DIR/input.wav" -af \
            "highpass=f=30:poles=2,lowshelf=g=2:f=80:t=q:w=0.707,equalizer=f=3000:t=q:w=1.5:g=1.5,highshelf=g=1:f=12000:t=q:w=0.707,acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,stereotools=mlev=1:slev=1.05:sbal=0,loudnorm=I=-14:LRA=11:TP=-1:measured_I=$MEASURED_I:measured_LRA=$MEASURED_LRA:measured_TP=$MEASURED_TP:measured_thresh=$MEASURED_THRESH:linear=true,alimiter=limit=-1dB:level=false" \
            -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$TRACK_DIR/master.wav" 2>/dev/null

        # Create MP3
        ffmpeg -y -i "$TRACK_DIR/master.wav" -codec:a libmp3lame -b:a 320k -q:a 0 "$TRACK_DIR/master.mp3" 2>/dev/null

        # Cleanup intermediate files
        rm -f "$TRACK_DIR/input.wav" "$TRACK_DIR/master.wav" "$TRACK_DIR/original.mp3"

        # Get duration
        DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$TRACK_DIR/master.mp3" 2>/dev/null)
        MINS=$(echo "$DURATION" | awk '{printf "%d", $1/60}')
        SECS=$(echo "$DURATION" | awk '{printf "%02d", int($1)%60}')
        DURATION_STR="${MINS}:${SECS}"

        # Get video description from info.json
        INFO_FILE=$(find "$TRACK_DIR" -name "*.info.json" | head -1)
        if [ -f "$INFO_FILE" ]; then
            VIDEO_DESC=$(jq -r '.description // ""' "$INFO_FILE" | head -c 500)
            UPLOAD_DATE=$(jq -r '.upload_date // ""' "$INFO_FILE")
        else
            VIDEO_DESC=""
            UPLOAD_DATE=""
        fi

        echo "  Done! Duration: $DURATION_STR"

        # Add to metadata
        jq --arg slug "$SLUG" \
           --arg title "$VIDEO_TITLE" \
           --arg duration "$DURATION_STR" \
           --arg desc "$VIDEO_DESC" \
           --arg date "$UPLOAD_DATE" \
           --arg video_id "$VIDEO_ID" \
           '. += [{
               "slug": $slug,
               "title": $title,
               "duration": $duration,
               "description": $desc,
               "upload_date": $date,
               "video_id": $video_id
           }]' "$METADATA_FILE" > "$METADATA_FILE.tmp" && mv "$METADATA_FILE.tmp" "$METADATA_FILE"
    fi

    # Cleanup info files
    rm -f "$TRACK_DIR"/*.info.json

done

echo ""
echo "======================================================================"
echo "  Download Complete!"
echo "  Tracks saved to: $OUTPUT_DIR"
echo "  Metadata saved to: $METADATA_FILE"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "1. Run: ./scripts/upload_yt_singles.sh  (upload to Vercel Blob)"
echo "2. Run: node scripts/add_yt_singles.js  (add to tracks page)"
echo ""
