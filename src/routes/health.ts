import type { FastifyPluginAsync } from 'fastify'

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({ status: 'ok', service: 'ops-saas-api' }))
}

export default healthRoutes
