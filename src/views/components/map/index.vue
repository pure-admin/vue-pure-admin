<template>
  <div class="map">
    <amap />
  </div>
</template>

<script lang='ts'>
import amap from "../../../components/map/amap.vue";
export default {
  components: {
    amap
  },
  setup(){
    return{

    }
  },
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 89vh;
}
</style>
