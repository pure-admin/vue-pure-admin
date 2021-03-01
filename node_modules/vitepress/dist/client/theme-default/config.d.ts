export declare namespace DefaultTheme {
    interface Config {
        logo?: string;
        nav?: NavItem[] | false;
        sidebar?: SideBarConfig | MultiSideBarConfig;
        search?: SearchConfig | false;
        /**
         * GitHub repository following the format <user>/<project>.
         *
         * @example vuejs/vue-next
         */
        repo?: string;
        /**
         * Customize the header label. Defaults to GitHub/Gitlab/Bitbucket depending
         * on the provided repo
         *
         * @exampe `"Contribute!"`
         */
        repoLabel?: string;
        /**
         * If your docs are in a different repository from your main project
         *
         * @example `"vuejs/docs-next"`
         */
        docsRepo?: string;
        /**
         * If your docs are not at the root of the repo.
         *
         * @example `"docs"`
         */
        docsDir?: string;
        /**
         * If your docs are in a different branch. Defaults to `master`
         * @example `"next"`
         */
        docsBranch?: string;
        /**
         * Enable links to edit pages at the bottom of the page
         */
        editLinks?: boolean;
        /**
         * Custom text for edit link. Defaults to "Edit this page"
         */
        editLinkText?: string;
        lastUpdated?: string | boolean;
        prevLink?: boolean;
        nextLink?: boolean;
    }
    type NavItem = NavItemWithLink | NavItemWithChildren;
    interface NavItemWithLink extends NavItemBase {
        link: string;
    }
    interface NavItemWithChildren extends NavItemBase {
        items: NavItem[];
    }
    interface NavItemBase {
        text: string;
        target?: string;
        rel?: string;
        ariaLabel?: string;
    }
    type SideBarConfig = SideBarItem[] | 'auto' | false;
    interface MultiSideBarConfig {
        [path: string]: SideBarConfig;
    }
    type SideBarItem = SideBarLink | SideBarGroup;
    interface SideBarLink {
        text: string;
        link: string;
    }
    interface SideBarGroup {
        text: string;
        link?: string;
        /**
         * @default false
         */
        collapsable?: boolean;
        children: SideBarItem[];
    }
    interface SearchConfig {
        /**
         * @default 5
         */
        maxSuggestions?: number;
        /**
         * @default ''
         */
        placeholder?: string;
        algolia?: {
            apiKey: string;
            indexName: string;
        };
    }
}
