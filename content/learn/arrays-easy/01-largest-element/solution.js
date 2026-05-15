function largest(a) {
  let best = a[0];
  for (let i = 1; i < a.length; i++) {
    if (a[i] > best) best = a[i];
  }
  return best;
}

const n = parseInt(readline(), 10);
const a = readline().split(" ").map(Number);
print(largest(a));
