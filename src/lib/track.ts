import type { Track } from '@/types'

export function removeDuplicatedTracks(tracks: Track[]) {
  return tracks.reduce<Track[]>((filteredTracks, track) => {
    if (!filteredTracks.some(someTrack => someTrack.uri === track.uri))
      filteredTracks.push(track)

    return filteredTracks
  }, [])
}

export function getArtistsAsString(track: Track) {
  return track.artists
    .reduce((acc, artist) => {
      return `${acc}, ${artist.name}`
    }, '')
    .slice(2)
}
