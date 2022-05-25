# 形码工具箱

分析和制作汉字形码输入法的网页小工具。访问 [Pages](https://yyb1rd.github.io/schema-lab-website)，既可使用。

## 依赖
本项目使用了 Vue3 官方生态链和 Quasar 库。包括 Vue3.2、Vite2、vue-router、Pinia、VueUse、Quasar。

还有其他库：Axios

## 编译
1. clone 本仓库
2. 进入仓库后，`npm i` 安装依赖。
3. 用 `npx quasar dev` 可 HRM 预览网页

小技巧：用 `npx quasar build -m pwa` 编译出pwa网页。目前网页的全局路径指向了 `/schema-lab-website`，要修改，可编辑 `quasar.config.js` 中的70行。


## License
Under [Apache-v2](LICENSE).
