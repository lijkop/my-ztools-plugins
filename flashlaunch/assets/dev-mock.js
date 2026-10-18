/**
 * 浏览器预览用的假 ZTools 环境。
 * 在真正的 ZTools 里 window.ztools 已存在，本文件会直接退出。
 */
(function () {
  if (window.ztools) return;
  // 只在浏览器 http 预览时启用，宿主里加载的是 file://
  if (location.protocol !== "http:" && location.protocol !== "https:") return;

  const DB_KEY = "flashlaunch-preview-db";

  function readDB() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function icon(emoji, from, to) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' +
      from +
      '"/><stop offset="1" stop-color="' +
      to +
      '"/></linearGradient></defs>' +
      '<rect width="96" height="96" rx="24" fill="url(#g)"/>' +
      '<text x="48" y="63" font-size="46" text-anchor="middle">' +
      emoji +
      "</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function mockToast(text) {
    const node = document.createElement("div");
    node.textContent = text;
    node.style.cssText =
      "position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:9999;" +
      "background:rgba(20,22,30,.9);color:#fff;padding:8px 14px;border-radius:8px;font:12px/1.4 system-ui;box-shadow:0 8px 30px rgba(0,0,0,.3);pointer-events:none";
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  }

  const db = readDB();
  const store = {
    getItem(key) {
      const data = readDB();
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      const data = readDB();
      data[key] = value;
      writeDB(data);
      return true;
    },
    removeItem(key) {
      const data = readDB();
      delete data[key];
      writeDB(data);
      return true;
    },
  };

  const seeded = Object.keys(db).length > 0;
  if (!seeded) {
    const apps = [
      {
        id: "demo-vscode",
        kind: "app",
        name: "Visual Studio Code",
        path: "C:\\Program Files\\Microsoft VS Code\\Code.exe",
        alias: "code",
        icon: icon("🟦", "#0ea5e9", "#2563eb"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "app",
      },
      {
        id: "demo-terminal",
        kind: "app",
        name: "Windows Terminal",
        path: "C:\\Windows\\System32\\wt.exe",
        alias: "term",
        icon: icon("⬛", "#334155", "#0f172a"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "app",
      },
      {
        id: "demo-figma",
        kind: "app",
        name: "Figma",
        path: "C:\\Users\\demo\\AppData\\Local\\Figma\\Figma.exe",
        alias: "",
        icon: icon("🎨", "#f472b6", "#a855f7"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "app",
      },
      {
        id: "demo-folder",
        kind: "app",
        name: "项目目录",
        path: "D:\\VS_Code\\hack",
        alias: "hack",
        icon: icon("📁", "#f59e0b", "#f97316"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "folder",
      },
      {
        id: "demo-chrome",
        kind: "app",
        name: "Google Chrome",
        path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        alias: "",
        icon: icon("🌐", "#22c55e", "#0ea5e9"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "app",
      },
      {
        id: "demo-notion",
        kind: "app",
        name: "Notion",
        path: "C:\\Users\\demo\\AppData\\Local\\Programs\\Notion\\Notion.exe",
        alias: "note",
        icon: icon("📝", "#94a3b8", "#475569"),
        args: "",
        adminStart: false,
        backupPath: "",
        type: "app",
      },
    ];

    const webs = [
      {
        id: "demo-github",
        kind: "web",
        name: "GitHub",
        path: "https://github.com",
        alias: "gh",
        icon: icon("🐙", "#334155", "#111827"),
        type: "web",
      },
      {
        id: "demo-baidu",
        kind: "web",
        name: "百度搜索",
        path: "https://www.baidu.com/s?wd={query}",
        alias: "bd",
        icon: icon("🔎", "#3b82f6", "#1d4ed8"),
        type: "web",
      },
      {
        id: "demo-bili",
        kind: "web",
        name: "哔哩哔哩",
        path: "https://www.bilibili.com",
        alias: "bili",
        icon: icon("📺", "#fb7185", "#ec4899"),
        type: "web",
      },
      {
        id: "demo-mdn",
        kind: "web",
        name: "MDN Web Docs",
        path: "https://developer.mozilla.org",
        alias: "",
        icon: icon("📚", "#38bdf8", "#6366f1"),
        type: "web",
      },
    ];

    store.setItem("fl.apps", apps);
    store.setItem("fl.webs", webs);
    store.setItem("fl.settings", {
      tab: "apps",
      iconSize: 46,
      hideNames: false,
      repeatAdd: false,
      autoAlias: false,
      launchAfterQuit: false,
    });
  }

  const fakeHost = {
    dbStorage: store,
    isWindows: () => true,
    isMacOS: () => false,
    isLinux: () => false,
    getPath: (name) => "C:\\Users\\demo",
    getFileIcon: () => icon("📦", "#64748b", "#334155"),
    getAppVersion: () => "4.0.0-preview",
    getNativeId: () => "preview",
    showOpenDialog: (options) => {
      if (options && options.properties && options.properties.includes("openDirectory")) {
        return ["C:\\Users\\demo\\Documents"];
      }
      if (options && options.filters && String(options.filters[0].extensions).includes("png")) {
        return [];
      }
      return ["C:\\Users\\demo\\Documents\\README.md"];
    },
    showSaveDialog: () => "",
    setFeature: () => {},
    removeFeature: () => {},
    onPluginEnter: (cb) => {
      window.__slEnter = cb;
    },
    outPlugin: () => mockToast("（预览）已退出插件"),
    showNotification: mockToast,
    shellOpenPath: (p) => mockToast("（预览）打开路径：" + p),
    shellOpenExternal: (url) => mockToast("（预览）打开网址：" + url),
    shellShowItemInFolder: (p) => mockToast("（预览）定位：" + p),
    copyText: (text) => {
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      mockToast("已复制");
    },
  };

  const fakeSl = {
    MARKER: "flashlaunch-preview",
    getPlatform: () => "preview",
    getInfo: () => ({ platform: "preview", appVersion: "4.0.0-preview", nativeId: "preview" }),
    iconFor: (p) => (p ? icon("📦", "#64748b", "#334155") : ""),
    readShortcut: (p) => ({ target: p, args: "" }),
    describePath: (p) => {
      const base = String(p).split(/[\\/]/).pop() || "新项目";
      const isDir = !/\.[a-z0-9]{1,5}$/i.test(base);
      return {
        name: base.replace(/\.[^.]+$/, ""),
        path: p,
        displayPath: p,
        args: "",
        type: isDir ? "folder" : "app",
        icon: icon(isDir ? "📁" : "🧩", "#6366f1", "#0891b2"),
      };
    },
    pickEntries: (opts) => fakeHost.showOpenDialog({ properties: opts && opts.folder ? ["openDirectory"] : ["openFile"] }),
    pickImage: () => "",
    launch: (item, query) => {
      const target = query != null ? String(item.path).replace("{query}", encodeURIComponent(query)) : item.path;
      mockToast("（预览）启动：" + target);
      return { ok: true };
    },
    fetchMeta: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ title: "示例站点", icon: icon("🌍", "#0ea5e9", "#6366f1"), error: "" });
        }, 450);
      }),
    exportBackup: () => {
      mockToast("（预览）浏览器环境不写本地文件");
      return "";
    },
    importBackup: () => null,
    isPathExist: () => true,
    openExternal: (url) => fakeHost.shellOpenExternal(url),
    showItemInFolder: (p) => fakeHost.shellShowItemInFolder(p),
    copyText: (text) => fakeHost.copyText(text),
    notify: (message) => mockToast(message),
    outPlugin: () => fakeHost.outPlugin(),
  };

  window.ztools = fakeHost;
  window.sl = fakeSl;
  window.__SL_PREVIEW__ = true;
})();
