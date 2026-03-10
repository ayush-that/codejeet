---
title: "How to Solve Sliding Window Median — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sliding Window Median. Hard difficulty, 38.9% acceptance rate. Topics: Array, Hash Table, Sliding Window, Heap (Priority Queue)."
date: "2028-08-15"
category: "dsa-patterns"
tags: ["sliding-window-median", "array", "hash-table", "sliding-window", "hard"]
---

# How to Solve Sliding Window Median

The Sliding Window Median problem asks us to find the median for every contiguous window of size `k` in an integer array. What makes this problem particularly challenging is that we need to maintain a sorted order of elements within a sliding window while efficiently adding new elements and removing old ones. Unlike simpler sliding window problems where we track sums or counts, here we need precise order statistics, making it a natural extension of the classic "Find Median from Data Stream" problem.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `nums = [1, 3, -1, -3, 5, 3, 6, 7]` with `k = 3`.

**Window 1: [1, 3, -1]**

- Sorted: [-1, 1, 3]
- Median (odd k): middle element = 1
- Output: [1]

**Window 2: [3, -1, -3]**

- Remove 1 from previous window, add -3
- Sorted: [-3, -1, 3]
- Median: middle element = -1
- Output: [1, -1]

**Window 3: [-1, -3, 5]**

- Remove 3, add 5
- Sorted: [-3, -1, 5]
- Median: -1
- Output: [1, -1, -1]

**Window 4: [-3, 5, 3]**

- Remove -1, add 3
- Sorted: [-3, 3, 5]
- Median: 3
- Output: [1, -1, -1, 3]

**Window 5: [5, 3, 6]**

- Remove -3, add 6
- Sorted: [3, 5, 6]
- Median: 5
- Output: [1, -1, -1, 3, 5]

**Window 6: [3, 6, 7]**

- Remove 5, add 7
- Sorted: [3, 6, 7]
- Median: 6
- Final output: [1, -1, -1, 3, 5, 6]

The key challenge is maintaining this sorted order efficiently as the window slides. A naive approach of sorting each window would be too slow.

## Brute Force Approach

The most straightforward solution is to process each window independently:

1. For each starting index `i` from 0 to `n-k`
2. Extract the window `nums[i:i+k]`
3. Sort the window
4. Calculate the median based on whether `k` is odd or even

<div class="code-group">

```python
# Time: O(n*k*logk) | Space: O(k)
def medianSlidingWindowBrute(nums, k):
    n = len(nums)
    result = []

    for i in range(n - k + 1):
        # Extract window
        window = nums[i:i+k]
        # Sort the window
        window.sort()
        # Calculate median
        if k % 2 == 1:
            median = window[k//2]
        else:
            median = (window[k//2 - 1] + window[k//2]) / 2
        result.append(median)

    return result
```

```javascript
// Time: O(n*k*logk) | Space: O(k)
function medianSlidingWindowBrute(nums, k) {
  const n = nums.length;
  const result = [];

  for (let i = 0; i <= n - k; i++) {
    // Extract window
    const window = nums.slice(i, i + k);
    // Sort the window
    window.sort((a, b) => a - b);
    // Calculate median
    let median;
    if (k % 2 === 1) {
      median = window[Math.floor(k / 2)];
    } else {
      median = (window[k / 2 - 1] + window[k / 2]) / 2;
    }
    result.push(median);
  }

  return result;
}
```

```java
// Time: O(n*k*logk) | Space: O(k)
public double[] medianSlidingWindowBrute(int[] nums, int k) {
    int n = nums.length;
    double[] result = new double[n - k + 1];

    for (int i = 0; i <= n - k; i++) {
        // Extract window
        int[] window = new int[k];
        System.arraycopy(nums, i, window, 0, k);
        // Sort the window
        Arrays.sort(window);
        // Calculate median
        if (k % 2 == 1) {
            result[i] = window[k/2];
        } else {
            result[i] = ((double)window[k/2 - 1] + window[k/2]) / 2;
        }
    }

    return result;
}
```

</div>

**Why this is inefficient:** Sorting each window takes O(k log k) time, and we do this for O(n) windows, resulting in O(n*k*logk) time complexity. For large arrays with large windows, this becomes prohibitively slow.

## Optimized Approach

The key insight is that we need to maintain a data structure that:

1. Keeps elements sorted
2. Allows efficient insertion of new elements
3. Allows efficient removal of arbitrary elements (not just the min or max)
4. Allows quick access to the median

This is exactly the problem solved by "Find Median from Data Stream" using two heaps! We can adapt that solution:

- Use a max-heap for the smaller half of numbers
- Use a min-heap for the larger half of numbers
- Keep them balanced so the median is either the top of the max-heap (odd k) or the average of both tops (even k)

However, the sliding window introduces a new challenge: we need to remove elements that are no longer in the window. Standard heaps don't support efficient removal of arbitrary elements. The solution is **lazy deletion**:

1. Keep a hash map/dictionary to track elements that need to be removed
2. When we pop from a heap, check if the element is marked for deletion
3. If it is, discard it and pop again until we find a valid element

We maintain the invariant that the max-heap contains the smaller half (or one more when k is odd) and the min-heap contains the larger half.

## Optimal Solution

Here's the complete solution using two heaps with lazy deletion:

<div class="code-group">

```python
# Time: O(n*logk) | Space: O(n)
import heapq
from collections import defaultdict

def medianSlidingWindow(nums, k):
    # Two heaps: max_heap stores smaller half (negated for max-heap behavior)
    # min_heap stores larger half
    max_heap, min_heap = [], []
    # Dictionary to track elements marked for deletion
    to_remove = defaultdict(int)

    # Helper function to get valid top of heap
    def get_valid_top(heap, is_max_heap=False):
        while heap:
            # For max_heap, we store negatives, so we need to negate back
            num = -heap[0] if is_max_heap else heap[0]
            if to_remove[num] > 0:
                to_remove[num] -= 1
                heapq.heappop(heap)
            else:
                return num
        return None

    # Helper function to add a number to heaps
    def add_num(num):
        # If max_heap is empty or num <= top of max_heap, add to max_heap
        if not max_heap or num <= -max_heap[0]:
            heapq.heappush(max_heap, -num)
        else:
            heapq.heappush(min_heap, num)
        # Rebalance heaps
        rebalance()

    # Helper function to rebalance heaps
    def rebalance():
        # Ensure max_heap has either equal or one more element than min_heap
        while len(max_heap) > len(min_heap) + 1:
            heapq.heappush(min_heap, -heapq.heappop(max_heap))
        while len(min_heap) > len(max_heap):
            heapq.heappush(max_heap, -heapq.heappop(min_heap))

    # Helper function to remove a number
    def remove_num(num):
        to_remove[num] += 1
        # The actual removal from heap happens lazily in get_valid_top

    # Helper function to get median
    def get_median():
        if k % 2 == 1:
            # Odd k: median is top of max_heap
            return float(get_valid_top(max_heap, is_max_heap=True))
        else:
            # Even k: median is average of both tops
            left = get_valid_top(max_heap, is_max_heap=True)
            right = get_valid_top(min_heap, is_max_heap=False)
            return (left + right) / 2

    # Initialize first window
    for i in range(k):
        add_num(nums[i])

    result = [get_median()]

    # Slide the window
    for i in range(k, len(nums)):
        # Remove the element going out of window
        remove_num(nums[i - k])
        # Add the new element
        add_num(nums[i])
        # Get median for current window
        result.append(get_median())

    return result
```

```javascript
// Time: O(n*logk) | Space: O(n)
function medianSlidingWindow(nums, k) {
  // Two heaps: maxHeap stores smaller half (using negative values)
  // minHeap stores larger half
  const maxHeap = new MinHeap((a, b) => a - b); // Actually stores negatives
  const minHeap = new MinHeap((a, b) => a - b);
  // Map to track elements marked for deletion
  const toRemove = new Map();

  // Helper function to get valid top of heap
  function getValidTop(heap, isMaxHeap = false) {
    while (heap.size() > 0) {
      const num = isMaxHeap ? -heap.peek() : heap.peek();
      if (toRemove.has(num) && toRemove.get(num) > 0) {
        toRemove.set(num, toRemove.get(num) - 1);
        heap.pop();
      } else {
        return num;
      }
    }
    return null;
  }

  // Helper function to add a number
  function addNum(num) {
    if (maxHeap.size() === 0 || num <= -maxHeap.peek()) {
      maxHeap.push(-num);
    } else {
      minHeap.push(num);
    }
    rebalance();
  }

  // Helper function to rebalance heaps
  function rebalance() {
    // Ensure maxHeap has either equal or one more element than minHeap
    while (maxHeap.size() > minHeap.size() + 1) {
      minHeap.push(-maxHeap.pop());
    }
    while (minHeap.size() > maxHeap.size()) {
      maxHeap.push(-minHeap.pop());
    }
  }

  // Helper function to remove a number
  function removeNum(num) {
    toRemove.set(num, (toRemove.get(num) || 0) + 1);
  }

  // Helper function to get median
  function getMedian() {
    if (k % 2 === 1) {
      // Odd k: median is top of maxHeap
      return getValidTop(maxHeap, true);
    } else {
      // Even k: median is average of both tops
      const left = getValidTop(maxHeap, true);
      const right = getValidTop(minHeap, false);
      return (left + right) / 2;
    }
  }

  // Initialize first window
  for (let i = 0; i < k; i++) {
    addNum(nums[i]);
  }

  const result = [getMedian()];

  // Slide the window
  for (let i = k; i < nums.length; i++) {
    // Remove the element going out of window
    removeNum(nums[i - k]);
    // Add the new element
    addNum(nums[i]);
    // Get median for current window
    result.push(getMedian());
  }

  return result;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.comparator(this.heap[idx], this.heap[parent]) < 0) {
        [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
        idx = parent;
      } else {
        break;
      }
    }
  }

  bubbleDown(idx) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest !== idx) {
        [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
        idx = smallest;
      } else {
        break;
      }
    }
  }
}
```

```java
// Time: O(n*logk) | Space: O(n)
import java.util.*;

public class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        // Two heaps: maxHeap stores smaller half, minHeap stores larger half
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        // Map to track elements marked for deletion
        Map<Integer, Integer> toRemove = new HashMap<>();

        // Helper function to get valid top of heap
        Function<PriorityQueue<Integer>, Integer> getValidTop = (heap) -> {
            while (!heap.isEmpty()) {
                int num = heap.peek();
                if (toRemove.containsKey(num) && toRemove.get(num) > 0) {
                    toRemove.put(num, toRemove.get(num) - 1);
                    heap.poll();
                } else {
                    return num;
                }
            }
            return null;
        };

        // Helper function to add a number
        BiConsumer<Integer, Boolean> addNum = (num, isInitializing) -> {
            if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
                maxHeap.offer(num);
            } else {
                minHeap.offer(num);
            }
            rebalance(maxHeap, minHeap);
        };

        // Helper function to rebalance heaps
        BiConsumer<PriorityQueue<Integer>, PriorityQueue<Integer>> rebalance = (maxH, minH) -> {
            // Ensure maxHeap has either equal or one more element than minHeap
            while (maxH.size() > minH.size() + 1) {
                minH.offer(maxH.poll());
            }
            while (minH.size() > maxH.size()) {
                maxH.offer(minH.poll());
            }
        };

        // Helper function to remove a number
        BiConsumer<Integer, Map<Integer, Integer>> removeNum = (num, map) -> {
            map.put(num, map.getOrDefault(num, 0) + 1);
        };

        // Initialize first window
        for (int i = 0; i < k; i++) {
            addNum.accept(nums[i], true);
        }

        double[] result = new double[nums.length - k + 1];

        // Helper function to get median
        Function<Integer, Double> getMedian = (windowSize) -> {
            if (windowSize % 2 == 1) {
                // Odd k: median is top of maxHeap
                return (double) getValidTop.apply(maxHeap);
            } else {
                // Even k: median is average of both tops
                double left = getValidTop.apply(maxHeap);
                double right = getValidTop.apply(minHeap);
                return (left + right) / 2.0;
            }
        };

        result[0] = getMedian.apply(k);

        // Slide the window
        for (int i = k; i < nums.length; i++) {
            // Remove the element going out of window
            removeNum.accept(nums[i - k], toRemove);
            // Add the new element
            addNum.accept(nums[i], false);
            // Get median for current window
            result[i - k + 1] = getMedian.apply(k);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n\*logk)

- Each insertion into a heap takes O(logk) time
- Each removal (lazy deletion) takes O(logk) time in the worst case when we need to pop multiple invalid elements
- We perform O(n) insertions and O(n) removals
- The rebalancing operations also take O(logk) time each

**Space Complexity:** O(n)

- The two heaps together store at most O(k) elements
- The `to_remove` dictionary can store up to O(n) elements in the worst case when all elements are unique and marked for deletion before being cleaned up
- The output array takes O(n-k+1) space

## Common Mistakes

1. **Forgetting to handle even k correctly**: When k is even, the median is the average of the two middle elements, not just one of them. Candidates often return a single element or use integer division incorrectly.

2. **Not implementing lazy deletion properly**: Trying to remove elements directly from heaps leads to O(k) time complexity. The lazy deletion pattern is crucial for maintaining O(logk) operations.

3. **Incorrect heap balancing**: The max-heap should always have either the same number of elements as the min-heap (when k is even) or one more element (when k is odd). Failing to maintain this invariant leads to incorrect median calculations.

4. **Integer overflow in JavaScript/Java**: When calculating the average for even k, ensure you use floating-point division, not integer division. In Java, cast to double before dividing.

## When You'll See This Pattern

The two-heap pattern with lazy deletion appears in several sliding window problems that require order statistics:

1. **Find Median from Data Stream (LeetCode 295)**: The foundational problem that introduces the two-heap approach for maintaining medians. Sliding Window Median extends this by adding the removal operation.

2. **Sliding Window Maximum (LeetCode 239)**: While typically solved with a deque, it can also be solved with a heap and lazy deletion when you need the maximum (a special case of order statistics).

3. **IPO (LeetCode 502)**: Uses heaps to select the most profitable projects, though without the sliding window component.

## Key Takeaways

1. **Two heaps + lazy deletion** is a powerful pattern for maintaining order statistics in a sliding window. The max-heap stores the smaller half, the min-heap stores the larger half, and lazy deletion handles arbitrary removals efficiently.

2. **Recognize when you need order statistics in a sliding window**. If a problem asks for median, kth smallest/largest, or any percentile in a sliding window, this pattern should come to mind.

3. **Balance is crucial**. The heap sizes must be carefully maintained to ensure quick access to the median. For odd window sizes, the max-heap should have one more element; for even sizes, both heaps should have equal elements.

Related problems: [Find Median from Data Stream](/problem/find-median-from-data-stream), [Minimum Operations to Make Median of Array Equal to K](/problem/minimum-operations-to-make-median-of-array-equal-to-k)
