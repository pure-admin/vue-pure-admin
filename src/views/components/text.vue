<script lang="ts" setup>
import { ReText } from "@/components/ReText";
import dayjs from "dayjs";
import { ref } from "vue";
defineOptions({
  name: "ReTextDemo"
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
        <span class="font-medium"> 文本省略 </span>
      </div>
      <div class="mb-4 text-gray-600">
        基于 El-Text 和 Tippy， 增加自动省略显示Tooltip功能， 支持多行省略
      </div>
    </template>

    <h4 class="mb-4">基础用法</h4>
    <el-space wrap>
      <ul class="con">
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

    <h4 class="mb-4">自定义tooltip内容</h4>

    <div class="mb-2">
      <el-button @click="changeTooltipContent()">
        点击切换下方tooltip的内容
      </el-button>
    </div>
    <el-space wrap>
      <ul class="con">
        <li>
          <ReText :tippyProps="{ content: customContent }">
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
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />
    <h4 class="mb-4">El-Text 配置修改</h4>
    <el-space wrap>
      <ul class="con">
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
    <h4 class="mb-4">Tippy 配置修改</h4>
    <el-space wrap>
      <ul class="con">
        <li>
          <ReText
            :tippyProps="{ offset: [0, -20], theme: 'light', arrow: false }"
          >
            偏移白色无箭头测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" :tippyProps="{ followCursor: true }">
            鼠标跟随测试文本，这是一个非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长的文本，lineClamp参数为4，即四行过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
      </ul>
    </el-space>

    <el-divider />
    <h4 class="mb-4">
      组件嵌套: 不需要省略的需设置truncated为false, 建议直接使用El-Text
    </h4>
    <el-space wrap>
      <ul class="con">
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
.con {
  width: 400px;
  padding: 15px;
  overflow: hidden;
  resize: horizontal;
  background-color: var(--el-color-info-light-9);
  border-radius: 8px;
}
</style>
