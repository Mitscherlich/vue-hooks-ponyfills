import type { Ref } from 'vue-demi'
import { customRef, effect } from 'vue-demi'
import type { DeepReadonly } from '@m9ch/vhooks-types'

export const useMemo = <T>(fn: () => T, deps: any[] = []): DeepReadonly<Ref<T>> => {
  let value: T
  let dirty = true

  const runner = effect(() => [fn(), ...deps], {
    lazy: true,
    scheduler: () => {
      dirty = true // deps changed
    },
  })

  return customRef(track => ({
    get: () => {
      track()
      if (dirty) {
        [value] = runner()
        dirty = false
      }
      return value
    },
    set: () => {
      if (process.env.NODE_ENV === 'development') {
        // TODO: add warning
      }
    },
  }))
}