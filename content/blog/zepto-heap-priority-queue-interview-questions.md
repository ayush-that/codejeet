---
title: "Heap (Priority Queue) Questions at Zepto: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-16"
category: "dsa-patterns"
tags: ["zepto", "heap-priority-queue", "interview prep"]
---

Zepto’s technical interviews frequently test Heap (Priority Queue) concepts. With 3 out of 28 total questions dedicated to this structure, it’s a targeted area of assessment. For a company optimizing hyper-fast delivery logistics, heaps are directly relevant. They are the optimal data structure for managing real-time, priority-based operations—like selecting the nearest delivery agent, dynamically routing orders, or processing time-sensitive tasks in a system with constant updates. Mastering heaps demonstrates you can handle the core scheduling and selection problems inherent in Zepto’s platform.

## What to Expect — Types of Problems

Zepto’s heap questions typically fall into two categories, both emphasizing practical application over theoretical trivia.

**1. Top K Elements / Frequency-Based Selection:** This is the most common pattern. You’ll be asked to find the top K frequent items, the K largest or smallest numbers, or the most common orders in a stream. These problems test your ability to use a min-heap or max-heap to maintain a rolling set of candidates efficiently, which mirrors selecting top-priority tasks from a high-volume event stream.

**2. Merging Sorted Inputs or Intervals:** Problems involving merging K sorted lists or handling overlapping intervals using a heap are also fair game. This pattern is crucial for operations like merging delivery schedules from multiple warehouses or agents to create a unified timeline. The heap is used to always retrieve the next smallest or most urgent item across multiple sequences.

You will not be asked to implement a heap from scratch. The focus is on applying the right heap operations—`push` and `pop`—to solve these patterns optimally.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition. Don’t memorize problems; understand when to reach for a heap: **when you need repeated access to the "largest" or "smallest" element according to some priority.** Practice using your language’s standard library implementation: `heapq` (min-heap) in Python, `PriorityQueue` or custom comparators in Java, and arrays with manual functions (or a library like `@datastructures-js/priority-queue`) in JavaScript.

A key technique is maintaining a heap of fixed size _K_. For "Top K Frequent" problems, you often use a min-heap to keep the _K_ most frequent elements by evicting the smallest frequency when the heap exceeds size K. Here is the core pattern:

<div class="code-group">

```python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    # Use a min-heap of size k, storing (frequency, element)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)  # Remove the least frequent
    # The heap now contains the k most frequent
    return [num for freq, num in heap]
```

```javascript
// Using a Min-Heap via an array and custom comparator
function topKFrequent(nums, k) {
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  // Min-heap as an array of [frequency, element]
  const minHeap = [];
  const pushHeap = (val) => {
    minHeap.push(val);
    minHeap.sort((a, b) => a[0] - b[0]); // Sort for min-heap property
  };
  const popHeap = () => minHeap.shift();

  for (const [num, freq] of freqMap) {
    pushHeap([freq, num]);
    if (minHeap.length > k) {
      popHeap(); // Remove the entry with smallest frequency
    }
  }
  return minHeap.map((entry) => entry[1]);
}
```

```java
import java.util.*;

public class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Count frequency
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        // Min-heap of size k, prioritized by frequency
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
                new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) {
                minHeap.poll(); // Remove the least frequent
            }
        }
        // Extract results
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = minHeap.poll().getKey();
        }
        return result;
    }
}
```

</div>

## Recommended Practice Order

Build competence progressively:

1.  **Fundamentals:** Implement basic operations (add, poll, peek) using your language’s library. Solve "Kth Largest Element in a Stream."
2.  **Core Patterns:** Practice "Top K Frequent Elements" and "Merge K Sorted Lists" until the heap management is automatic.
3.  **Zepto-Relevant Context:** Apply these patterns to problems involving scheduling, merging intervals, or real-time top-K queries, which simulate delivery prioritization.

[Practice Heap (Priority Queue) at Zepto](/company/zepto/heap-priority-queue)
