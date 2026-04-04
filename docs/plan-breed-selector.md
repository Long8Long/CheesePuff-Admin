# Plan: 品种选择器支持直接编辑、点选与首字联想筛选

## 背景
当前品种选择器使用 `SelectDropdown`（Radix Select），仅支持下拉点选，不支持输入编辑和搜索过滤。

## Method A — Shadcn Combobox 模式（Command + Popover）⭐ 推荐
- 将品种字段从 `SelectDropdown` 替换为 Combobox（已有 `command.tsx` 组件）
- Combobox 内置 cmdk 搜索引擎，输入首字即自动过滤列表
- 支持直接输入自定义品种名（输入的值不在列表中时作为新值使用）
- 保留 "添加新品种" 按钮
- 改动范围：`cats-mutate-dialog.tsx` 中品种字段 + 新建 `ComboboxField` 组件

## Method B — 改造 SelectDropdown 组件
- 改造 `select-dropdown.tsx`，内部用 Popover + Input 替换 Radix Select
- Input 用于直接编辑和首字过滤，Popover 内展示过滤后的选项列表
- 保持 `SelectDropdown` 的 props API 不变，所有调用方无需修改
- 改动范围：仅 `select-dropdown.tsx`，影响全局所有使用处
- 风险：改动全局组件，可能影响其他 Select 使用场景

## Method C — Input + Select 双控件并排
- 保留现有 `SelectDropdown`，旁边新增一个 Input 输入框
- 用户可选择从下拉列表点选，也可直接在 Input 中输入品种名
- Input 的值实时同步到 form 的 breed 字段，Select 选择时也同步到 Input
- 首字过滤：Input 的 `onInput` 事件过滤一个浮层列表
- 改动范围：仅 `cats-mutate-dialog.tsx` 中品种字段的 UI 布局
- 缺点：双控件交互不够优雅

## TODO
- [ ] 1. 确定采用哪种方案
- [ ] 2. 实现品种选择器组件
- [ ] 3. 替换 `cats-mutate-dialog.tsx` 中的品种字段
- [ ] 4. 测试：直接编辑、下拉点选、首字联想筛选三种交互

## Acceptance Criteria
- 用户可以直接在输入框中输入品种名（自由文本编辑）
- 用户可以点击下拉箭头展开品种列表进行点选
- 用户输入首字时，列表自动过滤为匹配项
- 输入的值不在列表中时，可作为新品种使用
- "添加新品种"功能仍然可用
- 编辑模式（update）下能正确回显已有品种
