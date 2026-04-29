import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const usersRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, status FROM users ORDER BY id DESC'
    )
    const data = (rows as Array<{ id: number; name: string; email: string; role: string; status: string }>).map(
      (row) => ({ ...row, id: String(row.id) })
    )
    return { data }
  })

  app.post('/', async (request) => {
    const body = request.body as { name?: string; email?: string; role?: string }
    const name = body.name || 'Sin nombre'
    const email = body.email || 'sin-email@demo.com'
    const role = body.role || 'user'
    const status = 'active'

    const [result] = await pool.query(
      'INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)',
      [name, email, role, status]
    )
    const insertId = (result as { insertId: number }).insertId
    return { id: String(insertId), name, email, role, status }
  })
}

export default usersRoutes
