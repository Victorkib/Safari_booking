import { notFound } from 'next/navigation'
import { getUserByIdForAdmin } from '@/app/actions/users'
import { PageHeader } from '@/components/layout/page-header'
import { UserForm } from '@/components/admin/user-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const user = await getUserByIdForAdmin(id)

  if (!user || user.deletedAt) {
    notFound()
  }

  return (
    <>
      <PageHeader
        title="Edit user"
        description={user.email}
        actions={(
          <Button variant="outline" asChild>
            <Link href="/admin/users">Back</Link>
          </Button>
        )}
      />
      <UserForm
        mode="edit"
        initialData={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
    </>
  )
}
