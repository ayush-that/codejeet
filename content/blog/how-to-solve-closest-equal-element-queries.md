---
title: "How to Solve Closest Equal Element Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Closest Equal Element Queries. Medium difficulty, 32.8% acceptance rate. Topics: Array, Hash Table, Binary Search."
date: "2029-10-15"
category: "dsa-patterns"
tags: ["closest-equal-element-queries", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Closest Equal Element Queries

This problem asks us to find, for each query index, the minimum distance to any other position in a **circular** array containing the same value. The circular nature means we can wrap around the ends of the array, and the "distance" is measured as the minimum number of steps moving left or right. What makes this tricky is efficiently handling both the circular aspect and multiple queries without recalculating distances from scratch for each one.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [1, 2, 3, 1, 2, 3]
queries = [0, 1, 2, 3, 4, 5]
```

For query index 0 (value = 1):

- Looking left: index 0 → index 5 (wrap around) → index 4 → index 3 (found 1 at index 3)
  Distance left = 3 steps (0→5→4→3)
- Looking right: index 0 → index 1 → index 2 → index 3 (found 1 at index 3)
  Distance right = 3 steps
- Minimum distance = min(3, 3) = 3

For query index 1 (value = 2):

- Looking left: index 1 → index 0 → index 5 → index 4 (found 2 at index 4)
  Distance left = 3 steps (1→0→5→4)
- Looking right: index 1 → index 2 → index 3 → index 4 (found 2 at index 4)
  Distance right = 3 steps
- Minimum distance = 3

The pattern emerges: in a circular array, the minimum distance to an equal element is the smaller of:

1. The distance moving right to the next occurrence
2. The distance moving left to the previous occurrence

But here's the catch: we need to consider **all** occurrences, not just adjacent ones. For example, if we had `[1, 2, 1, 3, 1]` and query index 0 (value = 1), the occurrences are at indices 0, 2, and 4. The closest is at index 2 (distance 2 right), not index 4 (distance 1 left, 4 right in circular).

## Brute Force Approach

A naive solution would be: for each query index `i`, scan the entire array in both directions to find the closest matching element.

**Algorithm:**

1. For each query index `q`:
2. Initialize `minDist = infinity`
3. For each index `j` from 0 to n-1:
   - If `j != q` and `nums[j] == nums[q]`:
     - Calculate distance in both directions:
       - `distRight = (j - q + n) % n` (handles wrap-around)
       - `distLeft = (q - j + n) % n`
     - Take minimum of these two distances
     - Update `minDist` if this is smaller
4. If `minDist` is still infinity, set to -1 (no other occurrence)

**Why it's too slow:**

- Time complexity: O(m × n) where m = number of queries, n = array length
- For each of m queries, we examine all n elements
- With constraints like n, m ≤ 10⁵, this becomes O(10¹⁰) operations — far too slow

The brute force fails because it doesn't leverage the fact that we're answering multiple queries about the same array. We're repeating work by scanning for the same values over and over.

## Optimized Approach

The key insight is to **preprocess** the array to quickly answer queries. Here's the step-by-step reasoning:

1. **Group indices by value**: Create a hash map where keys are array values and values are lists of indices where that value appears. This groups all occurrences of each value together.

2. **Handle circularity by duplicating**: For each value's index list, create an "extended" list by appending `index + n` for each original index. This transforms the circular problem into a linear one: searching in `[indices] + [i+n for i in indices]` lets us find the "next" occurrence even when wrapping around.

3. **Binary search for nearest neighbor**: For a query at index `q`, we need to find the closest occurrence in the sorted list of indices. Since each value's index list is sorted (we collected indices in order), we can use binary search:
   - Find the position where `q` would be inserted in the sorted list
   - Check the element just before and just after that position
   - Also check the corresponding elements in the "wrapped" portion
   - The minimum distance among these candidates is our answer

4. **Why this works**: In a sorted list of positions `[p1, p2, p3, ...]`, the closest position to `q` is either:
   - The largest position ≤ `q` (found via binary search)
   - The smallest position ≥ `q` (found via binary search)
   - For circular wrap-around: also check positions in the "next cycle" (by adding n)

This approach reduces the per-query time from O(n) to O(log k) where k is the number of occurrences of that value.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m log k) where n = len(nums), m = len(queries), k = avg occurrences per value
# Space: O(n) for storing indices by value
def solveClosestEqualQueries(nums, queries):
    n = len(nums)

    # Step 1: Group indices by value
    indices_by_value = {}
    for i, num in enumerate(nums):
        if num not in indices_by_value:
            indices_by_value[num] = []
        indices_by_value[num].append(i)

    result = []

    # Step 2: Process each query
    for q in queries:
        target_value = nums[q]
        indices = indices_by_value[target_value]

        # If this is the only occurrence of this value, distance is -1
        if len(indices) == 1:
            result.append(-1)
            continue

        # Step 3: Binary search to find closest occurrence
        # We need to find the position where q would be inserted
        left, right = 0, len(indices) - 1
        pos = -1

        # Binary search for insertion position
        while left <= right:
            mid = (left + right) // 2
            if indices[mid] == q:
                # Found exact match, need to skip this one
                pos = mid
                break
            elif indices[mid] < q:
                left = mid + 1
            else:
                right = mid - 1

        # If exact match not found during binary search, left is insertion point
        if pos == -1:
            pos = left

        # Step 4: Check neighbors in the sorted list
        min_dist = float('inf')

        # Check element before insertion point (if exists)
        if pos > 0:
            # Distance to previous occurrence
            dist = min(abs(indices[pos-1] - q), n - abs(indices[pos-1] - q))
            min_dist = min(min_dist, dist)

        # Check element at or after insertion point
        # We need to skip the element if it's exactly q (same index)
        check_pos = pos
        if check_pos < len(indices) and indices[check_pos] == q:
            check_pos += 1

        if check_pos < len(indices):
            # Distance to next occurrence
            dist = min(abs(indices[check_pos] - q), n - abs(indices[check_pos] - q))
            min_dist = min(min_dist, dist)

        # Step 5: Handle circular wrap-around by checking "next cycle"
        # For circular array, also check the first occurrence in the next cycle
        # This is equivalent to checking indices[0] + n
        if indices[0] != q:  # Skip if it's the same element
            dist_wrap = (indices[0] + n) - q
            min_dist = min(min_dist, dist_wrap)

        # Also check the last occurrence in the previous cycle
        # This is equivalent to checking indices[-1] - n
        if indices[-1] != q:  # Skip if it's the same element
            dist_wrap = q - (indices[-1] - n)
            min_dist = min(min_dist, dist_wrap)

        result.append(min_dist if min_dist != float('inf') else -1)

    return result
```

```javascript
// Time: O(n + m log k) where n = nums.length, m = queries.length, k = avg occurrences per value
// Space: O(n) for storing indices by value
function solveClosestEqualQueries(nums, queries) {
  const n = nums.length;

  // Step 1: Group indices by value
  const indicesByValue = new Map();
  for (let i = 0; i < n; i++) {
    const num = nums[i];
    if (!indicesByValue.has(num)) {
      indicesByValue.set(num, []);
    }
    indicesByValue.get(num).push(i);
  }

  const result = [];

  // Step 2: Process each query
  for (const q of queries) {
    const targetValue = nums[q];
    const indices = indicesByValue.get(targetValue);

    // If this is the only occurrence of this value, distance is -1
    if (indices.length === 1) {
      result.push(-1);
      continue;
    }

    // Step 3: Binary search to find closest occurrence
    let left = 0,
      right = indices.length - 1;
    let pos = -1;

    // Binary search for insertion position
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (indices[mid] === q) {
        pos = mid;
        break;
      } else if (indices[mid] < q) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // If exact match not found, left is insertion point
    if (pos === -1) {
      pos = left;
    }

    // Step 4: Check neighbors in the sorted list
    let minDist = Infinity;

    // Check element before insertion point
    if (pos > 0) {
      const dist = Math.min(Math.abs(indices[pos - 1] - q), n - Math.abs(indices[pos - 1] - q));
      minDist = Math.min(minDist, dist);
    }

    // Check element at or after insertion point
    let checkPos = pos;
    if (checkPos < indices.length && indices[checkPos] === q) {
      checkPos++;
    }

    if (checkPos < indices.length) {
      const dist = Math.min(Math.abs(indices[checkPos] - q), n - Math.abs(indices[checkPos] - q));
      minDist = Math.min(minDist, dist);
    }

    // Step 5: Handle circular wrap-around
    // Check first occurrence in next cycle
    if (indices[0] !== q) {
      const distWrap = indices[0] + n - q;
      minDist = Math.min(minDist, distWrap);
    }

    // Check last occurrence in previous cycle
    if (indices[indices.length - 1] !== q) {
      const distWrap = q - (indices[indices.length - 1] - n);
      minDist = Math.min(minDist, distWrap);
    }

    result.push(minDist !== Infinity ? minDist : -1);
  }

  return result;
}
```

```java
// Time: O(n + m log k) where n = nums.length, m = queries.length, k = avg occurrences per value
// Space: O(n) for storing indices by value
import java.util.*;

public class Solution {
    public int[] solveClosestEqualQueries(int[] nums, int[] queries) {
        int n = nums.length;

        // Step 1: Group indices by value
        Map<Integer, List<Integer>> indicesByValue = new HashMap<>();
        for (int i = 0; i < n; i++) {
            indicesByValue.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        int[] result = new int[queries.length];

        // Step 2: Process each query
        for (int idx = 0; idx < queries.length; idx++) {
            int q = queries[idx];
            int targetValue = nums[q];
            List<Integer> indices = indicesByValue.get(targetValue);

            // If this is the only occurrence of this value, distance is -1
            if (indices.size() == 1) {
                result[idx] = -1;
                continue;
            }

            // Step 3: Binary search to find closest occurrence
            int left = 0, right = indices.size() - 1;
            int pos = -1;

            // Binary search for insertion position
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (indices.get(mid) == q) {
                    pos = mid;
                    break;
                } else if (indices.get(mid) < q) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            // If exact match not found, left is insertion point
            if (pos == -1) {
                pos = left;
            }

            // Step 4: Check neighbors in the sorted list
            int minDist = Integer.MAX_VALUE;

            // Check element before insertion point
            if (pos > 0) {
                int dist = Math.min(
                    Math.abs(indices.get(pos - 1) - q),
                    n - Math.abs(indices.get(pos - 1) - q)
                );
                minDist = Math.min(minDist, dist);
            }

            // Check element at or after insertion point
            int checkPos = pos;
            if (checkPos < indices.size() && indices.get(checkPos) == q) {
                checkPos++;
            }

            if (checkPos < indices.size()) {
                int dist = Math.min(
                    Math.abs(indices.get(checkPos) - q),
                    n - Math.abs(indices.get(checkPos) - q)
                );
                minDist = Math.min(minDist, dist);
            }

            // Step 5: Handle circular wrap-around
            // Check first occurrence in next cycle
            if (indices.get(0) != q) {
                int distWrap = (indices.get(0) + n) - q;
                minDist = Math.min(minDist, distWrap);
            }

            // Check last occurrence in previous cycle
            if (indices.get(indices.size() - 1) != q) {
                int distWrap = q - (indices.get(indices.size() - 1) - n);
                minDist = Math.min(minDist, distWrap);
            }

            result[idx] = minDist != Integer.MAX_VALUE ? minDist : -1;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m log k)**

- `O(n)`: Building the hash map of indices by value requires one pass through the array
- `O(m log k)`: For each of m queries, we perform binary search on a list of size k (number of occurrences of that value)
- In the worst case where all elements are the same, k = n, so complexity becomes O(n + m log n)
- This is much better than brute force O(m × n)

**Space Complexity: O(n)**

- We store all indices in the hash map: each index appears exactly once
- The result array uses O(m) space, but this is output space and usually not counted
- Additional O(1) space for variables during binary search

## Common Mistakes

1. **Forgetting to handle the case where query index equals the found index**: When you find an occurrence at the same index as the query (which will happen since the query value appears at that index), you must skip it. The problem asks for distance to "any other index" with the same value.

2. **Incorrect circular distance calculation**: Simply taking `Math.abs(i - j)` doesn't work for circular arrays. The correct formula is `min(abs(i - j), n - abs(i - j))`. For example, in array of length 6, distance between index 0 and 5 is min(|0-5|=5, 6-5=1) = 1.

3. **Not checking wrap-around neighbors**: After binary search, candidates might be in the "next cycle" (wrapped around). For example, if query is at index 5 and occurrences are at [0, 3], the closest might be 0 (distance 1 via wrap-around), not 3 (distance 2).

4. **Assuming indices list is sorted**: While we collect indices in order, some implementations might not guarantee sorted order if using certain data structures. Always sort if needed, though linear traversal guarantees sorted order.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grouping by value then binary search**: Similar to:
   - LeetCode 981: "Time Based Key-Value Store" - store timestamps by key, binary search for closest time
   - LeetCode 352: "Data Stream as Disjoint Intervals" - maintain sorted intervals, binary search for insertion point

2. **Circular array distance problems**: Similar to:
   - LeetCode 189: "Rotate Array" - understanding circular shifts
   - LeetCode 503: "Next Greater Element II" - circular array, use duplication trick

3. **Nearest neighbor in sorted list**: The core binary search pattern appears in:
   - LeetCode 35: "Search Insert Position" - finding where to insert in sorted array
   - LeetCode 278: "First Bad Version" - binary search for boundary

## Key Takeaways

1. **When queries involve finding "closest" elements, pre-sort and use binary search**: Group elements by the property you're searching for (here, value), keep their indices sorted, then binary search for nearest neighbors.

2. **Circular problems often become linear with duplication**: The trick of appending `index + n` to handle wrap-around transforms a circular search into a linear one in an extended array.

3. **Hash maps + binary search is a powerful combo for multiple queries**: When answering many queries about the same data, preprocess into a structure that allows fast (log n) lookups per query rather than linear scans.

[Practice this problem on CodeJeet](/problem/closest-equal-element-queries)
