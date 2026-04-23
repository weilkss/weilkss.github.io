# WebSocket 面试指南

## 面试者视角回答

WebSocket 是一种在单个 TCP 连接上提供全双工通信的协议，是实现实时应用的核心技术。

---

## WebSocket vs HTTP

| 特性       | WebSocket      | HTTP                |
| ---------- | -------------- | ------------------- |
| 连接方向   | 全双工（双向） | 半双工（请求-响应） |
| 连接方式   | 持久连接       | 短连接              |
| 协议       | ws:// / wss:// | http:// / https://  |
| 头部开销   | 首次连接后极小 | 每次请求都要带头部  |
| 服务器推送 | 支持           | 不支持（需轮询）    |
| 实时性     | 真正实时       | 依赖轮询间隔        |

---

## 核心原理

### 建立连接过程

```
客户端                      服务器
  |                          |
  |--- HTTP 请求(Upgrade) --->|
  |                          |
  |<-- HTTP 响应(101 Switching)-|
  |                          |
  |======= TCP 连接建立 =======|
  |                          |
  |<====== WebSocket 通信 ===>|
  |                          |
```

### 握手请求/响应

```http
# 请求头
GET /ws HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# 响应头
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

---

## 使用方式

### 客户端 API

```js
// 创建连接
const ws = new WebSocket("ws://localhost:8080/ws");

// 连接建立
ws.onopen = () => {
    console.log("连接已建立");
    ws.send("Hello Server");
};

// 接收消息
ws.onmessage = (event) => {
    console.log("收到消息:", event.data);
};

// 连接关闭
ws.onclose = () => {
    console.log("连接已关闭");
};

// 错误处理
ws.onerror = (error) => {
    console.error("WebSocket 错误:", error);
};

// 发送消息
ws.send(JSON.stringify({ type: "message", content: "Hello" }));

// 关闭连接
ws.close();
```

### 服务端实现（Node.js）

```js
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket Server");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
    console.log("客户端连接");

    // 广播消息给所有客户端
    ws.on("message", (message) => {
        console.log("收到:", message.toString());

        // 广播给所有客户端
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("客户端断开");
    });

    // 发送欢迎消息
    ws.send("Welcome to WebSocket!");
});

server.listen(8080);
```

---

## 面试高频问题

### Q1：WebSocket 如何实现断线重连？

**答**：

```js
class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.reconnectInterval = 1000;
        this.maxReconnectInterval = 30000;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log("连接成功");
            this.reconnectInterval = 1000;
        };

        this.ws.onclose = () => {
            console.log("连接断开，准备重连");
            setTimeout(() => {
                this.reconnectInterval = Math.min(this.reconnectInterval * 2, this.maxReconnectInterval);
                this.connect();
            }, this.reconnectInterval);
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket 错误:", error);
        };
    }

    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}
```

### Q2：WebSocket 心跳机制如何实现？

**答**：

```js
class Heartbeat {
    constructor(ws, interval = 30000) {
        this.ws = ws;
        this.interval = interval;
        this.timer = null;
    }

    start() {
        this.timer = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: "ping" }));
            }
        }, this.interval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}

// 服务端处理
wss.on("connection", (ws) => {
    const heartbeat = new Heartbeat(ws);

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
        }
    });

    ws.on("close", () => heartbeat.stop());
});
```

### Q3：如何处理消息队列避免消息丢失？

**答**：

```js
class MessageQueue {
    constructor(ws) {
        this.ws = ws;
        this.queue = [];
        this.sending = false;
    }

    send(data) {
        this.queue.push(data);
        this.processQueue();
    }

    processQueue() {
        if (this.sending || this.queue.length === 0) return;

        if (this.ws.readyState !== WebSocket.OPEN) {
            return; // 等待重连后自动发送
        }

        this.sending = true;
        const data = this.queue.shift();
        this.ws.send(JSON.stringify(data));

        this.sending = false;
        this.processQueue();
    }
}
```

### Q4：WebSocket 和 Socket.IO 的区别？

**答**：

| 特性     | WebSocket  | Socket.IO             |
| -------- | ---------- | --------------------- |
| 协议     | 原生协议   | 基于 WebSocket + 轮询 |
| 兼容性   | 现代浏览器 | 所有浏览器            |
| 自动重连 | 无         | 内置                  |
| 心跳机制 | 无         | 内置                  |
| 消息确认 | 无         | 支持                  |
| 命名空间 | 无         | 支持                  |
| 房间     | 无         | 支持                  |

### Q5：WebSocket 的使用场景？

**答**：

- 实时聊天应用
- 在线协作工具（多人编辑）
- 实时通知系统
- 股票/加密货币行情
- 游戏中的实时对战
- IoT 设备状态监控

### Q6：WebSocket 安全如何处理？

**答**：

1. **使用 WSS（WebSocket Secure）**

```js
// 生产环境必须使用 wss
const ws = new WebSocket("wss://secure.example.com/ws");
```

2. **身份验证**

```js
// 通过 URL 参数或首次消息携带 token
const ws = new WebSocket("wss://example.com/ws?token=" + token);

// 或在连接建立后立即发送认证消息
ws.onopen = () => {
    ws.send(JSON.stringify({ type: "auth", token }));
};
```

3. **输入校验**

```js
ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        // 校验数据格式和来源
        if (!isValidMessage(data)) {
            return;
        }
    } catch (e) {
        console.error("消息解析失败");
    }
};
```

---

## 实际应用示例

### 聊天室

```js
// 客户端
class ChatRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.ws = new WebSocket("wss://chat.example.com");

        this.ws.onopen = () => {
            this.send({ type: "join", room: this.roomId });
        };

        this.ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            this.handleMessage(msg);
        };
    }

    send(message) {
        this.ws.send(JSON.stringify(message));
    }

    handleMessage(msg) {
        switch (msg.type) {
            case "message":
                this.displayMessage(msg);
                break;
            case "user_join":
                this.showNotification(`${msg.username} 加入了`);
                break;
        }
    }

    displayMessage(msg) {
        console.log(`${msg.username}: ${msg.content}`);
    }

    showNotification(text) {
        console.log(`[通知] ${text}`);
    }
}
```
