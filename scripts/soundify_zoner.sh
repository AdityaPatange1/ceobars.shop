#!/bin/bash
#
# SOUNDIFY ZONER - Speech to Hip Hop Transformer
# Transforms speeches and public talks into Hip Hop tracks
# Layers drums, kicks, slaps, punches adjusted to speech tempo
#
# Usage: ./scripts/soundify_zoner.sh <input_audio> <output_name> [--mode]
#
# Modes:
#   --bomb       Heavy hitting, aggressive drums with punch
#   --lowfi      Smooth, dusty, lo-fi hip hop vibes
#   --laien      Mystic, ethereal, spiritual frequencies
#   --freqshoot  Sharp, crisp, frequency-focused mix
#   --korn       Metal-inspired, distorted, heavy
#
# Optimized for clear speech listening with hip hop energy
#

set -e

# Parse arguments
INPUT_AUDIO=""
OUTPUT_NAME=""
MODE="standard"

for arg in "$@"; do
    case $arg in
        --bomb)
            MODE="bomb"
            ;;
        --lowfi)
            MODE="lowfi"
            ;;
        --laien)
            MODE="laien"
            ;;
        --freqshoot)
            MODE="freqshoot"
            ;;
        --korn)
            MODE="korn"
            ;;
        *)
            if [ -z "$INPUT_AUDIO" ]; then
                INPUT_AUDIO="$arg"
            elif [ -z "$OUTPUT_NAME" ]; then
                OUTPUT_NAME="$arg"
            fi
            ;;
    esac
done

if [ -z "$INPUT_AUDIO" ] || [ -z "$OUTPUT_NAME" ]; then
    echo "Usage: $0 <input_audio> <output_name> [--mode]"
    echo ""
    echo "Modes:"
    echo "  --bomb       Heavy hitting, aggressive drums with punch"
    echo "  --lowfi      Smooth, dusty, lo-fi hip hop vibes"
    echo "  --laien      Mystic, ethereal, spiritual frequencies"
    echo "  --freqshoot  Sharp, crisp, frequency-focused mix"
    echo "  --korn       Metal-inspired, distorted, heavy"
    echo ""
    echo "Example: $0 inputs/speech.mp3 speech-remix --lowfi"
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/outputs/masters/$OUTPUT_NAME"
TEMP_DIR="$OUTPUT_DIR/temp"

# Mode display names
get_mode_name() {
    case $1 in
        standard) echo "STANDARD" ;;
        bomb) echo "BOMB (Heavy Punch)" ;;
        lowfi) echo "LO-FI (Dusty Smooth)" ;;
        laien) echo "LAIEN (Mystic)" ;;
        freqshoot) echo "FREQSHOOT (Crisp)" ;;
        korn) echo "KORN (Metal)" ;;
        *) echo "STANDARD" ;;
    esac
}

MODE_NAME=$(get_mode_name "$MODE")

echo ""
echo "======================================================================"
echo "  SOUNDIFY ZONER - Speech to Hip Hop Transformer"
echo "======================================================================"
echo ""
echo "Input: $INPUT_AUDIO"
echo "Output: $OUTPUT_DIR"
echo "Mode: $MODE_NAME"
echo ""

# Check if input exists
if [ ! -f "$INPUT_AUDIO" ]; then
    echo "Error: Input file not found: $INPUT_AUDIO"
    exit 1
fi

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    exit 1
fi

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

echo "[1/8] Extracting and normalizing speech..."
# Convert input to WAV, normalize, and prepare for processing
ffmpeg -y -i "$INPUT_AUDIO" -vn -acodec pcm_s24le -ar 48000 -ac 2 "$TEMP_DIR/speech_raw.wav" 2>/dev/null

# Get duration
DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$TEMP_DIR/speech_raw.wav" 2>/dev/null)
DURATION_INT=$(echo "$DURATION" | awk '{printf "%d", $1}')
echo "   Duration: ${DURATION_INT}s"

echo "[2/8] Analyzing speech dynamics..."
# Analyze loudness for proper mixing
LOUDNORM_OUTPUT=$(ffmpeg -i "$TEMP_DIR/speech_raw.wav" -af \
    'loudnorm=I=-16:LRA=11:TP=-1:print_format=json' \
    -f null - 2>&1 | grep -A 20 '{' | head -21)

MEASURED_I=$(echo "$LOUDNORM_OUTPUT" | grep -o '"input_i" : "[^"]*"' | cut -d'"' -f4 || echo "-16")
echo "   Speech loudness: $MEASURED_I LUFS"

echo "[3/8] Optimizing speech clarity..."
# Speech optimization: cut low rumble, enhance clarity, control sibilance
# - Highpass at 80Hz (remove low rumble that muddies speech)
# - Presence boost at 2-4kHz for clarity
# - De-ess at 6-8kHz to control harshness
# - Gentle compression for consistent levels
ffmpeg -y -i "$TEMP_DIR/speech_raw.wav" -af \
    "highpass=f=80:poles=2,\
lowshelf=g=-2:f=150:t=q:w=0.707,\
equalizer=f=250:t=q:w=2:g=-1,\
equalizer=f=2500:t=q:w=1.5:g=3,\
equalizer=f=4000:t=q:w=2:g=2,\
equalizer=f=7000:t=q:w=2:g=-2,\
acompressor=threshold=-20dB:ratio=3:attack=10:release=100:makeup=2,\
loudnorm=I=-16:LRA=11:TP=-2" \
    "$TEMP_DIR/speech_clean.wav" 2>/dev/null

echo "[4/8] Generating drum patterns..."
# BPM for hip hop (85-95 for boom bap, adjustable per mode)
case $MODE in
    bomb)
        BPM=92
        ;;
    lowfi)
        BPM=85
        ;;
    laien)
        BPM=75
        ;;
    freqshoot)
        BPM=100
        ;;
    korn)
        BPM=130
        ;;
    *)
        BPM=90
        ;;
esac

BEAT_DURATION=$(echo "scale=6; 60 / $BPM" | bc)
BAR_DURATION=$(echo "scale=6; $BEAT_DURATION * 4" | bc)
echo "   BPM: $BPM"
echo "   Beat duration: ${BEAT_DURATION}s"

# Generate synthesized drums using ffmpeg
# Using afade for envelope shaping (attack/decay)

# KICK: Low frequency sine with fast decay
echo "   Generating kick drum..."
ffmpeg -y -f lavfi -i "sine=frequency=55:duration=0.2" -af \
    "afade=t=out:st=0.02:d=0.18,\
highpass=f=30:poles=2,\
lowpass=f=120:poles=2,\
volume=3" \
    "$TEMP_DIR/kick_single.wav" 2>/dev/null

# SNARE: Noise burst with mid frequencies
echo "   Generating snare..."
ffmpeg -y -f lavfi -i "anoisesrc=duration=0.15:color=pink" -af \
    "afade=t=out:st=0.02:d=0.13,\
highpass=f=150:poles=2,\
lowpass=f=8000:poles=2,\
equalizer=f=200:t=q:w=1:g=4,\
volume=2" \
    "$TEMP_DIR/snare_single.wav" 2>/dev/null

# HI-HAT: High frequency noise, very short
echo "   Generating hi-hat..."
ffmpeg -y -f lavfi -i "anoisesrc=duration=0.08:color=white" -af \
    "afade=t=out:st=0.01:d=0.07,\
highpass=f=6000:poles=2,\
lowpass=f=14000:poles=2,\
volume=0.8" \
    "$TEMP_DIR/hihat_single.wav" 2>/dev/null

# CLAP: Layered noise for punch
echo "   Generating clap..."
ffmpeg -y -f lavfi -i "anoisesrc=duration=0.1:color=pink" -af \
    "afade=t=out:st=0.03:d=0.07,\
highpass=f=800:poles=2,\
lowpass=f=6000:poles=2,\
equalizer=f=1500:t=q:w=2:g=3,\
volume=1.5" \
    "$TEMP_DIR/clap_single.wav" 2>/dev/null

echo "[5/8] Sequencing drum loop..."
# Calculate number of bars needed
NUM_BARS=$(echo "scale=0; ($DURATION_INT / $BAR_DURATION) + 2" | bc)

# Create a drum pattern file
# Pattern: Kick on 1 and 3, Snare on 2 and 4, Hi-hat on every 8th
# Using amerge and adelay to position sounds

# Generate kick pattern (beats 1 and 3 of each bar)
KICK_PATTERN=""
for ((i=0; i<NUM_BARS; i++)); do
    BEAT1=$(echo "scale=3; $i * $BAR_DURATION" | bc)
    BEAT3=$(echo "scale=3; $i * $BAR_DURATION + 2 * $BEAT_DURATION" | bc)
    if [ -z "$KICK_PATTERN" ]; then
        KICK_PATTERN="${BEAT1}|${BEAT3}"
    else
        KICK_PATTERN="${KICK_PATTERN}|${BEAT1}|${BEAT3}"
    fi
done

# Create full-length silence and overlay drums
TOTAL_DURATION=$(echo "scale=2; $DURATION + 2" | bc)

# Generate base silence
ffmpeg -y -f lavfi -i "anullsrc=r=48000:cl=stereo:d=$TOTAL_DURATION" \
    "$TEMP_DIR/silence.wav" 2>/dev/null

# Create drum track by generating pattern with aevalsrc
# Simpler approach: create a looping drum pattern
PATTERN_DURATION=$(echo "scale=3; $BAR_DURATION * 2" | bc)

# Create 2-bar drum loop
ffmpeg -y -f lavfi -i "anullsrc=r=48000:cl=stereo:d=$PATTERN_DURATION" \
    -i "$TEMP_DIR/kick_single.wav" \
    -i "$TEMP_DIR/snare_single.wav" \
    -i "$TEMP_DIR/hihat_single.wav" \
    -i "$TEMP_DIR/clap_single.wav" \
    -filter_complex "\
[1:a]adelay=0|0[k1];\
[1:a]adelay=$(echo "scale=0; $BEAT_DURATION * 2 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 2 * 1000" | bc)[k2];\
[1:a]adelay=$(echo "scale=0; $BEAT_DURATION * 4 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 4 * 1000" | bc)[k3];\
[1:a]adelay=$(echo "scale=0; $BEAT_DURATION * 6 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 6 * 1000" | bc)[k4];\
[2:a]adelay=$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)[s1];\
[2:a]adelay=$(echo "scale=0; $BEAT_DURATION * 3 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 3 * 1000" | bc)[s2];\
[2:a]adelay=$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)[s3];\
[2:a]adelay=$(echo "scale=0; $BEAT_DURATION * 7 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 7 * 1000" | bc)[s4];\
[3:a]adelay=0|0[h1];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 0.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 0.5 * 1000" | bc)[h2];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)[h3];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 1.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 1.5 * 1000" | bc)[h4];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 2 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 2 * 1000" | bc)[h5];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 2.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 2.5 * 1000" | bc)[h6];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 3 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 3 * 1000" | bc)[h7];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 3.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 3.5 * 1000" | bc)[h8];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 4 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 4 * 1000" | bc)[h9];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 4.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 4.5 * 1000" | bc)[h10];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)[h11];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 5.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 5.5 * 1000" | bc)[h12];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 6 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 6 * 1000" | bc)[h13];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 6.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 6.5 * 1000" | bc)[h14];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 7 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 7 * 1000" | bc)[h15];\
[3:a]adelay=$(echo "scale=0; $BEAT_DURATION * 7.5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 7.5 * 1000" | bc)[h16];\
[4:a]adelay=$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 1 * 1000" | bc)[c1];\
[4:a]adelay=$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)|$(echo "scale=0; $BEAT_DURATION * 5 * 1000" | bc)[c2];\
[0:a][k1][k2][k3][k4][s1][s2][s3][s4][h1][h2][h3][h4][h5][h6][h7][h8][h9][h10][h11][h12][h13][h14][h15][h16][c1][c2]amix=inputs=27:duration=first:normalize=0" \
    "$TEMP_DIR/drum_loop.wav" 2>/dev/null

# Loop the drum pattern to match speech duration
echo "   Looping drums to match duration..."
LOOP_COUNT=$(echo "scale=0; ($DURATION_INT / $PATTERN_DURATION) + 2" | bc)
ffmpeg -y -stream_loop $LOOP_COUNT -i "$TEMP_DIR/drum_loop.wav" -t $TOTAL_DURATION \
    "$TEMP_DIR/drums_full.wav" 2>/dev/null

echo "[6/8] Applying mode-specific processing..."
# Mode-specific drum processing
case $MODE in
    bomb)
        # BOMB: Heavy, punchy, aggressive
        echo "   Applying BOMB mode (heavy punch)..."
        DRUM_FILTER="lowshelf=g=8:f=60:t=q:w=0.5,\
equalizer=f=100:t=q:w=1:g=4,\
equalizer=f=200:t=q:w=1.5:g=3,\
acompressor=threshold=-15dB:ratio=8:attack=5:release=30:makeup=6,\
alimiter=limit=-3dB"
        SPEECH_MIX_LEVEL="0.7"
        DRUM_MIX_LEVEL="0.5"
        ;;
    lowfi)
        # LOWFI: Dusty, warm, smooth vinyl feel
        echo "   Applying LO-FI mode (dusty smooth)..."
        DRUM_FILTER="lowpass=f=8000:poles=2,\
highpass=f=60:poles=2,\
lowshelf=g=3:f=80:t=q:w=0.707,\
equalizer=f=3000:t=q:w=2:g=-3,\
equalizer=f=400:t=q:w=1:g=2,\
acompressor=threshold=-20dB:ratio=3:attack=20:release=150:makeup=2,\
chorus=0.5:0.9:50:0.4:0.25:2"
        SPEECH_MIX_LEVEL="0.75"
        DRUM_MIX_LEVEL="0.35"
        ;;
    laien)
        # LAIEN (Mystic): Ethereal, reverb-heavy, spiritual
        echo "   Applying LAIEN mode (mystic)..."
        DRUM_FILTER="lowshelf=g=4:f=50:t=q:w=0.707,\
equalizer=f=432:t=q:w=2:g=4,\
equalizer=f=528:t=q:w=2:g=3,\
equalizer=f=2000:t=q:w=1.5:g=-2,\
aecho=0.8:0.7:60|120:0.4|0.3,\
aphaser=type=t:speed=0.3:decay=0.5,\
acompressor=threshold=-18dB:ratio=3:attack=15:release=200:makeup=3"
        SPEECH_MIX_LEVEL="0.8"
        DRUM_MIX_LEVEL="0.3"
        ;;
    freqshoot)
        # FREQSHOOT: Sharp, crisp, frequency-focused
        echo "   Applying FREQSHOOT mode (crisp)..."
        DRUM_FILTER="highpass=f=40:poles=2,\
equalizer=f=80:t=q:w=0.8:g=5,\
equalizer=f=2500:t=q:w=1:g=4,\
equalizer=f=5000:t=q:w=1.5:g=3,\
equalizer=f=10000:t=q:w=2:g=2,\
acompressor=threshold=-16dB:ratio=5:attack=3:release=50:makeup=4,\
alimiter=limit=-2dB"
        SPEECH_MIX_LEVEL="0.7"
        DRUM_MIX_LEVEL="0.45"
        ;;
    korn)
        # KORN (Metal): Distorted, heavy, aggressive
        echo "   Applying KORN mode (metal)..."
        DRUM_FILTER="lowshelf=g=10:f=80:t=q:w=0.5,\
equalizer=f=150:t=q:w=1:g=6,\
equalizer=f=3000:t=q:w=1.5:g=5,\
equalizer=f=6000:t=q:w=2:g=3,\
acompressor=threshold=-10dB:ratio=10:attack=2:release=20:makeup=8,\
overdrive=gain=3:colour=50,\
alimiter=limit=-2dB"
        SPEECH_MIX_LEVEL="0.65"
        DRUM_MIX_LEVEL="0.55"
        ;;
    *)
        # STANDARD: Balanced hip hop mix
        echo "   Applying STANDARD mode..."
        DRUM_FILTER="lowshelf=g=4:f=60:t=q:w=0.707,\
equalizer=f=100:t=q:w=1:g=2,\
equalizer=f=3000:t=q:w=1.5:g=1,\
acompressor=threshold=-18dB:ratio=4:attack=10:release=80:makeup=3"
        SPEECH_MIX_LEVEL="0.75"
        DRUM_MIX_LEVEL="0.4"
        ;;
esac

# Apply drum processing
ffmpeg -y -i "$TEMP_DIR/drums_full.wav" -af "$DRUM_FILTER" \
    "$TEMP_DIR/drums_processed.wav" 2>/dev/null

echo "[7/8] Mixing speech and drums..."
# Mix speech and processed drums with proper levels
ffmpeg -y -i "$TEMP_DIR/speech_clean.wav" -i "$TEMP_DIR/drums_processed.wav" \
    -filter_complex "\
[0:a]volume=$SPEECH_MIX_LEVEL[speech];\
[1:a]volume=$DRUM_MIX_LEVEL[drums];\
[speech][drums]amix=inputs=2:duration=first:normalize=0,\
stereotools=mlev=1:slev=1.03:sbal=0" \
    "$TEMP_DIR/mixed.wav" 2>/dev/null

echo "[8/8] Mastering final mix..."
# Final mastering chain optimized for clear speech + hip hop
# - Gentle high-pass to keep it clean
# - Slight low-end warmth
# - Clear mids for speech
# - Controlled highs (sharp but not harsh)
# - Loudness normalization

case $MODE in
    lowfi)
        # Lo-fi gets warmer mastering
        MASTER_FILTER="highpass=f=35:poles=2,\
lowshelf=g=2:f=80:t=q:w=0.707,\
equalizer=f=300:t=q:w=1.5:g=1,\
equalizer=f=2500:t=q:w=1.5:g=1.5,\
equalizer=f=8000:t=q:w=2:g=-1,\
lowpass=f=12000:poles=2,\
acompressor=threshold=-14dB:ratio=3:attack=15:release=150:makeup=2,\
loudnorm=I=-14:LRA=9:TP=-1,\
alimiter=limit=-1dB:level=false"
        ;;
    laien)
        # Mystic gets spacious mastering
        MASTER_FILTER="highpass=f=30:poles=2,\
lowshelf=g=2:f=60:t=q:w=0.707,\
equalizer=f=432:t=q:w=2:g=1,\
equalizer=f=2000:t=q:w=1.5:g=1,\
equalizer=f=6000:t=q:w=2:g=-0.5,\
aecho=0.6:0.5:40:0.3,\
acompressor=threshold=-16dB:ratio=3:attack=20:release=200:makeup=2,\
loudnorm=I=-14:LRA=10:TP=-1,\
alimiter=limit=-1dB:level=false"
        ;;
    korn)
        # Metal gets aggressive mastering
        MASTER_FILTER="highpass=f=30:poles=2,\
lowshelf=g=4:f=80:t=q:w=0.5,\
equalizer=f=200:t=q:w=1:g=2,\
equalizer=f=3500:t=q:w=1.5:g=3,\
equalizer=f=8000:t=q:w=2:g=2,\
acompressor=threshold=-12dB:ratio=6:attack=5:release=50:makeup=4,\
loudnorm=I=-12:LRA=7:TP=-1,\
alimiter=limit=-0.5dB:level=false"
        ;;
    *)
        # Standard/bomb/freqshoot get balanced mastering
        MASTER_FILTER="highpass=f=35:poles=2,\
lowshelf=g=2:f=70:t=q:w=0.707,\
equalizer=f=250:t=q:w=1.5:g=0.5,\
equalizer=f=2500:t=q:w=1.5:g=2,\
equalizer=f=5000:t=q:w=2:g=1.5,\
equalizer=f=10000:t=q:w=2:g=-0.5,\
acompressor=threshold=-14dB:ratio=4:attack=10:release=100:makeup=3,\
loudnorm=I=-14:LRA=9:TP=-1,\
alimiter=limit=-1dB:level=false"
        ;;
esac

ffmpeg -y -i "$TEMP_DIR/mixed.wav" -af "$MASTER_FILTER" \
    -ar 44100 -sample_fmt s32 -c:a pcm_s24le "$OUTPUT_DIR/master.wav" 2>/dev/null

# Create MP3
echo "   Creating MP3 (320kbps)..."
ffmpeg -y -i "$OUTPUT_DIR/master.wav" -codec:a libmp3lame -b:a 320k -q:a 0 "$OUTPUT_DIR/master.mp3" 2>/dev/null

# Cleanup temp files
echo "   Cleaning up..."
rm -rf "$TEMP_DIR"

# Get final duration
FINAL_DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp3" 2>/dev/null)
MINS=$(echo "$FINAL_DURATION" | awk '{printf "%d", $1/60}')
SECS=$(echo "$FINAL_DURATION" | awk '{printf "%02d", int($1)%60}')

echo ""
echo "======================================================================"
echo "  SOUNDIFY ZONER Complete!"
echo "  Mode: $MODE_NAME"
echo "  BPM: $BPM"
echo "  Duration: ${MINS}:${SECS}"
echo "  Output: $OUTPUT_DIR/master.mp3"
echo "  Output: $OUTPUT_DIR/master.wav"
echo "======================================================================"
echo ""
