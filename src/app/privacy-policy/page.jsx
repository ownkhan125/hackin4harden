import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import PageHero from '@/components/sections/page-hero'
import Section from '@/components/sections/section'
import Button from '@/components/ui/button'

import { LEGAL_ENTITY, siteConfig } from '@/constants/site'

export const metadata = {
  title: `Privacy Policy | ${LEGAL_ENTITY}`,
  description: `How ${LEGAL_ENTITY} collects, uses, and safeguards your information, including text messaging opt-in data.`,
}

/* Privacy Policy — drafted to satisfy the Operation 1776 A2P 10DLC SOP:
 *   • Item 3:  Dedicated /privacy-policy/ page
 *   • Item 5:  Dedicated SMS / Text Messaging section
 *   • Item 6:  Legal entity name appears throughout
 *   • SOP Step 3: Phone number collection purpose, message types, retention,
 *                 deletion process, and the explicit non-share statement.
 *
 * NOTE: Per Operation 1776 SOP legal disclaimer, this language must be
 * reviewed by qualified legal counsel before going live.
 */
const SECTIONS = [
  {
    h: 'Information we collect',
    body: (
      <>
        <p>
          {LEGAL_ENTITY} (operator of the Hackin&rsquo; for Harden Memorial Golf Tournament
          website) collects various types of information, including:
        </p>
        <ul>
          <li>
            <strong>Personal information:</strong> name, email address, phone number, company or
            organization name, and any other information you provide when contacting us, registering
            for the tournament, sponsoring, or signing up for our services.
          </li>
          <li>
            <strong>Non-personal information:</strong> IP address, browser type, referring website,
            pages viewed, and the time spent on our site.
          </li>
          <li>
            <strong>Cookies and tracking technologies:</strong> we use cookies to enhance user
            experience, analyze site traffic, and personalize content.
          </li>
        </ul>
      </>
    ),
  },
  {
    h: 'How we use your information',
    body: (
      <>
        <p>{LEGAL_ENTITY} may use the information we collect for various purposes, including:</p>
        <ul>
          <li>To process tournament registrations and sponsorship purchases.</li>
          <li>To communicate with you regarding inquiries, services, or promotions.</li>
          <li>To analyze website usage and improve our content and offerings.</li>
          <li>To comply with legal obligations and enforce our terms.</li>
        </ul>
      </>
    ),
  },
  {
    h: 'SMS / Text messaging',
    body: (
      <>
        <p>
          <strong>Why we collect phone numbers.</strong> {LEGAL_ENTITY} collects mobile phone
          numbers solely so that, with your express prior written consent, we may send you SMS
          messages related to the Hackin&rsquo; for Harden Memorial Golf Tournament. Providing a
          phone number does not by itself enroll you in our SMS program — you must additionally
          select the optional SMS opt-in checkbox on the relevant form.
        </p>
        <p>
          <strong>Types of messages we send.</strong> Depending on the consent checkbox(es) you
          select, you may receive: (a) informational and transactional messages such as
          registration confirmations, event reminders, and volunteer coordination; and/or (b)
          promotional messages such as fundraising requests, donation drives, and special
          announcements supporting the Joshua Cole Harden Scholarship Fund and The First Tee of
          Phoenix.
        </p>
        <p>
          <strong>How long we retain phone numbers and consent data.</strong> {LEGAL_ENTITY}{' '}
          retains your phone number, the timestamp of your consent, and the form/source from which
          consent was captured for as long as you remain opted in to our SMS program, plus a
          reasonable period thereafter to demonstrate compliance with applicable law (typically up
          to four years after opt-out). After that period, your phone number and related consent
          records are deleted from our active systems.
        </p>
        <p>
          <strong>How to request deletion.</strong> You may request deletion of your phone number
          and related consent data at any time by emailing{' '}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-semibold text-green-600 hover:underline"
          >
            {siteConfig.contactEmail}
          </a>{' '}
          or calling{' '}
          <a
            href={`tel:${siteConfig.contactPhone.replace(/[^0-9+]/g, '')}`}
            className="font-semibold text-green-600 hover:underline"
          >
            {siteConfig.contactPhone}
          </a>
          . We will action verified deletion requests within ten (10) business days.
        </p>
        <p>
          <strong>How to opt out.</strong> You may opt out of any SMS program from {LEGAL_ENTITY}{' '}
          at any time by replying <strong>STOP</strong> to any message we send. For assistance,
          reply <strong>HELP</strong> or contact us using the information above. Message frequency
          varies. Message and data rates may apply.
        </p>
        <p>
          <strong>We will not share or sell your text messaging opt-in data, consent, or related
          personal information with any third parties, unless required by law.</strong> SMS opt-in
          data is never used for any purpose other than delivering the messages you have agreed to
          receive from {LEGAL_ENTITY}.
        </p>
      </>
    ),
  },
  {
    h: 'How we share your information',
    body: <p>{LEGAL_ENTITY} does not sell or rent your personal information.</p>,
  },
  {
    h: 'Data security',
    body: (
      <p>
        {LEGAL_ENTITY} takes reasonable security measures to protect your information from
        unauthorized access, alteration, or disclosure. However, no data transmission over the
        internet is 100% secure.
      </p>
    ),
  },
  {
    h: 'Your choices and rights',
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information.</li>
          <li>Opt out of receiving marketing or SMS communications at any time.</li>
          <li>Disable cookies through your browser settings.</li>
        </ul>
      </>
    ),
  },
  {
    h: 'Third-party links',
    body: (
      <p>
        Our website may contain links to third-party sites. {LEGAL_ENTITY} is not responsible for
        their privacy practices and encourages you to review their privacy policies.
      </p>
    ),
  },
  {
    h: "Children's privacy",
    body: (
      <p>
        Our services are not directed to children under 13. {LEGAL_ENTITY} does not knowingly
        collect personal information from children.
      </p>
    ),
  },
  {
    h: 'Contact for privacy inquiries',
    body: (
      <p>
        For privacy-related inquiries, contact {LEGAL_ENTITY} at{' '}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="font-semibold text-green-600 hover:underline"
        >
          {siteConfig.contactEmail}
        </a>{' '}
        or call{' '}
        <a
          href={`tel:${siteConfig.contactPhone.replace(/[^0-9+]/g, '')}`}
          className="font-semibold text-green-600 hover:underline"
        >
          {siteConfig.contactPhone}
        </a>
        .
      </p>
    ),
  },
  {
    h: 'Changes to this Privacy Policy',
    body: (
      <p>
        {LEGAL_ENTITY} may update this policy from time to time. Changes will be posted on this
        page with an updated effective date.
      </p>
    ),
  },
]

const PrivacyPage = () => {
  return (
    <main>
      <PageHero
        eyebrow="Legal · Privacy Policy"
        title="How we handle your information."
        lead={`${LEGAL_ENTITY} is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information — including text messaging opt-in data — when you visit our website and use our services. By using our website, you agree to the terms outlined in this Privacy Policy.`}
      />

      <Section className="bg-cream-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="text-mesh-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                On this page
              </p>
              <ul className="border-cream-200 mt-5 space-y-3 border-l pl-5">
                {SECTIONS.map((s) => (
                  <li key={s.h}>
                    <a
                      href={`#${s.h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="text-mesh-600 text-sm transition-colors hover:text-green-600"
                    >
                      {s.h}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="border-cream-200 mt-10 rounded-2xl border bg-white p-6">
                <p className="text-gold-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                  Questions?
                </p>
                <p className="text-mesh-700 mt-3 text-sm leading-relaxed">
                  Contact {LEGAL_ENTITY} at{' '}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-semibold text-green-600 hover:underline"
                  >
                    {siteConfig.contactEmail}
                  </a>{' '}
                  or{' '}
                  <a
                    href={`tel:${siteConfig.contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="font-semibold text-green-600 hover:underline"
                  >
                    {siteConfig.contactPhone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </aside>

          <FadeIn className="lg:col-span-8">
            <article className="prose-h4h">
              {SECTIONS.map((s) => (
                <section
                  key={s.h}
                  id={s.h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="mt-10 scroll-mt-24 first:mt-0"
                >
                  <h2 className="font-display text-navy-900 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {s.h}
                  </h2>
                  <div className="text-mesh-700 [&_strong]:text-navy-900 mt-4 space-y-4 text-base leading-[1.75] [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                    {s.body}
                  </div>
                </section>
              ))}
            </article>

            <div className="border-cream-200 mt-14 border-t pt-8">
              <Button asChild variant="primary" size="md">
                <Link href="/">
                  Back to home <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>
    </main>
  )
}

export default PrivacyPage
