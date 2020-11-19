<template>
  <div class="info">
    <!-- <input type="text" /><br />
    <input type="text" /><br />
    <button>1</button> -->
    <p>{{ info.userName }}</p>
    <p>{{ info.passWord }}</p>
    <p>{{ info.dynamicText }}</p>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";

export interface ContextProps {
  userName: string;
  passWord: string;
  verify?: number;
  telephone?: number;
  dynamicText: string;
}

export default defineComponent({
  props: {
    info: {
      type: Object as PropType<ContextProps>,
      require: true,
    },
  },
});
</script>

<style scoped>
.info {
  width: 30vw;
  height: 40vh;
  background: url("./login.png") no-repeat center;
  background-size: cover;
  position: absolute;
  border-radius: 20px;
  right: 100px;
  top: 35vh;
}
</style>
