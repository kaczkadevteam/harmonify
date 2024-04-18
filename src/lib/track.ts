import type { Track } from '@/types'

export function removeDuplicatedTracks(tracks: Track[]) {
  return tracks.reduce<Track[]>((filteredTracks, track) => {
    if (!filteredTracks.some(someTrack => someTrack.uri === track.uri))
      filteredTracks.push(track)

    return filteredTracks
  }, [])
}

export function addGuessToTracks(tracks: Track[]) {
  return tracks.map(track => ({
    ...track,
    guess: trackIntoGuessString(track),
  }))
}

export function trackIntoGuessString(track: Track) {
  return `${track.name} - ${getArtistsAsString(track)} - ${track.album.name}`
}

export function getArtistsAsString(track: Track) {
  return track.artists
    .reduce((acc, artist) => {
      return `${acc}, ${artist.name}`
    }, '')
    .slice(2)
}

export function selectRandomlyTracks(tracks: Track[], count: number) {
  const selectedTracks: Track[] = []
  let leftTracks = [...tracks]

  for (let i = 0; i < count; i++) {
    if (leftTracks.length === 0)
      leftTracks = [...tracks]

    const drawnIndex = Math.floor(Math.random() * leftTracks.length)
    const drawnTrack = leftTracks.splice(drawnIndex, 1)[0]

    selectedTracks.push(drawnTrack)
  }

  return selectedTracks
}
