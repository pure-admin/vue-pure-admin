import { PropType } from 'vue';
import { DefaultTheme } from '../config';
declare const _default: import("vue").DefineComponent<{
    item: {
        type: PropType<DefaultTheme.NavItemWithChildren>;
        required: true;
    };
}, {
    open: import("vue").Ref<boolean>;
    setOpen: (value: boolean) => void;
    isLastItemOfArray: <T>(item: T, array: T[]) => boolean | 0;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    item: DefaultTheme.NavItemWithChildren;
} & {}>, {}>;
export default _default;
