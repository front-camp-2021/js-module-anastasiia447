export const weirdString = (str = "") => {
    if (str.length < 1) return "";
  return str
    .split(" ")
    .map((word) => {
      return (
        word.slice(0, word.length - 1).toUpperCase() +
        word[word.length - 1].toLowerCase()
      );
    })
    .join(" ");
};
