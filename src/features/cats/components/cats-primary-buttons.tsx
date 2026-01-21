import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCats } from './cats-provider'

export function CatsPrimaryButtons() {
  const { setOpen } = useCats()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>添加猫咪</span> <Plus size={18} />
      </Button>
    </div>
  )
}
