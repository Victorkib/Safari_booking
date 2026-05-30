import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getHeroImageUrl } from '@/lib/safari-images'

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src={getHeroImageUrl()}
        alt="African safari landscape at golden hour"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-secondary">
          Kenya&apos;s Premier Safari Experiences
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Where the wild meets world-class comfort
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
          Curated journeys through the Maasai Mara, Amboseli, and beyond — expert guides,
          seamless booking, and memories crafted for a lifetime.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/packages">
            <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:w-auto">
              Explore Safaris
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
            >
              Begin Your Journey
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-white/20 pt-8">
          <div>
            <p className="font-display text-3xl font-semibold text-secondary">50+</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/70">Safari packages</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-secondary">5K+</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/70">Happy travelers</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-secondary">15</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/70">Years of excellence</p>
          </div>
        </div>
      </div>
    </section>
  )
}
