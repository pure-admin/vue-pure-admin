<script setup lang="ts">
import { ref, watch } from "vue";

defineOptions({
  name: "DateTimePicker"
});

const size = ref("default");
const dynamicSize = ref();

const value = ref("");
const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

const value1 = ref("");
const datetimeFormat = ref("");

const value2 = ref("");
const shortcuts1 = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "上个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "三个月前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

const value3 = ref("");
const datePickerRef = ref();
const placement = ref("auto");
const checkTag = ref([
  {
    title: "auto", // https://popper.js.org/docs/v2/constructors/#options
    checked: false
  },
  {
    title: "auto-start",
    checked: false
  },
  {
    title: "auto-end",
    checked: false
  },
  {
    title: "top",
    checked: false
  },
  {
    title: "top-start",
    checked: false
  },
  {
    title: "top-end",
    checked: false
  },
  {
    title: "bottom",
    checked: false
  },
  {
    title: "bottom-start",
    checked: false
  },
  {
    title: "bottom-end",
    checked: false
  },
  {
    title: "right",
    checked: false
  },
  {
    title: "right-start",
    checked: false
  },
  {
    title: "right-end",
    checked: false
  },
  {
    title: "left",
    checked: false
  },
  {
    title: "left-start",
    checked: false
  },
  {
    title: "left-end",
    checked: false
  }
]);
const curTagMap = ref({});
function onChecked(tag, index) {
  if (size.value === "disabled") return;
  placement.value = tag.title;
  curTagMap.value[index] = Object.assign({
    ...tag,
    checked: !tag.checked
  });
  checkTag.value.map(item => (item.checked = false));
  checkTag.value[index].checked = curTagMap.value[index].checked;
  // 外部触发日期时间选择面板的打开与关闭
  curTagMap.value[index].checked
    ? datePickerRef.value.handleOpen()
    : datePickerRef.value.handleClose();
}

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
</script>

<template>
  <el-card shadow="never" :style="{ height: '100vh' }">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/datetime-picker.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            日期时间选择器
          </el-link>
          <el-radio-group v-model="size">
            <el-radio value="large">大尺寸</el-radio>
            <el-radio value="default">默认尺寸</el-radio>
            <el-radio value="small">小尺寸</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/datetime-picker.vue"
        target="_blank"
      >
        代码位置 src/views/components/datetime-picker.vue
      </el-link>
    </template>

    <p class="mb-2">日期和时间点</p>
    <el-date-picker
      v-model="value"
      type="datetime"
      class="!w-[200px]"
      placeholder="请选择日期时间"
      :shortcuts="shortcuts"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">日期时间格式</p>
    <el-radio-group
      v-model="datetimeFormat"
      class="mb-2"
      :disabled="size === 'disabled'"
      @change="value1 = ''"
    >
      <el-radio value="">Date</el-radio>
      <el-radio value="YYYY-MM-DD HH:mm:ss">年月日 时分秒</el-radio>
      <el-radio value="x">时间戳</el-radio>
    </el-radio-group>
    <br />
    <el-space wrap>
      <el-date-picker
        v-model="value1"
        type="datetime"
        class="!w-[200px]"
        placeholder="请选择日期时间"
        format="YYYY/MM/DD hh:mm:ss"
        :value-format="datetimeFormat"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <span class="ml-2">{{ value1 }}</span>
    </el-space>

    <p class="mb-2 mt-4">日期和时间范围</p>
    <el-date-picker
      v-model="value2"
      type="datetimerange"
      :shortcuts="shortcuts1"
      range-separator="至"
      start-placeholder="开始日期时间"
      end-placeholder="结束日期时间"
      :popper-options="{
        placement: 'bottom-start'
      }"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">
      弹出面板位置可控（如果弹出位置不足以完整展示面板会自动调整位置）
    </p>
    <el-space wrap class="w-[400px]">
      <el-check-tag
        v-for="(tag, index) in checkTag"
        :key="index"
        :class="[
          'select-none',
          size === 'disabled' && 'tag-disabled',
          tag.checked && 'is-active'
        ]"
        :checked="tag.checked"
        @change="onChecked(tag, index)"
      >
        {{ tag.title }}
      </el-check-tag>
    </el-space>
    <el-date-picker
      ref="datePickerRef"
      v-model="value3"
      type="datetime"
      class="ml-[15%]"
      placeholder="请选择日期时间"
      :popper-options="{
        placement
      }"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.tag-disabled {
  color: var(--el-disabled-text-color);
  cursor: not-allowed;
  background-color: var(--el-color-info-light-9);

  &:hover {
    background-color: var(--el-color-info-light-9);
  }

  &.is-active {
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
