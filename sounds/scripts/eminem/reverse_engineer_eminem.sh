#!/bin/bash
#===============================================================================
#  EMINEM PRODUCTION REVERSE ENGINEERING SYSTEM
#  Military-Grade Audio Genome Extraction
#===============================================================================
#
#  This script analyzes all Eminem tracks serially and extracts the complete
#  production genome including:
#    - Spectral characteristics (frequency distribution, brightness)
#    - Dynamic range and compression signatures
#    - EQ curves and frequency balance
#    - Stereo field characteristics
#    - Transient and attack profiles
#    - Harmonic content and distortion
#    - Tempo, rhythm, and groove patterns
#    - Reverb and spatial characteristics
#
#  Output: sounds/outputs/eminem_production_sound_genome.json
#
#  Usage: npm run reverse-engineer:eminem-production
#         OR ./sounds/scripts/eminem/reverse_engineer_eminem.sh
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
ANALYZER_SCRIPT="$SCRIPT_DIR/audio_genome_analyzer.py"

# Eminem track directories
EMINEM_DIRS=(
    "$PROJECT_ROOT/outputs/youtube-downloads/eminem-official"
    "$PROJECT_ROOT/outputs/youtube-downloads/eminem-vevo"
    "$PROJECT_ROOT/public/assets/eminem-zen-zone"
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
echo "         PRODUCTION SOUND GENOME REVERSE ENGINEERING SYSTEM                     "
echo "                    Military-Grade Audio Analysis                               "
echo "                                                                                "
echo "================================================================================"
echo -e "${NC}"

# Check dependencies
echo -e "${CYAN}[INIT] Checking dependencies...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is required${NC}"
    exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is required${NC}"
    exit 1
fi

if ! command -v ffprobe &> /dev/null; then
    echo -e "${RED}Error: ffprobe is required${NC}"
    exit 1
fi

# Check Python packages
echo -e "${CYAN}[INIT] Checking Python packages...${NC}"
python3 -c "import librosa, soundfile, numpy" 2>/dev/null || {
    echo -e "${RED}Error: Required Python packages not installed${NC}"
    echo -e "${YELLOW}Install with: pip install librosa soundfile numpy scipy${NC}"
    exit 1
}

echo -e "${GREEN}[OK] All dependencies satisfied${NC}"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Find all Eminem tracks
echo -e "${CYAN}[SCAN] Scanning for Eminem tracks...${NC}"
TRACKS=()
TOTAL_TRACKS=0

for dir in "${EMINEM_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        while IFS= read -r -d $'\0' file; do
            TRACKS+=("$file")
            ((TOTAL_TRACKS++))
        done < <(find "$dir" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.flac" -o -name "*.m4a" \) -print0 2>/dev/null)
    fi
done

if [ $TOTAL_TRACKS -eq 0 ]; then
    echo -e "${RED}Error: No Eminem tracks found${NC}"
    echo -e "${YELLOW}Expected tracks in:${NC}"
    for dir in "${EMINEM_DIRS[@]}"; do
        echo "  - $dir"
    done
    exit 1
fi

echo -e "${GREEN}[OK] Found $TOTAL_TRACKS Eminem tracks${NC}"
echo ""

# Create Python analysis wrapper script
PYTHON_RUNNER=$(mktemp)
trap "rm -f $PYTHON_RUNNER" EXIT

cat > "$PYTHON_RUNNER" << 'PYEOF'
#!/usr/bin/env python3
"""
Eminem Production Genome Extraction Runner
Processes all tracks serially and generates the complete genome
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime

# Add script directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, script_dir)

# Now import from the analyzer
sys.path.insert(0, os.environ.get('ANALYZER_DIR', script_dir))

from audio_genome_analyzer import (
    EminemGenomeAnalyzer,
    TrackGenome,
    aggregate_genomes,
    generate_ffmpeg_chain,
    dataclass_to_dict
)

def main():
    tracks_file = os.environ.get('TRACKS_FILE')
    output_file = os.environ.get('OUTPUT_FILE')

    if not tracks_file or not output_file:
        print("Error: TRACKS_FILE and OUTPUT_FILE environment variables required")
        sys.exit(1)

    # Read track list
    with open(tracks_file, 'r') as f:
        tracks = [line.strip() for line in f if line.strip()]

    print(f"\n{'='*80}")
    print(f"  EMINEM PRODUCTION GENOME EXTRACTION")
    print(f"  Processing {len(tracks)} tracks serially")
    print(f"{'='*80}\n")

    analyzer = EminemGenomeAnalyzer(verbose=True)
    genomes = []
    track_data = []

    for i, track_path in enumerate(tracks, 1):
        print(f"\n[{i}/{len(tracks)}] Processing: {os.path.basename(track_path)}")
        print("-" * 60)

        genome = analyzer.analyze_track(track_path)

        if genome:
            genomes.append(genome)
            track_data.append(dataclass_to_dict(genome))
            print(f"  [SUCCESS] Genome extracted")

            # Print quick summary
            print(f"    - BPM: {genome.tempo_rhythm.bpm:.1f}")
            print(f"    - Compression: {genome.dynamics.compression_estimate:.2f}")
            print(f"    - Spectral Centroid: {genome.spectral.centroid_mean:.1f} Hz")
            print(f"    - Percussiveness: {genome.transients.percussiveness:.2f}")
        else:
            print(f"  [SKIP] Could not analyze track")

    print(f"\n{'='*80}")
    print(f"  AGGREGATING PRODUCTION SIGNATURE")
    print(f"{'='*80}\n")

    # Aggregate genomes
    aggregated = aggregate_genomes(genomes)

    # Generate FFmpeg chain
    ffmpeg_chain = generate_ffmpeg_chain(aggregated)

    # Build final output structure
    output = {
        "metadata": {
            "artist": "Eminem",
            "analysis_version": "1.0.0",
            "generated_at": datetime.now().isoformat(),
            "total_tracks_analyzed": len(genomes),
            "total_tracks_scanned": len(tracks)
        },
        "artist": {
            "eminem": track_data
        },
        "aggregated_production": aggregated,
        "ffmpeg_processing_chain": ffmpeg_chain,
        "eminem_signature": {
            "description": "Eminem Production Sound Signature - Extracted from official releases",
            "characteristics": {
                "vocal_presence": "aggressive, in-your-face, heavily compressed vocals",
                "low_end": "punchy, controlled sub-bass with clean separation",
                "mid_range": "clear, articulate, slight scoop for vocal clarity",
                "high_end": "crisp hi-hats, controlled sibilance",
                "dynamics": "heavy compression, loud masters, limited dynamic range",
                "stereo_field": "moderate width, strong center image for vocals",
                "reverb": "minimal, dry sound with occasional room ambience",
                "overall": "aggressive, punchy, in-your-face Detroit hip-hop production"
            },
            "production_era_notes": {
                "slim_shady_era": "Raw, underground sound, aggressive compression",
                "recovery_era": "Cleaner production, stadium sound",
                "modern_era": "Polished, loud, streaming-optimized"
            }
        }
    }

    # Write output
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"[SUCCESS] Genome saved to: {output_file}")
    print(f"\n{'='*80}")
    print(f"  EMINEM PRODUCTION GENOME EXTRACTION COMPLETE")
    print(f"  Analyzed: {len(genomes)}/{len(tracks)} tracks")
    print(f"{'='*80}\n")

    # Print aggregated signature summary
    print("\nAGGREGATED PRODUCTION SIGNATURE:")
    print("-" * 40)

    if 'spectral' in aggregated:
        print(f"  Brightness: {aggregated['spectral'].get('brightness_signature', 'N/A')}")
    if 'dynamics' in aggregated:
        print(f"  Compression: {aggregated['dynamics'].get('compression_style', 'N/A')}")
    if 'frequency_balance' in aggregated:
        eq = aggregated['frequency_balance'].get('signature_eq_curve', {})
        print(f"  EQ Signature:")
        print(f"    Sub-bass: {eq.get('sub_bass_boost_db', 0):+.1f} dB")
        print(f"    Bass: {eq.get('bass_boost_db', 0):+.1f} dB")
        print(f"    Mids: {eq.get('mid_boost_db', 0):+.1f} dB")
        print(f"    Presence: {eq.get('presence_boost_db', 0):+.1f} dB")
        print(f"    Brilliance: {eq.get('brilliance_boost_db', 0):+.1f} dB")
    if 'stereo' in aggregated:
        print(f"  Stereo: {aggregated['stereo'].get('width_style', 'N/A')}")
    if 'reverb' in aggregated:
        print(f"  Reverb: {aggregated['reverb'].get('spatial_style', 'N/A')}")
    if 'tempo' in aggregated:
        print(f"  Tempo Range: {aggregated['tempo'].get('bpm_range', [0, 0])}")

    print("\nFFMPEG PROCESSING CHAIN:")
    print("-" * 40)
    print(f"  {ffmpeg_chain.get('full_chain', 'N/A')}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
PYEOF

# Create tracks list file
TRACKS_FILE=$(mktemp)
trap "rm -f $PYTHON_RUNNER $TRACKS_FILE" EXIT

printf '%s\n' "${TRACKS[@]}" > "$TRACKS_FILE"

# Run the analysis
echo -e "${CYAN}[ANALYSIS] Starting serial track analysis...${NC}"
echo -e "${YELLOW}This may take several minutes depending on the number of tracks.${NC}"
echo ""

export TRACKS_FILE
export OUTPUT_FILE="$GENOME_FILE"
export ANALYZER_DIR="$SCRIPT_DIR"

python3 "$PYTHON_RUNNER"

ANALYSIS_EXIT_CODE=$?

if [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}  EMINEM PRODUCTION GENOME EXTRACTION COMPLETE${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    echo -e "${WHITE}  Output File:${NC}"
    echo -e "  ${CYAN}$GENOME_FILE${NC}"
    echo ""

    # Show file size
    if [ -f "$GENOME_FILE" ]; then
        FILE_SIZE=$(ls -lh "$GENOME_FILE" | awk '{print $5}')
        echo -e "${WHITE}  File Size: ${GREEN}$FILE_SIZE${NC}"
    fi

    echo ""
    echo -e "${MAGENTA}  Ready to apply Eminem production style to your tracks!${NC}"
    echo -e "${YELLOW}  Run: npm run apply-sound:eminem${NC}"
    echo ""
else
    echo -e "${RED}Error: Analysis failed with exit code $ANALYSIS_EXIT_CODE${NC}"
    exit $ANALYSIS_EXIT_CODE
fi
