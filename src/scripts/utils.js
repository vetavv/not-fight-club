export function createUniqueRandomGenerator(max) {
  const numbers = [];
  for (let i = 0; i < max; i++) {
    numbers.push(i);
  }

  return function () {
    if (numbers.length === 0) return null;
    const index = Math.floor(Math.random() * numbers.length);
    return numbers.splice(index, 1)[0];
  };
}
