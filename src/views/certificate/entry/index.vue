<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>证书管理</span>
          <el-button
            type="primary"
            :icon="useRenderIcon('addFill')"
            @click="dialogVisible = true"
          >
            上传新证书
          </el-button>
        </div>
      </template>

      <pure-table
        row-key="id"
        :data="dataList"
        :columns="columns"
        :loading="loading"
      >
        <template #certImage="{ row }">
          <el-image
            class="w-25 h-15 rounded shadow-sm"
            :src="row.image_uri"
            :preview-src-list="[row.image_uri]"
            preview-teleported
            fit="cover"
          />
        </template>

        <template #operation="{ row }">
          <el-popconfirm
            title="是否确认删除该证书?"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增证书"
      width="400px"
      @closed="resetForm"
    >
      <el-form label-position="top">
        <el-form-item label="证书编号">
          <el-input v-model="form.cert_no" placeholder="请输入证书编号" />
        </el-form-item>
        <el-form-item label="证书图片">
          <el-upload
            class="uploader"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <template #trigger>
              <el-button type="primary">选择图片文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">仅支持 jpg/png 格式图片</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >上传</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import {
  getCertList,
  createCert,
  deleteCert,
  CertInfo
} from "@/api/certificate";

const loading = ref(true);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const dataList = ref([]);
const uploadFile = ref<File | null>(null);

const form = reactive({
  cert_no: ""
});

const columns: TableColumnList = [
  { label: "证书编号", prop: "cert_no" },
  { label: "预览", slot: "certImage" },
  {
    label: "创建时间",
    prop: "created_at",
    formatter: ({ created_at }) => new Date(created_at).toLocaleString()
  },
  { label: "操作", fixed: "right", slot: "operation" }
];

async function onSearch() {
  loading.value = true;
  const res = await getCertList();
  dataList.value = Array.isArray(res) ? res : (res as any).data;
  loading.value = false;
}

const handleFileChange = file => {
  uploadFile.value = file.raw;
};

async function handleSubmit() {
  if (!form.cert_no || !uploadFile.value) {
    return message("请填写编号并选择图片", { type: "warning" });
  }

  submitLoading.value = true;
  const formData = new FormData();
  formData.append("cert_no", form.cert_no);
  formData.append("image_uri", uploadFile.value);

  try {
    await createCert(formData);
    message("证书上传成功", { type: "success" });
    dialogVisible.value = false;
    onSearch();
  } catch (e) {
    message("上传失败", { type: "error" });
  } finally {
    submitLoading.value = false;
  }
}

async function handleDelete(row: CertInfo) {
  await deleteCert(row.id);
  message("删除成功", { type: "success" });
  onSearch();
}

function resetForm() {
  form.cert_no = "";
  uploadFile.value = null;
}

onMounted(onSearch);
</script>

<style scoped>
.uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}
</style>
