<script setup lang="ts">
import ReBarcode from "@/components/ReBarcode";

defineOptions({
  name: "BarCode"
});

const barcodes = [
  {
    text: "CODE128",
    type: "CODE128",
    options: {}
  },
  {
    text: "CODE39",
    type: "CODE39",
    options: {
      lineColor: "#990000"
    }
  },
  {
    text: "123456",
    type: "pharmacode",
    options: {
      background: "#eee",
      width: 5
    }
  }
];
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="font-medium">
          条形码（基于
          <el-link
            href="https://lindell.me/JsBarcode/"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            JsBarcode
          </el-link>
          生成）
        </div>
      </template>
      <el-row :gutter="12">
        <template v-for="(item, index) in barcodes" :key="index">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-card shadow="hover" class="flex justify-center">
              <ReBarcode
                :text="item.text"
                :type="item.type"
                :options="item.options"
              />
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-card>
  </div>
</template>
