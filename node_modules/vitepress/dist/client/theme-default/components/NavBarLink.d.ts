import { PropType } from 'vue';
import { DefaultTheme } from '../config';
declare const _default: import("vue").DefineComponent<{
    item: {
        type: PropType<DefaultTheme.NavItemWithLink>;
        required: true;
    };
}, {
    classes: import("vue").ComputedRef<{
        active: boolean;
        external: boolean;
    }>;
    isActiveLink: import("vue").ComputedRef<boolean>;
    isExternalLink: import("vue").ComputedRef<boolean>;
    href: import("vue").ComputedRef<string>;
    target: import("vue").ComputedRef<string>;
    rel: import("vue").ComputedRef<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    item: DefaultTheme.NavItemWithLink;
} & {}>, {}>;
export default _default;
