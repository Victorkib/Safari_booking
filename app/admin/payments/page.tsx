import { AdminPaymentActions } from '@/components/admin-payment-actions'
import { getAllPayments, isMpesaLive } from '@/app/actions/payments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'

export default async function AdminPayments() {
  const [payments, mpesaLive] = await Promise.all([getAllPayments(), isMpesaLive()])

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0),
  }

  return (
    <>
      <PageHeader
        title="Payments Management"
        description={
          mpesaLive
            ? 'M-Pesa STK Push payments auto-confirm via Safaricom callback. Card and bank transfers still need manual approval.'
            : 'Track and process all booking payments'
        }
      />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">KES {stats.totalAmount.toFixed(0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
            <CardDescription>
              Process and verify all customer payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Transaction ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Booking ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold">Method</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4 font-mono text-xs">
                        {payment.mpesa_receipt && payment.status === 'completed'
                          ? payment.mpesa_receipt
                          : `${payment.transaction_id?.slice(0, 12) ?? 'N/A'}...`}
                        {payment.mpesa_phone && (
                          <p className="mt-1 font-sans text-[10px] text-muted-foreground">
                            +{payment.mpesa_phone}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">
                        {payment.booking_id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-4 font-semibold">KES {parseFloat(payment.amount).toFixed(2)}</td>
                      <td className="py-4 px-4 capitalize">
                        {payment.payment_method?.replace('_', ' ') || 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {payment.status === 'pending' ? (
                            <AdminPaymentActions
                              paymentId={payment.id}
                              paymentMethod={payment.payment_method}
                              mpesaLive={mpesaLive}
                            />
                          ) : payment.payment_method === 'mpesa' && payment.mpesa_receipt ? (
                            <span className="text-xs text-green-700">M-Pesa verified</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {payments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </>
  )
}
