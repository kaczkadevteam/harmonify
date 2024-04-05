import Cookies from 'universal-cookie'

export async function fetchFromSpotify(
  url: string,
  router: any = null,
  isURLFull: boolean = false,
  method = 'GET',
  body: string | undefined = undefined,
) {
  const cookies = new Cookies(null, { path: '/' })

  const response = await fetch(
    isURLFull ? url : `${import.meta.env.VITE_SPOTIFY_URL}${url}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('access_token')}`,
      },
      body,
    },
  )

  if (response.status === 400 || response.status === 401)
    router.push('/token/expired')

  return response
}
