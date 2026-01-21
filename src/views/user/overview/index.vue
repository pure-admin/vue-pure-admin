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
                <span>{{ formatRoleName(role.name) }}</span>
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
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-400 ml-1">学院</span>
          <el-input
            v-model="queryParams.college"
            placeholder="搜索学院"
            style="width: 180px"
            clearable
            @clear="handleFilter"
            @keyup.enter="handleFilter"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-400 ml-1">专业</span>
          <el-input
            v-model="queryParams.major"
            placeholder="搜索专业"
            style="width: 180px"
            clearable
            @clear="handleFilter"
            @keyup.enter="handleFilter"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-400 ml-1">班级</span>
          <el-input
            v-model="queryParams.clazz"
            placeholder="搜索班级"
            style="width: 150px"
            clearable
            @clear="handleFilter"
            @keyup.enter="handleFilter"
          />
        </div>
        <el-button type="primary" @click="handleFilter">筛选</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="userList" border stripe>
        <el-table-column label="基本信息" width="160">
          <template #default="{ row }">
            <div class="font-bold">{{ row.real_name }}</div>
            <div class="text-xs text-gray-400">ID: {{ row.user_id }}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role_name)" effect="plain">
              {{ formatRoleName(row.role_name) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="所属组织" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="text-sm">
              <div class="font-medium text-gray-700">
                {{ row.college || "未知学院" }}
              </div>
              <div
                v-if="row.role_name === 'Student'"
                class="text-xs text-gray-500"
              >
                {{ row.major }}
              </div>
              <div v-else-if="row.department" class="text-xs text-gray-500">
                {{ row.department }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="身份详情" min-width="180">
          <template #default="{ row }">
            <div v-if="row.role_name === 'Student'">
              <el-tag size="small" type="info" effect="light">
                {{ row.clazz || "暂无班级" }}
              </el-tag>
            </div>
            <div v-else-if="row.role_name === 'Teacher'">
              <span class="text-sm">{{ row.title || "教师" }}</span>
            </div>
            <span v-else class="text-gray-400">--</span>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" width="200">
          <template #default="{ row }">
            <div class="text-xs space-y-1">
              <div v-if="row.phone" class="flex items-center gap-1">
                <el-icon class="mt-0.5"><Phone /></el-icon>
                {{ row.phone.replace(".0", "") }}
              </div>
              <div
                v-if="row.email"
                class="flex items-center gap-1 text-gray-500"
              >
                <el-icon class="mt-0.5"><Message /></el-icon>
                {{ row.email }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right" align="center">
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
import { Phone, Message } from "@element-plus/icons-vue";
import type { TagProps } from "element-plus";
import * as echarts from "echarts";
import {
  getUserStats,
  getUsers,
  deleteUser,
  type UserStatistics,
  type UserListItem // 假设你已在 api/user.ts 中更新了该接口
} from "@/api/user";

const stats = ref<UserStatistics | null>(null);
const userList = ref<UserListItem[]>([]);
const loading = ref(false);
const selectedRole = ref("");
const chartRef = ref<HTMLDivElement>();
let myChart: echarts.ECharts | null = null;

/** 辅助函数：格式化角色中文名 */
const formatRoleName = (role: string) => {
  const map: Record<string, string> = {
    Student: "学生",
    Teacher: "教师",
    Admin: "管理员",
    Administrator: "系统管理员",
    CompetitionAdministrator: "竞赛管理员"
  };
  return map[role] || role;
};

/** 辅助函数：获取角色标签颜色，修复 TS 类型报错 */
const getRoleType = (roleName: string): TagProps["type"] => {
  const map: Record<string, TagProps["type"]> = {
    Admin: "danger",
    Administrator: "danger",
    Teacher: "success",
    Student: "info",
    CompetitionAdministrator: "warning"
  };
  return map[roleName] || "info";
};

// --- 以下逻辑保持一致，仅修改渲染映射 ---

const initChart = () => {
  if (!chartRef.value || !stats.value) return;
  if (!myChart) myChart = echarts.init(chartRef.value);

  const option = {
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left", textStyle: { fontSize: 12 } },
    series: [
      {
        name: "角色分布",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" } },
        data: stats.value.role_stats.map(item => ({
          name: formatRoleName(item.name), // 图表也显示中文
          value: item.user_count
        }))
      }
    ]
  };
  myChart.setOption(option);
};

const fetchStats = async () => {
  try {
    const res = await getUserStats();
    stats.value = res as any;
    nextTick(() => initChart());
  } catch (e) {
    console.error(e);
  }
};

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
});

// 1. 定义更详细的查询参数对象
const queryParams = reactive({
  college: "",
  major: "",
  clazz: ""
});

// 2. 修改获取用户列表的方法
const fetchUsers = async () => {
  loading.value = true;
  try {
    // 构造请求参数，剔除空字符串
    const params: any = {
      page: pagination.page,
      size: pagination.size
    };
    if (queryParams.college) params.college = queryParams.college;
    if (queryParams.major) params.major = queryParams.major;
    if (queryParams.clazz) params.clazz = queryParams.clazz;

    const res = await getUsers(params);
    userList.value = res.results;
    pagination.total = res.count;
  } catch (error) {
    console.error("加载列表失败", error);
  } finally {
    loading.value = false;
  }
};

// 3. 筛选与重置逻辑
const handleFilter = () => {
  pagination.page = 1; // 筛选时必须重置回第一页
  fetchUsers();
};

const resetQuery = () => {
  queryParams.college = "";
  queryParams.major = "";
  queryParams.clazz = "";
  handleFilter();
};

const handleDelete = async (row: UserListItem) => {
  try {
    await deleteUser(row.user_id);
    message(`用户 ${row.real_name} 已成功删除`, { type: "success" });
    if (userList.value.length === 1 && pagination.page > 1) pagination.page--;
    fetchUsers();
    fetchStats();
  } catch (error) {
    message("删除失败", { type: "error" });
  }
};

useEventListener(window, "resize", () => myChart?.resize());

onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>
