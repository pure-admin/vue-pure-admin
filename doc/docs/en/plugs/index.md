## 1. VsCode Plugs

please install TSLint、Vetur、vscode-icons、ES7 React

## 2. Quick generation of code fragment by vscode
Ctrl+Shift+P Check configure user code fragment search vue.json Copy the code below Enter Vue in the .vue file and press enter
```
{
	"Vue3.0Quick template generation": {
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

A beautification command panel plug-in, based on TS, version: windows, MAC, Linux  
Download address: https://hyper.is/#installation
