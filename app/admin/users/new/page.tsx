import { PageHeader } from '@/components/layout/page-header'
import { UserForm } from '@/components/admin/user-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface NewUserPageProps {
  searchParams: Promise<{ role?: string }>
}

export default async function NewUserPage({ searchParams }: NewUserPageProps) {
  const { role } = await searchParams
  const defaultRole =
    role === 'driver' || role === 'admin' ? role : 'customer'

  return (
    <>
      <PageHeader
        title="Add user"
        description="Create a customer, driver, or administrator account"
        actions={(
          <Button variant="outline" asChild>
            <Link href="/admin/users">Back</Link>
          </Button>
        )}
      />
      <UserForm mode="create" defaultRole={defaultRole} />
      {defaultRole === 'driver' && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          After creating a driver account, add their license profile under{' '}
          <Link href="/admin/drivers/new" className="text-primary underline-offset-4 hover:underline">
            Drivers → Add Driver
          </Link>
          , or use the combined driver onboarding form (coming soon).
        </p>
      )}
    </>
  )
}
