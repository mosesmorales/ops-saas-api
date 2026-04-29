import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const tasksRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    const [rows] = await pool.query('SELECT id, title, owner, status FROM tasks ORDER BY id DESC')
    const data = (rows as Array<{ id: number; title: string; owner: string; status: string }>).map(
      (row) => ({ ...row, id: String(row.id) })
    )
    return { data }
  })

  app.post('/', async (request) => {
    const body = request.body as { title?: string; owner?: string }
    const title = body.title || 'Tarea sin titulo'
    const owner = body.owner || 'Sin responsable'
    const status = 'open'

    const [result] = await pool.query(
      'INSERT INTO tasks (title, owner, status) VALUES (?, ?, ?)',
      [title, owner, status]
    )
    const insertId = (result as { insertId: number }).insertId
    return { id: String(insertId), title, owner, status }
  })
}

export default tasksRoutes
