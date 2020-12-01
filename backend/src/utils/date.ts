interface dateModel {
  getMonth: () => any
  getDate: () => string | number
  getFullYear: () => string | number
  getHours: () => string | number
  getMinutes: () => string | number
  getSeconds: () => string | number
}

export default async function getFormatDate(): Promise<Date | string> {
  let date: dateModel = new Date()
  let month: string | number = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  let currentDate = date.getFullYear() + "-" + month + "-" + strDate +
    " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  return currentDate
}