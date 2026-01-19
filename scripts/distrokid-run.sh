#!/bin/bash
#
# DistroKid Upload Runner
# Upload all CEO Bars tracks to streaming platforms
#
# Artist: Aditya Patange
# Producer: Nickel 9 Productions
# Label: SEA Records Worldwide
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
UPLOADER_DIR="$PROJECT_DIR/tools/distrokid-uploader"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

banner() {
    echo -e "${MAGENTA}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           CEO BARS - DISTROKID UPLOADER                      ║"
    echo "║                                                              ║"
    echo "║  Artist:    Aditya Patange                                   ║"
    echo "║  Producer:  Nickel 9 Productions                             ║"
    echo "║  Label:     SEA Records Worldwide                            ║"
    echo "║                                                              ║"
    echo "║  Catalog:   134 Tracks | 4 Albums                            ║"
    echo "║                                                              ║"
    echo "║  Albums:                                                     ║"
    echo "║    • CEO Bars™ (3 tracks)                                    ║"
    echo "║    • DETBOM FREESTYLES (67 tracks)                           ║"
    echo "║    • DETBOMBAY FREESTYLES (26 tracks)                        ║"
    echo "║    • SINGLES (38 tracks)                                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

install_deps() {
    log_info "Installing dependencies..."
    cd "$UPLOADER_DIR"

    if [ ! -d "node_modules" ]; then
        npm install
    else
        log_info "Dependencies already installed"
    fi

    log_success "Dependencies ready"
}

extract_tracks() {
    log_info "Extracting track metadata..."
    cd "$PROJECT_DIR"
    node scripts/extract-tracks.js
    log_success "Tracks extracted"
}

update_metadata() {
    log_info "Updating metadata for DistroKid..."
    cd "$UPLOADER_DIR"
    node update-metadata.js
    log_success "Metadata updated"
}

run_uploader() {
    local mode="${1:-all}"

    cd "$UPLOADER_DIR"

    case "$mode" in
        test)
            log_info "Running test upload (dry run)..."
            node upload.js --dry-run
            ;;
        single)
            log_info "Uploading single track..."
            node upload.js --single
            ;;
        album)
            local album_name="$2"
            if [ -z "$album_name" ]; then
                echo "Available albums:"
                echo "  1. CEO Bars™"
                echo "  2. DETBOM FREESTYLES"
                echo "  3. DETBOMBAY FREESTYLES"
                echo "  4. SINGLES"
                echo ""
                read -p "Enter album name: " album_name
            fi
            log_info "Uploading album: $album_name"
            node upload.js --album="$album_name"
            ;;
        all)
            log_warn "This will upload ALL 134 tracks to DistroKid!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                log_info "Starting full catalog upload..."
                node upload.js
            else
                log_info "Upload cancelled"
            fi
            ;;
        headless)
            log_info "Running in headless mode..."
            node upload.js --headless
            ;;
    esac
}

show_summary() {
    echo ""
    log_info "Distribution Targets:"
    echo "  • Spotify"
    echo "  • Apple Music"
    echo "  • Amazon Music"
    echo "  • YouTube Music"
    echo "  • TikTok"
    echo "  • Instagram/Facebook"
    echo "  • Tidal"
    echo "  • Deezer"
    echo "  • Pandora"
    echo "  • iHeartRadio"
    echo "  • SoundCloud"
    echo "  • Shazam"
    echo ""
}

show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  setup      - Install dependencies and prepare metadata"
    echo "  test       - Run dry-run upload (no actual upload)"
    echo "  single     - Upload a single track (for testing)"
    echo "  album      - Upload a specific album"
    echo "  all        - Upload all 134 tracks"
    echo "  headless   - Run in headless browser mode"
    echo "  summary    - Show catalog summary"
    echo "  help       - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 setup                    # First-time setup"
    echo "  $0 test                     # Test without uploading"
    echo "  $0 album \"CEO Bars™\"        # Upload specific album"
    echo "  $0 all                      # Upload everything"
    echo ""
}

# Main
banner

case "${1:-help}" in
    setup)
        extract_tracks
        install_deps
        update_metadata
        show_summary
        log_success "Setup complete! Run '$0 test' to verify, then '$0 all' to upload"
        ;;
    test)
        run_uploader test
        ;;
    single)
        run_uploader single
        ;;
    album)
        run_uploader album "$2"
        ;;
    all)
        run_uploader all
        ;;
    headless)
        run_uploader headless
        ;;
    summary)
        show_summary
        ;;
    help|*)
        show_help
        ;;
esac
