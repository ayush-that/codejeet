function secondLargest(a) {
  let largest = -Infinity;
  let second = -Infinity;
  for (const x of a) {
    if (x > largest) {
      second = largest;
      largest = x;
    } else if (x < largest && x > second) {
      second = x;
    }
  }
  return Number.isFinite(second) ? second : -1;
}

const n = parseInt(readline(), 10);
const a = readline().split(" ").map(Number);
print(secondLargest(a));
