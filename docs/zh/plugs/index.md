## 1. VsCode插件

请安装TSLint、Vetur、vscode-icons、ES7 React

## 2. VsCode快速生成代码片段
Ctrl+Shift+P 选中配置用户代码片段 搜索vue.json，将下面代码复制进去，在.vue文件输入vue回车即可
```
{
	"Vue3.0快速生成模板": {
		"prefix": "Vue3.0",
		"body": [
			"<template>",
			"\t<div>\n",
			"\t</div>",
			"</template>\n",
			"<script lang='ts'>",
			"export default {",
			"\tsetup(){",
			"\t\treturn{\n\n\t\t}",
			"\t},",
			"}",
			"</script>\n",
			"<style scoped>\n",
			"</style>",
			"$2"
		],
		"description": "Vue3.0"
	}
}
```
![Screen shot](./images/snip.gif)

## 3. hyper

![Screen shot](./images/hyper.gif)

一款美化命令面板插件，基于TS，版本：windows、mac、linux  
下载地址：https://hyper.is/#installation