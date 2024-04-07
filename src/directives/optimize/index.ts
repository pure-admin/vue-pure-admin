import {
  isArray,
  throttle,
  debounce,
  isObject,
  isFunction
} from "@pureadmin/utils";
import { useEventListener } from "@vueuse/core";
import type { Directive, DirectiveBinding } from "vue";

/** 防抖（v-optimize或v-optimize:debounce）、节流（v-optimize:throttle）指令 */
export const optimize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const optimizeType = binding.arg ?? "debounce";
    const type = ["debounce", "throttle"].find(t => t === optimizeType);
    if (type) {
      if (value && value.event && isFunction(value.fn)) {
        let params = value?.params;
        if (params) {
          if (isArray(params) || isObject(params)) {
            params = isObject(params) ? Array.of(params) : params;
          } else {
            throw new Error(
              "[Directive: optimize]: `params` must be an array or object"
            );
          }
        }
        // Register using addEventListener on mounted, and removeEventListener automatically on unmounted
        useEventListener(
          el,
          value.event,
          type === "debounce"
            ? debounce(
                params ? () => value.fn(...params) : value.fn,
                value?.timeout ?? 200,
                value?.immediate ?? false
              )
            : throttle(
                params ? () => value.fn(...params) : value.fn,
                value?.timeout ?? 1000
              )
        );
      } else {
        throw new Error(
          "[Directive: optimize]: `event` and `fn` are required, and `fn` must be a function"
        );
      }
    } else {
      throw new Error(
        "[Directive: optimize]: only `debounce` and `throttle` are supported"
      );
    }
  }
};
