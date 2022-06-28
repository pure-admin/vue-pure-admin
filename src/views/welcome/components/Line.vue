<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>);

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
