# Resora Knowledge

Resora Go 与 IoT 平台的系统学习知识库，使用 Docusaurus 构建，部署到 GitHub Pages。

在线地址：<https://linzili.github.io/resora-knowledge/>

## 本地开发

```bash
npm install
npm start
```

开发服务器默认运行在 <http://localhost:3000>。

## 构建与检查

```bash
npm run typecheck
npm run build
```

`npm run build` 会生成 `build/` 静态站点，并在构建时检查断开的文档链接。

## 内容组织

- `docs/course/`：按阶段组织的系统课程。
- `docs/knowledge/`：可独立复习的原理知识。
- `docs/labs/`：可重复的故障和性能实验。
- `docs/architecture/`：系统边界、数据流和组件职责。
- `docs/decisions/`：ADR 技术决策记录。
- `docs/glossary.md`：统一术语表。

代码实验在另一个仓库：<https://github.com/linzili/resora-go-lab>。

## 发布

推送到 `main` 会触发 `.github/workflows/deploy.yml`。工作流执行类型检查、构建，然后通过 GitHub Pages Actions 发布。

GitHub 仓库的 Pages 来源需要设置为 `GitHub Actions`；初始化仓库时会通过 GitHub API 自动配置。
