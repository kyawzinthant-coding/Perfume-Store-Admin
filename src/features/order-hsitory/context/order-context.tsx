// src/features/order/context/order-context.tsx
import React, { createContext } from 'react';
import { OrderType } from '../data/schema';
import { useCrudDialog } from '@/hooks/use-crud-dialogs';

type orderDialogType = 'add' | 'edit' | 'delete';

interface OrderContextType {
  open: orderDialogType | null;
  setOpen: (str: orderDialogType | null) => void;
  currentRow: OrderType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<OrderType | null>>;
}

const OrderContext = createContext<OrderContextType | null>(null);

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { open, setOpen, currentRow, setCurrentRow } =
    useCrudDialog<OrderType>();

  const setCurrentRowCompat: React.Dispatch<
    React.SetStateAction<OrderType | null>
  > = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore - This cast might be needed if React.Dispatch expects a specific type that the hook's doesn't perfectly match, but functionally it's correct.
      setCurrentRow((prev) =>
        (value as (prev: OrderType | null) => OrderType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: OrderContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder must be used within a <OrderProvider>');
  }

  return context;
};
