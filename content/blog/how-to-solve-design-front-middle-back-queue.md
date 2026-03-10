---
title: "How to Solve Design Front Middle Back Queue — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Front Middle Back Queue. Medium difficulty, 56.9% acceptance rate. Topics: Array, Linked List, Design, Queue, Doubly-Linked List."
date: "2028-10-23"
category: "dsa-patterns"
tags: ["design-front-middle-back-queue", "array", "linked-list", "design", "medium"]
---

# How to Solve Design Front Middle Back Queue

This problem asks you to design a queue that supports push and pop operations at three positions: front, middle, and back. What makes this tricky is that the "middle" position changes dynamically as elements are added or removed from other positions. A naive array implementation would be too slow for middle operations, requiring O(n) shifts. The challenge is finding a data structure that supports all six operations efficiently.

## Visual Walkthrough

Let's trace through operations to understand the behavior:

1. Start with empty queue: `[]`
2. `pushBack(1)`: `[1]`
3. `pushFront(2)`: `[2, 1]`
4. `pushMiddle(3)`: Middle of `[2, 1]` is after index 0, so: `[2, 3, 1]`
5. `pushBack(4)`: `[2, 3, 1, 4]`
6. `pushMiddle(5)`: Middle of `[2, 3, 1, 4]` is after index 1, so: `[2, 3, 5, 1, 4]`
7. `popFront()`: Removes 2 → `[3, 5, 1, 4]`
8. `popMiddle()`: Middle of `[3, 5, 1, 4]` is index 1 (5) → `[3, 1, 4]`
9. `popBack()`: Removes 4 → `[3, 1]`

The key insight: after every operation, we need to quickly find the middle position. With an array, finding middle is O(1), but inserting/deleting at middle is O(n). With a linked list, inserting/deleting is O(1) if we have the node, but finding middle is O(n).

## Brute Force Approach

The most straightforward approach uses a Python list (or ArrayList in Java, array in JavaScript):

```python
class FrontMiddleBackQueue:
    def __init__(self):
        self.queue = []

    def pushFront(self, val):
        self.queue.insert(0, val)

    def pushMiddle(self, val):
        mid = len(self.queue) // 2
        self.queue.insert(mid, val)

    def pushBack(self, val):
        self.queue.append(val)

    def popFront(self):
        return self.queue.pop(0) if self.queue else -1

    def popMiddle(self):
        if not self.queue:
            return -1
        mid = (len(self.queue) - 1) // 2
        return self.queue.pop(mid)

    def popBack(self):
        return self.queue.pop() if self.queue else -1
```

**Why this fails:** While simple, this approach has O(n) time complexity for `pushFront`, `popFront`, `pushMiddle`, and `popMiddle` due to element shifting. In interviews, you need O(1) or amortized O(1) operations.

## Optimized Approach

The key insight: we need O(1) access to front, middle, and back. A single data structure can't do this efficiently, but **two deques can**.

Think of splitting the queue into two halves:

- `left`: first half of elements
- `right`: second half of elements

We maintain the invariant that `right` always has the same number or one more element than `left`. This way:

- Front is the first element of `left` (or first of `right` if `left` is empty)
- Back is the last element of `right`
- Middle is the last element of `left` (if sizes equal) or first element of `right` (if `right` has one more)

Operations:

- `pushFront`: Add to front of `left`, then rebalance
- `pushMiddle`: Add to back of `left` or front of `right` depending on sizes
- `pushBack`: Add to back of `right`, then rebalance
- `popFront`: Remove from front of `left` (or `right` if `left` empty), then rebalance
- `popMiddle`: Remove from back of `left` or front of `right` depending on sizes
- `popBack`: Remove from back of `right`, then rebalance

The "rebalance" operation ensures our size invariant is maintained after each operation.

## Optimal Solution

We implement this using two deques (double-ended queues). Python has `collections.deque`, JavaScript arrays work as deques, and Java has `ArrayDeque`.

<div class="code-group">

```python
from collections import deque

class FrontMiddleBackQueue:
    # Time: O(1) for all operations | Space: O(n)

    def __init__(self):
        # Initialize two deques: left (first half) and right (second half)
        # We maintain the invariant: len(right) == len(left) or len(right) == len(left) + 1
        self.left = deque()
        self.right = deque()

    def _rebalance(self):
        # Ensure the size invariant is maintained
        # Right should have same or one more element than left
        if len(self.left) > len(self.right):
            # Left has too many elements, move last from left to front of right
            self.right.appendleft(self.left.pop())
        elif len(self.right) > len(self.left) + 1:
            # Right has too many elements, move first from right to back of left
            self.left.append(self.right.popleft())

    def pushFront(self, val: int) -> None:
        # Add to front of left deque
        self.left.appendleft(val)
        # Rebalance to maintain invariant
        self._rebalance()

    def pushMiddle(self, val: int) -> None:
        # Middle depends on current sizes
        if len(self.left) == len(self.right):
            # Sizes equal, add to right (making it one larger)
            self.right.appendleft(val)
        else:
            # Right has one more element, add to left
            self.left.append(val)
        # No need to rebalance since we maintained the invariant

    def pushBack(self, val: int) -> None:
        # Add to back of right deque
        self.right.append(val)
        # Rebalance to maintain invariant
        self._rebalance()

    def popFront(self) -> int:
        # If both deques are empty, return -1
        if not self.left and not self.right:
            return -1

        # Determine where to pop from
        if self.left:
            val = self.left.popleft()
        else:
            # If left is empty, pop from right (which must have elements)
            val = self.right.popleft()

        # Rebalance to maintain invariant
        self._rebalance()
        return val

    def popMiddle(self) -> int:
        # If both deques are empty, return -1
        if not self.left and not self.right:
            return -1

        # Determine which element is the middle
        if len(self.left) == len(self.right):
            # Sizes equal, middle is last element of left
            val = self.left.pop()
        else:
            # Right has one more element, middle is first element of right
            val = self.right.popleft()

        # No need to rebalance since we maintained the invariant
        return val

    def popBack(self) -> int:
        # If both deques are empty, return -1
        if not self.left and not self.right:
            return -1

        # Always pop from right (back of queue)
        val = self.right.pop()

        # Rebalance to maintain invariant
        self._rebalance()
        return val
```

```javascript
// Time: O(1) for all operations | Space: O(n)

class FrontMiddleBackQueue {
  constructor() {
    // Initialize two arrays as deques: left (first half) and right (second half)
    // We maintain the invariant: right.length == left.length or right.length == left.length + 1
    this.left = [];
    this.right = [];
  }

  // Helper function to rebalance the two deques
  _rebalance() {
    // Ensure the size invariant is maintained
    if (this.left.length > this.right.length) {
      // Left has too many elements, move last from left to front of right
      this.right.unshift(this.left.pop());
    } else if (this.right.length > this.left.length + 1) {
      // Right has too many elements, move first from right to back of left
      this.left.push(this.right.shift());
    }
  }

  pushFront(val) {
    // Add to front of left deque
    this.left.unshift(val);
    // Rebalance to maintain invariant
    this._rebalance();
  }

  pushMiddle(val) {
    // Middle depends on current sizes
    if (this.left.length === this.right.length) {
      // Sizes equal, add to front of right (making it one larger)
      this.right.unshift(val);
    } else {
      // Right has one more element, add to back of left
      this.left.push(val);
    }
    // No need to rebalance since we maintained the invariant
  }

  pushBack(val) {
    // Add to back of right deque
    this.right.push(val);
    // Rebalance to maintain invariant
    this._rebalance();
  }

  popFront() {
    // If both deques are empty, return -1
    if (this.left.length === 0 && this.right.length === 0) {
      return -1;
    }

    let val;
    // Determine where to pop from
    if (this.left.length > 0) {
      val = this.left.shift();
    } else {
      // If left is empty, pop from right (which must have elements)
      val = this.right.shift();
    }

    // Rebalance to maintain invariant
    this._rebalance();
    return val;
  }

  popMiddle() {
    // If both deques are empty, return -1
    if (this.left.length === 0 && this.right.length === 0) {
      return -1;
    }

    let val;
    // Determine which element is the middle
    if (this.left.length === this.right.length) {
      // Sizes equal, middle is last element of left
      val = this.left.pop();
    } else {
      // Right has one more element, middle is first element of right
      val = this.right.shift();
    }

    // No need to rebalance since we maintained the invariant
    return val;
  }

  popBack() {
    // If both deques are empty, return -1
    if (this.left.length === 0 && this.right.length === 0) {
      return -1;
    }

    // Always pop from right (back of queue)
    const val = this.right.pop();

    // Rebalance to maintain invariant
    this._rebalance();
    return val;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(n)

import java.util.ArrayDeque;
import java.util.Deque;

class FrontMiddleBackQueue {
    private Deque<Integer> left;
    private Deque<Integer> right;

    public FrontMiddleBackQueue() {
        // Initialize two deques: left (first half) and right (second half)
        // We maintain the invariant: right.size() == left.size() or right.size() == left.size() + 1
        left = new ArrayDeque<>();
        right = new ArrayDeque<>();
    }

    // Helper method to rebalance the two deques
    private void rebalance() {
        // Ensure the size invariant is maintained
        if (left.size() > right.size()) {
            // Left has too many elements, move last from left to front of right
            right.addFirst(left.pollLast());
        } else if (right.size() > left.size() + 1) {
            // Right has too many elements, move first from right to back of left
            left.addLast(right.pollFirst());
        }
    }

    public void pushFront(int val) {
        // Add to front of left deque
        left.addFirst(val);
        // Rebalance to maintain invariant
        rebalance();
    }

    public void pushMiddle(int val) {
        // Middle depends on current sizes
        if (left.size() == right.size()) {
            // Sizes equal, add to front of right (making it one larger)
            right.addFirst(val);
        } else {
            // Right has one more element, add to back of left
            left.addLast(val);
        }
        // No need to rebalance since we maintained the invariant
    }

    public void pushBack(int val) {
        // Add to back of right deque
        right.addLast(val);
        // Rebalance to maintain invariant
        rebalance();
    }

    public int popFront() {
        // If both deques are empty, return -1
        if (left.isEmpty() && right.isEmpty()) {
            return -1;
        }

        int val;
        // Determine where to pop from
        if (!left.isEmpty()) {
            val = left.pollFirst();
        } else {
            // If left is empty, pop from right (which must have elements)
            val = right.pollFirst();
        }

        // Rebalance to maintain invariant
        rebalance();
        return val;
    }

    public int popMiddle() {
        // If both deques are empty, return -1
        if (left.isEmpty() && right.isEmpty()) {
            return -1;
        }

        int val;
        // Determine which element is the middle
        if (left.size() == right.size()) {
            // Sizes equal, middle is last element of left
            val = left.pollLast();
        } else {
            // Right has one more element, middle is first element of right
            val = right.pollFirst();
        }

        // No need to rebalance since we maintained the invariant
        return val;
    }

    public int popBack() {
        // If both deques are empty, return -1
        if (left.isEmpty() && right.isEmpty()) {
            return -1;
        }

        // Always pop from right (back of queue)
        int val = right.pollLast();

        // Rebalance to maintain invariant
        rebalance();
        return val;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for all operations

- Each operation performs at most a constant number of deque operations (push/pop from front/back)
- The `_rebalance()` method also performs at most one deque operation
- Deque operations are O(1) amortized in all three languages

**Space Complexity:** O(n) where n is the number of elements stored

- We store each element exactly once across the two deques
- The deques themselves have minimal overhead

## Common Mistakes

1. **Forgetting to rebalance after operations:** The most common error is pushing/popping without calling `_rebalance()`. This breaks the size invariant and causes incorrect middle calculations. Always rebalance after `pushFront`, `pushBack`, `popFront`, and `popBack`.

2. **Incorrect middle calculation in `pushMiddle`/`popMiddle`:** Candidates often miscalculate whether to use the last element of `left` or first element of `right`. Remember: when sizes are equal, middle goes to/comes from `right`; when `right` has one more, middle goes to/comes from `left`.

3. **Not handling empty queues properly:** For pop operations, you must check if both deques are empty and return -1. Also, when `left` is empty but `right` has elements in `popFront`, you need to pop from `right`.

4. **Using inefficient data structures:** Some candidates try to use a single list/array, which gives O(n) middle operations. Others use a singly linked list, which can't efficiently pop from back. Always use deques (double-ended queues).

## When You'll See This Pattern

The "two deques" or "two halves" pattern appears in problems requiring efficient access to both ends and the middle:

1. **Design Circular Deque (LeetCode 641):** Similar concept but with fixed capacity and no middle operations. The circular buffer technique is related but different.

2. **Sliding Window Maximum (LeetCode 239):** Uses a deque to maintain maximum elements efficiently, though for different purposes.

3. **Design Browser History (LeetCode 1472):** Requires efficient forward/backward navigation, similar to maintaining two stacks of visited pages.

4. **Data Stream Median (LeetCode 295):** Uses two heaps (min-heap and max-heap) to maintain median efficiently - similar "two halves" concept but with different data structures.

## Key Takeaways

1. **When you need efficient access to both ends and middle, consider splitting into two halves.** Maintain an invariant about their relative sizes to make middle operations trivial.

2. **Deques are your friend for front/back operations.** Most languages provide efficient deque implementations (Python's `collections.deque`, Java's `ArrayDeque`, JavaScript arrays with `shift`/`unshift`/`pop`/`push`).

3. **Always maintain invariants explicitly.** After each operation that could break your size invariant, rebalance immediately. This makes reasoning about edge cases much easier.

Related problems: [Design Circular Deque](/problem/design-circular-deque), [Design Circular Queue](/problem/design-circular-queue)
