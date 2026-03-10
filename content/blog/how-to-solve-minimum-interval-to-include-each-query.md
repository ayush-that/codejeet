---
title: "How to Solve Minimum Interval to Include Each Query — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Interval to Include Each Query. Hard difficulty, 54.0% acceptance rate. Topics: Array, Binary Search, Sweep Line, Sorting, Heap (Priority Queue)."
date: "2028-02-08"
category: "dsa-patterns"
tags: ["minimum-interval-to-include-each-query", "array", "binary-search", "sweep-line", "hard"]
---

# How to Solve Minimum Interval to Include Each Query

This problem asks us to find, for each query point, the smallest interval size that contains that point. Given a list of intervals and a list of query points, we need to efficiently determine which interval (if any) covers each query point with the smallest possible size. What makes this problem tricky is that we need to handle both interval coverage and size comparison efficiently—a naive check of all intervals for each query would be far too slow for the constraints.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- Intervals: `[[1, 4], [2, 4], [3, 6], [5, 7]]`
- Queries: `[2, 3, 5]`

**Step-by-step reasoning:**

1. **Interval sizes:**
   - `[1, 4]`: size = 4 - 1 + 1 = 4
   - `[2, 4]`: size = 4 - 2 + 1 = 3
   - `[3, 6]`: size = 6 - 3 + 1 = 4
   - `[5, 7]`: size = 7 - 5 + 1 = 3

2. **For query point 2:**
   - Which intervals contain 2? `[1, 4]` and `[2, 4]`
   - Smallest size among these: min(4, 3) = 3
   - Answer for query 2: 3

3. **For query point 3:**
   - Which intervals contain 3? `[1, 4]`, `[2, 4]`, and `[3, 6]`
   - Smallest size: min(4, 3, 4) = 3
   - Answer for query 3: 3

4. **For query point 5:**
   - Which intervals contain 5? `[3, 6]` and `[5, 7]`
   - Smallest size: min(4, 3) = 3
   - Answer for query 5: 3

**Key insight:** We need a way to efficiently track which intervals are "active" (cover the current query point) and quickly find the smallest among them.

## Brute Force Approach

The most straightforward solution is to check every interval for every query point:

1. For each query point `q`:
2. Initialize `min_size = ∞`
3. For each interval `[left, right]`:
   - If `left ≤ q ≤ right`:
     - Calculate size = `right - left + 1`
     - Update `min_size = min(min_size, size)`
4. If `min_size` is still ∞, set answer to -1, otherwise use `min_size`

**Why this fails:** With `n` intervals and `m` queries, this approach takes O(n × m) time. Given that both `n` and `m` can be up to 10⁵, this would be 10¹⁰ operations—far too slow.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(1) excluding output
def minIntervalBruteForce(intervals, queries):
    result = []

    for q in queries:
        min_size = float('inf')

        for left, right in intervals:
            if left <= q <= right:
                size = right - left + 1
                min_size = min(min_size, size)

        result.append(min_size if min_size != float('inf') else -1)

    return result
```

```javascript
// Time: O(n * m) | Space: O(1) excluding output
function minIntervalBruteForce(intervals, queries) {
  const result = [];

  for (const q of queries) {
    let minSize = Infinity;

    for (const [left, right] of intervals) {
      if (left <= q && q <= right) {
        const size = right - left + 1;
        minSize = Math.min(minSize, size);
      }
    }

    result.push(minSize !== Infinity ? minSize : -1);
  }

  return result;
}
```

```java
// Time: O(n * m) | Space: O(1) excluding output
public int[] minIntervalBruteForce(int[][] intervals, int[] queries) {
    int[] result = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int q = queries[i];
        int minSize = Integer.MAX_VALUE;

        for (int[] interval : intervals) {
            int left = interval[0];
            int right = interval[1];

            if (left <= q && q <= right) {
                int size = right - left + 1;
                minSize = Math.min(minSize, size);
            }
        }

        result[i] = (minSize != Integer.MAX_VALUE) ? minSize : -1;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is to process queries in sorted order while maintaining a data structure of "active" intervals that cover the current query point. Here's the step-by-step reasoning:

1. **Sort both intervals and queries:**
   - Sort intervals by their starting point
   - Sort queries but keep track of original indices

2. **Use a min-heap to track active intervals:**
   - The heap stores `(size, right_endpoint)` pairs
   - We can quickly get the smallest size among active intervals

3. **Sweep through queries in sorted order:**
   - For each query point `q`:
     - Add all intervals that start before or at `q` to the heap
     - Remove all intervals from heap that end before `q` (they no longer cover `q`)
     - The smallest size at the top of the heap (if any) is our answer

4. **Why this works:**
   - By processing queries in order, we only add each interval to the heap once
   - By removing expired intervals, we ensure the heap only contains intervals covering `q`
   - The min-heap gives us O(1) access to the smallest size

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + m) log(n + m)) | Space: O(n + m)
def minInterval(intervals, queries):
    # Step 1: Sort intervals by start time
    intervals.sort(key=lambda x: x[0])

    # Step 2: Create list of queries with original indices
    sorted_queries = sorted([(q, i) for i, q in enumerate(queries)])

    # Step 3: Initialize result array and min-heap
    result = [-1] * len(queries)
    min_heap = []  # stores (size, right_endpoint)

    # Step 4: Initialize interval pointer
    i = 0

    # Step 5: Process queries in sorted order
    for q, original_idx in sorted_queries:
        # Add all intervals that start before or at current query point
        while i < len(intervals) and intervals[i][0] <= q:
            left, right = intervals[i]
            size = right - left + 1
            # Push (size, right_endpoint) to heap
            heapq.heappush(min_heap, (size, right))
            i += 1

        # Remove intervals that end before current query point
        while min_heap and min_heap[0][1] < q:
            heapq.heappop(min_heap)

        # If heap is not empty, smallest size is at the top
        if min_heap:
            result[original_idx] = min_heap[0][0]

    return result
```

```javascript
// Time: O((n + m) log(n + m)) | Space: O(n + m)
function minInterval(intervals, queries) {
  // Step 1: Sort intervals by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Step 2: Create array of queries with original indices
  const sortedQueries = queries.map((q, i) => [q, i]);
  sortedQueries.sort((a, b) => a[0] - b[0]);

  // Step 3: Initialize result array and min-heap
  const result = new Array(queries.length).fill(-1);
  const minHeap = new MinPriorityQueue({
    priority: (item) => item.size,
  });

  // Step 4: Initialize interval pointer
  let i = 0;

  // Step 5: Process queries in sorted order
  for (const [q, originalIdx] of sortedQueries) {
    // Add all intervals that start before or at current query point
    while (i < intervals.length && intervals[i][0] <= q) {
      const [left, right] = intervals[i];
      const size = right - left + 1;
      // Push to heap with size as priority
      minHeap.enqueue({ size, right }, size);
      i++;
    }

    // Remove intervals that end before current query point
    while (!minHeap.isEmpty() && minHeap.front().element.right < q) {
      minHeap.dequeue();
    }

    // If heap is not empty, smallest size is at the front
    if (!minHeap.isEmpty()) {
      result[originalIdx] = minHeap.front().element.size;
    }
  }

  return result;
}
```

```java
// Time: O((n + m) log(n + m)) | Space: O(n + m)
public int[] minInterval(int[][] intervals, int[] queries) {
    // Step 1: Sort intervals by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 2: Create array of queries with original indices
    int[][] sortedQueries = new int[queries.length][2];
    for (int i = 0; i < queries.length; i++) {
        sortedQueries[i][0] = queries[i];  // query value
        sortedQueries[i][1] = i;           // original index
    }
    Arrays.sort(sortedQueries, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 3: Initialize result array and min-heap
    int[] result = new int[queries.length];
    Arrays.fill(result, -1);
    // Min-heap stores [size, right_endpoint]
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));

    // Step 4: Initialize interval pointer
    int i = 0;

    // Step 5: Process queries in sorted order
    for (int[] query : sortedQueries) {
        int q = query[0];
        int originalIdx = query[1];

        // Add all intervals that start before or at current query point
        while (i < intervals.length && intervals[i][0] <= q) {
            int left = intervals[i][0];
            int right = intervals[i][1];
            int size = right - left + 1;
            // Add to heap
            minHeap.offer(new int[]{size, right});
            i++;
        }

        // Remove intervals that end before current query point
        while (!minHeap.isEmpty() && minHeap.peek()[1] < q) {
            minHeap.poll();
        }

        // If heap is not empty, smallest size is at the top
        if (!minHeap.isEmpty()) {
            result[originalIdx] = minHeap.peek()[0];
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + m) log(n + m))**

- Sorting intervals: O(n log n)
- Sorting queries with indices: O(m log m)
- Each interval is added to heap once: O(n log n)
- Each interval is removed from heap at most once: O(n log n)
- Each query processes heap operations: O(m log n)
- Total: O((n + m) log(n + m))

**Space Complexity: O(n + m)**

- Storing sorted queries with indices: O(m)
- Min-heap storing intervals: O(n) in worst case
- Result array: O(m)
- Total: O(n + m)

## Common Mistakes

1. **Forgetting to track original query indices:** When sorting queries, you must remember their original positions to place answers correctly in the result array. Always create `(query_value, original_index)` pairs before sorting.

2. **Not removing expired intervals from heap:** An interval that ends before the current query point cannot cover it, even if it started earlier. Always check the right endpoint of the smallest interval in the heap before returning its size.

3. **Incorrect heap ordering:** The heap should be ordered by interval size (smallest first), not by start or end points. This ensures we can quickly access the smallest covering interval.

4. **Off-by-one errors in interval size calculation:** Remember that `[left, right]` inclusive means the size is `right - left + 1`, not `right - left`.

## When You'll See This Pattern

This "sweep line with heap" pattern appears in problems where you need to track overlapping intervals or ranges while processing points in order:

1. **Number of Flowers in Full Bloom (Hard):** Similar structure—track flowers that are blooming at each query time using a heap.
2. **Meeting Rooms II (Medium):** Track overlapping meetings using a min-heap of end times.
3. **Car Pooling (Medium):** Track passengers in vehicle at each stop using sweep line technique.

The pattern is: sort events, sweep through them in order, use a heap to track active items, and remove expired items as you go.

## Key Takeaways

1. **When you need to process queries against intervals, consider sorting both and using a sweep line approach.** This often reduces O(n × m) to O((n + m) log(n + m)).

2. **Min-heaps are excellent for tracking the "best" (smallest/largest) item among active candidates.** They support O(log n) updates and O(1) access to the optimal item.

3. **Always clean up expired items from your data structures.** In sweep line problems, items that are no longer relevant should be removed to keep the data structure efficient and correct.

Related problems: [Number of Flowers in Full Bloom](/problem/number-of-flowers-in-full-bloom)
