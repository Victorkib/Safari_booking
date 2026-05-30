import { Compass, CreditCard, ShieldCheck } from 'lucide-react'

const STEPS = [
  {
    icon: Compass,
    title: 'Choose your safari',
    description: 'Browse curated packages across Kenya\'s finest parks and conservancies.',
  },
  {
    icon: CreditCard,
    title: 'Secure your dates',
    description: 'Pay via M-Pesa STK Push or submit payment for manual verification.',
  },
  {
    icon: ShieldCheck,
    title: 'Travel with confidence',
    description: 'Receive confirmation, meet your guide, and embark on a seamless journey.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-border/80 bg-card/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">How it works</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your luxury safari, simplified
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center md:text-left">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10 text-secondary md:mx-0">
                <step.icon className="size-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </p>
              <h3 className="font-display mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
