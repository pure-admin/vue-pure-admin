<script lang="ts" setup>
import dayjs from "dayjs";
import { ref } from "vue";
import { ReText } from "@/components/ReText";

defineOptions({
  name: "PureText"
});

const customContent = ref("自定义tooltip内容");

const changeTooltipContent = () => {
  customContent.value =
    "现在的时间是: " + dayjs().format("YYYY-MM-DD HH:mm:ss");
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          文本省略，基于
          <el-link
            href="https://element-plus.org/zh-CN/component/text.html"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            el-text
          </el-link>
          和
          <el-link
            href="https://vue-tippy.netlify.app/basic-usage"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            VueTippy
          </el-link>
          自动省略后显示 Tooltip 提示， 支持多行省略
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/text.vue"
        target="_blank"
      >
        代码位置 src/views/components/text.vue
      </el-link>
    </template>

    <p class="mb-2">基础用法</p>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText>
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
          <ReText :lineClamp="2">
            测试文本，这是一个稍微有点长的文本，lineClamp参数为2，即两行过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />

    <p class="mb-2">自定义 Tooltip 内容</p>
    <div class="mb-2">
      <el-button @click="changeTooltipContent">
        点击切换下方 Tooltip 内容
      </el-button>
    </div>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText :tippyProps="{ content: customContent }">
            props写法 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText>
            <template #content>
              <div>
                <b>这是插槽写法: </b>
                <div>{{ customContent }}</div>
              </div>
            </template>
            插槽写法 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />
    <p class="mb-2">自定义 el-text 配置</p>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText type="primary" size="large">
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" type="info">
            测试文本，这是一个非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长的文本，lineClamp参数为4，即四行过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />
    <p class="mb-2">自定义 VueTippy 配置</p>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText
            :tippyProps="{ offset: [0, -20], theme: 'light', arrow: false }"
          >
            偏移白色无箭头 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" :tippyProps="{ followCursor: true }">
            鼠标跟随 -
            测试文本，这是一个非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长的文本，lineClamp参数为4，即四行过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />
    <p class="mb-2">组件嵌套: 不需要省略的需设置 truncated 为 false</p>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText tag="p" :lineClamp="2">
            This is a paragraph. Paragraph start
            <ReText :truncated="false">
              【 This is ReText
              <ReText tag="sup" size="small" :truncated="false">
                superscript 】
              </ReText>
            </ReText>
            <el-text>
              【 This is El-Text
              <el-text tag="sub" size="small"> subscript 】 </el-text>
            </el-text>
            <el-text tag="ins">【Inserted】</el-text>
            <el-text tag="del">【Deleted】</el-text>
            <el-text tag="mark">【Marked】</el-text>
            Paragraph end.
          </ReText>
        </li>
      </ul>
    </el-space>
  </el-card>
</template>

<style lang="scss" scoped>
.content {
  width: 400px;
  padding: 15px;
  overflow: hidden;
  resize: horizontal;
  background-color: var(--el-color-info-light-9);
  border-radius: 8px;
}
</style>
