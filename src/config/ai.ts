/**
 * AI Service Configuration
 *
 * 配置各种 AI 服务的 API 密钥和端点
 */

/**
 * 智谱 AI 配置
 * 获取 API Key: https://open.bigmodel.cn/usercenter/apikeys
 */
export const zhipuAIConfig = {
  apiKey: import.meta.env.VITE_ZHIPU_API_KEY || '',
  apiURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  model: 'glm-4.7-flash',
  temperature: 0.3,
  topP: 0.7,
  maxTokens: 1024,
} as const

/**
 * 阿里云百炼配置
 * 获取 API Key: https://bailian.console.aliyun.com/
 */
export const bailianAIConfig = {
  apiKey: import.meta.env.VITE_BAILIAN_API_KEY || '',
  apiURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-turbo-latest',
  temperature: 0.3,
  topP: 0.7,
  maxTokens: 1024,
} as const

/**
 * AI 服务提供商类型
 */
export type AIProvider = 'zhipu' | 'bailian'

/**
 * AI 服务配置映射
 */
export const aiProviderConfigs = {
  zhipu: zhipuAIConfig,
  bailian: bailianAIConfig,
} as const

/**
 * 默认 AI 服务提供商
 */
export const defaultAIProvider: AIProvider = 'zhipu'

/**
 * 当前选择的 AI 服务提供商（从环境变量读取）
 */
export function getCurrentAIProvider(): AIProvider {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'zhipu'
  if (provider !== 'zhipu' && provider !== 'bailian') {
    // Unknown provider, falling back to zhipu
    return 'zhipu'
  }
  return provider as AIProvider
}

/**
 * 获取当前 AI 提供商的配置
 */
export function getAIConfig(provider?: AIProvider) {
  const currentProvider = provider || getCurrentAIProvider()
  const config = aiProviderConfigs[currentProvider]

  if (!config.apiKey) {
    const providerNames = {
      zhipu: '智谱 AI',
      bailian: '阿里云百炼',
    }
    const urls = {
      zhipu: 'https://open.bigmodel.cn/usercenter/apikeys',
      bailian: 'https://bailian.console.aliyun.com/',
    }
    throw new Error(
      `${providerNames[currentProvider]} API Key 未配置。\n` +
      `请在 .env 文件中设置 VITE_${currentProvider.toUpperCase()}_API_KEY\n` +
      `获取 API Key: ${urls[currentProvider]}`
    )
  }

  return { ...config, provider: currentProvider }
}

/**
 * 验证 AI 配置是否完整
 */
export function validateAIConfig(provider?: AIProvider): boolean {
  try {
    getAIConfig(provider)
    return true
  } catch {
    return false
  }
}
