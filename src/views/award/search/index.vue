<template>
  <div class="main p-4">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="font-bold flex items-center">
          <span>获奖记录搜索</span>
          <el-tooltip content="支持学号、老师、学院、时间等多维度联合搜索">
            <el-icon class="ml-2 cursor-help"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-form :model="queryParams" label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="学生学号/工号">
              <el-input
                v-model="queryParams.user_id"
                placeholder="输入 ID"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="指导教师姓名">
              <el-input
                v-model="queryParams.instructor_name"
                placeholder="输入教师姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属学院">
              <el-input
                v-model="queryParams.college"
                placeholder="输入学院关键词"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="竞赛类别">
              <el-select
                v-model="queryParams.category"
                placeholder="全部类别"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="竞赛级别">
              <el-select
                v-model="queryParams.level"
                placeholder="全部级别"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.id"
                  :label="item.name + '类'"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间跨度">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="YYYY-MM-DD"
                class="w-full!"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="flex items-end pb-4.5">
            <el-button
              type="primary"
              :loading="loading"
              :icon="useRenderIcon('search')"
              @click="handleSearch"
            >
              开始联合搜索
            </el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <AwardList
        :awards="awards"
        :loading="loading"
        :currentUserId="queryParams.user_id"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { QuestionFilled } from "@element-plus/icons-vue";
import { getAwardList } from "@/api/award";
import { message } from "@/utils/message";
import AwardList from "../components/AwardList.vue"; // 引用你拆分出来的组件
import { getCompCategories, getCompLevels } from "@/api/comp";

const loading = ref(false);
const awards = ref([]);
const dateRange = ref([]);

// 定义下拉框数据源
const categoryOptions = ref([]);
const levelOptions = ref([]);

/** 加载字典数据 */
const loadOptions = async () => {
  try {
    // 使用 Promise.all 并行请求，提高效率
    const [levels, categories] = await Promise.all([
      getCompLevels(),
      getCompCategories()
    ]);
    // 假设接口返回结构是 { data: [...] } 或直接是数组
    levelOptions.value = Array.isArray(levels) ? levels : levels.data;
    categoryOptions.value = Array.isArray(categories)
      ? categories
      : categories.data;
  } catch (e) {
    console.error("加载筛选项失败", e);
  }
};

// 初始参数对象
const queryParams = reactive({
  user_id: "",
  instructor_name: "",
  college: "",
  category: undefined,
  level: undefined,
  date_min: "",
  date_max: ""
});

const handleSearch = async () => {
  loading.value = true;
  // 处理日期字段
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.date_min = dateRange.value[0];
    queryParams.date_max = dateRange.value[1];
  } else {
    queryParams.date_min = "";
    queryParams.date_max = "";
  }

  try {
    const res = await getAwardList(queryParams);
    awards.value = Array.isArray(res) ? res : (res as any).data || [];
    if (awards.value.length === 0) {
      message("未找到匹配的获奖记录", { type: "info" });
    }
  } catch (e) {
    message("查询出错，请稍后再试", { type: "error" });
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  // 使用 Object.assign 批量重置，category 和 level 设为 undefined
  Object.assign(queryParams, {
    user_id: "",
    instructor_name: "",
    college: "",
    category: undefined,
    level: undefined,
    date_min: "",
    date_max: ""
  });
  dateRange.value = [];
  awards.value = [];
};

onMounted(() => {
  loadOptions();
  // 如果需要页面进来就显示全部结果，可以取消下面注释
  // handleSearch();
});
</script>
