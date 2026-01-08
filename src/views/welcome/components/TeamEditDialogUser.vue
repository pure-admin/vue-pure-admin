<template>
  <el-dialog
    v-model="visible"
    title="维护团队资料"
    width="650px"
    destroy-on-close
  >
    <el-form :model="form" label-width="100px" :disabled="isAllDisabled">
      <el-divider content-position="left">基础信息 (报名阶段可改)</el-divider>
      <el-form-item label="团队名称" required>
        <el-input v-model="form.name" :disabled="!isRegistrationPhase" />
      </el-form-item>

      <el-form-item label="指导老师" :disabled="!isRegistrationPhase">
        <el-select
          v-model="form.teachers"
          multiple
          placeholder="请搜索并选择导师"
        >
          >
        </el-select>
      </el-form-item>

      <el-form-item label="作品附件">
        <el-upload action="/api/upload/" :disabled="!isRegistrationPhase">
          <el-button type="primary" size="small">上传作品</el-button>
        </el-upload>
      </el-form-item>

      <el-divider content-position="left">获奖与证书 (评奖阶段开放)</el-divider>
      <div :class="{ 'opacity-50 pointer-events-none': !isAwardingPhase }">
        <el-form-item label="获奖等级">
          <el-select
            v-model="form.applied_award_level"
            placeholder="请选择获奖等级"
          >
            <el-option label="一等奖" value="first" />
            <el-option label="二等奖" value="second" />
            <el-option label="三等奖" value="third" />
          </el-select>
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input
            v-model="form.temp_cert_no"
            placeholder="请输入证书上的编号"
          />
        </el-form-item>
        <el-form-item label="证书扫描件">
          <el-upload action="/api/upload/" list-type="picture-card">
            <IconifyIconOffline icon="ep:plus" />
          </el-upload>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="!isAllDisabled" type="primary" @click="handleSave"
        >保存修改</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { updateTeamInfo } from "@/api/team";
import { message } from "@/utils/message";

const visible = ref(false);
const form = ref<any>({});
const eventStatus = ref(""); // 记录所属赛事的状态

// 逻辑判断
const isRegistrationPhase = computed(
  () => eventStatus.value === "registration"
);
const isAwardingPhase = computed(() => eventStatus.value === "awarding");
// 如果赛事已归档，则全部不可点
const isAllDisabled = computed(() => eventStatus.value === "archived");

const open = (teamData: any) => {
  form.value = { ...teamData };
  // 重要：需要从 team 数据中拿到它所属 event 的当前状态
  eventStatus.value = teamData.event_status;
  visible.value = true;
};

const handleSave = async () => {
  try {
    // 根据当前阶段只发送允许修改的字段
    let payload = {};
    if (isRegistrationPhase.value) {
      payload = {
        name: form.value.name,
        teachers: form.value.teachers,
        works: form.value.works
      };
    } else if (isAwardingPhase.value) {
      payload = {
        applied_award_level: form.value.applied_award_level,
        temp_cert_no: form.value.temp_cert_no,
        attachment: form.value.attachment
      };
    }

    await updateTeamInfo(form.value.id, payload);
    message("保存成功", { type: "success" });
    visible.value = false;
  } catch (e) {
    console.error(e);
  }
};

defineExpose({ open });
</script>
