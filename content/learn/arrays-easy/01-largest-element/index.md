---
slug: "01-largest-element"
title: "Largest element"
description: "Scan the array, remember the biggest value you've seen so far."
order: 1
difficulty: "easy"
exercise:
  prompt: "Read the array from stdin and print the maximum value. Linear scan only — no sort."
---

## The setup

You're given an array of integers. Return the largest one.

```
input
5
3 7 2 9 4

output
9
```

## How to think about it

There is no shortcut here. You have to look at every element at least once, because the maximum could be any of them. So the lower bound is O(n).

The simplest approach: track a running maximum. Initialize it to the first element, walk the array, replace it whenever you see something bigger. Done in one pass.

```
max = a[0]
for i in 1..n-1:
    if a[i] > max:
        max = a[i]
```

That gives you **O(n)** time and **O(1)** extra memory. You can not beat this asymptotically — every algorithm that finds the max has to read every element, and that's already n operations.

## Input and output

The grader's stdin gives you the array length on line one, then the values space-separated on line two. Print the maximum followed by a newline.

Read N and the N values, find the max, print it. That's the whole problem.
