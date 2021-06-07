import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { DialogState } from '../components/common/Dialog';

export const useDialog = <T>(showFullscreen?: boolean) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<T>(undefined);
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  const fullscreen = showFullscreen ?? isMobile;

  const open = (data?: T) => {
    if (data) setData(data);
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const state: DialogState<T> = {
    show,
    fullscreen,
    data,
    open,
    close,
  };

  return state;
};
