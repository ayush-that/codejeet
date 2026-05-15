function removeDuplicates(a) {
  // TODO: dedupe a in place and return the new length.
  return 0;
}

const n = parseInt(readline(), 10);
const a = n > 0 ? readline().split(" ").map(Number) : [];
const k = removeDuplicates(a);
print(k);
print(a.slice(0, k).join(" "));
