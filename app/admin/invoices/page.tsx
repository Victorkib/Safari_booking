import { getAllPayments } from '@/app/actions/payments'
import { getAllBookings } from '@/app/actions/bookings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import Link from 'next/link'

export default async function AdminInvoices() {
  const payments = await getAllPayments()
  const bookings = await getAllBookings()

  const invoices = payments.map(payment => {
    const booking = bookings.find(b => b.id === payment.booking_id)
    return {
      id: payment.id,
      booking_id: payment.booking_id,
      amount: parseFloat(payment.amount),
      date: payment.created_at,
      status: payment.status,
      guests: booking?.number_of_guests || 0,
      start_date: booking?.start_date,
    }
  })

  const totalRevenue = invoices
    .filter(i => i.status === 'completed')
    .reduce((sum, i) => sum + i.amount, 0)

  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <>
      <PageHeader
        title="Invoices & Billing"
        description="Manage customer invoices and track revenue"
        actions={<Button>Generate Invoice</Button>}
      />

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">
                KES {totalRevenue.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">From completed invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700">
                KES {pendingAmount.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{invoices.length}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Records</CardTitle>
            <CardDescription>
              All customer invoices and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Invoice ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Booking ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-left py-4 px-4 font-semibold">Guests</th>
                    <th className="text-left py-4 px-4 font-semibold">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4 font-mono text-xs">
                        INV-{invoice.id.slice(0, 10)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">
                        {invoice.booking_id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-4">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{invoice.guests}</td>
                      <td className="py-4 px-4 font-semibold">
                        KES {invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'completed' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/invoices/${invoice.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {invoices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </>
  )
}
