# 猫咪管理系统 API 定义文档

## 概述

本文档定义了猫咪管理系统的API接口

### 基础信息

- **API版本**: v1
- **认证方式**: JWT Token（仅管理端API）
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式

所有API响应都遵循统一格式：

```json
{
  "code": 200,          // 状态码
  "data": {},           // 响应数据
  "message": "success"  // 响应消息
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 管理API（CMS系统）

### 认证说明

管理API需要在请求头中携带JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

### 1. 管理员登录

**接口地址**: `POST /api/admin/auth/login`

**描述**: 管理员登录获取访问令牌

**请求参数**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 3600,
    "user": {
      "id": "admin_001",
      "username": "admin",
      "role": "admin"
    }
  },
  "message": "登录成功"
}
```

### 2. 登出

**接口地址**: `POST /api/admin/auth/logout`

**描述**: 管理员登出

**请求头**: `Authorization: Bearer <token>`

**响应示例**:
```json
{
  "code": 200,
  "data": null,
  "message": "登出成功"
}
```

### 3. 猫咪管理

#### 3.1 获取猫咪列表

**接口地址**: `GET /api/admin/cats`

**描述**: 获取猫咪列表（包含所有管理信息）

**请求参数**: 与公开API相同，额外支持：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| include_hidden | boolean | 否 | 是否包含已隐藏的猫咪，默认false |

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "cats": [
      {
        "id": "cat_001",
        "name": "小花",
        "breed": "布偶猫",
        "breedEn": "Ragdoll",
        "birthday": "2023-01-15",
        "price": 2500,
        "images": [
          "http://localhost:5000/uploads/images/cat_001_1.jpg"
        ],
        "thumbnail": "http://localhost:5000/uploads/thumbnails/cat_001.jpg",
        "description": "一只非常温顺的布偶猫，长毛，蓝眼睛。需要注意饮食控制，已完成疫苗接种",
        "catcafeStatus": "working",
        "visible": true,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 50,
      "pages": 3
    }
  },
  "message": "success"
}
```

#### 3.2 创建猫咪

**接口地址**: `POST /api/admin/cats`

**描述**: 创建新的猫咪记录

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "name": "小花",
  "breed": "布偶猫",
  "breedEn": "Ragdoll",
  "birthday": "2023-01-15",
  "price": 2500,
  "images": ["http://localhost:5000/uploads/images/cat_001_1.jpg"],
  "thumbnail": "http://localhost:5000/uploads/thumbnails/cat_001.jpg",
  "description": "一只非常温顺的布偶猫",
  "catcafeStatus": "working",
  "visible": true
}
```

**响应示例**:
```json
{
  "code": 201,
  "data": {
    "id": "cat_001",
    "name": "小花",
    "breed": "布偶猫",
    "breedEn": "Ragdoll",
    "birthday": "2023-01-15",
    "price": 2500,
    "images": ["http://localhost:5000/uploads/images/cat_001_1.jpg"],
    "thumbnail": "http://localhost:5000/uploads/thumbnails/cat_001.jpg",
    "description": "一只非常温顺的布偶猫",
    "catcafeStatus": "working",
    "visible": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "message": "创建成功"
}
```

#### 3.3 获取猫咪详情

**接口地址**: `GET /api/admin/cats/{cat_id}`

**描述**: 获取猫咪详细信息（包含所有管理字段）

**请求头**: `Authorization: Bearer <token>`

**响应示例**: 与创建猫咪的响应格式相同，返回完整的猫咪信息

#### 3.4 更新猫咪

**接口地址**: `PUT /api/admin/cats/{cat_id}`

**描述**: 更新猫咪信息

**请求头**: `Authorization: Bearer <token>`

**请求参数**: 与创建猫咪相同，所有字段都是可选的


#### 3.5 删除猫咪

**接口地址**: `DELETE /api/admin/cats/{cat_id}`

**描述**: 删除猫咪记录

**请求头**: `Authorization: Bearer <token>`

**响应示例**:
```json
{
  "code": 200,
  "data": null,
  "message": "删除成功"
}
```

---

## 数据模型定义

### 猫咪数据模型

根据前端TypeScript接口定义，采用统一的数据模型，通过字段可见性控制不同端的数据展示。

#### 完整模型（Cat）

```json
{
  "id": "string",                    // 猫咪唯一标识 [必填]
  "name": "string",                  // 猫咪名称 [可选]
  "breed": "string",                 // 品种 [必填]
  "breedEn": "string",               // 英文品种名 [可选]
  "birthday": "string",              // 生日 (YYYY-MM-DD) [必填]
  "price": "number",                 // 价格 [可选]
  "images": ["string"],              // 图片URL列表 [必填]
  "thumbnail": "string",             // 缩略图URL [可选]
  "description": "string",           // 描述 [必填]

  // 猫咖工作信息（用于猫咖展示）
  "catcafeStatus": "string",         // 工作状态 [必填]

  // 系统管理字段
  "visible": "boolean",              // 是否公开显示 [管理端可见]
  "created_at": "datetime",          // 创建时间 [管理端可见]
  "updated_at": "datetime"           // 更新时间 [管理端可见]
}
```

#### 公开API可见字段（PublicCat）

公开API返回时，仅包含以下字段：

```json
{
  "id": "string",                    // 猫咪唯一标识
  "name": "string",                  // 猫咪名称
  "breed": "string",                 // 品种
  "breedEn": "string",               // 英文品种名
  "birthday": "string",              // 生日
  "images": ["string"],              // 图片URL列表
  "thumbnail": "string",             // 缩略图URL
  "description": "string",           // 描述
  "catcafeStatus": "string",         // 工作状态
}
```

#### 管理API可见字段（AdminCat）

管理API返回完整的猫咪信息，包含所有字段。

### 用户模型

```json
{
  "id": "string",                    // 用户ID
  "username": "string",              // 用户名
  "role": "string",                  // 角色 (admin)
  "created_at": "datetime",          // 创建时间
  "last_login": "datetime"           // 最后登录时间
}
```

---

## 错误处理

### 错误响应格式

```json
{
  "code": 400,
  "data": null,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "breed",
      "message": "品种不能为空"
    }
  ]
}
```

### 常见错误场景

1. **认证失败** (401):
   - Token未提供
   - Token已过期
   - Token无效

2. **权限不足** (403):
   - 普通用户访问管理接口

3. **资源不存在** (404):
   - 猫咪ID不存在
   - API路径错误

4. **参数验证失败** (400):
   - 必填字段缺失
   - 数据类型错误
   - 数据格式不正确

1·