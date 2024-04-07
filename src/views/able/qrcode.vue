<script setup lang="ts">
import { ref, unref } from "vue";
import { message } from "@/utils/message";
import ReQrcode from "@/components/ReQrcode";

defineOptions({
  name: "QrCode"
});

const qrcodeText = "vue-pure-admin";

const asyncTitle = ref("");
setTimeout(() => {
  asyncTitle.value = unref(qrcodeText);
}, 3000);
const codeClick = () => {
  message("点击事件", { type: "info" });
};
const disabledClick = () => {
  message("失效", { type: "info" });
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="font-medium">
          二维码（基于
          <el-link
            href="https://github.com/soldair/node-qrcode"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            qrcode
          </el-link>
          生成）
        </div>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/qrcode.vue"
          target="_blank"
        >
          代码位置 src/views/able/qrcode.vue
        </el-link>
      </template>
      <el-row :gutter="20" justify="space-between">
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">基础用法</div>
            <ReQrcode :text="qrcodeText" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">img标签</div>
            <ReQrcode :text="qrcodeText" tag="img" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">样式配置</div>
            <ReQrcode
              :text="qrcodeText"
              :options="{
                color: {
                  dark: '#55D187',
                  light: '#2d8cf0'
                }
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">点击事件</div>
            <ReQrcode :text="qrcodeText" @click="codeClick" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">异步内容</div>
            <ReQrcode :text="asyncTitle" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">失效</div>
            <ReQrcode
              :text="qrcodeText"
              disabled
              @disabled-click="disabledClick"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">logo配置</div>
            <ReQrcode
              :text="qrcodeText"
              logo="https://avatars.githubusercontent.com/u/44761321?v=4"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">logo样式</div>
            <ReQrcode
              :text="qrcodeText"
              :logo="{
                src: 'https://avatars.githubusercontent.com/u/44761321?v=4',
                logoSize: 0.2,
                borderSize: 0.05,
                borderRadius: 50,
                bgColor: 'blue'
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">大小配置</div>
            <ReQrcode :text="qrcodeText" :width="100" />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
