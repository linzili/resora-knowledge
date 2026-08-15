---
sidebar_position: 2
title: Go 语言与工程基础
description: 从语言模型、并发到测试和运行时的完整 Go 基础
---

# Go 语言与工程基础

本阶段不以“能写 CRUD”为结束，而是建立后续 HTTP、数据库、消息和设备网关所需要的语言与运行时模型。

## 学习范围

- 类型、零值、struct、方法、指针和 interface。
- error、defer、context、资源生命周期和优雅退出。
- goroutine、channel、select、同步原语、背压和泄漏。
- 表驱动测试、`httptest`、竞态检测、benchmark 和 pprof。

## 当前入口

下一节课会从 `http.Handler` 和 chi 之前的标准库模型开始，先把请求生命周期讲清楚，再迁移到框架。

## 完成证据

- 纯 Go 设备领域规则测试。
- 可取消的批量导入 Worker。
- `go test -race ./...` 和基准测试记录。
- 一个故意制造并修复的 goroutine 泄漏实验。
