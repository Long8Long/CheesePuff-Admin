import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCattery } from './cattery-provider'
import { catStatusesService } from '../services/cat-statuses.service'

export function StatusesTable() {
  const { setOpen, setCurrentStatus } = useCattery()

  const { data: statuses = [], isLoading, error } = useQuery({
    queryKey: ['cat-statuses'],
    queryFn: () => catStatusesService.getList(),
  })

  const handleEdit = (status: CatStatus) => {
    setCurrentStatus(status)
    setOpen('status-edit')
  }

  const handleDelete = async (status: CatStatus) => {
    try {
      await catStatusesService.delete(status.id)
      toast.success(`已删除状态: ${status.name}`)
    } catch (error) {
      toast.error('删除失败')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          加载失败: {(error as Error).message}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">状态名称</TableHead>
            <TableHead className="w-[200px]">创建时间</TableHead>
            <TableHead className="w-[100px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            statuses.map((status) => (
              <TableRow key={status.id}>
                <TableCell className="font-medium">{status.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(status.createdAt).toLocaleString('zh-CN')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(status)}
                      className="h-8 w-8"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(status)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

import type { CatStatus } from '../models/cattery.types'
