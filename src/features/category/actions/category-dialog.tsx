import { useCategory } from '../context/category-context';
import { CategoryActionDialog } from './category-action-dialog';
import { CategoryDeleteDialog } from './category-delete.dialog';

export function CategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategory();
  return (
    <>
      <CategoryActionDialog
        key="category-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {currentRow && (
        <>
          <CategoryActionDialog
            key={`category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <CategoryDeleteDialog
            key={`category-delete-${currentRow.id}`}
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
