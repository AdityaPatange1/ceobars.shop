import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#ff00ff]/20 to-[#ff00ff]/5 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff00ff]/30 to-[#ff00ff]/10 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#ff00ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-[#ff00ff]/20 blur-3xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
          Payment Successful
        </h1>

        {/* Message */}
        <div className="mb-12 space-y-6">
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
            Thank you for supporting The Triple OG Hip Hop & Tech work.
          </p>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Your contribution will lead to lifetimes of blessings, and wealth.
          </p>
        </div>

        {/* Divider */}
        <div className="w-48 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#ff00ff]/50 to-transparent mb-12" />

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1a1a1e] to-[#0f0f12]
                     border border-[#ff00ff]/30 hover:border-[#ff00ff] transition-all duration-300 group"
        >
          <svg
            className="w-5 h-5 text-[#ff00ff] group-hover:-translate-x-1 transition-transform"
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
          <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
            Back to CEO Bars
          </span>
        </Link>

        {/* Footer note */}
        <p className="mt-16 text-gray-600 text-sm">
          A receipt has been sent to your email.
        </p>
      </div>
    </main>
  );
}
