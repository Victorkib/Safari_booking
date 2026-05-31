import { getCustomerUsers } from '@/app/actions/users'
import { getAllPackages } from '@/app/actions/packages'
import { PageHeader } from '@/components/layout/page-header'
import { AdminBookingForm } from '@/components/admin/admin-booking-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminNewBookingPage() {
  const [customers, packages] = await Promise.all([
    getCustomerUsers(),
    getAllPackages(),
  ])

  return (
    <>
      <PageHeader
        title="Create booking for customer"
        description="Book on behalf of a traveler — payment and confirmation handled from the booking detail page."
        actions={(
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">Back to bookings</Link>
          </Button>
        )}
      />

      {customers.length === 0 ? (
        <p className="text-muted-foreground">
          No customer accounts yet.{' '}
          <Link href="/admin/users/new" className="font-medium text-primary underline-offset-4 hover:underline">
            Create a customer
          </Link>{' '}
          first.
        </p>
      ) : (
        <AdminBookingForm
          customers={customers.map((c) => ({ id: c.id, name: c.name, email: c.email }))}
          packages={packages.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            duration_days: p.duration_days,
            group_size_min: p.group_size_min,
            group_size_max: p.group_size_max,
          }))}
        />
      )}
    </>
  )
}
