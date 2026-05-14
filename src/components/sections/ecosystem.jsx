import Link from 'next/link'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import MotionCard from '@/components/motion/motion-card'
import Stagger from '@/components/motion/stagger'
import StaggerItem from '@/components/motion/stagger-item'
import Section from '@/components/sections/section'
import SectionHeader from '@/components/ui/section-header'

import { cn } from '@/lib/utils'
import { ECOSYSTEM } from '@/constants/homepage'

const ACCENT_RULE = {
  green: 'bg-gradient-to-r from-green-500 to-transparent',
  gold: 'bg-gradient-to-r from-gold-400 to-transparent',
}

const ACCENT_ICON = {
  green: 'text-green-300',
  gold: 'text-gold-400',
}

/* Shared layout — every card has the same chrome (flex column, padding,
 * border radius, transition). Only the surface colours diverge between
 * the read-only info cards and the action CTAs. */
const baseShell =
  'flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border p-7 transition-colors'

/* Dark navy surface for the four read-only sponsor info cards. */
const infoSurface = 'border-navy-700 bg-navy-900 hover:border-navy-600'

/* Light gold/green surfaces for the two CTAs (Individual Golfer +
 * Donation). These read like big buttons against the cream section
 * background so visitors can immediately tell which cards are
 * "click me to act" vs "read me to learn". */
const ctaSurface = {
  gold: 'border-gold-400 bg-gold-50 hover:bg-gold-100 hover:border-gold-500',
  green: 'border-green-400 bg-green-50/80 hover:bg-green-100/80 hover:border-green-500',
}
const ctaText = {
  gold: 'text-gold-700',
  green: 'text-green-700',
}
const ctaIconBg = {
  gold: 'bg-gold-400/15 border-gold-400/40',
  green: 'bg-green-500/15 border-green-500/40',
}
const ctaIconColor = {
  gold: 'text-gold-600',
  green: 'text-green-600',
}

const Ecosystem = () => {
  return (
    <Section id="ecosystem" className="bg-cream-50">
      <SectionHeader
        eyebrow="Sponsors · Registration"
        title={
          <>
            Sponsorship tiers from <span className="text-gold-500">$100 to $10,000</span>.
          </>
        }
        lead="Sponsors and registration options are available across every tier. Donations grow the Joshua Cole Harden Scholarship Fund and benefit The First Tee of Phoenix."
      />

      <Stagger className="no-scrollbar mt-10 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 scroll-px-5 sm:mt-14 sm:mx-0 sm:grid sm:grid-cols-1 sm:snap-none sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:scroll-px-0 md:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-6">
        {ECOSYSTEM?.map((card) => {
          const Icon = card.icon
          const href = card.href ?? '/registration'
          const isCta = Boolean(card.cta)
          const accent = card.accent === 'gold' ? 'gold' : 'green'

          return (
            <StaggerItem
              key={card.title}
              className={cn(
                'w-[80%] flex-none snap-start sm:w-auto sm:flex-initial',
                card.span ?? 'lg:col-span-2',
              )}
            >
              <Link
                href={href}
                aria-label={
                  card.ctaLabel
                    ? `${card.ctaLabel} — ${card.title}`
                    : `Choose ${card.title} on the registration page`
                }
                className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
              >
                <MotionCard
                  glow={accent}
                  className={cn(baseShell, isCta ? ctaSurface[accent] : infoSurface)}
                >
                  <div
                    className={cn('absolute inset-x-7 top-0 h-[3px]', ACCENT_RULE[accent])}
                    aria-hidden
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-lg border transition-colors duration-300',
                        isCta
                          ? ctaIconBg[accent]
                          : 'border-navy-700 bg-navy-800 group-hover/card:border-navy-600',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isCta ? ctaIconColor[accent] : ACCENT_ICON[accent],
                        )}
                        strokeWidth={1.5}
                      />
                    </div>
                    {isCta ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.22em] uppercase',
                          ctaText[accent],
                        )}
                      >
                        {card.ctaLabel ?? 'Choose'}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    ) : (
                      <ArrowUpRight
                        className="text-cream-100/40 group-hover/card:text-cream-50 h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  <div className="mt-6 flex-1">
                    <p
                      className={cn(
                        'font-mono text-[11px] font-semibold tracking-[0.22em] uppercase',
                        isCta ? ctaText[accent] : 'text-gold-400',
                      )}
                    >
                      {card.sub}
                    </p>
                    <h3
                      className={cn(
                        'font-display mt-2 text-2xl font-semibold tracking-tight',
                        isCta ? 'text-navy-900' : 'text-cream-50',
                      )}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        'mt-3 text-sm leading-relaxed',
                        isCta ? 'text-mesh-700' : 'text-cream-100/72',
                      )}
                    >
                      {card.description}
                    </p>
                  </div>
                </MotionCard>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}

export default Ecosystem
