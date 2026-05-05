'use client'

import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'motion/react'
import { ArrowRight, CalendarRange, Heart, MapPin } from 'lucide-react'

import Button from '@/components/ui/button'
import Container from '@/components/ui/container'

import { EASE } from '@/constants/motion'

const Hero = () => {
  return (
    <section className="bg-navy-900 relative overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      {/* Mesh-grid pattern (per designguide §04 hero halo) */}
      <div
        className="bg-mesh-grid bg-grid-32 pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-48 -right-40 h-[720px] w-[720px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(194,138,32,0.16) 0%, rgba(194,138,32,0) 60%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-40 h-[640px] w-[640px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(46,125,63,0.18) 0%, rgba(46,125,63,0) 60%)',
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="pb-section grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Left — campaign copy */}
          <div className="lg:col-span-7">
            {/* Eyebrow — campaign-style date stamp */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE.outSoft }}
              className="border-gold-400 inline-flex items-center gap-3 border-l-2 pl-4"
            >
              <span className="text-gold-400 font-mono text-[11px] font-semibold tracking-[0.28em] uppercase">
                11th Annual
              </span>
              <span className="bg-cream-100/40 h-1 w-1 rounded-full" aria-hidden />
              <span className="text-cream-100/70 font-mono text-[11px] font-semibold tracking-[0.28em] uppercase">
                Saturday · June 6, 2026 · Phoenix, AZ
              </span>
            </motion.div>

            {/* Title — verbatim source: "2026 Hackin' For Harden" */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: EASE.outSoft }}
              className="font-display text-cream-50 mt-8 text-[44px] leading-[1.04] font-semibold tracking-[-0.025em] sm:text-[60px] lg:text-[72px]"
            >
              2026 Hackin&apos;
              <br />
              <span className="text-gold-400">for</span> Harden.
            </motion.h1>

            {/* Source: home.txt — welcome paragraph (verbatim) */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: EASE.outSoft }}
              className="text-cream-100/80 mt-7 max-w-2xl text-lg leading-[1.7] sm:text-xl"
            >
              Welcome to the 11th Annual Hackin&apos; for Harden memorial golf tournament in honor
              of Joshua Cole Harden. In partnership with The Legacy Golf Course and The First Tee of
              Phoenix, registration for this year&apos;s tournament is now OPEN.
            </motion.p>

            {/* Source: home.txt — partners explicitly named */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: EASE.outSoft }}
              className="text-cream-100/65 mt-6 flex items-start gap-3 text-sm"
            >
              <Heart className="text-gold-400 mt-0.5 h-4 w-4 flex-none" strokeWidth={1.75} />
              <span>
                In partnership with{' '}
                <span className="text-cream-50 font-semibold">The Legacy Golf Course</span> and{' '}
                <span className="text-cream-50 font-semibold">The First Tee of Phoenix</span>.
              </span>
            </motion.p>

            {/* CTAs map directly to source actions: Registration + Sponsors */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.46, ease: EASE.outSoft }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="gold" size="lg">
                <Link href="/registration">
                  Register / Sponsor <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>

            {/* Quiet bottom meta — date / venue, no stat widgets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.62, ease: EASE.outSoft }}
              className="border-cream-50/10 text-cream-100/55 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6 text-xs"
            >
              <div className="flex items-center gap-2">
                <CalendarRange className="text-gold-400 h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono tracking-[0.2em] uppercase">7:30 AM Shotgun Start</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-green-300" strokeWidth={1.75} />
                <span className="font-mono tracking-[0.2em] uppercase">The Legacy Golf Club</span>
              </div>
            </motion.div>
          </div>

          {/* Right — large image-frame placeholder (campaign visual anchor) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.18, ease: EASE.outSoft }}
            className="lg:col-span-5"
          >
            <figure className="relative">
              {/* Main image frame — 4/5 aspect, polished */}
              <div className="border-cream-50/15 bg-navy-800 relative aspect-[4/5] overflow-hidden rounded-2xl border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
                {/* Layered backdrop: gradient + mesh */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(20,32,52,0.85) 0%, rgba(11,18,32,0.95) 60%, rgba(11,18,32,1) 100%)',
                  }}
                  aria-hidden
                />
                <div className="bg-mesh-grid bg-grid-32 absolute inset-0 opacity-30" aria-hidden />

                {/* Soft gold halo */}
                <div
                  className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-[280px] w-[280px] rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(194,138,32,0.32) 0%, rgba(194,138,32,0) 65%)',
                  }}
                  aria-hidden
                />

                {/* Centered emblem — placeholder image */}
                <div className="relative flex h-full w-full flex-col items-center justify-center px-8 text-center">
                  <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                    <Image
                      src="/logo.webp"
                      alt="Hackin' for Harden Memorial Golf Tournament"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>

                  <p className="text-gold-400 mt-8 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase">
                    In Honor Of
                  </p>
                  <h2 className="font-display text-cream-50 mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Joshua Cole Harden
                  </h2>
                  <p className="text-cream-100/55 mt-2 font-mono text-[11px] tracking-[0.24em] uppercase">
                    Age 32 · Lost in 2015
                  </p>

                  <div className="bg-gold-400/60 mt-8 h-px w-16" aria-hidden />

                  <p className="text-cream-100/70 mt-6 max-w-[28ch] text-[13px] leading-relaxed">
                    Benefiting the Joshua Cole Harden Scholarship Fund and The First Tee of Phoenix.
                  </p>
                </div>

                {/* Top accent rule */}
                <div
                  className="pointer-events-none absolute inset-x-6 top-0 h-[2px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(194,138,32,0) 0%, rgba(194,138,32,0.9) 50%, rgba(194,138,32,0) 100%)',
                  }}
                  aria-hidden
                />

                {/* Corner badge — verbatim source phrase */}
                <div className="border-cream-50/15 bg-navy-950/70 absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300" aria-hidden />
                  <span className="text-cream-50 font-mono text-[10px] font-semibold tracking-[0.22em] uppercase">
                    Registration Open
                  </span>
                </div>
              </div>

              {/* Caption tag below the frame */}
              <figcaption className="border-gold-400/70 mt-5 flex items-center justify-between border-l-2 pl-4">
                <span className="text-cream-100/65 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                  Benefiting · The First Tee of Phoenix
                </span>
                <span className="text-gold-400 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                  Since 2015
                </span>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </Container>

      {/* Bottom hairline — designguide trace-line */}
      <div className="via-gold-400/60 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent" />
    </section>
  )
}

export default Hero
