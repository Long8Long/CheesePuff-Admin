# AI 智能填充前端实现方案（React）

## 概述

前端实现基于后端提供的通用 AI 填充 API，使用 TypeScript 的 `Pick` 工具类型确保类型安全。

---

## 实现步骤

### Step 2.1: 创建 TypeScript 类型定义

使用 TypeScript 的 `Pick` 工具类型从基础表单类型派生 AI 填充结果类型：

```typescript
// src/types/form.ts

// 基础表单类型（与后端 Schema 对应）
export interface CatFormData {
  name: string | null
  breed: string
  store_id: string | null
  birthday: string  // YYYY-MM-DD
  price: number | null
  description: string | null
  catcafe_status: string
  visible: boolean
  images?: string[]
  thumbnail?: string | null
}

export interface StoreFormData {
  name: string
  is_active: boolean
}

// 使用 Pick 派生 AI 填充结果类型
// AI 可填充的字段子集
export type CatAIFillResult = Pick<CatFormData,
  | 'name'
  | 'breed'
  | 'store_id'
  | 'birthday'
  | 'price'
  | 'description'
  | 'catcafe_status'
  | 'visible'
>

// 店铺表单的 AI 填充结果
export type StoreAIFillResult = Pick<StoreFormData, 'name' | 'is_active'>

// 辅助函数：将 AI 结果应用到表单
export function applyAIResultToForm<T>(
  form: { setValue: (key: string, value: any) => void },
  result: T
) {
  Object.entries(result).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      form.setValue(key, value)
    }
  })
}
```

**使用示例：**

```typescript
import { CatFormData, CatAIFillResult, applyAIResultToForm } from '@/types/form'

// 在组件中使用
const { fill } = useAIFormFill()

const handleAIFill = async () => {
  const result = await fill('cats', userInput) as CatAIFillResult
  applyAIResultToForm(form, result)
}

// 或者手动映射特定字段
const handleAIFill = async () => {
  const result = await fill('cats', userInput) as CatAIFillResult

  if (result.name) form.setValue('name', result.name)
  if (result.breed) form.setValue('breed', result.breed)
  if (result.store_id) form.setValue('store_id', result.store_id)
  // ...
}
```

**优势：**
- 类型安全：AI 返回结果自动类型化
- 可维护：基础类型变更时自动同步
- 可读性：明确哪些字段支持 AI 填充

---

### Step 2.2: 创建通用 Hook

```typescript
// src/hooks/use-ai-form-fill.ts
import { useState } from 'react'
import { api } from '@/lib/api'

export interface FormSchema {
  type: string
  label: string
  options_key?: string
  options_source?: string
}

export interface FormFillRequest {
  form_type: string
  text: string
}

export interface FormFillResponse {
  [key: string]: any
}

export function useAIFormFill() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fill = async (formType: string, text: string): Promise<FormFillResponse> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/api/v1/ai/form/fill', {
        form_type: formType,
        text,
      })
      return response.data.data
    } catch (err: any) {
      const message = err.response?.data?.message || 'AI 填充失败'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const getSchemas = async () => {
    const response = await api.get('/api/v1/ai/form/schemas')
    return response.data.data.forms
  }

  return { fill, getSchemas, loading, error }
}
```

---

### Step 2.3: 猫咪表单接入示例

```typescript
// 在猫咪表单组件中使用
const { fill, loading } = useAIFormFill()

const handleAIFill = async () => {
  const result = await fill('cats', userInput)
  form.setValue('name', result.name)
  form.setValue('breed', result.breed)
  form.setValue('store_id', result.store_id)
  form.setValue('birthday', result.birthday)
  form.setValue('price', result.price)
  form.setValue('description', result.description)
  form.setValue('catcafe_status', result.catcafe_status)
  form.setValue('visible', result.visible)
}
```

---

## 迁移路径

1. **Phase 1**: 后端新增泛化 AI 填充 API
2. **Phase 2**: 前端创建 `useAIFormFill` Hook
3. **Phase 3**: 猫咪表单对接新 API
4. **Phase 4**: 移除前端硬编码配置
5. **Phase 5**: 扩展到其他表单（店铺、商品等）

---

## 现有前端实现（参考）

已废弃，保留作为迁移参考。

```typescript
/**
 * 调用 AI API 解析猫咪信息（支持多提供商）
 */
export async function parseCatInfoWithAI(
  input: CatAIFillInput,
  provider?: AIProvider
): Promise<CatAIOutput> {
  const config = getAIConfig(provider)

  const breedList = breeds.map((b) => b.value).join('、')

  const systemPrompt = `你是一个专业的猫咖信息录入助手。请从用户输入中提取猫咪信息，返回 JSON 格式。

## 字段说明
- name: 猫咪名字，如"小咪"、"团子"
- breed: 必须从以下品种中选择：${breedList}
- store: 店铺信息（山东店/苏州店）
  - 提到"山东店"、"山东" → 山东店
  - 提到"苏州店"、"苏州"、"苏州店" → 苏州店
  - 未明确提到店铺时 → 默认山东店
  - 注意：品种名称中的"苏州店"仅表示品种，不代表店铺
- birthday: 转换为 YYYY-MM-DD 格式
  - "2岁" → 推算为当前日期-2年
  - "2023年8月" → 2023-08-01
  - "去年5月" → 去年-05-01
  - "8个月" → 当前日期-8个月
  - "2025/6/8" → 2025-06-08
- price: 提取数字价格
- description: 猫咪的详细描述（驱虫疫苗、性格特点、健康状况等所有描述性文字）
- catcafeStatus: 根据关键词判断，直接返回中文状态
  - 工作中/在店/上班/在售 → 工作中
  - 休息/休假/休息中/生病/不舒服 → 休息中
  - 怀孕/哺乳/带娃 → 怀孕中
- visible: "在售"、"可接"表示可见，默认 true

## 重要规则
1. 店铺和品种是独立的：品种名称带"苏州店"不代表就是苏州店
2. 除指定字段外，其他所有描述性文字都放入 description
3. 无法提取的字段请设置为 null（JSON 中的 null，不要删除字段）

## 返回格式
只返回 JSON 对象，不要有任何其他文字说明。

## 示例
输入："山东店。短毛金点弟弟（苏州店）2025/6/8 驱虫疫苗齐全 眼睛大，体格壮，会趴肩膀，喜欢贴人睡觉 在售 3000元 休息中 现猫随时可接。"

输出：
{
  "name": null,
  "breed": "短毛金点弟弟",
  "store": "山东店",
  "birthday": "2025-06-08",
  "price": 3000,
  "description": "驱虫疫苗齐全 眼睛大，体格壮，会趴肩膀，喜欢贴人睡觉 现猫随时可接",
  "catcafeStatus": "休息中",
  "visible": true
}`

  const userContent = `请从以下文本中提取猫咪信息：\n\n${input.text || ''}`

  try {
    const response = await fetch(config.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: config.temperature,
        top_p: config.topP,
        max_tokens: config.maxTokens,
        // 百炼使用 result_format，智谱使用 response_format
        ...(config.provider === 'bailian'
          ? { result_format: 'message' }
          : { response_format: { type: 'json_object' } }),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`${config.provider === 'bailian' ? '百炼' : '智谱 AI'} API 错误: ${response.status} - ${errorText}`)
    }

    const data: AIResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error(`${config.provider === 'bailian' ? '百炼' : '智谱 AI'} 返回内容为空`)
    }

    // 解析 JSON
    const parsed = JSON.parse(content)

    // 处理 birthday（如果是相对时间，需要计算）
    if (parsed.birthday && !parsed.birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
      parsed.birthday = calculateBirthday(parsed.birthday)
    }

    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI 返回的 JSON 格式错误，请重试')
    }
    throw error
  }
}
```

  