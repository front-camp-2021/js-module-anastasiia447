export const splitAndMerge = (str = "", separator = "") => {
    return str
    .split(" ")
    .map((arrayElement) => arrayElement.split("").join(separator))
    .join(" ");
};

