import { getCurrentInstance } from 'vue'

export const useConfig = (): any => {
  return getCurrentInstance()?.appContext.config.globalProperties
}