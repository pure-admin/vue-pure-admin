<template>
  <div class="p-4">
    <el-row :gutter="20" class="mb-4">
      <el-col :span="8">
        <el-card shadow="never" class="text-center">
          <div class="text-gray-500 text-sm">总竞赛数量</div>
          <div class="text-3xl font-bold mt-2">{{ totalCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="text-center">
          <div class="text-gray-500 text-sm">
            当前年度 ({{ new Date().getFullYear() }})
          </div>
          <div class="text-3xl font-bold mt-2 text-primary">
            {{ currentYearCount }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="text-center">
          <div class="text-gray-500 text-sm">竞赛类别数</div>
          <div class="text-3xl font-bold mt-2 text-success">
            {{ categoryNames.length }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="12" :sm="24">
        <el-card shadow="never" header="竞赛类别分布">
          <div ref="categoryChartRef" style="width: 100%; height: 350px" />
        </el-card>
      </el-col>

      <el-col :lg="12" :sm="24">
        <el-card shadow="never" header="竞赛级别统计">
          <div ref="levelChartRef" style="width: 100%; height: 350px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useECharts } from "@pureadmin/utils";
import { getCompList } from "@/api/comp";

const categoryChartRef = ref<HTMLDivElement>();
const levelChartRef = ref<HTMLDivElement>();
const { setOptions: setCategoryOptions } = useECharts(categoryChartRef);
const { setOptions: setLevelOptions } = useECharts(levelChartRef);

const rawData = ref([]);
const totalCount = computed(() => rawData.value.length);
const currentYearCount = computed(() => {
  const year = new Date().getFullYear();
  return rawData.value.filter(item => item.year === year).length;
});

// 获取唯一的类别名称列表
const categoryNames = computed(() => {
  return [...new Set(rawData.value.map(item => item.category_name))];
});

async function initCharts() {
  const res = await getCompList();
  rawData.value = Array.isArray(res) ? res : (res as any).data || [];

  // 1. 数据处理：按类别分组
  const categoryData = categoryNames.value.map(name => ({
    name: name || "未分类",
    value: rawData.value.filter(item => item.category_name === name).length
  }));

  // 2. 数据处理：按级别分组
  const levelMap = {};
  rawData.value.forEach(item => {
    const lname = item.level_name || "未知";
    levelMap[lname] = (levelMap[lname] || 0) + 1;
  });

  // 渲染类别饼图
  setCategoryOptions({
    tooltip: { trigger: "item" },
    legend: { bottom: "0" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
        data: categoryData
      }
    ]
  });

  // 渲染级别柱状图
  setLevelOptions({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Object.keys(levelMap) },
    yAxis: { type: "value" },
    series: [
      {
        data: Object.values(levelMap),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" },
        itemStyle: { color: "#409eff" }
      }
    ]
  });
}

onMounted(() => {
  initCharts();
});
</script>
