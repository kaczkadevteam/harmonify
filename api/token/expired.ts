import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getResponseWithCookies } from './common.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const protocol = request.headers['x-forwarded-proto'] || 'http'
  const baseURL = `${protocol}://${request.headers.host}`

  return getResponseWithCookies(
    response,
    'deleted',
    'deleted',
    new Date().getUTCDate(),
  ).redirect(new URL('/api/token/request', baseURL).toString())
}
