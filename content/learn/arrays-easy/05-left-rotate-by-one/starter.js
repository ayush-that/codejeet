function leftRotateByOne(a) {
  // TODO: rotate a left by one position in place.
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
leftRotateByOne(a);
print(a.join(" "));
