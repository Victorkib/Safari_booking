import Link from 'next/link'
import { getAllUsers } from '@/app/actions/users'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SoftDeleteUserButton } from '@/components/admin/soft-delete-user-button'

interface AdminUsersPageProps {
  searchParams: Promise<{ role?: string }>
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { role } = await searchParams
  const roleFilter =
    role === 'customer' || role === 'driver' || role === 'admin' ? role : undefined

  const users = await getAllUsers(roleFilter)

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage customers, drivers, and administrators"
        actions={(
          <Button asChild>
            <Link href="/admin/users/new">Add user</Link>
          </Button>
        )}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', 'customer', 'driver', 'admin'] as const).map((r) => (
          <Button
            key={r}
            variant={(!roleFilter && r === 'all') || roleFilter === r ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href={r === 'all' ? '/admin/users' : `/admin/users?role=${r}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/40">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users/${u.id}/edit`}>Edit</Link>
                        </Button>
                        <SoftDeleteUserButton userId={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">No users found</p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Deactivated accounts are permanently removed after 7 days via{' '}
        <code className="rounded bg-muted px-1">npm run db:purge-deleted</code> (schedule as a cron job).
      </p>
    </>
  )
}
