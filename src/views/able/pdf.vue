<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import VuePdfEmbed from "vue-pdf-embed";

defineOptions({
  name: "Pdf"
});

const { t } = useI18n();

const source =
  "https://pure-admin-doc.vercel.app/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf";
let loading = ref(true);
const pdfRef = ref<HTMLElement | null>(null);

const hideLoading = () => {
  loading.value = false;
};
</script>

<template>
  <div
    class="h-[calc(100vh-134px)]"
    v-loading="loading"
    :element-loading-text="t('status.hsLoad')"
  >
    <el-scrollbar>
      <vue-pdf-embed
        class="h-full container overflow-auto"
        ref="pdfRef"
        :source="source"
        @rendered="hideLoading"
      />
    </el-scrollbar>
  </div>
</template>
