export interface CurvedText {
  value: string
  fontSize: number
  radius: number
  offsetCorrection: number
  italic: boolean
}

export interface Cover {
  id?: `${string}-${string}-${string}-${string}-${string}`
  name: string
  color: string
  title: CurvedText
  subtitle: CurvedText
  example: CurvedText
  type: CurvedText
}
