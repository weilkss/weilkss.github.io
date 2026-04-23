# WebRTC 面试指南

## 面试者视角回答

WebRTC（Web Real-Time Communication）是一种实现浏览器实时通信的技术，无需安装插件即可实现点对点的音频、视频和数据传输。

---

## 核心概念

### 1. WebRTC 架构

WebRTC 架构分为三层：

```
┌─────────────────────────────────────────┐
│           Web API 层                     │
│  (getUserMedia, RTCPeerConnection, etc) │
├─────────────────────────────────────────┤
│         WebRTC C++ API 层               │
│    (Session Management, CODEC, etc)     │
├─────────────────────────────────────────┤
│      Transport/Security 层              │
│    (SRTP, DTLS, ICE, STUN, TURN)        │
└─────────────────────────────────────────┘
```

### 2. 核心 API

| API                 | 作用                     |
| ------------------- | ------------------------ |
| `getUserMedia`      | 获取用户的摄像头和麦克风 |
| `RTCPeerConnection` | 建立点对点连接           |
| `RTCDataChannel`    | 传输任意数据             |

### 3. 信令服务器

WebRTC 本身不包含信令机制，需要服务器协助交换会话描述协议（SDP）和候选网络信息（ICE Candidate）。

---

## 通信流程

### 完整通信流程图

```
┌─────────┐                              ┌─────────┐
│  浏览器A │                              │  浏览器B │
└────┬────┘                              └────┬────┘
     │                                        │
     │  1. 获取本地媒体流                       │
     │  getUserMedia()                        │
     │ ───────>                                │
     │                                        │
     │  2. 创建 RTCPeerConnection             │
     │                                        │
     │  3. 添加媒体轨道                         │
     │  addTrack()                            │
     │                                        │
     │  4. 创建 Offer (SDP)                   │
     │ ─────────────────────────────────────>│
     │                                        │
     │  5. 创建 Answer (SDP)                  │
     │ <───────────────────────────────────── │
     │                                        │
     │  6. 交换 ICE Candidates                 │
     │ <====================================> │
     │                                        │
     │  7. 建立 P2P 连接                       │
     │                                        │
     │  8. 传输媒体流                           │
     │ <====================================> │
```

---

## 代码实现

### 1. 获取本地媒体流

```javascript
async function getLocalStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });
        return stream;
    } catch (error) {
        console.error("获取媒体流失败:", error);
        throw error;
    }
}
```

### 2. 创建点对点连接

```javascript
const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
            urls: "turn:your-turn-server.com",
            username: "user",
            credential: "password",
        },
    ],
};

const pc = new RTCPeerConnection(config);

// 添加本地媒体轨道
async function addLocalStreamToConnection(stream) {
    stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
    });
}

// 监听远程轨道
pc.ontrack = (event) => {
    const [remoteStream] = event.streams;
    const video = document.querySelector("#remoteVideo");
    video.srcObject = remoteStream;
};

// ICE candidate 处理
pc.onicecandidate = (event) => {
    if (event.candidate) {
        sendIceCandidateToPeer(event.candidate);
    }
};
```

### 3. 创建 Offer 和 Answer

```javascript
// 创建 Offer
async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
    });
    await pc.setLocalDescription(offer);
    return offer;
}

// 创建 Answer
async function createAnswer(offer) {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
}
```

### 4. DataChannel 数据传输

```javascript
// 发送方
const dataChannel = pc.createDataChannel("chat");
dataChannel.onopen = () => {
    console.log("DataChannel 已打开");
    dataChannel.send("Hello, WebRTC!");
};

// 接收方
pc.ondatachannel = (event) => {
    const receiveChannel = event.channel;
    receiveChannel.onmessage = (event) => {
        console.log("收到消息:", event.data);
    };
};
```

---

## ICE 候选类型

| 类型  | 说明                                  | 可靠性 |
| ----- | ------------------------------------- | ------ |
| host  | 本地网络候选                          | 最高   |
| srflx | 端口反射（通过 STUN 获取公网IP:Port） | 中等   |
| prflx | \_peer reflexive（对称型 NAT）        | 较少见 |
| relay | 中继（通过 TURN 服务器转发）          | 最低   |

### ICE 候选优先级

```
host > srflx > prflx > relay
```

通常的连接策略：

1. 首先尝试直连（host）
2. 如果不同网络，尝试 STUN 获取公网地址
3. 如果被 NAT 限制，使用 TURN 中继

---

## NAT 穿透技术

### 1. STUN（Session Traversal Utilities for NAT）

- 允许客户端发现自己的公网 IP 和端口
- 帮助建立直接连接
- 无法穿透对称型 NAT

### 2. TURN（Traversal Using Relays around NAT）

- 作为中继服务器转发数据
- 穿透所有 NAT 类型
- 但会增加延迟和服务器负担

### 3. ICE（Interactive Connectivity Establishment）

- 整合 STUN 和 TURN
- 尝试所有候选对
- 选择最优路径

```javascript
const iceTransportPolicy = {
    all: "尝试所有候选",
    relay: "只使用中继候选",
    nohost: "不包含 host 候选",
    none: "不使用 ICE", // 用于测试
};
```

---

## 面试题精选

### 面试题 1：WebRTC 的通信原理是什么？

**参考答案：**

WebRTC 实现浏览器间实时通信的核心原理包括以下几个步骤：

**1. 媒体获取**
通过 `getUserMedia` API 获取本地摄像头和麦克风的媒体流，包含视频轨道和音频轨道。

**2. 端点创建**
每一方都创建一个 `RTCPeerConnection` 对象，这是 WebRTC 通信的核心枢纽，负责：

- 维护媒体流
- 处理 ICE 候选
- 编码/解码媒体
- 传输数据

**3. 信令交换**
由于 WebRTC 本身不包含信令机制，需要通过 WebSocket 等方式交换：

- SDP（Session Description Protocol）：包含媒体的编解码器、分辨率等元数据
- ICE Candidate：网络候选信息，用于网络穿透

**4. NAT 穿透**
使用 ICE 框架整合 STUN/TURN 技术：

- STUN：获取公网地址，尝试直连
- TURN：作为中继确保连接成功

**5. 加密传输**
使用 DTLS（Datagram Transport Layer Security）加密密钥交换，SRTP（Secure Real-time Transport Protocol）加密媒体内容。

---

### 面试题 2：WebRTC 如何实现一对一通话？

**参考答案：**

一对一通话实现流程：

**步骤1：用户 A 获取本地媒体**

```javascript
const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
```

**步骤2：创建连接并添加轨道**

```javascript
const pc = new RTCPeerConnection(config);
localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
});
```

**步骤3：A 创建 Offer 并发送**

```javascript
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
// 通过信令服务器发送给 B
```

**步骤4：B 收到 Offer 并创建 Answer**

```javascript
await pc.setRemoteDescription(offer);
const answer = await pc.createAnswer();
await pc.setLocalDescription(answer);
// 通过信令服务器发送给 A
```

**步骤5：双方交换 ICE Candidates**

```javascript
pc.onicecandidate = (event) => {
    if (event.candidate) {
        // 发送给对端
    }
};
```

**步骤6：通话建立**
双方建立连接后，`ontrack` 事件会被触发，可以获取到远程媒体流并播放。

---

### 面试题 3：STUN、TURN 的区别是什么？

**参考答案：**

| 特性             | STUN               | TURN          |
| ---------------- | ------------------ | ------------- |
| **功能**         | 发现公网地址       | 中继数据传输  |
| **是否中转数据** | 否                 | 是            |
| **延迟**         | 无额外延迟         | 增加延迟      |
| **服务器负载**   | 极低               | 较高          |
| **穿透能力**     | 仅对称型 NAT       | 所有 NAT 类型 |
| **适用场景**     | 同一网络或轻度 NAT | 复杂网络环境  |

**实际建议**：生产环境通常同时配置 STUN 和 TURN，优先使用 STUN 直连，失败后 fallback 到 TURN。

```javascript
iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // 直连尝试
    {
        urls: "turn:turn.example.com", // 备用中继
        username: "user",
        credential: "password",
    },
];
```

---

### 面试题 4：WebRTC 的优缺点是什么？

**参考答案：**

**优点：**

1. **无需插件**：浏览器原生支持，用户体验好
2. **实时性强**：UDP 传输，延迟低
3. **点对点**：数据不经过服务器，隐私性好
4. **跨平台**：支持主流浏览器和移动端
5. **开放标准**：W3C 和 IETF 标准

**缺点：**

1. ** NAT 穿透问题**：对称型 NAT 无法穿透，需要 TURN 中继
2. **信令复杂**：需要额外的信令服务器
3. **编解码限制**：部分浏览器不支持所有编解码器
4. **移动端耗电**：长时间通话耗电量大
5. **扩展性差**：难以支持多人视频会议（需配合 SFU/LR）

---

### 面试题 5：如何实现多人视频会议？

**参考答案：**

**方案一：Mesh 结构（适合 2-4 人）**

- 每个用户与其他所有用户建立 P2P 连接
- 用户端带宽压力大：需要 N-1 个连接
- 移动端不推荐

```
    A
   /|\
  B-+-C
   \|/
    D
```

**方案二：SFU（Selective Forwarding Unit）（适合 5 人以上）**

- 媒体服务器选择性转发
- 用户只需维护一个上行连接
- 业界主流方案（如 mediasoup、Janus）

```
        +-----+
    +-->| SFU |--->+
    |   +-----+    |
+----+             +----+
| A  |             | B  |
+----+             +----+
    |   +-----+    |
    +-->| SFU |--->+
        +-----+
```

**代码示例（使用简单 Mesh）：**

```javascript
// 维护多个 PeerConnection
const peers = new Map();

async function createMeshConnection(userId) {
    const pc = new RTCPeerConnection(config);
    peers.set(userId, pc);

    // 添加本地所有轨道
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    // 监听远程轨道
    pc.ontrack = (event) => {
        renderRemoteStream(userId, event.streams[0]);
    };

    return pc;
}
```

---

### 面试题 6：WebRTC 如何保证安全性？

**参考答案：**

WebRTC 在多个层面保证了通信安全：

**1. 媒体加密（SRTP）**

- 使用 AES 加密媒体数据
- 每个 RTP 包独立加密
- 防止媒体被窃听

**2. 密钥交换（DTLS）**

- 基于 TLS 1.3
- 防止中间人攻击
- 自动协商加密参数

**3. 身份验证**

- TURN 服务器需要 credentials
- ICE 候选交换需认证

**4. 端点验证**

```javascript
pc.onicecandidateerror = (event) => {
    console.error("ICE 错误:", event.errorCode, event.errorText);
};
```

**安全建议：**

- 生产环境必须使用 HTTPS
- TURN 服务器配置强密码
- 定期更换 credentials

---

### 面试题 7：RTCPeerConnection 的状态有哪些？

**参考答案：**

`pc.connectionState` 反映连接的整体状态：

| 状态           | 说明                 |
| -------------- | -------------------- |
| `new`          | 刚创建，未开始连接   |
| `connecting`   | 正在建立连接         |
| `connected`    | 已建立连接           |
| `disconnected` | 连接中断（可能恢复） |
| `failed`       | 连接失败             |
| `closed`       | 连接已关闭           |

**相关状态对比：**

```javascript
// ICE 连接状态
pc.iceConnectionState;
// 'new' | 'checking' | 'connected' | 'completed' | 'failed' | 'disconnected' | 'closed'

// ICE gather 状态
pc.iceGatheringState;
// 'new' | 'gathering' | 'complete'
```

---

### 面试题 8：如何处理 WebRTC 的兼容性问题？

**参考答案：**

**1. 能力检测**

```javascript
function isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection);
}
```

**2. 前缀适配**

```javascript
const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
```

**3. 编解码器支持检测**

```javascript
const supportedCodecs = RTCRtpReceiver.getCapabilities("video").codecs;
// 优先选择 H.264（兼容性最好）
const h264Codec = supportedCodecs.find((c) => c.mimeType === "video/H264");
```

**4. offer/answer 兼容性**

```javascript
// 强制使用 VP8（兼容性最好）
const offer = await pc.createOffer({
    offerToReceiveVideo: 1,
    offerToReceiveAudio: 1,
});
// 或强制指定编解码器
await pc.setLocalDescription({
    type: "offer",
    sdp: updateCodecs(offer.sdp, "VP8"),
});
```

---

### 面试题 9：WebRTC 的应用场景有哪些？

**参考答案：**

**1. 视频通话**

- 1v1 视频聊天
- 视频会议
- 在线客服

**2. 直播推流**

- 低延迟直播
- 互动直播

**3. 屏幕共享**

- 远程协作
- 在线教育

**4. 文件传输**

- P2P 文件分享
- 局域网传输加速

**5. 游戏**

- 实时对战
- 棋牌类游戏

**6. IoT**

- 视频监控
- 远程控制

---

### 面试题 10：getUserMedia 常见错误及处理？

**参考答案：**

| 错误                   | 原因                   | 解决方案       |
| ---------------------- | ---------------------- | -------------- |
| `NotAllowedError`      | 用户拒绝或浏览器无权限 | 引导用户授权   |
| `NotFoundError`        | 设备不存在             | 检查设备连接   |
| `NotReadableError`     | 设备被占用             | 释放设备占用   |
| `OverconstrainedError` | 媒体参数不满足         | 调整参数       |
| `SecurityError`        | 非 HTTPS 或 localhost  | 使用安全上下文 |

**优雅降级示例：**

```javascript
async function getMedia(constraints) {
    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
        if (error.name === "OverconstrainedError") {
            // 尝试降低要求
            constraints.video = { facingMode: "user" };
            return await navigator.mediaDevices.getUserMedia(constraints);
        }
        throw error;
    }
}
```
