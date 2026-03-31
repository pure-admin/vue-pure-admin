import type { ReservedProps } from "vue";

/** `PascalCase/camelCase` → `kebab-case` 类型转换 */
type CamelToKebab<S extends string> = S extends `${infer F}${infer R}`
  ? R extends ""
    ? Lowercase<F>
    : F extends Uppercase<F>
      ? F extends Lowercase<F>
        ? `${F}${CamelToKebab<R>}`
        : `-${Lowercase<F>}${CamelToKebab<R>}`
      : `${F}${CamelToKebab<R>}`
  : S;

type PascalToKebab<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${CamelToKebab<R>}`
  : S;

/** 从 `GlobalComponents` 自动生成 `kebab-case` 的 `props` 类型 */
type KebabComponents = {
  [K in keyof import("vue").GlobalComponents as PascalToKebab<
    K & string
  >]: InstanceType<import("vue").GlobalComponents[K]>["$props"] & ReservedProps;
};

declare module "vue/jsx-runtime" {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends KebabComponents {}
  }
}
