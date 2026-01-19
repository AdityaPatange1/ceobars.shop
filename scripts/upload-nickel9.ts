#!/usr/bin/env npx tsx
/**
 * Upload Nickel9 Productions assets to Vercel Blob Storage
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const NICKEL9_DIR = path.join(__dirname, '..', 'public', 'assets', 'nickel9-productions');
const OUTPUT_FILE = path.join(__dirname, '..', 'outputs', 'nickel9-blob-urls.json');

interface BlobMapping {
  [localPath: string]: string;
}

async function uploadFile(filePath: string, blobPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith('.mp3') ? 'audio/mpeg' : 'image/jpeg';

  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });

  return blob.url;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  Nickel9 Productions - Vercel Blob Upload');
  console.log('='.repeat(70) + '\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    process.exit(1);
  }

  const mapping: BlobMapping = {};
  const tracks = fs.readdirSync(NICKEL9_DIR).filter(f => !f.startsWith('.'));

  for (const track of tracks) {
    const trackDir = path.join(NICKEL9_DIR, track);
    if (!fs.statSync(trackDir).isDirectory()) continue;

    const files = fs.readdirSync(trackDir).filter(f => /\.(mp3|jpg)$/i.test(f));

    for (const file of files) {
      const filePath = path.join(trackDir, file);
      const blobPath = `assets/nickel9-productions/${track}/${file}`;
      const localPath = `/assets/nickel9-productions/${track}/${file}`;

      console.log(`Uploading ${blobPath}...`);
      try {
        const url = await uploadFile(filePath, blobPath);
        mapping[localPath] = url;
        console.log(`  ✓ ${url}`);
      } catch (error: any) {
        console.log(`  ✗ Failed: ${error.message}`);
      }
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
