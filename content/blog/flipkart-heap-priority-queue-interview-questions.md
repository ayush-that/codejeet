---
title: "Heap (Priority Queue) Questions at Flipkart: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-28"
category: "dsa-patterns"
tags: ["flipkart", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Flipkart: What to Expect

Flipkart's technical interviews have a distinct flavor when it comes to data structures, and heaps (priority queues) are no exception. With 15 heap-specific questions in their 117-question bank, heaps appear in roughly 13% of their curated problems—a significant enough percentage that you can't afford to wing it. But here's what most candidates miss: at Flipkart, heap questions aren't just about implementing `heapq` or `PriorityQueue`. They're almost always disguised as system design or optimization problems. Interviewers use heaps to test whether you can identify the right tool for real-world scenarios like order processing, inventory management, or recommendation system ranking—problems that mirror Flipkart's actual business domains.

I've seen strong candidates stumble not because they forgot heap operations, but because they failed to recognize when a heap was the optimal solution. The pattern recognition matters more than the implementation details.

## Specific Patterns Flipkart Favors

Flipkart's heap problems cluster around three practical patterns:

1. **K-element problems with streaming data**: Think "top K frequent items in a user's browsing history" or "K cheapest products in a category." These problems test whether you can maintain a bounded heap while processing continuous data—a common requirement in e-commerce systems.

2. **Interval scheduling with resource constraints**: Problems like meeting rooms (#253) but with a twist—imagine allocating delivery slots to drivers where each slot has a priority based on customer tier. The heap here manages the "next available resource."

3. **Merge K sorted sequences**: This appears in contexts like merging price lists from multiple vendors or combining sorted event logs. The variation Flipkart adds is usually around handling unequal sequence sizes efficiently.

The most telling pattern? Flipkart rarely asks pure algorithmic heap problems. Instead, they embed heaps within scenarios that require you to first model the problem correctly. For example, "Design a real-time trending products feature" might lead to a solution using a min-heap to track top K products by view count, but you need to arrive at that structure through discussion.

## How to Prepare

Master the two heap variations that cover 80% of Flipkart's questions: the **K-element min-heap** and the **two-heap median finder**. Let's look at the K-element pattern since it's more frequent.

The key insight: when you need the "top K largest" elements, use a _min-heap_ of size K. Why? Because the smallest element in that heap is your threshold—anything smaller gets discarded, keeping only the largest K candidates efficiently.

<div class="code-group">

```python
import heapq

def top_k_largest(nums, k):
    """
    Returns the k largest elements from a stream (or list).
    Time: O(n log k) - we process n elements, heap operations are log k
    Space: O(k) - we maintain a heap of size k
    """
    if k <= 0:
        return []

    # Min-heap to store the k largest elements seen so far
    # The smallest in this heap is the k-th largest overall
    min_heap = []

    for num in nums:
        # Push current element to heap
        heapq.heappush(min_heap, num)

        # If heap exceeds size k, remove the smallest (which is not in top k)
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    # The heap now contains the k largest elements
    return min_heap

# Example usage for product prices:
# prices = [299, 499, 199, 899, 599]
# top_3 = top_k_largest(prices, 3)  # [599, 499, 899] (order may vary)
```

```javascript
function topKLargest(nums, k) {
  /**
   * Returns the k largest elements from an array.
   * Time: O(n log k) - n elements, heap operations log k
   * Space: O(k) - heap of size k
   */
  if (k <= 0) return [];

  // Min-heap implementation using array
  const minHeap = [];

  const heapPush = (val) => {
    minHeap.push(val);
    let i = minHeap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (minHeap[parent] <= minHeap[i]) break;
      [minHeap[parent], minHeap[i]] = [minHeap[i], minHeap[parent]];
      i = parent;
    }
  };

  const heapPop = () => {
    if (minHeap.length === 0) return null;
    const result = minHeap[0];
    const last = minHeap.pop();
    if (minHeap.length > 0) {
      minHeap[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < minHeap.length && minHeap[left] < minHeap[smallest]) {
          smallest = left;
        }
        if (right < minHeap.length && minHeap[right] < minHeap[smallest]) {
          smallest = right;
        }
        if (smallest === i) break;
        [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
        i = smallest;
      }
    }
    return result;
  };

  for (const num of nums) {
    heapPush(num);
    if (minHeap.length > k) {
      heapPop();
    }
  }

  return minHeap;
}
```

```java
import java.util.PriorityQueue;

public List<Integer> topKLargest(int[] nums, int k) {
    /**
     * Returns the k largest elements from an array.
     * Time: O(n log k) - process n elements, heap operations log k
     * Space: O(k) - priority queue of size k
     */
    List<Integer> result = new ArrayList<>();
    if (k <= 0) return result;

    // Min-heap: the smallest element is at the root
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int num : nums) {
        minHeap.offer(num);

        // Maintain only k elements in heap
        if (minHeap.size() > k) {
            minHeap.poll(); // Remove the smallest (not in top k)
        }
    }

    // Add all remaining elements to result
    result.addAll(minHeap);
    return result;
}
```

</div>

Notice the pattern: we process each element once, maintain a heap of fixed size K, and achieve O(n log k) time instead of O(n log n) for sorting. This matters when K is small relative to n—exactly the case in many Flipkart scenarios like "show me the top 10 trending products" from millions of views.

## How Flipkart Tests Heap (Priority Queue) vs Other Companies

At Amazon, heap questions often relate to AWS services or order fulfillment—think "merge K sorted log streams" or "schedule tasks with cooldowns." Google might ask more mathematically elegant problems like "Kth smallest element in a sorted matrix." But Flipkart's questions have a distinctive e-commerce practicality.

What's unique: Flipkart interviewers frequently extend heap problems into system design discussions. After you solve "K closest points to origin" (#973), they might ask: "How would you modify this if points were streaming from multiple warehouses in real-time?" Or "What if 'closeness' was defined by delivery time rather than Euclidean distance?" This tests whether you understand heaps as a component in larger systems.

The difficulty level is moderate—usually LeetCode Medium—but the evaluation criteria include:

1. Can you justify why a heap is better than sorting?
2. Can you handle edge cases (empty input, K larger than input size)?
3. Can you discuss trade-offs (time vs. space, readability vs. performance)?

## Study Order

Don't jump straight to complex heap problems. Build your understanding systematically:

1. **Heap fundamentals** - Understand how heaps work internally (complete binary tree, heapify operations). Implement basic insert and extract-min/max without using built-in libraries.
2. **Single heap patterns** - Practice problems where you use one heap: Kth largest element (#215), last stone weight (#1046).
3. **Dual heap patterns** - Learn to maintain two heaps for median finding (#295) or sliding window median.
4. **Heap + hash map combos** - These appear in frequency problems: top K frequent elements (#347), reorganize string (#767).
5. **Heap in graph algorithms** - Dijkstra's algorithm uses a priority queue. Practice network delay time (#743).
6. **Custom comparators** - Flipkart loves these. Practice sorting products by price-to-rating ratio or delivery slots by priority.

This order works because each step builds on the previous one. You can't effectively use two heaps if you don't understand how one heap works. Custom comparators become intuitive once you've solved several single-heap problems.

## Recommended Practice Order

Solve these problems in sequence to build Flipkart-specific heap mastery:

1. **Kth Largest Element in an Array (#215)** - The foundational K-element problem.
2. **Top K Frequent Elements (#347)** - Adds hash map to the heap pattern.
3. **K Closest Points to Origin (#973)** - Introduces custom comparators (distance calculation).
4. **Meeting Rooms II (#253)** - Classic interval scheduling with heap.
5. **Find Median from Data Stream (#295)** - Dual heap pattern essential for Flipkart.
6. **Merge K Sorted Lists (#23)** - Graph-adjacent but uses heap for merging.
7. **Reorganize String (#767)** - Advanced heap + frequency problem.
8. **Course Schedule III (#630)** - Flipkart favorite: scheduling with constraints.
9. **Maximum Frequency Stack (#895)** - Combines heap with stack—tests multiple DS knowledge.
10. **Design Twitter (#355)** - System design with heap component.

After solving these, search Flipkart's tagged heap problems on LeetCode and tackle them in increasing acceptance rate order. The lower acceptance rate problems often have the twists Flipkart interviewers love.

Remember: at Flipkart, the correct heap implementation is just the starting point. Be prepared to discuss how you'd scale the solution, handle failures, or integrate it with other system components. That's what separates "correct" from "hire."

[Practice Heap (Priority Queue) at Flipkart](/company/flipkart/heap-priority-queue)
