import { CatsMutateDialog } from './cats-mutate-dialog'
import { CatsDeleteDialog } from './cats-delete-dialog'
import { useCats } from './cats-provider'

export function CatsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCats()

  return (
    <>
      {/* 添加猫咪对话框 */}
      <CatsMutateDialog
        key='cat-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {/* 编辑和删除对话框（需要 currentRow） */}
      {currentRow && (
        <>
          <CatsMutateDialog
            key={`cat-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CatsDeleteDialog
            key={`cat-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
