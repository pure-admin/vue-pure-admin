import { setDevtoolsHook, initCustomFormatter, warn } from '@vue/runtime-dom';
export * from '@vue/runtime-dom';
import { getGlobalThis } from '@vue/shared';

function initDev() {
    const target = getGlobalThis();
    target.__VUE__ = true;
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
    {
        initCustomFormatter();
    }
}

// This entry exports the runtime only, and is built as
if ((process.env.NODE_ENV !== 'production') || __VUE_PROD_DEVTOOLS__) {
    initDev();
}
const compile = () => {
    if ((process.env.NODE_ENV !== 'production')) {
        warn(`Runtime compilation is not supported in this build of Vue.` +
            (` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                ) /* should not happen */);
    }
};

export { compile };
