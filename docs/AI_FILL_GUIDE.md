# AI 智能填充功能说明

## 功能概述

猫咪管理页面的添加表单现在支持 **AI 智能填充**功能，可以通过一段文字描述自动提取猫咪的各项信息。

## 支持的 AI 服务提供商

| 提供商 | 标识 | 模型 | 说明 |
|--------|------|------|------|
| 智谱 AI | `zhipu` | glm-4.7-flash | 默认使用 |
| 阿里云百炼 | `bailian` | qwen-plus | 可选 |

## 使用方式

### 1. 配置 API Key

在项目根目录创建 `.env` 文件，选择以下任一方式配置：

#### 方式一：使用智谱 AI（默认）

```bash
# 选择 AI 服务提供商（可选，默认为 zhipu）
VITE_AI_PROVIDER=zhipu

# 智谱 AI API Key
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here
```

获取智谱 AI API Key：
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/usercenter/apikeys)
2. 注册/登录账号
3. 创建新的 API Key
4. 复制到 `.env` 文件

#### 方式二：使用阿里云百炼

```bash
# 选择 AI 服务提供商
VITE_AI_PROVIDER=bailian

# 阿里云百炼 API Key
VITE_BAILIAN_API_KEY=your_bailian_api_key_here
```

获取百炼 API Key：
1. 访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 开通服务并创建 API Key
3. 复制到 `.env` 文件

### 2. 使用 AI 填充

打开添加猫咪表单，有两个 Tab：

- **✍️ 手动填写** - 传统的手动输入方式
- **✨ AI 快速填充** - AI 智能解析文字描述

切换到 "AI 快速填充" Tab，输入一段描述文字：

**示例输入：**
```
我有一只叫"团子"的布偶猫，2岁了，性格很温顺，想卖2800元，已经在店里工作了。
```

点击 "AI 智能填充" 按钮，AI 会自动提取并填充以下字段：
- 名称 → 团子
- 品种 → 布偶猫
- 生日 → 2023-XX-XX (根据年龄推算)
- 价格 → 2800
- 描述 → 性格很温顺
- 工作状态 → working

### 3. 确认并编辑

AI 填充完成后，会自动切换到 "手动填写" Tab，显示：

- 已填充的字段带有 ✨ AI 标识
- 顶部显示 "AI 已填充 N 个字段" 提示
- 可以手动修改任何字段
- 点击 "重置" 按钮清除 AI 填充的内容

## 技术实现

### 文件结构

```
src/
├── config/
│   └── ai.ts                     # AI 服务配置（多提供商支持）
├── features/cats/
│   ├── data/
│   │   └── ai-schema.ts          # AI 输出 Schema 定义
│   └── components/
│       ├── cats-ai-fill-tab.tsx  # AI 填充 Tab 组件
│       └── cats-mutate-dialog.tsx # 修改：添加 Tab 切换
└── lib/
    └── zhipu-ai.ts               # AI API 调用（支持多提供商）
```

### 支持的字段

| 字段 | AI 提取 | 说明 |
|------|---------|------|
| name | ✅ | 猫咪名称 |
| breed | ✅ | 从15个预设品种中选择 |
| breedEn | ✅ | 品种英文名（可选） |
| birthday | ✅ | 支持多种日期表达 |
| price | ✅ | 提取数字价格 |
| description | ✅ | 从描述中提取 |
| catcafeStatus | ✅ | 根据关键词判断 |
| visible | ✅ | 默认 true |
| images | ❌ | 需手动输入 |

### 日期表达支持

- "2岁" → 当前日期 - 2年
- "8个月" → 当前日期 - 8个月
- "2023年8月" → 2023-08-01
- "去年5月" → 去年-05-01

### 状态关键词识别

| 关键词 | 对应状态 |
|--------|----------|
| 工作中/在店/上班 | working |
| 休息/休假 | resting |
| 生病/不舒服 | sick |
| 退休/不干了 | retired |
| 怀孕/怀着 | pregnant |
| 哺乳/带娃 | nursing |

## API 说明

### 智谱 AI

- **端点**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **模型**: `glm-4.7-flash`
- **响应格式**: JSON (结构化输出)
- **成本**: 免费/低价（详见[智谱定价](https://open.bigmodel.cn/pricing)）

### 阿里云百炼

- **端点**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- **模型**: `qwen-plus`
- **响应格式**: OpenAI 兼容格式
- **成本**: 按 Token 计费（详见[百炼定价](https://www.aliyun.com/price/product#/baiyunDetail)）

## UI 设计

### Tab 切换式交互

```
┌─────────────────────────────────────────┐
│ 添加猫咪                         [X]    │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ✍️ 手动填写  │  ✨ AI 快速填充      │ │  ← Tab 切换
│ └─────────────────────────────────────┘ │
│                                          │
│ [表单内容 / AI 输入框]                   │
│                                          │
│              [取消]     [添加]           │
└─────────────────────────────────────────┘
```

### 响应式设计

- **桌面端**: 宽屏 Dialog，Tab 横向排列
- **移动端**: 全屏 Dialog，紧凑布局

## 错误处理

- API Key 未配置 → 显示错误提示
- 网络请求失败 → 显示具体错误信息
- AI 返回格式错误 → 提示重新尝试
- 输入为空 → 验证提示

## 切换 AI 提供商

修改 `.env` 文件中的 `VITE_AI_PROVIDER` 变量：

```bash
# 使用智谱 AI
VITE_AI_PROVIDER=zhipu

# 或使用阿里云百炼
VITE_AI_PROVIDER=bailian
```

重启开发服务器后生效。

## 注意事项

1. **API Key 安全**:
   - 生产环境应通过后端代理 API 调用，避免暴露 Key
   - 不要将 `.env` 文件提交到 Git

2. **数据验证**: AI 填充后仍需人工确认，确保准确性

3. **网络依赖**: 需要稳定的网络连接

4. **成本控制**:
   - 智谱 AI 有免费额度
   - 百炼按 Token 计费
   - 建议监控使用量

## 后续优化建议

- [ ] 支持图片上传 + AI 识别品种
- [ ] 添加 AI 填充历史记录
- [ ] 支持批量 AI 填充
- [ ] 优化 Prompt 提高准确率
- [ ] 添加本地规则引擎作为兜底方案
- [ ] 支持更多 AI 提供商（如 OpenAI、Claude）
