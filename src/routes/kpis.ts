import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const kpisRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    const [rows] = await pool.query('SELECT label, value FROM kpis ORDER BY id ASC')
    return { data: rows }
  })
}

export default kpisRoutes
