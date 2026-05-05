import { ShieldCheck } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import Container from '@/components/ui/container'

import { TRUST_LOGOS } from '@/constants/homepage'

const TrustStrip = () => {
  // Duplicate the list so the inner track can translate -50% and seamlessly loop.
  const loop = [...TRUST_LOGOS, ...TRUST_LOGOS]

  return (
    <section
      aria-label="Frameworks and trust signals"
      className="border-cream-200 bg-cream-100 border-y"
    >
      <Container className="py-14 sm:py-16 lg:py-20">
        <FadeIn>
          <p className="text-mesh-500 text-center font-mono text-[11px] font-semibold tracking-[0.26em] uppercase sm:text-[12px]">
            In partnership with The Legacy Golf Course and The First Tee of Phoenix
          </p>
        </FadeIn>

        {/* Marquee viewport — overflow hidden, edge-fade gradient mask */}
        <div
          className="marquee-pause group relative mt-9 overflow-hidden sm:mt-11"
          style={{
            // Gradient fade on left & right edges. Tailwind doesn't ship a mask
            // utility we control finely enough, so this is inlined.
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* Track: rendered twice end-to-end so translateX(-50%) loops
              perfectly. Width is auto so the track is exactly 2× the badge row. */}
          <ul
            className="marquee-track flex w-max items-stretch gap-4 sm:gap-5 lg:gap-6"
            style={{ '--marquee-duration': '42s' }}
            aria-hidden="false"
          >
            {loop.map((logo, idx) => (
              <li
                key={`${logo.name}-${idx}`}
                className="border-cream-200 bg-cream-50 flex flex-none items-center gap-3 rounded-full border px-5 py-3 sm:px-6 sm:py-3.5"
                aria-hidden={idx >= TRUST_LOGOS.length ? 'true' : undefined}
              >
                <ShieldCheck className="text-gold-400 h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
                <span className="font-display text-mesh-700 text-[13px] font-semibold tracking-tight whitespace-nowrap sm:text-[14px] lg:text-[15px]">
                  {logo.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export default TrustStrip
