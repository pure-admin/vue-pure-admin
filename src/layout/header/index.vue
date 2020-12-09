<template>
  <div class="header" :style="{ width: flag ? spreadWidth : shrinkWidth }">
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
import { ref, defineComponent, onMounted } from "vue";
import { addResizeListener } from "../../utils/resize";
import { debounce } from "../../utils/debounce";
export default defineComponent({
  setup(props, ctx) {
    let spreadWidth = ref(document.body.clientWidth - 210 + "px");
    let shrinkWidth = ref(document.body.clientWidth - 66 + "px");

    let flag = ref(true);

    const collapse = (): void => {
      flag.value = !flag.value;
      emitter.emit("collapse", flag.value);
    };

    onMounted(() => {
      const _resize = (window.onresize = () => {
        spreadWidth.value = document.body.clientWidth - 210 + "px";
        shrinkWidth.value = document.body.clientWidth - 66 + "px";
      });
      debounce(_resize, 1000);
    });

    return { flag, spreadWidth, shrinkWidth, collapse };
  }
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
