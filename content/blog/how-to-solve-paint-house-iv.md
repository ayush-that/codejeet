---
title: "How to Solve Paint House IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Paint House IV. Medium difficulty, 45.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-05-16"
category: "dsa-patterns"
tags: ["paint-house-iv", "array", "dynamic-programming", "medium"]
---

# How to Solve Paint House IV

You're given `n` houses in a line and a `cost` matrix where `cost[i][j]` is the price to paint house `i` with color `j+1`. The challenge: find the **minimum cost** to paint all houses such that **no two adjacent houses have the same color**. This is a classic dynamic programming problem that tests your ability to recognize overlapping subproblems and optimal substructure. The twist here is that we're working with exactly 3 colors (0, 1, 2), which simplifies our state space compared to the more general Paint House III problem.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have `n = 2` houses with these costs:

```
House 0: [17, 2, 17]  (costs for colors 0, 1, 2)
House 1: [16, 14, 5]  (costs for colors 0, 1, 2)
```

We need to find the minimum total cost while ensuring adjacent houses have different colors.

**Step-by-step reasoning:**

1. For house 0, we have three choices:
   - Paint it color 0: cost = 17
   - Paint it color 1: cost = 2
   - Paint it color 2: cost = 17

2. For house 1, our choice depends on what color we chose for house 0:
   - If house 0 was color 0, house 1 can be color 1 (cost 14) or color 2 (cost 5)
   - If house 0 was color 1, house 1 can be color 0 (cost 16) or color 2 (cost 5)
   - If house 0 was color 2, house 1 can be color 0 (cost 16) or color 1 (cost 14)

3. Let's calculate all valid combinations:
   - Color 0 then color 1: 17 + 14 = 31
   - Color 0 then color 2: 17 + 5 = 22
   - Color 1 then color 0: 2 + 16 = 18 ← minimum!
   - Color 1 then color 2: 2 + 5 = 7
   - Color 2 then color 0: 17 + 16 = 33
   - Color 2 then color 1: 17 + 14 = 31

The minimum total cost is 7 (house 0 color 1, house 1 color 2).

Notice the pattern: for each house, the minimum cost depends only on the color of the previous house. This suggests dynamic programming where `dp[i][c]` represents the minimum cost to paint houses `0..i` with house `i` painted color `c`.

## Brute Force Approach

The brute force solution would try all possible color combinations for all houses. Since each house has 3 color choices and we have `n` houses, there are `3^n` possible combinations. For each combination, we'd need to:

1. Check if it's valid (no adjacent houses with same color)
2. Calculate the total cost
3. Track the minimum valid cost

Here's what that might look like:

<div class="code-group">

```python
# Time: O(3^n) | Space: O(n) for recursion stack
def minCostBruteForce(cost):
    n = len(cost)

    def dfs(house_idx, prev_color, current_cost):
        # Base case: all houses painted
        if house_idx == n:
            return current_cost

        min_cost = float('inf')
        # Try all colors for current house
        for color in range(3):
            if color != prev_color:  # Adjacent constraint
                cost_to_paint = cost[house_idx][color]
                min_cost = min(min_cost,
                              dfs(house_idx + 1, color, current_cost + cost_to_paint))

        return min_cost

    # Start with house 0, no previous color (-1)
    return dfs(0, -1, 0)
```

```javascript
// Time: O(3^n) | Space: O(n) for recursion stack
function minCostBruteForce(cost) {
  const n = cost.length;

  function dfs(houseIdx, prevColor, currentCost) {
    // Base case: all houses painted
    if (houseIdx === n) {
      return currentCost;
    }

    let minCost = Infinity;
    // Try all colors for current house
    for (let color = 0; color < 3; color++) {
      if (color !== prevColor) {
        // Adjacent constraint
        const costToPaint = cost[houseIdx][color];
        minCost = Math.min(minCost, dfs(houseIdx + 1, color, currentCost + costToPaint));
      }
    }

    return minCost;
  }

  // Start with house 0, no previous color (-1)
  return dfs(0, -1, 0);
}
```

```java
// Time: O(3^n) | Space: O(n) for recursion stack
public int minCostBruteForce(int[][] cost) {
    int n = cost.length;
    return dfs(0, -1, 0, cost, n);
}

private int dfs(int houseIdx, int prevColor, int currentCost, int[][] cost, int n) {
    // Base case: all houses painted
    if (houseIdx == n) {
        return currentCost;
    }

    int minCost = Integer.MAX_VALUE;
    // Try all colors for current house
    for (int color = 0; color < 3; color++) {
        if (color != prevColor) {  // Adjacent constraint
            int costToPaint = cost[houseIdx][color];
            minCost = Math.min(minCost,
                             dfs(houseIdx + 1, color, currentCost + costToPaint, cost, n));
        }
    }

    return minCost;
}
```

</div>

**Why this is inefficient:** With `3^n` combinations, even for moderate `n` (like 20), we'd have over 3.4 billion combinations to check. This exponential growth makes the brute force approach impractical for typical constraints where `n` can be up to 100 or more.

## Optimized Approach

The key insight is that this problem exhibits **optimal substructure** and **overlapping subproblems**:

- **Optimal substructure**: The minimum cost to paint houses `0..i` ending with color `c` depends on the minimum cost to paint houses `0..(i-1)` ending with any color except `c`.
- **Overlapping subproblems**: When calculating `dp[i][c]` for different `c` values, we repeatedly need the minimum costs from the previous house.

We can use dynamic programming with state `dp[i][c]` = minimum cost to paint houses `0..i` with house `i` painted color `c`.

The recurrence relation is:

```
dp[i][c] = cost[i][c] + min(dp[i-1][k]) for all k != c
```

For the base case (house 0):

```
dp[0][c] = cost[0][c] for c = 0, 1, 2
```

The final answer is `min(dp[n-1][c])` for `c = 0, 1, 2`.

**Space optimization**: Notice we only need the previous row to compute the current row, so we can reduce space from `O(n)` to `O(1)` by keeping just two arrays (previous and current).

## Optimal Solution

Here's the optimized dynamic programming solution with space optimization:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - only need previous row
def minCost(cost):
    """
    Calculate minimum cost to paint all houses with no adjacent same colors.

    Args:
        cost: List[List[int]] - cost[i][j] is cost to paint house i with color j

    Returns:
        int: Minimum total cost
    """
    n = len(cost)

    # Base case: if no houses, cost is 0
    if n == 0:
        return 0

    # Initialize dp for first house
    # prev[0], prev[1], prev[2] represent min cost ending with colors 0, 1, 2
    prev = cost[0][:]  # Make a copy of first row

    # Process each house starting from the second one
    for i in range(1, n):
        # Create current row to store results for house i
        curr = [0] * 3

        # For each possible color for current house
        for color in range(3):
            # Find minimum cost from previous house with different color
            min_prev = float('inf')
            for prev_color in range(3):
                if prev_color != color:
                    min_prev = min(min_prev, prev[prev_color])

            # Current cost = cost to paint this house with 'color' + best previous cost
            curr[color] = cost[i][color] + min_prev

        # Update prev for next iteration
        prev = curr

    # Answer is minimum of the three possible ending colors
    return min(prev)
```

```javascript
// Time: O(n) | Space: O(1) - only need previous row
function minCost(cost) {
  /**
   * Calculate minimum cost to paint all houses with no adjacent same colors.
   *
   * @param {number[][]} cost - cost[i][j] is cost to paint house i with color j
   * @return {number} Minimum total cost
   */
  const n = cost.length;

  // Base case: if no houses, cost is 0
  if (n === 0) {
    return 0;
  }

  // Initialize dp for first house
  // prev[0], prev[1], prev[2] represent min cost ending with colors 0, 1, 2
  let prev = [...cost[0]]; // Copy first row

  // Process each house starting from the second one
  for (let i = 1; i < n; i++) {
    // Create current row to store results for house i
    const curr = new Array(3).fill(0);

    // For each possible color for current house
    for (let color = 0; color < 3; color++) {
      // Find minimum cost from previous house with different color
      let minPrev = Infinity;
      for (let prevColor = 0; prevColor < 3; prevColor++) {
        if (prevColor !== color) {
          minPrev = Math.min(minPrev, prev[prevColor]);
        }
      }

      // Current cost = cost to paint this house with 'color' + best previous cost
      curr[color] = cost[i][color] + minPrev;
    }

    // Update prev for next iteration
    prev = curr;
  }

  // Answer is minimum of the three possible ending colors
  return Math.min(...prev);
}
```

```java
// Time: O(n) | Space: O(1) - only need previous row
public int minCost(int[][] cost) {
    /**
     * Calculate minimum cost to paint all houses with no adjacent same colors.
     *
     * @param cost - cost[i][j] is cost to paint house i with color j
     * @return Minimum total cost
     */
    int n = cost.length;

    // Base case: if no houses, cost is 0
    if (n == 0) {
        return 0;
    }

    // Initialize dp for first house
    // prev[0], prev[1], prev[2] represent min cost ending with colors 0, 1, 2
    int[] prev = new int[3];
    System.arraycopy(cost[0], 0, prev, 0, 3);

    // Process each house starting from the second one
    for (int i = 1; i < n; i++) {
        // Create current row to store results for house i
        int[] curr = new int[3];

        // For each possible color for current house
        for (int color = 0; color < 3; color++) {
            // Find minimum cost from previous house with different color
            int minPrev = Integer.MAX_VALUE;
            for (int prevColor = 0; prevColor < 3; prevColor++) {
                if (prevColor != color) {
                    minPrev = Math.min(minPrev, prev[prevColor]);
                }
            }

            // Current cost = cost to paint this house with 'color' + best previous cost
            curr[color] = cost[i][color] + minPrev;
        }

        // Update prev for next iteration
        prev = curr;
    }

    // Answer is minimum of the three possible ending colors
    return Math.min(prev[0], Math.min(prev[1], prev[2]));
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` houses once
- For each house, we iterate through 3 colors, and for each color, we check 2 other colors (since we exclude the same color)
- This gives us `n * 3 * 2 = 6n` operations, which simplifies to `O(n)`

**Space Complexity: O(1)**

- We only store two arrays of size 3: `prev` and `curr`
- This constant space usage doesn't depend on `n`
- Even if we used the full `n x 3` DP table, it would be `O(n)`, but our optimized version uses `O(1)`

## Common Mistakes

1. **Forgetting the adjacent color constraint**: The most common error is not checking that adjacent houses have different colors. Always verify your recurrence relation includes `prev_color != color`.

2. **Incorrect base case initialization**: Some candidates initialize `dp[0][c] = 0` instead of `dp[0][c] = cost[0][c]`. Remember, the first house still has a painting cost!

3. **Off-by-one errors in iteration**: When using 0-based indexing, ensure you start from house 1 (index 1) when processing, since house 0 is handled in initialization.

4. **Not handling empty input**: Always check if `n == 0` and return 0. While the problem states `n` is even, defensive programming is good practice.

5. **Space optimization pitfalls**: When updating `prev = curr`, make sure you're creating a new array or deep copy, not just a reference. In Python, use `prev = curr[:]` or `list(curr)`.

## When You'll See This Pattern

This "minimum cost with adjacency constraints" pattern appears in many DP problems:

1. **Paint House (LeetCode 256)**: The original problem with exactly 3 colors and `n` houses. Paint House IV is essentially the same problem.

2. **Paint House II (LeetCode 265)**: Generalization to `k` colors instead of just 3. The solution uses the same DP approach but needs `O(k)` time per house.

3. **House Robber (LeetCode 198)**: Similar adjacency constraint (can't rob adjacent houses), though it's simpler with binary decisions.

4. **Minimum Falling Path Sum (LeetCode 931)**: Grid version where you can't reuse the same column in adjacent rows.

The core pattern is: when a decision at step `i` depends on the decision at step `i-1` (but not earlier steps), and you need to minimize/maximize some value, 1D or 2D DP is often the solution.

## Key Takeaways

1. **Recognize sequential decision problems**: When you have a sequence of decisions where each depends only on the previous one (Markov property), dynamic programming is likely applicable.

2. **Look for state compression**: If your DP state only depends on the previous step, you can often reduce space from `O(n)` to `O(1)` by only storing the previous row/state.

3. **3 colors is a hint**: The fact that there are exactly 3 colors (not `k`) simplifies the problem. You can hardcode the color loops instead of making them generic, which makes the code cleaner and slightly faster.

4. **Always verify constraints**: The adjacency constraint (`color != prev_color`) is crucial. Missing it gives a completely different (and wrong) solution.

Related problems: [Paint House III](/problem/paint-house-iii)
