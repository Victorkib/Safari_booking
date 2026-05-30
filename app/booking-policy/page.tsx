import { LegalPageShell } from '@/components/legal-page-shell'

export default function BookingPolicyPage() {
  return (
    <LegalPageShell
      title="Booking Policy"
      description="Cancellation, refunds, and date-change rules for safari bookings."
    >
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Payment & Confirmation</h2>
        <p>
          Bookings start in <strong>Awaiting Payment</strong> status. After you submit payment,
          status moves to <strong>Payment Pending Verification</strong>. Our team verifies payment
          within 1–2 business days, then confirms your booking.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Cancellation by Guest</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>30+ days before departure: full refund minus processing fee</li>
          <li>15–29 days: 50% refund</li>
          <li>Under 15 days: no refund (force majeure exceptions at our discretion)</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Date Changes</h2>
        <p>
          One free date change is allowed up to 21 days before departure, subject to package
          availability. Additional changes may incur an administrative fee.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Operator Cancellation</h2>
        <p>
          If we cancel due to safety, park closure, or insufficient group size, you receive a
          full refund or the option to rebook on alternative dates.
        </p>
      </section>
    </LegalPageShell>
  )
}
