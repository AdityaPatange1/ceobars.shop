const fs = require('fs');
const path = require('path');

const publicDir = '/Users/adamantium/ceobars/ceobars.shop/public/assets/eminem-zen-zone';
const officialDir = path.join(publicDir, 'eminem-official');
const vevoDir = path.join(publicDir, 'eminem-vevo');

// Get all MP3 files
const officialFiles = fs.readdirSync(officialDir).filter(f => f.endsWith('.mp3')).sort();
const vevoFiles = fs.readdirSync(vevoDir).filter(f => f.endsWith('.mp3')).sort();

// Clean title from filename
function cleanTitle(filename) {
  let title = filename.replace('.mp3', '');
  // Remove common prefixes
  title = title.replace(/^Eminem - /, '');
  title = title.replace(/^Eminem ft\. /, 'ft. ');
  title = title.replace(/^Eminem, /, '');
  title = title.replace(/^Eminem & /, '');
  // Clean up special characters
  title = title.replace(/＊/g, '*');
  title = title.replace(/：/g, ':');
  title = title.replace(/⧸/g, '/');
  title = title.replace(/＂/g, '"');
  title = title.replace(/ ｜ Eminem$/, '');
  title = title.replace(/ ｜ Commercial ｜ Eminem$/, '');
  title = title.replace(/ ｜ Behind The Scenes ｜ Eminem$/, '');
  title = title.replace(/ ｜ Bad Meets Evil ｜ Eminem$/, '');
  title = title.replace(/ ｜ Teaser ｜ Eminem$/, '');
  return title.trim();
}

// Extract featuring artists from title
function extractFeaturing(title) {
  const feats = [];
  const featMatch = title.match(/(?:ft\.|feat\.|featuring|Ft\.|Feat\.)\s*([^[\]()]+?)(?:\s*[\[\(]|$)/i);
  if (featMatch) {
    const artists = featMatch[1].split(/[,&]/).map(a => a.trim()).filter(a => a);
    feats.push(...artists);
  }
  feats.push('Eminem');
  return [...new Set(feats)];
}

// Check if cover exists
function getCoverPath(filename, dir, subdir) {
  const jpgFile = filename.replace('.mp3', '.jpg');
  const jpgPath = path.join(dir, jpgFile);
  if (fs.existsSync(jpgPath)) {
    return `/assets/eminem-zen-zone/${subdir}/${encodeURIComponent(jpgFile)}`;
  }
  return '/assets/eminem-zen-zone/cover.jpg';
}

let startId = 200; // Starting ID for Eminem tracks
const tracks = [];

// Process official tracks
officialFiles.forEach((file, idx) => {
  const title = cleanTitle(file);
  const featuring = extractFeaturing(title);
  const coverArt = getCoverPath(file, officialDir, 'eminem-official');

  tracks.push({
    id: startId + idx,
    title: title,
    artist: 'Eminem',
    album: 'EM ZEN ZONE A',
    duration: '3:30', // Placeholder
    file: `/assets/eminem-zen-zone/eminem-official/${encodeURIComponent(file)}`,
    coverArt: coverArt,
    description: `${title} from the EM ZEN ZONE A collection. This track is part of the complete Eminem archive featuring content from EminemMusic Official YouTube channel.`,
    releaseDate: '28th December 2025',
    featuring: featuring,
    instrumental: 'Various Producers',
  });
});

// Process vevo tracks
const vevoStartId = startId + officialFiles.length;
vevoFiles.forEach((file, idx) => {
  const title = cleanTitle(file);
  const featuring = extractFeaturing(title);
  const coverArt = getCoverPath(file, vevoDir, 'eminem-vevo');

  tracks.push({
    id: vevoStartId + idx,
    title: title + ' (VEVO)',
    artist: 'Eminem',
    album: 'EM ZEN ZONE A',
    duration: '3:30', // Placeholder
    file: `/assets/eminem-zen-zone/eminem-vevo/${encodeURIComponent(file)}`,
    coverArt: coverArt,
    description: `${title} from the EM ZEN ZONE A collection. This track is part of the complete Eminem archive featuring content from EminemVEVO YouTube channel.`,
    releaseDate: '28th December 2025',
    featuring: featuring,
    instrumental: 'Various Producers',
  });
});

// Generate TypeScript-compatible output
const output = tracks.map(t => `  {
    id: ${t.id},
    title: ${JSON.stringify(t.title)},
    artist: ${JSON.stringify(t.artist)},
    album: ${JSON.stringify(t.album)},
    duration: ${JSON.stringify(t.duration)},
    file: ${JSON.stringify(t.file)},
    coverArt: ${JSON.stringify(t.coverArt)},
    description: ${JSON.stringify(t.description)},
    releaseDate: ${JSON.stringify(t.releaseDate)},
    featuring: ${JSON.stringify(t.featuring)},
    instrumental: ${JSON.stringify(t.instrumental)},
  }`).join(',\n');

console.log('// EM ZEN ZONE A - Eminem Archive (399 tracks)');
console.log(output);
console.log(`\n// Total tracks: ${tracks.length}`);
