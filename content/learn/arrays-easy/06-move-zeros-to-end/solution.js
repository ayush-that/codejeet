function moveZerosToEnd(a) {
  let write = 0;
  for (let read = 0; read < a.length; read++) {
    if (a[read] !== 0) {
      const tmp = a[write];
      a[write] = a[read];
      a[read] = tmp;
      write++;
    }
  }
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
moveZerosToEnd(a);
print(a.join(" "));
