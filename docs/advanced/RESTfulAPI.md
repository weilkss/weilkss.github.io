# RESTfulAPI 面试指南

## 一、REST 基础概念

### 1.1 什么是 REST？

REST（Representational State Transfer，表述性状态转移）是一种软件架构风格，由 Roy Fielding 在 2000 年提出。它不是标准，而是一种设计风格，用于构建 Web 服务。

**REST 核心原则：**

```
1. 客户端-服务器架构
   - 客户端负责用户界面和用户状态
   - 服务器负责数据存储和业务逻辑
   - 分离关注点，提高可扩展性

2. 无状态
   - 每个请求包含所有必要信息
   - 服务器不保存客户端状态
   - 简化服务器设计，提高可扩展性

3. 可缓存
   - 响应可以被缓存
   - 提高性能和可扩展性

4. 统一接口
   - 使用标准的 HTTP 方法
   - 资源通过 URI 标识
   - 表述性传输（JSON、XML 等）

5. 分层系统
   - 系统可以分层部署
   - 客户端不知道中间层存在
```

### 1.2 REST vs SOAP

| 特性 | REST | SOAP |
|------|------|------|
| 架构风格 | 轻量级 | 重量级 |
| 数据格式 | JSON, XML | XML |
| 传输协议 | HTTP | HTTP, SMTP, TCP |
| 学习曲线 | 低 | 高 |
| 性能 | 高 | 一般 |
| 缓存 | 支持 | 有限支持 |
| 错误处理 | HTTP 状态码 | 详细错误信息 |
| 安全性 | 基本认证/OAuth | WS-Security |
| 适用场景 | Web API | 企业级应用 |

---

## 二、HTTP 方法与 CRUD

### 2.1 常用 HTTP 方法

| 方法 | 语义 | 幂等性 | 安全性 | 说明 |
|------|------|--------|--------|------|
| GET | 获取资源 | 是 | 是 | 查询操作 |
| POST | 创建资源 | 否 | 否 | 新增操作 |
| PUT | 更新资源（完整） | 是 | 否 | 完整更新 |
| PATCH | 部分更新资源 | 否 | 否 | 部分更新 |
| DELETE | 删除资源 | 是 | 否 | 删除操作 |
| HEAD | 获取资源元数据 | 是 | 是 | 与GET类似但无body |
| OPTIONS | 获取支持的HTTP方法 | 是 | 是 | CORS预检 |

### 2.2 RESTful API 设计示例

```bash
# 资源：用户 (users)

# 创建用户
POST   /api/users

# 获取所有用户
GET    /api/users

# 获取单个用户
GET    /api/users/{id}

# 更新用户（完整）
PUT    /api/users/{id}

# 部分更新用户
PATCH  /api/users/{id}

# 删除用户
DELETE /api/users/{id}

# 获取用户的订单（子资源）
GET    /api/users/{id}/orders

# 创建用户订单
POST   /api/users/{id}/orders

# 资源：订单 (orders)

# 获取所有订单
GET    /api/orders

# 获取单个订单
GET    /api/orders/{id}

# 资源：产品 (products)

# 获取所有产品
GET    /api/products

# 搜索产品
GET    /api/products?category=electronics&price_min=100&price_max=500

# 获取热门产品（自定义行为）
GET    /api/products/popular
```

### 2.3 请求与响应示例

```bash
# POST /api/users - 创建用户
# 请求
POST /api/users
Content-Type: application/json

{
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "age": 25
}

# 响应 - 201 Created
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/123

{
    "id": 123,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00Z"
}


# GET /api/users/123 - 获取用户
# 响应 - 200 OK
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": 123,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00Z"
}


# PUT /api/users/123 - 更新用户
# 请求
PUT /api/users/123
Content-Type: application/json

{
    "username": "zhangsan_updated",
    "email": "zhangsan_new@example.com",
    "age": 26
}

# 响应 - 200 OK
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": 123,
    "username": "zhangsan_updated",
    "email": "zhangsan_new@example.com",
    "age": 26,
    "updatedAt": "2024-01-16T15:00:00Z"
}


# DELETE /api/users/123 - 删除用户
# 响应 - 204 No Content
HTTP/1.1 204 No Content
```

---

## 三、HTTP 状态码

### 3.1 状态码分类

| 分类 | 范围 | 说明 |
|------|------|------|
| 1xx | 100-199 | 信息性状态码 |
| 2xx | 200-299 | 成功状态码 |
| 3xx | 300-399 | 重定向状态码 |
| 4xx | 400-499 | 客户端错误状态码 |
| 5xx | 500-599 | 服务器错误状态码 |

### 3.2 常用状态码

```bash
# 成功状态码
200 OK                    # GET/PUT 成功
201 Created               # POST 创建资源成功
202 Accepted              # 异步请求已接受
204 No Content            # DELETE 成功，无返回内容

# 客户端错误状态码
400 Bad Request           # 请求格式错误
401 Unauthorized          # 未认证（未登录）
403 Forbidden             # 无权限（已登录但无权限）
404 Not Found             # 资源不存在
405 Method Not Allowed    # HTTP 方法不允许
409 Conflict              # 资源冲突（如重复创建）
422 Unprocessable Entity  # 验证错误
429 Too Many Requests     # 请求频率限制

# 服务器错误状态码
500 Internal Server Error # 服务器内部错误
502 Bad Gateway           # 网关错误
503 Service Unavailable   # 服务不可用
504 Gateway Timeout       # 网关超时
```

### 3.3 错误响应格式

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "请求参数验证失败",
        "details": [
            {
                "field": "email",
                "message": "邮箱格式不正确"
            },
            {
                "field": "age",
                "message": "年龄必须大于0"
            }
        ],
        "requestId": "req_abc123"
    }
}
```

---

## 四、API 版本管理

### 4.1 版本管理策略

```bash
# 方案一：URL 路径版本（最常用）
GET /api/v1/users
GET /api/v2/users

# 方案二：Query 参数版本
GET /api/users?version=1
GET /api/users?version=2

# 方案三：Header 版本
GET /api/users
Accept: application/vnd.api+json; version=2

# 方案四：子域名版本
GET https://v1.api.example.com/users
GET https://v2.api.example.com/users
```

### 4.2 版本迁移策略

```bash
# 版本共存策略
# 旧版本 v1 和新版本 v2 同时运行

# 1. 添加新版本
POST /api/v2/users

# 2. 通知客户端迁移
# - 发送邮件通知
# - 文档说明
# - 提供迁移工具

# 3. 设置废弃时间
# - v1 设定废弃日期（如 6 个月后）
# - 定期提醒客户端

# 4. 废弃旧版本
# - 返回 Deprecation 响应头
# X-API-Warned: true
# X-API-Deprecated: true
# Sunset: Sat, 01 Jan 2025 00:00:00 GMT

# 5. 移除旧版本
```

---

## 五、认证与授权

### 5.1 认证方式

```bash
# 1. Basic Authentication（基本认证）
GET /api/users
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
# 简单但不安全，仅用于 HTTPS

# 2. Bearer Token（OAuth 2.0）
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# 常用方式，Token 可设置过期时间

# 3. API Key
GET /api/users?api_key=your_api_key_here
# 或
GET /api/users
X-API-Key: your_api_key_here

# 4. JWT（JSON Web Token）
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 5.2 JWT 实现

```javascript
// JWT 生成（Node.js + Express）
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 验证用户
    const user = validateUser(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 Token
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h',
            issuer: 'my-api'
        }
    );

    res.json({ token });
});

// JWT 验证中间件
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// 使用
app.get('/api/users', authMiddleware, (req, res) => {
    res.json({ users: [] });
});
```

### 5.3 权限控制

```javascript
// RBAC (Role-Based Access Control) 权限控制

// 定义角色和权限
const permissions = {
    admin: ['users:read', 'users:write', 'users:delete', 'orders:read', 'orders:write'],
    manager: ['users:read', 'orders:read', 'orders:write'],
    user: ['users:read', 'orders:read']
};

// 权限检查中间件
const requirePermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const rolePermissions = permissions[userRole] || [];

        if (!rolePermissions.includes(permission)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

// 使用
app.delete('/api/users/:id',
    authMiddleware,
    requirePermission('users:delete'),
    (req, res) => {
        // 删除用户逻辑
    }
);
```

---

## 六、分页与过滤

### 6.1 分页实现

```bash
# 基于游标的分页（Cursor-based）
GET /api/users?limit=20&cursor=eyJpZCI6MTIzfQ
# 返回
{
    "data": [...],
    "pagination": {
        "next_cursor": "eyJpZCI6MTQzfQ",
        "has_more": true
    }
}

# 基于页码的分页（Offset-based）
GET /api/users?page=2&per_page=20
# 返回
{
    "data": [...],
    "pagination": {
        "page": 2,
        "per_page": 20,
        "total": 100,
        "total_pages": 5
    }
}

# 基于数量的分页
GET /api/users?offset=20&limit=20
```

### 6.2 过滤与排序

```bash
# 基础过滤
GET /api/products?category=electronics
GET /api/products?price_min=100&price_max=500
GET /api/products?in_stock=true

# 多值过滤
GET /api/products?category=electronics&category=computers

# 排序
GET /api/products?sort=price           # 按价格升序
GET /api/products?sort=-price          # 按价格降序
GET /api/products?sort=price,-createdAt  # 多字段排序

# 搜索
GET /api/products?search=laptop
GET /api/products?q=laptop&fields=name,description

# 字段过滤
GET /api/products?fields=id,name,price

# 嵌套资源过滤
GET /api/users/123/orders?status=pending&sort=-createdAt
```

### 6.3 Node.js 实现

```javascript
// 分页中间件
const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 100);
    const offset = (page - 1) * perPage;

    req.pagination = { page, perPage, offset };
    next();
};

// 查询构建器
const buildQuery = (model) => {
    let query = model.query();

    // 过滤
    if (req.query.category) {
        query = query.where('category', req.query.category);
    }
    if (req.query.price_min) {
        query = query.where('price', '>=', req.query.price_min);
    }
    if (req.query.price_max) {
        query = query.where('price', '<=', req.query.price_max);
    }

    // 排序
    if (req.query.sort) {
        const sortField = req.query.sort.startsWith('-')
            ? req.query.sort.substring(1)
            : req.query.sort;
        const sortOrder = req.query.sort.startsWith('-') ? 'desc' : 'asc';
        query = query.orderBy(sortField, sortOrder);
    }

    // 分页
    query = query.limit(req.pagination.perPage)
                 .offset(req.pagination.offset);

    return query;
};

// API 路由
app.get('/api/products', paginationMiddleware, async (req, res) => {
    const { page, perPage } = req.pagination;

    const [products, total] = await Promise.all([
        buildQuery(Product).fetchAll(),
        Product.query().count('id as count').first()
    ]);

    res.json({
        data: products,
        pagination: {
            page,
            per_page: perPage,
            total: total.count,
            total_pages: Math.ceil(total.count / perPage)
        }
    });
});
```

---

## 七、高级特性

### 7.1 缓存策略

```bash
# HTTP 缓存控制

# 1. Last-Modified / If-Modified-Since
GET /api/users/123
Last-Modified: Wed, 15 Jan 2024 10:30:00 GMT

# 下次请求
GET /api/users/123
If-Modified-Since: Wed, 15 Jan 2024 10:30:00 GMT

# 如果未修改，返回 304
HTTP/1.1 304 Not Modified

# 2. ETag / If-None-Match
GET /api/users/123
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 下次请求
GET /api/users/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 如果未修改，返回 304
HTTP/1.1 304 Not Modified

# 3. Cache-Control
Cache-Control: max-age=3600, public
Cache-Control: no-cache, private
Cache-Control: no-store
```

```javascript
// Node.js 缓存实现
const etag = require('etag');
const fresh = require('fresh');

app.get('/api/users/:id', (req, res) => {
    const user = getUser(req.params.id);

    // 生成 ETag
    const userEtag = etag(JSON.stringify(user));

    // 设置 ETag
    res.set('ETag', userEtag);

    // 检查 If-None-Match
    if (req.headers['if-none-match'] === userEtag) {
        return res.status(304).end();
    }

    // 检查 Last-Modified
    if (req.headers['if-modified-since']) {
        if (fresh(req.headers, { 'etag': userEtag })) {
            return res.status(304).end();
        }
    }

    res.json(user);
});
```

### 7.2 速率限制

```bash
# 速率限制响应头
X-RateLimit-Limit: 100           # 限制次数
X-RateLimit-Remaining: 95        # 剩余次数
X-RateLimit-Reset: 1642089600    # 重置时间戳

# 超过限制返回
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
```

```javascript
// Node.js 速率限制实现
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 分钟窗口
    max: 100,                     // 100 次请求
    message: {
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: 3600
    },
    standardHeaders: true,        // 返回标准头
    legacyHeaders: false,
    store: new RedisStore({
        client: redisClient,
        prefix: 'rate_limit:'
    }),
    keyGenerator: (req) => {
        return req.user?.id || req.ip;  // 基于用户或 IP
    }
});

app.use('/api', limiter);
```

### 7.3 CORS 配置

```javascript
// Node.js CORS 配置
const cors = require('cors');

app.use(cors({
    origin: ['https://example.com', 'https://www.example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    credentials: true,
    maxAge: 86400  // 预检请求缓存 24 小时
}));

// 手动设置
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://example.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
});
```

---

## 八、接口文档

### 8.1 OpenAPI (Swagger) 规范

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: 用户管理系统 API
  version: 1.0.0
  description: 用户管理系统的 RESTful API

servers:
  - url: https://api.example.com/v1
    description: 生产环境
  - url: https://staging-api.example.com/v1
    description: 测试环境

paths:
  /users:
    get:
      summary: 获取用户列表
      tags:
        - Users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      summary: 创建用户
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'

  /users/{id}:
    get:
      summary: 获取用户详情
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        username:
          type: string
        email:
          type: string
          format: email
        created_at:
          type: string
          format: date-time

    Pagination:
      type: object
      properties:
        page:
          type: integer
        per_page:
          type: integer
        total:
          type: integer
        total_pages:
          type: integer

  responses:
    Unauthorized:
      description: 未认证
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: 资源不存在
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

## 九、面试题

### 9.1 面试题1：RESTful API 设计规范？

**参考答案：**

**核心原则：**
1. **资源导向**：使用名词而非动词描述资源
2. **HTTP 语义**：正确使用 HTTP 方法
3. **无状态**：每个请求包含所有必要信息
4. **统一接口**：使用标准的数据格式（JSON）

**具体规范：**

```bash
# 好
GET    /api/users          # 获取用户列表
GET    /api/users/123      # 获取指定用户
POST   /api/users          # 创建用户
PUT    /api/users/123      # 更新用户
DELETE /api/users/123      # 删除用户

# 不好
GET    /api/getUsers
GET    /api/getUser?id=123
POST   /api/createUser
POST   /api/deleteUser?id=123
```

**URL 设计规范：**
- 使用小写字母
- 使用连字符 `-` 分隔单词（可选）
- 不要使用下划线
- 使用复数名词表示集合
- 嵌套资源限制在 2 层以内

```bash
# 好
GET /api/users/123/orders

# 不好（层级太深）
GET /api/users/123/orders/456/items
```

### 9.2 面试题2：POST 和 PUT 的区别？

**参考答案：**

| 特性 | POST | PUT |
|------|------|-----|
| 语义 | 创建资源 | 更新/替换资源 |
| 幂等性 | 非幂等 | 幂等 |
| URL | 集合资源 | 单个资源 |
| 重复请求 | 可能创建多个资源 | 结果相同 |
| 主体 | 客户端决定 URI | 客户端决定 URI |

**使用示例：**

```bash
# POST - 创建资源，服务器生成 ID
POST /api/users
{
    "username": "zhangsan",
    "email": "zhangsan@example.com"
}
# 响应：201 Created, Location: /api/users/123

# PUT - 更新/替换资源
PUT /api/users/123
{
    "username": "zhangsan_updated",
    "email": "zhangsan@example.com"
}
# 响应：200 OK

# PUT 也可以用于创建（如果客户端知道 ID）
PUT /api/users/123
{
    "id": 123,
    "username": "zhangsan",
    "email": "zhangsan@example.com"
}
# 响应：201 Created（如果不存在）或 200 OK（如果存在）
```

**PATCH vs PUT：**
- PUT：完整替换资源
- PATCH：部分更新资源

```bash
# PUT - 完整替换
PUT /api/users/123
{
    "username": "new_name"
}
# 结果：其他字段被设置为 null 或默认值

# PATCH - 部分更新
PATCH /api/users/123
{
    "username": "new_name"
}
# 结果：只更新 username，其他字段保持不变
```

### 9.3 面试题3：如何保证 API 的安全性？

**参考答案：**

**1. 认证与授权**

```javascript
// JWT 认证
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.substring(7);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// RBAC 权限控制
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};
```

**2. 输入验证**

```javascript
const Joi = require('joi');

const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    age: Joi.number().integer().min(0).max(150).optional()
});

app.post('/api/users', async (req, res) => {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // 处理请求
});
```

**3. HTTPS**

```javascript
// 生产环境强制 HTTPS
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.secure) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}
```

**4. 速率限制**

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests' }
});
app.use('/api', limiter);
```

**5. CORS**

```javascript
app.use(cors({
    origin: ['https://example.com'],
    credentials: true
}));
```

**6. 安全 Headers**

```javascript
const helmet = require('helmet');
app.use(helmet());
// 设置 CSP, X-Frame-Options, X-Content-Type-Options 等
```

### 9.4 面试题4：如何设计分页 API？

**参考答案：**

**方案一：基于页码的分页（适合数据量小）**

```bash
GET /api/users?page=2&per_page=20
```

```json
{
    "data": [...],
    "pagination": {
        "page": 2,
        "per_page": 20,
        "total": 100,
        "total_pages": 5,
        "links": {
            "first": "/api/users?page=1&per_page=20",
            "last": "/api/users?page=5&per_page=20",
            "prev": "/api/users?page=1&per_page=20",
            "next": "/api/users?page=3&per_page=20"
        }
    }
}
```

**方案二：基于游标的分页（适合大数据量）**

```bash
GET /api/users?limit=20&cursor=eyJpZCI6MTB9
```

```json
{
    "data": [...],
    "pagination": {
        "next_cursor": "eyJpZCI6MzB9",
        "has_more": true
    }
}
```

**实现代码：**

```javascript
// 基于游标的分页实现
class CursorPagination {
    static encode(data) {
        return Buffer.from(JSON.stringify(data)).toString('base64');
    }

    static decode(cursor) {
        try {
            return JSON.parse(Buffer.from(cursor, 'base64').toString());
        } catch {
            return null;
        }
    }
}

// 排序时使用游标字段
app.get('/api/users', async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const cursor = CursorPagination.decode(req.query.cursor);

    let query = db('users').orderBy('id', 'asc').limit(limit + 1);

    if (cursor) {
        query = query.where('id', '>', cursor.id);
    }

    const results = await query;
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, -1) : results;

    res.json({
        data,
        pagination: {
            next_cursor: hasMore
                ? CursorPagination.encode({ id: data[data.length - 1].id })
                : null,
            has_more: hasMore
        }
    });
});
```

### 9.5 面试题5：RESTful API 的优缺点？

**参考答案：**

**优点：**

1. **简单易用**
   - 使用 HTTP 方法，语义清晰
   - 学习成本低

2. **可读性好**
   - URL 即资源，语义明确
   - `GET /api/users/123` 一眼就知道是获取用户

3. **无状态**
   - 便于水平扩展
   - 负载均衡简单

4. **缓存友好**
   - 利用 HTTP 缓存机制
   - Last-Modified, ETag, Cache-Control

5. **跨平台**
   - 纯文本协议，任何客户端都能调用
   - JSON 格式通用性好

**缺点：**

1. **不支持推送**
   - 客户端需要轮询或使用 WebSocket

2. **URL 结构限制**
   - 复杂查询 URL 可能很长
   - 不适合二进制数据传输

3. **版本管理复杂**
   - 需要维护多版本 API
   - 资源关系复杂时 URL 可能很深

4. **安全性**
   - 需要额外实现认证授权
   - 无内置加密

**适用场景：**
- 公开 API
- 移动端后端
- 微服务间通信

**不适用场景：**
- 实时性要求高的应用（使用 WebSocket）
- 复杂的事务处理（考虑 GraphQL 或 gRPC）
- 二进制文件传输（使用专门协议）
