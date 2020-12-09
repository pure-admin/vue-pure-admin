<template>
  <div class="header" :style="{ width: flag ? '88vw' : '95vw' }">
    <!-- 左侧元素 -->
    <div class="left-content">
      <div class="left-icon" @click="collapse">
        <i :class="flag ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </div>
    </div>
    <!-- 右侧元素 -->
    <!-- <div class="right-content">admin</div> -->
  </div>
</template>

<script lang='ts'>
import { emitter } from "../sides/index.vue";
import { ref, defineComponent } from "vue";
export default defineComponent({
  setup(props, ctx) {
    let flag = ref(true);

    const collapse = (): void => {
      flag.value = !flag.value;
      emitter.emit("collapse", flag.value);
    };

    return { flag, collapse };
  },
});
</script>

<style lang="scss" scoped>
.header {
  float: right;
  height: 48px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;

  .left-content {
    display: flex;
    justify-content: center;
    .left-icon {
      width: 40px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      &:hover {
        background: #f6f6f6;
        cursor: pointer;
      }
      i {
        font-size: 22px;
      }
    }
  }
}
</style>
