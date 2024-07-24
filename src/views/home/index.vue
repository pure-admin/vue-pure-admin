<template>
  <el-main style="background-color: #f5f7fa; height: 100%">
    <el-row :gutter="20">
      <el-col :span="24">
        <StatisticCard />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 4vh">
      <!-- 右侧执行成功率top -->
      <el-col :span="6">
        <el-card style="max-width: 480px; height: 100%">
          <template #header>
            <div
              class="card-header"
              style="display: flex; justify-content: center"
            >
              <span style="font-weight: 800">工程用例执行成功率TOP5</span>
            </div>
          </template>
          <div
            v-for="o in 5"
            :key="o"
            class="list-group-item item-color-normal"
            style="display: flex; justify-content: space-between"
          >
            <p class="name">{{ "project " + o }}</p>
            <!-- 需要补全v-if 显示不同颜色的成功率 -->
            <p class="rate">80%</p>
          </div>
        </el-card>
      </el-col>

      <!-- 中部图表区域 -->
      <el-col
        :span="12"
        style="
          background-color: white;
          border-radius: 4px;
          box-shadow: var(--el-box-shadow-light);
          padding: 2vh;
        "
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <div
              id="total-success-rate-pie"
              style="width: auto; height: 400px"
            />
          </el-col>
          <el-col :span="12">
            <div
              id="success-rate-trend-line"
              style="width: auto; height: 400px"
            />
          </el-col>
        </el-row>
      </el-col>

      <!-- 简介区域 -->
      <el-col :span="6">
        <IntroCard />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 2vh">
      <el-col :span="24">
        <el-table
          :data="tableData"
          stripe
          style="
            width: 100%;
            border-radius: 4px;
            box-shadow: var(--el-box-shadow-light);
          "
        >
          <el-table-column prop="date" label="执行时间" width="300" />
          <el-table-column prop="casename" label="用例名称" width="300" />
          <el-table-column prop="project" label="所属项目" width="300" />
          <el-table-column prop="user" label="执行用户" width="300">
            <template #default="scope">
              <el-popover
                effect="light"
                trigger="hover"
                placement="top"
                width="auto"
              >
                <template #default>
                  <div>用户: {{ scope.row.user }}</div>
                  <div>部门: {{ scope.row.user }}</div>
                  <div>邮箱: {{ scope.row.project }}</div>
                  <div>手机: {{ scope.row.project }}</div>
                </template>
                <template #reference>
                  <el-tag>{{ scope.row.user }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" width="300">
            <template #default="scope">
              <div
                v-if="scope.row.result == 'Pass'"
                style="display: flex; align-items: center"
              >
                <el-icon>
                  <CircleCheckFilled color="#529b2e" />
                </el-icon>
                <el-text class="mx-1" type="success" style="margin-left: 5px">{{
                  scope.row.result
                }}</el-text>
              </div>
              <div v-else style="display: flex; align-items: center">
                <el-icon>
                  <CircleCloseFilled color="#c45656" />
                </el-icon>
                <el-text class="mx-1" type="danger" style="margin-left: 5px">{{
                  scope.row.result
                }}</el-text>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" onclick="">查看</el-button>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-main>
</template>
<script setup>
defineOptions({
  name: "Home"
});
import StatisticCard from "@/views/home/Cards.vue";
import IntroCard from "@/views/home/Introduce.vue";
import { getCurrentInstance, onMounted } from "vue";
import moment from "moment";
let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

let SuccessRateTrendXAxis = [];
for (let i = 7; i > 0; i--) {
  let date = moment().subtract(i, "days").format("MM-DD");
  SuccessRateTrendXAxis.push(date);
}
const tableData = [
  {
    date: "2024-07-19",
    casename: "Case 1",
    project: "Project 1",
    user: "tom",
    result: "Pass"
  },
  {
    date: "2024-07-19",
    casename: "Case 2",
    project: "Project 1",
    user: "tom",
    result: "Fail"
  },
  {
    date: "2024-07-19",
    casename: "Case 3",
    project: "Project 1",
    user: "tom",
    result: "Pass"
  },
  {
    date: "2024-07-19",
    casename: "Case 4",
    project: "Project 1",
    user: "tom",
    result: "Pass"
  }
];

const myEcharts = () => {
  // 基于准备好的dom，初始化echarts实例
  var totalSuccessRateChart = echarts.init(
    document.getElementById("total-success-rate-pie")
  );
  var SuccessRateTrendChart = echarts.init(
    document.getElementById("success-rate-trend-line")
  );

  // 指定图表的配置项和数据
  const total_success_rate_pie_option = () => {
    const option = {
      title: {
        text: "测试用例执行总成功率",
        x: "center",
        y: "bottom"
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: 10,
        data: ["成功", "失败"]
      },
      graphic: [
        {
          type: "text",
          left: "center",
          top: "45%",
          style: {
            text: `总成功率\n90%`,
            textAlign: "center",
            fill: "#4577ff",
            width: 30,
            height: 30,
            fontSize: 20,
            fontWeight: "bold"
          }
        }
      ],
      series: [
        {
          name: "测试结果占比",
          type: "pie",
          radius: ["50%", "80%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center"
          },
          data: [
            { value: 422, name: "成功", itemStyle: { color: "#00C292" } },
            { value: 42, name: "失败", itemStyle: { color: "#E46A76" } }
          ],
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          emphasis: {}
        }
      ]
    };
    return option;
  };
  const success_rate_trend_line_option = () => {
    const option = {
      title: {
        text: "近7天测试用例执行成功率变化趋势",
        x: "center",
        y: "bottom"
      },
      tooltip: {
        trigger: "axis",
        formatter: "日期 : {b}<br />成功率 : {c}%"
      },
      xAxis: {
        type: "category",
        data: SuccessRateTrendXAxis
      },
      yAxis: [
        {
          type: "value",
          axisLabel: {
            show: true,
            interval: "auto",
            formatter: "{value} %"
          },
          show: true
        }
      ],
      series: [
        {
          data: [23, 65, 24, 32, 22, 22, 100],
          type: "line",
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            formatter: "{c}%", //显示百分号
            textStyle: {
              //数值样式
              color: "#303133", //字体颜色
              fontSize: 12 //字体大小
            }
          }
        }
      ]
    };
    return option;
  };

  // 使用刚指定的配置项和数据显示图表。
  totalSuccessRateChart.setOption(total_success_rate_pie_option());
  SuccessRateTrendChart.setOption(success_rate_trend_line_option());

  window.onresize = () => {
    totalSuccessRateChart.resize();
    SuccessRateTrendChart.resize();
  };
};

onMounted(() => {
  myEcharts();
});
</script>
<style>
.item-color-normal {
  color: #4577ff;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.list-group-item {
  height: 35px;
  line-height: 35px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 5px;
  margin: 0 5px 5px 5px;
  display: flex;
}

.name {
  margin: auto 2px;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}

.rate {
  margin: auto 2px;
}
</style>
