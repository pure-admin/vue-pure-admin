<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left" @click="backHome">
      <i class="fa fa-optin-monster"></i>
      <h4>{{ settings.title }}</h4>
    </div>
    <el-menu
      :default-active="activeMenu"
      unique-opened
      router
      class="horizontal-header-menu"
      mode="horizontal"
      @select="menuSelect"
    >
      <sidebar-item
        v-for="route in routeStore.wholeRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 全屏 -->
      <screenfull v-show="!deviceDetection()" />
      <!-- 国际化 -->
      <iconinternationality />
      <!-- <i class="iconfont team-iconinternationality"></i> -->
      <!-- <div
        v-show="!deviceDetection()"
        class="inter"
        :title="currentLocale ? '中文' : 'English'"
        @click="toggleLang"
      >
        <img :src="currentLocale ? ch : en" />
      </div> -->

      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
          />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-switch-button" @click="logout">{{
              $t("message.hsLoginOut")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <i
        class="el-icon-setting"
        :title="$t('message.hssystemSet')"
        @click="onPanel"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  unref,
  watch,
  getCurrentInstance,
  onBeforeMount,
  onMounted
} from "vue";
import { split } from "lodash-es";
import { useI18n } from "vue-i18n";
import settings from "/@/settings";
import { emitter } from "/@/utils/mitt";
import { createLink } from "/@/utils/link";
import SidebarItem from "./sidebarItem.vue";
import { algorithm } from "/@/utils/algorithm";
import { storageLocal } from "/@/utils/storage";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import iconinternationality from "/@/assets/svg/iconinternationality.svg";

let routerArrays: Array<object> = [
  {
    path: "/welcome",
    parentPath: "/",
    meta: {
      title: "message.hshome",
      icon: "el-icon-s-home",
      showLink: true,
      savedPosition: false
    }
  }
];
export default defineComponent({
  name: "sidebar",
  components: { SidebarItem, screenfull, iconinternationality },
  // @ts-ignore
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    currentLocale() {
      if (
        !this.$storage.routesInStorage ||
        this.$storage.routesInStorage.length === 0
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$storage.routesInStorage = routerArrays;
      }

      if (!this.$storage.locale) {
        // eslint-disable-next-line
        this.$storage.locale = { locale: "zh" };
        useI18n().locale.value = "zh";
      }
      switch (this.$storage.locale?.locale) {
        case "zh":
          return true;
        case "en":
          return false;
      }
    }
  },
  setup() {
    const instance =
      getCurrentInstance().appContext.config.globalProperties.$storage;
    const routeStore = usePermissionStoreHook();

    const router = useRouter().options.routes;

    const route = useRoute();

    let usename = storageSession.getItem("info")?.username;

    const { locale, t } = useI18n();
    // 国际化语言切换
    const toggleLang = (): void => {
      switch (instance.locale.locale) {
        case "zh":
          instance.locale = { locale: "en" };
          locale.value = "en";
          break;
        case "en":
          instance.locale = { locale: "zh" };
          locale.value = "zh";
          break;
      }
    };
    watch(
      () => locale.value,
      () => {
        //@ts-ignore
        // 动态title
        document.title = t(unref(route.meta.title));
      }
    );
    // 退出登录
    const logout = (): void => {
      storageSession.removeItem("info");
      router.push("/login");
    };

    function onPanel() {
      emitter.emit("openPanel");
    }

    onMounted(() => {
      document
        .querySelector(".el-dropdown__popper")
        ?.setAttribute("class", "resetTop");
      document
        .querySelector(".el-popper__arrow")
        ?.setAttribute("class", "hidden");
    });
    const showLogo = ref(storageLocal.getItem("logoVal") || "1");

    const activeMenu = computed(() => {
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });

    const menuSelect = (indexPath: string): void => {
      // 如果路由包含http 则是超链接 反之是普通路由
      if (indexPath.includes("http")) {
        createLink(`http${split(indexPath, "http")[1]}`);
      } else {
        let parentPath = "";
        let parentPathIndex = indexPath.lastIndexOf("/");
        if (parentPathIndex > 0) {
          parentPath = indexPath.slice(0, parentPathIndex);
        }
        // 找到当前路由的信息
        // eslint-disable-next-line no-inner-declarations
        function findCurrentRoute(routes) {
          return routes.map(item => {
            if (item.path === indexPath) {
              // 切换左侧菜单 通知标签页
              emitter.emit("changLayoutRoute", {
                indexPath,
                parentPath
              });
            } else {
              if (item.children) findCurrentRoute(item.children);
            }
          });
        }
        findCurrentRoute(algorithm.increaseIndexes(router));
      }
    };

    function backHome() {
      router.push("/welcome");
    }

    onBeforeMount(() => {
      emitter.on("logoChange", key => {
        showLogo.value = key;
      });
    });

    return {
      activeMenu,
      menuSelect,
      showLogo,
      routeStore,
      usename,
      toggleLang,
      logout,
      onPanel,
      deviceDetection,
      settings,
      backHome
    };
  }
});
</script>

<style lang="scss" scoped>
// single element-plus reset
.el-dropdown-menu__item {
  padding: 0 10px;
}

.el-dropdown-menu {
  padding: 6px 0;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #606266;
  background: #f0f0f0;
}
</style>
