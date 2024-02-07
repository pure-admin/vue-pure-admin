<script lang="ts" setup>
import dayjs from "dayjs";
import { ref } from "vue";
import { ReText } from "@/components/ReText";

defineOptions({
  name: "PureText"
});

const customContent = ref("自定义tooltip内容");
const customContent2 = ref("这个tooltip内容无法修改了");

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
    </template>

    <p class="mb-2">基础用法</p>
    <el-space wrap>
      <ul class="content">
        <li>
          <ReText resize>
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
          <ReText :lineClamp="2" resize>
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
          <ReText :tippyProps="{ content: customContent }" resize watch>
            props写法 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText resize>
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
          <ReText type="primary" size="large" resize>
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" type="info" resize>
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
            resize
          >
            偏移白色无箭头 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" :tippyProps="{ followCursor: true }" resize>
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
          <ReText tag="p" :lineClamp="2" resize>
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

    <el-divider />
    <p class="mb-2">
      默认关闭监听，可通过
      <span v-tippy="{ content: '监听文本宽度变化' }" class="text-primary">
        resize
      </span>
      和
      <span v-tippy="{ content: '监听 props 变化' }" class="text-primary">
        watch
      </span>
      参数自行开启
    </p>
    <el-space wrap>
      <ul class="content !min-w-[600px]">
        <li>
          <ReText>
            resize 为 false
            时将无法再监听文本宽度变化，即使文本内容变化也不会重新判断是否需要显示
            tooltip
          </ReText>
        </li>
        <li>
          <el-button @click="customContent2 = '怎么修改不了了?'">
            点击尝试切换下方 tooltip 的内容（因为默认关闭监听, 所以无法修改）
          </el-button>
        </li>
        <li>
          <ReText :tippyProps="{ content: customContent2 }" resize>
            watch 为 false 时将无法再监听 props 变化，即使 props
            变化也不会重新渲染 tooltip 内容和配置
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
