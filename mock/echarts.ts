import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const echartsList = () => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push(["@date", Math.floor(Math.random() * 300)]);
  }
  return result;
};

export default [
  {
    url: "/getEchartsInfo",
    method: "get",
    response: () => {
      return {
        code: 0,
        info: echartsList()
      };
    }
  }
] as MockMethod[];
