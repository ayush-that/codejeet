---
slug: "02-second-largest"
title: "Second largest element"
description: "One pass, two variables. Watch out for duplicates of the maximum."
order: 2
difficulty: "easy"
exercise:
  prompt: "Print the second largest distinct value in the array. Print -1 if there isn't one (e.g. all elements are equal)."
---

## The trap

The naive solution is "sort and pick a[n-2]". That works for distinct values, but breaks on `[5, 5, 4]` where a[n-2] is `5`, which is the largest, not the second largest. And sorting is O(n log n) for a problem that should be O(n).

## The right way

Keep two variables: `largest` and `second`. Walk the array once. For each value `x`:

- If `x > largest`: the old largest just got demoted. `second = largest`, `largest = x`.
- Else if `x < largest` and `x > second`: update second only.
- Else: ignore.

The `x < largest` check is the part beginners forget — without it, duplicates of the largest also overwrite `second`.

```
largest = -inf
second  = -inf
for x in a:
    if x > largest:
        second = largest
        largest = x
    elif x < largest and x > second:
        second = x
```

If at the end `second` is still `-inf`, there was no second distinct value — output `-1`.

## Input and output

Line one is N. Line two is N space-separated integers. Print the second largest distinct value, or `-1`.
