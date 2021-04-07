import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import mapMock from '../mock/map'
import echartsMock from '../mock/echarts'

export const mockModules = [...mapMock, ...echartsMock]

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
