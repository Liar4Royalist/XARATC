# 当代西藏作物种植史的政治学叙事

本项目保存论文的[章节 Markdown](当代西藏作物种植史的政治学叙事_章节/README.md)、[原文插图](assets/README.md)和扫描版 PDF，并使用 Quarto 构建可检索的 PDF 与 EPUB。

## 本地构建

需要 [Quarto](https://quarto.org/docs/get-started/)、Node.js 18 或更新版本、TinyTeX（或可用的 XeLaTeX 环境），以及 Noto Serif CJK SC、Noto Sans CJK SC、Noto Sans Mono CJK SC 字体。CI 使用 Node.js 24。

安装 TinyTeX：

```sh
quarto install tinytex --update-path
tlmgr install xecjk
```

`--update-path` 让后续命令可以调用 `tlmgr`；安装后如仍提示找不到命令，请重新打开终端。CI 将 TinyTeX 命令目录写入 `GITHUB_PATH`，供后续步骤使用。

在 Ubuntu 上安装字体：

```sh
sudo apt-get update
sudo apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra
fc-cache -f
```

在项目根目录运行：

```sh
node scripts/prepare-quarto-build.mjs
quarto render --to all
```

输出为 `_book/XARATC.pdf` 和 `_book/XARATC.epub`。只构建一种格式时，将 `--to all` 改为 `--to pdf` 或 `--to epub`；EPUB 不需要 TeX 和本机中文字体。

首次构建前必须运行预处理脚本，以便 Quarto 校验章节路径；后续渲染也会通过 `pre-render` 自动更新构建副本。

预处理仅写入 `.quarto-build/`，不修改原始文稿。电子书保留指导小组、摘要、Abstract、导论、四章正文、结论、参考文献、六张插图及章内脚注；自动生成目录，省略带扫描版页码的原目录和重复的汇总注释。正文已有章节编号，因此关闭额外自动编号。

## CI 与发布

[Build and Release](.github/workflows/release.yml) 在以下情况下运行：

- 推送 `v*` 标签，例如 `v1.0.0`。
- 在 GitHub Actions 中选择 **Build and Release → Run workflow**，选择构建分支并填写 `tag`。工作流需先合并到默认分支才能在网页手动触发。

手动填写已有标签时，从该标签检出并构建；填写新标签时，从所选分支的提交构建，并在该提交上创建标签和 Release。已有标签需要包含本项目的构建配置和脚本。

构建成功后，两份文件上传到 `XARATC-book` Artifact 和对应 GitHub Release；重复发布同一标签会替换同名附件。使用仓库自带的 `GITHUB_TOKEN` 和 `contents: write` 权限，无需额外密钥。

分支推送和 PR 不触发构建。原始扫描 PDF 不会被构建产物覆盖。
