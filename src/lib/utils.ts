import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cssNumberishToInt(value: CSSNumberish | null) {
  return Number.parseInt(value?.toString() ?? '0')
}
