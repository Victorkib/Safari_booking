import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LegalPageShell } from '@/components/legal-page-shell'
import { JsonLd } from '@/components/seo/json-ld'
import { FAQ_ENTRIES } from '@/lib/content/faq'
import { faqPageJsonLd } from '@/lib/seo/json-ld'

export default function FaqPage() {
  return (
    <LegalPageShell
      title="Frequently Asked Questions"
      description="Common questions about booking, payment, and travelling with Safari Adventures."
    >
      <JsonLd data={faqPageJsonLd([...FAQ_ENTRIES])} />
      <div className="grid gap-4">
        {FAQ_ENTRIES.map((item) => (
          <Card key={item.question}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.question}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{item.answer}</CardContent>
          </Card>
        ))}
      </div>
    </LegalPageShell>
  )
}
