<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useWatermark } from "@pureadmin/utils";

defineOptions({
  name: "WaterMark"
});

const local = ref();
const preventLocal = ref();
const color = ref("#409EFF");
const value = ref("vue-pure-admin");
const { setWatermark, clear } = useWatermark();
const { setWatermark: setLocalWatermark, clear: clearLocal } =
  useWatermark(local);
const { setWatermark: setPreventLocalWatermark } = useWatermark(preventLocal);

onMounted(() => {
  nextTick(() => {
    setPreventLocalWatermark("无法删除的水印", {
      forever: true,
      width: 180,
      height: 70
    });
  });
});

onBeforeUnmount(() => {
  // 在离开该页面时清除整页水印
  clear();
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          <el-link
            href="https://pure-admin-utils.netlify.app/hooks/useWatermark/useWatermark"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            页面水印
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/watermark.vue"
        target="_blank"
      >
        代码位置 src/views/able/watermark.vue
      </el-link>
    </template>
    <el-space wrap class="!mb-2">
      <span> 请输入要创建水印的值：</span>
      <el-input v-model="value" class="mr-4" style="width: 200px" clearable />
      <span>请选择要创建水印的颜色：</span>
      <el-color-picker v-model="color" show-alpha />
    </el-space>

    <el-space wrap>
      <el-button plain @click="setWatermark(value, { color })">
        创建整页水印
      </el-button>
      <el-button
        plain
        @click="
          setWatermark(value, {
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ]
          })
        "
      >
        创建整页渐变水印
      </el-button>
      <el-button
        plain
        @click="
          setWatermark(value, {
            rotate: 0,
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ]
          })
        "
      >
        创建整页渐变且水平90度的水印
      </el-button>
      <el-button
        plain
        @click="
          setWatermark(value, {
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ],
            shadowConfig: [20]
          })
        "
      >
        创建整页渐变且有阴影的水印
      </el-button>
      <el-button
        plain
        @click="
          setWatermark(value, {
            globalAlpha: 0.15, // 值越低越透明
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ]
          })
        "
      >
        创建整页高透明渐变水印
      </el-button>
      <el-button plain @click="clear">清除整页水印</el-button>
    </el-space>

    <div ref="local" class="w-1/2 h-[200px] border border-sky-500 mt-4" />

    <el-space wrap class="mt-6">
      <el-button
        plain
        @click="
          setLocalWatermark('局部水印', {
            color,
            width: 140,
            height: 65
          })
        "
      >
        创建局部水印
      </el-button>
      <el-button
        plain
        @click="
          setLocalWatermark('局部水印', {
            width: 140,
            height: 65,
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ]
          })
        "
      >
        创建局部渐变水印
      </el-button>
      <el-button
        plain
        @click="
          setLocalWatermark('局部水印', {
            width: 140,
            height: 65,
            rotate: 0,
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ]
          })
        "
      >
        创建局部渐变且水平90度的水印
      </el-button>
      <el-button
        plain
        @click="
          setLocalWatermark('局部水印', {
            width: 140,
            height: 65,
            gradient: [
              { value: 0, color: 'magenta' },
              { value: 0.5, color: 'blue' },
              { value: 1.0, color: 'red' }
            ],
            shadowConfig: [20]
          })
        "
      >
        创建局部渐变且有阴影的水印
      </el-button>
      <el-button plain @click="clearLocal">清除局部水印</el-button>
    </el-space>

    <div
      ref="preventLocal"
      class="w-1/2 h-[200px] border border-indigo-500 mt-4"
    />
  </el-card>
</template>
