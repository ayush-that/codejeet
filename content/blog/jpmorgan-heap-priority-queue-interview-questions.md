---
title: "Heap (Priority Queue) Questions at JPMorgan: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-27"
category: "dsa-patterns"
tags: ["jpmorgan", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at JPMorgan: What to Expect

If you're preparing for a JPMorgan technical interview, you've probably noticed their question distribution: 9 out of 78 tagged problems involve heaps or priority queues. That's roughly 11.5% of their problem set—not the largest category, but significant enough that you'll almost certainly encounter at least one heap question in your interview loop.

Here's what most candidates miss: JPMorgan doesn't just test heaps as an isolated data structure. They use priority queues as a tool for solving _financial domain problems_—think real-time data streams, transaction ordering, risk calculations, and scheduling systems. While other companies might ask abstract algorithmic heap problems, JPMorgan tends to wrap them in business-relevant contexts.

## Specific Patterns JPMorgan Favors

JPMorgan's heap problems cluster around three specific patterns:

1. **K-th Element Problems** - Finding the Kth largest/smallest element in a data stream or array. This pattern appears in scenarios like monitoring top-performing stocks or identifying outlier transactions.

2. **Merge K Sorted Sequences** - Combining multiple sorted data sources, which mirrors real-time market data aggregation from different exchanges or feeds.

3. **Interval Scheduling with Priority** - Managing overlapping time intervals with constraints, applicable to trade execution scheduling or resource allocation.

Let's look at the most frequent pattern: finding the Kth largest element in a stream. This appears in variations throughout their problem set, including LeetCode 703 (Kth Largest Element in a Stream) and 215 (Kth Largest Element in an Array).

<div class="code-group">

```python
# Pattern: Kth Largest Element in a Stream
# Time: O(n log k) for initialization, O(log k) for add()
# Space: O(k) for storing k elements in heap

import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.min_heap = []

        # Initialize with first k elements or all if fewer
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        # Push new value to heap
        heapq.heappush(self.min_heap, val)

        # Maintain heap size = k by removing smallest if needed
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)

        # Root of min-heap is kth largest
        return self.min_heap[0]
```

```javascript
// Pattern: Kth Largest Element in a Stream
// Time: O(n log k) for initialization, O(log k) for add()
// Space: O(k) for storing k elements in heap

class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue();

    // Initialize heap
    nums.forEach((num) => this.add(num));
  }

  add(val) {
    // Add new value
    this.minHeap.enqueue(val);

    // Maintain size k
    if (this.minHeap.size() > this.k) {
      this.minHeap.dequeue();
    }

    // Front of min-heap is kth largest
    return this.minHeap.front().element;
  }
}

// Note: Using a library for priority queue; in interviews,
// you might implement your own min-heap
```

```java
// Pattern: Kth Largest Element in a Stream
// Time: O(n log k) for initialization, O(log k) for add()
// Space: O(k) for storing k elements in heap

import java.util.PriorityQueue;

class KthLargest {
    private int k;
    private PriorityQueue<Integer> minHeap;

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

The key insight here is using a _min-heap_ to track the Kth _largest_ element. By keeping only K elements in the heap and ensuring it's a min-heap, the smallest element in the heap (the root) is actually the Kth largest overall. This counterintuitive approach—using a min-heap to find largest elements—is exactly the kind of pattern JPMorgan interviewers look for you to recognize.

## How to Prepare

Most candidates make the mistake of memorizing heap implementations without understanding _when_ to use them. Here's a better approach:

1. **Recognize the "K" pattern** - Any problem asking for "top K," "Kth largest/smallest," or "K closest" should immediately make you think: "Can a heap solve this efficiently?"

2. **Know your heap types** - Use a min-heap when you need to keep the largest elements (by removing the smallest), and a max-heap when you need to keep the smallest elements (by removing the largest).

3. **Practice the two-heap pattern** for median finding problems, which JPMorgan occasionally asks in more senior interviews.

<div class="code-group">

```python
# Pattern: Two Heaps for Running Median
# Time: O(log n) per addNum, O(1) for findMedian
# Space: O(n) for storing all elements

import heapq

class MedianFinder:
    def __init__(self):
        # Max-heap for lower half (invert min-heap with negative values)
        self.lower = []
        # Min-heap for upper half
        self.upper = []

    def addNum(self, num: int) -> None:
        # Add to appropriate heap
        if not self.lower or num <= -self.lower[0]:
            heapq.heappush(self.lower, -num)
        else:
            heapq.heappush(self.upper, num)

        # Balance heaps (size difference <= 1)
        if len(self.lower) > len(self.upper) + 1:
            heapq.heappush(self.upper, -heapq.heappop(self.lower))
        elif len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2
```

```javascript
// Pattern: Two Heaps for Running Median
// Time: O(log n) per addNum, O(1) for findMedian
// Space: O(n) for storing all elements

class MedianFinder {
  constructor() {
    // Max-heap for lower half
    this.lower = new MaxPriorityQueue();
    // Min-heap for upper half
    this.upper = new MinPriorityQueue();
  }

  addNum(num) {
    if (this.lower.size() === 0 || num <= this.lower.front().element) {
      this.lower.enqueue(num);
    } else {
      this.upper.enqueue(num);
    }

    // Balance heaps
    if (this.lower.size() > this.upper.size() + 1) {
      this.upper.enqueue(this.lower.dequeue().element);
    } else if (this.upper.size() > this.lower.size()) {
      this.lower.enqueue(this.upper.dequeue().element);
    }
  }

  findMedian() {
    if (this.lower.size() > this.upper.size()) {
      return this.lower.front().element;
    }
    return (this.lower.front().element + this.upper.front().element) / 2;
  }
}
```

```java
// Pattern: Two Heaps for Running Median
// Time: O(log n) per addNum, O(1) for findMedian
// Space: O(n) for storing all elements

import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    private PriorityQueue<Integer> lower; // Max-heap
    private PriorityQueue<Integer> upper; // Min-heap

    public MedianFinder() {
        lower = new PriorityQueue<>(Collections.reverseOrder());
        upper = new PriorityQueue<>();
    }

    public void addNum(int num) {
        if (lower.isEmpty() || num <= lower.peek()) {
            lower.offer(num);
        } else {
            upper.offer(num);
        }

        // Balance heaps
        if (lower.size() > upper.size() + 1) {
            upper.offer(lower.poll());
        } else if (upper.size() > lower.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() > upper.size()) {
            return lower.peek();
        }
        return (lower.peek() + upper.peek()) / 2.0;
    }
}
```

</div>

## How JPMorgan Tests Heap (Priority Queue) vs Other Companies

JPMorgan's heap questions differ from FAANG companies in three key ways:

1. **Less emphasis on complex graph algorithms** - While Google might ask Dijkstra's with a heap optimization, JPMorgan focuses on more direct heap applications.

2. **More business context** - Problems often involve financial data streams, transaction ordering, or scheduling systems rather than abstract computer science scenarios.

3. **Intermediate difficulty** - JPMorgan rarely asks the hardest heap problems (like "Merge K Sorted Lists" with optimal divide-and-conquer). Their questions tend to be LeetCode medium level.

The unique aspect of JPMorgan's approach is their focus on _maintainability_ and _readability_ alongside correctness. They want to see that you can implement an efficient solution that other developers could understand and maintain—not just the most clever, optimized version.

## Study Order

Follow this progression to build your heap skills systematically:

1. **Heap fundamentals** - Understand how heaps work internally (complete binary tree, heapify operations). You don't need to implement from scratch in interviews, but understanding the mechanics helps.

2. **Basic operations** - Practice push, pop, peek operations and their time complexities (O(log n) for push/pop, O(1) for peek).

3. **K-element patterns** - Start with "Kth Largest Element in an Array" (#215), then progress to stream versions (#703).

4. **Two-heap patterns** - Learn the running median pattern (#295) as it's a classic interview question.

5. **Merge K sorted sequences** - Practice the standard solution (#23), which is common in financial data aggregation scenarios.

6. **Interval problems with heaps** - Study how heaps can optimize interval scheduling (#253).

This order works because each step builds on the previous one. The K-element patterns teach you the core heap intuition, while two-heap patterns introduce balancing concepts. Merge K sorted sequences combines heap usage with iteration logic, and interval problems apply heaps to more complex scenarios.

## Recommended Practice Order

Solve these problems in sequence:

1. **LeetCode 215 - Kth Largest Element in an Array** - The foundational problem for understanding heap selection.

2. **LeetCode 703 - Kth Largest Element in a Stream** - Adds the streaming component relevant to financial data.

3. **LeetCode 1046 - Last Stone Weight** - A simpler heap application that reinforces basic operations.

4. **LeetCode 973 - K Closest Points to Origin** - Applies the K pattern to geometric data.

5. **LeetCode 295 - Find Median from Data Stream** - Master the two-heap pattern.

6. **LeetCode 253 - Meeting Rooms II** - Heap application to interval scheduling.

7. **LeetCode 23 - Merge K Sorted Lists** - The classic heap problem for data aggregation.

8. **LeetCode 621 - Task Scheduler** - A more complex heap problem that appears in senior interviews.

9. **LeetCode 358 - Rearrange String k Distance Apart** - Advanced pattern if you have extra time.

Focus on understanding _why_ the heap solution works for each problem, not just memorizing the code. During your JPMorgan interview, you'll need to explain your reasoning clearly, connecting the heap approach to the problem's requirements.

Remember: JPMorgan interviewers are evaluating not just whether you get the right answer, but whether you can apply data structures appropriately to solve business problems. A heap is rarely the only solution, but it's often the most efficient one for problems involving priority, ordering, or top-K elements in streaming data.

[Practice Heap (Priority Queue) at JPMorgan](/company/jpmorgan/heap-priority-queue)
