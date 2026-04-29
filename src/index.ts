import dotenv from 'dotenv'
import app from './server'

dotenv.config()

const port = Number(process.env.PORT || 5050)

async function start() {
  try {
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
