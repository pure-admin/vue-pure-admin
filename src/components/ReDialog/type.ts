import type { CSSProperties, VNode, Component } from "vue";

type DoneFn = (cancel?: boolean) => void;
type EventType =
  | "open"
  | "close"
  | "openAutoFocus"
  | "closeAutoFocus"
  | "fullscreenCallBack";
type ArgsType = {
  /** `cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了esc键 */
  command: "cancel" | "sure" | "close";
};
type ButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text";

/** https://element-plus.org/zh-CN/component/dialog.html#attributes */
type DialogProps = {
  /** `Dialog` 的显示与隐藏 */
  visible?: boolean;
  /** `Dialog` 的标题 */
  title?: string;
  /** `Dialog` 的宽度，默认 `50%` */
  width?: string | number;
  /** 是否为全屏 `Dialog`（会一直处于全屏状态，除非弹框关闭），默认 `false`，`fullscreen` 和 `fullscreenIcon` 都传时只有 `fullscreen` 会生效 */
  fullscreen?: boolean;
  /** 是否显示全屏操作图标，默认 `false`，`fullscreen` 和 `fullscreenIcon` 都传时只有 `fullscreen` 会生效 */
  fullscreenIcon?: boolean;
  /** `Dialog CSS` 中的 `margin-top` 值，默认 `15vh` */
  top?: string;
  /** 是否需要遮罩层，默认 `true` */
  modal?: boolean;
  /** `Dialog` 自身是否插入至 `body` 元素上。嵌套的 `Dialog` 必须指定该属性并赋值为 `true`，默认 `false` */
  appendToBody?: boolean;
  /** 是否在 `Dialog` 出现时将 `body` 滚动锁定，默认 `true` */
  lockScroll?: boolean;
  /** `Dialog` 的自定义类名 */
  class?: string;
  /** `Dialog` 的自定义样式 */
  style?: CSSProperties;
  /** `Dialog` 打开的延时时间，单位毫秒，默认 `0` */
  openDelay?: number;
  /** `Dialog` 关闭的延时时间，单位毫秒，默认 `0` */
  closeDelay?: number;
  /** 是否可以通过点击 `modal` 关闭 `Dialog`，默认 `true` */
  closeOnClickModal?: boolean;
  /** 是否可以通过按下 `ESC` 关闭 `Dialog`，默认 `true` */
  closeOnPressEscape?: boolean;
  /** 是否显示关闭按钮，默认 `true` */
  showClose?: boolean;
  /** 关闭前的回调，会暂停 `Dialog` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeClose?: (done: DoneFn) => void;
  /** 为 `Dialog` 启用可拖拽功能，默认 `false` */
  draggable?: boolean;
  /** 是否让 `Dialog` 的 `header` 和 `footer` 部分居中排列，默认 `false` */
  center?: boolean;
  /** 是否水平垂直对齐对话框，默认 `false` */
  alignCenter?: boolean;
  /** 当关闭 `Dialog` 时，销毁其中的元素，默认 `false` */
  destroyOnClose?: boolean;
};

//element-plus.org/zh-CN/component/popconfirm.html#attributes
type Popconfirm = {
  /** 标题 */
  title?: string;
  /** 确定按钮文字 */
  confirmButtonText?: string;
  /** 取消按钮文字 */
  cancelButtonText?: string;
  /** 确定按钮类型，默认 `primary` */
  confirmButtonType?: ButtonType;
  /** 取消按钮类型，默认 `text` */
  cancelButtonType?: ButtonType;
  /** 自定义图标，默认 `QuestionFilled` */
  icon?: string | Component;
  /** `Icon` 颜色，默认 `#f90` */
  iconColor?: string;
  /** 是否隐藏 `Icon`，默认 `false` */
  hideIcon?: boolean;
  /** 关闭时的延迟，默认 `200` */
  hideAfter?: number;
  /** 是否将 `popover` 的下拉列表插入至 `body` 元素，默认 `true` */
  teleported?: boolean;
  /** 当 `popover` 组件长时间不触发且 `persistent` 属性设置为 `false` 时, `popover` 将会被删除，默认 `false` */
  persistent?: boolean;
  /** 弹层宽度，最小宽度 `150px`，默认 `150` */
  width?: string | number;
};

type BtnClickDialog = {
  options?: DialogOptions;
  index?: number;
};
type BtnClickButton = {
  btn?: ButtonProps;
  index?: number;
};
/** https://element-plus.org/zh-CN/component/button.html#button-attributes */
type ButtonProps = {
  /** 按钮文字 */
  label: string;
  /** 按钮尺寸 */
  size?: "large" | "default" | "small";
  /** 按钮类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info";
  /** 是否为朴素按钮，默认 `false` */
  plain?: boolean;
  /** 是否为文字按钮，默认 `false` */
  text?: boolean;
  /** 是否显示文字按钮背景颜色，默认 `false` */
  bg?: boolean;
  /** 是否为链接按钮，默认 `false` */
  link?: boolean;
  /** 是否为圆角按钮，默认 `false` */
  round?: boolean;
  /** 是否为圆形按钮，默认 `false` */
  circle?: boolean;
  /** 确定按钮的 `Popconfirm` 气泡确认框相关配置 */
  popconfirm?: Popconfirm;
  /** 是否为加载中状态，默认 `false` */
  loading?: boolean;
  /** 自定义加载中状态图标组件 */
  loadingIcon?: string | Component;
  /** 按钮是否为禁用状态，默认 `false` */
  disabled?: boolean;
  /** 图标组件 */
  icon?: string | Component;
  /** 是否开启原生 `autofocus` 属性，默认 `false` */
  autofocus?: boolean;
  /** 原生 `type` 属性，默认 `button` */
  nativeType?: "button" | "submit" | "reset";
  /** 自动在两个中文字符之间插入空格 */
  autoInsertSpace?: boolean;
  /** 自定义按钮颜色, 并自动计算 `hover` 和 `active` 触发后的颜色 */
  color?: string;
  /** `dark` 模式, 意味着自动设置 `color` 为 `dark` 模式的颜色，默认 `false` */
  dark?: boolean;
  /** 自定义元素标签 */
  tag?: string | Component;
  /** 点击按钮后触发的回调 */
  btnClick?: ({
    dialog,
    button
  }: {
    /** 当前 `Dialog` 信息 */
    dialog: BtnClickDialog;
    /** 当前 `button` 信息 */
    button: BtnClickButton;
  }) => void;
};

interface DialogOptions extends DialogProps {
  /** 内容区组件的 `props`，可通过 `defineProps` 接收 */
  props?: any;
  /** 是否隐藏 `Dialog` 按钮操作区的内容 */
  hideFooter?: boolean;
  /** 确定按钮的 `Popconfirm` 气泡确认框相关配置 */
  popconfirm?: Popconfirm;
  /** 点击确定按钮后是否开启 `loading` 加载动画 */
  sureBtnLoading?: boolean;
  /**
   * @description 自定义对话框标题的内容渲染器
   * @see {@link https://element-plus.org/zh-CN/component/dialog.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%A4%B4%E9%83%A8}
   */
  headerRenderer?: ({
    close,
    titleId,
    titleClass
  }: {
    close: Function;
    titleId: string;
    titleClass: string;
  }) => VNode | Component;
  /** 自定义内容渲染器 */
  contentRenderer?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => VNode | Component;
  /** 自定义按钮操作区的内容渲染器，会覆盖`footerButtons`以及默认的 `取消` 和 `确定` 按钮 */
  footerRenderer?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => VNode | Component;
  /** 自定义底部按钮操作 */
  footerButtons?: Array<ButtonProps>;
  /** `Dialog` 打开后的回调 */
  open?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => void;
  /** `Dialog` 关闭后的回调（只有点击右上角关闭按钮或空白页或按下了esc键关闭页面时才会触发） */
  close?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => void;
  /** `Dialog` 关闭后的回调。 `args` 返回的 `command` 值解析：`cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了esc键  */
  closeCallBack?: ({
    options,
    index,
    args
  }: {
    options: DialogOptions;
    index: number;
    args: any;
  }) => void;
  /** 点击全屏按钮时的回调 */
  fullscreenCallBack?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => void;
  /** 输入焦点聚焦在 `Dialog` 内容时的回调 */
  openAutoFocus?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => void;
  /** 输入焦点从 `Dialog` 内容失焦时的回调 */
  closeAutoFocus?: ({
    options,
    index
  }: {
    options: DialogOptions;
    index: number;
  }) => void;
  /** 点击底部取消按钮的回调，会暂停 `Dialog` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeCancel?: (
    done: Function,
    {
      options,
      index
    }: {
      options: DialogOptions;
      index: number;
    }
  ) => void;
  /** 点击底部确定按钮的回调，会暂停 `Dialog` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeSure?: (
    done: Function,
    {
      options,
      index,
      closeLoading
    }: {
      options: DialogOptions;
      index: number;
      /** 关闭确定按钮的 `loading` 加载动画 */
      closeLoading: Function;
    }
  ) => void;
}

export type { EventType, ArgsType, DialogProps, ButtonProps, DialogOptions };
