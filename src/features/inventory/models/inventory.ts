export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  unitPrice: number
  totalValue: number
  status: 'normal' | 'warning' | 'urgent'
  threshold?: number
}

export type InventoryFormData = Pick<
  InventoryItem,
  'name' | 'category' | 'currentStock' | 'unitPrice' | 'threshold'
>
