import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SafariImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  overlay?: 'none' | 'bottom' | 'full'
  aspect?: 'video' | 'square' | 'wide' | 'hero'
}

const aspectClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
  hero: 'aspect-[4/5] lg:aspect-[5/4]',
}

export function SafariImage({
  src,
  alt,
  className,
  priority,
  overlay = 'bottom',
  aspect = 'video',
}: SafariImageProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted',
        aspectClasses[aspect],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {overlay === 'bottom' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      )}
      {overlay === 'full' && (
        <div className="absolute inset-0 bg-black/35" />
      )}
    </div>
  )
}
