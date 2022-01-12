import { useState, useCallback } from 'react';

const useInput = (initialValue = null) => {
  const [value, setValue] = useState(initialValue);

  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, [value, setValue]);

  return [value, handler, setValue];
}

export default useInput;
