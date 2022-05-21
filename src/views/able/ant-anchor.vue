<script setup lang="ts">
import { Anchor, AnchorLink } from "@pureadmin/components";

defineOptions({
  name: "AntAnchor"
});

function handleAnchorClick(e, link) {
  e.preventDefault();
  const srcolls = document.getElementById(link.href);
  srcolls.scrollIntoView({ block: "start", behavior: "smooth" });
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          仿antdv锚点，采用
          <el-link
            href="https://www.npmjs.com/package/@pureadmin/components"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/components
          </el-link>
          ，完全兼容antdv的
          <el-link
            href="https://next.antdv.com/components/anchor-cn"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            Anchor
          </el-link>
          写法
        </span>
      </div>
    </template>
    <div class="w-400px">
      <Anchor class="float-left mt-200px" @click="handleAnchorClick">
        <AnchorLink href="one" title="测试one" />
        <AnchorLink href="two" title="测试two" />
        <AnchorLink href="three" title="测试three" />
      </Anchor>

      <el-scrollbar class="float-right overflow-auto" height="600px">
        <header
          id="one"
          class="w-200px h-600px text-cyan-50 flex justify-center items-center text-4xl"
          style="background: #409eff"
        >
          测试one
        </header>
        <header
          id="two"
          class="w-200px h-600px text-cyan-50 flex justify-center items-center text-4xl"
          style="background: #67c23a"
        >
          测试two
        </header>
        <header
          id="three"
          class="w-200px h-600px text-cyan-50 flex justify-center items-center text-4xl"
          style="background: #f56c6c"
        >
          测试three
        </header>
      </el-scrollbar>
    </div>
  </el-card>
</template>
