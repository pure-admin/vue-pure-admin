<template>
  <div :class="{'has-logo': showLogo}">
    <Logo v-if="showLogo === '1'" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        :collapse-transition="false"
        mode="vertical"
        @select="menuSelect"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  unref,
  nextTick,
  onBeforeMount
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SidebarItem from "./SidebarItem.vue";
import { algorithm } from "../../../utils/algorithm";
import { useDynamicRoutesHook } from "../tag/tagsHook";
import { emitter } from "/@/utils/mitt";
import Logo from "./Logo.vue";
import { storageLocal } from "/@/utils/storage";

export default defineComponent({
  name: "sidebar",
  components: { SidebarItem, Logo },
  setup() {
    const router = useRouter().options.routes;

    const store = useStore();

    const route = useRoute();

    const showLogo = ref(storageLocal.getItem("logoVal") || "1");

    const activeMenu = computed(() => {
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });

    const { dynamicRouteTags } = useDynamicRoutesHook();

    const menuSelect = (indexPath: string): void => {
      let parentPath = "";
      let parentPathIndex = indexPath.lastIndexOf("/");
      if (parentPathIndex > 0) {
        parentPath = indexPath.slice(0, parentPathIndex);
      }
      // 找到当前路由的信息
      function findCurrentRoute(routes) {
        return routes.map((item, key) => {
          if (item.path === indexPath) {
            dynamicRouteTags(indexPath, parentPath, item);
          } else {
            if (item.children) findCurrentRoute(item.children);
          }
        });
        return;
      }
      findCurrentRoute(algorithm.increaseIndexes(router));
      emitter.emit("changLayoutRoute", indexPath);
    };

    onBeforeMount(() => {
      emitter.on("logoChange", key => {
        showLogo.value = key;
      });
    });

    return {
      routes: computed(() => algorithm.increaseIndexes(router)),
      activeMenu,
      isCollapse: computed(() => !store.getters.sidebar.opened),
      menuSelect,
      showLogo
    };
  }
});
</script>
