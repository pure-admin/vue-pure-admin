<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      :unique-opened="false"
      active-text-color="#409EFF"
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
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SidebarItem from "./SidebarItem.vue";
import { algorithm } from "../../../utils/algorithm";
import { useDynamicRoutesHook } from "../tag/tagsHook";

export default defineComponent({
  name: "sidebar",
  components: { SidebarItem },
  setup() {
    const router = useRouter().options.routes;

    const store = useStore();

    const route = useRoute();

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
      dynamicRouteTags(indexPath, parentPath);
    };

    return {
      routes: computed(() => algorithm.increaseIndexes(router)),
      activeMenu,
      isCollapse: computed(() => !store.getters.sidebar.opened),
      menuSelect,
    };
  },
});
</script>
