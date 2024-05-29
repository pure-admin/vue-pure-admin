import { hasAuth } from "@/router/utils";
import type { Directive, DirectiveBinding } from "vue";

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding;
    if (value) {
      !hasAuth(value) && el.parentNode?.removeChild(el);
    } else {
      throw new Error(
        "[Directive: auth]: need auths! Like v-auth=\"['btn.add','btn.edit']\""
      );
    }
  }
};
