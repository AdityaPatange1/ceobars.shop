#!/usr/bin/env node
/**
 * Update all track metadata for DistroKid upload
 * Sets: Aditya Patange as artist, Nickel 9 Productions as producer
 */

const fs = require('fs');
const path = require('path');

const METADATA = {
    primaryArtist: 'Aditya Patange',
    featuredArtist: 'Adi 55',
    producer: 'Nickel 9 Productions',
    recordLabel: 'SEA Records Worldwide',
    composer: 'Aditya Patange',
    lyricist: 'Aditya Patange',
    genre: 'Hip-Hop/Rap',
    subGenre: 'Underground Hip-Hop',
    language: 'English',
    explicit: false,
    copyright: '© 2025 SEA Records Worldwide',
    publishingRights: '℗ 2025 Aditya Patange'
};

const tracksFile = path.join(__dirname, '../../distrokid-releases/all-tracks.json');
const outputFile = path.join(__dirname, '../../distrokid-releases/all-tracks-distrokid.json');
const releasesDir = path.join(__dirname, '../../distrokid-releases/releases');

// Load tracks
const tracks = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));

console.log(`Updating ${tracks.length} tracks for DistroKid...`);
console.log(`\nArtist: ${METADATA.primaryArtist}`);
console.log(`Producer: ${METADATA.producer}`);
console.log(`Label: ${METADATA.recordLabel}\n`);

// Update each track
const updatedTracks = tracks.map((track, index) => {
    return {
        ...track,
        // Core metadata
        primaryArtist: METADATA.primaryArtist,
        featuredArtists: [METADATA.featuredArtist],
        producer: METADATA.producer,
        recordLabel: METADATA.recordLabel,

        // Credits
        composer: METADATA.composer,
        lyricist: METADATA.lyricist,
        songwriter: METADATA.composer,

        // Classification
        genre: METADATA.genre,
        subGenre: METADATA.subGenre,
        language: METADATA.language,
        explicit: METADATA.explicit,

        // Rights
        copyright: METADATA.copyright,
        publishingRights: METADATA.publishingRights,

        // DistroKid specific
        isrc: null, // Let DistroKid generate
        upc: null,  // Let DistroKid generate

        // Track number within album
        trackNumber: index + 1,

        // Formatted release date
        formattedReleaseDate: formatReleaseDate(track.releaseDate)
    };
});

function formatReleaseDate(dateStr) {
    // Convert "25th December 2025" to "2025-12-25"
    const months = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };

    try {
        const match = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/);
        if (match) {
            const day = match[1].padStart(2, '0');
            const month = months[match[2]] || '01';
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
    } catch (e) {}

    return new Date().toISOString().split('T')[0];
}

// Save updated tracks
fs.writeFileSync(outputFile, JSON.stringify(updatedTracks, null, 2));
console.log(`Updated tracks saved to: ${outputFile}`);

// Group by album and create release configs
const albums = {};
for (const track of updatedTracks) {
    if (!albums[track.album]) {
        albums[track.album] = [];
    }
    albums[track.album].push(track);
}

// Create release configs for each album
if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true });
}

for (const [albumName, albumTracks] of Object.entries(albums)) {
    const releaseConfig = {
        // Release info
        title: albumName,
        type: albumTracks.length === 1 ? 'single' : (albumTracks.length <= 6 ? 'ep' : 'album'),

        // Artist info
        primaryArtist: METADATA.primaryArtist,
        featuredArtists: [METADATA.featuredArtist],

        // Credits
        producer: METADATA.producer,
        composer: METADATA.composer,
        lyricist: METADATA.lyricist,

        // Label
        recordLabel: METADATA.recordLabel,
        copyright: METADATA.copyright,
        publishingRights: METADATA.publishingRights,

        // Classification
        genre: METADATA.genre,
        subGenre: METADATA.subGenre,
        language: METADATA.language,
        explicit: METADATA.explicit,

        // Release date (use earliest track date)
        releaseDate: albumTracks[0].formattedReleaseDate,

        // Distribution
        stores: [
            'spotify',
            'apple_music',
            'amazon_music',
            'youtube_music',
            'tiktok',
            'instagram',
            'facebook',
            'tidal',
            'deezer',
            'pandora',
            'iheartradio',
            'soundcloud',
            'shazam'
        ],

        // Tracks
        trackCount: albumTracks.length,
        tracks: albumTracks.map((track, i) => ({
            trackNumber: i + 1,
            title: track.title,
            duration: track.duration,
            audioFile: track.file,
            coverArt: track.coverArt,
            isrc: null,
            explicit: false,
            lyrics: null,
            previewStart: 30
        }))
    };

    const safeAlbumName = albumName
        .replace(/[\/\\:*?"<>|]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/™/g, '')
        .toLowerCase();

    const configPath = path.join(releasesDir, `${safeAlbumName}-distrokid.json`);
    fs.writeFileSync(configPath, JSON.stringify(releaseConfig, null, 2));
    console.log(`Created: ${safeAlbumName}-distrokid.json (${albumTracks.length} tracks)`);
}

console.log(`\n${'='.repeat(60)}`);
console.log('METADATA UPDATE COMPLETE');
console.log(`${'='.repeat(60)}`);
console.log(`\nTotal tracks: ${updatedTracks.length}`);
console.log(`Albums: ${Object.keys(albums).length}`);
console.log(`\nAlbum breakdown:`);
for (const [album, tracks] of Object.entries(albums)) {
    console.log(`  - ${album}: ${tracks.length} tracks`);
}
console.log(`\nAll tracks attributed to:`);
console.log(`  Artist:   ${METADATA.primaryArtist}`);
console.log(`  Producer: ${METADATA.producer}`);
console.log(`  Label:    ${METADATA.recordLabel}`);
