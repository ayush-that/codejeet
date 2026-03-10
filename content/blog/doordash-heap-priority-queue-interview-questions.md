---
title: "Heap (Priority Queue) Questions at DoorDash: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-22"
category: "dsa-patterns"
tags: ["doordash", "heap-priority-queue", "interview prep"]
---

## Why Heap (Priority Queue) Matters at DoorDash

With 12 out of 87 tagged problems, Heap (Priority Queue) is a **significant secondary focus** at DoorDash. It's not as ubiquitous as arrays or strings, but it appears frequently enough that you should expect at least one heap question in a typical interview loop. This makes sense given DoorDash's business domain: their core engineering challenges involve real-time order matching, delivery route optimization, and scheduling—all problems where efficiently managing and processing items by priority is essential.

In real interviews, you're most likely to encounter a heap problem in the technical phone screen or the first coding round. These questions often serve as a filter for candidates who can recognize when a brute-force approach is insufficient and apply the right data structure to achieve optimal efficiency. The key insight is that DoorDash uses heap questions not just to test algorithmic knowledge, but to assess your ability to model real-world scheduling and resource allocation problems.

## Specific Patterns DoorDash Favors

DoorDash's heap problems cluster around two distinct patterns that mirror their operational needs:

1.  **"K-th" Selection with Streaming Data:** This is their most common pattern. You're not just finding the top K elements from a static list; you're often processing a continuous stream of data (like incoming delivery requests) and need to maintain the K largest or smallest elements at any moment. This directly models a dispatcher selecting the "best" orders for a Dasher. **LeetCode 703 (Kth Largest Element in a Stream)** is the archetypal example.
2.  **Interval Scheduling & Merging with Priority:** Many problems involve tasks, orders, or time windows (intervals) that need to be scheduled, merged, or checked for conflicts. A heap (usually a min-heap of end times) is the optimal tool to track the soonest-ending task, which is critical for maximizing throughput or minimizing resources. This pattern appears in problems like **LeetCode 253 (Meeting Rooms II)** and its variants.

You'll rarely see esoteric heap applications like merging K sorted lists at DoorDash. Their questions are grounded in operational logic.

## How to Prepare

Master the two patterns above. For "K-th" streaming problems, the recipe is consistent: maintain a min-heap of size K for the K _largest_ elements (so you can efficiently evict the smallest of the large ones), or a max-heap of size K for the K _smallest_. Here's the core implementation for a Kth largest stream:

<div class="code-group">

```python
import heapq

class KthLargest:
    # Time: O(n log k) for initialization, O(log k) for add
    # Space: O(k) for the heap
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.min_heap = []
        for num in nums:
            self.add(num)  # Use add to handle initial building

    def add(self, val: int) -> int:
        heapq.heappush(self.min_heap, val)
        # If heap exceeds size k, remove the smallest (root)
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        # The kth largest is now the smallest in our size-k heap
        return self.min_heap[0]
```

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  push(val) {
    this.heap.push(val);
    this._bubbleUp();
  }
  pop() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown();
    }
    return min;
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
  _bubbleUp() {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[parentIdx] <= element) break;
      [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
      idx = parentIdx;
    }
  }
  _sinkDown() {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;
      if (leftChildIdx < length && this.heap[leftChildIdx] < element) swap = leftChildIdx;
      if (rightChildIdx < length) {
        if (
          (swap === null && this.heap[rightChildIdx] < element) ||
          (swap !== null && this.heap[rightChildIdx] < this.heap[leftChildIdx])
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      [this.heap[idx], this.heap[swap]] = [this.heap[swap], this.heap[idx]];
      idx = swap;
    }
  }
}

class KthLargest {
  // Time: O(n log k) for init, O(log k) for add
  // Space: O(k)
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinHeap();
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val) {
    this.minHeap.push(val);
    if (this.minHeap.size() > this.k) {
      this.minHeap.pop();
    }
    return this.minHeap.peek();
  }
}
```

```java
import java.util.PriorityQueue;

class KthLargest {
    // Time: O(n log k) for constructor, O(log k) for add
    // Space: O(k)
    private final int k;
    private final PriorityQueue<Integer> minHeap;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.minHeap = new PriorityQueue<>();
        for (int num : nums) {
            add(num);
        }
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
        return minHeap.peek();
    }
}
```

</div>

For interval scheduling, the pattern is to sort by start time, then use a min-heap to track end times. When a new interval starts, check if it can reuse the room (or resource) that ends the earliest (heap.peek()). If not, you need a new resource.

## How DoorDash Tests Heap vs Other Companies

At companies like Google or Meta, heap problems can be abstract, complex graph hybrids (e.g., Dijkstra's with a custom priority). At DoorDash, they are almost always **applied and narrative-driven**. You'll be given a story about Dashers, orders, delivery windows, or restaurant prep times. Your first job is to translate that narrative into the correct heap pattern.

The difficulty is moderate—usually LeetCode Medium. The challenge isn't implementing a Fibonacci heap; it's recognizing that the problem _is_ a heap problem amidst the business details. They test your **problem modeling** skills as much as your coding skills. A common trick is to present a problem that seems like it requires sorting the entire dataset, which would be O(n log n), but a heap can provide a more efficient O(n log k) or O(n) solution for the specific ask.

## Study Order

1.  **Heap Fundamentals:** Understand how a min-heap and max-heap work (insert, extract-min, heapify). Implement one from scratch once, then use your language's built-in PriorityQueue.
2.  **Static "K-th Element":** Solve problems like LeetCode 215 (Kth Largest Element in an Array). This teaches you the basic "heap of size K" pattern without the streaming complication.
3.  **Streaming "K-th Element":** Move to LeetCode 703 (Kth Largest Element in a Stream). This is the core DoorDash pattern. Ensure you can explain why a min-heap is used for Kth _largest_.
4.  **Basic Interval Scheduling:** Learn the classic "Meeting Rooms II" (LeetCode 253) solution. This introduces the "sort by start time, heap of end times" pattern.
5.  **Advanced Scheduling Variants:** Tackle problems where the "resource" has a capacity or weight, like tasks and servers. This combines the interval pattern with the "K-th" logic.
6.  **Two-Heap Patterns (for Medians):** Although less common, understanding how to use a max-heap and min-heap to track a median (LeetCode 295) is valuable as it reinforces flexible heap thinking.

This order builds from the data structure itself to its simplest application, then to DoorDash's core patterns, and finally to more complex hybrids.

## Recommended Practice Order

Solve these problems in sequence to build the skills DoorDash tests:

1.  **LeetCode 215 (Kth Largest Element in an Array)** - The foundational "heap of size K" pattern.
2.  **LeetCode 703 (Kth Largest Element in a Stream)** - The essential DoorDash streaming pattern.
3.  **LeetCode 253 (Meeting Rooms II)** - The foundational interval scheduling pattern.
4.  **LeetCode 1834 (Single-Threaded CPU)** - Excellent hybrid: it combines scheduling (by start time) with a heap (for processing time).
5.  **LeetCode 621 (Task Scheduler)** - A more complex scheduling problem that can be solved with a heap and a queue, testing your ability to manage cycles and cooldowns.
6.  **LeetCode 358 (Rearrange String k Distance Apart)** - A challenging variant that tests if you can adapt the heap scheduling pattern to a string manipulation problem.

Focus on the narrative in each problem. Ask yourself: "If this were a DoorDash system, what would the 'tasks' and 'servers' represent?" This mindset shift is what separates adequate preparation from targeted, effective practice.

[Practice Heap (Priority Queue) at DoorDash](/company/doordash/heap-priority-queue)
