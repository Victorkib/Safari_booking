import { config } from 'dotenv'
import { Pool } from 'pg'
import { clearAllData } from './clear'

config({ path: '.env.local' })

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    await clearAllData(pool)
    console.log('Running seed...')
    const { execSync } = await import('child_process')
    execSync('npm run db:seed', { stdio: 'inherit', cwd: process.cwd() })
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
