<script setup lang="ts">
export interface schemaItem {
  field: string;
  label: string;
}

defineOptions({
  name: "About"
});

const { pkg, lastBuildTime } = __APP_INFO__;
const { dependencies, devDependencies, version } = pkg;

const schema: schemaItem[] = [];
const devSchema: schemaItem[] = [];

Object.keys(dependencies).forEach(key => {
  schema.push({ field: dependencies[key], label: key });
});

Object.keys(devDependencies).forEach(key => {
  devSchema.push({ field: devDependencies[key], label: key });
});
</script>

<template>
  <div>
    <el-card class="box-card mb-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">关于</span>
        </div>
      </template>
      <span style="font-size: 15px">
        Pure-Admin 是一个基于Vue3、Vite2、TypeScript、Element-Plus
        的中后台解决方案，它可以帮助您快速搭建企业级中后台，提供现成的开箱解决方案及丰富的示例。原则上不收取任何费用及版权，可以放心使用，不过如需二次开源（比如用此平台二次开发并开源）请联系作者获取许可！
      </span>
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">项目信息</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="版本" label-align="left" align="left">
          <el-tag>{{ version }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="最后编译时间"
          label-align="left"
          align="left"
        >
          <el-tag>{{ lastBuildTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="文档地址" label-align="left" align="left">
          <a href="https://pure-admin-doc.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">文档地址</span>
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="预览地址" label-align="left" align="left">
          <a href="https://vue-pure-admin.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">预览地址</span>
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="Github" label-align="left" align="left">
          <a
            href="https://github.com/xiaoxian521/vue-pure-admin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">Github</span>
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="QQ交流群" label-align="left" align="left">
          <a href="https://jq.qq.com/?_wv=1027&k=HntMx0dt" target="_blank">
            <span style="color: var(--el-color-primary)">
              点击链接加入群聊【Pure Admin】
            </span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">生产环境依赖</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in schema"
          :key="index"
        >
          <a
            :href="'https://www.npmjs.com/package/' + item.label"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">{{ item.field }}</span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">开发环境依赖</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in devSchema"
          :key="index"
        >
          <a
            :href="'https://www.npmjs.com/package/' + item.label"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">{{ item.field }}</span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}
</style>
