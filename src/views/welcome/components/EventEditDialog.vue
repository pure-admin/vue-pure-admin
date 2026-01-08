<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? '编辑活动信息' : '发布新竞赛活动'"
    width="500px"
    destroy-on-close
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="所属竞赛" required>
        <el-select
          v-model="form.competition"
          :disabled="!!form.id"
          placeholder="请选择竞赛"
          class="w-full"
        >
          <el-option
            v-for="c in comps"
            :key="c.id"
            :label="c.title"
            :value="c.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称" required>
        <el-input v-model="form.name" placeholder="如：2026年春季校内选拔赛" />
      </el-form-item>
      <el-form-item label="起止时间" required>
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DDTHH:mm:ssZ"
          class="w-full"
        />
      </el-form-item>

      <el-form-item v-if="form.id" label="当前状态">
        <el-tag>{{ currentStatusDisplay }}</el-tag>
        <div class="text-xs text-gray-400 mt-1">状态流转请在列表页操作</div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确认提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { getCompList, createEvent, updateEvent } from "@/api/comp";
import { message } from "@/utils/message";

const visible = ref(false);
const comps = ref([]);
const timeRange = ref([]);
const currentStatusDisplay = ref("");
const emit = defineEmits(["refresh"]);

const form = reactive({
  id: null,
  competition: null,
  name: "",
  start_time: "",
  end_time: ""
});

const open = async (editData = null) => {
  const res = await getCompList();
  comps.value = Array.isArray(res) ? res : res.data || [];
  if (editData) {
    // 编辑：回显
    form.id = editData.id;
    form.competition = editData.competition;
    form.name = editData.name;
    timeRange.value = [editData.start_time, editData.end_time];
    currentStatusDisplay.value = editData.status_display;
  } else {
    // 新增：重置
    form.id = null;
    form.competition = null;
    form.name = "";
    timeRange.value = [];
  }
  visible.value = true;
};

const submit = async () => {
  if (!form.competition || !form.name || timeRange.value?.length < 2) {
    return message("请填写完整信息", { type: "warning" });
  }

  const submitData = {
    competition: form.competition,
    name: form.name,
    start_time: timeRange.value[0],
    end_time: timeRange.value[1]
  };

  try {
    if (form.id) {
      // 更新
      await updateEvent(form.id, submitData);
      message("更新成功", { type: "success" });
    } else {
      // 创建：此时不发送 status，后端会自动处理为 registration
      await createEvent(submitData);
      message("发布成功，当前状态：报名中", { type: "success" });
    }
    visible.value = false;
    emit("refresh");
  } catch (e) {
    console.error(e);
  }
};

defineExpose({ open });
</script>
