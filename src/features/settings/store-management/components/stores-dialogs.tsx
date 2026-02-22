import { StoresMutateDialog } from './stores-mutate-dialog'
import { StoresDeleteDialog } from './stores-delete-dialog'
import { useStores } from './stores-provider'

export function StoresDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStores()

  return (
    <>
      <StoresMutateDialog
        key="store-create"
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <StoresMutateDialog
            key={`store-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <StoresDeleteDialog
            key={`store-delete-${currentRow.id}`}
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
