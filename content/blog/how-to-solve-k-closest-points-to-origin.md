---
title: "How to Solve K Closest Points to Origin — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K Closest Points to Origin. Medium difficulty, 68.8% acceptance rate. Topics: Array, Math, Divide and Conquer, Geometry, Sorting."
date: "2026-06-24"
category: "dsa-patterns"
tags: ["k-closest-points-to-origin", "array", "math", "divide-and-conquer", "medium"]
---

# How to Solve K Closest Points to Origin

We need to find the `k` closest points to the origin `(0, 0)` from a list of points. The challenge is doing this efficiently without sorting all points (which would be O(n log n)), especially when `k` is much smaller than `n`. This problem tests your understanding of when to use sorting versus heap data structures versus quickselect algorithms.

## Visual Walkthrough

Let's trace through an example: `points = [[3,3],[5,-1],[-2,4],[1,1]]`, `k = 2`.

**Step 1: Calculate distances**
We don't actually need the square root since we're only comparing distances:

- Point [3,3]: distance² = 3² + 3² = 9 + 9 = 18
- Point [5,-1]: distance² = 25 + 1 = 26
- Point [-2,4]: distance² = 4 + 16 = 20
- Point [1,1]: distance² = 1 + 1 = 2

**Step 2: Find the 2 smallest distances**
The smallest distances are 2 ([1,1]) and 18 ([3,3]).

**Step 3: Return the corresponding points**
Result: `[[1,1],[3,3]]`

The key insight: we need the k smallest distances, not necessarily all distances sorted.

## Brute Force Approach

The most straightforward approach is to:

1. Calculate the squared distance for each point (avoiding sqrt for efficiency)
2. Sort all points by their distance
3. Return the first k points

This works but has O(n log n) time complexity due to sorting. When `k` is small (e.g., k=3 with n=1000000), we're doing much more work than necessary. The interviewer will expect you to recognize this inefficiency and optimize.

## Optimized Approach

We have several optimization paths:

**Approach 1: Max Heap (Priority Queue)**

- Maintain a max heap of size k
- For each point, calculate its distance
- If heap has fewer than k elements, add the point
- If heap has k elements and current point is closer than the farthest in heap, replace it
- At the end, the heap contains the k closest points

**Why a max heap?** Because we want quick access to the farthest point among our k candidates to decide if we should replace it.

**Approach 2: Quickselect (Divide and Conquer)**

- Use the quicksort partitioning idea to find the kth smallest element
- Partition points around a pivot based on distance
- If pivot index equals k, we have our answer
- If pivot index < k, search in the right partition
- If pivot index > k, search in the left partition

**Approach 3: Sorting with Custom Comparator**

- Sort points by distance using a custom comparator
- Return first k points

The heap approach is often preferred in interviews because:

1. It's easier to implement correctly under pressure
2. It has O(n log k) time complexity, which is better than O(n log n) when k ≪ n
3. It demonstrates knowledge of priority queues, a common interview topic

## Optimal Solution

Here's the max heap approach with detailed implementation:

<div class="code-group">

```python
# Time: O(n log k) - we process n points, heap operations are O(log k)
# Space: O(k) - we store at most k points in the heap
import heapq
from typing import List

def kClosest(points: List[List[int]], k: int) -> List[List[int]]:
    """
    Find k closest points to origin using max heap.

    Strategy: Maintain a max heap of size k. For each point:
    1. Calculate squared distance (avoid sqrt for efficiency)
    2. Push (-distance, point) to heap (negative for max heap behavior)
    3. If heap size > k, pop the farthest point (which is at the root)

    At the end, extract points from the heap.
    """

    # Max heap will store (-distance², point)
    # Python's heapq is min-heap by default, so we use negative distances
    # to get the point with largest distance at the root
    heap = []

    for point in points:
        # Calculate squared distance to avoid sqrt computation
        # Distance to origin (0,0): sqrt(x² + y²)
        # Since sqrt is monotonic, x² + y² preserves ordering
        distance = point[0] * point[0] + point[1] * point[1]

        # Push negative distance for max heap behavior
        heapq.heappush(heap, (-distance, point))

        # If heap exceeds size k, remove the farthest point
        # (which has the most negative value, i.e., largest distance)
        if len(heap) > k:
            heapq.heappop(heap)

    # Extract just the points from the heap
    # The heap contains k closest points, but not necessarily in order
    return [point for _, point in heap]
```

```javascript
// Time: O(n log k) - we process n points, heap operations are O(log k)
// Space: O(k) - we store at most k points in the heap

/**
 * Find k closest points to origin using max heap.
 *
 * Strategy: Maintain a max heap of size k. For each point:
 * 1. Calculate squared distance (avoid sqrt for efficiency)
 * 2. Push to heap with distance as priority
 * 3. If heap size > k, pop the farthest point
 *
 * At the end, extract points from the heap.
 */
function kClosest(points, k) {
  // Custom max heap implementation
  class MaxHeap {
    constructor() {
      this.heap = [];
    }

    push(item) {
      // Store as [negativeDistance, point] for max heap behavior
      // Negative because JavaScript doesn't have built-in max heap
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      const max = this.heap[0];
      const last = this.heap.pop();

      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown(0);
      }

      return max;
    }

    bubbleUp(index) {
      const item = this.heap[index];

      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];

        // Compare negative distances (so larger distance = more negative)
        if (item[0] >= parent[0]) break;

        this.heap[parentIndex] = item;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }

    sinkDown(index) {
      const length = this.heap.length;
      const item = this.heap[index];

      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swap = null;
        let leftChild, rightChild;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild[0] < item[0]) {
            swap = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild[0] < item[0]) ||
            (swap !== null && rightChild[0] < leftChild[0])
          ) {
            swap = rightChildIndex;
          }
        }

        if (swap === null) break;

        this.heap[index] = this.heap[swap];
        this.heap[swap] = item;
        index = swap;
      }
    }

    size() {
      return this.heap.length;
    }
  }

  const heap = new MaxHeap();

  for (const point of points) {
    // Calculate squared distance (x² + y²)
    const distance = point[0] * point[0] + point[1] * point[1];

    // Push with negative distance for max heap
    heap.push([-distance, point]);

    // Maintain heap size k
    if (heap.size() > k) {
      heap.pop();
    }
  }

  // Extract points from heap
  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop()[1]);
  }

  return result;
}
```

```java
// Time: O(n log k) - we process n points, heap operations are O(log k)
// Space: O(k) - we store at most k points in the heap
import java.util.PriorityQueue;

class Solution {
    /**
     * Find k closest points to origin using max heap.
     *
     * Strategy: Maintain a max heap of size k. For each point:
     * 1. Calculate squared distance (avoid sqrt for efficiency)
     * 2. Add to max heap (using custom comparator)
     * 3. If heap size > k, remove the farthest point
     *
     * At the end, extract points from the heap.
     */
    public int[][] kClosest(int[][] points, int k) {
        // Max heap: points with larger distance have higher priority
        // We store distances as negative to simulate max heap with min heap
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> {
                // Compare squared distances
                int distA = a[0] * a[0] + a[1] * a[1];
                int distB = b[0] * b[0] + b[1] * b[1];
                return Integer.compare(distB, distA); // Reverse order for max heap
            }
        );

        for (int[] point : points) {
            // Add point to heap
            maxHeap.offer(point);

            // If heap exceeds size k, remove the farthest point
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }

        // Extract results from heap
        int[][] result = new int[k][2];
        int index = 0;
        while (!maxHeap.isEmpty()) {
            result[index++] = maxHeap.poll();
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log k)**

- We process each of the n points once: O(n)
- For each point, we perform heap operations (push/pop): O(log k)
- Total: O(n log k)

**Space Complexity: O(k)**

- The heap stores at most k points
- Additional O(1) space for variables

**Comparison with sorting approach:**

- Sorting: O(n log n) time, O(n) or O(log n) space (depending on sort algorithm)
- Heap: O(n log k) time, O(k) space
- When k ≪ n, heap is significantly faster

## Common Mistakes

1. **Calculating actual distance with sqrt**: This is computationally expensive and unnecessary. Since sqrt is monotonic, comparing squared distances gives the same ordering.

2. **Using min heap instead of max heap**: A min heap would require storing all n points, giving O(n log n) time and O(n) space. The max heap of size k is more efficient.

3. **Forgetting to handle k = 0 or k = n**: While k=0 might return empty array, k=n should return all points. Always test edge cases.

4. **Not considering duplicate distances**: When multiple points have the same distance, any k of them are valid. Don't overcomplicate by trying to break ties.

5. **In Java: incorrect comparator for max heap**: Remember that `PriorityQueue` is min-heap by default. For max heap, use `(a, b) -> b - a` or `Collections.reverseOrder()`.

## When You'll See This Pattern

The "k smallest/largest elements" pattern appears frequently:

1. **Kth Largest Element in an Array (LeetCode 215)**: Find the kth largest element. Similar heap or quickselect approach.

2. **Top K Frequent Elements (LeetCode 347)**: Find k most frequent elements. Use min heap with frequency counts.

3. **Top K Frequent Words (LeetCode 692)**: Find k most frequent words. Similar to above but with string comparison tie-breaking.

4. **Find K Pairs with Smallest Sums (LeetCode 373)**: Another variation using heaps to track candidates.

The pattern: When you need the top/bottom k elements from a collection, consider:

- Heap if k is small relative to n
- Quickselect if you need O(n) average time and can modify input
- Sorting if k is close to n or implementation simplicity is priority

## Key Takeaways

1. **Use squared distance**: Avoid sqrt computation when only comparing distances. The monotonic property preserves ordering.

2. **Choose the right heap**: For "k smallest", use max heap (to easily remove largest). For "k largest", use min heap (to easily remove smallest).

3. **Consider k relative to n**: When k ≪ n, O(n log k) with heap beats O(n log n) with sorting. When k ≈ n, sorting might be simpler.

4. **Quickselect alternative**: For O(n) average time (but O(n²) worst case), quickselect modifies input but doesn't need extra space for heap.

Remember: In interviews, explain your thought process. Start with brute force, identify inefficiencies, then propose and implement the optimized solution.

Related problems: [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Top K Frequent Elements](/problem/top-k-frequent-elements), [Top K Frequent Words](/problem/top-k-frequent-words)
