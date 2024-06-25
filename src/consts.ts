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
