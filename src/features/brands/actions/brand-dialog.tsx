import { useBrand } from '../context/brand-context';
import { BrandActionDialog } from './brand-action-dialog';
import { BrandDeleteDialog } from './brand-delete.dialog';

export function BrandDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrand();
  return (
    <>
      <BrandActionDialog
        key="brand-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {currentRow && (
        <>
          <BrandActionDialog
            key={`brand-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <BrandDeleteDialog
            key={`brand-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
