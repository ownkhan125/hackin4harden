'use client'

import Link from 'next/link'

import { useState } from 'react'

import { Check, Loader2, Users } from 'lucide-react'
import PropTypes from 'prop-types'

import Button from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/form-field'

const TeamInviteForm = ({ regId, slot, captain, team, token }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    groupInfo: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const ready =
    form.fullName.trim() !== '' && form.email.trim() !== '' && form.phone.trim() !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!ready) {
      setError('Name, email, and phone are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/team-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          groupInfo: form.groupInfo,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not submit. Please try again.')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="shadow-elev rounded-2xl border border-green-200 bg-white p-10 text-center">
        <div className="text-cream-50 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
          <Check className="h-6 w-6" strokeWidth={3} />
        </div>
        <h3 className="font-display text-navy-900 mt-6 text-2xl font-semibold tracking-tight">
          You&apos;re on the team.
        </h3>
        <p className="text-mesh-700 mt-3">
          We added you to {team || `${captain}'s foursome`} for Saturday, June 6, 2026 at The
          Legacy Golf Club. {captain} will get a confirmation that the team is one player closer
          to full.
        </p>
        <div className="mt-7">
          <Button asChild variant="primary" size="md">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-cream-200 shadow-elev space-y-6 rounded-2xl border bg-white p-8 sm:p-10"
    >
      <div className="border-cream-200 bg-cream-50 flex items-center gap-4 rounded-xl border p-4">
        <div className="bg-green-500 text-cream-50 flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-[0_8px_18px_-10px_rgba(46,125,63,0.55)]">
          <Users className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-navy-900 font-display text-sm font-semibold tracking-tight">
            Your details
          </p>
          <p className="text-mesh-600 mt-0.5 text-xs leading-relaxed">
            {captain} invited you to take Player {slot}&apos;s spot. Name, email, and phone are
            required so we can text you the event-day reminders.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="ti-name" label="Full name" required>
          <Input
            id="ti-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={update('fullName')}
            required
          />
        </Field>
        <Field id="ti-email" label="Email" required>
          <Input
            id="ti-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </Field>
        <Field id="ti-phone" label="Phone" required>
          <Input
            id="ti-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(480) 555-0123"
            value={form.phone}
            onChange={update('phone')}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ti-group" label="Role / relationship to captain" hint="e.g. coworker, friend, family.">
          <Input
            id="ti-group"
            name="groupInfo"
            type="text"
            value={form.groupInfo}
            onChange={update('groupInfo')}
          />
        </Field>
        <Field id="ti-notes" label="Notes" hint="Shirt size, dietary, accessibility.">
          <Input
            id="ti-notes"
            name="notes"
            type="text"
            value={form.notes}
            onChange={update('notes')}
          />
        </Field>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="border-cream-200 flex flex-wrap items-center gap-4 border-t pt-6">
        <Button type="submit" variant="primary" size="lg" disabled={submitting || !ready}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>Join the team</>
          )}
        </Button>
        <p className="text-mesh-500 text-xs">
          By submitting, your info will be added to the team&apos;s registration record in our
          tournament management system.
        </p>
      </div>
    </form>
  )
}

TeamInviteForm.propTypes = {
  regId: PropTypes.string.isRequired,
  slot: PropTypes.number.isRequired,
  captain: PropTypes.string.isRequired,
  team: PropTypes.string,
  token: PropTypes.string.isRequired,
}

export default TeamInviteForm
