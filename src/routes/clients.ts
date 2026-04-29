import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const clientsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    const [rows] = await pool.query(
      'SELECT id, name, owner, status FROM clients ORDER BY id DESC'
    )
    const data = (rows as Array<{ id: number; name: string; owner: string; status: string }>).map(
      (row) => ({ ...row, id: String(row.id) })
    )
    return { data }
  })

  app.post('/', async (request) => {
    const body = request.body as { name?: string; owner?: string }
    const name = body.name || 'Sin nombre'
    const owner = body.owner || 'Sin responsable'
    const status = 'active'

    const [result] = await pool.query(
      'INSERT INTO clients (name, owner, status) VALUES (?, ?, ?)',
      [name, owner, status]
    )
    const insertId = (result as { insertId: number }).insertId
    return { id: String(insertId), name, owner, status }
  })
}

export default clientsRoutes
