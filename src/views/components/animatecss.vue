<script setup lang="ts">
import { ref, watch } from "vue";
import ReAnimateSelector from "@/components/ReAnimateSelector";
import ReCodePath from "@/components/ReCodePath";

defineOptions({
  name: "AnimateCss"
});

const animate = ref("");

watch(animate, () => {
  console.log("animate", animate.value);
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <ReCodePath>
        <template #title>
          <span>
            <el-link
              href="https://animate.style/"
              target="_blank"
              style="margin: 0 4px 5px; font-size: 16px"
            >
              animate.css
            </el-link>
            选择器
          </span>
        </template>
      </ReCodePath>
    </template>
    <ReAnimateSelector v-model="animate" class="!w-[200px]" />
  </el-card>
</template>
