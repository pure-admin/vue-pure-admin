import { MockMethod } from "vite-plugin-mock";

type mapType = {
  plateNumber: string;
  driver: string;
  "orientation|1-360": number;
  "lng|113-114.1-10": number;
  "lat|34-35.1-10": number;
};

// http://mockjs.com/examples.html#Object
const mapList = (): Array<mapType> => {
  const result: Array<mapType> = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      plateNumber: "豫A@natural(11111, 99999)@character('upper')",
      driver: "@cname()",
      "orientation|1-360": 100,
      "lng|113-114.1-10": 1,
      "lat|34-35.1-10": 1
    });
  }
  return result;
};

export default [
  {
    url: "/getMapInfo",
    method: "get",
    response: () => {
      return {
        code: 0,
        info: mapList()
      };
    }
  }
] as MockMethod[];
