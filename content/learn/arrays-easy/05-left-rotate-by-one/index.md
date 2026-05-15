---
slug: "05-left-rotate-by-one"
title: "Left rotate by one"
description: "Save the first element, shift everything left, drop it at the end."
order: 5
difficulty: "easy"
exercise:
  prompt: "Rotate the array left by one position. Print the rotated array space-separated."
---

## What 'left rotate by one' means

`[1, 2, 3, 4, 5]` becomes `[2, 3, 4, 5, 1]`. The first element wraps around to the end. Every other element moves one slot to the left.

## The trick

You can't just do `a[i] = a[i+1]` for every `i` because the first element would be lost. So save it first:

```
first = a[0]
for i in 0..n-2:
    a[i] = a[i+1]
a[n-1] = first
```

**O(n)** time, **O(1)** extra memory.

## Generalizing

To rotate by `k` positions you usually use the reversal trick: reverse `a[0..k-1]`, reverse `a[k..n-1]`, reverse the whole thing. That's a great follow-up to internalize once this one feels obvious.

## Output

Print the rotated array space-separated on one line.
