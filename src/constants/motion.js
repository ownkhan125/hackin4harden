/**
 * Shared motion variants and easings.
 * Tuned for a premium, cinematic feel — soft cubic out, subtle scale,
 * gentle vertical travel. No bouncy theatrics.
 */

export const EASE = {
  // Premium cubic-out — long deceleration, no overshoot.
  outSoft: [0.22, 1, 0.36, 1],
  // For paired in/out motion (e.g. accordions).
  inOut: [0.65, 0, 0.35, 1],
  // Slow expressive curve for hero-scale entrances.
  outExpo: [0.16, 1, 0.3, 1],
}

// Standard fade-up — used by FadeIn wrapper and as the default
// staggered child animation. The slight scale (0.985→1) gives a
// "settling into place" cinematic feel without ever feeling bouncy.
export const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.78, ease: EASE.outSoft },
  },
}

// Used by SectionHeader for the eyebrow / title / lead cascade.
export const fadeUpHeader = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.outSoft },
  },
}

// Title gets a slightly larger entrance so it reads as the section anchor.
export const fadeUpTitle = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: EASE.outExpo },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE.outSoft },
  },
}

// Top-edge gold rule that sweeps in from the left — the visual signal
// that a section is "constructing itself" as it enters viewport.
export const sweepRule = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.85, ease: EASE.outExpo },
  },
}

// Stagger orchestrator — accepts a per-child delay and an initial
// delayChildren so the parent's own reveal lands first.
export const stagger = (delay = 0.09, initial = 0.08) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren: initial,
    },
  },
})

// Earlier trigger threshold (was 0.35) — content begins revealing
// the moment it pokes above the fold, which feels more responsive.
export const VIEWPORT = { once: true, amount: 0.2 }
