"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import JSZip from "jszip";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  source: string;
  file: string;
}

// DETBOM MUSIC ZEM1 - Complete Eminem Archive (399 Tracks)
// EMROAD Protocol: Eminem Music Repository On Aditya's Domain
const tracks: Track[] = [
  { id: 1, title: "3 a.m. (Explicit) by Eminem", source: "eminem-official", file: `3 a.m. (Explicit) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 2, title: "Alfred - Intro (Audio)", source: "eminem-official", file: `Alfred - Intro [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 3, title: "Alfred's Theme (Audio)", source: "eminem-official", file: `Alfred's Theme [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 4, title: "A** Like That (Super Clean Version) by Eminem", source: "eminem-official", file: `A＊＊ Like That (Super Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 5, title: "Bad Meets Evil Meets Europe Part 1 ｜ Bad Meets Evil", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 1 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 6, title: "Bad Meets Evil Meets Europe Part 2 ｜ Bad Meets Evil", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 2 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 7, title: "Bad Meets Evil Meets Europe Part 3 ｜ Bad Meets Evil", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 3 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 8, title: "Bad Meets Evil Meets Europe Part 4 ｜ Bad Meets Evil", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 4 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 9, title: "Bad Meets Evil ｜ Commercial", source: "eminem-official", file: `Bad Meets Evil ｜ Commercial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 10, title: "Beats x Eminem: Beat by Beat [TEASER]", source: "eminem-official", file: `Beats x Eminem： Beat by Beat [TEASER].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 11, title: "Behind the Scenes - Eminem Jimmy Kimmel Live Venom Performance – Google Pixel 3", source: "eminem-official", file: `Behind the Scenes - Eminem Jimmy Kimmel Live "Venom" Performance – Presented by Google Pixel 3.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 12, title: "Behind the Scenes at Jake Gyllenhaal's Southpaw Training", source: "eminem-official", file: `Behind the Scenes at Jake Gyllenhaal's Southpaw Training.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 13, title: "Black Magic (feat. Skylar Grey) (Audio)", source: "eminem-official", file: `Black Magic (feat. Skylar Grey) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 14, title: "Black Ops Remix Ft. Won't Back Down by Eminem HD - Commercial", source: "eminem-official", file: `Black Ops Remix Ft. Won't Back Down by Eminem HD ｜ Commercial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 15, title: "Bodied - Official Trailer - Produced by Eminem.", source: "eminem-official", file: `Bodied - Official Trailer - Produced by Eminem..mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 16, title: "Bodied - Preview", source: "eminem-official", file: `Bodied - Preview.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 17, title: "Bodied - Uncensored Official Trailer - Produced by Eminem", source: "eminem-official", file: `Bodied - Uncensored Official Trailer - Produced by Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 18, title: "Book of Rhymes (feat. DJ Premier) (Audio)", source: "eminem-official", file: `Book of Rhymes (feat. DJ Premier) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 19, title: "Call Of Duty: Ghosts X GameStop - MMLP2 Special Offer", source: "eminem-official", file: `Call Of Duty： Ghosts X GameStop - MMLP2 Special Offer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 20, title: "Cleanin' Out My Closet (BET Version) by Eminem", source: "eminem-official", file: `Cleanin' Out My Closet (BET Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 21, title: "Darkness (Audio)", source: "eminem-official", file: `Darkness [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 22, title: "Detroit Vs. Everybody (BTS)", source: "eminem-official", file: `Detroit Vs. Everybody (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 23, title: "Detroit Vs. Everybody (Lyric)", source: "eminem-official", file: `Detroit Vs. Everybody (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 24, title: "Discombobulated (Audio)", source: "eminem-official", file: `Discombobulated [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 25, title: "Eminem #ALSIceBucketChallenge", source: "eminem-official", file: `Eminem #ALSIceBucketChallenge.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 26, title: "Dr. Dre - \"Forgot About Dre\" [Live Performance]", source: "eminem-official", file: `Eminem & Dr. Dre - ＂Forgot About Dre＂ [Live Performance].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 27, title: "Snoop Dogg - From The D 2 The LBC (Video)", source: "eminem-official", file: `Eminem & Snoop Dogg - From The D 2 The LBC [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 28, title: "Alfred's Theme (Lyric)", source: "eminem-official", file: `Eminem - Alfred's Theme (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 29, title: "All You Got (skit) (Audio)", source: "eminem-official", file: `Eminem - All You Got (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 30, title: "Antichrist (Audio)", source: "eminem-official", file: `Eminem - Antichrist [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 31, title: "A** Like That (Super Clean Version, Closed Captioned)", source: "eminem-official", file: `Eminem - A＊＊ Like That (Super Clean Version, Closed Captioned).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 32, title: "Bad One (feat. White Gold) (Audio)", source: "eminem-official", file: `Eminem - Bad One (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 33, title: "Beautiful (Video)", source: "eminem-official", file: `Eminem - Beautiful (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 34, title: "Berzerk (Live on SNL)", source: "eminem-official", file: `Eminem - Berzerk (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 35, title: "Berzerk (Lyric)", source: "eminem-official", file: `Eminem - Berzerk (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 36, title: "Berzerk (Audio)", source: "eminem-official", file: `Eminem - Berzerk (Official Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 37, title: "Berzerk (Official) (Explicit)", source: "eminem-official", file: `Eminem - Berzerk (Official) (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 38, title: "Berzerk Explained: Behind The Scenes 1", source: "eminem-official", file: `Eminem - Berzerk Explained： Behind The Scenes 1.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 39, title: "Berzerk", source: "eminem-official", file: `Eminem - Berzerk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 40, title: "Brand New Dance (Audio)", source: "eminem-official", file: `Eminem - Brand New Dance [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 41, title: "Breaking News (skit) (Audio)", source: "eminem-official", file: `Eminem - Breaking News (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 42, title: "Campaign Speech", source: "eminem-official", file: `Eminem - Campaign Speech.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 43, title: "Cinderella Man (Lyric)", source: "eminem-official", file: `Eminem - Cinderella Man (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 44, title: "Cleanin' Out My Closet (Video)", source: "eminem-official", file: `Eminem - Cleanin' Out My Closet (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 45, title: "Darkness (Video)", source: "eminem-official", file: `Eminem - Darkness (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 46, title: "Detroit Rubber - Season 1 Trailer", source: "eminem-official", file: `Eminem - Detroit Rubber - Season 1 Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 47, title: "Don’t Front (feat. Buckshot) (Audio)", source: "eminem-official", file: `Eminem - Don’t Front (feat. Buckshot) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 48, title: "Eminem Interview (CD:UK)", source: "eminem-official", file: `Eminem - Eminem Interview (CD：UK).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 49, title: "Everybody’s Looking At Me (Audio)", source: "eminem-official", file: `Eminem - Everybody’s Looking At Me [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 50, title: "Evil (Audio)", source: "eminem-official", file: `Eminem - Evil [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 51, title: "Fall (Video)", source: "eminem-official", file: `Eminem - Fall (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 52, title: "Fortnite Chapter 2 Remix The Finale Performance", source: "eminem-official", file: `Eminem - Fortnite Chapter 2 Remix The Finale Performance.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 53, title: "Framed", source: "eminem-official", file: `Eminem - Framed.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 54, title: "Fuel (Shady Edition) feat. Westside Boogie & GRIP (Audio)", source: "eminem-official", file: `Eminem - Fuel (Shady Edition) feat. Westside Boogie & GRIP [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 55, title: "Fuel (feat. JID) (Audio)", source: "eminem-official", file: `Eminem - Fuel (feat. JID) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 56, title: "Fuel (feat. JID) (Lyric)", source: "eminem-official", file: `Eminem - Fuel (feat. JID) [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 57, title: "Godzilla (Lyric) ft. Juice WRLD", source: "eminem-official", file: `Eminem - Godzilla (Lyric Video) ft. Juice WRLD.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 58, title: "Good Guy (BTS) ft. Jessie Reyez", source: "eminem-official", file: `Eminem - Good Guy (Behind The Scenes) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 59, title: "Good Guy (Video) ft. Jessie Reyez", source: "eminem-official", file: `Eminem - Good Guy (Official Music Video) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 60, title: "Guess Who’s Back (skit) (Audio)", source: "eminem-official", file: `Eminem - Guess Who’s Back (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 61, title: "Guilty Conscience (Director's Cut) ft. Dr. Dre", source: "eminem-official", file: `Eminem - Guilty Conscience (Director's Cut) ft. Dr. Dre.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 62, title: "Guilty Conscience 2 (Audio)", source: "eminem-official", file: `Eminem - Guilty Conscience 2 [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 63, title: "Guts Over Fear (Audio) ft. Sia", source: "eminem-official", file: `Eminem - Guts Over Fear (Audio) ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 64, title: "Guts Over Fear ft. Sia", source: "eminem-official", file: `Eminem - Guts Over Fear ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 65, title: "Habits (feat. White Gold) (Audio)", source: "eminem-official", file: `Eminem - Habits (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 66, title: "Head Honcho (feat. Ez Mil) (Audio)", source: "eminem-official", file: `Eminem - Head Honcho (feat. Ez Mil) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 67, title: "Headlights (Explicit) ft. Nate Ruess", source: "eminem-official", file: `Eminem - Headlights (Explicit) ft. Nate Ruess.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 68, title: "Higher (Video) Explicit", source: "eminem-official", file: `Eminem - Higher (Official Video) Explicit.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 69, title: "Houdini [Live Performance]", source: "eminem-official", file: `Eminem - Houdini [Live Performance].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 70, title: "Houdini (Video)", source: "eminem-official", file: `Eminem - Houdini [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 71, title: "Infinite (F.B.T. Remix) (Audio)", source: "eminem-official", file: `Eminem - Infinite (F.B.T. Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 72, title: "Just Don't Give A F***", source: "eminem-official", file: `Eminem - Just Don't Give A F＊＊＊.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 73, title: "Just Lose It (Video)", source: "eminem-official", file: `Eminem - Just Lose It (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 74, title: "Killer (Remix) (Audio) ft. Jack Harlow, Cordae", source: "eminem-official", file: `Eminem - Killer (Remix) [Official Audio] ft. Jack Harlow, Cordae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 75, title: "Kings Never Die (Audio) ft. Gwen Stefani", source: "eminem-official", file: `Eminem - Kings Never Die (Audio) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 76, title: "Kings Never Die (Lyric) ft. Gwen Stefani", source: "eminem-official", file: `Eminem - Kings Never Die (Lyric Video) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 77, title: "Kyrie & Luka feat. 2 Chainz (Audio)", source: "eminem-official", file: `Eminem - Kyrie & Luka feat. 2 Chainz [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 78, title: "Like My Shit (Audio)", source: "eminem-official", file: `Eminem - Like My Shit [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 79, title: "Like Toy Soldiers (Video)", source: "eminem-official", file: `Eminem - Like Toy Soldiers (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 80, title: "Lose Yourself", source: "eminem-official", file: `Eminem - Lose Yourself.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 81, title: "Love The Way You Lie ft. Rihanna", source: "eminem-official", file: `Eminem - Love The Way You Lie ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 82, title: "Lucifer (feat. Sly Pyper) (Audio)", source: "eminem-official", file: `Eminem - Lucifer (feat. Sly Pyper) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 83, title: "Lucky You (Video) ft. Joyner Lucas", source: "eminem-official", file: `Eminem - Lucky You (Official Music Video) ft. Joyner Lucas.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 84, title: "MTV EMAs", source: "eminem-official", file: `Eminem - MTV EMAs.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 85, title: "Mockingbird (Video)", source: "eminem-official", file: `Eminem - Mockingbird [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 86, title: "My Name Is (Dirty Version) (Video)", source: "eminem-official", file: `Eminem - My Name Is (Dirty Version) (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 87, title: "My Name Is (Video)", source: "eminem-official", file: `Eminem - My Name Is (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 88, title: "No Love (Explicit Version) ft. Lil Wayne", source: "eminem-official", file: `Eminem - No Love (Explicit Version) ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 89, title: "No Love ft. Lil Wayne", source: "eminem-official", file: `Eminem - No Love ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 90, title: "Not Afraid (Behind The Scenes, Day 1)", source: "eminem-official", file: `Eminem - Not Afraid (Behind The Scenes, Day 1).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 91, title: "Not Afraid (Behind The Scenes, Day 2)", source: "eminem-official", file: `Eminem - Not Afraid (Behind The Scenes, Day 2).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 92, title: "Not Afraid (Teaser)", source: "eminem-official", file: `Eminem - Not Afraid (Teaser).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 93, title: "Not Afraid", source: "eminem-official", file: `Eminem - Not Afraid.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 94, title: "Nowhere Fast (Extended Version) [Audio] ft. Kehlani", source: "eminem-official", file: `Eminem - Nowhere Fast (Extended Version) [Audio] ft. Kehlani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 95, title: "Partners In Rhyme: The True Story of Infinite (Official Trailer)", source: "eminem-official", file: `Eminem - Partners In Rhyme： The True Story of Infinite (Official Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 96, title: "Phenomenal (Audio Only)", source: "eminem-official", file: `Eminem - Phenomenal (Audio Only).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 97, title: "Phenomenal (BTS)", source: "eminem-official", file: `Eminem - Phenomenal (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 98, title: "Phenomenal (Lyric)", source: "eminem-official", file: `Eminem - Phenomenal (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 99, title: "Phenomenal", source: "eminem-official", file: `Eminem - Phenomenal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 100, title: "Rap God (Audio)", source: "eminem-official", file: `Eminem - Rap God (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 101, title: "Rap God (Explicit)", source: "eminem-official", file: `Eminem - Rap God (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 102, title: "Rap God (Mr. Cii Remix) (Audio)", source: "eminem-official", file: `Eminem - Rap God (Mr. Cii Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 103, title: "Renaissance (Audio)", source: "eminem-official", file: `Eminem - Renaissance [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 104, title: "River (Audio) ft. Ed Sheeran", source: "eminem-official", file: `Eminem - River (Audio) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 105, title: "River (Behind the Scenes) ft. Ed Sheeran", source: "eminem-official", file: `Eminem - River (Behind the Scenes) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 106, title: "River (Trailer: Boxing) ft. Ed Sheeran", source: "eminem-official", file: `Eminem - River (Trailer： Boxing) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 107, title: "River ft. Ed Sheeran (LIVE AT TWICKENHAM 2018)", source: "eminem-official", file: `Eminem - River ft. Ed Sheeran (LIVE AT TWICKENHAM 2018).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 108, title: "River ft. Ed Sheeran", source: "eminem-official", file: `Eminem - River ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 109, title: "Road Rage (feat. Dem Jointz & Sly Pyper) (Audio)", source: "eminem-official", file: `Eminem - Road Rage (feat. Dem Jointz & Sly Pyper) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 110, title: "Role Model", source: "eminem-official", file: `Eminem - Role Model.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 111, title: "Shake That (Video) ft. Nate Dogg", source: "eminem-official", file: `Eminem - Shake That (Official Music Video) ft. Nate Dogg.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 112, title: "Sing For The Moment (Video)", source: "eminem-official", file: `Eminem - Sing For The Moment (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 113, title: "Somebody Save Me & Houdini (Live from the MTV VMA’s 2024)", source: "eminem-official", file: `Eminem - Somebody Save Me & Houdini (Live from the MTV VMA’s 2024).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 114, title: "Somebody Save Me (feat. Jelly Roll) (Audio)", source: "eminem-official", file: `Eminem - Somebody Save Me (feat. Jelly Roll) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 115, title: "Somebody Save Me (feat. Jelly Roll) (Video)", source: "eminem-official", file: `Eminem - Somebody Save Me (feat. Jelly Roll) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 116, title: "Space Bound", source: "eminem-official", file: `Eminem - Space Bound.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 117, title: "Stan (Live at Wembley 2014) (Audio)", source: "eminem-official", file: `Eminem - Stan (Live at Wembley 2014) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 118, title: "Stan (Live)", source: "eminem-official", file: `Eminem - Stan (Live).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 119, title: "Stan (Long Version) ft. Dido", source: "eminem-official", file: `Eminem - Stan (Long Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 120, title: "Stan (Short Version) ft. Dido", source: "eminem-official", file: `Eminem - Stan (Short Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 121, title: "Steve Berman (Skit) (Audio)", source: "eminem-official", file: `Eminem - Steve Berman (Skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 122, title: "Superman (Clean Version) ft. Dina Rae", source: "eminem-official", file: `Eminem - Superman (Clean Version) ft. Dina Rae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 123, title: "Survival (Explicit)", source: "eminem-official", file: `Eminem - Survival (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 124, title: "Survival (Live on SNL)", source: "eminem-official", file: `Eminem - Survival (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 125, title: "THE DEATH OF SLIM SHADY (COUP DE GRÂCE)", source: "eminem-official", file: `Eminem - THE DEATH OF SLIM SHADY (COUP DE GRÂCE).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 126, title: "Temporary (feat. Skylar Grey) (Audio)", source: "eminem-official", file: `Eminem - Temporary (feat. Skylar Grey) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 127, title: "Temporary (feat. Skylar Grey) (Video)", source: "eminem-official", file: `Eminem - Temporary (feat. Skylar Grey) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 128, title: "The Death of Slim Shady (Basement Trailer)", source: "eminem-official", file: `Eminem - The Death of Slim Shady (Basement Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 129, title: "The Death of Slim Shady [Album Trailer]", source: "eminem-official", file: `Eminem - The Death of Slim Shady [Album Trailer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 130, title: "The Death of Slim Shady [Graveyard Album Trailer]", source: "eminem-official", file: `Eminem - The Death of Slim Shady [Graveyard Album Trailer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 131, title: "The Making Of 'My Name Is' (Vevo Footnotes)", source: "eminem-official", file: `Eminem - The Making Of 'My Name Is' (Vevo Footnotes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 132, title: "The Monster (Edited) ft. Rihanna", source: "eminem-official", file: `Eminem - The Monster (Edited) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 133, title: "The Monster (Teaser) ft. Rihanna", source: "eminem-official", file: `Eminem - The Monster (Teaser) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 134, title: "The Monster Explained (BTS) ft. Rihanna", source: "eminem-official", file: `Eminem - The Monster Explained (Behind The Scenes) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 135, title: "The Monster ft. Rihanna (Audio)", source: "eminem-official", file: `Eminem - The Monster ft. Rihanna (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 136, title: "The Real Slim Shady & The Way I Am (Live at MTV Music Awards", source: "eminem-official", file: `Eminem - The Real Slim Shady & The Way I Am (Live at MTV Music Awards 2000).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 137, title: "The Real Slim Shady (Official Video (Clean))", source: "eminem-official", file: `Eminem - The Real Slim Shady (Official Video - Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 138, title: "The Way I Am (Clean Version)", source: "eminem-official", file: `Eminem - The Way I Am (Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 139, title: "Tobey (feat. Big Sean & Babytron) (Audio)", source: "eminem-official", file: `Eminem - Tobey (feat. Big Sean & Babytron) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 140, title: "Tone Deaf (Lyric)", source: "eminem-official", file: `Eminem - Tone Deaf (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 141, title: "Trouble (Audio)", source: "eminem-official", file: `Eminem - Trouble [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 142, title: "Untouchable (Audio)", source: "eminem-official", file: `Eminem - Untouchable (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 143, title: "Untouchable (Lyric)", source: "eminem-official", file: `Eminem - Untouchable (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 144, title: "Venom (Remix/Audio)", source: "eminem-official", file: `Eminem - Venom (Remix⧸Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 145, title: "Venom", source: "eminem-official", file: `Eminem - Venom.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 146, title: "Walk On Water (Audio) ft. Beyoncé", source: "eminem-official", file: `Eminem - Walk On Water (Audio) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 147, title: "Walk On Water (BTS) ft. Beyoncé", source: "eminem-official", file: `Eminem - Walk On Water (Behind The Scenes) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 148, title: "Walk On Water (Lyric) ft. Beyoncé", source: "eminem-official", file: `Eminem - Walk On Water (Lyric Video) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 149, title: "Walk On Water (Video)", source: "eminem-official", file: `Eminem - Walk On Water (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 150, title: "Walk On Water/Stan/Love The Way You Lie (Medley/Live From Sa", source: "eminem-official", file: `Eminem - Walk On Water⧸Stan⧸Love The Way You Lie (Medley⧸Live From Saturday Night Live⧸2017).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 151, title: "We Made You (Video)", source: "eminem-official", file: `Eminem - We Made You (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 152, title: "When I'm Gone (Video)", source: "eminem-official", file: `Eminem - When I'm Gone (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 153, title: "White America (Video)", source: "eminem-official", file: `Eminem - White America (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 154, title: "Without Me (Video)", source: "eminem-official", file: `Eminem - Without Me (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 155, title: "Won't Back Down (Ft. P!nk) [Lyric Video] ft. P!nk", source: "eminem-official", file: `Eminem - Won't Back Down (Ft. P!nk) [Lyric Video] ft. P!nk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 156, title: "You Don't Know (Video) ft. 50 Cent, Cashis, Lloyd Banks", source: "eminem-official", file: `Eminem - You Don't Know (Official Music Video) ft. 50 Cent, Cashis, Lloyd Banks.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 157, title: "\"Guts Over Fear\" ft. Sia [Official Teaser]", source: "eminem-official", file: `Eminem - ＂Guts Over Fear＂ ft. Sia [Official Teaser].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 158, title: "\"Kick Off\" (Freestyle)", source: "eminem-official", file: `Eminem - ＂Kick Off＂ (Freestyle).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 159, title: "\"Lose Yourself\" - The Demo", source: "eminem-official", file: `Eminem - ＂Lose Yourself＂ - The Demo.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 160, title: "Eminem Celeb Playlist Update", source: "eminem-official", file: `Eminem Celeb Playlist Update.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 161, title: "Eminem MMLP 2 - Out Now", source: "eminem-official", file: `Eminem MMLP 2 - Out Now.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 162, title: "Eminem Performs \"Venom\" from the Empire State Building on Ji", source: "eminem-official", file: `Eminem Performs ＂Venom＂ from the Empire State Building on Jimmy Kimmel Live.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 163, title: "Eminem Takes the Stage in Fortnite’s The Big Bang Event", source: "eminem-official", file: `Eminem Takes the Stage in Fortnite’s The Big Bang Event.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 164, title: "ft. 50 Cent - Is This Love (’09) (Audio)", source: "eminem-official", file: `Eminem ft. 50 Cent - Is This Love (’09) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 165, title: "ft. CeeLo Green - \"The King And I\"", source: "eminem-official", file: `Eminem ft. CeeLo Green - ＂The King And I＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 166, title: "ft. Rihanna - The Monster (Explicit) (Video)", source: "eminem-official", file: `Eminem ft. Rihanna - The Monster (Explicit) [Official Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 167, title: "Eminem x Sway - The Kamikaze Interview (Part 1)", source: "eminem-official", file: `Eminem x Sway - The Kamikaze Interview (Part 1).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 168, title: "Eminem x Sway - The Kamikaze Interview (Part 2)", source: "eminem-official", file: `Eminem x Sway - The Kamikaze Interview (Part 2).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 169, title: "Eminem x Sway - The Kamikaze Interview (Part 3)", source: "eminem-official", file: `Eminem x Sway - The Kamikaze Interview (Part 3).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 170, title: "Eminem x Sway - The Kamikaze Interview (Part 4)", source: "eminem-official", file: `Eminem x Sway - The Kamikaze Interview (Part 4).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 171, title: "50 Cent - Is This Love ('09) [Visualizer]", source: "eminem-official", file: `Eminem, 50 Cent - Is This Love ('09) [Visualizer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 172, title: "Dr. Dre, & 50 Cent - Crack A Bottle (Video)", source: "eminem-official", file: `Eminem, Dr. Dre, & 50 Cent - Crack A Bottle (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 173, title: "Royce Da 5'9'', Big Sean, Danny Brown, Dej Loaf, Trick Trick", source: "eminem-official", file: `Eminem, Royce Da 5'9'', Big Sean, Danny Brown, Dej Loaf, Trick Trick - Detroit Vs. Everybody.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 174, title: "Royce da 5'9\", Big Sean, Danny Brown, Dej Loaf, Trick Trick ", source: "eminem-official", file: `Eminem, Royce da 5'9＂, Big Sean, Danny Brown, Dej Loaf, Trick Trick - Detroit Vs. Everybody.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 175, title: "Slaughterhouse, Yelawolf - CXVPHER (BTS)", source: "eminem-official", file: `Eminem, Slaughterhouse, Yelawolf - CXVPHER (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 176, title: "Slaughterhouse, Yelawolf - Vevo Presents: Shady CXVPHER", source: "eminem-official", file: `Eminem, Slaughterhouse, Yelawolf - Vevo Presents： Shady CXVPHER.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 177, title: "Snoop Dogg - From The D 2 The LBC (VMAs)", source: "eminem-official", file: `Eminem, Snoop Dogg - From The D 2 The LBC (VMAs).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 178, title: "Emwow: Vince for Eminem's Recovery ｜ Commercial", source: "eminem-official", file: `Emwow： Vince for Eminem's Recovery ｜ Commercial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 179, title: "Exclusive Preview: \"Guts Over Fear\" ft. Sia", source: "eminem-official", file: `Exclusive Preview： ＂Guts Over Fear＂ ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 180, title: "Fall (Audio)", source: "eminem-official", file: `Fall [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 181, title: "Farewell (Audio)", source: "eminem-official", file: `Farewell [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 182, title: "Fast Lane by Bad Meets Evil ｜ Teaser", source: "eminem-official", file: `Fast Lane by Bad Meets Evil ｜ Teaser ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 183, title: "Favorite Bitch (feat. Ty Dolla $ign) (Audio)", source: "eminem-official", file: `Favorite Bitch (feat. Ty Dolla $ign) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 184, title: "Final Southpaw Trailer ft. \"KIngs Never Die\"", source: "eminem-official", file: `Final Southpaw Trailer ft. ＂KIngs Never Die＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 185, title: "Gnat (Audio)", source: "eminem-official", file: `Gnat [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 186, title: "Godzilla (feat. Juice WRLD) (Audio)", source: "eminem-official", file: `Godzilla (feat. Juice WRLD) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 187, title: "Guilty Conscience (Director's Cut) by Eminem ft. Dr. Dre", source: "eminem-official", file: `Guilty Conscience (Director's Cut) by Eminem ft. Dr. Dre ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 188, title: "Guns Blazing (feat. Dr Dre & Sly Pyper) (Audio)", source: "eminem-official", file: `Guns Blazing (feat. Dr Dre & Sly Pyper) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 189, title: "Guts Over Fear ft. Sia featured in #Mayhem: Mayweather vs Ma", source: "eminem-official", file: `Guts Over Fear ft. Sia featured in #Mayhem： Mayweather vs Maidana Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 190, title: "HITMAN World of Assassination - Eminem vs. Slim Shady", source: "eminem-official", file: `HITMAN World of Assassination - Eminem vs. Slim Shady.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 191, title: "Headlights Teaser", source: "eminem-official", file: `Headlights Teaser.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 192, title: "Higher (Audio)", source: "eminem-official", file: `Higher [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 193, title: "Hip Hop Playlist ｜ Bad Meets Evil", source: "eminem-official", file: `Hip Hop Playlist ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 194, title: "Hitman: Agent 47 ft. Won't Back Down", source: "eminem-official", file: `Hitman： Agent 47 ft. Won't Back Down.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 195, title: "I Will (feat. KXNG Crooked, Royce da 5'9\" & Joell Ortiz) (Au", source: "eminem-official", file: `I Will (feat. KXNG Crooked, Royce da 5'9＂ & Joell Ortiz) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 196, title: "In Too Deep (Audio)", source: "eminem-official", file: `In Too Deep [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 197, title: "Just Don't Give A F*** (Clean Version) by Eminem", source: "eminem-official", file: `Just Don't Give A F＊＊＊ (Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 198, title: "Just Lose It (BET Version) by Eminem", source: "eminem-official", file: `Just Lose It (BET Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 199, title: "Just Lose It (Director's Cut) by Eminem", source: "eminem-official", file: `Just Lose It (Director's Cut) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 200, title: "Just Lose It (MTV Version) by Eminem", source: "eminem-official", file: `Just Lose It (MTV Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 201, title: "KILLSHOT (Audio)", source: "eminem-official", file: `KILLSHOT [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 202, title: "Kamikaze (Audio)", source: "eminem-official", file: `Kamikaze [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 203, title: "Key - Skit (Audio)", source: "eminem-official", file: `Key - Skit [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 204, title: "Killer (Audio)", source: "eminem-official", file: `Killer [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 205, title: "Leaving Heaven (feat. Skylar Grey) (Audio)", source: "eminem-official", file: `Leaving Heaven (feat. Skylar Grey) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 206, title: "Lighters by Bad Meets Evil ft. Bruno Mars ｜ Behind The Scene", source: "eminem-official", file: `Lighters by Bad Meets Evil ft. Bruno Mars ｜ Behind The Scenes ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 207, title: "Like Toy Soldiers (Broadcast Mural Version) by Eminem", source: "eminem-official", file: `Like Toy Soldiers (Broadcast Mural Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 208, title: "Little Engine (Audio)", source: "eminem-official", file: `Little Engine [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 209, title: "Live Chat with Bad Meets Evil ｜ Bad Meets Evil", source: "eminem-official", file: `Live Chat with Bad Meets Evil ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 210, title: "Lock It Up (feat. Anderson .Paak) (Audio)", source: "eminem-official", file: `Lock It Up (feat. Anderson .Paak) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 211, title: "Lucky You (Feat. Joyner Lucas) (Audio)", source: "eminem-official", file: `Lucky You (Feat. Joyner Lucas) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 212, title: "Lyrical Lemonade – “Doomsday Pt. 2” with Eminem (Visualizer)", source: "eminem-official", file: `Lyrical Lemonade – “Doomsday Pt. 2” with Eminem (Visualizer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 213, title: "MISSING: SLIM SHADY [Expanded Mourner’s Edition Trailer]", source: "eminem-official", file: `MISSING： SLIM SHADY [Expanded Mourner’s Edition Trailer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 214, title: "Marsh (Audio)", source: "eminem-official", file: `Marsh [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 215, title: "Mockingbird by Eminem", source: "eminem-official", file: `Mockingbird by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 216, title: "Mom's Spaghetti Restaurant - Opening 9/29/21 - Detroit, MI", source: "eminem-official", file: `Mom's Spaghetti Restaurant - Opening 9⧸29⧸21 - Detroit, MI.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 217, title: "Mosh (Dirty Version) by Eminem", source: "eminem-official", file: `Mosh (Dirty Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 218, title: "Mosh (Extra Clean Version) by Eminem", source: "eminem-official", file: `Mosh (Extra Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 219, title: "Mosh (Extra Clean-No Vote Slate) by Eminem", source: "eminem-official", file: `Mosh (Extra Clean-No Vote Slate) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 220, title: "Mosh (MTV Version) by Eminem", source: "eminem-official", file: `Mosh (MTV Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 221, title: "Mosh (No Vote Slate) by Eminem", source: "eminem-official", file: `Mosh (No Vote Slate) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 222, title: "Mosh (Post Election) by Eminem", source: "eminem-official", file: `Mosh (Post Election) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 223, title: "My Name Is (Version 1 Dirty Version) by Eminem", source: "eminem-official", file: `My Name Is (Version 1 Dirty Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 224, title: "Never Love Again (Audio)", source: "eminem-official", file: `Never Love Again [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 225, title: "No Love by Eminem -  ft. Lil Wayne ｜ Teaser", source: "eminem-official", file: `No Love by Eminem -  ft. Lil Wayne ｜ Teaser ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 226, title: "No Regrets (feat. Don Toliver) (Audio)", source: "eminem-official", file: `No Regrets (feat. Don Toliver) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 227, title: "Not Afraid by Eminem ｜ Behind The Scenes Pt. 1", source: "eminem-official", file: `Not Afraid by Eminem ｜ Behind The Scenes Pt. 1 ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 228, title: "Not Afraid by Eminem ｜ Behind The Scenes Pt. 2", source: "eminem-official", file: `Not Afraid by Eminem ｜ Behind The Scenes Pt. 2 ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 229, title: "PRhyme ft. Logic \"Mode\" Lyric Video", source: "eminem-official", file: `PRhyme ft. Logic ＂Mode＂ Lyric Video.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 230, title: "Phenomenal Music Film (Selfie Clip)", source: "eminem-official", file: `Phenomenal Music Film (Selfie Clip).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 231, title: "Playlist Intro ｜ Bad Meets Evil", source: "eminem-official", file: `Playlist Intro ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 232, title: "Premonition - Intro (Audio)", source: "eminem-official", file: `Premonition - Intro [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 233, title: "Rap God Official Teaser", source: "eminem-official", file: `Rap God Official Teaser.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 234, title: "Recovery Testimonial", source: "eminem-official", file: `Recovery Testimonial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 235, title: "Revival Album Art Reveal", source: "eminem-official", file: `Revival Album Art Reveal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 236, title: "Revival Pop Up", source: "eminem-official", file: `Revival Pop Up.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 237, title: "Rick Rubin ALS Ice Bucket Challenge", source: "eminem-official", file: `Rick Rubin ALS Ice Bucket Challenge.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 238, title: "Role Model by Eminem", source: "eminem-official", file: `Role Model by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 239, title: "SHADYXV - TV Spot", source: "eminem-official", file: `SHADYXV - TV Spot.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 240, title: "SHADYXV Quinceañera Episode 1 - \"Birthday Clown\"", source: "eminem-official", file: `SHADYXV Quinceañera Episode 1 - ＂Birthday Clown＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 241, title: "SHADYXV Quinceañera Episode 2 - \"Birthday Girl\"", source: "eminem-official", file: `SHADYXV Quinceañera Episode 2 - ＂Birthday Girl＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 242, title: "SHADYXV Quinceañera Episode 3 - \"Birthday Cake\"", source: "eminem-official", file: `SHADYXV Quinceañera Episode 3 - ＂Birthday Cake＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 243, title: "STANS - Fan Letters", source: "eminem-official", file: `STANS - Fan Letters.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 244, title: "STANS - Hip-Hop", source: "eminem-official", file: `STANS - Hip-Hop.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 245, title: "STANS - Inspire", source: "eminem-official", file: `STANS - Inspire.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 246, title: "STANS - My Name Is", source: "eminem-official", file: `STANS - My Name Is.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 247, title: "STANS - Official Trailer", source: "eminem-official", file: `STANS - Official Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 248, title: "STANS - Voicemail", source: "eminem-official", file: `STANS - Voicemail.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 249, title: "STANS - Writings", source: "eminem-official", file: `STANS - Writings.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 250, title: "Shady 2.0 Boys (Detroit) by Eminem, Slaughterhouse, and Yela", source: "eminem-official", file: `Shady 2.0 Boys (Detroit) by Eminem, Slaughterhouse, and Yelawolf ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 251, title: "Shady 2.0 SXSW", source: "eminem-official", file: `Shady 2.0 SXSW ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 252, title: "Shady Records Cypher 2011 ｜ Behind The Scenes", source: "eminem-official", file: `Shady Records Cypher 2011 ｜ Behind The Scenes ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 253, title: "Shady Records Hot 97 Summer Jam BBQ", source: "eminem-official", file: `Shady Records Hot 97 Summer Jam BBQ ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 254, title: "She Loves Me (Audio)", source: "eminem-official", file: `She Loves Me [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 255, title: "Sing For The Moment (Edited) by Eminem", source: "eminem-official", file: `Sing For The Moment (Edited) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 256, title: "Sing For The Moment by Eminem (Live)", source: "eminem-official", file: `Sing For The Moment by Eminem (Live) ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 257, title: "Skylar Grey - Last One Standing ft. Polo G, Mozzy, & Eminem ", source: "eminem-official", file: `Skylar Grey - Last One Standing ft. Polo G, Mozzy, & Eminem [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 258, title: "Skylar Grey, Polo G, Mozzy, Eminem - Last One Standing (Lyri", source: "eminem-official", file: `Skylar Grey, Polo G, Mozzy, Eminem - Last One Standing (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 259, title: "Southpaw - Official Trailer", source: "eminem-official", file: `Southpaw - Official Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 260, title: "Southpaw Official Trailer #2 Featuring Phenomenal", source: "eminem-official", file: `Southpaw Official Trailer #2 Featuring Phenomenal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 261, title: "Southpaw Trailer Featuring \"Kings Never Die\"", source: "eminem-official", file: `Southpaw Trailer Featuring ＂Kings Never Die＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 262, title: "Southpaw X Soundtrack", source: "eminem-official", file: `Southpaw X Soundtrack.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 263, title: "Stan (Long Version) by Eminem ft. Dido", source: "eminem-official", file: `Stan (Long Version) by Eminem ft. Dido ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 264, title: "Stan by Eminem ft. Dido (Short Version)", source: "eminem-official", file: `Stan by Eminem ft. Dido (Short Version) ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 265, title: "Stepdad (Audio)", source: "eminem-official", file: `Stepdad [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 266, title: "Straight Outta Compton N.W.A's Impact", source: "eminem-official", file: `Straight Outta Compton N.W.A's Impact.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 267, title: "Survival (Audio Only)", source: "eminem-official", file: `Survival (Audio Only).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 268, title: "The Equalizer Movie – New and Exclusive Online Trailer", source: "eminem-official", file: `The Equalizer Movie – New and Exclusive Online Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 269, title: "The Real Slim Shady by Eminem", source: "eminem-official", file: `The Real Slim Shady by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 270, title: "The Southpaw Sessions - Clip 1", source: "eminem-official", file: `The Southpaw Sessions - Clip 1.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 271, title: "The Southpaw Sessions - Clip 2", source: "eminem-official", file: `The Southpaw Sessions - Clip 2.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 272, title: "The Southpaw Sessions - Clip 3", source: "eminem-official", file: `The Southpaw Sessions - Clip 3.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 273, title: "The Southpaw Sessions - Full Interview", source: "eminem-official", file: `The Southpaw Sessions - Full Interview.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 274, title: "The Southpaw Sessions Round 1 with Eminem and Jake Gyllenhaa", source: "eminem-official", file: `The Southpaw Sessions Round 1 with Eminem and Jake Gyllenhaal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 275, title: "The Southpaw Sessions Round 2 with Eminem and Jake Gyllenhaa", source: "eminem-official", file: `The Southpaw Sessions Round 2 with Eminem and Jake Gyllenhaal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 276, title: "The Southpaw Sessions Round 3 with Eminem and Jake Gyllenhaa", source: "eminem-official", file: `The Southpaw Sessions Round 3 with Eminem and Jake Gyllenhaal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 277, title: "The Southpaw Sessions at the YouTube Space (Teaser 2)", source: "eminem-official", file: `The Southpaw Sessions at the YouTube Space (Teaser 2).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 278, title: "The Southpaw Sessions at the Youtube Space (Teaser)", source: "eminem-official", file: `The Southpaw Sessions at the Youtube Space (Teaser).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 279, title: "The Way I Am (Clean Version) by Eminem", source: "eminem-official", file: `The Way I Am (Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 280, title: "These Demons (feat. MAJ) (Audio)", source: "eminem-official", file: `These Demons (feat. MAJ) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 281, title: "Those Kinda Nights (feat. Ed Sheeran) (Audio)", source: "eminem-official", file: `Those Kinda Nights (feat. Ed Sheeran) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 282, title: "Thus Far - Interlude (Audio)", source: "eminem-official", file: `Thus Far - Interlude [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 283, title: "Tone Deaf (Audio)", source: "eminem-official", file: `Tone Deaf [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 284, title: "Unaccommodating (feat. Young M.A) (Audio)", source: "eminem-official", file: `Unaccommodating (feat. Young M.A) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 285, title: "Vevo Presents: SHADY CXVPHER", source: "eminem-official", file: `Vevo Presents： SHADY CXVPHER.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 286, title: "We Made You by Eminem", source: "eminem-official", file: `We Made You by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 287, title: "White America (Clean Version) by Eminem", source: "eminem-official", file: `White America (Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 288, title: "Without Me (BET Version) by Eminem", source: "eminem-official", file: `Without Me (BET Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 289, title: "Without Me (MTV Version) by Eminem", source: "eminem-official", file: `Without Me (MTV Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 290, title: "Without Me by Eminem", source: "eminem-official", file: `Without Me by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 291, title: "Yah Yah (feat. Royce Da 5'9\", Black Thought, Q-Tip & Denaun)", source: "eminem-official", file: `Yah Yah (feat. Royce Da 5'9＂, Black Thought, Q-Tip & Denaun) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 292, title: "You Gon' Learn (feat. Royce Da 5'9\" & White Gold) (Audio)", source: "eminem-official", file: `You Gon' Learn (feat. Royce Da 5'9＂ & White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 293, title: "Zeus (feat. White Gold) (Audio)", source: "eminem-official", file: `Zeus (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 294, title: "‘Shazam' Trailer Ft. \"My Name Is\"", source: "eminem-official", file: `‘Shazam' Trailer Ft. ＂My Name Is＂.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 295, title: "\"Framed\" (Official Video Trailer)", source: "eminem-official", file: `＂Framed＂ (Official Video Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 296, title: "\"Walk On Water\" (Official Video Teaser)", source: "eminem-official", file: `＂Walk On Water＂ (Official Video Teaser).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 297, title: "Detroit Vs. Everybody (BTS) (VEVO)", source: "eminem-vevo", file: `Detroit Vs. Everybody (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 298, title: "Detroit Vs. Everybody (Lyric) (VEVO)", source: "eminem-vevo", file: `Detroit Vs. Everybody (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 299, title: "Snoop Dogg - From The D 2 The LBC (Video) (VEVO)", source: "eminem-vevo", file: `Eminem & Snoop Dogg - From The D 2 The LBC [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 300, title: "Alfred's Theme (Lyric) (VEVO)", source: "eminem-vevo", file: `Eminem - Alfred's Theme (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 301, title: "A** Like That (Super Clean Version, Closed Captioned) (VEVO)", source: "eminem-vevo", file: `Eminem - A＊＊ Like That (Super Clean Version, Closed Captioned).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 302, title: "Beautiful (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Beautiful (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 303, title: "Berzerk (Live on SNL) (VEVO)", source: "eminem-vevo", file: `Eminem - Berzerk (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 304, title: "Berzerk (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - Berzerk (Official Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 305, title: "Berzerk (Official) (Explicit) (VEVO)", source: "eminem-vevo", file: `Eminem - Berzerk (Official) (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 306, title: "Berzerk Explained: Behind The Scenes 1 (VEVO)", source: "eminem-vevo", file: `Eminem - Berzerk Explained： Behind The Scenes 1.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 307, title: "Berzerk (VEVO)", source: "eminem-vevo", file: `Eminem - Berzerk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 308, title: "Cinderella Man (Lyric) (VEVO)", source: "eminem-vevo", file: `Eminem - Cinderella Man (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 309, title: "Cleanin' Out My Closet (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Cleanin' Out My Closet (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 310, title: "Darkness (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Darkness (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 311, title: "Detroit Rubber - Season 1 Trailer (VEVO)", source: "eminem-vevo", file: `Eminem - Detroit Rubber - Season 1 Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 312, title: "Eminem Interview (CD:UK) (VEVO)", source: "eminem-vevo", file: `Eminem - Eminem Interview (CD：UK).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 313, title: "Fall (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Fall (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 314, title: "Framed (VEVO)", source: "eminem-vevo", file: `Eminem - Framed.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 315, title: "Fuel (feat. JID) (Lyric) (VEVO)", source: "eminem-vevo", file: `Eminem - Fuel (feat. JID) [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 316, title: "Godzilla (Lyric) ft. Juice WRLD (VEVO)", source: "eminem-vevo", file: `Eminem - Godzilla (Lyric Video) ft. Juice WRLD.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 317, title: "Good Guy (BTS) ft. Jessie Reyez (VEVO)", source: "eminem-vevo", file: `Eminem - Good Guy (Behind The Scenes) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 318, title: "Good Guy (Video) ft. Jessie Reyez (VEVO)", source: "eminem-vevo", file: `Eminem - Good Guy (Official Music Video) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 319, title: "Guilty Conscience (Director's Cut) ft. Dr. Dre (VEVO)", source: "eminem-vevo", file: `Eminem - Guilty Conscience (Director's Cut) ft. Dr. Dre.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 320, title: "Guts Over Fear (Audio) ft. Sia (VEVO)", source: "eminem-vevo", file: `Eminem - Guts Over Fear (Audio) ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 321, title: "Guts Over Fear ft. Sia (VEVO)", source: "eminem-vevo", file: `Eminem - Guts Over Fear ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 322, title: "Headlights (Explicit) ft. Nate Ruess (VEVO)", source: "eminem-vevo", file: `Eminem - Headlights (Explicit) ft. Nate Ruess.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 323, title: "Houdini (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Houdini [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 324, title: "Infinite (F.B.T. Remix) (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - Infinite (F.B.T. Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 325, title: "Just Don't Give A F*** (VEVO)", source: "eminem-vevo", file: `Eminem - Just Don't Give A F＊＊＊.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 326, title: "Just Lose It (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Just Lose It (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 327, title: "Killer (Remix) (Audio) ft. Jack Harlow, Cordae (VEVO)", source: "eminem-vevo", file: `Eminem - Killer (Remix) [Official Audio] ft. Jack Harlow, Cordae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 328, title: "Kings Never Die (Audio) ft. Gwen Stefani (VEVO)", source: "eminem-vevo", file: `Eminem - Kings Never Die (Audio) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 329, title: "Kings Never Die (Lyric) ft. Gwen Stefani (VEVO)", source: "eminem-vevo", file: `Eminem - Kings Never Die (Lyric Video) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 330, title: "Like Toy Soldiers (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Like Toy Soldiers (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 331, title: "Love The Way You Lie ft. Rihanna (VEVO)", source: "eminem-vevo", file: `Eminem - Love The Way You Lie ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 332, title: "Lucky You (Video) ft. Joyner Lucas (VEVO)", source: "eminem-vevo", file: `Eminem - Lucky You (Official Music Video) ft. Joyner Lucas.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 333, title: "Mockingbird (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Mockingbird [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 334, title: "My Name Is (Dirty Version) (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - My Name Is (Dirty Version) (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 335, title: "My Name Is (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - My Name Is (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 336, title: "No Love (Explicit Version) ft. Lil Wayne (VEVO)", source: "eminem-vevo", file: `Eminem - No Love (Explicit Version) ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 337, title: "No Love ft. Lil Wayne (VEVO)", source: "eminem-vevo", file: `Eminem - No Love ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 338, title: "Not Afraid (Behind The Scenes, Day 1) (VEVO)", source: "eminem-vevo", file: `Eminem - Not Afraid (Behind The Scenes, Day 1).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 339, title: "Not Afraid (Behind The Scenes, Day 2) (VEVO)", source: "eminem-vevo", file: `Eminem - Not Afraid (Behind The Scenes, Day 2).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 340, title: "Not Afraid (Teaser) (VEVO)", source: "eminem-vevo", file: `Eminem - Not Afraid (Teaser).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 341, title: "Not Afraid (VEVO)", source: "eminem-vevo", file: `Eminem - Not Afraid.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 342, title: "Nowhere Fast (Extended Version) [Audio] ft. Kehlani (VEVO)", source: "eminem-vevo", file: `Eminem - Nowhere Fast (Extended Version) [Audio] ft. Kehlani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 343, title: "Partners In Rhyme: The True Story of Infinite (Official Trailer)", source: "eminem-vevo", file: `Eminem - Partners In Rhyme： The True Story of Infinite (Official Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 344, title: "Phenomenal (BTS) (VEVO)", source: "eminem-vevo", file: `Eminem - Phenomenal (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 345, title: "Phenomenal (Lyric) (VEVO)", source: "eminem-vevo", file: `Eminem - Phenomenal (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 346, title: "Phenomenal (VEVO)", source: "eminem-vevo", file: `Eminem - Phenomenal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 347, title: "Rap God (Explicit) (VEVO)", source: "eminem-vevo", file: `Eminem - Rap God (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 348, title: "Rap God (Mr. Cii Remix) (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - Rap God (Mr. Cii Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 349, title: "River (Audio) ft. Ed Sheeran (VEVO)", source: "eminem-vevo", file: `Eminem - River (Audio) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 350, title: "River (Behind the Scenes) ft. Ed Sheeran (VEVO)", source: "eminem-vevo", file: `Eminem - River (Behind the Scenes) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 351, title: "River (Trailer: Boxing) ft. Ed Sheeran (VEVO)", source: "eminem-vevo", file: `Eminem - River (Trailer： Boxing) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 352, title: "River ft. Ed Sheeran (VEVO)", source: "eminem-vevo", file: `Eminem - River ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 353, title: "Role Model (VEVO)", source: "eminem-vevo", file: `Eminem - Role Model.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 354, title: "Shake That (Video) ft. Nate Dogg (VEVO)", source: "eminem-vevo", file: `Eminem - Shake That (Official Music Video) ft. Nate Dogg.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 355, title: "Sing For The Moment (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Sing For The Moment (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 356, title: "Somebody Save Me & Houdini (Live from the MTV VMA’s 2024) (V", source: "eminem-vevo", file: `Eminem - Somebody Save Me & Houdini (Live from the MTV VMA’s 2024).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 357, title: "Somebody Save Me (feat. Jelly Roll) (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Somebody Save Me (feat. Jelly Roll) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 358, title: "Space Bound (VEVO)", source: "eminem-vevo", file: `Eminem - Space Bound.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 359, title: "Stan (Live) (VEVO)", source: "eminem-vevo", file: `Eminem - Stan (Live).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 360, title: "Stan (Long Version) ft. Dido (VEVO)", source: "eminem-vevo", file: `Eminem - Stan (Long Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 361, title: "Stan (Short Version) ft. Dido (VEVO)", source: "eminem-vevo", file: `Eminem - Stan (Short Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 362, title: "Superman (Clean Version) ft. Dina Rae (VEVO)", source: "eminem-vevo", file: `Eminem - Superman (Clean Version) ft. Dina Rae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 363, title: "Survival (Explicit) (VEVO)", source: "eminem-vevo", file: `Eminem - Survival (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 364, title: "Survival (Live on SNL) (VEVO)", source: "eminem-vevo", file: `Eminem - Survival (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 365, title: "Temporary (feat. Skylar Grey) (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Temporary (feat. Skylar Grey) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 366, title: "The Making Of 'My Name Is' (Vevo Footnotes) (VEVO)", source: "eminem-vevo", file: `Eminem - The Making Of 'My Name Is' (Vevo Footnotes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 367, title: "The Monster (Edited) ft. Rihanna (VEVO)", source: "eminem-vevo", file: `Eminem - The Monster (Edited) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 368, title: "The Monster (Teaser) ft. Rihanna (VEVO)", source: "eminem-vevo", file: `Eminem - The Monster (Teaser) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 369, title: "The Monster Explained (BTS) ft. Rihanna (VEVO)", source: "eminem-vevo", file: `Eminem - The Monster Explained (Behind The Scenes) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 370, title: "The Monster ft. Rihanna (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - The Monster ft. Rihanna (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 371, title: "The Real Slim Shady (Official Video (Clean)) (VEVO)", source: "eminem-vevo", file: `Eminem - The Real Slim Shady (Official Video - Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 372, title: "The Way I Am (Clean Version) (VEVO)", source: "eminem-vevo", file: `Eminem - The Way I Am (Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 373, title: "Untouchable (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - Untouchable (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 374, title: "Untouchable (Lyric) (VEVO)", source: "eminem-vevo", file: `Eminem - Untouchable (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 375, title: "Venom (Remix/Audio) (VEVO)", source: "eminem-vevo", file: `Eminem - Venom (Remix⧸Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 376, title: "Venom (VEVO)", source: "eminem-vevo", file: `Eminem - Venom.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 377, title: "Walk On Water (Audio) ft. Beyoncé (VEVO)", source: "eminem-vevo", file: `Eminem - Walk On Water (Audio) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 378, title: "Walk On Water (BTS) ft. Beyoncé (VEVO)", source: "eminem-vevo", file: `Eminem - Walk On Water (Behind The Scenes) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 379, title: "Walk On Water (Lyric) ft. Beyoncé (VEVO)", source: "eminem-vevo", file: `Eminem - Walk On Water (Lyric Video) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 380, title: "Walk On Water (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Walk On Water (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 381, title: "Walk On Water/Stan/Love The Way You Lie (Medley/Live From Sa", source: "eminem-vevo", file: `Eminem - Walk On Water⧸Stan⧸Love The Way You Lie (Medley⧸Live From Saturday Night Live⧸2017).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 382, title: "We Made You (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - We Made You (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 383, title: "When I'm Gone (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - When I'm Gone (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 384, title: "White America (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - White America (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 385, title: "Without Me (Video) (VEVO)", source: "eminem-vevo", file: `Eminem - Without Me (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 386, title: "Won't Back Down (Ft. P!nk) [Lyric Video] ft. P!nk (VEVO)", source: "eminem-vevo", file: `Eminem - Won't Back Down (Ft. P!nk) [Lyric Video] ft. P!nk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 387, title: "You Don't Know (Video) ft. 50 Cent, Cashis, Lloyd Banks (VEV", source: "eminem-vevo", file: `Eminem - You Don't Know (Official Music Video) ft. 50 Cent, Cashis, Lloyd Banks.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 388, title: "ft. 50 Cent - Is This Love (’09) (Audio) (VEVO)", source: "eminem-vevo", file: `Eminem ft. 50 Cent - Is This Love (’09) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 389, title: "ft. Rihanna - The Monster (Explicit) (Video) (VEVO)", source: "eminem-vevo", file: `Eminem ft. Rihanna - The Monster (Explicit) [Official Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 390, title: "50 Cent - Is This Love ('09) [Visualizer] (VEVO)", source: "eminem-vevo", file: `Eminem, 50 Cent - Is This Love ('09) [Visualizer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 391, title: "Dr. Dre, & 50 Cent - Crack A Bottle (Video) (VEVO)", source: "eminem-vevo", file: `Eminem, Dr. Dre, & 50 Cent - Crack A Bottle (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 392, title: "Royce Da 5'9'', Big Sean, Danny Brown, Dej Loaf, Trick Trick", source: "eminem-vevo", file: `Eminem, Royce Da 5'9'', Big Sean, Danny Brown, Dej Loaf, Trick Trick - Detroit Vs. Everybody.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 393, title: "Royce da 5'9\", Big Sean, Danny Brown, Dej Loaf, Trick Trick ", source: "eminem-vevo", file: `Eminem, Royce da 5'9＂, Big Sean, Danny Brown, Dej Loaf, Trick Trick - Detroit Vs. Everybody.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 394, title: "Slaughterhouse, Yelawolf - CXVPHER (BTS) (VEVO)", source: "eminem-vevo", file: `Eminem, Slaughterhouse, Yelawolf - CXVPHER (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 395, title: "Slaughterhouse, Yelawolf - Vevo Presents: Shady CXVPHER (VEV", source: "eminem-vevo", file: `Eminem, Slaughterhouse, Yelawolf - Vevo Presents： Shady CXVPHER.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 396, title: "Snoop Dogg - From The D 2 The LBC (VMAs) (VEVO)", source: "eminem-vevo", file: `Eminem, Snoop Dogg - From The D 2 The LBC (VMAs).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 397, title: "Skylar Grey - Last One Standing ft. Polo G, Mozzy, & Eminem ", source: "eminem-vevo", file: `Skylar Grey - Last One Standing ft. Polo G, Mozzy, & Eminem [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 398, title: "Skylar Grey, Polo G, Mozzy, Eminem - Last One Standing (Lyri", source: "eminem-vevo", file: `Skylar Grey, Polo G, Mozzy, Eminem - Last One Standing (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 399, title: "Vevo Presents: SHADY CXVPHER (VEVO)", source: "eminem-vevo", file: `Vevo Presents： SHADY CXVPHER.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" }
];


// Note: Additional tracks from eminem-vevo channel are available
// This represents the core collection from EminemMusic Official

export default function EmZenZonePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [modalTrack, setModalTrack] = useState<Track | null>(null);
  const [modalPlaying, setModalPlaying] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingTrackId, setDownloadingTrackId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'loading' | 'success' | 'error' } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalAudioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = (message: string, type: 'loading' | 'success' | 'error', duration?: number) => {
    setToast({ message, type });
    if (type !== 'loading' && duration !== 0) {
      setTimeout(() => setToast(null), duration || 3000);
    }
  };

  const filteredTracks = tracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrackUrl = (track: Track) => {
    return `/tracks/em/${track.source}/${encodeURIComponent(track.file)}`;
  };

  const handlePlay = async (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(track.id);

      const audio = new Audio();
      audio.preload = "auto";
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        showToast("Failed to load audio. Please try again.", "error");
        setPlayingId(null);
      };
      audio.oncanplaythrough = async () => {
        try {
          await audio.play();
        } catch {
          showToast("Playback failed. Please try again.", "error");
          setPlayingId(null);
        }
      };
      audioRef.current = audio;
      audio.src = getTrackUrl(track);
      audio.load();
    }
  };

  const openModal = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
    setModalTrack(track);
    setModalPlaying(false);
    setModalProgress(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (modalAudioRef.current) {
      modalAudioRef.current.pause();
    }
    setModalTrack(null);
    setModalPlaying(false);
    setModalProgress(0);
    document.body.style.overflow = "unset";
  };

  const handleModalPlay = async () => {
    if (!modalTrack) return;

    if (modalPlaying) {
      modalAudioRef.current?.pause();
      setModalPlaying(false);
    } else {
      if (!modalAudioRef.current || modalAudioRef.current.src !== getTrackUrl(modalTrack)) {
        const audio = new Audio();
        audio.preload = "auto";
        audio.ontimeupdate = () => {
          if (modalAudioRef.current) {
            setModalProgress((modalAudioRef.current.currentTime / modalAudioRef.current.duration) * 100);
          }
        };
        audio.onended = () => {
          setModalPlaying(false);
          setModalProgress(0);
        };
        audio.onerror = () => {
          showToast("Failed to load audio.", "error");
          setModalPlaying(false);
        };
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            setModalPlaying(true);
          } catch {
            showToast("Playback failed.", "error");
          }
        };
        modalAudioRef.current = audio;
        audio.src = getTrackUrl(modalTrack);
        audio.load();
      } else {
        try {
          await modalAudioRef.current.play();
          setModalPlaying(true);
        } catch {
          showToast("Playback failed.", "error");
        }
      }
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    showToast("Preparing download... This may take a while.", "loading", 0);

    try {
      const zip = new JSZip();
      const totalTracks = tracks.length;

      for (let i = 0; i < totalTracks; i++) {
        const track = tracks[i];
        try {
          const response = await fetch(getTrackUrl(track));
          const blob = await response.blob();
          const fileName = `${String(i + 1).padStart(3, "0")} - ${track.title}.mp3`;
          zip.file(fileName, blob);
        } catch {
          console.error(`Failed to fetch track ${track.title}`);
        }
        setDownloadProgress(Math.round(((i + 1) / totalTracks) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EM_ZEN_ZONE_A_DETBOM_MUSIC_ZEM1.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Download complete!", "success");
    } catch {
      showToast("Download failed. Please try again.", "error");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownload = async (track: Track) => {
    setDownloadingTrackId(track.id);
    showToast(`Downloading "${track.title}"...`, "loading");

    try {
      const response = await fetch(getTrackUrl(track));
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Eminem - ${track.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`"${track.title}" downloaded!`, "success");
    } catch {
      showToast("Download failed. Please try again.", "error");
    } finally {
      setDownloadingTrackId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg bg-[#1a1a2e] border border-[#ff3333]/30 shadow-lg">
          <div className="flex items-center gap-3">
            {toast.type === 'loading' && (
              <svg className="w-5 h-5 text-[#ff3333] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {toast.type === 'success' && <span className="text-green-500">✓</span>}
            {toast.type === 'error' && <span className="text-red-500">✕</span>}
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a2e] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/tracks"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Tracks</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#ff3333]/20 text-[#ff3333] font-mono">
              DETBOM MUSIC ZEM1
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#ff3333]/50 shadow-2xl shadow-[#ff3333]/20">
              <img
                src="/assets/eminem-zen-zone/cover.jpg"
                alt="EM ZEN ZONE A"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold inline-flex items-center gap-4">
            <span className="bg-gradient-to-r from-[#ff3333] via-white to-[#ff6666] bg-clip-text text-transparent">
              EM ZEN ZONE A
            </span>
            <svg className="w-10 h-10 md:w-12 md:h-12 text-[#ff3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </h1>
          <div className="mt-4 mx-auto w-64 h-[2px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent" />
          <p className="mt-6 text-gray-400 text-lg">
            The Complete Eminem Archive — EMROAD Protocol
          </p>
          <p className="mt-2 text-[#ff3333] font-mono text-sm">
            {tracks.length} Tracks • EminemMusic Official
          </p>
        </div>

        {/* Search & Download All */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl text-white placeholder-gray-500 focus:border-[#ff3333]/50 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="relative w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff3333] to-[#ff6666] hover:from-[#ff4444] hover:to-[#ff7777] text-white font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#ff3333]/25 overflow-hidden"
          >
            {isDownloading && (
              <div className="absolute inset-0 bg-[#ff3333]/30" style={{ width: `${downloadProgress}%`, transition: "width 0.3s ease" }} />
            )}
            <span className="relative flex items-center gap-2">
              {isDownloading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{downloadProgress}%</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download All ({tracks.length})</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Track List */}
        <div className="bg-[#0f0f12] rounded-2xl border border-[#1a1a1e] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[50px_50px_1fr_100px_140px] gap-4 px-6 py-4 border-b border-[#1a1a1e] text-gray-500 text-sm font-medium">
            <div>#</div>
            <div></div>
            <div>Title</div>
            <div>Source</div>
            <div></div>
          </div>

          {/* Track Rows */}
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className="group grid grid-cols-1 md:grid-cols-[50px_50px_1fr_100px_140px] gap-4 px-6 py-4 hover:bg-[#1a1a1e]/50 transition-colors border-b border-[#1a1a1e]/50 last:border-b-0"
              >
                {/* Track Number */}
                <div className="hidden md:flex items-center text-gray-500 font-mono">
                  {String(index + 1).padStart(3, "0")}
                </div>

                {/* Play Button */}
                <div className="hidden md:flex items-center">
                  <button
                    onClick={() => handlePlay(track)}
                    className="w-10 h-10 rounded-full bg-[#ff3333] hover:bg-[#ff4444] flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-[#ff3333]/25"
                  >
                    {playingId === track.id ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Title & Artist */}
                <div className="flex items-center gap-4">
                  {/* Mobile: number + play */}
                  <div className="flex md:hidden items-center gap-2">
                    <span className="text-gray-500 font-mono text-sm w-8">
                      {String(index + 1).padStart(3, "0")}
                    </span>
                    <button
                      onClick={() => handlePlay(track)}
                      className="w-10 h-10 rounded-full bg-[#ff3333] flex items-center justify-center"
                    >
                      {playingId === track.id ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1">
                    <div className={`font-medium ${playingId === track.id ? "text-[#ff3333]" : "text-white"} group-hover:text-[#ff3333] transition-colors`}>
                      {track.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Eminem • {track.album}
                    </div>
                  </div>
                </div>

                {/* Source Badge */}
                <div className="hidden md:flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#ff3333]/10 text-[#ff3333]">
                    {track.source === "eminem-official" ? "OFFICIAL" : "VEVO"}
                  </span>
                </div>

                {/* Actions: Info + Download */}
                <div className="flex items-center justify-end md:justify-start gap-2 mt-3 md:mt-0">
                  {/* Info Button */}
                  <button
                    onClick={() => openModal(track)}
                    className="w-9 h-9 rounded-lg bg-[#2a2a2e] hover:bg-[#3a3a3e] flex items-center justify-center transition-all text-gray-400 hover:text-white"
                    title="Track Info"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(track)}
                    disabled={downloadingTrackId === track.id}
                    className="w-9 h-9 rounded-lg bg-[#2a2a2e] hover:bg-[#ff3333] flex items-center justify-center transition-all text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download"
                  >
                    {downloadingTrackId === track.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No tracks found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-2">
            DETBOM MUSIC ZEM1 • EMROAD Protocol Active
          </p>
          <p className="text-xs text-gray-600">
            Eminem archive curated by CEO Bars. All rights belong to respective owners.
          </p>
        </div>
      </div>

      {/* Track Modal */}
      {modalTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={closeModal}>
          <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f12] rounded-2xl max-w-lg w-full p-8 border border-[#ff3333]/20 my-8" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Album Art */}
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-[#ff3333]/30 shadow-2xl">
                <img src="/assets/eminem-zen-zone/cover.jpg" alt={modalTrack.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{modalTrack.title}</h3>
              <p className="text-gray-400">Eminem</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-[#ff3333]/20 text-[#ff3333]">
                  {modalTrack.source === "eminem-official" ? "OFFICIAL" : "VEVO"}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#2a2a3e] text-gray-400">
                  {modalTrack.album}
                </span>
              </div>
            </div>

            {/* File Info (Description) */}
            <div className="mb-6 p-4 rounded-xl bg-[#0f0f12] border border-[#2a2a3e]">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ff3333] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Original File</p>
                  <p className="text-sm text-gray-300 break-words">{modalTrack.file}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff3333] to-[#ff6666] transition-all duration-200" style={{ width: `${modalProgress}%` }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Play Button */}
              <button
                onClick={handleModalPlay}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff3333] to-[#ff6666] flex items-center justify-center shadow-lg shadow-[#ff3333]/30 hover:scale-105 transition-transform"
              >
                {modalPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              {/* Download Button */}
              <button
                onClick={() => handleDownload(modalTrack)}
                disabled={downloadingTrackId === modalTrack.id}
                className="w-12 h-12 rounded-full bg-[#2a2a3e] hover:bg-[#3a3a3e] flex items-center justify-center transition-all text-gray-400 hover:text-white disabled:opacity-50"
                title="Download"
              >
                {downloadingTrackId === modalTrack.id ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
