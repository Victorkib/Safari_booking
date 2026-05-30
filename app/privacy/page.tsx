import { LegalPageShell } from '@/components/legal-page-shell'

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="How Safari Adventures collects, uses, and protects your personal information."
    >
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
        <p>
          When you book a safari, we collect your name, email address, travel dates, guest count,
          and payment reference details. We may also store special requests you provide during booking.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Data</h2>
        <p>
          We use your information to process bookings, verify payments, assign drivers and vehicles,
          and send transactional emails about your trip. We do not sell your personal data to third parties.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Data Retention</h2>
        <p>
          Booking and payment records are retained for accounting and legal compliance purposes.
          You may request deletion of non-essential data by contacting us at info@safariadventures.com.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
        <p>
          For privacy-related questions, email info@safariadventures.com or write to Safari Adventures,
          Nairobi, Kenya.
        </p>
      </section>
    </LegalPageShell>
  )
}
