import { MARQUEE_ITEMS } from '../data/homeData.js'

const TRACK = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

export const MarqueeTicker = () => (
  <div className="relative overflow-hidden border-y border-white/7 bg-[#0d0d0d] py-3">
    {/* Fade edges */}
    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent" />

    <div className="flex">
      <div className="animate-marquee flex shrink-0 items-center gap-0">
        {TRACK.map((item, i) => (
          <span key={i} className="flex items-center gap-5 px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30 whitespace-nowrap">{item}</span>
            <span className="h-1 w-1 rounded-full bg-white/15 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  </div>
)
