"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import JSZip from "jszip";

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
    file: "/assets/ceo-bars-album/ceo-bars/master.mp3",
    coverArt: "/assets/ceo-bars-album/ceo-bars/cover.jpg",
    description: "CEO Bars is a hard-hitting hip-hop anthem that merges corporate ambition with street-level lyricism. Born from the fusion of Hacker, Engineer, and Sound Technology, this track channels the Shiva Consciousness of Buddha Tesla Energy. Spit bars like a boss, lead like a legend—this is the sound of executive excellence meeting raw lyrical power. A manifesto for those who code by day and conquer by night.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "FASTFORWARD by AllRoundaBeats — Licensed beat with exclusive unlimited access",
  },
  {
    id: 2,
    title: "BOOMDAY - P1",
    artist: "Adi 55",
    album: "CEO Bars™",
    duration: "4:15",
    file: "/assets/ceo-bars-album/boomday-p1/master.mp3",
    coverArt: "/assets/ceo-bars-album/boomday-p1/cover.jpg",
    description: "Boomday is about the explosive nucleus where Hip-Hop, Technology, and Mindfulness Meditation collide in a cosmic detonation of consciousness. Sprinkled with the sacred power of Holy Smoke and channeling the raw intensity of Nickel 9 Consciousness, this track ignites the spirit and awakens the mind. It's the sound of inner revolution—where ancient wisdom meets futuristic beats, and every bar drops like a controlled explosion of enlightenment. Welcome to the day everything changes.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "All The Power by SADCG — Licensed beat with exclusive unlimited access",
  },
  {
    id: 3,
    title: "D Off The Block Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:37",
    file: "/assets/detbom-freestyles/d-off-the-block-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/d-off-the-block-freestyle/cover.jpg",
    description: "D Off The Block Freestyle marks the historic integration of Detroit Executes with Mumbai Streets—a transatlantic collision powering up the Hip-Hop Universe and fueling the Tech Innovation Chambers. This track bridges the gritty Motor City grind with the relentless hustle of Maximum City, forging a new sonic pipeline where American street poetry meets Indian entrepreneurial fire. When Detroit's underground legacy shakes hands with Mumbai's startup spirit, bars become blueprints and flows become frameworks. This is where the block meets the blockchain, where freestyle meets future-state—raw, uncut, and engineered for global domination.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "1st Official — Licensed beat with exclusive unlimited access",
  },
  {
    id: 4,
    title: "1KT1 Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "4:18",
    file: "/assets/detbom-freestyles/1kt1-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/1kt1-freestyle/cover.jpg",
    description: "1KT1 Freestyle deploys like a precision-guided lyrical missile—One Kill, Total Impact. This track operates on a single-objective protocol: eliminate weak bars and establish sonic dominance. Engineered in the Nickel 9 Production chambers, 1KT1 represents the tactical fusion of street intelligence and combat-grade wordplay. Every syllable lands with surgical accuracy, every punchline detonates with calculated force. This is not a freestyle—it's a strategic operation in the war for hip-hop supremacy.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 5,
    title: "Bind Four Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "2:41",
    file: "/assets/detbom-freestyles/bind-four-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/bind-four-freestyle/cover.jpg",
    description: "Bind Four Freestyle establishes an unbreakable protocol—four corners of consciousness linked through encrypted bars. Like a quad-core processor running at maximum capacity, this track synchronizes lyrical threads into a unified network of pure hip-hop energy. The Bind Four protocol connects mind, body, spirit, and flow into an indestructible matrix. Short, concentrated, and devastatingly efficient—this freestyle proves that true power comes from perfect unity, not length.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 6,
    title: "Chatrillionaire Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "4:53",
    file: "/assets/detbom-freestyles/chatrillionaire-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/chatrillionaire-freestyle/cover.jpg",
    description: "Chatrillionaire Freestyle rewrites the wealth algorithm—where conversations become currency and dialogue drives billions. Brown and Nerdy, but the portfolio speaks louder than prejudice. This track celebrates the new breed of tech moguls who coded their way from obscurity to empire, turning chat logs into cap tables. In the Chatrillionaire economy, every word is an investment, every bar compounds interest, and the yield is unlimited respect. Silicon Valley meets the streets, and the merger is hostile.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 7,
    title: "Four Thirty Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "6:43",
    file: "/assets/detbom-freestyles/four-thirty-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/four-thirty-freestyle/cover.jpg",
    description: "Four Thirty Freestyle captures the sacred hour when legends separate from pretenders—0430 hours, when the city sleeps but the grind never stops. This extended operation runs deep into enemy territory, a six-minute-plus tactical assault on complacency. At 4:30 AM, there are no excuses, no witnesses, just pure execution. While others dream, the Adi 55 protocol activates, manufacturing success in the darkness. This is the anthem of the pre-dawn warriors, the early-morning assassins of mediocrity.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 8,
    title: "Hipping Hopping Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:45",
    file: "/assets/detbom-freestyles/hipping-hopping-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/hipping-hopping-freestyle/cover.jpg",
    description: "Hipping Hopping Freestyle is a love letter to the culture—pure, uncut, undiluted hip-hop in its most elemental form. No gimmicks, no features, just the raw bounce that started it all. This track channels the Bronx block parties through Mumbai's marine drive, connecting two continents through the universal language of rhythm and rhyme. When the world forgot what real hip-hop sounds like, this freestyle serves as a military-grade reminder: the culture isn't dead, it's just been waiting for reinforcements.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 9,
    title: "La Khoka Nusta Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:37",
    file: "/assets/detbom-freestyles/la-khoka-nusta-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/la-khoka-nusta-freestyle/cover.jpg",
    description: "La Khoka Nusta Freestyle brings the raw Marathi street energy to the global stage—where local slang becomes international artillery. 'Khoka Nusta' resonates through the chawls and gullies, a battle cry of the underdog who refused to stay underground. This track deploys indigenous linguistic weapons with intercontinental precision, proving that authenticity needs no translation. From the streets of Maharashtra to the world's speakers, La Khoka Nusta is the sound of cultural warfare waged with pride and zero apologies.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 10,
    title: "Ridin' Clean Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "4:55",
    file: "/assets/detbom-freestyles/ridin-clean-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/ridin-clean-freestyle/cover.jpg",
    description: "Ridin' Clean Freestyle celebrates the immaculate ascension—no dirt on the name, no stains on the legacy. This track glides through enemy territory in a vehicle of pure accomplishment, windows down, system loud, conscience clear. Ridin' Clean is the reward for those who built empires without compromise, who stacked wins without cutting corners. The exterior shines because the interior is flawless. Every bar polished, every flow detailed, every moment savored from the driver's seat of success.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 11,
    title: "Tesla Rocknash",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "4:21",
    file: "/assets/detbom-freestyles/tesla-rocknash/master.mp3",
    coverArt: "/assets/detbom-freestyles/tesla-rocknash/cover.jpg",
    description: "Tesla Rocknash channels the electromagnetic genius of Nikola Tesla through the unstoppable force of Indian innovation. This track runs on alternating current—switching between frequencies of wisdom and wattage, illuminating minds that others left in the dark. Rocknash represents the fusion reactor where Eastern heritage meets Western technology, generating unlimited creative power. Like Tesla's vision of free energy for all, these bars transmit wirelessly to every corner of the globe, electrifying the hip-hop grid with high-voltage consciousness.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 12,
    title: "Tim Westwood Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "6:22",
    file: "/assets/detbom-freestyles/tim-westwood-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/tim-westwood-freestyle/cover.jpg",
    description: "Tim Westwood Freestyle is a transatlantic assault on the legendary UK hip-hop institution—02100V2 Protocol engaged. This track bridges the gap between London's pirate radio legacy and Mumbai's underground insurgency, deploying heavy artillery over six and a half minutes of relentless verbal bombardment. When Tim Westwood calls for fire, Adi 55 responds with a non-profit rap offensive designed for one purpose: cultural domination without commercial compromise. This is charity work for the streets—free game distributed to the masses.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 13,
    title: "Kshadghesa Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:50",
    file: "/assets/detbom-freestyles/kshadghesa-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/kshadghesa-freestyle/cover.jpg",
    description: "Kshadghesa Freestyle invokes the warrior archetype from ancient Indian consciousness—the destroyer of obstacles who clears the path through sheer force of will. This track operates as a spiritual GPS system, navigating through enemy territory using coordinates encrypted in Sanskrit syllables. Kshadghesa energy demolishes mental barriers, annihilates self-doubt, and establishes dominance over any frequency. When the ancient war drums meet modern 808s, the result is a sonic weapon capable of conquering both realms.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 14,
    title: "Misscomesnet Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "12:37",
    file: "/assets/detbom-freestyles/misscomesnet-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/misscomesnet-freestyle/cover.jpg",
    description: "Misscomesnet Freestyle is an extended twelve-minute deep-dive operation into the digital consciousness—where missed connections become network exploits and every packet contains encrypted bars. This marathon transmission represents the longest uninterrupted lyrical stream in the DETBOM catalog, a sustained assault that tests both artist and listener endurance. In the Misscomesnet protocol, every dropout is intentional, every lag is calculated, and the final delivery arrives exactly when the mission demands. Patience is a weapon; duration is dominance.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 15,
    title: "Peek 330 Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "5:48",
    file: "/assets/detbom-freestyles/peek-330-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/peek-330-freestyle/cover.jpg",
    description: "Peek 330 Freestyle is a reconnaissance operation at the golden hour—330 degrees on the compass, northwest sector secured. This track deploys advanced surveillance linguistics, scanning the horizon for targets while maintaining operational stealth. The Peek Protocol allows brief windows of visibility before returning to shadow mode, each emergence delivering precision strikes. At 330, the sun sets on competition while Adi 55 rises with night-vision clarity. What they glimpse in that peek is enough to understand: this frequency belongs to the DETBOM command.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 16,
    title: "Realest Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:35",
    file: "/assets/detbom-freestyles/realest-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/realest-freestyle/cover.jpg",
    description: "Realest Freestyle strips away all pretense and deploys raw authenticity as the primary weapon—Shady Theme Protocol activated. This track channels the spirit of Detroit's finest through Mumbai's unfiltered streets, creating a cross-continental alliance of genuine lyricists. In an era of manufactured personas, the Realest Freestyle stands as a certified document of truth, each bar notarized by lived experience. No filters, no fabrication, just undiluted reality served over Nickel 9 production. The realest recognize the realest—this is their handshake.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 17,
    title: "Se7en Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "2:32",
    file: "/assets/detbom-freestyles/se7en-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/se7en-freestyle/cover.jpg",
    description: "Se7en Freestyle is a compact, devastating strike package—seven layers of consciousness compressed into two and a half minutes of surgical precision. Like the sacred number itself, this track operates on multiple planes simultaneously: physical, mental, spiritual, creative, social, financial, and cosmic. Each bar represents one dimension of mastery, and the complete package forms an unbreakable septagon of lyrical architecture. Se7en is the lucky number turned lethal—short, sharp, and spiritually significant.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 18,
    title: "Tokyo Drift Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "2:58",
    file: "/assets/detbom-freestyles/tokyo-drift-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/tokyo-drift-freestyle/cover.jpg",
    description: "Tokyo Drift Freestyle executes precision maneuvers through the neon-lit corridors of Japanese street culture—controlled chaos at 180 degrees. This track drifts through verses like a tuned Silvia through Shibuya, tires smoking, crowd watching, driver stone-cold focused. The Tokyo Protocol demands perfect throttle control: enough power to break traction, enough skill to maintain trajectory. When the flow slides sideways, it's not losing control—it's demonstrating a higher form of it. Kansei dorifto in lyrical form.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 19,
    title: "Untitled Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "8:39",
    file: "/assets/detbom-freestyles/untitled-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/untitled-freestyle/cover.jpg",
    description: "Untitled Freestyle exists beyond classification—eight and a half minutes of pure, unnamed energy that defies conventional categorization. This track was intentionally left untitled because no words could contain its essence. Like a black ops mission redacted from official records, the Untitled Freestyle operates in the shadows of the catalog, known only to those who seek it. What cannot be named cannot be limited; what cannot be defined cannot be defeated. This is the freestyle that escaped taxonomy.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 20,
    title: "Z3T1 Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "8:39",
    file: "/assets/detbom-freestyles/z3t1-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/z3t1-freestyle/cover.jpg",
    description: "Z3T1 Freestyle deploys an eight-minute encrypted transmission using military-grade alphanumeric designation—Zone 3, Target 1 acquired. This track operates as a precision-guided lyrical missile, locked onto the primary objective with zero deviation. The Z3T1 Protocol represents the final evolution of the DETBOM algorithm: identify target zone, isolate primary threat, eliminate with extreme verbal prejudice. When standard callsigns won't suffice, the code name speaks volumes. Z3T1 is not a freestyle—it's a classified operation declassified for public consumption.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
  {
    id: 21,
    title: "Zenyuga Freestyle",
    artist: "Adi 55",
    album: "DETBOM FREESTYLES",
    duration: "3:08",
    file: "/assets/detbom-freestyles/zenyuga-freestyle/master.mp3",
    coverArt: "/assets/detbom-freestyles/zenyuga-freestyle/cover.jpg",
    description: "Zenyuga Freestyle channels the serene destruction of Zen warrior philosophy—V0 Protocol initialized. This track combines the meditative calm of Eastern mindfulness with the relentless force of Western hip-hop artillery. Zenyuga represents the zero-state of the mind: empty of distraction, full of purpose, ready for anything. Like a samurai's blade that cuts through silence, these bars slice through the noise with tranquil precision. In the Zenyuga state, there is no enemy—only obstacles to flow around or through. Version zero is always the purest.",
    releaseDate: "25th December 2025",
    featuring: ["Adi 55"],
    instrumental: "Nickel 9 Productions — Licensed beat with exclusive unlimited access",
  },
];

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [modalTrack, setModalTrack] = useState<Track | null>(null);
  const [modalPlaying, setModalPlaying] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
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

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const zip = new JSZip();
      const totalTracks = tracks.length;

      for (let i = 0; i < totalTracks; i++) {
        const track = tracks[i];
        const response = await fetch(track.file);
        const blob = await response.blob();
        const fileName = `${String(i + 1).padStart(2, "0")} - ${track.artist} - ${track.title}.mp3`;
        zip.file(fileName, blob);
        setDownloadProgress(Math.round(((i + 1) / totalTracks) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CEO_Bars_Complete_Collection.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
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
          <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
            If you do not see the desired audio quality after download, this could be because of an older master file. Please redownload the entire collection again.
          </p>
        </div>

        {/* Search & Download All */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
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
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="relative w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff00ff] to-[#ff66ff] hover:from-[#ff33ff] hover:to-[#ff99ff] text-white font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#ff00ff]/25 overflow-hidden"
          >
            {isDownloading && (
              <div
                className="absolute inset-0 bg-[#ff00ff]/30"
                style={{ width: `${downloadProgress}%`, transition: "width 0.3s ease" }}
              />
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
          className="fixed inset-0 z-50 modal-backdrop overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onClick={closeModal}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div
              className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a1e] via-[#141418] to-[#0f0f12] rounded-2xl border border-[#2a2a2e] shadow-2xl"
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
                  className="w-full aspect-square object-cover rounded-t-2xl"
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
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Released: {modalTrack.releaseDate}</span>
                </div>

                {/* Instrumental Credit */}
                <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}
    </main>
  );
}
