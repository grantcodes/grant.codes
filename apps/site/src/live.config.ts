import { defineLiveCollection } from 'astro:content'
import { postrLiveLoader } from '@postr/astro'
import { database } from './lib/database'
import { site } from './lib/site'

/** Every published public and unlisted post, read from the api's postr database on each request. */
export const collections = {
  posts: defineLiveCollection({
    loader: postrLiveLoader({
      database,
      siteUrl: site.url,
      visibility: ['public', 'unlisted'],
    }),
  }),
}
