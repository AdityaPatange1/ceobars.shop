#!/usr/bin/env node
/**
 * Update tracks page to use Vercel Blob URLs
 */

const fs = require('fs');
const path = require('path');

const MAPPING_FILE = path.join(__dirname, '..', 'outputs', 'blob-urls.json');
const TRACKS_FILE = path.join(__dirname, '..', 'src', 'app', 'tracks', 'page.tsx');

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  CEO BARS - Update Tracks with Blob URLs');
  console.log('='.repeat(70) + '\n');

  // Read blob mapping
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error('Error: Blob mapping file not found.');
    console.error('Run upload-to-blob.ts first.');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  console.log(`Loaded ${Object.keys(mapping).length} URL mappings\n`);

  // Read tracks file
  let tracksContent = fs.readFileSync(TRACKS_FILE, 'utf-8');
  let replacements = 0;

  // Replace all local asset URLs with blob URLs
  for (const [localPath, blobUrl] of Object.entries(mapping)) {
    // Normalize paths for matching
    const searchPath = localPath.replace(/\\/g, '/');
    if (tracksContent.includes(searchPath)) {
      tracksContent = tracksContent.split(searchPath).join(blobUrl);
      replacements++;
      console.log(`Replaced: ${searchPath}`);
    }
  }

  // Write updated file
  fs.writeFileSync(TRACKS_FILE, tracksContent);

  console.log('\n' + '='.repeat(70));
  console.log(`  Update Complete!`);
  console.log(`  Replaced ${replacements} URLs in tracks page`);
  console.log('='.repeat(70) + '\n');
}

main();
