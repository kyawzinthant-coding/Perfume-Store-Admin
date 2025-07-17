import { useOrder } from '../context/order-context';
import { OrderStatusActionDialog } from './order-action-dialog';

export function OrderDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrder();
  return (
    <>
      {currentRow && (
        <>
          <OrderStatusActionDialog
            key={`order-add-${currentRow.id}`}
            open={open === 'add'}
            onOpenChange={() => {
              setOpen('add');
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
