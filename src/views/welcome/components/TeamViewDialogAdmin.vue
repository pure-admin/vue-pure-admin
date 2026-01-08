<template>
  <el-dialog v-model="visible" title="团队报名详情 (管理员预览)" width="700px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="团队名称">{{
        form.name
      }}</el-descriptions-item>
      <el-descriptions-item label="所属赛事">{{
        form.event_name
      }}</el-descriptions-item>
      <el-descriptions-item label="队长姓名">{{
        form.leader_name
      }}</el-descriptions-item>
      <el-descriptions-item label="团队状态">
        <el-tag>{{ form.status_display }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <h4 class="mt-4 mb-2 font-bold">指导老师</h4>
    <el-table :data="form.teachers" size="small" border>
      <el-table-column prop="username" label="工号/UID" width="120" />
      <el-table-column prop="first_name" label="姓名" />
    </el-table>

    <h4 class="mt-4 mb-2 font-bold">团队成员</h4>
    <el-table :data="form.members" size="small" border>
      <el-table-column prop="username" label="学号/UID" width="120" />
      <el-table-column prop="first_name" label="姓名" />
    </el-table>

    <div v-if="form.works" class="mt-4">
      <span class="font-bold">作品/附件：</span>
      <el-link :href="form.works" target="_blank" type="primary"
        >点击查看作品文件</el-link
      >
    </div>

    <div v-if="form.status === 'awarded'" class="mt-4 p-4 bg-gray-50 rounded">
      <div class="font-bold text-orange-600 mb-2">获奖信息记录：</div>
      <p>获奖等级：{{ form.applied_award_level || "未录入" }}</p>
      <p>证书编号：{{ form.temp_cert_no || "未录入" }}</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const form = ref<any>({});

const open = (data: any) => {
  form.value = data;
  visible.value = true;
};

defineExpose({ open });
</script>
