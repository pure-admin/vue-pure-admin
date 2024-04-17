<script setup lang="ts">
import { h } from "vue";
import hot from "@/assets/svg/hot.svg?component";
import { message, closeAllMessage } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Check from "@iconify-icons/ep/check";

defineOptions({
  name: "Message"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium"> 消息提示 </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/message.vue"
        target="_blank"
      >
        代码位置 src/views/components/message.vue
      </el-link>
    </template>

    <h4 class="mb-4">Element Plus 的消息提示，点击弹出提示信息</h4>

    <el-space wrap>
      <el-button
        type="info"
        @click="message('Info类型消息', { customClass: 'el' })"
      >
        Info
      </el-button>
      <el-button
        type="success"
        @click="
          message('Success类型消息', { customClass: 'el', type: 'success' })
        "
      >
        Success
      </el-button>
      <el-button
        type="warning"
        @click="
          message('Warning类型消息', { customClass: 'el', type: 'warning' })
        "
      >
        Warning
      </el-button>
      <el-button
        type="danger"
        @click="message('Error类型消息', { customClass: 'el', type: 'error' })"
      >
        Error
      </el-button>
      <el-button
        @click="message('可关闭消息', { customClass: 'el', showClose: true })"
      >
        可关闭
      </el-button>
      <el-button
        @click="
          message('分组消息合并', {
            customClass: 'el',
            type: 'success',
            grouping: true
          })
        "
      >
        分组消息合并
      </el-button>
      <el-button
        @click="
          message('自定义消息图标', {
            customClass: 'el',
            icon: useRenderIcon(Check)
          })
        "
      >
        自定义图标
      </el-button>
      <el-button
        @click="
          message('3秒后关闭', {
            customClass: 'el',
            duration: 3000,
            onClose: () =>
              message('消息已关闭', { customClass: 'el', type: 'success' })
          })
        "
      >
        自定义延时关闭时间并设置关闭后其他操作
      </el-button>
      <el-button
        @click="
          message(
            h('p', null, [
              h('span', null, 'Message can be '),
              h('i', { style: 'color: teal' }, 'VNode')
            ]),
            { customClass: 'el' }
          )
        "
      >
        自定义内容
      </el-button>
      <el-button
        @click="
          message('<strong>This is <i>HTML</i> string</strong>', {
            customClass: 'el',
            dangerouslyUseHTMLString: true
          })
        "
      >
        HTML 片段作为正文内容
      </el-button>
    </el-space>

    <el-divider />

    <h4 class="mb-4">
      类似 Ant Design 风格的消息提示，点击弹出提示信息（基于 ElMessage
      样式改版，不会影响 ElMessage
      原本样式，使用和打包大小成本极低并适配整体暗色风格）
    </h4>

    <el-space wrap>
      <el-button type="info" @click="message('Info类型消息')">Info</el-button>
      <el-button
        type="success"
        @click="message('Success类型消息', { type: 'success' })"
      >
        Success
      </el-button>
      <el-button
        type="warning"
        @click="message('Warning类型消息', { type: 'warning' })"
      >
        Warning
      </el-button>
      <el-button
        type="danger"
        @click="message('Error类型消息', { type: 'error' })"
      >
        Error
      </el-button>
      <el-button @click="message('可关闭消息', { showClose: true })">
        可关闭
      </el-button>
      <el-button
        @click="message('分组消息合并', { type: 'success', grouping: true })"
      >
        分组消息合并
      </el-button>
      <el-button
        @click="
          message('自定义消息图标', {
            icon: hot
          })
        "
      >
        自定义图标
      </el-button>
      <el-button
        @click="
          message('3秒后关闭', {
            duration: 3000,
            onClose: () => message('消息已关闭', { type: 'success' })
          })
        "
      >
        自定义延时关闭时间并设置关闭后其他操作
      </el-button>
      <el-button
        @click="
          message(
            h('p', null, [
              h('span', null, 'Message can be '),
              h('i', { style: 'color: teal' }, 'VNode')
            ])
          )
        "
      >
        自定义内容
      </el-button>
      <el-button
        @click="
          message('<strong>This is <i>HTML</i> string</strong>', {
            dangerouslyUseHTMLString: true
          })
        "
      >
        HTML 片段作为正文内容
      </el-button>
    </el-space>

    <el-divider />

    <el-button @click="closeAllMessage"> 关闭所有消息提示 </el-button>
  </el-card>
</template>
