<template>
  <div class="main p-4 bg-gray-50 min-h-screen">
    <el-row :gutter="20" class="mb-6">
      <el-col v-for="(val, key) in summaryMap" :key="key" :span="8">
        <el-card shadow="hover" class="text-center border-none">
          <div class="text-gray-500 text-sm mb-2">{{ val.label }}</div>
          <div class="text-3xl font-bold" :class="val.color">
            {{ statistics.summary?.[key] || 0 }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="mb-6">
        <el-card shadow="never" header="年度获奖趋势与增长率">
          <div ref="yearChartRef" class="h-80" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="竞赛级别分布">
          <div ref="levelChartRef" class="h-72" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="奖项等次分布">
          <div ref="rankChartRef" class="h-72" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="竞赛类别统计">
          <div ref="categoryChartRef" class="h-72" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { getAwardStatistics } from "@/api/award";

const statistics = ref<any>({});
const yearChartRef = ref();
const levelChartRef = ref();
const rankChartRef = ref();
const categoryChartRef = ref();

const summaryMap = {
  total_awards: { label: "总获奖数", color: "text-blue-600" },
  total_students: { label: "累计获奖学生", color: "text-green-600" },
  total_instructors: { label: "指导教师人次", color: "text-orange-600" }
};

/** 初始化图表 */
const initCharts = () => {
  // 1. 年度趋势图
  const yearChart = echarts.init(yearChartRef.value);
  yearChart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: statistics.value.by_year?.map(i => i.year)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: statistics.value.by_year?.map(i => i.count),
        type: "line",
        smooth: true,
        areaStyle: { opacity: 0.1 },
        label: { show: true, position: "top" }
      }
    ]
  });

  // 2. 级别分布 (饼图)
  const levelChart = echarts.init(levelChartRef.value);
  levelChart.setOption({
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: statistics.value.by_level?.map(i => ({
          name: i.name,
          value: i.count
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 3. 奖项等次 (环形图)
  const rankChart = echarts.init(rankChartRef.value);
  rankChart.setOption({
    tooltip: { trigger: "item" },
    legend: { bottom: "0" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: statistics.value.by_award_rank?.map(i => ({
          name: i.award_level,
          value: i.count
        }))
      }
    ]
  });

  // 4. 类别统计 (横向柱状图)
  const catChart = echarts.init(categoryChartRef.value);
  catChart.setOption({
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: statistics.value.by_category?.map(i => i.name)
    },
    series: [
      {
        data: statistics.value.by_category?.map(i => i.count),
        type: "bar",
        itemStyle: { color: "#6366f1" }
      }
    ]
  });
};

const loadData = async () => {
  const res = await getAwardStatistics();
  statistics.value = res;
  await nextTick();
  initCharts();
};

onMounted(() => {
  loadData();
  // 响应式缩放
  window.addEventListener("resize", () => {
    echarts.getInstanceByDom(yearChartRef.value)?.resize();
    echarts.getInstanceByDom(levelChartRef.value)?.resize();
    echarts.getInstanceByDom(rankChartRef.value)?.resize();
    echarts.getInstanceByDom(categoryChartRef.value)?.resize();
  });
});
</script>
