import _ReNormalCountTo from "./src/normal";
import _ReboundCountTo from "./src/rebound";
import { withInstall } from "@pureadmin/utils";

/** 普通数字动画组件 */
const ReNormalCountTo = withInstall(_ReNormalCountTo);

/** 回弹式数字动画组件 */
const ReboundCountTo = withInstall(_ReboundCountTo);

export { ReNormalCountTo, ReboundCountTo };
