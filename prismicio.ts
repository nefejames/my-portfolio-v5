import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'

export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME || 'nefe-portfolio'

export function createClient(config: prismic.ClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    fetchOptions:
      process.env.NODE_ENV === 'production'
        ? { next: { tags: ['prismic'], revalidate: 3600 } }
        : { next: { revalidate: 0 } },
    ...config,
  })
  prismicNext.enableAutoPreviews({ client })
  return client
}
