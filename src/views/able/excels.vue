<script setup lang="ts">
import "@vue-office/excel/lib/index.css";
import VueOfficeExcel from "@vue-office/excel";

defineOptions({
  name: "Excels"
});

const excel = "https://xiaoxian521.github.io/hyperlink/other/excel.xlsx";

function renderedHandler() {
  console.log("渲染完成");
}

function errorHandler() {
  console.log("渲染失败");
}
</script>

<template>
  <vue-office-excel
    :src="excel"
    style="height: 100vh"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>
