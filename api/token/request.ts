import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'node:process'
import queryString from 'query-string'
import { redirectCallback } from './common.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const protocol = request.headers['x-forwarded-proto'] || 'http'
  const baseURL = `${protocol}://${request.headers.host}`

  return response.redirect(
    queryString.stringifyUrl({
      url: 'https://accounts.spotify.com/authorize?',
      query: {
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: process.env.SCOPE,
        redirect_uri: new URL(redirectCallback, baseURL).toString(),
        state: process.env.STATE,
      },
    }),
  )
}
