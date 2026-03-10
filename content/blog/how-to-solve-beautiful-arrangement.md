---
title: "How to Solve Beautiful Arrangement — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Beautiful Arrangement. Medium difficulty, 64.7% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2028-08-19"
category: "dsa-patterns"
tags: ["beautiful-arrangement", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Beautiful Arrangement

This problem asks us to count the number of **beautiful arrangements** — permutations of numbers 1 through n where for every position i (1-indexed), either i divides the number at that position, or the number divides i. What makes this problem interesting is that we need to count **all valid permutations**, not just find one. With n up to 15, the brute force approach of generating all n! permutations would be prohibitively slow (15! ≈ 1.3 trillion). This forces us to find a smarter way to explore the search space.

## Visual Walkthrough

Let's trace through n = 3 to build intuition. We need to arrange numbers [1, 2, 3] such that for each position i (1, 2, 3), the beautiful condition holds.

**Step-by-step exploration:**

1. Position 1: Can place 1, 2, or 3? Check each:
   - Place 1: 1 is divisible by 1 ✓
   - Place 2: 2 is divisible by 1 ✓
   - Place 3: 3 is divisible by 1 ✓
     All three numbers can go in position 1.

2. Let's try placing 1 in position 1:
   - Remaining numbers: {2, 3}
   - Position 2: Can place 2 or 3?
     - Place 2: 2 is divisible by 2 ✓
     - Place 3: 3 is NOT divisible by 2, and 2 is NOT divisible by 3 ✗
       So only 2 can go in position 2.
   - Position 3: Only 3 remains. Check: 3 is divisible by 3 ✓
     This gives us arrangement [1, 2, 3] ✓

3. Try placing 2 in position 1:
   - Remaining numbers: {1, 3}
   - Position 2: Can place 1 or 3?
     - Place 1: 1 is NOT divisible by 2, but 2 is divisible by 1 ✓
     - Place 3: 3 is NOT divisible by 2, and 2 is NOT divisible by 3 ✗
       So only 1 can go in position 2.
   - Position 3: Only 3 remains. Check: 3 is divisible by 3 ✓
     This gives us arrangement [2, 1, 3] ✓

4. Try placing 3 in position 1:
   - Remaining numbers: {1, 2}
   - Position 2: Can place 1 or 2?
     - Place 1: 1 is NOT divisible by 2, but 2 is divisible by 1 ✓
     - Place 2: 2 is divisible by 2 ✓
       Both work! We need to explore both branches:
     - Branch A: Place 1 in position 2 → position 3 gets 2: Check 2 is NOT divisible by 3, and 3 is NOT divisible by 2 ✗
     - Branch B: Place 2 in position 2 → position 3 gets 1: Check 1 is NOT divisible by 3, but 3 is divisible by 1 ✓
       This gives us arrangement [3, 2, 1] ✓

Total beautiful arrangements for n = 3: [1,2,3], [2,1,3], [3,2,1] → **3 arrangements**.

## Brute Force Approach

The most straightforward approach is to generate all permutations of numbers 1 through n and check each one. For each permutation, we verify the beautiful condition at every position.

**Why this fails:**

- Time complexity: O(n! × n) since there are n! permutations and checking each takes O(n)
- For n = 15: 15! ≈ 1.3 × 10¹² permutations, each taking 15 checks → ~2 × 10¹³ operations
- Even with pruning (checking as we build), the naive recursive approach without memoization would still explore many invalid paths repeatedly

The key insight is that we need to **prune early** and **avoid recomputation** of identical subproblems.

## Optimized Approach

We can solve this efficiently using **backtracking with memoization (DP with bitmask)**. Here's the step-by-step reasoning:

1. **State Representation**: We need to track which numbers we've used so far. Since n ≤ 15, we can use a bitmask where the i-th bit (1-indexed) indicates whether number i+1 has been used.

2. **Recursive Definition**: Let `dp[mask]` = number of ways to arrange the remaining numbers (those not in mask) into the remaining positions. We fill positions from left to right.

3. **Pruning**: At each position `pos`, we only try numbers that satisfy the beautiful condition with `pos`. This dramatically reduces the search space.

4. **Memoization**: Many different paths can lead to the same set of used numbers (same mask). We memoize results to avoid recomputation.

5. **Base Case**: When all numbers are used (mask has all bits set), we've found one valid arrangement.

The optimal approach uses **DFS with memoization** where the state is `(mask, pos)` or just `mask` (since `pos` = number of set bits in mask + 1).

## Optimal Solution

Here's the complete solution using DFS with memoization and bitmask:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(2^n)
class Solution:
    def countArrangement(self, n: int) -> int:
        # Memoization dictionary: mask -> number of arrangements
        memo = {}

        def dfs(mask, pos):
            """
            Recursively count beautiful arrangements.
            mask: bitmask representing used numbers (1 means used)
            pos: current position we're filling (1-indexed)
            Returns: number of valid arrangements from this state
            """
            # Base case: all positions filled
            if pos > n:
                return 1

            # Check memoization
            if mask in memo:
                return memo[mask]

            count = 0
            # Try each number from 1 to n
            for num in range(1, n + 1):
                # Check if number is available (bit at position num-1 is 0)
                if not (mask >> (num - 1)) & 1:
                    # Check beautiful condition
                    if num % pos == 0 or pos % num == 0:
                        # Mark number as used and recurse to next position
                        new_mask = mask | (1 << (num - 1))
                        count += dfs(new_mask, pos + 1)

            # Memoize result
            memo[mask] = count
            return count

        # Start with empty mask (no numbers used) at position 1
        return dfs(0, 1)
```

```javascript
// Time: O(n * 2^n) | Space: O(2^n)
/**
 * @param {number} n
 * @return {number}
 */
var countArrangement = function (n) {
  // Memoization map: mask -> number of arrangements
  const memo = new Map();

  /**
   * Recursively count beautiful arrangements
   * @param {number} mask - bitmask of used numbers (1 means used)
   * @param {number} pos - current position (1-indexed)
   * @return {number} - count of valid arrangements from this state
   */
  const dfs = (mask, pos) => {
    // Base case: all positions filled
    if (pos > n) {
      return 1;
    }

    // Check memoization
    if (memo.has(mask)) {
      return memo.get(mask);
    }

    let count = 0;
    // Try each number from 1 to n
    for (let num = 1; num <= n; num++) {
      // Check if number is available (bit at position num-1 is 0)
      const bit = 1 << (num - 1);
      if ((mask & bit) === 0) {
        // Check beautiful condition
        if (num % pos === 0 || pos % num === 0) {
          // Mark number as used and recurse
          const newMask = mask | bit;
          count += dfs(newMask, pos + 1);
        }
      }
    }

    // Memoize result
    memo.set(mask, count);
    return count;
  };

  // Start with empty mask at position 1
  return dfs(0, 1);
};
```

```java
// Time: O(n * 2^n) | Space: O(2^n)
class Solution {
    public int countArrangement(int n) {
        // Memoization array: index = mask, value = number of arrangements
        // Size is 2^n since mask ranges from 0 to (1 << n) - 1
        Integer[] memo = new Integer[1 << n];

        return dfs(0, 1, n, memo);
    }

    private int dfs(int mask, int pos, int n, Integer[] memo) {
        // Base case: all positions filled
        if (pos > n) {
            return 1;
        }

        // Check memoization
        if (memo[mask] != null) {
            return memo[mask];
        }

        int count = 0;
        // Try each number from 1 to n
        for (int num = 1; num <= n; num++) {
            // Check if number is available (bit at position num-1 is 0)
            int bit = 1 << (num - 1);
            if ((mask & bit) == 0) {
                // Check beautiful condition
                if (num % pos == 0 || pos % num == 0) {
                    // Mark number as used and recurse
                    int newMask = mask | bit;
                    count += dfs(newMask, pos + 1, n, memo);
                }
            }
        }

        // Memoize result
        memo[mask] = count;
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2ⁿ)**

- There are 2ⁿ possible masks (states)
- For each state, we iterate through n numbers to check which ones are available
- In practice, it's faster because we prune invalid numbers early and many masks aren't reachable

**Space Complexity: O(2ⁿ)**

- Memoization stores results for up to 2ⁿ states
- Recursion depth is O(n) for the call stack

**Why this is optimal:**

- We must consider all subsets of numbers (2ⁿ possibilities)
- Each subset needs to be processed to count arrangements
- The n factor comes from trying each available number at each step

## Common Mistakes

1. **Forgetting 1-indexing**: The problem states positions are 1-indexed, but arrays/lists are 0-indexed in most languages. Always check: `position = current_position + 1` or adjust indices accordingly.

2. **Not pruning early**: Checking the beautiful condition only after building complete permutations leads to O(n!) time. Always check validity as you place each number.

3. **Incorrect bitmask handling**:
   - Using wrong bit positions: number `num` corresponds to bit `(1 << (num-1))`, not `(1 << num)`
   - Forgetting to clear bits when backtracking (though our approach avoids this by passing new masks)

4. **Missing memoization**: Without memoization, the solution becomes exponential. Many candidates implement DFS correctly but forget to memoize, leading to TLE for n=15.

## When You'll See This Pattern

This **DFS with memoization and bitmask** pattern appears in permutation/counting problems where:

1. Order matters (permutations, not combinations)
2. The state can be represented by which elements have been used
3. Constraints are small enough for bitmask representation (typically n ≤ 20)

**Related problems:**

- **Permutations II (LeetCode 47)**: Count unique permutations with duplicates, uses similar state tracking
- **Matchsticks to Square (LeetCode 473)**: Partition problem using DFS with memoization
- **Partition to K Equal Sum Subsets (LeetCode 698)**: Similar bitmask DP for partitioning
- **Maximum Product of Word Lengths (LeetCode 318)**: Uses bitmask to represent character sets

## Key Takeaways

1. **Bitmask for subset representation**: When n ≤ 20, bitmasks provide an efficient way to represent subsets and enable memoization.

2. **Prune early in permutation generation**: Always check constraints as you build the solution, not just at the end.

3. **Memoize by state, not just parameters**: The key insight is that `(used_numbers_set, current_position)` is a complete state — many paths can lead to the same set of used numbers at the same position.

4. **Position can be inferred from state**: In our solution, `pos = number_of_set_bits + 1`, which allows us to memoize by mask alone.

Related problems: [Beautiful Arrangement II](/problem/beautiful-arrangement-ii)
