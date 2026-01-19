#!/bin/bash
#===============================================================================
#  EMINEM SOUND BATCH PROCESSOR
#  Apply Eminem Production Sound to Multiple Tracks
#===============================================================================
#
#  Processes all audio files in inputs/ directory with Eminem production style
#
#  Input:  All audio files in inputs/ directory
#  Output: sounds/outputs/eminem_batch/<filename>_em.wav and .mp3
#
#  Usage: ./sounds/scripts/eminem/apply_eminem_batch.sh
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
INPUT_DIR="$PROJECT_ROOT/inputs"
OUTPUT_DIR="$SOUNDS_ROOT/outputs/eminem_batch"
GENOME_FILE="$SOUNDS_ROOT/outputs/eminem_production_sound_genome.json"
APPLY_SCRIPT="$SCRIPT_DIR/apply_eminem_sound_single.sh"

# Banner
echo -e "${MAGENTA}"
echo "================================================================================"
echo "  EMINEM SOUND BATCH PROCESSOR"
echo "  Military-Grade Mass Production Mode"
echo "================================================================================"
echo -e "${NC}"

# Check for genome file
if [ ! -f "$GENOME_FILE" ]; then
    echo -e "${RED}Error: Eminem production genome not found${NC}"
    echo -e "${YELLOW}Run first: npm run reverse-engineer:eminem-production${NC}"
    exit 1
fi

# Find all input files
mkdir -p "$INPUT_DIR"
mkdir -p "$OUTPUT_DIR"

TRACKS=()
while IFS= read -r -d $'\0' file; do
    TRACKS+=("$file")
done < <(find "$INPUT_DIR" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.flac" -o -name "*.m4a" \) -print0 2>/dev/null)

if [ ${#TRACKS[@]} -eq 0 ]; then
    echo -e "${RED}Error: No audio files found in inputs/ directory${NC}"
    echo -e "${YELLOW}Place your audio files in: $INPUT_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}Found ${#TRACKS[@]} tracks to process${NC}"
echo ""

# Extract FFmpeg chain once
export GENOME_FILE
FFMPEG_CHAIN=$(python3 -c "
import json
import os
with open(os.environ['GENOME_FILE'], 'r') as f:
    genome = json.load(f)
chain = genome.get('ffmpeg_processing_chain', {}).get('full_chain', '')
if not chain:
    chain = 'highpass=f=30:poles=2,lowshelf=g=3:f=60:t=q:w=0.5,equalizer=f=150:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1.5:g=2,acompressor=threshold=-15dB:ratio=5:attack=8:release=80:makeup=3,stereotools=mlev=1:slev=1.05:sbal=0,loudnorm=I=-14:LRA=11:TP=-1,alimiter=limit=-1dB:level=false'
print(chain)
")

TOTAL=${#TRACKS[@]}
CURRENT=0
SUCCESS=0
FAILED=0

for INPUT_FILE in "${TRACKS[@]}"; do
    ((CURRENT++))
    BASENAME=$(basename "$INPUT_FILE")
    FILENAME="${BASENAME%.*}"

    OUTPUT_WAV="$OUTPUT_DIR/${FILENAME}_em.wav"
    OUTPUT_MP3="$OUTPUT_DIR/${FILENAME}_em.mp3"

    echo -e "${CYAN}[$CURRENT/$TOTAL] Processing: ${WHITE}$BASENAME${NC}"

    # Get loudnorm measurements
    LOUDNORM_STATS=$(ffmpeg -i "$INPUT_FILE" -af "$FFMPEG_CHAIN" -f null - 2>&1 | grep -A 20 "Parsed_loudnorm" | tail -15)
    MEASURED_I=$(echo "$LOUDNORM_STATS" | grep "input_i" | grep -o '[-0-9.]*' | head -1)
    MEASURED_LRA=$(echo "$LOUDNORM_STATS" | grep "input_lra" | grep -o '[-0-9.]*' | head -1)
    MEASURED_TP=$(echo "$LOUDNORM_STATS" | grep "input_tp" | grep -o '[-0-9.]*' | head -1)
    MEASURED_THRESH=$(echo "$LOUDNORM_STATS" | grep "input_thresh" | grep -o '[-0-9.]*' | head -1)

    # Build final chain with two-pass loudnorm
    FINAL_CHAIN=$(echo "$FFMPEG_CHAIN" | sed "s/loudnorm=I=-14:LRA=11:TP=-1/loudnorm=I=-14:LRA=11:TP=-1:measured_I=${MEASURED_I:--14}:measured_LRA=${MEASURED_LRA:-11}:measured_TP=${MEASURED_TP:--1}:measured_thresh=${MEASURED_THRESH:--24}:linear=true/")

    # Process
    if ffmpeg -y -i "$INPUT_FILE" -af "$FINAL_CHAIN" -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$OUTPUT_WAV" 2>/dev/null; then
        ffmpeg -y -i "$OUTPUT_WAV" -codec:a libmp3lame -b:a 320k -q:a 0 "$OUTPUT_MP3" 2>/dev/null
        echo -e "${GREEN}  [OK] Completed${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}  [FAIL] Error processing${NC}"
        ((FAILED++))
    fi
done

echo ""
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}  BATCH PROCESSING COMPLETE${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""
echo -e "${WHITE}  Processed: $TOTAL tracks${NC}"
echo -e "${GREEN}  Success:   $SUCCESS${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}  Failed:    $FAILED${NC}"
fi
echo ""
echo -e "${WHITE}  Output Directory: ${CYAN}$OUTPUT_DIR${NC}"
echo ""
