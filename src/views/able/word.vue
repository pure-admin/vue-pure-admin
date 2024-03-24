<script setup lang="ts">
import "@vue-office/docx/lib/index.css";
import VueOfficeDocx from "@vue-office/docx";

defineOptions({
  name: "Word"
});

const docx = "https://xiaoxian521.github.io/hyperlink/other/word.docx";

function rendered() {
  console.log("渲染完成");
}
</script>

<template>
  <vue-office-docx :src="docx" @rendered="rendered" />
</template>
