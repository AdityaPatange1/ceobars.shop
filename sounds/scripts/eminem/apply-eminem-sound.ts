#!/usr/bin/env npx ts-node
/**
 * EMINEM SOUND APPLICATION SYSTEM
 * ================================
 * Apply Eminem's Production Sound Genome to your tracks.
 * Smart track search with interactive selection.
 *
 * Usage:
 *   npm run apply-sound:eminem "track title"
 *   npm run apply-sound:eminem "boonsday"
 *   npm run apply-sound:eminem "freestyle"
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// ============================================================================
// CONFIG
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const SOUNDS_ROOT = path.join(PROJECT_ROOT, "sounds");
const OUTPUT_DIR = path.join(SOUNDS_ROOT, "outputs");
const GENOME_FILE = path.join(OUTPUT_DIR, "eminem_production_sound_genome.json");

const SEARCH_DIRS = [
  path.join(PROJECT_ROOT, "outputs/masters"),
  path.join(PROJECT_ROOT, "public/assets"),
  path.join(PROJECT_ROOT, "inputs"),
  path.join(PROJECT_ROOT, "inputs/nickel9-audio"),
  path.join(PROJECT_ROOT, "outputs/youtube-downloads"),
];

const OUTPUT_WAV = path.join(OUTPUT_DIR, "master_em_sound_genz.wav");
const OUTPUT_MP3 = path.join(OUTPUT_DIR, "master_em_sound_genz.mp3");

// ============================================================================
// UTILITIES
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

function log(msg: string, color: keyof typeof colors = "reset"): void {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function execCommand(cmd: string, silent = true): string {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      maxBuffer: 50 * 1024 * 1024,
      stdio: silent ? ["pipe", "pipe", "pipe"] : "inherit",
    });
  } catch (e: any) {
    if (e.stderr) return e.stderr;
    throw e;
  }
}

function findFilesRecursive(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findFilesRecursive(fullPath, pattern));
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch {
    // Skip inaccessible directories
  }

  return results;
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// ============================================================================
// TRACK SEARCH
// ============================================================================

function searchTracks(query: string): string[] {
  // Build fuzzy regex pattern (spaces become .*)
  const pattern = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");

  const regex = new RegExp(pattern, "i");
  const audioPattern = /\.(mp3|wav|flac|m4a)$/i;

  const matches: string[] = [];

  for (const dir of SEARCH_DIRS) {
    const files = findFilesRecursive(dir, audioPattern);
    for (const file of files) {
      const basename = path.basename(file);
      if (regex.test(basename)) {
        matches.push(file);
      }
    }
  }

  // Remove duplicates and sort
  return [...new Set(matches)].sort();
}

// ============================================================================
// AUDIO PROCESSING
// ============================================================================

function getFFmpegChain(): string {
  if (!fs.existsSync(GENOME_FILE)) {
    log("Warning: Genome file not found, using default Eminem chain", "yellow");
    return [
      "highpass=f=30:poles=2",
      "lowshelf=g=3:f=60:t=q:w=0.5",
      "equalizer=f=150:t=q:w=1:g=2",
      "equalizer=f=400:t=q:w=1.5:g=-1",
      "equalizer=f=1000:t=q:w=2:g=0.5",
      "equalizer=f=3000:t=q:w=1.5:g=2",
      "equalizer=f=5000:t=q:w=2:g=1.5",
      "highshelf=g=1:f=10000:t=q:w=0.707",
      "acompressor=threshold=-15dB:ratio=5:attack=8:release=80:makeup=3",
      "stereotools=mlev=1:slev=1.05:sbal=0",
      "loudnorm=I=-14:LRA=11:TP=-1",
      "alimiter=limit=-1dB:level=false",
    ].join(",");
  }

  try {
    const genome = JSON.parse(fs.readFileSync(GENOME_FILE, "utf-8"));
    return genome.ffmpeg_processing_chain?.full_chain || getDefaultChain();
  } catch {
    return getDefaultChain();
  }
}

function getDefaultChain(): string {
  return [
    "highpass=f=30:poles=2",
    "lowshelf=g=3:f=60:t=q:w=0.5",
    "equalizer=f=150:t=q:w=1:g=2",
    "equalizer=f=3000:t=q:w=1.5:g=2",
    "acompressor=threshold=-15dB:ratio=5:attack=8:release=80:makeup=3",
    "stereotools=mlev=1:slev=1.05:sbal=0",
    "loudnorm=I=-14:LRA=11:TP=-1",
    "alimiter=limit=-1dB:level=false",
  ].join(",");
}

function analyzeInput(filePath: string): {
  duration: string;
  sampleRate: string;
  channels: string;
  lufs: string;
  truePeak: string;
} {
  // Get basic info
  const infoCmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
  const infoOutput = execCommand(infoCmd);
  const info = JSON.parse(infoOutput);

  const audioStream = info.streams?.find((s: any) => s.codec_type === "audio");
  const duration = parseFloat(info.format?.duration || "0");
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);

  // Get loudness
  const loudCmd = `ffmpeg -i "${filePath}" -af "loudnorm=print_format=json" -f null - 2>&1`;
  const loudOutput = execCommand(loudCmd);
  const jsonMatch = loudOutput.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);

  let lufs = "N/A";
  let truePeak = "N/A";

  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      lufs = `${parseFloat(data.input_i).toFixed(1)} LUFS`;
      truePeak = `${parseFloat(data.input_tp).toFixed(1)} dBTP`;
    } catch {}
  }

  return {
    duration: `${mins}:${secs.toString().padStart(2, "0")}`,
    sampleRate: audioStream?.sample_rate || "Unknown",
    channels: audioStream?.channels?.toString() || "Unknown",
    lufs,
    truePeak,
  };
}

function processTrack(inputFile: string, ffmpegChain: string): void {
  log("[PROCESS] Pass 1/2: Analyzing for normalization...", "cyan");

  // First pass - get loudnorm measurements
  const pass1Cmd = `ffmpeg -i "${inputFile}" -af "${ffmpegChain}" -f null - 2>&1`;
  const pass1Output = execCommand(pass1Cmd);

  // Extract measured values
  const jsonMatch = pass1Output.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  let measuredI = "-14";
  let measuredLRA = "11";
  let measuredTP = "-1";
  let measuredThresh = "-24";

  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      measuredI = data.input_i || "-14";
      measuredLRA = data.input_lra || "11";
      measuredTP = data.input_tp || "-1";
      measuredThresh = data.input_thresh || "-24";
    } catch {}
  }

  log("  [OK] Analysis complete", "green");
  log("[PROCESS] Pass 2/2: Applying Eminem Sound Production Mode...", "cyan");

  // Build final chain with two-pass loudnorm
  const finalChain = ffmpegChain.replace(
    "loudnorm=I=-14:LRA=11:TP=-1",
    `loudnorm=I=-14:LRA=11:TP=-1:measured_I=${measuredI}:measured_LRA=${measuredLRA}:measured_TP=${measuredTP}:measured_thresh=${measuredThresh}:linear=true`
  );

  // Process WAV
  const wavCmd = `ffmpeg -y -i "${inputFile}" -af "${finalChain}" -ar 44100 -sample_fmt s32 -c:a pcm_s24le "${OUTPUT_WAV}" 2>/dev/null`;
  execCommand(wavCmd);
  log("  [OK] WAV master created", "green");

  // Process MP3
  log("[ENCODE] Creating MP3 (320kbps)...", "cyan");
  const mp3Cmd = `ffmpeg -y -i "${OUTPUT_WAV}" -codec:a libmp3lame -b:a 320k -q:a 0 "${OUTPUT_MP3}" 2>/dev/null`;
  execCommand(mp3Cmd);
  log("  [OK] MP3 master created", "green");
}

function analyzeOutput(): { lufs: string; lra: string; truePeak: string } {
  const cmd = `ffmpeg -i "${OUTPUT_WAV}" -af "loudnorm=print_format=json" -f null - 2>&1`;
  const output = execCommand(cmd);
  const jsonMatch = output.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);

  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      return {
        lufs: `${parseFloat(data.input_i).toFixed(1)} LUFS`,
        lra: `${parseFloat(data.input_lra).toFixed(1)} LU`,
        truePeak: `${parseFloat(data.input_tp).toFixed(1)} dBTP`,
      };
    } catch {}
  }

  return { lufs: "N/A", lra: "N/A", truePeak: "N/A" };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`
${colors.magenta}================================================================================

    ███████╗███╗   ███╗██╗███╗   ██╗███████╗███╗   ███╗
    ██╔════╝████╗ ████║██║████╗  ██║██╔════╝████╗ ████║
    █████╗  ██╔████╔██║██║██╔██╗ ██║█████╗  ██╔████╔██║
    ██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██║╚██╔╝██║
    ███████╗██║ ╚═╝ ██║██║██║ ╚████║███████╗██║ ╚═╝ ██║
    ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝

              SOUND APPLICATION - EMINEM PRODUCTION MODE
                  Transform Your Track Like Em

================================================================================${colors.reset}
`);

  const searchQuery = process.argv[2];

  if (!searchQuery) {
    log("Error: Please provide a track title to search\n", "red");
    log("Usage:", "white");
    console.log('  npm run apply-sound:eminem "track title"\n');
    log("Examples:", "white");
    console.log('  npm run apply-sound:eminem "boonsday"');
    console.log('  npm run apply-sound:eminem "freestyle"');
    console.log('  npm run apply-sound:eminem "tokyo drift"');
    process.exit(1);
  }

  log(`[SEARCH] Searching for: ${searchQuery}\n`, "cyan");

  const matches = searchTracks(searchQuery);

  if (matches.length === 0) {
    log(`No tracks found matching: ${searchQuery}\n`, "red");
    log("Try a different search term or check available directories:", "yellow");
    console.log("  outputs/masters/");
    console.log("  inputs/");
    process.exit(1);
  }

  let inputFile: string;

  if (matches.length === 1) {
    inputFile = matches[0];
    log(`[FOUND] Single match:`, "green");
    log(`  ${path.basename(inputFile)}\n`, "cyan");
  } else {
    log(`[FOUND] ${matches.length} matching tracks:\n`, "yellow");
    console.log("━".repeat(78));

    matches.forEach((match, i) => {
      const basename = path.basename(match);
      const dirname = path.dirname(match).replace(PROJECT_ROOT + "/", "");
      console.log(`  ${colors.green}[${i + 1}]${colors.reset} ${basename}`);
      console.log(`      ${colors.blue}${dirname}${colors.reset}`);
    });

    console.log("━".repeat(78) + "\n");

    const selection = await prompt(`${colors.cyan}Enter track number [1-${matches.length}]: ${colors.reset}`);
    const index = parseInt(selection) - 1;

    if (isNaN(index) || index < 0 || index >= matches.length) {
      log("Invalid selection. Exiting.", "red");
      process.exit(1);
    }

    inputFile = matches[index];
    log(`\n[SELECTED] ${path.basename(inputFile)}`, "green");
  }

  // Ensure output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get FFmpeg chain
  log("\n[EXTRACT] Reading Eminem production signature...", "cyan");
  const ffmpegChain = getFFmpegChain();
  log("[OK] FFmpeg processing chain ready", "green");

  // Display processing info
  console.log(`
${colors.white}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  EMINEM PRODUCTION SOUND MODE - Processing Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

  ${colors.cyan}Input:${colors.reset}  ${path.basename(inputFile)}
  ${colors.cyan}Output:${colors.reset} master_em_sound_genz.wav / .mp3

  ${colors.cyan}Processing Chain:${colors.reset}
  ${colors.yellow}┌─────────────────────────────────────────────────────────────────────┐
  │${colors.reset}  1. High-pass filter (rumble removal)                               ${colors.yellow}│
  │${colors.reset}  2. Eminem signature EQ curve                                       ${colors.yellow}│
  │${colors.reset}  3. Aggressive compression (Em-style dynamics)                      ${colors.yellow}│
  │${colors.reset}  4. Stereo enhancement                                              ${colors.yellow}│
  │${colors.reset}  5. Loudness normalization (-14 LUFS)                               ${colors.yellow}│
  │${colors.reset}  6. Final limiting (-1 dBTP)                                        ${colors.yellow}│
  └─────────────────────────────────────────────────────────────────────┘${colors.reset}
`);

  // Analyze input
  log("[ANALYZE] Analyzing input audio...", "cyan");
  const inputAnalysis = analyzeInput(inputFile);

  console.log(`
  ${colors.white}┌─────────────────────────────────────────────────────────────────────┐
  │${colors.reset}  ${colors.magenta}INPUT ANALYSIS${colors.reset}                                                    ${colors.white}│
  ├─────────────────────────────────────────────────────────────────────┤
  │${colors.reset}  Duration:        ${colors.green}${inputAnalysis.duration}${colors.reset}                                          ${colors.white}│
  │${colors.reset}  Sample Rate:     ${colors.green}${inputAnalysis.sampleRate} Hz${colors.reset}                                   ${colors.white}│
  │${colors.reset}  Channels:        ${colors.green}${inputAnalysis.channels}${colors.reset}                                            ${colors.white}│
  │${colors.reset}  Loudness:        ${colors.yellow}${inputAnalysis.lufs}${colors.reset}                                    ${colors.white}│
  │${colors.reset}  True Peak:       ${colors.yellow}${inputAnalysis.truePeak}${colors.reset}                                     ${colors.white}│
  └─────────────────────────────────────────────────────────────────────┘${colors.reset}
`);

  // Process
  processTrack(inputFile, ffmpegChain);

  // Analyze output
  log("\n[VERIFY] Final quality analysis...", "cyan");
  const outputAnalysis = analyzeOutput();

  // Get file sizes
  const wavSize = fs.existsSync(OUTPUT_WAV)
    ? `${(fs.statSync(OUTPUT_WAV).size / 1024 / 1024).toFixed(1)} MB`
    : "N/A";
  const mp3Size = fs.existsSync(OUTPUT_MP3)
    ? `${(fs.statSync(OUTPUT_MP3).size / 1024 / 1024).toFixed(1)} MB`
    : "N/A";

  console.log(`
  ${colors.white}┌─────────────────────────────────────────────────────────────────────┐
  │${colors.reset}  ${colors.magenta}EMINEM SOUND PRODUCTION MODE - FINAL MASTER${colors.reset}                       ${colors.white}│
  ├─────────────────────────────────────────────────────────────────────┤
  │${colors.reset}  Integrated LUFS: ${colors.green}${outputAnalysis.lufs}${colors.reset}  (Target: -14 LUFS)            ${colors.white}│
  │${colors.reset}  Loudness Range:  ${colors.green}${outputAnalysis.lra}${colors.reset}                                       ${colors.white}│
  │${colors.reset}  True Peak:       ${colors.green}${outputAnalysis.truePeak}${colors.reset}  (Target: -1 dBTP)              ${colors.white}│
  ├─────────────────────────────────────────────────────────────────────┤
  │${colors.reset}  Sample Rate:     ${colors.green}44100 Hz${colors.reset}                                        ${colors.white}│
  │${colors.reset}  Bit Depth:       ${colors.green}24-bit${colors.reset}                                          ${colors.white}│
  │${colors.reset}  Format:          ${colors.green}WAV (PCM) + MP3 (320kbps)${colors.reset}                       ${colors.white}│
  └─────────────────────────────────────────────────────────────────────┘${colors.reset}

${colors.green}================================================================================
  EMINEM SOUND PRODUCTION MODE COMPLETE
================================================================================${colors.reset}

  ${colors.white}Source Track:${colors.reset}
  ${colors.blue}${path.basename(inputFile)}${colors.reset}

  ${colors.white}Output Files:${colors.reset}
  ${colors.cyan}${OUTPUT_WAV}${colors.reset} (${wavSize})
  ${colors.cyan}${OUTPUT_MP3}${colors.reset} (${mp3Size})

  ${colors.magenta}Your track now has the Eminem Production Sound Signature!${colors.reset}
  ${colors.yellow}Detroit, Michigan - 8 Mile Road Energy${colors.reset}
`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
