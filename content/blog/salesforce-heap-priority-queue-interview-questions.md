---
title: "Heap (Priority Queue) Questions at Salesforce: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-10-07"
category: "dsa-patterns"
tags: ["salesforce", "heap-priority-queue", "interview prep"]
---

Heap (Priority Queue) questions appear in roughly 11% of Salesforce's technical interview problems. This frequency reflects their importance in solving real-world Salesforce engineering challenges, particularly those involving scheduling, resource allocation, and processing data streams—core concepts when dealing with customer requests, batch jobs, or managing system resources efficiently. Mastering heaps demonstrates your ability to optimize for time complexity in scenarios requiring frequent access to the "most extreme" element (largest, smallest, highest priority), a common requirement in large-scale platform development.

## What to Expect — Types of Problems

Salesforce's heap problems typically fall into two categories. First, **classic applications** where the heap is the primary data structure. This includes finding the top K elements from a data stream, merging K sorted lists, or scheduling tasks with priorities. Second, **heap as an optimization tool** within a more complex algorithm. You might see problems where using a heap turns an O(n²) solution into O(n log k), such as finding the median of a data stream or the skyline of a set of buildings. Expect problems to be framed in a business context, like managing customer case priorities or optimizing server load, but the underlying pattern will be a standard heap operation.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the two fundamental heap operations: `push` (insert) and `pop` (remove root), and their O(log n) complexity. Know how to implement both a min-heap and a max-heap in your chosen language. The most critical pattern is the **"Two Heap"** pattern, used for problems like finding a running median. This pattern maintains two heaps: a max-heap for the lower half of numbers and a min-heap for the upper half, balancing them to allow O(1) access to the median.

Here is a basic implementation of the Two Heap pattern for finding the median of a stream:

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (store negatives)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        # Balance: ensure every num in small <= every num in large
        if (self.small and self.large and
            -self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        # Size balance
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

```javascript
class MedianFinder {
  constructor() {
    this.small = new MaxHeap(); // lower half
    this.large = new MinHeap(); // upper half
  }

  addNum(num) {
    this.small.push(num);
    // Balance: ensure max(small) <= min(large)
    if (this.small.size() && this.large.size() && this.small.peek() > this.large.peek()) {
      this.large.push(this.small.pop());
    }
    // Size balance
    if (this.small.size() > this.large.size() + 1) {
      this.large.push(this.small.pop());
    }
    if (this.large.size() > this.small.size()) {
      this.small.push(this.large.pop());
    }
  }

  findMedian() {
    if (this.small.size() > this.large.size()) {
      return this.small.peek();
    }
    return (this.small.peek() + this.large.peek()) / 2;
  }
}

// MinHeap and MaxHeap implementations using array and sort
class MinHeap {
  constructor() {
    this.heap = [];
  }
  push(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => a - b);
  }
  pop() {
    return this.heap.shift();
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}
class MaxHeap extends MinHeap {
  push(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => b - a);
  }
}
```

```java
import java.util.*;

class MedianFinder {
    private PriorityQueue<Integer> small; // max-heap
    private PriorityQueue<Integer> large; // min-heap

    public MedianFinder() {
        small = new PriorityQueue<>(Collections.reverseOrder());
        large = new PriorityQueue<>();
    }

    public void addNum(int num) {
        small.offer(num);
        // Balance: ensure max(small) <= min(large)
        if (!small.isEmpty() && !large.isEmpty() &&
            small.peek() > large.peek()) {
            large.offer(small.poll());
        }
        // Size balance
        if (small.size() > large.size() + 1) {
            large.offer(small.poll());
        }
        if (large.size() > small.size()) {
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        }
        return (small.peek() + large.peek()) / 2.0;
    }
}
```

</div>

## Recommended Practice Order

Start with foundational problems: implement a heap from scratch, then practice "Kth Largest Element in a Stream." Move to core patterns: "Top K Frequent Elements," "Merge K Sorted Lists," and "Task Scheduler." Finally, tackle optimization problems: "Find Median from Data Stream" (Two Heap pattern) and "Skyline Problem." This progression builds from simple heap mechanics to integrating heaps into complex solutions.

[Practice Heap (Priority Queue) at Salesforce](/company/salesforce/heap-priority-queue)
