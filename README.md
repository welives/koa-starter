本人平常喜欢用`nodejs`瞎 JB 写写东西，但是每次都要创建项目、安装依赖等等前戏工作，这让我很烦。于是乎整了这个简单干净的工程模板，这样以后写东西直接 clone 下来就行了

这个工程的搭建笔记可以在这里[查看](https://welives.github.io/blog/front-end/nodejs/%E6%90%AD%E5%BB%BAkoa%E5%B7%A5%E7%A8%8B.html)

## 使用

- `yarn` 或 `npm i`
- `cp example.env .env`，然后修改环境变量
- `yarn dev` 或 `npm run dev`
- 在浏览器中开打`localhost:3000`

### 打包

- `cp example.env .env.production`，然后修改环境变量
- `yarn build` 或 `npm run build`

### 生产环境启动

- 生产环境使用 pm2 启动，可以达到负载均衡。执行：`yarn start` 或 `npm run start` （生产环境端口默认：8080）

## 友情链接

- [Koa2](https://koa.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [PM2](https://pm2.fenxianglu.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)
