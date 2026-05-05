import Link from 'next/link'

import { ArrowRight, Compass, MapPin, Phone } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import MotionCard from '@/components/motion/motion-card'
import Section from '@/components/sections/section'
import Button from '@/components/ui/button'
import SectionHeader from '@/components/ui/section-header'

const Location = () => {
  return (
    <Section id="location" className="bg-cream-50">
      <SectionHeader
        eyebrow="Location · Address Detail"
        title={
          <>
            <span className="text-green-500">The Legacy</span> Golf Club, Phoenix.
          </>
        }
        lead="The Legacy Golf Club in Phoenix has hosted this event all eleven years. Legacy is where Josh worked and it represented his Golfing Family in Arizona."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Address card */}
        <FadeIn className="lg:col-span-5">
          <MotionCard
            glow="green"
            className="border-cream-200 h-full overflow-hidden rounded-2xl border bg-white p-8"
          >
            <div className="bg-gold-400 absolute inset-x-8 top-0 h-[3px]" aria-hidden />

            <p className="text-gold-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
              Tournament venue
            </p>
            <h3 className="font-display text-navy-900 mt-2 text-2xl font-semibold tracking-tight">
              The Legacy Golf Club
            </h3>

            <div className="border-cream-200 mt-7 space-y-5 border-t pt-6">
              <div className="text-mesh-700 flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-green-500" strokeWidth={1.75} />
                <span>
                  6808 S 32nd St
                  <br />
                  Phoenix, AZ 85042-6004
                </span>
              </div>
              <div className="text-mesh-700 flex items-start gap-3 text-sm">
                <Compass className="mt-0.5 h-4 w-4 flex-none text-green-500" strokeWidth={1.75} />
                <span>Course: Legacy</span>
              </div>
              <div className="text-mesh-700 flex items-start gap-3 text-sm">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-green-500" strokeWidth={1.75} />
                <a
                  href="tel:6023055550"
                  className="text-navy-900 font-semibold hover:text-green-600"
                >
                  602-305-5550
                </a>
              </div>
            </div>

            <div className="border-cream-200 mt-8 border-t pt-6">
              <Button asChild variant="primary" size="md">
                <Link
                  href="https://www.google.com/maps/search/?api=1&query=The+Legacy+Golf+Club+Phoenix+AZ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </MotionCard>
        </FadeIn>

        {/* Map placeholder — styled card matching the homepage aesthetic */}
        <FadeIn className="lg:col-span-7" delay={0.12}>
          <div className="border-navy-700 bg-navy-900 relative h-full min-h-[360px] overflow-hidden rounded-2xl border">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(150deg, rgba(20,32,52,0.75) 0%, rgba(11,18,32,0.95) 60%)',
              }}
              aria-hidden
            />
            <div className="bg-mesh-grid bg-grid-32 absolute inset-0 opacity-40" aria-hidden />

            {/* Map pin emblem */}
            <div className="relative flex h-full w-full flex-col items-center justify-center p-10 text-center">
              <div className="border-gold-400/40 bg-navy-800 flex h-16 w-16 items-center justify-center rounded-full border">
                <MapPin className="text-gold-400 h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="text-gold-400 mt-6 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase">
                Phoenix, Arizona
              </p>
              <h4 className="font-display text-cream-50 mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                6808 S 32nd St · 85042
              </h4>
              <p className="text-cream-100/65 mt-3 max-w-[34ch] text-sm leading-relaxed">
                Course: Legacy. Hosted by The Legacy Golf Course every year of the tournament.
              </p>
            </div>

            <div
              className="via-gold-400/80 pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent"
              aria-hidden
            />
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}

export default Location
