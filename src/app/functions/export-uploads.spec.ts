import { randomUUID } from 'node:crypto'
import { exportUploads } from '@/app/functions/export-uploads'
import { makeUpload } from '@/test/factories/make-upload'
import { describe, it } from 'vitest'

describe('get uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    //SUT - system under test
    const sut = await exportUploads({
      searchQuery: namePattern,
    })
  })
})
