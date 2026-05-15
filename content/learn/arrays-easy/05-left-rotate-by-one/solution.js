function leftRotateByOne(a) {
  if (a.length === 0) return;
  const first = a[0];
  for (let i = 0; i < a.length - 1; i++) {
    a[i] = a[i + 1];
  }
  a[a.length - 1] = first;
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
leftRotateByOne(a);
print(a.join(" "));
