---
title: "How to Solve Length of Longest Fibonacci Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Length of Longest Fibonacci Subsequence. Medium difficulty, 57.5% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2026-02-22"
category: "dsa-patterns"
tags:
  [
    "length-of-longest-fibonacci-subsequence",
    "array",
    "hash-table",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Length of Longest Fibonacci Subsequence

This problem asks us to find the longest subsequence within a strictly increasing array that follows the Fibonacci property: each element (after the first two) equals the sum of the two preceding elements. What makes this tricky is that we're looking for a _subsequence_ (not necessarily contiguous), and we need to efficiently track potential Fibonacci chains across the entire array.

## Visual Walkthrough

Let's trace through `arr = [1, 2, 3, 4, 5, 6, 7, 8]`:

The longest Fibonacci-like subsequence here is `[1, 2, 3, 5, 8]` with length 5. How do we find this systematically?

Think of building Fibonacci sequences from pairs of starting numbers. For each pair `(arr[i], arr[j])` where `i < j`, we can check if their sum exists in the array. If it does, we can extend the sequence.

For example, starting with `(1, 2)`:

- `1 + 2 = 3` → exists, sequence becomes `(1, 2, 3)`
- `2 + 3 = 5` → exists, sequence becomes `(1, 2, 3, 5)`
- `3 + 5 = 8` → exists, sequence becomes `(1, 2, 3, 5, 8)`
- `5 + 8 = 13` → doesn't exist, stop

This gives us length 5. We need to check all possible starting pairs to find the maximum length.

## Brute Force Approach

A naive approach would be to generate all possible subsequences and check if they're Fibonacci-like. However, with `n` elements, there are `2^n` possible subsequences, making this exponential time.

A slightly better but still inefficient approach would be to try all pairs `(i, j)` as starting points and manually extend each sequence:

1. For each pair `(i, j)` where `i < j`
2. Initialize length = 2
3. While `arr[i] + arr[j]` exists in the array:
   - Update `i, j` to `j, k` where `arr[k] = arr[i] + arr[j]`
   - Increment length
4. Track maximum length

The problem is step 3 requires searching for the sum in the array. With linear search, this becomes O(n³) time (O(n²) pairs × O(n) search per extension). Even with binary search, it's O(n² log n), which is still too slow for typical constraints (n up to 1000).

## Optimized Approach

The key insight is that we can use dynamic programming with a hash map to track Fibonacci sequences efficiently. For any Fibonacci-like sequence ending with elements at indices `(i, j)`, we can look for the previous element that would complete the Fibonacci relation.

Let `dp[i][j]` represent the length of the longest Fibonacci-like subsequence ending with elements `arr[i]` and `arr[j]`. The recurrence relation is:

If there exists an index `k` such that `arr[k] + arr[i] = arr[j]` and `k < i`, then:

```
dp[i][j] = dp[k][i] + 1
```

Otherwise, `dp[i][j] = 2` (just the pair itself).

We need a hash map to quickly find `k` given `arr[k] = arr[j] - arr[i]`.

This approach works because:

1. The array is strictly increasing, so all values are unique
2. We build sequences from the bottom up, reusing previously computed lengths
3. We only consider valid sequences where the previous element exists in the array

## Optimal Solution

Here's the complete solution using dynamic programming with a hash map:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def lenLongestFibSubseq(arr):
    """
    Find the length of the longest Fibonacci-like subsequence in arr.

    Args:
        arr: List[int] - strictly increasing array of positive integers

    Returns:
        int - length of longest Fibonacci-like subsequence, or 0 if none exists
    """
    n = len(arr)
    if n < 3:
        return 0  # Need at least 3 elements for Fibonacci-like sequence

    # Create a value-to-index map for O(1) lookups
    index_map = {val: i for i, val in enumerate(arr)}

    # dp[i][j] = length of longest Fibonacci-like subsequence ending with arr[i], arr[j]
    # Initialize all pairs to length 2 (just the pair itself)
    dp = [[2] * n for _ in range(n)]

    max_length = 0

    # Iterate through all pairs (i, j) where i < j
    for j in range(n):
        for i in range(j):
            # We're looking for a previous element arr[k] such that:
            # arr[k] + arr[i] = arr[j]  =>  arr[k] = arr[j] - arr[i]
            prev_val = arr[j] - arr[i]

            # Check if prev_val exists in array and comes before i
            if prev_val in index_map:
                k = index_map[prev_val]
                if k < i:  # Valid sequence: k < i < j
                    # Extend the sequence ending at (k, i) by adding arr[j]
                    dp[i][j] = dp[k][i] + 1

                    # Update maximum length found so far
                    max_length = max(max_length, dp[i][j])

    # Return max_length if at least 3, otherwise 0
    return max_length if max_length >= 3 else 0
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function lenLongestFibSubseq(arr) {
  /**
   * Find the length of the longest Fibonacci-like subsequence in arr.
   *
   * @param {number[]} arr - strictly increasing array of positive integers
   * @return {number} - length of longest Fibonacci-like subsequence, or 0 if none exists
   */
  const n = arr.length;
  if (n < 3) {
    return 0; // Need at least 3 elements for Fibonacci-like sequence
  }

  // Create a value-to-index map for O(1) lookups
  const indexMap = new Map();
  for (let i = 0; i < n; i++) {
    indexMap.set(arr[i], i);
  }

  // dp[i][j] = length of longest Fibonacci-like subsequence ending with arr[i], arr[j]
  // Initialize all pairs to length 2 (just the pair itself)
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(2));

  let maxLength = 0;

  // Iterate through all pairs (i, j) where i < j
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < j; i++) {
      // We're looking for a previous element arr[k] such that:
      // arr[k] + arr[i] = arr[j]  =>  arr[k] = arr[j] - arr[i]
      const prevVal = arr[j] - arr[i];

      // Check if prevVal exists in array and comes before i
      if (indexMap.has(prevVal)) {
        const k = indexMap.get(prevVal);
        if (k < i) {
          // Valid sequence: k < i < j
          // Extend the sequence ending at (k, i) by adding arr[j]
          dp[i][j] = dp[k][i] + 1;

          // Update maximum length found so far
          maxLength = Math.max(maxLength, dp[i][j]);
        }
      }
    }
  }

  // Return maxLength if at least 3, otherwise 0
  return maxLength >= 3 ? maxLength : 0;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int lenLongestFibSubseq(int[] arr) {
        /**
         * Find the length of the longest Fibonacci-like subsequence in arr.
         *
         * @param arr - strictly increasing array of positive integers
         * @return length of longest Fibonacci-like subsequence, or 0 if none exists
         */
        int n = arr.length;
        if (n < 3) {
            return 0;  // Need at least 3 elements for Fibonacci-like sequence
        }

        // Create a value-to-index map for O(1) lookups
        Map<Integer, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            indexMap.put(arr[i], i);
        }

        // dp[i][j] = length of longest Fibonacci-like subsequence ending with arr[i], arr[j]
        // Initialize all pairs to length 2 (just the pair itself)
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dp[i][j] = 2;
            }
        }

        int maxLength = 0;

        // Iterate through all pairs (i, j) where i < j
        for (int j = 0; j < n; j++) {
            for (int i = 0; i < j; i++) {
                // We're looking for a previous element arr[k] such that:
                // arr[k] + arr[i] = arr[j]  =>  arr[k] = arr[j] - arr[i]
                int prevVal = arr[j] - arr[i];

                // Check if prevVal exists in array and comes before i
                if (indexMap.containsKey(prevVal)) {
                    int k = indexMap.get(prevVal);
                    if (k < i) {  // Valid sequence: k < i < j
                        // Extend the sequence ending at (k, i) by adding arr[j]
                        dp[i][j] = dp[k][i] + 1;

                        // Update maximum length found so far
                        maxLength = Math.max(maxLength, dp[i][j]);
                    }
                }
            }
        }

        // Return maxLength if at least 3, otherwise 0
        return maxLength >= 3 ? maxLength : 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have nested loops iterating through all pairs `(i, j)` where `i < j`, which gives us O(n²) iterations
- Inside the inner loop, we perform O(1) operations (hash map lookup and array access)
- Total: O(n²)

**Space Complexity:** O(n²)

- The DP table `dp` is n × n, taking O(n²) space
- The hash map takes O(n) space
- Total: O(n²) dominated by the DP table

## Common Mistakes

1. **Forgetting to check `k < i`**: This is crucial! We need to ensure the sequence maintains the correct order. If we only check that `prev_val` exists somewhere in the array, we might create invalid sequences where the indices don't follow the proper order.

2. **Returning 2 instead of 0 for no valid sequence**: The problem requires returning 0 when no Fibonacci-like subsequence of length ≥ 3 exists. Some candidates forget this and return the maximum found (which could be 2).

3. **Using binary search instead of hash map**: While binary search gives O(n² log n) which might pass, the hash map gives cleaner O(1) lookups. More importantly, candidates might forget that the array is strictly increasing (all values unique), making hash maps perfectly suitable.

4. **Incorrect DP initialization**: All `dp[i][j]` should be initialized to 2, not 0 or 1, because any valid pair forms a sequence of length 2. Starting from 0 or 1 would undercount the length.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sequence DP with two indices**: Similar to problems like "Longest Increasing Subsequence" (LIS), but here we track sequences with the last two elements instead of just the last one. Other problems using this pattern:
   - [Longest Arithmetic Subsequence](/problems/longest-arithmetic-subsequence) - tracks difference instead of sum
   - [Longest String Chain](/problems/longest-string-chain) - builds chains based on predecessor relationships

2. **Hash map for reverse lookup**: When you need to find if a computed value exists in the original array, a hash map provides O(1) lookups. This pattern appears in:
   - [Two Sum](/problems/two-sum) - finding complement values
   - [4Sum II](/problems/4sum-ii) - storing intermediate sums

## Key Takeaways

1. **For subsequence problems with pairwise relationships**, consider DP states that track the last two elements rather than just the last one. This gives you enough information to extend the sequence.

2. **When working with strictly increasing arrays with unique values**, hash maps are your friend for O(1) value-to-index lookups. This often turns O(n) searches into O(1) operations.

3. **Always validate index ordering** when building sequences from non-contiguous elements. The condition `k < i < j` ensures temporal consistency in the subsequence.

Related problems: [Fibonacci Number](/problem/fibonacci-number)
