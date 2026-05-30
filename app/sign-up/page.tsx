import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { callbackUrl } = await searchParams

  if (session?.user) {
    redirect(callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/')
  }

  return <AuthForm mode="sign-up" callbackUrl={callbackUrl} />
}
