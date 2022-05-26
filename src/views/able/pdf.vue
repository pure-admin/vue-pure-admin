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
const pdfRef = ref();
let loading = ref(true);
let showAllPages = ref(false);
let pageCount = ref(1);
let currentPage = ref(1);

const handleDocumentRender = () => {
  loading.value = false;
  pageCount.value = pdfRef.value.pageCount;
};

const showAllPagesChange = () => {
  currentPage.value = showAllPages.value ? null : 1;
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="font-medium">
        PDF预览（
        <el-link
          href="https://github.com/hrynko/vue-pdf-embed"
          target="_blank"
          style="font-size: 16px; margin: 0 5px 4px 0"
        >
          github地址
        </el-link>
        ）
      </div>
    </template>
    <div
      class="h-[calc(100vh-239px)]"
      v-loading="loading"
      :element-loading-text="t('status.hsLoad')"
    >
      <div class="flex justify-between items-center h-9">
        <div v-if="showAllPages" class="font-medium ml-1.25 text-xl">
          {{ pageCount }} page(s)
        </div>
        <div v-else>
          <el-pagination
            background
            layout="prev, slot, next"
            v-model:current-page="currentPage"
            :page-size="1"
            :total="pageCount"
          >
            {{ currentPage }} / {{ pageCount }}
          </el-pagination>
        </div>
        <el-checkbox v-model="showAllPages" @change="showAllPagesChange">
          Show all pages
        </el-checkbox>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          class="h-full container overflow-auto"
          ref="pdfRef"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>
