import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsync = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        body: z.object({
          name: z.string(),
          password: z.string().optional(),
        }),
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z.object({
            messagem: z.string().describe('Upload already exists'),
          }),
        },
      },
    },

    async (request, reply) => {
      await db.insert(schema.uploads).values({
        name: 'teste.jpg',
        remoteKey: 'teste.jpg',
        remoteUrl: 'http://teste.com',
      })

      return reply.status(201).send({ uploadId: 'teste' })
    }
  )
}
