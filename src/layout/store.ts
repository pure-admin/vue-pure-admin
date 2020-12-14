import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";

export function useMapGetters<T extends string>(keys: T[]) {
  const res: Record<string, ComputedRef> = {}
  // @ts-ignore
  const { getters } = useStore()
  keys.map(key => {
    if (Reflect.has(getters, key)) {
      res[key] = computed(() => getters[key])
    }
  })
  return res as any as Record<T, ComputedRef>
}