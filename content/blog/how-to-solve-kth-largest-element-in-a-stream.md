---
title: "How to Solve Kth Largest Element in a Stream — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Kth Largest Element in a Stream. Easy difficulty, 60.7% acceptance rate. Topics: Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree."
date: "2026-10-26"
category: "dsa-patterns"
tags: ["kth-largest-element-in-a-stream", "tree", "design", "binary-search-tree", "easy"]
---

# How to Solve Kth Largest Element in a Stream

You need to design a data structure that can continuously add new elements while efficiently returning the kth largest element at any time. The challenge is maintaining this kth largest value dynamically without re-sorting the entire collection every time a new element arrives. This is a classic streaming data problem where efficiency matters most.

## Visual Walkthrough

Let's trace through an example with k=3 and initial stream [4, 5, 8, 2].

**Initialization:**

- We need to track the 3rd largest element
- After adding 4, 5, 8, 2, the sorted array is [2, 4, 5, 8]
- The 3rd largest is 4 (largest is 8, 2nd largest is 5, 3rd largest is 4)

**Adding new elements:**

1. `add(3)` → Stream becomes [4, 5, 8, 2, 3], sorted: [2, 3, 4, 5, 8]
   - 3rd largest is now 4 (still)
2. `add(5)` → Stream becomes [4, 5, 8, 2, 3, 5], sorted: [2, 3, 4, 5, 5, 8]
   - 3rd largest is now 5 (largest: 8, 2nd: 5, 3rd: 5)
3. `add(10)` → Stream becomes [4, 5, 8, 2, 3, 5, 10], sorted: [2, 3, 4, 5, 5, 8, 10]
   - 3rd largest is now 5 (largest: 10, 2nd: 8, 3rd: 5)

The key insight: we don't need to track all elements, just the k largest ones. The kth largest will always be the smallest among the k largest elements.

## Brute Force Approach

The most straightforward approach is to store all elements in an array and sort it every time we need to find the kth largest:

1. Store all added elements in a list
2. When `add()` is called, append the new value
3. Sort the entire list in descending order
4. Return the element at index k-1

**Why this fails:**

- Sorting takes O(n log n) time for n elements
- If we add m elements, total time becomes O(m × n log n)
- For a stream with thousands of additions, this becomes prohibitively slow
- We're doing unnecessary work by sorting elements that can't possibly be in the top k

A slightly better brute force would maintain a sorted list using binary search insertion (O(n) for insertion due to shifting), but this still becomes O(m × n) which is too slow for large streams.

## Optimal Solution

The optimal solution uses a **min-heap** (priority queue) of size k to track only the k largest elements. Here's why it works:

1. We maintain a min-heap with exactly k elements (or fewer during initialization)
2. The smallest element in this heap is always the kth largest in the entire stream
3. When adding a new element:
   - If heap has fewer than k elements, just add it
   - If heap has k elements and the new element is larger than the smallest in heap:
     - Remove the smallest (which can't be kth largest anymore)
     - Add the new element
   - Otherwise, ignore it (it's smaller than all current k largest)

The heap ensures we always have quick access to the smallest of the top k elements, which is exactly the kth largest overall.

<div class="code-group">

```python
# Time: O(log k) for add, O(1) for get | Space: O(k) for storing k elements
import heapq

class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        """
        Initialize with k and initial list of numbers.
        We'll maintain a min-heap of size at most k.
        """
        self.k = k
        self.min_heap = []

        # Add all initial numbers to the heap
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        """
        Add a new value to the stream and return the kth largest element.
        """
        # If heap has fewer than k elements, always add the new value
        if len(self.min_heap) < self.k:
            heapq.heappush(self.min_heap, val)
        # If heap already has k elements, only add if new value is larger than smallest
        elif val > self.min_heap[0]:
            # Replace the smallest element (current kth largest) with new value
            heapq.heapreplace(self.min_heap, val)
        # If val <= smallest in heap, do nothing (it can't be in top k)

        # The smallest element in min-heap of size k is the kth largest overall
        return self.min_heap[0]
```

```javascript
// Time: O(log k) for add, O(1) for get | Space: O(k) for storing k elements

class KthLargest {
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue();

    // Add all initial numbers to the heap
    for (const num of nums) {
      this.add(num);
    }
  }

  /**
   * @param {number} val
   * @return {number}
   */
  add(val) {
    // If heap has fewer than k elements, always add the new value
    if (this.minHeap.size() < this.k) {
      this.minHeap.enqueue(val);
    }
    // If heap already has k elements, only add if new value is larger than smallest
    else if (val > this.minHeap.front().element) {
      // Remove the smallest element (current kth largest)
      this.minHeap.dequeue();
      // Add the new value
      this.minHeap.enqueue(val);
    }
    // If val <= smallest in heap, do nothing (it can't be in top k)

    // The smallest element in min-heap of size k is the kth largest overall
    return this.minHeap.front().element;
  }
}

// Note: In JavaScript, you can use the built-in MinPriorityQueue from @datastructures-js/priority-queue
// or implement your own min-heap. For LeetCode, the library is typically available.
```

```java
// Time: O(log k) for add, O(1) for get | Space: O(k) for storing k elements
import java.util.PriorityQueue;

class KthLargest {
    private int k;
    private PriorityQueue<Integer> minHeap;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        // Initialize min-heap (PriorityQueue in Java is min-heap by default)
        this.minHeap = new PriorityQueue<>();

        // Add all initial numbers to the heap
        for (int num : nums) {
            add(num);
        }
    }

    public int add(int val) {
        // If heap has fewer than k elements, always add the new value
        if (minHeap.size() < k) {
            minHeap.offer(val);
        }
        // If heap already has k elements, only add if new value is larger than smallest
        else if (val > minHeap.peek()) {
            // Remove the smallest element (current kth largest)
            minHeap.poll();
            // Add the new value
            minHeap.offer(val);
        }
        // If val <= smallest in heap, do nothing (it can't be in top k)

        // The smallest element in min-heap of size k is the kth largest overall
        return minHeap.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization:** O(n log k) - Each of the n initial elements may trigger a heap operation taking O(log k)
- **Add operation:** O(log k) - In the worst case, we perform one heap insertion and/or removal, each taking O(log k) time
- **Get kth largest:** O(1) - We just peek at the root of the min-heap

**Space Complexity:**

- **Overall:** O(k) - We store at most k elements in the min-heap
- **Auxiliary space:** O(k) - The heap itself uses O(k) space

The key advantage over brute force: instead of O(n log n) per operation, we get O(log k), which is much faster when k is small compared to n.

## Common Mistakes

1. **Using a max-heap instead of min-heap:** A max-heap would give you the largest element easily, but finding the kth largest would require removing k-1 elements first, which is O(k log n). The min-heap approach is more efficient.

2. **Not handling the initial empty/near-empty case:** When the heap has fewer than k elements, you should still return a value. The solution handles this by always adding when size < k.

3. **Forgetting to check heap size before peeking:** Always check if the heap is non-empty before calling `peek()` or equivalent. In our implementation, the problem guarantees k ≥ 1 and we initialize properly, but in interviews you should mention this edge case.

4. **Adding all elements to the heap:** Some candidates add every element to the heap and then try to maintain size k by removing excess. This works but is less efficient than checking before adding. Our approach avoids unnecessary heap operations for elements that can't possibly be in the top k.

## When You'll See This Pattern

This "kth element in stream" pattern appears whenever you need to maintain order statistics dynamically:

1. **Kth Largest Element in an Array (LeetCode 215)** - Similar concept but for a static array. The heap approach works there too, often with O(n log k) time.

2. **Finding Median from Data Stream (LeetCode 295)** - Uses two heaps (min and max) to maintain the middle elements. The "kth element" concept extends to medians where k = n/2.

3. **Top K Frequent Elements (LeetCode 347)** - Uses a min-heap to track the top k frequent elements as you process the array, similar to maintaining top k values.

4. **Sliding Window Maximum (LeetCode 239)** - While not identical, it also involves maintaining order statistics (maximum) in a moving window, often solved with deques or heaps.

The core pattern: **Use a heap when you need to repeatedly access extreme values (min/max) from a changing collection.**

## Key Takeaways

1. **Min-heap for kth largest, max-heap for kth smallest:** Remember this pairing. For kth largest, keep the k largest elements in a min-heap so the smallest of those (the root) is your answer.

2. **Only track what you need:** The optimization comes from storing only k elements instead of all n. Elements smaller than all current top k can be safely ignored.

3. **Streaming problems often need O(log k) updates:** When data arrives continuously, you can't afford to re-process everything. Heaps provide efficient updates while maintaining order.

This problem teaches the important skill of choosing the right data structure for dynamic order statistics, a common requirement in real-time systems, monitoring applications, and data streaming pipelines.

---

**Related problems:** [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Finding MK Average](/problem/finding-mk-average), [Sequentially Ordinal Rank Tracker](/problem/sequentially-ordinal-rank-tracker)
