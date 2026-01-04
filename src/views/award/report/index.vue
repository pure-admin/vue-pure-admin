<template>
  <div class="main p-4">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="font-bold">获奖报表筛选</div>
      </template>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="统计维度">
          <el-select
            v-model="queryForm.group_by"
            placeholder="请选择角色"
            style="width: 150px"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.name"
              :label="convertRoleName(role.name)"
              :value="role.name.toLowerCase()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('search')"
            @click="fetchReport"
            >查询</el-button
          >
          <el-button :icon="useRenderIcon('refresh')" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>报表预览</span>
          <div v-if="reportData.length > 0">
            <el-button
              type="success"
              :icon="useRenderIcon('download')"
              @click="handleExport"
              >导出 Excel</el-button
            >
            <el-button
              type="warning"
              :icon="useRenderIcon('printer')"
              @click="handlePrint"
              >打印报表</el-button
            >
          </div>
        </div>
      </template>

      <div id="printArea" class="p-2">
        <div class="print-header hidden">
          <h2 style="text-align: center">获奖成果报表</h2>
          <p style="text-align: center">
            日期范围：{{ queryForm.start_date || "不限" }} 至
            {{ queryForm.end_date || "不限" }}
          </p>
        </div>
        <el-table
          v-loading="loading"
          :data="reportData"
          border
          style="width: 100%"
        >
          <el-table-column prop="user_id" label="学号/工号" width="120" />
          <el-table-column prop="real_name" label="姓名" width="100" />
          <el-table-column prop="department" label="部门/学院" />
          <el-table-column label="获奖详情">
            <template #default="{ row }">
              <div
                v-for="award in row.awards"
                :key="award.id"
                class="award-item border-b last:border-0 py-1"
              >
                <span class="font-bold">【{{ award.competition_name }}】</span>
                <el-tag size="small" class="mx-2">{{
                  award.award_level
                }}</el-tag>
                <span class="text-gray-500 text-sm">{{
                  award.award_date
                }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getAwardReport } from "@/api/award";
import { getAllRoles } from "@/api/user";
import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";

const loading = ref(false);
const roleOptions = ref([]);
const dateRange = ref([]);
const reportData = ref([]);

const queryForm = reactive({
  group_by: "student",
  start_date: "",
  end_date: ""
});

/** 角色名称转换（中文展示） */
const convertRoleName = (role: string) => {
  const map = {
    Student: "学生",
    Teacher: "老师",
    CompetitionAdministrator: "管理员"
  };
  return map[role] || role;
};

/** 获取角色列表 */
async function initRoles() {
  const res = await getAllRoles();
  roleOptions.value = Array.isArray(res) ? res : (res as any).data;
}

/** 获取报表数据 */
async function fetchReport() {
  if (dateRange.value) {
    queryForm.start_date = dateRange.value[0];
    queryForm.end_date = dateRange.value[1];
  } else {
    queryForm.start_date = "";
    queryForm.end_date = "";
  }

  loading.value = true;
  try {
    const res = await getAwardReport(queryForm);
    reportData.value = Array.isArray(res) ? res : (res as any).data;
    if (reportData.value.length === 0)
      message("该范围内暂无数据", { type: "info" });
  } catch (e) {
    message("获取报表失败", { type: "error" });
  } finally {
    loading.value = false;
  }
}

/** 重置 */
function resetQuery() {
  queryForm.group_by = "student";
  dateRange.value = [];
  reportData.value = [];
}

/** 导出 Excel */
function handleExport() {
  const exportRows = [];
  reportData.value.forEach(user => {
    user.awards.forEach(award => {
      exportRows.push({
        "学号/工号": user.user_id,
        姓名: user.real_name,
        部门: user.department,
        竞赛名称: award.competition_name,
        获奖等级: award.award_level,
        获奖日期: award.award_date
      });
    });
  });

  const ws = utils.json_to_sheet(exportRows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "获奖报表");
  writeFile(wb, `获奖报表_${queryForm.group_by}_${new Date().getTime()}.xlsx`);
}

/** 打印功能 */
function handlePrint() {
  const printContent = document.getElementById("printArea");
  const newWin = window.open("", "_blank");
  // 构造打印样式
  const style = `
    <style>
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
      .award-item { margin-bottom: 5px; border-bottom: 0.5px solid #eee; }
      .hidden { display: block !important; }
      h2, p { text-align: center; }
    </style>
  `;
  newWin.document.write(style + printContent.innerHTML);
  newWin.document.close();
  newWin.focus();
  setTimeout(() => {
    newWin.print();
    newWin.close();
  }, 250);
}

onMounted(() => {
  initRoles();
});
</script>

<style scoped>
/* 打印时的样式优化 */
@media print {
  .no-print {
    display: none;
  }

  .print-header {
    display: block !important;
  }
}

.award-item:last-child {
  border-bottom: none;
}
</style>
