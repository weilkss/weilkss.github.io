# WebGL 图形编程面试指南

## 什么是 WebGL？

WebGL（Web Graphics Library）是一种基于 OpenGL ES 2.0 的 JavaScript API，它允许在浏览器中渲染高性能的 2D 和 3D 图形，而无需安装任何插件。WebGL 直接与 GPU 通信，利用硬件加速来渲染复杂的图形场景。

```javascript
// WebGL 工作原理
┌─────────────────────────────────────────────────────────────────┐
│                      WebGL 架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   JavaScript 层:                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  WebGL API (createProgram, bindBuffer, drawArrays...)   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   OpenGL ES 2.0 层:                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  顶点着色器 (Vertex Shader)  │ 片元着色器 (Fragment Shader) │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   GPU 硬件层:                                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  光栅化 │ 纹理单元 │ 深度测试 │ 混合 │ 视口变换         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   帧缓冲 (Frame Buffer)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

// WebGL 与其他前端图形技术对比
| 技术 | 渲染方式 | 性能 | 学习曲线 | 适用场景 |
|------|---------|------|---------|---------|
| Canvas 2D | CPU 绘制 | 中 | 低 | 2D 图形、简单动画 |
| SVG | DOM 元素 | 低 | 中 | 矢量图形、图标 |
| WebGL | GPU 渲染 | 高 | 高 | 3D 游戏、数据可视化 |
| CSS 3D | GPU 变换 | 高 | 低 | UI 动画、3D 卡片 |
| Three.js | WebGL 封装 | 高 | 中 | 3D 场景、模型渲染 |
```

## 核心概念解析

### 1. WebGL 渲染管线

```javascript
// WebGL 渲染管线流程
渲染流程:

1. 顶点数据 (Vertices)
   ├── 位置坐标 (x, y, z)
   ├── 颜色信息 (r, g, b, a)
   ├── 纹理坐标 (u, v)
   └── 法线向量 (nx, ny, nz)

2. 顶点着色器 (Vertex Shader)
   ├── 矩阵变换 (模型、视图、投影)
   ├── 顶点插值
   └── 传递数据给片元着色器

3. 图元装配 (Primitive Assembly)
   ├── 点 (POINTS)
   ├── 线 (LINES)
   ├── 线段 (LINE_STRIP)
   ├── 三角形 (TRIANGLES)
   └── 三角形带 (TRIANGLE_STRIP)

4. 光栅化 (Rasterization)
   ├── 裁剪 (Clipping)
   ├── 透视分割 (Perspective Division)
   ├── 视口变换 (Viewport Transform)
   └── 生成片元 (Fragment Generation)

5. 片元着色器 (Fragment Shader)
   ├── 纹理采样
   ├── 颜色计算
   └── 深度测试

6. 逐片元操作 (Per-Fragment Operations)
   ├── 深度测试 (Depth Test)
   ├── 模板测试 (Stencil Test)
   ├── 混合 (Blending)
   └── 写入帧缓冲
```

### 2. 着色器编程

```javascript
// 顶点着色器 (Vertex Shader)
// 负责处理顶点变换和传递顶点数据

// GLSL ES 1.0 语法
const vertexShaderSource = `
  attribute vec3 a_position;      // 顶点位置 attribute
  attribute vec4 a_color;        // 顶点颜色

  uniform mat4 u_modelMatrix;    // 模型矩阵
  uniform mat4 u_viewMatrix;     // 视图矩阵
  uniform mat4 u_projectionMatrix; // 投影矩阵

  varying vec4 v_color;          // 传递给片元着色器的变量

  void main() {
    // MVP 变换
    mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
    gl_Position = mvp * vec4(a_position, 1.0);

    // 传递颜色给片元着色器
    v_color = a_color;
  }
`;

// 片元着色器 (Fragment Shader)
// 负责计算每个片元的最终颜色

const fragmentShaderSource = `
  precision mediump float;       // 浮点精度

  varying vec4 v_color;           // 从顶点着色器接收的颜色

  void main() {
    gl_FragColor = v_color;
  }
`;

// WebGL 2.0 语法 (GLSL ES 3.0)
const vertexShaderSource2 = `
  #version 300 es                // 明确指定版本

  in vec3 a_position;            // 使用 in 替代 attribute
  in vec4 a_color;

  uniform mat4 u_mvpMatrix;

  out vec4 v_color;              // 使用 out 替代 varying

  void main() {
    gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
    v_color = a_color;
  }
`;

const fragmentShaderSource2 = `
  #version 300 es
  precision highp float;

  in vec4 v_color;               // 接收顶点着色器的输出

  out vec4 fragColor;            // 使用 out 替代 gl_FragColor

  void main() {
    fragColor = v_color;
  }
`;
```

### 3. WebGL 上下文初始化

```javascript
// 获取 WebGL 上下文
function initWebGL(canvas) {
  // 尝试获取 WebGL 2.0 上下文
  let gl = canvas.getContext('webgl2');

  if (!gl) {
    // 回退到 WebGL 1.0
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    throw new Error('WebGL not supported');
  }

  return gl;
}

// 编译着色器
function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Shader compile error: ' + info);
  }

  return shader;
}

// 创建程序
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Program link error: ' + info);
  }

  return program;
}

// 完整的初始化流程
function main() {
  const canvas = document.getElementById('glCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = initWebGL(canvas);

  // 编译着色器
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  // 创建程序
  const program = createProgram(gl, vertexShader, fragmentShader);

  // 使用程序
  gl.useProgram(program);

  // 启用深度测试
  gl.enable(gl.DEPTH_TEST);

  // 设置清除颜色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 渲染循环
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 设置顶点属性
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    requestAnimationFrame(render);
  }

  render();
}
```

### 4. 缓冲区与数据传递

```javascript
// 创建缓冲区
const positionBuffer = gl.createBuffer();

// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 向缓冲区写入数据
const positions = new Float32Array([
  // 三角形顶点 (x, y, z)
  0.0,  1.0, 0.0,   // 顶点 1
 -1.0, -1.0, 0.0,   // 顶点 2
  1.0, -1.0, 0.0    // 顶点 3
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// 静态绘制 vs 动态绘制
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);  // 一次写入，多次使用
gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); // 多次修改，多次使用
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);  // 一次写入，一次使用

// 索引缓冲区
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

const indices = new Uint16Array([
  0, 1, 2,  // 第一个三角形
  2, 1, 3   // 第二个三角形
]);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// 使用索引绘制
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

// 属性指针详解
gl.vertexAttribPointer(
  location,      // 属性位置 (来自 getAttribLocation)
  size,          // 每个顶点分量的数量 (1-4)
  type,          // 数据类型 (FLOAT, INT, etc.)
  normalized,    // 是否归一化
  stride,        // 字节跨度 (相邻顶点间的字节数)
  offset         // 偏移量 (当前属性在顶点数据中的字节偏移)
);

// 例子：包含位置和颜色的顶点数据
const vertexData = new Float32Array([
  // 位置 (3)        颜色 (4)
  0.0, 1.0, 0.0,   1.0, 0.0, 0.0, 1.0,  // 红色顶点
 -1.0, -1.0, 0.0,  0.0, 1.0, 0.0, 1.0,  // 绿色顶点
  1.0, -1.0, 0.0,   0.0, 0.0, 1.0, 1.0   // 蓝色顶点
]);

const stride = 7 * 4; // 每个顶点 7 个 float，每个 4 字节

// 位置属性
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const positionLoc = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, stride, 0);

// 颜色属性
const colorLoc = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(colorLoc);
gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, stride, 3 * 4);
```

### 5. 矩阵变换

```javascript
// 矩阵运算库通常使用 gl-matrix 或 glm

// 视图矩阵 (View Matrix) - 摄像机的位置和朝向
const viewMatrix = mat4.create();
mat4.lookAt(
  viewMatrix,
  [0, 0, 5],      // 摄像机位置 (eye)
  [0, 0, 0],       // 观察目标 (center)
  [0, 1, 0]        // 上方向 (up)
);

// 投影矩阵 (Projection Matrix)
// 正交投影 - 常用于 2D UI
const orthoMatrix = mat4.create();
mat4.ortho(
  orthoMatrix,
  -width/2, width/2,   // left, right
  -height/2, height/2, // bottom, top
  0.1, 100             // near, far
);

// 透视投影 - 用于 3D 渲染
const projectionMatrix = mat4.create();
mat4.perspective(
  projectionMatrix,
  45 * Math.PI / 180,  // fov 弧度
  canvas.width / canvas.height,  // aspect
  0.1,                // near
  100.0               // far
);

// 模型矩阵 (Model Matrix) - 物体的变换
const modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, [x, y, z]);     // 平移
mat4.rotateX(modelMatrix, modelMatrix, angle);           // 绕 X 轴旋转
mat4.rotateY(modelMatrix, modelMatrix, angle);           // 绕 Y 轴旋转
mat4.rotateZ(modelMatrix, modelMatrix, angle);           // 绕 Z 轴旋转
mat4.scale(modelMatrix, modelMatrix, [sx, sy, sz]);      // 缩放

// MVP 矩阵 = 投影 * 视图 * 模型
const mvpMatrix = mat4.create();
mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

// 传递给着色器
const mvpLoc = gl.getUniformLocation(program, 'u_mvpMatrix');
gl.uniformMatrix4fv(mvpLoc, false, mvpMatrix);  // 注意: false 表示按列主序存储
```

### 6. 纹理与贴图

```javascript
// 创建纹理
const texture = gl.createTexture();

// 绑定纹理
gl.bindTexture(gl.TEXTURE_2D, texture);

// 设置纹理参数
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// 加载图片纹理
const image = new Image();
image.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,      // 目标
    0,                  // mipmap 级别
    gl.RGBA,            // 内部格式
    gl.RGBA,            // 源格式
    gl.UNSIGNED_BYTE,   // 数据类型
    image               // Image 数据
  );

  // 自动生成 mipmap
  gl.generateMipmap(gl.TEXTURE_2D);
};
image.src = 'texture.png';

// 片元着色器中使用纹理
const fragmentShaderWithTexture = `
  precision mediump float;

  uniform sampler2D u_texture;  // 2D 纹理采样器
  varying vec2 v_texCoord;     // 纹理坐标

  void main() {
    // texture2D 用于采样纹理
    gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`;

// 顶点着色器传递纹理坐标
const vertexShaderWithTexture = `
  attribute vec3 a_position;
  attribute vec2 a_texCoord;  // 纹理坐标

  uniform mat4 u_mvpMatrix;

  varying vec2 v_texCoord;

  void main() {
    gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// 激活纹理单元
gl.activeTexture(gl.TEXTURE0);         // 选择纹理单元 0
gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理

// 将纹理单元编号传递给着色器
const textureLoc = gl.getUniformLocation(program, 'u_texture');
gl.uniform1i(textureLoc, 0);            // 使用纹理单元 0

// 多纹理
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture0);
gl.uniform1i(gl.getUniformLocation(program, 'u_texture0'), 0);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, texture1);
gl.uniform1i(gl.getUniformLocation(program, 'u_texture1'), 1);
```

### 7. 深度测试与混合

```javascript
// 深度测试 - 解决物体遮挡问题
gl.enable(gl.DEPTH_TEST);              // 启用深度测试
gl.depthFunc(gl.LEQUAL);                // 深度函数
gl.depthMask(true);                     // 允许写入深度缓冲

// 深度缓冲清除
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 深度函数选项
gl.depthFunc(gl.NEVER);    // 从不通过
gl.depthFunc(gl.LESS);     // 新值 < 旧值 (默认)
gl.depthFunc(gl.EQUAL);    // 新值 == 旧值
gl.depthFunc(gl.LEQUAL);   // 新值 <= 旧值
gl.depthFunc(gl.GREATER);  // 新值 > 旧值
gl.depthFunc(gl.NOTEQUAL);  // 新值 != 旧值
gl.depthFunc(gl.GEQUAL);   // 新值 >= 旧值
gl.depthFunc(gl.ALWAYS);   // 总是通过

// 混合 - 实现透明效果
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 常用混合函数组合
gl.blendFunc(gl.ONE, gl.ZERO);           // 完全不透明
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // 正常透明
gl.blendFunc(gl.ONE, gl.ONE);             // 发光效果 (加法)
gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);  // 调制

// 分离 RGB 和 Alpha 混合
gl.blendFuncSeparate(
  gl.SRC_ALPHA,      // RGB 源因子
  gl.ONE_MINUS_SRC_ALPHA,  // RGB 目标因子
  gl.ONE,            // Alpha 源因子
  gl.ONE_MINUS_SRC_ALPHA   // Alpha 目标因子
);

// 背面剔除 - 优化渲染性能
gl.enable(gl.CULL_FACE);       // 启用背面剔除
gl.cullFace(gl.BACK);          // 剔除背面 (默认)
gl.cullFace(gl.FRONT);         // 剔除正面
gl.cullFace(gl.FRONT_AND_BACK); // 剔除两面
gl.frontFace(gl.CCW);          // 逆时针缠绕为正面 (默认)
gl.frontFace(gl.CW);           // 顺时针缠绕为正面
```

---

## 面试题

### 面试题 1：解释 WebGL 的渲染管线流程

**参考答案：**

WebGL 的渲染管线是一系列处理顶点数据并生成最终图像的步骤。

**完整渲染管线流程：**

```
┌─────────────────────────────────────────────────────────────────┐
│                 WebGL 完整渲染管线                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 应用阶段 (Application Stage)                               │
│     JavaScript 准备顶点数据、设置状态                            │
│     │                                                           │
│     ▼                                                           │
│  2. 顶点着色器 (Vertex Shader)                                  │
│     - 接收顶点属性 (位置、颜色、UV 等)                          │
│     - 执行顶点变换 (MVP 矩阵)                                    │
│     - 输出裁剪空间坐标                                           │
│     │                                                           │
│     ▼                                                           │
│  3. 图元装配 (Primitive Assembly)                               │
│     - 将顶点组装成图元 (点、线、三角形)                          │
│     - 执行裁剪 (Clipping)                                        │
│     │                                                           │
│     ▼                                                           │
│  4. 光栅化 (Rasterization)                                     │
│     - 将图元转换为片元 (Fragment)                                │
│     - 计算片元属性 (插值)                                        │
│     │                                                           │
│     ▼                                                           │
│  5. 片元着色器 (Fragment Shader)                                │
│     - 接收插值后的顶点属性                                       │
│     - 纹理采样、光照计算等                                       │
│     - 输出最终片元颜色                                           │
│     │                                                           │
│     ▼                                                           │
│  6. 逐片元操作 (Per-Fragment Operations)                        │
│     - 深度测试 (Depth Test)                                      │
│     - 模板测试 (Stencil Test)                                    │
│     - 混合 (Blending)                                            │
│     - 写入帧缓冲 (Framebuffer)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**各阶段详解：**

**1. 顶点着色器阶段**

这是可编程的阶段，开发者编写 GLSL 代码处理每个顶点。

```javascript
// 顶点着色器主要任务
// 1. 矩阵变换 - 将顶点从模型空间转换到裁剪空间
uniform mat4 u_mvpMatrix;
gl_Position = u_mvpMatrix * vec4(a_position, 1.0);

// 2. 传递数据给片元着色器
varying vec2 v_texCoord;
varying vec3 v_normal;

void main() {
  v_texCoord = a_texCoord;
  v_normal = mat3(u_modelMatrix) * a_normal;
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}
```

**2. 图元装配与裁剪**

顶点着色器输出的裁剪坐标会被用于图元装配：

- **图元类型**：WebGL 支持 `POINTS`、`LINES`、`LINE_STRIP`、`LINE_LOOP`、`TRIANGLES`、`TRIANGLE_STRIP`、`TRIANGLE_FAN`

- **裁剪**：使用视锥体裁剪，超出范围的顶点会被裁剪或产生新的顶点

```javascript
// 设置图元类型
gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
gl.drawElements(gl.TRIANGLE_STRIP, indexCount, gl.UNSIGNED_SHORT, 0);
```

**3. 光栅化**

光栅化将连续的几何图元转换为离散的片元：

```javascript
// 光栅化过程
三角形 → 片元生成 → 顶点属性插值

// 插值计算 (透视校正插值)
对于三角形内的片元 P:
interpolated_value = v0 * (1 - u - v) + v1 * u + v2 * v

// 其中 u, v 是重心坐标
```

**4. 片元着色器**

片元着色器计算每个片元的最终颜色：

```javascript
// 典型片元着色器
precision mediump float;

uniform sampler2D u_diffuseMap;
uniform vec3 u_lightDir;

varying vec2 v_texCoord;
varying vec3 v_normal;

void main() {
  // 纹理采样
  vec4 texColor = texture2D(u_diffuseMap, v_texCoord);

  // 简单光照
  float diffuse = max(dot(normalize(v_normal), normalize(u_lightDir)), 0.0);

  // 最终颜色
  gl_FragColor = texColor * (0.3 + 0.7 * diffuse);
}
```

**5. 逐片元操作**

不可编程，但可配置：

| 操作 | 作用 | 关键函数 |
|------|------|---------|
| 裁剪测试 | 丢弃超出视口的片元 | `gl.scissor()` |
| 深度测试 | 处理物体遮挡关系 | `gl.depthFunc()` |
| 模板测试 | 实现遮罩、轮廓等效果 | `gl.stencilFunc()` |
| 混合 | 实现透明、半透明效果 | `gl.blendFunc()` |

**性能优化建议：**

1. 减少状态切换（纹理绑定、program 切换）
2. 使用索引绘制减少顶点重复
3. 合理使用背面剔除
4. 减少 uniforms 数量
5. 使用实例化绘制大量相似物体

### 面试题 2：WebGL 中的顶点着色器和片元着色器有什么区别？

**参考答案：**

**核心区别：**

| 特性 | 顶点着色器 | 片元着色器 |
|------|-----------|-----------|
| **执行频率** | 每个顶点执行一次 | 每个片元执行一次 |
| **输入** | 顶点属性 (position, color, uv 等) | 顶点着色器输出的插值 |
| **输出** | 裁剪空间坐标、传递给片元的数据 | 最终片元颜色 |
| **可变性** | 处理离散数据 | 处理连续数据 |
| **典型任务** | 坐标变换、光照计算顶点 | 纹理采样、光照计算片元 |

**执行流程图：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    着色器执行流程                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   顶点着色器 (Per-Vertex)                                        │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│   │ Vertex1 │  │ Vertex2 │  │ Vertex3 │  ...                    │
│   └────┬────┘  └────┬────┘  └────┬────┘                        │
│        │            │            │                              │
│        └────────────┼────────────┘                              │
│                     ▼                                           │
│   ┌─────────────────────────────────────┐                        │
│   │        光栅化 & 插值                 │                        │
│   │   顶点属性被线性/透视插值到片元       │                        │
│   └─────────────────────────────────────┘                        │
│                     ▼                                           │
│   片元着色器 (Per-Fragment)                                      │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ...      │
│   │ Frag1   │  │ Frag2   │  │ Frag3   │  │ Frag4   │            │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**顶点着色器示例：**

```javascript
// 顶点着色器处理单个顶点的变换
const vertexShaderSource = `
  attribute vec3 a_position;     // 顶点位置
  attribute vec3 a_normal;       // 顶点法线
  attribute vec2 a_texCoord;     // 纹理坐标

  uniform mat4 u_modelMatrix;     // 模型矩阵
  uniform mat4 u_viewMatrix;     // 视图矩阵
  uniform mat4 u_projectionMatrix; // 投影矩阵
  uniform mat3 u_normalMatrix;   // 法线矩阵

  varying vec3 v_normal;          // 传递给片元着色器
  varying vec2 v_texCoord;
  varying vec3 v_position;

  void main() {
    // MVP 变换得到裁剪空间坐标
    mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
    gl_Position = mvp * vec4(a_position, 1.0);

    // 计算世界空间位置用于光照
    vec4 worldPosition = u_modelMatrix * vec4(a_position, 1.0);
    v_position = worldPosition.xyz;

    // 变换法线
    v_normal = u_normalMatrix * a_normal;

    // 传递纹理坐标
    v_texCoord = a_texCoord;
  }
`;
```

**片元着色器示例：**

```javascript
// 片元着色器计算每个片元的颜色
const fragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_diffuseMap;      // 纹理
  uniform vec3 u_lightPosition;        // 光源位置
  uniform vec3 u_viewPosition;          // 摄像机位置
  uniform float u_shininess;            // 光泽度

  varying vec3 v_normal;                // 插值得到的法线
  varying vec2 v_texCoord;
  varying vec3 v_position;

  void main() {
    // 纹理颜色
    vec4 texColor = texture2D(u_diffuseMap, v_texCoord);

    // 归一化向量
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPosition - v_position);
    vec3 viewDir = normalize(u_viewPosition - v_position);
    vec3 halfDir = normalize(lightDir + viewDir);

    // 环境光
    vec3 ambient = 0.1 * texColor.rgb;

    // 漫反射
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * texColor.rgb;

    // 镜面反射 (Blinn-Phong)
    float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
    vec3 specular = spec * vec3(1.0);

    // 最终颜色
    gl_FragColor = vec4(ambient + diffuse + specular, texColor.a);
  }
`;
```

**实际应用场景对比：**

| 场景 | 顶点着色器处理 | 片元着色器处理 |
|------|---------------|---------------|
| **凹凸贴图** | 调整顶点位置 | 计算法线扰动 |
| **LOD (细节层次)** | 减少顶点数量 | 调整片元细节 |
| **阴影** | 生成阴影坐标 | 比较深度 |
| **抗锯齿** | - | 多重采样混合 |
| **环境映射** | 计算反射方向 | 采样环境贴图 |

### 面试题 3：如何优化 WebGL 的渲染性能？

**参考答案：**

**优化策略总览：**

```
┌─────────────────────────────────────────────────────────────────┐
│                   WebGL 性能优化策略                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. 减少 Draw Call                                              │
│      ├── 合并几何体 (Geometry Batching)                          │
│      ├── 实例化渲染 (Instancing)                                 │
│      └── 纹理图集 (Texture Atlas)                               │
│                                                                 │
│   2. 减少状态切换                                                │
│      ├── 排序渲染物体                                            │
│      ├── 纹理图集                                                │
│      └── 批量处理                                                │
│                                                                 │
│   3. 减少 GPU 负载                                               │
│      ├── 视锥体裁剪 (Frustum Culling)                           │
│      ├── 遮挡剔除 (Occlusion Culling)                           │
│      └── 背面剔除 (Back-face Culling)                           │
│                                                                 │
│   4. 内存与带宽优化                                              │
│      ├── 压缩纹理 (ETC, ASTC, DXT)                              │
│      ├── Mipmap                                                 │
│      └── 数据类型优化                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**1. 减少 Draw Call - 实例化渲染**

当渲染大量相似物体时，使用实例化可以大幅减少 Draw Call：

```javascript
// 实例化渲染示例：渲染 1000 个相同几何体
const instanceCount = 1000;

// 创建实例数据：每个实例的变换矩阵
const instanceMatrixData = new Float32Array(16 * instanceCount);
for (let i = 0; i < instanceCount; i++) {
  const matrix = mat4.create();
  mat4.translate(matrix, matrix, [i * 2, 0, 0]);
  instanceMatrixData.set(matrix, i * 16);
}

// 创建实例缓冲区
const instanceBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
gl.bufferData(gl.ARRAY_BUFFER, instanceMatrixData, gl.DYNAMIC_DRAW);

// 顶点着色器支持实例
const instanceVertexShader = `
  attribute vec3 a_position;
  attribute mat4 u_instanceMatrix;  // 实例矩阵

  uniform mat4 u_viewProjection;

  void main() {
    gl_Position = u_viewProjection * u_instanceMatrix * vec4(a_position, 1.0);
  }
`;

// WebGL 2.0 使用
gl.drawArraysInstanced(gl.TRIANGLES, 0, vertexCount, instanceCount);

// WebGL 1.0 需要扩展
const ext = gl.getExtension('ANGLE_instanced_arrays');
ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, vertexCount, instanceCount);
```

**2. 纹理优化 - 纹理图集**

将多个小纹理合并成一个大纹理，减少纹理切换：

```javascript
// 纹理图集布局
const atlasConfig = {
  tileSize: 64,
  atlasSize: 512,
  tiles: [
    { name: 'player', x: 0, y: 0 },
    { name: 'enemy', x: 64, y: 0 },
    { name: 'tree', x: 128, y: 0 },
    // ...
  ]
};

// 着色器中根据 UV 范围采样
const atlasFragmentShader = `
  uniform sampler2D u_atlas;
  uniform vec4 u_tileRect;  // (u, v, width, height)

  varying vec2 v_texCoord;

  void main() {
    // 计算当前 tile 的 UV
    vec2 atlasUV = u_tileRect.xy + v_texCoord * u_tileRect.zw;
    gl_FragColor = texture2D(u_atlas, atlasUV);
  }
`;

// 使用时切换 tileRect 即可复用同一纹理
```

**3. 着色器优化**

```javascript
// ❌ 低效：分支判断、冗余计算
void main() {
  vec3 normal = normalize(v_normal);
  if (u_useLighting) {
    float diff = max(dot(normal, u_lightDir), 0.0);
    color *= diff;
  }
  // 每个片元都执行 normalize
}

// ✅ 高效：避免分支、使用预计算
void main() {
  // 在顶点着色器中计算 lighting factor
  float lighting = u_lightEnabled ?
    max(dot(normalize(v_normal), u_lightDir), 0.0) : 1.0;
  color *= lighting;
}

// ✅ 高效：使用 mediump 而非 highp
precision mediump float;  // 对于大多数情况足够

// ✅ 高效：避免在片元着色器中计算
// 在顶点着色器中计算插值
varying float v_lightingFactor;  // 而非在片元着色器中 normalize
```

**4. 视锥体裁剪**

```javascript
// 简单视锥体裁剪
function isInFrustum(box, frustumPlanes) {
  for (let i = 0; i < frustumPlanes.length; i++) {
    const plane = frustumPlanes[i];
    const p = box.center[0] * plane.normal[0] +
              box.center[1] * plane.normal[1] +
              box.center[2] * plane.normal[2];

    if (p < -box.radius) {
      return false;  // 完全在平面外
    }
  }
  return true;
}

// 视锥体构建
function extractFrustumPlanes(viewProjectionMatrix) {
  const planes = [];
  const m = viewProjectionMatrix;

  // 从 MVP 矩阵提取 6 个裁剪平面
  // left, right, bottom, top, near, far

  return planes;
}
```

**5. 内存与数据类型优化**

```javascript
// 使用最佳数据类型
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);  // 32位浮点

// 对于不需要高精度的数据使用较短类型
gl.vertexAttribPointer(texCoordLoc, 2, gl.UNSIGNED_SHORT, true, 0, 0);

// 纹理压缩格式
// WebGL 2.0 支持
gl.compressedTexImage2D(
  gl.TEXTURE_2D, 0,
  gl.COMPRESSED_RGBA_S3TC_DXT5_EXT,  // DXT5 压缩
  width, height, 0,
  imageData
);

// 使用 Mipmap 减少远处物体的纹理采样开销
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
gl.generateMipmap(gl.TEXTURE_2D);
```

**性能检测工具：**

```javascript
// 使用 WebGL Inspector 分析 Draw Call
// 使用 Chrome DevTools 的 Performance 面板
// 使用 requestAnimationFrame 测量帧率

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;
    console.log(`FPS: ${fps}`);
  }

  requestAnimationFrame(measureFPS);
}

measureFPS();
```

### 面试题 4：解释 WebGL 中的深度测试和模板测试

**参考答案：**

**深度测试 (Depth Test)：**

深度测试用于解决物体之间的遮挡关系，确保远处的物体被近处的物体正确遮挡。

```
┌─────────────────────────────────────────────────────────────────┐
│                      深度测试原理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   帧缓冲结构:                                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  颜色缓冲 (Color Buffer)                                 │   │
│   │  每个像素存储颜色值 RGBA                                 │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │  深度缓冲 (Depth Buffer)                                 │   │
│   │  每个像素存储深度值 (0.0 - 1.0)                          │   │
│   │  1.0 表示最远, 0.0 表示最近                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   深度测试过程:                                                  │
│   1. 片元着色器输出片元 P，深度值为 z                            │
│   2. 读取帧缓冲中已有片元的深度 z_old                           │
│   3. 比较 z 和 z_old                                            │
│   4. 根据深度函数决定通过或丢弃                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// 启用深度测试
gl.enable(gl.DEPTH_TEST);

// 设置深度函数
gl.depthFunc(gl.LESS);  // 默认：新深度 < 旧深度 才通过

// 清除深度缓冲
gl.clear(gl.DEPTH_BUFFER_BIT);
gl.clearDepth(1.0);  // 清除值为 1.0

// 控制深度缓冲写入
gl.depthMask(true);   // 允许写入 (正常渲染)
gl.depthMask(false);   // 禁止写入 (用于阴影、透明物体)

// 深度函数选项
gl.depthFunc(gl.NEVER);    // 从不通过 - 完全丢弃
gl.depthFunc(gl.LESS);     // 新 < 旧 (只显示近的)
gl.depthFunc(gl.EQUAL);   // 新 == 旧
gl.depthFunc(gl.LEQUAL);  // 新 <= 旧 (默认，通常最安全)
gl.depthFunc(gl.GREATER); // 新 > 旧 (只显示远的)
gl.depthFunc(gl.NOTEQUAL); // 新 != 旧
gl.depthFunc(gl.GEQUAL);  // 新 >= 旧
gl.depthFunc(gl.ALWAYS);  // 总是通过 - 不测试深度
```

**模板测试 (Stencil Test)：**

模板测试使用模板缓冲来控制片元的写入，常用于实现遮罩、轮廓、镜像等效果。

```
┌─────────────────────────────────────────────────────────────────┐
│                      模板缓冲原理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   模板缓冲结构:                                                  │
│   每个像素存储一个模板值 (通常 8 位, 0-255)                       │
│                                                                 │
│   模板测试过程:                                                  │
│   1. 片元着色器输出片元                                          │
│   2. 获取模板值 ref 与 当前模板值 stencil 进行比较                │
│   3. 根据模板函数决定通过或丢弃                                  │
│   4. 可根据测试结果更新模板值                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// 启用模板测试
gl.enable(gl.STENCIL_TEST);

// 设置模板函数
gl.stencilFunc(gl.EQUAL,  // 函数
               1,          // ref 值
               0xFF);      // mask 值

// 模板函数选项
gl.stencilFunc(gl.NEVER);     // 从不通过
gl.stencilFunc(gl.LESS);      // ref < stencil
gl.stencilFunc(gl.EQUAL);     // ref == stencil
gl.stencilFunc(gl.LEQUAL);    // ref <= stencil
gl.stencilFunc(gl.GREATER);   // ref > stencil
gl.stencilFunc(gl.NOTEQUAL);  // ref != stencil
gl.stencilFunc(gl.GEQUAL);    // ref >= stencil
gl.stencilFunc(gl.ALWAYS);    // 总是通过

// 模板操作
gl.stencilOp(
  gl.KEEP,      // 测试失败时
  gl.KEEP,      // 测试通过但深度测试失败时
  gl.REPLACE);  // 测试和深度测试都通过时

// 操作选项
gl.stencilOp(gl.KEEP);      // 保持不变
gl.stencilOp(gl.ZERO);      // 设置为 0
gl.stencilOp(gl.REPLACE);   // 替换为 ref
gl.stencilOp(gl.INCR);      // 增加 (饱和)
gl.stencilOp(gl.DECR);      // 减少 (饱和)
gl.stencilOp(gl.INVERT);    // 按位翻转
```

**实际应用示例 - 物体轮廓：**

```javascript
// 渲染轮廓的完整流程
function renderOutline(mesh, outlineWidth) {
  // 1. 渲染物体到模板缓冲，标记其覆盖区域
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

  drawMesh(mesh);  // 正常渲染物体

  // 2. 放大物体并用纯色渲染轮廓
  gl.stencilFunc(gl.NOTQUAL, 1, 0xFF);  // 只渲染物体外的区域
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  gl.pushMatrix();
  gl.scale(outlineWidth, outlineWidth, outlineWidth);

  const outlineShader = createOutlineShader();
  gl.useProgram(outlineShader);
  drawMesh(mesh);  // 渲染放大的轮廓

  gl.popMatrix();

  // 3. 恢复正常渲染
  gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
  gl.disable(gl.STENCIL_TEST);
}
```

**实际应用示例 - 镜子效果：**

```javascript
function renderMirror() {
  // 1. 渲染镜像前，先标记镜子区域
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

  drawMirror();  // 渲染镜子

  // 2. 只在镜子区域内渲染镜像内容
  gl.stencilFunc(gl.EQUAL, 1, 0xFF);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  // 翻转渲染
  gl.pushMatrix();
  gl.scale(1, -1, 1);  // Y 轴翻转

  // 裁剪平面：只渲染镜子后的物体
  gl.enable(gl.CLIP_PLANE0);
  gl.clipPlane(gl.CLIP_PLANE0, [0, 1, 0, 0]);

  renderScene();  // 渲染场景

  gl.disable(gl.CLIP_PLANE0);
  gl.popMatrix();

  gl.disable(gl.STENCIL_TEST);

  // 3. 最后渲染镜子本身（半透明覆盖）
  drawMirror();
}
```

**深度测试与模板测试结合 - 阴影：**

```javascript
function renderShadow() {
  // 1. 渲染阴影到模板缓冲
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

  renderShadowVolume();  // 渲染阴影体

  // 2. 对场景中每个物体检测是否在阴影中
  gl.stencilFunc(gl.EQUAL, 1, 0xFF);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // 渲染阴影叠加
  drawShadowOverlay();

  gl.disable(gl.BLEND);
  gl.disable(gl.STENCIL_TEST);
}
```

### 面试题 5：Three.js 相比原生 WebGL 有什么优势？什么时候应该使用原生 WebGL？

**参考答案：**

**Three.js vs 原生 WebGL 对比：**

| 特性 | Three.js | 原生 WebGL |
|------|----------|-----------|
| **学习曲线** | 较低 | 很高 |
| **开发效率** | 高 | 低 |
| **代码量** | 少 | 大量样板代码 |
| **性能控制** | 中等 | 完全控制 |
| **灵活性** | 受框架限制 | 完全自由 |
| **生态** | 丰富 (加载器、控制器、后期处理) | 需要自己实现 |
| **调试** | 较难 | 较容易 (原生 API) |
| **包体积** | ~150KB (压缩后) | 0 |

**Three.js 架构：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Three.js 架构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   开发者代码 (简洁)                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  scene.add(mesh)                                        │   │
│   │  camera.position.set(0, 0, 5)                           │   │
│   │  renderer.render(scene, camera)                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   Three.js 核心 (封装 WebGL)                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Scene  │  Camera  │  Renderer  │  Geometry  │ Material  │   │
│   │  Mesh   │  Light   │  Loader    │  Controller │ Shader   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   WebGL API (自动调用)                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Three.js 使用示例：**

```javascript
// Three.js 创建 3D 场景
import * as THREE from 'three';

// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 摄像机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 几何体 + 材质 = 网格
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// 加载模型 (Three.js 生态优势)
const loader = new THREE.GLTFLoader();
loader.load('model.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

**原生 WebGL 等价代码：**

```javascript
// 原生 WebGL 相同功能 - 约 10 倍代码量
const vertexShaderSource = `
  attribute vec3 a_position;
  uniform mat4 u_mvpMatrix;
  void main() {
    gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

// 初始化着色器程序、缓冲区、矩阵... (省略 100+ 行)
// 渲染循环中的矩阵计算、属性设置... (省略 50+ 行)

// 最终渲染
gl.drawArrays(gl.TRIANGLES, 0, 36);
```

**选择建议：**

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| **3D 游戏** | Three.js | 开发效率、成熟生态 |
| **3D 可视化** | Three.js | 方便的数据绑定 |
| **数据图表** | Three.js / D3 | 现成的图表组件 |
| **高性能游戏** | 原生 WebGL | 完全性能控制 |
| **定制 Shader** | 原生 WebGL | 完整 GLSL 控制 |
| **移动端优化** | 原生 WebGL | 减少库开销 |
| **学习图形学** | 原生 WebGL | 理解底层原理 |

**混合使用方案：**

```javascript
// 在 Three.js 中使用自定义着色器
const customMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 v_normal;
    varying vec2 v_uv;
    void main() {
      v_normal = normal;
      v_uv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform vec3 u_color;
    varying vec3 v_normal;
    void main() {
      float lighting = dot(normalize(v_normal), vec3(0.5, 1.0, 0.7));
      gl_FragColor = vec4(u_color * lighting, 1.0);
    }
  `,
  uniforms: {
    u_color: { value: new THREE.Color(0x00ff00) }
  }
});

const mesh = new THREE.Mesh(geometry, customMaterial);
scene.add(mesh);
```

**总结：**

- **Three.js**：适合大多数 3D 应用，开发效率高，生态丰富
- **原生 WebGL**：适合对性能有极端要求或需要深入理解图形学原理的场景
- **最佳实践**：使用 Three.js 开发，用自定义 Shader 扩展，在必要时深入原生 WebGL 优化