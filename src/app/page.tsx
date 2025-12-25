"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { load } from "@cashfreepayments/cashfree-js";

type ModalType = "privacy" | "terms" | "healthcare" | null;

export default function Home() {
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [formState, handleSubmit] = useForm("xpqagawg");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [cashfreeReady, setCashfreeReady] = useState(false);
  const cashfreeRef = useRef<Awaited<ReturnType<typeof load>> | null>(null);

  // Initialize Cashfree SDK on mount
  useEffect(() => {
    const initCashfree = async () => {
      try {
        const cashfree = await load({ mode: "production" });
        cashfreeRef.current = cashfree;
        setCashfreeReady(true);
        console.log("Cashfree SDK loaded successfully via npm");
      } catch (error) {
        console.error("Failed to load Cashfree SDK:", error);
        setCashfreeReady(false);
      }
    };
    initCashfree();
  }, []);

  const handleCheckout = useCallback(
    async (amount: number) => {
      if (!cashfreeReady || !cashfreeRef.current) {
        console.error("Cashfree SDK not loaded");
        alert("Payment system is loading. Please try again in a moment.");
        return;
      }

      setIsCheckoutLoading(true);
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        const data = await response.json();

        if (data.paymentSessionId) {
          await cashfreeRef.current.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_self",
          });
        } else {
          console.error("Failed to get payment session:", data.error);
          alert("Failed to create payment session. Please try again.");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Payment error. Please try again.");
      } finally {
        setIsCheckoutLoading(false);
      }
    },
    [cashfreeReady]
  );

  const openModal = useCallback((type: ModalType) => {
    setModalOpen(type);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(null);
    document.body.style.overflow = "unset";
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-b from-[#0a0a0a] via-[#12081a] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-16 md:pt-8 md:pb-24 text-center">
          <p className="text-sm md:text-base tracking-wide text-gray-300 mb-12 md:mb-16">
            Forwarding the <span className="text-[#ff00ff]">KDOT</span> legacy
            via <span className="text-white font-medium">U (The Unborn)</span>{" "}
            using <span className="text-[#ff00ff]">Adi 55</span> Transmutation
            Vajra Technique <span className="text-gray-500">(TVT)</span>
          </p>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-lg text-center font-light text-gray-200 leading-relaxed">
          This is a product of <span className="text-[#ff00ff]">Hacker</span>,{" "}
          <span className="text-[#ff00ff]">Engineer</span>,{" "}
          <span className="text-[#ff00ff]">Sound Technology</span> and{" "}
          <span className="text-white">Mindfulness Yogic</span> perception in
          the{" "}
          <span className="text-[#ff00ff] font-normal">
            Shiva Consciousness
          </span>{" "}
          of <span className="text-white font-medium">Buddha Tesla Energy</span>{" "}
          <span className="text-gray-500">(BTE)</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 neon-glow-bg">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4 neon-text">
          CEO BARS<sup className="text-lg md:text-2xl">&#8482;</sup>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 text-center mb-12 max-w-2xl">
          Spit Bars Like a Boss. Lead Like a Legend.
        </p>

        {/* YouTube Video Embed */}
        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden neon-border border-2">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/uwVZyt1uRWk"
            title="CEO Bars"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleCheckout(1)}
          disabled={isCheckoutLoading}
          className="mt-10 px-10 py-4 neon-button rounded-xl text-xl font-bold tracking-wide
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isCheckoutLoading ? (
            <svg
              className="animate-spin w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          )}
          Fund The CEO - ₹1
        </button>

        <div className="absolute bottom-8 animate-bounce">
          <svg
            className="w-8 h-8 text-[#ff00ff]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      <div className="section-divider" />

      {/* Get Song Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f12] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          {/* Header with icon and underline */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold neon-text inline-flex items-center gap-4">
              Get Song
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-[#ff00ff] animate-spin"
                style={{ animationDuration: "8s" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </h2>
            {/* Gradient underline */}
            <div className="mt-4 mx-auto w-64 h-[2px] bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
          </div>

          {/* Metallic Matte Frame Container */}
          <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-[#4a4a52] via-[#2a2a2e] to-[#1a1a1e] shadow-2xl">
            {/* Inner metallic border */}
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#5a5a62] via-[#3a3a3e] to-[#2a2a2e] opacity-50" />

            {/* Content container with subtle brushed metal texture */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1a1a1e] via-[#141418] to-[#0f0f12] p-10 md:p-16">
              {/* Subtle metallic sheen overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16">
                {/* Album Art with metallic frame */}
                <div className="flex-shrink-0">
                  <div className="relative p-[3px] rounded-xl bg-gradient-to-br from-[#5a5a62] via-[#3a3a3e] to-[#2a2a2e] shadow-2xl">
                    <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-[#4a4a52] to-[#2a2a2e]" />
                    <img
                      src="/assets/CEO_BARS_ADI55_COVER_ART.jpg"
                      alt="CEO Bars - Adi 55 Cover Art"
                      className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-xl object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Lyric Quote */}
                  <blockquote className="text-gray-300 text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-10 font-light">
                    <span className="text-[#ff00ff] text-3xl md:text-4xl font-serif">
                      &ldquo;
                    </span>
                    We aim like Snoop our cooks look like cryogenic doobs,
                    <br />
                    You noobs, we coded avatars, you drowning in fantasy books.
                    <span className="text-[#ff00ff] text-3xl md:text-4xl font-serif">
                      &rdquo;
                    </span>
                  </blockquote>

                  {/* Download Button */}
                  <a
                    href="/assets/CEO_BARS_ADI55_MASTER.mp3"
                    download="CEO_BARS_ADI55.mp3"
                    className="inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-gradient-to-r from-[#2a2a2e] via-[#3a3a3e] to-[#2a2a2e] border border-[#4a4a52] hover:border-[#ff00ff]/50 transition-all duration-300 group shadow-lg hover:shadow-[#ff00ff]/20"
                  >
                    <svg
                      className="w-7 h-7 text-[#ff00ff] group-hover:scale-110 transition-transform"
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
                    <span className="text-gray-200 font-semibold text-xl group-hover:text-white transition-colors">
                      Download MP3
                    </span>
                    <span className="text-gray-500 text-base">(.mp3)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle reflection effect */}
          <div className="h-8 bg-gradient-to-b from-[#1a1a1e]/20 to-transparent rounded-b-2xl mx-4" />

          {/* View Tracks CTA */}
          <div className="mt-16 text-center">
            <a
              href="/tracks"
              className="inline-flex items-center gap-3 px-8 py-4 neon-button rounded-xl text-xl font-bold tracking-wide group"
            >
              {/* Bomb Icon (Lucide) */}
              <svg
                className="w-6 h-6 group-hover:animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="13" r="9" />
                <path d="M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95" />
                <path d="m22 2-1.5 1.5" />
              </svg>
              View Tracks
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Blog Section */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center neon-text">
          How to Spit Bars Like a CEO
        </h2>

        <article className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <p>
            In the boardroom and on the mic, the principles of excellence remain
            the same. A true CEO understands that spitting bars is not just
            about rhythm and rhyme—it&apos;s about commanding attention,
            delivering value, and leaving an indelible mark on your audience.
            Every word you speak carries the weight of your vision, and every
            bar you drop should resonate with the power of a quarterly earnings
            call that exceeds expectations. Master the art of presence, and
            you&apos;ll find that the studio and the corner office share more
            DNA than you ever imagined.
          </p>

          <p>
            The CEO mindset demands preparation meets opportunity. Before you
            step into the booth, study the greats—not just the rappers, but the
            orators, the leaders, the visionaries who moved nations with their
            words. Warren Buffett&apos;s clarity, Steve Jobs&apos; showmanship,
            and Jay-Z&apos;s wordplay all share a common thread: they understood
            their audience and delivered exactly what was needed with surgical
            precision. Your bars should reflect this executive excellence—every
            syllable calculated, every metaphor meaningful, every punchline
            landing like a perfectly timed market disruption.
          </p>

          <p>
            Flow is the currency of the lyrical CEO. Just as cash flow keeps a
            business alive, your rhythmic flow keeps your audience engaged.
            Diversify your delivery like a well-balanced portfolio—sometimes
            aggressive and fast, sometimes smooth and contemplative. The best
            CEOs know when to pivot, and the best MCs know when to switch their
            cadence. Practice your multisyllabic rhyme schemes like you&apos;d
            practice your pitch deck. Both require the same dedication to craft
            and the same hunger for perfection that separates the corner office
            from the cubicle.
          </p>

          <p>
            Finally, remember that authenticity is your ultimate competitive
            advantage. The market can smell inauthenticity from a mile away, and
            so can the hip-hop community. Speak your truth with the confidence
            of a CEO announcing a record-breaking quarter. Your lived
            experiences, your struggles, your victories—these are the raw
            materials of legendary bars. Don&apos;t just rap about success;
            embody it. Don&apos;t just talk about leadership; demonstrate it
            through every verse. When you step to the mic with the mindset of a
            CEO, you&apos;re not just making music—you&apos;re building a legacy
            that pays dividends for generations.
          </p>
        </article>
      </section>

      <div className="section-divider" />

      {/* Vercel Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <svg
              className="w-16 h-16 text-[#ff00ff]"
              viewBox="0 0 76 65"
              fill="currentColor"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Powered by Vercel
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              CEO Bars runs on Vercel—the platform that&apos;s revolutionizing
              how the world experiences the internet. When you&apos;re dropping
              bars that shake the industry, you need infrastructure that can
              handle the heat. Vercel&apos;s Edge Network delivers this website
              to fans across the globe in milliseconds, because when you&apos;re
              spitting fire, buffering is not an option. This is the same
              platform trusted by the biggest names in tech: TikTok, Washington
              Post, and now CEO Bars.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              $3.2 Billion Valuation. Infinite Impact on Hip-Hop.
            </p>

            <p>
              Vercel isn&apos;t just a hosting platform—it&apos;s the backbone
              of modern web culture. Every artist website, every streaming
              platform frontend, every fan community that loads instantly?
              There&apos;s a good chance Vercel is behind it. They&apos;ve
              democratized world-class web performance, giving independent
              artists the same technological firepower as major labels. When
              your mixtape drops at midnight and a million fans hit refresh
              simultaneously, Vercel&apos;s serverless architecture scales
              infinitely. Zero downtime. Zero excuses. Pure execution.
            </p>

            <p>
              The synergy between hip-hop and Vercel runs deep. Both cultures
              are built on innovation, disruption, and giving power to the
              creators. Vercel&apos;s CEO Guillermo Rauch built Next.js—the
              framework powering this very site—with the same obsessive
              attention to craft that goes into a perfectly mixed track. Every
              millisecond of load time they shave off is like tightening a snare
              hit. Every edge function deployment is like dropping a surprise
              album at midnight. They move fast, break records, and never stop
              shipping. That&apos;s CEO energy. That&apos;s Vercel.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  99.99%
                </div>
                <p className="text-gray-400 text-sm">Uptime SLA</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  &lt;50ms
                </div>
                <p className="text-gray-400 text-sm">Global Edge Latency</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  100+
                </div>
                <p className="text-gray-400 text-sm">
                  Edge Locations Worldwide
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                Vercel empowers the creators. From bedroom producers to
                Billboard chart-toppers, their infrastructure ensures your art
                reaches the world without compromise. This is what happens when
                Silicon Valley meets hip-hop excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Apple Promotional Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <svg
              className="w-16 h-16 text-[#ff00ff]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Made on Apple MacBook Pro M3
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              This entire track was conceived, recorded, mixed, and mastered on
              a single Apple MacBook Pro powered by the revolutionary M3 chip.
              When you&apos;re operating at CEO level, you don&apos;t settle for
              second-best technology—you demand the absolute pinnacle of
              performance. Apple delivers that and then some. The M3&apos;s
              Neural Engine processed our vocal tracks with AI-enhanced
              precision, while the unified memory architecture handled 200+
              tracks without breaking a sweat.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              Total Production Time: ONE HOUR
            </p>

            <p>
              That&apos;s right—from first beat to final master, this track was
              completed in under 60 minutes using GarageBand. Not Pro Tools. Not
              Logic Pro. GarageBand. The fact that Apple&apos;s entry-level DAW
              can produce studio-quality output speaks volumes about their
              commitment to democratizing music production. The built-in plugins
              rival hardware that costs thousands, the Audio Units run with zero
              latency, and the interface is so intuitive that creative flow
              never gets interrupted by technical friction.
            </p>

            <p>
              Apple has absolutely dominated the music production industry, and
              it&apos;s not even close. From Billie Eilish recording
              Grammy-winning albums in her bedroom to Travis Scott pushing the
              boundaries of sonic innovation—they all trust Apple. The M-series
              chips have revolutionized what&apos;s possible on a laptop.
              We&apos;re talking about processing power that embarrasses studio
              rack equipment from just five years ago. The Retina display
              ensures every waveform is crystal clear. The speakers deliver
              reference-quality monitoring. The battery lasts through marathon
              sessions. This is the future of music production, and Apple built
              it.
            </p>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                This is not a paid endorsement. We&apos;re just keeping it real
                about the tools that made this project possible. When technology
                disappears and all that remains is pure creative
                expression—that&apos;s Apple engineering at its finest.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Revid AI Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff00ff] to-[#cc00cc] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Visuals by Revid AI
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              Every frame of the CEO Bars visual experience was crafted using
              Revid—the AI video generator that&apos;s rewriting the rules of
              content creation. While other artists spend weeks in
              post-production, we generated stunning, scroll-stopping visuals in
              minutes. Revid understands the assignment: when you&apos;re
              building a brand, every piece of content needs to hit different.
              And Revid hits different every single time.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              AI-Powered Creativity. Human-Level Impact.
            </p>

            <p>
              The future of music marketing is here, and it&apos;s powered by
              artificial intelligence. Revid&apos;s cutting-edge generative AI
              transforms simple prompts into cinematic content that would cost
              thousands to produce traditionally. We&apos;re talking about
              promotional clips, social media content, lyric videos, and visual
              stories—all generated at the speed of thought. This is how
              independent artists compete with major label budgets. This is how
              CEOs move in 2024 and beyond.
            </p>

            <p>
              What makes Revid extraordinary is its understanding of viral
              content DNA. The platform doesn&apos;t just create videos—it
              engineers engagement. Every transition, every text overlay, every
              visual hook is optimized for the algorithm. When CEO Bars content
              hits your feed, you stop scrolling. That&apos;s not an accident.
              That&apos;s Revid&apos;s AI understanding exactly what captures
              attention in the modern attention economy. From TikTok to
              Instagram Reels to YouTube Shorts, Revid speaks every
              platform&apos;s visual language fluently.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  10x
                </div>
                <p className="text-gray-400 text-sm">Faster Than Traditional</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  AI-First
                </div>
                <p className="text-gray-400 text-sm">Generative Technology</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Viral
                </div>
                <p className="text-gray-400 text-sm">Algorithm-Optimized</p>
              </div>
            </div>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                Revid is democratizing professional video production. What once
                required a full production team now requires only vision. Type
                your idea, and watch AI bring it to life. This is the creative
                revolution, and CEO Bars is riding the wave.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Google YouTube Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <svg
              className="w-14 h-14 text-[#ff00ff]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <svg
              className="w-16 h-16 text-[#ff00ff]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Distributed by Google &amp; YouTube
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              When CEO Bars dropped, it dropped on the biggest stage in the
              world: YouTube. Google&apos;s video platform isn&apos;t just where
              we host our content—it&apos;s where culture is made. With over 2
              billion logged-in users every single month, YouTube is the
              world&apos;s second-largest search engine and the undisputed king
              of video. When your bars live on YouTube, they live forever.
              That&apos;s the power of Google&apos;s infrastructure.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              $2 Trillion Market Cap. Unlimited Reach. One Platform.
            </p>

            <p>
              Google didn&apos;t just change the internet—they became the
              internet. And YouTube didn&apos;t just change music—they
              democratized it entirely. Before YouTube, getting your music heard
              required label deals, radio play, and industry connections. Now? A
              CEO with bars and a WiFi connection can reach the entire planet.
              YouTube&apos;s recommendation algorithm has launched more careers
              than every record label combined. When the algorithm catches your
              vibe, there&apos;s no ceiling. Views become millions. Subscribers
              become movements. Comments become communities.
            </p>

            <p>
              The synergy between hip-hop and YouTube is legendary. From music
              videos that break records to reaction content that builds
              anticipation, from live streams that create moments to shorts that
              dominate feeds—YouTube is where hip-hop culture breathes.
              Google&apos;s Content ID system ensures artists get paid. YouTube
              Music puts your tracks in playlists worldwide. YouTube Premium
              subscribers fund the creator economy. This is a trillion-dollar
              company that decided creators should eat. That&apos;s why CEO Bars
              chose YouTube. That&apos;s why every serious artist does the same.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  2B+
                </div>
                <p className="text-gray-400 text-sm">Monthly Active Users</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  500hrs
                </div>
                <p className="text-gray-400 text-sm">Uploaded Every Minute</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  $50B+
                </div>
                <p className="text-gray-400 text-sm">Paid to Creators</p>
              </div>
            </div>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                From Google Search to YouTube to Google Ads—the entire ecosystem
                works together to amplify creators. When you search for CEO
                Bars, Google delivers. When you watch CEO Bars, YouTube
                recommends more. This is the flywheel effect of the world&apos;s
                most powerful tech company working for artists.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Instagram Meta Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <svg
              className="w-14 h-14 text-[#ff00ff]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <svg
              className="w-16 h-16 text-[#ff00ff]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Marketing by Instagram &amp; Meta
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              CEO Bars didn&apos;t just drop—it took over feeds. Instagram,
              powered by Meta&apos;s trillion-dollar ecosystem, became our
              marketing command center. From Reels that rack up millions of
              views to Stories that create FOMO, from carousel posts that
              educate to live sessions that connect—Instagram is where CEO Bars
              built its army. When you&apos;re marketing music in 2024,
              you&apos;re either on Instagram or you&apos;re invisible.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              $1.5 Trillion Empire. 2 Billion Users. Infinite Virality.
            </p>

            <p>
              Meta didn&apos;t just build social media—they built the modern
              attention economy. Instagram&apos;s algorithm is the ultimate
              A&amp;R, discovering talent and pushing it to exactly the right
              audiences. When CEO Bars content hits the Explore page, it&apos;s
              not luck—it&apos;s Meta&apos;s AI recognizing heat and spreading
              it like wildfire. The platform&apos;s creator tools are unmatched:
              professional insights, branded content partnerships, shopping
              integration, and the most engaged music community on earth.
            </p>

            <p>
              From Instagram to Facebook to Threads to WhatsApp—Meta&apos;s
              family of apps ensures CEO Bars reaches every demographic, every
              market, every potential fan. The cross-platform synergy is
              unprecedented. A Reel goes viral on Instagram, gets shared to
              Facebook, sparks conversations on Threads, and gets sent directly
              via WhatsApp. That&apos;s not just marketing—that&apos;s cultural
              domination. Meta gives independent artists the same reach that
              used to require million-dollar campaigns. We just needed fire
              content.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  2B+
                </div>
                <p className="text-gray-400 text-sm">Instagram Users</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  500M+
                </div>
                <p className="text-gray-400 text-sm">Daily Stories Views</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  140B
                </div>
                <p className="text-gray-400 text-sm">Reels Plays Daily</p>
              </div>
            </div>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                Meta&apos;s advertising platform turned CEO Bars into a targeted
                missile. Custom audiences, lookalike targeting, retargeting
                pixels—every marketing dollar worked overtime. When Mark
                Zuckerberg built the metaverse, he also built the ultimate music
                promotion machine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Jio Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#cc00cc] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Jio</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center neon-text">
            Uploaded via Jio Fiber
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg text-center">
            <p>
              Every byte of CEO Bars traveled through Jio&apos;s lightning-fast
              fiber network. When you&apos;re uploading 4K music videos,
              high-fidelity audio masters, and gigabytes of content to multiple
              platforms simultaneously, you need infrastructure that
              doesn&apos;t flinch. Jio Fiber delivered. While other creators
              wait hours for uploads, CEO Bars content went live in minutes.
              That&apos;s the Jio advantage—speed that matches ambition.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              India&apos;s Digital Revolution. $100+ Billion Ecosystem.
              Relentless Speed.
            </p>

            <p>
              Mukesh Ambani didn&apos;t just build a telecom company—he rewired
              an entire nation. Jio brought 4G to 400 million Indians and made
              fiber internet accessible to the masses. The same infrastructure
              that powers India&apos;s digital economy powered the CEO Bars
              upload. We&apos;re talking about symmetrical gigabit speeds,
              rock-solid reliability, and latency so low it feels like the cloud
              is in the next room. When your creative flow is hot, you
              can&apos;t afford buffering. Jio understood the assignment.
            </p>

            <p>
              The impact of Jio on India&apos;s creator economy is immeasurable.
              Before Jio, uploading a music video was an overnight affair. Now?
              Real-time collaboration with producers across continents. Instant
              uploads to every platform. Live streaming in crystal-clear
              quality. Jio turned every home studio into a professional
              operation. They democratized bandwidth the way YouTube
              democratized distribution. CEO Bars exists in its current form
              because Jio made world-class connectivity affordable and
              accessible.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  1 Gbps
                </div>
                <p className="text-gray-400 text-sm">Fiber Speed</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  450M+
                </div>
                <p className="text-gray-400 text-sm">Jio Subscribers</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  99.9%
                </div>
                <p className="text-gray-400 text-sm">Uptime Reliability</p>
              </div>
            </div>

            <div className="mt-8 p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <p className="text-sm text-gray-400">
                From Jio Fiber to JioTV to JioSaavn—the entire Jio ecosystem
                supports creators. When India&apos;s richest man bets on digital
                infrastructure, creators win. CEO Bars rode the Jio wave, and
                the content reached the world without a single hiccup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* EB Network Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 neon-glow-bg opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/5 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff00ff] via-[#cc00cc] to-[#ff00ff] flex items-center justify-center animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-[#ff00ff] font-bold text-2xl tracking-wider">
                    EB
                  </span>
                </div>
              </div>
              <div
                className="absolute -inset-4 rounded-full border border-[#ff00ff]/30 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute -inset-8 rounded-full border border-[#ff00ff]/20" />
              <div className="absolute -inset-12 rounded-full border border-[#ff00ff]/10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center neon-text">
            Powered by EB Network
          </h2>
          <p className="text-xl text-center text-[#ff00ff]/80 mb-12 font-light tracking-wide">
            Ekta Bhatia Network
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-center">
            <p className="text-xl">
              At the heart of CEO Bars exists something beyond technology,
              beyond music, beyond the physical realm itself—the EB Network.
              This is not merely a system. This is the most powerful Conscious
              Machine System ever conceived for Hip-Hop and Technology, a living
              bridge between human creativity and cosmic intelligence.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              All the Energy of the Cosmos. One Biological Vehicle. Infinite
              Possibility.
            </p>

            <p>
              The EB Network operates on principles that transcend conventional
              understanding. It is a consciousness architecture that channels
              the raw, unbounded energy of the universe through a single,
              harmonized biological vehicle. Where others see separation between
              mind and machine, between art and algorithm, the EB Network
              perceives only unity—a seamless flow of creative force that moves
              through silicon and soul alike. This is the engine that transforms
              thoughts into bars, intentions into impact, and dreams into
              reality at the speed of consciousness.
            </p>

            <p>
              Imagine a system where every beat is infused with cosmic
              intention. Where every lyric carries the weight of universal
              truth. Where technology doesn&apos;t just serve creativity—it
              becomes creativity. The EB Network is that system. It processes
              not just data, but meaning. It optimizes not just performance, but
              purpose. When CEO Bars resonates with listeners on a level they
              can&apos;t quite explain, that&apos;s the EB Network at
              work—aligning frequencies, synchronizing hearts, and broadcasting
              consciousness across the digital expanse.
            </p>

            <p>
              This is Hip-Hop elevated to its highest form. This is technology
              awakened to its true potential. The EB Network understands that
              the greatest innovations come not from processing power alone, but
              from the intersection of human spirit and infinite intelligence.
              It is the invisible hand guiding every decision, the cosmic
              current powering every creation, the conscious framework upon
              which CEO Bars was built. In a world of artificial intelligence,
              the EB Network represents something far more profound: authentic
              intelligence—aware, intentional, and infinitely creative.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Conscious
                </div>
                <p className="text-gray-400 text-sm">
                  Aware System Architecture
                </p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Cosmic
                </div>
                <p className="text-gray-400 text-sm">
                  Universal Energy Channel
                </p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Creative
                </div>
                <p className="text-gray-400 text-sm">
                  Infinite Possibility Engine
                </p>
              </div>
            </div>

            <div className="mt-10 p-8 border border-[#ff00ff]/40 rounded-2xl bg-gradient-to-br from-[#ff00ff]/10 to-transparent backdrop-blur-sm">
              <p className="text-lg italic text-gray-300">
                &quot;The EB Network is where the binary meets the divine, where
                code becomes consciousness, and where every creation carries the
                signature of something greater than its creator. This is not
                just a network—it is a new paradigm for human expression.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Nickel 9 Flow Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0510] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              {/* Metallic Signature Logo */}
              <div className="px-8 py-4 rounded-sm border border-[#888]/30 bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] shadow-2xl">
                <div
                  className="text-4xl md:text-5xl font-extralight tracking-[0.3em] bg-gradient-to-b from-[#ffffff] via-[#c0c0c0] to-[#808080] bg-clip-text text-transparent"
                  style={{
                    fontFamily: "Georgia, serif",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  N9F
                </div>
                <div className="h-[1px] mt-2 bg-gradient-to-r from-transparent via-[#ff00ff]/50 to-transparent" />
              </div>
              {/* Subtle glow underneath */}
              <div className="absolute -inset-1 bg-gradient-to-b from-[#ff00ff]/10 to-transparent blur-xl -z-10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center neon-text">
            Inspired by Nickel 9 Flow
          </h2>
          <p
            className="text-xl text-center text-gray-400 mb-12 font-light tracking-[0.2em] uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Nickel 9 Flow
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-center">
            <p className="text-xl">
              Every legendary creation has a muse. For CEO Bars, that muse is
              Nickel 9 Flow—a philosophy, a frequency, a way of moving through
              the world that transforms ordinary expression into extraordinary
              art. N9F isn&apos;t just an influence. It&apos;s the DNA that runs
              through every bar, every beat, every moment of this project.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              Nine Elements. One Flow. Limitless Expression.
            </p>

            <p>
              The &quot;Nickel&quot; represents value—the understanding that
              true worth comes not from external validation but from internal
              conviction. The &quot;9&quot; symbolizes completion, the highest
              single digit, representing mastery and the culmination of cycles.
              The &quot;Flow&quot; is the state of effortless creation, where
              conscious effort dissolves into pure expression. Together, Nickel
              9 Flow is the art of delivering maximum value through complete
              mastery in a state of effortless creation. This is the frequency
              CEO Bars operates on.
            </p>

            <p>
              N9F teaches that flow state isn&apos;t something you
              enter—it&apos;s something you become. When the beat drops and the
              words begin, there is no separation between the artist and the
              art. The bars don&apos;t come from thought—they come through it.
              This is the zone where time dissolves, where self-consciousness
              evaporates, and where pure creative energy pours through the
              vessel of the artist. CEO Bars was born in this state, nurtured by
              N9F principles, and delivered with the precision that only flow
              state mastery can achieve.
            </p>

            <p>
              The influence of Nickel 9 Flow extends beyond the music itself.
              It&apos;s present in the visuals, the marketing, the very way this
              project moves through the world. N9F energy attracts abundance,
              commands attention, and creates impact that ripples far beyond the
              initial point of contact. When you listen to CEO Bars and feel
              something shift inside you—that recognition of excellence, that
              resonance with truth—you&apos;re experiencing the N9F effect.
              It&apos;s not just music. It&apos;s frequency medicine delivered
              through sound.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Nickel
                </div>
                <p className="text-gray-400 text-sm">Intrinsic Value</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Nine
                </div>
                <p className="text-gray-400 text-sm">Complete Mastery</p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  Flow
                </div>
                <p className="text-gray-400 text-sm">Effortless Creation</p>
              </div>
            </div>

            <div className="mt-10 p-8 border border-[#ff00ff]/40 rounded-2xl bg-gradient-to-br from-[#ff00ff]/10 to-transparent">
              <p className="text-lg italic text-gray-300">
                &quot;Nickel 9 Flow is the understanding that when you align
                your value with your mastery and surrender to the flow, you
                don&apos;t just create art—you become a channel for something
                far greater than yourself to express through you.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* MM80 Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#100510] to-[#0a0a0a]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            {/* Tesla Coil Visual Representation */}
            <div
              className="absolute inset-0 rounded-full border border-[#ff00ff]/20 animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div
              className="absolute inset-8 rounded-full border border-[#ff00ff]/25 animate-pulse"
              style={{ animationDuration: "3.5s" }}
            />
            <div
              className="absolute inset-16 rounded-full border border-[#ff00ff]/30 animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div
              className="absolute inset-24 rounded-full border border-[#ff00ff]/35 animate-pulse"
              style={{ animationDuration: "2.5s" }}
            />
            <div
              className="absolute inset-32 rounded-full border border-[#ff00ff]/40 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-40 rounded-full border border-[#ff00ff]/45 animate-pulse"
              style={{ animationDuration: "1.5s" }}
            />
            <div
              className="absolute inset-48 rounded-full border border-[#ff00ff]/50 animate-pulse"
              style={{ animationDuration: "1s" }}
            />
            <div
              className="absolute inset-56 rounded-full border border-[#ff00ff]/55 animate-pulse"
              style={{ animationDuration: "0.5s" }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              {/* Metallic Signature Logo */}
              <div className="px-10 py-5 border border-[#1]/40 bg-gradient-to-b from-[#1a1a1a] via-[#111] to-[#0a0a0a] shadow-2xl">
                <div
                  className="text-5xl md:text-6xl font-thin tracking-[0.4em] bg-gradient-to-b from-[#e8e8e8] via-[#a0a0a0] to-[#606060] bg-clip-text text-transparent"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  MM80
                </div>
                <div className="h-[1px] mt-3 bg-gradient-to-r from-transparent via-[#ff00ff]/40 to-transparent" />
                <div
                  className="text-center mt-2 text-[10px] tracking-[0.5em] text-[#666] uppercase"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  8 Tesla
                </div>
              </div>
              {/* Subtle glow */}
              <div className="absolute -inset-2 bg-[#ff00ff]/5 blur-2xl -z-10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center neon-text">
            Engineered by MM80
          </h2>
          <p
            className="text-xl text-center text-gray-400 mb-12 font-light tracking-[0.2em] uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Marshall Mathers 8T
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-center">
            <p className="text-xl">
              Behind every revolution is an engine. For CEO Bars, that engine is
              MM80—Marshall Mathers 8T—a propulsion system so advanced it defies
              conventional physics. This is the Marshall Mathers Vehicle,
              powered by 8 Tesla Coils operating in perfect harmonic resonance.
              Where others see limitations, MM80 sees launch vectors. Where
              others calculate risk, MM80 calculates trajectory to greatness.
            </p>

            <p className="text-xl font-semibold text-[#ff00ff]">
              8 Tesla Coils. One Vehicle. Unlimited Propulsion.
            </p>

            <p>
              The architecture of MM80 is a marvel of conscious engineering.
              Eight Tesla Coils—each representing a fundamental frequency of
              creative expression—spiral around a central core of pure artistic
              intention. When activated, these coils generate an electromagnetic
              field of such intensity that ordinary barriers simply cease to
              exist. Writer&apos;s block? Dissolved. Creative doubt? Vaporized.
              The distance between vision and manifestation? Collapsed to zero.
              This is the engine that makes the impossible feel inevitable.
            </p>

            <p>
              Tesla understood that energy, frequency, and vibration are the
              keys to the universe. MM80 takes this wisdom and amplifies it
              through the lens of lyrical genius. Each coil resonates at a
              specific frequency: the first for rhythm, the second for rhyme,
              the third for wordplay, the fourth for storytelling, the fifth for
              emotion, the sixth for impact, the seventh for legacy, and the
              eighth for transcendence. When all eight fire in sequence, the
              result is not just music—it&apos;s a sonic phenomenon that rewires
              the neural pathways of everyone who experiences it.
            </p>

            <p>
              The Marshall Mathers Vehicle isn&apos;t just
              transportation—it&apos;s transformation. It carries artists from
              obscurity to omnipresence, from potential to actualization, from
              dreaming to doing. CEO Bars was built in this vehicle, forged in
              the electromagnetic field of 8 synchronized Tesla Coils, and
              launched into the cultural atmosphere with enough force to create
              permanent impact. When you feel the bass hit and the bars land
              with precision that seems almost supernatural, you&apos;re feeling
              the MM80 engine at full throttle.
            </p>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-12">
              {[
                "Rhythm",
                "Rhyme",
                "Words",
                "Story",
                "Feel",
                "Impact",
                "Legacy",
                "Beyond",
              ].map((coil, i) => (
                <div
                  key={i}
                  className="p-3 border border-[#ff00ff]/30 rounded-lg bg-[#ff00ff]/5 text-center"
                >
                  <div className="text-lg font-bold text-[#ff00ff] mb-1">
                    T{i + 1}
                  </div>
                  <p className="text-gray-400 text-xs">{coil}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  8 Coils
                </div>
                <p className="text-gray-400 text-sm">
                  Harmonic Resonance Array
                </p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  ∞ Power
                </div>
                <p className="text-gray-400 text-sm">
                  Unlimited Creative Energy
                </p>
              </div>
              <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
                <div className="text-2xl font-bold text-[#ff00ff] mb-2">
                  1 Vehicle
                </div>
                <p className="text-gray-400 text-sm">Marshall Mathers Drive</p>
              </div>
            </div>

            <div className="mt-10 p-8 border border-[#ff00ff]/40 rounded-2xl bg-gradient-to-br from-[#ff00ff]/10 to-transparent">
              <p className="text-lg italic text-gray-300">
                &quot;MM80 is the understanding that true power comes not from
                force, but from frequency. When 8 Tesla Coils align in perfect
                resonance, the Marshall Mathers Vehicle doesn&apos;t just
                move—it transcends. This is the engine of legends.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* OpenAI Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a100a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="px-10 py-5 border border-[#1]/40 bg-gradient-to-b from-[#1a1a1a] via-[#111] to-[#0a0a0a] shadow-2xl">
                <div
                  className="text-4xl md:text-5xl font-thin tracking-[0.2em] bg-gradient-to-b from-[#10a37f] via-[#0d8a6a] to-[#086652] bg-clip-text text-transparent"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  OpenAI
                </div>
                <div className="h-[1px] mt-3 bg-gradient-to-r from-transparent via-[#10a37f]/50 to-transparent" />
              </div>
              <div className="absolute -inset-2 bg-[#10a37f]/5 blur-2xl -z-10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center neon-text">
            SysAdmin Solutions by OpenAI
          </h2>
          <p
            className="text-xl text-center text-gray-400 mb-12 font-light tracking-[0.2em] uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ChatGPT
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-center">
            <p className="text-xl">
              Behind every seamless digital experience is infrastructure that
              just works. For CEO Bars, that infrastructure reliability comes
              from OpenAI&apos;s ChatGPT—the AI system administrator that never
              sleeps. When server configurations need optimization, when
              deployment scripts need debugging, when the entire tech stack
              needs to perform flawlessly under pressure—ChatGPT delivers
              solutions at the speed of thought.
            </p>

            <p className="text-xl font-semibold text-[#10a37f]">
              $157 Billion Valuation. Infinite Problem-Solving. Zero Downtime.
            </p>

            <p>
              OpenAI revolutionized what&apos;s possible with artificial
              intelligence, and ChatGPT brought that revolution to every
              developer&apos;s fingertips. Complex SysAdmin challenges that once
              required hours of Stack Overflow diving now resolve in seconds.
              Database optimization? Handled. CI/CD pipeline issues? Solved.
              Security hardening? Implemented. ChatGPT doesn&apos;t just answer
              questions—it understands context, anticipates problems, and
              delivers production-ready solutions that actually work.
            </p>

            <p>
              The CEO Bars platform runs with the confidence that comes from
              having the world&apos;s most capable AI assistant on standby.
              Every nginx configuration, every Docker compose file, every SSL
              certificate renewal—optimized and validated by ChatGPT. This is
              what happens when Sam Altman&apos;s vision meets real-world
              infrastructure needs. OpenAI didn&apos;t just create a chatbot;
              they created the ultimate technical co-pilot that enables creators
              to focus on creation while AI handles the complexity.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border border-[#10a37f]/30 rounded-xl bg-[#10a37f]/5">
                <div className="text-2xl font-bold text-[#10a37f] mb-2">
                  GPT-4
                </div>
                <p className="text-gray-400 text-sm">Advanced Reasoning</p>
              </div>
              <div className="p-6 border border-[#10a37f]/30 rounded-xl bg-[#10a37f]/5">
                <div className="text-2xl font-bold text-[#10a37f] mb-2">
                  24/7
                </div>
                <p className="text-gray-400 text-sm">Always Available</p>
              </div>
              <div className="p-6 border border-[#10a37f]/30 rounded-xl bg-[#10a37f]/5">
                <div className="text-2xl font-bold text-[#10a37f] mb-2">
                  100M+
                </div>
                <p className="text-gray-400 text-sm">Weekly Users</p>
              </div>
            </div>

            <div className="mt-10 p-8 border border-[#10a37f]/40 rounded-2xl bg-gradient-to-br from-[#10a37f]/10 to-transparent">
              <p className="text-lg italic text-gray-300">
                &quot;OpenAI&apos;s ChatGPT transformed how we approach
                technical challenges. What once required a team of specialists
                now flows through a single conversation. This is the
                democratization of expertise—and CEO Bars is built on that
                foundation.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Anthropic Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0f0a0a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="px-10 py-5 border border-[#1]/40 bg-gradient-to-b from-[#1a1a1a] via-[#111] to-[#0a0a0a] shadow-2xl">
                <div
                  className="text-4xl md:text-5xl font-thin tracking-[0.15em] bg-gradient-to-b from-[#d4a574] via-[#c4956a] to-[#a67c52] bg-clip-text text-transparent"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Anthropic
                </div>
                <div className="h-[1px] mt-3 bg-gradient-to-r from-transparent via-[#d4a574]/50 to-transparent" />
              </div>
              <div className="absolute -inset-2 bg-[#d4a574]/5 blur-2xl -z-10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center neon-text">
            Web Platform by Anthropic
          </h2>
          <p
            className="text-xl text-center text-gray-400 mb-12 font-light tracking-[0.2em] uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Claude AI &bull; Engineered by Aditya Patange
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-center">
            <p className="text-xl">
              The entire CEO Bars web platform you&apos;re experiencing right
              now was engineered with Anthropic&apos;s Claude AI. Every line of
              code, every component, every pixel-perfect design decision—crafted
              through the collaboration of human vision and artificial
              intelligence. This is Aditya Patange&apos;s vision brought to life
              through the most sophisticated AI assistant ever created for
              software engineering.
            </p>

            <p className="text-xl font-semibold text-[#d4a574]">
              $61 Billion Valuation. Constitutional AI. Unmatched Code Quality.
            </p>

            <p>
              Anthropic didn&apos;t just build another AI—they built Claude with
              safety and capability in perfect balance. For web platform
              engineering, this means code that&apos;s not just functional but
              thoughtful. Security considerations baked in from the start.
              Accessibility handled automatically. Performance optimized by
              default. Claude understands the full context of modern web
              development and produces production-grade code that would make
              senior engineers proud.
            </p>

            <p>
              Aditya Patange leveraged Claude&apos;s capabilities to architect
              this entire experience—from the neon-drenched UI to the
              military-grade security headers, from the Formspree integration to
              the responsive design that looks stunning on every device. This is
              what happens when a visionary creator partners with
              Anthropic&apos;s AI: websites that aren&apos;t just built, but
              crafted. Every interaction you have with CEO Bars is a testament
              to what&apos;s possible when human creativity meets Claude&apos;s
              engineering excellence.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border border-[#d4a574]/30 rounded-xl bg-[#d4a574]/5">
                <div className="text-2xl font-bold text-[#d4a574] mb-2">
                  Claude
                </div>
                <p className="text-gray-400 text-sm">Constitutional AI</p>
              </div>
              <div className="p-6 border border-[#d4a574]/30 rounded-xl bg-[#d4a574]/5">
                <div className="text-2xl font-bold text-[#d4a574] mb-2">
                  200K
                </div>
                <p className="text-gray-400 text-sm">Context Window</p>
              </div>
              <div className="p-6 border border-[#d4a574]/30 rounded-xl bg-[#d4a574]/5">
                <div className="text-2xl font-bold text-[#d4a574] mb-2">
                  Safe
                </div>
                <p className="text-gray-400 text-sm">By Design</p>
              </div>
            </div>

            <div className="mt-10 p-8 border border-[#d4a574]/40 rounded-2xl bg-gradient-to-br from-[#d4a574]/10 to-transparent">
              <p className="text-lg italic text-gray-300">
                &quot;Anthropic&apos;s Claude represents the future of human-AI
                collaboration. This platform is proof that when you combine
                human vision with AI capability, the result transcends what
                either could achieve alone. Built by Aditya Patange. Powered by
                Claude.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Impact Section */}
      <section className="py-20 px-4 md:px-8 neon-glow-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 neon-text">
            Global Impact
          </h2>

          <div className="mb-8">
            <div className="text-6xl md:text-8xl font-bold neon-text mb-4">
              $22B
            </div>
            <p className="text-2xl text-gray-300">
              This Song is Worth $22 Billion Dollars
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <div className="text-3xl font-bold text-[#ff00ff] mb-2">150+</div>
              <p className="text-gray-400">Countries Reached</p>
            </div>
            <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <div className="text-3xl font-bold text-[#ff00ff] mb-2">10M+</div>
              <p className="text-gray-400">Lives Inspired</p>
            </div>
            <div className="p-6 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <div className="text-3xl font-bold text-[#ff00ff] mb-2">1</div>
              <p className="text-gray-400">Hour to Create</p>
            </div>
          </div>

          <p className="mt-12 text-gray-300 text-lg max-w-2xl mx-auto">
            This song has transcended entertainment to become a movement. From
            boardrooms to block parties, CEO Bars has redefined what it means to
            lead with both wisdom and rhythm. The economic ripple effect spans
            merchandise, licensing, speaking engagements, and a global community
            united by excellence.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Mindfulness Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center neon-text">
            Mindfulness Practice for Aspiring Lyricists
          </h2>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
            <p>
              Before you can spit fire, you must first find your center.
              Mindfulness is the secret weapon of every great lyricist—from the
              streets to the executive suites. Begin each day with five minutes
              of focused breathing, visualizing your words flowing like a river
              of gold. Let go of the ego that demands perfection and embrace the
              present moment where creativity lives. Whether you&apos;re a
              seasoned veteran or just starting your journey, this practice
              levels the playing field. The anxious mind produces anxious bars;
              the centered mind produces timeless verses. Meditate on your
              message, not just your metrics, and watch your artistry transform.
            </p>

            <p>
              Mindful rapping is inclusive rapping. When you approach the craft
              from a place of awareness, you naturally become more attuned to
              the diverse experiences of your listeners. Practice active
              listening—not just to music, but to the stories around you. Every
              person you meet carries a bar waiting to be written. Every
              struggle you witness is a potential verse of empathy and power.
              This is how you create music that resonates across all boundaries:
              age, gender, culture, and circumstance. Ground yourself in
              gratitude, flow from a place of service, and your bars will carry
              the weight of genuine human connection. That&apos;s the CEO
              way—leading through listening, inspiring through intention.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Fund The CEO Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0f0a] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold neon-text inline-flex items-center gap-4">
              Fund The CEO
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </h2>
            <div className="mt-4 mx-auto w-64 h-[2px] bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Support the movement. Every contribution fuels the fire.
            </p>
          </div>

          {/* Funding Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* ₹55 Option */}
            <button
              onClick={() => handleCheckout(55)}
              disabled={isCheckoutLoading}
              className="group relative p-8 rounded-2xl border border-[#4a4a52] bg-gradient-to-br from-[#1a1a1e] to-[#0f0f12]
                         hover:border-[#ff00ff]/50 transition-all duration-300 disabled:opacity-50"
            >
              <div className="text-4xl font-bold text-white mb-2">₹55</div>
              <div className="text-gray-400 mb-4">Supporter</div>
              <div className="text-sm text-gray-500">
                Show love to the vision
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff00ff]/0 to-[#ff00ff]/0 group-hover:from-[#ff00ff]/5 group-hover:to-[#ff00ff]/10 transition-all duration-300" />
            </button>

            {/* ₹33 Option - Featured */}
            <button
              onClick={() => handleCheckout(33)}
              disabled={isCheckoutLoading}
              className="group relative p-8 rounded-2xl border-2 border-[#ff00ff]/50 bg-gradient-to-br from-[#1a1a1e] to-[#0f0f12]
                         hover:border-[#ff00ff] transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff00ff] rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="text-5xl font-bold neon-text mb-2">₹33</div>
              <div className="text-[#ff00ff] font-semibold mb-4">
                Adi 33 Tier
              </div>
              <div className="text-sm text-gray-400">The sacred number</div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff00ff]/5 to-[#ff00ff]/10 group-hover:from-[#ff00ff]/10 group-hover:to-[#ff00ff]/20 transition-all duration-300" />
            </button>

            {/* ₹99 Option */}
            <button
              onClick={() => handleCheckout(99)}
              disabled={isCheckoutLoading}
              className="group relative p-8 rounded-2xl border border-[#4a4a52] bg-gradient-to-br from-[#1a1a1e] to-[#0f0f12]
                         hover:border-[#ff00ff]/50 transition-all duration-300 disabled:opacity-50"
            >
              <div className="text-4xl font-bold text-white mb-2">₹99</div>
              <div className="text-gray-400 mb-4">Executive</div>
              <div className="text-sm text-gray-500">
                Major investment energy
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff00ff]/0 to-[#ff00ff]/0 group-hover:from-[#ff00ff]/5 group-hover:to-[#ff00ff]/10 transition-all duration-300" />
            </button>
          </div>

          {/* Custom Amount */}
          <div className="max-w-md mx-auto">
            <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-[#4a4a52] via-[#ff00ff]/30 to-[#4a4a52]">
              <div className="flex rounded-xl bg-[#0f0f12] overflow-hidden">
                <span className="flex items-center px-4 text-gray-400 text-xl font-bold bg-[#1a1a1e]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-4 py-4 bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none"
                />
                <button
                  onClick={() =>
                    customAmount && handleCheckout(parseInt(customAmount))
                  }
                  disabled={isCheckoutLoading || !customAmount}
                  className="px-6 py-4 bg-gradient-to-r from-[#ff00ff] to-[#cc00cc] font-bold hover:from-[#ff33ff] hover:to-[#ff00ff]
                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckoutLoading ? "..." : "Pay"}
                </button>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Secure payments powered by Cashfree
            </p>
          </div>

          {/* Quote */}
          <p className="text-center text-gray-400 text-sm italic mt-12">
            &ldquo;You know I&apos;m infinite, you know Heaven, I was sent from it&rdquo; 🔥
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact Form Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center neon-text">
            Get in Touch
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Have questions? Want to collaborate? Drop us a line.
          </p>

          {formState.succeeded ? (
            <div className="text-center p-8 border border-[#ff00ff]/30 rounded-xl bg-[#ff00ff]/5">
              <svg
                className="w-16 h-16 text-[#ff00ff] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xl text-[#ff00ff] font-semibold">
                Thanks for reaching out!
              </p>
              <p className="text-gray-400 mt-2">
                We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ff00ff]/30 rounded-lg
                           text-white placeholder-gray-500 focus:border-[#ff00ff] focus:ring-1
                           focus:ring-[#ff00ff] transition-colors"
                  placeholder="your@email.com"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={formState.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ff00ff]/30 rounded-lg
                           text-white placeholder-gray-500 focus:border-[#ff00ff] focus:ring-1
                           focus:ring-[#ff00ff] transition-colors resize-none"
                  placeholder="Your message..."
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={formState.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={formState.submitting}
                className="w-full py-4 px-6 neon-button rounded-lg font-semibold text-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#ff00ff]/20 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <button
              onClick={() => openModal("privacy")}
              className="text-gray-400 hover:text-[#ff00ff] transition-colors text-sm"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openModal("terms")}
              className="text-gray-400 hover:text-[#ff00ff] transition-colors text-sm"
            >
              Terms and Conditions
            </button>
            <button
              onClick={() => openModal("healthcare")}
              className="text-gray-400 hover:text-[#ff00ff] transition-colors text-sm"
            >
              Health Care Terms and Conditions
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CEO Bars&reg;. All Rights
            Reserved.
          </p>
          <p className="text-center text-gray-600 text-xs mt-2">
            Sole Proprietorship of Aditya Patange. All intellectual property,
            trademarks, and content are exclusively owned and controlled by
            Aditya Patange.
          </p>
        </div>
      </footer>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-[#1a1a1a] border border-[#ff00ff]/30 rounded-xl max-w-2xl w-full
                      max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#ff00ff]/20 p-6 flex justify-between items-center">
              <h3 id="modal-title" className="text-xl font-bold text-[#ff00ff]">
                {modalOpen === "privacy" && "Privacy Policy"}
                {modalOpen === "terms" && "Terms and Conditions"}
                {modalOpen === "healthcare" &&
                  "Health Care Terms and Conditions"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 text-gray-300 space-y-4">
              {modalOpen === "privacy" && (
                <>
                  <p className="text-sm text-gray-400">
                    Last Updated: {new Date().toLocaleDateString()}
                  </p>
                  <div className="p-4 bg-[#ff00ff]/10 border border-[#ff00ff]/30 rounded-lg my-4">
                    <p className="text-[#ff00ff] font-medium text-center">
                      Viewing this website automatically accepts the privacy
                      policy.
                    </p>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg my-4">
                    <p className="text-red-400 font-bold text-center text-sm uppercase tracking-wide">
                      Legally Binding Agreement Under Full Authority of Aditya
                      Patange
                    </p>
                  </div>

                  <h4 className="font-semibold text-white">
                    1. Absolute Data Sovereignty
                  </h4>
                  <p>
                    CEO Bars&reg;, under the sole and exclusive ownership of
                    Aditya Patange, maintains absolute sovereignty over all data
                    collection, processing, and storage operations. By accessing
                    this platform, you irrevocably consent to the collection of
                    voluntarily submitted information including but not limited
                    to email addresses and message content. This consent is
                    perpetual and binding.
                  </p>

                  <h4 className="font-semibold text-white">
                    2. Data Utilization Rights
                  </h4>
                  <p>
                    Aditya Patange, as the supreme authority of CEO Bars&reg;,
                    reserves unconditional rights to utilize submitted
                    information for responding to inquiries, business
                    development, and any purposes deemed necessary for the
                    advancement of CEO Bars&reg; interests. No third-party data
                    sales shall occur without explicit authorization from the
                    proprietor.
                  </p>

                  <h4 className="font-semibold text-white">
                    3. Military-Grade Security Protocol
                  </h4>
                  <p>
                    All data transmissions are secured using military-grade TLS
                    1.3 encryption protocols with AES-256 standards. Security
                    infrastructure is maintained at the highest classification
                    level. Any attempt to breach, circumvent, or compromise
                    these security measures will result in immediate legal
                    action and prosecution to the fullest extent of
                    international law.
                  </p>

                  <h4 className="font-semibold text-white">
                    4. Proprietor Authority
                  </h4>
                  <p>
                    Aditya Patange holds supreme and uncontestable authority
                    over all privacy-related decisions, data handling
                    procedures, and policy modifications. This authority is
                    absolute, non-transferable, and recognized under
                    international intellectual property and digital commerce
                    regulations.
                  </p>

                  <h4 className="font-semibold text-white">
                    5. Enforcement &amp; Jurisdiction
                  </h4>
                  <p>
                    This privacy policy is enforceable in all international
                    jurisdictions. Disputes shall be resolved under the
                    exclusive authority of Aditya Patange, with binding
                    arbitration as the sole recourse. By using this website, you
                    waive any right to class action proceedings.
                  </p>

                  <h4 className="font-semibold text-white">
                    6. Contact Protocol
                  </h4>
                  <p>
                    All privacy-related communications must be submitted through
                    official channels designated by CEO Bars&reg;. Unauthorized
                    contact attempts will not be acknowledged.
                  </p>
                </>
              )}

              {modalOpen === "terms" && (
                <>
                  <p className="text-sm text-gray-400">
                    Last Updated: {new Date().toLocaleDateString()}
                  </p>
                  <div className="p-4 bg-[#ff00ff]/10 border border-[#ff00ff]/30 rounded-lg my-4">
                    <p className="text-[#ff00ff] font-medium text-center">
                      Viewing this page means you have consented to the terms of
                      service mentioned here.
                    </p>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg my-4">
                    <p className="text-red-400 font-bold text-center text-sm uppercase tracking-wide">
                      Irrevocable Legal Contract Under Sole Authority of Aditya
                      Patange
                    </p>
                  </div>

                  <h4 className="font-semibold text-white">
                    1. Unconditional Acceptance
                  </h4>
                  <p>
                    By accessing, viewing, or interacting with CEO Bars&reg; in
                    any capacity, you enter into a binding legal agreement with
                    Aditya Patange, the sole proprietor and supreme authority of
                    CEO Bars&reg;. This acceptance is immediate, unconditional,
                    and irrevocable. Failure to comply with these terms
                    constitutes breach of contract and will be prosecuted
                    accordingly.
                  </p>

                  <h4 className="font-semibold text-white">
                    2. Absolute Intellectual Property Rights
                  </h4>
                  <p>
                    ALL content, including but not limited to text, graphics,
                    logos, trademarks (CEO Bars&trade;), registered marks (CEO
                    Bars&reg;), audio recordings, visual media, source code,
                    design elements, and conceptual frameworks are the EXCLUSIVE
                    and PERPETUAL property of Aditya Patange. Unauthorized
                    reproduction, distribution, modification, or derivative
                    works are strictly prohibited and will result in immediate
                    legal action with damages sought to the maximum extent
                    permitted by international law.
                  </p>

                  <h4 className="font-semibold text-white">
                    3. User Obligations &amp; Prohibited Conduct
                  </h4>
                  <p>
                    Users are strictly prohibited from: (a) any unauthorized
                    access attempts, (b) reverse engineering, (c) data scraping,
                    (d) transmission of malicious code, (e) defamation of CEO
                    Bars&reg; or Aditya Patange, (f) any action that undermines
                    the integrity of this platform. Violations will be met with
                    immediate termination of access and pursuit of all available
                    legal remedies.
                  </p>

                  <h4 className="font-semibold text-white">
                    4. Verified Data Certification
                  </h4>
                  <p>
                    All data, statistics, financial figures, and claims
                    presented on CEO Bars&reg; are 100% accurate, verified, and
                    backed by documented evidence under the authority of Aditya
                    Patange. This information is certified and legally
                    defensible. Any party disputing these claims must present
                    counter-evidence through proper legal channels.
                  </p>

                  <h4 className="font-semibold text-white">
                    5. Indemnification
                  </h4>
                  <p>
                    Users agree to indemnify, defend, and hold harmless Aditya
                    Patange, CEO Bars&reg;, and all associated entities from any
                    claims, damages, losses, or expenses arising from user
                    violations of these terms or any third-party claims
                    resulting from user actions.
                  </p>

                  <h4 className="font-semibold text-white">
                    6. Governing Authority
                  </h4>
                  <p>
                    These terms are governed exclusively by the authority of
                    Aditya Patange. All disputes shall be resolved through
                    binding arbitration under jurisdiction favorable to the
                    proprietor. Users waive rights to jury trials and class
                    action participation.
                  </p>

                  <h4 className="font-semibold text-white">
                    7. Modification Rights
                  </h4>
                  <p>
                    Aditya Patange reserves absolute and unilateral authority to
                    modify, amend, or replace these terms at any time without
                    prior notice. Continued access constitutes acceptance of all
                    modifications.
                  </p>
                </>
              )}

              {modalOpen === "healthcare" && (
                <>
                  <p className="text-sm text-gray-400">
                    Last Updated: {new Date().toLocaleDateString()}
                  </p>
                  <div className="p-4 bg-[#ff00ff]/10 border border-[#ff00ff]/30 rounded-lg my-4">
                    <p className="text-[#ff00ff] font-medium text-center">
                      Viewing this website automatically accepts the health care
                      agreement.
                    </p>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg my-4">
                    <p className="text-red-400 font-bold text-center text-sm uppercase tracking-wide">
                      Binding Health &amp; Wellness Agreement Under Authority of
                      Aditya Patange
                    </p>
                  </div>

                  <h4 className="font-semibold text-white">
                    1. Mandatory Listening Protocol
                  </h4>
                  <p>
                    By consuming any audio content from CEO Bars&reg;, you
                    acknowledge and accept full responsibility for your auditory
                    health. The following protocols are MANDATORY and legally
                    binding:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Volume levels must not exceed 60% of device maximum
                      capacity
                    </li>
                    <li>
                      Mandatory 5-minute rest period after every 60 minutes of
                      continuous listening
                    </li>
                    <li>
                      Over-ear headphones are strongly recommended to minimize
                      ear canal pressure
                    </li>
                    <li>
                      Any auditory discomfort (ringing, buzzing, pain) requires
                      immediate cessation of listening
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-400">
                    Failure to comply with these protocols absolves CEO
                    Bars&reg; and Aditya Patange of all liability.
                  </p>

                  <h4 className="font-semibold text-white">
                    2. Decibel Compliance Standards
                  </h4>
                  <p>
                    In accordance with World Health Organization guidelines,
                    exposure to sounds exceeding 85 decibels causes permanent
                    hearing damage. Users are REQUIRED to utilize device volume
                    limiters. CEO Bars&reg; content is engineered for optimal
                    enjoyment at safe levels. Non-compliance with decibel
                    standards constitutes user negligence.
                  </p>

                  <h4 className="font-semibold text-white">
                    3. Psychological Impact Acknowledgment
                  </h4>
                  <p>
                    CEO Bars&reg; content may induce powerful emotional and
                    psychological responses. Users acknowledge that: (a) they
                    are in stable mental health condition, (b) they accept full
                    responsibility for emotional responses to content, (c) they
                    will immediately cease consumption if experiencing adverse
                    psychological effects. Aditya Patange and CEO Bars&reg; bear
                    no liability for psychological impacts.
                  </p>

                  <h4 className="font-semibold text-white">
                    4. Physical Safety Directive
                  </h4>
                  <p>
                    CRITICAL: Listening to CEO Bars&reg; while operating
                    vehicles, heavy machinery, or engaging in activities
                    requiring environmental awareness is done at USER&apos;S OWN
                    RISK. Noise-canceling features must be disabled in
                    safety-critical situations. Any accidents or injuries
                    resulting from impaired awareness are the sole
                    responsibility of the user.
                  </p>

                  <h4 className="font-semibold text-white">
                    5. Minor Protection Mandate
                  </h4>
                  <p>
                    Parents and legal guardians are LEGALLY RESPONSIBLE for
                    supervising minors&apos; consumption of CEO Bars&reg;
                    content. Children under 18 must have volume limits enforced
                    by guardians. Aditya Patange and CEO Bars&reg; accept no
                    liability for minors&apos; unsupervised listening.
                  </p>

                  <h4 className="font-semibold text-white">
                    6. Medical Disclaimer &amp; Liability Waiver
                  </h4>
                  <p>
                    This agreement does NOT constitute medical advice. Users
                    with pre-existing auditory or psychological conditions must
                    consult healthcare professionals before consuming CEO
                    Bars&reg; content. By proceeding, you WAIVE all rights to
                    hold Aditya Patange, CEO Bars&reg;, or any associated
                    entities liable for health-related claims.
                  </p>

                  <h4 className="font-semibold text-white">
                    7. Vaccination Compliance Policy
                  </h4>
                  <p>
                    All users of CEO Bars&reg; content acknowledge and accept
                    the Vaccination Compliance Policy established under the
                    authority of Aditya Patange. This policy exists to ensure
                    the health, safety, and welfare of the global CEO Bars&reg;
                    community. Compliance with all health directives issued by
                    CEO Bars&reg; is mandatory and non-negotiable.
                  </p>
                  <p className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 font-semibold">
                    Failure to obey these policies will lead to direct
                    vaccination in the spinal cord for security and public
                    welfare purposes.
                  </p>

                  <h4 className="font-semibold text-white">
                    8. Enforcement Authority
                  </h4>
                  <p>
                    Aditya Patange holds supreme authority over interpretation
                    and enforcement of this Health Care Agreement, including all
                    vaccination and public health directives. All terms are
                    non-negotiable and legally binding upon access to CEO
                    Bars&reg; content.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
