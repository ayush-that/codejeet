---
title: "How to Solve Smallest Number in Infinite Set — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Number in Infinite Set. Medium difficulty, 70.6% acceptance rate. Topics: Hash Table, Design, Heap (Priority Queue), Ordered Set."
date: "2028-07-09"
category: "dsa-patterns"
tags: ["smallest-number-in-infinite-set", "hash-table", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Smallest Number in Infinite Set

You need to design a data structure that represents an infinite set of positive integers starting from 1. The challenge is to efficiently support two operations: removing and returning the smallest integer, and adding back integers that were previously removed. The tricky part is that the set is conceptually infinite, but we only need to track the finite subset of numbers that have been removed and potentially added back.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we perform these operations:

1. Initialize `SmallestInfiniteSet()` - Contains all positive integers {1, 2, 3, 4, 5, ...}
2. `popSmallest()` - Should return 1, set now effectively {2, 3, 4, 5, ...}
3. `popSmallest()` - Should return 2, set now {3, 4, 5, ...}
4. `addBack(1)` - Add 1 back, set now {1, 3, 4, 5, ...}
5. `popSmallest()` - Should return 1 (not 3!), set now {3, 4, 5, ...}
6. `popSmallest()` - Should return 3, set now {4, 5, 6, ...}
7. `addBack(2)` - Add 2 back, set now {2, 4, 5, 6, ...}
8. `popSmallest()` - Should return 2, set now {4, 5, 6, ...}

The key insight: When we pop the smallest, we need to know the smallest number that hasn't been permanently removed. Numbers that were removed and then added back should be available again, and they might be smaller than the current "frontier" of the infinite set.

## Brute Force Approach

A naive approach would be to maintain an actual set containing all positive integers up to some maximum. However, since the set is infinite, we can't store all numbers. A candidate might try:

1. Keep a boolean array or hash set of removed numbers
2. For `popSmallest()`: Start from 1 and increment until you find a number not in the removed set
3. For `addBack(num)`: Remove the number from the removed set

The problem with this approach is that `popSmallest()` becomes O(k) where k is the number of consecutive removed numbers from the start. In the worst case, if we pop 1, then 2, then 3, etc., each `popSmallest()` would scan from 1 every time, making it O(n) per operation.

## Optimized Approach

The key insight is that we need to track two things:

1. The current smallest integer that hasn't been removed (call it `current`)
2. Numbers that were removed but later added back (which might be smaller than `current`)

We can think of it this way:

- The infinite set is represented by a "pointer" to the smallest available number that has never been removed
- When we add back a number smaller than this pointer, it becomes available again

The optimal solution uses:

- A min-heap (priority queue) to store numbers that were removed and then added back
- A set to quickly check if a number is already in the heap (to avoid duplicates)
- An integer `current` representing the smallest number that has never been removed

For `popSmallest()`:

1. If the heap has elements, pop from the heap (these are added-back numbers)
2. Otherwise, return and increment `current`

For `addBack(num)`:

1. Only add if `num < current` (otherwise it's already in the infinite set)
2. Add to heap and set if not already present

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) for popSmallest and addBack | Space: O(n) where n is number of added-back elements
import heapq

class SmallestInfiniteSet:
    def __init__(self):
        # current represents the smallest integer that has never been popped
        self.current = 1
        # min-heap to store numbers that were added back and are smaller than current
        self.added_back = []
        # set to quickly check if a number is already in the heap (avoid duplicates)
        self.in_heap = set()

    def popSmallest(self) -> int:
        # If we have numbers in the heap that were added back, return the smallest one
        if self.added_back:
            smallest = heapq.heappop(self.added_back)
            self.in_heap.remove(smallest)
            return smallest

        # Otherwise, return the current smallest from the infinite set
        result = self.current
        self.current += 1
        return result

    def addBack(self, num: int) -> None:
        # Only add back if the number is smaller than current (otherwise it's already available)
        # and if it's not already in the heap (avoid duplicates)
        if num < self.current and num not in self.in_heap:
            heapq.heappush(self.added_back, num)
            self.in_heap.add(num)
```

```javascript
// Time: O(log n) for popSmallest and addBack | Space: O(n) where n is number of added-back elements
class SmallestInfiniteSet {
  constructor() {
    // current represents the smallest integer that has never been popped
    this.current = 1;
    // min-heap to store numbers that were added back and are smaller than current
    this.addedBack = new MinHeap();
    // set to quickly check if a number is already in the heap (avoid duplicates)
    this.inHeap = new Set();
  }

  popSmallest() {
    // If we have numbers in the heap that were added back, return the smallest one
    if (this.addedBack.size() > 0) {
      const smallest = this.addedBack.pop();
      this.inHeap.delete(smallest);
      return smallest;
    }

    // Otherwise, return the current smallest from the infinite set
    const result = this.current;
    this.current++;
    return result;
  }

  addBack(num) {
    // Only add back if the number is smaller than current (otherwise it's already available)
    // and if it's not already in the heap (avoid duplicates)
    if (num < this.current && !this.inHeap.has(num)) {
      this.addedBack.push(num);
      this.inHeap.add(num);
    }
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(log n) for popSmallest and addBack | Space: O(n) where n is number of added-back elements
import java.util.*;

class SmallestInfiniteSet {
    private int current;
    private PriorityQueue<Integer> addedBack;
    private Set<Integer> inHeap;

    public SmallestInfiniteSet() {
        // current represents the smallest integer that has never been popped
        this.current = 1;
        // min-heap to store numbers that were added back and are smaller than current
        this.addedBack = new PriorityQueue<>();
        // set to quickly check if a number is already in the heap (avoid duplicates)
        this.inHeap = new HashSet<>();
    }

    public int popSmallest() {
        // If we have numbers in the heap that were added back, return the smallest one
        if (!addedBack.isEmpty()) {
            int smallest = addedBack.poll();
            inHeap.remove(smallest);
            return smallest;
        }

        // Otherwise, return the current smallest from the infinite set
        int result = current;
        current++;
        return result;
    }

    public void addBack(int num) {
        // Only add back if the number is smaller than current (otherwise it's already available)
        // and if it's not already in the heap (avoid duplicates)
        if (num < current && !inHeap.contains(num)) {
            addedBack.offer(num);
            inHeap.add(num);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `popSmallest()`: O(log n) in the worst case when we pop from the heap, O(1) when we return `current`
- `addBack()`: O(log n) for heap insertion and O(1) for set operations
- Here, n is the number of elements in the heap (numbers added back that are smaller than current)

**Space Complexity:** O(n) where n is the number of elements that have been added back and are currently in the heap. In the worst case, if we add back many numbers smaller than current, we store all of them.

## Common Mistakes

1. **Forgetting to check for duplicates in `addBack()`**: If you add the same number multiple times without checking, you'll get duplicates in the heap, causing incorrect behavior in `popSmallest()`.

2. **Not checking `num < current` in `addBack()`**: If you add back a number that's already greater than or equal to `current`, it's already in the infinite set and shouldn't be added to the heap.

3. **Using only a heap without tracking what's in it**: Without the set, you'd need to scan the heap to check for duplicates, which is O(n) instead of O(1).

4. **Incrementing `current` incorrectly**: Remember that `current` should only increment when we pop from the infinite set, not when we pop from the heap.

## When You'll See This Pattern

This pattern of using a heap alongside a "frontier" pointer appears in several problems:

1. **First Missing Positive (Hard)**: While not identical, it also deals with finding gaps in sequences of integers. The mental model of tracking what's available vs. what's missing is similar.

2. **Kth Largest Element in a Stream (Easy)**: Uses a min-heap to track the k largest elements, similar to how we use a heap to track added-back numbers.

3. **Seat Reservation Manager (Medium)**: Almost identical problem structure - managing available seats where seats can be reserved and unreserved.

4. **Design Phone Directory (Medium)**: Similar concept of allocating and releasing numbers from a pool.

## Key Takeaways

1. **When dealing with "infinite" sequences, track the boundary**: Instead of storing all elements, track where the "available" sequence starts and handle exceptions separately.

2. **Heaps are ideal for maintaining smallest/largest elements**: When you need frequent access to min/max elements with insertions, a heap provides O(log n) operations.

3. **Combine data structures for efficiency**: Using a heap with a set gives us both fast min-access and fast lookup, a common pattern when you need both ordering and membership testing.

Related problems: [First Missing Positive](/problem/first-missing-positive)
