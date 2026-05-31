import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LOGO_PATH, SITE_NAME } from '@/lib/seo/site'

type BrandLogoProps = {
  href?: string
  className?: string
  /** Hide wordmark on very narrow sidebars */
  showWordmark?: boolean
  /** Light text for dark headers/footers */
  variant?: 'default' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { img: 32, imgClass: 'h-8', text: 'text-lg' },
  md: { img: 40, imgClass: 'h-10', text: 'text-xl' },
  lg: { img: 48, imgClass: 'h-12', text: 'text-2xl' },
} as const

export function BrandLogo({
  href = '/',
  className,
  showWordmark = true,
  variant = 'default',
  size = 'md',
}: BrandLogoProps) {
  const s = sizeMap[size]

  const content = (
    <>
      <Image
        src={LOGO_PATH}
        alt={`${SITE_NAME} logo`}
        width={s.img}
        height={s.img}
        className={cn(s.imgClass, 'w-auto object-contain')}
        priority={href === '/'}
      />
      {showWordmark && (
        <span
          className={cn(
            'font-display font-semibold leading-tight',
            s.text,
            variant === 'light' ? 'text-background' : 'text-primary'
          )}
        >
          {SITE_NAME}
        </span>
      )}
    </>
  )

  const classes = cn('inline-flex items-center gap-2.5 transition-opacity hover:opacity-90', className)

  if (!href) {
    return <div className={classes}>{content}</div>
  }

  return (
    <Link href={href} className={classes} aria-label={`${SITE_NAME} home`}>
      {content}
    </Link>
  )
}
