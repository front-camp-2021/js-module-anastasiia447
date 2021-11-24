export const cutStrings = (arr = []) => {
    let index = 0;
    let string = "";
    if (arr.length < 1) return [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length < arr[index].length) {
        index = i;
        string = arr[index];
        }
    }
    return arr.map((arrElement) => arrElement.slice(0, string.length));
};