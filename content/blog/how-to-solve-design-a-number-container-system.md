---
title: "How to Solve Design a Number Container System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design a Number Container System. Medium difficulty, 57.1% acceptance rate. Topics: Hash Table, Design, Heap (Priority Queue), Ordered Set."
date: "2026-09-18"
category: "dsa-patterns"
tags:
  ["design-a-number-container-system", "hash-table", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Design a Number Container System

You need to design a system that stores numbers at indices and efficiently finds the smallest index containing a specific number. The tricky part is that numbers at indices can change, so you need data structures that support both fast updates and fast minimum-index queries for each number.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
nc = NumberContainers()
nc.change(1, 10)   # Index 1 now has number 10
nc.change(2, 10)   # Index 2 now has number 10
nc.change(3, 10)   # Index 3 now has number 10
nc.find(10)        # Should return 1 (smallest index with 10)
nc.change(2, 20)   # Index 2 now has number 20 instead of 10
nc.find(10)        # Should still return 1 (indices 1 and 3 have 10)
nc.change(1, 20)   # Index 1 now has number 20 instead of 10
nc.find(10)        # Should return 3 (only index 3 has 10 now)
```

The challenge: After `change(2, 20)`, we need to remove index 2 from the set of indices for number 10, and after `change(1, 20)`, we need to remove index 1 too. The `find()` operation needs to quickly get the smallest remaining index for a number.

## Brute Force Approach

A naive approach would store all index-number pairs in a list or dictionary, then scan through all indices when `find()` is called:

```python
class NumberContainers:
    def __init__(self):
        self.container = {}  # index -> number

    def change(self, index: int, number: int) -> None:
        self.container[index] = number

    def find(self, number: int) -> int:
        min_index = float('inf')
        for idx, num in self.container.items():
            if num == number and idx < min_index:
                min_index = idx
        return -1 if min_index == float('inf') else min_index
```

**Why this fails:** `change()` is O(1), but `find()` is O(n) where n is the total number of indices. With up to 10⁵ operations, this becomes O(10¹⁰) operations, which is far too slow. We need `find()` to be much faster.

## Optimized Approach

The key insight is that we need to track, for each number, all indices where it appears, and we need to quickly get the smallest index. This suggests two data structures:

1. **Index-to-number mapping**: A dictionary to quickly update what number is at each index
2. **Number-to-indices mapping**: For each number, we need a data structure that:
   - Supports adding new indices (when `change()` adds a number at an index)
   - Supports removing indices (when `change()` replaces a number at an index)
   - Quickly returns the smallest index

A **min-heap (priority queue)** is perfect for getting the smallest index, but standard heaps don't support efficient removal of arbitrary elements. The solution: use **lazy deletion**. We keep a heap for each number, but when we `change()` an index to a new number, we don't immediately remove it from the old number's heap. Instead, we mark it as invalid and skip it when we find it at the top of the heap.

**Step-by-step reasoning:**

1. When `change(index, number)` is called:
   - If the index already had a number, that old number's heap now has a stale entry
   - Update the index-to-number map
   - Add the index to the new number's heap
2. When `find(number)` is called:
   - Get the heap for that number
   - While the heap is not empty and the top element is stale (doesn't match current number at that index), pop it
   - Return the top element if it exists, else -1

This gives us O(log n) for `change()` (heap push) and amortized O(log n) for `find()` (lazy deletions).

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) for change, amortized O(log n) for find
# Space: O(n) where n is number of indices
class NumberContainers:
    def __init__(self):
        # Maps index -> current number at that index
        self.index_to_num = {}
        # Maps number -> min-heap of indices where this number appears
        self.num_to_indices = collections.defaultdict(list)

    def change(self, index: int, number: int) -> None:
        # Store what number is currently at this index
        self.index_to_num[index] = number
        # Add this index to the heap for the new number
        heapq.heappush(self.num_to_indices[number], index)

    def find(self, number: int) -> int:
        # If number doesn't exist in our mapping, return -1
        if number not in self.num_to_indices:
            return -1

        # Get the heap for this number
        heap = self.num_to_indices[number]

        # Clean up stale entries from the top of the heap
        # A stale entry is when the index at top of heap doesn't
        # currently have this number (it was changed to another number)
        while heap and self.index_to_num.get(heap[0]) != number:
            heapq.heappop(heap)

        # If heap is empty after cleanup, return -1
        # Otherwise, top of heap is the smallest valid index
        return -1 if not heap else heap[0]
```

```javascript
// Time: O(log n) for change, amortized O(log n) for find
// Space: O(n) where n is number of indices
class NumberContainers {
  constructor() {
    // Maps index -> current number at that index
    this.indexToNum = new Map();
    // Maps number -> min-heap of indices where this number appears
    this.numToIndices = new Map();
  }

  change(index, number) {
    // Store what number is currently at this index
    this.indexToNum.set(index, number);

    // Get or create heap for this number
    if (!this.numToIndices.has(number)) {
      this.numToIndices.set(number, new MinHeap());
    }

    // Add this index to the heap for the new number
    this.numToIndices.get(number).push(index);
  }

  find(number) {
    // If number doesn't exist in our mapping, return -1
    if (!this.numToIndices.has(number)) {
      return -1;
    }

    const heap = this.numToIndices.get(number);

    // Clean up stale entries from the top of the heap
    // A stale entry is when the index at top of heap doesn't
    // currently have this number (it was changed to another number)
    while (!heap.isEmpty() && this.indexToNum.get(heap.peek()) !== number) {
      heap.pop();
    }

    // If heap is empty after cleanup, return -1
    // Otherwise, top of heap is the smallest valid index
    return heap.isEmpty() ? -1 : heap.peek();
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return root;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _sinkDown(index) {
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
// Time: O(log n) for change, amortized O(log n) for find
// Space: O(n) where n is number of indices
class NumberContainers {
    // Maps index -> current number at that index
    private Map<Integer, Integer> indexToNum;
    // Maps number -> min-heap of indices where this number appears
    private Map<Integer, PriorityQueue<Integer>> numToIndices;

    public NumberContainers() {
        indexToNum = new HashMap<>();
        numToIndices = new HashMap<>();
    }

    public void change(int index, int number) {
        // Store what number is currently at this index
        indexToNum.put(index, number);

        // Get or create heap for this number
        numToIndices.putIfAbsent(number, new PriorityQueue<>());

        // Add this index to the heap for the new number
        numToIndices.get(number).offer(index);
    }

    public int find(int number) {
        // If number doesn't exist in our mapping, return -1
        if (!numToIndices.containsKey(number)) {
            return -1;
        }

        PriorityQueue<Integer> heap = numToIndices.get(number);

        // Clean up stale entries from the top of the heap
        // A stale entry is when the index at top of heap doesn't
        // currently have this number (it was changed to another number)
        while (!heap.isEmpty() &&
               indexToNum.getOrDefault(heap.peek(), -1) != number) {
            heap.poll();
        }

        // If heap is empty after cleanup, return -1
        // Otherwise, top of heap is the smallest valid index
        return heap.isEmpty() ? -1 : heap.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `change(index, number)`: O(log k) where k is the number of indices for that specific number. Heap push is logarithmic.
- `find(number)`: Amortized O(log k). In the worst case, we might need to pop many stale entries, but each index is pushed once and popped at most once, so amortized cost is O(log k) per operation.

**Space Complexity:** O(n) where n is the total number of indices stored. We store each index in the `index_to_num` map and potentially in multiple heaps (though each index is in exactly one heap at any time due to lazy deletion cleanup).

## Common Mistakes

1. **Forgetting to handle the case where a number has no indices**: Always check if the heap exists and is not empty after cleanup. Returning `heap[0]` without checking leads to index errors.

2. **Not implementing lazy deletion correctly**: Some candidates try to remove indices from heaps when `change()` is called, but standard heaps don't support efficient arbitrary removal. Lazy deletion is the standard pattern for this.

3. **Using the wrong data structure for `num_to_indices`**: Using a list or set instead of a heap makes `find()` O(n) instead of O(log n). Using a sorted list makes `change()` O(n) for insertion.

4. **Not updating `index_to_num` before pushing to heap**: If you push to the heap before updating the mapping, the cleanup in `find()` might incorrectly consider valid entries as stale.

## When You'll See This Pattern

This **heap with lazy deletion** pattern appears whenever you need to maintain a collection where you frequently add elements, remove arbitrary elements, and need quick access to the minimum/maximum element.

Related problems:

1. **Seat Reservation Manager (Medium)**: Similar heap usage for managing available seats, though simpler since seats are only removed (reserved), not reassigned.
2. **Design a Food Rating System (Medium)**: Uses heaps to track highest-rated foods for each cuisine, with lazy deletion when ratings change.
3. **Stock Price Fluctuation (Medium)**: Maintains min and max heaps of stock prices with lazy deletion when prices are updated.

## Key Takeaways

1. **Heap + lazy deletion** is a powerful pattern for maintaining min/max with arbitrary removals. When you can't remove from the middle of a heap efficiently, mark elements as invalid and clean them up when they reach the top.

2. **Maintain bidirectional mappings** when you need to query in both directions. Here we need index→number for updates and number→indices for queries.

3. **Amortized analysis matters**: Even though `find()` might do multiple pops in one call, each index is popped at most once total, making the amortized cost reasonable.

Related problems: [Seat Reservation Manager](/problem/seat-reservation-manager), [Design a Food Rating System](/problem/design-a-food-rating-system)
