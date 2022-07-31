<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";

const { isDark } = useDark();

let theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});

setOptions(
  {
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
