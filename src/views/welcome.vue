<template>
  <div class="welcome">
    <el-affix>
      <div class="top-content">
        <div class="left-mark">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
            title="直达仓库地址"
            alt
            @click="openDepot"
          />
          <span>{{ greetings }}</span>
        </div>
        <Flop v-if="!mobile" />
      </div>
    </el-affix>

    <!-- 图表 -->
    <el-card class="box-card">
      <el-skeleton style="height: 50vh" :rows="8" :loading="loading" animated>
        <template #default>
          <div id="brokenLine"></div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script lang="ts">
import Flop from "/@/components/ReFlop";
import { ref, computed, onMounted, nextTick } from "vue";
import { deviceDetection } from "/@/utils/deviceDetection";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";
import { echartsJson } from "/@/api/mock";
import echarts from "/@/plugins/echarts";

let brokenLine: any = null; //折线图实例
export default {
  name: "welcome",
  components: {
    Flop
  },
  setup() {
    let mobile = ref(deviceDetection());
    let date: Date = new Date();
    let loading = ref(true);

    setTimeout(() => {
      loading.value = !loading.value;
      nextTick(() => {
        initbrokenLine();
      });
    }, 500);

    let greetings = computed(() => {
      if (date.getHours() >= 0 && date.getHours() < 12) {
        return "上午阳光明媚，祝你薪水翻倍🌞！";
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        return "下午小风娇好，愿你青春不老😃！";
      } else {
        return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
      }
    });

    function initbrokenLine() {
      const lineRefDom = document.getElementById("brokenLine");
      if (!lineRefDom) return;
      brokenLine = echarts.init(lineRefDom);
      brokenLine.clear(); //清除旧画布 重新渲染

      echartsJson().then(({ info }) => {
        brokenLine.setOption({
          title: {
            text: "上海 空气质量指数",
            left: "1%"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: {
            left: "5%",
            right: "15%",
            bottom: "10%"
          },
          xAxis: {
            data: info.map(function (item) {
              return item[0];
            })
          },
          yAxis: {},
          toolbox: {
            right: 10,
            feature: {
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              startValue: "2014-06-01"
            },
            {
              type: "inside"
            }
          ],
          visualMap: {
            top: 50,
            right: 10,
            pieces: [
              {
                gt: 0,
                lte: 50,
                color: "#93CE07"
              },
              {
                gt: 50,
                lte: 100,
                color: "#FBDB0F"
              },
              {
                gt: 100,
                lte: 150,
                color: "#FC7D02"
              },
              {
                gt: 150,
                lte: 200,
                color: "#FD0100"
              },
              {
                gt: 200,
                lte: 300,
                color: "#AA069F"
              },
              {
                gt: 300,
                color: "#AC3B2A"
              }
            ],
            outOfRange: {
              color: "#999"
            }
          },
          series: {
            name: "上海 空气质量指数",
            type: "line",
            data: info.map(function (item) {
              return item[1];
            }),
            markLine: {
              silent: true,
              lineStyle: {
                color: "#333"
              },
              data: [
                {
                  yAxis: 50
                },
                {
                  yAxis: 100
                },
                {
                  yAxis: 150
                },
                {
                  yAxis: 200
                },
                {
                  yAxis: 300
                }
              ]
            }
          }
        });
      });
    }

    const openDepot = (): void => {
      window.open("https://github.com/xiaoxian521/vue-pure-admin");
    };

    onMounted(() => {
      nextTick(() => {
        useEventListener("resize", () => {
          if (!brokenLine) return;
          useTimeoutFn(() => {
            brokenLine.resize();
          }, 180);
        });
      });
    });

    tryOnUnmounted(() => {
      if (!brokenLine) return;
      brokenLine.dispose();
      brokenLine = null;
    });

    return {
      greetings,
      mobile,
      loading,
      openDepot
    };
  }
};
</script>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;
  margin-top: 1px;
  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    background: #fff;
    padding: 20px;
    border-bottom: 0.5px solid rgba($color: #ccc, $alpha: 0.3);
    .left-mark {
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .box-card {
    width: 80vw;
    margin: 10px auto;
    position: relative;
    #brokenLine {
      width: 100%;
      height: 50vh;
    }
  }
}
</style>
