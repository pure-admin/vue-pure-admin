import { computed } from 'vue';
import { useSiteData, useSiteDataByRoute, useRoute } from 'vitepress';
import { inBrowser } from '/@app/utils';
import NavBarLink from './NavBarLink.vue';
import NavDropdownLink from './NavDropdownLink.vue';
const platforms = ['GitHub', 'GitLab', 'Bitbucket'].map((platform) => [platform, new RegExp(platform, 'i')]);
export default {
    components: {
        NavBarLink,
        NavDropdownLink
    },
    setup() {
        const siteDataByRoute = useSiteDataByRoute();
        const siteData = useSiteData();
        const route = useRoute();
        const repoInfo = computed(() => {
            const theme = siteData.value.themeConfig;
            const repo = theme.docsRepo || theme.repo;
            let text = theme.repoLabel;
            if (repo) {
                const link = /^https?:/.test(repo) ? repo : `https://github.com/${repo}`;
                if (!text) {
                    // if no label is provided, deduce it from the repo url
                    const repoHosts = link.match(/^https?:\/\/[^/]+/);
                    if (repoHosts) {
                        const repoHost = repoHosts[0];
                        const foundPlatform = platforms.find(([_platform, re]) => re.test(repoHost));
                        text = foundPlatform && foundPlatform[0];
                    }
                }
                return { link, text: text || 'Source' };
            }
            return null;
        });
        const localeCandidates = computed(() => {
            const locales = siteData.value.themeConfig.locales;
            if (!locales) {
                return null;
            }
            const localeKeys = Object.keys(locales);
            if (localeKeys.length <= 1) {
                return null;
            }
            // handle site base
            const siteBase = inBrowser ? siteData.value.base : '/';
            const siteBaseWithoutSuffix = siteBase.endsWith('/')
                ? siteBase.slice(0, -1)
                : siteBase;
            // remove site base in browser env
            const routerPath = route.path.slice(siteBaseWithoutSuffix.length);
            const currentLangBase = localeKeys.find((v) => {
                if (v === '/') {
                    return false;
                }
                return routerPath.startsWith(v);
            });
            const currentContentPath = currentLangBase
                ? routerPath.substring(currentLangBase.length - 1)
                : routerPath;
            const candidates = localeKeys.map((v) => {
                const localePath = v.endsWith('/') ? v.slice(0, -1) : v;
                return {
                    text: locales[v].label || locales[v].lang,
                    link: `${localePath}${currentContentPath}`
                };
            });
            const currentLangKey = currentLangBase ? currentLangBase : '/';
            const selectText = locales[currentLangKey].selectText
                ? locales[currentLangKey].selectText
                : 'Languages';
            return {
                text: selectText,
                items: candidates
            };
        });
        const navData = computed(() => {
            return siteDataByRoute.value.themeConfig.nav;
        });
        return {
            navData,
            repoInfo,
            localeCandidates
        };
    }
};
