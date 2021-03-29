
import { http } from "../utils/http"

export const mapJson = (data?: object): any => {
  return http.request("get", "/getMapInfo", data)
}