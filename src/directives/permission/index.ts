import router from "/@/router";
import { Directive, type DirectiveBinding } from "vue";
import { isString, isIncludeAllChildren } from "@pureadmin/utils";

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
      const metaPermissions = router.currentRoute.value.meta
        .permissions as Array<string>;

      /** 兼容传`字符串`或`字符串数组`两种写法
       *  字符串写法例子：v-permission="'btn.add'"
       *  字符串数组写法例子：v-permission="['btn.add','btn.edit']"
       */
      const hasPermissions = isString(value)
        ? metaPermissions.includes(value)
        : isIncludeAllChildren(value, metaPermissions);

      if (!hasPermissions) {
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(
        "need permissions! Like v-permission=\"['btn.add','btn.edit']\""
      );
    }
  }
};
