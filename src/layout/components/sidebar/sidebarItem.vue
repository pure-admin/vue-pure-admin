<script setup lang="ts">
import path from "path";
import { PropType, ref } from "vue";
import { childrenType } from "../../types";
import Icon from "/@/components/ReIcon/src/Icon.vue";

const props = defineProps({
  item: {
    type: Object as PropType<childrenType>
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

const onlyOneChild: childrenType = ref(null);

function hasOneShowingChild(
  children: childrenType[] = [],
  parent: childrenType
) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
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
  return path.resolve(props.basePath, routePath);
}
</script>

<template>
  <template
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
  >
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
        <Icon
          v-if="onlyOneChild.meta.extraIcon"
          :svg="onlyOneChild.meta.extraIcon.svg ? true : false"
          :content="`${onlyOneChild.meta.extraIcon.name}`"
        />
      </template>
    </el-menu-item>
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
      <Icon
        v-if="props.item.meta.extraIcon"
        :svg="props.item.meta.extraIcon.svg ? true : false"
        :content="`${props.item.meta.extraIcon.name}`"
      />
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
