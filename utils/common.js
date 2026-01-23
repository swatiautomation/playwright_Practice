export const stringFormat = (str, ...args) => {
  return str.replace(
    /{(\d+)}/g,
    (match, index) => args[index].toString() || '',
  );
};
