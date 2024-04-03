import type { VercelResponse } from '@vercel/node'

export const redirectCallback = '/api/token/callback'
export function getResponseWithCookies(response: VercelResponse, access_token: string, refresh_token: string, expires_in: number) {
  response.setHeader('Set-Cookie', [
    `access_token=${access_token}; Max-Age=${expires_in - 600}; Path=/`,
    `refresh_token=${refresh_token}; HttpOnly; Max-Age=${expires_in}; Path=/`,
  ])

  return response
}
