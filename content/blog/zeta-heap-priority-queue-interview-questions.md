---
title: "Heap (Priority Queue) Questions at Zeta: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Zeta — patterns, difficulty breakdown, and study tips."
date: "2030-05-30"
category: "dsa-patterns"
tags: ["zeta", "heap-priority-queue", "interview prep"]
---

If you're preparing for Zeta interviews, you'll notice that 4 out of their 35 tagged problems on LeetCode involve Heaps (Priority Queues). That's roughly 11% of their problem set, which is a significant enough concentration to demand focused preparation. While not their absolute top category, it's a consistent and important one. In real interviews, this translates to a high probability of encountering at least one heap-based problem, especially in the second or third technical round where they assess your ability to manage complexity and optimize for real-time or streaming data scenarios—areas highly relevant to Zeta's work in financial technology and transaction processing.

## Specific Patterns Zeta Favors

Zeta's heap problems aren't about obscure, academic applications. They focus on practical patterns that model real-world system design, particularly around ordering, scheduling, and finding top/bottom K elements from dynamic data. The two patterns they consistently test are:

1.  **The "K-th" Pattern:** Finding the Kth largest, smallest, or most frequent element. This directly models scenarios like identifying top spenders, most frequent transaction errors, or maintaining leaderboards.
2.  **The "Two Heaps" Pattern:** Using a min-heap and a max-heap together to maintain a running median or to partition data dynamically. This is a classic pattern for streaming data, which is core to processing financial transactions.

You will _not_ typically see heap problems deeply nested within complex graph algorithms at Zeta (unlike at some companies focusing on mapping or social networks). Their problems are more self-contained and algorithmic.

For example, **Kth Largest Element in a Stream (LeetCode #703)** is a quintessential Zeta-style problem. It tests if you understand that a heap is more efficient than sorting for a continuously growing dataset. **Find Median from Data Stream (LeetCode #295)** is another classic that tests the two-heap pattern, a must-know for any Zeta candidate.

## How to Prepare

Your preparation should move from understanding the basic library implementation to manually implementing the two key patterns. Let's start with the most fundamental operation: using a heap to find the Kth largest element in a stream. The trick is to maintain a _min-heap_ of size K containing the K largest elements seen so far. The smallest of those K (the heap's root) is your answer.

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
            self.add(num)  # Use add to handle initial array

    def add(self, val: int) -> int:
        # Push value to heap
        heapq.heappush(self.min_heap, val)
        # If heap exceeds size k, remove the smallest (root)
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        # Root is now the kth largest
        return self.min_heap[0]
```

```javascript
class KthLargest {
  // Time: O(n log k) for initialization, O(log k) for add
  // Space: O(k) for the heap
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue(); // Using library
    nums.forEach((num) => this.add(num));
  }

  add(val) {
    this.minHeap.enqueue(val);
    if (this.minHeap.size() > this.k) {
      this.minHeap.dequeue(); // Removes smallest
    }
    return this.minHeap.front().element;
  }
}
// Note: Uses 'datastructures-js/priority-queue' or similar library.
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

The next critical pattern is the Two Heaps for median finding. This is where you separate incoming numbers into a max-heap (for the lower half) and a min-heap (for the upper half), balancing them to have the median at the interface.

<div class="code-group">

```python
import heapq

class MedianFinder:
    # Time: O(log n) per addNum, O(1) for findMedian
    # Space: O(n) for storing all numbers
    def __init__(self):
        # max_heap stores lower half (inverted min-heap)
        self.max_heap = []
        # min_heap stores upper half
        self.min_heap = []

    def addNum(self, num: int) -> None:
        # Always push to max_heap first
        heapq.heappush(self.max_heap, -num)
        # Ensure every element in max_heap <= every element in min_heap
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        # Balance sizes: max_heap can have one more element at most
        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def findMedian(self) -> float:
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        return (-self.max_heap[0] + self.min_heap[0]) / 2
```

```javascript
class MedianFinder {
  // Time: O(log n) per addNum, O(1) for findMedian
  // Space: O(n)
  constructor() {
    // Max heap for lower half (using negative values in min-heap)
    this.maxHeap = new MinPriorityQueue({ priority: (x) => -x });
    // Min heap for upper half
    this.minHeap = new MinPriorityQueue();
  }

  addNum(num) {
    this.maxHeap.enqueue(num);
    this.minHeap.enqueue(this.maxHeap.dequeue().element);
    if (this.maxHeap.size() < this.minHeap.size()) {
      this.maxHeap.enqueue(this.minHeap.dequeue().element);
    }
  }

  findMedian() {
    if (this.maxHeap.size() > this.minHeap.size()) {
      return this.maxHeap.front().element;
    }
    return (this.maxHeap.front().element + this.minHeap.front().element) / 2;
  }
}
```

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    // Time: O(log n) per addNum, O(1) for findMedian
    // Space: O(n)
    private PriorityQueue<Integer> maxHeap; // Lower half
    private PriorityQueue<Integer> minHeap; // Upper half

    public MedianFinder() {
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        maxHeap.offer(num);
        minHeap.offer(maxHeap.poll());
        if (maxHeap.size() < minHeap.size()) {
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

## How Zeta Tests Heap (Priority Queue) vs Other Companies

At companies like Google or Meta, heap problems are often a single component of a larger, more complex problem—perhaps part of a Dijkstra's algorithm in a massive graph or an A\* search. The heap is a tool to enable a primary algorithm.

At Zeta, the heap _is_ often the primary algorithm. Their questions test your fundamental understanding of when and why to use this data structure for efficiency gains in data processing. The difficulty is not in complex graph theory but in cleanly implementing the pattern under constraints (like streaming data) and correctly reasoning about time complexity. They want to see if you can identify that a naive sorting approach (O(n log n)) is unacceptable when a heap (O(n log k) or O(log n) per operation) is possible.

## Study Order

Don't jump straight into heap problems. Build a logical progression:

1.  **Basic Data Structure Review:** Understand arrays and sorting. You need to know why O(n log n) sorting is the baseline you're trying to beat.
2.  **Heap Fundamentals:** Learn what a heap is (a complete binary tree with heap property), its basic operations (insert O(log n), peek O(1), delete-root O(log n)), and how your language implements it (usually as a priority queue).
3.  **Basic "K-th" Pattern:** Start with static array problems like "Kth Largest Element in an Array" (#215) to internalize the heap size trick.
4.  **Streaming "K-th" Pattern:** Move to the streaming version (#703) to understand the dynamic maintenance aspect.
5.  **Two Heaps Pattern:** Tackle the median finder (#295). This is the peak of typical Zeta heap complexity.
6.  **Slight Variations:** Practice problems that combine heaps with simple greedy logic or scheduling, like "Meeting Rooms II" (#253) or "Top K Frequent Elements" (#347).

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **Kth Largest Element in an Array (LeetCode #215):** The foundational pattern. Implement with a min-heap of size K.
2.  **Kth Largest Element in a Stream (LeetCode #703):** The dynamic version. Tests if you truly understand the pattern.
3.  **Top K Frequent Elements (LeetCode #347):** A slight variation using a hash map with the heap. Very common.
4.  **Find Median from Data Stream (LeetCode #295):** Master the two-heap pattern. This is a Zeta favorite.
5.  **Meeting Rooms II (LeetCode #253):** Applies the heap to a scheduling problem, testing if you can adapt the pattern.
6.  **Ugly Number II (LeetCode #264):** An excellent problem to see heaps used in a number generation context, stretching your understanding.

Mastering these patterns will make you confident walking into a Zeta interview. They signal that you can design efficient, scalable data processing components—a skill directly valuable in their domain.

[Practice Heap (Priority Queue) at Zeta](/company/zeta/heap-priority-queue)
