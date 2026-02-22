import { BreedsMutateDialog } from './breeds-mutate-dialog'
import { StatusesMutateDialog } from './statuses-mutate-dialog'
import { useCattery } from './cattery-provider'

export function CatteryDialogs() {
  const { open, setOpen, currentBreed, setCurrentBreed, currentStatus, setCurrentStatus } = useCattery()

  return (
    <>
      <BreedsMutateDialog
        key="breed-create"
        open={open === 'breed-create'}
        onOpenChange={() => setOpen('breed-create')}
      />

      <StatusesMutateDialog
        key="status-create"
        open={open === 'status-create'}
        onOpenChange={() => setOpen('status-create')}
      />

      {currentBreed && (
        <BreedsMutateDialog
          key={`breed-edit-${currentBreed.id}`}
          open={open === 'breed-edit'}
          onOpenChange={() => {
            setOpen('breed-edit')
            setTimeout(() => {
              setCurrentBreed(null)
            }, 500)
          }}
          currentBreed={currentBreed}
        />
      )}

      {currentStatus && (
        <StatusesMutateDialog
          key={`status-edit-${currentStatus.id}`}
          open={open === 'status-edit'}
          onOpenChange={() => {
            setOpen('status-edit')
            setTimeout(() => {
              setCurrentStatus(null)
            }, 500)
          }}
          currentStatus={currentStatus}
        />
      )}
    </>
  )
}
