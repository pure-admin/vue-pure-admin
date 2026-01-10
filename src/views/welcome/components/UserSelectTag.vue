<template>
  <div class="flex flex-wrap gap-2 items-center">
    <el-tag
      v-for="user in details"
      :key="user.user_id"
      :type="tagTypeRender"
      :closable="!disabled"
      @close="handleRemove(user.user_id)"
    >
      {{ user.real_name }} ({{ user.user_id }})
    </el-tag>

    <el-button
      v-if="!disabled"
      type="primary"
      size="small"
      plain
      @click="openSearch"
    >
      + 添加{{ label }}
    </el-button>

    <el-dialog
      v-model="searchVisible"
      :title="`搜索并添加${label}`"
      width="500px"
      append-to-body
    >
      <div class="flex gap-2 mb-4">
        <el-input
          v-model="keyword"
          :placeholder="`输入${label}姓名或学工号`"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </div>
      <el-table v-loading="loading" :data="searchResults" height="300px">
        <el-table-column property="real_name" label="姓名" />
        <el-table-column property="user_id" label="学工号" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link @click="onSelect(row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { searchUserByID, searchUserByName } from "@/api/user";
import { message } from "@/utils/message";

// 1. 修正 TagType 定义，使其符合 Element Plus 规范
type TagType =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "primary"
  | "default";

// 2. 修正 UserDetail 接口：只保留用户本身的属性
interface UserDetail {
  user_id: string;
  real_name: string;
  department?: string;
  [key: string]: any;
}

const props = defineProps<{
  modelValue: string[];
  details: UserDetail[];
  label: string;
  disabled?: boolean;
  type?: TagType;
}>();

const emit = defineEmits(["update:modelValue", "update:details"]);

// 3. 处理 el-tag 的 type 映射逻辑
const tagTypeRender = computed(() => {
  if (!props.type || props.type === "default") return undefined;
  return props.type as any;
});

const searchVisible = ref(false);
const loading = ref(false);
const keyword = ref("");
const searchResults = ref<UserDetail[]>([]);

// 自动补全逻辑
const internalFetchDetails = async (ids: string[]) => {
  if (!ids || ids.length === 0) return;
  // 确保 details 至少是个空数组
  const currentDetails = props.details || [];
  const existingIds = currentDetails.map(d => d.user_id);
  const needFetchIds = ids.filter(id => !existingIds.includes(id));
  if (needFetchIds.length === 0) return;

  try {
    const promises = needFetchIds.map(id => searchUserByID(id));
    const results = await Promise.all(promises);
    const newDetails = results
      .map(r => (Array.isArray(r) ? r[0] : r))
      .filter(Boolean) as UserDetail[];
    // 发射更新时也要合并
    emit("update:details", [...currentDetails, ...newDetails]);
  } catch (e) {
    console.error(`补全${props.label}详情失败`, e);
  }
};

watch(
  () => props.modelValue,
  newIds => {
    // 使用可选链 ?. 并且确保 details 存在
    const currentDetailsLen = props.details?.length || 0;
    if (newIds && newIds.length > currentDetailsLen) {
      internalFetchDetails(newIds);
    }
  },
  { immediate: true }
);
const openSearch = () => {
  keyword.value = "";
  searchResults.value = [];
  searchVisible.value = true;
};

const onSearch = async () => {
  const val = keyword.value.trim();
  if (!val) return;
  loading.value = true;
  try {
    const isID = /^\d+$/.test(val);
    const res = isID ? await searchUserByID(val) : await searchUserByName(val);
    // 强制类型转换为 UserDetail[] 以匹配定义
    searchResults.value = (
      Array.isArray(res) ? res : res ? [res] : []
    ) as UserDetail[];
  } catch {
    message("搜索失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

const onSelect = (user: UserDetail) => {
  if (props.modelValue.includes(user.user_id)) {
    return message("该人员已在列表中", { type: "warning" });
  }
  emit("update:modelValue", [...props.modelValue, user.user_id]);
  emit("update:details", [...props.details, user]);
  searchVisible.value = false;
};

const handleRemove = (userId: string) => {
  emit(
    "update:modelValue",
    props.modelValue.filter(id => id !== userId)
  );
  emit(
    "update:details",
    props.details.filter(u => u.user_id !== userId)
  );
};
</script>
