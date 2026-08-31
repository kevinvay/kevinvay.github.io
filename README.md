# Kevin Wu Portfolio

Kevin Wu 的个人作品集网站，使用 React、vinext 和 Vite 构建。

## 本地开发

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev -- --port 3001
```

本地预览地址：`http://localhost:3001/`

## 验证构建

```bash
npm run build
```

静态网站输出位于 `dist/client/`。

## 发布流程

1. Codex 在本地完成修改，并通过 3001 端口验证受影响页面。
2. 运行 `npm run build`，确认完整构建成功。
3. 用户在本地端口自行检查效果；检查完成前不发布。
4. 用户明确确认“可以发布”后，才将已验证版本发布到现有的 `chatgpt.site` 项目。

后续不会自动更新 `out/`。只有用户单独提出需要 EdgeOne 手动上传包时，才重新生成该目录。
