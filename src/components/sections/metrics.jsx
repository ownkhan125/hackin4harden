'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

import CountUp from '@/components/motion/count-up'
import MotionCard from '@/components/motion/motion-card'
import Section from '@/components/sections/section'
import SectionHeader from '@/components/ui/section-header'

import { EASE } from '@/constants/motion'
import { METRICS } from '@/constants/homepage'

const Metrics = () => {
  // Single source of truth for "are we in view" — drives both card reveal + counter.
  const gridRef = useRef(null)
  const inView = useInView(gridRef, { once: true, amount: 0.35 })

  return (
    <Section className="bg-cream-100">
      <SectionHeader
        eyebrow="Event details"
        title={
          <>
            11th Annual · <span className="text-green-500">Since 2015.</span>
          </>
        }
        lead="The 2026 Hackin' for Harden — Saturday, June 6th, 7:30 AM shotgun. Four-person scramble at $150 per player. Sponsorship tiers up to $10,000."
      />

      <div ref={gridRef} className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {METRICS?.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.12,
              ease: EASE.outSoft,
            }}
          >
            <MotionCard
              glow="green"
              className="border-cream-200 bg-cream-50 overflow-hidden rounded-xl border p-7"
            >
              <div className="absolute inset-x-7 top-0 h-[3px] bg-green-500" aria-hidden />

              <div className="flex items-baseline gap-1">
                <CountUp
                  value={m.value}
                  duration={1.8}
                  delay={idx * 0.12 + 0.15}
                  className="font-display text-5xl font-bold tracking-[-0.03em] text-green-600 sm:text-6xl"
                />
                <span className="font-display text-gold-500 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {m.suffix}
                </span>
              </div>

              <p className="font-display text-navy-900 mt-4 text-base font-semibold tracking-tight">
                {m.label}
              </p>
              <p className="text-mesh-500 mt-1.5 font-mono text-[11px] tracking-[0.20em] uppercase">
                {m.context}
              </p>
            </MotionCard>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

export default Metrics
