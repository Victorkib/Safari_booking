import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { callbackUrl } = await searchParams

  if (session?.user) {
    redirect(callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/')
  }

  return <AuthForm mode="sign-in" callbackUrl={callbackUrl} />
}
