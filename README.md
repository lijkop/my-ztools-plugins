# 我的 ZTools 插件

自己写的 ZTools 插件集合，一个插件一个目录，各自独立发布到 [ZTools 插件市场](https://github.com/ZToolsCenter/ZTools-plugins)。

## 插件列表

| 插件 | ID | 版本 | 说明 | 状态 |
|---|---|---|---|---|
| [多引擎批量搜索](./multi-search) | `multi-search` | 2.0.0 | 输入一次关键词，同时打开多个搜索引擎的结果页；引擎按分类管理，勾选即批量搜索 | 已提交 PR，审核中 |
| [闪启 FlashLaunch](./flashlaunch) | `flashlaunch` | 1.0.0 | 轻量快捷启动：集中管理应用、文件、文件夹和网址，支持别名直达 ZTools 搜索框 | 待提交 |

## 目录结构

```text
my-ztools-plugins/
├── multi-search/          多引擎批量搜索
│   ├── plugin.json        ZTools 插件配置
│   ├── index.html         插件主界面
│   ├── preload.js         preload 脚本
│   ├── default-config.json 默认引擎配置
│   ├── logo.png           图标
│   ├── vue.global.js      Vue 运行时
│   ├── CHANGELOG.md       变更日志
│   └── README.md          插件说明
└── flashlaunch/           闪启 FlashLaunch
    ├── plugin.json        ZTools 插件配置
    ├── index.html         插件主界面
    ├── preload.js         Node 能力与启动层
    ├── assets/            界面、样式、预览 Mock
    ├── utils/args.js      启动参数解析
    ├── tools/             打包、测试、图标脚本
    ├── docs/              截图
    ├── CHANGELOG.md       变更日志
    └── README.md          插件说明
```

## 开发与发布

插件项目需要能单独作为 `ztools publish` 的工作目录，所以每个插件目录都是完整、自包含的。

```bash
cd multi-search
ztools publish
```

几点约定：

- **发布前保证整个仓库工作区干净**：`ztools publish` 会因为其他插件目录的未提交改动而拒绝执行。
- `CHANGELOG.md` 必须有当前版本的标准小节，格式 `## x.y.z - YYYY-MM-DD`，且正文非空，否则发布校验不通过。
- 发布成功后 CLI 会在当前仓库 HEAD 打 `ztools-last-publish` 标签，用它计算「自上次发布以来的提交」。多个插件共用一个仓库时，这个标签是共享的，PR 描述里的 commit 列表可能混入另一个插件的提交，仅影响描述文案，不影响发布结果。

## 许可

各插件沿用其提交到 ZTools 中心仓库时所声明的开源协议。
