<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
});

function initechartInstance() {
  const echartDom = document.querySelector(".line" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    grid: {
      bottom: "20%",
      height: "68%",
      containLabel: true
    },
    tooltip: {
      trigger: "item"
    },
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0
      },
      data: ["open_issues", "forks", "watchers", "star"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [3, 204, 1079, 1079],
        type: "line",
        areaStyle: {}
      }
    ]
  });
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance();
  });
});

onMounted(() => {
  nextTick(() => {
    useEventListener("resize", () => {
      if (!echartInstance) return;
      useTimeoutFn(() => {
        echartInstance.resize();
      }, 180);
    });
  });
});

tryOnUnmounted(() => {
  if (!echartInstance) return;
  echartInstance.dispose();
  echartInstance = null;
});
</script>

<template>
  <div :class="'line' + props.index" style="width: 100%; height: 35vh" />
</template>
