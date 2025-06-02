// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import { CategoryType } from '../data/schema';
import { useCrudDialog } from '@/hooks/use-crud-dialogs';

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
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } =
    useCrudDialog<CategoryType>();

  const setCurrentRowCompat: React.Dispatch<
    React.SetStateAction<CategoryType | null>
  > = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: CategoryType | null) => CategoryType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: CategoryContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const CategoryContentProvider = React.useContext(CategoryContext);

  if (!CategoryContentProvider) {
    throw new Error(
      'Category Provider has to be used within <CategoryContext>'
    );
  }

  return CategoryContentProvider;
};
