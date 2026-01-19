#!/usr/bin/env npx tsx
/**
 * Upload new cover art for tracks to Vercel Blob Storage
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

interface CoverFile {
  localPath: string;
  blobPath: string;
  trackName: string;
}

const COVER_ART: CoverFile[] = [
  {
    localPath: path.join(__dirname, '..', 'public', 'assets', 'nickel9-productions', 'cops-out', 'cover.jpg'),
    blobPath: 'assets/nickel9-productions/cops-out/cover.jpg',
    trackName: 'COPS OUT',
  },
  {
    localPath: path.join(__dirname, '..', 'public', 'assets', 'nickel9-productions', 'venom-freestyle', 'cover.jpg'),
    blobPath: 'assets/nickel9-productions/venom-freestyle/cover.jpg',
    trackName: 'VENOM Freestyle',
  },
  {
    localPath: path.join(__dirname, '..', 'public', 'assets', 'nickel9-productions', 'i-mean-it-radio-freestyle', 'cover.jpg'),
    blobPath: 'assets/nickel9-productions/i-mean-it-radio-freestyle/cover.jpg',
    trackName: 'I MEAN IT RADIO Freestyle',
  },
  {
    localPath: path.join(__dirname, '..', 'public', 'assets', 'nickel9-productions', 'samraji-cyborg-detroit', 'cover.jpg'),
    blobPath: 'assets/nickel9-productions/samraji-cyborg-detroit/cover.jpg',
    trackName: 'SAMRAJI CYBORG DETROIT',
  },
];

async function uploadFile(file: CoverFile): Promise<string> {
  const fileBuffer = fs.readFileSync(file.localPath);
  console.log(`  File size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);

  const blob = await put(file.blobPath, fileBuffer, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
  });

  return blob.url;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  Cover Art Upload - Vercel Blob');
  console.log('='.repeat(70) + '\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('\nRun with: BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/upload-cover-art.ts');
    process.exit(1);
  }

  const urls: { [key: string]: string } = {};

  for (const file of COVER_ART) {
    if (!fs.existsSync(file.localPath)) {
      console.log(`Skipping ${file.trackName} - file not found at ${file.localPath}`);
      continue;
    }

    console.log(`\nUploading cover for ${file.trackName}...`);
    try {
      const url = await uploadFile(file);
      urls[file.trackName] = url;
      console.log(`  Done: ${url}`);
    } catch (error: any) {
      console.log(`  Failed: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('  Upload Complete!');
  console.log('='.repeat(70) + '\n');

  console.log('New Cover Art URLs:');
  Object.entries(urls).forEach(([track, url]) => {
    console.log(`  ${track}: ${url}`);
  });

  console.log('\nUpdate the tracks/page.tsx with these URLs for coverArt field.');
}

main().catch(console.error);
