<template>
  <el-dialog
    v-model="visible"
    title="维护团队资料"
    width="750px"
    destroy-on-close
  >
    <el-form v-loading="loading" label-width="100px">
      <TeamBasicInfo
        v-model:name="form.name"
        v-model:teachers="form.teachers"
        v-model:teacherDetails="form.teacher_details"
        v-model:members="form.members"
        v-model:memberDetails="form.member_details"
        :disabled="!canEditBasicInfo"
      />

      <TeamWorksInfo
        :current-file-url="form.works"
        :disabled="!canUploadWorks"
        @file-change="f => (pendingFiles.works = f)"
      />

      <TeamAwardInfo
        v-model:certNo="form.temp_cert_no"
        v-model:level="form.applied_award_level"
        :visible="showAwardSection"
        :current-img-url="form.attachment"
        :disabled="!canEditAward"
        @file-change="f => (pendingFiles.attachment = f)"
      />
    </el-form>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-xs text-gray-400"
          >状态：<el-tag size="small">{{ form.status_display }}</el-tag></span
        >
        <div class="flex gap-2">
          <el-button @click="visible = false">取消</el-button>
          <el-button
            v-if="hasAnyPermission"
            type="primary"
            plain
            :loading="saveLoading"
            @click="onSave(false)"
          >
            保存修改
          </el-button>
          <el-button
            v-if="canSubmit"
            type="success"
            :loading="saveLoading"
            @click="onSave(true)"
          >
            正式提交报名
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TeamBasicInfo from "./TeamBasicInfo.vue";
import TeamWorksInfo from "./TeamWorksInfo.vue";
import TeamAwardInfo from "./TeamAwardInfo.vue";
import {
  updateTeamInfo,
  uploadTeamFiles,
  getTeamDetail,
  submitTeamRegistration
} from "@/api/team";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { getEventDetail } from "@/api/comp";

const emit = defineEmits(["refresh"]);
const visible = ref(false);
const loading = ref(false);
const saveLoading = ref(false);

// 表单数据初始化
const form = ref<any>({
  teachers: [],
  teacher_details: [],
  members: [],
  member_details: []
});
const eventStatus = ref("");
const pendingFiles = ref<{ works?: File; attachment?: File }>({});

// --- 权限计算 (逻辑层) ---
const isTeamDraft = computed(
  () => form.value.status === "draft" || form.value.status === "rejected"
);

// 阶段权限
// 1. 定义什么才是“第一阶段”（报名阶段）
const isRegistrationPhase = computed(() => {
  // 只有赛事状态是 'draft' (草稿) 或 'registration' (报名中) 时，才算第一阶段
  return ["registration"].includes(eventStatus.value);
});
// 2. 基础信息编辑权限：必须同时满足 [处于报名阶段] AND [团队是草稿状态]
const canEditBasicInfo = computed(() => {
  return isRegistrationPhase.value && isTeamDraft.value;
});

const canUploadWorks = computed(
  () => isTeamDraft.value && eventStatus.value !== "archived"
);
const canEditAward = computed(() => {
  return eventStatus.value === "awarding" && isTeamDraft.value;
});
const canSubmit = computed(() => {
  return isTeamDraft.value && eventStatus.value !== "archived";
});
const showAwardSection = computed(() => {
  // 1. 只要赛事进入了评奖阶段，就该显示（无论能不能改）
  const isAwardingPhase = eventStatus.value === "awarding";
  // 2. 如果已经有获奖数据了（比如管理员审完了），也要显示
  const hasAwardData = !!form.value.applied_award_level;
  return isAwardingPhase || hasAwardData;
});
const hasAnyPermission = computed(() => {
  // 确保在评奖阶段且为草稿时，保存按钮是可见的
  return canEditBasicInfo.value || canUploadWorks.value || canEditAward.value;
});

// --- 业务方法 ---
const open = async (teamData: any) => {
  const teamId = typeof teamData === "object" ? teamData.id : teamData;
  visible.value = true;
  loading.value = true;
  pendingFiles.value = {}; // 重置待上传文件
  try {
    // 1. 获取团队基本资料
    const teamRes = await getTeamDetail(teamId);
    form.value = {
      ...teamRes,
      // 显式强制为数组，防止后端返回 null 导致 details 变成 null
      teachers: teamRes.teachers || [],
      teacher_details: teamRes.teacher_details || [],
      members: teamRes.members || [],
      member_details: teamRes.member_details || []
    };

    // 2. 关键：根据团队关联的 event ID 获取赛事当前状态
    // 注意：请确认后端返回的字段是 .event 还是 .event_id
    const eventId = teamRes.event;
    if (eventId) {
      const eventRes = await getEventDetail(eventId);
      // 这里的 eventRes.status 就会是 "awarding"、"ongoing" 等
      eventStatus.value = eventRes.status;
      console.log("成功获取关联赛事状态:", eventStatus.value);
    } else {
      console.warn("该团队未关联任何赛事 ID");
    }
  } catch (error) {
    console.error("加载详情失败:", error);
    message("获取资料失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};
const onSave = async (isFinalSubmit: boolean) => {
  if (isFinalSubmit) {
    try {
      await ElMessageBox.confirm("提交后将进入审核状态，确认提交吗？", "提示", {
        type: "warning"
      });
    } catch {
      return;
    }
  }

  saveLoading.value = true;
  const targetId = Number(form.value.id);

  try {
    // 【逻辑 A】报名阶段：更新基础信息 + 上传文件
    if (canEditBasicInfo.value) {
      const infoPayload = {
        name: form.value.name,
        teachers: form.value.teachers,
        members: form.value.members
      };
      await updateTeamInfo(targetId, infoPayload);
      if (pendingFiles.value.works) {
        const fd = new FormData();
        fd.append("works", pendingFiles.value.works);
        await uploadTeamFiles(targetId, fd);
      }
    }
    // 【逻辑 B】非报名阶段（Ongoing/Awarding）：仅上传文件或获奖信息
    else if (isTeamDraft.value) {
      const fd = new FormData();
      let hasData = false;

      if (pendingFiles.value.works) {
        fd.append("works", pendingFiles.value.works);
        hasData = true;
      }

      if (canEditAward.value) {
        if (form.value.applied_award_level)
          fd.append("applied_award_level", form.value.applied_award_level);
        if (form.value.temp_cert_no)
          fd.append("temp_cert_no", form.value.temp_cert_no);
        if (pendingFiles.value.attachment)
          fd.append("attachment", pendingFiles.value.attachment);
        hasData = true;
      }

      if (hasData) {
        await uploadTeamFiles(targetId, fd);
      }
    }

    // 【核心流转逻辑】无论哪个阶段，只要点击了“正式提交”
    if (isFinalSubmit) {
      // 调用后端流转接口，将 status 从 draft/rejected 变为 submitted
      await submitTeamRegistration(targetId);
      message("提交成功，状态已更新", { type: "success" });
    } else {
      message("保存成功", { type: "success" });
    }

    visible.value = false;
    emit("refresh");
  } catch (e) {
    message("操作失败，请重试", { type: "error" });
  } finally {
    saveLoading.value = false;
  }
};

defineExpose({ open });
</script>
