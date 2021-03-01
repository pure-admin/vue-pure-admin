declare const _default: {
    components: {
        NavBarLink: import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>;
        NavDropdownLink: import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>;
    };
    setup(): {
        navData: import("vue").ComputedRef<any>;
        repoInfo: import("vue").ComputedRef<{
            link: string;
            text: string;
        } | null>;
        localeCandidates: import("vue").ComputedRef<{
            text: any;
            items: {
                text: any;
                link: string;
            }[];
        } | null>;
    };
};
export default _default;
