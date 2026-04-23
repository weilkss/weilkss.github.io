# WebWorker 面试指南

## 面试者视角回答

WebWorker 是浏览器提供的后台线程解决方案，用于解决 JavaScript 单线程执行计算密集型任务导致的页面卡顿问题。

---

## 为什么需要 WebWorker

### 主线程 vs 工作线程

```
主线程（UI 渲染）
├── 用户交互响应
├── 页面渲染
├── DOM 操作
├── 动画执行
└── 事件处理
        ↑ 问题：计算密集任务会导致卡顿

WebWorker（独立线程）
├── 计算密集任务
├── 大数据处理
├── 图像/视频处理
└── 网络请求预处理
        ✓ 不阻塞主线程
```

### 与 setTimeout 的区别

| 特性 | setTimeout | WebWorker |
|------|------------|-----------|
| 线程 | 主线程 | 独立线程 |
| 并行 | 否 | 是 |
| 适用场景 | 延迟执行 | CPU 密集计算 |
| 阻塞 UI | 可能 | 不阻塞 |
| 通信方式 | 回调 | postMessage |

---

## 使用方式

### 创建 Worker

```js
// main.js
const worker = new Worker('worker.js');

// 发送消息到 Worker
worker.postMessage({ type: 'compute', data: [1, 2, 3, 4, 5] });

// 接收 Worker 返回的消息
worker.onmessage = (e) => {
    console.log('计算结果:', e.data);
};

// 错误处理
worker.onerror = (e) => {
    console.error('Worker 错误:', e.message);
};

// 终止 Worker
worker.terminate();
```

### Worker 脚本 (worker.js)

```js
// self 表示 Worker 自身
self.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === 'compute') {
        const result = computeSum(data);
        self.postMessage(result);
    }
};

function computeSum(arr) {
    return arr.reduce((sum, n) => sum + n, 0);
}
```

### 专用 Worker vs 共享 Worker

| 特性 | 专用 Worker | 共享 Worker |
|------|-------------|-------------|
| 访问范围 | 创建它的脚本 | 同源的多个脚本 |
| 内存共享 | 否 | 是 |
| 端口通信 | 直接 | 需要 port |
| 适用场景 | 单页面计算 | 多页面通信 |

```js
// 共享 Worker
const sharedWorker = new SharedWorker('shared-worker.js');

sharedWorker.port.onmessage = (e) => {
    console.log('收到消息:', e.data);
};

sharedWorker.port.postMessage('Hello SharedWorker');
```

---

## 面试高频问题

### Q1：WebWorker 有哪些限制？

**答**：
1. **无法访问 DOM**：不能直接操作页面元素
2. **无法访问全局变量**：window、document、parent 不可用
3. **有限的对象**：可以使用 Navigator、Location、setTimeout 等
4. **通信开销**：数据需要序列化（postMessage）

```js
// Worker 中无法访问
self.window;        // undefined
self.document;      // undefined
self.parent;        // undefined

// Worker 中可以使用
self.navigator;    // 可用
self.location;      // 可用
self.setTimeout;    // 可用
self.XMLHttpRequest; // 可用
```

### Q2：如何实现 Worker 间的通信？

**答**：

**方式一：postMessage + MessageChannel**

```js
// main.js
const worker1 = new Worker('worker1.js');
const worker2 = new Worker('worker2.js');

// 创建通道
const channel = new MessageChannel();

// 将端口传给 worker1
worker1.postMessage({ type: 'port', port: channel.port1 }, [channel.port1]);
// 将端口传给 worker2
worker2.postMessage({ type: 'port', port: channel.port2 }, [channel.port2]);

// worker1.js
self.onmessage = (e) => {
    if (e.data.type === 'port') {
        const port = e.data.port;
        port.onmessage = (e) => console.log('来自 worker2:', e.data);

        // 发送消息给 worker2
        port.postMessage('Hello from worker1');
    }
};
```

**方式二：通过主线程中转**

```js
// main.js - 中转消息
worker1.onmessage = (e) => worker2.postMessage(e.data);
worker2.onmessage = (e) => worker1.postMessage(e.data);
```

### Q3：Worker 中如何处理循环计算避免阻塞？

**答**：

```js
// worker.js
self.onmessage = (e) => {
    const { data, chunkSize = 1000 } = e.data;
    const results = [];
    let processed = 0;

    function processChunk() {
        const chunk = data.slice(processed, processed + chunkSize);

        for (const item of chunk) {
            results.push(heavyComputation(item));
        }

        processed += chunk.length;

        // 报告进度
        self.postMessage({
            type: 'progress',
            progress: processed / data.length
        });

        if (processed < data.length) {
            // 让出线程，下一轮再继续
            setTimeout(processChunk, 0);
        } else {
            self.postMessage({ type: 'complete', results });
        }
    }

    processChunk();
};

function heavyComputation(item) {
    // 模拟计算
    return item * 2;
}
```

### Q4：Webpack 中如何配置 WebWorker？

**答**：

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    }
};

// 使用
import ComWorker from './compute.worker.js';

const worker = new ComWorker();
worker.postMessage(data);
```

```js
// 或使用原生语法（Webpack 5+）
// 无需配置，直接使用
const worker = new Worker(
    new URL('./compute.js', import.meta.url)
);
```

### Q5：WebWorker 的实际应用场景？

**答**：

1. **大数据排序/筛选**
```js
// 排序大数据集，不阻塞 UI
worker.postMessage({ type: 'sort', data: largeArray });
```

2. **图片处理**
```js
// 图片滤镜、压缩
worker.postMessage({ type: 'filter', imageData });
```

3. **加密解密**
```js
// 密码加密、区块链计算
worker.postMessage({ type: 'encrypt', password });
```

4. **PDF 生成**
```js
// 前端生成 PDF
worker.postMessage({ type: 'generatePdf', content });
```

5. **数据预取**
```js
// 在 Worker 中进行网络请求预处理
worker.postMessage({ type: 'fetch', url: '/api/data' });
```

### Q6：Worker 与主线程的数据传递方式？

**答**：

**共享内存（高级）**

```js
// 主线程
const buffer = new SharedArrayBuffer(1024);
const view = new Int32Array(buffer);

worker.postMessage({ buffer }, [buffer]);

// Worker
self.onmessage = (e) => {
    const view = new Int32Array(e.data.buffer);
    view[0] = 42; // 直接修改，主线程可见
};
```

** transferable 对象（高效转移，非复制）**

```js
// 主线程 -> Worker（转移所有权）
const arrayBuffer = new ArrayBuffer(1024);
worker.postMessage({ buffer: arrayBuffer }, [arrayBuffer]);
// 转移后主线程无法访问 arrayBuffer

// Worker -> 主线程
self.postMessage({ result: computedData }, [resultBuffer]);
```

---

## 完整示例：实时搜索防抖

```js
// search.worker.js
self.onmessage = (e) => {
    const { query, data } = e.data;

    // 模拟 API 请求延迟
    setTimeout(() => {
        const results = data.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        self.postMessage({ results });
    }, 300);
};

// main.js
const searchWorker = new Worker('search.worker.js');

searchInput.addEventListener('input', (e) => {
    searchWorker.postMessage({
        query: e.target.value,
        data: largeDataset
    });
});

searchWorker.onmessage = (e) => {
    renderResults(e.data.results);
};
```