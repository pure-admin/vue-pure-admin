<template>
  <div class="main p-4">
    <el-card shadow="never" class="mb-4 search-card">
      <el-form :inline="true" :model="filterForm" size="default">
        <el-form-item label="竞赛名称">
          <el-input
            v-model="filterForm.competitionTitle"
            placeholder="搜索名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="竞赛类别">
          <el-select
            v-model="filterForm.category"
            placeholder="全部"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="opt in categoryOptions"
              :key="opt"
              :label="opt"
              :value="opt"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="级别">
          <el-select
            v-model="filterForm.level"
            placeholder="全部"
            clearable
            style="width: 100px"
          >
            <el-option
              v-for="opt in levelOptions"
              :key="opt"
              :label="opt + '类'"
              :value="opt"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="获奖等级">
          <el-select
            v-model="filterForm.awardLevel"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="opt in awardLevelOptions"
              :key="opt"
              :label="opt"
              :value="opt"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="获奖日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="info" plain @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="font-bold">查询结果</span>
            <el-tag size="small">{{ filteredAwards.length }} 条</el-tag>
          </div>
          <el-button
            :icon="useRenderIcon('refresh')"
            circle
            @click="loadData"
          />
        </div>
      </template>

      <AwardList
        :awards="filteredAwards"
        :loading="loading"
        :currentUserId="myProfile.user_id"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getMyAwards } from "@/api/award";
import { getUserProfile } from "@/api/user";
import AwardList from "../components/AwardList.vue"; // 引入列表组件

// 筛选器表单数据
const filterForm = reactive({
  dateRange: [], // [开始日期, 结束日期]
  competitionTitle: "", // 竞赛名称模糊搜索
  category: "", // 竞赛类别
  level: "", // 竞赛级别 (A/B/C)
  awardLevel: "" // 获奖等级 (一等奖/二等奖等)
});

// 筛选选项（实际开发中建议从后端字典接口获取，这里先写死）
const categoryOptions = ["计算机类", "艺术类", "机械类", "创新创业"];
const levelOptions = ["A", "B", "C"];
const awardLevelOptions = ["特等奖", "一等奖", "二等奖", "三等奖", "优秀奖"];

const loading = ref(false);
const awards = ref([]);
const myProfile = ref<any>({});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getMyAwards();
    awards.value = Array.isArray(res) ? res : (res as any).data || [];
  } finally {
    loading.value = false;
  }
};

const filteredAwards = computed(() => {
  return awards.value.filter(item => {
    // 1. 竞赛名称搜索
    const matchTitle =
      !filterForm.competitionTitle ||
      item.competition_details?.title.includes(filterForm.competitionTitle);

    // 2. 竞赛类别筛选
    const matchCategory =
      !filterForm.category ||
      item.competition_details?.category?.name === filterForm.category;

    // 3. 竞赛级别筛选
    const matchLevel =
      !filterForm.level ||
      item.competition_details?.level?.name === filterForm.level;

    // 4. 获奖等级筛选
    const matchAwardLevel =
      !filterForm.awardLevel || item.award_level === filterForm.awardLevel;

    // 5. 日期范围筛选
    let matchDate = true;
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      const start = new Date(filterForm.dateRange[0]);
      const end = new Date(filterForm.dateRange[1]);
      const target = new Date(item.award_date);
      matchDate = target >= start && target <= end;
    }

    return (
      matchTitle && matchCategory && matchLevel && matchAwardLevel && matchDate
    );
  });
});

const resetFilters = () => {
  filterForm.competitionTitle = "";
  filterForm.category = "";
  filterForm.level = "";
  filterForm.awardLevel = "";
  filterForm.dateRange = [];
};

onMounted(async () => {
  const [profileRes] = await Promise.all([getUserProfile(), loadData()]);
  myProfile.value = profileRes;
});
</script>
