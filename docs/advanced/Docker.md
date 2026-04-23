# Docker 面试指南

## 面试者视角回答

Docker 是前端工程化中必备的技能，特别是在 Node.js 服务端开发和 DevOps 场景中。

---

## 核心概念

### 容器 vs 虚拟机

| 特性     | Docker 容器    | 虚拟机       |
| -------- | -------------- | ------------ |
| 启动速度 | 秒级           | 分钟级       |
| 性能损耗 | 几乎无         | 5-10%        |
| 磁盘占用 | MB 级          | GB 级        |
| 隔离性   | 进程级         | 硬件级       |
| 操作系统 | 共享宿主机内核 | 独立操作系统 |

### 核心组件

```
Docker Client    ->    Docker Daemon    ->    Registry
(命令行工具)         (后台服务)           (镜像仓库)
```

---

## 常用命令

### 镜像操作

```bash
# 拉取镜像
docker pull node:18

# 查看本地镜像
docker images

# 删除镜像
docker rmi node:18

# 构建镜像
docker build -t myapp:latest .

# 推送镜像
docker push myrepo/myapp:latest
```

### 容器操作

```bash
# 运行容器
docker run -d -p 3000:3000 --name myapp myapp:latest

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止/启动容器
docker stop myapp
docker start myapp

# 进入容器
docker exec -it myapp bash

# 查看日志
docker logs -f myapp

# 删除容器
docker rm myapp
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
    web:
        build: .
        ports:
            - "3000:3000"
        environment:
            - NODE_ENV=production
        depends_on:
            - db
    db:
        image: postgres:14
        volumes:
            - pgdata:/var/lib/postgresql/data
volumes:
    pgdata:
```

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f
```

---

## Dockerfile 最佳实践

### 前端项目 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 多阶段构建优化

```dockerfile
# 阶段1：依赖安装（缓存优化）
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 阶段2：构建
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 阶段3：运行
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 面试高频问题

### Q1：Docker 和 VM 的区别？

**答**：

- VM 是完整操作系统，需要独立内核，启动慢（分钟级）
- Docker 是进程级隔离，共享宿主机内核，启动快（秒级）
- VM 隔离彻底但资源占用大，Docker 轻量但隔离性较弱

### Q2：Dockerfile 的 CMD 和 ENTRYPOINT 区别？

**答**：

- CMD：可以被 docker run 参数覆盖
- ENTRYPOINT：参数会作为默认参数追加

```dockerfile
# CMD 可被覆盖
CMD ["node", "app.js"]
# docker run image npm test  ->  node app.js npm test

# ENTRYPOINT 追加参数
ENTRYPOINT ["node", "app.js"]
# docker run image npm test  ->  node app.js npm test
```

### Q3：如何减少 Docker 镜像大小？

**答**：

1. 使用多阶段构建
2. 使用 alpine 等轻量基础镜像
3. 合理利用 .dockerignore
4. 合并 RUN 指令减少层数
5. 将依赖安装和代码拷贝分开，利用缓存

### Q4：Docker 网络模式有哪些？

**答**：
| 模式 | 说明 |
|------|------|
| bridge | 默认模式，容器间网络互通 |
| host | 容器直接使用宿主机网络 |
| none | 禁用网络 |
| overlay | Docker Swarm 多主机通信 |

### Q5：数据如何持久化？

**答**：
两种方式：

1. **volumes**：Docker 管理的数据卷，最佳选择
2. **bind mounts**：绑定宿主机目录

```bash
# volumes
docker run -v mydata:/var/lib/postgresql/data postgres

# bind mounts
docker run -v /host/path:/container/path nginx
```

### Q6：容器间如何通信？

**答**：

1. **Docker Compose**：自动创建网络，容器间通过服务名访问
2. **Docker Network**：

```bash
docker network create mynet
docker run --network mynet --name app app:latest
docker run --network mynet --name db postgres:14
# app 容器可以通过 db 主机名访问 postgres
```

---

## 实际应用场景

### CI/CD 集成

```yaml
# .gitlab-ci.yml 示例
build:
    stage: build
    image: docker:latest
    services:
        - docker:dind
    script:
        - docker build -t myapp:$CI_COMMIT_SHA .
        - docker push myapp:$CI_COMMIT_SHA

deploy:
    stage: deploy
    script:
        - docker pull myapp:$CI_COMMIT_SHA
        - docker-compose up -d
```

### Node.js 生产环境部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
```

---

## 常用问题排查

```bash
# 查看容器资源使用
docker stats

# 检查容器内部
docker inspect container_name

# 查看网络
docker network ls
docker network inspect bridge

# 清理未使用的资源
docker system prune -a
```
