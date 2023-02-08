import dayjs from "dayjs";
import { clone } from "@pureadmin/utils";

const date = dayjs(new Date()).format("YYYY-MM-DD");

const tableData = [
  {
    date,
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Jack",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Dick",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Harry",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Sam",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Lucy",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Mary",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Mike",
    address: "No. 189, Grove St, Los Angeles"
  }
];

const tableDataMore = clone(tableData, true).map(item =>
  Object.assign(item, {
    state: "California",
    city: "Los Angeles",
    "post-code": "CA 90036"
  })
);

const tableDataImage = clone(tableData, true).map((item, index) =>
  Object.assign(item, {
    image: `https://pure-admin.github.io/pure-admin-table/imgs/${index + 1}.jpg`
  })
);

const tableDataSortable = clone(tableData, true).map((item, index) => {
  delete item["date"];
  Object.assign(item, {
    date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
  });
});

const tableDataDrag = clone(tableData, true).map((item, index) => {
  delete item["address"];
  delete item["date"];
  return Object.assign(
    {
      id: index + 1,
      date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
    },
    item
  );
});

const tableDataEdit = clone(tableData, true).map((item, index) => {
  delete item["date"];
  return Object.assign(
    {
      id: index + 1,
      date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
    },
    item
  );
});

export {
  tableData,
  tableDataDrag,
  tableDataMore,
  tableDataEdit,
  tableDataImage,
  tableDataSortable
};
