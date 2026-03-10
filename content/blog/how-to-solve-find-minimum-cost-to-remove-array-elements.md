---
title: "How to Solve Find Minimum Cost to Remove Array Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Minimum Cost to Remove Array Elements. Medium difficulty, 21.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-04-05"
category: "dsa-patterns"
tags: ["find-minimum-cost-to-remove-array-elements", "array", "dynamic-programming", "medium"]
---

# How to Solve Find Minimum Cost to Remove Array Elements

This problem asks us to remove all elements from an array by repeatedly choosing two elements from the first three positions and paying the maximum of those two as cost, or removing the first element alone at its value as cost. The challenge is finding the optimal sequence of operations to minimize total cost. What makes this tricky is that each decision affects future choices—removing elements changes which elements become part of the "first three"—so we need to think ahead rather than just picking greedily.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 4, 5]` step by step:

**Initial state:** `[1, 2, 3, 4, 5]` (cost = 0)

**Option 1:** Remove first element `1` alone → cost = 1  
New array: `[2, 3, 4, 5]`

**Option 2:** Remove two elements from first three `[1, 2, 3]`:

- Remove `1` and `2` → cost = max(1, 2) = 2  
  New array: `[3, 4, 5]`
- Remove `1` and `3` → cost = max(1, 3) = 3  
  New array: `[2, 4, 5]`
- Remove `2` and `3` → cost = max(2, 3) = 3  
  New array: `[1, 4, 5]`

Notice how different choices lead to different remaining arrays and thus different future costs. The optimal solution isn't obvious by just looking at immediate cost—we need to consider the entire sequence.

For this example, the optimal path is:

1. Remove `1` and `2` (cost = 2) → `[3, 4, 5]`
2. Remove `3` and `4` (cost = 4) → `[5]`
3. Remove `5` alone (cost = 5) → `[]`
   Total cost = 2 + 4 + 5 = 11

Any other sequence gives higher cost. This shows we need to systematically evaluate all possibilities.

## Brute Force Approach

A naive approach would be to explore all possible sequences of operations using recursion. At each step, we have:

1. Remove the first element alone (if array length ≥ 1)
2. Remove any two elements from the first three (if array length ≥ 2)

We could write a recursive function that tries all options and returns the minimum cost. However, with `n` elements, each step has up to 4 choices (1 single removal + 3 pairs from first three), leading to exponential time complexity O(4^n). For n=1000, this is completely infeasible.

The key observation is that many subproblems are repeated. For example, after removing elements from the beginning, we often end up with the same suffix of the original array. This suggests dynamic programming is the right approach.

## Optimized Approach

The optimal solution uses **dynamic programming** with memoization. Here's the step-by-step reasoning:

1. **State definition**: Let `dp[i]` represent the minimum cost to remove elements starting from index `i` to the end of the array. We want `dp[0]`.

2. **Base cases**:
   - If `i == n` (past the end), cost is 0 (nothing to remove)
   - If `i == n-1` (last element), we must remove it alone: cost = `nums[i]`

3. **Transition**:
   At position `i`, we have two types of moves:
   - **Single removal**: Remove `nums[i]` alone → cost = `nums[i] + dp[i+1]`
   - **Pair removal**: Remove two elements from positions `i, i+1, i+2`:
     - Remove `i` and `i+1` → cost = `max(nums[i], nums[i+1]) + dp[i+2]`
     - Remove `i` and `i+2` → cost = `max(nums[i], nums[i+2]) + dp[i+3]` (if `i+2 < n`)
     - Remove `i+1` and `i+2` → cost = `max(nums[i+1], nums[i+2]) + dp[i+3]` (if `i+2 < n`)

4. **Recurrence relation**:  
   `dp[i] = min(`
   - `nums[i] + dp[i+1]` (single removal)
   - `max(nums[i], nums[i+1]) + dp[i+2]` (if `i+1 < n`)
   - `max(nums[i], nums[i+2]) + dp[i+3]` (if `i+2 < n`)
   - `max(nums[i+1], nums[i+2]) + dp[i+3]` (if `i+2 < n`)
     `)`

5. **Computation order**: We compute from right to left (`i = n-1` down to `0`) so that when we need `dp[i+k]`, it's already computed.

This approach has O(n) time complexity since we compute each `dp[i]` once in constant time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumCost(nums):
    """
    Returns the minimum cost to remove all elements from nums.

    Approach: Dynamic programming where dp[i] = minimum cost to
    remove elements from index i to the end.
    """
    n = len(nums)
    if n == 0:
        return 0

    # dp[i] = min cost to remove elements starting from index i
    dp = [0] * (n + 1)  # Extra slot for dp[n] = 0

    # Base case: last element must be removed alone
    dp[n - 1] = nums[n - 1]

    # Fill dp array from right to left
    for i in range(n - 2, -1, -1):
        # Option 1: Remove nums[i] alone
        cost1 = nums[i] + dp[i + 1]

        # Initialize other options with a large value
        cost2 = cost3 = cost4 = float('inf')

        # Option 2: Remove nums[i] and nums[i+1] (if i+1 exists)
        if i + 1 < n:
            cost2 = max(nums[i], nums[i + 1]) + dp[i + 2]

        # Options 3 and 4: Remove two elements including nums[i+2]
        if i + 2 < n:
            # Option 3: Remove nums[i] and nums[i+2]
            cost3 = max(nums[i], nums[i + 2]) + dp[i + 3]

            # Option 4: Remove nums[i+1] and nums[i+2]
            cost4 = max(nums[i + 1], nums[i + 2]) + dp[i + 3]

        # Take the minimum of all valid options
        dp[i] = min(cost1, cost2, cost3, cost4)

    return dp[0]
```

```javascript
// Time: O(n) | Space: O(n)
function minimumCost(nums) {
  /**
   * Returns the minimum cost to remove all elements from nums.
   *
   * Approach: Dynamic programming where dp[i] = minimum cost to
   * remove elements from index i to the end.
   */
  const n = nums.length;
  if (n === 0) return 0;

  // dp[i] = min cost to remove elements starting from index i
  // Extra slot for dp[n] = 0
  const dp = new Array(n + 1).fill(0);

  // Base case: last element must be removed alone
  dp[n - 1] = nums[n - 1];

  // Fill dp array from right to left
  for (let i = n - 2; i >= 0; i--) {
    // Option 1: Remove nums[i] alone
    let cost1 = nums[i] + dp[i + 1];

    // Initialize other options with Infinity
    let cost2 = Infinity,
      cost3 = Infinity,
      cost4 = Infinity;

    // Option 2: Remove nums[i] and nums[i+1] (if i+1 exists)
    if (i + 1 < n) {
      cost2 = Math.max(nums[i], nums[i + 1]) + dp[i + 2];
    }

    // Options 3 and 4: Remove two elements including nums[i+2]
    if (i + 2 < n) {
      // Option 3: Remove nums[i] and nums[i+2]
      cost3 = Math.max(nums[i], nums[i + 2]) + dp[i + 3];

      // Option 4: Remove nums[i+1] and nums[i+2]
      cost4 = Math.max(nums[i + 1], nums[i + 2]) + dp[i + 3];
    }

    // Take the minimum of all valid options
    dp[i] = Math.min(cost1, cost2, cost3, cost4);
  }

  return dp[0];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minimumCost(int[] nums) {
        /**
         * Returns the minimum cost to remove all elements from nums.
         *
         * Approach: Dynamic programming where dp[i] = minimum cost to
         * remove elements from index i to the end.
         */
        int n = nums.length;
        if (n == 0) return 0;

        // dp[i] = min cost to remove elements starting from index i
        // Extra slot for dp[n] = 0
        int[] dp = new int[n + 1];

        // Base case: last element must be removed alone
        dp[n - 1] = nums[n - 1];

        // Fill dp array from right to left
        for (int i = n - 2; i >= 0; i--) {
            // Option 1: Remove nums[i] alone
            int cost1 = nums[i] + dp[i + 1];

            // Initialize other options with a large value
            int cost2 = Integer.MAX_VALUE;
            int cost3 = Integer.MAX_VALUE;
            int cost4 = Integer.MAX_VALUE;

            // Option 2: Remove nums[i] and nums[i+1] (if i+1 exists)
            if (i + 1 < n) {
                cost2 = Math.max(nums[i], nums[i + 1]) + dp[i + 2];
            }

            // Options 3 and 4: Remove two elements including nums[i+2]
            if (i + 2 < n) {
                // Option 3: Remove nums[i] and nums[i+2]
                cost3 = Math.max(nums[i], nums[i + 2]) + dp[i + 3];

                // Option 4: Remove nums[i+1] and nums[i+2]
                cost4 = Math.max(nums[i + 1], nums[i + 2]) + dp[i + 3];
            }

            // Take the minimum of all valid options
            dp[i] = Math.min(cost1, Math.min(cost2, Math.min(cost3, cost4)));
        }

        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the array once from right to left, and for each position `i`, we perform a constant number of operations (up to 4 min comparisons and some array accesses). This gives O(n) total time.

**Space Complexity:** O(n)  
We use a `dp` array of size `n+1` to store the minimum costs for each starting position. We could optimize to O(1) space by only keeping the last 3 `dp` values since we only need `dp[i+1]`, `dp[i+2]`, and `dp[i+3]` to compute `dp[i]`, but the O(n) solution is clearer for understanding.

## Common Mistakes

1. **Off-by-one errors in array bounds**: When checking `i+1 < n` and `i+2 < n`, it's easy to accidentally use `≤` or miss a check. This leads to index out of bounds errors. Always verify boundary conditions carefully.

2. **Forgetting the single removal option**: Some candidates only consider removing pairs from the first three elements, but the problem allows removing just the first element alone. This omission can lead to incorrect results, especially for arrays with odd lengths.

3. **Incorrect cost calculation for pair removal**: The cost is the **maximum** of the two removed elements, not the sum. Using sum instead of max gives wrong results for test cases like `[5, 1, 2]` where removing `5` and `1` costs 5, not 6.

4. **Greedy approach fails**: Trying to always remove the smallest two elements or always remove the first element if it's small doesn't work. Counterexample: `[1, 100, 1, 1, 100]`. Greedy might remove `1` and `1` first (cost 1), but optimal is different.

## When You'll See This Pattern

This type of "minimum cost with choices" problem appears frequently in dynamic programming:

1. **House Robber (LeetCode 198)**: At each house, choose to rob it or skip it, with constraints on adjacent houses. Similar state transition with choices.

2. **Minimum Cost Climbing Stairs (LeetCode 746)**: At each step, choose to pay cost and move 1 or 2 steps. Similar to our "remove 1 or 2 elements" decision.

3. **Decode Ways (LeetCode 91)**: At each position, decide whether to decode one digit or two digits. The "look ahead 1 or 2 positions" pattern is similar.

The common theme is making optimal decisions at each step where choices affect future options, and the solution can be expressed as a recurrence relation.

## Key Takeaways

1. **When you see "minimum cost with choices" and decisions affect future options**, think dynamic programming. The overlapping subproblems property is a strong indicator.

2. **Define state as "minimum cost from position i to the end"** when operations only remove elements from the front. This "suffix DP" approach is natural for left-to-right operations.

3. **Always consider all valid moves at each state**, even if some seem suboptimal locally. What looks bad now might enable much better future moves.

Related problems: [Minimum Difference in Sums After Removal of Elements](/problem/minimum-difference-in-sums-after-removal-of-elements)
