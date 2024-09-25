import { useCallback, useRef } from 'react';

function useDebounce(func, delay) {
    const timeoutRef = useRef(null);

    const debouncedFunc = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [func, delay]);

    return debouncedFunc;
}

export default useDebounce;



