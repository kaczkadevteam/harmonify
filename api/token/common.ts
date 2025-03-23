import type { VercelResponse } from '@vercel/node'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import queryString from 'query-string'

interface SpotifyAuthQuery {
  grant_type: string
  code?: string
  redirect_uri?: string
  refresh_token?: string
}

export const redirectCallback = '/api/token/callback'

export function attachCookiesToResponse(
  response: VercelResponse,
  access_token: string,
  refresh_token: string,
  expires_in: number,
) {
  response.setHeader('Set-Cookie', [
    `access_token=${access_token}; Max-Age=${expires_in - 600}; Path=/`,
    `refresh_token=${refresh_token}; HttpOnly; Max-Age=${expires_in}; Path=/`,
  ])

  return response
}

export async function fetchSpotifyAuth(query: SpotifyAuthQuery) {
  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
      body: queryString.stringify(query),
    },
  )
  return await response.json()
}
