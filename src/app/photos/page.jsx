import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Camera, Image as ImageIcon } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import MotionCard from '@/components/motion/motion-card'
import Stagger from '@/components/motion/stagger'
import StaggerItem from '@/components/motion/stagger-item'
import PageHero from '@/components/sections/page-hero'
import Section from '@/components/sections/section'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import SectionHeader from '@/components/ui/section-header'

export const metadata = {
  title: "Photos | Hackin' for Harden",
  description:
    'Eleven years of photographs from the Hackin' +
    "'" +
    ' for Harden Memorial Golf Tournament at The Legacy Golf Club, Phoenix.',
}

// Placeholder gallery — the source /photos page contains only a heading and
// no captioned imagery. These slots are styled placeholders awaiting real
// photographs from the Harden family. Captions are intentionally generic
// (no invented years, events, or contest names) until real metadata arrives.
const GALLERY = Array.from({ length: 8 }).map((_, i) => {
  const accent = i % 2 === 0 ? 'gold' : 'green'
  const aspects = [
    'aspect-[4/5]',
    'aspect-[16/10]',
    'aspect-[16/10]',
    'aspect-[4/3]',
    'aspect-[4/3]',
    'aspect-[4/3]',
    'aspect-[16/9]',
    'aspect-[16/9]',
  ]
  const spans = [
    'lg:col-span-4 lg:row-span-2',
    'lg:col-span-4',
    'lg:col-span-4',
    'lg:col-span-4',
    'lg:col-span-4',
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-6',
  ]
  return {
    label: `Photo ${i + 1}`,
    caption: 'Photograph coming soon',
    accent,
    span: spans[i],
    aspect: aspects[i],
  }
})

const PhotosPage = () => {
  return (
    <main>
      <PageHero
        eyebrow="Photos"
        title={
          <>
            Photos from <span className="text-gold-400">Hackin&apos;</span> for Harden.
          </>
        }
        lead="Tournament photographs from The Legacy Golf Club, Phoenix."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild variant="gold" size="lg">
            <Link href="/registration">
              Register / Sponsor <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghostLight" size="lg">
            <Link href="/about">About</Link>
          </Button>
        </div>
      </PageHero>

      {/* Gallery grid */}
      <Section className="bg-cream-50">
        <SectionHeader
          eyebrow="Gallery"
          title={
            <>
              <span className="text-green-500">Photographs</span> from the tournament.
            </>
          }
          lead="Photos to be posted here. Have a photograph from a past Hackin' for Harden? Email the Harden family at hackinforeharden@gmail.com."
        />

        <Stagger
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-12"
          delay={0.07}
        >
          {GALLERY.map((g, i) => (
            <StaggerItem key={i} className={g.span ?? 'lg:col-span-4'}>
              <MotionCard
                glow={g.accent === 'gold' ? 'gold' : 'green'}
                className={`border-navy-700 bg-navy-900 relative h-full w-full overflow-hidden rounded-2xl border ${g.aspect}`}
              >
                {/* Placeholder visual */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(155deg, rgba(20,32,52,0.85) 0%, rgba(11,18,32,0.95) 60%, rgba(11,18,32,1) 100%)',
                  }}
                  aria-hidden
                />
                <div className="bg-mesh-grid bg-grid-32 absolute inset-0 opacity-30" aria-hidden />

                {/* Soft accent halo */}
                <div
                  className="pointer-events-none absolute inset-x-0 -top-12 mx-auto h-[200px] w-[200px] rounded-full"
                  style={{
                    background:
                      g.accent === 'gold'
                        ? 'radial-gradient(circle, rgba(194,138,32,0.28) 0%, rgba(194,138,32,0) 65%)'
                        : 'radial-gradient(circle, rgba(46,125,63,0.28) 0%, rgba(46,125,63,0) 65%)',
                  }}
                  aria-hidden
                />

                {/* Centered logo emblem */}
                <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                    <Image src="/logo.webp" alt="" fill className="object-contain opacity-60" />
                  </div>
                  <Camera className="text-cream-100/40 mt-3 h-4 w-4" strokeWidth={1.5} />
                </div>

                {/* Top-right badge — neutral placeholder marker */}
                <div className="absolute top-4 right-4">
                  <Badge variant={g.accent === 'gold' ? 'gold' : 'green'}>{g.label}</Badge>
                </div>

                {/* Bottom caption — neutral until real photo metadata arrives */}
                <div className="border-cream-50/10 bg-navy-950/85 absolute inset-x-0 bottom-0 border-t px-5 py-4 backdrop-blur">
                  <h3 className="font-display text-cream-50 text-base font-semibold tracking-tight">
                    Hackin&apos; for Harden
                  </h3>
                  <p className="text-cream-100/55 mt-0.5 font-mono text-[10px] tracking-[0.22em] uppercase">
                    {g.caption}
                  </p>
                </div>

                {/* Top accent rule */}
                <div
                  className={`pointer-events-none absolute inset-x-6 top-0 h-[2px] ${
                    g.accent === 'gold'
                      ? 'via-gold-400/80 bg-gradient-to-r from-transparent to-transparent'
                      : 'bg-gradient-to-r from-transparent via-green-400/80 to-transparent'
                  }`}
                  aria-hidden
                />
              </MotionCard>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Submit-a-photo CTA */}
        <FadeIn className="mt-16">
          <div className="border-cream-200 rounded-2xl border bg-white p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-5">
              <div className="border-cream-200 bg-cream-50 flex h-12 w-12 flex-none items-center justify-center rounded-lg border text-green-500">
                <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-navy-900 text-xl font-semibold tracking-tight">
                  Share a photo from a past Hackin&apos; for Harden
                </h3>
                <p className="text-mesh-700 mt-2 max-w-xl">
                  Email it to{' '}
                  <a
                    href="mailto:hackinforeharden@gmail.com"
                    className="font-semibold text-green-600 hover:underline"
                  >
                    hackinforeharden@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">
                  Get in touch <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </main>
  )
}

export default PhotosPage
