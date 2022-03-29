const themeColors = {
  default: "#1b2a47",
  light: "#ffffff",
  dusk: "#f5222d",
  volcano: "#fa541c",
  yellow: "#fadb14",
  mingQing: "#13c2c2",
  auroraGreen: "#52c41a",
  pink: "#eb2f96",
  saucePurple: "#722ed1"
};

type MultipleScopeVarsItem = {
  scopeName: string;
  path: string;
  varsContent: string;
};

const THEME_DEFAULT = {
  scopeName: "layout-theme-default",
  varsContent: `
$primary-color: #0960bf !default;
$bg-color: #151515 !default;
$text-color: #c9d1d9 !default;
$border-color: #303030 !default;
$disabled-color: #303030 !default;
$selected-bg-color: #262626 !default;
$striped-bg-color: #1E1E1E !default;
$hover-bg-color: #262626 !default;
$checked-bg-color: #262626 !default;
$current-bg-color: #262626 !default;
/*font*/
$vxe-font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB,
  Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
  Segoe UI Symbol !default;
$vxe-font-color: $text-color;
$vxe-font-size: 14px !default;
$vxe-font-size-medium: 14px !default;
$vxe-font-size-small: 13px !default;
$vxe-font-size-mini: 12px !default;
/*size*/
$vxe-border-radius: 4px !default;
/*icon*/
$vxe-icon-font-family: Verdana, Arial, Tahoma !default;
$vxe-icon-background-color: $bg-color;
/*color*/
$vxe-primary-color: $primary-color;
$vxe-success-color: #67c23a !default;
$vxe-info-color: #909399 !default;
$vxe-warning-color: #e6a23c !default;
$vxe-danger-color: #f56c6c !default;
$vxe-disabled-color: #bfbfbf !default;
$vxe-primary-disabled-color: #c0c4cc !default;
/*input/radio/checkbox*/
$vxe-input-border-color: $border-color;
$vxe-input-disabled-color: #dcdfe6 !default;
$vxe-input-disabled-background-color: #f3f3f3 !default;
$vxe-input-placeholder-color: #c0c4cc !default;
/*popup*/
$vxe-table-popup-border-color: $border-color;
/*table*/
$vxe-table-font-color: $vxe-font-color !default;
$vxe-table-header-font-color: $vxe-font-color !default;
$vxe-table-footer-font-color: $vxe-font-color !default;
$vxe-table-border-radius: $vxe-border-radius !default;
$vxe-table-border-width: 1px !default;
$vxe-table-border-color: $border-color;
$vxe-table-resizable-line-color: #d9dddf !default;
$vxe-table-resizable-drag-line-color: $vxe-primary-color !default;
$vxe-table-header-background-color:  $bg-color;
$vxe-table-body-background-color:  $bg-color;
$vxe-table-footer-background-color:  $bg-color;
$vxe-table-tree-node-line-color: #909399 !default;
$vxe-table-tree-node-line-style: dotted !default;
$vxe-table-header-font-weight: 700 !default;
$vxe-table-row-height-default: 48px !default;
$vxe-table-row-height-medium: 44px !default;
$vxe-table-row-height-small: 40px !default;
$vxe-table-row-height-mini: 36px !default;
$vxe-table-row-line-height: 22px !default;
$vxe-table-row-hover-background-color: $hover-bg-color;
$vxe-table-row-striped-background-color: $striped-bg-color;
$vxe-table-row-hover-striped-background-color: $hover-bg-color;
$vxe-table-row-radio-checked-background-color: $checked-bg-color;
$vxe-table-row-hover-radio-checked-background-color: $checked-bg-color;
$vxe-table-row-checkbox-checked-background-color: $checked-bg-color;
$vxe-table-row-hover-checkbox-checked-background-color: $checked-bg-color;
$vxe-table-row-current-background-color: $current-bg-color;
$vxe-table-row-hover-current-background-color: $hover-bg-color;
$vxe-table-column-hover-background-color: $hover-bg-color;
$vxe-table-column-current-background-color: $current-bg-color;
$vxe-table-column-icon-border-color: $border-color;
$vxe-table-column-icon-border-hover-color: $hover-bg-color;
$vxe-table-cell-placeholder-color: #c0c4cc !default;
$vxe-table-cell-padding-left: 10px !default;
$vxe-table-cell-padding-right: 10px !default;
$vxe-table-cell-input-height-default: $vxe-table-row-height-default - 6 !default;
$vxe-table-cell-input-height-medium: $vxe-table-row-height-medium - 6 !default;
$vxe-table-cell-input-height-small: $vxe-table-row-height-small - 6 !default;
$vxe-table-cell-input-height-mini: $vxe-table-row-height-mini - 6 !default;
$vxe-table-cell-dirty-width: 5px !default;
$vxe-table-cell-dirty-update-color: #f56c6c !default;
$vxe-table-cell-dirty-insert-color: #19a15f !default;
$vxe-table-cell-area-border-color: $vxe-primary-color !default;
$vxe-table-cell-area-border-width: 1px !default;
$vxe-table-cell-main-area-extension-border-color: $border-color;
$vxe-table-cell-main-area-extension-background-color: $vxe-primary-color !default;
$vxe-table-cell-extend-area-border-width: 2px !default;
$vxe-table-cell-copy-area-border-width: 3px !default;
$vxe-table-cell-active-area-border-width: 2px !default;
$vxe-table-cell-copy-area-border-color: $vxe-table-cell-area-border-color !default;
$vxe-table-cell-extend-area-border-color: $vxe-table-cell-area-border-color !default;
$vxe-table-cell-active-area-border-color: $vxe-table-cell-area-border-color !default;
$vxe-table-cell-area-background-color: rgba(64, 158, 255, 0.2) !default;
$vxe-table-checkbox-range-border-width: 1px !default;
$vxe-table-checkbox-range-border-color: $border-color;
$vxe-table-checkbox-range-background-color: rgba(50, 128, 252, 0.2) !default;
$vxe-table-fixed-left-scrolling-box-shadow: 4px 3px 4px 0px rgba(0, 0, 0, 0.12) !default;
$vxe-table-fixed-right-scrolling-box-shadow: -4px 3px 4px 0px rgba(0, 0, 0, 0.12) !default;
/*filter*/
$vxe-table-filter-panel-background-color: $bg-color;
/*menu*/
$vxe-table-menu-item-width: 178px !default;
$vxe-table-menu-background-color: $bg-color;
/*loading*/
$vxe-loading-background-color: rgba(0, 0, 0, 0.2) !default;
$vxe-loading-z-index: 999 !default;
/*validate*/
$vxe-table-validate-error-color: #f56c6c !default;
$vxe-table-validate-tooltip-error-color: #fff !default;
$vxe-table-validate-tooltip-error-background-color: $vxe-table-validate-error-color !default;
/*grid*/
$vxe-grid-maximize-background-color: $bg-color;
/*toolbar*/
$vxe-toolbar-background-color: $bg-color;
$vxe-toolbar-height-default: 52px !default;
$vxe-toolbar-height-medium: 50px !default;
$vxe-toolbar-height-small: 48px !default;
$vxe-toolbar-height-mini: 46px !default;
$vxe-toolbar-custom-active-background-color: #d9dadb !default;
$vxe-toolbar-panel-background-color: $bg-color;
/*tooltip*/
$vxe-tooltip-dark-color: #fff !default;
$vxe-tooltip-dark-background-color: #303133 !default;
$vxe-tooltip-light-background-color: $bg-color;
$vxe-tooltip-validate-error-color: #fff !default;
$vxe-tooltip-validate-error-background-color: #f56c6c !default;
/*pager*/
$vxe-pager-background-color: $bg-color;
$vxe-pager-perfect-background-color: $bg-color;
$vxe-pager-perfect-button-background-color: #f4f4f5 !default;
/*modal*/
$vxe-modal-header-background-color: $bg-color;
$vxe-modal-body-background-color: $bg-color;
$vxe-modal-border-color: $border-color;
/*checkbox*/
$vxe-checkbox-font-size-default: 16px !default;
$vxe-checkbox-font-size-medium: 15px !default;
$vxe-checkbox-font-size-small: 14px !default;
$vxe-checkbox-font-size-mini: 14px !default;
$vxe-checkbox-checked-width: 0.32em !default;
$vxe-checkbox-checked-height: 0.64em !default;
$vxe-checkbox-indeterminate-width: 0.6em !default;
$vxe-checkbox-indeterminate-height: 2px !default;
$vxe-checkbox-border-width: 2px !default;
$vxe-checkbox-border-radius: 2px !default;
$vxe-checkbox-icon-background-color: $bg-color;
$vxe-checkbox-checked-icon-border-color: $border-color;
$vxe-checkbox-indeterminate-icon-background-color: $bg-color;
/*radio*/
$vxe-radio-font-size-default: $vxe-checkbox-font-size-default !default;
$vxe-radio-font-size-medium: $vxe-checkbox-font-size-medium !default;
$vxe-radio-font-size-small: $vxe-checkbox-font-size-small !default;
$vxe-radio-font-size-mini: $vxe-checkbox-font-size-mini !default;
$vxe-radio-border-width: $vxe-checkbox-border-width !default;
$vxe-radio-icon-background-color: $bg-color;
$vxe-radio-checked-icon-background-color: $checked-bg-color;
$vxe-radio-indeterminate-icon-background-color: $bg-color;
$vxe-radio-button-default-background-color: $bg-color;
/*button*/
$vxe-button-max-width: 500px !default;
$vxe-button-default-background-color: $bg-color;
$vxe-button-dropdown-panel-background-color: $bg-color;
$vxe-button-height-default: 34px !default;
$vxe-button-height-medium: 32px !default;
$vxe-button-height-small: 30px !default;
$vxe-button-height-mini: 28px !default;
/*input*/
$vxe-input-background-color: $bg-color;
$vxe-input-panel-background-color: $vxe-input-background-color !default;
$vxe-input-date-festival-color: #999999 !default;
$vxe-input-date-festival-important-color: $vxe-primary-color !default;
$vxe-input-date-notice-background-color: #ff0000 !default;
$vxe-input-date-picker-hover-background-color: $hover-bg-color;
$vxe-input-date-picker-selected-color: $selected-bg-color !default;
$vxe-input-date-time-confirm-button-color: #fff !default;
$vxe-input-date-picker-festival-selected-color: $vxe-input-date-picker-selected-color !default;
$vxe-input-date-picker-notice-selected-background-color: $vxe-input-date-picker-selected-color !default;
$vxe-input-date-extra-color: #67c23a !default;
$vxe-input-date-extra-important-color: #fd2222 !default;
$vxe-input-date-title-height-default: 30px !default;
$vxe-input-date-title-height-medium: 29px !default;
$vxe-input-date-title-height-small: 28px !default;
$vxe-input-date-title-height-mini: 26px !default;
$vxe-input-date-time-week-row-height-default: 38px !default;
$vxe-input-date-time-week-row-height-medium: 36px !default;
$vxe-input-date-time-week-row-height-small: 34px !default;
$vxe-input-date-time-week-row-height-mini: 32px !default;
$vxe-input-date-month-year-row-height-default: 48px !default;
$vxe-input-date-month-year-row-height-medium: 46px !default;
$vxe-input-date-month-year-row-height-small: 44px !default;
$vxe-input-date-month-year-row-height-mini: 42px !default;
$vxe-input-date-quarter-row-height-default: 60px !default;
$vxe-input-date-quarter-row-height-medium: 58px !default;
$vxe-input-date-quarter-row-height-small: 56px !default;
$vxe-input-date-quarter-row-height-mini: 54px !default;
$vxe-input-height-default: $vxe-button-height-default !default;
$vxe-input-height-medium: $vxe-button-height-medium !default;
$vxe-input-height-small: $vxe-button-height-small !default;
$vxe-input-height-mini: $vxe-button-height-mini !default;
/*textarea*/
$vxe-textarea-line-height: 1.5715 !default;
$vxe-textarea-background-color: $bg-color;
$vxe-textarea-count-color: #999 !default;
$vxe-textarea-count-background-color: $bg-color;
$vxe-textarea-count-error-color: $vxe-table-validate-error-color !default;
/*form*/
$vxe-form-item-min-height-default: 36px !default;
$vxe-form-item-min-height-medium: 34px !default;
$vxe-form-item-min-height-small: 32px !default;
$vxe-form-item-min-height-mini: 30px !default;
$vxe-form-background-color: $bg-color;
$vxe-form-validate-error-color: $vxe-table-validate-error-color !default;
$vxe-form-validate-error-background-color: inherit !default;
/*select*/
$vxe-select-option-height-default: 30px !default;
$vxe-select-option-height-medium: 28px !default;
$vxe-select-option-height-small: 26px !default;
$vxe-select-option-height-mini: 24px !default;
$vxe-select-option-hover-background-color: $hover-bg-color;
$vxe-select-panel-background-color: $bg-color;
$vxe-select-empty-color: #c0c4cc !default;
$vxe-optgroup-title-color: #909399 !default;
/*switch*/
$vxe-switch-font-color: $vxe-font-color !default;
$vxe-switch-icon-background-color: $bg-color;
$vxe-switch-open-background-color: $vxe-primary-color !default;
$vxe-switch-close-background-color: rgba(0, 0, 0, 0.35) !default;
$vxe-switch-disabled-background-color: rgba(0, 0, 0, 0.15) !default;
/*pulldown*/
$vxe-pulldown-panel-background-color: $bg-color;
`
} as MultipleScopeVarsItem;

export function genScssMultipleScopeVars(): MultipleScopeVarsItem[] {
  const result = [] as MultipleScopeVarsItem[];
  Object.keys(themeColors).forEach(key => {
    result.push({
      scopeName: `layout-theme-${key}`,
      varsContent: `$primary-color: ${themeColors[key]} !default;$vxe-primary-color: $primary-color;`
    } as MultipleScopeVarsItem);
  });
  result.push(THEME_DEFAULT);
  return result;
}
