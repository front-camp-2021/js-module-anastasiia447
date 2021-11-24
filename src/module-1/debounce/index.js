export const debounce = (fn, delay = 0) => {
    let timeout;
    return function debounceFn() {
        const context = this;
        const args = arguments;
        let later = function() {
          timeout = null;
          fn.hello(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
};


