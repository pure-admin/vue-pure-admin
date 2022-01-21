import { App, defineComponent } from "vue";
import icon from "./src/Icon.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import iconifyIconOffline from "./src/iconifyIconOffline";
import iconifyIconOnline from "./src/iconifyIconOnline";

/**
 * find icon component
 * @param icon icon图标
 * @returns component
 */
export function findIconReg(icon: string) {
  // fontawesome4
  const fa4Reg = /^fa-/;
  // fontawesome5+
  const fa5Reg = /^FA-/;
  // iconfont
  const iFReg = /^IF-/;
  // remixicon
  const riReg = /^RI-/;
  // typeof icon === "function" 属于SVG
  if (fa5Reg.test(icon)) {
    const text = icon.split(fa5Reg)[1];
    return findIcon(
      text.slice(0, text.indexOf(" ") == -1 ? text.length : text.indexOf(" ")),
      "FA",
      text.slice(text.indexOf(" ") + 1, text.length)
    );
  } else if (fa4Reg.test(icon)) {
    return findIcon(icon.split(fa4Reg)[1], "fa");
  } else if (iFReg.test(icon)) {
    return findIcon(icon.split(iFReg)[1], "IF");
  } else if (typeof icon === "function") {
    return findIcon(icon, "SVG");
  } else if (riReg.test(icon)) {
    return findIcon(icon.split(riReg)[1], "RI");
  } else {
    return findIcon(icon, "EL");
  }
}

// 支持fontawesome、iconfont、remixicon、element-plus/icons、自定义svg
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
  } else if (type === "fa") {
    return defineComponent({
      name: "faIcon",
      data() {
        return { icon: `fa ${icon}` };
      },
      template: `<i :class="icon" />`
    });
  } else if (type === "IF") {
    return defineComponent({
      name: "IfIcon",
      data() {
        return { icon: `iconfont ${icon}` };
      },
      template: `<i :class="icon" />`
    });
  } else if (type === "RI") {
    return defineComponent({
      name: "RiIcon",
      data() {
        return { icon: `ri-${icon}` };
      },
      template: `<i :class="icon" />`
    });
  } else if (type === "EL") {
    return defineComponent({
      name: "ElIcon",
      data() {
        return { icon };
      },
      template: `<IconifyIconOffline :icon="icon" />`
    });
  } else if (type === "SVG") {
    return icon;
  }
}

export const Icon = Object.assign(icon, {
  install(app: App) {
    app.component(icon.name, icon);
  }
});

export const IconifyIconOffline = iconifyIconOffline;
export const IconifyIconOnline = iconifyIconOnline;

export default {
  Icon,
  IconifyIconOffline,
  IconifyIconOnline
};
