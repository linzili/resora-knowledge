---
sidebar_position: 5
title: sqlc 类型安全数据访问
description: 用 SQL 生成可审查、可测试的 Go 数据访问代码
---

# sqlc 类型安全数据访问

sqlc 解决的是 SQL 与 Go 类型之间的重复映射问题，不会替你解决查询设计、事务边界和性能问题。

## 学习范围

- schema、queries、生成配置和 `:one`/`:many`/`:exec`。
- nullable 字段、事务查询、分页和安全排序。
- 生成代码与领域模型、DTO、Repository 的边界。
- migration、sqlc generate、测试和 review 的完整链路。
