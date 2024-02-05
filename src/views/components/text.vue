<script lang="ts" setup>
import { ReText } from "@/components/ReText";
import dayjs from "dayjs";
import { ref } from "vue";
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
          <ReText needResizeObserver>
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
          <ReText :lineClamp="2" needResizeObserver>
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
          <ReText
            :tippyProps="{ content: customContent }"
            needResizeObserver
            needPropsWatch
          >
            props写法 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText needResizeObserver>
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
    <h4 class="mb-4">El-Text 配置修改</h4>
    <el-space wrap>
      <ul class="con">
        <li>
          <ReText type="primary" size="large" needResizeObserver>
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText :lineClamp="4" type="info" needResizeObserver>
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
            needResizeObserver
          >
            偏移白色无箭头 -
            测试文本，这是一个稍微有点长的文本，过长省略后，鼠标悬浮会有tooltip提示
          </ReText>
        </li>
        <li>
          <ReText
            :lineClamp="4"
            :tippyProps="{ followCursor: true }"
            needResizeObserver
          >
            鼠标跟随 -
            测试文本，这是一个非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长，非常非常长的文本，lineClamp参数为4，即四行过长省略后，鼠标悬浮会有tooltip提示
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
          <ReText tag="p" :lineClamp="2" needResizeObserver>
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
    <h4 class="mb-4">
      监听默认关闭，可通过
      <span v-tippy="{ content: '监听文本宽度变化' }" class="text-primary">
        needResizeObserver
      </span>
      和
      <span v-tippy="{ content: '监听 props 变化' }" class="text-primary">
        needPropsWatch
      </span>
      参数开启, 会增加相应的性能消耗, 上方的几个示例都开启了所需的监听,
      以下是关闭后的效果
    </h4>
    <el-space wrap>
      <ul class="con !min-w-[600px]">
        <li>
          <ReText>
            needResizeObserver=false -
            needResizeObserver未开启将无法再监听文本宽度变化，即使文本内容变化也不会重新判断是否需要显示tooltip
          </ReText>
        </li>
        <li>
          <el-button @click="customContent2 = '怎么修改不了了?'">
            点击尝试切换下方tooltip的内容(因为监听关闭, 所以无法修改)
          </el-button>
        </li>
        <li>
          <ReText :tippyProps="{ content: customContent2 }" needResizeObserver>
            needPropsWatch=false -
            needPropsWatch未开启将无法再监听props变化，即使props变化也不会重新渲染tooltip内容和配置
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
