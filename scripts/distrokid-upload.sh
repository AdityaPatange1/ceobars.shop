#!/bin/bash
#
# DistroKid Bulk Upload Script
# Upload all CEO Bars tracks to DistroKid for distribution
#
# Usage:
#   ./scripts/distrokid-upload.sh [action] [options]
#
# Actions:
#   extract    - Extract track metadata from tracks page to JSON
#   prepare    - Prepare release configs grouped by album
#   download   - Download all audio/cover assets locally
#   upload     - Upload all releases to DistroKid
#   status     - Check upload status
#
# Requirements:
#   - Go 1.21+
#   - DISTROKID_TOKEN environment variable (for upload)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CLI_DIR="$PROJECT_DIR/tools/distrokid-cli"
OUTPUT_DIR="$PROJECT_DIR/distrokid-releases"
TRACKS_JSON="$OUTPUT_DIR/all-tracks.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

extract_tracks() {
    log_info "Extracting track metadata from tracks page..."

    mkdir -p "$OUTPUT_DIR"

    # Extract tracks data using Node.js
    node -e "
const fs = require('fs');
const content = fs.readFileSync('$PROJECT_DIR/src/app/tracks/page.tsx', 'utf8');

// Extract the tracks array
const tracksMatch = content.match(/const tracks: Track\[\] = \[([\s\S]*?)\];/);
if (!tracksMatch) {
    console.error('Could not find tracks array');
    process.exit(1);
}

// Parse tracks manually (simplified approach)
const tracksSection = tracksMatch[1];
const trackBlocks = tracksSection.split(/\},\s*\{/).map((block, i) => {
    if (i === 0) block = block.replace(/^\s*\{/, '');
    if (i === tracksSection.split(/\},\s*\{/).length - 1) block = block.replace(/\}\s*$/, '');
    return '{' + block + '}';
});

const tracks = [];
for (const block of trackBlocks) {
    try {
        // Extract fields with regex
        const getId = (s) => { const m = s.match(/id:\s*(\d+)/); return m ? parseInt(m[1]) : 0; };
        const getStr = (s, field) => {
            const m = s.match(new RegExp(field + ':\\s*\"([^\"]*)\"|' + field + ':\\s*\\'([^\\']*)\\''));
            return m ? (m[1] || m[2] || '') : '';
        };

        const track = {
            id: getId(block),
            title: getStr(block, 'title'),
            artist: getStr(block, 'artist'),
            album: getStr(block, 'album'),
            duration: getStr(block, 'duration'),
            file: getStr(block, 'file'),
            coverArt: getStr(block, 'coverArt'),
            description: getStr(block, 'description').substring(0, 500),
            releaseDate: getStr(block, 'releaseDate'),
            instrumental: getStr(block, 'instrumental'),
            genre: 'Hip-Hop/Rap'
        };

        if (track.id && track.title) {
            tracks.push(track);
        }
    } catch (e) {}
}

console.log(JSON.stringify(tracks, null, 2));
" > "$TRACKS_JSON"

    TRACK_COUNT=$(cat "$TRACKS_JSON" | grep -c '"id":' || echo "0")
    log_success "Extracted $TRACK_COUNT tracks to $TRACKS_JSON"
}

prepare_releases() {
    log_info "Preparing release configs..."

    if [ ! -f "$TRACKS_JSON" ]; then
        log_error "Tracks JSON not found. Run 'extract' first."
        exit 1
    fi

    cd "$CLI_DIR"
    go build -o distrokid-cli .
    ./distrokid-cli -action prepare -tracks "$TRACKS_JSON" -output "$OUTPUT_DIR"

    log_success "Release configs created in $OUTPUT_DIR"
}

download_assets() {
    log_info "Downloading audio and cover assets..."

    if [ ! -f "$TRACKS_JSON" ]; then
        log_error "Tracks JSON not found. Run 'extract' first."
        exit 1
    fi

    cd "$CLI_DIR"
    go build -o distrokid-cli .
    ./distrokid-cli -action download-assets -tracks "$TRACKS_JSON" -output "$OUTPUT_DIR"

    log_success "Assets downloaded to $OUTPUT_DIR/tracks"
}

upload_releases() {
    if [ -z "$DISTROKID_TOKEN" ]; then
        log_error "DISTROKID_TOKEN environment variable not set"
        log_info "Get your token from DistroKid iOS app network requests"
        exit 1
    fi

    log_info "Uploading releases to DistroKid..."

    cd "$CLI_DIR"
    go build -o distrokid-cli .

    # Upload each release config
    for config in "$OUTPUT_DIR"/*.json; do
        if [ "$config" != "$TRACKS_JSON" ]; then
            log_info "Uploading: $(basename "$config")"
            ./distrokid-cli -action upload -config "$config" -token "$DISTROKID_TOKEN"
        fi
    done

    log_success "Upload complete!"
}

check_status() {
    if [ -z "$DISTROKID_TOKEN" ]; then
        log_error "DISTROKID_TOKEN environment variable not set"
        exit 1
    fi

    cd "$CLI_DIR"
    go build -o distrokid-cli .
    ./distrokid-cli -action list -token "$DISTROKID_TOKEN"
}

show_summary() {
    log_info "CEO Bars DistroKid Upload Summary"
    echo ""

    if [ -f "$TRACKS_JSON" ]; then
        TRACK_COUNT=$(cat "$TRACKS_JSON" | grep -c '"id":' || echo "0")
        echo "  Total Tracks: $TRACK_COUNT"

        # Count albums
        ALBUM_COUNT=$(cat "$TRACKS_JSON" | grep '"album":' | sort -u | wc -l | tr -d ' ')
        echo "  Albums: $ALBUM_COUNT"
    fi

    echo ""
    echo "  Record Label: SEA Records Worldwide"
    echo "  Primary Artist: Adi 55 / Aditya Patange"
    echo "  Genre: Hip-Hop/Rap"
    echo ""
    echo "  Target Platforms:"
    echo "    - Spotify"
    echo "    - Apple Music"
    echo "    - Amazon Music"
    echo "    - YouTube Music"
    echo "    - Tidal"
    echo "    - Deezer"
    echo "    - Pandora"
    echo "    - iHeartRadio"
    echo "    - SoundCloud"
    echo ""
}

# Main
case "${1:-help}" in
    extract)
        extract_tracks
        show_summary
        ;;
    prepare)
        prepare_releases
        ;;
    download)
        download_assets
        ;;
    upload)
        upload_releases
        ;;
    status)
        check_status
        ;;
    all)
        extract_tracks
        prepare_releases
        download_assets
        show_summary
        log_info "Ready for upload! Run: ./scripts/distrokid-upload.sh upload"
        ;;
    help|*)
        echo "CEO Bars - DistroKid Bulk Upload Script"
        echo ""
        echo "Usage: $0 [action]"
        echo ""
        echo "Actions:"
        echo "  extract   - Extract all track metadata from tracks page"
        echo "  prepare   - Generate release configs grouped by album"
        echo "  download  - Download all audio/cover assets locally"
        echo "  upload    - Upload all releases to DistroKid"
        echo "  status    - Check DistroKid release status"
        echo "  all       - Run extract + prepare + download"
        echo ""
        echo "Environment:"
        echo "  DISTROKID_TOKEN - Required for upload/status actions"
        echo ""
        ;;
esac
