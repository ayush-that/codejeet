---
title: "How to Solve Largest Divisible Subset — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Divisible Subset. Medium difficulty, 49.4% acceptance rate. Topics: Array, Math, Dynamic Programming, Sorting."
date: "2027-05-16"
category: "dsa-patterns"
tags: ["largest-divisible-subset", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Largest Divisible Subset

This problem asks us to find the largest subset of distinct positive integers where every pair of numbers is divisible (one divides the other evenly). The challenge lies in efficiently finding this subset without checking all possible combinations, which would be computationally infeasible for larger inputs.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 4, 8, 9, 72]`

**Step 1: Sort the array**
First, we sort the array: `[1, 2, 4, 8, 9, 72]`. Sorting is crucial because if we have a sorted array and `nums[i] % nums[j] == 0` where `j < i`, then for any `k < j`, if `nums[j] % nums[k] == 0`, then automatically `nums[i] % nums[k] == 0`. This transitive property allows us to build chains of divisible numbers.

**Step 2: Build DP arrays**
We'll maintain two arrays:

- `dp[i]`: The length of the largest divisible subset ending with `nums[i]`
- `prev[i]`: The index of the previous element in that subset (for reconstruction)

**Step 3: Process each element**

- For `nums[0] = 1`: `dp[0] = 1`, `prev[0] = -1` (no previous)
- For `nums[1] = 2`: Check all previous elements:
  - `2 % 1 == 0`: `dp[1] = dp[0] + 1 = 2`, `prev[1] = 0`
- For `nums[2] = 4`: Check all previous:
  - `4 % 1 == 0`: `dp[2] = dp[0] + 1 = 2`, `prev[2] = 0`
  - `4 % 2 == 0`: `dp[2] = dp[1] + 1 = 3`, `prev[2] = 1` (better!)
- For `nums[3] = 8`: Check all previous:
  - `8 % 1 == 0`: `dp[3] = dp[0] + 1 = 2`
  - `8 % 2 == 0`: `dp[3] = dp[1] + 1 = 3`
  - `8 % 4 == 0`: `dp[3] = dp[2] + 1 = 4`, `prev[3] = 2` (best)
- For `nums[4] = 9`: Check all previous:
  - `9 % 1 == 0`: `dp[4] = dp[0] + 1 = 2`, `prev[4] = 0`
  - `9 % 2 != 0`, `9 % 4 != 0`, `9 % 8 != 0`
- For `nums[5] = 72`: Check all previous:
  - `72 % 1 == 0`: `dp[5] = dp[0] + 1 = 2`
  - `72 % 2 == 0`: `dp[5] = dp[1] + 1 = 3`
  - `72 % 4 == 0`: `dp[5] = dp[2] + 1 = 4`
  - `72 % 8 == 0`: `dp[5] = dp[3] + 1 = 5`, `prev[5] = 3` (best)
  - `72 % 9 == 0`: `dp[5] = dp[4] + 1 = 3` (not better)

**Step 4: Reconstruct the subset**
The maximum `dp` value is 5 at index 5. We backtrack:

- Index 5 (72) → prev[5] = 3 (8) → prev[3] = 2 (4) → prev[2] = 1 (2) → prev[1] = 0 (1) → prev[0] = -1 (stop)
- Result: `[1, 2, 4, 8, 72]`

## Brute Force Approach

The brute force approach would generate all possible subsets (2^n possibilities) and check if each subset satisfies the divisibility condition. For each subset of size k, we'd need to check all k\*(k-1)/2 pairs.

```python
def largestDivisibleSubsetBruteForce(nums):
    from itertools import combinations

    nums.sort()
    n = len(nums)
    best_subset = []

    # Check all possible subset sizes from largest to smallest
    for k in range(n, 0, -1):
        for subset in combinations(nums, k):
            valid = True
            # Check all pairs in the subset
            for i in range(k):
                for j in range(i+1, k):
                    if subset[i] % subset[j] != 0 and subset[j] % subset[i] != 0:
                        valid = False
                        break
                if not valid:
                    break
            if valid:
                return list(subset)

    return []
```

**Why this fails:** With n up to 1000, 2^1000 subsets is astronomically large (~1.07e301). Even for n=20, that's over 1 million subsets to check. This approach is completely impractical for the problem constraints.

## Optimized Approach

The key insight is that this problem is similar to finding the **Longest Increasing Subsequence (LIS)**, but with a divisibility condition instead of a less-than condition. After sorting, we can use dynamic programming where `dp[i]` represents the size of the largest divisible subset ending at `nums[i]`.

**Why sorting works:** In a sorted array, if `b % a == 0` and `c % b == 0`, then `c % a == 0`. This transitive property allows us to build chains. Without sorting, we'd have to check both directions (`a % b` and `b % a`), making the logic more complex.

**DP transition:** For each `i`, we check all `j < i`. If `nums[i] % nums[j] == 0`, we can extend the subset ending at `j` by including `nums[i]`. We take the maximum over all such `j`.

**Reconstruction:** We track `prev[i]` to remember which element comes before `nums[i]` in the optimal subset. After finding the index with maximum `dp` value, we backtrack using `prev` to reconstruct the subset.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def largestDivisibleSubset(nums):
    # Edge case: empty input
    if not nums:
        return []

    # Step 1: Sort the array - crucial for the DP approach
    # Sorting ensures that if nums[i] % nums[j] == 0 (j < i),
    # then for any k < j where nums[j] % nums[k] == 0,
    # we automatically have nums[i] % nums[k] == 0
    nums.sort()

    n = len(nums)
    # dp[i] stores the length of the largest divisible subset ending with nums[i]
    dp = [1] * n
    # prev[i] stores the index of the previous element in the largest subset ending at i
    prev = [-1] * n

    max_len = 0  # Track maximum subset length
    max_idx = -1  # Track index where maximum subset ends

    # Step 2: Build DP table
    for i in range(n):
        # For each i, check all previous elements j
        for j in range(i):
            # If nums[i] is divisible by nums[j], we can extend the subset ending at j
            if nums[i] % nums[j] == 0:
                # Update if extending from j gives us a larger subset
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    prev[i] = j

        # Update global maximum
        if dp[i] > max_len:
            max_len = dp[i]
            max_idx = i

    # Step 3: Reconstruct the subset by backtracking from max_idx
    result = []
    while max_idx != -1:
        result.append(nums[max_idx])
        max_idx = prev[max_idx]

    # The subset was built backwards, so reverse it
    return result[::-1]
```

```javascript
// Time: O(n^2) | Space: O(n)
function largestDivisibleSubset(nums) {
  // Edge case: empty input
  if (nums.length === 0) return [];

  // Step 1: Sort the array
  nums.sort((a, b) => a - b);

  const n = nums.length;
  // dp[i] stores the length of the largest divisible subset ending with nums[i]
  const dp = new Array(n).fill(1);
  // prev[i] stores the index of the previous element in the largest subset ending at i
  const prev = new Array(n).fill(-1);

  let maxLen = 0; // Track maximum subset length
  let maxIdx = -1; // Track index where maximum subset ends

  // Step 2: Build DP table
  for (let i = 0; i < n; i++) {
    // For each i, check all previous elements j
    for (let j = 0; j < i; j++) {
      // If nums[i] is divisible by nums[j], we can extend the subset ending at j
      if (nums[i] % nums[j] === 0) {
        // Update if extending from j gives us a larger subset
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = j;
        }
      }
    }

    // Update global maximum
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIdx = i;
    }
  }

  // Step 3: Reconstruct the subset by backtracking from maxIdx
  const result = [];
  while (maxIdx !== -1) {
    result.push(nums[maxIdx]);
    maxIdx = prev[maxIdx];
  }

  // The subset was built backwards, so reverse it
  return result.reverse();
}
```

```java
// Time: O(n^2) | Space: O(n)
import java.util.*;

public class Solution {
    public List<Integer> largestDivisibleSubset(int[] nums) {
        // Edge case: empty input
        if (nums.length == 0) return new ArrayList<>();

        // Step 1: Sort the array
        Arrays.sort(nums);

        int n = nums.length;
        // dp[i] stores the length of the largest divisible subset ending with nums[i]
        int[] dp = new int[n];
        // prev[i] stores the index of the previous element in the largest subset ending at i
        int[] prev = new int[n];

        // Initialize dp array with 1 (each element is a subset of itself)
        // Initialize prev array with -1 (no previous element)
        Arrays.fill(dp, 1);
        Arrays.fill(prev, -1);

        int maxLen = 0;  // Track maximum subset length
        int maxIdx = -1; // Track index where maximum subset ends

        // Step 2: Build DP table
        for (int i = 0; i < n; i++) {
            // For each i, check all previous elements j
            for (int j = 0; j < i; j++) {
                // If nums[i] is divisible by nums[j], we can extend the subset ending at j
                if (nums[i] % nums[j] == 0) {
                    // Update if extending from j gives us a larger subset
                    if (dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        prev[i] = j;
                    }
                }
            }

            // Update global maximum
            if (dp[i] > maxLen) {
                maxLen = dp[i];
                maxIdx = i;
            }
        }

        // Step 3: Reconstruct the subset by backtracking from maxIdx
        List<Integer> result = new ArrayList<>();
        while (maxIdx != -1) {
            result.add(nums[maxIdx]);
            maxIdx = prev[maxIdx];
        }

        // The subset was built backwards, so reverse it
        Collections.reverse(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Sorting takes O(n log n)
- The nested loops for DP take O(n²) — for each of n elements, we check all previous elements
- Reconstruction takes O(n)
- Dominated by O(n²)

**Space Complexity:** O(n)

- We store two arrays of size n: `dp` and `prev`
- The result subset can be at most size n
- Sorting may use O(log n) space for the algorithm's internal stack, but this is typically considered O(1) auxiliary space

## Common Mistakes

1. **Forgetting to sort the array:** This is the most critical step. Without sorting, the transitive property doesn't hold, and you'd need to check both `a % b` and `b % a` for each pair, making the logic much more complex.

2. **Not handling the empty input case:** The problem doesn't guarantee non-empty input. Always check for edge cases like empty arrays or single-element arrays.

3. **Confusing the divisibility condition:** Remember we need `a % b == 0` OR `b % a == 0`. After sorting, we only need to check `nums[i] % nums[j] == 0` for `j < i`, since if `nums[j]` were larger, the modulo would never be zero (except for equal numbers, but inputs are distinct).

4. **Forgetting to reconstruct the subset:** Some candidates only calculate the maximum length but forget to actually build the subset. Remember to track `prev[i]` during DP and reconstruct at the end.

## When You'll See This Pattern

This problem uses a **DP approach for sequence problems with a transitive relation**, similar to:

1. **Longest Increasing Subsequence (LeetCode 300):** Instead of divisibility, the condition is `nums[i] > nums[j]`. The DP structure is identical: `dp[i] = max(dp[j] + 1)` for all `j < i` where the condition holds.

2. **Longest String Chain (LeetCode 1048):** Here the condition is "word1 is a predecessor of word2" (can add one letter). Again, sort by length and use DP with `dp[i] = max(dp[j] + 1)` for all `j < i` where word[j] is a predecessor of word[i].

3. **Russian Doll Envelopes (LeetCode 354):** Sort by one dimension, then find LIS on the other dimension with careful handling of equal values.

The pattern is: **Sort + DP where each element can extend chains ending at previous elements that satisfy some binary relation.**

## Key Takeaways

1. **Sorting enables transitive chains:** When you need to find the longest chain where each pair satisfies a condition, sorting often allows you to only check one direction of the relation, making DP feasible.

2. **Track both length and reconstruction:** For "find the actual subset/sequence" problems, maintain a `prev` array alongside your DP table to reconstruct the solution.

3. **Recognize LIS variants:** Many sequence problems are variations of Longest Increasing Subsequence. If you can define an ordering and a pairwise condition, you can often adapt the LIS DP approach.

[Practice this problem on CodeJeet](/problem/largest-divisible-subset)
