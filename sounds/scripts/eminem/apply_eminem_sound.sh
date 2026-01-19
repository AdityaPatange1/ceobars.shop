#!/bin/bash
#===============================================================================
#  EMINEM SOUND APPLICATION SYSTEM
#  Apply Eminem's Production Sound Genome to Your Tracks
#===============================================================================
#
#  Smart track search with interactive selection.
#
#  Usage:
#    npm run apply-sound:eminem "track title"
#    npm run apply-sound:eminem "boonsday"
#    npm run apply-sound:eminem "freestyle"
#
#  The script will:
#    1. Search all masters for matching tracks (regex/fuzzy)
#    2. If multiple matches, show interactive selection
#    3. Apply Eminem production signature to selected track
#
#  Output: sounds/outputs/master_em_sound_genz.wav and .mp3
#
#===============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
SOUNDS_ROOT="$PROJECT_ROOT/sounds"
OUTPUT_DIR="$SOUNDS_ROOT/outputs"
GENOME_FILE="$OUTPUT_DIR/eminem_production_sound_genome.json"

# Output file names
OUTPUT_WAV="$OUTPUT_DIR/master_em_sound_genz.wav"
OUTPUT_MP3="$OUTPUT_DIR/master_em_sound_genz.mp3"

# Directories to search for masters
SEARCH_DIRS=(
    "$PROJECT_ROOT/outputs/masters"
    "$PROJECT_ROOT/public/assets"
    "$PROJECT_ROOT/inputs"
    "$PROJECT_ROOT/inputs/nickel9-audio"
    "$PROJECT_ROOT/outputs/youtube-downloads"
)

# Banner
echo -e "${MAGENTA}"
echo "================================================================================"
echo "                                                                                "
echo "    ███████╗███╗   ███╗██╗███╗   ██╗███████╗███╗   ███╗                         "
echo "    ██╔════╝████╗ ████║██║████╗  ██║██╔════╝████╗ ████║                         "
echo "    █████╗  ██╔████╔██║██║██╔██╗ ██║█████╗  ██╔████╔██║                         "
echo "    ██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██║╚██╔╝██║                         "
echo "    ███████╗██║ ╚═╝ ██║██║██║ ╚████║███████╗██║ ╚═╝ ██║                         "
echo "    ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝                         "
echo "                                                                                "
echo "              SOUND APPLICATION - EMINEM PRODUCTION MODE                        "
echo "                  Transform Your Track Like Em                                  "
echo "                                                                                "
echo "================================================================================"
echo -e "${NC}"

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is required${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is required${NC}"
    exit 1
fi

# Check for genome file
if [ ! -f "$GENOME_FILE" ]; then
    echo -e "${RED}Error: Eminem production genome not found${NC}"
    echo -e "${YELLOW}Run first: npm run reverse-engineer:eminem-production${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Eminem production genome loaded${NC}"
echo ""

# Get search query
SEARCH_QUERY="$1"

if [ -z "$SEARCH_QUERY" ]; then
    echo -e "${RED}Error: Please provide a track title to search${NC}"
    echo ""
    echo -e "${WHITE}Usage:${NC}"
    echo "  npm run apply-sound:eminem \"track title\""
    echo ""
    echo -e "${WHITE}Examples:${NC}"
    echo "  npm run apply-sound:eminem \"boonsday\""
    echo "  npm run apply-sound:eminem \"freestyle\""
    echo "  npm run apply-sound:eminem \"tokyo drift\""
    exit 1
fi

echo -e "${CYAN}[SEARCH] Searching for: ${WHITE}$SEARCH_QUERY${NC}"
echo ""

# Build case-insensitive regex pattern
# Convert spaces to .* for fuzzy matching
PATTERN=$(echo "$SEARCH_QUERY" | sed 's/ /.*/g')

# Find matching audio files
MATCHES=()
while IFS= read -r file; do
    if [ -n "$file" ]; then
        MATCHES+=("$file")
    fi
done < <(find "${SEARCH_DIRS[@]}" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.flac" -o -name "*.m4a" \) 2>/dev/null | grep -iE "$PATTERN" | sort -u)

# Check results
if [ ${#MATCHES[@]} -eq 0 ]; then
    echo -e "${RED}No tracks found matching: ${WHITE}$SEARCH_QUERY${NC}"
    echo ""
    echo -e "${YELLOW}Try a different search term or check available tracks:${NC}"
    echo "  ls outputs/masters/"
    echo "  ls inputs/"
    exit 1
fi

# Display matches and select
INPUT_FILE=""

if [ ${#MATCHES[@]} -eq 1 ]; then
    # Single match - use it directly
    INPUT_FILE="${MATCHES[0]}"
    echo -e "${GREEN}[FOUND] Single match:${NC}"
    echo -e "  ${CYAN}$(basename "$INPUT_FILE")${NC}"
    echo ""
else
    # Multiple matches - show selection menu
    echo -e "${YELLOW}[FOUND] ${#MATCHES[@]} matching tracks:${NC}"
    echo ""
    echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Display options with numbers
    i=1
    for match in "${MATCHES[@]}"; do
        BASENAME=$(basename "$match")
        DIRNAME=$(dirname "$match" | sed "s|$PROJECT_ROOT/||")
        echo -e "  ${GREEN}[$i]${NC} $BASENAME"
        echo -e "      ${BLUE}$DIRNAME${NC}"
        ((i++))
    done

    echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Check if fzf is available for better UX
    if command -v fzf &> /dev/null; then
        echo -e "${CYAN}Select track (use arrow keys, Enter to confirm):${NC}"
        echo ""

        # Use fzf for selection
        SELECTED=$(printf '%s\n' "${MATCHES[@]}" | while read -r f; do
            echo "$(basename "$f") | $(dirname "$f" | sed "s|$PROJECT_ROOT/||")"
        done | fzf --height=15 --reverse --prompt="Track > " --header="Select track to apply Eminem sound")

        if [ -z "$SELECTED" ]; then
            echo -e "${RED}No track selected. Exiting.${NC}"
            exit 1
        fi

        # Extract the filename from selection and find the full path
        SELECTED_NAME=$(echo "$SELECTED" | cut -d'|' -f1 | xargs)
        for match in "${MATCHES[@]}"; do
            if [ "$(basename "$match")" = "$SELECTED_NAME" ]; then
                INPUT_FILE="$match"
                break
            fi
        done
    else
        # Fallback to simple numbered selection
        echo -e "${CYAN}Enter track number [1-${#MATCHES[@]}]:${NC} "
        read -r SELECTION

        # Validate selection
        if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#MATCHES[@]} ]; then
            echo -e "${RED}Invalid selection. Exiting.${NC}"
            exit 1
        fi

        INPUT_FILE="${MATCHES[$((SELECTION-1))]}"
    fi

    echo ""
    echo -e "${GREEN}[SELECTED] $(basename "$INPUT_FILE")${NC}"
fi

echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Extract FFmpeg chain from genome file
echo -e "${CYAN}[EXTRACT] Reading Eminem production signature...${NC}"

export GENOME_FILE
FFMPEG_CHAIN=$(python3 -c "
import json
import os

genome_file = os.environ.get('GENOME_FILE')
with open(genome_file, 'r') as f:
    genome = json.load(f)

chain = genome.get('ffmpeg_processing_chain', {}).get('full_chain', '')
if not chain:
    chain = (
        'highpass=f=30:poles=2,'
        'lowshelf=g=3:f=60:t=q:w=0.5,'
        'equalizer=f=150:t=q:w=1:g=2,'
        'equalizer=f=400:t=q:w=1.5:g=-1,'
        'equalizer=f=1000:t=q:w=2:g=0.5,'
        'equalizer=f=3000:t=q:w=1.5:g=2,'
        'equalizer=f=5000:t=q:w=2:g=1.5,'
        'highshelf=g=1:f=10000:t=q:w=0.707,'
        'acompressor=threshold=-15dB:ratio=5:attack=8:release=80:makeup=3,'
        'stereotools=mlev=1:slev=1.05:sbal=0,'
        'loudnorm=I=-14:LRA=11:TP=-1,'
        'alimiter=limit=-1dB:level=false'
    )
print(chain)
")

if [ -z "$FFMPEG_CHAIN" ]; then
    echo -e "${RED}Error: Could not extract FFmpeg chain from genome${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] FFmpeg processing chain extracted${NC}"
echo ""

# Display processing info
echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}  EMINEM PRODUCTION SOUND MODE - Processing Configuration${NC}"
echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}  Input:${NC}  $(basename "$INPUT_FILE")"
echo -e "${CYAN}  Output:${NC} master_em_sound_genz.wav / .mp3"
echo ""
echo -e "${CYAN}  Processing Chain:${NC}"
echo -e "${YELLOW}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${YELLOW}  │${NC}  1. High-pass filter (rumble removal)                               ${YELLOW}│${NC}"
echo -e "${YELLOW}  │${NC}  2. Eminem signature EQ curve                                       ${YELLOW}│${NC}"
echo -e "${YELLOW}  │${NC}  3. Aggressive compression (Em-style dynamics)                      ${YELLOW}│${NC}"
echo -e "${YELLOW}  │${NC}  4. Stereo enhancement                                              ${YELLOW}│${NC}"
echo -e "${YELLOW}  │${NC}  5. Loudness normalization (-14 LUFS)                               ${YELLOW}│${NC}"
echo -e "${YELLOW}  │${NC}  6. Final limiting (-1 dBTP)                                        ${YELLOW}│${NC}"
echo -e "${YELLOW}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

# Analyze input
echo -e "${CYAN}[ANALYZE] Analyzing input audio...${NC}"

INPUT_INFO=$(ffprobe -v quiet -print_format json -show_format -show_streams "$INPUT_FILE" 2>/dev/null)
INPUT_DURATION=$(echo "$INPUT_INFO" | grep -o '"duration": "[^"]*"' | head -1 | cut -d'"' -f4)
INPUT_SAMPLE_RATE=$(echo "$INPUT_INFO" | grep -o '"sample_rate": "[^"]*"' | head -1 | cut -d'"' -f4)
INPUT_CHANNELS=$(echo "$INPUT_INFO" | grep -o '"channels": [0-9]*' | head -1 | awk '{print $2}')

# Get input loudness
echo -e "${CYAN}  Measuring input loudness...${NC}"
INPUT_LOUDNESS=$(ffmpeg -i "$INPUT_FILE" -af "loudnorm=print_format=json" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)
INPUT_LUFS=$(echo "$INPUT_LOUDNESS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
INPUT_TP=$(echo "$INPUT_LOUDNESS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)

DURATION_MINS=$(echo "$INPUT_DURATION" | awk '{printf "%d", $1/60}')
DURATION_SECS=$(echo "$INPUT_DURATION" | awk '{printf "%02d", int($1)%60}')

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}INPUT ANALYSIS${NC}                                                    ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  Duration:        ${GREEN}${DURATION_MINS}:${DURATION_SECS}${NC}                                          ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Sample Rate:     ${GREEN}${INPUT_SAMPLE_RATE:-Unknown} Hz${NC}                                   ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Channels:        ${GREEN}${INPUT_CHANNELS:-Unknown}${NC}                                            ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  Loudness:        ${YELLOW}${INPUT_LUFS:-N/A} LUFS${NC}                                    ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  True Peak:       ${YELLOW}${INPUT_TP:-N/A} dBTP${NC}                                     ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

# Two-pass loudnorm for accurate results
echo -e "${CYAN}[PROCESS] Pass 1/2: Analyzing for normalization...${NC}"

# First pass - get measured values
LOUDNORM_STATS=$(ffmpeg -i "$INPUT_FILE" -af "$FFMPEG_CHAIN" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)

MEASURED_I=$(echo "$LOUDNORM_STATS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
MEASURED_LRA=$(echo "$LOUDNORM_STATS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
MEASURED_TP=$(echo "$LOUDNORM_STATS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)
MEASURED_THRESH=$(echo "$LOUDNORM_STATS" | grep "input_thresh" | grep -o '[-0-9.]*' | head -1)

echo -e "${GREEN}  [OK] Analysis complete${NC}"
echo ""

# Second pass - apply with measured values
echo -e "${CYAN}[PROCESS] Pass 2/2: Applying Eminem Sound Production Mode...${NC}"

# Build the final chain with measured values for two-pass loudnorm
FINAL_CHAIN=$(echo "$FFMPEG_CHAIN" | sed "s/loudnorm=I=-14:LRA=11:TP=-1/loudnorm=I=-14:LRA=11:TP=-1:measured_I=${MEASURED_I:-$INPUT_LUFS}:measured_LRA=${MEASURED_LRA:-11}:measured_TP=${MEASURED_TP:-$INPUT_TP}:measured_thresh=${MEASURED_THRESH:--24}:linear=true/")

ffmpeg -y -i "$INPUT_FILE" -af "$FINAL_CHAIN" \
    -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$OUTPUT_WAV" 2>/dev/null

echo -e "${GREEN}  [OK] WAV master created${NC}"

# Create MP3 version
echo -e "${CYAN}[ENCODE] Creating MP3 (320kbps)...${NC}"

ffmpeg -y -i "$OUTPUT_WAV" -codec:a libmp3lame -b:a 320k -q:a 0 "$OUTPUT_MP3" 2>/dev/null

echo -e "${GREEN}  [OK] MP3 master created${NC}"
echo ""

# Final analysis
echo -e "${CYAN}[VERIFY] Final quality analysis...${NC}"

OUTPUT_LOUDNESS=$(ffmpeg -i "$OUTPUT_WAV" -af "loudnorm=print_format=json" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)
OUTPUT_LUFS=$(echo "$OUTPUT_LOUDNESS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
OUTPUT_LRA=$(echo "$OUTPUT_LOUDNESS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
OUTPUT_TP=$(echo "$OUTPUT_LOUDNESS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)

WAV_SIZE=$(ls -lh "$OUTPUT_WAV" | awk '{print $5}')
MP3_SIZE=$(ls -lh "$OUTPUT_MP3" | awk '{print $5}')

echo ""
echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}EMINEM SOUND PRODUCTION MODE - FINAL MASTER${NC}                       ${WHITE}│${NC}"
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

# Platform compliance
echo -e "${CYAN}[CHECK] Platform compliance...${NC}"

SPOTIFY_OK="[X]"
APPLE_OK="[X]"
YOUTUBE_OK="[X]"

if [ -n "$OUTPUT_LUFS" ]; then
    LUFS_CHECK=$(echo "$OUTPUT_LUFS >= -15 && $OUTPUT_LUFS <= -13" | bc -l 2>/dev/null || echo "0")
    if [ "$LUFS_CHECK" = "1" ]; then
        SPOTIFY_OK="[OK]"
        APPLE_OK="[OK]"
        YOUTUBE_OK="[OK]"
    fi
fi

echo -e "${WHITE}  ┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}  │${NC}  ${MAGENTA}STREAMING PLATFORM COMPLIANCE${NC}                                    ${WHITE}│${NC}"
echo -e "${WHITE}  ├─────────────────────────────────────────────────────────────────────┤${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${SPOTIFY_OK}${NC} Spotify          │ -14 LUFS, -1 dBTP                      ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${APPLE_OK}${NC} Apple Music       │ -16 LUFS (accepts -14), -1 dBTP        ${WHITE}│${NC}"
echo -e "${WHITE}  │${NC}  ${GREEN}${YOUTUBE_OK}${NC} YouTube Music    │ -14 LUFS, -1 dBTP                      ${WHITE}│${NC}"
echo -e "${WHITE}  └─────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

# Summary
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}  EMINEM SOUND PRODUCTION MODE COMPLETE${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""
echo -e "${WHITE}  Source Track:${NC}"
echo -e "  ${BLUE}$(basename "$INPUT_FILE")${NC}"
echo ""
echo -e "${WHITE}  Output Files:${NC}"
echo -e "  ${CYAN}$OUTPUT_WAV${NC} ($WAV_SIZE)"
echo -e "  ${CYAN}$OUTPUT_MP3${NC} ($MP3_SIZE)"
echo ""
echo -e "${MAGENTA}  Your track now has the Eminem Production Sound Signature!${NC}"
echo -e "${YELLOW}  Detroit, Michigan - 8 Mile Road Energy${NC}"
echo ""
