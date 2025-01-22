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
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z.object({
            messagem: z.string().describe('Upload already exists'),
          }),
        },
      },
    },

    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, //2mb
        },
      })

      console.log('👻  uploadedFile:', uploadedFile)

      // await db.insert(schema.uploads).values({
      //   name: 'teste.jpg',
      //   remoteKey: 'teste.jpg',
      //   remoteUrl: 'http://teste.com',
      // })

      return reply.status(201).send({ uploadId: 'teste' })
    }
  )
}
