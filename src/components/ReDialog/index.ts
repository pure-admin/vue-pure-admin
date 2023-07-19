import _ReDialog from "./src/index.vue";
import { withInstall } from "@pureadmin/utils";
export * from "./src/type";
export * from "./src";

/** 千万别忘了在下面这三处引入并注册下，放心注册，不使用`addDialog`调用就不会被挂载
 * https://github.com/pure-admin/vue-pure-admin/blob/main/src/App.vue#L4
 * https://github.com/pure-admin/vue-pure-admin/blob/main/src/App.vue#L13
 * https://github.com/pure-admin/vue-pure-admin/blob/main/src/App.vue#L18
 */
const ReDialog = withInstall(_ReDialog);

export { ReDialog };
