本人平常喜欢用`nodejs`瞎 JB 写写东西，但是每次都要创建项目、安装依赖等等前戏工作，这让我很烦。于是乎整了这个简单干净的工程模板，这样以后写东西直接 clone 下来就行了

这个工程的搭建笔记可以在这里[查看](https://welives.github.io/blog/front-end/nodejs/koa/create.html)

## koa-starter

这是一个开箱即用的基于 `Koa2` + `TypeORM` + `PM2` + `TypeScript` 的项目模板

`main`分支是一个不包含数据库的模板

如果你想使用`MySQL`作为数据库的话，可以选择`typeorm-mysql`或`prisma-mysql`分支

如果你想使用`MongoDB`作为数据库的话，可以选择`mongoose`或`typeorm-mongodb`分支

## 目录结构

```
├─ public
├─ src
│  ├─ controllers               # 控制器层
│  │  └─ ...
│  ├─ middlewares               # 中间件
│  │  └─ ...
│  ├─ routes                    # 路由
│  │  └─ ...
│  ├─ tasks                     # 定时任务
│  │  └─ ...
│  ├─ utils                     # 工具函数
│  │  └─ ...
│  ├─ validators                # 接口参数校验
│  │  └─ ...
│  ├─ app.ts                    # koa 实例
│  ├─ env.ts
│  └─ index.ts                  # 入口文件
├─ .env                         # 环境变量
├─ nodemon.json                 # nodemon 配置
├─ ecosystem.config.js          # PM2 配置
├─ webpack.config.js            # webpack 配置
├─ tsconfig.json
├─ ...
```

## 安装

```sh
pnpm install
```

## 开发环境

```sh
pnpm run dev
```

## 打包

```sh
pnpm run build
# or
pnpm run webpack
```

## 部署

生产环境使用`PM2`启动，可以达到负载均衡，生产环境端口默认：8080

```sh
pnpm run deploy
```

## 相关文档

- [Koa2](https://koa.nodejs.cn/)
- [TypeORM](https://typeorm.nodejs.cn/)
- [Prisma](https://prisma.nodejs.cn/)
- [Mongoose](https://mongoose.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [PM2](https://pm2.fenxianglu.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)
- [Webpack](https://webpack.docschina.org/)
