<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <i :class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          <template #title>
            <span>{{ $t(onlyOneChild.meta.title) }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <i :class="item.meta.icon"></i>
        <span>{{ $t(item.meta.title) }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from "path";
import AppLink from "./Link.vue";
import { defineComponent, PropType, ref } from "vue";
import { RouteRecordRaw } from "vue-router";
import { isUrl } from "/@/utils/is.ts";

export default defineComponent({
  name: "SidebarItem",
  components: { AppLink },
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const onlyOneChild = ref<RouteRecordRaw>({} as any);

    function hasOneShowingChild(
      children: RouteRecordRaw[] = [],
      parent: RouteRecordRaw
    ) {
      const showingChildren = children.filter((item: any) => {
        if (item.hidden) {
          // 不显示hidden属性为true的菜单
          return false;
        } else {
          onlyOneChild.value = item;
          return true;
        }
      });

      if (showingChildren.length === 1) {
        return true;
      }

      if (showingChildren.length === 0) {
        // @ts-ignore
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    }

    // const resolvePath = (routePath: string) => {
    //   return path.resolve(props.basePath, routePath);
    // };

    function resolvePath(routePath) {
      if (isUrl(routePath)) {
        return routePath;
      }
      if (isUrl(this.basePath)) {
        return props.basePath;
      }
      // @ts-ignore
      return path.resolve(props.basePath, routePath);
    }

    return { hasOneShowingChild, resolvePath, onlyOneChild };
  }
});
</script>
