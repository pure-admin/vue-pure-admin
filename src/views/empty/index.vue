<script setup lang="ts">
import back from "@/assets/svg/back.svg?component";

defineOptions({
  name: "Empty"
});
</script>

<template>
  <div class="w-full h-full text-center">
    <h1>业务内容模块</h1>
    <p>使用场景：需要外嵌平台某个页面，不需要展示菜单导航以及额外模块</p>
    <div class="back" title="返回上一页" @click="$router.go(-1)">
      <back class="w-[80px] h-[80px]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.back {
  width: 200px;
  height: 200px;
  cursor: pointer;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(138, 150, 160, 0.08);

  &:hover {
    background: rgba(138, 150, 160, 0.2);
    transition: background 0.6s;
  }
}
</style>
