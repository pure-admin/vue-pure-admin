# Vue3.0后台管理系统
### 功能已开发完毕，新需求请提issues  

vue版本代码：https://github.com/xiaoxian521/CURD-TS  
vue版本在线地址：http://yiming_chang.gitee.io/manages  
react版本代码：https://github.com/xiaoxian521/CURD-TS/tree/react-ts  
angular版本代码：https://github.com/xiaoxian521/CURD-TS/tree/angular-ts  
angular版本在线地址：http://usercxx.gitee.io/ng-gis-map  
node接口：https://github.com/xiaoxian521/CURD-TS/tree/backend  
doc文档：https://github.com/xiaoxian521/CURD-TS/tree/doc  

github地址：https://github.com/xiaoxian521/CURD-TS  
gitee地址：https://gitee.com/yiming_chang/CURD-TS  

## 知识库地址

帮助你获取最新的 API  
[vue3.0 中文文档地址]: https://vue3js.cn/docs/zh/  
[element-plus 中文文档地址]: https://element-plus.org/#/zh-CN  
[composition-Api 中文文档地址]: https://composition-api.vuejs.org/zh/  
[vue-router-next 文档地址]: https://next.router.vuejs.org/  
[next.vuex 文档地址]: https://next.vuex.vuejs.org/  
[vite 源码]: https://github.com/vitejs/vite  
[vite 文档地址]: https://vitejs.dev/  
[vite 中文文档地址（非官方版本）]: https://vite-design.surge.sh/guide/chinese-doc.html  
[vue-i18n-next]: https://vue-i18n-next.intlify.dev/  
[composition-api-vue-i18n-next]: https://vue-i18n-next.intlify.dev/advanced/composition.html#local-scope  

## 安装依赖

```
npm install
```

## 项目运行

```
npm run serve
```

## 项目打包

```
npm run build
```

## 注意点

请先全局安装 typescript、ts-node、vite 如安装请忽略

```
npm install -g typescript
npm install -g ts-node
npm install -g create-vite-app
```

坑位  
1.  
path模块线上部署会遇到process is undefined问题  
解决办法：在源码中开头加入window.process = {}  
issues：https://github.com/jinder/path/issues/7  
2.  
运行项目时控制台报NODE_ENV not found  
解决办法：删除node_modules和package-lock.json文件，重新npm install  
3.  
运行项目会感觉菜单切换比较卡，这个原因是使用route造成的，watch(route)是隐式的{ deep: true }，最好使用watchEffect  
issues：https://github.com/vuejs/vue-next/issues/2027  