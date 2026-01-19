#!/usr/bin/env npx tsx
/**
 * Upload recent media files (last 7 days) to Vercel Blob Storage
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_FILE = path.join(__dirname, '..', 'outputs', 'recent-media-blob-urls.json');

interface BlobMapping {
  [localPath: string]: string;
}

interface MediaFile {
  localPath: string;
  blobPath: string;
  contentType: string;
}

// Recent media files to upload (under 500MB for Vercel Blob limit)
const RECENT_MEDIA: MediaFile[] = [
  {
    localPath: path.join(__dirname, '..', 'assets', 'videos', 'samraji_cyborg_detroit_real.mp4'),
    blobPath: 'videos/samraji_cyborg_detroit_real.mp4',
    contentType: 'video/mp4',
  },
  {
    localPath: path.join(__dirname, '..', 'inputs', 'nickel9-audio', 'VENOM Freestyle By Adi 55.mp4'),
    blobPath: 'videos/nickel9-productions/VENOM_FREESTYLE_ADI55.mp4',
    contentType: 'video/mp4',
  },
  {
    localPath: path.join(__dirname, '..', 'inputs', 'videos', 'NICKEL9_PRODUCTIONS', 'I_MEAN_IT_RADIO_FREESTYLE_ADI55.mov'),
    blobPath: 'videos/nickel9-productions/I_MEAN_IT_RADIO_FREESTYLE_ADI55.mov',
    contentType: 'video/quicktime',
  },
  {
    localPath: path.join(__dirname, '..', 'outputs', 'masters', 'COPS_OUT_ADI55_RAP.mp3'),
    blobPath: 'audio/masters/COPS_OUT_ADI55_RAP.mp3',
    contentType: 'audio/mpeg',
  },
];

async function uploadFile(file: MediaFile): Promise<string> {
  const fileBuffer = fs.readFileSync(file.localPath);
  console.log(`  File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  const blob = await put(file.blobPath, fileBuffer, {
    access: 'public',
    contentType: file.contentType,
    addRandomSuffix: false,
  });

  return blob.url;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  Recent Media - Vercel Blob Upload');
  console.log('='.repeat(70) + '\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('\nRun with: BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/upload-recent-media.ts');
    process.exit(1);
  }

  const mapping: BlobMapping = {};
  let uploaded = 0;
  let failed = 0;

  for (const file of RECENT_MEDIA) {
    if (!fs.existsSync(file.localPath)) {
      console.log(`Skipping ${file.blobPath} - file not found at ${file.localPath}`);
      failed++;
      continue;
    }

    console.log(`\nUploading ${path.basename(file.localPath)}...`);
    try {
      const url = await uploadFile(file);
      mapping[file.blobPath] = url;
      uploaded++;
      console.log(`  Done: ${url}`);
    } catch (error: any) {
      failed++;
      console.log(`  Failed: ${error.message}`);
    }
  }

  // Save mapping
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

  console.log('\n' + '='.repeat(70));
  console.log(`  Upload Complete!`);
  console.log(`  Uploaded: ${uploaded} files`);
  console.log(`  Failed: ${failed} files`);
  console.log(`  Mapping saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(70) + '\n');

  // Print the URLs for easy copy
  console.log('Blob URLs:');
  Object.entries(mapping).forEach(([blobPath, url]) => {
    console.log(`  ${blobPath}: ${url}`);
  });
}

main().catch(console.error);
