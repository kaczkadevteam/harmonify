import type { Router } from 'vue-router'
import { z } from 'zod'

export async function fetchFromSpotify(
  url: string,
  access_token: string,
  router: Router,
  isURLFull: boolean = false,
  method = 'GET',
  body: string | undefined = undefined,
) {
  const response = await fetch(
    isURLFull ? url : `${import.meta.env.VITE_SPOTIFY_URL}${url}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body,
    },
  )

  if (response.status === 400 || response.status === 401)
    window.location.href = '/api/token/expired'

  if (response.status === 403)
    router.push({ name: 'disclaimer' })

  return response
}

export async function getAllPaginatedItems<T>(url: string, access_token: string, router: Router, itemSchema: z.ZodType<T>) {
  let next: string | null = url
  const collected: T[] = []

  const schema = z.object({
    total: z.number(),
    items: z.array(itemSchema),
    next: z.string().nullable(),
  })

  while (next) {
    const response = await fetchFromSpotify(
      next,
      access_token,
      router,
      true,
    )

    const result = schema.parse(await response.json())
    collected.push(...result.items)
    next = result.next
  }

  return collected
}
