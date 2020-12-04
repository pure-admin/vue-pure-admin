<template>
  <div class="info">
    <el-form :model="ruleForm" ref="ruleForm" class="rule-form">
      <el-form-item prop="userName">
        <el-input
          clearable
          v-model="ruleForm.userName"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input
          clearable
          v-model="ruleForm.passWord"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item prop="verify">
        <el-input
          v-model="ruleForm.verify"
          placeholder="请输入验证码"
        ></el-input>
        <span
          class="verify"
          title="刷新"
          v-html="ruleForm.svg"
          @click.prevent="refreshVerify"
        ></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="onLogin">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  onBeforeMount,
  getCurrentInstance,
} from "vue";

export interface ContextProps {
  userName: string;
  passWord: string;
  verify: number | null;
  svg: any;
  telephone?: number;
  dynamicText?: string;
}

export default defineComponent({
  props: {
    ruleForm: {
      type: Object as PropType<ContextProps>,
      require: true,
    },
  },
  emits: ["onLogin", "refreshVerify"],
  setup(props, ctx) {
    let vm: any;

    onBeforeMount(() => {
      vm = getCurrentInstance(); //获取组件实例
    });

    // 点击登录
    const onLogin = (evt: Object): void => {
      ctx.emit("onLogin", evt);
    };

    // 刷新验证码
    const refreshVerify = (): void => {
      ctx.emit("refreshVerify");
    };
    // 表单重置
    const resetForm = (): void => {
      vm.refs.ruleForm.resetFields();
    };

    return { resetForm, onLogin, refreshVerify };
  },
});
</script>

<style lang="scss" scoped>
.info {
  width: 30vw;
  height: 48vh;
  background: url("./login.png") no-repeat center;
  background-size: cover;
  position: absolute;
  border-radius: 20px;
  right: 100px;
  top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .rule-form {
    width: 80%;
    .verify {
      position: absolute;
      margin: -10px 0 0 -120px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
