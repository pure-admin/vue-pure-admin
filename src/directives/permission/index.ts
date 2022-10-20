import { isEqual } from "@pureadmin/utils";
import { Directive, type DirectiveBinding } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      const authRoles = value;

      /** 兼容传`字符串`或`字符串数组`两种写法
       *  字符串写法例子：v-auth="'btn.add'"
       *  字符串数组写法例子：v-auth="['btn.add','btn.edit']"
       */
      const hasAuth = isEqual(
        usePermissionStoreHook().permissions,
        [authRoles].flat(Infinity)
      );

      if (!hasAuth) {
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(
        "need permissions! Like v-auth=\"['btn.add','btn.edit']\""
      );
    }
  }
};
