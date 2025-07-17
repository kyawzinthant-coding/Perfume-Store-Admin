import React, { createContext } from 'react';
import { DiscountType } from '../data/schema';
import { useCrudDialog } from '@/hooks/use-crud-dialogs';

type discountDialogType = 'add' | 'edit' | 'delete';

interface DiscountContextType {
  open: discountDialogType | null;
  setOpen: (str: discountDialogType | null) => void;
  currentRow: DiscountType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<DiscountType | null>>;
}

const DiscountContext = createContext<DiscountContextType | null>(null);

interface DiscountProviderProps {
  children: React.ReactNode;
}

export const DiscountProvider: React.FC<DiscountProviderProps> = ({
  children,
}) => {
  const { open, setOpen, currentRow, setCurrentRow } =
    useCrudDialog<DiscountType>();

  const setCurrentRowCompat: React.Dispatch<
    React.SetStateAction<DiscountType | null>
  > = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore - This cast might be needed depending on the exact type of useCrudDialog's setCurrentRow
      setCurrentRow((prev) =>
        (value as (prev: DiscountType | null) => DiscountType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: DiscountContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return (
    <DiscountContext.Provider value={value}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => {
  const context = React.useContext(DiscountContext);

  if (!context) {
    throw new Error('useDiscount must be used within a <DiscountProvider>');
  }

  return context;
};
