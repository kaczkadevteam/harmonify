import { describe, expect, it } from 'vitest'
import { addGuessToTracks, removeDuplicatedTracks, selectRandomlyTracks, trackIntoGuessString } from '../track'

const rawTracks = [{
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
}]

const tracksWithGuesses = [{
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
  guess:
              'Soviet Connection — The Theme from Grand Theft Auto IV - Michael Hunter - Grand Theft Auto IV — The Theme Song Collection',
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
  guess: 'Inkwell Isle One - Kristofer Maddigan - Cuphead (Original Soundtrack)',
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
  guess:
              'Infestation - DM DOKURO - The Tale of a Cruel World (Calamity Original Game Soundtrack)',
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
  guess:
              'Main Theme - George Strezov - Surviving Mars (Original Game Soundtrack)',
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
  guess:
              'Humankind (Main Title) - Arnaud Roy - HUMANKIND (Original Game Soundtrack)',
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
  guess:
              'Battlefield 3 Main Theme - Johan Skugge, Jukka Rintamäki - Battlefield 3 (Original Soundtrack)',
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
  guess: 'SimCity Theme - Chris Tilton - SimCity (EA Games Soundtrack)',
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
  guess:
              'Earth - Hyper Hippo Entertainment - AdVenture Capitalist (Original Game Soundtrack)',
}]

const duplicatedTracks = [{
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
}]

describe('trackIntoGuessString', () => {
  it('should return guess given track with one artist', () => {
    const track = {
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
    }

    expect(trackIntoGuessString(track)).toBe('Main Theme - George Strezov - Surviving Mars (Original Game Soundtrack)')
  })

  it('should return guess given track with multiple artists', () => {
    const track = {
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
    }

    expect(trackIntoGuessString(track)).toBe('Battlefield 3 Main Theme - Johan Skugge, Jukka Rintamäki - Battlefield 3 (Original Soundtrack)')
  })
})

describe('addGuessToTracks', () => {
  it('should return tracks with guesses given tracks without them', () => {
    expect(addGuessToTracks(rawTracks)).toEqual(tracksWithGuesses)
  })
})

describe('removeDuplicatedTracks', () => {
  it('should return same array given no duplicated tracks', () => {
    expect(removeDuplicatedTracks(rawTracks)).toEqual(rawTracks)
  })

  it('should return tracks without duplicates given duplicated tracks', () => {
    expect(removeDuplicatedTracks(duplicatedTracks)).toEqual(rawTracks)
  })
})

describe('selectRandomlyTracks', () => {
  it('should not duplicate tracks given count lower than tracks array length', () => {
    let noDuplicates = true

    for (let i = 0; i < 10; i++) {
      const selected = selectRandomlyTracks(rawTracks, 4)
      selected.forEach((t, i) => {
        if (selected.some((t2, i2) => t.uri === t2.uri && i !== i2))
          noDuplicates = false
      })
    }

    expect(noDuplicates).toBe(true)
  })

  it('should array of count length given count higher than tracks array length', () => {
    let noDuplicates = true

    const selected = selectRandomlyTracks(rawTracks, 10)
    selected.forEach((t, i) => {
      if (selected.some((t2, i2) => t.uri === t2.uri && i !== i2))
        noDuplicates = false
    })

    expect(noDuplicates).toBe(false)
    expect(selected.length).toBe(10)
  })
})
