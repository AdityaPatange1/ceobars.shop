#!/usr/bin/env python3
"""
Process Instagram Freestyle Videos
- Extract audio from videos
- Run mix/master chain
- Create proper folder structure
- Generate track metadata
"""

import os
import json
import glob
import subprocess
import re
import shutil

# Paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FREESTYLE_DIR = os.path.join(PROJECT_ROOT, "inputs/ig_downloads/freestyle_videos")
SOURCE_META_DIR = os.path.join(PROJECT_ROOT, "inputs/ig_downloads/fresh_download/gallery-dl/instagram/adityapatange_")
INPUTS_DIR = os.path.join(PROJECT_ROOT, "inputs")
OUTPUTS_DIR = os.path.join(PROJECT_ROOT, "outputs/masters")
ASSETS_DIR = os.path.join(PROJECT_ROOT, "public/assets/detbom-freestyles")

# Ensure directories exist
os.makedirs(INPUTS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

def clean_title(title):
    """Extract clean title from caption"""
    # Remove emojis and clean up
    title = re.sub(r'[^\w\s\-\'\"$]+', '', title)
    title = title.strip()
    # Limit length
    if len(title) > 60:
        title = title[:60].rsplit(' ', 1)[0]
    return title

def slugify(title):
    """Create URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = slug.strip('-')
    return slug

def get_duration(file_path):
    """Get audio duration using ffprobe"""
    try:
        result = subprocess.run([
            'ffprobe', '-v', 'quiet',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            file_path
        ], capture_output=True, text=True, timeout=30)
        duration = float(result.stdout.strip())
        mins = int(duration // 60)
        secs = int(duration % 60)
        return f"{mins}:{secs:02d}"
    except:
        return "0:00"

def extract_audio(video_path, wav_path):
    """Extract audio from video to WAV"""
    print(f"  Extracting audio from {os.path.basename(video_path)}...")
    try:
        subprocess.run([
            'ffmpeg', '-y', '-i', video_path,
            '-vn', '-acodec', 'pcm_s24le',
            '-ar', '48000', '-ac', '2',
            wav_path
        ], capture_output=True, timeout=300)
        return os.path.exists(wav_path)
    except Exception as e:
        print(f"  Error: {e}")
        return False

def run_mix_master(input_wav, output_wav, output_mp3):
    """Run the mix/master chain using ffmpeg"""
    print(f"  Running mix/master chain...")

    # First pass - analyze
    try:
        result = subprocess.run([
            'ffmpeg', '-i', input_wav, '-af',
            'highpass=f=30:poles=2,'
            'lowshelf=g=2:f=80:t=q:w=0.707,'
            'equalizer=f=3000:t=q:w=1.5:g=1.5,'
            'highshelf=g=1:f=12000:t=q:w=0.707,'
            'acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,'
            'loudnorm=I=-14:LRA=11:TP=-1:print_format=json',
            '-f', 'null', '-'
        ], capture_output=True, text=True, timeout=300)

        # Parse loudnorm output
        output = result.stderr
        measured_i = "-14"
        measured_lra = "11"
        measured_tp = "-1"
        measured_thresh = "-24"

        try:
            # Find JSON in output
            json_start = output.rfind('{')
            json_end = output.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                loudnorm_data = json.loads(output[json_start:json_end])
                measured_i = loudnorm_data.get('input_i', '-14')
                measured_lra = loudnorm_data.get('input_lra', '11')
                measured_tp = loudnorm_data.get('input_tp', '-1')
                measured_thresh = loudnorm_data.get('input_thresh', '-24')
        except:
            pass

        # Second pass - apply
        subprocess.run([
            'ffmpeg', '-y', '-i', input_wav, '-af',
            f'highpass=f=30:poles=2,'
            f'lowshelf=g=2:f=80:t=q:w=0.707,'
            f'equalizer=f=3000:t=q:w=1.5:g=1.5,'
            f'highshelf=g=1:f=12000:t=q:w=0.707,'
            f'acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2,'
            f'stereotools=mlev=1:slev=1.05:sbal=0,'
            f'loudnorm=I=-14:LRA=11:TP=-1:measured_I={measured_i}:measured_LRA={measured_lra}:measured_TP={measured_tp}:measured_thresh={measured_thresh}:linear=true,'
            f'alimiter=limit=-1dB:level=false',
            '-ar', '44100', '-sample_fmt', 's32', '-c:a', 'pcm_s24le',
            output_wav
        ], capture_output=True, timeout=300)

        # Create MP3
        subprocess.run([
            'ffmpeg', '-y', '-i', output_wav,
            '-codec:a', 'libmp3lame', '-b:a', '320k', '-q:a', '0',
            output_mp3
        ], capture_output=True, timeout=300)

        return os.path.exists(output_wav) and os.path.exists(output_mp3)
    except Exception as e:
        print(f"  Error: {e}")
        return False

def generate_description(title, original_desc):
    """Generate a proper description for the track"""
    # Clean up the original description
    desc = original_desc.split('\n\n')[0] if '\n\n' in original_desc else original_desc.split('\n')[0]
    if len(desc) < 50:
        desc = original_desc[:500]

    # Clean up hashtags and mentions
    desc = re.sub(r'#\w+', '', desc)
    desc = re.sub(r'@\w+', '', desc)
    desc = re.sub(r'\s+', ' ', desc).strip()

    if len(desc) < 100:
        desc = f"{title} - An off-the-dome freestyle by Adi 55, captured live from the DETBOM (Detroit Executes, The Bombay Offensive Modules) sessions. Raw, uncut, and engineered for maximum lyrical impact."

    return desc

def main():
    print("\n" + "="*70)
    print("  CEO BARS - Instagram Freestyle Processor")
    print("="*70 + "\n")

    # Collect freestyle data
    freestyles = []

    # Read metadata from JSON files
    json_files = glob.glob(os.path.join(SOURCE_META_DIR, "*.mp4.json"))

    for json_file in json_files:
        with open(json_file, 'r') as f:
            data = json.load(f)

        desc = data.get('description', '').lower()
        if 'freestyle' not in desc:
            continue

        mp4_name = os.path.basename(json_file).replace('.json', '')
        mp4_path = os.path.join(FREESTYLE_DIR, mp4_name)

        if not os.path.exists(mp4_path):
            continue

        full_desc = data.get('description', '')
        first_line = full_desc.split('\n')[0]
        title = clean_title(first_line)

        freestyles.append({
            'mp4': mp4_path,
            'mp4_name': mp4_name,
            'title': title if title else f"Freestyle {data.get('media_id', '')}",
            'description': full_desc,
            'date': data.get('date', data.get('post_date', '')),
            'media_id': data.get('media_id', '')
        })

    # Sort by date (newest first)
    freestyles.sort(key=lambda x: x['date'], reverse=True)

    print(f"Found {len(freestyles)} freestyle videos to process\n")

    # Track data for page update
    track_entries = []

    for i, freestyle in enumerate(freestyles):
        print(f"\n[{i+1}/{len(freestyles)}] Processing: {freestyle['title'][:50]}...")

        slug = slugify(freestyle['title'])
        if not slug:
            slug = f"freestyle-{freestyle['media_id']}"

        # Create folder structure
        track_folder = os.path.join(ASSETS_DIR, slug)
        os.makedirs(track_folder, exist_ok=True)

        # File paths
        raw_wav = os.path.join(INPUTS_DIR, f"{slug}.wav")
        master_wav = os.path.join(OUTPUTS_DIR, f"{slug}_MASTER.wav")
        master_mp3 = os.path.join(OUTPUTS_DIR, f"{slug}_MASTER.mp3")
        final_mp3 = os.path.join(track_folder, "master.mp3")
        cover_path = os.path.join(track_folder, "cover.jpg")

        # Step 1: Extract audio
        if not extract_audio(freestyle['mp4'], raw_wav):
            print(f"  Failed to extract audio, skipping...")
            continue

        # Step 2: Mix/Master
        if not run_mix_master(raw_wav, master_wav, master_mp3):
            print(f"  Failed to mix/master, skipping...")
            continue

        # Step 3: Copy to assets folder
        shutil.copy(master_mp3, final_mp3)
        print(f"  Copied to: {final_mp3}")

        # Step 4: Extract thumbnail as cover
        try:
            subprocess.run([
                'ffmpeg', '-y', '-i', freestyle['mp4'],
                '-ss', '00:00:01', '-vframes', '1',
                '-vf', 'scale=800:800:force_original_aspect_ratio=increase,crop=800:800',
                cover_path
            ], capture_output=True, timeout=60)
        except:
            # Create placeholder cover if extraction fails
            pass

        # Get duration
        duration = get_duration(final_mp3)

        # Generate track entry
        track_entry = {
            'title': freestyle['title'],
            'slug': slug,
            'duration': duration,
            'file': f"/assets/detbom-freestyles/{slug}/master.mp3",
            'coverArt': f"/assets/detbom-freestyles/{slug}/cover.jpg",
            'description': generate_description(freestyle['title'], freestyle['description']),
            'date': freestyle['date']
        }
        track_entries.append(track_entry)

        print(f"  Done! Duration: {duration}")

    # Save track metadata for later use
    metadata_file = os.path.join(PROJECT_ROOT, "outputs/ig_freestyle_tracks.json")
    with open(metadata_file, 'w') as f:
        json.dump(track_entries, f, indent=2)

    print("\n" + "="*70)
    print(f"  Processing Complete!")
    print(f"  Total tracks processed: {len(track_entries)}")
    print(f"  Metadata saved to: {metadata_file}")
    print("="*70 + "\n")

    return track_entries

if __name__ == "__main__":
    main()
