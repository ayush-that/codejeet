function removeDuplicates(a) {
  if (a.length === 0) return 0;
  let write = 0;
  for (let read = 1; read < a.length; read++) {
    if (a[read] !== a[write]) {
      write++;
      a[write] = a[read];
    }
  }
  return write + 1;
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
const k = removeDuplicates(a);
print(k);
print(a.slice(0, k).join(" "));
