---
title: "How to Solve Find Right Interval — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Right Interval. Medium difficulty, 55.4% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2026-08-10"
category: "dsa-patterns"
tags: ["find-right-interval", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Find Right Interval

You're given an array of intervals where each interval has a unique start time. For each interval, you need to find the "right interval" — another interval whose start time is greater than or equal to the current interval's end time, with the smallest possible start time. The challenge is doing this efficiently for all intervals simultaneously.

What makes this problem interesting is that we need to find the _minimum start time_ that's _greater than or equal to_ each interval's end time. This is essentially a "next greater element" problem, but with intervals and unique start times.

## Visual Walkthrough

Let's trace through an example: `intervals = [[3,4], [2,3], [1,2]]`

For each interval, we need to find the interval with the smallest start time ≥ its end time:

1. **Interval [3,4]**: End time = 4. We look for intervals with start ≥ 4. Available starts: [3, 2, 1]. None are ≥ 4, so result = -1.

2. **Interval [2,3]**: End time = 3. We look for starts ≥ 3. Available: [3, 2, 1]. The smallest start ≥ 3 is 3 (from interval [3,4]), so result = index of [3,4], which is 0.

3. **Interval [1,2]**: End time = 2. We look for starts ≥ 2. Available: [3, 2, 1]. The smallest start ≥ 2 is 2 (from interval [2,3]), so result = index of [2,3], which is 1.

Final result: `[-1, 0, 1]`

The key insight: we need to quickly find, for each end time, the smallest start time that's ≥ that end time.

## Brute Force Approach

The most straightforward approach is to check every possible pair of intervals:

For each interval i, scan through all intervals j to find the one where:

1. `start_j ≥ end_i`
2. `start_j` is minimized among all such intervals

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for the result
def findRightInterval(intervals):
    n = len(intervals)
    result = [-1] * n

    for i in range(n):
        end_i = intervals[i][1]
        min_start = float('inf')
        min_index = -1

        # Check all intervals to find the right interval
        for j in range(n):
            start_j = intervals[j][0]
            if start_j >= end_i and start_j < min_start:
                min_start = start_j
                min_index = j

        result[i] = min_index

    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function findRightInterval(intervals) {
  const n = intervals.length;
  const result = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    const endI = intervals[i][1];
    let minStart = Infinity;
    let minIndex = -1;

    // Check all intervals to find the right interval
    for (let j = 0; j < n; j++) {
      const startJ = intervals[j][0];
      if (startJ >= endI && startJ < minStart) {
        minStart = startJ;
        minIndex = j;
      }
    }

    result[i] = minIndex;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public int[] findRightInterval(int[][] intervals) {
    int n = intervals.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);

    for (int i = 0; i < n; i++) {
        int endI = intervals[i][1];
        int minStart = Integer.MAX_VALUE;
        int minIndex = -1;

        // Check all intervals to find the right interval
        for (int j = 0; j < n; j++) {
            int startJ = intervals[j][0];
            if (startJ >= endI && startJ < minStart) {
                minStart = startJ;
                minIndex = j;
            }
        }

        result[i] = minIndex;
    }

    return result;
}
```

</div>

**Why this is insufficient**: With n intervals, we're doing n comparisons for each of n intervals, giving us O(n²) time complexity. For the constraints (typically up to 10⁵ intervals), this would be far too slow.

## Optimized Approach

The key insight is that we need to efficiently find, for each end time, the smallest start time that's ≥ that end time. This is a classic "search" problem that we can optimize using sorting and binary search.

Here's the step-by-step reasoning:

1. **Store original indices**: Since we need to return indices in the original order, we must preserve the original indices before sorting.

2. **Sort by start time**: Create a list of `(start_time, original_index)` pairs and sort them by start time. This gives us a sorted array where we can efficiently search.

3. **Binary search for each end time**: For each interval's end time, perform binary search on the sorted starts to find the smallest start ≥ end time.

4. **Map back to original indices**: Once we find the right start time, we need to return the original index of that interval.

The critical realization: We're essentially performing a "lower bound" or "ceiling" search for each end time in a sorted array of start times.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def findRightInterval(intervals):
    n = len(intervals)

    # Step 1: Create a list of (start_time, original_index) pairs
    # We need to remember the original index for each interval
    starts = [(intervals[i][0], i) for i in range(n)]

    # Step 2: Sort by start time
    # Sorting allows us to use binary search
    starts.sort()

    # Step 3: Prepare result array
    result = [-1] * n

    # Step 4: For each interval, find the right interval using binary search
    for i in range(n):
        end_time = intervals[i][1]

        # Binary search to find the smallest start >= end_time
        left, right = 0, n - 1
        best_index = -1

        while left <= right:
            mid = left + (right - left) // 2

            if starts[mid][0] >= end_time:
                # Found a candidate, but keep searching left for a smaller one
                best_index = starts[mid][1]  # Store the original index
                right = mid - 1
            else:
                # Current start is too small, search right
                left = mid + 1

        result[i] = best_index

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function findRightInterval(intervals) {
  const n = intervals.length;

  // Step 1: Create an array of objects with start time and original index
  const starts = [];
  for (let i = 0; i < n; i++) {
    starts.push({ start: intervals[i][0], index: i });
  }

  // Step 2: Sort by start time
  starts.sort((a, b) => a.start - b.start);

  // Step 3: Prepare result array
  const result = new Array(n).fill(-1);

  // Step 4: For each interval, find the right interval using binary search
  for (let i = 0; i < n; i++) {
    const endTime = intervals[i][1];

    // Binary search to find the smallest start >= endTime
    let left = 0,
      right = n - 1;
    let bestIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (starts[mid].start >= endTime) {
        // Found a candidate, but keep searching left for a smaller one
        bestIndex = starts[mid].index; // Store the original index
        right = mid - 1;
      } else {
        // Current start is too small, search right
        left = mid + 1;
      }
    }

    result[i] = bestIndex;
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[] findRightInterval(int[][] intervals) {
    int n = intervals.length;

    // Step 1: Create a list of start times with their original indices
    int[][] starts = new int[n][2];  // [start, original_index]
    for (int i = 0; i < n; i++) {
        starts[i][0] = intervals[i][0];
        starts[i][1] = i;
    }

    // Step 2: Sort by start time
    Arrays.sort(starts, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 3: Prepare result array
    int[] result = new int[n];
    Arrays.fill(result, -1);

    // Step 4: For each interval, find the right interval using binary search
    for (int i = 0; i < n; i++) {
        int endTime = intervals[i][1];

        // Binary search to find the smallest start >= endTime
        int left = 0, right = n - 1;
        int bestIndex = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (starts[mid][0] >= endTime) {
                // Found a candidate, but keep searching left for a smaller one
                bestIndex = starts[mid][1];  // Store the original index
                right = mid - 1;
            } else {
                // Current start is too small, search right
                left = mid + 1;
            }
        }

        result[i] = bestIndex;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the starts array: O(n log n)
- For each of n intervals, performing binary search: O(log n) each, total O(n log n)
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We store the starts array with original indices: O(n)
- We store the result array: O(n)
- Total: O(n)

The O(n log n) time complexity is a massive improvement over the O(n²) brute force, especially for large inputs.

## Common Mistakes

1. **Forgetting to store original indices**: If you sort without storing original indices, you'll lose track of which interval is which. Always store `(value, original_index)` when sorting if you need to return indices.

2. **Using the wrong comparison in binary search**: A common error is using `>` instead of `>=`. Remember we need start time _greater than or equal to_ the end time, not just greater than.

3. **Not handling the "no right interval" case**: When binary search doesn't find a suitable start time, we need to return -1. Make sure your binary search correctly handles this by initializing `bestIndex = -1` and only updating it when a valid candidate is found.

4. **Off-by-one errors in binary search**: The classic binary search pitfalls: using `mid = (left + right) / 2` without floor (in JavaScript), or forgetting to update bounds correctly. Always use `left <= right` with `left = mid + 1` and `right = mid - 1` for clarity.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sorting + Binary Search for "next greater" queries**: Whenever you need to find the smallest element ≥ a target in a collection, consider sorting and using binary search. Similar problems:
   - **"Find First and Last Position of Element in Sorted Array"** (LeetCode 34) - uses binary search to find boundaries
   - **"Time Based Key-Value Store"** (LeetCode 981) - uses binary search to find values based on timestamps

2. **Preserving indices after sorting**: Many problems require you to return indices but benefit from sorting. The pattern is always: store `(value, index)`, sort by value, then map back using the stored index.

3. **Interval problems with ordering requirements**: Other interval problems that might use similar techniques:
   - **"Meeting Rooms II"** (LeetCode 253) - uses sorting and priority queues
   - **"Merge Intervals"** (LeetCode 56) - sorts intervals by start time

## Key Takeaways

1. **When you need to find "next greater" elements efficiently, sort and use binary search**. The O(n log n) approach is almost always better than O(n²) for n > 100.

2. **Always preserve original indices when sorting if you need to return them**. The `(value, index)` pattern is essential for many sorting-based solutions.

3. **Recognize "search in sorted array" opportunities**. If a problem asks for the "minimum X that satisfies condition Y", and you can sort the data, binary search is likely applicable.

Related problems: [Data Stream as Disjoint Intervals](/problem/data-stream-as-disjoint-intervals)
