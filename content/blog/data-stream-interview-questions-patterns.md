---
title: "Data Stream Interview Questions: Patterns and Strategies"
description: "Master Data Stream problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-15"
category: "dsa-patterns"
tags: ["data-stream", "dsa", "interview prep"]
---

Data stream problems test your ability to process sequences of data that arrive incrementally, often with constraints like limited memory or the need for real-time answers. This mirrors real-world systems handling logs, sensor feeds, or financial transactions. In interviews, these questions assess your grasp of efficient data structures and your skill in adapting classic algorithms to a dynamic, one-pass environment.

## Common Patterns

Success in data stream questions hinges on recognizing a few core patterns.

### 1. Sliding Window with Two-Pointers or Deque

For problems involving a fixed-size window (e.g., moving average, max in sliding window), a deque (double-ended queue) is optimal. It maintains candidate elements in decreasing order, allowing O(1) access to the current maximum.

<div class="code-group">

```python
from collections import deque

class MovingMax:
    def __init__(self, size: int):
        self.window = deque()
        self.size = size
        self.queue = deque()

    def next(self, val: int) -> int:
        self.queue.append(val)
        # Maintain decreasing order in self.window
        while self.window and self.window[-1] < val:
            self.window.pop()
        self.window.append(val)

        # Remove elements outside the window
        if len(self.queue) > self.size:
            old = self.queue.popleft()
            if self.window[0] == old:
                self.window.popleft()
        return self.window[0]
```

```javascript
class MovingMax {
  constructor(size) {
    this.window = []; // deque simulation using array
    this.queue = [];
    this.size = size;
  }

  next(val) {
    this.queue.push(val);
    // Maintain decreasing order
    while (this.window.length && this.window[this.window.length - 1] < val) {
      this.window.pop();
    }
    this.window.push(val);

    // Remove if out of window
    if (this.queue.length > this.size) {
      const old = this.queue.shift();
      if (this.window[0] === old) {
        this.window.shift();
      }
    }
    return this.window[0];
  }
}
```

```java
import java.util.ArrayDeque;
import java.util.Deque;

class MovingMax {
    private Deque<Integer> window = new ArrayDeque<>();
    private Deque<Integer> queue = new ArrayDeque<>();
    private int size;

    public MovingMax(int size) {
        this.size = size;
    }

    public int next(int val) {
        queue.offer(val);
        while (!window.isEmpty() && window.peekLast() < val) {
            window.pollLast();
        }
        window.offer(val);

        if (queue.size() > size) {
            int old = queue.poll();
            if (window.peekFirst() == old) {
                window.pollFirst();
            }
        }
        return window.peekFirst();
    }
}
```

</div>

### 2. Two-Heap Pattern for Running Median

Maintaining a running median requires keeping the stream partitioned into a max-heap (lower half) and a min-heap (upper half), balancing their sizes to allow O(1) median retrieval.

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (store negatives)
        self.hi = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lo, -num)
        # Balance step: ensure every element in lo <= every in hi
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.lo) < len(self.hi):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2.0
```

```javascript
class MedianFinder {
  constructor() {
    this.lo = new MaxHeap(); // lower half
    this.hi = new MinHeap(); // upper half
  }

  addNum(num) {
    this.lo.push(num);
    this.hi.push(this.lo.pop());
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop());
    }
  }

  findMedian() {
    if (this.lo.size() > this.hi.size()) {
      return this.lo.peek();
    }
    return (this.lo.peek() + this.hi.peek()) / 2;
  }
}

// MinHeap and MaxHeap implementations omitted for brevity.
```

```java
import java.util.PriorityQueue;
import java.util.Collections;

class MedianFinder {
    private PriorityQueue<Integer> lo; // max-heap
    private PriorityQueue<Integer> hi; // min-heap

    public MedianFinder() {
        lo = new PriorityQueue<>(Collections.reverseOrder());
        hi = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (lo.size() < hi.size()) {
            lo.offer(hi.poll());
        }
    }

    public double findMedian() {
        if (lo.size() > hi.size()) {
            return lo.peek();
        }
        return (lo.peek() + hi.peek()) / 2.0;
    }
}
```

</div>

### 3. Reservoir Sampling for Random Selection

When you need to select a random element from an unknown-sized stream with equal probability, use Reservoir Sampling. For k=1, you maintain a candidate that has a 1/i chance of being replaced by the i-th element.

### 4. Frequency Tracking with Hash Maps

Many problems about top K frequent elements or first unique numbers rely on combining a hash map for counts with a heap or linked list for ordering, updated with each stream element.

## Difficulty Breakdown

Our dataset of 16 questions splits into Easy (19%), Medium (50%), and Hard (31%). This distribution is telling. Medium problems form the core, testing your ability to implement patterns like the two-heap median finder or a sliding window maximum. Easy questions often introduce the stream concept with simple moving averages. The significant Hard portion (nearly one-third) indicates that top companies use these problems to differentiate candidates with challenges like merging multiple streams or complex statistical tracking. You must be comfortable with Medium patterns to have a shot, and prepared for a Hard problem to reach the top tier.

## Which Companies Ask Data Stream

These questions are favorites at companies building large-scale, real-time data systems.

- [Amazon](/company/amazon) frequently asks about sliding windows and order statistics for their streaming analytics.
- [Google](/company/google) and [Meta](/company/meta) use them to assess design of efficient, one-pass algorithms for logging or event processing.
- [Bloomberg](/company/bloomberg) tests on financial data feed problems, like moving averages.
- [Microsoft](/company/microsoft) includes them in interviews for cloud and data platform roles.

## Study Tips

1.  **Master the Core Data Structures:** Be fluent with heaps (priority queues), deques, hash maps, and hash sets. Your solution will almost always be a combination of these.
2.  **Practice One-Pass Logic:** Force yourself to think in terms of a single iteration. Ask: "What minimal state do I need to keep to answer the query after each new element?"
3.  **Start with the Brute Force:** Acknowledge the inefficient, multi-pass solution first. This clarifies the problem and makes the leap to the optimized, stateful approach more logical.
4.  **Simulate the Stream:** On paper, walk through your algorithm step-by-step with a small example stream. This catches balancing errors in two-heap designs or off-by-one errors in sliding windows.

To build the necessary intuition, you need focused repetition.

[Practice all Data Stream questions on CodeJeet](/topic/data-stream)
