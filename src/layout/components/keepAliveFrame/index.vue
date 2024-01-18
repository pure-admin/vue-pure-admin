<script setup lang="ts">
import { useMultiFrame } from "@/layout/components/keepAliveFrame/useMultiFrame";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { shallowRef, watch } from "vue";
import { type RouteRecordRaw, RouteLocationNormalizedLoaded } from "vue-router";
import type { Component } from "vue";
import { computed } from "vue";
import { getConfig } from "@/config";

const { setMap, getMap, MAP, delMap } = useMultiFrame();
const props = defineProps<{
  currRoute: RouteLocationNormalizedLoaded;
  currComp: Component;
}>();

const compList = shallowRef([]);
const keep = computed(
  () =>
    getConfig().KeepAlive &&
    props.currRoute.meta?.keepAlive &&
    !!props.currRoute.meta?.frameSrc
);

watch(useMultiTagsStoreHook().multiTags, (tags: any) => {
  if (!Array.isArray(tags) || !keep.value) {
    return;
  }
  const iframeTags = tags.filter(i => i.meta?.frameSrc);
  // tags必须是小于MAP，才是做了关闭动作，因为MAP插入的顺序在tags变化后发生
  if (iframeTags.length < MAP.size) {
    for (const i of MAP.keys()) {
      if (!tags.some(s => s.path === i)) {
        // console.log("关闭标签，清空缓存", i);
        delMap(i);
        compList.value = getMap();
      }
    }
  }
});

watch(
  () => props.currRoute.fullPath,
  path => {
    const multiTags = useMultiTagsStoreHook().multiTags as RouteRecordRaw[];
    const iframeTags = multiTags.filter(i => i.meta?.frameSrc);
    if (keep.value) {
      if (iframeTags.length !== MAP.size) {
        const sameKey = [...MAP.keys()].find(i => path === i);
        if (!sameKey) {
          // 添加缓存
          setMap(path, props.currComp);
        }
      }
    }

    if (MAP.size > 0) {
      compList.value = getMap();
    }
  },
  {
    immediate: true
  }
);
// 渲染iframe时，避免重新渲染一次frameView
const normalComp = computed(() => !keep.value && props.currComp);
</script>
<template>
  <template v-for="[fullPath, Comp] in compList" :key="fullPath">
    <div v-show="fullPath === props.currRoute.fullPath" class="w-full h-full">
      <slot
        :fullPath="fullPath"
        :Comp="Comp"
        :frameInfo="{ frameSrc: currRoute.meta?.frameSrc, fullPath }"
      />
    </div>
  </template>
  <div v-show="!keep" class="w-full h-full">
    <slot :Comp="normalComp" :fullPath="props.currRoute.fullPath" frameInfo />
  </div>
</template>
