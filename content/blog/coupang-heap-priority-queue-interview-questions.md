---
title: "Heap (Priority Queue) Questions at Coupang: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-30"
category: "dsa-patterns"
tags: ["coupang", "heap-priority-queue", "interview prep"]
---

## Why Heap (Priority Queue) Matters at Coupang

Coupang's technical interviews feature Heap (Priority Queue) problems in roughly 17% of their coding questions (9 out of 53). This isn't a coincidence — it reflects their operational reality. As a logistics and e-commerce giant, Coupang deals constantly with optimization problems: scheduling delivery routes, managing warehouse inventory priorities, processing real-time orders by urgency, and balancing server loads. These are classic use cases for heaps. In interviews, they're not testing academic knowledge; they're assessing whether you can recognize when a heap is the right tool for a real-world efficiency problem. Expect at least one heap question in most onsite loops, often as the second problem in a coding round.

## Specific Patterns Coupang Favors

Coupang's heap problems tend to cluster around two practical themes: **"Top K" streaming analysis** and **"Scheduled Task" simulation**. You won't often see esoteric heap-graph hybrids here. Instead, they prefer problems that mirror backend system design.

1.  **Top K with Frequency or Custom Sorting:** This is their most frequent pattern. Given a stream of data (logs, orders, search queries), find the most frequent or highest-priority items. It tests if you know to use a heap to maintain a rolling top K list without sorting the entire dataset.
    - **Example:** _Top K Frequent Elements (LeetCode #347)_ is a direct hit. A Coupang variant might be "Top K Most Purchased Products in the Last Hour."

2.  **Merging Sorted Streams / Intervals:** This pattern models merging data from multiple sources, like consolidating shipment updates from different regional servers.
    - **Example:** _Merge k Sorted Lists (LeetCode #23)_ is the classic. They may dress it up as merging sorted lists of delivery time windows.

3.  **Greedy Interval Scheduling with a Heap:** This is where they increase difficulty. Problems involve using a min-heap to track the _end_ of something (a meeting, a server session, a delivery slot) to maximize resource utilization.
    - **Example:** _Meeting Rooms II (LeetCode #253)_. For Coupang, this directly translates to "minimum number of delivery trucks needed" given a schedule of deliveries.

<div class="code-group">

```python
# Pattern: Top K Frequent Elements (LeetCode #347)
# Time: O(N log K) | Space: O(N + K)
import heapq
from collections import Counter

def topKFrequent(nums, k):
    """
    Finds the k most frequent elements in a list.
    The heap stores (frequency, element) pairs, but we use
    negative frequency to create a min-heap that effectively
    keeps the largest frequencies.
    """
    # 1. Count frequencies: O(N) time, O(N) space
    count = Counter(nums)

    # 2. Maintain a min-heap of size k
    #    Heap elements are (-frequency, element)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))  # Use positive freq for max-like behavior
        # But we want min-heap by freq, so we pop smallest if > k
        if len(heap) > k:
            heapq.heappop(heap)  # Remove the least frequent

    # 3. Extract results from heap
    #    The heap now contains the k most frequent
    return [num for freq, num in heap]

# Example: For nums = [1,1,1,2,2,3], k = 2
# Count = {1:3, 2:2, 3:1}
# Heap after processing: [(2,2), (3,1)] -> returns [2, 1]
```

```javascript
// Pattern: Top K Frequent Elements (LeetCode #347)
// Time: O(N log K) | Space: O(N + K)

class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element[0] >= parent[0]) break;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
    this.heap[idx] = element;
  }

  sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild[0] < element[0]) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      idx = swap;
    }
    this.heap[idx] = element;
  }

  size() {
    return this.heap.length;
  }
}

function topKFrequent(nums, k) {
  // 1. Count frequencies
  const count = {};
  for (const num of nums) {
    count[num] = (count[num] || 0) + 1;
  }

  // 2. Use min-heap to keep top k frequent elements
  const heap = new MinHeap();
  for (const num in count) {
    heap.push([count[num], parseInt(num)]);
    if (heap.size() > k) {
      heap.pop(); // Remove the least frequent
    }
  }

  // 3. Extract results
  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop()[1]);
  }
  return result;
}
```

```java
// Pattern: Top K Frequent Elements (LeetCode #347)
// Time: O(N log K) | Space: O(N + K)
import java.util.*;

public class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. Count frequencies
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }

        // 2. Min-heap to store (frequency, element)
        //    The comparator sorts by frequency ascending
        PriorityQueue<Map.Entry<Integer, Integer>> heap =
            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            heap.offer(entry);
            if (heap.size() > k) {
                heap.poll(); // Remove the entry with smallest frequency
            }
        }

        // 3. Extract results from heap
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = heap.poll().getKey();
        }
        return result;
    }
}
```

</div>

## How to Prepare

Master the two patterns above. For "Top K," drill the counter + min-heap approach until it's muscle memory. For scheduling problems, practice drawing the timeline. Always ask: "What am I using the heap to track?" Is it the _frequency_ (for Top K) or the _end time_ (for scheduling)?

When you practice, implement the heap operations manually at least once in each language. Understand that in Python, `heapq` is a min-heap; to get a max-heap, you push negative values. In Java, `PriorityQueue` can be min or max based on the comparator. In JavaScript, you'll often implement a simple heap class.

## How Coupang Tests Heap vs Other Companies

Compared to FAANG companies, Coupang's heap questions are less about clever algorithm combinations and more about **applied data structure usage**. At Google, you might get "Merge K Sorted Lists" combined with a custom iterator; at Coupang, it's more likely to be the standard problem with a clear logistics analogy. The difficulty is medium, not hard. They care that you choose the right tool (a heap) and implement it correctly under time pressure, not that you invent a novel variant.

What's unique is the **context framing**. A Coupang problem statement will often explicitly mention "delivery times," "server loads," or "product rankings." Don't get distracted by the domain language; strip it back to the underlying data structure problem.

## Study Order

1.  **Heap Fundamentals:** Understand insert (`O(log n)`) and extract-min (`O(log n)`). Implement a basic heap from scratch once.
2.  **Basic "Top K" Pattern:** Learn to use a min-heap of size K to keep the largest K elements (or max-heap for smallest K). Practice with #347.
3.  **Merging K Sorted Lists:** This teaches you to use a heap as a "next element" tracker across multiple sequences (#23).
4.  **Greedy Scheduling with Heaps:** This is the leap. Learn to sort intervals by start time and use a min-heap to track end times (#253).
5.  **"Kth Largest" in a Stream:** This tests if you understand the heap's streaming capability (#703).

This order builds from the core operation, to single-sequence analysis, to multi-sequence coordination, and finally to dynamic streaming.

## Recommended Practice Order

Solve these in sequence:

1.  **Kth Largest Element in an Array (#215)** – Basic heap application.
2.  **Top K Frequent Elements (#347)** – The essential Coupang pattern.
3.  **Merge k Sorted Lists (#23)** – Master the multi-source merge.
4.  **Meeting Rooms II (#253)** – The scheduling pattern applied.
5.  **Kth Largest Element in a Stream (#703)** – Streaming variation.
6.  **Reorganize String (#767)** – A slightly trickier heap-greedy combo that tests adaptability.
7.  **Task Scheduler (#621)** – A harder scheduling problem that appears in Coupang interviews for senior roles.

After these seven, you'll have covered 90% of what Coupang asks. Focus on clean, correct implementations over clever optimizations.

[Practice Heap (Priority Queue) at Coupang](/company/coupang/heap-priority-queue)
