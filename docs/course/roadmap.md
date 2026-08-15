---
sidebar_position: 1
title: 系统学习路线
description: 从 Go 工程基础到 IoT 平台交付的完整学习路线
---

# Resora Go Lab 系统学习计划 v2

> 这不是框架清单，而是一套围绕同一个 IoT 平台持续迭代的课程。每项技术都从原理入门，经过真实项目实现，再进入故障、性能、兼容性和运维深度。

## 1. 这套课程要达到什么程度

“学完”不等于看过 API 文档，也不等于写过一个 Hello World。每个技术都要达到四个层次：

| 层次 | 需要达到的能力 | 必须留下的证据 |
| --- | --- | --- |
| 入门 | 能解释核心对象、生命周期和最小数据流 | 手写最小实现、概念图、基础测试 |
| 工程 | 能把技术接入 Device Platform，并处理错误、超时、取消和兼容性 | 可运行功能、集成测试、失败分支 |
| 深入 | 能解释性能、并发、一致性、版本、故障恢复和取舍 | 压测/故障实验、指标、排障记录、ADR |
| 交付 | 能让别人按文档启动、验证、升级和回滚 | README、迁移/发布脚本、CI 检查、验收证据 |

每一课都必须完成以下闭环：

```text
理解原理
  -> 阅读当前代码
  -> 在真实设备业务上实现一个纵向切片
  -> 写成功和失败测试
  -> 启动真实依赖并读回结果
  -> 记录决策、风险和回滚方式
```

如果只有代码没有测试，算“未完成”；如果只有测试没有真实依赖，算“练习完成”；如果没有解释为什么这样设计，算“能用但未掌握”。

## 2. 当前基线与最终边界

### 当前已经具备的基线

本仓库当前已有：

- Go 标准库 `net/http` API：设备列表、创建、更新、删除。
- `pgxpool` 直连 PostgreSQL，数据真实持久化。
- Next.js 页面和设备 API 调用。
- Docker Compose、健康检查、优雅退出。
- Prometheus、Alloy、Loki、Tempo、Grafana 三信号观测基线。
- 中文注释、启动说明和本地原生 API 调试方式。

这些内容作为课程的 Phase 0 基线，不再继续扩展观测面板或 Kubernetes；先把业务项目本身写扎实。

### 目标架构

```text
Next.js Console
       |
       | HTTP + OpenAPI
       v
Go Device Platform
       |
       +-- PostgreSQL: 主数据、事务、审计
       +-- Connect RPC + Protobuf: 服务间同步契约
       +-- NATS JetStream: 异步事件和 Worker
       +-- MQTT Gateway: 设备会话、上行、下行
       +-- Redis: 只有出现明确的缓存/协调需求后引入
```

### 技术边界

| 问题 | 主技术 | 不允许的替代 |
| --- | --- | --- |
| 浏览器和外部调用方 | HTTP + OpenAPI | 前端猜接口、直接共享数据库模型 |
| 服务间同步调用 | Protobuf + Connect RPC | 用内部 Go struct 冒充跨服务契约 |
| 异步状态变化 | NATS JetStream | 用 goroutine 代替可靠消息 |
| 设备接入 | MQTT + Gateway | 让每个业务服务直接维护 MQTT 连接 |
| 业务主数据 | PostgreSQL | 把 Redis 当永久数据库 |
| 缓存/短期协调 | Redis | 为了“分布式”提前引入缓存 |

服务之间不能直接查询对方的数据库表。单体阶段虽然只有一个进程，也要让模块边界和未来服务边界一致。

## 3. 依赖顺序

```text
Go 语言与工程基础
        ↓
chi HTTP API
        ↓
PostgreSQL 原理 + pgx + goose
        ↓
sqlc 类型安全查询
        ↓
OpenAPI + Scalar 接口契约
        ↓
Next.js + TypeScript 控制台
        ↓
Protobuf + Buf
        ↓
Connect RPC
        ↓
NATS JetStream
        ↓
MQTT / IoT Gateway
        ↓
Redis（按真实问题引入）
        ↓
可观测性深化、Linux、Docker、Compose
        ↓
Kubernetes、CI/CD、发布和高阶分布式
```

当前 Prometheus、Alloy、Loki、Tempo、Grafana 已运行，但只作为平台基线维护。业务核心完成前，不把时间转移到新的采集器或面板。

## 4. 统一课程规则

### 每一课固定结构

1. **问题**：当前项目为什么需要这项技术。
2. **模型**：对象、生命周期、数据流、失败语义。
3. **实现**：修改现有 Device Platform，不新建孤立 demo。
4. **测试**：正常路径、边界、取消/超时、依赖失败。
5. **实验**：主动制造一个故障或性能问题，观察实际结果。
6. **复盘**：解释目录、依赖、接口、取舍和回滚方式。
7. **检查点**：提交代码、文档和验证记录，再进入下一课。

### 每个阶段的完成门槛

- `go test -race ./...`、`go vet ./...` 或对应前端检查通过。
- 关键操作有真实 PostgreSQL/消息系统/浏览器读回，不只依赖 mock。
- 至少一个失败路径被测试或演练，例如数据库不可用、消息重复、请求超时。
- 生成代码、数据库 migration、API 契约和部署配置都能从干净环境重建。
- 能回答“为什么选这个技术、它不适合什么、坏了如何恢复”。

### 课程节奏

每个阶段拆成多节课，每节只推进一个可验证主题。阶段没有固定日历时间，只有完成门槛；没有通过门槛就不进入下一阶段。

## 5. Phase 0：现有基线复盘（已完成）

### 入门层

- Go 进程入口、`main`、环境变量、`go mod`。
- `http.Handler`、请求/响应、状态码。
- `context.Context`、`defer`、`signal.NotifyContext`。
- PostgreSQL 连接池、基础 CRUD。

### 工程层

- 健康检查：`/livez` 与 `/readyz` 的区别。
- 优雅关闭、请求超时、连接池关闭顺序。
- JSON 日志、Prometheus `/metrics`、OTLP Trace。
- Compose 服务名、网络、卷、健康依赖。

### 深入层

- HTTP 根 Span、SQL 子 Span 和 `trace_id` 的传播。
- Prometheus pull 与 Alloy 日志/Trace pipeline 的职责边界。
- 高基数字段为什么不能作为 Prometheus/Loki label。
- 本地原生 API 与 Docker API 的观测差异。

### 已有证据

- Docker API、PostgreSQL、Prometheus、Alloy、Loki、Tempo、Grafana 实际运行。
- `GET /api/devices` 的日志和 Trace 能关联到 `query SELECT` SQL 子 Span。
- 相关配置和中文注释已经提交到 GitHub。

## 6. Phase 1：Go 语言与工程基础

这一阶段是所有后续技术的前置，不以“会写 CRUD”为结束。

### 1.1 入门层：语言模型

学习内容：

- 包、导出规则、变量、常量、基本类型、零值。
- `struct`、方法、指针、值拷贝、构造函数习惯。
- array、slice、map、字符串、字节、编码。
- `interface` 的隐式满足、nil interface、接口组合。
- 函数值、闭包、错误返回、多返回值。
- `defer` 的执行顺序、panic/recover 的边界。
- 泛型约束和什么时候不应该使用泛型。

项目练习：为设备实体写纯 Go 的校验、分页、过滤和状态转换函数，要求无 HTTP/数据库依赖。

### 1.2 工程层：模块、错误和生命周期

学习内容：

- `go mod`、依赖版本、`go.sum`、`internal` 边界。
- 哨兵错误、包装错误、`errors.Is`、`errors.As`。
- `context` 的取消、截止时间、值传播；为什么不能把 Context 存进结构体。
- 配置读取、启动失败、信号、优雅关闭。
- `io.Reader`、`io.Writer`、JSON 编解码、文件和网络资源关闭。
- 结构化日志和错误日志的边界。

项目练习：把当前 API 的启动流程拆成配置、依赖初始化、服务生命周期三个清晰阶段；为数据库不可用、Trace 导出失败和收到 SIGTERM 写测试/演练记录。

### 1.3 并发层：goroutine、channel、select

学习内容：

- goroutine 栈、调度、阻塞与泄漏。
- channel 的发送/接收/关闭语义、方向类型、无缓冲和有缓冲。
- `select`、超时、取消、fan-in/fan-out、worker pool。
- `sync.Mutex`、`RWMutex`、`Once`、`WaitGroup`、`atomic`。
- 数据竞争、死锁、活锁、背压。

项目练习：实现一个可取消的设备批量导入 Worker；数据库写入失败时停止生产、避免 goroutine 泄漏，并用 `go test -race` 证明没有竞争。

### 1.4 测试与性能层

学习内容：

- 表驱动测试、子测试、测试夹具、测试替身。
- `httptest`、`testing.TB`、基准测试、模糊测试。
- `go test -race`、`go test -cover`、`go test -run`。
- `pprof` CPU/heap/goroutine/block/mutex profile。
- benchmark 中的分配、逃逸、`-benchmem`。
- 何时优化、如何用数据证明优化有效。

项目练习：为设备过滤和 API 序列化建立 benchmark；制造一个 goroutine 泄漏和一个数据竞争，再用工具定位并修复。

### 1.5 深入层：运行时和可维护性

学习内容：

- 逃逸分析、堆栈、GC 基本机制、调度器和阻塞 syscall。
- HTTP keep-alive、连接复用、文件描述符和 goroutine 数的关系。
- 反射、`unsafe`、代码生成的边界和风险。
- API 兼容、包循环依赖、抽象过早、公共包污染。

阶段门槛：能独立解释一个请求从 socket 到 Handler、数据库和响应的生命周期，并用测试、profile 和日志证明资源会释放。

## 7. Phase 2：chi HTTP API

### 2.1 入门层：Router 与 Handler

- `chi.NewRouter`、HTTP 方法、路径参数、子路由。
- `http.Handler` 与 `http.HandlerFunc` 的关系。
- 路由模板、404、405、路径参数校验。
- 中间件的进入/退出顺序。

项目交付：把当前标准库路由迁移到 chi，补齐 `GET /api/devices/{id}`，业务 Service 不得依赖 chi。

### 2.2 工程层：边界和中间件

- request DTO、response DTO、统一错误格式和错误码。
- CORS、request ID、认证占位、限时、body size、recover。
- context 传递、取消、超时和下游错误映射。
- 子路由、API 版本、健康端点和内部端点隔离。
- streaming response、文件下载、幂等请求的 HTTP 语义。

项目交付：设备 CRUD 有完整错误矩阵，包含非法 JSON、空名称、不存在 ID、数据库故障、取消请求。

### 2.3 深入层：HTTP 可靠性

- 连接超时、读超时、写超时、空闲连接和反向代理。
- 重试边界：哪些请求可以重试，哪些 POST 必须有幂等键。
- middleware 顺序对认证、Trace、日志、指标的影响。
- Handler 并发安全、响应已写出后的错误处理。
- HTTP/1.1、HTTP/2、流式请求的资源占用。

实验：让数据库查询阻塞，观察 Context、HTTP 超时、SQL 取消、日志和 Trace 是否一致。

## 8. Phase 3：PostgreSQL 原理 + pgx + goose

### 3.1 PostgreSQL 入门层

- database/schema/table/row/column/type。
- `SELECT/INSERT/UPDATE/DELETE`、JOIN、聚合、窗口函数。
- 主键、外键、唯一、CHECK、NOT NULL、默认值。
- NULL、时间时区、JSONB、数组和枚举的取舍。
- 事务的 begin/commit/rollback。

项目交付：重做设备模型，增加产品归属、唯一设备编码和审计时间。

### 3.2 数据建模与事务层

- 范式、反范式、聚合边界和软删除取舍。
- MVCC、快照、可见性、vacuum 的基本机制。
- Read Committed、Repeatable Read、Serializable。
- 行锁、表锁、死锁、锁等待和事务时长。
- 事务必须包住什么，不能包住什么。

实验：用两个并发事务复现丢失更新、唯一约束竞争和死锁，并记录数据库实际结果。

### 3.3 查询和性能层

- B-Tree、Hash、GIN/GiST 的适用场景。
- 选择性、复合索引顺序、覆盖索引、部分索引。
- `EXPLAIN (ANALYZE, BUFFERS)`、seq scan、index scan、join plan。
- 分页的 offset 与 keyset 取舍。
- 慢查询、连接池耗尽、锁等待、WAL 和 vacuum 的基本排查。

项目交付：设备列表支持稳定分页；用数据证明索引前后差异，而不是只添加索引文件。

### 3.4 pgx 入门到工程

- `pgxpool.ParseConfig`、连接池生命周期、Ping。
- `QueryRow`、`Query`、`Exec`、rows 关闭和扫描错误。
- 参数绑定、PostgreSQL 错误码、NULL 映射。
- `BeginTx`、事务函数、回滚保护、批量写入。
- `Batch`、`CopyFrom`、LISTEN/NOTIFY 的适用边界。
- Context 取消如何传到数据库；连接池指标如何观察。

项目交付：Repository 只暴露领域需要的接口，数据库错误不直接泄漏到 HTTP。

### 3.5 goose 入门到深入

- migration 文件命名、Up/Down、版本表和状态查询。
- 空数据库初始化、升级、回滚和重复执行。
- migration 与应用版本的兼容关系。
- expand/contract：先加兼容结构，再迁移数据，最后删除旧结构。
- 大表 backfill、分批迁移、锁风险、停机迁移与在线迁移。
- CI 中从空库和旧版本库各自执行 migration。

阶段门槛：新环境只靠 goose 建库；旧版本升级不丢数据；破坏性 DDL 有明确发布和回滚计划。

## 9. Phase 4：sqlc 类型安全数据访问

### 4.1 入门层

- `sqlc.yaml` 的 schema、queries、engine、package、out 目录。
- `:one`、`:many`、`:exec`、`sqlc.arg`、命名参数。
- 生成的 `Queries`、参数类型、返回类型和扫描代码。
- 生成代码为何不能手改。

项目交付：将设备 CRUD 从手写 Repository SQL 迁移到 sqlc。

### 4.2 工程层

- nullable 字段、`sql.Null*`、指针和自定义类型。
- `WithTx`、事务内多个 query、Repository 事务边界。
- 分页、过滤、排序白名单和动态 SQL 的安全写法。
- schema/query 变更后的生成差异检查。
- sqlc 生成层与领域 entity、DTO 的映射边界。

项目交付：设备分页、按 ID、唯一编码冲突和审计写入全部有集成测试。

### 4.3 深入层

- overrides、类型映射、自定义 PostgreSQL 类型。
- 复杂 JOIN 返回结构和查询拆分。
- 生成 API 的长期兼容、代码审查和版本升级。
- 查询计划与 sqlc 无关：生成安全不代表 SQL 性能正确。
- 使用静态检查防止 query/schema/generated code 漂移。

阶段门槛：任何 SQL 变更都能通过 migration、sqlc generate、测试和 review 形成完整链路。

## 10. Phase 5：HTTP 接口契约、OpenAPI 与 Scalar

### 5.1 OpenAPI 入门层

- `paths`、operation、parameter、requestBody、response。
- schema、required、nullable、enum、format、example。
- 200/201/204/400/404/409/422/500 的边界。
- 错误对象、分页对象和通用响应模型。

项目交付：设备 API 拥有一份可校验的 OpenAPI 3.1 文档。

### 5.2 工程层

- 契约优先与代码优先的取舍。
- OpenAPI lint、规范检查、examples 和契约测试。
- 版本路径、兼容字段、弃用和破坏性变更。
- OpenAPI 生成 TypeScript client 的边界。
- Scalar 私有部署、鉴权说明和开发环境调试。

项目交付：前端 API client 从契约获得类型；文档请求可以打通真实后端。

### 5.3 深入层

- 向后兼容矩阵、消费者驱动契约和变更审批。
- 幂等键、条件请求、ETag、批量接口和错误重试语义。
- OpenAPI security scheme、OAuth/OIDC、HMAC 的契约表达。
- 生成代码升级、手写扩展和契约版本发布策略。

阶段门槛：接口文档、后端行为、前端调用和测试不能出现四套不一致的字段定义。

## 11. Phase 6：TypeScript 与 Next.js 控制台

### 6.1 TypeScript/React 入门层

- 基础类型、联合、泛型、类型收窄、`unknown` 与 `any`。
- React props、state、事件、受控表单和组件组合。
- 异步请求、错误状态、加载状态和空状态。
- Server Component 与 Client Component 的职责。

### 6.2 Next.js 工程层

- App Router、layout、page、loading、error、not-found。
- Server fetch、缓存、revalidate、no-store、mutation 后刷新。
- API 基础地址、环境变量和浏览器/服务端边界。
- 表单校验、乐观更新、并发提交和错误恢复。
- 设备列表、详情、创建、编辑、删除和分页。

### 6.3 深入层

- RSC 数据流、缓存失效、预取和瀑布请求。
- 权限边界、session、CSRF、XSS、CORS 和后端授权。
- React 性能、bundle、图片、可访问性、错误监控。
- 组件测试、Playwright 浏览器测试、真实 API 联调。
- 前端 API client 的版本兼容和错误码映射。

阶段门槛：浏览器能完成完整设备工作流；刷新页面数据仍来自 PostgreSQL；错误、空列表、慢请求和权限拒绝都有可理解的 UI。

## 12. Phase 7：Protobuf 与 Buf

### 7.1 Protobuf 入门层

- message、field number、标量、enum、repeated、map。
- wire format、field number 为什么不能复用。
- optional、oneof、Timestamp、Duration。
- service、RPC 方法和生成代码。

### 7.2 工程层

- 包名、目录、版本命名和模块边界。
- `buf lint`、`buf breaking`、`buf generate`。
- 请求/响应设计、分页、错误详情和资源引用。
- Go/TypeScript 生成代码的使用边界。
- 契约变更、弃用、兼容字段和发布版本。

### 7.3 深入层

- 二进制兼容、JSON 映射、未知字段和默认值陷阱。
- oneof 演进、Any、包装类型和大消息限制。
- 反射、descriptor、代码生成插件和 CI 契约门禁。
- Protobuf 不等于业务模型：契约模型与内部 entity 的映射。

项目交付：在 `contracts/proto` 定义 `DeviceQueryService`，并让 Buf 在 CI 中阻止破坏性字段变更。

## 13. Phase 8：Connect RPC

### 8.1 入门层

- Connect、gRPC、gRPC-Web 的关系和适用客户端。
- unary 请求/响应、metadata、状态码和错误。
- Connect server、client、handler 注册和本地调用。
- deadline、取消和连接复用。

### 8.2 工程层

- interceptor 链、认证、日志、Trace、重试和超时。
- protobuf 错误详情、业务错误到 RPC 错误的映射。
- HTTP/2、代理、TLS、客户端连接池和服务发现。
- streaming RPC 的背压、取消和资源释放。
- Connect 契约集成测试和跨版本兼容。

项目交付：实现一个真正需要内部同步调用的 Device Query/Device Registry RPC；浏览器仍调用 HTTP API，不能为了学习 RPC 改掉外部契约。

### 8.3 深入层

- RPC 重试放大、幂等方法和 deadline budget。
- 大消息、流式传输、连接故障、半开连接和负载均衡。
- RPC 认证授权、租户边界和 metadata 泄露风险。
- RPC 指标、Trace parent、服务依赖图和故障排查。

阶段门槛：能解释一次 Connect 调用从客户端、网络、服务端 interceptor 到 PostgreSQL 的完整链路，并演练服务超时和版本不兼容。

## 14. Phase 9：NATS 与 JetStream

### 9.1 NATS Core 入门层

- server、connection、subject、publish、subscribe、request/reply。
- wildcard subject、queue group、客户端重连。
- at-most-once 的含义和消息丢失场景。

### 9.2 JetStream 工程层

- Stream、subject 绑定、存储策略、保留策略和序列。
- durable consumer、pull/push、ack、ack wait、max deliver。
- redelivery、退避、暂停/恢复、消费积压和监控。
- event envelope、event_id、schema version、occurred_at。
- 消费者幂等：唯一约束、幂等表、状态机和重复消息。

项目交付：设备创建事务提交后发布 `device.created.v1`，审计 Worker 使用 durable consumer 消费；重复投递只产生一条业务结果。

### 9.3 深入层

- at-least-once 的端到端边界；不把“消息去重”误称为 exactly-once。
- Outbox、发布确认、数据库事务和事件可见性。
- poison message、dead-letter subject、人工重放和失败项隔离。
- ordering key、并行 consumer、吞吐和顺序取舍。
- Stream/consumer 运维、容量、保留和灾难恢复。
- NATS header 中的 Trace Context 传播。

故障实验：停止 Worker、制造处理超时、重复发布同一个 event_id，再检查最终状态、重试次数和 Trace。

## 15. Phase 10：MQTT 与 IoT Gateway

### 10.1 MQTT 入门层

- broker、client、topic、publish、subscribe。
- QoS 0/1/2、retain、session、clean start、LWT。
- topic 命名、设备身份、认证和 ACL。
- MQTT ACK 与业务 ACK 的区别。

### 10.2 Gateway 工程层

- 连接会话、心跳、在线/离线状态和超时。
- 上行 telemetry、event、property report 的统一 envelope。
- 下行命令、command_id、response correlation 和超时。
- 协议解析、版本兼容、脏 payload 和未知字段。
- Gateway 与业务服务的职责边界。

项目交付：模拟设备上报温度，Gateway 标准化后发布 NATS，Worker 入库，控制台展示最新值和时间线。

### 10.3 深入层

- 重连、重复上报、乱序、离线缓存和消息保序。
- MQTT QoS 不等于业务 exactly-once；业务必须用消息 ID 和持久化幂等。
- 大量设备连接的 goroutine、文件描述符、心跳和背压。
- 设备凭证、ACL、TLS、密钥轮换、敏感日志清理。
- 命令发送失败、设备无响应和最终一致状态。

阶段门槛：设备从连接、上报、入库、查询到命令回包都有真实端到端证据。

## 16. Phase 11：Redis（只在真实需求出现后）

### 入门层

- String、Hash、Set、Sorted Set、TTL。
- key 命名、序列化、过期和内存淘汰。
- Redis 与 PostgreSQL 的职责区别。

### 工程层

- pipeline、事务、Lua 原子操作、Pub/Sub 和 Streams。
- 缓存旁路、失效、穿透、击穿、雪崩。
- 幂等键、限流计数、短期会话和临时锁。

### 深入层

- 单线程事件循环、网络延迟和大 key。
- cluster、哨兵、故障转移和一致性边界。
- 分布式锁的续期、误释放和业务 fencing token。
- Redis 故障时降级策略，不能让缓存成为单点。

项目交付：先对设备详情做基准测试，再有证据地加入缓存；演练 Redis 不可用时 API 的可接受降级。

## 17. Phase 12：测试、契约和质量体系

这不是最后补测试，而是贯穿每一阶段；本阶段专门把测试体系系统化。

### 测试层级

- 纯函数/领域规则：快速单元测试。
- Handler/Router：`httptest` 和错误矩阵。
- PostgreSQL：真实数据库集成测试、migration 后 schema 验证。
- sqlc：真实查询、事务、约束和查询结果。
- OpenAPI：契约校验和消费者请求。
- Connect RPC：编码、错误传播、deadline、interceptor。
- NATS：发布、确认、重复、重试、积压、恢复。
- MQTT：连接、上行、命令、重连和设备离线。
- Next.js：组件测试、lint/build、Playwright 浏览器流。

### 深入主题

- 测试数据隔离、并行测试、可重复随机种子。
- flaky test、时钟注入、网络故障注入。
- race、benchmark、profile、覆盖率的正确解读。
- 测试不是覆盖率数字；优先覆盖业务不变量和故障恢复。

## 18. Phase 13：可观测性深化

现有 LGTM 基线只保留维护，等业务事件链路完成后再深入：

### 入门层

- log、metric、trace 三种信号的差异。
- Counter、Gauge、Histogram、label cardinality。
- Span、parent/child、context propagation、OTLP。

### 工程层

- HTTP/RPC/NATS/MQTT/DB 的 Trace 串联。
- structured log、trace_id、span_id 和错误字段。
- RED 指标、业务指标、告警规则和 Grafana 变量。
- Alloy pipeline、Loki label、Tempo traces-to-logs。

### 深入层

- 采样、尾采样、成本、丢失和重试。
- SLI/SLO、错误预算、告警抑制和 runbook。
- 高基数、指标聚合、日志保留和 Trace retention。
- 观测后端故障时应用应如何降级，不能阻塞主业务。

阶段门槛：从错误率/延迟异常出发，能定位到一个 Trace、一个日志事件和一个数据库/消息子操作。

## 19. Phase 14：Linux、Docker、Compose、Kubernetes 与 CI/CD

### 19.1 Linux 入门到深入

- 进程、线程、信号、文件描述符、socket、端口。
- CPU、内存、IO、网络、磁盘和进程限制。
- `ps`、`lsof`、`ss`、`top`、`journalctl`、systemd。
- TCP 建连、keep-alive、TIME_WAIT、DNS、反向代理。
- cgroup、namespace、容器资源和 OOM 排查。

### 19.2 Docker/Compose

- Dockerfile、layer、image、container、volume、network。
- 多阶段构建、非 root、read-only、healthcheck、signal。
- Compose 服务依赖、环境、网络、卷、日志和数据清理。
- 镜像可复现、架构差异、漏洞扫描和最小权限。

### 19.3 Kubernetes

- Pod、Deployment、Service、ConfigMap、Secret、Ingress。
- liveness/readiness/startup probe、requests/limits、HPA。
- PVC、StatefulSet、DaemonSet、Job、CronJob。
- rollout、rollback、PDB、拓扑、网络策略和 ServiceAccount。
- Helm values、环境分层、migration Job 和发布顺序。

### 19.4 CI/CD 与发布

- CI 中的 Go/前端测试、lint、生成代码和契约检查。
- migration 检查、镜像构建、SBOM、签名和 registry。
- staging 验收、滚动发布、blue-green/canary、回滚。
- 配置/Secret 注入、审计、变更窗口和 runbook。

部署阶段的完成门槛是：应用有健康检查、资源边界、优雅退出、可回滚 migration、可复现镜像和实际发布读回，而不是“Pod Running”。

## 20. 里程碑和最终交付物

### M1：Device Service v1

Phase 1 到 Phase 6 完成后，交付同一个可用产品切片：

```text
设备 CRUD + 分页
  + chi HTTP
  + PostgreSQL / pgx / goose
  + sqlc
  + OpenAPI / Scalar
  + Next.js 控制台
  + 单元 / 集成 / 浏览器测试
```

### M2：内部服务契约

Phase 7 到 Phase 8 完成后，增加：

```text
contracts/proto
  + Buf lint/breaking/generate
  + Connect RPC Device Query
  + RPC deadline/error/interceptor/Trace
```

### M3：事件驱动设备平台

Phase 9 到 Phase 10 完成后，增加：

```text
device.created.v1
  + JetStream durable consumer
  + Outbox/幂等/重试/死信/重放
  + MQTT Gateway
  + telemetry/command/session
```

### M4：可交付运行平台

Phase 11 到 Phase 14 完成后，增加：

```text
Redis（有证据的需求）
  + 三信号排障闭环
  + Linux/Docker/Compose
  + Kubernetes/Helm
  + CI/CD/发布/回滚/SLO
```

## 21. 后续上课方式

后续我会先告诉你当前课属于哪个 Phase、要解决哪个真实问题和完成标准，再开始改代码。每节课只推进一个完整的学习闭环；没有完成测试和读回，不直接跳到下一项技术。

下一课入口仍然是 **Phase 1：chi HTTP API**，但会按本计划先讲清 Go `http.Handler`、chi Router、中间件和 Context 的模型，再迁移当前设备 API。
