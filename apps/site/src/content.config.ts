import { resolve } from 'node:path'
import { defineCollection } from 'astro:content'
import { postrLoader } from '@postr/astro'
import { site } from './lib/site'

/**
 * Every published public and unlisted post, read from the api's postr database.
 * Set POSTR_DATABASE to build from another copy.
 */
export const collections = {
  posts: defineCollection({
    loader: postrLoader({
      database: resolve(process.env.POSTR_DATABASE ?? '../api/.data/postr.db'),
      siteUrl: site.url,
      visibility: ['public', 'unlisted'],
    }),
  }),
}
