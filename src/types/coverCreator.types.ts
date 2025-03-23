export interface CoverMetadata {
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
}

export interface Cover {
  name: string
  color: string
  title: {
    value: any
    offsetCorrection: any
  }
  subtitle: {
    value: any
    offsetCorrection: any
  }
  example: {
    value: any
    offsetCorrection: any
  }
  type: {
    value: any
    offsetCorrection: any
  }
}
