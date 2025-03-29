import type { Track } from '@/types'
import { describe, expect, it } from 'vitest'
import { removeDuplicatedTracks } from '../track'

const rawTracks: Track[] = [{
  artists: [{ name: 'Michael Hunter', id: '4J86DBDnC5acWsN0dpZe3j' }],
  duration_ms: 171486,
  name: 'Soviet Connection — The Theme from Grand Theft Auto IV',
  uri: 'spotify:track:5AAXvrvpClghVZIvk5wPqf',
  album: {
    name: 'Grand Theft Auto IV — The Theme Song Collection',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273c7d910e948d40b7acb9e6682',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02c7d910e948d40b7acb9e6682',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851c7d910e948d40b7acb9e6682',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Kristofer Maddigan', id: '2jR6Lr47O21Iq7l5Bs2mig' }],
  duration_ms: 195720,
  name: 'Inkwell Isle One',
  uri: 'spotify:track:6UehmCQPTPaZk5R0VXQ5eE',
  album: {
    name: 'Cuphead (Original Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27305ded1194cfefa65af276a4e',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e0205ded1194cfefa65af276a4e',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d0000485105ded1194cfefa65af276a4e',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'DM DOKURO', id: '2NHvG0lx27x07cSzMn51KO' }],
  duration_ms: 274602,
  name: 'Infestation',
  uri: 'spotify:track:47Yh3jaeUdh3RUr9NJ2kEj',
  album: {
    name: 'The Tale of a Cruel World (Calamity Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273dcb364df5080fead36fe203f',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02dcb364df5080fead36fe203f',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851dcb364df5080fead36fe203f',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'George Strezov', id: '2DNnA9F0OrEmC80UWEwrMi' }],
  duration_ms: 162089,
  name: 'Main Theme',
  uri: 'spotify:track:4z5ZHzM6xWdEFr5QaHyI3m',
  album: {
    name: 'Surviving Mars (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273431f5b74fc9b61de1901257b',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02431f5b74fc9b61de1901257b',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851431f5b74fc9b61de1901257b',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Arnaud Roy', id: '4DfwOelzJtTBZiXZ1tYo8D' }],
  duration_ms: 292339,
  name: 'Humankind (Main Title)',
  uri: 'spotify:track:2rb690OnU63OkRm3KN0tPs',
  album: {
    name: 'HUMANKIND (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273cc79adc7950154d10cd9960d',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02cc79adc7950154d10cd9960d',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851cc79adc7950154d10cd9960d',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [
    { name: 'Johan Skugge', id: '0cxIE0a4SKHitNEvJ9rAXm' },
    { name: 'Jukka Rintamäki', id: '0vEK9IIbyIKeoQiN1NvEbC' },
  ],
  duration_ms: 115986,
  name: 'Battlefield 3 Main Theme',
  uri: 'spotify:track:59NB4aFUAVG4lM6p7jsEas',
  album: {
    name: 'Battlefield 3 (Original Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273992d6894cd6070675e95293a',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02992d6894cd6070675e95293a',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851992d6894cd6070675e95293a',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Chris Tilton', id: '0E7PdEWOAW6t5k9qKSwQxF' }],
  duration_ms: 171000,
  name: 'SimCity Theme',
  uri: 'spotify:track:2vzCxP3IMGU7STu52lH4SO',
  album: {
    name: 'SimCity (EA Games Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273185e1b490b34bde66890e57e',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02185e1b490b34bde66890e57e',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851185e1b490b34bde66890e57e',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Hyper Hippo Entertainment', id: '6pZ3WW7sRBVUyEerDPHWwC' }],
  duration_ms: 103783,
  name: 'Earth',
  uri: 'spotify:track:5XDwfKUVSKccsJ9R04H0nn',
  album: {
    name: 'AdVenture Capitalist (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273f982e6507224409a8867c01a',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02f982e6507224409a8867c01a',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851f982e6507224409a8867c01a',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}]

const duplicatedTracks: Track[] = [{
  artists: [{ name: 'Michael Hunter', id: '4J86DBDnC5acWsN0dpZe3j' }],
  duration_ms: 171486,
  name: 'Soviet Connection — The Theme from Grand Theft Auto IV',
  uri: 'spotify:track:5AAXvrvpClghVZIvk5wPqf',
  album: {
    name: 'Grand Theft Auto IV — The Theme Song Collection',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273c7d910e948d40b7acb9e6682',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02c7d910e948d40b7acb9e6682',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851c7d910e948d40b7acb9e6682',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Kristofer Maddigan', id: '2jR6Lr47O21Iq7l5Bs2mig' }],
  duration_ms: 195720,
  name: 'Inkwell Isle One',
  uri: 'spotify:track:6UehmCQPTPaZk5R0VXQ5eE',
  album: {
    name: 'Cuphead (Original Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27305ded1194cfefa65af276a4e',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e0205ded1194cfefa65af276a4e',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d0000485105ded1194cfefa65af276a4e',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'DM DOKURO', id: '2NHvG0lx27x07cSzMn51KO' }],
  duration_ms: 274602,
  name: 'Infestation',
  uri: 'spotify:track:47Yh3jaeUdh3RUr9NJ2kEj',
  album: {
    name: 'The Tale of a Cruel World (Calamity Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273dcb364df5080fead36fe203f',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02dcb364df5080fead36fe203f',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851dcb364df5080fead36fe203f',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'George Strezov', id: '2DNnA9F0OrEmC80UWEwrMi' }],
  duration_ms: 162089,
  name: 'Main Theme',
  uri: 'spotify:track:4z5ZHzM6xWdEFr5QaHyI3m',
  album: {
    name: 'Surviving Mars (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273431f5b74fc9b61de1901257b',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02431f5b74fc9b61de1901257b',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851431f5b74fc9b61de1901257b',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Arnaud Roy', id: '4DfwOelzJtTBZiXZ1tYo8D' }],
  duration_ms: 292339,
  name: 'Humankind (Main Title)',
  uri: 'spotify:track:2rb690OnU63OkRm3KN0tPs',
  album: {
    name: 'HUMANKIND (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273cc79adc7950154d10cd9960d',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02cc79adc7950154d10cd9960d',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851cc79adc7950154d10cd9960d',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [
    { name: 'Johan Skugge', id: '0cxIE0a4SKHitNEvJ9rAXm' },
    { name: 'Jukka Rintamäki', id: '0vEK9IIbyIKeoQiN1NvEbC' },
  ],
  duration_ms: 115986,
  name: 'Battlefield 3 Main Theme',
  uri: 'spotify:track:59NB4aFUAVG4lM6p7jsEas',
  album: {
    name: 'Battlefield 3 (Original Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273992d6894cd6070675e95293a',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02992d6894cd6070675e95293a',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851992d6894cd6070675e95293a',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Chris Tilton', id: '0E7PdEWOAW6t5k9qKSwQxF' }],
  duration_ms: 171000,
  name: 'SimCity Theme',
  uri: 'spotify:track:2vzCxP3IMGU7STu52lH4SO',
  album: {
    name: 'SimCity (EA Games Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273185e1b490b34bde66890e57e',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02185e1b490b34bde66890e57e',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851185e1b490b34bde66890e57e',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Hyper Hippo Entertainment', id: '6pZ3WW7sRBVUyEerDPHWwC' }],
  duration_ms: 103783,
  name: 'Earth',
  uri: 'spotify:track:5XDwfKUVSKccsJ9R04H0nn',
  album: {
    name: 'AdVenture Capitalist (Original Game Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273f982e6507224409a8867c01a',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02f982e6507224409a8867c01a',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851f982e6507224409a8867c01a',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Michael Hunter', id: '4J86DBDnC5acWsN0dpZe3j' }],
  duration_ms: 171486,
  name: 'Soviet Connection — The Theme from Grand Theft Auto IV',
  uri: 'spotify:track:5AAXvrvpClghVZIvk5wPqf',
  album: {
    name: 'Grand Theft Auto IV — The Theme Song Collection',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273c7d910e948d40b7acb9e6682',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02c7d910e948d40b7acb9e6682',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851c7d910e948d40b7acb9e6682',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Kristofer Maddigan', id: '2jR6Lr47O21Iq7l5Bs2mig' }],
  duration_ms: 195720,
  name: 'Inkwell Isle One',
  uri: 'spotify:track:6UehmCQPTPaZk5R0VXQ5eE',
  album: {
    name: 'Cuphead (Original Soundtrack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27305ded1194cfefa65af276a4e',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e0205ded1194cfefa65af276a4e',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d0000485105ded1194cfefa65af276a4e',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}, {
  artists: [{ name: 'Michael Hunter', id: '4J86DBDnC5acWsN0dpZe3j' }],
  duration_ms: 171486,
  name: 'Soviet Connection — The Theme from Grand Theft Auto IV',
  uri: 'spotify:track:5AAXvrvpClghVZIvk5wPqf',
  album: {
    name: 'Grand Theft Auto IV — The Theme Song Collection',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273c7d910e948d40b7acb9e6682',
        height: 640,
        width: 640,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02c7d910e948d40b7acb9e6682',
        height: 300,
        width: 300,
      },
      {
        url: 'https://i.scdn.co/image/ab67616d00004851c7d910e948d40b7acb9e6682',
        height: 64,
        width: 64,
      },
    ],
  },
  preview_url: 'https://p.scdn.co/mp3-preview/8eac33a173cab23887351e37de248c5ef8aa4962?cid=090ef6814927448cb1a093339513c594',
}]

describe('removeDuplicatedTracks', () => {
  it('should return same array given no duplicated tracks', () => {
    expect(removeDuplicatedTracks(rawTracks)).toEqual(rawTracks)
  })

  it('should return tracks without duplicates given duplicated tracks', () => {
    expect(removeDuplicatedTracks(duplicatedTracks)).toEqual(rawTracks)
  })
})
