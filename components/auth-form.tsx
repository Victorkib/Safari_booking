'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { getAuthImageUrl } from '@/lib/safari-images'

function getSafeRedirect(url: string | null | undefined): string {
  if (!url || !url.startsWith('/') || url.startsWith('//')) {
    return '/'
  }
  return url
}

export function AuthForm({
  mode,
  callbackUrl,
}: {
  mode: 'sign-in' | 'sign-up'
  callbackUrl?: string | null
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'
  const redirectTo = getSafeRedirect(callbackUrl)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isSignUp && !acceptedTerms) {
      setError('Please accept the terms and booking policy to continue.')
      return
    }

    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const signInHref = callbackUrl
    ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/sign-in'
  const signUpHref = callbackUrl
    ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/sign-up'

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src={getAuthImageUrl()}
          alt="Safari landscape"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 text-white">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            Safari Adventures
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold">
            Your gateway to the wild
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Book curated safaris, pay securely, and travel with expert guides across Kenya.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? 'Join to book and manage your safari journeys'
                : 'Sign in to continue to your bookings'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            {isSignUp && (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(v) => setAcceptedTerms(v === true)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-foreground underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link href="/booking-policy" className="text-foreground underline-offset-4 hover:underline">
                    Booking Policy
                  </Link>
                </Label>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? 'Please wait...'
                : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              href={isSignUp ? signInHref : signUpHref}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
