---
slug: "04-remove-duplicates"
title: "Remove duplicates from a sorted array"
description: "Two pointers in one pass. The classic in-place de-dup pattern."
order: 4
difficulty: "easy"
exercise:
  prompt: "Given a sorted array, remove duplicates in place. Print the new length on the first line, and the unique values space-separated on the second."
---

## Why the sorted-ness matters

If the array were unsorted you'd reach for a hash set. But this one is sorted, so every group of equal values sits in a contiguous run — `[1, 1, 2, 2, 2, 3]`. That makes one-pass in-place de-duplication possible.

## The two-pointer pattern

Use two indices:

- `write` points to where the next unique value will be stored.
- `read` walks through the array.

Initialize both at `0` (the first element is trivially unique). When `a[read]` differs from `a[write]`, advance `write` and copy:

```
write = 0
for read in 1..n-1:
    if a[read] != a[write]:
        write += 1
        a[write] = a[read]
return write + 1
```

After the loop, the first `write + 1` slots of `a` hold the unique values in their original order. Total work: **O(n)** time, **O(1)** extra memory.

## Output format

Print the new length on line one, then the unique values space-separated on line two. If N is zero, print `0` on line one and an empty line two — but the tests don't include that case.
