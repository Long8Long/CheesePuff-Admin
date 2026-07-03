# Plan: 复制猫咪功能设计

## 背景
猫咪管理页面（`features/cats`）目前支持增、删、改、查。新增"复制"功能，目的是让运营人员能基于一只已有猫咪快速创建相似的新记录（例如同窝兄弟、同品种不同个体），免去重复填写品种、价格、图片、描述等大量字段。

复制的核心矛盾在于：**媒体资源（图片/视频）如何处理**。当前 `Cat` 模型中 `images` / `videos` 是 `string[]` 的 URL 引用，这两条 URL 的处理策略决定了方案选型。

## Method A — 前端复制（复用 create 流程，零后端改动）⭐ 推荐

复制 = "把现有猫咪字段填进新增表单，用户确认/微调后提交为新记录"。本质是复用现有的 create 流程，只是初始数据来自源猫咪。

### 媒体资源策略
图片/视频 URL 直接复用（新旧猫咪引用同一个 URL），**不做物理拷贝**。因为当前模型就是 URL 引用，复制引用零成本，无需后端介入。

### 改动点（纯前端，4 个文件）

1. **`cats-provider.tsx`** — 对话框类型加 `'duplicate'`
   ```ts
   type CatsDialogType = 'create' | 'edit' | 'delete' | 'duplicate'
   ```

2. **`data-table-row-actions.tsx`** — 行操作菜单加"复制"项
   ```tsx
   <DropdownMenuItem onClick={() => { setCurrentRow(cat); setOpen('duplicate') }}>
     复制
     <DropdownMenuShortcut><Copy size={14} /></DropdownMenuShortcut>
   </DropdownMenuItem>
   ```

3. **`cats-dialogs.tsx`** — 挂载复制对话框，复用 `CatsMutateDialog`，传入新 prop 区分语义
   ```tsx
   <CatsMutateDialog
     key={`cat-duplicate-${currentRow.id}`}
     open={open === 'duplicate'}
     currentRow={currentRow}
     mode="duplicate"          // 新增 prop
     onOpenChange={...}
     onSuccess={handleSuccess}
   />
   ```

4. **`cats-mutate-dialog.tsx`** — 核心逻辑调整
   - 新增 `mode?: 'create' | 'edit' | 'duplicate'` prop
   - `mode === 'duplicate'` 时：
     - `useForm` 的 `defaultValues` 从 `currentRow` 取值
     - **清空名称字段**（或加 "(副本)" 后缀），避免用户忘记改名造成混淆
     - `images` / `videos` URL 直接复用，**不重新触发上传**
   - 提交走 `create` 分支（与新增完全一致，生成新 id），不走 `update`
   - 对话框标题显示 "复制猫咪"，提交按钮显示 "复制"

### 优点
- 零后端改动，纯前端即可上线
- 复用现有 create 流程和表单校验，改动最小
- 复制后用户进入表单确认/修改，比一键盲创建更安全（运营通常会改名称、价格）

### 风险 / 限制
- ⚠️ **媒体 URL 共享**：新旧猫咪引用同一图片/视频 URL。只要不存在"删除猫咪时连带物理删除媒体文件"的逻辑，就不会出问题。
- 若未来引入"删猫咪即删其媒体文件"的逻辑，共享 URL 会导致副本图片失效。届时需升级到 Method B。

---

## Method B — 后端专用接口（深拷贝）

新增后端接口 `POST /api/v1/admin/cats/:id/duplicate`，由后端负责读取源记录、创建新记录、处理媒体资源，返回新 Cat。

### 媒体资源策略
后端物理拷贝媒体文件（如 S3 对象复制），让新旧猫咪各自拥有独立的媒体副本。

### 改动点

1. **后端**（不在本仓库）— 新增 `POST /api/v1/admin/cats/:id/duplicate` 端点
   - 读取源猫咪记录
   - 可选：物理复制媒体文件（S3 CopyObject），生成新 URL
   - 创建新记录（清空名称或加后缀，生成新 id）
   - 可选：复制关联子数据（体检记录、预约记录等关联实体）
   - 返回新 Cat

2. **`cats.service.ts`** — 新增 service 方法
   ```ts
   duplicate: async (id: string): Promise<Cat> => {
     const { data } = await api.post<Cat>(`/api/v1/admin/cats/${id}/duplicate`)
     return data
   }
   ```

3. **`cats-provider.tsx` / `data-table-row-actions.tsx`** — 同 Method A，加复制入口

4. **`cats-mutate-dialog.tsx`** — 不再需要表单确认环节（一键复制），改为：
   - 点击"复制"后直接调用 `catsService.duplicate(id)`
   - 成功后 toast 提示并刷新列表
   - 可选：弹出确认框 `确认复制该猫咪？`

### 适用场景
- 需要物理拷贝媒体文件，让新旧猫咪媒体资源独立可删
- 需要复制关联的子数据（体检记录、预约记录等）
- 名称唯一性校验需要在服务端兜底
- 希望一键复制、无需中间确认表单

### 优点
- 媒体资源彻底独立，无共享 URL 的隐患
- 可复制关联子数据，适合复杂业务场景
- 一键复制，操作更快

### 缺点
- 需要后端开发，跨端协作成本高
- 物理拷贝大文件（视频）耗时，需考虑异步/进度提示
- 一键复制容易产生重复脏数据，缺少用户确认环节

---

## 方案对比

| 维度 | Method A（前端复制） | Method B（后端接口） |
|------|---------------------|---------------------|
| 后端改动 | 无 | 新增端点 |
| 媒体资源 | URL 引用共享 | 物理拷贝，独立 |
| 用户交互 | 弹表单确认/修改 | 一键复制（可选确认框） |
| 适用模型 | 仅 URL 引用 | 需独立资源 + 关联子数据 |
| 上线速度 | 快（纯前端） | 慢（跨端协作） |
| 未来隐患 | 删猫咪删文件会失效 | 无 |

---

## TODO
- [ ] 1. 确定采用哪种方案（A / B）
- [ ] 2. 如选 A：实现前端 4 个文件改动
- [ ] 3. 如选 B：与后端对齐接口契约后实现
- [ ] 4. 测试：复制后字段正确填充、提交生成新记录、媒体显示正常

## Acceptance Criteria
- 用户可从猫咪列表行操作菜单触发"复制"
- 复制的新记录包含源猫咪的全部业务字段（品种、价格、图片、视频、描述等）
- 新记录的 id、创建时间为新生成值，不与源记录冲突
- 名称字段在复制时清空或加"(副本)"后缀，提示用户修改
- 复制后的新记录与源记录相互独立，修改其一不影响另一个
