import type { CSSProperties, VNode, Component } from "vue";

type DoneFn = (cancel?: boolean) => void;
type EventType = "open" | "close" | "openAutoFocus" | "closeAutoFocus";
type ArgsType = {
  /** `cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了 `esc` 键 */
  command: "cancel" | "sure" | "close";
};

type ButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text";

type DrawerProps = {
  /** `Drawer` 的显示与隐藏 */
  visible?: boolean;
  /** `Drawer` 自身是否插入至 `body` 元素上。嵌套的 `Drawer` 必须指定该属性并赋值为 `true`，默认 `false` */
  appendToBody?: boolean;
  /** 挂载到哪个 `DOM` 元素 将覆盖 `appendToBody` */
  appendTo?: string;
  /** 是否在 `Drawer` 出现时将 `body` 滚动锁定，默认 `true` */
  lockScroll?: boolean;
  /** 关闭前的回调，会暂停 `Drawer` 的关闭 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeClose?: (done: DoneFn) => void;
  /** 是否可以通过点击 `modal` 关闭 `Drawer` ，默认 `true` */
  closeOnClickModal?: boolean;
  /** 是否可以通过按下 `ESC` 关闭 `Drawer` ，默认 `true` */
  closeOnPressEscape?: boolean;
  /** 是否显示关闭按钮，默认 `true` */
  showClose?: boolean;
  /** `Drawer` 打开的延时时间，单位毫秒，默认 `0` */
  openDelay?: number;
  /** `Drawer` 关闭的延时时间，单位毫秒，默认 `0` */
  closeDelay?: number;
  /** `Drawer` 自定义类名 */
  class?: string;
  /** `Drawer` 的自定义样式 */
  style?: CSSProperties;
  /** 控制是否在关闭 `Drawer` 之后将子元素全部销毁，默认 `false` */
  destroyOnClose?: boolean;
  /** 是否需要遮罩层，默认 `true` */
  modal?: boolean;
  /** `Drawer` 打开的方向，默认 `rtl` */
  direction?: "rtl" | "ltr" | "ttb" | "btt";
  /** `Drawer` 窗体的大小, 当使用 `number` 类型时, 以像素为单位, 当使用 `string` 类型时, 请传入 `'x%'`, 否则便会以 `number` 类型解释 */
  size?: string | number;
  /** `Drawer` 的标题 */
  title?: string;
  /** 控制是否显示 `header` 栏, 默认为 `true`, 当此项为 `false` 时, `title attribute` 和 `title slot` 均不生效 */
  withHeader?: boolean;
  /** 遮罩层的自定义类名 */
  modalClass?: string;
  /** 设置 `z-index` */
  zIndex?: number;
  /** `header` 的 `aria-level` 属性，默认 `2` */
  headerAriaLevel?: string;
};

//element-plus.org/zh-CN/component/popConfirm.html#attributes
type PopConfirm = {
  /** 标题 */
  title?: string;
  /** 确认按钮文字 */
  confirmButtonText?: string;
  /** 取消按钮文字 */
  cancelButtonText?: string;
  /** 确认按钮类型，默认 `primary` */
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

type BtnClickDrawer = {
  options?: DrawerOptions;
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
  /** 确认按钮的 `PopConfirm` 气泡确认框相关配置 */
  popConfirm?: PopConfirm;
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
    drawer,
    button
  }: {
    /** 当前 `Drawer` 信息 */
    drawer: BtnClickDrawer;
    /** 当前 `button` 信息 */
    button: BtnClickButton;
  }) => void;
};

interface DrawerOptions extends DrawerProps {
  /** 内容区组件的 `props`，可通过 `defineProps` 接收 */
  props?: any;
  /** 是否隐藏 `Drawer` 按钮操作区的内容 */
  hideFooter?: boolean;
  /** 确认按钮的 `PopConfirm` 气泡确认框相关配置 */
  popConfirm?: PopConfirm;
  /** 点击确定按钮后是否开启 `loading` 加载动画 */
  sureBtnLoading?: boolean;
  /**
   * @description 自定义抽屉标题的内容渲染器
   * @see {@link https://element-plus.org/zh-CN/component/drawer.html#%E6%8F%92%E6%A7%BD}
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
    options: DrawerOptions;
    index: number;
  }) => VNode | Component;
  /** 自定义按钮操作区的内容渲染器，会覆盖`footerButtons`以及默认的 `取消` 和 `确定` 按钮 */
  footerRenderer?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => VNode | Component;
  /** 自定义底部按钮操作 */
  footerButtons?: Array<ButtonProps>;
  /** `Drawer` 打开后的回调 */
  open?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** `Drawer` 关闭后的回调（只有点击右上角关闭按钮或空白页或按下了esc键关闭页面时才会触发） */
  close?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** `Drawer` 关闭后的回调。 `args` 返回的 `command` 值解析：`cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了esc键  */
  closeCallBack?: ({
    options,
    index,
    args
  }: {
    options: DrawerOptions;
    index: number;
    args: any;
  }) => void;
  /** 输入焦点聚焦在 `Drawer` 内容时的回调 */
  openAutoFocus?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** 输入焦点从 `Drawer` 内容失焦时的回调 */
  closeAutoFocus?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;

  /** 点击底部取消按钮的回调，会暂停 `Drawer` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeCancel?: (
    done: Function,
    {
      options,
      index
    }: {
      options: DrawerOptions;
      index: number;
    }
  ) => void;
  /** 点击底部确定按钮的回调，会暂停 `Drawer` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeSure?: (
    done: Function,
    {
      options,
      index,
      closeLoading
    }: {
      options: DrawerOptions;
      index: number;
      closeLoading: Function;
    }
  ) => void;
}

export type { ButtonProps, DrawerOptions, ArgsType, DrawerProps, EventType };
