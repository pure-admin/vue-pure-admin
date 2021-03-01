import { SFCTemplateCompileOptions, SFCAsyncStyleCompileOptions } from '@vue/compiler-sfc';
import { Plugin } from 'rollup';
export interface Options {
    include: string | RegExp | (string | RegExp)[];
    exclude: string | RegExp | (string | RegExp)[];
    target: 'node' | 'browser';
    exposeFilename: boolean;
    customBlocks?: string[];
    preprocessStyles?: boolean;
    templatePreprocessOptions?: Record<string, SFCTemplateCompileOptions['preprocessOptions']>;
    compiler?: SFCTemplateCompileOptions['compiler'];
    compilerOptions?: SFCTemplateCompileOptions['compilerOptions'];
    transformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls'];
    postcssOptions?: SFCAsyncStyleCompileOptions['postcssOptions'];
    postcssPlugins?: SFCAsyncStyleCompileOptions['postcssPlugins'];
    cssModulesOptions?: SFCAsyncStyleCompileOptions['modulesOptions'];
    preprocessCustomRequire?: SFCAsyncStyleCompileOptions['preprocessCustomRequire'];
    preprocessOptions?: SFCAsyncStyleCompileOptions['preprocessOptions'];
}
export default function PluginVue(userOptions?: Partial<Options>): Plugin;
