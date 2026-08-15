---
sidebar_position: 3
title: HTTP 与 chi
description: 从 net/http Handler 到可测试的 chi API
---

# HTTP 与 chi

本阶段负责把现有设备 API 变成边界清晰、错误可观察、可测试和可演进的 HTTP 服务。

## 学习范围

- `http.Handler`、路由、路径参数、状态码和响应生命周期。
- chi Router、中间件顺序、Context、超时和取消。
- DTO、统一错误格式、CORS、request ID、body size 和 recover。
- 幂等请求、重试边界、连接超时和优雅关闭。

## 项目切片

将 `resora-go-lab` 的设备 CRUD 迁移到 chi，并补齐按 ID 查询、错误矩阵和真实 PostgreSQL 集成测试。
