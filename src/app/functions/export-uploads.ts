import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'

const exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportUploads = z.input<typeof exportUploadsInput>

type GetUploadsOutput = {
  reportUrl: string
}

export async function exportUploads(
  input: ExportUploads
): Promise<Either<never, GetUploadsOutput>> {
  const { searchQuery } = exportUploadsInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt,
    })
    .from(schema.uploads)
    .where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  for await (const rows of cursor) {
    console.log(rows)
  }

  return makeRight({ reportUrl: '' })
}
