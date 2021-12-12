import { RouteLocationNormalized } from "vue-router";

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    keepAlive: boolean;
    refreshRedirect: string;
    realPath: string;
  };
}
