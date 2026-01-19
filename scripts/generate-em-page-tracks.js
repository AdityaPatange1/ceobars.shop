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
  title = title.replace(/ by Eminem$/, '');
  // Clean up special characters for display
  title = title.replace(/＊/g, '*');
  title = title.replace(/：/g, ':');
  title = title.replace(/⧸/g, '/');
  title = title.replace(/＂/g, '"');
  title = title.replace(/ ｜ Eminem$/, '');
  title = title.replace(/ ｜ Commercial ｜ Eminem$/, '');
  title = title.replace(/ ｜ Behind The Scenes ｜ Eminem$/, '');
  title = title.replace(/ ｜ Bad Meets Evil ｜ Eminem$/, '');
  title = title.replace(/ ｜ Teaser ｜ Eminem$/, '');
  // Shorten common patterns
  title = title.replace(/\[Official Audio\]/g, '(Audio)');
  title = title.replace(/\[Official Music Video\]/g, '(Video)');
  title = title.replace(/\[Official Video\]/g, '(Video)');
  title = title.replace(/\[Official Lyric Video\]/g, '(Lyric)');
  title = title.replace(/\(Official Music Video\)/g, '(Video)');
  title = title.replace(/\(Official Video\)/g, '(Video)');
  title = title.replace(/\(Official Audio\)/g, '(Audio)');
  title = title.replace(/\(Lyric Video\)/g, '(Lyric)');
  title = title.replace(/\(Behind The Scenes\)/g, '(BTS)');
  title = title.replace(/\[Behind The Scenes\]/g, '(BTS)');
  title = title.replace(/ - Clean Version/g, ' (Clean)');
  title = title.replace(/ \(Explicit\)/g, ' (Explicit)');
  title = title.replace(/\[Explicit\]/g, '(Explicit)');
  return title.trim().substring(0, 60); // Limit length
}

let id = 1;
const tracks = [];

// Process official tracks
officialFiles.forEach((file) => {
  const title = cleanTitle(file);
  tracks.push({
    id: id++,
    title: title,
    source: 'eminem-official',
    file: file,
  });
});

// Process vevo tracks
vevoFiles.forEach((file) => {
  let title = cleanTitle(file);
  // Add VEVO suffix to distinguish
  title = title + ' (VEVO)';
  tracks.push({
    id: id++,
    title: title.substring(0, 60),
    source: 'eminem-vevo',
    file: file,
  });
});

// Generate the tracks array
const output = tracks.map(t =>
  `  { id: ${t.id}, title: ${JSON.stringify(t.title)}, source: "${t.source}", file: \`${t.file}\`, artist: "Eminem", album: "EM ZEN ZONE A" }`
).join(',\n');

console.log('// DETBOM MUSIC ZEM1 - Complete Eminem Archive (' + tracks.length + ' Tracks)');
console.log('// EMROAD Protocol: Eminem Music Repository On Aditya\'s Domain');
console.log('const tracks: Track[] = [');
console.log(output);
console.log('];');
console.log(`\n// Total tracks: ${tracks.length}`);
