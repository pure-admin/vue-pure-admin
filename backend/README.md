# 接口

## 安装依赖
```
npm install
```

## 项目启动
```
npm run dev
```

## Swagger文档访问地址
http://localhost:3000

## 在swagger中添加token验证
① 先请求验证码接口，拿到验证码（info字段就是验证码）  
② 然后请求登录接口，你可以在网页的Network中拿到登录成功后返回的token，复制  
③ 最后回到swagger，点击右上角的绿色边框Authorize，你会看到一个Value的输入框，将复制的token前面加上Bearer 粘贴上去，点确定即可（Authorize）  
（注意Bearer后面有一个空格哦）  

## 注意点
请先全局安装typescript、ts-node，如安装请忽略
```
npm install -g typescript
npm install -g ts-node
```