import type { Directive } from "vue";
import type { CopyEl } from "../src/directives/copy/index";

declare module "vue" {
  export interface ComponentCustomProperties {
    vLoading: Directive<Element, boolean>;
    vAuth: Directive<HTMLElement, string | Array<string>>;
    vCopy: Directive<CopyEl, string>;
    vLongpress: Directive<HTMLElement, Function>;
  }
}

export {};
