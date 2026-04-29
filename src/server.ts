import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import sensible from '@fastify/sensible'
import healthRoutes from './routes/health'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import clientsRoutes from './routes/clients'
import invoicesRoutes from './routes/invoices'
import tasksRoutes from './routes/tasks'
import kpisRoutes from './routes/kpis'

const app = Fastify({ logger: true })

app.register(cors, { origin: true })
app.register(sensible)
app.register(jwt, {
	secret: process.env.JWT_SECRET || 'dev-secret',
})

app.decorate('authenticate', async (request, reply) => {
	try {
		await request.jwtVerify()
	} catch (err) {
		reply.send(err)
	}
})

app.register(healthRoutes, { prefix: '/health' })
app.register(authRoutes, { prefix: '/auth' })
app.register(usersRoutes, { prefix: '/users' })
app.register(clientsRoutes, { prefix: '/clients' })
app.register(invoicesRoutes, { prefix: '/invoices' })
app.register(tasksRoutes, { prefix: '/tasks' })
app.register(kpisRoutes, { prefix: '/kpis' })

export default app
