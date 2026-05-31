/**
 * Generates favicons, PWA icons, and OG image from public/logo.png and safari photography.
 * Run: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')
const appDir = path.join(root, 'app')

const logoPath = path.join(publicDir, 'logo.png')
const ogSource = path.join(publicDir, 'sunset_savannah.jpg')

async function writePng(buffer, outPath, size) {
  await sharp(buffer)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outPath)
}

async function main() {
  const logo = await readFile(logoPath)

  const sizes = [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ]

  for (const [name, size] of sizes) {
    await writePng(logo, path.join(publicDir, name), size)
    console.log(`✓ public/${name}`)
  }

  await writePng(logo, path.join(appDir, 'icon.png'), 32)
  await writePng(logo, path.join(appDir, 'apple-icon.png'), 180)
  console.log('✓ app/icon.png, app/apple-icon.png')

  await sharp(ogSource)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(publicDir, 'og-image.jpg'))
  console.log('✓ public/og-image.jpg')

  console.log('Brand assets generated.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
