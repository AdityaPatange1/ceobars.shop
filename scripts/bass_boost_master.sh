#!/bin/bash
#
# Bass Boost Mix/Master Chain
# Extracts audio from video, applies bass boost and professional mastering
#
# Usage: ./scripts/bass_boost_master.sh <input_video> <output_name> [--ht9] [--alien]
#
# Options:
#   --ht9    HT9 MODE: Maximum bass boost for powerful hearts and chakras
#   --alien  ALIEN TUNING: Extraterrestrial frequency modulation
#

set -e

# Parse arguments
INPUT_VIDEO=""
OUTPUT_NAME=""
HT9_MODE=false
ALIEN_TUNING=false

for arg in "$@"; do
    case $arg in
        --ht9)
            HT9_MODE=true
            ;;
        --alien)
            ALIEN_TUNING=true
            ;;
        *)
            if [ -z "$INPUT_VIDEO" ]; then
                INPUT_VIDEO="$arg"
            elif [ -z "$OUTPUT_NAME" ]; then
                OUTPUT_NAME="$arg"
            fi
            ;;
    esac
done

if [ -z "$INPUT_VIDEO" ] || [ -z "$OUTPUT_NAME" ]; then
    echo "Usage: $0 <input_video> <output_name> [--ht9] [--alien]"
    echo ""
    echo "Options:"
    echo "  --ht9    HT9 MODE: Maximum bass boost (full blast lower frequencies)"
    echo "  --alien  ALIEN TUNING: Extraterrestrial frequency modulation"
    echo ""
    echo "Example: $0 inputs/videos/track.mov hopzen-freestyle"
    echo "Example: $0 inputs/videos/track.mov hopzen-bass-boost --ht9 --alien"
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/outputs/masters/$OUTPUT_NAME"

echo ""
echo "======================================================================"
if [ "$HT9_MODE" = true ]; then
    echo "  CEO BARS - HT9 MAXIMUM BASS BOOST Mix/Master Chain"
else
    echo "  CEO BARS - Bass Boost Mix/Master Chain"
fi
echo "======================================================================"
echo ""
echo "Input: $INPUT_VIDEO"
echo "Output: $OUTPUT_DIR"
if [ "$HT9_MODE" = true ]; then
    echo "Mode: HT9 MAXIMUM BASS (Full Blast Heart Pump)"
fi
if [ "$ALIEN_TUNING" = true ]; then
    echo "Mode: ALIEN TUNING (Extraterrestrial Frequencies)"
fi
echo ""

# Check if input exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input file not found: $INPUT_VIDEO"
    exit 1
fi

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "[1/5] Extracting audio from video..."
ffmpeg -y -i "$INPUT_VIDEO" -vn -acodec pcm_s24le -ar 48000 -ac 2 "$OUTPUT_DIR/raw.wav" 2>/dev/null

echo "[2/5] Analyzing loudness..."
# First pass - analyze loudness
LOUDNORM_OUTPUT=$(ffmpeg -i "$OUTPUT_DIR/raw.wav" -af \
    'loudnorm=I=-14:LRA=11:TP=-1:print_format=json' \
    -f null - 2>&1 | grep -A 20 '{' | head -21)

MEASURED_I=$(echo "$LOUDNORM_OUTPUT" | grep -o '"input_i" : "[^"]*"' | cut -d'"' -f4 || echo "-14")
MEASURED_LRA=$(echo "$LOUDNORM_OUTPUT" | grep -o '"input_lra" : "[^"]*"' | cut -d'"' -f4 || echo "11")
MEASURED_TP=$(echo "$LOUDNORM_OUTPUT" | grep -o '"input_tp" : "[^"]*"' | cut -d'"' -f4 || echo "-1")
MEASURED_THRESH=$(echo "$LOUDNORM_OUTPUT" | grep -o '"input_thresh" : "[^"]*"' | cut -d'"' -f4 || echo "-24")

echo "   Measured I: $MEASURED_I LUFS"
echo "   Measured LRA: $MEASURED_LRA LU"
echo "   Measured TP: $MEASURED_TP dB"

# Build the filter chain based on mode
if [ "$HT9_MODE" = true ]; then
    echo "[3/5] Applying HT9 MAXIMUM BASS BOOST chain..."
    # HT9 MAXIMUM BASS BOOST Chain:
    # 1. highpass=f=20 - Ultra-low cut only (preserve maximum sub-bass)
    # 2. lowshelf=g=12:f=40 - MASSIVE sub-bass boost at 40Hz (+12dB)
    # 3. lowshelf=g=10:f=60 - POWERFUL bass boost at 60Hz (+10dB)
    # 4. lowshelf=g=8:f=100 - Strong low-mid warmth at 100Hz (+8dB)
    # 5. equalizer=f=150:t=q:w=0.8:g=6 - Sub-bass punch at 150Hz (+6dB)
    # 6. equalizer=f=200:t=q:w=1:g=4 - Bass body at 200Hz (+4dB)
    # 7. equalizer=f=3000:t=q:w=1.5:g=2 - Presence boost
    # 8. highshelf=g=1:f=12000 - Air/sparkle
    # 9. acompressor - Heavy compression for pump effect
    # 10. bass=g=6 - Additional bass boost
    # 11. loudnorm - Two-pass loudness normalization
    # 12. alimiter - Final limiting

    BASS_CHAIN="highpass=f=20:poles=2,\
lowshelf=g=12:f=40:t=q:w=0.5,\
lowshelf=g=10:f=60:t=q:w=0.6,\
lowshelf=g=8:f=100:t=q:w=0.707,\
equalizer=f=150:t=q:w=0.8:g=6,\
equalizer=f=200:t=q:w=1:g=4,\
equalizer=f=3000:t=q:w=1.5:g=2,\
highshelf=g=1:f=12000:t=q:w=0.707,\
acompressor=threshold=-12dB:ratio=6:attack=5:release=50:makeup=4,\
bass=g=6:f=100:t=q:w=0.5"
else
    echo "[3/5] Applying BASS BOOST mix/master chain..."
    # Standard Bass Boost Mix/Master Chain:
    # 1. highpass=f=25 - Remove ultra-low rumble
    # 2. lowshelf=g=6:f=60 - POWERFUL bass boost at 60Hz (+6dB)
    # 3. lowshelf=g=4:f=100 - Additional low-mid warmth at 100Hz (+4dB)
    # 4. equalizer=f=150:t=q:w=1:g=2 - Sub-bass punch at 150Hz
    # 5. equalizer=f=3000:t=q:w=1.5:g=1.5 - Presence boost
    # 6. highshelf=g=1:f=12000 - Air/sparkle
    # 7. acompressor - Dynamic control

    BASS_CHAIN="highpass=f=25:poles=2,\
lowshelf=g=6:f=60:t=q:w=0.707,\
lowshelf=g=4:f=100:t=q:w=0.707,\
equalizer=f=150:t=q:w=1:g=2,\
equalizer=f=3000:t=q:w=1.5:g=1.5,\
highshelf=g=1:f=12000:t=q:w=0.707,\
acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2"
fi

# Add alien tuning if enabled
if [ "$ALIEN_TUNING" = true ]; then
    echo "   Adding ALIEN TUNING frequencies..."
    # Alien Tuning Chain:
    # 1. vibrato - Subtle frequency wobble (extraterrestrial modulation)
    # 2. chorus - Spatial widening with alien harmonics
    # 3. flanger - Phase shifting for otherworldly texture
    # 4. equalizer at 432Hz - "Universal frequency" boost
    # 5. equalizer at 528Hz - "DNA repair frequency" boost
    # 6. aphaser - Psychoacoustic phase effects

    ALIEN_CHAIN=",vibrato=f=3:d=0.1,\
chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3,\
equalizer=f=432:t=q:w=2:g=3,\
equalizer=f=528:t=q:w=2:g=2,\
aphaser=type=t:speed=0.5:decay=0.3"
    BASS_CHAIN="${BASS_CHAIN}${ALIEN_CHAIN}"
fi

# Add stereo widening and final processing
FINAL_CHAIN="${BASS_CHAIN},\
stereotools=mlev=1:slev=1.05:sbal=0,\
loudnorm=I=-14:LRA=11:TP=-1:measured_I=${MEASURED_I:-"-14"}:measured_LRA=${MEASURED_LRA:-"11"}:measured_TP=${MEASURED_TP:-"-1"}:measured_thresh=${MEASURED_THRESH:-"-24"}:linear=true,\
alimiter=limit=-1dB:level=false"

ffmpeg -y -i "$OUTPUT_DIR/raw.wav" -af "$FINAL_CHAIN" \
    -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$OUTPUT_DIR/master.wav" 2>/dev/null

echo "[4/5] Creating MP3 (320kbps)..."
ffmpeg -y -i "$OUTPUT_DIR/master.wav" -codec:a libmp3lame -b:a 320k -q:a 0 "$OUTPUT_DIR/master.mp3" 2>/dev/null

echo "[5/5] Cleaning up..."
rm -f "$OUTPUT_DIR/raw.wav"

# Get duration
DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp3" 2>/dev/null)
MINS=$(echo "$DURATION" | awk '{printf "%d", $1/60}')
SECS=$(echo "$DURATION" | awk '{printf "%02d", int($1)%60}')

echo ""
echo "======================================================================"
if [ "$HT9_MODE" = true ]; then
    echo "  HT9 MAXIMUM BASS BOOST Complete!"
else
    echo "  Bass Boost Master Complete!"
fi
if [ "$ALIEN_TUNING" = true ]; then
    echo "  ALIEN TUNING Applied!"
fi
echo "  Duration: ${MINS}:${SECS}"
echo "  Output: $OUTPUT_DIR/master.mp3"
echo "  Output: $OUTPUT_DIR/master.wav"
echo "======================================================================"
echo ""
