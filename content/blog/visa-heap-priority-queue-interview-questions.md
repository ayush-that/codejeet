---
title: "Heap (Priority Queue) Questions at Visa: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Visa — patterns, difficulty breakdown, and study tips."
date: "2028-04-10"
category: "dsa-patterns"
tags: ["visa", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Visa: What to Expect

Visa’s coding interview problem list includes 12 Heap (Priority Queue) questions out of 124 total—that’s roughly 10% of their problem bank. In practice, this means you have a solid chance of encountering at least one heap problem in your interview loop, especially in rounds focused on data structures or system design components where efficient scheduling and ordering matter. While not as dominant as arrays or strings, heaps are a secondary focus area that often appears in the context of real-time transaction processing simulations, priority-based task scheduling, or optimizing resource allocation—all relevant to Visa’s payments infrastructure. If you’re interviewing for a backend or data-intensive role, expect heap questions to carry more weight.

## Specific Patterns Visa Favors

Visa’s heap problems tend to cluster around a few practical patterns rather than abstract algorithmic puzzles. The most common theme is **“K-th” or “Top K” element problems**, which directly model scenarios like identifying the highest-value transactions, most frequent payment methods, or nearest merchant locations. These questions test whether you can optimize beyond naive sorting.

Another frequent pattern is **heap as a component in a multi-step algorithm**, often paired with sorting, greedy approaches, or simulation. For example, you might use a heap to merge sorted lists of transaction logs or to manage event timers in a mock authorization system. Visa rarely asks pure “implement a heap” questions; instead, they embed heap usage within a larger problem that requires recognizing when ordered dynamic access is needed.

Specific LeetCode problems that mirror Visa’s style include:

- **Kth Largest Element in a Stream (#703)** – Classic for maintaining a top-K set over streaming data.
- **Meeting Rooms II (#253)** – Uses a min-heap to track room availability, analogous to resource scheduling.
- **Task Scheduler (#621)** – A more advanced greedy/heap combo for task prioritization.

Notice these are all applied problems—you’re using a heap to solve a tangible scheduling or selection task.

## How to Prepare

Master two core heap techniques: the **two-heap pattern** for medians or sliding windows, and the **single-heap pattern** for top-K or merging. Below is the two-heap pattern for finding a running median, a problem that tests real-time data processing—a key Visa domain.

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        # Max heap for lower half (invert values for Python's min-heap)
        self.low = []
        # Min heap for upper half
        self.high = []

    def addNum(self, num: int) -> None:
        # Push to low (as negative for max-heap behavior)
        heapq.heappush(self.low, -num)
        # Ensure every element in low <= every element in high
        if self.low and self.high and -self.low[0] > self.high[0]:
            heapq.heappush(self.high, -heapq.heappop(self.low))
        # Balance sizes so they differ by at most 1
        if len(self.low) > len(self.high) + 1:
            heapq.heappush(self.high, -heapq.heappop(self.low))
        elif len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2

# Time: O(log n) per addNum, O(1) for findMedian
# Space: O(n) for storing all numbers across both heaps
```

```javascript
class MedianFinder {
  constructor() {
    // Max heap (lower half) using negative values in a min-heap
    this.low = new MinHeap((a, b) => a - b);
    // Min heap (upper half)
    this.high = new MinHeap((a, b) => a - b);
  }

  addNum(num) {
    this.low.push(-num);
    // Ensure low's max <= high's min
    if (this.low.size() && this.high.size() && -this.low.peek() > this.high.peek()) {
      this.high.push(-this.low.pop());
    }
    // Balance sizes
    if (this.low.size() > this.high.size() + 1) {
      this.high.push(-this.low.pop());
    } else if (this.high.size() > this.low.size()) {
      this.low.push(-this.high.pop());
    }
  }

  findMedian() {
    if (this.low.size() > this.high.size()) {
      return -this.low.peek();
    }
    return (-this.low.peek() + this.high.peek()) / 2;
  }
}

// MinHeap implementation for completeness
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }
  push(val) {
    this.heap.push(val);
    this.heapifyUp();
  }
  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.heapifyDown();
    }
    return top;
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
  heapifyUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.comparator(this.heap[p], this.heap[i]) <= 0) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  heapifyDown() {
    let i = 0;
    const n = this.heap.length;
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.comparator(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < n && this.comparator(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

// Time: O(log n) per addNum, O(1) for findMedian
// Space: O(n)
```

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    private PriorityQueue<Integer> low; // Max heap (store negatives for max behavior)
    private PriorityQueue<Integer> high; // Min heap

    public MedianFinder() {
        low = new PriorityQueue<>(Collections.reverseOrder()); // Actually a max-heap
        high = new PriorityQueue<>();
    }

    public void addNum(int num) {
        low.offer(num);
        // Ensure low's max <= high's min
        if (!low.isEmpty() && !high.isEmpty() && low.peek() > high.peek()) {
            high.offer(low.poll());
        }
        // Balance sizes
        if (low.size() > high.size() + 1) {
            high.offer(low.poll());
        } else if (high.size() > low.size()) {
            low.offer(high.poll());
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) {
            return low.peek();
        }
        return (low.peek() + high.peek()) / 2.0;
    }
}

// Time: O(log n) per addNum, O(1) for findMedian
// Space: O(n)
```

</div>

Another essential pattern is the **single-heap for top-K**, which you can practice with “Kth Largest Element in an Array” (#215). Here’s the efficient O(n log k) solution:

<div class="code-group">

```python
import heapq

def findKthLargest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)  # Remove smallest, keep k largest
    return min_heap[0]  # Kth largest is the smallest in the heap of k largest

# Time: O(n log k) where n = len(nums)
# Space: O(k) for the heap
```

```javascript
function findKthLargest(nums, k) {
  const minHeap = new MinHeap();
  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) {
      minHeap.pop(); // Remove smallest
    }
  }
  return minHeap.peek(); // Kth largest is root of heap of size k
}

// Using the MinHeap class from previous example

// Time: O(n log k)
// Space: O(k)
```

```java
import java.util.PriorityQueue;

public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // Remove smallest
        }
    }
    return minHeap.peek(); // Kth largest
}

// Time: O(n log k)
// Space: O(k)
```

</div>

## How Visa Tests Heap (Priority Queue) vs Other Companies

Compared to companies like Google or Meta, Visa’s heap questions are less about clever algorithmic tricks and more about **practical application**. Google might ask a heap problem disguised as a graph search (e.g., Dijkstra’s with a min-heap), while Visa is more likely to frame it as “process these transactions in priority order” or “schedule these batch jobs.” The difficulty is usually medium—LeetCode medium level—with an emphasis on clean, maintainable code over one-line optimizations.

What’s unique is the **domain context**: problems often involve streams of data (like transaction feeds) or resource constraints (like server capacity), reflecting real backend systems. You’re less likely to see purely mathematical heap puzzles and more likely to see heap as part of a system design discussion.

## Study Order

1. **Heap fundamentals** – Understand how a min-heap and max-heap work, and the O(log n) insert/delete operations. Implement one from scratch once.
2. **Basic top-K problems** – Start with “Kth Largest Element in an Array” (#215) to learn the size-k heap trick.
3. **Streaming top-K** – Move to “Kth Largest Element in a Stream” (#703) to handle dynamic data.
4. **Scheduling with heaps** – Tackle “Meeting Rooms II” (#253) to see heap used for timeline management.
5. **Two-heap patterns** – Practice “Find Median from Data Stream” (#295) for running calculations.
6. **Advanced greedy/heap combos** – Finally, attempt “Task Scheduler” (#621) or “Merge K Sorted Lists” (#23) for complex integrations.

This order builds from static to dynamic data, then from single-heap to multi-heap, and finally to hybrid patterns—ensuring you layer complexity gradually.

## Recommended Practice Order

Solve these problems in sequence to build Visa-relevant heap skills:

1. **Kth Largest Element in an Array (#215)** – Foundational top-K.
2. **Kth Largest Element in a Stream (#703)** – Adds streaming aspect.
3. **Top K Frequent Elements (#347)** – Introduces frequency counting with heap.
4. **Meeting Rooms II (#253)** – Classic scheduling application.
5. **Find Median from Data Stream (#295)** – Master the two-heap technique.
6. **Task Scheduler (#621)** – Advanced greedy/heap for prioritization.
7. **Merge K Sorted Lists (#23)** – If time permits, for heap in merging contexts.

This sequence covers 90% of Visa’s heap problem styles, with increasing integration of real-world constraints.

[Practice Heap (Priority Queue) at Visa](/company/visa/heap-priority-queue)
