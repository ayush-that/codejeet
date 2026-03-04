---
title: "Heap (Priority Queue) Questions at Flipkart: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-05-06"
category: "dsa-patterns"
tags: ["flipkart", "heap-priority-queue", "interview prep"]
---

Heap (Priority Queue) questions appear in roughly 13% of Flipkart's technical interviews, making them a core data structure to master. For a company managing massive-scale e-commerce logistics—think real-time order prioritization, delivery route optimization, and inventory management—the ability to efficiently handle streaming data and always process the most critical element first is non-negotiable. Heaps provide O(log n) insertion and O(1) access to the min/max element, which is fundamental for these performance-sensitive systems.

## What to Expect — Types of Problems

Flipkart's heap problems typically model real-world scheduling and optimization. You won't get abstract academic questions. Expect scenarios like:

- **Top K Elements:** "Find the top K most frequently purchased products" or "Identify the K nearest delivery hubs." This is the most frequent pattern.
- **Merge K Sorted Lists/Arrays:** Used in merging results from multiple product catalog services or sorted log streams.
- **Scheduling & Prioritization:** "Schedule server tasks with priorities" or "Manage a stream of orders with varying delivery deadlines."
- **Two-Heap Patterns (Median Finder):** Maintaining a running median of prices or scores, often used in analytics.

The key is recognizing when a problem requires repeatedly accessing or removing the smallest or largest element from a dynamic dataset.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. Implement a min-heap and max-heap from scratch once for understanding, then use your language's built-in library (heapq, PriorityQueue, PriorityQueue) for practice. The most critical skill is transforming a word problem into a heap operation.

A classic example is the **Top K Frequent Elements** pattern. You must count frequencies, then use a min-heap of size K to keep the top candidates efficiently.

<div class="code-group">

```python
import heapq
from collections import Counter

def topKFrequent(nums, k):
    count = Counter(nums)
    # Use a min-heap of size k, storing (frequency, element)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)  # Remove the least frequent
    # Extract elements from heap
    return [num for _, num in heap]
```

```javascript
function topKFrequent(nums, k) {
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  // Min-heap via array and comparator
  const minHeap = new MinPriorityQueue({ priority: (entry) => entry[0] });
  for (const [num, freq] of freqMap) {
    minHeap.enqueue([freq, num]);
    if (minHeap.size() > k) {
      minHeap.dequeue(); // Remove least frequent
    }
  }
  return minHeap.toArray().map((entry) => entry.element[1]);
}
```

```java
import java.util.*;

public class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        // Min-heap: store Map.Entry with comparator on frequency
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll().getKey();
        }
        return result;
    }
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Implement basic heap operations (insert, extract-min/max). Solve "Kth Largest Element in an Array."
2.  **Core Patterns:** Practice "Top K Frequent Elements," "Merge K Sorted Lists," and "K Closest Points to Origin."
3.  **Advanced Scheduling:** Tackle "Task Scheduler" and "Find Median from Data Stream" (two-heap pattern).
4.  **Flipkart Context:** Think about how each problem could map to a Flipkart use case (order batching, delivery routing, recommendation systems).

Master these patterns, and you'll efficiently handle the most critical element in your Flipkart interview—the heap question.

[Practice Heap (Priority Queue) at Flipkart](/company/flipkart/heap-priority-queue)
