<script setup lang="ts">
import path from "path";
import { getConfig } from "@/config";
import { menuType } from "../../types";
import extraIcon from "./extraIcon.vue";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, toRaw, PropType, nextTick, computed, CSSProperties } from "vue";

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

const getSpanStyle = computed((): CSSProperties => {
  return {
    width: "100%",
    textAlign: "center"
  };
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getMenuTextStyle = computed(() => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    outline: "none"
  };
});

const getsubMenuIconStyle = computed((): CSSProperties => {
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

const getSubTextStyle = computed((): CSSProperties => {
  if (!isCollapse.value) {
    return {
      width: "210px",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis"
    };
  } else {
    return {
      width: ""
    };
  }
});

const getSubMenuDivStyle = computed((): any => {
  return item => {
    return !isCollapse.value
      ? {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden"
        }
      : {
          width: "100%",
          textAlign:
            item?.parentId === null
              ? "center"
              : layout.value === "mix" && item?.pathList?.length === 2
              ? "center"
              : ""
        };
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

// 左侧菜单折叠后，当菜单没有图标时只显示第一个文字并加上省略号
function overflowSlice(text, item?: any) {
  const newText =
    (text?.length > 1 ? text.toString().slice(0, 1) : text) + "...";
  if (item && !(isCollapse.value && item?.parentId === null)) {
    return layout.value === "mix" &&
      item?.pathList?.length === 2 &&
      isCollapse.value
      ? newText
      : text;
  }
  return newText;
}

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
      :style="getsubMenuIconStyle"
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
    <span
      v-if="
        !props.item?.meta.icon &&
        isCollapse &&
        layout === 'vertical' &&
        props.item?.pathList?.length === 1
      "
      :style="getSpanStyle"
    >
      {{ overflowSlice(transformI18n(onlyOneChild.meta.title)) }}
    </span>
    <span
      v-if="
        !onlyOneChild.meta.icon &&
        isCollapse &&
        layout === 'mix' &&
        props.item?.pathList?.length === 2
      "
      :style="getSpanStyle"
    >
      {{ overflowSlice(transformI18n(onlyOneChild.meta.title)) }}
    </span>
    <template #title>
      <div :style="getDivStyle">
        <span v-if="layout === 'horizontal'">
          {{ transformI18n(onlyOneChild.meta.title) }}
        </span>
        <el-tooltip
          v-else
          placement="top"
          :effect="tooltipEffect"
          :offset="-10"
          :disabled="!onlyOneChild.showTooltip"
        >
          <template #content>
            {{ transformI18n(onlyOneChild.meta.title) }}
          </template>
          <span
            ref="menuTextRef"
            :style="getMenuTextStyle"
            @mouseover="hoverMenu(onlyOneChild)"
          >
            {{ transformI18n(onlyOneChild.meta.title) }}
          </span>
        </el-tooltip>
        <extraIcon :extraIcon="onlyOneChild.meta.extraIcon" />
      </div>
    </template>
  </el-menu-item>

  <el-sub-menu
    v-else
    ref="subMenu"
    v-bind="expandCloseIcon"
    :index="resolvePath(props.item.path)"
  >
    <template #title>
      <div
        v-if="toRaw(props.item.meta.icon)"
        :style="getsubMenuIconStyle"
        class="sub-menu-icon"
      >
        <component
          :is="useRenderIcon(props.item.meta && toRaw(props.item.meta.icon))"
        />
      </div>
      <span v-if="layout === 'horizontal'">
        {{ transformI18n(props.item.meta.title) }}
      </span>
      <div
        :style="getSubMenuDivStyle(props.item)"
        v-if="
          !(
            isCollapse &&
            toRaw(props.item.meta.icon) &&
            props.item.parentId === null
          )
        "
      >
        <el-tooltip
          v-if="layout !== 'horizontal'"
          placement="top"
          :effect="tooltipEffect"
          :offset="-10"
          :disabled="!props.item.showTooltip"
        >
          <template #content>
            {{ transformI18n(props.item.meta.title) }}
          </template>
          <span
            ref="menuTextRef"
            :style="getSubTextStyle"
            @mouseover="hoverMenu(props.item)"
          >
            {{
              overflowSlice(transformI18n(props.item.meta.title), props.item)
            }}
          </span>
        </el-tooltip>
        <extraIcon v-if="!isCollapse" :extraIcon="props.item.meta.extraIcon" />
      </div>
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
