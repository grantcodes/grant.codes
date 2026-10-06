import type { LinkwardenLinkRequest } from './likes.js'

export interface LinkwardenLink {
  id?: number | string
  url?: string
  [key: string]: unknown
}

export interface LinkwardenClient {
  createLink(request: LinkwardenLinkRequest): Promise<LinkwardenLink | null>
}

export interface LinkwardenClientOptions {
  baseUrl: string
  token: string
  fetchImpl?: typeof fetch
}

export function createLinkwardenClient({
  baseUrl,
  token,
  fetchImpl = fetch,
}: LinkwardenClientOptions): LinkwardenClient {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/api/v1/links`

  return {
    async createLink(request) {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Linkwarden responded with ${response.status}`)
      }

      const body = (await response.json()) as LinkwardenLink & {
        response?: LinkwardenLink
      }

      return body.response ?? body
    },
  }
}
