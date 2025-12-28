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
  { id: 1, title: "3 a.m.", source: "eminem-official", file: `3 a.m. (Explicit) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 2, title: "Alfred - Intro", source: "eminem-official", file: `Alfred - Intro [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 3, title: "Alfred's Theme", source: "eminem-official", file: `Alfred's Theme [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 4, title: "A** Like That (Super Clean)", source: "eminem-official", file: `A＊＊ Like That (Super Clean Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 5, title: "Bad Meets Evil Europe Part 1", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 1 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 6, title: "Bad Meets Evil Europe Part 2", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 2 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 7, title: "Bad Meets Evil Europe Part 3", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 3 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 8, title: "Bad Meets Evil Europe Part 4", source: "eminem-official", file: `Bad Meets Evil Meets Europe Part 4 ｜ Bad Meets Evil ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 9, title: "Bad Meets Evil Commercial", source: "eminem-official", file: `Bad Meets Evil ｜ Commercial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 10, title: "Beats x Eminem: Beat by Beat", source: "eminem-official", file: `Beats x Eminem： Beat by Beat [TEASER].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 11, title: "Behind the Scenes - Venom (Kimmel)", source: "eminem-official", file: `Behind the Scenes - Eminem Jimmy Kimmel Live "Venom" Performance – Presented by Google Pixel 3.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 12, title: "Behind the Scenes - Southpaw", source: "eminem-official", file: `Behind the Scenes at Jake Gyllenhaal's Southpaw Training.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 13, title: "Black Magic (feat. Skylar Grey)", source: "eminem-official", file: `Black Magic (feat. Skylar Grey) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 14, title: "Black Ops Remix - Won't Back Down", source: "eminem-official", file: `Black Ops Remix Ft. Won't Back Down by Eminem HD ｜ Commercial ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 15, title: "Bodied - Official Trailer", source: "eminem-official", file: `Bodied - Official Trailer - Produced by Eminem..mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 16, title: "Bodied - Preview", source: "eminem-official", file: `Bodied - Preview.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 17, title: "Bodied - Uncensored Trailer", source: "eminem-official", file: `Bodied - Uncensored Official Trailer - Produced by Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 18, title: "Book of Rhymes (feat. DJ Premier)", source: "eminem-official", file: `Book of Rhymes (feat. DJ Premier) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 19, title: "Call Of Duty: Ghosts x MMLP2", source: "eminem-official", file: `Call Of Duty： Ghosts X GameStop - MMLP2 Special Offer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 20, title: "Cleanin' Out My Closet (BET)", source: "eminem-official", file: `Cleanin' Out My Closet (BET Version) by Eminem ｜ Eminem.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 21, title: "Darkness", source: "eminem-official", file: `Darkness [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 22, title: "Detroit Vs. Everybody (BTS)", source: "eminem-official", file: `Detroit Vs. Everybody (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 23, title: "Detroit Vs. Everybody (Lyric)", source: "eminem-official", file: `Detroit Vs. Everybody (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 24, title: "Discombobulated", source: "eminem-official", file: `Discombobulated [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 25, title: "ALS Ice Bucket Challenge", source: "eminem-official", file: `Eminem #ALSIceBucketChallenge.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 26, title: "Forgot About Dre (Live)", source: "eminem-official", file: `Eminem & Dr. Dre - ＂Forgot About Dre＂ [Live Performance].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 27, title: "From The D 2 The LBC", source: "eminem-official", file: `Eminem & Snoop Dogg - From The D 2 The LBC [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 28, title: "Alfred's Theme (Lyric)", source: "eminem-official", file: `Eminem - Alfred's Theme (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 29, title: "All You Got (Skit)", source: "eminem-official", file: `Eminem - All You Got (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 30, title: "Antichrist", source: "eminem-official", file: `Eminem - Antichrist [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 31, title: "A** Like That (CC)", source: "eminem-official", file: `Eminem - A＊＊ Like That (Super Clean Version, Closed Captioned).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 32, title: "Bad One (feat. White Gold)", source: "eminem-official", file: `Eminem - Bad One (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 33, title: "Beautiful", source: "eminem-official", file: `Eminem - Beautiful (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 34, title: "Berzerk (Live SNL)", source: "eminem-official", file: `Eminem - Berzerk (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 35, title: "Berzerk (Lyric)", source: "eminem-official", file: `Eminem - Berzerk (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 36, title: "Berzerk (Audio)", source: "eminem-official", file: `Eminem - Berzerk (Official Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 37, title: "Berzerk (Explicit)", source: "eminem-official", file: `Eminem - Berzerk (Official) (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 38, title: "Berzerk (BTS)", source: "eminem-official", file: `Eminem - Berzerk Explained： Behind The Scenes 1.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 39, title: "Berzerk", source: "eminem-official", file: `Eminem - Berzerk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 40, title: "Brand New Dance", source: "eminem-official", file: `Eminem - Brand New Dance [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 41, title: "Breaking News (Skit)", source: "eminem-official", file: `Eminem - Breaking News (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 42, title: "Campaign Speech", source: "eminem-official", file: `Eminem - Campaign Speech.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 43, title: "Cinderella Man", source: "eminem-official", file: `Eminem - Cinderella Man (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 44, title: "Cleanin' Out My Closet", source: "eminem-official", file: `Eminem - Cleanin' Out My Closet (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 45, title: "Darkness (Video)", source: "eminem-official", file: `Eminem - Darkness (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 46, title: "Detroit Rubber Trailer", source: "eminem-official", file: `Eminem - Detroit Rubber - Season 1 Trailer.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 47, title: "Don't Front (feat. Buckshot)", source: "eminem-official", file: `Eminem - Don't Front (feat. Buckshot) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 48, title: "Interview (CD:UK)", source: "eminem-official", file: `Eminem - Eminem Interview (CD：UK).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 49, title: "Everybody's Looking At Me", source: "eminem-official", file: `Eminem - Everybody's Looking At Me [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 50, title: "Evil", source: "eminem-official", file: `Eminem - Evil [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 51, title: "Fall", source: "eminem-official", file: `Eminem - Fall (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 52, title: "Fortnite Performance", source: "eminem-official", file: `Eminem - Fortnite Chapter 2 Remix The Finale Performance.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 53, title: "Framed", source: "eminem-official", file: `Eminem - Framed.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 54, title: "Fuel (Shady Edition)", source: "eminem-official", file: `Eminem - Fuel (Shady Edition) feat. Westside Boogie & GRIP [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 55, title: "Fuel (feat. JID)", source: "eminem-official", file: `Eminem - Fuel (feat. JID) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 56, title: "Fuel (Lyric)", source: "eminem-official", file: `Eminem - Fuel (feat. JID) [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 57, title: "Godzilla (Lyric) ft. Juice WRLD", source: "eminem-official", file: `Eminem - Godzilla (Lyric Video) ft. Juice WRLD.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 58, title: "Good Guy (BTS)", source: "eminem-official", file: `Eminem - Good Guy (Behind The Scenes) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 59, title: "Good Guy (Video)", source: "eminem-official", file: `Eminem - Good Guy (Official Music Video) ft. Jessie Reyez.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 60, title: "Guess Who's Back (Skit)", source: "eminem-official", file: `Eminem - Guess Who's Back (skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 61, title: "Guilty Conscience (Director's Cut)", source: "eminem-official", file: `Eminem - Guilty Conscience (Director's Cut) ft. Dr. Dre.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 62, title: "Guilty Conscience 2", source: "eminem-official", file: `Eminem - Guilty Conscience 2 [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 63, title: "Guts Over Fear (Audio)", source: "eminem-official", file: `Eminem - Guts Over Fear (Audio) ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 64, title: "Guts Over Fear ft. Sia", source: "eminem-official", file: `Eminem - Guts Over Fear ft. Sia.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 65, title: "Habits (feat. White Gold)", source: "eminem-official", file: `Eminem - Habits (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 66, title: "Head Honcho (feat. Ez Mil)", source: "eminem-official", file: `Eminem - Head Honcho (feat. Ez Mil) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 67, title: "Headlights ft. Nate Ruess", source: "eminem-official", file: `Eminem - Headlights (Explicit) ft. Nate Ruess.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 68, title: "Higher (Video)", source: "eminem-official", file: `Eminem - Higher (Official Video) Explicit.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 69, title: "Houdini (Live)", source: "eminem-official", file: `Eminem - Houdini [Live Performance].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 70, title: "Houdini", source: "eminem-official", file: `Eminem - Houdini [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 71, title: "Infinite (F.B.T. Remix)", source: "eminem-official", file: `Eminem - Infinite (F.B.T. Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 72, title: "Just Don't Give A F***", source: "eminem-official", file: `Eminem - Just Don't Give A F＊＊＊.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 73, title: "Just Lose It", source: "eminem-official", file: `Eminem - Just Lose It (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 74, title: "Killer (Remix)", source: "eminem-official", file: `Eminem - Killer (Remix) [Official Audio] ft. Jack Harlow, Cordae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 75, title: "Kings Never Die (Audio)", source: "eminem-official", file: `Eminem - Kings Never Die (Audio) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 76, title: "Kings Never Die (Lyric)", source: "eminem-official", file: `Eminem - Kings Never Die (Lyric Video) ft. Gwen Stefani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 77, title: "Kyrie & Luka feat. 2 Chainz", source: "eminem-official", file: `Eminem - Kyrie & Luka feat. 2 Chainz [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 78, title: "Like My Shit", source: "eminem-official", file: `Eminem - Like My Shit [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 79, title: "Like Toy Soldiers", source: "eminem-official", file: `Eminem - Like Toy Soldiers (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 80, title: "Lose Yourself", source: "eminem-official", file: `Eminem - Lose Yourself.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 81, title: "Love The Way You Lie", source: "eminem-official", file: `Eminem - Love The Way You Lie ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 82, title: "Lucifer (feat. Sly Pyper)", source: "eminem-official", file: `Eminem - Lucifer (feat. Sly Pyper) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 83, title: "Lucky You ft. Joyner Lucas", source: "eminem-official", file: `Eminem - Lucky You (Official Music Video) ft. Joyner Lucas.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 84, title: "MTV EMAs", source: "eminem-official", file: `Eminem - MTV EMAs.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 85, title: "Mockingbird", source: "eminem-official", file: `Eminem - Mockingbird [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 86, title: "My Name Is (Dirty)", source: "eminem-official", file: `Eminem - My Name Is (Dirty Version) (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 87, title: "My Name Is", source: "eminem-official", file: `Eminem - My Name Is (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 88, title: "No Love (Explicit)", source: "eminem-official", file: `Eminem - No Love (Explicit Version) ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 89, title: "No Love ft. Lil Wayne", source: "eminem-official", file: `Eminem - No Love ft. Lil Wayne.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 90, title: "Not Afraid (BTS Day 1)", source: "eminem-official", file: `Eminem - Not Afraid (Behind The Scenes, Day 1).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 91, title: "Not Afraid (BTS Day 2)", source: "eminem-official", file: `Eminem - Not Afraid (Behind The Scenes, Day 2).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 92, title: "Not Afraid (Teaser)", source: "eminem-official", file: `Eminem - Not Afraid (Teaser).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 93, title: "Not Afraid", source: "eminem-official", file: `Eminem - Not Afraid.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 94, title: "Nowhere Fast (Extended)", source: "eminem-official", file: `Eminem - Nowhere Fast (Extended Version) [Audio] ft. Kehlani.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 95, title: "Partners In Rhyme Trailer", source: "eminem-official", file: `Eminem - Partners In Rhyme： The True Story of Infinite (Official Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 96, title: "Phenomenal (Audio)", source: "eminem-official", file: `Eminem - Phenomenal (Audio Only).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 97, title: "Phenomenal (BTS)", source: "eminem-official", file: `Eminem - Phenomenal (Behind The Scenes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 98, title: "Phenomenal (Lyric)", source: "eminem-official", file: `Eminem - Phenomenal (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 99, title: "Phenomenal", source: "eminem-official", file: `Eminem - Phenomenal.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 100, title: "Rap God (Audio)", source: "eminem-official", file: `Eminem - Rap God (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 101, title: "Rap God (Explicit)", source: "eminem-official", file: `Eminem - Rap God (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 102, title: "Rap God (Mr. Cii Remix)", source: "eminem-official", file: `Eminem - Rap God (Mr. Cii Remix) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 103, title: "Renaissance", source: "eminem-official", file: `Eminem - Renaissance [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 104, title: "River (Audio)", source: "eminem-official", file: `Eminem - River (Audio) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 105, title: "River (BTS)", source: "eminem-official", file: `Eminem - River (Behind the Scenes) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 106, title: "River (Trailer)", source: "eminem-official", file: `Eminem - River (Trailer： Boxing) ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 107, title: "River (Live Twickenham)", source: "eminem-official", file: `Eminem - River ft. Ed Sheeran (LIVE AT TWICKENHAM 2018).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 108, title: "River ft. Ed Sheeran", source: "eminem-official", file: `Eminem - River ft. Ed Sheeran.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 109, title: "Road Rage", source: "eminem-official", file: `Eminem - Road Rage (feat. Dem Jointz & Sly Pyper) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 110, title: "Role Model", source: "eminem-official", file: `Eminem - Role Model.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 111, title: "Shake That ft. Nate Dogg", source: "eminem-official", file: `Eminem - Shake That (Official Music Video) ft. Nate Dogg.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 112, title: "Sing For The Moment", source: "eminem-official", file: `Eminem - Sing For The Moment (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 113, title: "Somebody Save Me & Houdini (VMA)", source: "eminem-official", file: `Eminem - Somebody Save Me & Houdini (Live from the MTV VMA's 2024).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 114, title: "Somebody Save Me (Audio)", source: "eminem-official", file: `Eminem - Somebody Save Me (feat. Jelly Roll) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 115, title: "Somebody Save Me (Video)", source: "eminem-official", file: `Eminem - Somebody Save Me (feat. Jelly Roll) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 116, title: "Space Bound", source: "eminem-official", file: `Eminem - Space Bound.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 117, title: "Stan (Live Wembley 2014)", source: "eminem-official", file: `Eminem - Stan (Live at Wembley 2014) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 118, title: "Stan (Live)", source: "eminem-official", file: `Eminem - Stan (Live).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 119, title: "Stan (Long Version)", source: "eminem-official", file: `Eminem - Stan (Long Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 120, title: "Stan (Short Version)", source: "eminem-official", file: `Eminem - Stan (Short Version) ft. Dido.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 121, title: "Steve Berman (Skit)", source: "eminem-official", file: `Eminem - Steve Berman (Skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 122, title: "Superman (Clean)", source: "eminem-official", file: `Eminem - Superman (Clean Version) ft. Dina Rae.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 123, title: "Survival (Explicit)", source: "eminem-official", file: `Eminem - Survival (Explicit).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 124, title: "Survival (Live SNL)", source: "eminem-official", file: `Eminem - Survival (Live on SNL).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 125, title: "THE DEATH OF SLIM SHADY", source: "eminem-official", file: `Eminem - THE DEATH OF SLIM SHADY (COUP DE GRÂCE).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 126, title: "Temporary (Audio)", source: "eminem-official", file: `Eminem - Temporary (feat. Skylar Grey) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 127, title: "Temporary (Video)", source: "eminem-official", file: `Eminem - Temporary (feat. Skylar Grey) [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 128, title: "Death of Slim Shady (Basement)", source: "eminem-official", file: `Eminem - The Death of Slim Shady (Basement Trailer).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 129, title: "Death of Slim Shady (Trailer)", source: "eminem-official", file: `Eminem - The Death of Slim Shady [Album Trailer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 130, title: "Death of Slim Shady (Graveyard)", source: "eminem-official", file: `Eminem - The Death of Slim Shady [Graveyard Album Trailer].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 131, title: "Making Of 'My Name Is'", source: "eminem-official", file: `Eminem - The Making Of 'My Name Is' (Vevo Footnotes).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 132, title: "The Monster (Edited)", source: "eminem-official", file: `Eminem - The Monster (Edited) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 133, title: "The Monster (Teaser)", source: "eminem-official", file: `Eminem - The Monster (Teaser) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 134, title: "The Monster (BTS)", source: "eminem-official", file: `Eminem - The Monster Explained (Behind The Scenes) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 135, title: "The Monster (Audio)", source: "eminem-official", file: `Eminem - The Monster ft. Rihanna (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 136, title: "Real Slim Shady & Way I Am (MTV 2000)", source: "eminem-official", file: `Eminem - The Real Slim Shady & The Way I Am (Live at MTV Music Awards 2000).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 137, title: "The Real Slim Shady (Clean)", source: "eminem-official", file: `Eminem - The Real Slim Shady (Official Video - Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 138, title: "The Way I Am (Clean)", source: "eminem-official", file: `Eminem - The Way I Am (Clean Version).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 139, title: "Tobey (Audio)", source: "eminem-official", file: `Eminem - Tobey (feat. Big Sean & Babytron) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 140, title: "Tone Deaf (Lyric)", source: "eminem-official", file: `Eminem - Tone Deaf (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 141, title: "Trouble", source: "eminem-official", file: `Eminem - Trouble [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 142, title: "Untouchable (Audio)", source: "eminem-official", file: `Eminem - Untouchable (Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 143, title: "Untouchable (Lyric)", source: "eminem-official", file: `Eminem - Untouchable (Lyric Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 144, title: "Venom (Remix)", source: "eminem-official", file: `Eminem - Venom (Remix⧸Audio).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 145, title: "Venom", source: "eminem-official", file: `Eminem - Venom.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 146, title: "Walk On Water (Audio)", source: "eminem-official", file: `Eminem - Walk On Water (Audio) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 147, title: "Walk On Water (BTS)", source: "eminem-official", file: `Eminem - Walk On Water (Behind The Scenes) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 148, title: "Walk On Water (Lyric)", source: "eminem-official", file: `Eminem - Walk On Water (Lyric Video) ft. Beyoncé.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 149, title: "Walk On Water (Video)", source: "eminem-official", file: `Eminem - Walk On Water (Official Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 150, title: "Walk On Water/Stan Medley (SNL)", source: "eminem-official", file: `Eminem - Walk On Water⧸Stan⧸Love The Way You Lie (Medley⧸Live From Saturday Night Live⧸2017).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 151, title: "We Made You", source: "eminem-official", file: `Eminem - We Made You (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 152, title: "When I'm Gone", source: "eminem-official", file: `Eminem - When I'm Gone (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 153, title: "White America", source: "eminem-official", file: `Eminem - White America (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 154, title: "Without Me", source: "eminem-official", file: `Eminem - Without Me (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 155, title: "Won't Back Down (Lyric)", source: "eminem-official", file: `Eminem - Won't Back Down (Ft. P!nk) [Lyric Video] ft. P!nk.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 156, title: "You Don't Know", source: "eminem-official", file: `Eminem - You Don't Know (Official Music Video) ft. 50 Cent, Cashis, Lloyd Banks.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 157, title: "Guts Over Fear (Teaser)", source: "eminem-official", file: `Eminem - ＂Guts Over Fear＂ ft. Sia [Official Teaser].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 158, title: "Kick Off (Freestyle)", source: "eminem-official", file: `Eminem - ＂Kick Off＂ (Freestyle).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 159, title: "Lose Yourself - The Demo", source: "eminem-official", file: `Eminem - ＂Lose Yourself＂ - The Demo.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 160, title: "Celeb Playlist Update", source: "eminem-official", file: `Eminem Celeb Playlist Update.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 161, title: "MMLP 2 - Out Now", source: "eminem-official", file: `Eminem MMLP 2 - Out Now.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 162, title: "Venom (Empire State Building)", source: "eminem-official", file: `Eminem Performs ＂Venom＂ from the Empire State Building on Jimmy Kimmel Live.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 163, title: "Fortnite Big Bang Event", source: "eminem-official", file: `Eminem Takes the Stage in Fortnite's The Big Bang Event.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 164, title: "Fan Reactions - Fortnite", source: "eminem-official", file: `Fan Reactions From Eminem's Big Bang Concert In Fortnite.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 165, title: "Fuel (Video)", source: "eminem-official", file: `Fuel (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 166, title: "Gnat", source: "eminem-official", file: `Gnat [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 167, title: "Gnat (Lyric)", source: "eminem-official", file: `Gnat [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 168, title: "Godzilla (Video)", source: "eminem-official", file: `Godzilla (Official Music Video).mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 169, title: "Good Guy (Audio)", source: "eminem-official", file: `Good Guy (feat. Jessie Reyez) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 170, title: "Headlights (Video)", source: "eminem-official", file: `Headlights (Official Music Video) ft. Nate Ruess.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 171, title: "Higher (Audio)", source: "eminem-official", file: `Higher [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 172, title: "Higher (Lyric)", source: "eminem-official", file: `Higher [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 173, title: "In Too Deep (Audio)", source: "eminem-official", file: `In Too Deep [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 174, title: "In Too Deep (Video)", source: "eminem-official", file: `In Too Deep [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 175, title: "KILLSHOT", source: "eminem-official", file: `KILLSHOT.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 176, title: "Key (Skit)", source: "eminem-official", file: `Key (Skit) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 177, title: "Killer (Audio)", source: "eminem-official", file: `Killer [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 178, title: "Killer (Lyric)", source: "eminem-official", file: `Killer [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 179, title: "Like Home (Audio)", source: "eminem-official", file: `Like Home (feat. Alicia Keys) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 180, title: "Little Engine (Audio)", source: "eminem-official", file: `Little Engine [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 181, title: "Lock It Up (Audio)", source: "eminem-official", file: `Lock It Up (feat. Anderson .Paak) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 182, title: "Lose Yourself (HD)", source: "eminem-official", file: `Lose Yourself [HD].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 183, title: "Lucky You (Audio)", source: "eminem-official", file: `Lucky You (feat. Joyner Lucas) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 184, title: "Marsh (Audio)", source: "eminem-official", file: `Marsh [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 185, title: "Never Love Again (Audio)", source: "eminem-official", file: `Never Love Again [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 186, title: "No Regrets (Audio)", source: "eminem-official", file: `No Regrets (feat. Don Toliver) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 187, title: "Normal (Audio)", source: "eminem-official", file: `Normal [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 188, title: "Offended (Audio)", source: "eminem-official", file: `Offended [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 189, title: "Premonition (Intro)", source: "eminem-official", file: `Premonition (Intro) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 190, title: "Stepping Stone (Audio)", source: "eminem-official", file: `Stepping Stone [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 191, title: "Stepdad (Audio)", source: "eminem-official", file: `Stepdad [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 192, title: "Stepdad (Lyric)", source: "eminem-official", file: `Stepdad [Official Lyric Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 193, title: "The Monster (Video)", source: "eminem-official", file: `The Monster (Explicit) ft. Rihanna.mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 194, title: "The Ringer (Audio)", source: "eminem-official", file: `The Ringer [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 195, title: "These Demons (Audio)", source: "eminem-official", file: `These Demons [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 196, title: "Tobey (Video)", source: "eminem-official", file: `Tobey feat. Big Sean & BabyTron [Official Music Video].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 197, title: "Tone Deaf (Audio)", source: "eminem-official", file: `Tone Deaf [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 198, title: "Unaccommodating (Audio)", source: "eminem-official", file: `Unaccommodating (feat. Young M.A) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 199, title: "You Gon' Learn (Audio)", source: "eminem-official", file: `You Gon' Learn (feat. Royce Da 5'9 & White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
  { id: 200, title: "Zeus (Audio)", source: "eminem-official", file: `Zeus (feat. White Gold) [Official Audio].mp3`, artist: "Eminem", album: "EM ZEN ZONE A" },
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
