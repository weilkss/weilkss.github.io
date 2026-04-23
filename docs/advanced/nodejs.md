# Node.js 面试指南

## 核心概念

Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，让 JavaScript 可以运行在服务器端。面试中经常考察对 Node.js 异步编程、事件驱动、性能优化等的理解。

---

## 异步编程

### Q1：Node.js 的事件循环机制？

**答**：

**事件循环执行顺序**：

```
┌─────────────────────────────────────────────────────────────┐
│                        Node.js 事件循环                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. timers          → setTimeout, setInterval 的回调       │
│   2. pending callbacks → I/O 回调                           │
│   3. idle, prepare    → 内部使用                            │
│   4. poll             → 获取新的 I/O 事件                   │
│   5. check            → setImmediate 的回调                 │
│   6. close callbacks  → 关闭事件的回调，如 socket.on('close')│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**代码示例**：

```javascript
console.log('1');  // 同步，立即执行

setTimeout(() => {
    console.log('2');  // timers 阶段
}, 0);

setImmediate(() => {
    console.log('3');  // check 阶段
});

process.nextTick(() => {
    console.log('4');  // nextTick，优先于其他异步
});

console.log('5');  // 同步，立即执行

// 输出顺序：1, 5, 4, 2, 3
```

**process.nextTick vs setImmediate**：

```javascript
// process.nextTick：在当前阶段结束后立即执行，优先级高于其他
process.nextTick(() => {
    console.log('nextTick');  // 先执行
});

setImmediate(() => {
    console.log('setImmediate');  // 后执行
});

// 适用场景
// - 需要在当前操作之后、事件循环继续之前执行
// - 错误处理需要尽早捕获
```

### Q2：Promise vs Callback vs async/await？

**答**：

| 模式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Callback | 简单直接 | 回调地狱 | 简单异步 |
| Promise | 链式调用 | 语法复杂 | 复杂异步 |
| async/await | 同步写法 | 错误处理 | 通用场景 |

**回调地狱示例**：

```javascript
// 回调地狱
fs.readFile('a.json', (err, data) => {
    if (err) throw err;
    fs.readFile('b.json', (err, data) => {
        if (err) throw err;
        fs.readFile('c.json', (err, data) => {
            if (err) throw err;
            // 更多嵌套...
        });
    });
});

// Promise 改进
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

readFilePromise('a.json')
    .then(() => readFilePromise('b.json'))
    .then(() => readFilePromise('c.json'))
    .catch(err => console.error(err));

// async/await 最佳方案
async function readAll() {
    try {
        const a = await readFilePromise('a.json');
        const b = await readFilePromise('b.json');
        const c = await readFilePromise('c.json');
        return [a, b, c];
    } catch (err) {
        console.error(err);
    }
}
```

### Q3：如何避免回调地狱？

**答**：

**1. async/await**

```javascript
async function fetchUserData(userId) {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts.map(p => p.id));
    return { user, posts, comments };
}
```

**2. Promise 组合**

```javascript
// 并行执行
const [user, posts, settings] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    getSettings(userId)
]);

// Promise.race - 超时处理
const result = await Promise.race([
    fetch('/api/data'),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
    )
]);
```

**3. 事件发布/订阅**

```javascript
const EventEmitter = require('events');

class DataService extends EventEmitter {
    async fetchAll() {
        try {
            const data = await this.fetchData();
            this.emit('success', data);
        } catch (err) {
            this.emit('error', err);
        }
    }
}

const service = new DataService();
service.on('success', (data) => console.log(data));
service.on('error', (err) => console.error(err));
```

**4. 异步库**

```javascript
const async = require('async');

// 串行执行
async.series([
    (cb) => { /* task 1 */ cb(null, result1); },
    (cb) => { /* task 2 */ cb(null, result2); }
], (err, results) => {});

// 并行执行
async.parallel([
    (cb) => fetch('url1', cb),
    (cb) => fetch('url2', cb)
], (err, results) => {});
```

---

## 核心模块

### Q4：常用核心模块有哪些？

**答**：

**1. fs - 文件系统**

```javascript
const fs = require('fs');
const fsPromises = fs.promises;

// 读取文件
const data = await fsPromises.readFile('/path/to/file', 'utf8');

// 写入文件
await fsPromises.writeFile('/path/to/file', 'content');

// 追加内容
await fsPromises.appendFile('/path/to/file', 'new content');

// 检查文件是否存在
const exists = await fsPromises.access('/path', fs.constants.F_OK);

// 创建目录
await fsPromises.mkdir('/path/to/dir', { recursive: true });

// 读取目录
const files = await fsPromises.readdir('/path/to/dir');

// 删除
await fsPromises.unlink('/path/to/file');
await fsPromises.rmdir('/path/to/dir');

// 复制
await fsPromises.copyFile('/src', '/dest');

// 监听文件变化
const watcher = fs.watch('/path/to/file', (eventType, filename) => {
    console.log(`File ${filename} changed: ${eventType}`);
});
```

**2. path - 路径处理**

```javascript
const path = require('path');

path.join('/foo', 'bar', 'baz');        // '/foo/bar/baz'
path.resolve('foo', '/bar');            // '/bar'（绝对路径）
path.dirname('/foo/bar/file.js');      // '/foo/bar'
path.basename('/foo/bar/file.js');     // 'file.js'
path.extname('/foo/bar/file.js');      // '.js'
path.parse('/foo/bar/file.js');        // { root, dir, base, ext, name }
path.join(__dirname, 'views');          // 当前文件目录下的 views
```

**3. http - HTTP 服务**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

// 请求对象
server.on('request', (req, res) => {
    console.log(req.method);      // GET, POST, etc.
    console.log(req.url);        // /path
    console.log(req.headers);    // 请求头
});

// 发起请求
const req = http.request({
    hostname: 'example.com',
    port: 80,
    path: '/api',
    method: 'GET'
}, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log(data));
});
req.end();
```

**4. events - 事件驱动**

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

emitter.on('event', (arg1, arg2) => {
    console.log('event fired', arg1, arg2);
});

emitter.once('once', () => {
    console.log('only once');
});

emitter.emit('event', 'arg1', 'arg2');
emitter.emit('once');
emitter.emit('once');  // 不会触发

// 错误处理
emitter.on('error', (err) => {
    console.error('Error:', err);
});
emitter.emit('error', new Error('Something went wrong'));
```

**5. stream - 流**

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// 读取流
const readStream = fs.createReadStream('input.txt', 'utf8');
readStream.on('data', (chunk) => console.log(chunk));
readStream.on('end', () => console.log('Done'));

// 写入流
const writeStream = fs.createWriteStream('output.txt');
writeStream.write('Hello\n');
writeStream.end('World\n');

// pipe
readStream.pipe(writeStream);

// Transform 示例
const upperCase = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

readStream.pipe(upperCase).pipe(writeStream);

// 处理大文件
const zlib = require('zlib');
fs.createReadStream('largefile.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('largefile.txt.gz'));
```

---

## 性能优化

### Q5：如何优化 Node.js 应用性能？

**答**：

**1. 集群模式**

```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();  // 重启
    });
} else {
    http.createServer((req, res) => {
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);
}
```

**2. 内存管理**

```javascript
// 查看内存使用
console.log(process.memoryUsage());
// { rss: 24MB, heapTotal: 8MB, heapUsed: 5MB, external: 1MB }

// 避免内存泄漏
// 1. 清理定时器
const timer = setInterval(() => {}, 1000);
clearInterval(timer);

// 2. 清理事件监听
emitter.off('event', handler);

// 3. 避免全局变量
// 使用模块级变量而非全局变量

// 4. 流处理大文件
const stream = fs.createReadStream('largefile');
stream.on('data', processData);
```

**3. CPU 密集型处理**

```javascript
// 使用 Worker Threads
const { Worker } = require('worker_threads');

function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

// worker.js
const { parentPort, workerData } = require('worker_threads');
const result = heavyComputation(workerData);
parentPort.postMessage(result);
```

**4. 缓存**

```javascript
// 内存缓存
const cache = new Map();

function getWithCache(key, computeFn, ttl = 60000) {
    if (cache.has(key)) {
        const { value, expire } = cache.get(key);
        if (Date.now() < expire) return Promise.resolve(value);
    }
    return computeFn().then(value => {
        cache.set(key, { value, expire: Date.now() + ttl });
        return value;
    });
}

// Redis 缓存
const redis = require('redis');
const client = redis.createClient();

async function cacheGet(key) {
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
}

async function cacheSet(key, value, ttl = 3600) {
    await client.setex(key, ttl, JSON.stringify(value));
}
```

### Q6：Node.js 如何处理高并发？

**答**：

**1. 事件驱动模型**

```javascript
// 单线程 + 事件循环
// 适合 I/O 密集型，不适合 CPU 密集型

// 示例：10000 个并发请求
const server = http.createServer((req, res) => {
    // 异步 I/O，不会阻塞
    fs.readFile('./data.json', (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end('Error');
            return;
        }
        res.end(data);
    });
});
```

**2. 非阻塞 I/O**

```javascript
// 阻塞（错误）
const data = fs.readFileSync('./file.txt');

// 非阻塞（正确）
fs.readFile('./file.txt', (err, data) => {
    console.log(data);
});

// Promise 风格
const data = await fs.promises.readFile('./file.txt');
```

**3. 流处理**

```javascript
// 不适合大文件
const file = fs.readFileSync('./largefile.zip');  // 可能 OOM

// 适合大文件
const readStream = fs.createReadStream('./largefile.zip', {
    highWaterMark: 64 * 1024  // 64KB 缓冲区
});

readStream.pipe(unzip.Extract({ path: './output' }));
```

**4. 连接池**

```javascript
// 数据库连接池
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 使用
const [rows] = await pool.query('SELECT * FROM users');
```

---

## 错误处理

### Q7：Node.js 错误处理最佳实践？

**答**：

**1. 同步错误处理**

```javascript
try {
    const data = JSON.parse(userInput);
} catch (err) {
    console.error('Parse error:', err.message);
}
```

**2. 异步错误处理**

```javascript
// Promise
fetchData()
    .then(data => console.log(data))
    .catch(err => console.error(err));

// async/await
async function getData() {
    try {
        const data = await fetchData();
        return data;
    } catch (err) {
        console.error(err);
        throw err;  // 重新抛出或返回默认值
    }
}
```

**3. 未捕获异常**

```javascript
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // 记录日志
    logger.error(err);
    // 优雅关闭
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

**4. Express 错误处理中间件**

```javascript
// 同步错误
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// 异步错误
app.get('/async-error', async (req, res, next) => {
    try {
        await someAsyncOperation();
    } catch (err) {
        next(err);
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
```

### Q8：如何保证 Node.js 服务稳定性？

**答**：

**1. 进程管理**

```javascript
// PM2 配置 ecosystem.config.js
module.exports = {
    apps: [{
        name: 'my-app',
        script: './server.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production'
        },
        error_file: './logs/error.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        max_memory_restart: '1G',
        autorestart: true,
        watch: false,
        max_restarts: 10,
        min_uptime: '10s'
    }]
};
```

**2. 健康检查**

```javascript
const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
};

app.get('/health', (req, res) => {
    res.status(200).json(healthCheck);
});
```

**3. 优雅关闭**

```javascript
const server = app.listen(3000, () => {
    console.log('Server started');
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('HTTP server closed');
        // 关闭数据库连接
        db.end(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});
```

**4. 限流熔断**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

app.use('/api', limiter);

// 熔断器
const CircuitBreaker = require('opossum');

const breaker = new CircuitBreaker(asyncFunction, {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
});

breaker.fire(params).then(console.log).catch(console.error);
```

---

## 实战应用

### Q9：如何设计一个 Express 应用？

**答**：

**项目结构**：

```
src/
├── app.js              # Express 应用入口
├── server.js           # 服务器启动
├── config/             # 配置文件
│   └── index.js
├── routes/             # 路由
│   ├── index.js
│   └── api/
│       ├── users.js
│       └── posts.js
├── controllers/        # 控制器
│   ├── userController.js
│   └── postController.js
├── services/           # 业务逻辑
│   ├── userService.js
│   └── postService.js
├── models/             # 数据模型
│   ├── User.js
│   └── Post.js
├── middleware/         # 中间件
│   ├── auth.js
│   ├── errorHandler.js
│   └── validator.js
├── utils/              # 工具函数
│   └── logger.js
└── db/                 # 数据库
    ├── connection.js
    └── migrations/
```

**app.js 示例**：

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
    origin: 'https://example.com',
    credentials: true
}));

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// API 路由
app.use('/api', routes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use(errorHandler);

module.exports = app;
```

**路由设计**：

```javascript
// routes/api/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, validator.createUser, userController.createUser);
router.put('/:id', auth, validator.updateUser, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
```

### Q10：Node.js 如何连接数据库？

**答**：

**MongoDB (Mongoose)**：

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

const User = mongoose.model('User', userSchema);

// 使用
async function findUsers() {
    const users = await User.find({ age: { $gte: 18 } })
        .select('name email')
        .sort({ createdAt: -1 })
        .limit(10);
    return users;
}
```

**MySQL (mysql2)**：

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 查询
async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

// 使用
async function getUsers() {
    const users = await query(
        'SELECT * FROM users WHERE age >= ? ORDER BY created_at DESC LIMIT ?',
        [18, 10]
    );
    return users;
}

// 事务
async function transferMoney(fromId, toId, amount) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute(
            'UPDATE accounts SET balance = balance - ? WHERE id = ?',
            [amount, fromId]
        );
        await connection.execute(
            'UPDATE accounts SET balance = balance + ? WHERE id = ?',
            [amount, toId]
        );
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}
```

---

## 面试综合问题

### Q11：Node.js 和 Deno 的区别？

**答**：

| 特性 | Node.js | Deno |
|------|---------|------|
| 创始人 | Ryan Dahl | Ryan Dahl（新一代） |
| 发布时间 | 2009 | 2018 |
| 运行时代码 | C++ | Rust |
| 默认包管理 | npm | 内置（URL 加载） |
| 安全 | 默认全权限 | 沙箱，默认安全 |
| TypeScript | 需要配置 | 原生支持 |
| 模块格式 | CommonJS/ESM | 只有 ESM |
| 核心 API | 稳定 | 发展中 |

```javascript
// Deno 示例
import { serve } from "https://deno.land/std/http/server.ts";

serve((req) => new Response("Hello World"), { port: 3000 });

// Deno 安全权限
// deno run --allow-net --allow-read server.ts
```

### Q12：Node.js 如何做日志管理？

**答**：

**日志级别**：

```javascript
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const log = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
        timestamp,
        level,
        message,
        ...meta
    }));
};

// 使用
log('info', 'User logged in', { userId: 123 });
log('error', 'Database connection failed', { error: err.message });
```

**生产环境日志方案**：

```javascript
// Winston
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Morgan（HTTP 请求日志）
const morgan = require('morgan');
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.http(message.trim())
    }
}));
```
