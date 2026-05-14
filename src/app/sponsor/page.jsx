import Link from 'next/link'

import {
  ArrowRight,
  Award,
  Flag,
  Heart,
  Medal,
  Phone,
  ShieldCheck,
  Star,
  Target,
  Trophy,
} from 'lucide-react'

import MotionCard from '@/components/motion/motion-card'
import PageHero from '@/components/sections/page-hero'
import Section from '@/components/sections/section'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import SectionHeader from '@/components/ui/section-header'

import { siteConfig } from '@/constants/site'

export const metadata = {
  title: 'Become a Sponsor · Hackin’ for Harden 2026',
  description:
    'Sponsor the 11th Annual Hackin’ for Harden Memorial Golf Tournament. Seven tiers from $500 to $10,000 — funds the Joshua Cole Harden Scholarship Fund and The First Tee of Phoenix.',
}

/* Sponsor tiers — pulled from the GHL catalog. Benefit copy is a
 * conservative summary; the per-tier benefit list (signage placement,
 * mic time, etc.) should be confirmed with Andy before launch.
 * See `hackin4harden_master_prompts.pdf` Fix 4 — NEEDS INPUT note. */
const SPONSOR_TIERS = [
  {
    id: 'platinum',
    icon: Star,
    name: 'Platinum Sponsor',
    price: '$10,000',
    accent: 'gold',
    featured: true,
    description: 'Top-tier sponsorship of the 11th Annual Hackin’ for Harden.',
    href: '/registration?tier=platinum#sponsorships',
  },
  {
    id: 'gold',
    icon: Trophy,
    name: 'Gold Sponsor',
    price: '$5,000',
    accent: 'gold',
    description: 'Gold-tier sponsorship of the tournament.',
    href: '/registration?tier=gold#sponsorships',
  },
  {
    id: 'shirt',
    icon: Trophy,
    name: 'Golf Shirt Sponsorship',
    price: '$5,000',
    accent: 'gold',
    description: 'Logo printed on every tournament participant’s golf shirt.',
    href: '/registration?tier=shirt#sponsorships',
  },
  {
    id: 'silver',
    icon: Medal,
    name: 'Silver Sponsor',
    price: '$2,500',
    accent: 'green',
    description: 'Silver-tier sponsorship of the tournament.',
    href: '/registration?tier=silver#sponsorships',
  },
  {
    id: 'cart',
    icon: ShieldCheck,
    name: 'Golf Cart Sponsorship',
    price: '$1,000',
    accent: 'green',
    description: 'Logo placard on every golf cart — high visibility all day.',
    href: '/registration?tier=cart#sponsorships',
  },
  {
    id: 'flag',
    icon: Flag,
    name: 'Flag Sponsorship',
    price: '$1,000',
    accent: 'green',
    description: 'Logo printed on tournament flags, visible at every green.',
    href: '/registration?tier=flag#sponsorships',
  },
  {
    id: 'hole',
    icon: Target,
    name: 'Hole Sponsorship',
    price: '$500',
    accent: 'green',
    description: 'Tee-box sign with your logo at one hole.',
    href: '/registration?tier=hole#sponsorships',
  },
]

const WHY_SPONSOR = [
  {
    icon: Award,
    title: 'Local visibility',
    body: 'Reach 100+ Phoenix-area golfers, business owners, and community members on tournament day.',
  },
  {
    icon: Heart,
    title: 'Compounding goodwill',
    body: 'Eleven years of consistent giving. Sponsors recognized in event materials, social posts, and the post-event recap.',
  },
  {
    icon: Target,
    title: 'A cause that matters',
    body: 'Sponsorship proceeds grow the Joshua Cole Harden Scholarship Fund and support The First Tee of Phoenix kids new to the sport.',
  },
]

const SponsorPage = () => {
  return (
    <main>
      <PageHero
        eyebrow="Become a Sponsor"
        title={
          <>
            Put your brand behind a cause that&apos;s grown for{' '}
            <span className="text-gold-400">11 years</span>.
          </>
        }
        lead="Your sponsorship directly supports the Joshua Cole Harden Scholarship Fund and The First Tee of Phoenix while giving your business meaningful visibility throughout tournament day."
      />

      <Section id="tiers" className="bg-cream-50">
        <SectionHeader
          eyebrow="Sponsorship tiers"
          title={
            <>
              Seven ways to <span className="text-gold-500">stand behind</span> the tournament.
            </>
          }
          lead="All sponsorships include recognition at the tournament and in event communications. Higher tiers add signage placement and dedicated branded moments."
        />

        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {SPONSOR_TIERS.map((t) => {
            const Icon = t.icon
            return (
              <Link
                key={t.id}
                href={t.href}
                aria-label={`Choose ${t.name} on the registration page`}
                className="group/tier block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2"
              >
                <MotionCard
                  glow={t.accent === 'gold' ? 'gold' : 'green'}
                  className="border-cream-200 hover:border-green-300 flex h-full flex-col overflow-hidden rounded-xl border bg-white p-7 transition-colors"
                >
                  <div
                    className={`absolute inset-x-7 top-0 h-[3px] ${
                      t.accent === 'gold' ? 'bg-gold-400' : 'bg-green-500'
                    }`}
                    aria-hidden
                  />
                  <div className="flex h-11 items-start justify-between gap-4">
                    <div
                      className={`border-cream-200 bg-cream-50 flex h-11 w-11 flex-none items-center justify-center rounded-lg border ${
                        t.accent === 'gold' ? 'text-gold-500' : 'text-green-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    {t.featured ? <Badge variant="green">Premier</Badge> : null}
                  </div>
                  <h3 className="font-display text-navy-900 mt-6 text-xl font-semibold tracking-tight">
                    {t.name}
                  </h3>
                  <p className="font-display text-navy-900 mt-3 text-3xl font-bold tracking-tight">
                    {t.price}
                  </p>
                  <p className="text-mesh-600 mt-4 flex-1 text-sm leading-relaxed">
                    {t.description}
                  </p>
                  <p className="border-cream-100 mt-6 inline-flex items-center gap-2 border-t pt-5 font-mono text-[11px] font-semibold tracking-[0.22em] text-navy-900 uppercase group-hover/tier:text-green-600">
                    Choose this tier <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </MotionCard>
              </Link>
            )
          })}
        </div>
      </Section>

      <Section id="why-sponsor" className="bg-cream-100">
        <SectionHeader
          eyebrow="Why sponsor?"
          title={
            <>
              Reach, recognition, and a <span className="text-green-500">legacy</span>.
            </>
          }
        />
        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-3">
          {WHY_SPONSOR.map((card) => {
            const Icon = card.icon
            return (
              <MotionCard
                key={card.title}
                glow="green"
                className="border-cream-200 flex h-full flex-col rounded-xl border bg-white p-7"
              >
                <div className="border-cream-200 bg-cream-50 flex h-11 w-11 items-center justify-center rounded-lg border text-green-500">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-navy-900 mt-6 text-lg font-semibold tracking-tight">
                  {card.title}
                </h3>
                <p className="text-mesh-600 mt-3 text-sm leading-relaxed">{card.body}</p>
              </MotionCard>
            )
          })}
        </div>
      </Section>

      <Section id="custom-package" className="bg-cream-50">
        <div className="border-cream-200 mx-auto max-w-3xl rounded-2xl border bg-white p-8 text-center sm:p-10">
          <p className="text-mesh-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
            Need a custom package?
          </p>
          <h3 className="font-display text-navy-900 mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Have a sponsorship idea or want to combine tiers? Talk to Andy directly.
          </h3>
          <p className="text-mesh-700 mt-4">
            <a
              href={`tel:${siteConfig.contactPhone.replace(/\D/g, '')}`}
              className="text-navy-900 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
            >
              <Phone className="h-4 w-4" /> {siteConfig.contactPhone}
            </a>{' '}
            ·{' '}
            <a
              href="mailto:hackinforeharden@gmail.com"
              className="font-semibold text-green-600 hover:underline"
            >
              hackinforeharden@gmail.com
            </a>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary" size="md">
              <Link href="/registration#sponsorships">View all sponsorship tiers</Link>
            </Button>
            <Button asChild variant="ghost" size="md">
              <Link href="/donate">Or donate instead</Link>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  )
}

export default SponsorPage
