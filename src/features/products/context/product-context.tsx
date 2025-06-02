import React, { createContext, useState } from 'react';
import { ProductType } from '../data/schema';

type ProductDialogType = 'add' | 'edit' | 'delete';

interface ProductContextType {
  open: ProductDialogType | null;
  setOpen: (str: ProductDialogType | null) => void;
  currentRow: ProductType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<any | null>>;
}

const ProductContext = createContext<ProductContextType | null>(null);

interface ProductProviderProps {
  children: React.ReactNode;
}
export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<ProductDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<any | null>(null);

  const value: ProductContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ProductContentProvider = React.useContext(ProductContext);

  if (!ProductContentProvider) {
    throw new Error(' Product Provider has to be used within <ProductContext>');
  }

  return ProductContentProvider;
};
