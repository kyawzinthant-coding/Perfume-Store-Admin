import { CategoryType } from '../data/schema';
import React, { createContext, useState } from 'react';
type categoryDialogType = 'add' | 'edit' | 'delete';

interface CategoryContextType {
  open: categoryDialogType | null;
  setOpen: (str: categoryDialogType | null) => void;
  currentRow: CategoryType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<CategoryType | null>>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

interface CategoryProviderProps {
  children: React.ReactNode;
}
export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<categoryDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<CategoryType | null>(null);

  const value: CategoryContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
