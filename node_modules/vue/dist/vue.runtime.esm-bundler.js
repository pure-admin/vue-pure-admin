import { setDevtoolsHook, initCustomFormatter, warn } from '@vue/runtime-dom';
export * from '@vue/runtime-dom';
import { getGlobalThis } from '@vue/shared';

function initDev() {
    const target = getGlobalThis();
    target.__VUE__ = true;
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
    {
        console.info(`You are running a development build of Vue.\n` +
            `Make sure to use the production build (*.prod.js) when deploying for production.`);
        initCustomFormatter();
    }
}

// This entry exports the runtime only, and is built as
(process.env.NODE_ENV !== 'production') && initDev();
const compile = () => {
    if ((process.env.NODE_ENV !== 'production')) {
        warn(`Runtime compilation is not supported in this build of Vue.` +
            ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                ) /* should not happen */);
    }
};

export { compile };
