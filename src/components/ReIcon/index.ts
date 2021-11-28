import { App, defineComponent } from "vue";
import icon from "./src/Icon.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { iconComponents } from "/@/plugins/element-plus";

/**
 * find icon component
 * @param icon icon图标
 * @returns component
 */
export function findIconReg(icon: string) {
  // fontawesome
  const faReg = /^FA-/;
  // iconfont
  const iFReg = /^IF-/;
  // typeof icon === "function" 属于SVG
  if (faReg.test(icon)) {
    const text = icon.split(faReg)[1];
    return findIcon(
      text.slice(0, text.indexOf(" ")),
      "FA",
      text.slice(text.indexOf(" ") + 1, text.length)
    );
  } else if (iFReg.test(icon)) {
    return findIcon(icon.split(iFReg)[1], "IF");
  } else if (typeof icon === "function") {
    return findIcon(icon, "SVG");
  } else {
    return findIcon(icon, "EL");
  }
}

// 支持fontawesome、iconfont、element-plus/icons、自定义svg
export function findIcon(icon: String, type = "EL", property?: string) {
  if (type === "FA") {
    return defineComponent({
      name: "FaIcon",
      setup() {
        return { icon, property };
      },
      components: { FontAwesomeIcon },
      template: `<font-awesome-icon :icon="icon" v-bind:[property]="true" />`
    });
  } else if (type === "IF") {
    return defineComponent({
      name: "IfIcon",
      data() {
        return { icon: `iconfont ${icon}` };
      },
      template: `<i :class="icon" />`
    });
  } else if (type === "EL") {
    const components = iconComponents.filter(
      component => component.name === icon
    );
    if (components.length > 0) {
      return components[0];
    } else {
      return null;
    }
  } else if (type === "SVG") {
    return icon;
  }
}

export const Icon = Object.assign(icon, {
  install(app: App) {
    app.component(icon.name, icon);
  }
});

export default {
  Icon
};
