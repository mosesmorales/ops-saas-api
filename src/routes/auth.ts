import type { FastifyPluginAsync } from 'fastify'
import pool from '../lib/db'

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', async (request) => {
    const body = request.body as { email?: string; password?: string }
    if (!body?.email || !body?.password) {
      return app.httpErrors.badRequest('Email y password son requeridos')
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1',
      [body.email]
    )
    const user = (rows as Array<{ id: number; name: string; email: string; role: string }>)[0]

    if (!user || body.password !== 'admin123') {
      return app.httpErrors.unauthorized('Credenciales invalidas')
    }

    const token = app.jwt.sign({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    })

    return { token, user: { ...user, id: String(user.id) } }
  })

  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const payload = request.user as { sub?: string }
    if (!payload?.sub) return app.httpErrors.unauthorized('Token invalido')
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1',
      [payload.sub]
    )
    const user = (rows as Array<{ id: number; name: string; email: string; role: string }>)[0]
    if (!user) return app.httpErrors.notFound('Usuario no encontrado')
    return { ...user, id: String(user.id) }
  })
}

export default authRoutes
