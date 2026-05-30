import { LegalPageShell } from '@/components/legal-page-shell'

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      description="The agreement between you and Safari Adventures when booking a safari."
    >
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Booking Agreement</h2>
        <p>
          By completing a booking, you agree to these terms. A booking is confirmed only after
          payment verification by our team — submitting payment details does not guarantee confirmation
          until approved.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Pricing & Payment</h2>
        <p>
          All prices are quoted in Kenyan Shillings (KES) unless stated otherwise. Total price is
          calculated server-side based on package rate and number of guests. Simulated payment methods
          (M-Pesa, card, bank transfer) require manual admin verification in this demo environment.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Travel Responsibilities</h2>
        <p>
          Guests are responsible for valid travel documents, vaccinations where required, and travel
          insurance. Safari Adventures is not liable for delays caused by weather, park closures,
          or circumstances beyond our reasonable control.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Changes & Cancellations</h2>
        <p>
          See our Booking Policy for cancellation timelines and refund eligibility. Date changes
          are subject to availability and may incur fees.
        </p>
      </section>
    </LegalPageShell>
  )
}
