#!/usr/bin/env node
/**
 * Add Singles to the tracks page
 *
 * Usage: node scripts/add_singles.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const METADATA_FILE = path.join(PROJECT_ROOT, 'outputs', 'singles_metadata.json');
const BLOB_URLS_FILE = path.join(PROJECT_ROOT, 'outputs', 'singles_blob_urls.json');
const TRACKS_FILE = path.join(PROJECT_ROOT, 'src', 'app', 'tracks', 'page.tsx');

console.log('\n' + '='.repeat(70));
console.log('  CEO BARS - Add Singles to Tracks Page');
console.log('='.repeat(70) + '\n');

// Load metadata
if (!fs.existsSync(METADATA_FILE)) {
  console.error('Error: Metadata file not found. Run download_singles.sh first.');
  process.exit(1);
}

if (!fs.existsSync(BLOB_URLS_FILE)) {
  console.error('Error: Blob URLs file not found. Run upload_singles.sh first.');
  process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
const blobUrls = JSON.parse(fs.readFileSync(BLOB_URLS_FILE, 'utf-8'));

console.log(`Loaded ${metadata.length} tracks from metadata`);
console.log(`Loaded ${Object.keys(blobUrls).length} blob URLs\n`);

// Read current tracks file
let tracksContent = fs.readFileSync(TRACKS_FILE, 'utf-8');

// Find the highest existing ID
const idMatches = tracksContent.matchAll(/id:\s*(\d+),/g);
let maxId = 0;
for (const match of idMatches) {
  const id = parseInt(match[1]);
  if (id > maxId) maxId = id;
}

console.log(`Current highest track ID: ${maxId}\n`);

// Generate track entries
const trackEntries = [];
let currentId = maxId;

for (const track of metadata) {
  currentId++;

  // Get blob URLs
  const mp3Path = `/assets/singles/${track.slug}/master.mp3`;
  const coverPath = `/assets/singles/${track.slug}/cover.jpg`;

  const mp3Url = blobUrls[mp3Path];
  const coverUrl = blobUrls[coverPath];

  if (!mp3Url) {
    console.log(`Skipping ${track.title} - no MP3 URL found`);
    continue;
  }

  // Generate description from title and video description
  let description = track.description || '';
  if (description.length < 100) {
    description = `${track.title} - An official release from Adi 55's YouTube channel. Part of the Singles collection featuring professionally mastered audio from the original video release.`;
  } else {
    // Clean up and truncate description
    description = description
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/#\w+/g, '')
      .replace(/@\w+/g, '')
      .trim()
      .substring(0, 400);
    if (description.length === 400) {
      description = description.substring(0, description.lastIndexOf(' ')) + '...';
    }
  }

  // Format upload date
  let releaseDate = 'YouTube Release';
  if (track.upload_date && track.upload_date.length === 8) {
    const year = track.upload_date.substring(0, 4);
    const month = track.upload_date.substring(4, 6);
    const day = track.upload_date.substring(6, 8);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[parseInt(month) - 1] || month;
    releaseDate = `${parseInt(day)} ${monthName} ${year}`;
  }

  const entry = `  {
    id: ${currentId},
    title: ${JSON.stringify(track.title)},
    artist: "Adi 55",
    album: "SINGLES",
    duration: "${track.duration}",
    file: "${mp3Url || ''}",
    coverArt: "${coverUrl || ''}",
    description: ${JSON.stringify(description)},
    releaseDate: "${releaseDate}",
    featuring: ["Adi 55"],
    instrumental: "YouTube Original — Official Release",
  }`;

  trackEntries.push(entry);
  console.log(`Added: ${track.title} (ID: ${currentId})`);
}

if (trackEntries.length === 0) {
  console.log('\nNo new tracks to add.');
  process.exit(0);
}

// Find the tracks array by looking for its declaration
const tracksArrayStart = tracksContent.indexOf('const tracks: Track[] = [');
if (tracksArrayStart === -1) {
  console.error('Error: Could not find tracks array declaration in page.tsx');
  process.exit(1);
}

// Find the end of the tracks array by looking for "}," followed by "];" pattern
// This is the closing of the last track object followed by array close
const afterStart = tracksContent.substring(tracksArrayStart);
const arrayEndMatch = afterStart.match(/},\s*\n];/);
if (!arrayEndMatch) {
  console.error('Error: Could not find end of tracks array in page.tsx');
  process.exit(1);
}

const relativeEnd = afterStart.indexOf(arrayEndMatch[0]) + 2; // +2 to include "},"
const absoluteEnd = tracksArrayStart + relativeEnd;

// Insert new tracks after the last track entry
const beforeInsert = tracksContent.substring(0, absoluteEnd);
const afterInsert = tracksContent.substring(absoluteEnd);

const newContent = beforeInsert + '\n' + trackEntries.join(',\n') + ',' + afterInsert;

fs.writeFileSync(TRACKS_FILE, newContent);

console.log('\n' + '='.repeat(70));
console.log(`  Added ${trackEntries.length} Singles to tracks page!`);
console.log(`  New highest ID: ${currentId}`);
console.log('='.repeat(70) + '\n');
