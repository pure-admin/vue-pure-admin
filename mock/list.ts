import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-card-list",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              index: 1,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 2,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "人脸识别",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 3,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 4,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL证书",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 5,
              isSetup: true,
              type: 3,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 6,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 7,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 8,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 9,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 10,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 11,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 12,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 13,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "云数据库",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 14,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 15,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 16,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 17,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 18,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "云数据库",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 19,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 20,
              isSetup: true,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 21,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 22,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 23,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "人脸识别",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 24,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "人脸识别",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 25,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 26,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 27,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 28,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "云数据库",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 29,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 30,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 31,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 32,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec 云防火墙",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 33,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 34,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 35,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "云数据库",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 36,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 37,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 38,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "云数据库",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 39,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "人脸识别",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 40,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 41,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 42,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec 云防火墙",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 43,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 44,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 45,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 46,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 47,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 48,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            }
          ]
        }
      };
    }
  }
]);
