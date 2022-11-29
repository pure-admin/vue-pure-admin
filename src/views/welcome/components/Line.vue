<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});

setOptions(
  {
    tooltip: {
      trigger: "item"
    },
    grid: {
      containLabel: true,
      top: "10px",
      bottom: "0",
      left: "0",
      right: "0"
    },
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0
      },
      data: ["open_issues", "forks", "watchers", "star"],
      triggerEvent: true
    },
    yAxis: {
      type: "value",
      triggerEvent: true
    },
    series: [
      {
        data: [1000, 10000, 20000, 66666],
        type: "line",
        areaStyle: {}
      }
    ],
    addTooltip: true
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  }
);
</script>

<template>
  <div ref="lineChartRef" style="width: 100%; height: 35vh" />
</template>
