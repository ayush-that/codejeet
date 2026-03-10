---
title: "How to Solve Minimum Absolute Difference Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Absolute Difference Queries. Medium difficulty, 45.7% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-03-09"
category: "dsa-patterns"
tags: ["minimum-absolute-difference-queries", "array", "prefix-sum", "medium"]
---

# How to Solve Minimum Absolute Difference Queries

This problem asks us to answer multiple queries about the minimum absolute difference between elements in subarrays of a given array. For each query `[l, r]`, we need to find the smallest difference between any two distinct elements in `nums[l:r+1]`, returning `-1` if all elements are identical. What makes this problem interesting is that we need to answer many queries efficiently—a brute force approach checking all pairs for each query would be far too slow.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider:

- `nums = [1, 3, 4, 8]`
- Queries: `[[0,1], [0,2], [0,3]]`

**Query 1: [0,1]**  
Subarray: `[1, 3]`  
Differences: `|1-3| = 2`  
Minimum: `2`

**Query 2: [0,2]**  
Subarray: `[1, 3, 4]`  
Differences: `|1-3|=2`, `|1-4|=3`, `|3-4|=1`  
Minimum: `1`

**Query 3: [0,3]**  
Subarray: `[1, 3, 4, 8]`  
Differences: `|1-3|=2`, `|1-4|=3`, `|1-8|=7`, `|3-4|=1`, `|3-8|=5`, `|4-8|=4`  
Minimum: `1`

The key observation: The minimum absolute difference comes from the closest numbers in the sorted version of the subarray. For `[1, 3, 4, 8]`, when sorted we get `[1, 3, 4, 8]`, and the smallest gap is between `3` and `4` (difference 1).

But here's the challenge: We can't sort each subarray for every query—that would be too slow. We need a way to quickly determine which values exist in a subarray and find the smallest gap between consecutive existing values.

## Brute Force Approach

The most straightforward approach is to process each query independently:

1. Extract the subarray `nums[l:r+1]`
2. Sort it
3. Find the minimum difference between consecutive elements
4. Return `-1` if all elements are equal

<div class="code-group">

```python
# Time: O(q * n log n) | Space: O(n)
def minDifferenceBrute(nums, queries):
    result = []
    for l, r in queries:
        # Extract and sort the subarray
        subarray = sorted(nums[l:r+1])

        # Find minimum difference
        min_diff = float('inf')
        for i in range(1, len(subarray)):
            diff = subarray[i] - subarray[i-1]
            if diff < min_diff:
                min_diff = diff

        # Handle case where all elements are the same
        if min_diff == float('inf'):
            result.append(-1)
        else:
            result.append(min_diff)

    return result
```

```javascript
// Time: O(q * n log n) | Space: O(n)
function minDifferenceBrute(nums, queries) {
  const result = [];

  for (const [l, r] of queries) {
    // Extract and sort the subarray
    const subarray = nums.slice(l, r + 1).sort((a, b) => a - b);

    // Find minimum difference
    let minDiff = Infinity;
    for (let i = 1; i < subarray.length; i++) {
      const diff = subarray[i] - subarray[i - 1];
      if (diff < minDiff) {
        minDiff = diff;
      }
    }

    // Handle case where all elements are the same
    result.push(minDiff === Infinity ? -1 : minDiff);
  }

  return result;
}
```

```java
// Time: O(q * n log n) | Space: O(n)
public int[] minDifferenceBrute(int[] nums, int[][] queries) {
    int[] result = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int l = queries[q][0];
        int r = queries[q][1];

        // Extract the subarray
        int length = r - l + 1;
        int[] subarray = new int[length];
        System.arraycopy(nums, l, subarray, 0, length);

        // Sort the subarray
        Arrays.sort(subarray);

        // Find minimum difference
        int minDiff = Integer.MAX_VALUE;
        for (int i = 1; i < subarray.length; i++) {
            int diff = subarray[i] - subarray[i - 1];
            if (diff < minDiff) {
                minDiff = diff;
            }
        }

        // Handle case where all elements are the same
        result[q] = (minDiff == Integer.MAX_VALUE) ? -1 : minDiff;
    }

    return result;
}
```

</div>

**Why this is too slow:**  
If we have `n` elements and `q` queries, each query could process up to `n` elements. Sorting takes `O(n log n)` per query, leading to `O(q * n log n)` total time. With constraints where `n` and `q` can be up to `10^5`, this becomes `10^10` operations—far too slow.

## Optimized Approach

The key insight is that we need to know which values exist in a subarray without sorting it each time. Here's the step-by-step reasoning:

1. **Observation**: The minimum absolute difference comes from the closest numbers in the sorted version of the subarray. We don't need the actual sorted array—we just need to know which values from 1 to 100 (the problem constraints) exist in the subarray.

2. **Constraint advantage**: The problem states `1 <= nums[i] <= 100`. This small range is crucial—it means we can track counts efficiently.

3. **Prefix sums of counts**: For each possible value (1 to 100), we can maintain a prefix sum array that tells us how many times that value appears up to each position. Then for any query `[l, r]`, we can quickly determine if a value exists in that range by checking if `count[r+1] - count[l] > 0`.

4. **Finding the minimum gap**: Once we know which values exist in a subarray, we can iterate through values 1 to 100, keeping track of the last value that existed. The minimum difference is the smallest gap between consecutive existing values.

5. **Efficiency**: Building the prefix sums takes `O(n * 100)` time. Each query then takes `O(100)` time to check which values exist and find the minimum gap. This is much faster than the brute force approach.

## Optimal Solution

Here's the complete implementation using prefix sums of value counts:

<div class="code-group">

```python
# Time: O((n + q) * 100) | Space: O(n * 100)
def minDifference(nums, queries):
    n = len(nums)
    # prefix_counts[i][v] = count of value v in nums[0:i]
    # We use size 101 because values are 1-100 inclusive
    prefix_counts = [[0] * 101 for _ in range(n + 1)]

    # Build prefix counts: O(n * 100)
    for i in range(1, n + 1):
        # Copy previous counts
        for v in range(1, 101):
            prefix_counts[i][v] = prefix_counts[i-1][v]
        # Increment count for current value
        prefix_counts[i][nums[i-1]] += 1

    result = []

    # Process each query: O(q * 100)
    for l, r in queries:
        # Track the last value we saw that exists in this range
        last_val = -1
        min_diff = float('inf')

        # Check each possible value from 1 to 100
        for v in range(1, 101):
            # Count of value v in range [l, r]
            count_in_range = prefix_counts[r+1][v] - prefix_counts[l][v]

            if count_in_range > 0:  # Value v exists in the range
                if last_val != -1:
                    # Calculate difference with last existing value
                    diff = v - last_val
                    if diff < min_diff:
                        min_diff = diff
                # Update last value to current
                last_val = v

        # If min_diff wasn't updated, all elements are the same
        if min_diff == float('inf'):
            result.append(-1)
        else:
            result.append(min_diff)

    return result
```

```javascript
// Time: O((n + q) * 100) | Space: O(n * 100)
function minDifference(nums, queries) {
  const n = nums.length;
  // prefixCounts[i][v] = count of value v in nums[0:i]
  // We use size 101 because values are 1-100 inclusive
  const prefixCounts = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    prefixCounts[i] = new Array(101).fill(0);
  }

  // Build prefix counts: O(n * 100)
  for (let i = 1; i <= n; i++) {
    // Copy previous counts
    for (let v = 1; v <= 100; v++) {
      prefixCounts[i][v] = prefixCounts[i - 1][v];
    }
    // Increment count for current value
    prefixCounts[i][nums[i - 1]]++;
  }

  const result = [];

  // Process each query: O(q * 100)
  for (const [l, r] of queries) {
    let lastVal = -1;
    let minDiff = Infinity;

    // Check each possible value from 1 to 100
    for (let v = 1; v <= 100; v++) {
      // Count of value v in range [l, r]
      const countInRange = prefixCounts[r + 1][v] - prefixCounts[l][v];

      if (countInRange > 0) {
        // Value v exists in the range
        if (lastVal !== -1) {
          // Calculate difference with last existing value
          const diff = v - lastVal;
          if (diff < minDiff) {
            minDiff = diff;
          }
        }
        // Update last value to current
        lastVal = v;
      }
    }

    // If minDiff wasn't updated, all elements are the same
    result.push(minDiff === Infinity ? -1 : minDiff);
  }

  return result;
}
```

```java
// Time: O((n + q) * 100) | Space: O(n * 100)
public int[] minDifference(int[] nums, int[][] queries) {
    int n = nums.length;
    // prefixCounts[i][v] = count of value v in nums[0:i]
    // We use size 101 because values are 1-100 inclusive
    int[][] prefixCounts = new int[n + 1][101];

    // Build prefix counts: O(n * 100)
    for (int i = 1; i <= n; i++) {
        // Copy previous counts
        System.arraycopy(prefixCounts[i - 1], 0, prefixCounts[i], 0, 101);
        // Increment count for current value
        prefixCounts[i][nums[i - 1]]++;
    }

    int[] result = new int[queries.length];

    // Process each query: O(q * 100)
    for (int q = 0; q < queries.length; q++) {
        int l = queries[q][0];
        int r = queries[q][1];

        int lastVal = -1;
        int minDiff = Integer.MAX_VALUE;

        // Check each possible value from 1 to 100
        for (int v = 1; v <= 100; v++) {
            // Count of value v in range [l, r]
            int countInRange = prefixCounts[r + 1][v] - prefixCounts[l][v];

            if (countInRange > 0) {  // Value v exists in the range
                if (lastVal != -1) {
                    // Calculate difference with last existing value
                    int diff = v - lastVal;
                    if (diff < minDiff) {
                        minDiff = diff;
                    }
                }
                // Update last value to current
                lastVal = v;
            }
        }

        // If minDiff wasn't updated, all elements are the same
        result[q] = (minDiff == Integer.MAX_VALUE) ? -1 : minDiff;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O((n + q) * 100)`

- Building the prefix counts: `O(n * 100)` — for each of `n` positions, we update counts for 100 possible values
- Processing queries: `O(q * 100)` — for each of `q` queries, we check 100 possible values
- Since 100 is a constant, this simplifies to `O(n + q)`

**Space Complexity:** `O(n * 100)`

- We store a 2D array of size `(n+1) × 101` for prefix counts
- This simplifies to `O(n)` since 100 is constant

## Common Mistakes

1. **Forgetting the value range constraint**: Some candidates try to use sorting or more complex data structures without noticing that `nums[i] <= 100`. This constraint is what makes the prefix sum approach efficient.

2. **Off-by-one errors in prefix sums**: When calculating `count_in_range = prefix_counts[r+1][v] - prefix_counts[l][v]`, it's easy to use `r` instead of `r+1`. Remember: `prefix_counts[i]` represents counts up to index `i-1` in the original array.

3. **Not handling the "all elements same" case**: If `min_diff` remains at its initial value (Infinity or MAX_VALUE), we need to return `-1`. Forgetting this edge case will fail test cases like `nums = [5,5,5]`, `queries = [[0,2]]`.

4. **Inefficient copying in prefix sum construction**: In the Python/JavaScript versions, copying the entire previous row for each position is `O(100)` per element. While acceptable here, in languages without vectorized operations, be mindful of this overhead.

## When You'll See This Pattern

This "prefix sums of counts" pattern appears in several other problems:

1. **Range Sum Query - Immutable (LeetCode 303)**: Uses prefix sums to answer sum queries in O(1) time. The core idea of precomputing cumulative information is the same.

2. **Count of Range Sum (LeetCode 327)**: A more advanced version where prefix sums help answer range queries about sums falling within a certain range.

3. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps to find subarrays summing to a target value.

4. **Find All Anagrams in a String (LeetCode 438)**: Uses sliding window with character counts, similar to how we track value counts in ranges.

The common thread is answering multiple range queries efficiently by precomputing some form of cumulative information.

## Key Takeaways

1. **Look for small value ranges**: When values are constrained to a small range (like 1-100 here), consider using array-based counting instead of sorting or more complex data structures.

2. **Prefix sums generalize beyond sums**: You can maintain prefix counts, prefix frequencies, or any other cumulative information that helps answer range queries quickly.

3. **Trade space for query time**: By storing `O(n * K)` prefix information (where K is the value range), we can answer each query in `O(K)` time instead of `O(n log n)`.

[Practice this problem on CodeJeet](/problem/minimum-absolute-difference-queries)
