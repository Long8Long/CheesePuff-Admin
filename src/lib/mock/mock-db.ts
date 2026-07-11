/**
 * Mock Database / 内存数据库
 *
 * 游客模式下的内存数据源。模块加载时用 faker 初始化一次，
 * CRUD 操作直接修改内存数组，刷新页面后重建（数据恢复初始态）。
 *
 * 字段命名一律 camelCase，返回时由 mock-adapter 包成 { code, data }
 * 标准格式，再经 api.ts 响应拦截器 camelize（已是 camel 不变）+ 解包，
 * 与真实后端数据形态完全一致。
 */

import { faker } from '@faker-js/faker'
import { cats as seedCats } from '@/features/cats/data/cats'
import { breeds as breedOptions, stores as storeOptions, catCafeStatuses } from '@/features/cats/data/data'
import type {
  Cat,
  GetCatsListParams,
  PaginatedResponse,
} from '@/features/cats/models'
import type { CatCreate, CatUpdate } from '@/features/cats/models/cat-api.types'
import type { Store } from '@/features/settings/store-management/models/store.types'
import type {
  GetStoresListParams,
  PaginatedStoreResponse,
  StoreCreate,
  StoreUpdate,
} from '@/features/settings/store-management/models/store-api.types'
import type { CatBreed, CatStatus } from '@/features/settings/cattery-config/models/cattery.types'
import type {
  CatBreedCreate,
  CatBreedUpdate,
  CatStatusCreate,
  CatStatusUpdate,
} from '@/features/settings/cattery-config/models/cattery-api.types'
import type { Config } from '@/features/settings/cattery-config/models/config.types'
import type {
  GetConfigsListParams,
  GetConfigsListResponse,
  ConfigUpdate,
} from '@/features/settings/cattery-config/models/config-api.types'

faker.seed(12345)

/**
 * 深拷贝纯数据（避免修改种子源数据）
 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * 生成 ISO 时间戳
 */
function nowISO(): string {
  return new Date().toISOString()
}

// ============================================
// Mock Database / 内存数据库
// ============================================

class MockDB {
  cats: Cat[] = []
  stores: Store[] = []
  breeds: CatBreed[] = []
  statuses: CatStatus[] = []
  configs: Config[] = []

  constructor() {
    this.init()
  }

  /**
   * 初始化数据（深拷贝，避免污染模块级种子数据）
   */
  private init() {
    // ─── Cats：复用现有 faker 生成器（50 条） ───
    this.cats = clone(seedCats)

    // ─── Stores：参考 data.ts 的门店，补全 Store 类型字段 ───
    const seedStoreDefs = [
      { name: '山东店', type: 'main' as const, isActive: true },
      { name: '苏州店', type: 'branch' as const, isActive: true },
    ]
    this.stores = seedStoreDefs.map((def, i) => ({
      id: `store_${i + 1}`,
      name: def.name,
      type: def.type,
      phone: faker.phone.number(),
      wechat: `wechat_${faker.string.alphanumeric(8)}`,
      address: faker.location.streetAddress({ useFullAddress: true }),
      businessHours: '09:00 - 21:00',
      description: '欢迎光临我们的猫咖门店',
      isActive: def.isActive,
      location: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }))

    // ─── Breeds：参考 data.ts 的品种列表 ───
    this.breeds = breedOptions.map((b, i) => ({
      id: `breed_${i + 1}`,
      name: b.value,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }))

    // ─── Statuses：参考 data.ts 的工作状态列表 ───
    this.statuses = catCafeStatuses.map((s, i) => ({
      id: `status_${i + 1}`,
      name: s.value,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }))

    // ─── Configs：常见系统配置项 ───
    this.configs = [
      {
        id: 'config_1',
        key: 'site_name',
        value: 'CheesePuff 猫咖管理系统',
        description: '站点名称',
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      },
      {
        id: 'config_2',
        key: 'max_cats_per_store',
        value: 50,
        description: '每个门店最大猫咪数量',
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      },
      {
        id: 'config_3',
        key: 'business_hours',
        value: '09:00 - 21:00',
        description: '营业时间',
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      },
    ]
  }

  // ============================================
  // Cats CRUD
  // ============================================

  listCats(params: GetCatsListParams): PaginatedResponse<Cat> {
    let result = [...this.cats]

    // 过滤
    if (params.breed) result = result.filter((c) => c.breed === params.breed)
    if (params.catcafeStatus)
      result = result.filter((c) => c.catcafeStatus === params.catcafeStatus)
    if (!params.includeHidden) result = result.filter((c) => c.visible)

    // 分页
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const total = result.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const paged = result.slice((page - 1) * pageSize, page * pageSize)

    return {
      cats: paged,
      pagination: { total, page, pageSize, totalPages },
    }
  }

  findCat(id: string): Cat | undefined {
    return this.cats.find((c) => c.id === id)
  }

  createCat(data: CatCreate): Cat {
    const now = nowISO()
    const newCat: Cat = {
      id: `cat_${Date.now()}`,
      name: data.name ?? null,
      breed: data.breed,
      storeName: data.storeName ?? storeOptions[0].value,
      birthday: data.birthday ?? null,
      price: data.price ?? null,
      images: data.images ?? null,
      videos: data.videos ?? null,
      idCardImage: data.idCardImage ?? null,
      description: data.description ?? null,
      catcafeStatus: data.catcafeStatus ?? '工作中',
      visible: true,
      createdAt: now,
      updatedAt: now,
    }
    this.cats.unshift(newCat)
    return newCat
  }

  updateCat(id: string, data: CatUpdate): Cat | undefined {
    const idx = this.cats.findIndex((c) => c.id === id)
    if (idx === -1) return undefined
    this.cats[idx] = {
      ...this.cats[idx],
      ...(data as Partial<Cat>),
      updatedAt: nowISO(),
    }
    return this.cats[idx]
  }

  removeCat(id: string): void {
    this.cats = this.cats.filter((c) => c.id !== id)
  }

  bulkRemoveCats(ids: string[]): void {
    this.cats = this.cats.filter((c) => !ids.includes(c.id))
  }

  // ============================================
  // Stores CRUD
  // ============================================

  listStores(params: GetStoresListParams): PaginatedStoreResponse {
    let result = [...this.stores]
    if (params.activeOnly) result = result.filter((s) => s.isActive)

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const total = result.length
    const pages = Math.ceil(total / pageSize) || 1
    const paged = result.slice((page - 1) * pageSize, page * pageSize)

    return {
      stores: paged,
      pagination: { page, pageSize, total, pages },
    }
  }

  findStore(id: string): Store | undefined {
    return this.stores.find((s) => s.id === id)
  }

  createStore(data: StoreCreate): Store {
    const now = nowISO()
    const newStore: Store = {
      id: `store_${Date.now()}`,
      name: data.name,
      type: data.type ?? 'branch',
      phone: data.phone ?? null,
      wechat: data.wechat ?? null,
      address: data.address ?? null,
      businessHours: data.businessHours ?? null,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
      location: data.location ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.stores.unshift(newStore)
    return newStore
  }

  updateStore(id: string, data: StoreUpdate): Store | undefined {
    const idx = this.stores.findIndex((s) => s.id === id)
    if (idx === -1) return undefined
    this.stores[idx] = {
      ...this.stores[idx],
      ...(data as Partial<Store>),
      updatedAt: nowISO(),
    }
    return this.stores[idx]
  }

  removeStore(id: string): void {
    this.stores = this.stores.filter((s) => s.id !== id)
  }

  bulkRemoveStores(ids: string[]): void {
    this.stores = this.stores.filter((s) => !ids.includes(s.id))
  }

  // ============================================
  // Cat Breeds CRUD
  // ============================================

  listBreeds(): CatBreed[] {
    return [...this.breeds]
  }

  createBreed(data: CatBreedCreate): CatBreed {
    const now = nowISO()
    const newBreed: CatBreed = {
      id: `breed_${Date.now()}`,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    }
    this.breeds.push(newBreed)
    return newBreed
  }

  updateBreed(id: string, data: CatBreedUpdate): CatBreed | undefined {
    const idx = this.breeds.findIndex((b) => b.id === id)
    if (idx === -1) return undefined
    this.breeds[idx] = {
      ...this.breeds[idx],
      ...data,
      updatedAt: nowISO(),
    }
    return this.breeds[idx]
  }

  removeBreed(id: string): void {
    this.breeds = this.breeds.filter((b) => b.id !== id)
  }

  // ============================================
  // Cat Statuses CRUD
  // ============================================

  listStatuses(): CatStatus[] {
    return [...this.statuses]
  }

  createStatus(data: CatStatusCreate): CatStatus {
    const now = nowISO()
    const newStatus: CatStatus = {
      id: `status_${Date.now()}`,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    }
    this.statuses.push(newStatus)
    return newStatus
  }

  updateStatus(id: string, data: CatStatusUpdate): CatStatus | undefined {
    const idx = this.statuses.findIndex((s) => s.id === id)
    if (idx === -1) return undefined
    this.statuses[idx] = {
      ...this.statuses[idx],
      ...data,
      updatedAt: nowISO(),
    }
    return this.statuses[idx]
  }

  removeStatus(id: string): void {
    this.statuses = this.statuses.filter((s) => s.id !== id)
  }

  // ============================================
  // Configs
  // ============================================

  listConfigs(params: GetConfigsListParams): GetConfigsListResponse {
    let result = [...this.configs]
    if (params.key) result = result.filter((c) => c.key === params.key)
    return {
      configs: result,
      total: result.length,
    }
  }

  findConfig(key: string): Config | undefined {
    return this.configs.find((c) => c.key === key)
  }

  updateConfig(key: string, data: ConfigUpdate): Config | undefined {
    const idx = this.configs.findIndex((c) => c.key === key)
    if (idx === -1) return undefined
    this.configs[idx] = {
      ...this.configs[idx],
      value: data.value,
      description: data.description,
      updated_at: nowISO(),
    }
    return this.configs[idx]
  }
}

// 单例
export const mockDB = new MockDB()
