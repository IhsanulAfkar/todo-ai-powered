import { Dispatch, SetStateAction } from 'react';

export type ModalProps<T = any> = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refresh?: () => void;
  selectedItem?: T;
};
