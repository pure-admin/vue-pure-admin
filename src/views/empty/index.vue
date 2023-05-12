<script setup lang="ts">
import { useRouter } from "vue-router";
import back from "@/assets/svg/back.svg?component";

defineOptions({
  name: "Empty"
});

const router = useRouter();
</script>

<template>
  <div class="w-full h-full text-center">
    <h1>业务内容模块</h1>
    <p>使用场景：需要外嵌平台某个页面，不需要展示菜单导航以及额外模块</p>
    <div class="back" title="返回上一页" @click="router.go(-1)">
      <back class="w-[80px] h-[80px]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.back {
  position: relative;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  cursor: pointer;
  background: rgb(138 150 160 / 8%);
  border-radius: 18px;
  transform: translate(-50%, -50%);

  &:hover {
    background: rgb(138 150 160 / 20%);
    transition: background 0.6s;
  }
}
</style>
