/** 兼容fontawesome4和5版本
 * 4版本: www.fontawesome.com.cn/faicons/
 * 5版本：https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free
 * https://github.com/FortAwesome/vue-fontawesome
 */
import { App } from "vue";
import "font-awesome/css/font-awesome.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faCoffee,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// github.com/Remix-Design/RemixIcon/blob/master/README_CN.md#%E5%AE%89%E8%A3%85%E5%BC%95%E5%85%A5
import "remixicon/fonts/remixicon.css";

export function useFontawesome(app: App) {
  library.add(faUserSecret, faCoffee, faSpinner);
  app.component("font-awesome-icon", FontAwesomeIcon);
}
