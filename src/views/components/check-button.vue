<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { getKeyList } from "@pureadmin/utils";

defineOptions({
  name: "CheckButton"
});

const spaceSize = ref(20);
const size = ref("default");
const dynamicSize = ref();

const radio = ref("wait");
const radioBox = ref("complete");
const radioCustom = ref("progress");

const checkboxGroup = ref(["apple", "tomato"]);
const checkboxGroupBox = ref(["cucumber", "onion", "blueberry"]);
const checkboxGroupCustom = ref(["tomato", "watermelon", "strawberry"]);

/** 单选（可控制间距的按钮样式） */
const checkTag = ref([
  {
    title: "等待中",
    checked: false
  },
  {
    title: "进行中",
    checked: true
  },
  {
    title: "已完成",
    checked: false
  }
]);
const curTagMap = ref({});
function onChecked(tag, index) {
  if (size.value === "disabled") return;
  curTagMap.value[index] = Object.assign({
    ...tag,
    checked: !tag.checked
  });
  checkTag.value.map(item => (item.checked = false));
  checkTag.value[index].checked = curTagMap.value[index].checked;
  const { title, checked } = curTagMap.value[index];
  message(checked ? `已选中${title}` : `取消选中${title}`, {
    type: "success"
  });
}

/** 多选（可控制间距的按钮样式） */
const checkGroupTag = ref([
  {
    title: "苹果",
    checked: true
  },
  {
    title: "西红柿",
    checked: true
  },
  {
    title: "香蕉",
    checked: false
  }
]);
const curTagGroupMap = ref({});
function onGroupChecked(tag, index) {
  if (size.value === "disabled") return;
  curTagGroupMap.value[index] = Object.assign({
    ...tag,
    checked: !tag.checked
  });
  checkGroupTag.value[index].checked = curTagGroupMap.value[index].checked;
}

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          可选按钮
          <br />
          <el-radio-group v-model="size" size="small">
            <el-radio-button label="large">大尺寸</el-radio-button>
            <el-radio-button label="default">默认尺寸</el-radio-button>
            <el-radio-button label="small">小尺寸</el-radio-button>
            <el-radio-button label="disabled">禁用</el-radio-button>
          </el-radio-group>
        </span>
      </div>
    </template>
    <p class="mb-2">单选（紧凑风格的按钮样式）</p>
    <el-radio-group
      v-model="radio"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-radio-button label="wait">等待中</el-radio-button>
      <el-radio-button label="progress">进行中</el-radio-button>
      <el-radio-button label="complete">已完成</el-radio-button>
    </el-radio-group>
    <el-divider />

    <p class="mb-2">单选（带有边框）</p>
    <el-radio-group
      v-model="radioBox"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-radio label="wait" border>等待中</el-radio>
      <el-radio label="progress" border>进行中</el-radio>
      <el-radio label="complete" border>已完成</el-radio>
    </el-radio-group>
    <el-divider />

    <p class="mb-2">单选（自定义内容）</p>
    <el-radio-group
      v-model="radioCustom"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-radio-button label="wait">
        <span class="flex">
          <IconifyIconOnline icon="ri:progress-8-fill" class="mr-1" />
          等待中
        </span>
      </el-radio-button>
      <el-radio-button label="progress">
        <span class="flex">
          <IconifyIconOnline icon="ri:progress-6-line" class="mr-1" />
          进行中
        </span>
      </el-radio-button>
      <el-radio-button label="complete">
        <span class="flex">
          <IconifyIconOnline icon="ri:progress-8-line" class="mr-1" />
          已完成
        </span>
      </el-radio-button>
    </el-radio-group>
    <el-divider />

    <p class="mb-2">多选（紧凑风格的按钮样式）</p>
    <el-checkbox-group
      v-model="checkboxGroup"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-checkbox-button label="apple">苹果</el-checkbox-button>
      <el-checkbox-button label="tomato">西红柿</el-checkbox-button>
      <el-checkbox-button label="banana">香蕉</el-checkbox-button>
    </el-checkbox-group>
    <el-divider />

    <p class="mb-2">多选（带有边框）</p>
    <el-checkbox-group
      v-model="checkboxGroupBox"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-checkbox label="cucumber" border>黄瓜</el-checkbox>
      <el-checkbox label="onion" border>洋葱</el-checkbox>
      <el-checkbox label="blueberry" border>蓝莓</el-checkbox>
    </el-checkbox-group>
    <el-divider />

    <p class="mb-2">多选（来点不一样的体验）</p>
    <el-checkbox-group
      v-model="checkboxGroupCustom"
      class="pure-checkbox"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <el-checkbox-button label="tomato">
        <span class="flex">
          <IconifyIconOnline icon="streamline-emojis:tomato" class="mr-1" />
          番茄
        </span>
      </el-checkbox-button>
      <el-checkbox-button label="watermelon">
        <span class="flex">
          <IconifyIconOnline
            icon="streamline-emojis:watermelon-1"
            class="mr-1"
          />
          西瓜
        </span>
      </el-checkbox-button>
      <el-checkbox-button label="strawberry">
        <span class="flex">
          <IconifyIconOnline
            icon="streamline-emojis:strawberry-1"
            class="mr-1"
          />
          草莓
        </span>
      </el-checkbox-button>
    </el-checkbox-group>
    <el-divider />

    <p>可控制间距的按钮样式</p>
    <el-slider
      v-model="spaceSize"
      class="mb-2 !w-[300px]"
      :show-tooltip="false"
      :disabled="size === 'disabled'"
    />
    <p class="mb-2">单选</p>
    <el-space wrap :size="spaceSize">
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
    <p class="mb-2 mt-4">
      多选
      {{
        getKeyList(
          checkGroupTag.filter(tag => tag.checked),
          "title"
        )
      }}
    </p>
    <el-space wrap :size="spaceSize">
      <el-check-tag
        v-for="(tag, index) in checkGroupTag"
        :key="index"
        :class="[
          'select-none',
          size === 'disabled' && 'tag-disabled',
          tag.checked && 'is-active'
        ]"
        :checked="tag.checked"
        @change="onGroupChecked(tag, index)"
      >
        {{ tag.title }}
      </el-check-tag>
    </el-space>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
  margin: 17px 0;
}

:deep(.pure-checkbox) {
  .el-checkbox-button {
    /* 选中时的自定义样式 */
    &.is-checked {
      .el-checkbox-button__inner {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-8);
        border-color: transparent;
        border-left-color: #fff;
      }
    }

    /* 禁用时的自定义样式 */
    &.is-disabled {
      .el-checkbox-button__inner {
        color: var(--el-disabled-text-color);
        background-color: var(
          --el-button-disabled-bg-color,
          var(--el-fill-color-blank)
        );
        border-color: var(
          --el-button-disabled-border-color,
          var(--el-border-color-light)
        );
      }
    }
  }
}

/** 可控制间距的按钮禁用样式 */
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
