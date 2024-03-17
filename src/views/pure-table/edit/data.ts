import dayjs from "dayjs";

const date = dayjs(new Date()).format("YYYY-MM-DD");

const tableData = [
  {
    date,
    name: "Tom",
    sex: 0, // 0代表男 1代表女
    hobby: null
  },
  {
    date,
    name: "Jack",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Dick",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Harry",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Sam",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Lucy",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Mary",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Mike",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Mike1",
    sex: 0,
    hobby: null
  },
  {
    date,
    name: "Mike2",
    sex: 0,
    hobby: null
  }
];

export { tableData };
