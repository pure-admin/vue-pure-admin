<template>
  <div
    id="mapview"
    ref="mapview"
    v-loading="loading"
    element-loading-text="地图加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>

<script lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import {
  reactive,
  toRefs,
  defineComponent,
  onBeforeMount,
  getCurrentInstance
} from "vue";

import { mapJson } from "/@/api/mock";
import { deviceDetection } from "/@/utils/deviceDetection";

import greenCar from "/@/assets/green.png";

let MarkerCluster;

export interface MapConfigureInter {
  // eslint-disable-next-line no-undef
  on: Fn;
  // eslint-disable-next-line no-undef
  destroy?: Fn;
  // eslint-disable-next-line no-undef
  clearEvents?: Fn;
  // eslint-disable-next-line no-undef
  addControl?: Fn;
  // eslint-disable-next-line no-undef
  setCenter?: Fn;
  // eslint-disable-next-line no-undef
  setZoom?: Fn;
  // eslint-disable-next-line no-undef
  plugin?: Fn;
}

export interface mapInter {
  loading: boolean;
}

export default defineComponent({
  name: "Amap",
  setup() {
    let vm: any;
    let map: MapConfigureInter;

    const mapSet: mapInter = reactive({
      loading: deviceDetection() ? false : true
    });

    // 地图创建完成(动画关闭)
    const complete = (): void => {
      if (map) {
        map.on("complete", () => {
          mapSet.loading = false;
        });
      }
    };

    // 销毁地图实例
    const destroyMap = (): void => {
      if (map) {
        map.destroy() && map.clearEvents("click");
      }
    };

    onBeforeMount(() => {
      vm = getCurrentInstance(); //获取组件实例
      if (!vm) return;
      let { MapConfigure } = vm.appContext.config.globalProperties.$config;
      let { options } = MapConfigure;

      AMapLoader.load({
        key: MapConfigure.amapKey,
        version: "2.0",
        plugins: ["AMap.MarkerCluster"]
      })
        .then(AMap => {
          // 创建地图实例
          map = new AMap.Map(vm.refs.mapview, options);

          //地图中添加地图操作ToolBar插件
          map.plugin(["AMap.ToolBar", "AMap.MapType"], () => {
            map.addControl(new AMap.ToolBar());
            //地图类型切换
            map.addControl(
              new AMap.MapType({
                defaultType: 0
              })
            );
          });

          MarkerCluster = new AMap.MarkerCluster(map, [], {
            gridSize: 80, // 聚合网格像素大小
            maxZoom: 14,
            renderMarker(ctx) {
              let { marker, data } = ctx;
              if (Array.isArray(data) && data[0]) {
                var { driver, plateNumber, orientation } = data[0];
                var content = `<img style="transform: scale(1) rotate(${
                  360 - Number(orientation)
                }deg);" src='${greenCar}' />`;
                marker.setContent(content);
                marker.setLabel({
                  direction: "bottom",
                  offset: new AMap.Pixel(-4, 0), //设置文本标注偏移量
                  content: `<div> ${plateNumber}(${driver})</div>` //设置文本标注内容
                });
                marker.setOffset(new AMap.Pixel(-18, -10));
                marker.on("click", ({ lnglat }) => {
                  map.setZoom(13); //设置地图层级
                  map.setCenter(lnglat);
                });
              }
            }
          });

          // 获取模拟车辆信息
          mapJson()
            .then(res => {
              let points: object = res.info.map((v: any) => {
                return {
                  lnglat: [v.lng, v.lat],
                  ...v
                };
              });
              if (MarkerCluster) MarkerCluster.setData(points);
            })
            .catch(err => {
              console.log("err:", err);
            });

          complete();
        })
        .catch(() => {
          mapSet.loading = false;
          throw "地图加载失败，请重新加载";
        });
    });

    return {
      ...toRefs(mapSet),
      complete,
      destroyMap,
      greenCar
    };
  }
});
</script>

<style lang="scss" scoped>
#mapview {
  height: 100%;
}
:deep(.amap-marker-label) {
  border: none !important;
}
</style>
