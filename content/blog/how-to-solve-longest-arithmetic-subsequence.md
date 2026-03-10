---
title: "How to Solve Longest Arithmetic Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Arithmetic Subsequence. Medium difficulty, 49.9% acceptance rate. Topics: Array, Hash Table, Binary Search, Dynamic Programming."
date: "2028-08-31"
category: "dsa-patterns"
tags: ["longest-arithmetic-subsequence", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Longest Arithmetic Subsequence

This problem asks us to find the length of the longest arithmetic subsequence in an array of integers. An arithmetic subsequence is one where the difference between consecutive elements is constant. The challenge lies in the fact that we're looking for subsequences (not subarrays), meaning elements don't need to be contiguous, but they must maintain their original order. This makes it a classic dynamic programming problem where we need to track both ending positions and differences.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [3, 6, 9, 12, 7, 10]`

We want to find the longest subsequence where the difference between consecutive elements is constant. Let's think about how we might build this:

1. Start with the first element `3`
2. Look at `6`: difference is `3`. We have subsequence `[3, 6]` with length 2
3. Look at `9`:
   - From `3`: difference is `6` → `[3, 9]` length 2
   - From `6`: difference is `3` → `[3, 6, 9]` length 3 (continuing the difference 3 from before)
4. Look at `12`:
   - From `3`: difference is `9` → `[3, 12]` length 2
   - From `6`: difference is `6` → `[3, 6, 12]` length 3
   - From `9`: difference is `3` → `[3, 6, 9, 12]` length 4
5. Look at `7`:
   - From `3`: difference is `4` → `[3, 7]` length 2
   - From `6`: difference is `1` → `[6, 7]` length 2
   - From `9`: difference is `-2` → `[9, 7]` length 2
   - From `12`: difference is `-5` → `[12, 7]` length 2
6. Look at `10`:
   - From `3`: difference is `7` → `[3, 10]` length 2
   - From `6`: difference is `4` → `[6, 10]` length 2
   - From `9`: difference is `1` → `[9, 10]` length 2
   - From `12`: difference is `-2` → `[12, 10]` length 2
   - From `7`: difference is `3` → `[7, 10]` length 2, but wait! `7` came from earlier elements...

The key insight is that when we reach `10`, we should check if there was a previous element that could form an arithmetic sequence ending at `7` with difference `3`. Indeed, `[3, 6, 9, 12]` has difference 3, and `7` doesn't continue it. But `10` with difference 3 from `7` gives us `[3, 6, 9, 12]` doesn't help, but `[7, 10]` is length 2.

Actually, let's trace more carefully. The longest arithmetic subsequence here is `[3, 6, 9, 12]` with length 4 and difference 3.

## Brute Force Approach

The brute force approach would be to generate all possible subsequences (2^n possibilities) and check which ones are arithmetic, keeping track of the longest. This is clearly infeasible for any reasonable input size (n up to 1000 in the problem constraints).

A slightly better but still inefficient brute force would be to consider every pair of indices (i, j) where i < j, use their difference as the potential common difference, and then try to extend the subsequence. For each pair (i, j), we would look for subsequent elements that maintain the difference. This would be O(n³) in the worst case, which is still too slow for n = 1000.

The problem with the brute force is that it doesn't reuse computation. If we find that elements at positions 2, 5, and 8 form an arithmetic sequence with difference d, we shouldn't have to rediscover this fact multiple times.

## Optimized Approach

The key insight is that we can use dynamic programming where `dp[i][diff]` represents the length of the longest arithmetic subsequence ending at index `i` with common difference `diff`. However, since `diff` can be large (up to ±500 based on constraints), we need an efficient way to store this.

A better approach: For each index `i`, we look at all previous indices `j` (where j < i). The difference is `diff = nums[i] - nums[j]`. The length of the arithmetic subsequence ending at `i` with difference `diff` would be `1 + length of subsequence ending at j with difference diff`. If we haven't seen this difference ending at `j` before, the length is 2 (just `nums[j]` and `nums[i]`).

We need a data structure that can quickly look up "what's the length of the longest arithmetic subsequence ending at position j with difference d?" A dictionary/hash map at each position works well.

## Optimal Solution

The optimal solution uses dynamic programming with an array of dictionaries. At each position `i`, we store a dictionary where keys are differences and values are lengths of arithmetic subsequences ending at `i` with that difference. We iterate through all pairs (j, i) with j < i, calculate the difference, and update our dictionaries.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) in worst case
def longestArithSeqLength(nums):
    """
    Find the length of the longest arithmetic subsequence in nums.

    Approach: Dynamic programming where dp[i] is a dictionary
    mapping differences to the length of the longest arithmetic
    subsequence ending at index i with that difference.
    """
    n = len(nums)
    if n <= 2:
        return n  # Any 2 elements form an arithmetic sequence

    # dp[i] will be a dictionary: {difference: length}
    dp = [{} for _ in range(n)]
    max_length = 2  # Minimum possible for arithmetic sequence

    # Iterate through all elements
    for i in range(n):
        # Compare with all previous elements
        for j in range(i):
            diff = nums[i] - nums[j]

            # Check if we've seen this difference ending at j
            if diff in dp[j]:
                # Continue the existing sequence
                dp[i][diff] = dp[j][diff] + 1
            else:
                # Start a new sequence of length 2
                dp[i][diff] = 2

            # Update global maximum
            max_length = max(max_length, dp[i][diff])

    return max_length
```

```javascript
// Time: O(n²) | Space: O(n²) in worst case
function longestArithSeqLength(nums) {
  /**
   * Find the length of the longest arithmetic subsequence in nums.
   *
   * Approach: Dynamic programming where dp[i] is a Map/object
   * mapping differences to the length of the longest arithmetic
   * subsequence ending at index i with that difference.
   */
  const n = nums.length;
  if (n <= 2) {
    return n; // Any 2 elements form an arithmetic sequence
  }

  // dp[i] will be a Map: difference -> length
  const dp = new Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = new Map();
  }

  let maxLength = 2; // Minimum possible for arithmetic sequence

  // Iterate through all elements
  for (let i = 0; i < n; i++) {
    // Compare with all previous elements
    for (let j = 0; j < i; j++) {
      const diff = nums[i] - nums[j];

      // Check if we've seen this difference ending at j
      const prevLength = dp[j].get(diff);
      if (prevLength !== undefined) {
        // Continue the existing sequence
        dp[i].set(diff, prevLength + 1);
      } else {
        // Start a new sequence of length 2
        dp[i].set(diff, 2);
      }

      // Update global maximum
      maxLength = Math.max(maxLength, dp[i].get(diff));
    }
  }

  return maxLength;
}
```

```java
// Time: O(n²) | Space: O(n²) in worst case
class Solution {
    public int longestArithSeqLength(int[] nums) {
        /**
         * Find the length of the longest arithmetic subsequence in nums.
         *
         * Approach: Dynamic programming where dp[i] is a HashMap
         * mapping differences to the length of the longest arithmetic
         * subsequence ending at index i with that difference.
         */
        int n = nums.length;
        if (n <= 2) {
            return n;  // Any 2 elements form an arithmetic sequence
        }

        // dp[i] will be a HashMap: difference -> length
        HashMap<Integer, Integer>[] dp = new HashMap[n];
        for (int i = 0; i < n; i++) {
            dp[i] = new HashMap<>();
        }

        int maxLength = 2;  // Minimum possible for arithmetic sequence

        // Iterate through all elements
        for (int i = 0; i < n; i++) {
            // Compare with all previous elements
            for (int j = 0; j < i; j++) {
                int diff = nums[i] - nums[j];

                // Check if we've seen this difference ending at j
                int prevLength = dp[j].getOrDefault(diff, 0);

                // If prevLength is 0, we start a new sequence of length 2
                // Otherwise, we continue the existing sequence
                dp[i].put(diff, prevLength + 1);

                // Update global maximum
                maxLength = Math.max(maxLength, dp[i].get(diff));
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the length of `nums`. We have nested loops: for each i from 0 to n-1, we iterate j from 0 to i-1. That's n\*(n-1)/2 = O(n²) iterations. Dictionary operations (get/put) are O(1) on average.

**Space Complexity:** O(n²) in the worst case. Each of the n positions could have up to n different differences stored in its dictionary. In practice, it's often less than n² since many positions share common differences, but the worst case occurs when all differences are unique.

## Common Mistakes

1. **Confusing subsequence with subarray:** A subsequence doesn't require elements to be contiguous, while a subarray does. Some candidates try to find contiguous arithmetic sequences, which is a different (easier) problem.

2. **Not handling the base case correctly:** When we find a new difference between nums[j] and nums[i], the sequence length should be 2 (both elements), not 1. The code `dp[i][diff] = dp[j].get(diff, 1) + 1` would be wrong because if diff doesn't exist in dp[j], we should get 1 (for nums[j] alone) + 1 = 2, but actually we need to represent that nums[j] and nums[i] together form a sequence of length 2.

3. **Using array instead of dictionary for differences:** Since differences can be negative and have a wide range (-500 to 500 in constraints), using a 2D array sized by the maximum difference range is possible but less efficient and harder to implement correctly. The dictionary approach is cleaner.

4. **Forgetting to update the global maximum:** The answer isn't necessarily at the last position. We need to track the maximum length seen so far throughout the computation.

## When You'll See This Pattern

This "ending at position i with state" dynamic programming pattern appears in many sequence problems:

1. **Longest Increasing Subsequence (LIS)** - Similar concept but with simpler state (just ending position, no difference tracking).
2. **Arithmetic Slices** - Counts contiguous arithmetic subarrays, easier version.
3. **Number of Longest Increasing Subsequence** - Extends LIS to count sequences.
4. **Destroy Sequential Targets** - The similar problem mentioned, which involves finding sequences with constant difference.

The pattern is: when you need to find optimal subsequences (not necessarily contiguous) with some constraint on the relationship between elements, consider DP where you track "ending at position i with some state."

## Key Takeaways

1. **For subsequence problems with element relationships**, dynamic programming with state tracking is often the solution. The state captures what you need to know to extend the sequence.

2. **The "ending at i" formulation** is powerful for subsequence problems because it lets you build solutions incrementally and combine them.

3. **When the state space is large but sparse**, use dictionaries/hash maps instead of arrays to save space and simplify code.

Related problems: [Destroy Sequential Targets](/problem/destroy-sequential-targets)
