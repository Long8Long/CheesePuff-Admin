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
import { catBreedsService } from '../services/cat-breeds.service'

export function BreedsTable() {
  const { setOpen, setCurrentBreed } = useCattery()

  const { data: breeds = [], isLoading, error } = useQuery({
    queryKey: ['cat-breeds'],
    queryFn: () => catBreedsService.getList(),
  })

  const handleEdit = (breed: CatBreed) => {
    setCurrentBreed(breed)
    setOpen('breed-edit')
  }

  const handleDelete = async (breed: CatBreed) => {
    try {
      await catBreedsService.delete(breed.id)
      toast.success(`已删除品种: ${breed.name}`)
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
            <TableHead className="w-[200px]">品种名称</TableHead>
            <TableHead className="w-[200px]">创建时间</TableHead>
            <TableHead className="w-[100px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breeds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            breeds.map((breed) => (
              <TableRow key={breed.id}>
                <TableCell className="font-medium">{breed.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(breed.createdAt).toLocaleString('zh-CN')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(breed)}
                      className="h-8 w-8"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(breed)}
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

import type { CatBreed } from '../models/cattery.types'
