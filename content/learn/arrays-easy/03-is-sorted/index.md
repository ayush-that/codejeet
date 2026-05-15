---
slug: "03-is-sorted"
title: "Check if an array is sorted"
description: "Compare adjacent pairs. The moment you find one out of order, you can stop."
order: 3
difficulty: "easy"
exercise:
  prompt: "Print 'true' if the array is sorted in non-decreasing order, otherwise 'false'."
---

## The idea

An array `a` is sorted in non-decreasing order if `a[i-1] <= a[i]` for every `i >= 1`. You only need to check adjacent pairs — if every pair is in order, the whole array is in order.

```
for i in 1..n-1:
    if a[i-1] > a[i]:
        return false
return true
```

That's it. **O(n)** time, **O(1)** memory.

## Edge cases

- Arrays of length 0 or 1 are trivially sorted.
- Equal adjacent values are fine for non-decreasing order. `[1, 2, 2, 3]` is sorted.

## Output

Print exactly `true` or `false` (lowercase) followed by a newline.
