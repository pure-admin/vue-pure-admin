<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";

const pieChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(pieChartRef as Ref<HTMLDivElement>);

setOptions(
  {
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      right: true
    },
    series: [
      {
        name: "Github信息",
        type: "pie",
        radius: "60%",
        center: ["40%", "50%"],
        data: [
          { value: 1079, name: "watchers" },
          { value: 1079, name: "star" },
          { value: 204, name: "forks" },
          { value: 3, name: "open_issues" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  },
  // 点击空白处
  {
    type: "zrender",
    name: "click",
    callback: params => {
      console.log("点击空白处", params);
    }
  }
);
</script>

<template>
  <div ref="pieChartRef" style="width: 100%; height: 35vh" />
</template>
