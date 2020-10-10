# Beta.VipManager

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### ######################## begin

### ########################开发规则阅读，开发前请务必阅读

### ######################## begin

---

### 1、使用 eslint、prettier 统一规范（统一提供 eslint、prettier 配置，并配置到 VSCode 的 setting 中）

```
--- VSCode 的 setting 请从项目目录下 VSCode_setting.json 中复制

--- VSCode 等开发工具需安装：Vetur、ESLint、Prettier - Code formatter、Prettify json-html-css 格式化工具
--- 请不要使用或卸载JS-CS_html formatter，此插件与 Prettier - Code formatter有冲突

— ESLint 配置详见：.eslintrc.js 文件 — VSCode 格式化配置详见：settings.json 文件
```

### 2、组件内样式使用 scope（如：<style scoped lang="less"></style>）

## (1)需要修改子组件样式时请使用穿透语法：

```
--- less 语法：.className /deep/ .childClassName{}

--- stylus 语法：.className >>> .childClassName{}

```

## (2)如果第三方组件（Vant-ui 为列）如：van-picker、van-datetime-picker 等是添加在 body 标签里修改 css 时，

```
--- 请给第三方组件添加一个独立的 className 如：class=“login_vanPickerCs”, 然后使用：<style>body>.“login_vanPickerCs”{}
</style> 进行修改，请确保 className 的唯一性，最好使用 页面路径形式命名

```

## 3、后台接口统一使用：YAPI（在线接口文档） -------- 视公司要求而定，目前暂无提供---------

```
— YAPI 官网使用教程地址：http://yapi.demo.qunar.com/

```

## 4、所有 的状态管理 Vuex 须以模块化引入

```
— 如：登录路由页面路径为：@/src/views/login/index.vue，则对应的状态管理 store 文件夹下 module 文件夹中模块文件的名称
为：login.js，然后将 ./module/login.js 引入到 store 文件夹的 index.js 入口中
```

## 5、新建页面：

```
— (1)统一使用 vue 目录规则(主要目录为 src 文件): — src 文件下的一级目录只能创建公共用文件夹
如：api、assets、components、router、store、views 等公用文件夹
— 请勿创建具体路由页面、组件页面、js、css、image 等文件及文件夹；

— (2)所有模块内公用组件在 components 文件夹下创建， 所有路由页面组件(.vue 文件)在 views 文件夹下创建一个文件夹，在文件夹
内创建对应的组件文件（.vue 文件），
— 如登录页面路径：@/src/views/login/index.vue （或者@/src/views/login/login.vue）
— 然后在此文件夹(login 文件夹)下包含整个模块文件以及当前模块（index.vue 文件）所需的私有组件

— (3)store 文件为 vuex 配置，使用 vuex 请按照模块化方式添加；
— store 文件包含：index.js 和 module 文件夹，index.js 是vuex 入口及配置文件，module 文件夹是具体路由页面对应的 vuex 文件；
— module 文件夹下的模块文件（js 文件）请以对应的路由页面路径命名
— 如登录对应的模块文件为：login.js， — 完整路径：@/src/store/module/login.js

```

## 6、路由配置：

```
— (1)不需要大量权限设置的路由配置，只需安装 vue 官网推荐的形式配置即可

— (2)有大量权限设置的路由，且需要动态获取路由权限的配置：(为方便模块路由权限的加载)
- 在@/router 新增 module 文件夹，在此文件下创建对应模块名文件，可参照 store 的模块化添加
- 建议较大项目配置路由，为增加路由可读性（一定要注意）： 几级对应层级就是多少
- 例：  - /reportform
        - /reportform/main
        - /reportform/main/tenant
```

## 7、其他规范

```
— 1. 尽量使用 es6 语法糖，避免使用 var 声明变量，强烈建议使用：const 和 let
— 2. 尽量复用页面、方法，而不是 copy 到自己的页面
— 3. 使用新依赖，请告知共同开发此项目的人员
```

## 8、git 管理项（视公司具体情况而定）

```
— git 介绍：http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html

—   ├── master 分支(生产环境项目，唯一主分支)
    ├── ├── master 分支是生产环境的代码，Test、dev 等分支都是从 master 唯一的主分支拉取的；
            ├── 发布代码：
            ├── 所有开发人员只能将本地代码合并到 dev 分支
            ├── 内测时，由项目负责人将 dev 分支代码全部（环境配置文件除外）合并到 Test 分支；
            ├── 测试反馈的 bug 开发人员解决后依旧只能提交到 dev 分支；
            ├── 测试通过后，由负责人将 test 分支代码全部（环境配置文件除外）合并到 master 分支，然后发布生产

— ├── 注意：当生产环境有紧急 bug 时，开发人员可直接从 master 拉取一个分支处理 bug，然后直接合并如生产环境发布
— ├── 具体可参考下方 test 分支 bug 处理

        —   ├── Test 分支(内测项目，合并到 UAT 前内测分支)
            ├── 如果 Test 分支内测时产生了 bug，同时开发人员的本地分支已有新的开发需求或本期不上线、不提测时，
            ├── 开发人员保存本地代码后，将开发的分支暂存入 git 中，
            ├── 然后从 Test 分支拉取一个新的分支，在此分支解决 bug，然后直接提交到 Test 分支，并将代码遴选合并到 dev 开发分支
            ├── 开发人员切换回 dev 分支暂存的开发分支，并拉取代码即可继续开发

        —   ├── dev 分支(开发环境项目，开发人员日常开发使用的主分支)
            ├── 非紧急情况下，所有开发人员的本地开发分支都只能从 dev 分支拉取，
```

## 9、开发人员 git 用命令：(地址：https://www.cnblogs.com/vman/articles/Git_cmds.html)

```
    git add .  ---------------------------- 暂存所有，注意add后有空格和点(.)
    git commit -m'本次提交的备注'  --------- 提交暂存的代码
    git pull   ---------------------------- 拉取本地分支的主分支代码（dev分支的代码）到本地，拉取代码可防止代码冲突，每次开发前强烈都建议都拉取一次
    git push   ---------------------------- 推送提交的代码到git服务器上对应的本地开发分支
    git merge origin/dev ------------------ 将远程dev分支(开发主分支)合并到本地当前分支

```
