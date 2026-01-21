<template>
  <div class="h-full flex flex-col bg-white p-4">
    <div class="flex justify-between items-center mb-4">
      <el-alert
        :title="`共解析 ${tableData.length} 条数据。请点击红色标签搜索修正，确认无误后提交。`"
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
          :disabled="unidentifiedCompCount === 0"
          @click="exportUnidentifiedComps"
        >
          导出未知竞赛 ({{ unidentifiedCompCount }})
        </el-button>
        <el-button
          type="warning"
          plain
          :disabled="unidentifiedCompCount === 0"
          @click="exportUnidentifiedUsers"
        >
          导出未匹配的用户 ({{ unidentifiedUserCount }})
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
      class="flex-1"
    >
      <el-table-column label="状态" width="70" align="center" fixed="left">
        <template #default="{ row }">
          <el-icon v-if="row.is_valid" color="#67C23A" size="20">
            <CircleCheckFilled />
          </el-icon>
          <el-tooltip v-else :content="row.error_msg" placement="top">
            <el-icon color="#F56C6C" size="20" class="cursor-pointer">
              <WarningFilled />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="竞赛名称" min-width="220">
        <template #default="{ row }">
          <div
            v-if="row.competition_analysis.status === 'success'"
            class="flex items-center gap-1 cursor-pointer group"
            @click="
              openSearch(
                row,
                -1,
                'competition',
                getCompDisplay(row.competition_analysis)
              )
            "
          >
            <span class="text-gray-700 font-medium group-hover:text-primary">
              {{ getCompDisplay(row.competition_analysis) }}
            </span>
            <el-tag size="small" effect="plain">{{
              getCompScale(row.competition_analysis)
            }}</el-tag>
            <el-icon class="hidden group-hover:inline text-primary"
              ><Edit
            /></el-icon>
          </div>

          <el-select
            v-else-if="row.competition_analysis.status === 'multiple'"
            v-model="row.competition_analysis.selected_id"
            placeholder="存在多个同名竞赛"
            size="small"
            class="w-full"
            @change="updateRow(row)"
          >
            <el-option
              v-for="opt in row.competition_analysis.options"
              :key="opt.id"
              :label="`${opt.title} (${opt.year}年 / ${opt.scale})`"
              :value="opt.id"
            />
          </el-select>

          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-gray-400 line-through">{{
              row.raw_competition
            }}</span>
            <el-tag
              type="danger"
              class="cursor-pointer hover:opacity-80"
              @click="openSearch(row, -1, 'competition', row.raw_competition)"
            >
              未匹配 <el-icon><Search /></el-icon>
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="获奖信息" width="140">
        <template #default="{ row }">
          <div class="font-medium">{{ row.award_level }}</div>
          <div class="text-xs text-gray-400">{{ row.award_date || "-" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="参赛学生" min-width="280">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <template v-for="(p, idx) in row.participants_analysis" :key="idx">
              <UserItem
                :item="p"
                type="student"
                @change="val => handleUserChange(row, p, val)"
                @search="
                  () =>
                    openSearch(row, Number(idx), 'participant', p.origin_name)
                "
              />
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="指导老师" min-width="250">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <template v-for="(t, idx) in row.instructors_analysis" :key="idx">
              <UserItem
                :item="t"
                type="teacher"
                @change="val => handleUserChange(row, t, val)"
                @search="
                  () =>
                    openSearch(row, Number(idx), 'instructor', t.origin_name)
                "
              />
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="searchState.visible"
      :title="searchState.title"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <div class="flex gap-2 mb-4">
        <el-input
          v-model="searchState.keyword"
          :placeholder="searchState.placeholder"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button
          type="primary"
          :loading="searchState.loading"
          @click="handleSearch"
        >
          <el-icon class="mr-1"><Search /></el-icon> 搜索
        </el-button>
      </div>

      <el-table
        :data="searchState.results"
        height="350"
        border
        stripe
        highlight-current-row
      >
        <template v-if="searchState.type === 'competition'">
          <el-table-column
            property="title"
            label="竞赛名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            property="scale"
            label="级别"
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <el-tag size="small">{{ row.scale }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            property="year"
            label="年份"
            width="70"
            align="center"
          />
          <el-table-column
            property="category_name"
            label="类别"
            width="100"
            show-overflow-tooltip
          />
        </template>

        <template v-else>
          <el-table-column property="real_name" label="姓名" width="100" />
          <el-table-column property="user_id" label="学工号" width="120" />
          <el-table-column
            property="college"
            label="学院"
            show-overflow-tooltip
          />
        </template>

        <el-table-column width="80" label="操作" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="confirmSelection(row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import {
  CircleCheckFilled,
  WarningFilled,
  Search,
  Edit
} from "@element-plus/icons-vue";
import {
  getImportItems,
  updateImportItem,
  commitImportTask
} from "@/api/award";
import { searchUserByName, searchUserByID } from "@/api/user";
import { getCompList } from "@/api/comp"; // 引入竞赛搜索API
import { message } from "@/utils/message";
import * as XLSX from "xlsx";

// ----- 子组件：UserItem (为了简化 template 逻辑，这里使用内联组件概念) -----
import UserItem from "./UserItem.vue";
// 注意：实际项目中 UserItem.vue 需单独创建，或者直接把下面 UserItem 的 template 代码写回主 template。
// 为了演示完整性，我在代码末尾附上了 UserItem 的代码。

const props = defineProps<{ taskId: number }>();
const emit = defineEmits(["cancel", "success"]);

// ----- 数据定义 -----
const loading = ref(false);
const committing = ref(false);
const tableData = ref<any[]>([]);

// 搜索状态管理
const searchState = reactive({
  visible: false,
  loading: false,
  keyword: "",
  results: [] as any[],
  type: "competition" as "competition" | "participant" | "instructor", // 当前搜索类型
  title: "",
  placeholder: "",
  // 上下文：记录当前正在修改哪一行、哪一个索引
  context: null as { row: any; index: number } | null
});

// 计算属性
const validCount = computed(
  () => tableData.value.filter(r => r.is_valid).length
);
const canCommit = computed(
  () => tableData.value.every(r => r.is_valid) && tableData.value.length > 0
);
const unidentifiedCompCount = computed(() => {
  return tableData.value.filter(
    row => row.competition_analysis.status === "not_found"
  ).length;
});
const unidentifiedUserCount = computed(() => {
  let count = 0;
  tableData.value.forEach(row => {
    if (row.competition_analysis.status === "not_found") count++;
    count += row.participants_analysis.filter(
      (p: any) => p.status === "not_found"
    ).length;
    count += row.instructors_analysis.filter(
      (t: any) => t.status === "not_found"
    ).length;
  });
  return count;
});

// ----- 核心逻辑 -----

onMounted(async () => {
  loading.value = true;
  try {
    tableData.value = await getImportItems(props.taskId);
  } finally {
    loading.value = false;
  }
});

// 获取竞赛显示名称
const getCompDisplay = (analysis: any) => {
  if (analysis.selected_id && analysis.options?.length) {
    const opt = analysis.options.find(
      (o: any) => o.id === analysis.selected_id
    );
    return opt ? opt.title : "未知竞赛";
  }
  return analysis.options?.[0]?.title || "未知竞赛";
};

const getCompScale = (analysis: any) => {
  if (analysis.selected_id && analysis.options?.length) {
    const opt = analysis.options.find(
      (o: any) => o.id === analysis.selected_id
    );
    return opt ? opt.scale : "";
  }
  return analysis.options?.[0]?.scale || "";
};

/**
 * 打开搜索框
 * @param row 行数据
 * @param index 如果是数组(人)则为索引，如果是竞赛传 -1
 * @param type 类型
 * @param defaultKeyword 默认搜索词
 */
const openSearch = (
  row: any,
  index: number,
  type: "competition" | "participant" | "instructor",
  defaultKeyword: string
) => {
  searchState.context = { row, index };
  searchState.type = type;
  searchState.keyword = defaultKeyword;
  searchState.results = [];
  searchState.visible = true;

  // 根据类型设置 UI
  if (type === "competition") {
    searchState.title = "搜索并关联竞赛";
    searchState.placeholder = "输入竞赛名称关键字";
  } else {
    searchState.title = `搜索并关联${type === "participant" ? "学生" : "老师"}`;
    searchState.placeholder = "输入姓名或学工号";
  }

  // 自动触发一次搜索
  handleSearch();
};

/** 执行搜索 API */
const handleSearch = async () => {
  if (!searchState.keyword) return;
  searchState.loading = true;
  searchState.results = [];

  try {
    if (searchState.type === "competition") {
      // 竞赛搜索
      const res = await getCompList({ search: searchState.keyword });
      searchState.results = res || [];
    } else {
      // 人员搜索
      const isId = /^\d+$/.test(searchState.keyword);
      const res = isId
        ? await searchUserByID(searchState.keyword)
        : await searchUserByName(searchState.keyword);
      searchState.results = Array.isArray(res) ? res : res ? [res] : [];
    }
  } finally {
    searchState.loading = false;
  }
};

/** 确认选择搜索结果 */
const confirmSelection = (selectedItem: any) => {
  if (!searchState.context) return;
  const { row, index } = searchState.context;

  if (searchState.type === "competition") {
    // 修正竞赛
    const target = row.competition_analysis;
    target.status = "success";
    target.selected_id = selectedItem.id;
    target.options = [selectedItem]; // 覆盖选项
  } else {
    // 修正人员
    const list =
      searchState.type === "participant"
        ? row.participants_analysis
        : row.instructors_analysis;
    const target = list[index];
    target.status = "success";
    target.selected_id = selectedItem.user_id;
    target.options = [selectedItem];
  }

  searchState.visible = false;
  updateRow(row);
};

/** 处理下拉框直接选择 (用于 multiple 状态) */
const handleDirectSelect = (
  row: any,
  index: number,
  type: string,
  val: any
) => {
  const list =
    type === "participant"
      ? row.participants_analysis
      : row.instructors_analysis;
  // UserItem 组件 v-model 绑定的是 selected_id
  // 这里其实 v-model 已经更新了 selected_id，只需要触发保存
  updateRow(row);
};

/** 保存更改到后端 */
const updateRow = async (row: any) => {
  try {
    const res = await updateImportItem(props.taskId, row);
    row.is_valid = res.is_valid;
    row.error_msg = res.error_msg;
    // 刷新一下数据本身，防止后端有额外处理
    // 注意：如果后端返回整个row结构，最好 merged 一下
    message("已更新", { type: "success" });
  } catch (error) {
    console.error(error);
  }
};

const handleCommit = async () => {
  committing.value = true;
  try {
    await commitImportTask(props.taskId);
    message("入库成功", { type: "success" });
    emit("success");
  } catch (e) {
    console.error(e);
  } finally {
    committing.value = false;
  }
};

/**
 * 新增：导出未识别的竞赛
 */
const exportUnidentifiedComps = () => {
  // 使用 Set 进行去重，只收集竞赛名称
  const uniqueComps = new Set<string>();

  tableData.value.forEach(row => {
    if (row.competition_analysis.status === "not_found") {
      uniqueComps.add(row.raw_competition);
    }
  });

  if (uniqueComps.size === 0) return;

  // 构造导出数据格式
  const finalRows = Array.from(uniqueComps).map(compName => ({
    竞赛名称: compName,
    备注: "系统未匹配到该竞赛，请在竞赛字典中添加"
  }));

  // 执行导出
  const worksheet = XLSX.utils.json_to_sheet(finalRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "待补全竞赛信息");

  // 设置列宽
  worksheet["!cols"] = [{ wch: 40 }, { wch: 40 }];

  XLSX.writeFile(
    workbook,
    `未识别竞赛需补全_${new Date().toLocaleDateString()}.xlsx`
  );
  message("导出成功，请在‘竞赛管理’中添加对应竞赛后重新导入", {
    type: "success"
  });
};
// 导出未识别人员
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

const handleUserChange = (row: any, item: any, val: any) => {
  // 在父组件里修改数据是安全的
  item.selected_id = val;
  // 更新状态为 success（如果之前是 multiple，选中后理论上就 OK 了）
  // 注意：这里取决于后端的逻辑，通常选中 ID 后该条目就有效了
  item.status = "success";
  // 立即调用 PATCH 接口同步到服务器
  updateRow(row);
};
</script>

<style scoped>
:deep(.el-tag) {
  transition: all 0.2s;
}
</style>
