export const LOCAL_STORAGE = {
  VOLUME: 'volume',
  AUTOPLAY: 'autoplay',
  NICKNAME: 'nickname',
  PLAY_ANIMATIONS: 'play_animations',
  DISPLAY_VISUALIZER: 'display_visualizer',
  SAVED_COVERS: 'saved_covers',
} as const

export const DEFAULT_COVER = {
  name: '',
  color: '#BA1C1C',
  title: {
    value: 'Title',
    fontSize: 0.1125,
    radius: 0.8125,
    offsetCorrection: 0,
    italic: false,
  },
  subtitle: {
    value: 'Subtitle',
    fontSize: 0.05,
    radius: 0.6,
    offsetCorrection: 0,
    italic: true,
  },
  example: {
    value: 'Subsubtitle',
    fontSize: 0.045,
    radius: 0.35,
    offsetCorrection: 0,
    italic: true,
  },
  type: {
    value: 'Footer',
    fontSize: 0.04,
    radius: 0.1,
    offsetCorrection: 0,
    italic: false,
  },
}

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
  XL = 1280,
  XL2 = 1536,
}
