<script setup lang="ts">
import path from "path";
import AppLink from "./link.vue";
import { PropType, ref } from "vue";
import { isUrl } from "/@/utils/is";
import { RouteRecordRaw } from "vue-router";

// type RouteRecordRaw = {
//   hidden?: boolean;
// };

const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

type childrenType = {
  path?: string;
  noShowingChildren?: boolean;
  children?: RouteRecordRaw[];
  meta?: {
    icon?: string;
    title?: string;
  };
};

const onlyOneChild = ref<RouteRecordRaw | childrenType>({} as any);

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
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  if (isUrl(routePath)) {
    return routePath;
  }
  if (isUrl(this.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
}
</script>

<template>
  <template
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
      !props.item.alwaysShow
    "
  >
    <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <i
          :class="
            onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)
          "
        />
        <template #title>
          <span>{{ $t(onlyOneChild.meta.title) }}</span>
        </template>
      </el-menu-item>
    </app-link>
  </template>

  <el-sub-menu
    v-else
    ref="subMenu"
    :index="resolvePath(props.item.path)"
    popper-append-to-body
  >
    <template #title>
      <i :class="props.item.meta.icon"></i>
      <span>{{ $t(props.item.meta.title) }}</span>
    </template>
    <sidebar-item
      v-for="child in props.item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>
