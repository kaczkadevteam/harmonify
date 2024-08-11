export const LOCAL_STORAGE = {
  VOLUME: 'volume',
  AUTOPLAY: 'autoplay',
  NICKNAME: 'nickname',
  PLAY_ANIMATIONS: 'play_animations',
} as const

export enum AnimationDuration {
  D200 = 200,
  D500 = 500,
  D800 = 800,
  D1000 = 1000,
  D1500 = 1500,
  D2000 = 2000,
}

export enum Breakpoint {
  SM = 640,
  MD = 768,
  LG = 1024,
}

const COVERS_BASE = {
  superheroes1: {
    hue: 0, // red-700
    saturation: 74,
    lightness: 42,
    title: 'Superheroes #1',
    titleOffset: -5,
    subtitle: 'Best-known superhero themes',
    subtitleOffset: 5,
    example: 'e.g. Dark Knight',
    exampleOffset: 15,
  },
  superheroes2: {
    hue: 0,
    saturation: 70,
    lightness: 35,
    title: 'Superheroes #2',
    titleOffset: -10,
    subtitle: 'Lesser-known themes from Marvel',
    subtitleOffset: 10,
    example: 'e.g. Ant-Man',
    exampleOffset: 5,
  },
  liveAction1: {
    hue: 21,
    saturation: 90,
    lightness: 48,
    title: 'Live Action #1',
    titleOffset: 25,
    subtitle: 'Themes from XXI century live action hits',
    subtitleOffset: 50,
    example: 'e.g. Harry Potter',
    exampleOffset: 25,
  },
  liveAction2: {
    hue: 17,
    saturation: 88,
    lightness: 40,
    title: 'Live Action #2',
    titleOffset: 25,
    subtitle: 'Lesser-known themes from modern movies', // Lesser-known themes from XXI century live action
    subtitleOffset: 50,
    example: 'e.g. Blade Runner 2049',
    exampleOffset: 25,
  },
  liveAction3: {
    hue: 15,
    saturation: 79,
    lightness: 34,
    title: 'Live Action #3',
    titleOffset: 25,
    subtitle: 'Custom selection of modern movies themes',
    subtitleOffset: 50,
    example: 'e.g. Knives Out',
    exampleOffset: 25,
  },
  classics1: {
    hue: 41,
    saturation: 96,
    lightness: 40,
    title: 'Classics #1',
    titleOffset: 25,
    subtitle: 'XX century movie themes known by everyone',
    subtitleOffset: 25,
    example: 'e.g. Indiana Jones',
    exampleOffset: 25,
  },
  classics2: {
    hue: 35, // yellow-700
    saturation: 92,
    lightness: 33,
    title: 'Classics #2',
    titleOffset: 20,
    subtitle: 'Lesser-known themes of XX century movies',
    subtitleOffset: 25,
    example: 'e.g. Truman Show',
    exampleOffset: 25,
  },
  tv1: {
    hue: 142,
    saturation: 76,
    lightness: 32,
    title: 'Tv Series #1',
    titleOffset: 20,
    subtitle: 'Even if you missed it, you heard its theme',
    subtitleOffset: 60,
    example: 'e.g. Game of Thrones',
    exampleOffset: 15,
  },
  tv2: {
    hue: 142,
    saturation: 64,
    lightness: 24,
    title: 'Tv Series #2',
    titleOffset: 20,
    subtitle: 'Themes from 2020s series',
    subtitleOffset: 15,
    example: 'e.g. 3 Body Problem',
    exampleOffset: 15,
  },
  dreamworks: {
    hue: 192,
    saturation: 91,
    lightness: 37,
    title: 'Dreamworks',
    titleOffset: -45,
    subtitle: 'Themes from Dreamworks films',
    subtitleOffset: 5,
    example: 'e.g. Kung Fu Panda',
    exampleOffset: 15,
  },
  pixar: {
    hue: 200,
    saturation: 98,
    lightness: 39,
    title: 'Pixar',
    titleOffset: 10,
    subtitle: 'Themes from Pixar films',
    subtitleOffset: 20,
    example: 'e.g. Toy Story',
    exampleOffset: 20,
  },
  disney: {
    hue: 221,
    saturation: 83,
    lightness: 53,
    title: 'Disney',
    titleOffset: -10,
    subtitle: 'Themes from Disney animated films',
    subtitleOffset: 15,
    example: 'e.g. The Lion King',
    exampleOffset: 20,
  },
  animated: {
    hue: 243,
    saturation: 75,
    lightness: 59,
    lightnessOffset: 5,
    title: 'Animated',
    titleOffset: -20,
    subtitle: 'Neither Disney, Pixar nor Dreamworks',
    subtitleOffset: 30,
    example: 'e.g. Spider-Man: Into the Spider-Verse',
    exampleOffset: 35,
  },
  anime: {
    hue: 263,
    saturation: 70,
    lightness: 50,
    title: 'Anime',
    titleOffset: -20,
    subtitle: 'Themes from Japanese anime',
    subtitleOffset: 0,
    example: 'e.g. Death Note',
    exampleOffset: 10,
  },
  memes: {
    hue: 0,
    saturation: 70,
    lightness: 40,
    title: 'XD',
    subtitle: 'What is this?',
    example: 'You really think I will tell you?',
  },
}

export type COVERS_KEYS = keyof typeof COVERS_BASE

export const COVERS: Record<COVERS_KEYS, {
  hue: number
  saturation: number
  lightness: number
  title: string
  titleOffset?: number
  subtitle: string
  subtitleOffset?: number
  example: string
  exampleOffset?: number
  lightnessOffset?: number
}> = COVERS_BASE
