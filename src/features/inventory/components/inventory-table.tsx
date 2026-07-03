'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, PackageMinus, PackagePlus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InventoryFormDialog } from './inventory-form-dialog'
import { InventoryDeleteDialog } from './inventory-delete-dialog'
import {
  inventoryData,
  productCategories,
  statusColorMap,
  stockStatuses,
} from '../data/mock-data'
import type { InventoryItem, InventoryFormData } from '../models/inventory'

export function InventoryTable() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [data, setData] = useState<InventoryItem[]>(inventoryData)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<InventoryItem | null>(null)

  const filteredData = data.filter((item) => {
    const matchCategory =
      categoryFilter === 'all' || item.category === categoryFilter
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchCategory && matchStatus
  }) as InventoryItem[]

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常'
      case 'warning':
        return '预警'
      case 'urgent':
        return '紧急'
      default:
        return '未知'
    }
  }

  const calculateStatus = (
    currentStock: number,
    threshold?: number
  ): 'normal' | 'warning' | 'urgent' => {
    if (!threshold) return 'normal'
    if (currentStock <= threshold * 0.5) return 'urgent'
    if (currentStock <= threshold) return 'warning'
    return 'normal'
  }

  const handleAdd = (formData: InventoryFormData) => {
    const newItem: InventoryItem = {
      id: `P${String(data.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      currentStock: formData.currentStock,
      unitPrice: formData.unitPrice,
      totalValue: formData.currentStock * formData.unitPrice,
      threshold: formData.threshold,
      status: calculateStatus(formData.currentStock, formData.threshold),
    }
    setData([...data, newItem])
    toast.success(`已添加商品: ${formData.name}`)
  }

  const handleEdit = (formData: InventoryFormData) => {
    if (!currentRow) return

    const updatedItem: InventoryItem = {
      ...currentRow,
      name: formData.name,
      category: formData.category,
      currentStock: formData.currentStock,
      unitPrice: formData.unitPrice,
      totalValue: formData.currentStock * formData.unitPrice,
      threshold: formData.threshold,
      status: calculateStatus(formData.currentStock, formData.threshold),
    }

    setData(
      data.map((item) => (item.id === currentRow.id ? updatedItem : item))
    )
    toast.success(`已更新商品: ${formData.name}`)
  }

  const handleDelete = () => {
    if (!currentRow) return
    setData(data.filter((item) => item.id !== currentRow.id))
  }

  const handleInbound = (item: InventoryItem) => {
    const newStock = item.currentStock + 10
    const updatedItem = {
      ...item,
      currentStock: newStock,
      totalValue: newStock * item.unitPrice,
      status: calculateStatus(newStock, item.threshold),
    }
    setData(
      data.map((i) => (i.id === item.id ? updatedItem : i))
    )
    toast.success(`已入库: ${item.name} (+10)`)
  }

  const handleOutbound = (item: InventoryItem) => {
    if (item.currentStock <= 0) {
      toast.error(`库存不足: ${item.name}`)
      return
    }
    const newStock = item.currentStock - 1
    const updatedItem = {
      ...item,
      currentStock: newStock,
      totalValue: newStock * item.unitPrice,
      status: calculateStatus(newStock, item.threshold),
    }
    setData(
      data.map((i) => (i.id === item.id ? updatedItem : i))
    )
    toast.success(`已出库: ${item.name} (-1)`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>库存明细</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setCurrentRow(null)
                  setAddOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                添加商品
              </Button>

              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {productCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {stockStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead className="text-center">当前库存</TableHead>
                <TableHead className="text-right">单价</TableHead>
                <TableHead className="text-right">总价值</TableHead>
                <TableHead className="text-center">状态</TableHead>
                <TableHead className="text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-center">
                    {item.currentStock}
                  </TableCell>
                  <TableCell className="text-right">
                    ¥{item.unitPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    ¥{item.totalValue}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusColorMap[item.status]}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInbound(item)}
                      >
                        <PackagePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOutbound(item)}
                      >
                        <PackageMinus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentRow(item)
                          setEditOpen(true)
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentRow(item)
                          setDeleteOpen(true)
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InventoryFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        currentRow={null}
        onSave={handleAdd}
      />

      <InventoryFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currentRow={currentRow}
        onSave={handleEdit}
      />

      <InventoryDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        currentRow={currentRow}
        onSuccess={handleDelete}
      />
    </>
  )
}
