export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "primary" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  {
    key: "1",
    name: "通知",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "你收到了 12 份新周报",
        datetime: "一年前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title: "你推荐的 前端高手 已通过第三轮面试",
        datetime: "一年前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
        title: "这种模板可以区分多种通知类型",
        datetime: "一年前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "展示标题内容超过一行后的处理方式，如果内容超过1行将自动截断并支持tooltip显示完整标题。",
        datetime: "一年前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title: "左侧图标用于区分不同的类型",
        datetime: "一年前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title: "左侧图标用于区分不同的类型",
        datetime: "一年前",
        description: "",
        type: "1"
      }
    ]
  },
  {
    key: "2",
    name: "消息",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "李白 评论了你",
        description: "长风破浪会有时,直挂云帆济沧海",
        datetime: "一年前",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "李白 回复了你",
        description: "行路难，行路难，多歧路，今安在。",
        datetime: "一年前",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "标题",
        description:
          "请将鼠标移动到此处，以便测试超长的消息在此处将如何处理。本例中设置的描述最大行数为2，超过2行的描述内容将被省略并且可以通过tooltip查看完整内容",
        datetime: "一年前",
        type: "2"
      }
    ]
  },
  {
    key: "3",
    name: "待办",
    list: [
      {
        avatar: "",
        title: "任务名称",
        description: "任务需要在 2022-11-16 20:00 前启动",
        datetime: "",
        extra: "未开始",
        status: "info",
        type: "3"
      },
      {
        avatar: "",
        title: "第三方紧急代码变更",
        description:
          "一拳提交于 2022-11-16，需在 2022-11-18 前完成代码变更任务",
        datetime: "",
        extra: "马上到期",
        status: "danger",
        type: "3"
      },
      {
        avatar: "",
        title: "信息安全考试",
        description: "指派小仙于 2022-12-12 前完成更新并发布",
        datetime: "",
        extra: "已耗时 8 天",
        status: "warning",
        type: "3"
      },
      {
        avatar: "",
        title: "vue-pure-admin 版本发布",
        description: "vue-pure-admin 版本发布",
        datetime: "",
        extra: "进行中",
        type: "3"
      }
    ]
  }
];
