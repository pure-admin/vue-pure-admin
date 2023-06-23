<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "Directives"
});

const search = ref("");
const searchTwo = ref("");
const searchThree = ref("");
const searchFour = ref("");
const searchFive = ref("");
const searchSix = ref("copy");
const text = ref("可复制的文本");
const long = ref(false);
const cbText = ref("");
const idx = ref(0);

function onInput() {
  message(search.value);
}
function onInputTwo() {
  message(searchTwo.value);
}
function onInputThree({ name, sex }) {
  message(`${name}${sex}${searchThree.value}`);
}

function onInputFour() {
  message(searchFour.value);
}
function onInputFive({ name, sex }) {
  message(`${name}${sex}${searchFive.value}`);
}

function onLongpress() {
  long.value = true;
}
function onCustomLongpress() {
  long.value = true;
}
function onCbLongpress() {
  idx.value += 1;
  long.value = true;
  cbText.value = `持续回调${idx.value}次`;
}
function onReset() {
  long.value = false;
  cbText.value = "";
  idx.value = 0;
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">自定义防抖、截流、文本复制、长按指令</span>
      </div>
    </template>
    <div class="mb-2">
      防抖指令（连续输入，只会执行第一次点击事件，立即执行）
      <el-input
        v-optimize="{
          event: 'input',
          fn: onInput,
          immediate: true,
          timeout: 1000
        }"
        v-model="search"
        class="!w-[200px]"
        clearable
        @clear="onInput"
      />
    </div>
    <div class="mb-2">
      防抖指令（连续输入，只会执行最后一次事件，延后执行）
      <el-input
        v-optimize="{ event: 'input', fn: onInputTwo, timeout: 400 }"
        v-model="searchTwo"
        class="!w-[200px]"
        clearable
      />
    </div>
    <div>
      防抖指令（连续输入，只会执行最后一次事件，延后执行，传参用法）
      <el-input
        v-optimize="{
          event: 'input',
          fn: onInputThree,
          timeout: 400,
          params: { name: '小明', sex: '男' }
        }"
        v-model="searchThree"
        class="!w-[200px]"
        clearable
      />
    </div>

    <el-divider />

    <div class="mb-2">
      节流指令（连续输入，每一秒只会执行一次事件）
      <el-input
        v-optimize:throttle="{ event: 'input', fn: onInputFour, timeout: 1000 }"
        v-model="searchFour"
        class="!w-[200px]"
        clearable
      />
    </div>
    <div>
      节流指令（连续输入，每一秒只会执行一次事件，传参用法）
      <el-input
        v-optimize:throttle="{
          event: 'input',
          fn: onInputFive,
          params: { name: '小明', sex: '男' }
        }"
        v-model="searchFive"
        class="!w-[200px]"
        clearable
      />
    </div>

    <el-divider />

    <div class="mb-2">
      文本复制指令（双击输入框内容即可复制）
      <el-input v-copy="searchSix" v-model="searchSix" class="!w-[200px]" />
    </div>
    <div>
      文本复制指令（自定义触发事件，单击复制）
      <span v-copy:click="text" class="text-sky-500">{{ text }}</span>
    </div>

    <el-divider />
    <el-space wrap>
      长按指令
      <el-button v-longpress="onLongpress">长按（默认500ms）</el-button>
      <el-button v-longpress:1000="onCustomLongpress">
        自定义长按时长（1000ms）
      </el-button>
      <el-button v-longpress:2000:200="onCbLongpress">
        2秒后每200ms持续回调
      </el-button>
      <el-button @click="onReset"> 重置状态 </el-button>
      <el-tag :type="long ? 'success' : 'info'" class="ml-2" size="large">
        {{ long ? "当前为长按状态" : "当前非长按状态" }}
      </el-tag>
      <el-tag v-if="cbText" type="danger" class="ml-2" size="large">
        {{ cbText }}
      </el-tag>
    </el-space>
  </el-card>
</template>
