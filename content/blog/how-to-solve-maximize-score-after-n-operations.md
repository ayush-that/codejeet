---
title: "How to Solve Maximize Score After N Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Score After N Operations. Hard difficulty, 57.9% acceptance rate. Topics: Array, Math, Dynamic Programming, Backtracking, Bit Manipulation."
date: "2028-02-04"
category: "dsa-patterns"
tags: ["maximize-score-after-n-operations", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Maximize Score After N Operations

You're given an array of positive integers with an even length (2 \* n), and you need to perform n operations where each operation involves picking two numbers, calculating their greatest common divisor (GCD), multiplying it by the operation number (1-indexed), and removing those numbers. The goal is to maximize the total score. What makes this problem tricky is that the order matters—the pairs you choose earlier affect which numbers remain for later operations—and with n up to 7 (meaning 14 numbers), there are far too many pairing combinations to brute force naively.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 4, 9, 5]` (n = 2).

We need to perform 2 operations:

- Operation 1: score = 1 × gcd(pair)
- Operation 2: score = 2 × gcd(pair)

**Step 1:** Consider all possible first operations:

- Pair (3,4): gcd = 1 → score = 1 × 1 = 1. Remaining: [9,5]
- Pair (3,9): gcd = 3 → score = 1 × 3 = 3. Remaining: [4,5]
- Pair (3,5): gcd = 1 → score = 1 × 1 = 1. Remaining: [4,9]
- Pair (4,9): gcd = 1 → score = 1 × 1 = 1. Remaining: [3,5]
- Pair (4,5): gcd = 1 → score = 1 × 1 = 1. Remaining: [3,9]
- Pair (9,5): gcd = 1 → score = 1 × 1 = 1. Remaining: [3,4]

**Step 2:** For each remaining pair, calculate second operation:

- After (3,4): Remaining [9,5] → gcd = 1 → score = 2 × 1 = 2. Total = 1 + 2 = 3
- After (3,9): Remaining [4,5] → gcd = 1 → score = 2 × 1 = 2. Total = 3 + 2 = 5
- After (3,5): Remaining [4,9] → gcd = 1 → score = 2 × 1 = 2. Total = 1 + 2 = 3
- After (4,9): Remaining [3,5] → gcd = 1 → score = 2 × 1 = 2. Total = 1 + 2 = 3
- After (4,5): Remaining [3,9] → gcd = 3 → score = 2 × 3 = 6. Total = 1 + 6 = 7
- After (9,5): Remaining [3,4] → gcd = 1 → score = 2 × 1 = 2. Total = 1 + 2 = 3

The maximum total score is 7, achieved by first pairing (4,5) with score 1, then pairing (3,9) with score 6.

This shows why we can't just greedily pick the largest GCD first—sometimes a smaller GCD early allows for a much larger GCD later with a higher multiplier.

## Brute Force Approach

The most straightforward approach is to try all possible pairings recursively. At each step, we:

1. Choose any two available numbers
2. Calculate the score for this operation (operation_number × gcd(pair))
3. Remove those numbers and recurse on the remaining numbers
4. Track the maximum score across all possibilities

The number of possible pairings grows factorially. For n pairs, there are (2n)!/(2^n × n!) possible ways to pair the numbers. For n = 7 (14 numbers), this is approximately 13 billion possibilities—far too many to explore.

Even with pruning, a naive recursive solution would time out. We need a way to avoid recomputing the same subproblems repeatedly.

## Optimized Approach

The key insight is that **the state of our problem can be represented by which numbers have been used so far**. Since there are at most 14 numbers, we can use a bitmask where the i-th bit is 1 if the i-th number has been used (removed), and 0 if it's still available.

This leads to a dynamic programming approach with memoization:

- State: `dp[mask]` = maximum score achievable starting from this state (with certain numbers already used)
- Base case: When all numbers are used (mask has all bits set), the score is 0
- Transition: For the current operation number `k` (which we can calculate from how many numbers have been used), try all pairs of available numbers (i, j), calculate `k * gcd(nums[i], nums[j])`, add it to the recursive result for the state where i and j are marked as used
- Take the maximum over all possible pairs

The operation number `k` is simply `(count_of_used_numbers / 2) + 1`, since each operation removes 2 numbers.

This approach works because:

1. The bitmask compactly represents the state (2^14 = 16384 possible states)
2. Memoization ensures we compute each state only once
3. We explore all possible pairings without repetition

## Optimal Solution

Here's the complete solution using DP with memoization and bitmask:

<div class="code-group">

```python
# Time: O(2^m * m^2) where m = 2n (max 14)
# Space: O(2^m) for memoization
class Solution:
    def maxScore(self, nums: List[int]) -> int:
        m = len(nums)
        n = m // 2

        # Precompute all gcd values to avoid repeated calculations
        gcd_values = [[0] * m for _ in range(m)]
        for i in range(m):
            for j in range(i + 1, m):
                gcd_values[i][j] = self.gcd(nums[i], nums[j])
                gcd_values[j][i] = gcd_values[i][j]

        # DP memoization: dp[mask] = max score achievable from this state
        dp = [-1] * (1 << m)

        def dfs(mask, operation):
            # Base case: all numbers used
            if mask == (1 << m) - 1:
                return 0

            # Return cached result if available
            if dp[mask] != -1:
                return dp[mask]

            max_score = 0
            # Try all pairs of available numbers
            for i in range(m):
                if mask & (1 << i):  # i already used
                    continue
                for j in range(i + 1, m):
                    if mask & (1 << j):  # j already used
                        continue

                    # Calculate score for this pair
                    current_score = operation * gcd_values[i][j]
                    # Create new mask with i and j marked as used
                    new_mask = mask | (1 << i) | (1 << j)
                    # Recursively compute maximum score from remaining numbers
                    remaining_score = dfs(new_mask, operation + 1)
                    # Update maximum score
                    max_score = max(max_score, current_score + remaining_score)

            # Memoize and return result
            dp[mask] = max_score
            return max_score

        # Start with no numbers used (mask = 0) and first operation (operation = 1)
        return dfs(0, 1)

    def gcd(self, a: int, b: int) -> int:
        # Euclidean algorithm to compute GCD
        while b:
            a, b = b, a % b
        return a
```

```javascript
// Time: O(2^m * m^2) where m = 2n (max 14)
// Space: O(2^m) for memoization
var maxScore = function (nums) {
  const m = nums.length;
  const n = m / 2;

  // Precompute all gcd values to avoid repeated calculations
  const gcdValues = new Array(m);
  for (let i = 0; i < m; i++) {
    gcdValues[i] = new Array(m).fill(0);
  }

  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      const g = gcd(nums[i], nums[j]);
      gcdValues[i][j] = g;
      gcdValues[j][i] = g;
    }
  }

  // DP memoization: dp[mask] = max score achievable from this state
  const dp = new Array(1 << m).fill(-1);

  const dfs = (mask, operation) => {
    // Base case: all numbers used
    if (mask === (1 << m) - 1) {
      return 0;
    }

    // Return cached result if available
    if (dp[mask] !== -1) {
      return dp[mask];
    }

    let maxScore = 0;
    // Try all pairs of available numbers
    for (let i = 0; i < m; i++) {
      if (mask & (1 << i)) {
        // i already used
        continue;
      }
      for (let j = i + 1; j < m; j++) {
        if (mask & (1 << j)) {
          // j already used
          continue;
        }

        // Calculate score for this pair
        const currentScore = operation * gcdValues[i][j];
        // Create new mask with i and j marked as used
        const newMask = mask | (1 << i) | (1 << j);
        // Recursively compute maximum score from remaining numbers
        const remainingScore = dfs(newMask, operation + 1);
        // Update maximum score
        maxScore = Math.max(maxScore, currentScore + remainingScore);
      }
    }

    // Memoize and return result
    dp[mask] = maxScore;
    return maxScore;
  };

  // Start with no numbers used (mask = 0) and first operation (operation = 1)
  return dfs(0, 1);
};

// Helper function to compute GCD using Euclidean algorithm
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
```

```java
// Time: O(2^m * m^2) where m = 2n (max 14)
// Space: O(2^m) for memoization
class Solution {
    public int maxScore(int[] nums) {
        int m = nums.length;

        // Precompute all gcd values to avoid repeated calculations
        int[][] gcdValues = new int[m][m];
        for (int i = 0; i < m; i++) {
            for (int j = i + 1; j < m; j++) {
                int g = gcd(nums[i], nums[j]);
                gcdValues[i][j] = g;
                gcdValues[j][i] = g;
            }
        }

        // DP memoization: dp[mask] = max score achievable from this state
        int[] dp = new int[1 << m];
        Arrays.fill(dp, -1);

        return dfs(0, 1, m, gcdValues, dp);
    }

    private int dfs(int mask, int operation, int m, int[][] gcdValues, int[] dp) {
        // Base case: all numbers used
        if (mask == (1 << m) - 1) {
            return 0;
        }

        // Return cached result if available
        if (dp[mask] != -1) {
            return dp[mask];
        }

        int maxScore = 0;
        // Try all pairs of available numbers
        for (int i = 0; i < m; i++) {
            if ((mask & (1 << i)) != 0) {  // i already used
                continue;
            }
            for (int j = i + 1; j < m; j++) {
                if ((mask & (1 << j)) != 0) {  // j already used
                    continue;
                }

                // Calculate score for this pair
                int currentScore = operation * gcdValues[i][j];
                // Create new mask with i and j marked as used
                int newMask = mask | (1 << i) | (1 << j);
                // Recursively compute maximum score from remaining numbers
                int remainingScore = dfs(newMask, operation + 1, m, gcdValues, dp);
                // Update maximum score
                maxScore = Math.max(maxScore, currentScore + remainingScore);
            }
        }

        // Memoize and return result
        dp[mask] = maxScore;
        return maxScore;
    }

    // Helper function to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2^m × m²) where m = 2n (the number of elements, max 14). Here's why:

- There are 2^m possible states (bitmasks)
- For each state, we potentially check all pairs of available numbers: O(m²) in worst case
- The GCD precomputation takes O(m²) time, which is dominated by the DP
- With m ≤ 14, 2^14 × 14² ≈ 16384 × 196 ≈ 3.2 million operations, which is efficient

**Space Complexity:** O(2^m) for the memoization array plus O(m²) for the precomputed GCD values. The dominant term is O(2^m) for the DP array.

## Common Mistakes

1. **Trying greedy approach:** Candidates often think "always pick the largest GCD first" because of the higher multipliers later. But as shown in the example, sometimes a smaller GCD early enables a much larger GCD with a higher multiplier later. Always test greedy approaches with counterexamples.

2. **Forgetting to track operation number:** The score depends on which operation you're performing (1-indexed). A common error is to use a fixed multiplier or miscalculate the operation number from the current state. Remember: operation number = (count_of_used_numbers / 2) + 1.

3. **Inefficient state representation:** Without bitmask, candidates might try to pass arrays or lists of remaining numbers, leading to expensive copying and poor memoization. The bitmask is crucial for efficient state representation and memoization.

4. **Not precomputing GCD values:** Computing GCD for the same pair multiple times is wasteful. Precomputing all pairwise GCDs upfront saves significant time in the DP transitions.

## When You'll See This Pattern

This "bitmask DP for pairing problems" pattern appears in several other LeetCode problems:

1. **Minimum Cost to Connect All Points (LeetCode 1584):** You need to connect all points with minimum total distance. While often solved with MST algorithms, a DP with bitmask approach can work for small n.

2. **Maximum Product of the Length of Two Palindromic Subsequences (LeetCode 2002):** You need to find two disjoint subsequences that are palindromes. The bitmask represents which characters are used in which subsequence.

3. **Can I Win (LeetCode 464):** Two players take turns picking numbers, and you need to determine if the first player can force a win. The state is represented by which numbers have been picked.

The common thread is problems where you need to make selections from a set, and the order or grouping matters, with a small enough n (typically ≤ 20) to make bitmask DP feasible.

## Key Takeaways

1. **Bitmask DP is powerful for selection problems:** When you need to choose elements from a set and the state can be represented by which elements have been chosen, bitmask DP with memoization is often the solution. The constraint n ≤ 15 is a strong hint.

2. **Precompute expensive operations:** If your DP transition involves expensive calculations (like GCD), precompute them upfront to avoid repeated work during the DP recursion.

3. **Think about state representation:** The key to solving DP problems is identifying what information defines a unique state. Here, just knowing which numbers are left is enough—we don't need to know the order in which they were removed.

[Practice this problem on CodeJeet](/problem/maximize-score-after-n-operations)
