'use client'

// AlgorithmEnding
// ---------------
// Animated closing for the My Algorithm post. Three repetitions of the
// onomatopoeic beeping phrase fade in and out in staggered sequence —
// the visual mirror of the audio loop that never ends. The trailing
// ellipsis dots pulse on their own beat.

export default function AlgorithmEnding() {
  return (
    <div className="my-12 text-center font-mono tracking-widest text-cyan-100/95 text-sm md:text-base">
      <p className="algo-line algo-line-1">Doo doo be doo dooo.</p>
      <p className="algo-line algo-line-2">Doo doo be doo dooo.</p>
      <p className="algo-line algo-line-3">
        Doo doo be doo dooo
        <span className="algo-dots">&hellip;</span>
      </p>
      <style jsx>{`
        .algo-line {
          margin: 0.5em 0;
          opacity: 0.18;
          animation: algo-line-fade 5.4s ease-in-out infinite;
          text-shadow: 0 0 6px rgba(120, 220, 255, 0.45),
            0 0 14px rgba(80, 180, 255, 0.25);
          letter-spacing: 0.18em;
        }
        .algo-line-1 {
          animation-delay: 0s;
        }
        .algo-line-2 {
          animation-delay: 1.8s;
        }
        .algo-line-3 {
          animation-delay: 3.6s;
        }
        @keyframes algo-line-fade {
          0%, 70%, 100% {
            opacity: 0.18;
            transform: translateY(2px);
          }
          18%, 50% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .algo-dots {
          display: inline-block;
          animation: algo-dots-pulse 1.4s ease-in-out infinite;
        }
        @keyframes algo-dots-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
