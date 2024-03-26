<script setup lang="ts">
defineOptions({
  name: "Ripple"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <p class="font-medium">波纹(Ripple)</p>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/ripple.vue"
        target="_blank"
      >
        代码位置 src/views/able/ripple.vue
      </el-link>
    </template>
    <div class="mb-5">组件中的波纹</div>
    <el-alert
      title="v-ripple在某些组件中使用波纹特效会异常，这是因为v-ripple指令只能作用于当前元素，某些组件有多层元素嵌套，且目标元素没在顶层，所以会导致特效异常"
      type="warning"
      :closable="false"
    />
    <el-space wrap class="my-5">
      <el-button v-ripple>Default</el-button>
      <el-button v-ripple type="primary">Primary</el-button>
      <el-button v-ripple type="success">Success</el-button>
      <el-button v-ripple type="info">Info</el-button>
      <el-button v-ripple type="warning">Warning</el-button>
      <el-button v-ripple type="danger">Danger</el-button>
    </el-space>
    <el-card v-ripple class="mb-5 w-[510px] select-none" shadow="hover">
      卡片
    </el-card>

    <div class="mb-5">
      只要在组件或HTML元素上使用v-ripple指令，就可以启用基本的ripple功能
    </div>
    <div
      v-ripple
      class="mb-5 text-center shadow-md rounded-md p-8 text-lg select-none"
    >
      HTML元素
    </div>
    <span
      v-ripple
      class="inline-block shadow-md rounded-md p-8 text-lg select-none"
    >
      行内元素需要添加display: block或display: inline-block才能生效
    </span>

    <div class="my-5">
      当使用v-ripple.center时，将始终从目标的中心处产生波纹
    </div>
    <div
      v-ripple.center
      class="mb-5 text-center shadow-md rounded-md p-8 text-lg select-none"
    >
      始终从中心触发波纹
    </div>

    <div class="mb-5">
      使用v-ripple="{ class: '' }"添加类来自定义波纹颜色，支持tailwindcss
    </div>
    <el-alert
      title="自定义样式生效为文字颜色，例如：color: 'red';"
      type="warning"
      :closable="false"
    />
    <div
      v-ripple="{ class: 'text-red-500' }"
      class="my-5 text-center shadow-md rounded-md p-4 text-lg select-none"
    >
      自定义波纹颜色
    </div>
  </el-card>
</template>
