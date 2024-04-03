import process from 'node:process'
import { Buffer } from 'node:buffer'
import queryString from 'query-string'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { getResponseWithCookies } from './common.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const protocol = request.headers['x-forwarded-proto'] || 'http'
  const baseURL = `${protocol}://${request.headers.host}`

  const refresh_token = request.cookies.refresh_token

  if (!refresh_token)
    return response.redirect(new URL('/token/request', baseURL).toString())

  const spotifyResponseType = z.object({
    access_token: z.string(),
    expires_in: z.number(),
  })

  const spotifyResponse = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
                ).toString('base64')}`,
      },
      body: queryString.stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    },
  )
  const { access_token, expires_in } = spotifyResponseType.parse(await spotifyResponse.json())

  return getResponseWithCookies(
    response,
    access_token,
    refresh_token,
    expires_in,
  ).redirect(new URL('/', baseURL).toString())
}
