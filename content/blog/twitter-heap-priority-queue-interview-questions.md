---
title: "Heap (Priority Queue) Questions at Twitter: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Twitter — patterns, difficulty breakdown, and study tips."
date: "2029-08-05"
category: "dsa-patterns"
tags: ["twitter", "heap-priority-queue", "interview prep"]
---

Heap (Priority Queue) questions appear in roughly 11% of Twitter's technical interview problem pool (6 out of 53). This frequency signals that interviewers actively use these problems to assess a candidate's ability to manage real-time data streams, schedule tasks, or find top-K elements—core challenges in a platform handling millions of concurrent events. Mastering heaps demonstrates you can design efficient, scalable solutions, a critical skill for Twitter's engineering demands.

## What to Expect — Types of Problems

Twitter's heap questions typically fall into two categories, reflecting real-world platform needs.

**Top-K Frequent Elements:** This is the most common pattern. You might be asked to find the most frequent tweets, hashtags, or users in a data stream. The brute-force approach—sorting a frequency map—is O(n log n). The optimal heap solution is O(n log k), which is far more scalable for massive datasets.

**Merging K Sorted Lists/Streams:** This pattern tests your ability to merge multiple sorted timelines or data feeds efficiently. The naive approach of repeatedly merging two lists is inefficient. Using a min-heap to always get the next smallest element from K sources is the standard O(n log k) solution.

You may also encounter variations like finding the median from a data stream (using two heaps) or scheduling tasks with cooldown periods. The core expectation is to recognize when a problem requires repeatedly accessing or removing the smallest or largest element.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the _when_ and _why_, not just the implementation. A heap is ideal when your algorithm needs repeated minimum/maximum operations. Practice drawing the heap structure during insertion and extraction.

Memorize the key pattern for Top-K problems: use a min-heap to keep only the K largest elements, which ensures O(log k) operations instead of O(log n). Here is the standard implementation:

<div class="code-group">

```python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    freq = Counter(nums)
    # Use a min-heap of size k, storing (frequency, element)
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        if len(heap) > k:
            heapq.heappop(heap) # Remove the least frequent
    # Extract elements from heap
    return [num for _, num in heap]
```

```javascript
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  // Min-heap via array and comparator
  const heap = new MinPriorityQueue({ priority: ([count, num]) => count });
  for (const [num, count] of freq) {
    heap.enqueue([count, num]);
    if (heap.size() > k) {
      heap.dequeue(); // Remove least frequent
    }
  }
  return heap.toArray().map((item) => item.element[1]);
}
```

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) freq.put(num, freq.getOrDefault(num, 0) + 1);
    // Min-heap storing Map.Entry, comparator on frequency
    PriorityQueue<Map.Entry<Integer, Integer>> heap = new PriorityQueue<>(
        (a, b) -> a.getValue() - b.getValue()
    );
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        heap.offer(entry);
        if (heap.size() > k) heap.poll(); // Remove least frequent
    }
    int[] result = new int[k];
    for (int i = 0; i < k; i++) result[i] = heap.poll().getKey();
    return result;
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Implement a heap from scratch (insert, extract-min). Solve "Kth Largest Element in a Stream."
2.  **Core Patterns:** Practice "Top K Frequent Elements" and "Merge K Sorted Lists" until you can code them flawlessly.
3.  **Advanced Variations:** Tackle "Find Median from Data Stream" (two-heap pattern) and "Task Scheduler."
4.  **Twitter-Specific:** Finally, solve all identified heap problems from Twitter's question list to adapt to their phrasing and constraints.

[Practice Heap (Priority Queue) at Twitter](/company/twitter/heap-priority-queue)
