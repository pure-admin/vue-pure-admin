import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import mapMock from '../mock/map'

export const mockModules = [...mapMock]

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
