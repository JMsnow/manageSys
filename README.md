## Install dependencies
``` bash
npm install
```

## Usage
Run development environment

```bash
npm run dev
```

Run SIT environment

```bash
npm run sit
```

Run UAT environment

```bash
npm run uat
```

Run production build

```bash
npm run build
```

## Webpack config

```bash
 build/config.js
```

---

## Project development standard

1、一个组件一个 JS 文件；

2、默认属性如：<code>defaultProps</code>、<code>propTypes</code>，采用 <code>static</code> 定义；

3、私有方法 <code>_</code> 开头；

4、组件传递事件的属性名用 <code>on</code> 开头；

5、事件监听的方法都用 <code>handle</code> 开头；

6、渲染相关的方法都用 <code>render</code> 开头；

7、<code>props</code> 属性必须采用 <code>prop-types</code> 模块做验证；

8、组件划分为 <code>Dumb</code> 和 <code>Smart</code> 组件，<code>Dumb</code> 组件只负责渲染，可复用，<code>Smart</code> 组件负责业务逻辑处理，一般不要求可复用，具体根据业务逻辑来；

9、<code>Dumb</code> 和 <code>Smart</code> 组件约定分别放在 <code>components</code> 和 <code>containers</code> 文件夹中

10、CSS 采用 <code>CSS MODULES</code> 开发方式，每个组件对应一个 CSS 样式模块文件。

11、Actions 编写规范 [https://github.com/acdlite/flux-standard-action]
