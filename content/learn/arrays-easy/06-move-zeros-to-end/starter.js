function moveZerosToEnd(a) {
  // TODO: move all zeros to the end of a in place, preserving non-zero order.
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
moveZerosToEnd(a);
print(a.join(" "));
