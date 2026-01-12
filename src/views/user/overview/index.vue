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
          <div ref="chartRef" style="width: 100%; height: 320px" />
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
          @change="handleFilter"
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
        <el-table-column prop="user_id" label="学号/工号" width="120" />
        <el-table-column prop="real_name" label="姓名" width="100" />
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.role_name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="department" label="部门/学院">
          <template #default="{ row }">
            {{
              row.role_name !== "Student"
                ? row.department
                : row.college || row.department
            }}
          </template>
        </el-table-column>

        <el-table-column label="学籍信息" min-width="180">
          <template #default="{ row }">
            <div v-if="row.role_name === 'Student'">
              <span class="mr-2">{{ row.major || "无专业" }}</span>
              <el-tag size="small" type="info">{{
                row.clazz || "无班级"
              }}</el-tag>
            </div>
            <span v-else class="text-gray-400">--</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-popconfirm
              :title="`确认删除用户 ${row.real_name} 吗？`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="fetchUsers"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import { message } from "@/utils/message";
import * as echarts from "echarts";
import {
  getUserStats,
  getUsers,
  type UserStatistics,
  type UserListItem,
  deleteUser
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

// 分页状态
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getUsers({
      page: pagination.page,
      size: pagination.size,
      role: selectedRole.value || undefined
    });
    // 注意：这里要对应返回的 { count, results } 结构
    userList.value = res.results;
    pagination.total = res.count;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 筛选时重置页码
const handleFilter = () => {
  pagination.page = 1;
  fetchUsers();
};

// 删除逻辑
const handleDelete = async (row: UserListItem) => {
  try {
    await deleteUser(row.user_id);
    message(`用户 ${row.real_name} 已成功删除`, { type: "success" });
    // 如果当前页只有一条数据且不是第一页，删除后跳回上一页
    if (userList.value.length === 1 && pagination.page > 1) {
      pagination.page--;
    }
    fetchUsers(); // 刷新列表
    fetchStats(); // 刷新上方统计数字
  } catch (error) {
    message("删除失败", { type: "error" });
  }
};

// 监听窗口变化，重绘图表（PureAdmin 常用方案）
useEventListener(window, "resize", () => myChart?.resize());

onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>
