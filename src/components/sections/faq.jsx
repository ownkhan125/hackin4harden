'use client'

import Link from 'next/link'

import { useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import PropTypes from 'prop-types'

import Section from '@/components/sections/section'
import Stagger from '@/components/motion/stagger'
import StaggerItem from '@/components/motion/stagger-item'
import SectionHeader from '@/components/ui/section-header'

import { cn } from '@/lib/utils'
import { EASE } from '@/constants/motion'
import { FAQS } from '@/constants/homepage'

const FaqRow = ({ q, a, isOpen, isLast, onToggle }) => {
  return (
    <div
      className={cn(
        'group border-cream-200 relative border-t transition-colors duration-300',
        isLast && 'border-b',
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-8 py-7 text-left transition-colors duration-300 sm:py-8 lg:py-9"
      >
        <span
          className={cn(
            'font-display text-lg leading-snug font-semibold tracking-tight transition-colors duration-300 sm:text-xl',
            isOpen ? 'text-green-600' : 'text-navy-900 group-hover:text-green-600',
          )}
        >
          {q}
        </span>

        <span
          aria-hidden
          className={cn(
            'mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border',
            'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-10 sm:w-10',
            isOpen
              ? 'text-cream-50 rotate-45 border-green-500 bg-green-500 shadow-[0_8px_22px_-10px_rgba(46,125,63,0.55)]'
              : 'border-cream-300 bg-cream-50 text-mesh-700 group-hover:border-green-500 group-hover:text-green-600',
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE.outSoft }}
            className="overflow-hidden"
          >
            <p className="text-mesh-600 max-w-[58ch] pr-4 pb-9 text-base leading-[1.75] sm:pr-12 sm:text-[17px]">
              {a}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

FaqRow.propTypes = {
  q: PropTypes.string.isRequired,
  a: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(-1)

  return (
    <Section id="faq" className="bg-cream-50">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Header column — sticky on desktop, standalone on mobile */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              eyebrow="Tournament FAQ"
              title={
                <>
                  Event details, sponsorship, <span className="text-green-500">contact</span>.
                </>
              }
              lead="Date, venue, agenda, sponsorship tiers, and direct contact information for Andy Harden."
            />

            <div className="border-cream-200 mt-10 hidden border-t pt-8 lg:block">
              <p className="text-mesh-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                Still need a hand?
              </p>
              <Link
                href="/contact"
                className="font-display text-navy-900 mt-3 inline-flex items-center gap-2 text-base font-semibold tracking-tight transition-colors duration-200 hover:text-green-600"
              >
                Reach Andy Harden directly
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accordion column */}
        <div className="lg:col-span-7">
          <Stagger className="" delay={0.07} delayChildren={0.22} role="list">
            {FAQS?.map((item, idx) => (
              <StaggerItem key={item.q}>
                <FaqRow
                  q={item.q}
                  a={item.a}
                  isOpen={openIdx === idx}
                  isLast={idx === FAQS.length - 1}
                  onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                />
              </StaggerItem>
            ))}
          </Stagger>

          {/* Mobile-only sub-CTA — keeps the page feeling complete on small screens */}
          <div className="mt-8 flex items-center gap-3 lg:hidden">
            <Link
              href="/contact"
              className="font-display text-navy-900 inline-flex items-center gap-2 text-base font-semibold tracking-tight transition-colors duration-200 hover:text-green-600"
            >
              Still need a hand? Reach Andy Harden <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Faq
