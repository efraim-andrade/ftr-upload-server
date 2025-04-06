import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get('/health', async (_, reply) => {
    await reply.status(200).send({ message: 'Nice demais! 👍' })
  })
}
