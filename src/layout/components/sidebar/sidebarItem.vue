<script setup lang="ts">
import path from "path";
import { getConfig } from "@/config";
import { menuType } from "../../types";
import extraIcon from "./extraIcon.vue";
import { ReText } from "@/components/ReText";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { type CSSProperties, type PropType, computed, ref, toRaw } from "vue";

import ArrowUp from "@iconify-icons/ep/arrow-up-bold";
import EpArrowDown from "@iconify-icons/ep/arrow-down-bold";
import ArrowLeft from "@iconify-icons/ep/arrow-left-bold";
import ArrowRight from "@iconify-icons/ep/arrow-right-bold";

const { layout, isCollapse, tooltipEffect, getDivStyle } = useNav();

const props = defineProps({
  item: {
    type: Object as PropType<menuType>
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

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin:
      layout.value === "horizontal"
        ? "0 5px 0 0"
        : isCollapse.value
          ? "0 auto"
          : "0 5px 0 0"
  };
});

const expandCloseIcon = computed(() => {
  if (!getConfig()?.MenuArrowIconNoTransition) return "";
  return {
    "expand-close-icon": useRenderIcon(EpArrowDown),
    "expand-open-icon": useRenderIcon(ArrowUp),
    "collapse-close-icon": useRenderIcon(ArrowRight),
    "collapse-open-icon": useRenderIcon(ArrowLeft)
  };
});

const onlyOneChild: menuType = ref(null);

function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren[0]?.meta?.showParent) {
    return false;
  }

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
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    // 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
    return path.posix.resolve(props.basePath, routePath);
  }
}
</script>

<template>
  <el-menu-item
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
    :index="resolvePath(onlyOneChild.path)"
    :class="{ 'submenu-title-noDropdown': !isNest }"
    :style="getNoDropdownStyle"
  >
    <div
      v-if="toRaw(props.item.meta.icon)"
      class="sub-menu-icon"
      :style="getSubMenuIconStyle"
    >
      <component
        :is="
          useRenderIcon(
            toRaw(onlyOneChild.meta.icon) ||
              (props.item.meta && toRaw(props.item.meta.icon))
          )
        "
      />
    </div>
    <el-text
      v-if="
        (!props.item?.meta.icon &&
          isCollapse &&
          layout === 'vertical' &&
          props.item?.pathList?.length === 1) ||
        (!onlyOneChild.meta.icon &&
          isCollapse &&
          layout === 'mix' &&
          props.item?.pathList?.length === 2)
      "
      truncated
      class="!px-4 !text-inherit"
    >
      {{ transformI18n(onlyOneChild.meta.title) }}
    </el-text>

    <template #title>
      <div :style="getDivStyle">
        <ReText
          :tippyProps="{
            offset: [0, -10],
            theme: tooltipEffect
          }"
          class="!text-inherit"
        >
          {{ transformI18n(onlyOneChild.meta.title) }}
        </ReText>
        <extraIcon :extraIcon="onlyOneChild.meta.extraIcon" />
      </div>
    </template>
  </el-menu-item>
  <el-sub-menu
    v-else
    ref="subMenu"
    teleported
    :index="resolvePath(props.item.path)"
    v-bind="expandCloseIcon"
  >
    <template #title>
      <div
        v-if="toRaw(props.item.meta.icon)"
        :style="getSubMenuIconStyle"
        class="sub-menu-icon"
      >
        <component
          :is="useRenderIcon(props.item.meta && toRaw(props.item.meta.icon))"
        />
      </div>
      <ReText
        v-if="
          !(
            layout === 'vertical' &&
            isCollapse &&
            toRaw(props.item.meta.icon) &&
            props.item.parentId === null
          )
        "
        :tippyProps="{
          offset: [0, -10],
          theme: tooltipEffect
        }"
        :class="{
          '!text-inherit': true,
          '!px-4':
            layout !== 'horizontal' &&
            isCollapse &&
            !toRaw(props.item.meta.icon) &&
            props.item.parentId === null
        }"
      >
        {{ transformI18n(props.item.meta.title) }}
      </ReText>
      <extraIcon v-if="!isCollapse" :extraIcon="props.item.meta.extraIcon" />
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
