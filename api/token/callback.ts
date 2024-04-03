import process from 'node:process'
import { Buffer } from 'node:buffer'
import queryString from 'query-string'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { getResponseWithCookies, redirectCallback } from './common.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const protocol = request.headers['x-forwarded-proto'] || 'http'
  const baseURL = `${protocol}://${request.headers.host}`

  const params = request.query
  const state = params.state

  if (state === null) {
    return response.redirect(new URL('/', baseURL).toString())
  }
  else if (state !== process.env.STATE) {
    return new Response(
      'Authorization failed, there is possibility you\'ve been hacked!',
      {
        status: 401,
      },
    )
  }

  const code = params.code

  if (code) {
    const spotifyResponseType = z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
    })

    try {
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
            grant_type: 'authorization_code',
            code,
            redirect_uri: new URL(
              redirectCallback,
              baseURL,
            ).toString(),
          }),
        },
      )
      const result = await spotifyResponse.json()
      const { access_token, refresh_token, expires_in } = spotifyResponseType.parse(result)

      return getResponseWithCookies(
        response,
        access_token,
        refresh_token,
        expires_in,
      ).redirect(new URL('/', baseURL).toString())
    }
    catch (e) {
      return new Response('something went wrong', {
        status: 401,
      })
    }
  }
  else {
    return new Response(params.error.toString(), {
      status: 401,
    })
  }
}
