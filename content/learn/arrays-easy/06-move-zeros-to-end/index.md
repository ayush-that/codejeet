---
slug: "06-move-zeros-to-end"
title: "Move zeros to end"
description: "Two pointers again: one walks the array, one tracks where the next non-zero goes."
order: 6
difficulty: "easy"
exercise:
  prompt: "Reorder the array so all non-zero values appear first in their original order, followed by all the zeros. Print the modified array space-separated."
---

## The lazy version

A two-pass solution is fine for warm-up: copy all non-zero values into a new array, then pad with zeros. **O(n)** time, **O(n)** memory.

But you can do it in place with **O(1)** extra memory using two pointers.

## In-place, one pass

`write` points to the next position that should hold a non-zero value. `read` walks the array. Whenever `read` lands on a non-zero, swap it into `a[write]` and advance `write`.

```
write = 0
for read in 0..n-1:
    if a[read] != 0:
        swap(a[write], a[read])
        write += 1
```

Why swap and not just copy? Because we also need to push the zeros that used to be at `write` somewhere right of `read`, and a swap does both jobs at once. Order of non-zero values is preserved.

## Output

Print the modified array space-separated on one line.
