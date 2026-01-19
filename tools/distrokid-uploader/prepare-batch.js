#!/usr/bin/env node
/**
 * Prepare batch upload files for DistroKid
 * Downloads all audio/covers and creates upload-ready structure
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
    artist: 'Aditya Patange',
    producer: 'Nickel 9 Productions',
    label: 'SEA Records Worldwide',
    tracksFile: path.join(__dirname, '../../distrokid-releases/all-tracks-distrokid.json'),
    outputDir: path.join(__dirname, '../../distrokid-releases/batch-upload')
};

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) {
            console.log(`  [SKIP] Already exists: ${path.basename(dest)}`);
            resolve(dest);
            return;
        }

        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve(dest);
                    });
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(dest);
                });
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

function sanitizeName(name) {
    return name
        .replace(/[\/\\:*?"<>|™]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^\w\-_.]/g, '')
        .substring(0, 50);
}

async function main() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║        DISTROKID BATCH UPLOAD PREPARATION                    ║
║                                                              ║
║  Artist:    ${CONFIG.artist.padEnd(40)}║
║  Producer:  ${CONFIG.producer.padEnd(40)}║
║  Label:     ${CONFIG.label.padEnd(40)}║
╚══════════════════════════════════════════════════════════════╝
`);

    // Load tracks
    const tracks = JSON.parse(fs.readFileSync(CONFIG.tracksFile, 'utf8'));
    console.log(`Loaded ${tracks.length} tracks\n`);

    // Group by album
    const albums = {};
    for (const track of tracks) {
        const album = track.album || 'Singles';
        if (!albums[album]) albums[album] = [];
        albums[album].push(track);
    }

    // Create output directory
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });

    // Process each album
    for (const [albumName, albumTracks] of Object.entries(albums)) {
        const safeAlbumName = sanitizeName(albumName);
        const albumDir = path.join(CONFIG.outputDir, safeAlbumName);
        fs.mkdirSync(albumDir, { recursive: true });

        console.log(`\n${'='.repeat(60)}`);
        console.log(`Album: ${albumName} (${albumTracks.length} tracks)`);
        console.log(`${'='.repeat(60)}`);

        // Create album metadata
        const albumMeta = {
            album_title: albumName,
            artist: CONFIG.artist,
            featured_artist: 'Adi 55',
            producer: CONFIG.producer,
            record_label: CONFIG.label,
            genre: 'Hip-Hop/Rap',
            release_date: albumTracks[0].formattedReleaseDate || new Date().toISOString().split('T')[0],
            copyright: '© 2025 SEA Records Worldwide',
            tracks: []
        };

        // Download each track
        for (let i = 0; i < albumTracks.length; i++) {
            const track = albumTracks[i];
            const trackNum = String(i + 1).padStart(2, '0');
            const safeTitle = sanitizeName(track.title);

            console.log(`\n[${trackNum}/${albumTracks.length}] ${track.title}`);

            // Audio file
            const audioFile = `${trackNum}_${safeTitle}.mp3`;
            const audioPath = path.join(albumDir, audioFile);
            try {
                await downloadFile(track.file, audioPath);
                console.log(`  [OK] Audio: ${audioFile}`);
            } catch (e) {
                console.log(`  [ERR] Audio download failed: ${e.message}`);
            }

            // Cover art (one per album)
            if (i === 0) {
                const coverPath = path.join(albumDir, 'cover.jpg');
                try {
                    await downloadFile(track.coverArt, coverPath);
                    console.log(`  [OK] Cover: cover.jpg`);
                } catch (e) {
                    console.log(`  [ERR] Cover download failed: ${e.message}`);
                }
            }

            // Add to album metadata
            albumMeta.tracks.push({
                track_number: i + 1,
                title: track.title,
                filename: audioFile,
                duration: track.duration,
                artist: CONFIG.artist,
                featured_artist: 'Adi 55',
                producer: CONFIG.producer,
                songwriter: CONFIG.artist,
                composer: CONFIG.artist,
                explicit: false,
                language: 'English',
                isrc: '' // Let DistroKid generate
            });
        }

        // Save album metadata
        const metaPath = path.join(albumDir, 'metadata.json');
        fs.writeFileSync(metaPath, JSON.stringify(albumMeta, null, 2));
        console.log(`\n[OK] Metadata saved: metadata.json`);

        // Create CSV for batch import
        const csvPath = path.join(albumDir, 'tracks.csv');
        const csvHeader = 'Track Number,Title,Filename,Artist,Featured Artist,Producer,Songwriter,Duration,Explicit,Language';
        const csvRows = albumMeta.tracks.map(t =>
            `${t.track_number},"${t.title}","${t.filename}","${t.artist}","${t.featured_artist}","${t.producer}","${t.songwriter}","${t.duration}",${t.explicit},"${t.language}"`
        );
        fs.writeFileSync(csvPath, [csvHeader, ...csvRows].join('\n'));
        console.log(`[OK] CSV saved: tracks.csv`);
    }

    // Create master upload script
    const uploadScript = `#!/bin/bash
# DistroKid Upload Script
# Generated: ${new Date().toISOString()}
#
# Artist: ${CONFIG.artist}
# Producer: ${CONFIG.producer}
# Label: ${CONFIG.label}
#
# Instructions:
# 1. Log in to distrokid.com
# 2. Go to Upload
# 3. Upload each album folder below
#

echo "Albums ready for upload:"
echo ""
${Object.keys(albums).map(a => `echo "  - ${a} (${albums[a].length} tracks)"`).join('\n')}
echo ""
echo "Upload folder: ${CONFIG.outputDir}"
echo ""
echo "Open DistroKid and upload each album folder."
`;

    fs.writeFileSync(path.join(CONFIG.outputDir, 'upload.sh'), uploadScript);
    fs.chmodSync(path.join(CONFIG.outputDir, 'upload.sh'), '755');

    console.log(`\n${'='.repeat(60)}`);
    console.log('BATCH PREPARATION COMPLETE');
    console.log(`${'='.repeat(60)}`);
    console.log(`\nOutput directory: ${CONFIG.outputDir}`);
    console.log(`\nAlbums prepared:`);
    for (const [album, tracks] of Object.entries(albums)) {
        console.log(`  - ${album}: ${tracks.length} tracks`);
    }
    console.log(`\nTotal: ${tracks.length} tracks ready for upload`);
    console.log(`\nNext steps:`);
    console.log(`  1. Go to https://distrokid.com/upload/`);
    console.log(`  2. Upload each album folder from: ${CONFIG.outputDir}`);
    console.log(`  3. Use metadata.json for track details`);
}

main().catch(console.error);
