<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? '编辑获奖信息' : '录入获奖信息'"
    width="650px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="对应竞赛" required>
        <el-select
          v-model="form.competition"
          placeholder="请选择竞赛"
          class="w-full"
          filterable
        >
          <el-option
            v-for="item in competitionOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="获奖等级" required>
            <el-input v-model="form.award_level" placeholder="例如：一等奖" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获奖日期" required>
            <el-date-picker
              v-model="form.award_date"
              type="date"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="获奖学生" required>
        <UserSelectTag
          v-model:modelValue="form.participants"
          v-model:details="form.participant_details"
          label="学生"
          type="primary"
        />
      </el-form-item>

      <el-form-item label="指导老师" required>
        <UserSelectTag
          v-model:modelValue="form.instructors"
          v-model:details="form.instructor_details"
          label="老师"
          type="warning"
        />
      </el-form-item>

      <el-divider content-position="left">证书附件</el-divider>

      <el-form-item label="证书编号" required>
        <el-input v-model="form.cert_no" placeholder="输入证书上的编号" />
      </el-form-item>

      <el-form-item label="上传证书图片" required>
        <el-upload
          action="#"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept="image/*"
          drag
          class="w-full"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确认提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { getCompList } from "@/api/comp";
import { createAwardWithCert } from "@/api/award";
import { createCert } from "@/api/certificate";
import UserSelectTag from "./UserSelectTag.vue";

const emit = defineEmits(["success"]);

const visible = ref(false);
const submitLoading = ref(false);
const competitionOptions = ref([]);
const uploadFile = ref<File | null>(null);
const fileList = ref([]);

const form = reactive({
  id: null,
  competition: null,
  participants: [],
  participant_details: [],
  instructors: [],
  instructor_details: [],
  award_level: "",
  award_date: "",
  cert_no: ""
});

// 暴露给父组件的打开方法
const open = (row?: any) => {
  if (row) {
    // 如果是编辑，拷贝数据
    Object.assign(form, row);
  } else {
    resetForm();
  }
  visible.value = true;
};

defineExpose({ open });

const handleFileChange = file => {
  uploadFile.value = file.raw;
};

const resetForm = () => {
  Object.assign(form, {
    id: null,
    competition: null,
    participants: [],
    participant_details: [],
    instructors: [],
    instructor_details: [],
    award_level: "",
    award_date: "",
    cert_no: ""
  });
  uploadFile.value = null;
  fileList.value = [];
};

const handleClose = () => {
  resetForm();
};

const handleSubmit = async () => {
  if (!form.competition || form.participants.length === 0 || !form.cert_no) {
    return message("请完善获奖信息", { type: "warning" });
  }
  if (!uploadFile.value && !form.id) {
    return message("请上传证书图片", { type: "warning" });
  }

  submitLoading.value = true;
  try {
    let certId = null;
    // 1. 如果有新文件，先传证书
    if (uploadFile.value) {
      const certFormData = new FormData();
      certFormData.append("cert_no", form.cert_no);
      certFormData.append("image_uri", uploadFile.value);
      const certRes = await createCert(certFormData);
      certId = certRes.id;
    }

    // 2. 创建获奖记录
    const awardFormData = new FormData();
    awardFormData.append("competition", String(form.competition));
    awardFormData.append("award_level", form.award_level);
    awardFormData.append("award_date", form.award_date);
    if (certId) awardFormData.append("certificate", certId);

    form.participants.forEach(id => awardFormData.append("participants", id));
    form.instructors.forEach(id => awardFormData.append("instructors", id));

    await createAwardWithCert(awardFormData);

    message("提交成功", { type: "success" });
    visible.value = false;
    emit("success"); // 通知父组件刷新列表
  } catch (e) {
    message(`提交失败: ${e.message}`, { type: "error" });
  } finally {
    submitLoading.value = false;
  }
};

onMounted(async () => {
  const compRes = await getCompList();
  competitionOptions.value = Array.isArray(compRes)
    ? compRes
    : (compRes as any).data || [];
});
</script>
