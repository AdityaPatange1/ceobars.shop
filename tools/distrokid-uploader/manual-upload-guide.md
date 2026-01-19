# DistroKid Manual Upload Guide

## 134 Tracks Ready for Distribution

**Artist:** Aditya Patange
**Producer:** Nickel 9 Productions
**Label:** SEA Records Worldwide

---

## Quick Upload via DistroKid Web

### Step 1: Login
Go to https://distrokid.com/signin/ and log in

### Step 2: Upload Each Album

#### Album 1: CEO Bars™ (3 tracks)
1. Go to https://distrokid.com/upload/
2. Select "Album"
3. Upload tracks from: `distrokid-releases/releases/ceo-bars-distrokid.json`

#### Album 2: DETBOM FREESTYLES (67 tracks)
1. Go to https://distrokid.com/upload/
2. Select "Album"
3. Upload tracks from: `distrokid-releases/releases/detbom-freestyles-distrokid.json`

#### Album 3: DETBOMBAY FREESTYLES (26 tracks)
1. Go to https://distrokid.com/upload/
2. Select "Album"
3. Upload tracks from: `distrokid-releases/releases/detbombay-freestyles-distrokid.json`

#### Album 4: SINGLES (38 tracks)
1. Go to https://distrokid.com/upload/
2. Select "Album" or upload as individual singles
3. Upload tracks from: `distrokid-releases/releases/singles-distrokid.json`

---

## For Each Track, Use These Settings:

- **Artist Name:** Aditya Patange
- **Featured Artist:** Adi 55
- **Producer:** Nickel 9 Productions
- **Songwriter:** Aditya Patange
- **Composer:** Aditya Patange
- **Record Label:** SEA Records Worldwide
- **Genre:** Hip-Hop/Rap
- **Language:** English
- **Explicit:** No
- **Copyright:** © 2025 SEA Records Worldwide
- **Publishing:** ℗ 2025 Aditya Patange

---

## Distribution Platforms (Select All):
- [x] Spotify
- [x] Apple Music
- [x] Amazon Music
- [x] YouTube Music
- [x] TikTok
- [x] Instagram/Facebook
- [x] Tidal
- [x] Deezer
- [x] Pandora
- [x] iHeartRadio
- [x] SoundCloud
- [x] Shazam

---

## Audio Files Location

All MP3 files are hosted on Vercel Blob Storage:
`https://3nb3sjndveiok0zw.public.blob.vercel-storage.com/assets/...`

The full URLs are in each track's JSON metadata.

---

## Run Browser Upload (Interactive)

Open a new terminal window and run:
```bash
cd /Users/adamantium/ceobars/ceobars.shop
node tools/distrokid-uploader/upload.js
```

This will open a browser window where you can log in manually.
