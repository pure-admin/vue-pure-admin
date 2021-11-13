/** 兼容fontawesome4和5版本
 * 4版本: www.fontawesome.com.cn/faicons/
 * 5版本：https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free
 * https://github.com/FortAwesome/vue-fontawesome
 */
import { App } from "vue";
import "font-awesome/css/font-awesome.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export function useFontawesome(app: App) {
  library.add(faUserSecret);
  app.component("font-awesome-icon", FontAwesomeIcon);
}
