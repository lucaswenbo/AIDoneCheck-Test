# AIDoneCheck-Test

[AIDoneCheck](https://github.com/lucaswenbo/AIDoneCheck) 的独立公开测试仓库。**这里实际调用固定发布版本 `v1.0.2`**，不包含产品源码或 dist，也不使用开发中的 `@main`。

[打开演示与运行记录](https://github.com/lucaswenbo/AIDoneCheck-Test/actions/workflows/demo.yml) · [查看被测版本](https://github.com/lucaswenbo/AIDoneCheck/releases/tag/v1.0.2)

不需要你的网站、Cloudflare、LLM API Key 或额外 Secrets。工作流在 GitHub Runner 内建立临时 Node.js/npm 项目、独立 Git 历史和本地 HTTP server，真实执行测试、TypeScript 类型检查、构建与 Chromium 检查。

## 点击运行

仓库所有者或有写权限的协作者：

1. 打开 **Actions → AIDoneCheck 发布版演示**。
2. 点击 **Run workflow → main → Run workflow**。
3. 等待六个场景结束，查看 Summary、每个 job 的日志，以及页面底部的 Artifacts。

其他访客：先 [Fork 本仓库](https://github.com/lucaswenbo/AIDoneCheck-Test/fork)，在自己的仓库进入 Actions；如有提示先启用工作流，再按上述步骤运行。GitHub 需要仓库写权限才能手动启动上游任务。

只想看效果，可以直接打开已经完成的运行记录；下载证据产物需要登录 GitHub。产物保留 7 天，过期后重新运行即可。

## 六个真实场景

| 场景 | 真实操作 | 预期结果 |
|---|---|---|
| 健康项目 | 完成加法函数，执行测试、类型检查和构建，核对源文件修改与产物存在 | PASS |
| 缺少真实测试 | test 使用 npm 默认占位脚本；类型检查和构建继续 | WARN |
| 断言失败 | 故意把加法写成减法 | BLOCK，保存真实退出码和日志 |
| 页面错误 | 本地页面抛出未捕获 JavaScript 错误 | BLOCK，保存截图与真实 Trace |
| 记录上限后的资源失败 | 大量跨源脚本失败后再动态加载失败的同源脚本 | BLOCK，不能因日志截断漏判 |
| 越界路径 | 项目脚本创建指向仓库外的 symlink | 启动/路径错误，保存错误证据，不伪造 Verdict |

演示项目没有 lint，因此显式关闭该项；其他检查不会为变绿而关闭。`return 0` 是故意准备的未完成任务基线，工作流会按场景修改它。

## 为什么被测步骤失败，整个演示还可以是绿色？

这是对检查工具的验收。故障由 fixture 故意注入，Action 必须真实失败；工作流通过 `continue-on-error` 继续保存证据，再严格断言：

- 实际 outcome、verdict 与具体失败原因符合场景。
- 后续类型检查和构建确实执行，要求的产物确实存在。
- 正常验收报告有 report.json、report.md、agent-feedback.md 和 summary.md。
- Browser 阻断时还有 browser.png 与真实 trace.zip。
- 路径错误时有 startup-error.json，没有伪造的正常报告。
- 产物上传后再次从 GitHub 下载，每个文件 SHA-256 与原始证据一致。
- 新版工具生成的报告标题、占位测试警告、浏览器错误说明和路径错误说明为中文。

应当 BLOCK 却 PASS、报告缺失、错误原因不对、中文说明缺失或下载内容不一致，都会让演示失败。**演示通过不表示故障已经修复，而是表示故障被正确检测、证据被正确保存。** 你自己的生产验证流程不应照搬这里为预期失败设置的 `continue-on-error`。

## 输出语言

AIDoneCheck v1.0.2 生成的报告、检查说明、总结和 Agent 反馈说明统一中文。

以下内容保留原样：PASS / WARN / BLOCK / SKIP、命令、文件名、JSON 字段及规范化数据、真实测试日志、页面原始错误。GitHub 自带界面和第三方 Actions SDK 日志的语言不由本项目控制。保留英文原始证据是为了准确记录，不代表报告说明仍混用两套语言。

旧版运行记录不会被重写。查看被测步骤时应确认是 **AIDoneCheck v1.0.2**。

## 与主仓库的关系

- 本仓库：像真实用户一样使用 `lucaswenbo/AIDoneCheck@v1.0.2`，供大家点击复现发布版本。
- 产品主仓库：开发 CLI/Action，运行内部回归与发布前检查。
- 本仓库不发布 npm 包，不部署网站，不修改产品仓库、Cloudflare 或其他资源。

要升级被测版本，同时修改 workflow 的固定 tag 与 package.json 的 aidonecheckVersion，通过 PR 验证后再合并。不要悄悄改成 main。

fixture 与测试辅助代码来自 AIDoneCheck，遵循 [MIT License](LICENSE)。
