/**
 * Debounce utility function
 * Delays function execution until after a specified wait time has elapsed
 * since the last time it was invoked
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Debounce with immediate execution option
 * If immediate is true, function is called on the leading edge instead of trailing
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        const callNow = immediate && !timeout;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) {
                func(...args);
            }
        }, wait);

        if (callNow) {
            func(...args);
        }
    };
}
