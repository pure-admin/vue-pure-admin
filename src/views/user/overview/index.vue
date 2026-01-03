<template>
  <div class="p-4">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <el-card shadow="never" class="h-87.5 mb-4">
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-gray-500">总用户数</p>
            <h1 class="text-4xl font-bold mt-2">
              {{ stats?.total_users || 0 }}
            </h1>
            <div class="mt-8 w-full">
              <div
                v-for="role in stats?.role_stats"
                :key="role.name"
                class="flex justify-between mb-2 text-sm"
              >
                <span>{{ role.name }}</span>
                <span class="font-bold">{{ role.user_count }} 人</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <el-card shadow="never" class="h-87.5 mb-4">
          <div ref="chartRef" style="width: 100%; height: 320px;" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-bold">用户管理详情</h4>
        <el-select
          v-model="selectedRole"
          placeholder="角色筛选"
          clearable
          @change="fetchUsers"
        >
          <el-option
            v-for="role in stats?.role_stats"
            :key="role.name"
            :label="role.name"
            :value="role.name"
          />
        </el-select>
      </div>
      <el-table v-loading="loading" :data="userList" border>
        <el-table-column prop="user_id" label="学号/工号" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="角色">
          <template #default="{ row }">
            <el-tag
              v-for="group in row.group_details"
              :key="group.id"
              class="mr-1"
              >{{ group.name }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import * as echarts from "echarts";
import {
  getUserStats,
  getUsers,
  type UserStatistics,
  type UserListItem
} from "@/api/user";

const stats = ref<UserStatistics | null>(null);
const userList = ref<UserListItem[]>([]);
const loading = ref(false);
const selectedRole = ref("");
const chartRef = ref<HTMLDivElement>();
let myChart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value || !stats.value) return;
  if (!myChart) {
    myChart = echarts.init(chartRef.value);
  }

  const option = {
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        name: "角色分布",
        type: "pie",
        radius: ["40%", "70%"], // 环形图更具现代感
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
        label: { show: false, position: "center" },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: "bold" }
        },
        data: stats.value.role_stats.map(item => ({
          name: item.name,
          value: item.user_count
        }))
      }
    ]
  };
  myChart.setOption(option);
};

const fetchStats = async () => {
  const res = await getUserStats();
  stats.value = res as any; // 根据你之前的报错调整，如果是 res.data 就写 res.data
  nextTick(() => initChart());
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getUsers(
      selectedRole.value ? { role: selectedRole.value } : {}
    );
    userList.value = res as any;
  } finally {
    loading.value = false;
  }
};

// 监听窗口变化，重绘图表（PureAdmin 常用方案）
useEventListener(window, "resize", () => myChart?.resize());

onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>
