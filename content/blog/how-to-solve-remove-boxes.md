---
title: "How to Solve Remove Boxes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Remove Boxes. Hard difficulty, 49.3% acceptance rate. Topics: Array, Dynamic Programming, Memoization."
date: "2028-04-15"
category: "dsa-patterns"
tags: ["remove-boxes", "array", "dynamic-programming", "memoization", "hard"]
---

# How to Solve Remove Boxes

This problem asks you to maximize the points you can earn by removing boxes. Each time you remove `k` consecutive boxes of the same color, you earn `k * k` points. The challenge is that the order in which you remove boxes matters—removing boxes in one sequence can create new consecutive groups that yield more points later. This makes it a complex optimization problem that requires careful state representation.

## Visual Walkthrough

Let's trace through a small example: `[1, 2, 1, 1]`. The naive approach might be to always remove the largest consecutive group first, but that doesn't always yield the optimal result.

**Initial state:** `[1, 2, 1, 1]`

**Option 1 - Remove largest group first:**

1. Remove the two `1`s at the end: `[1, 2]` → earn 4 points (2²)
2. Remove `2`: `[1]` → earn 1 point (1²)
3. Remove `1`: `[]` → earn 1 point (1²)
   **Total:** 6 points

**Option 2 - Strategic removal:**

1. Remove `2`: `[1, 1, 1]` → earn 1 point (1²)
2. Now we have three consecutive `1`s: remove all three → earn 9 points (3²)
   **Total:** 10 points

The second approach yields more points because we strategically removed the middle box first to create a larger consecutive group. This demonstrates why we need dynamic programming to explore all possible removal sequences.

## Brute Force Approach

The brute force approach would try all possible removal sequences. At each step, we could:

1. Identify all consecutive groups of boxes
2. For each group, remove it and recursively solve the remaining problem
3. Track the maximum points

However, this is extremely inefficient. For `n` boxes, there are `n!` possible removal sequences in the worst case. Even with memoization, the state space is too large because the remaining boxes aren't just a contiguous segment—removing boxes creates gaps.

A naive candidate might try greedy approaches (always remove the largest group first) or simple recursion without proper state representation, but these fail because they don't consider how current removals affect future opportunities.

## Optimized Approach

The key insight is that we need a more sophisticated state representation. Instead of just tracking which boxes remain, we track:

- `i`: the starting index of our current segment
- `j`: the ending index of our current segment
- `k`: the number of boxes to the left of `i` that have the same color as `boxes[i]`

Why this state? Because when we consider removing boxes starting at position `i`, we have two options:

1. Remove `boxes[i]` immediately with the `k` matching boxes to its left
2. Keep `boxes[i]` for later, and first merge it with other boxes of the same color elsewhere in the segment

The recurrence relation becomes:

```
dp[i][j][k] = max(
    # Option 1: Remove boxes[i] with k boxes to the left
    (k+1)² + dp[i+1][j][0],

    # Option 2: Keep boxes[i] for later, merge with matching boxes
    max over m where boxes[i] == boxes[m]:
        dp[i+1][m-1][0] + dp[m][j][k+1]
)
```

This is a 3D DP problem where `dp[i][j][k]` represents the maximum points we can get from boxes `i..j` with `k` boxes of the same color as `boxes[i]` appended to the left.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^4) | Space: O(n^3)
def removeBoxes(boxes):
    """
    Calculate maximum points from removing boxes.

    Args:
        boxes: List[int] - colors of boxes

    Returns:
        int - maximum points achievable
    """
    n = len(boxes)
    # Create memoization table: dp[i][j][k]
    # i: start index, j: end index, k: number of boxes to the left
    # with same color as boxes[i]
    dp = [[[0] * n for _ in range(n)] for _ in range(n)]

    def dfs(i, j, k):
        """
        Recursive helper with memoization.

        Args:
            i: start index (inclusive)
            j: end index (inclusive)
            k: count of boxes to the left with same color as boxes[i]

        Returns:
            Maximum points from boxes[i..j] with k extra boxes
        """
        # Base case: empty segment
        if i > j:
            return 0

        # Return cached result if available
        if dp[i][j][k] > 0:
            return dp[i][j][k]

        # Optimization: if there are consecutive boxes of same color at start,
        # we can merge them with k
        start = i
        while i + 1 <= j and boxes[i + 1] == boxes[i]:
            i += 1
            k += 1

        # Option 1: Remove boxes[i] with all k boxes to the left
        # (k+1) because we have k boxes to the left plus boxes[i] itself
        result = (k + 1) * (k + 1) + dfs(i + 1, j, 0)

        # Option 2: Try to merge boxes[i] with other boxes of same color
        # Look for boxes[m] with same color as boxes[i] between i+1 and j
        for m in range(i + 1, j + 1):
            if boxes[m] == boxes[i]:
                # First solve the segment between i+1 and m-1 (without boxes[i])
                # Then solve from m to j, adding boxes[i] to the count
                result = max(result,
                           dfs(i + 1, m - 1, 0) + dfs(m, j, k + 1))

        # Memoize and return result
        dp[i][j][k] = result
        return result

    # Start with full array and no boxes to the left
    return dfs(0, n - 1, 0)
```

```javascript
// Time: O(n^4) | Space: O(n^3)
function removeBoxes(boxes) {
  /**
   * Calculate maximum points from removing boxes.
   *
   * @param {number[]} boxes - Colors of boxes
   * @return {number} Maximum points achievable
   */
  const n = boxes.length;
  // Create 3D memoization array: dp[i][j][k]
  const dp = Array(n)
    .fill(0)
    .map(() =>
      Array(n)
        .fill(0)
        .map(() => Array(n).fill(0))
    );

  /**
   * Recursive helper with memoization.
   *
   * @param {number} i - Start index (inclusive)
   * @param {number} j - End index (inclusive)
   * @param {number} k - Count of boxes to the left with same color as boxes[i]
   * @return {number} Maximum points from boxes[i..j] with k extra boxes
   */
  function dfs(i, j, k) {
    // Base case: empty segment
    if (i > j) return 0;

    // Return cached result if available
    if (dp[i][j][k] > 0) return dp[i][j][k];

    // Optimization: merge consecutive boxes of same color at start
    let start = i;
    while (i + 1 <= j && boxes[i + 1] === boxes[i]) {
      i++;
      k++;
    }

    // Option 1: Remove boxes[i] with all k boxes to the left
    let result = (k + 1) * (k + 1) + dfs(i + 1, j, 0);

    // Option 2: Try to merge boxes[i] with other boxes of same color
    for (let m = i + 1; m <= j; m++) {
      if (boxes[m] === boxes[i]) {
        // Solve segment between i+1 and m-1, then from m to j with increased k
        result = Math.max(result, dfs(i + 1, m - 1, 0) + dfs(m, j, k + 1));
      }
    }

    // Memoize and return result
    dp[i][j][k] = result;
    return result;
  }

  // Start with full array and no boxes to the left
  return dfs(0, n - 1, 0);
}
```

```java
// Time: O(n^4) | Space: O(n^3)
class Solution {
    public int removeBoxes(int[] boxes) {
        /**
         * Calculate maximum points from removing boxes.
         *
         * @param boxes Colors of boxes
         * @return Maximum points achievable
         */
        int n = boxes.length;
        // Create 3D memoization array: dp[i][j][k]
        int[][][] dp = new int[n][n][n];

        // Start DFS from the full array
        return dfs(boxes, dp, 0, n - 1, 0);
    }

    private int dfs(int[] boxes, int[][][] dp, int i, int j, int k) {
        /**
         * Recursive helper with memoization.
         *
         * @param boxes Original boxes array
         * @param dp Memoization table
         * @param i Start index (inclusive)
         * @param j End index (inclusive)
         * @param k Count of boxes to the left with same color as boxes[i]
         * @return Maximum points from boxes[i..j] with k extra boxes
         */
        // Base case: empty segment
        if (i > j) return 0;

        // Return cached result if available
        if (dp[i][j][k] > 0) return dp[i][j][k];

        // Optimization: merge consecutive boxes of same color at start
        int start = i;
        while (i + 1 <= j && boxes[i + 1] == boxes[i]) {
            i++;
            k++;
        }

        // Option 1: Remove boxes[i] with all k boxes to the left
        int result = (k + 1) * (k + 1) + dfs(boxes, dp, i + 1, j, 0);

        // Option 2: Try to merge boxes[i] with other boxes of same color
        for (int m = i + 1; m <= j; m++) {
            if (boxes[m] == boxes[i]) {
                // Solve segment between i+1 and m-1, then from m to j with increased k
                result = Math.max(result,
                    dfs(boxes, dp, i + 1, m - 1, 0) +
                    dfs(boxes, dp, m, j, k + 1));
            }
        }

        // Memoize and return result
        dp[i][j][k] = result;
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n⁴) in the worst case. Here's why:

- We have O(n³) states (i from 0 to n-1, j from i to n-1, k from 0 to n-1)
- For each state, we potentially iterate through O(n) positions (the `m` loop)
- This gives us O(n³ × n) = O(n⁴)

**Space Complexity:** O(n³) for the memoization table. Each dimension can be up to size `n`, so we need O(n³) space to store all possible states.

The actual runtime is often better than n⁴ in practice because:

1. Many states are unreachable
2. The while loop that merges consecutive same-colored boxes reduces the search space
3. The recursion depth is limited

## Common Mistakes

1. **Using 2D DP instead of 3D:** Many candidates try to use `dp[i][j]` to represent the maximum points for boxes `i..j`. This fails because it doesn't account for boxes to the left that could be merged. The `k` parameter is crucial for tracking how many boxes of the current color are available for merging.

2. **Forgetting to merge consecutive boxes at the start:** The optimization where we increment `i` and `k` while `boxes[i+1] == boxes[i]` is important for efficiency. Without it, the algorithm would create many redundant states and run much slower.

3. **Incorrect base case handling:** The base case should be `if i > j: return 0`, not `if i == j: return (k+1)*(k+1)`. When `i == j`, we still need to consider both options (remove now or merge later).

4. **Not using memoization:** This problem has overlapping subproblems, so pure recursion would be exponential. Always use memoization for DP problems with overlapping subproblems.

## When You'll See This Pattern

This type of interval DP with additional state parameters appears in several challenging problems:

1. **Strange Printer (LeetCode 664):** Similar to Remove Boxes but simpler. You need to find the minimum number of turns to print a string, where each turn can print consecutive identical characters. The state is `dp[i][j]` representing the minimum turns to print substring `i..j`.

2. **Burst Balloons (LeetCode 312):** Another interval DP problem where you need to maximize coins by bursting balloons in optimal order. The state is `dp[i][j]` for maximum coins from bursting balloons `i..j`.

3. **Minimum Cost to Merge Stones (LeetCode 1000):** Interval DP where you merge piles of stones with constraints on how many can be merged at once.

The pattern to recognize: when you have a sequence and operations that depend on adjacent elements, and the optimal solution depends on the order of operations, interval DP is often the right approach.

## Key Takeaways

1. **State representation is key:** For complex DP problems, carefully choose what parameters to include in your state. In this case, we needed `i`, `j`, and `k` to fully capture the situation.

2. **Think about merging vs. immediate removal:** When you have the option to either act now or delay action for potential future benefit, consider both possibilities in your recurrence relation.

3. **Interval DP often needs additional dimensions:** Basic interval DP uses `dp[i][j]`, but many problems require extra parameters (like `k` here) to track additional context about what's outside the current interval.

Related problems: [Strange Printer](/problem/strange-printer), [Number of Unique Flavors After Sharing K Candies](/problem/number-of-unique-flavors-after-sharing-k-candies)
