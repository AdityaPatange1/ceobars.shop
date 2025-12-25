#!/bin/bash

#===============================================================================
#  CEO BARS™ - Video to Audio Converter
#  Extracts audio from MOV/MP4 video files to WAV and MP3
#===============================================================================
#
#  Usage: ./video_to_audio.sh --fileName "video.mov"
#
#  Input:  inputs/videos/<filename>
#  Output: inputs/<filename>.wav & inputs/<filename>.mp3
#
#===============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Banner
echo -e "${MAGENTA}"
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                           ║"
echo "║     ██████╗███████╗ ██████╗     ██████╗  █████╗ ██████╗ ███████╗™         ║"
echo "║    ██╔════╝██╔════╝██╔═══██╗    ██╔══██╗██╔══██╗██╔══██╗██╔════╝          ║"
echo "║    ██║     █████╗  ██║   ██║    ██████╔╝███████║██████╔╝███████╗          ║"
echo "║    ██║     ██╔══╝  ██║   ██║    ██╔══██╗██╔══██║██╔══██╗╚════██║          ║"
echo "║    ╚██████╗███████╗╚██████╔╝    ██████╔╝██║  ██║██║  ██║███████║          ║"
echo "║     ╚═════╝╚══════╝ ╚═════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝          ║"
echo "║                                                                           ║"
echo "║                 🎬  VIDEO TO AUDIO CONVERTER  🎧                          ║"
echo "║                    MOV/MP4 → WAV + MP3                                    ║"
echo "║                                                                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse arguments
FILE_NAME=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --fileName)
            FILE_NAME="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Validate input
if [ -z "$FILE_NAME" ]; then
    echo -e "${RED}Error: --fileName is required${NC}"
    echo -e "${YELLOW}Usage: ./video_to_audio.sh --fileName \"video.mov\"${NC}"
    exit 1
fi

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$PROJECT_ROOT/inputs/videos"
OUTPUT_DIR="$PROJECT_ROOT/inputs"
INPUT_FILE="$INPUT_DIR/$FILE_NAME"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}Error: Input file not found: $INPUT_FILE${NC}"
    exit 1
fi

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed${NC}"
    echo -e "${YELLOW}Install with: brew install ffmpeg${NC}"
    exit 1
fi

# Extract filename without extension
BASENAME=$(basename "$FILE_NAME")
FILENAME="${BASENAME%.*}"
EXTENSION="${BASENAME##*.}"

# Output files
OUTPUT_WAV="$OUTPUT_DIR/${FILENAME}.wav"
OUTPUT_MP3="$OUTPUT_DIR/${FILENAME}.mp3"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}📁 INPUT FILE:${NC}  $INPUT_FILE"
echo -e "${WHITE}📁 OUTPUT DIR:${NC} $OUTPUT_DIR"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

#===============================================================================
# STEP 1: Analyze Video File
#===============================================================================
echo -e "${YELLOW}▶ STEP 1: Analyzing Video File...${NC}"
echo ""

# Get video info
VIDEO_INFO=$(ffprobe -v quiet -print_format json -show_format -show_streams "$INPUT_FILE" 2>/dev/null)

# Extract audio stream info
AUDIO_CODEC=$(ffprobe -v quiet -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE" 2>/dev/null)
AUDIO_SAMPLE_RATE=$(ffprobe -v quiet -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE" 2>/dev/null)
AUDIO_CHANNELS=$(ffprobe -v quiet -select_streams a:0 -show_entries stream=channels -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE" 2>/dev/null)
AUDIO_BITRATE=$(ffprobe -v quiet -select_streams a:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE" 2>/dev/null)
DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE" 2>/dev/null)

# Format duration
if [ -n "$DURATION" ]; then
    DURATION_INT=${DURATION%.*}
    MINUTES=$((DURATION_INT / 60))
    SECONDS=$((DURATION_INT % 60))
    DURATION_FMT="${MINUTES}m ${SECONDS}s"
else
    DURATION_FMT="Unknown"
fi

# Format bitrate
if [ -n "$AUDIO_BITRATE" ]; then
    BITRATE_KBPS=$((AUDIO_BITRATE / 1000))
    BITRATE_FMT="${BITRATE_KBPS} kbps"
else
    BITRATE_FMT="Unknown"
fi

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}VIDEO AUDIO STREAM ANALYSIS${NC}                                      ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Audio Codec:     ${GREEN}${AUDIO_CODEC:-Unknown}${NC}                                         ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Sample Rate:     ${GREEN}${AUDIO_SAMPLE_RATE:-Unknown} Hz${NC}                                   ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Channels:        ${GREEN}${AUDIO_CHANNELS:-Unknown}${NC}                                            ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Bit Rate:        ${GREEN}${BITRATE_FMT}${NC}                                      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Duration:        ${GREEN}${DURATION_FMT}${NC}                                        ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

#===============================================================================
# STEP 2: Extract to WAV
#===============================================================================
echo -e "${YELLOW}▶ STEP 2: Extracting to WAV (24-bit, 48kHz)...${NC}"
echo ""

ffmpeg -y -i "$INPUT_FILE" \
    -vn \
    -acodec pcm_s24le \
    -ar 48000 \
    -ac 2 \
    "$OUTPUT_WAV" 2>/dev/null

WAV_SIZE=$(ls -lh "$OUTPUT_WAV" | awk '{print $5}')
echo -e "${GREEN}  ✓ WAV created: ${OUTPUT_WAV} (${WAV_SIZE})${NC}"
echo ""

#===============================================================================
# STEP 3: Extract to MP3
#===============================================================================
echo -e "${YELLOW}▶ STEP 3: Extracting to MP3 (320kbps)...${NC}"
echo ""

ffmpeg -y -i "$INPUT_FILE" \
    -vn \
    -acodec libmp3lame \
    -b:a 320k \
    -q:a 0 \
    "$OUTPUT_MP3" 2>/dev/null

MP3_SIZE=$(ls -lh "$OUTPUT_MP3" | awk '{print $5}')
echo -e "${GREEN}  ✓ MP3 created: ${OUTPUT_MP3} (${MP3_SIZE})${NC}"
echo ""

#===============================================================================
# Summary
#===============================================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ CONVERSION COMPLETE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${WHITE}  Output Files:${NC}"
echo -e "  📁 ${GREEN}$OUTPUT_WAV${NC} (${WAV_SIZE})"
echo -e "  📁 ${GREEN}$OUTPUT_MP3${NC} (${MP3_SIZE})"
echo ""
echo -e "${MAGENTA}  🎧 Audio extracted and ready for mixing!${NC}"
echo -e "${YELLOW}  💡 Tip: Run 'npm run ceo:mix-master -- --fileName \"${FILENAME}.wav\"' to master${NC}"
echo ""
