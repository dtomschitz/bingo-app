import { useState } from 'react';
import { DialogState } from '../components/common/Dialog';

export const useDialog = <T>() => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<T>(undefined);

  const open = (data?: T) => {
    if (data) setData(data);
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const state: DialogState<T> = {
    show,
    data,
    open,
    close,
  };

  return state;
};
