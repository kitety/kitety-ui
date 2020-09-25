import { useMemo, useState } from 'react';

export function useStateAnimation(
  parentSetState: (v: boolean) => void,
  delay: number = 300,
): [boolean, (v: boolean) => void, () => void] {
  const [state, setState] = useState(true);
  const [innerClose, unmount] = useMemo(() => {
    let timer: number;
    let innerClose = (v: boolean) => {
      setState(v);
      timer = window.setTimeout(() => {
        parentSetState(v);
        setState(true);
      }, delay);
    };
    let unmount = () => window.clearTimeout(timer);
    return [innerClose, unmount];
  }, [state, parentSetState, delay]);
  return [state, innerClose, unmount];
}

export function useStopScroll(state: boolean, delay: number, open?: boolean) {
  if (open) {
    let width = window.innerWidth - document.body.clientWidth;
    if (state) {
      document.body.style.overflow = 'hidden';
      document.body.style.width = `calc(100vw - ${width}px)`;
    } else {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.width = `100%`;
      }, delay);
    }
  }
}
