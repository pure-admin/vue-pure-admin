import { App, defineComponent } from "vue";
import icon from "./src/Icon.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { iconComponents } from "/@/plugins/element-plus";

export const Icon = Object.assign(icon, {
  install(app: App) {
    app.component(icon.name, icon);
  }
});

export default {
  Icon
};
/**
 * find icon component
 * @param icon icon图标
 * @returns component
 */
export function findIconReg(icon: string) {
  const faReg = /^fa-/;
  if (faReg.test(icon)) {
    return findIcon(icon.split(faReg)[1]);
  } else {
    return findIcon(icon, false);
  }
}
export function findIcon(icon: String, isFa: Boolean = true) {
  if (isFa) {
    return defineComponent({
      name: "FaIcon",
      data() {
        return { icon: icon };
      },
      components: { FontAwesomeIcon },
      template: `<font-awesome-icon :icon="icon" />`
    });
  } else {
    const components = iconComponents.filter(
      component => component.name === icon
    );
    if (components.length > 0) {
      return components[0];
    } else {
      return null;
    }
  }
}
