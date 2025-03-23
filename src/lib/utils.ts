import type { ClassValue } from 'clsx'
// import type { Updater } from '@tanstack/vue-table'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cssNumberishToInt(value: CSSNumberish | null) {
  return Number.parseInt(value?.toString() ?? '0')
}

// export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
//   ref.value
//     = typeof updaterOrValue === 'function'
//       ? updaterOrValue(ref.value)
//       : updaterOrValue
// }
