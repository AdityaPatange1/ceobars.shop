#!/usr/bin/env bash
# ============================================================
# Instagram Media Pipeline (Production Grade)
# macOS-focused (Homebrew bootstrap included)
#
# What it does:
# 1. Bootstraps system deps (brew, python3, ffmpeg, jq)
# 2. Creates isolated Python venv
# 3. Downloads ALL videos from a public IG profile
# 4. Collects all MP4s into one folder
# 5. Converts ALL MP4s -> MP3 + WAV (single dump folders)
# 6. Filters videos by caption keyword (e.g. "freestyle")
#
# Usage:
#   ./ig_media_pipeline.sh <instagram_username> [keyword] [output_dir]
#
# Example:
#   ./ig_media_pipeline.sh adipatange freestyle ./ig_export
# ============================================================

set -Eeuo pipefail
IFS=$'\n\t'

# --------------------------
# Load environment variables
# --------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

# --------------------------
# Logging & traps
# --------------------------
log()  { printf "[%s] %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >&2; }
die()  { log "FATAL: $*"; exit 1; }

trap 'log "Pipeline failed."' ERR

# --------------------------
# Inputs
# --------------------------
USERNAME="${1:-}"
[[ -n "$USERNAME" ]] || die "Usage: $0 <instagram_username> [keyword] [output_dir]"

KEYWORD="${2:-freestyle}"
OUT_DIR="${3:-./ig_download_${USERNAME}}"

PARALLEL_JOBS="${PARALLEL_JOBS:-4}"
MP3_BITRATE="${MP3_BITRATE:-192k}"

# --------------------------
# macOS bootstrap (brew)
# --------------------------
if ! command -v brew >/dev/null 2>&1; then
  log "Homebrew not found. Installing Homebrew…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
    || die "Homebrew installation failed"

  # shellcheck disable=SC2016
  eval "$(/opt/homebrew/bin/brew shellenv || /usr/local/bin/brew shellenv)"
fi

# --------------------------
# System dependencies
# --------------------------
install_if_missing() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log "Installing dependency: $1"
    brew install "$2"
  fi
}

install_if_missing python3 python
install_if_missing ffmpeg ffmpeg
install_if_missing jq jq

command -v python3 >/dev/null || die "python3 not available"
command -v ffmpeg  >/dev/null || die "ffmpeg not available"

# --------------------------
# Directory layout
# --------------------------
mkdir -p "$OUT_DIR"

RUN_DIR="$OUT_DIR/run_$(date '+%Y%m%d_%H%M%S')"
RAW_DIR="$RUN_DIR/raw"
ALL_VIDEOS_DIR="$RUN_DIR/all_videos"
KEYWORD_VIDEOS_DIR="$RUN_DIR/${KEYWORD}_videos"
ALL_MP3_DIR="$RUN_DIR/all_mp3"
ALL_WAV_DIR="$RUN_DIR/all_wav"
VENV_DIR="$OUT_DIR/.venv_instaloader"

mkdir -p \
  "$RAW_DIR" \
  "$ALL_VIDEOS_DIR" \
  "$KEYWORD_VIDEOS_DIR" \
  "$ALL_MP3_DIR" \
  "$ALL_WAV_DIR"

log "Instagram user   : $USERNAME"
log "Keyword filter   : $KEYWORD"
log "Output directory : $RUN_DIR"

# --------------------------
# Python venv + instaloader
# --------------------------
if [[ ! -d "$VENV_DIR" ]]; then
  log "Creating Python venv"
  python3 -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

python3 -m pip install --quiet --upgrade pip
python3 -m pip install --quiet --upgrade instaloader

command -v instaloader >/dev/null || die "Instaloader install failed"

# --------------------------
# Proxy configuration
# --------------------------
PROXY_URL="http://kwquljos:4qhu071wiob4@45.41.179.14:6549"
export HTTP_PROXY="$PROXY_URL"
export HTTPS_PROXY="$PROXY_URL"
export http_proxy="$PROXY_URL"
export https_proxy="$PROXY_URL"

log "Using proxy: 45.41.179.14:6549"

# --------------------------
# Download Instagram videos
# --------------------------
log "Downloading Instagram videos"

# Build login args if credentials are available
LOGIN_ARGS=()
if [[ -n "${IG_USERNAME:-}" ]] && [[ -n "${IG_PASSWORD:-}" ]]; then
  log "Using authenticated session (IG_USERNAME from .env)"
  LOGIN_ARGS=(--login "$IG_USERNAME" --password "$IG_PASSWORD")
else
  log "No credentials found, attempting public access"
fi

instaloader \
  "${LOGIN_ARGS[@]}" \
  --no-pictures \
  --no-video-thumbnails \
  --no-captions \
  --no-compress-json \
  --request-timeout 300 \
  --max-connection-attempts 3 \
  --dirname-pattern "$RAW_DIR" \
  --filename-pattern "{shortcode}" \
  "$USERNAME"

log "Download completed"

# --------------------------
# Collect all videos
# --------------------------
log "Collecting all MP4 files"

find "$RAW_DIR" -type f -name "*.mp4" -print0 | while IFS= read -r -d '' f; do
  cp -n "$f" "$ALL_VIDEOS_DIR/"
done

# --------------------------
# Convert videos -> MP3 + WAV
# --------------------------
log "Converting videos to MP3 and WAV"

convert_one() {
  in="$1"
  base="$(basename "$in" .mp4)"

  mp3="$ALL_MP3_DIR/$base.mp3"
  wav="$ALL_WAV_DIR/$base.wav"

  [[ -f "$mp3" ]] || ffmpeg -loglevel error -y -i "$in" -vn -ar 44100 -ac 2 -b:a "$MP3_BITRATE" "$mp3"
  [[ -f "$wav" ]] || ffmpeg -loglevel error -y -i "$in" -vn -ar 44100 -ac 2 -c:a pcm_s16le "$wav"
}
export -f convert_one
export ALL_MP3_DIR ALL_WAV_DIR MP3_BITRATE

find "$ALL_VIDEOS_DIR" -type f -name "*.mp4" -print0 \
  | xargs -0 -n 1 -P "$PARALLEL_JOBS" bash -lc 'convert_one "$@"' _

log "Audio conversion done"

# --------------------------
# Caption keyword filter
# --------------------------
log "Filtering videos by caption keyword: $KEYWORD"

find "$RAW_DIR" -maxdepth 1 -type f -name "*.json" | while read -r json; do
  shortcode="$(basename "$json" .json)"
  mp4="$RAW_DIR/$shortcode.mp4"
  [[ -f "$mp4" ]] || continue

  caption="$(jq -r '
    (.node.edge_media_to_caption.edges[0].node.text
     // .node.caption
     // .caption
     // "") | ascii_downcase
  ' "$json")"

  if [[ "$caption" == *"${KEYWORD,,}"* ]]; then
    cp -n "$mp4" "$KEYWORD_VIDEOS_DIR/"
  fi
done

# --------------------------
# Summary
# --------------------------
log "Pipeline complete"

echo
echo "========================================"
echo "ALL VIDEOS      : $ALL_VIDEOS_DIR"
echo "KEYWORD VIDEOS  : $KEYWORD_VIDEOS_DIR"
echo "ALL MP3 FILES   : $ALL_MP3_DIR"
echo "ALL WAV FILES   : $ALL_WAV_DIR"
echo "========================================"
echo