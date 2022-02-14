<script setup lang="ts">
import { ref, PropType, nextTick, computed, CSSProperties } from "vue";
import path from "path";
import { useNav } from "../../hooks/nav";
import { childrenType } from "../../types";
import { transformI18n } from "/@/plugins/i18n";
import { useAppStoreHook } from "/@/store/modules/app";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const { pureApp } = useNav();
const menuMode = ["vertical", "mix"].includes(pureApp.layout);

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

const getExtraIconStyle = computed((): CSSProperties => {
  if (useAppStoreHook().getSidebarStatus) {
    return {
      position: "absolute",
      right: "10px"
    };
  } else {
    return {
      position: "static"
    };
  }
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getDivStyle = computed((): CSSProperties => {
  return {
    width: pureApp.sidebar.opened ? "" : "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden"
  };
});

const getMenuTextStyle = computed((): CSSProperties => {
  return {
    width: pureApp.sidebar.opened ? "125px" : "",
    overflow: "hidden",
    textOverflow: "ellipsis",
    outline: "none"
  };
});

const getSubTextStyle = computed((): CSSProperties => {
  return {
    width: pureApp.sidebar.opened ? "125px" : "",
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
});

const getSpanStyle = computed((): CSSProperties => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
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
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    return path.resolve(props.basePath, routePath);
  }
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
      :style="getNoDropdownStyle"
    >
      <el-icon v-show="props.item.meta.icon">
        <component
          :is="
            useRenderIcon(
              onlyOneChild.meta.icon ||
                (props.item.meta && props.item.meta.icon)
            )
          "
        ></component>
      </el-icon>
      <div
        v-if="
          !pureApp.sidebar.opened &&
          pureApp.layout === 'mix' &&
          props.item?.pathList?.length === 2
        "
        :style="getDivStyle"
      >
        <span :style="getMenuTextStyle">
          {{ transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n) }}
        </span>
      </div>
      <template #title>
        <div :style="getDivStyle">
          <span v-if="!menuMode">{{
            transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n)
          }}</span>
          <el-tooltip
            v-else
            placement="top"
            :offset="-10"
            :disabled="!onlyOneChild.showTooltip"
          >
            <template #content>
              {{
                transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n)
              }}
            </template>
            <span
              ref="menuTextRef"
              :style="getMenuTextStyle"
              @mouseover="hoverMenu(onlyOneChild)"
            >
              {{
                transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n)
              }}
            </span>
          </el-tooltip>
          <FontIcon
            v-if="onlyOneChild.meta.extraIcon"
            width="30px"
            height="30px"
            :style="getExtraIconStyle"
            :icon="onlyOneChild.meta.extraIcon.name"
            :svg="onlyOneChild.meta.extraIcon.svg ? true : false"
          ></FontIcon>
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
      <el-icon v-show="props.item.meta.icon" :class="props.item.meta.icon">
        <component
          :is="useRenderIcon(props.item.meta && props.item.meta.icon)"
        ></component>
      </el-icon>
      <span v-if="!menuMode">{{
        transformI18n(props.item.meta.title, props.item.meta.i18n)
      }}</span>
      <el-tooltip
        v-else
        placement="top"
        :offset="-10"
        :disabled="!pureApp.sidebar.opened || !props.item.showTooltip"
      >
        <template #content>
          {{ transformI18n(props.item.meta.title, props.item.meta.i18n) }}
        </template>
        <div
          ref="menuTextRef"
          :style="getSubTextStyle"
          @mouseover="hoverMenu(props.item)"
        >
          <span :style="getSpanStyle">
            {{ transformI18n(props.item.meta.title, props.item.meta.i18n) }}
          </span>
        </div>
      </el-tooltip>
      <FontIcon
        v-if="props.item.meta.extraIcon"
        width="30px"
        height="30px"
        style="position: absolute; right: 10px"
        :icon="props.item.meta.extraIcon.name"
        :svg="props.item.meta.extraIcon.svg ? true : false"
      ></FontIcon>
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
