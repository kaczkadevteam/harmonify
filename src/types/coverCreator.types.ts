export interface CurvedText {
  value: string
  fontSize: number
  radius: number
  offsetCorrection: number
}

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
  title: CurvedText
  subtitle: CurvedText
  example: CurvedText
  type: CurvedText
}
