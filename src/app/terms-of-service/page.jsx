import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import FadeIn from '@/components/motion/fade-in'
import PageHero from '@/components/sections/page-hero'
import Section from '@/components/sections/section'
import Button from '@/components/ui/button'

import { LEGAL_ENTITY, siteConfig } from '@/constants/site'

export const metadata = {
  title: `Terms of Service | ${LEGAL_ENTITY}`,
  description: `The legally binding terms for purchases and SMS messaging from ${LEGAL_ENTITY}.`,
}

/* Terms of Service — sections 1–23 are the source text from
 * hackin4harden.com, condensed for readability. Section 0 (SMS
 * Program Terms) is added per the Operation 1776 A2P 10DLC SOP and
 * includes the six required A2P / TCR elements:
 *   1. Program name and message-type description (SOP step 2.1)
 *   2. STOP keyword opt-out instructions (SOP item 12)
 *   3. HELP keyword instructions (SOP item 13)
 *   4. Carrier liability disclaimer (SOP item 17)
 *   5. Data rates + frequency disclosure (SOP items 14, 15)
 *   6. Privacy Policy link (SOP step 2.6)
 *
 * NOTE: Per Operation 1776 SOP legal disclaimer, this language must be
 * reviewed by qualified legal counsel before going live.
 */
const SECTIONS = [
  {
    h: '0. SMS Program Terms',
    body: (
      <>
        <p>
          <strong>Program name &amp; message types.</strong> The {LEGAL_ENTITY} SMS program
          (also referred to as &ldquo;Hackin&rsquo; for Harden Updates&rdquo;) sends opt-in
          subscribers two categories of messages, each governed by a separate consent checkbox:
          (a) informational and transactional messages — registration confirmations, event
          reminders, and volunteer coordination for the Hackin&rsquo; for Harden Memorial Golf
          Tournament; and (b) promotional messages — fundraising requests, donation drives, and
          special announcements supporting the Joshua Cole Harden Scholarship Fund and The First
          Tee of Phoenix.
        </p>
        <p>
          <strong>Opt-out (STOP).</strong> You can cancel the SMS service at any time. Simply
          reply <strong>STOP</strong> to any message you receive from {LEGAL_ENTITY}. After you
          send <strong>STOP</strong>, we will send you one final confirmation message and you
          will not receive any additional messages from us unless you opt back in.
        </p>
        <p>
          <strong>Help (HELP).</strong> If you experience issues with the messaging program,
          reply with the keyword <strong>HELP</strong> for more assistance, or reach out
          directly to{' '}
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
        <p>
          <strong>Message frequency &amp; data rates.</strong> As always, message and data rates
          may apply for messages sent to you from us and to us from you. Message frequency
          varies based on tournament timing and your subscription preferences (typically 1–4
          messages per week).
        </p>
        <p>
          <strong>Carrier liability.</strong> Carriers are not liable for delayed or
          undelivered messages.
        </p>
        <p>
          <strong>Privacy.</strong> For privacy-related inquiries, including how SMS opt-in data
          is collected, used, retained, and deleted, please refer to our{' '}
          <Link
            href={siteConfig.legalRoutes.privacy}
            className="font-semibold text-green-600 hover:underline"
          >
            Privacy Policy
          </Link>
          . {LEGAL_ENTITY} will not share or sell your text messaging opt-in data, consent, or
          related personal information with any third parties, unless required by law.
        </p>
      </>
    ),
  },
  {
    h: '1. The Services',
    body: (
      <p>
        Your purchase from {LEGAL_ENTITY} may include different components, including event
        registrations, sponsorships, donations, and/or other products and services, as indicated
        on your order form. You agree not to share login information, call-in numbers, passwords,
        and protected links with anyone.
      </p>
    ),
  },
  {
    h: '2. Payment',
    body: (
      <p>
        Actual payment terms may vary, and will be indicated on your order form. You agree to pay
        the purchase price and not to cancel this transaction with your bank or credit card company.
        Josh C Harden Memorial Golf is not responsible for any overdraft, over-limit, or NSF fees.
        Fees may be pre-paid; missed payments may result in suspension or termination of services.
        Interest on unpaid amounts shall accrue at the lesser of 2.0% per month or the maximum
        amount permitted by applicable law.
      </p>
    ),
  },
  {
    h: '3. Refund Policy',
    body: (
      <p className="text-navy-900 font-semibold">All payments are final. No refunds are given.</p>
    ),
  },
  {
    h: '4. Term',
    body: (
      <p>
        This Agreement remains in force until the end of the term indicated on your order form.
        Failure to pay required fees may result in early termination and discontinuance of access.
        Continued use after termination may extend the term and incur additional fees.
      </p>
    ),
  },
  {
    h: '5. Disclaimer of All Warranties',
    body: (
      <p>
        EXCEPT AS SPECIFICALLY PROVIDED, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT ANY
        WARRANTY WHATSOEVER. WE DISCLAIM ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
        ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT OF THIRD-PARTY RIGHTS.
      </p>
    ),
  },
  {
    h: '6. Audio / Video Release',
    body: (
      <p>
        I authorize Josh C Harden Memorial Golf to use my story as a testimonial and further agree
        to allow the use of my voice, photo, and likeness captured in any programs via photograph,
        audio, or video, to be used for future products and/or marketing without compensation. All
        recordings remain the exclusive property of Josh C Harden Memorial Golf.
      </p>
    ),
  },
  {
    h: '7. Modification',
    body: (
      <p>
        We may modify this Agreement from time to time. Modifications are effective upon posting on
        the website. You agree to be bound to any changes when you use the Services after posting.
        Please review this Agreement regularly.
      </p>
    ),
  },
  {
    h: '8. Assignment',
    body: (
      <p>
        You may not assign this Agreement, in whole or in part, without our prior written consent.
        Any attempt to do so shall be void. Our rights and obligations may be assigned or
        transferred at our discretion.
      </p>
    ),
  },
  {
    h: '9. Third-Party Beneficiaries',
    body: (
      <p>
        This Agreement is solely for the benefit of the parties and their successors and permitted
        assigns, and does not confer any rights or remedies on any other person or entity.
      </p>
    ),
  },
  {
    h: '10. Governing Law',
    body: (
      <p>
        This Agreement shall be interpreted according to the laws of the State of Arizona, without
        regard to choice-of-law rules.
      </p>
    ),
  },
  {
    h: '11. Waiver',
    body: (
      <p>
        No failure of either party to exercise or enforce any rights under this Agreement shall act
        as a waiver of subsequent breaches.
      </p>
    ),
  },
  {
    h: '12. Severability',
    body: (
      <p>
        In the event any provision is held unenforceable, that provision will be enforced to the
        maximum extent permissible, and the remaining provisions will remain in full force and
        effect.
      </p>
    ),
  },
  {
    h: '13. Force Majeure',
    body: (
      <p>
        If either party is prevented from performing due to causes beyond reasonable control —
        including acts of God, fire, flood, war, government regulation, or vandalism — the time for
        performance will be extended for the period of the delay. Payment obligations are not
        excused.
      </p>
    ),
  },
  {
    h: '14. Remedies',
    body: (
      <p>
        The rights and remedies set forth in this Agreement are not exclusive and are in addition to
        any other rights and remedies available at law or in equity.
      </p>
    ),
  },
  {
    h: '15. Binding Effect',
    body: (
      <p>
        This Agreement shall be binding upon and shall inure to the benefit of the respective
        parties, their successors-in-interest, legal representatives, heirs, and assigns.
      </p>
    ),
  },
  {
    h: '16. Damage Waiver',
    body: (
      <p>
        IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY LOST PROFITS OR OTHER CONSEQUENTIAL,
        INCIDENTAL, INDIRECT, SPECIAL, OR EXEMPLARY DAMAGES. TOTAL LIABILITY SHALL NOT EXCEED ONE
        THOUSAND DOLLARS ($1,000.00).
      </p>
    ),
  },
  {
    h: '17. Intellectual Property',
    body: (
      <p>
        All trademarks, service marks, trade names, patents, computer programs, databases, marketing
        materials, presentation content, trade secrets, copyrights, and domain names owned by Josh C
        Harden Memorial Golf are the exclusive property of Josh C Harden Memorial Golf. No license
        is granted by implication, estoppel, or otherwise.
      </p>
    ),
  },
  {
    h: '18. Opt-In & SMS Messaging',
    body: (
      <>
        <p>
          Providing your information gives Josh C Harden Memorial Golf permission to communicate
          with you by email, voice memo platforms, Facebook, or phone for special offers,
          announcements, and information. We offer an SMS messaging program for customers who
          voluntarily opt in. You provide consent by selecting the optional, unchecked SMS consent
          checkbox on the contact or appointment forms.
        </p>
        <p>
          The SMS program includes appointment confirmations, reminders, responses to inquiries,
          customer support communications, and promotional messages for users who separately agree
          to receive marketing texts. Message frequency typically ranges 1–4 per week. Message and
          data rates may apply.
        </p>
        <p>
          You may opt out at any time by replying <strong>STOP</strong>. For assistance, reply{' '}
          <strong>HELP</strong> or contact{' '}
          <a
            href="mailto:hackinforeharden@gmail.com"
            className="font-semibold text-green-600 hover:underline"
          >
            hackinforeharden@gmail.com
          </a>{' '}
          or call (480) 414-8891. Consent to receive SMS messages is not a condition of purchase. We
          do not sell or share mobile information with third parties for marketing purposes.
        </p>
      </>
    ),
  },
  {
    h: '19. Mediation',
    body: (
      <p>
        All disputes arising under or in connection with this Agreement will initially be referred
        to the senior executives of each party for informal resolution. If unresolved after 30 days,
        the dispute will be submitted to binding arbitration in Arizona pursuant to the Commercial
        Arbitration Rules of the American Arbitration Association.
      </p>
    ),
  },
  {
    h: '20. Governing Law / Arbitration',
    body: (
      <>
        <p>
          This Agreement is governed by Arizona law. Any action, proceeding, arbitration, or
          mediation must be brought in the federal judicial district that includes Arizona.
        </p>
        <p>
          <strong>
            ANY DISPUTE MAY BE RESOLVED BY BINDING ARBITRATION. ARBITRATION REPLACES THE RIGHT TO GO
            TO COURT, INCLUDING THE RIGHT TO A JURY AND THE RIGHT TO PARTICIPATE IN A CLASS ACTION.
          </strong>
        </p>
      </>
    ),
  },
  {
    h: '21. Indemnity',
    body: (
      <p>
        You agree to indemnify and hold Josh C Harden Memorial Golf, its subsidiaries, affiliates,
        officers, agents, attorneys, and employees harmless from any loss, liability, claim, or
        demand — including reasonable attorneys&apos; fees — arising out of this Agreement, your use
        of the Services, or any breach of these terms.
      </p>
    ),
  },
  {
    h: '22. Voidability',
    body: (
      <p>
        Your failure to use the Services after purchase does not void any part of this Agreement.
      </p>
    ),
  },
  {
    h: '23. Entire Agreement',
    body: (
      <p>
        This Agreement represents the entire understanding relating to the Services and prevails
        over any prior or contemporaneous, conflicting, or additional communications. For a copy or
        to ask any questions, email{' '}
        <a
          href="mailto:hackinforeharden@gmail.com"
          className="font-semibold text-green-600 hover:underline"
        >
          hackinforeharden@gmail.com
        </a>
        .
      </p>
    ),
  },
]

const TermsPage = () => {
  return (
    <main>
      <PageHero
        eyebrow="Legal · Terms of Service"
        title="Terms of Service."
        lead={
          <>
            These terms set forth the legally binding terms governing your use of the{' '}
            {LEGAL_ENTITY} website, your purchase of products and services, and your enrollment in
            the {LEGAL_ENTITY} SMS messaging program. Please read carefully.
          </>
        }
      />

      <Section className="bg-cream-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="text-mesh-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
                Sections
              </p>
              <ul className="border-cream-200 mt-5 max-h-[60vh] space-y-2 overflow-y-auto border-l pl-5 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.h}>
                    <a
                      href={`#${s.h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="text-mesh-600 transition-colors hover:text-green-600"
                    >
                      {s.h}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <FadeIn className="lg:col-span-8">
            <article>
              {SECTIONS.map((s) => (
                <section
                  key={s.h}
                  id={s.h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="mt-10 scroll-mt-24 first:mt-0"
                >
                  <h2 className="font-display text-navy-900 text-xl font-semibold tracking-tight sm:text-2xl">
                    {s.h}
                  </h2>
                  <div className="text-mesh-700 [&_strong]:text-navy-900 mt-3 space-y-3 text-base leading-[1.75] [&_strong]:font-semibold">
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

export default TermsPage
