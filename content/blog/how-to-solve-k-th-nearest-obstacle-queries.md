---
title: "How to Solve K-th Nearest Obstacle Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K-th Nearest Obstacle Queries. Medium difficulty, 48.9% acceptance rate. Topics: Array, Heap (Priority Queue)."
date: "2029-01-18"
category: "dsa-patterns"
tags: ["k-th-nearest-obstacle-queries", "array", "heap-(priority-queue)", "medium"]
---

# How to Solve K-th Nearest Obstacle Queries

You're given a series of queries where each query adds an obstacle at a specific coordinate, and after each addition, you need to find the k-th smallest Euclidean distance from the origin to all obstacles added so far. The challenge is that you need to efficiently maintain distances as new obstacles are added, requiring dynamic updates rather than just a one-time calculation.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `k = 2`, `queries = [[1,3], [2,2], [3,1], [0,1]]`

We'll process each query step by step:

1. **First query [1,3]**:
   - Add obstacle at (1,3)
   - Distance = √(1² + 3²) = √10 ≈ 3.16
   - Current distances: [3.16]
   - k-th smallest (k=2) doesn't exist yet → return -1

2. **Second query [2,2]**:
   - Add obstacle at (2,2)
   - Distance = √(2² + 2²) = √8 ≈ 2.83
   - Current distances: [3.16, 2.83]
   - Sorted: [2.83, 3.16]
   - 2nd smallest = 3.16 → return 8 (since we return squared distance)

3. **Third query [3,1]**:
   - Add obstacle at (3,1)
   - Distance = √(3² + 1²) = √10 ≈ 3.16
   - Current distances: [3.16, 2.83, 3.16]
   - Sorted: [2.83, 3.16, 3.16]
   - 2nd smallest = 3.16 → return 10

4. **Fourth query [0,1]**:
   - Add obstacle at (0,1)
   - Distance = √(0² + 1²) = √1 = 1.00
   - Current distances: [3.16, 2.83, 3.16, 1.00]
   - Sorted: [1.00, 2.83, 3.16, 3.16]
   - 2nd smallest = 2.83 → return 8

The key insight: we need to maintain the k smallest distances dynamically as new obstacles are added.

## Brute Force Approach

The most straightforward approach would be:

1. Maintain a list of all obstacle distances
2. For each query:
   - Calculate the squared distance (x² + y²) for the new obstacle
   - Add it to the list
   - Sort the list
   - If the list has at least k elements, return the (k-1)-th element (k-th smallest)
   - Otherwise, return -1

**Why this is inefficient:**

- Sorting after each query takes O(n log n) time
- With n queries, this becomes O(n² log n) worst-case
- For large inputs (n up to 10⁵), this is far too slow

**What a naive candidate might try:**
Some might try to keep the list sorted using binary search insertion, which reduces insertion to O(log n) but finding the k-th element still requires O(k) time if using a list, or they might recalculate all distances each time. Both approaches are still too slow for the constraints.

## Optimized Approach

The key insight is that we only care about the k-th smallest distance, not all distances sorted. This suggests using a **max-heap** (priority queue) to maintain the k smallest distances:

1. **Why a max-heap?** A max-heap gives us O(1) access to the largest element among the k smallest. When we add a new distance:
   - If we have fewer than k distances, just add it
   - If we have exactly k distances and the new distance is smaller than the current k-th smallest (the max in our heap), we remove the largest and add the new one
   - This keeps exactly the k smallest distances in the heap

2. **Why squared distances?** We can work with squared distances (x² + y²) instead of actual Euclidean distances because:
   - √a < √b if and only if a < b (for non-negative a, b)
   - This avoids expensive square root calculations
   - We return squared distances anyway

3. **Data structure choice:** We need a max-heap. In Python, we can use `heapq` with negative values. In Java and JavaScript, we can use priority queues with custom comparators.

4. **Algorithm steps:**
   - Initialize an empty max-heap
   - For each query (x, y):
     - Calculate squared distance = x² + y²
     - If heap size < k: push distance
     - Else if distance < heap[0] (current k-th smallest):
       - Pop the largest (heap[0])
       - Push the new distance
     - If heap size == k: return heap[0] (k-th smallest)
     - Else: return -1

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log k) where n = number of queries
# Space: O(k) for storing k distances in heap
import heapq

def kthNearestObstacle(k, queries):
    """
    Process queries to add obstacles and return k-th smallest squared distance.

    Args:
        k: The k-th smallest distance to find
        queries: List of [x, y] coordinates to add as obstacles

    Returns:
        List of results after each query
    """
    # Max-heap simulation using negative values (Python heapq is min-heap by default)
    # We'll store negative distances to get max-heap behavior
    heap = []
    results = []

    for x, y in queries:
        # Calculate squared distance (avoid sqrt for efficiency)
        dist_sq = x * x + y * y

        # If we have fewer than k elements, just add to heap
        if len(heap) < k:
            # Push negative value for max-heap behavior
            heapq.heappush(heap, -dist_sq)
        else:
            # Compare with current k-th smallest (largest in our k-sized max-heap)
            # Since we store negatives, -heap[0] is the actual k-th smallest
            if dist_sq < -heap[0]:
                # Remove current k-th smallest (largest in heap)
                heapq.heappop(heap)
                # Add new distance
                heapq.heappush(heap, -dist_sq)

        # If we have k elements, the k-th smallest is at heap[0] (but negative)
        if len(heap) == k:
            results.append(-heap[0])
        else:
            results.append(-1)

    return results
```

```javascript
// Time: O(n log k) where n = number of queries
// Space: O(k) for storing k distances in heap
function kthNearestObstacle(k, queries) {
  /**
   * Process queries to add obstacles and return k-th smallest squared distance.
   *
   * @param {number} k - The k-th smallest distance to find
   * @param {number[][]} queries - Array of [x, y] coordinates to add as obstacles
   * @return {number[]} - Array of results after each query
   */
  // Max-heap using a custom comparator (largest distance at the top)
  const maxHeap = new MaxHeap();
  const results = [];

  for (const [x, y] of queries) {
    // Calculate squared distance (avoid sqrt for efficiency)
    const distSq = x * x + y * y;

    // If we have fewer than k elements, just add to heap
    if (maxHeap.size() < k) {
      maxHeap.push(distSq);
    } else {
      // Compare with current k-th smallest (largest in our k-sized max-heap)
      if (distSq < maxHeap.peek()) {
        // Remove current k-th smallest (largest in heap)
        maxHeap.pop();
        // Add new distance
        maxHeap.push(distSq);
      }
    }

    // If we have k elements, the k-th smallest is at the top of max-heap
    if (maxHeap.size() === k) {
      results.push(maxHeap.peek());
    } else {
      results.push(-1);
    }
  }

  return results;
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] >= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const last = this.heap.length - 1;

    while (true) {
      let largest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left <= last && this.heap[left] > this.heap[largest]) {
        largest = left;
      }

      if (right <= last && this.heap[right] > this.heap[largest]) {
        largest = right;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}
```

```java
// Time: O(n log k) where n = number of queries
// Space: O(k) for storing k distances in heap
import java.util.*;

class Solution {
    public int[] kthNearestObstacle(int k, int[][] queries) {
        /**
         * Process queries to add obstacles and return k-th smallest squared distance.
         *
         * @param k: The k-th smallest distance to find
         * @param queries: Array of [x, y] coordinates to add as obstacles
         * @return: Array of results after each query
         */
        // Max-heap using Collections.reverseOrder() comparator
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        List<Integer> results = new ArrayList<>();

        for (int[] query : queries) {
            int x = query[0];
            int y = query[1];

            // Calculate squared distance (avoid sqrt for efficiency)
            int distSq = x * x + y * y;

            // If we have fewer than k elements, just add to heap
            if (maxHeap.size() < k) {
                maxHeap.offer(distSq);
            } else {
                // Compare with current k-th smallest (largest in our k-sized max-heap)
                if (distSq < maxHeap.peek()) {
                    // Remove current k-th smallest (largest in heap)
                    maxHeap.poll();
                    // Add new distance
                    maxHeap.offer(distSq);
                }
            }

            // If we have k elements, the k-th smallest is at the top of max-heap
            if (maxHeap.size() == k) {
                results.add(maxHeap.peek());
            } else {
                results.add(-1);
            }
        }

        // Convert List<Integer> to int[]
        int[] resultArray = new int[results.size()];
        for (int i = 0; i < results.size(); i++) {
            resultArray[i] = results.get(i);
        }
        return resultArray;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log k)

- For each of the n queries, we perform heap operations (push/pop)
- Each heap operation takes O(log k) time since we maintain at most k elements
- Total: O(n log k)

**Space Complexity:** O(k)

- We store at most k elements in the heap
- The output array takes O(n) space, but this is usually not counted in auxiliary space complexity
- Auxiliary space: O(k) for the heap

**Why this is optimal:**

- We must process each of n queries: Ω(n)
- Finding/updating k-th smallest among dynamic elements requires at least O(log k) per operation with comparison-based data structures
- O(n log k) matches these lower bounds

## Common Mistakes

1. **Using a min-heap instead of max-heap:** Candidates often use a min-heap storing all distances, then try to extract the k-th smallest. This takes O(n log n) time and O(n) space. The correct approach uses a max-heap of size k to track only the k smallest distances.

2. **Calculating actual Euclidean distances:** Some candidates calculate √(x² + y²) which involves expensive square root operations. Since we only need to compare distances, we can work with squared distances directly (x² + y²), which preserves ordering and is much faster.

3. **Forgetting the -1 case:** When there are fewer than k obstacles, we must return -1. Candidates often miss this edge case, especially in the first few queries.

4. **Incorrect heap comparator:** In languages where heaps default to min-heaps (like Python's heapq), forgetting to negate values for max-heap behavior is a common mistake. Always verify your heap gives you the largest (not smallest) of the k elements.

## When You'll See This Pattern

This "k-th smallest/largest in streaming data" pattern appears in many problems:

1. **Kth Largest Element in a Stream (LeetCode 703)** - Almost identical pattern: maintain k largest elements in a min-heap, return the smallest of those k (which is the k-th largest overall).

2. **Find Median from Data Stream (LeetCode 295)** - Uses two heaps (min and max) to maintain the middle elements, similar concept of maintaining order statistics dynamically.

3. **K Closest Points to Origin (LeetCode 973)** - Similar distance calculation but for one-time computation rather than streaming. The heap approach here is essentially solving "k closest points" after each new point arrives.

The core pattern: **When you need to maintain k smallest/largest elements from a stream of data, use a heap of size k.** For k smallest, use a max-heap; for k largest, use a min-heap.

## Key Takeaways

1. **Max-heap for k smallest, min-heap for k largest:** When maintaining k smallest elements, use a max-heap to easily remove the largest when a smaller element arrives. The opposite applies for k largest elements.

2. **Work with squared distances when possible:** Avoid expensive square root operations by comparing squared distances directly, since √a < √b ⇔ a < b for non-negative a, b.

3. **Streaming problems often need heap solutions:** When data arrives incrementally and you need to maintain order statistics (k-th smallest/largest, median), heaps are usually the right tool because they provide O(log n) updates and O(1) access to extremal values.

Related problems: [K Closest Points to Origin](/problem/k-closest-points-to-origin)
