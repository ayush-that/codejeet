function isSorted(a) {
  // TODO: return true iff a is non-decreasing.
  return false;
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
print(isSorted(a) ? "true" : "false");
