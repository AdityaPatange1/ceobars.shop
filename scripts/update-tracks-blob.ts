#!/usr/bin/env npx ts-node
/**
 * Update tracks page to use Vercel Blob URLs
 *
 * Usage: npx ts-node scripts/update-tracks-blob.ts
 */

import * as fs from 'fs';
import * as path from 'path';

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

  const mapping: Record<string, string> = JSON.parse(
    fs.readFileSync(MAPPING_FILE, 'utf-8')
  );

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

  console.log('Next steps:');
  console.log('1. Remove audio files from public/assets');
  console.log('2. Deploy to Vercel\n');
}

main();
