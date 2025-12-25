"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  file: string;
  coverArt: string;
  description: string;
  releaseDate: string;
  featuring?: string[];
  instrumental: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "CEO Bars",
    artist: "Adi 55",
    album: "CEO Bars™",
    duration: "3:42",
    file: "/assets/CEO_BARS_ADI55_MASTER.mp3",
    coverArt: "/assets/CEO_BARS_ADI55_COVER_ART.jpg",
    description: "CEO Bars is a hard-hitting hip-hop anthem that merges corporate ambition with street-level lyricism. Born from the fusion of Hacker, Engineer, and Sound Technology, this track channels the Shiva Consciousness of Buddha Tesla Energy. Spit bars like a boss, lead like a legend—this is the sound of executive excellence meeting raw lyrical power. A manifesto for those who code by day and conquer by night.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "FASTFORWARD by AllRoundaBeats — Licensed beat with exclusive unlimited access",
  },
  {
    id: 2,
    title: "Boomday",
    artist: "Adi 55",
    album: "CEO Bars™",
    duration: "4:15",
    file: "/assets/BOOMDAY_P1_ADI55_MASTER.mp3",
    coverArt: "/assets/BOOMDAY_P1_ADI55_MASTER.jpg",
    description: "Boomday is about the explosive nucleus where Hip-Hop, Technology, and Mindfulness Meditation collide in a cosmic detonation of consciousness. Sprinkled with the sacred power of Holy Smoke and channeling the raw intensity of Nickel 9 Consciousness, this track ignites the spirit and awakens the mind. It's the sound of inner revolution—where ancient wisdom meets futuristic beats, and every bar drops like a controlled explosion of enlightenment. Welcome to the day everything changes.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "All The Power by SADCG — Licensed beat with exclusive unlimited access",
  },
];

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [modalTrack, setModalTrack] = useState<Track | null>(null);
  const [modalPlaying, setModalPlaying] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalAudioRef = useRef<HTMLAudioElement | null>(null);

  const filteredTracks = tracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.file);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(track.id);
    }
  };

  const openModal = (track: Track) => {
    // Pause main player if playing
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

  const handleModalPlay = () => {
    if (!modalTrack) return;

    if (modalPlaying) {
      modalAudioRef.current?.pause();
      setModalPlaying(false);
    } else {
      if (!modalAudioRef.current || modalAudioRef.current.src !== modalTrack.file) {
        modalAudioRef.current = new Audio(modalTrack.file);
        modalAudioRef.current.ontimeupdate = () => {
          if (modalAudioRef.current) {
            setModalProgress((modalAudioRef.current.currentTime / modalAudioRef.current.duration) * 100);
          }
        };
        modalAudioRef.current.onended = () => {
          setModalPlaying(false);
          setModalProgress(0);
        };
      }
      modalAudioRef.current.play();
      setModalPlaying(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      modalAudioRef.current?.pause();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1e]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-bold neon-text">
            CEO BARS<sup className="text-xs">™</sup>
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold neon-text inline-flex items-center gap-4">
            Track List
            <svg
              className="w-10 h-10 md:w-12 md:h-12 text-[#ff00ff]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </h1>
          <div className="mt-4 mx-auto w-64 h-[2px] bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
          <p className="mt-6 text-gray-400 text-lg">
            Stream and download exclusive CEO Bars™ tracks
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl text-white placeholder-gray-500 focus:border-[#ff00ff]/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Track List */}
        <div className="bg-[#0f0f12] rounded-2xl border border-[#1a1a1e] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[50px_50px_1fr_1fr_100px_180px] gap-4 px-6 py-4 border-b border-[#1a1a1e] text-gray-500 text-sm font-medium">
            <div>#</div>
            <div></div>
            <div>Title</div>
            <div>Album</div>
            <div>Duration</div>
            <div></div>
          </div>

          {/* Track Rows */}
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className="group grid grid-cols-1 md:grid-cols-[50px_50px_1fr_1fr_100px_180px] gap-4 px-6 py-4 hover:bg-[#1a1a1e]/50 transition-colors border-b border-[#1a1a1e]/50 last:border-b-0"
              >
                {/* Track Number */}
                <div className="hidden md:flex items-center text-gray-500 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Play Button */}
                <div className="hidden md:flex items-center">
                  <button
                    onClick={() => handlePlay(track)}
                    className="w-10 h-10 rounded-full bg-[#ff00ff] hover:bg-[#ff66ff] flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-[#ff00ff]/25"
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
                    <span className="text-gray-500 font-mono text-sm w-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => handlePlay(track)}
                      className="w-10 h-10 rounded-full bg-[#ff00ff] hover:bg-[#ff66ff] flex items-center justify-center transition-all shadow-lg shadow-[#ff00ff]/25"
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
                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-lg"
                  />
                  <div>
                    <h3 className={`font-semibold transition-colors ${playingId === track.id ? "text-[#ff00ff]" : "text-white group-hover:text-[#ff00ff]"}`}>
                      {track.title}
                    </h3>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden md:flex items-center text-gray-400">
                  {track.album}
                </div>

                {/* Duration */}
                <div className="hidden md:flex items-center text-gray-500 font-mono text-sm">
                  {track.duration}
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
                  <a
                    href={track.file}
                    download={`${track.artist} - ${track.title}.mp3`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a2a2e] hover:bg-[#ff00ff] text-gray-300 hover:text-white transition-all text-sm font-medium group/btn"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">No tracks found</p>
              <p className="text-sm mt-2">Try adjusting your search</p>
            </div>
          )}
        </div>

        {/* Track Count */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          {filteredTracks.length} {filteredTracks.length === 1 ? "track" : "tracks"}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1e] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} CEO Bars™. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Track Info Modal */}
      {modalTrack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a1e] via-[#141418] to-[#0f0f12] rounded-2xl border border-[#2a2a2e] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#2a2a2e] hover:bg-[#3a3a3e] flex items-center justify-center transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cover Art */}
            <div className="relative">
              <img
                src={modalTrack.coverArt}
                alt={modalTrack.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 -mt-16 relative">
              {/* Title & Artist */}
              <h2 className="text-2xl font-bold text-white mb-1">{modalTrack.title}</h2>
              <p className="text-[#ff00ff] font-medium mb-4">
                {modalTrack.featuring?.join(", ") || modalTrack.artist}
              </p>

              {/* Release Date */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Released: {modalTrack.releaseDate}</span>
              </div>

              {/* Instrumental Credit */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span>{modalTrack.instrumental}</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {modalTrack.description}
              </p>

              {/* Mini Player */}
              <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#1a1a1e]">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={handleModalPlay}
                    className="w-12 h-12 rounded-full bg-[#ff00ff] hover:bg-[#ff66ff] flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-[#ff00ff]/25 flex-shrink-0"
                  >
                    {modalPlaying ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Progress Bar & Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{modalTrack.title}</p>
                    <p className="text-gray-500 text-xs truncate">{modalTrack.artist}</p>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1 bg-[#2a2a2e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff00ff] transition-all duration-100"
                        style={{ width: `${modalProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-gray-500 text-xs flex-shrink-0">{modalTrack.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
