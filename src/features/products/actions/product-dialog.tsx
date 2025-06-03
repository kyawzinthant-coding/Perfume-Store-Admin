import { useProduct } from '../context/product-context';

import { ProductDeleteDialog } from './product-delete-dialog';

export function ProductDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProduct();
  return (
    <>
      {currentRow && (
        <ProductDeleteDialog
          key={`product-delete-${currentRow.id}`}
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete');
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}
