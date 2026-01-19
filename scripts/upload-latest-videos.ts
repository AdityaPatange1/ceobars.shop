#!/usr/bin/env npx tsx
/**
 * Upload latest videos to Vercel Blob Storage
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const VIDEOS_DIR = path.join(__dirname, '..', 'inputs', 'videos', 'NICKEL9_PRODUCTIONS');
const OUTPUT_FILE = path.join(__dirname, '..', 'outputs', 'latest-videos-blob-urls.json');

interface BlobMapping {
  [localPath: string]: string;
}

// The 5 latest videos by date (under 500MB for Vercel Blob limit)
const LATEST_VIDEOS = [
  'BRAINSAW_SYMPHONY_DEMON_V5_ADI55.mov',
  'HIP_HOP_RD59_UPGRADE_V2_ADI55.mov',
  'FUEL_DUAL_FREESTYLE_ADI55.mov',
  'SC_SONIC_CUNT_FREESTYLE_ADI55.mov',
  'EM_GENETICS_FREESTYLE.mov',
];

async function uploadFile(filePath: string, blobPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime';

  console.log(`  File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });

  return blob.url;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  Latest Videos - Vercel Blob Upload');
  console.log('='.repeat(70) + '\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    process.exit(1);
  }

  const mapping: BlobMapping = {};

  for (const video of LATEST_VIDEOS) {
    const filePath = path.join(VIDEOS_DIR, video);

    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${video} - file not found`);
      continue;
    }

    const blobPath = `videos/nickel9-productions/${video}`;
    const localPath = `/videos/nickel9-productions/${video}`;

    console.log(`\nUploading ${video}...`);
    try {
      const url = await uploadFile(filePath, blobPath);
      mapping[localPath] = url;
      console.log(`  Done: ${url}`);
    } catch (error: any) {
      console.log(`  Failed: ${error.message}`);
    }
  }

  // Save mapping
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

  console.log('\n' + '='.repeat(70));
  console.log(`  Upload Complete! Mapping saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(70) + '\n');

  // Print the URLs for easy copy
  console.log('Blob URLs:');
  Object.entries(mapping).forEach(([local, url]) => {
    console.log(`  ${local}: ${url}`);
  });
}

main().catch(console.error);
