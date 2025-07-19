import React, { createContext } from 'react';
import { UserType } from '../data/schma';
import { useCrudDialog } from '@/hooks/use-crud-dialogs';

type userDialogType = 'add' | 'edit' | 'delete';

interface UserContextType {
  open: userDialogType | null;
  setOpen: (str: userDialogType | null) => void;
  currentRow: UserType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } =
    useCrudDialog<UserType>();

  const setCurrentRowCompat: React.Dispatch<
    React.SetStateAction<UserType | null>
  > = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: UserType | null) => UserType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: UserContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const UserContextProvider = React.useContext(UserContext);

  if (!UserContextProvider) {
    throw new Error(' User Provider has to be used within <UserContext>');
  }

  return UserContextProvider;
};
