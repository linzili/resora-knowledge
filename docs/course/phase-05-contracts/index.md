---
sidebar_position: 6
title: OpenAPI、Protobuf 与 Buf
description: 对外 HTTP 契约和服务间二进制契约
---

# OpenAPI、Protobuf 与 Buf

本阶段把“接口能调用”提升为“契约可校验、可生成、可演进”。

## 学习范围

- OpenAPI schema、错误对象、分页、幂等键和兼容性。
- Protobuf message、field number、oneof、未知字段和 JSON 映射。
- Buf lint、breaking、generate、版本命名和 CI 契约门禁。
- 生成代码与内部 entity 的边界。
