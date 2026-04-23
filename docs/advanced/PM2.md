# PM2 面试指南

## 一、PM2 基础

### 1.1 什么是 PM2？

PM2（Process Manager 2）是一个Node.js进程管理器，用于管理Node.js应用程序的生产环境，提供进程守护、负载均衡、自动重启等功能。

**核心功能：**
- 进程守护：应用程序崩溃后自动重启
- 负载均衡：支持集群模式
- 日志管理：统一的日志输出和管理
- 零停机重载：热更新应用程序
- 监控：实时监控应用程序状态

### 1.2 安装与基本使用

```bash
# 全局安装
npm install -g pm2

# 启动应用
pm2 start app.js

# 启动带参数
pm2 start app.js --name my-app --watch --max-memory-restart 500M

# 查看进程列表
pm2 list
pm2 status
pm2 jlist  # JSON格式

# 查看详细信息
pm2 show my-app

# 查看日志
pm2 logs my-app
pm2 logs my-app --lines 100 --nostream

# 重启
pm2 restart my-app

# 停止
pm2 stop my-app

# 删除
pm2 delete my-app

# 集群模式启动
pm2 start app.js -i 4  # 启动4个实例
```

---

## 二、进程管理

### 2.1 ecosystem 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    args: 'arg1 arg2',           // 启动参数
    cwd: './',                    // 工作目录
    instances: 4,                 // 实例数量
    exec_mode: 'cluster',         // 模式：cluster 或 fork
    watch: true,                  // 监听文件变化
    ignore_watch: ['node_modules', 'logs'],  // 忽略的文件
    max_memory_restart: '500M',   // 超过内存重启
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    listen_timeout: 8000,
    kill_timeout: 5000,
    post_update: ['npm install'],  // 更新后执行
    prestart: ['npm install'],
    postmortem: false
  }]
};
```

### 2.2 启动配置

```bash
# 使用配置文件
pm2 start ecosystem.config.js

# 指定环境
pm2 start ecosystem.config.js --env production

# 启动生产模式
NODE_ENV=production pm2 start app.js

# 启动并等待启动完成
pm2 start app.js --wait-ready

# 带gracefulShutdown
pm2 start app.js --shutdown-with-message
```

### 2.3 进程状态与控制

```bash
# 进程状态说明
# status: online/running - 运行中
# status: stopped        - 已停止
# status: errored       - 启动出错
# status: launchd       - 正在启动
# status: waiting_restart - 等待重启

# 暂停进程（保持内存状态）
pm2 pause my-app

# 恢复进程
pm2 resume my-app

# 优雅重载（保留请求）
pm2 reload my-app

# 强制重载
pm2 reload my-app --force

# 优雅关闭
pm2 stop my-app --shutdown-with-message
```

---

## 三、集群模式

### 3.1 集群模式原理

```bash
# 集群模式使用 Node.js cluster 模块
# 自动在多个 CPU 核心上创建应用实例
# 自动实现负载均衡

# 启动4个实例
pm2 start app.js -i 4

# 启动最大实例数
pm2 start app.js -i max

# 查看集群状态
pm2 list
# 输出：
# ┌────┬──────────┬────────┬──────┬──────────┬──────────────┬──────────┐
# │ id │ name     │  mode  │ ↺   │ status   │ cpu          │ memory   │
# ├────┼──────────┼────────┼──────┼──────────┼──────────────┼──────────┤
# │ 0  │ my-app   │ cluster│ 12  │ online   │ 0.3%         │ 120MB    │
# │ 1  │ my-app   │ cluster│ 12  │ online   │ 0.2%         │ 118MB    │
# │ 2  │ my-app   │ cluster│ 12  │ online   │ 0.3%         │ 122MB    │
# │ 3  │ my-app   │ cluster│ 12  │ online   │ 0.2%         │ 119MB    │
# └────┴──────────┴────────┴──────┴──────────┴──────────────┴──────────┘
```

### 3.2 负载均衡算法

```javascript
// PM2 默认使用 round-robin 算法
// 请求依次分配给每个实例

// app.js - 启用集群通信
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // 在集群中广播消息
    process.send({ type: 'request', url: req.url });

    res.end(`handled by process ${process.pid}`);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}, pid: ${process.pid}`);

    // 通知主进程已准备就绪
    process.send && process.send('ready');
});
```

### 3.3 实例管理

```bash
# 增加实例
pm2 scale my-app +3

# 扩展到指定数量
pm2 scale my-app 8

# 缩减到指定数量
pm2 scale my-app 2

# 热更新集群
pm2 reload my-app

# 零停机重载
pm2 reload my-app --update-env
```

---

## 四、日志管理

### 4.1 日志配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',      // 合并日志
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,                      // 多实例合并日志
    enforce: false,                         // 一个实例失败不影响其他
    instances: 4
  }]
};
```

### 4.2 日志操作

```bash
# 查看实时日志
pm2 logs

# 查看指定应用日志
pm2 logs my-app

# 查看最后100行
pm2 logs my-app --lines 100

# 清空日志
pm2 flush

# 监控日志输出
pm2 logs --raw

# 导出日志
pm2 logs --out my-app > my-app.log
```

### 4.3 日志分割

```bash
# 安装日志分割插件
npm install -g pm2-logrotate

# 配置
pm2 set pm2-logrotate:max_size 10M        # 单个文件大小
pm2 set pm2-logrotate:retain 30           # 保留文件数量
pm2 set pm2-logrotate:compress true      # 压缩
pm2 set pm2-logrotate:date_format 'YYYY-MM-DD'
pm2 set pm2-logrotate:workerInterval 1000  # 检查间隔(ms)

# 启动
pm2 install pm2-logrotate
```

---

## 五、监控与性能

### 5.1 内置监控

```bash
# 实时监控面板
pm2 monit

# 显示内容：
# - CPU/Memory 使用率
# - 在线进程数
# - 重启次数
# - 内存占用
# - 循环重启检测

# Keymetrics 监控
# 基于 PM2 Plus 的在线监控服务
pm2 link <keymetrics-id> <keymetrics-secret> <public-name>
```

### 5.2 keymetrics 在线监控

```bash
# 注册 https://keymetrics.io/
# 创建 bucket 获取密钥

# 连接本地应用到 keymetrics
pm2 link <secret> <public>

# 或者在配置文件中
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    pmx: true,
    monitoring: {
      keymetrics: {
        bucket: '<bucket-id>',
        secret: '<secret>'
      }
    }
  }]
};
```

### 5.3 性能指标

```javascript
// 在应用中添加自定义指标
const PMX = require('pmx');

const metrics = PMX.metrics();

// 计数器
const httpRequests = metrics.counter({
    name: 'HTTP Requests',
    agg_type: 'sum'
});

// Gauges
const cpuUsage = metrics.gauge({
    name: 'CPU Usage',
    agg_type: 'avg'
});

// Histogram
const responseTime = metrics.histogram({
    name: 'Response Time',
    measurement: 'mean'
});

// 使用
app.use((req, res, next) => {
    httpRequests.inc();
    const start = Date.now();

    res.on('finish', () => {
        responseTime.observe(Date.now() - start);
    });

    next();
});
```

---

## 六、自动重启策略

### 6.1 重启配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',

    // 自动重启配置
    autorestart: true,              // 崩溃后自动重启
    max_restarts: 10,               // 最大重启次数
    min_uptime: '10s',              // 最小运行时间才算正常
    restart_delay: 1000,            // 重启延迟(ms)
    exp_backoff_restart_delay: 100, // 指数退避重启延迟
    max_memory_restart: '500M',     // 内存超限重启

    // 异常检测
    watch: false,
    max_pmem_restart: 200,         // 最大内存
    max_cpu_restart: 50,            // 最大CPU使用率%

    // 等待信号
    shutdown_with_message: true
  }]
};
```

### 6.2 优雅关闭

```javascript
// app.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello');
});

server.listen(3000);

// 优雅关闭处理
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing gracefully');

    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

    // 超时强制关闭
    setTimeout(() => {
        console.log('Force shutdown');
        process.exit(1);
    }, 10000);
});

process.on('SIGINT', () => {
    console.log('SIGINT received');
    process.exit(0);
});

// PM2 优雅启动通知
process.send('ready');
```

### 6.3 异常处理

```javascript
// 捕获未处理的异常
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // 记录日志
    // 发送告警
    // 优雅退出
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 使用 domain 模块（已废弃，不推荐）
```

---

## 七、部署与CI/CD

### 7.1 多环境部署

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: './src/server.js',
    env: {
      COMMON_VARIABLE: 'true',
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 8080
    }
  }]
};
```

```bash
# 启动不同环境
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env staging
```

### 7.2 部署脚本

```javascript
// deploy.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './src/server.js',
    deploy: {
      production: {
        user: 'deploy',
        host: 'server1.com',
        ref: 'origin/master',
        repo: 'git@github.com:user/repo.git',
        path: '/var/www/my-app',
        'pre-deploy-local': 'echo "Before deploy"',
        'post-deploy': 'npm install && pm2 restart my-app --update-env',
        'pre-setup': ''
      },
      staging: {
        user: 'deploy',
        host: 'staging-server.com',
        ref: 'origin/develop',
        repo: 'git@github.com:user/repo.git',
        path: '/var/www/staging'
      }
    }
  }]
};
```

```bash
# 初始化部署
pm2 deploy production setup

# 部署
pm2 deploy production

# 回滚
pm2 deploy production revert
```

### 7.3 Docker 集成

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# PM2 runtime
RUN npm install pm2 -g

# 启动
CMD ["pm2-runtime", "ecosystem.config.js"]
```

```bash
# docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

---

## 八、常见问题与解决方案

### 8.1 内存泄漏

```bash
# 监控内存使用
pm2 monit

# 开启内存限制重启
pm2 start app.js --max-memory-restart 500M

# 定期重启
pm2 start app.js --exp-backoff-restart-delay=100 --max-restarts=10 --restart-delay=5000
```

### 8.2 CPU 占用过高

```bash
# 定位问题
pm2 show my-app

# 查看CPU占用
top -p $(pgrep -f "pm2")

# 生成dump文件
pm2 sendSignal SIGUSR2 my-app

# 使用 heapdump 分析
npm install heapdump
```

```javascript
// 在应用中添加 heapdump
const heapdump = require('heapdump');

process.on('SIGUSR2', () => {
    heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot', (err, filename) => {
        console.log('dump written to', filename);
    });
});
```

### 8.3 日志过大

```bash
# 配置日志轮转
pm2 install pm2-logrotate

# 设置
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# 手动清空
pm2 flush
```

---

## 九、面试题

### 9.1 面试题1：PM2 的核心功能？

**参考答案：**

PM2 是一个 Node.js 进程管理器，其核心功能包括：

**1. 进程守护**
- 自动重启崩溃的进程
- 监控进程内存和CPU使用情况
- 设置最大重启次数和重启延迟

**2. 负载均衡**
- 支持集群模式，在多核CPU上运行多个实例
- 内置 round-robin 负载均衡算法
- 支持动态扩展/缩减实例数量

**3. 零停机重载**
- 使用 `pm2 reload` 实现优雅重载
- 保持请求连接，直到新实例准备就绪

**4. 日志管理**
- 统一管理 stdout 和 stderr 日志
- 支持日志轮转
- 实时查看日志输出

**5. 监控**
- 实时显示 CPU/内存使用情况
- 支持 keymetrics 在线监控
- 自定义指标收集

**实际应用场景：**
```bash
# 启动生产服务
pm2 start ecosystem.config.js --env production

# 监控
pm2 monit

# 动态扩展
pm2 scale my-app +2
```

### 9.2 面试题2：PM2 集群模式与 Fork 模式的区别？

**参考答案：**

| 特性 | Fork 模式 | Cluster 模式 |
|------|----------|--------------|
| 进程数 | 1 | 多个 |
| CPU 利用 | 单核 | 多核 |
| 资源共享 | 不共享 | 共享（通过 IPC） |
| 状态管理 | 简单 | 需考虑状态同步 |
| 适用场景 | 后台任务、定时任务 | HTTP 服务器 |
| 内存占用 | 独立 | 独立 |
| 负载均衡 | 不支持 | round-robin |

**Fork 模式：**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'worker',
    script: './worker.js',
    exec_mode: 'fork',  // 默认
    instances: 1
  }]
};
```

**Cluster 模式：**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: './server.js',
    exec_mode: 'cluster',
    instances: 4  // CPU 核心数
  }]
};
```

**选择建议：**
- HTTP/TCP 服务器：使用 Cluster 模式
- 后台任务/定时任务：使用 Fork 模式
- 数据库连接池：每个实例独立连接

### 9.3 面试题3：如何实现 PM2 的零停机部署？

**参考答案：**

**步骤一：配置 ecosystem**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './server.js',
    exec_mode: 'cluster',
    instances: 4,
    listen_timeout: 5000,     // 等待启动超时
    shutdown_with_message: true
  }]
};
```

**步骤二：实现优雅关闭**

```javascript
// server.js
const http = require('http');
const server = http.createServer((req, res) => {
    res.end('Hello');
});

server.listen(3000, () => {
    console.log('Server started');
    // 通知 PM2 已就绪
    process.send('ready');
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
```

**步骤三：部署脚本**

```bash
#!/bin/bash
# deploy.sh

# 1. 拉取代码
git pull origin master

# 2. 安装依赖
npm install

# 3. 重载应用（不中断服务）
pm2 reload my-app

# 4. 如果失败，回滚
if [ $? -ne 0 ]; then
    pm2 revert my-app
fi
```

**重载 vs 重启：**

| 操作 | 说明 | 停机时间 |
|------|------|----------|
| pm2 reload | 优雅重载，逐个替换实例 | 无 |
| pm2 restart | 停止所有再启动 | 有 |
| pm2 scale | 调整实例数量 | 最小 |

### 9.4 面试题4：PM2 的自动重启机制？

**参考答案：**

**重启触发条件：**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',

    // 内存超限重启
    max_memory_restart: '500M',

    // 异常重启
    max_restarts: 10,           // 最大重启次数
    min_uptime: '10s',          // 最小运行时间
    exp_backoff_restart_delay: 100,  // 指数退避延迟

    // 崩溃检测
    autorestart: true,
    watch: false
  }]
};
```

**重启流程：**

```
应用崩溃
    ↓
PM2 检测到进程退出
    ↓
检查是否符合重启条件
    ↓ (是)
等待 restart_delay
    ↓
重启进程
    ↓
检查是否达到 max_restarts
    ↓ (达到)
停止重启，进入 errored 状态
```

**指数退避策略：**

```javascript
// 配置
exp_backoff_restart_delay: 100  // 起始延迟 100ms

// 重启延迟计算：
// 第1次: 100ms
// 第2次: 200ms
// 第3次: 400ms
// ...
// 最大延迟: 1分钟
```

**防止循环重启：**

```javascript
// 配置
max_restarts: 10,        // 10分钟内最多重启10次
min_uptime: '10s',      // 运行超过10秒才算成功

// 超过限制后，进程进入 errored 状态
// 需要手动干预：pm2 restart my-app
```

### 9.5 面试题5：PM2 在生产环境中的最佳实践？

**参考答案：**

**1. 配置管理**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'production-api',
    script: './src/index.js',
    cwd: '/var/www/app',
    instances: 0,  // 0 = CPU核心数
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/error.log',
    out_file: '/var/log/pm2/out.log',
    log_file: '/var/log/pm2/combined.log',
    time: true,
    autorestart: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

**2. 日志管理**

```bash
# 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# 定期清理
pm2 flush  # 清空日志
```

**3. 监控告警**

```javascript
// 使用 pm2-cloud 或自建监控
const PMX = require('pmx');

const alert = PMX.alert({
    message: 'High memory usage detected',
    value: process.memoryUsage().heapUsed
});
```

**4. 安全配置**

```bash
# 禁用 SSH 命令注入
# 在 /etc/ssh/sshd_config 中设置
# PermitUserEnvironment no

# 使用秘密密钥
pm2 start app.js --secret 'my-secret-key'
```

**5. 多环境部署**

```bash
# 开发
pm2 start ecosystem.config.js --env development

# 测试
pm2 start ecosystem.config.js --env staging

# 生产
pm2 start ecosystem.config.js --env production
```

**6. 备份与恢复**

```bash
# 导出进程列表
pm2 save

# 保存的进程列表在 ~/.pm2/dump.pm2

# 恢复
pm2 resurrect

# 开机自启
pm2 startup  # 根据系统生成启动脚本
pm2 save  # 保存当前状态
```

**7. 容器中使用**

```dockerfile
FROM node:18-alpine
RUN npm install -g pm2
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]
```
