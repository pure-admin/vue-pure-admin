<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <el-alert
        :title="`共解析 ${tableData.length} 条数据。请修正红色标记的条目，确认无误后点击提交。`"
        type="info"
        show-icon
        :closable="false"
        class="flex-1 mr-4"
      />
      <div class="flex gap-2">
        <el-button @click="$emit('cancel')">放弃</el-button>
        <el-button
          type="warning"
          plain
          :disabled="unidentifiedCount === 0"
          @click="exportUnidentifiedUsers"
        >
          导出未识别人员 ({{ unidentifiedCount }})
        </el-button>
        <el-button
          type="primary"
          :disabled="!canCommit"
          :loading="committing"
          @click="handleCommit"
        >
          确认入库 ({{ validCount }}条)
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      height="600"
      row-key="id"
    >
      <el-table-column label="状态" width="70" align="center" fixed="left">
        <template #default="{ row }">
          <el-icon v-if="row.is_valid" color="#67C23A" size="20"
            ><CircleCheckFilled
          /></el-icon>
          <el-tooltip v-else :content="row.error_msg" placement="top">
            <el-icon color="#F56C6C" size="20" class="cursor-pointer"
              ><WarningFilled
            /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="竞赛名称" min-width="200">
        <template #default="{ row }">
          <span v-if="row.competition_analysis.status === 'success'">
            {{
              row.competition_analysis.options[0]?.title || row.raw_competition
            }}
          </span>
          <el-select
            v-else-if="row.competition_analysis.status === 'multiple'"
            v-model="row.competition_analysis.selected_id"
            placeholder="请选择具体赛项"
            size="small"
            class="w-full"
            @change="updateRow(row)"
          >
            <el-option
              v-for="opt in row.competition_analysis.options"
              :key="opt.id"
              :label="`${opt.title} (${opt.scale})`"
              :value="opt.id"
            />
          </el-select>
          <span v-else class="text-red-500 text-xs">
            未找到: {{ row.raw_competition }} (请联系管理员添加)
          </span>
        </template>
      </el-table-column>

      <el-table-column label="获奖信息" width="150">
        <template #default="{ row }">
          <div class="font-medium">{{ row.award_level }}</div>
          <div class="text-xs text-gray-400">{{ row.award_date || "-" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="参赛学生" min-width="300">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <template v-for="(p, idx) in row.participants_analysis" :key="idx">
              <el-tag
                v-if="p.status === 'success'"
                type="success"
                effect="plain"
              >
                {{ getRealName(p) }}
              </el-tag>

              <el-select
                v-else-if="p.status === 'multiple'"
                v-model="p.selected_id"
                placeholder="请选择"
                size="small"
                class="w-32"
                @change="updateRow(row)"
              >
                <el-option
                  v-for="opt in p.options"
                  :key="opt.user_id"
                  :label="`${opt.real_name} (${opt.user_id})`"
                  :value="opt.user_id"
                />
              </el-select>

              <el-tooltip v-else content="点击搜索并修正" placement="top">
                <el-tag
                  type="danger"
                  class="cursor-pointer hover:opacity-80"
                  @click="
                    openUserSearch(
                      row,
                      Number(idx),
                      'participant',
                      p.origin_name
                    )
                  "
                >
                  {{ p.origin_name }} <el-icon><Search /></el-icon>
                </el-tag>
              </el-tooltip>
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="指导老师" min-width="250">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <template v-for="(t, idx) in row.instructors_analysis" :key="idx">
              <el-tag
                v-if="t.status === 'success'"
                type="warning"
                effect="plain"
              >
                {{ getRealName(t) }}
              </el-tag>
              <el-select
                v-else-if="t.status === 'multiple'"
                v-model="t.selected_id"
                size="small"
                class="w-32"
                @change="updateRow(row)"
              >
                <el-option
                  v-for="opt in t.options"
                  :key="opt.user_id"
                  :label="`${opt.real_name} (${opt.user_id})`"
                  :value="opt.user_id"
                />
              </el-select>

              <el-tooltip v-else content="点击搜索并修正" placement="top">
                <el-tag
                  type="danger"
                  class="cursor-pointer"
                  @click="
                    openUserSearch(
                      row,
                      Number(idx),
                      'instructor',
                      t.origin_name
                    )
                  "
                >
                  {{ t.origin_name }} <el-icon><Search /></el-icon>
                </el-tag>
              </el-tooltip>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="searchVisible"
      title="搜索并修正人员信息"
      width="500px"
      append-to-body
    >
      <div class="flex gap-2 mb-4">
        <el-input
          v-model="searchKeyword"
          placeholder="输入姓名或学工号"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :loading="searchLoading" @click="handleSearch"
          >搜索</el-button
        >
      </div>

      <el-table
        :data="searchResults"
        height="300"
        border
        @row-click="confirmUserSelect"
      >
        <el-table-column property="real_name" label="姓名" width="100" />
        <el-table-column property="user_id" label="学工号" width="120" />
        <el-table-column property="college" label="学院" />
        <el-table-column width="80" align="center">
          <template #default>
            <el-button link type="primary">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  CircleCheckFilled,
  WarningFilled,
  Search
} from "@element-plus/icons-vue";
import {
  getImportItems,
  updateImportItem,
  commitImportTask
} from "@/api/award";
import { searchUserByName, searchUserByID } from "@/api/user"; // 假设你有这个API
import { message } from "@/utils/message";
import * as XLSX from "xlsx"; // 引入 xlsx 库

const props = defineProps<{ taskId: number }>();
const emit = defineEmits(["cancel", "success"]);

const loading = ref(false);
const committing = ref(false);
const tableData = ref<any[]>([]);

// 搜索弹窗状态
const searchVisible = ref(false);
const searchKeyword = ref("");
const searchLoading = ref(false);
const searchResults = ref<any[]>([]);

// 当前正在修正的目标上下文
const editingContext = ref<{
  row: any;
  index: number;
  type: "participant" | "instructor";
} | null>(null);

const validCount = computed(
  () => tableData.value.filter(r => r.is_valid).length
);
// 严格模式：必须全部正确才能提交。若允许部分提交，可改为 validCount > 0
const canCommit = computed(
  () => tableData.value.every(r => r.is_valid) && tableData.value.length > 0
);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getImportItems(props.taskId);
    tableData.value = res;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// 获取显示名称的辅助函数
const getRealName = (item: any) => {
  // 如果有 selected_id，从 options 里找对应的人名
  if (item.selected_id && item.options?.length) {
    const opt = item.options.find((o: any) => o.user_id == item.selected_id);
    return opt ? opt.real_name : item.origin_name;
  }
  // 或者是 options[0] (如果没有多选)
  return item.options?.[0]?.real_name || item.origin_name;
};

// 1. 更新行数据 (Patch)
const updateRow = async (row: any) => {
  try {
    // 构造完全符合后端要求的 body
    // 注意：updateImportItem 在 api 定义是 PATCH，但这里我们发送整个 row 对象
    // 实际项目中，如果后端只接受部分字段，可以只解构需要的字段
    const res = await updateImportItem(props.taskId, row);
    // 更新本地状态
    row.is_valid = res.is_valid;
    row.error_msg = res.error_msg;
    // 如果后端返回了新的 analysis 结构，也可以在这里合并
    message("更新成功", { type: "success" });
  } catch (error) {
    message("更新失败", { type: "error" });
  }
};

// 2. 打开搜索
const openUserSearch = (
  row: any,
  index: number,
  type: "participant" | "instructor",
  defaultName: string
) => {
  editingContext.value = { row, index, type };
  searchKeyword.value = defaultName; // 预填充名字
  searchResults.value = [];
  searchVisible.value = true;
  handleSearch(); // 自动搜一下
};

// 3. 执行搜索
const handleSearch = async () => {
  if (!searchKeyword.value) return;
  searchLoading.value = true;
  try {
    const isId = /^\d+$/.test(searchKeyword.value);
    const res = isId
      ? await searchUserByID(searchKeyword.value)
      : await searchUserByName(searchKeyword.value);
    // 统一转数组
    searchResults.value = Array.isArray(res) ? res : res ? [res] : [];
  } finally {
    searchLoading.value = false;
  }
};

// 4. 选中搜索结果 -> 修正数据
const confirmUserSelect = (user: any) => {
  if (!editingContext.value) return;
  const { row, index, type } = editingContext.value;
  // 找到对应的数组
  const targetArray =
    type === "participant"
      ? row.participants_analysis
      : row.instructors_analysis;
  const targetItem = targetArray[index];

  // 修改数据结构使其变绿 (Success)
  targetItem.status = "success";
  targetItem.selected_id = user.user_id;
  // 必须把选中的人放进 options，这样显示逻辑才能找到名字
  targetItem.options = [user];

  // 关闭弹窗
  searchVisible.value = false;

  // 立即触发保存
  updateRow(row);
};

// 5. 提交入库
const handleCommit = async () => {
  committing.value = true;
  try {
    await commitImportTask(props.taskId);
    message("导入成功！", { type: "success" });
    emit("success");
  } catch (e) {
    console.error(e);
  } finally {
    committing.value = false;
  }
};

// 6. 导出未识别人员
// 计算未识别的人员总数（用于按钮显示）
const unidentifiedCount = computed(() => {
  let count = 0;
  tableData.value.forEach(row => {
    // 统计学生中的失败项
    count += row.participants_analysis.filter(
      (p: any) => p.status === "not_found"
    ).length;
    // 统计老师中的失败项
    count += row.instructors_analysis.filter(
      (t: any) => t.status === "not_found"
    ).length;
  });
  return count;
});

// 核心导出函数
const exportUnidentifiedUsers = () => {
  // 使用 Map 进行去重，Key 是姓名，Value 是行对象
  const uniqueUsers = new Map<string, any>();

  tableData.value.forEach(row => {
    // 提取当前行所有成员姓名，方便管理员参考上下文
    const allMemberNames = row.participants_analysis
      .map((p: any) => p.origin_name)
      .join(", ");

    // 处理学生
    row.participants_analysis.forEach((p: any) => {
      if (p.status === "not_found" && !uniqueUsers.has(p.origin_name)) {
        uniqueUsers.set(p.origin_name, {
          姓名: p.origin_name,
          角色: "学生",
          获奖竞赛: row.raw_competition,
          奖项: row.award_level,
          成员: allMemberNames
        });
      }
    });

    // 处理老师
    row.instructors_analysis.forEach((t: any) => {
      if (t.status === "not_found" && !uniqueUsers.has(t.origin_name)) {
        uniqueUsers.set(t.origin_name, {
          姓名: t.origin_name,
          角色: "老师",
          获奖竞赛: row.raw_competition,
          奖项: row.award_level,
          成员: allMemberNames
        });
      }
    });
  });

  // 3. 构造符合模板的所有列（填充空列）
  const finalRows = Array.from(uniqueUsers.values()).map(user => ({
    姓名: user.姓名,
    学工号: "",
    密码: "",
    角色: user.角色,
    部门: "",
    学院: "",
    手机号: "",
    邮箱: "",
    qq: "",
    专业: "",
    班级: "",
    职称: "",
    获奖竞赛: user.获奖竞赛,
    奖项: user.奖项,
    成员: user.成员
  }));

  if (finalRows.length === 0) return;

  // 4. 执行导出
  const worksheet = XLSX.utils.json_to_sheet(finalRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "待补全用户信息");
  // 设置列宽（可选，增强体验）
  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 20 }
  ];

  XLSX.writeFile(
    workbook,
    `未识别用户需补全_${new Date().toLocaleDateString()}.xlsx`
  );
  message("导出成功，请完善信息后通过‘用户管理’批量导入", { type: "success" });
};
</script>

<style scoped>
/* 简单的样式优化 */
.el-tag {
  transition: all 0.3s;
}
</style>
