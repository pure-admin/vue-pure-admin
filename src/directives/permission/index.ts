import { usePermissionStoreHook } from "/@/store/modules/permission";
import { Directive } from "vue";

export const auth: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    if (value) {
      const authRoles = value;
      const hasAuth = usePermissionStoreHook().buttonAuth.includes(authRoles);
      if (!hasAuth) {
        el.style.display = "none";
      }
    } else {
      throw new Error("need roles! Like v-auth=\"['admin','test']\"");
    }
  }
};
