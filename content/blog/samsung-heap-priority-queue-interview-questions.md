---
title: "Heap (Priority Queue) Questions at Samsung: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Samsung — patterns, difficulty breakdown, and study tips."
date: "2028-11-26"
category: "dsa-patterns"
tags: ["samsung", "heap-priority-queue", "interview prep"]
---

If you're preparing for a Samsung coding interview, you'll likely face a Heap (Priority Queue) problem. With 10 out of 69 of their tagged LeetCode problems involving heaps, it's a significant, recurring theme—not a niche topic you can safely ignore. In my experience and from conversations with others, these questions appear frequently in their real interviews, often in the second technical round. They are used to assess a candidate's ability to manage dynamic data streams and optimize "k-th" or "top-k" operations, which are common in systems design and resource scheduling—areas highly relevant to Samsung's work in consumer electronics, semiconductors, and networks. Mastering heaps isn't just about solving a problem; it's about demonstrating you can think in terms of efficient, real-time data processing.

## Specific Patterns Samsung Favors

Samsung's heap problems tend to cluster around a few practical patterns rather than abstract graph theory. You won't often see a heap buried deep inside a complex dynamic programming solution here. Instead, they favor direct, applicable scenarios.

1.  **The "K-th" Element & Top-K Pattern:** This is their bread and butter. Problems where you must find the k-th largest, smallest, most frequent, or closest element in a dataset. The classic approach is to use a min-heap to track the top k largest elements or a max-heap for the top k smallest. This pattern tests if you understand heap size management.
    - **Example Problems:** `Kth Largest Element in a Stream (#703)` is a quintessential example. `Top K Frequent Elements (#347)` and `K Closest Points to Origin (#973)` are also highly relevant.

2.  **The "Two Heaps" Pattern for Medians & Sliding Windows:** Samsung asks questions that require maintaining two halves of a dataset. This pattern is perfect for running medians or balancing costs. One max-heap holds the smaller half of numbers, and one min-heap holds the larger half.
    - **Example Problem:** `Find Median from Data Stream (#295)` is the canonical problem. A variant might involve a sliding window median.

3.  **Heap as an Optimizer in Simulation/Greedy Problems:** You'll find problems where you have a series of tasks, meetings, or events with start/end times or costs, and you need to minimize resources (like rooms, machines, or total cost). The heap efficiently tracks the "most available" or "cheapest" resource.
    - **Example Problems:** `Meeting Rooms II (#253)` (finding minimum meeting rooms) is a classic. `Course Schedule III (#630)` is a harder, classic greedy+heap problem.

Here is the core implementation for the Top-K pattern using a min-heap. Notice how the heap's size is strictly maintained at `k`.

<div class="code-group">

```python
import heapq
from typing import List

class KthLargest:
    # Time: O(n log k) for initialization, O(log k) for add
    # Space: O(k) for the heap
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.min_heap = []
        for num in nums:
            self.add(num)  # Use add to handle initial building

    def add(self, val: int) -> int:
        # Push the new value onto the heap
        heapq.heappush(self.min_heap, val)
        # If heap size exceeds k, pop the smallest (root) of the min-heap.
        # This maintains the heap as the 'k' largest elements seen.
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        # The k-th largest is now the smallest element in our heap of size k.
        return self.min_heap[0]
```

```javascript
class KthLargest {
  // Time: O(n log k) for initialization, O(log k) for add
  // Space: O(k) for the heap
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue(); // Using library syntax for clarity
    // Many JS environments use a library like `priority-queue` or `heapq`.
    // Interview context: you'd implement a heap or explain the API.
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val) {
    this.minHeap.enqueue(val);
    if (this.minHeap.size() > this.k) {
      this.minHeap.dequeue(); // Removes the smallest element
    }
    return this.minHeap.front().element; // Peek at the smallest in the heap
  }
}
// Note: In a real interview, you may need to implement a MinHeap class.
```

```java
import java.util.PriorityQueue;

class KthLargest {
    // Time: O(n log k) for initialization, O(log k) for add
    // Space: O(k) for the heap
    private int k;
    private PriorityQueue<Integer> minHeap;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.minHeap = new PriorityQueue<>(); // Java's PQ is a min-heap by default
        for (int num : nums) {
            add(num); // Use add to handle initial building
        }
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll(); // Removes the smallest element (root)
        }
        return minHeap.peek(); // The k-th largest is the smallest in our heap
    }
}
```

</div>

## How Samsung Tests Heap (Priority Queue) vs Other Companies

Samsung's heap questions are typically **medium-difficulty** and **standalone**. Unlike companies like Google or Meta, which might embed a heap inside a complex graph algorithm (e.g., Dijkstra's for a novel problem), Samsung's problems are more likely to be a direct test of the heap pattern itself. The challenge is in cleanly implementing the pattern and handling edge cases (empty inputs, k larger than the dataset). The "twist" is usually in the problem framing—it might be about server loads, sensor data points, or task scheduling—but the core algorithm remains the classic heap approach. Their focus is on **applied correctness and efficiency** over algorithmic cleverness for its own sake.

## How to Prepare

1.  **Internalize the Two Core Heap Types:** Know that a "min-heap" gives you the smallest element at the root in O(1) time, and a "max-heap" gives you the largest. Most languages provide a min-heap by default (Python's `heapq`, Java's `PriorityQueue`). For a max-heap, you invert the comparator.
2.  **Pattern Recognition Drills:** When you read a problem, ask: Is it asking for a "k-th" element? Is it about merging sorted lists? Does it involve scheduling/overlaps? These keywords should trigger the heap pattern in your mind.
3.  **Practice Writing the Code from Scratch:** Don't just understand it. Write the `KthLargest` class, the two-heap median finder, and the meeting rooms scheduler multiple times until you can do it without referencing notes. Interview pressure will magnify any uncertainty.

Let's look at the Two Heaps pattern for medians, another Samsung favorite.

<div class="code-group">

```python
import heapq

class MedianFinder:
    # Time: O(log n) per addNum, O(1) for findMedian
    # Space: O(n) for storing all numbers across two heaps
    def __init__(self):
        # max_heap stores the smaller half (inverted min-heap)
        self.max_heap = []  # In Python, we simulate max-heap with negative values
        # min_heap stores the larger half
        self.min_heap = []

    def addNum(self, num: int) -> None:
        # Always push to max_heap first (the smaller half)
        heapq.heappush(self.max_heap, -num)
        # Ensure every element in max_heap <= every element in min_heap
        # Move the largest from the smaller half to the larger half
        if (self.max_heap and self.min_heap and
                (-self.max_heap[0]) > self.min_heap[0]):
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))

        # Rebalance sizes: len(max_heap) should be >= len(min_heap), at most +1
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def findMedian(self) -> float:
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]  # Odd count, median is the root of max_heap
        # Even count, median is average of two roots
        return (-self.max_heap[0] + self.min_heap[0]) / 2
```

```javascript
// Using a simple array heap implementation for clarity in interview context
class MedianFinder {
  constructor() {
    this.maxHeap = new MaxHeap(); // Holds smaller half
    this.minHeap = new MinHeap(); // Holds larger half
  }
  // Time: O(log n) per addNum, O(1) for findMedian
  // Space: O(n)
  addNum(num) {
    this.maxHeap.push(num);
    // Balance step 1: Ensure maxHeap.root <= minHeap.root
    if (this.minHeap.size() > 0 && this.maxHeap.peek() > this.minHeap.peek()) {
      this.minHeap.push(this.maxHeap.pop());
    }
    // Balance step 2: Maintain size property |maxHeap| >= |minHeap|, diff <= 1
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.push(this.maxHeap.pop());
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      this.maxHeap.push(this.minHeap.pop());
    }
  }
  findMedian() {
    if (this.maxHeap.size() > this.minHeap.size()) {
      return this.maxHeap.peek();
    }
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}
// Assume MaxHeap and MinHeap are implemented.
```

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    // Time: O(log n) per addNum, O(1) for findMedian
    // Space: O(n)
    private PriorityQueue<Integer> maxHeap; // smaller half (needs max, so use reverseOrder)
    private PriorityQueue<Integer> minHeap; // larger half

    public MedianFinder() {
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        maxHeap.offer(num);
        // Ensure maxHeap.peek() <= minHeap.peek()
        if (!minHeap.isEmpty() && maxHeap.peek() > minHeap.peek()) {
            minHeap.offer(maxHeap.poll());
        }
        // Balance sizes
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}
```

</div>

## Study Order

1.  **Heap Fundamentals:** Understand `heapify`, `heappush`, `heappop`, and their time complexities. Implement a basic heap from scratch once for deep understanding.
2.  **The "K-th" Pattern:** Start here. It's the most straightforward application. Learn to maintain a heap of size `k`.
3.  **The "Two Heaps" Pattern:** Move to this next. It builds on the first by managing two heaps and a balance condition. This is critical for running median problems.
4.  **Greedy + Heap Patterns:** Finally, tackle problems where the heap is used as a tool in a larger greedy strategy, like `Meeting Rooms II` or `Course Schedule III`. This tests your ability to combine patterns.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  `Kth Largest Element in a Stream (#703)` - Pure "K-th" pattern.
2.  `K Closest Points to Origin (#973)` - "K-th" pattern with a custom comparator.
3.  `Top K Frequent Elements (#347)` - "K-th" pattern combined with a hash map.
4.  `Find Median from Data Stream (#295)` - Master the "Two Heaps" pattern.
5.  `Meeting Rooms II (#253)` - Learn to use a heap for greedy scheduling.
6.  `Course Schedule III (#630)` - A challenging but excellent greedy+heap problem.
7.  `Ugly Number II (#264)` - A different flavor using a heap for number generation.

By following this progression, you'll move from isolated heap operations to integrating heaps into problem-solving strategies, which is exactly what Samsung interviewers are looking for.

[Practice Heap (Priority Queue) at Samsung](/company/samsung/heap-priority-queue)
