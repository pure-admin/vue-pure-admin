<script setup lang="ts">
// [TO DO] 只有销毁dialog，再修改cropper src，编辑的图片才变。
import { reactive, ref } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import uploadLine from "@iconify-icons/ri/upload-line";
import CroppingUpload from "@/views/system/user/upload.vue";
import type { FormInstance, FormRules } from "element-plus";
import { formUpload } from "@/api/mock";
import { message } from "@/utils/message";
import { createFormData, deviceDetection } from "@pureadmin/utils";
import { getMine, UserInfo } from "@/api/user";
const { userAvatar, getLogo, username } = useNav();
const cropRef = ref();
const upload = ref();
const isShow = ref(false);
const userInfoFormRef = ref<FormInstance>();
// 从服务器拉取用户信息，然后填充表单

const userInfoFormData = reactive({
  avatar: "",
  nickname: "",
  email: "",
  phone: "",
  description: ""
});

getMine().then(res => {
  Object.assign(userInfoFormData, res.data);
});

const rules = reactive<FormRules<UserInfo>>({
  nickname: [
    { required: true, message: "昵称必填", trigger: "blur" },
    { min: 3, max: 5, message: "长度最小3最大16", trigger: "blur" }
  ]
});
const imgSrc = ref("");
const onChange = uploadFile => {
  const reader = new FileReader();
  reader.onload = e => {
    imgSrc.value = e.target.result as string;
    isShow.value = true;
  };

  // reader.onloadend = () => {
  //   cropRef.value.init();
  // };
  reader.readAsDataURL(uploadFile.raw);
  /*   imgSrc.value = uploadFile.row;
  isShow.value = true; */
};

let cropperInfo: any;
const onCropper = info => {
  cropperInfo = info;
};

const handleClose = () => {
  cropRef.value.hidePopover();
  upload.value.clearFiles();
  isShow.value = false;
};

// 在编辑弹框中上传图片，获取在服务器上的url，
const handleSubmitImage = () => {
  const formData = createFormData({
    files: new File([cropperInfo], "avatar") // file 文件
  });
  formUpload(formData)
    .then(({ success, data }) => {
      if (success) {
        message("提交成功", { type: "success" });
        handleClose();
      } else {
        message("提交失败");
      }
    })
    .catch(error => {
      message(`提交异常 ${error}`, { type: "error" });
    });
};

// 监听级联选择器的值变化
const handleCascaderChange = value => {
  console.log(value);
};

// 更新基本信息
const onSubmit = async (formEl: FormInstance) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(userInfoFormData);
      console.log("验证成功!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

function createFilter(queryString) {
  return item => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
}

function querySearchEmail(queryString, callback) {
  const emailList = [
    { value: "@qq.com" },
    { value: "@126.com" },
    { value: "@163.com" }
  ];
  let results = [];
  let queryList = [];
  emailList.map(item =>
    queryList.push({ value: queryString.split("@")[0] + item.value })
  );
  results = queryString
    ? queryList.filter(createFilter(queryString))
    : queryList;
  callback(results);
}
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">个人信息</h3>
    <el-form
      ref="userInfoFormRef"
      label-position="top"
      :rules="rules"
      :model="userInfoFormData"
    >
      <el-form-item label="头像">
        <el-avatar :size="80" :src="userAvatar" />
        <el-upload
          ref="upload"
          action="#"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onChange"
          accept="image/*"
        >
          <el-button plain class="ml-4">
            <IconifyIconOffline :icon="uploadLine" />
            <span class="ml-2">更新头像</span>
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="userInfoFormData.nickname"
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-autocomplete
          v-model="userInfoFormData.email"
          :fetch-suggestions="querySearchEmail"
          :trigger-on-focus="false"
          placeholder="请输入邮箱"
          clearable
          class="w-full"
        />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input
          v-model="userInfoFormData.phone"
          placeholder="请输入联系电话"
          clearable
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          v-model="userInfoFormData.description"
          placeholder="请输入简介"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          maxlength="56"
          show-word-limit
        />
      </el-form-item>
      <el-button type="primary" @click="onSubmit(userInfoFormRef)">
        更新信息
      </el-button>
    </el-form>
    <el-dialog
      v-model="isShow"
      title="编辑头像"
      :before-close="handleClose"
      destroy-on-close
    >
      <CroppingUpload ref="cropRef" :imgSrc="imgSrc" @cropper="onCropper" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmitImage">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
