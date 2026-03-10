---
title: "How to Solve Design a Stack With Increment Operation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design a Stack With Increment Operation. Medium difficulty, 79.9% acceptance rate. Topics: Array, Stack, Design."
date: "2028-04-18"
category: "dsa-patterns"
tags: ["design-a-stack-with-increment-operation", "array", "stack", "design", "medium"]
---

## How to Solve "Design a Stack With Increment Operation"

This problem asks you to design a stack that supports an unusual operation: incrementing the bottom `k` elements by a value `val`. The challenge is making the `increment` operation efficient—a naive approach would be too slow for large stacks, forcing us to think about lazy propagation techniques.

---

## Visual Walkthrough

Let’s trace through an example to build intuition.

We create a `CustomStack` with `maxSize = 3`.

1. `push(1)` → Stack: `[1]`
2. `push(2)` → Stack: `[1, 2]`
3. `push(3)` → Stack: `[1, 2, 3]` (now full)
4. `push(4)` → Ignored (stack at maxSize)
5. `pop()` → Returns 3, stack: `[1, 2]`
6. `increment(2, 100)` → Increment bottom 2 elements by 100.  
   Stack becomes: `[101, 102]`
7. `pop()` → Returns 102, stack: `[101]`
8. `pop()` → Returns 101, stack: `[]`

The tricky part is making `increment(k, val)` efficient. If we store the stack as a plain array, incrementing the bottom `k` elements requires looping through up to `k` elements, which could be O(n) per operation. With many increment calls, this becomes O(n²) worst case.

---

## Brute Force Approach

A straightforward implementation uses a list as the stack and directly modifies elements when `increment` is called.

**How it works:**

- Store elements in an array.
- `push`: append if under `maxSize`.
- `pop`: remove and return last element if stack not empty.
- `increment`: loop from index `0` to `min(k, stack size)-1` and add `val` to each.

**Why it’s insufficient:**

- Each `increment` can take O(n) time.
- If we call `increment` many times (e.g., m times), total time could be O(m·n), which is too slow for large inputs.
- The problem constraints (up to 1000 calls) might still pass, but interviewers expect the optimized approach.

---

## Optimized Approach

The key insight is to **delay the increment operations** using a separate "increment array" that tracks pending increments. This is a form of _lazy propagation_.

**Core idea:**

- Maintain two arrays:
  1. `stack`: the actual elements.
  2. `inc`: same length as `stack`, where `inc[i]` stores the total increment value that should be applied to `stack[i]` and all elements _above_ it.
- When we push, we append to both arrays (with `inc` set to 0 for the new element).
- When we increment `k` elements, we don’t loop through all `k`. Instead, we add `val` to `inc[min(k, stack size) - 1]`. This marks that all elements from index 0 up to that index should eventually receive this increment.
- When we pop, we return `stack.pop() + inc[i]`. But before popping, we _propagate_ the increment downward: add `inc[i]` to `inc[i-1]` (if `i-1` exists), then set `inc[i] = 0`. This ensures increments are applied only when elements are accessed.

**Why this works:**

- Each `increment` becomes O(1) — we just update one cell in `inc`.
- Each `pop` becomes O(1) — we do a constant amount of work to propagate the increment.
- We avoid repeatedly modifying many elements.

---

## Optimal Solution

Here’s the implementation using the lazy increment array.

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(maxSize)
class CustomStack:
    def __init__(self, maxSize: int):
        self.stack = []          # holds the actual values
        self.inc = []            # holds pending increments for each index
        self.max_size = maxSize  # maximum allowed size

    def push(self, x: int) -> None:
        # Only push if we haven't reached maxSize
        if len(self.stack) < self.max_size:
            self.stack.append(x)
            self.inc.append(0)   # no pending increments for new element

    def pop(self) -> int:
        if not self.stack:
            return -1

        # Get the top index
        i = len(self.stack) - 1

        # Propagate increment down if there's an element below
        if i > 0:
            self.inc[i - 1] += self.inc[i]

        # The value to return is stack value + its own pending increment
        res = self.stack.pop() + self.inc[i]
        self.inc.pop()           # remove the increment record for popped element
        return res

    def increment(self, k: int, val: int) -> None:
        if not self.stack:
            return

        # Apply the increment to the k-th element (0-indexed: k-1)
        # If k > stack size, apply to all elements
        idx = min(k, len(self.stack)) - 1
        self.inc[idx] += val
```

```javascript
// Time: O(1) for all operations | Space: O(maxSize)
class CustomStack {
  constructor(maxSize) {
    this.stack = []; // actual values
    this.inc = []; // pending increments
    this.maxSize = maxSize;
  }

  push(x) {
    // Only push if under capacity
    if (this.stack.length < this.maxSize) {
      this.stack.push(x);
      this.inc.push(0); // new element has no pending increments
    }
  }

  pop() {
    if (this.stack.length === 0) return -1;

    const i = this.stack.length - 1;

    // Propagate increment to the element below
    if (i > 0) {
      this.inc[i - 1] += this.inc[i];
    }

    // Return value + its pending increment
    const res = this.stack.pop() + this.inc[i];
    this.inc.pop(); // clean up increment record
    return res;
  }

  increment(k, val) {
    if (this.stack.length === 0) return;

    // Apply increment to bottom k elements (or all if k > size)
    const idx = Math.min(k, this.stack.length) - 1;
    this.inc[idx] += val;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(maxSize)
class CustomStack {
    private int[] stack;   // actual values
    private int[] inc;     // pending increments
    private int top;       // points to next empty slot
    private int maxSize;

    public CustomStack(int maxSize) {
        this.stack = new int[maxSize];
        this.inc = new int[maxSize];
        this.top = 0;
        this.maxSize = maxSize;
    }

    public void push(int x) {
        // Only push if we have space
        if (top < maxSize) {
            stack[top] = x;
            inc[top] = 0;   // no pending increments for new element
            top++;
        }
    }

    public int pop() {
        if (top == 0) return -1;

        int i = top - 1;    // index of top element

        // Propagate increment to element below
        if (i > 0) {
            inc[i - 1] += inc[i];
        }

        // Return value + its pending increment
        int res = stack[i] + inc[i];
        inc[i] = 0;         // reset increment for this position
        top--;
        return res;
    }

    public void increment(int k, int val) {
        if (top == 0) return;

        // Apply increment to bottom k elements (or all if k > size)
        int idx = Math.min(k, top) - 1;
        inc[idx] += val;
    }
}
```

</div>

---

## Complexity Analysis

- **Time Complexity:** O(1) for all operations (`push`, `pop`, `increment`).  
  Each operation performs a constant number of array accesses and arithmetic operations.

- **Space Complexity:** O(maxSize)  
  We maintain two arrays of size `maxSize` (or dynamic lists that won’t exceed `maxSize`). Even with lazy propagation, we need O(n) space to store pending increments.

---

## Common Mistakes

1. **Forgetting to propagate increments on pop**  
   If you just add `inc[i]` to the returned value but don’t propagate it down, future pops will miss increments that should apply to lower elements. Always transfer `inc[i]` to `inc[i-1]` before popping.

2. **Incorrect index calculation in increment**  
   Using `k-1` without checking against stack size leads to index errors. Remember: `idx = min(k, stack.size()) - 1`.

3. **Not handling empty stack in increment/pop**  
   Calling `increment` on an empty stack should do nothing. `pop` on empty stack should return -1. Missing these checks causes runtime errors.

4. **Using O(k) time for increment**  
   The brute force approach is the most common mistake. Interviewers expect the lazy propagation optimization for this “design” problem.

---

## When You’ll See This Pattern

This lazy increment technique appears in problems where you need to apply batch updates efficiently and queries are interleaved with updates.

Related LeetCode problems:

1. **370. Range Addition** — Very similar: applying increments to ranges in an array, optimized with difference array technique.
2. **Range Sum Query - Mutable** — While typically solved with Fenwick Tree/Segment Tree, the idea of delaying updates appears in some solutions.
3. **Design a Leaderboard** — Maintaining scores with frequent updates and top-K queries might use similar lazy update ideas.

The core pattern: **when you need to apply operations to a range of elements, store the operation at the boundary and resolve it lazily when accessing elements.**

---

## Key Takeaways

- **Lazy propagation** is a powerful technique to make range updates O(1) by deferring work until query time.
- In stack/array problems with batch updates, consider storing pending operations separately rather than modifying all elements immediately.
- Always test edge cases: empty stack, `k` larger than stack size, maximum capacity pushes.

[Practice this problem on CodeJeet](/problem/design-a-stack-with-increment-operation)
