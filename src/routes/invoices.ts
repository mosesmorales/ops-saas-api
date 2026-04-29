import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const invoicesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    const [rows] = await pool.query(
      `SELECT invoices.id, clients.name AS client, invoices.amount, invoices.status
       FROM invoices
       JOIN clients ON clients.id = invoices.client_id
       ORDER BY invoices.id DESC`
    )
    const data = (rows as Array<{ id: number; client: string; amount: number; status: string }>).map(
      (row) => ({ ...row, id: String(row.id) })
    )
    return { data }
  })

  app.post('/', async (request) => {
    const body = request.body as { clientId?: number; client?: string; amount?: number }
    const amount = body.amount || 0
    const status = 'pending'

    let clientId = body.clientId
    if (!clientId && body.client) {
      const [clientRows] = await pool.query('SELECT id FROM clients WHERE name = ? LIMIT 1', [
        body.client,
      ])
      const match = (clientRows as Array<{ id: number }>)[0]
      if (match) {
        clientId = match.id
      } else {
        const [clientInsert] = await pool.query(
          'INSERT INTO clients (name, owner, status) VALUES (?, ?, ?)',
          [body.client, 'Sin responsable', 'active']
        )
        clientId = (clientInsert as { insertId: number }).insertId
      }
    }

    if (!clientId) {
      return app.httpErrors.badRequest('clientId es requerido')
    }

    const [result] = await pool.query(
      'INSERT INTO invoices (client_id, amount, status) VALUES (?, ?, ?)',
      [clientId, amount, status]
    )
    const insertId = (result as { insertId: number }).insertId

    const [row] = await pool.query(
      `SELECT invoices.id, clients.name AS client, invoices.amount, invoices.status
       FROM invoices
       JOIN clients ON clients.id = invoices.client_id
       WHERE invoices.id = ?`,
      [insertId]
    )
    const invoice = (row as Array<{ id: number; client: string; amount: number; status: string }>)[0]
    return { ...invoice, id: String(invoice.id) }
  })
}

export default invoicesRoutes
