---
title: "How to Solve Finding MK Average — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Finding MK Average. Hard difficulty, 38.7% acceptance rate. Topics: Design, Queue, Heap (Priority Queue), Data Stream, Ordered Set."
date: "2029-06-05"
category: "dsa-patterns"
tags: ["finding-mk-average", "design", "queue", "heap-(priority-queue)", "hard"]
---

# How to Solve Finding MK Average

This problem asks you to design a data structure that processes a stream of integers and calculates a specific average called the **MKAverage**. The MKAverage is computed by taking the most recent `m` elements from the stream, removing the smallest `k` and largest `k` elements from that window, and averaging the remaining `m - 2k` elements. The challenge is that you need to support two operations efficiently: adding new elements to the stream and calculating the MKAverage at any time. What makes this problem tricky is that you need to maintain a sliding window of fixed size `m` while also keeping track of the smallest and largest `k` elements within that window—all in real-time as elements flow in and old elements are removed.

## Visual Walkthrough

Let's trace through a small example with `m = 5`, `k = 2`, and the stream: `[3, 1, 10, 5, 7, 4, 6]`.

**Step 1:** Add 3. Window: `[3]`. Size < m, so no MKAverage yet.

**Step 2:** Add 1. Window: `[3, 1]`. Still < 5.

**Step 3:** Add 10. Window: `[3, 1, 10]`.

**Step 4:** Add 5. Window: `[3, 1, 10, 5]`.

**Step 5:** Add 7. Now window has exactly m=5 elements: `[3, 1, 10, 5, 7]`.

- Sort the window: `[1, 3, 5, 7, 10]`.
- Remove smallest k=2 elements: `[1, 3]`.
- Remove largest k=2 elements: `[7, 10]`.
- Remaining: `[5]`.
- MKAverage = 5 / 1 = 5.

**Step 6:** Add 4. The window slides: oldest element (3) is removed, new window: `[1, 10, 5, 7, 4]`.

- Sorted: `[1, 4, 5, 7, 10]`.
- Remove `[1, 4]` and `[7, 10]`.
- Remaining: `[5]`.
- MKAverage = 5.

**Step 7:** Add 6. Window: `[10, 5, 7, 4, 6]`.

- Sorted: `[4, 5, 6, 7, 10]`.
- Remove `[4, 5]` and `[7, 10]`.
- Remaining: `[6]`.
- MKAverage = 6.

The key observation: every time we add a new element, we must remove the oldest element (if window size > m) and then recalculate the sum of the middle `m-2k` elements efficiently. Doing this with sorting each time is too slow—we need smarter data structures.

## Brute Force Approach

A naive solution would store the last `m` elements in a list or deque. When `calculateMKAverage()` is called:

1. Check if we have at least `m` elements. If not, return -1.
2. Take the last `m` elements, sort them.
3. Skip the first `k` and last `k` elements.
4. Sum the remaining `m-2k` elements and divide by that count.

**Why this fails:**  
Sorting takes O(m log m) time for each calculation. In the worst case, `calculateMKAverage()` could be called after every `addElement()`, leading to O(n × m log m) time for n operations. Since m can be up to 100,000, this is far too slow. We need to maintain the sorted order and the sum of middle elements incrementally.

## Optimized Approach

The core insight is that we need to maintain **three multisets** (sorted containers that allow duplicates):

1. **`lo`**: stores the smallest `k` elements in the current window.
2. **`mid`**: stores the middle `m-2k` elements.
3. **`hi`**: stores the largest `k` elements.

We also maintain:

- A **queue** (or deque) to track the sliding window of last `m` elements.
- **`sum_mid`**: the running sum of elements in `mid`.

When a new element `x` arrives:

1. Add `x` to the queue.
2. If queue size > m, remove the oldest element `old` from the queue.
3. Insert `x` into the appropriate multiset.
4. If we removed an `old` element, remove it from whichever multiset it belongs to.
5. **Rebalance** the multisets to ensure `lo` has exactly `k` smallest, `hi` has exactly `k` largest, and `mid` has the rest.

The trickiest part is the insertion and rebalancing logic. We always insert new elements into `mid` first, then:

- If `lo` has less than `k` elements, move the smallest from `mid` to `lo`.
- If `hi` has less than `k` elements, move the largest from `mid` to `hi`.
- If `lo` has more than `k` elements, move the largest from `lo` to `mid`.
- If `hi` has more than `k` elements, move the smallest from `hi` to `mid`.

When removing an old element:

- Determine which multiset contains it (we can track this with a value-to-multiset map).
- Remove it from that multiset.
- Rebalance similarly.

This way, `calculateMKAverage()` simply returns `sum_mid / (m - 2k)` in O(1) time, and `addElement()` works in O(log m) time.

## Optimal Solution

Here’s the implementation using sorted lists (via `SortedList` in Python, manual heaps + lazy deletion in Java/JavaScript).

<div class="code-group">

```python
from sortedcontainers import SortedList
from collections import deque

class MKAverage:
    # Time: O(log m) per add, O(1) per calculate | Space: O(m)
    def __init__(self, m: int, k: int):
        self.m = m
        self.k = k
        self.queue = deque()           # sliding window of last m elements
        self.lo = SortedList()         # smallest k elements
        self.mid = SortedList()        # middle m-2k elements
        self.hi = SortedList()         # largest k elements
        self.sum_mid = 0               # sum of elements in mid

    def addElement(self, num: int) -> None:
        # Step 1: Add new element to queue and to mid initially
        self.queue.append(num)
        self.mid.add(num)
        self.sum_mid += num

        # Step 2: If window size exceeds m, remove oldest element
        if len(self.queue) > self.m:
            old = self.queue.popleft()
            # Determine which sorted list contains old and remove it
            if old in self.lo:
                self.lo.remove(old)
            elif old in self.hi:
                self.hi.remove(old)
            else:
                self.mid.remove(old)
                self.sum_mid -= old

        # Step 3: Rebalance to ensure lo has k smallest, hi has k largest
        # First ensure lo has exactly k elements
        while len(self.lo) < self.k and self.mid:
            # Move smallest from mid to lo
            smallest_mid = self.mid[0]
            self.lo.add(smallest_mid)
            self.mid.remove(smallest_mid)
            self.sum_mid -= smallest_mid
        while len(self.lo) > self.k:
            # Move largest from lo to mid
            largest_lo = self.lo[-1]
            self.mid.add(largest_lo)
            self.lo.remove(largest_lo)
            self.sum_mid += largest_lo

        # Then ensure hi has exactly k elements
        while len(self.hi) < self.k and self.mid:
            # Move largest from mid to hi
            largest_mid = self.mid[-1]
            self.hi.add(largest_mid)
            self.mid.remove(largest_mid)
            self.sum_mid -= largest_mid
        while len(self.hi) > self.k:
            # Move smallest from hi to mid
            smallest_hi = self.hi[0]
            self.mid.add(smallest_hi)
            self.hi.remove(smallest_hi)
            self.sum_mid += smallest_hi

    def calculateMKAverage(self) -> int:
        # Return -1 if fewer than m elements, otherwise average of mid
        if len(self.queue) < self.m:
            return -1
        return self.sum_mid // (self.m - 2 * self.k)
```

```javascript
// Time: O(log m) per add, O(1) per calculate | Space: O(m)
class MKAverage {
  constructor(m, k) {
    this.m = m;
    this.k = k;
    this.queue = []; // sliding window
    this.lo = new MinPriorityQueue({ priority: (x) => x }); // max-heap for k smallest
    this.loDelete = new MinPriorityQueue({ priority: (x) => x });
    this.hi = new MinPriorityQueue({ priority: (x) => -x }); // min-heap for k largest
    this.hiDelete = new MinPriorityQueue({ priority: (x) => -x });
    this.mid = new MinPriorityQueue({ priority: (x) => x }); // min-heap for middle
    this.midDelete = new MinPriorityQueue({ priority: (x) => x });
    this.midMax = new MinPriorityQueue({ priority: (x) => -x }); // max-heap for middle
    this.midMaxDelete = new MinPriorityQueue({ priority: (x) => -x });
    this.sumMid = 0;
    this.loSize = 0;
    this.hiSize = 0;
    this.midSize = 0;
  }

  // Helper to clean up heaps by removing elements marked for deletion
  _clean(heap, delHeap) {
    while (
      !heap.isEmpty() &&
      !delHeap.isEmpty() &&
      heap.front().element === delHeap.front().element
    ) {
      heap.dequeue();
      delHeap.dequeue();
    }
  }

  addElement(num) {
    this.queue.push(num);
    // Add to mid initially
    this.mid.enqueue(num);
    this.midMax.enqueue(num);
    this.sumMid += num;
    this.midSize++;

    // Remove oldest if window size > m
    if (this.queue.length > this.m) {
      const old = this.queue.shift();
      // Determine which heap old belongs to and mark for deletion
      if (this.loSize > 0 && old <= this._getLoMax()) {
        this.loDelete.enqueue(old);
        this.loSize--;
      } else if (this.hiSize > 0 && old >= this._getHiMin()) {
        this.hiDelete.enqueue(old);
        this.hiSize--;
      } else {
        this.midDelete.enqueue(old);
        this.midMaxDelete.enqueue(old);
        this.sumMid -= old;
        this.midSize--;
      }
    }

    // Rebalance lo
    while (this.loSize < this.k && this.midSize > 0) {
      const val = this._getMidMin();
      this.lo.enqueue(val);
      this.loSize++;
      this.midDelete.enqueue(val);
      this.midMaxDelete.enqueue(val);
      this.sumMid -= val;
      this.midSize--;
    }
    while (this.loSize > this.k) {
      const val = this._getLoMax();
      this.loDelete.enqueue(val);
      this.mid.enqueue(val);
      this.midMax.enqueue(val);
      this.sumMid += val;
      this.midSize++;
      this.loSize--;
    }

    // Rebalance hi
    while (this.hiSize < this.k && this.midSize > 0) {
      const val = this._getMidMax();
      this.hi.enqueue(val);
      this.hiSize++;
      this.midDelete.enqueue(val);
      this.midMaxDelete.enqueue(val);
      this.sumMid -= val;
      this.midSize--;
    }
    while (this.hiSize > this.k) {
      const val = this._getHiMin();
      this.hiDelete.enqueue(val);
      this.mid.enqueue(val);
      this.midMax.enqueue(val);
      this.sumMid += val;
      this.midSize++;
      this.hiSize--;
    }
  }

  // Helper methods to get min/max from heaps after cleanup
  _getLoMax() {
    this._clean(this.lo, this.loDelete);
    return this.lo.front().element;
  }
  _getHiMin() {
    this._clean(this.hi, this.hiDelete);
    return this.hi.front().element;
  }
  _getMidMin() {
    this._clean(this.mid, this.midDelete);
    return this.mid.front().element;
  }
  _getMidMax() {
    this._clean(this.midMax, this.midMaxDelete);
    return this.midMax.front().element;
  }

  calculateMKAverage() {
    if (this.queue.length < this.m) return -1;
    return Math.floor(this.sumMid / (this.m - 2 * this.k));
  }
}
```

```java
// Time: O(log m) per add, O(1) per calculate | Space: O(m)
import java.util.*;

class MKAverage {
    private int m, k;
    private Queue<Integer> queue = new LinkedList<>();
    private TreeMap<Integer, Integer> lo = new TreeMap<>();
    private TreeMap<Integer, Integer> mid = new TreeMap<>();
    private TreeMap<Integer, Integer> hi = new TreeMap<>();
    private long sumMid = 0;
    private int loSize = 0, midSize = 0, hiSize = 0;

    public MKAverage(int m, int k) {
        this.m = m;
        this.k = k;
    }

    public void addElement(int num) {
        // Step 1: Add to queue and to mid initially
        queue.offer(num);
        mid.put(num, mid.getOrDefault(num, 0) + 1);
        sumMid += num;
        midSize++;

        // Step 2: Remove oldest if window size > m
        if (queue.size() > m) {
            int old = queue.poll();
            if (lo.containsKey(old)) {
                removeOne(lo, old);
                loSize--;
            } else if (hi.containsKey(old)) {
                removeOne(hi, old);
                hiSize--;
            } else {
                removeOne(mid, old);
                sumMid -= old;
                midSize--;
            }
        }

        // Step 3: Rebalance lo to have exactly k smallest
        while (loSize < k && midSize > 0) {
            int key = mid.firstKey();
            removeOne(mid, key);
            lo.put(key, lo.getOrDefault(key, 0) + 1);
            sumMid -= key;
            midSize--;
            loSize++;
        }
        while (loSize > k) {
            int key = lo.lastKey();
            removeOne(lo, key);
            mid.put(key, mid.getOrDefault(key, 0) + 1);
            sumMid += key;
            loSize--;
            midSize++;
        }

        // Step 4: Rebalance hi to have exactly k largest
        while (hiSize < k && midSize > 0) {
            int key = mid.lastKey();
            removeOne(mid, key);
            hi.put(key, hi.getOrDefault(key, 0) + 1);
            sumMid -= key;
            midSize--;
            hiSize++;
        }
        while (hiSize > k) {
            int key = hi.firstKey();
            removeOne(hi, key);
            mid.put(key, mid.getOrDefault(key, 0) + 1);
            sumMid += key;
            hiSize--;
            midSize++;
        }
    }

    private void removeOne(TreeMap<Integer, Integer> map, int key) {
        int count = map.get(key);
        if (count == 1) map.remove(key);
        else map.put(key, count - 1);
    }

    public int calculateMKAverage() {
        if (queue.size() < m) return -1;
        return (int) (sumMid / (m - 2 * k));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addElement()`: O(log m) per operation. Each insertion/removal from the sorted multisets (TreeMap, SortedList, or heaps with lazy deletion) takes O(log m). The rebalancing steps perform at most a constant number of these operations.
- `calculateMKAverage()`: O(1) since we maintain `sum_mid` incrementally.

**Space Complexity:** O(m) to store the sliding window and the three multisets.

## Common Mistakes

1. **Forgetting to handle the sliding window removal correctly:** When the window size exceeds `m`, you must remove the oldest element from the appropriate multiset. A common error is removing from `mid` without checking if it’s actually in `lo` or `hi`. Solution: track which multiset each element belongs to (implicitly via comparisons or explicitly with a map).

2. **Off-by-one errors in rebalancing:** The conditions `loSize < k` and `hiSize < k` must be strict. If you use `<=`, you might end up with `k+1` elements in a multiset. Always rebalance both directions after each insertion/removal.

3. **Using a single heap without tracking deletions:** In Java/JavaScript, if you use PriorityQueue, you need lazy deletion to remove old elements. Without it, you can’t efficiently remove arbitrary elements. The pattern is to maintain a separate “delete” heap and clean up when peeking.

4. **Integer division truncation:** The problem expects integer division (floor). Using float division and then casting can lead to off-by-one errors. Use integer division `//` in Python, `Math.floor` in JavaScript, or integer division in Java.

## When You'll See This Pattern

This problem combines **sliding window** with **order statistics maintenance**, a pattern seen in:

- **Find Median from Data Stream (Hard)**: Maintain two heaps (max-heap for lower half, min-heap for upper half) to get median in O(1). Similar rebalancing logic.
- **Kth Largest Element in a Stream (Easy)**: Maintain a min-heap of size k to track k largest elements.
- **Sliding Window Median (Hard)**: Exactly the same as Find Median but with a sliding window—requires removing old elements, similar to MKAverage.

These problems all require maintaining sorted order dynamically as elements are added and removed, using heaps or balanced trees.

## Key Takeaways

1. **Multiset partitioning** is a powerful technique: split data into three groups (smallest k, middle, largest k) and maintain them separately with running sums.
2. **Lazy deletion** in heaps: when you need to remove arbitrary elements from a heap, pair it with a “delete” heap and clean up during peek operations.
3. **Sliding window + order statistics** often requires a combination of queue (for window) and sorted containers (for order). The queue tracks insertion order; the sorted containers track value order.

Related problems: [Find Median from Data Stream](/problem/find-median-from-data-stream), [Kth Largest Element in a Stream](/problem/kth-largest-element-in-a-stream), [Sequentially Ordinal Rank Tracker](/problem/sequentially-ordinal-rank-tracker)
