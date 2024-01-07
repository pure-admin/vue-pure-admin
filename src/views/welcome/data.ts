import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 需求人数、提问数量、解决数量、用户满意度 */
const chartData = [
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "需求人数",
    value: 36000,
    percent: "+88%",
    data: [2101, 5288, 4239, 4962, 6752, 5208, 7450] // 平滑折线图数据
  },
  {
    icon: Question,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "提问数量",
    value: 16580,
    percent: "+70%",
    data: [2216, 1148, 1255, 788, 4821, 1973, 4379]
  },
  {
    icon: CheckLine,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "解决数量",
    value: 16499,
    percent: "+99%",
    data: [861, 1002, 3195, 1715, 3666, 2415, 3645]
  },
  {
    icon: Smile,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 100,
    name: "用户满意度",
    value: 100,
    percent: "+100%",
    data: [100]
  }
];

/** 分析概览 */
const barChartData = [
  {
    requireData: [2101, 5288, 4239, 4962, 6752, 5208, 7450],
    questionData: [2216, 1148, 1255, 1788, 4821, 1973, 4379]
  },
  {
    requireData: [2101, 3280, 4400, 4962, 5752, 6889, 7600],
    questionData: [2116, 3148, 3255, 3788, 4821, 4970, 5390]
  }
];

/** 解决概率 */
const progressData = [
  {
    week: "周一",
    percentage: 85,
    duration: 110,
    color: "#41b6ff"
  },
  {
    week: "周二",
    percentage: 86,
    duration: 105,
    color: "#41b6ff"
  },
  {
    week: "周三",
    percentage: 88,
    duration: 100,
    color: "#41b6ff"
  },
  {
    week: "周四",
    percentage: 89,
    duration: 95,
    color: "#41b6ff"
  },
  {
    week: "周五",
    percentage: 94,
    duration: 90,
    color: "#26ce83"
  },
  {
    week: "周六",
    percentage: 96,
    duration: 85,
    color: "#26ce83"
  },
  {
    week: "周日",
    percentage: 100,
    duration: 80,
    color: "#26ce83"
  }
].reverse();

/** 数据统计 */
const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    requiredNumber: getRandomIntBetween(13500, 19999),
    questionNumber: getRandomIntBetween(12600, 16999),
    resolveNumber: getRandomIntBetween(13500, 17999),
    satisfaction: getRandomIntBetween(95, 100),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});

/** 最新动态 */
const latestNewsData = cloneDeep(tableData)
  .slice(0, 14)
  .map((item, index) => {
    return Object.assign(item, {
      date: `${dayjs().subtract(index, "day").format("YYYY-MM-DD")} ${
        days[dayjs().subtract(index, "day").day()]
      }`
    });
  });

export { chartData, barChartData, progressData, tableData, latestNewsData };
