<template>
  <div>
    <el-divider content-position="left">基础信息 (仅报名期可改)</el-divider>
    <el-form-item label="团队名称" required>
      <el-input
        :model-value="name"
        placeholder="请输入团队名称"
        :disabled="disabled"
        @update:model-value="$emit('update:name', $event)"
      />
    </el-form-item>

    <el-form-item label="指导老师">
      <UserSelectTag
        :model-value="teachers"
        label="导师"
        :disabled="disabled"
        :details="teacherDetails"
        @update:model-value="$emit('update:teachers', $event)"
        @update:details="$emit('update:teacherDetails', $event)"
      />
    </el-form-item>

    <el-form-item label="团队成员">
      <UserSelectTag
        :model-value="members"
        label="成员"
        type="success"
        :disabled="disabled"
        :details="memberDetails"
        @update:model-value="$emit('update:members', $event)"
        @update:details="$emit('update:memberDetails', $event)"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import UserSelectTag from "./UserSelectTag.vue";

// 接收父组件传来的 disabled
defineProps<{
  name: string;
  teachers: string[];
  teacherDetails: any[];
  members: string[];
  memberDetails: any[];
  disabled: boolean; // 关键属性
}>();

defineEmits([
  "update:name",
  "update:teachers",
  "update:teacherDetails",
  "update:members",
  "update:memberDetails"
]);
</script>
