import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'node:process'
import { z } from 'zod'
import { attachCookiesToResponse, fetchSpotifyAuth, redirectCallback } from './common.js'

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
    try {
      const spotifyResponseType = z.object({
        access_token: z.string(),
        refresh_token: z.string(),
        expires_in: z.number(),
      })

      const result = await fetchSpotifyAuth({
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: new URL(
          redirectCallback,
          baseURL,
        ).toString(),
      })
      const { access_token, refresh_token, expires_in } = spotifyResponseType.parse(result)

      return attachCookiesToResponse(
        response,
        access_token,
        refresh_token,
        expires_in,
      ).redirect(new URL('/', baseURL).toString())
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
      return new Response('something went wrong', {
        status: 401,
      })
    }
  }
  else {
    return new Response(params.error?.toString(), {
      status: 401,
    })
  }
}
