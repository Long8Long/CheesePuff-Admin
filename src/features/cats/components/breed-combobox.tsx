import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'

type BreedComboboxProps = {
  value: string | undefined
  onValueChange: (value: string) => void
  items: Array<{ label: string; value: string }>
  placeholder?: string
  disabled?: boolean
  className?: string
  allowAddNew?: boolean
  onAddNew?: () => void
  addNewLabel?: string
}

export function BreedCombobox({
  value,
  onValueChange,
  items,
  placeholder = '请选择品种',
  disabled = false,
  className,
  allowAddNew = false,
  onAddNew,
  addNewLabel = '添加新品种',
}: BreedComboboxProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  // Close popover/dialog first, then open BreedDialog after a tick
  // to avoid nested Radix portal conflict
  const handleCloseAndAddNew = () => {
    setOpen(false)
    setTimeout(() => onAddNew?.(), 0)
  }

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? '' : currentValue)
    setOpen(false)
  }

  const renderCommandList = () => (
    <CommandList>
      <CommandEmpty>
        <span className="text-muted-foreground">未找到该品种</span>
        {allowAddNew && onAddNew && (
          <Button
            variant="link"
            className="ml-2 h-auto p-0 text-primary"
            onClick={handleCloseAndAddNew}
          >
            — {addNewLabel}
          </Button>
        )}
      </CommandEmpty>
      <CommandGroup>
        {allowAddNew && onAddNew && (
          <CommandItem
            onSelect={handleCloseAndAddNew}
            className="text-muted-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addNewLabel}
          </CommandItem>
        )}
        {items.map((item) => (
          <CommandItem
            key={item.value}
            value={item.value}
            onSelect={handleSelect}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                value === item.value ? 'opacity-100' : 'opacity-0'
              )}
            />
            {item.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  )

  // Mobile: use CommandDialog (full-screen modal)
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="选择品种"
          description="输入或选择一个品种"
        >
          <CommandInput placeholder="输入品种名称..." />
          {renderCommandList()}
        </CommandDialog>
      </>
    )
  }

  // Desktop: use Popover + Command
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="输入品种名称..." />
          {renderCommandList()}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
