import Image from 'next/image'
import Link from 'next/link'

import { Mail, MapPin, Phone } from 'lucide-react'

import Container from '@/components/ui/container'

import { LEGAL_ENTITY, NAV_LINKS, siteConfig } from '@/constants/site'

/**
 * Site footer — satisfies Operation 1776 A2P 10DLC SOP requirements:
 *   • Item 2: Terms of Service link on every page
 *   • Item 4: Privacy Policy link on every page
 *   • Item 16: Legal entity name in copyright notice
 *   • Item 18: Detailed contact info (phone, email, address) on every page
 */
const SiteFooter = () => {
  const year = new Date().getFullYear()
  const { contactEmail, contactPhone, event, legalRoutes } = siteConfig

  return (
    <footer className="border-cream-200/70 bg-navy-900 text-cream-100 border-t">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3" aria-label={siteConfig.name}>
            <Image
              src="/logo.webp"
              alt={`${siteConfig.name} logo`}
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <span className="font-display text-cream-50 text-lg font-bold">Hackin' 4 Harden</span>
          </Link>
          <p className="text-cream-100/70 mt-6 max-w-md text-sm leading-relaxed">
            {siteConfig.description}
          </p>
          <p className="text-cream-100/55 mt-4 text-xs">
            A program of <span className="text-cream-100/80 font-semibold">{LEGAL_ENTITY}</span>.
          </p>
        </div>

        <div>
          <p className="text-gold-400 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
            Site
          </p>
          <ul className="text-cream-100/80 mt-5 space-y-3 text-sm">
            {NAV_LINKS?.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-300 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column — phone, email, address per SOP item 18 */}
        <div>
          <p className="text-gold-400 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
            Contact
          </p>
          <ul className="text-cream-100/80 mt-5 space-y-3 text-sm">
            <li>
              <a
                href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                className="hover:text-gold-300 inline-flex items-start gap-2 transition-colors"
              >
                <Phone className="text-gold-400 mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
                {contactPhone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-gold-300 inline-flex items-start gap-2 transition-colors"
              >
                <Mail className="text-gold-400 mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
                {contactEmail}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="text-gold-400 mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
              <span>
                {event.venue}
                <br />
                {event.address}
              </span>
            </li>
          </ul>

          <div className="mt-6 flex gap-4 text-sm">
            <a
              href={siteConfig.social?.instagram}
              className="text-cream-100/70 hover:text-gold-300 transition-colors"
            >
              Instagram
            </a>
            <a
              href={siteConfig.social?.facebook}
              className="text-cream-100/70 hover:text-gold-300 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </Container>

      <div className="border-cream-50/10 border-t">
        <Container className="text-cream-100/55 flex flex-col items-start justify-between gap-3 py-6 text-xs sm:flex-row sm:items-center">
          <p>
            © {year} {LEGAL_ENTITY}. All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <a
              href="https://op1776.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-100/85 hover:text-gold-300 font-semibold transition-colors"
            >
              Operation 1776
            </a>
          </p>
          <div className="flex gap-5">
            <Link href={legalRoutes.privacy} className="hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href={legalRoutes.terms} className="hover:text-gold-300">
              Terms of Service
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default SiteFooter
