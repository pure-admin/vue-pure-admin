<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import VuePdfEmbed, {
  type VuePdfEmbedMethods,
  type VuePdfEmbedData
} from "vue-pdf-embed";

defineOptions({
  name: "Pdf"
});

interface pdfRefType extends VuePdfEmbedData, VuePdfEmbedMethods {}

const { t } = useI18n();
const pdfRef = ref<pdfRefType>();
let pageCount = ref(1);
let loading = ref(true);
let currentPage = ref(1);
let currentRotation = ref(0);
let showAllPages = ref(false);
const rotations = [0, 90, 180, 270];

const source =
  "https://pure-admin-doc.vercel.app/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  pageCount.value = pdfRef.value.pageCount;
};

const showAllPagesChange = () => {
  currentPage.value = showAllPages.value ? null : 1;
};

const onPrint = () => {
  pdfRef.value.print();
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
          共{{ pageCount }}页
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
        <div class="w-170px flex-bc">
          <el-checkbox v-model="showAllPages" @change="showAllPagesChange">
            显示所有页面
          </el-checkbox>
          <el-tooltip
            effect="dark"
            :content="`翻转（当前角度${rotations[currentRotation]}度）`"
            placement="top"
          >
            <IconifyIconOnline
              icon="ic:baseline-rotate-90-degrees-ccw"
              class="cursor-pointer outline-transparent"
              @click="
                currentRotation === 3
                  ? (currentRotation = 0)
                  : (currentRotation += 1)
              "
            />
          </el-tooltip>
          <el-tooltip effect="dark" content="打印" placement="top">
            <IconifyIconOnline
              icon="ri:printer-line"
              class="cursor-pointer outline-transparent"
              @click="onPrint"
            />
          </el-tooltip>
        </div>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          class="h-full container overflow-auto"
          ref="pdfRef"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>
