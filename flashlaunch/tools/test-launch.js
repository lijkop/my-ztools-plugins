/* 启动层安全测试：确认走 spawn 参数数组，不做 shell 字符串拼接 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const Module = require("module");

const calls = [];
const fakeChild = () => ({ on() {}, unref() {} });

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "electron") {
    return {
      shell: { readShortcutLink: () => ({ target: "", args: "" }) },
      webUtils: null,
      contextBridge: { exposeInMainWorld() {} },
      clipboard: { readText: () => "" },
    };
  }
  if (request === "child_process") {
    return {
      spawn: (file, args, options) => {
        calls.push({ file, args, options });
        return fakeChild();
      },
      execFileSync: () => "",
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const notifications = [];
global.window = {
  ztools: {
    isWindows: () => true,
    isMacOS: () => false,
    isLinux: () => false,
    showNotification: (message) => notifications.push(message),
    shellOpenPath: () => {},
    shellOpenExternal: () => {},
  },
};

require("../preload");
const api = global.window.sl;

const tmpFile = path.join(os.tmpdir(), "flashlaunch-test's file.txt");
fs.writeFileSync(tmpFile, "test");

const notepad = "C:\\Windows\\System32\\notepad.exe";
const results = [];

api.launch({ path: notepad, args: "--foo \"a b\"" });
results.push({
  name: "普通带参数启动",
  file: calls[0].file,
  args: calls[0].args,
  shell: calls[0].options && calls[0].options.shell,
  ok: calls[0].file === notepad && JSON.stringify(calls[0].args) === JSON.stringify(["--foo", "a b"]) && !calls[0].options.shell,
});

api.launch({ path: notepad, openAppPath: notepad, args: "--x" });
results.push({
  name: "指定应用打开",
  file: calls[1].file,
  args: calls[1].args,
  ok: calls[1].file === notepad && calls[1].args[0] === "--x" && calls[1].args[1] === notepad,
});

calls.length = 0;
api.launch({ path: tmpFile, adminStart: true });
const psCall = calls.find((call) => call.file === "powershell.exe");
let script = "";
let encoded = "";
if (psCall) {
  encoded = psCall.args[psCall.args.indexOf("-EncodedCommand") + 1];
  script = Buffer.from(encoded, "base64").toString("utf16le");
}
results.push({
  name: "管理员启动",
  file: psCall && psCall.file,
  hasEncoded: Boolean(encoded),
  script,
  ok:
    Boolean(psCall) &&
    script.includes("Start-Process") &&
    script.includes("-Verb RunAs") &&
    script.includes(tmpFile.replace(/'/g, "''")),
});

console.log(JSON.stringify(results, null, 2));
const failed = results.filter((result) => !result.ok);
if (failed.length) {
  console.error("FAILED: " + failed.map((result) => result.name).join(", "));
  process.exit(1);
}
console.log("launch security cases passed");

fs.rmSync(tmpFile, { force: true });
