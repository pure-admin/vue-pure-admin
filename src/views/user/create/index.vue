<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from "vue";
import { read, utils } from "xlsx";
import { message } from "@/utils/message";
import { getImportStatus, importUsers, registerUser } from "@/api/user";
import type { FormInstance, FormRules } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

defineOptions({ name: "AddUser" });

const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const tableData = ref<any[]>([]);

// 1. 扩展表单数据模型
const formData = reactive({
  user_id: "",
  username: "",
  password: "",
  re_password: "",
  role_names: ["Student"] as string[],
  // Profile 相关
  real_name: "",
  phone: "",
  email: "",
  qq: "",
  college: "",
  major: "",
  clazz: "",
  title: "",
  department: ""
});

// 计算属性：判断当前是否包含非学生角色（老师/管理员）
const isStaff = computed(() => {
  return formData.role_names.some(role => role !== "Student");
});

const roleOptions = [
  { label: "学生", value: "Student" },
  { label: "老师", value: "Teacher" },
  { label: "竞赛管理员", value: "CompetitionAdministrator" },
  { label: "系统管理员", value: "Administrator" }
];

// 2. 增强校验规则
const rules = reactive<FormRules>({
  real_name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  department: [{ message: "请输入所属院系/部门", trigger: "blur" }],
  user_id: [{ required: true, message: "请输入学号/工号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  re_password: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) callback(new Error("请再次输入密码"));
        else if (value !== formData.password)
          callback(new Error("两次输入密码不一致!"));
        else callback();
      },
      trigger: "blur"
    }
  ],
  role_names: [
    { required: true, message: "请至少选择一个角色", trigger: "change" }
  ],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  qq: [{ pattern: /^\d+$/, message: "请输入正确的qq号", trigger: "blur" }]
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      try {
        loading.value = true;
        // 如果是学生，提交前清空职称
        const submitData = { ...formData };
        if (!isStaff.value) submitData.title = "";
        submitData.username = submitData.user_id;
        await registerUser(submitData);
        message("注册成功", { type: "success" });
        formEl.resetFields();
      } catch (error: any) {
        message("注册失败：" + (error.message || "未知错误"), {
          type: "error"
        });
      } finally {
        loading.value = false;
      }
    }
  });
};

// 3. 处理 Excel 批量导入映射
const rawFile = ref<File | null>(null); // 存储原始文件对象
const importResult = ref<{
  total: number;
  success_count: number;
  error_count: number;
  errors: any[];
} | null>(null);

const progress = ref(0); // 进度条百分比
const isImporting = ref(false); // 是否正在处理中
const timer = ref<any>(null); // 轮询定时器

// 清除定时器，防止内存泄漏
const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

onUnmounted(() => clearTimer());

const handleUpload = (file: any) => {
  rawFile.value = file.raw; // 保存原始文件
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    tableData.value = jsonData.map((item: any) => ({
      real_name: item["姓名"],
      user_id: String(item["学工号"]),
      username: String(item["学工号"]),
      password: String(item["密码"] || "123456"),
      re_password: String(item["密码"] || "123456"),
      department: item["院系/部门"] || "",
      phone: item["手机号"] || "",
      email: item["邮箱"] || "",
      qq: item["qq"] || "",
      college: item["学院"] || "",
      major: item["专业"] || "",
      clazz: item["班级"] || "",
      title: item["职称"] || "",
      role_names: item["角色"] ? item["角色"].split(",") : ["Student"]
    }));
  };
  reader.readAsArrayBuffer(file.raw);
  return false;
};

const submitBatch = async () => {
  if (!rawFile.value) return;

  try {
    loading.value = true;
    isImporting.value = true;
    progress.value = 0;
    importResult.value = null;

    const formData = new FormData();
    formData.append("file", rawFile.value);

    // 1. 发起导入请求，获取 task_id
    const res = await importUsers(formData);
    const taskId = res.task_id;

    // 2. 开始轮询
    timer.value = setInterval(async () => {
      try {
        const statusRes = await getImportStatus(taskId);

        // 更新进度条 (假设后端返回格式为 { percent: 85 })
        if (statusRes.progress) {
          progress.value = statusRes.progress.percent;
        }

        // 3. 判断任务是否结束
        if (statusRes.status === "SUCCESS") {
          clearTimer();
          isImporting.value = false;
          loading.value = false;
          importResult.value = statusRes.result; // 后端在任务完成后将结果放入 result 字段
          message("导入任务已完成", { type: "success" });
        } else if (statusRes.status === "FAILURE") {
          clearTimer();
          isImporting.value = false;
          loading.value = false;
          message("后台处理任务失败", { type: "error" });
        }
      } catch (err) {
        clearTimer();
        isImporting.value = false;
        loading.value = false;
        console.error("轮询状态失败", err);
      }
    }, 1500); // 每 1.5 秒查询一次进度
  } catch (error: any) {
    loading.value = false;
    isImporting.value = false;
    message("提交任务失败", { type: "error" });
  }
};
</script>

<template>
  <div class="m-5 p-5 bg-white rounded shadow-sm">
    <h3 class="mb-5 text-lg font-bold">添加新用户</h3>

    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="学号/工号 (账号)" prop="user_id">
            <el-input v-model="formData.user_id" placeholder="20240001" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="确认密码" prop="re_password">
            <el-input
              v-model="formData.re_password"
              type="password"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="formData.real_name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="138..." />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="example@edu.cn" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="qq" prop="qq">
            <el-input v-model="formData.qq" placeholder="请输入qq" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="学院" prop="college">
            <el-input v-model="formData.college" placeholder="某某学院" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="院系/部门" prop="department">
            <el-input v-model="formData.department" placeholder="软件工程系" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分配角色" prop="role_names">
            <el-select
              v-model="formData.role_names"
              multiple
              collapse-tags
              placeholder="选择角色"
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
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <template v-if="formData.role_names.includes('Student')">
          <el-col :span="8">
            <el-form-item label="专业" prop="major">
              <el-input v-model="formData.major" placeholder="计算机科学" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级" prop="clazz">
              <el-input v-model="formData.clazz" placeholder="2401班" />
            </el-form-item>
          </el-col>
        </template>
        <el-col v-if="isStaff" :span="8">
          <el-form-item label="职称" prop="title">
            <el-input
              v-model="formData.title"
              placeholder="教授 / 讲师 / 行政人员"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="mt-4">
        <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit(ruleFormRef)"
          >提交注册</el-button
        >
        <el-button @click="ruleFormRef?.resetFields()">重置</el-button>
      </div>
    </el-form>
  </div>

  <div class="m-5 p-5 bg-white rounded shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold">批量导入用户</h3>
      <el-button link type="primary">
        <a href="/template.xlsx" download>下载最新版 Excel 模板</a>
      </el-button>
    </div>

    <el-upload
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

    <div
      v-if="importResult"
      class="mt-5 p-4 border-l-4 border-orange-400 bg-orange-50"
    >
      <h4 class="font-bold text-orange-700 mb-2">导入结果报告：</h4>
      <div class="flex gap-6 mb-4 text-sm">
        <span
          >总条数：<b class="text-blue-600">{{ importResult.total }}</b></span
        >
        <span
          >成功：<b class="text-green-600">{{
            importResult.success_count
          }}</b></span
        >
        <span
          >失败：<b class="text-red-600">{{
            importResult.error_count
          }}</b></span
        >
      </div>

      <el-collapse v-if="importResult.errors.length > 0">
        <el-collapse-item title="查看错误详情" name="1">
          <el-table :data="importResult.errors" size="small" border>
            <el-table-column
              prop="row"
              label="行号"
              width="80"
              align="center"
            />
            <el-table-column prop="user_id" label="学工号" width="120" />
            <el-table-column label="错误原因">
              <template #default="scope">
                <div class="text-red-500">
                  <div v-for="(val, key) in scope.row.error" :key="key">
                    <strong>{{ key }}:</strong>
                    {{ Array.isArray(val) ? val.join(", ") : val }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div v-if="isImporting" class="mb-5 p-4 bg-gray-50 rounded">
      <div class="flex justify-between mb-2 text-sm text-gray-600">
        <span>正在解析并保存数据，请勿关闭页面...</span>
        <span>{{ progress }}%</span>
      </div>
      <el-progress
        :percentage="progress"
        :status="progress === 100 ? 'success' : ''"
        :indeterminate="progress === 0"
        :stroke-width="15"
      />
    </div>

    <div v-if="tableData.length > 0" class="mt-5">
      <div class="flex justify-between mb-4 items-center">
        <el-alert
          :title="`待导入预览：共 ${tableData.length} 条数据`"
          type="info"
          :closable="false"
          show-icon
        />
        <el-button
          type="success"
          :loading="loading"
          class="ml-4"
          @click="submitBatch"
          >确认开始批量导入</el-button
        >
      </div>
      <el-table :data="tableData" border stripe max-height="400" size="small">
        <el-table-column prop="real_name" label="姓名" width="100" />
        <el-table-column prop="user_id" label="学工号" width="120" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="title" label="职称" width="100" />
        <el-table-column prop="role_names" label="角色">
          <template #default="scope">
            <el-tag
              v-for="role in scope.row.role_names"
              :key="role"
              size="small"
              class="mr-1"
              >{{ role }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
