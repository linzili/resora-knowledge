---
sidebar_position: 4
title: PostgreSQL、pgx 与 goose
description: 数据建模、事务、查询性能和数据库迁移
---

# PostgreSQL、pgx 与 goose

本阶段建立可靠的数据边界：业务主数据放在 PostgreSQL，应用通过 pgx 访问，schema 变化由 goose 管理。

## 学习范围

- 数据建模、约束、NULL、时间和 JSONB 的取舍。
- MVCC、事务隔离、锁、死锁和一致性。
- 索引、`EXPLAIN (ANALYZE, BUFFERS)`、分页和连接池。
- pgx 事务、错误码、取消传播和批量操作。
- goose migration、expand/contract 和在线迁移风险。
