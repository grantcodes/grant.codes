import { resolve } from 'node:path'
import { defineCollection } from 'astro:content'
import { postrLoader } from '@postr/astro'

/**
 * Every published public and unlisted post, read from the api's postr database.
 * Set POSTR_DATABASE to build from another copy.
 */
export const collections = {
  posts: defineCollection({
    loader: postrLoader({
      database: resolve(process.env.POSTR_DATABASE ?? '../api/.data/postr.db'),
      siteUrl: 'https://grant.codes',
      // Same discovery as the api; the database source uses the stored type.
      postTypes: [
        {
          type: 'journal',
          name: 'Journal',
          discovery: (mf2) => Boolean(mf2.properties.category?.includes('journal')),
        },
      ],
      visibility: ['public', 'unlisted'],
    }),
  }),
}
