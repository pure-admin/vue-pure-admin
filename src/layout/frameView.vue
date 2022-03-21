<template>
  <div class="frame" v-loading="loading">
    <iframe :src="frameSrc" class="frame-iframe" ref="frameRef" />
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, unref, onMounted, nextTick } from "vue";

const loading = ref(false);
const currentRoute = useRoute();
const frameSrc = ref<string>("");
const frameRef = ref<HTMLElement | null>(null);

if (unref(currentRoute.meta)?.frameSrc) {
  frameSrc.value = unref(currentRoute.meta)?.frameSrc as string;
}

function hideLoading() {
  loading.value = false;
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe as any;
    if (_frame.attachEvent) {
      _frame.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  loading.value = true;
  init();
});
</script>

<style lang="scss" scoped>
.frame {
  height: 100vh;
  z-index: 998;

  .frame-iframe {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
    box-sizing: border-box;
  }
}

.main-content {
  margin: 0 !important;
}
</style>
