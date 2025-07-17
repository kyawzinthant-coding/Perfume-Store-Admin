import { useDiscount } from '../context/discount-context';
import { DiscountActionDialog } from './discount-action-dialog';
import { DiscountDeleteDialog } from './discount-delete-dialog';

export function DiscountDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDiscount();
  return (
    <>
      <DiscountActionDialog
        key="discount-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {currentRow && (
        <>
          <DiscountActionDialog
            key={`discount-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <DiscountDeleteDialog
            key={`discount-delete-${currentRow.id}`}
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
