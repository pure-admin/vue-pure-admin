<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "default";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, getInstance, resize } = useECharts(
  lineChartRef as Ref<HTMLDivElement>,
  { theme }
);

const xData = (() => {
  const data: any[] = [];
  for (let i = 1; i < 31; i++) {
    data.push(`${i}日`);
  }
  return data;
})();

setOptions(
  {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      bottom: "20px",
      right: "10px"
    },
    legend: {
      //@ts-expect-error
      right: true,
      data: ["fork", "star"]
    },
    calculable: true,
    xAxis: [
      {
        triggerEvent: true,
        type: "category",
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: xData
      }
    ],
    yAxis: [
      {
        triggerEvent: true,
        type: "value",
        splitLine: {
          show: false
        },
        axisLine: {
          show: true
        }
      }
    ],
    dataZoom: [
      {
        type: "slider",
        show: false,
        realtime: true,
        startValue: 0,
        endValue: 24
      }
    ],
    series: [
      {
        name: "fork",
        type: "line",
        symbolSize: 10,
        symbol: "circle",
        color: "#f56c6c",
        markPoint: {
          label: {
            color: "#fff"
          },
          data: [
            {
              type: "max",
              name: "最大值"
            },
            {
              type: "min",
              name: "最小值"
            }
          ]
        },
        data: [
          509, 917, 2455, 2610, 2719, 3033, 3044, 3085, 2708, 2809, 2117, 2000,
          1455, 1210, 719, 733, 944, 2285, 2208, 3372, 3936, 3693, 2962, 2810,
          3519, 2455, 2610, 2719, 2484, 2078
        ]
      },
      {
        name: "star",
        type: "line",
        symbolSize: 10,
        symbol: "circle",
        color: "#53a7ff",
        markPoint: {
          label: {
            color: "#fff"
          },
          data: [
            {
              type: "max",
              name: "最大值"
            },
            {
              type: "min",
              name: "最小值"
            }
          ]
        },
        data: [
          2136, 3693, 2962, 3810, 3519, 3484, 3915, 3823, 3455, 4310, 4019,
          3433, 3544, 3885, 4208, 3372, 3484, 3915, 3748, 3675, 4009, 4433,
          3544, 3285, 4208, 3372, 3484, 3915, 3823, 4265, 4298
        ]
      }
    ],
    addTooltip: true
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  },
  {
    name: "contextmenu",
    callback: params => {
      console.log("contextmenu", params);
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

let a = 1;
useIntervalFn(() => {
  if (a == xData.length - 24) {
    a = 0;
  }
  getInstance()!.dispatchAction({
    type: "dataZoom",
    startValue: a,
    endValue: a + 24
  });
  a++;
}, 2000);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="lineChartRef" style="width: 100%; height: 35vh" />
</template>
