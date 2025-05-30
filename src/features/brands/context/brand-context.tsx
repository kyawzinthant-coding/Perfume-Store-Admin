import React, { createContext, useState } from 'react';
import { Brandtype } from '../data/schema';
type BrandDialogType = 'add' | 'edit' | 'delete';

interface BrandContextType {
  open: BrandDialogType | null;
  setOpen: (str: BrandDialogType | null) => void;
  currentRow: Brandtype | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Brandtype | null>>;
}

const BrandContext = createContext<BrandContextType | null>(null);

interface BrandProviderProps {
  children: React.ReactNode;
}
export const BrandProvider: React.FC<BrandProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<BrandDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Brandtype | null>(null);

  const value: BrandContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  };

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
};
