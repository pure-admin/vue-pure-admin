import { RouteLocationNormalized } from "vue-router";

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    roles: Array<string>;
    keepAlive?: boolean;
    dynamicLevel?: string;
  };
}
