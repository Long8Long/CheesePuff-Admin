/**
 * Mock 模块统一导出 / Guest mode mock entry
 *
 * 游客模式下，api.ts 的 adapter 会切换到 mockAdapter，
 * 所有请求路由到内存 MockDB，实现脱离后端的完整演示。
 */

export { mockAdapter } from './mock-adapter'
export { mockDB } from './mock-db'
