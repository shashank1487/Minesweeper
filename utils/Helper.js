export const flattenArray = input => {
  if (input.length === 0) {
    return [];
  }

  let output = [];
  while (input.length) {
    let first = input.shift();
    if (!Array.isArray(first)) {
      output.push(first);
    } else {
      input = first.concat(input);
    }
  }
  return output;
};
