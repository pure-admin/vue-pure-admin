<script setup lang="ts">
import { ref, reactive } from "vue";
import { read, utils } from "xlsx";
import { message } from "@/utils/message";
import { registerUser } from "@/api/user";
import type { FormInstance, FormRules } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

defineOptions({
  name: "AddUser"
});

const ruleFormRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
  real_name: "",
  department: "",
  user_id: "",
  username: "",
  password: "",
  re_password: "",
  role_names: [] as string[]
});

// 角色选项
const roleOptions = [
  { label: "学生", value: "Student" },
  { label: "老师", value: "Teacher" },
  { label: "竞赛管理员", value: "CompetitionAdministrator" },
  { label: "系统管理员", value: "Administrator" }
];

// 表单校验规则
const rules = reactive<FormRules>({
  real_name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  department: [
    { required: true, message: "请输入所在部门/学院", trigger: "blur" }
  ],
  user_id: [{ required: true, message: "请输入学号/工号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  re_password: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== formData.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  role_names: [
    { required: true, message: "请至少选择一个角色", trigger: "change" }
  ]
});

// 提交逻辑
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      try {
        formData["username"] = formData["user_id"];
        const { success, data } = (await registerUser(formData)) as any;
        // 注意：根据你的 http 拦截器逻辑，可能直接返回 data 或包装对象
        message("注册成功", { type: "success" });
        // 重置表单
        formEl.resetFields();
      } catch (error) {
        message("注册失败：" + error.message, { type: "error" });
      }
    }
  });
};

// 状态控制
const loading = ref(false);
const tableData = ref<any[]>([]); // 导入数据的预览

// 处理文件上传
const handleUpload = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    // 取第一张表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // 转换为 JSON (header: 1 表示返回二维数组)
    // 建议 Excel 表头为：姓名, 部门, 学工号, 用户名, 密码, 角色
    const jsonData = utils.sheet_to_json(worksheet);
    // 数据清洗：将 Excel 的列名映射到后端字段
    tableData.value = jsonData.map((item: any) => ({
      real_name: item["姓名"],
      department: item["部门"],
      user_id: String(item["学工号"]),
      username: String(item["学工号"]),
      password: String(item["密码"]),
      re_password: String(item["密码"]),
      // 角色支持逗号分隔，如 "Teacher,Student"
      role_names: item["角色"] ? item["角色"].split(",") : ["Student"]
    }));
  };

  reader.readAsArrayBuffer(file.raw);
  return false; // 阻止自动上传
};

// 执行批量提交
const submitBatch = async () => {
  if (tableData.value.length === 0) return;
  loading.value = true;
  let successCount = 0;
  let failCount = 0;

  // 循环调用注册接口 (也可以联系后端提供一个 /batch-register 接口以提高性能)
  for (const user of tableData.value) {
    try {
      await registerUser(user);
      successCount++;
    } catch (err) {
      failCount++;
      console.error(`用户 ${user.username} 导入失败`, err);
    }
  }

  loading.value = false;
  message(`导入完成！成功 ${successCount} 条，失败 ${failCount} 条`, {
    type: failCount === 0 ? "success" : "warning"
  });
  if (successCount > 0) tableData.value = [];
};
</script>

<template>
  <div class="m-5 p-5 bg-white rounded shadow-sm">
    <h3 class="mb-5 text-lg font-bold">添加新用户</h3>

    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="max-w-150"
    >
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="formData.real_name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="所在部门/学院" prop="department">
        <el-input
          v-model="formData.department"
          placeholder="如：计算机科学与工程学院"
        />
      </el-form-item>

      <el-form-item label="学号/工号" prop="user_id">
        <el-input v-model="formData.user_id" placeholder="将作为唯一识别码" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" show-password />
      </el-form-item>

      <el-form-item label="确认密码" prop="re_password">
        <el-input
          v-model="formData.re_password"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="分配角色" prop="role_names">
        <el-select
          v-model="formData.role_names"
          multiple
          placeholder="请选择角色"
          class="w-full"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">
          提交注册
        </el-button>
        <el-button @click="ruleFormRef?.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 批量创建用户 -->
  <div class="m-5 p-5 bg-white rounded shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold">批量导入用户</h3>
      <el-link type="primary" href="/template.xlsx" download
        >下载 Excel 模板</el-link
      >
    </div>

    <el-upload
      class="upload-demo"
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleUpload"
      :show-file-list="false"
      accept=".xlsx, .xls"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
    </el-upload>

    <div v-if="tableData.length > 0" class="mt-5">
      <div class="flex justify-between mb-2">
        <span>待导入数量：{{ tableData.length }}</span>
        <el-button type="success" :loading="loading" @click="submitBatch">
          确认导入以上用户
        </el-button>
      </div>
      <el-table :data="tableData" border stripe max-height="400">
        <el-table-column prop="real_name" label="姓名" />
        <el-table-column prop="user_id" label="学工号" />
        <el-table-column prop="role_names" label="角色">
          <template #default="scope">
            <el-tag
              v-for="role in scope.row.role_names"
              :key="role"
              class="mr-1"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
