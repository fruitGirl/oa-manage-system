# 系统文档

## 运行项目

```
npm run dev         // 开发
npm run build       // 编译
```

## 编码规范

### css规范

- 类名使用小写字母，以中划线分隔(如：`top-item` `main-box` `box-list-item-1` )
- id采用驼峰式命名
- less中的变量、函数、混合、placeholder采用驼峰式命名

### js规范

- 标准变量采用驼峰式命名(如：`firstName` `topBoxList` `footerCopyright` )(**注意:不要用拼音首字母命名,用英文单词命名**)
- 常量全大写，用下划线连接
- react声明组件,首字母必须大写,其它按照驼峰命名(如: `NoticeIcon `)



## 全局方法

### 资源引用

**注意:** 资源引用统一如下引用

**图片的引用**

```js
// 图片的引用,相对于src/img文件夹下的文件
// 图片一定要用这种方式引用哦.
T.getImg('xxx.png'); 
```

**资源的引用**

```js
// 引用需要CONFIG.resourcePath拼凑的文件
T.request(config).then();

// 引用需要CONFIG.frontPath拼凑的文件
T.getFrontPath();
```

### 数据请求

```js
/**
 * @example <caption>请求数据方法</caption>
 * T.request(config).then();
 *
 * @param {object} config - 参数,格式与axios的一致
 *
 * @returns
 */
T.request(url, config).then().catch();

// 和axios使用方法一致
T.get(url, data).then().catch();
T.post(url, data).then().catch();
```

### 错误信息

```js
// 获取错误信息
T.getError(data);

// 获取错误代码
T.getErrorCode(data)
```






### 开发环境调试

**代替console.log();只在开发环境会显示调试信息,编译后不会存在.**

```js
T.log();
```

**代替console.error();只在开发环境会显示错误信息,编译后不会存在.**

```js
T.logError();
```



## 注意事项

**如果在某些地方需要使用eslint检测不通过的方法,可以在代码中加入以下注释跳过检测**

```js
/* eslint-disable no-undef */
```



