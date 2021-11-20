<script setup lang="ts">
import path from "path";
import { PropType, ref, nextTick, getCurrentInstance } from "vue";
import { childrenType } from "../../types";
import { useAppStoreHook } from "/@/store/modules/app";
import Icon from "/@/components/ReIcon/src/Icon.vue";
import { transformI18n } from "/@/utils/i18n";
import { findIconReg } from "/@/components/ReIcon";
const instance = getCurrentInstance().appContext.app.config.globalProperties;
const menuMode = instance.$storage.layout?.layout === "vertical";
const pureApp = useAppStoreHook();

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
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath)) {
    return props.basePath + "/" + routePath;
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
      style="display: flex; align-items: center"
    >
      <el-icon v-show="props.item.meta.icon">
        <component
          :is="
            findIconReg(
              onlyOneChild.meta.icon ||
                (props.item.meta && props.item.meta.icon)
            )
          "
        ></component>
      </el-icon>
      <template #title>
        <div
          :style="{
            width: pureApp.sidebar.opened ? '' : '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }"
        >
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
              :style="{
                width: pureApp.sidebar.opened ? '125px' : '',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                outline: 'none'
              }"
              @mouseover="hoverMenu(onlyOneChild)"
            >
              {{
                transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n)
              }}
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
      <el-icon v-show="props.item.meta.icon" :class="props.item.meta.icon">
        <component
          :is="findIconReg(props.item.meta && props.item.meta.icon)"
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
          :style="{
            width: pureApp.sidebar.opened ? '125px' : '',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }"
          @mouseover="hoverMenu(props.item)"
        >
          <span style="overflow: hidden; text-overflow: ellipsis">
            {{ transformI18n(props.item.meta.title, props.item.meta.i18n) }}
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
