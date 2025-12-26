#!/usr/bin/env npx ts-node
/**
 * Upload audio files and covers to Vercel Blob Storage
 *
 * Usage:
 * 1. Get BLOB_READ_WRITE_TOKEN from Vercel dashboard:
 *    - Go to project settings > Storage > Connect Store > Create Blob Store
 *    - Copy the BLOB_READ_WRITE_TOKEN
 * 2. Run: BLOB_READ_WRITE_TOKEN=xxx npx ts-node scripts/upload-to-blob.ts
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const OUTPUT_FILE = path.join(__dirname, '..', 'outputs', 'blob-urls.json');

interface BlobMapping {
  [localPath: string]: string;
}

async function findAllMediaFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findAllMediaFiles(fullPath));
    } else if (/\.(mp3|jpg|png|jpeg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function uploadFile(filePath: string, basePath: string): Promise<{ localPath: string; blobUrl: string }> {
  const relativePath = path.relative(basePath, filePath);
  const blobPath = `assets/${relativePath}`;

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith('.mp3') ? 'audio/mpeg'
    : filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ? 'image/jpeg'
    : 'image/png';

  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    contentType,
  });

  return {
    localPath: `/assets/${relativePath}`,
    blobUrl: blob.url,
  };
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  CEO BARS - Vercel Blob Upload');
  console.log('='.repeat(70) + '\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('\nTo get your token:');
    console.error('1. Go to https://vercel.com/dashboard');
    console.error('2. Select your project');
    console.error('3. Go to Storage > Create Store > Blob');
    console.error('4. Copy the BLOB_READ_WRITE_TOKEN from .env.local');
    console.error('\nThen run:');
    console.error('BLOB_READ_WRITE_TOKEN=xxx npx ts-node scripts/upload-to-blob.ts');
    process.exit(1);
  }

  // Find all media files
  console.log('Scanning for media files...');
  const files = await findAllMediaFiles(ASSETS_DIR);
  console.log(`Found ${files.length} files to upload\n`);

  const mapping: BlobMapping = {};
  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const relativePath = path.relative(ASSETS_DIR, file);
    process.stdout.write(`[${uploaded + failed + 1}/${files.length}] Uploading ${relativePath}...`);

    try {
      const result = await uploadFile(file, ASSETS_DIR);
      mapping[result.localPath] = result.blobUrl;
      uploaded++;
      console.log(' Done');
    } catch (error: any) {
      failed++;
      console.log(` Failed: ${error.message}`);
    }
  }

  // Save mapping to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

  console.log('\n' + '='.repeat(70));
  console.log(`  Upload Complete!`);
  console.log(`  Uploaded: ${uploaded} files`);
  console.log(`  Failed: ${failed} files`);
  console.log(`  Mapping saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(70) + '\n');

  // Print next steps
  console.log('Next steps:');
  console.log('1. Run: npx ts-node scripts/update-tracks-blob.ts');
  console.log('2. Remove public/assets audio files');
  console.log('3. Deploy to Vercel\n');
}

main().catch(console.error);
