<script setup lang="ts">
import path from "path";
import { storageLocal } from "/@/utils/storage";
import { PropType, ref, nextTick } from "vue";
import { childrenType } from "../../types";
import Icon from "/@/components/ReIcon/src/Icon.vue";
const layout = ref(
  storageLocal.getItem("responsive-layout") || "vertical-dark"
);
const menuMode = layout.value.layout.split("-")[0] === "vertical";

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
// 存放菜单是否存在showTooltip属性标识
const hoverMenuMap = new WeakMap();
// 存储菜单文本dom元素
const menuTextRef = ref(null);

function hoverMenu(key) {
  // 如果当前菜单showTooltip属性已存在，退出计算
  if (hoverMenuMap.get(key)) return;

  nextTick(() => {
    // 如果文本内容的整体宽度大于其可视宽度，则文本溢出
    menuTextRef.value?.scrollWidth > menuTextRef.value?.clientWidth
      ? Object.assign(key, {
          showTooltip: true
        })
      : Object.assign(key, {
          showTooltip: false
        });

    hoverMenuMap.set(key, true);
  });
}

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
      style="display: flex; align-items: center"
    >
      <i
        v-show="props.item.meta.icon"
        :class="
          onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)
        "
      />
      <template #title>
        <div style="display: flex; align-items: center; overflow: hidden">
          <span v-if="!menuMode">{{ $t(onlyOneChild.meta.title) }}</span>
          <el-tooltip
            v-else
            placement="top"
            :offset="-10"
            :disabled="!onlyOneChild.showTooltip"
          >
            <template #content> {{ $t(onlyOneChild.meta.title) }} </template>
            <span
              ref="menuTextRef"
              style="overflow: hidden; text-overflow: ellipsis"
              @mouseover="hoverMenu(onlyOneChild)"
            >
              {{ $t(onlyOneChild.meta.title) }}
            </span>
          </el-tooltip>
          <Icon
            v-if="onlyOneChild.meta.extraIcon"
            :svg="onlyOneChild.meta.extraIcon.svg ? true : false"
            :content="`${onlyOneChild.meta.extraIcon.name}`"
          />
        </div>
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
      <i v-show="props.item.meta.icon" :class="props.item.meta.icon"></i>
      <span v-if="!menuMode">{{ $t(props.item.meta.title) }}</span>

      <el-tooltip
        v-else
        placement="top"
        :offset="-10"
        :disabled="!props.item.showTooltip"
      >
        <template #content> {{ $t(props.item.meta.title) }} </template>
        <div
          ref="menuTextRef"
          style="
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 125px;
          "
          @mouseover="hoverMenu(props.item)"
        >
          <span style="overflow: hidden; text-overflow: ellipsis">
            {{ $t(props.item.meta.title) }}
          </span>
        </div>
      </el-tooltip>
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
