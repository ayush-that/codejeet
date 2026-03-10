---
title: "How to Solve Find Median from Data Stream — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Median from Data Stream. Hard difficulty, 54.2% acceptance rate. Topics: Two Pointers, Design, Sorting, Heap (Priority Queue), Data Stream."
date: "2026-09-07"
category: "dsa-patterns"
tags: ["find-median-from-data-stream", "two-pointers", "design", "sorting", "hard"]
---

# How to Solve Find Median from Data Stream

Finding the median of a dynamically changing data stream is a classic hard problem that tests your ability to design efficient data structures. The challenge is that we need to support two operations: adding numbers to our dataset and finding the median at any point, all while maintaining optimal performance. What makes this tricky is that simply storing all numbers and sorting them for each median query would be far too slow for large streams.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll add numbers in this order: 5, 3, 8, 2, 7, and query the median after each addition.

**Step 1: Add 5**

- Data: [5]
- Median: 5 (odd count, middle element)

**Step 2: Add 3**

- Data: [3, 5] (sorted)
- Median: (3 + 5) / 2 = 4 (even count, average of two middle elements)

**Step 3: Add 8**

- Data: [3, 5, 8] (sorted)
- Median: 5 (odd count, middle element)

**Step 4: Add 2**

- Data: [2, 3, 5, 8] (sorted)
- Median: (3 + 5) / 2 = 4

**Step 5: Add 7**

- Data: [2, 3, 5, 7, 8] (sorted)
- Median: 5

The key insight is that we don't actually need to maintain the entire sorted list. We only need access to the middle elements. This suggests we could use two heaps: one for the smaller half of numbers (max-heap) and one for the larger half (min-heap).

Let's see how this works with the same example:

**Step 1: Add 5**

- Max-heap (smaller half): [5]
- Min-heap (larger half): []
- Median: 5

**Step 2: Add 3**

- Max-heap: [3, 5] → violates size balance
- Rebalance: move 5 to min-heap
- Max-heap: [3], Min-heap: [5]
- Median: (3 + 5) / 2 = 4

**Step 3: Add 8**

- Add to min-heap (since 8 > 5): [5, 8]
- Max-heap: [3], Min-heap: [5, 8] → min-heap has more elements
- Rebalance: move 5 to max-heap
- Max-heap: [5, 3], Min-heap: [8]
- Median: 5

This two-heap approach gives us O(log n) insertion and O(1) median finding!

## Brute Force Approach

The most straightforward approach is to store all numbers in an array or list. Each time we need to find the median:

1. Sort the entire list (O(n log n))
2. Find the middle element(s) (O(1))

For adding a number:

1. Append to the list (O(1) amortized)

This gives us O(n log n) time for each median query, which is far too slow for a data stream where we might query the median frequently. If we have m add operations and n findMedian operations, the total time would be O(m + n log n) for sorting each time, which becomes O(n² log n) in the worst case.

Here's what the brute force code might look like:

<div class="code-group">

```python
class MedianFinder:
    def __init__(self):
        self.nums = []

    def addNum(self, num: int) -> None:
        # O(1) - just append
        self.nums.append(num)

    def findMedian(self) -> float:
        # O(n log n) - sort the entire list
        self.nums.sort()
        n = len(self.nums)

        if n % 2 == 1:
            # Odd length: return middle element
            return self.nums[n // 2]
        else:
            # Even length: return average of two middle elements
            mid = n // 2
            return (self.nums[mid - 1] + self.nums[mid]) / 2
```

```javascript
class MedianFinder {
  constructor() {
    this.nums = [];
  }

  addNum(num) {
    // O(1) - just push
    this.nums.push(num);
  }

  findMedian() {
    // O(n log n) - sort the entire array
    this.nums.sort((a, b) => a - b);
    const n = this.nums.length;

    if (n % 2 === 1) {
      // Odd length: return middle element
      return this.nums[Math.floor(n / 2)];
    } else {
      // Even length: return average of two middle elements
      const mid = n / 2;
      return (this.nums[mid - 1] + this.nums[mid]) / 2;
    }
  }
}
```

```java
class MedianFinder {
    private List<Integer> nums;

    public MedianFinder() {
        nums = new ArrayList<>();
    }

    public void addNum(int num) {
        // O(1) - just add
        nums.add(num);
    }

    public double findMedian() {
        // O(n log n) - sort the entire list
        Collections.sort(nums);
        int n = nums.size();

        if (n % 2 == 1) {
            // Odd length: return middle element
            return nums.get(n / 2);
        } else {
            // Even length: return average of two middle elements
            int mid = n / 2;
            return (nums.get(mid - 1) + nums.get(mid)) / 2.0;
        }
    }
}
```

</div>

The problem with this approach is clear: each median query requires sorting the entire dataset, which becomes prohibitively expensive as the stream grows.

## Optimized Approach

The key insight is that we don't need the entire sorted list to find the median—we only need access to the middle element(s). This suggests using two heaps:

1. **Max-heap (smaller half)**: Stores the smaller half of numbers, with the largest at the top
2. **Min-heap (larger half)**: Stores the larger half of numbers, with the smallest at the top

By maintaining these two heaps with these invariants:

- The max-heap contains all numbers ≤ median
- The min-heap contains all numbers ≥ median
- The heaps are balanced in size (differ by at most 1)

We can always find the median in O(1) time:

- If total count is odd: median is the top of the larger heap
- If total count is even: median is the average of both heap tops

Adding a number takes O(log n) time:

1. Add to the appropriate heap based on comparison with current tops
2. Rebalance if necessary to maintain size invariant

This approach gives us O(log n) add operations and O(1) median queries, which is optimal for this problem.

## Optimal Solution

Here's the complete implementation using two heaps:

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        # Max-heap for the smaller half (implemented as min-heap with negative values)
        self.small = []
        # Min-heap for the larger half
        self.large = []

    def addNum(self, num: int) -> None:
        # Step 1: Add to appropriate heap
        # If small is empty or num belongs in smaller half, add to small
        if not self.small or num <= -self.small[0]:
            heapq.heappush(self.small, -num)  # Use negative for max-heap behavior
        else:
            heapq.heappush(self.large, num)

        # Step 2: Rebalance heaps to maintain size invariant
        # Ensure small heap has at most one more element than large heap
        if len(self.small) > len(self.large) + 1:
            # Move top of small to large
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            # Move top of large to small
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        # Step 3: Calculate median based on heap sizes
        if len(self.small) > len(self.large):
            # Odd total count: median is top of small (max of smaller half)
            return -self.small[0]
        else:
            # Even total count: average of both heap tops
            return (-self.small[0] + self.large[0]) / 2
```

```javascript
class MedianFinder {
  constructor() {
    // Max-heap for the smaller half (implemented as min-heap with negative values)
    this.small = new MinHeap((a, b) => a - b);
    // Min-heap for the larger half
    this.large = new MinHeap((a, b) => a - b);
  }

  addNum(num) {
    // Step 1: Add to appropriate heap
    // If small is empty or num belongs in smaller half, add to small
    if (this.small.size() === 0 || num <= -this.small.peek()) {
      this.small.push(-num); // Use negative for max-heap behavior
    } else {
      this.large.push(num);
    }

    // Step 2: Rebalance heaps to maintain size invariant
    // Ensure small heap has at most one more element than large heap
    if (this.small.size() > this.large.size() + 1) {
      // Move top of small to large
      const val = -this.small.pop();
      this.large.push(val);
    } else if (this.large.size() > this.small.size()) {
      // Move top of large to small
      const val = this.large.pop();
      this.small.push(-val);
    }
  }

  findMedian() {
    // Step 3: Calculate median based on heap sizes
    if (this.small.size() > this.large.size()) {
      // Odd total count: median is top of small (max of smaller half)
      return -this.small.peek();
    } else {
      // Even total count: average of both heap tops
      return (-this.small.peek() + this.large.peek()) / 2;
    }
  }
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
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smallest = index;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    // Max-heap for the smaller half
    private PriorityQueue<Integer> small;
    // Min-heap for the larger half
    private PriorityQueue<Integer> large;

    public MedianFinder() {
        // Max-heap: reverse order comparator
        small = new PriorityQueue<>(Collections.reverseOrder());
        // Min-heap: natural order (default)
        large = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // Step 1: Add to appropriate heap
        // If small is empty or num belongs in smaller half, add to small
        if (small.isEmpty() || num <= small.peek()) {
            small.offer(num);
        } else {
            large.offer(num);
        }

        // Step 2: Rebalance heaps to maintain size invariant
        // Ensure small heap has at most one more element than large heap
        if (small.size() > large.size() + 1) {
            // Move top of small to large
            large.offer(small.poll());
        } else if (large.size() > small.size()) {
            // Move top of large to small
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        // Step 3: Calculate median based on heap sizes
        if (small.size() > large.size()) {
            // Odd total count: median is top of small (max of smaller half)
            return small.peek();
        } else {
            // Even total count: average of both heap tops
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addNum(num)`: O(log n) - Each heap insertion/removal takes O(log n) time, and we perform at most 2 heap operations per add
- `findMedian()`: O(1) - We only need to peek at the top of the heaps

**Space Complexity:** O(n) - We store all n numbers across the two heaps

The logarithmic time for additions comes from the heap operations. Each insertion into a binary heap takes O(log n) time, and we might need to move one element between heaps to maintain balance. The constant time for median queries is because we only need to access the root elements of the heaps.

## Common Mistakes

1. **Forgetting to rebalance after each addition**: This is the most common mistake. If you don't rebalance, one heap might grow much larger than the other, breaking the median calculation. Always check and maintain the size invariant after each add.

2. **Using the wrong comparison when adding numbers**: When deciding which heap to add to, you must compare with the current heap tops, not just alternate between heaps. For example, if the new number is smaller than the max of the smaller half, it belongs in the smaller half, regardless of heap sizes.

3. **Incorrect median calculation for even counts**: When there's an even number of elements, the median is the average of the two middle values, which are the max of the smaller half and the min of the larger half. Some candidates mistakenly average all elements or use wrong indices.

4. **Not handling the max-heap implementation correctly**: In languages without built-in max-heaps (like Python and JavaScript), you need to use negative values or custom comparators. Forgetting to negate values when moving between heaps is a common source of bugs.

## When You'll See This Pattern

The two-heap pattern is useful whenever you need to maintain running statistics on a data stream, particularly when you need quick access to percentiles or medians. You'll see this pattern in:

1. **Sliding Window Median (LeetCode 480)**: Similar to this problem but with a fixed-size window that slides through the data. You need to remove elements as they leave the window while maintaining the two-heap structure.

2. **Finding MK Average (LeetCode 1825)**: Requires maintaining the sum of middle k elements in a stream, which extends the two-heap concept to track more than just the median.

3. **Sequentially Ordinal Rank Tracker (LeetCode 2102)**: Involves maintaining a data structure that supports adding scores and finding the k-th largest, which can be solved with similar heap techniques.

The core insight is that when you need quick access to order statistics (median, k-th largest/smallest) in a dynamic dataset, heaps often provide the right balance of efficiency and simplicity.

## Key Takeaways

1. **Two heaps solve median problems efficiently**: By splitting data into smaller and larger halves using a max-heap and min-heap, you get O(log n) insertions and O(1) median queries.

2. **Maintain size balance as an invariant**: The key to correct median calculation is ensuring the heaps differ in size by at most 1. Rebalance after every insertion.

3. **This pattern extends to other order statistics**: The same two-heap approach can be adapted for finding other percentiles or running statistics in data streams.

Related problems: [Sliding Window Median](/problem/sliding-window-median), [Finding MK Average](/problem/finding-mk-average), [Sequentially Ordinal Rank Tracker](/problem/sequentially-ordinal-rank-tracker)
