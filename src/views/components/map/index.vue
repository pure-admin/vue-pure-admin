<template>
  <div class="map">
    <Amap />
  </div>
</template>

<script lang="ts">
import { Amap } from "/@/components/ReMap";
export default {
  components: {
    Amap
  },
  setup() {
    return {};
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 89vh;
}
</style>
