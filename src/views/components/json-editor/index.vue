<script setup lang="ts">
import { reactive, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

defineOptions({
  name: "JsonEditor"
});

const defaultData = {
  status: 200,
  text: "",
  error: null,
  config: undefined,
  data: [
    {
      news_id: 51184,
      title: "iPhone X Review: Innovative future with real black technology",
      source: "Netease phone"
    },
    {
      news_id: 51183,
      title:
        "Traffic paradise: How to design streets for people and unmanned vehicles in the future?",
      source: "Netease smart",
      link: "http://netease.smart/traffic-paradise/1235"
    },
    {
      news_id: 51182,
      title:
        "Teslamask's American Business Relations: The government does not pay billions to build factories",
      source: "AI Finance",
      members: ["Daniel", "Mike", "John"]
    }
  ]
};

const state = reactive({
  val: JSON.stringify(defaultData),
  data: defaultData,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});

watch(
  () => state.val,
  newVal => {
    try {
      state.data = JSON.parse(newVal);
    } catch (err) {
      // console.log('JSON ERROR');
    }
  }
);

watch(
  () => state.data,
  newVal => {
    try {
      state.val = JSON.stringify(newVal);
    } catch (err) {
      // console.log('JSON ERROR');
    }
  }
);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          JSON编辑器组件，采用开源的
          <el-link
            href="https://github.com/leezng/vue-json-pretty"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            vue-json-pretty
          </el-link>
          （支持大数据量）。
        </span>
        <span class="font-medium">
          当然我们还有一款代码编辑器组件推荐（这里就不做演示了），采用开源的
          <el-link
            href="https://github.com/surmon-china/vue-codemirror"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            codemirror6
          </el-link>
        </span>
      </div>
    </template>
    <vue-json-pretty
      v-model:data="state.data"
      :deep="state.deep"
      :show-double-quotes="state.showDoubleQuotes"
      :show-line="state.showLine"
      :show-length="state.showLength"
      :show-icon="state.showIcon"
      :show-line-number="state.showLineNumber"
      :editable="state.editable"
      :editable-trigger="(state.editableTrigger as any)"
    />
  </el-card>
</template>
