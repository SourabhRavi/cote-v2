export const debounce = (fn: () => void, interval: number = 500) => {
  let timer: number;

  return () => {
    clearInterval(timer);
    timer = setTimeout(fn, interval);
  };
};
