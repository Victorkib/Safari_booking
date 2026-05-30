import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LegalPageShell } from '@/components/legal-page-shell'

const faqs = [
  {
    q: 'When is my booking confirmed?',
    a: 'After you submit payment, our team verifies it. Once approved, your booking status changes to Confirmed and you receive a confirmation email.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'M-Pesa, bank transfer, and card payments are supported in this system. All payments require manual verification before confirmation.',
  },
  {
    q: 'Can I change my travel dates?',
    a: 'Yes — see our Booking Policy. One free change is allowed up to 21 days before departure, subject to availability.',
  },
  {
    q: 'What should I pack?',
    a: 'Neutral-coloured clothing, sun protection, binoculars, and any personal medications. We send a detailed pre-trip checklist after confirmation.',
  },
  {
    q: 'Are park fees included?',
    a: 'Most packages include park entry fees — check the package details under Included Services. Some conservancy fees may apply separately.',
  },
]

export default function FaqPage() {
  return (
    <LegalPageShell
      title="Frequently Asked Questions"
      description="Common questions about booking, payment, and travelling with Safari Adventures."
    >
      <div className="grid gap-4">
        {faqs.map((item) => (
          <Card key={item.q}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{item.a}</CardContent>
          </Card>
        ))}
      </div>
    </LegalPageShell>
  )
}
