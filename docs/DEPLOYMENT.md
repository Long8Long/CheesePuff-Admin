# Nginx Docker 多服务路由方案

## 概述

使用 Nginx 反向代理容器，通过**单一端口**将请求分发到不同的后端服务。

## 架构

```
                    ┌─────────────────┐
                    │   用户请求       │
                    │  :81 端口       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  nginx-proxy    │
                    │  (Docker 容器)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Admin      │    │   Web       │    │   API       │
│  :80        │    │  :80        │    │  :8080      │
└─────────────┘    └─────────────┘    └─────────────┘
   (本项目)         (其他前端)          (后端服务)
```

## 端口选择

常用可用端口：81 / 88 / 8888 / 999

> 避免使用 80、443、8080、8000 等已被占用的端口

## 快速开始

### 1. 部署后端服务

本项目的部署脚本会自动创建容器并加入网络：

```bash
# 部署后（自动执行）
docker run -d \
  --name cheesepuff-admin \
  --network 1panel-network \
  --restart unless-stopped \
  cheesepuff-admin:latest
```

### 2. 启动 Nginx 代理

```bash
# 创建 Docker 网络（如果不存在）
docker network create 1panel-network

# 启动 nginx 代理
docker run -d --name nginx-proxy \
  -p 81:80 \
  --network 1panel-network \
  -v /path/to/nginx-proxy.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine
```

### 3. 访问服务

```
http://服务器IP:81        → Admin 后台
http://服务器IP:81/web/  → Web 前端
http://服务器IP:81/api/  → API 服务
```

## Nginx 配置

### 基础配置 (nginx-proxy.conf)

```nginx
events {
    worker_connections 1024;
}

http {
    # Upstream 后端服务 (容器名:端口)
    upstream cheesepuff_admin {
        server cheesepuff-admin:80;
    }

    server {
        listen 80;
        server_name _;

        # 根路径 → Admin
        location / {
            proxy_pass http://cheesepuff_admin;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### 多服务配置示例

```nginx
http {
    # 多个后端服务
    upstream admin_backend {
        server cheesepuff-admin:80;
    }

    upstream web_frontend {
        server web-app:80;
    }

    upstream api_backend {
        server my-api:8080;
    }

    server {
        listen 80;
        server_name _;

        # /admin/* → Admin
        location /admin/ {
            proxy_pass http://admin_backend;
            # ... proxy headers
        }

        # /web/* → Web 前端
        location /web/ {
            proxy_pass http://web_frontend;
        }

        # /api/* → API
        location /api/ {
            proxy_pass http://api_backend;
        }
    }
}
```

## 防火墙配置

### 方式 1：Docker 绑定本地 IP

```bash
# 只有本机能访问（适合开发/测试）
-p 127.0.0.1:81:80
```

### 方式 2：1Panel 防火墙

在 1Panel 后台 → 防火墙 → 添加规则：
- 端口：81
- 协议：TCP
- 来源：指定 IP 或内网段

### 方式 3：Nginx 自身限制

```nginx
server {
    listen 80;

    # IP 白名单
    allow 192.168.1.0/24;   # 内网段
    allow 10.0.0.0/8;       # 内网段
    allow 127.0.0.1;        # 本地
    deny all;               # 拒绝其他

    location / {
        proxy_pass http://cheesepuff_admin;
    }
}
```

## 常用命令

```bash
# 查看容器运行状态
docker ps

# 查看端口映射
docker port nginx-proxy

# 查看 nginx 日志
docker logs nginx-proxy

# 重载 nginx 配置
docker exec nginx-proxy nginx -s reload

# 重启 nginx
docker restart nginx-proxy

# 查看网络中的容器
docker network inspect 1panel-network
```

## 与现有服务共存

| 现有服务端口 | 共存方案 |
|------------|---------|
| :80 Apache/Nginx | 不冲突（代理用 81） |
| :443 HTTPS | 不冲突 |
| :8080 Java/Node | 不冲突 |
| 1Panel | 不冲突 |

**注意**：确保 81 端口未被占用即可。

## 故障排查

### 502 Bad Gateway

```bash
# 检查后端容器是否运行
docker ps | grep cheesepuff-admin

# 检查网络连接
docker exec nginx-proxy ping cheesepuff-admin

# 查看详细日志
docker logs nginx-proxy
```

### 404 Not Found

确认 location 路径和 upstream 容器名是否正确。

### 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 81

# 更换端口
-p 88:80
```

## 文件清单

| 文件 | 说明 |
|------|------|
| `.github/workflows/deploy.yml` | 自动部署脚本 |
| `Dockerfile` | 应用镜像构建 |
| `nginx.conf` | 应用内 nginx 配置 |
| `nginx-proxy.conf` | 反向代理配置 |
