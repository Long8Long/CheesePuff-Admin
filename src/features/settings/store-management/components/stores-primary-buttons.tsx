import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStores } from './stores-provider'

export function StoresPrimaryButtons() {
  const { setOpen } = useStores()

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => setOpen('create')}
        className="gap-1"
      >
        <Plus size={16} />
        新建门店
      </Button>
    </div>
  )
}
