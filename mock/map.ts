import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { faker } from "@faker-js/faker/locale/zh_CN";

type mapType = {
  plateNumber: string;
  driver: string;
  orientation: number;
  lng: number;
  lat: number;
};

const mapList = (): Array<mapType> => {
  const result: Array<mapType> = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      plateNumber: `豫A${faker.string.numeric({
        length: 5
      })}${faker.string.alphanumeric({
        casing: "upper"
      })}`,
      driver: faker.person.firstName(),
      orientation: faker.number.int({ min: 1, max: 360 }),
      lng: faker.location.latitude({ max: 114.1, min: 113 }),
      lat: faker.location.latitude({ max: 35.1, min: 34 })
    });
  }
  return result;
};

export default defineFakeRoute([
  {
    url: "/get-map-info",
    method: "get",
    response: () => {
      return {
        success: true,
        data: mapList()
      };
    }
  }
]);
