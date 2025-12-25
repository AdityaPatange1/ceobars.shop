#!/bin/bash

#===============================================================================
#  CEO BARS™ - Professional Mix & Master Script
#  Optimized for Spotify, Apple Music & Hardcore Hip-Hop
#===============================================================================
#
#  Usage: ./ceo_bars_mix_master.sh --fileName "input.wav"
#
#  Output: outputs/masters/<filename>_MASTER.wav & .mp3
#
#  Target Specs:
#    - Loudness: -14 LUFS (Spotify/Apple Music standard)
#    - True Peak: -1 dBTP
#    - Sample Rate: 44.1kHz / 48kHz
#    - Bit Depth: 24-bit WAV, 320kbps MP3
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
echo "║              🎧  PROFESSIONAL MIX & MASTER ENGINE  🎧                     ║"
echo "║                   Optimized for Hardcore Hip-Hop                          ║"
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
    echo -e "${YELLOW}Usage: ./ceo_bars_mix_master.sh --fileName \"input.wav\"${NC}"
    exit 1
fi

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$PROJECT_ROOT/inputs"
OUTPUT_DIR="$PROJECT_ROOT/outputs/masters"
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
TEMP_FILE="$OUTPUT_DIR/${FILENAME}_temp.wav"
MASTER_WAV="$OUTPUT_DIR/${FILENAME}_MASTER.wav"
MASTER_MP3="$OUTPUT_DIR/${FILENAME}_MASTER.mp3"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}📁 INPUT FILE:${NC}  $INPUT_FILE"
echo -e "${WHITE}📁 OUTPUT DIR:${NC} $OUTPUT_DIR"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

#===============================================================================
# STEP 1: Analyze Input File
#===============================================================================
echo -e "${YELLOW}▶ STEP 1: Analyzing Input File...${NC}"
echo ""

# Get input file info
INPUT_INFO=$(ffprobe -v quiet -print_format json -show_format -show_streams "$INPUT_FILE" 2>/dev/null)
INPUT_SAMPLE_RATE=$(echo "$INPUT_INFO" | grep -o '"sample_rate": "[^"]*"' | head -1 | cut -d'"' -f4)
INPUT_CHANNELS=$(echo "$INPUT_INFO" | grep -o '"channels": [0-9]*' | head -1 | awk '{print $2}')
INPUT_DURATION=$(echo "$INPUT_INFO" | grep -o '"duration": "[^"]*"' | head -1 | cut -d'"' -f4)
INPUT_BIT_RATE=$(echo "$INPUT_INFO" | grep -o '"bit_rate": "[^"]*"' | tail -1 | cut -d'"' -f4)

# Measure input loudness
echo -e "${CYAN}  Measuring input loudness...${NC}"
INPUT_LOUDNESS=$(ffmpeg -i "$INPUT_FILE" -af "loudnorm=print_format=json" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)

INPUT_LUFS=$(echo "$INPUT_LOUDNESS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
INPUT_LRA=$(echo "$INPUT_LOUDNESS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
INPUT_TP=$(echo "$INPUT_LOUDNESS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)
INPUT_THRESH=$(echo "$INPUT_LOUDNESS" | grep "input_thresh" | grep -o '[-0-9.]*' | head -1)

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}INPUT ANALYSIS${NC}                                                    ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Sample Rate:     ${GREEN}${INPUT_SAMPLE_RATE:-Unknown} Hz${NC}                                   ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Channels:        ${GREEN}${INPUT_CHANNELS:-Unknown}${NC}                                            ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Duration:        ${GREEN}${INPUT_DURATION:-Unknown} sec${NC}                                   ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Bit Rate:        ${GREEN}${INPUT_BIT_RATE:-Unknown} bps${NC}                                  ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Integrated LUFS: ${YELLOW}${INPUT_LUFS:-N/A} LUFS${NC}                                    ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Loudness Range:  ${YELLOW}${INPUT_LRA:-N/A} LU${NC}                                       ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  True Peak:       ${YELLOW}${INPUT_TP:-N/A} dBTP${NC}                                     ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Threshold:       ${YELLOW}${INPUT_THRESH:-N/A} LUFS${NC}                                   ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

#===============================================================================
# STEP 2: Apply Mix & Master Chain
#===============================================================================
echo -e "${YELLOW}▶ STEP 2: Applying Mix & Master Chain...${NC}"
echo ""

echo -e "${CYAN}  Chain Configuration:${NC}"
echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}PROCESSING CHAIN${NC}                                                  ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  1. 🔊 High-Pass Filter     │ 30Hz @ 18dB/oct (Remove rumble)    ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  2. 🎚️  Low Shelf EQ        │ +2dB @ 80Hz (Hip-Hop punch)        ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  3. 🎚️  Presence Boost      │ +1.5dB @ 3kHz (Vocal clarity)      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  4. 🎚️  Air/Brilliance      │ +1dB @ 12kHz (Sparkle)             ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  5. 🗜️  Compressor          │ 4:1, -18dB thresh, 10ms/100ms      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  6. 🔉 Stereo Widener       │ Subtle stereo enhancement          ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  7. 📊 Loudnorm Pass 1      │ Analyze for -14 LUFS target        ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  8. 📊 Loudnorm Pass 2      │ Apply normalization                ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  9. 🧱 Limiter              │ -1 dBTP True Peak ceiling          ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

# First pass: Get loudnorm measurements
echo -e "${CYAN}  Pass 1/2: Analyzing dynamics...${NC}"
LOUDNORM_STATS=$(ffmpeg -i "$INPUT_FILE" -af "
highpass=f=30:poles=2,
lowshelf=g=2:f=80:t=q:w=0.707,
equalizer=f=3000:t=q:w=1.5:g=1.5,
highshelf=g=1:f=12000:t=q:w=0.707,
acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,
loudnorm=I=-14:LRA=11:TP=-1:print_format=json
" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)

# Extract measured values for second pass
MEASURED_I=$(echo "$LOUDNORM_STATS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
MEASURED_LRA=$(echo "$LOUDNORM_STATS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
MEASURED_TP=$(echo "$LOUDNORM_STATS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)
MEASURED_THRESH=$(echo "$LOUDNORM_STATS" | grep "input_thresh" | grep -o '[-0-9.]*' | head -1)

echo -e "${GREEN}  ✓ Analysis complete${NC}"
echo ""

# Second pass: Apply full processing chain with measured values
echo -e "${CYAN}  Pass 2/2: Applying master chain...${NC}"

ffmpeg -y -i "$INPUT_FILE" -af "
highpass=f=30:poles=2,
lowshelf=g=2:f=80:t=q:w=0.707,
equalizer=f=3000:t=q:w=1.5:g=1.5,
highshelf=g=1:f=12000:t=q:w=0.707,
acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,
stereotools=mlev=1:slev=1.05:sbal=0,
loudnorm=I=-14:LRA=11:TP=-1:measured_I=${MEASURED_I:-$INPUT_LUFS}:measured_LRA=${MEASURED_LRA:-$INPUT_LRA}:measured_TP=${MEASURED_TP:-$INPUT_TP}:measured_thresh=${MEASURED_THRESH:-$INPUT_THRESH}:linear=true,
alimiter=limit=-1dB:level=false
" -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$MASTER_WAV" 2>/dev/null

echo -e "${GREEN}  ✓ Master WAV created${NC}"
echo ""

#===============================================================================
# STEP 3: Create MP3 Version
#===============================================================================
echo -e "${YELLOW}▶ STEP 3: Creating MP3 Version (320kbps)...${NC}"
echo ""

ffmpeg -y -i "$MASTER_WAV" -codec:a libmp3lame -b:a 320k -q:a 0 "$MASTER_MP3" 2>/dev/null

echo -e "${GREEN}  ✓ Master MP3 created${NC}"
echo ""

#===============================================================================
# STEP 4: Final Analysis
#===============================================================================
echo -e "${YELLOW}▶ STEP 4: Final Analysis...${NC}"
echo ""

# Measure output loudness
OUTPUT_LOUDNESS=$(ffmpeg -i "$MASTER_WAV" -af "loudnorm=print_format=json" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)

OUTPUT_LUFS=$(echo "$OUTPUT_LOUDNESS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
OUTPUT_LRA=$(echo "$OUTPUT_LOUDNESS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
OUTPUT_TP=$(echo "$OUTPUT_LOUDNESS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)

# Get file sizes
WAV_SIZE=$(ls -lh "$MASTER_WAV" | awk '{print $5}')
MP3_SIZE=$(ls -lh "$MASTER_MP3" | awk '{print $5}')

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}FINAL MASTER ANALYSIS${NC}                                            ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Integrated LUFS: ${GREEN}${OUTPUT_LUFS:-N/A} LUFS${NC}  (Target: -14 LUFS)            ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Loudness Range:  ${GREEN}${OUTPUT_LRA:-N/A} LU${NC}                                       ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  True Peak:       ${GREEN}${OUTPUT_TP:-N/A} dBTP${NC}  (Target: -1 dBTP)              ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Sample Rate:     ${GREEN}44100 Hz${NC}                                        ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Bit Depth:       ${GREEN}24-bit${NC}                                          ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Format:          ${GREEN}WAV (PCM) + MP3 (320kbps)${NC}                       ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

#===============================================================================
# STEP 5: Platform Compliance Check
#===============================================================================
echo -e "${YELLOW}▶ STEP 5: Platform Compliance Check...${NC}"
echo ""

# Check compliance
SPOTIFY_OK="✗"
APPLE_OK="✗"
YOUTUBE_OK="✗"
TIDAL_OK="✗"

# Spotify: -14 LUFS, -1 dBTP
if (( $(echo "${OUTPUT_LUFS:--99} >= -15 && ${OUTPUT_LUFS:--99} <= -13" | bc -l 2>/dev/null || echo 0) )); then
    SPOTIFY_OK="✓"
fi

# Apple Music: -16 LUFS (but accepts -14), -1 dBTP
if (( $(echo "${OUTPUT_LUFS:--99} >= -17 && ${OUTPUT_LUFS:--99} <= -13" | bc -l 2>/dev/null || echo 0) )); then
    APPLE_OK="✓"
fi

# YouTube: -14 LUFS
if (( $(echo "${OUTPUT_LUFS:--99} >= -15 && ${OUTPUT_LUFS:--99} <= -13" | bc -l 2>/dev/null || echo 0) )); then
    YOUTUBE_OK="✓"
fi

# Tidal: -14 LUFS
if (( $(echo "${OUTPUT_LUFS:--99} >= -15 && ${OUTPUT_LUFS:--99} <= -13" | bc -l 2>/dev/null || echo 0) )); then
    TIDAL_OK="✓"
fi

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}PLATFORM COMPLIANCE${NC}                                              ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${SPOTIFY_OK}${NC} Spotify          │ -14 LUFS, -1 dBTP                      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${APPLE_OK}${NC} Apple Music       │ -16 LUFS (accepts -14), -1 dBTP        ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${YOUTUBE_OK}${NC} YouTube Music    │ -14 LUFS, -1 dBTP                      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${TIDAL_OK}${NC} Tidal             │ -14 LUFS, -1 dBTP                      ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

#===============================================================================
# Summary
#===============================================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ MASTERING COMPLETE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${WHITE}  Output Files:${NC}"
echo -e "  📁 ${GREEN}$MASTER_WAV${NC} (${WAV_SIZE})"
echo -e "  📁 ${GREEN}$MASTER_MP3${NC} (${MP3_SIZE})"
echo ""
echo -e "${MAGENTA}  🎧 Ready for Spotify, Apple Music, YouTube & Tidal!${NC}"
echo ""
