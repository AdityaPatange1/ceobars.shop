#!/bin/bash
#
# YouTube to MP3 Downloader
# Downloads videos from YouTube as MP3 files
#
# Usage:
#   ./scripts/youtube_download.sh <youtube_url> [output_dir]
#
# Examples:
#   ./scripts/youtube_download.sh "https://www.youtube.com/watch?v=VIDEO_ID"
#   ./scripts/youtube_download.sh "https://www.youtube.com/playlist?list=PLAYLIST_ID"
#   ./scripts/youtube_download.sh "https://www.youtube.com/@ChannelName" ./my-downloads
#

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}======================================================================"
echo "  YouTube to MP3 Downloader"
echo -e "======================================================================${NC}"
echo ""

# Check for URL argument
if [ -z "$1" ]; then
    echo -e "${RED}Error: No YouTube URL provided${NC}"
    echo ""
    echo "Usage: $0 <youtube_url> [output_dir]"
    echo ""
    echo "Examples:"
    echo "  $0 \"https://www.youtube.com/watch?v=VIDEO_ID\""
    echo "  $0 \"https://www.youtube.com/playlist?list=PLAYLIST_ID\""
    echo "  $0 \"https://www.youtube.com/@ChannelName\""
    echo "  $0 \"https://www.youtube.com/@ChannelName\" ./my-downloads"
    exit 1
fi

YOUTUBE_URL="$1"
OUTPUT_DIR="${2:-$PROJECT_ROOT/outputs/youtube-downloads}"

# Check dependencies
echo "Checking dependencies..."

if ! command -v yt-dlp &> /dev/null; then
    echo -e "${RED}Error: yt-dlp is not installed${NC}"
    echo "Install with: brew install yt-dlp"
    exit 1
fi
echo -e "  ${GREEN}yt-dlp${NC} - OK"

if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed${NC}"
    echo "Install with: brew install ffmpeg"
    exit 1
fi
echo -e "  ${GREEN}ffmpeg${NC} - OK"

echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}URL:${NC} $YOUTUBE_URL"
echo -e "${YELLOW}Output:${NC} $OUTPUT_DIR"
echo ""

# Determine URL type and show info
if [[ "$YOUTUBE_URL" == *"playlist"* ]]; then
    echo -e "${CYAN}Detected: Playlist${NC}"
    echo "Fetching playlist info..."
    VIDEO_COUNT=$(yt-dlp --flat-playlist --print "%(playlist_count)s" "$YOUTUBE_URL" 2>/dev/null | head -1)
    echo -e "Found ${GREEN}$VIDEO_COUNT${NC} videos in playlist"
elif [[ "$YOUTUBE_URL" == *"@"* ]] || [[ "$YOUTUBE_URL" == *"/channel/"* ]] || [[ "$YOUTUBE_URL" == *"/c/"* ]]; then
    echo -e "${CYAN}Detected: Channel${NC}"
    echo "Fetching channel videos..."
    # Append /videos if not already present
    if [[ "$YOUTUBE_URL" != *"/videos"* ]]; then
        YOUTUBE_URL="$YOUTUBE_URL/videos"
    fi
    VIDEO_COUNT=$(yt-dlp --flat-playlist --print "%(playlist_count)s" "$YOUTUBE_URL" 2>/dev/null | head -1)
    echo -e "Found ${GREEN}$VIDEO_COUNT${NC} videos on channel"
else
    echo -e "${CYAN}Detected: Single video${NC}"
    VIDEO_COUNT=1
fi

echo ""
echo -e "${YELLOW}Starting download...${NC}"
echo ""

# Download with yt-dlp
# Options:
#   -x: Extract audio
#   --audio-format mp3: Convert to MP3
#   --audio-quality 0: Best quality (VBR ~245kbps)
#   --embed-thumbnail: Embed thumbnail in MP3
#   --add-metadata: Add metadata tags
#   --write-thumbnail: Save thumbnail separately
#   --convert-thumbnails jpg: Convert thumbnails to JPG
#   -o: Output template

yt-dlp \
    -x \
    --audio-format mp3 \
    --audio-quality 0 \
    --embed-thumbnail \
    --add-metadata \
    --write-thumbnail \
    --convert-thumbnails jpg \
    --progress \
    --no-warnings \
    -o "$OUTPUT_DIR/%(title)s.%(ext)s" \
    "$YOUTUBE_URL"

RESULT=$?

echo ""

if [ $RESULT -eq 0 ]; then
    # Count downloaded files
    MP3_COUNT=$(find "$OUTPUT_DIR" -name "*.mp3" -type f | wc -l | tr -d ' ')

    echo -e "${GREEN}======================================================================"
    echo "  Download Complete!"
    echo -e "======================================================================${NC}"
    echo ""
    echo -e "  ${GREEN}$MP3_COUNT${NC} MP3 file(s) saved to:"
    echo -e "  ${CYAN}$OUTPUT_DIR${NC}"
    echo ""

    # List downloaded files
    echo "Downloaded files:"
    find "$OUTPUT_DIR" -name "*.mp3" -type f -exec basename {} \; | head -20

    TOTAL_FILES=$(find "$OUTPUT_DIR" -name "*.mp3" -type f | wc -l | tr -d ' ')
    if [ "$TOTAL_FILES" -gt 20 ]; then
        echo "  ... and $((TOTAL_FILES - 20)) more"
    fi
else
    echo -e "${RED}======================================================================"
    echo "  Download Failed!"
    echo -e "======================================================================${NC}"
    echo ""
    echo "Check the URL and try again."
    exit 1
fi

echo ""
