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
      width: 187,
      height: 80
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
          页面水印功能（将平台主题改为亮白色观察水印效果更明显哦）
        </span>
      </div>
    </template>
    <span> 请输入要创建水印的值：</span>
    <el-input
      class="mb-4 mr-4"
      style="width: 200px"
      v-model="value"
      clearable
    />
    <span>请选择要创建水印的颜色：</span>
    <el-color-picker v-model="color" show-alpha />
    <br />
    <el-button @click="setWatermark(value, { fillStyle: color })">
      创建整页水印
    </el-button>
    <el-button
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
    <el-button @click="clear">清除整页水印</el-button>

    <div
      ref="local"
      class="mt-4 mb-4 w-[1080px] h-[400px] border-dotted border-2 border-sky-500"
    />
    <el-button
      @click="
        setLocalWatermark('局部水印', {
          fillStyle: color,
          width: 140,
          height: 60
        })
      "
    >
      创建局部水印
    </el-button>
    <el-button
      @click="
        setLocalWatermark('局部水印', {
          width: 140,
          height: 60,
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
      @click="
        setLocalWatermark('局部水印', {
          width: 140,
          height: 56.5,
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
      @click="
        setLocalWatermark('局部水印', {
          width: 140,
          height: 56.5,
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
    <el-button @click="clearLocal">清除局部水印</el-button>

    <div
      ref="preventLocal"
      class="mt-4 mb-4 w-[1080px] h-[400px] border-dotted border-2 border-indigo-500"
    />
  </el-card>
</template>
