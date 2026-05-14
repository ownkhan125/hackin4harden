import Link from 'next/link'

import { ArrowRight, HandHeart, Mail, ShieldCheck } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'

/* Final CTA — mirrors the hero's three primary paths plus a Contact
 * option, so the bottom of the page offers the same decision the top
 * does. Body copy + meta-chip row removed per client review; the
 * heading carries the date so we don't repeat it in pill form. */
const FinalCta = () => {
  return (
    <section className="bg-navy-950 relative overflow-hidden">
      <div
        className="bg-mesh-grid bg-grid-32 pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(194,138,32,0.18) 0%, rgba(194,138,32,0) 60%)',
        }}
        aria-hidden
      />

      <Container className="section-pad relative z-10">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="text-gold-400 before:bg-gold-400/70 mx-auto inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.22em] uppercase before:block before:h-px before:w-10">
            Join us in honoring Josh
          </span>

          <h2 className="font-display text-display-xl text-cream-50 sm:text-display-2xl mt-6 font-semibold tracking-[-0.025em] text-balance">
            Saturday, June 6, 2026. <span className="text-gold-400">7:30 AM shotgun.</span>
          </h2>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold" size="lg">
              <Link href="/register">
                Register to Play <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="primary" size="lg">
              <Link href="/sponsor">Become a Sponsor</Link>
            </Button>
            <Button asChild variant="ghostLight" size="lg">
              <Link href="/donate">
                <HandHeart className="h-4 w-4" /> Donate
              </Link>
            </Button>
            <Button asChild variant="ghostLight" size="lg">
              <Link href="/contact">
                <Mail className="h-4 w-4" /> Contact
              </Link>
            </Button>
          </div>

          <div className="text-cream-100/45 mt-10 inline-flex items-center gap-2 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-green-300" />
            <span className="font-mono tracking-[0.22em] uppercase">
              2026 Registration Now Open
            </span>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}

export default FinalCta
