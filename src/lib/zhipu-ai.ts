import type { CatAIOutput, CatAIFillInput } from '@/features/cats/data/ai-schema'
import { breeds } from '@/features/cats/data/data'
import { getAIConfig, type AIProvider } from '@/config/ai'

/**
 * AI 服务响应类型（兼容 OpenAI 格式）
 */
interface AIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

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
- catcafeStatus: 根据关键词判断
  - 工作中/在店/上班/在售 → working
  - 休息/休假/休息中 → resting
  - 生病/不舒服 → sick
  - 退休/不干了 → retired
  - 怀孕/怀着 → pregnant
  - 哺乳/带娃 → nursing
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
  "catcafeStatus": "resting",
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

/**
 * 计算生日（从相对时间描述）
 */
function calculateBirthday(desc: string): string {
  const now = new Date()

  // 匹配 "X岁"
  const ageMatch = desc.match(/(\d+)\s*岁/)
  if (ageMatch) {
    const age = Number.parseInt(ageMatch[1], 10)
    const date = new Date(now)
    date.setFullYear(date.getFullYear() - age)
    return date.toISOString().split('T')[0]
  }

  // 匹配 "X个月"
  const monthMatch = desc.match(/(\d+)\s*个?月/)
  if (monthMatch) {
    const months = Number.parseInt(monthMatch[1], 10)
    const date = new Date(now)
    date.setMonth(date.getMonth() - months)
    return date.toISOString().split('T')[0]
  }

  // 默认返回今天
  return now.toISOString().split('T')[0]
}
