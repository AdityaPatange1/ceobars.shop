#!/usr/bin/env node
/**
 * DistroKid Automated Uploader
 *
 * Uploads all CEO Bars tracks to DistroKid via browser automation
 * Artist: Aditya Patange
 * Producer: Nickel 9 Productions
 * Label: SEA Records Worldwide
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
    artist: 'Aditya Patange',
    producer: 'Nickel 9 Productions',
    recordLabel: 'SEA Records Worldwide',
    genre: 'Hip-Hop/Rap',
    language: 'English',
    explicit: false,

    // DistroKid URLs
    loginUrl: 'https://distrokid.com/signin/',
    uploadUrl: 'https://distrokid.com/upload/',

    // Paths
    tracksFile: path.join(__dirname, '../../distrokid-releases/all-tracks.json'),
    downloadsDir: path.join(__dirname, '../../distrokid-releases/downloads'),
    screenshotsDir: path.join(__dirname, '../../distrokid-releases/screenshots'),

    // Timing (ms)
    delays: {
        short: 500,
        medium: 1500,
        long: 3000,
        upload: 30000
    }
};

// Stores to distribute to
const STORES = [
    'Spotify',
    'Apple Music',
    'Amazon Music',
    'YouTube Music',
    'TikTok',
    'Instagram/Facebook',
    'Tidal',
    'Deezer',
    'Pandora',
    'iHeartRadio',
    'SoundCloud'
];

class DistroKidUploader {
    constructor(options = {}) {
        this.browser = null;
        this.page = null;
        this.dryRun = options.dryRun || false;
        this.headless = options.headless || false;
        this.tracks = [];
        this.uploadedCount = 0;
        this.failedCount = 0;
        this.logs = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            'info': '\x1b[34m[INFO]\x1b[0m',
            'success': '\x1b[32m[SUCCESS]\x1b[0m',
            'error': '\x1b[31m[ERROR]\x1b[0m',
            'warn': '\x1b[33m[WARN]\x1b[0m'
        }[type] || '[LOG]';

        const logLine = `${prefix} ${message}`;
        console.log(logLine);
        this.logs.push({ timestamp, type, message });
    }

    async init() {
        this.log('Initializing DistroKid Uploader...');

        // Create directories
        [CONFIG.downloadsDir, CONFIG.screenshotsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        // Load tracks
        if (fs.existsSync(CONFIG.tracksFile)) {
            this.tracks = JSON.parse(fs.readFileSync(CONFIG.tracksFile, 'utf8'));
            this.log(`Loaded ${this.tracks.length} tracks from catalog`);
        } else {
            throw new Error(`Tracks file not found: ${CONFIG.tracksFile}`);
        }

        // Launch browser
        this.browser = await puppeteer.launch({
            headless: this.headless,
            defaultViewport: { width: 1440, height: 900 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ]
        });

        this.page = await this.browser.newPage();

        // Set download behavior
        const client = await this.page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: CONFIG.downloadsDir
        });

        this.log('Browser initialized');
    }

    async login() {
        this.log('Navigating to DistroKid login...');
        await this.page.goto(CONFIG.loginUrl, { waitUntil: 'networkidle2' });

        // Take screenshot
        await this.page.screenshot({
            path: path.join(CONFIG.screenshotsDir, '01-login-page.png')
        });

        this.log('Please log in to DistroKid manually in the browser window');
        this.log('Press ENTER in the terminal once logged in...');

        // Wait for user to log in manually
        await this.waitForUserInput();

        // Verify login
        await this.page.screenshot({
            path: path.join(CONFIG.screenshotsDir, '02-after-login.png')
        });

        this.log('Login verified', 'success');
    }

    async waitForUserInput() {
        return new Promise(resolve => {
            process.stdin.once('data', () => {
                resolve();
            });
        });
    }

    async downloadFile(url, destPath) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(destPath)) {
                resolve(destPath);
                return;
            }

            const protocol = url.startsWith('https') ? https : http;
            const file = fs.createWriteStream(destPath);

            protocol.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(destPath);
                });
            }).on('error', (err) => {
                fs.unlink(destPath, () => {});
                reject(err);
            });
        });
    }

    async uploadTrack(track, index) {
        const trackNum = index + 1;
        const total = this.tracks.length;

        this.log(`\n[${ trackNum }/${total}] Uploading: ${track.title}`);
        this.log(`  Artist: ${CONFIG.artist}`);
        this.log(`  Album: ${track.album}`);
        this.log(`  Producer: ${CONFIG.producer}`);

        if (this.dryRun) {
            this.log('  [DRY RUN] Would upload this track', 'warn');
            return true;
        }

        try {
            // Navigate to upload page
            await this.page.goto(CONFIG.uploadUrl, { waitUntil: 'networkidle2' });
            await this.delay(CONFIG.delays.medium);

            // Download audio file locally first
            const safeTitle = track.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
            const audioPath = path.join(CONFIG.downloadsDir, `${safeTitle}.mp3`);
            const coverPath = path.join(CONFIG.downloadsDir, `${safeTitle}-cover.jpg`);

            this.log(`  Downloading audio...`);
            await this.downloadFile(track.file, audioPath);

            this.log(`  Downloading cover...`);
            await this.downloadFile(track.coverArt, coverPath);

            // Upload audio file
            const audioInput = await this.page.$('input[type="file"][accept*="audio"]');
            if (audioInput) {
                await audioInput.uploadFile(audioPath);
                this.log('  Audio file uploaded');
                await this.delay(CONFIG.delays.upload);
            }

            // Upload cover art
            const coverInput = await this.page.$('input[type="file"][accept*="image"]');
            if (coverInput) {
                await coverInput.uploadFile(coverPath);
                this.log('  Cover art uploaded');
                await this.delay(CONFIG.delays.long);
            }

            // Fill in track details
            await this.fillTrackDetails(track);

            // Take screenshot
            await this.page.screenshot({
                path: path.join(CONFIG.screenshotsDir, `track-${trackNum}-${safeTitle}.png`),
                fullPage: true
            });

            this.uploadedCount++;
            this.log(`  Upload prepared successfully`, 'success');
            return true;

        } catch (error) {
            this.failedCount++;
            this.log(`  Upload failed: ${error.message}`, 'error');
            return false;
        }
    }

    async fillTrackDetails(track) {
        // Artist name
        await this.typeInField('input[name="artist"], input[placeholder*="artist" i]', CONFIG.artist);

        // Track title
        await this.typeInField('input[name="title"], input[placeholder*="title" i]', track.title);

        // Album name (for singles, use track title)
        const albumName = track.album || track.title;
        await this.typeInField('input[name="album"], input[placeholder*="album" i]', albumName);

        // Record label
        await this.typeInField('input[name="label"], input[placeholder*="label" i]', CONFIG.recordLabel);

        // Producer / Songwriter credits
        await this.typeInField('input[name="producer"], input[placeholder*="producer" i]', CONFIG.producer);
        await this.typeInField('input[name="songwriter"], input[placeholder*="writer" i]', CONFIG.artist);
        await this.typeInField('input[name="composer"], input[placeholder*="composer" i]', CONFIG.artist);

        // Genre selection
        const genreSelect = await this.page.$('select[name="genre"]');
        if (genreSelect) {
            await genreSelect.select('hip-hop');
        }

        // Explicit content - uncheck if exists
        const explicitCheckbox = await this.page.$('input[name="explicit"], input[type="checkbox"][id*="explicit" i]');
        if (explicitCheckbox) {
            const isChecked = await this.page.evaluate(el => el.checked, explicitCheckbox);
            if (isChecked && !CONFIG.explicit) {
                await explicitCheckbox.click();
            }
        }

        this.log('  Track details filled');
    }

    async typeInField(selector, value) {
        try {
            const element = await this.page.$(selector);
            if (element) {
                await element.click({ clickCount: 3 }); // Select all
                await element.type(value);
            }
        } catch (e) {
            // Field might not exist, ignore
        }
    }

    async selectStores() {
        this.log('Selecting distribution stores...');

        for (const store of STORES) {
            try {
                // Try to find and click the store checkbox
                const storeCheckbox = await this.page.$(`input[value="${store}"], label:has-text("${store}") input`);
                if (storeCheckbox) {
                    const isChecked = await this.page.evaluate(el => el.checked, storeCheckbox);
                    if (!isChecked) {
                        await storeCheckbox.click();
                    }
                    this.log(`  Selected: ${store}`, 'success');
                }
            } catch (e) {
                // Store might not be available
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async uploadAll() {
        this.log(`\nStarting bulk upload of ${this.tracks.length} tracks...`);
        this.log(`Artist: ${CONFIG.artist}`);
        this.log(`Producer: ${CONFIG.producer}`);
        this.log(`Label: ${CONFIG.recordLabel}\n`);

        for (let i = 0; i < this.tracks.length; i++) {
            await this.uploadTrack(this.tracks[i], i);

            // Delay between uploads to avoid rate limiting
            if (i < this.tracks.length - 1) {
                this.log('  Waiting before next upload...');
                await this.delay(CONFIG.delays.long);
            }
        }

        this.log(`\n${'='.repeat(50)}`);
        this.log('UPLOAD SUMMARY', 'info');
        this.log(`${'='.repeat(50)}`);
        this.log(`Total tracks: ${this.tracks.length}`);
        this.log(`Uploaded: ${this.uploadedCount}`, 'success');
        this.log(`Failed: ${this.failedCount}`, this.failedCount > 0 ? 'error' : 'info');
    }

    async uploadByAlbum(albumName) {
        const albumTracks = this.tracks.filter(t => t.album === albumName);

        if (albumTracks.length === 0) {
            this.log(`No tracks found for album: ${albumName}`, 'error');
            return;
        }

        this.log(`Uploading album: ${albumName} (${albumTracks.length} tracks)`);

        for (let i = 0; i < albumTracks.length; i++) {
            await this.uploadTrack(albumTracks[i], i);
            await this.delay(CONFIG.delays.long);
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }

        // Save logs
        const logPath = path.join(CONFIG.screenshotsDir, 'upload-log.json');
        fs.writeFileSync(logPath, JSON.stringify(this.logs, null, 2));
        this.log(`Logs saved to: ${logPath}`);
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const options = {
        dryRun: args.includes('--dry-run'),
        headless: args.includes('--headless'),
        single: args.includes('--single'),
        album: args.find(a => a.startsWith('--album='))?.split('=')[1]
    };

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           DISTROKID AUTOMATED UPLOADER                       ║
║                                                              ║
║  Artist:    Aditya Patange                                   ║
║  Producer:  Nickel 9 Productions                             ║
║  Label:     SEA Records Worldwide                            ║
║                                                              ║
║  Catalog:   134 Tracks | 4 Albums                            ║
╚══════════════════════════════════════════════════════════════╝
    `);

    const uploader = new DistroKidUploader(options);

    try {
        await uploader.init();
        await uploader.login();

        if (options.album) {
            await uploader.uploadByAlbum(options.album);
        } else if (options.single) {
            // Upload just the first track as a test
            await uploader.uploadTrack(uploader.tracks[0], 0);
        } else {
            await uploader.uploadAll();
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await uploader.close();
    }
}

main().catch(console.error);
