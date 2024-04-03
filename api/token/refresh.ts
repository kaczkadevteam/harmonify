import process from 'node:process'
import { Buffer } from 'node:buffer'
import queryString from 'query-string'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { attachCookiesToResponse, fetchSpotifyAuth } from './common.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const protocol = request.headers['x-forwarded-proto'] || 'http'
  const baseURL = `${protocol}://${request.headers.host}`

  const refresh_token = request.cookies.refresh_token

  if (!refresh_token)
    return response.redirect(new URL('/api/token/request', baseURL).toString())

  const spotifyResponseType = z.object({
    access_token: z.string(),
    expires_in: z.number(),
  })

  const result = await fetchSpotifyAuth({
    grant_type: 'refresh_token',
    refresh_token,
  })

  const { access_token, expires_in } = spotifyResponseType.parse(result)

  return attachCookiesToResponse(
    response,
    access_token,
    refresh_token,
    expires_in,
  ).redirect(new URL('/', baseURL).toString())
}
