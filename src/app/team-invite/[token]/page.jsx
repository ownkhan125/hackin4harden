import Link from 'next/link'

import { AlertCircle, Users } from 'lucide-react'

import PageHero from '@/components/sections/page-hero'
import Section from '@/components/sections/section'
import Button from '@/components/ui/button'

import TeamInviteForm from './team-invite-form'

import { verifyTeamInvite } from '@/lib/team-invite-token'

export const metadata = {
  title: 'Join Your Foursome · Hackin’ for Harden 2026',
  description:
    'You were invited to join a Hackin’ for Harden 2026 foursome. Fill in your details below.',
}

/* Server component: verifies the JWT-style token from the URL.
 *
 * - Valid: render the teammate form with the captain's name + team
 * - Expired / tampered / malformed: render an error landing
 *
 * The verification step runs server-side so the form never mounts with
 * an invalid token in the URL. */
const TeamInvitePage = async ({ params }) => {
  const { token } = await params
  let payload = null
  let error = null
  try {
    payload = verifyTeamInvite(decodeURIComponent(token))
  } catch (err) {
    error = err.message ?? 'Invalid invite token'
  }

  if (error) {
    return (
      <main>
        <PageHero
          eyebrow="Team Invite"
          title={
            <>
              This invite <span className="text-gold-400">isn&apos;t valid</span>.
            </>
          }
          lead="Your invite link may have expired, been edited, or copied incorrectly. Ask your team captain to re-send the original link from their confirmation email."
        />
        <Section className="bg-cream-50">
          <div className="border-cream-200 mx-auto max-w-2xl rounded-2xl border bg-white p-8 sm:p-10">
            <div className="border-gold-300/60 bg-gold-50/60 flex items-start gap-4 rounded-xl border p-4">
              <AlertCircle className="text-gold-600 mt-0.5 h-5 w-5 flex-none" />
              <div>
                <p className="text-navy-900 font-semibold">Invite verification failed</p>
                <p className="text-mesh-600 mt-1 text-sm">{error}</p>
              </div>
            </div>
            <p className="text-mesh-700 mt-6 text-sm leading-relaxed">
              No worries — if you&apos;re still on the team, your captain can resend the link.
              You can also reach Andy Harden at{' '}
              <a
                href="mailto:hackinforeharden@gmail.com"
                className="font-semibold text-green-600 hover:underline"
              >
                hackinforeharden@gmail.com
              </a>
              .
            </p>
            <div className="mt-6">
              <Button asChild variant="ghost" size="md">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
    )
  }

  return (
    <main>
      <PageHero
        eyebrow={`Player ${payload.slot} · Foursome Invite`}
        title={
          <>
            You&apos;re playing in{' '}
            <span className="text-gold-400">
              {payload.team || `${payload.captain}'s foursome`}
            </span>
            .
          </>
        }
        lead={`${payload.captain} registered a foursome for the 11th Annual Hackin' for Harden Memorial Golf Tournament on Saturday, June 6, 2026. Add your info below so we can include you on the team scorecard, check-in list, and event-day reminders.`}
      >
        <div className="text-cream-100/70 inline-flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-green-300" />
          <span>You are Player {payload.slot} of 4</span>
        </div>
      </PageHero>

      <Section className="bg-cream-50">
        <div className="mx-auto max-w-2xl">
          <TeamInviteForm
            regId={payload.reg_id}
            slot={payload.slot}
            captain={payload.captain}
            team={payload.team}
            token={token}
          />
        </div>
      </Section>
    </main>
  )
}

export default TeamInvitePage
