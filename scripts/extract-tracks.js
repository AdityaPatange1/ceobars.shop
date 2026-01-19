#!/usr/bin/env node
/**
 * Extract all track metadata from tracks page for DistroKid upload
 */

const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const tracksFile = path.join(projectDir, 'src/app/tracks/page.tsx');
const outputDir = path.join(projectDir, 'distrokid-releases');
const outputFile = path.join(outputDir, 'all-tracks.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the tracks file
const content = fs.readFileSync(tracksFile, 'utf8');

// Find the tracks array - it starts after "const tracks: Track[] = [" and ends before "];"
const startMarker = 'const tracks: Track[] = [';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
    console.error('Could not find tracks array start');
    process.exit(1);
}

// Find the matching closing bracket
let bracketCount = 0;
let inString = false;
let stringChar = '';
let endIdx = -1;

for (let i = startIdx + startMarker.length; i < content.length; i++) {
    const char = content[i];
    const prevChar = content[i - 1];

    // Handle string detection
    if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
            inString = true;
            stringChar = char;
        } else if (char === stringChar) {
            inString = false;
        }
    }

    if (!inString) {
        if (char === '[' || char === '{') bracketCount++;
        if (char === ']' || char === '}') bracketCount--;

        if (char === ']' && bracketCount === -1) {
            endIdx = i;
            break;
        }
    }
}

if (endIdx === -1) {
    console.error('Could not find tracks array end');
    process.exit(1);
}

const tracksArrayContent = content.substring(startIdx + startMarker.length, endIdx);

// Parse individual track objects
const tracks = [];
let currentTrack = {};
let depth = 0;
let currentKey = '';
let currentValue = '';
let inValue = false;
let valueStringChar = '';

const lines = tracksArrayContent.split('\n');

for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '{') {
        currentTrack = {};
        continue;
    }

    if (trimmed === '},' || trimmed === '}') {
        if (currentTrack.id && currentTrack.title) {
            // Clean up values
            for (const key in currentTrack) {
                if (typeof currentTrack[key] === 'string') {
                    currentTrack[key] = currentTrack[key]
                        .replace(/^["']|["']$/g, '')
                        .replace(/\\'/g, "'")
                        .replace(/&apos;/g, "'");
                }
            }
            currentTrack.genre = 'Hip-Hop/Rap';
            tracks.push(currentTrack);
        }
        currentTrack = {};
        continue;
    }

    // Parse key: value pairs
    const match = trimmed.match(/^(\w+):\s*(.+?),?$/);
    if (match) {
        const key = match[1];
        let value = match[2];

        // Remove trailing comma
        value = value.replace(/,\s*$/, '');

        // Handle string values
        if (value.startsWith('"') || value.startsWith("'")) {
            const quote = value[0];
            // Find the end quote
            if (value.endsWith(quote)) {
                value = value.slice(1, -1);
            } else {
                value = value.slice(1);
            }
        }

        // Handle numeric values
        if (/^\d+$/.test(value)) {
            value = parseInt(value, 10);
        }

        // Handle array values like featuring
        if (typeof value === 'string' && value.startsWith('[')) {
            try {
                // Simple array parsing
                const arrayMatch = value.match(/\["([^"]+)"\]/);
                if (arrayMatch) {
                    value = [arrayMatch[1]];
                }
            } catch (e) {
                value = [];
            }
        }

        // Map to our schema
        const keyMap = {
            'id': 'id',
            'title': 'title',
            'artist': 'artist',
            'album': 'album',
            'duration': 'duration',
            'file': 'file',
            'coverArt': 'coverArt',
            'description': 'description',
            'releaseDate': 'releaseDate',
            'instrumental': 'instrumental',
            'featuring': 'featuring'
        };

        if (keyMap[key]) {
            currentTrack[keyMap[key]] = value;
        }
    }
}

// Output results
console.log(`Extracted ${tracks.length} tracks`);

// Group by album for summary
const albums = {};
for (const track of tracks) {
    if (!albums[track.album]) {
        albums[track.album] = [];
    }
    albums[track.album].push(track);
}

console.log(`\nAlbums (${Object.keys(albums).length}):`);
for (const [album, albumTracks] of Object.entries(albums)) {
    console.log(`  - ${album}: ${albumTracks.length} tracks`);
}

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2));
console.log(`\nSaved to: ${outputFile}`);

// Also create per-album release configs
const releasesDir = path.join(outputDir, 'releases');
if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true });
}

for (const [album, albumTracks] of Object.entries(albums)) {
    const config = {
        title: album,
        artist: albumTracks[0].artist,
        recordLabel: "SEA Records Worldwide",
        genre: "Hip-Hop/Rap",
        releaseDate: new Date().toISOString().split('T')[0],
        tracks: albumTracks,
        stores: [
            "spotify", "apple-music", "amazon-music", "youtube-music",
            "tidal", "deezer", "pandora", "iheartradio", "soundcloud"
        ],
        explicitContent: false,
        composers: ["Aditya Patange"],
        producers: ["Aditya Patange", "Nickel 9 Productions"]
    };

    const safeAlbumName = album
        .replace(/[\/\\:*?"<>|]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/™/g, '')
        .toLowerCase();

    const configPath = path.join(releasesDir, `${safeAlbumName}.json`);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

console.log(`\nRelease configs saved to: ${releasesDir}`);
