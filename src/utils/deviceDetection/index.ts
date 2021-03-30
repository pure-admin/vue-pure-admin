interface deviceInter {
  match: any
}

// 检测设备类型(手机返回true,反之)
export const deviceDetection = () => {
  let sUserAgent: deviceInter = navigator.userAgent.toLowerCase()
  let bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
  let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
  let bIsMidp = sUserAgent.match(/midp/i) == "midp"
  let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
  let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
  let bIsAndroid = sUserAgent.match(/android/i) == "android"
  let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
  let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"
  return bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
    ? true
    : false
};