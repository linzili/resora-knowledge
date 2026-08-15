---
sidebar_position: 8
title: Connect RPC
description: 服务间同步调用、错误、deadline 和 interceptor
---

# Connect RPC

Connect RPC 只用于内部同步契约；浏览器对外仍然使用 HTTP/OpenAPI，不为了学习 RPC 而改变外部接口。

## 学习范围

- Connect、gRPC、gRPC-Web 的关系。
- metadata、deadline、取消、状态码和错误详情。
- interceptor、认证、Trace、重试、连接复用和服务发现。
- 流式 RPC 的背压、取消、版本兼容和故障演练。
