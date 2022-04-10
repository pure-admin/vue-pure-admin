import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";

const modules = import.meta.globEager("../mock/*.ts");
const mockModules = [];

Object.keys(modules).forEach(key => {
  mockModules.push(...modules[key].default);
});

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
