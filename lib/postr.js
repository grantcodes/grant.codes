import path from 'path'
import core from '@postr/core'
import pouchdbAdapterHttp from 'pouchdb-adapter-http'

let lastUpdate = 0

export default async () =>
  new Promise((resolve, reject) => {
    const backend = process.env.NEXT_PUBLIC_API_URL
    const url = process.env.NEXT_PUBLIC_URL

    try {
      const endpoint = core({
        siteBaseUrl: url,
        endpointBaseUrl: backend + '/micropub',
        // mediaDir: url + '/../../grant.codes/media',
        dbName: path.resolve(process.cwd(), '.next/postr'),
        mediaBaseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
        tokenEndpoint: backend + `/token`,
        imageSizes: {
          '1800': [1800, 0],
          '700': [700, 0],
          '200x200': [200, 200],
        },
        formatContent: true,
        getRefs: true,
        downloadExternalMedia: false,
        createdDateInPermalinks: true,
        dangerousDevMode: false,
        dangerousPermanentToken: process.env.MICROPUB_TOKEN,
        dbPassword: process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER,
        sendWebmentions: false,
      })

      // Syndicate and replicate to a couchdb database when on live site
      if (
        process.env.COUCH_DB_PUBLIC_ADMIN &&
        process.env.COUCH_DB_PRIVATE_ADMIN
      ) {
        endpoint.use(pouchdbAdapterHttp)

        endpoint.getCollection().then((collection) => {
          const publicSyncOptions = {
            remote: process.env.COUCH_DB_PUBLIC_ADMIN,
            direction: {
              pull: true,
              push: false,
            },
            options: {
              live: false,
              retry: true,
            },
            query: collection
              .find()
              .where('properties.visibility.0')
              .ne('private'), // Don't sync private posts
          }

          if (lastUpdate > Date.now() - 1000 * 60 * 5) {
            resolve(collection)
          } else {
            // Sync public
            const replicationState = collection.sync(publicSyncOptions)
            replicationState.complete$.subscribe((completed) => {
              if (completed) {
                lastUpdate = Date.now()
                resolve(collection)
              }
            })
          }
        })
      } else {
        console.warn(
          'Environment variables not set for couchdb http connection'
        )
        endpoint.getCollection().then(resolve)
      }
    } catch (err) {
      console.error('Error setting up replication', err)
      resolve(null)
    }
  })
