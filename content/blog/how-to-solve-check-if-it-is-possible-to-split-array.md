---
title: "How to Solve Check if it is Possible to Split Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if it is Possible to Split Array. Medium difficulty, 34.4% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2029-03-07"
category: "dsa-patterns"
tags: ["check-if-it-is-possible-to-split-array", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve "Check if it is Possible to Split Array"

This problem asks whether we can repeatedly split an array into smaller arrays until we reach arrays of size 1, with a key constraint: at each split, the sum of the elements in the subarray being split must be at least `m`. The challenge lies in determining if there exists _any_ valid sequence of splits that leads to all size-1 arrays, given that we can split at any position where the sum condition is satisfied.

What makes this problem interesting is that it appears to require exploring all possible split sequences, which suggests exponential complexity. However, with the right insight, we can solve it efficiently using dynamic programming or even a greedy approach.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 2, 1]` with `m = 4`.

**Initial array:** `[2, 2, 1]` (sum = 5 ≥ 4, so we can split it)

We need to check if there's any valid split point:

1. **Try splitting between indices 0 and 1:**
   - Left subarray: `[2]` (size 1, always valid)
   - Right subarray: `[2, 1]` (sum = 3 < 4, cannot be split further)
   - This path fails because `[2, 1]` cannot be split.

2. **Try splitting between indices 1 and 2:**
   - Left subarray: `[2, 2]` (sum = 4 ≥ 4, can be split further)
   - Right subarray: `[1]` (size 1, always valid)

   Now we need to check if `[2, 2]` can be split:
   - Only possible split is between the two 2's
   - Both resulting subarrays are `[2]` (size 1, valid)

   This path succeeds! So the answer is `true`.

The key insight: a subarray `nums[i:j+1]` can be successfully split into single elements if there exists _some_ split point `k` (where `i ≤ k < j`) such that:

1. The sum of `nums[i:k+1]` ≥ `m` OR the left part has size 1
2. The sum of `nums[k+1:j+1]` ≥ `m` OR the right part has size 1
3. Both left and right subarrays can themselves be successfully split

## Brute Force Approach

A naive solution would explore all possible split sequences recursively. For each subarray, we try every possible split point, check the sum condition, and recursively check if both halves can be split. This leads to exponential time complexity.

The brute force would look like this in pseudocode:

```
function canSplit(i, j):
    if j - i == 0: return true  # Single element

    for k from i to j-1:
        left_sum = sum(nums[i:k+1])
        right_sum = sum(nums[k+1:j+1])

        if (left_sum >= m OR k-i == 0) AND
           (right_sum >= m OR j-k-1 == 0):
            if canSplit(i, k) AND canSplit(k+1, j):
                return true

    return false
```

**Why this is too slow:**

- For an array of length `n`, there are `n-1` possible first splits
- Each split creates two subproblems
- The total number of possible split sequences is the Catalan number `C(n-1)`, which grows exponentially
- Additionally, computing sums repeatedly is inefficient

Time complexity: O(n × 2^n) in worst case  
Space complexity: O(n) for recursion depth

## Optimized Approach

We can optimize using **dynamic programming with prefix sums**:

1. **Prefix sums:** Precompute prefix sums so we can get any subarray sum in O(1) time
2. **DP definition:** Let `dp[i][j]` represent whether subarray `nums[i:j+1]` can be split into single elements
3. **Base case:** `dp[i][i] = true` for all `i` (single elements are always valid)
4. **Transition:** For subarray from `i` to `j`, we check all possible split points `k`:
   - If `sum(nums[i:k+1]) ≥ m` OR `k == i` (left is single element)
   - AND `sum(nums[k+1:j+1]) ≥ m` OR `k+1 == j` (right is single element)
   - AND `dp[i][k]` AND `dp[k+1][j]` are both true
   - Then `dp[i][j] = true`

5. **Answer:** `dp[0][n-1]`

**Key optimization:** We only need to check if there exists _any_ valid split point, not all of them.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^2)
# We can optimize to O(n^2) with careful implementation, but O(n^3) is acceptable for n ≤ 100
def canSplitArray(nums, m):
    n = len(nums)

    # Edge case: if array has 1 or 2 elements, it's always possible
    if n <= 2:
        return True

    # Compute prefix sums for O(1) subarray sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Helper function to get sum of subarray nums[i:j+1]
    def get_sum(i, j):
        return prefix[j + 1] - prefix[i]

    # DP table: dp[i][j] = True if subarray nums[i:j+1] can be split
    dp = [[False] * n for _ in range(n)]

    # Base case: single elements are always valid
    for i in range(n):
        dp[i][i] = True

    # Fill DP table for increasing subarray lengths
    for length in range(2, n + 1):  # length of subarray
        for i in range(n - length + 1):
            j = i + length - 1

            # For subarray nums[i:j+1], try all split points
            for k in range(i, j):
                # Check if left part can be the first split
                left_valid = (k == i) or (get_sum(i, k) >= m)
                # Check if right part can be the first split
                right_valid = (k + 1 == j) or (get_sum(k + 1, j) >= m)

                # If both parts are valid for splitting AND
                # both subarrays can themselves be split
                if left_valid and right_valid and dp[i][k] and dp[k + 1][j]:
                    dp[i][j] = True
                    break  # Found a valid split, no need to check others

    return dp[0][n - 1]
```

```javascript
// Time: O(n^3) | Space: O(n^2)
function canSplitArray(nums, m) {
  const n = nums.length;

  // Edge case: if array has 1 or 2 elements, it's always possible
  if (n <= 2) return true;

  // Compute prefix sums for O(1) subarray sum queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Helper function to get sum of subarray nums[i:j+1]
  const getSum = (i, j) => prefix[j + 1] - prefix[i];

  // DP table: dp[i][j] = true if subarray nums[i:j+1] can be split
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));

  // Base case: single elements are always valid
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // Fill DP table for increasing subarray lengths
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;

      // For subarray nums[i:j+1], try all split points
      for (let k = i; k < j; k++) {
        // Check if left part can be the first split
        const leftValid = k === i || getSum(i, k) >= m;
        // Check if right part can be the first split
        const rightValid = k + 1 === j || getSum(k + 1, j) >= m;

        // If both parts are valid for splitting AND
        // both subarrays can themselves be split
        if (leftValid && rightValid && dp[i][k] && dp[k + 1][j]) {
          dp[i][j] = true;
          break; // Found a valid split, no need to check others
        }
      }
    }
  }

  return dp[0][n - 1];
}
```

```java
// Time: O(n^3) | Space: O(n^2)
class Solution {
    public boolean canSplitArray(List<Integer> nums, int m) {
        int n = nums.size();

        // Edge case: if array has 1 or 2 elements, it's always possible
        if (n <= 2) return true;

        // Compute prefix sums for O(1) subarray sum queries
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums.get(i);
        }

        // Helper function to get sum of subarray nums[i:j+1]
        // Using a method for cleaner code
        // dp[i][j] = true if subarray nums[i:j+1] can be split
        boolean[][] dp = new boolean[n][n];

        // Base case: single elements are always valid
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }

        // Fill DP table for increasing subarray lengths
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;

                // For subarray nums[i:j+1], try all split points
                for (int k = i; k < j; k++) {
                    // Check if left part can be the first split
                    int leftSum = prefix[k + 1] - prefix[i];
                    boolean leftValid = (k == i) || (leftSum >= m);

                    // Check if right part can be the first split
                    int rightSum = prefix[j + 1] - prefix[k + 1];
                    boolean rightValid = (k + 1 == j) || (rightSum >= m);

                    // If both parts are valid for splitting AND
                    // both subarrays can themselves be split
                    if (leftValid && rightValid && dp[i][k] && dp[k + 1][j]) {
                        dp[i][j] = true;
                        break; // Found a valid split, no need to check others
                    }
                }
            }
        }

        return dp[0][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³)

- We have three nested loops:
  1. Outer loop over subarray lengths: O(n)
  2. Middle loop over starting indices: O(n)
  3. Inner loop over split points: O(n)
- Total: O(n × n × n) = O(n³)
- For each subarray, we compute sums in O(1) using prefix sums

**Space Complexity:** O(n²)

- We store the DP table of size n × n
- We also store prefix sums of size n+1
- Total: O(n² + n) = O(n²)

**Optimization Note:** This can be optimized to O(n²) by noticing that we only need to check if there exists _any_ element in the array (except first and last) that can serve as a split point. However, the O(n³) DP solution is more intuitive and acceptable for typical constraints.

## Common Mistakes

1. **Forgetting the "size 1" exception:** The condition says a subarray can be split if EITHER its sum ≥ m OR its size is 1. Candidates often miss the "size 1" case, causing incorrect rejection of valid splits.

2. **Not using memoization/DP for overlapping subproblems:** Trying to solve recursively without memoization leads to exponential time. Always look for overlapping subproblems in split/partition problems.

3. **Incorrect base cases:** The base case should be `dp[i][i] = true` for all single elements. Some candidates incorrectly set base cases only for adjacent pairs.

4. **Inefficient sum computation:** Computing subarray sums from scratch for each check leads to O(n⁴) time. Always use prefix sums for O(1) sum queries.

## When You'll See This Pattern

This problem uses **interval DP**, a common pattern for problems involving splitting/partitioning sequences. Similar problems include:

1. **Palindrome Partitioning II (LeetCode 132):** Determine the minimum cuts needed to partition a string into palindromes. Uses similar DP where `dp[i][j]` tracks if substring `s[i:j+1]` is a palindrome.

2. **Burst Balloons (LeetCode 312):** Find maximum coins by bursting balloons in optimal order. Uses DP where `dp[i][j]` represents max coins from bursting balloons `i` to `j`.

3. **Stone Game (LeetCode 877):** Determine if first player can win a stone picking game. Uses DP where `dp[i][j]` represents best score difference for piles `i` to `j`.

The key pattern: when you need to consider all possible ways to split/partition a sequence and the result depends on optimal splits of subparts, think interval DP.

## Key Takeaways

1. **Interval DP is for sequence partitioning:** When a problem involves splitting an array/string into parts where the solution for the whole depends on solutions for the parts, consider interval DP with `dp[i][j]` representing the result for the subarray from `i` to `j`.

2. **Prefix sums enable efficient range queries:** For problems involving subarray sums, always precompute prefix sums to get O(1) sum queries instead of O(n).

3. **Look for the "one valid path" optimization:** In this problem, we only need to find if there exists _any_ valid split sequence, not count them all. This allows early termination with `break` once a valid split is found.

[Practice this problem on CodeJeet](/problem/check-if-it-is-possible-to-split-array)
