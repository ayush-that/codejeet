---
title: "How to Solve Paint House III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Paint House III. Hard difficulty, 61.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-01-18"
category: "dsa-patterns"
tags: ["paint-house-iii", "array", "dynamic-programming", "hard"]
---

# How to Solve Paint House III

You're given `m` houses in a row, each can be painted with one of `n` colors. Some houses are already painted (with colors 1 to `n` or 0 if unpainted). Painting a house costs different amounts depending on the color. After painting all houses, you want exactly `target` neighborhoods (contiguous houses with same color). Find the minimum cost to achieve this, or return -1 if impossible.

What makes this problem tricky: You need to track three changing states simultaneously—which house you're at, what color it's painted, and how many neighborhoods you've created so far. The cost depends on current and previous colors, and you must hit an exact neighborhood count. This screams for dynamic programming with careful state transitions.

## Visual Walkthrough

Let's trace a small example:

- Houses: `[0, 0, 0, 0]` (all unpainted)
- Cost matrix: `[[1, 5], [2, 3], [3, 1], [4, 2]]` (4 houses × 2 colors)
- `m = 4`, `n = 2`, `target = 3`

We need exactly 3 neighborhoods. With 4 houses, possible patterns:

- Color pattern `[1, 2, 1, 2]` → neighborhoods: house1(1), house2(2), house3(1), house4(2) = 4 neighborhoods ❌
- Color pattern `[1, 1, 2, 2]` → neighborhoods: (1,1), (2,2) = 2 neighborhoods ❌
- Color pattern `[1, 2, 2, 2]` → neighborhoods: (1), (2,2,2) = 2 neighborhoods ❌
- Color pattern `[1, 1, 2, 1]` → neighborhoods: (1,1), (2), (1) = 3 neighborhoods ✅

We need to find the cheapest way to get exactly 3 neighborhoods. Let's think step-by-step:

**House 1 (index 0):**

- If we paint it color 1: cost = 1, neighborhoods = 1
- If we paint it color 2: cost = 5, neighborhoods = 1

**House 2 (index 1):**

- If house1 was color 1:
  - Paint color 1: cost = 1 + 2 = 3, neighborhoods stays 1 (same color)
  - Paint color 2: cost = 1 + 3 = 4, neighborhoods becomes 2 (new color)
- If house1 was color 2:
  - Paint color 1: cost = 5 + 2 = 7, neighborhoods becomes 2
  - Paint color 2: cost = 5 + 3 = 8, neighborhoods stays 1

We continue this way, tracking minimum cost for each (house, color, neighborhoods) combination.

## Brute Force Approach

A naive approach would try all possible color assignments:

- Each of `m` houses can be painted with `n` colors
- That's `n^m` possibilities
- For each possibility, count neighborhoods and calculate cost
- Keep the minimum cost that matches `target`

This is astronomically slow. Even for small inputs like `m=10`, `n=5`, that's `5^10 ≈ 9.7 million` possibilities. For typical constraints (`m=100`, `n=20`), it's impossible.

The brute force fails because it recomputes the same subproblems repeatedly. If we know the minimum cost to paint the first `i` houses ending with color `c` and having `k` neighborhoods, we can use that to compute solutions for `i+1` houses.

## Optimized Approach

The key insight: This is a **dynamic programming** problem with three dimensions:

1. Which house we're painting (index `i` from 0 to `m-1`)
2. What color we paint it (`color` from 1 to `n`)
3. How many neighborhoods we have so far (`k` from 1 to `target`)

**State definition:**
`dp[i][c][k]` = minimum cost to paint houses 0 through `i` such that:

- House `i` is painted color `c`
- There are exactly `k` neighborhoods in houses 0 through `i`

**Transition:**
When painting house `i` with color `c`:

1. If house `i` is already painted with color `painted[i]`:
   - If `painted[i] != c`, it's impossible → infinite cost
   - If `painted[i] == c`, we use it (cost 0 for this house)
2. Otherwise, add cost `cost[i][c-1]`

For neighborhood count:

- If `c == prevColor` (same as previous house): neighborhoods stays `k`
- If `c != prevColor`: neighborhoods becomes `k+1`

So: `dp[i][c][k] = min over all prevColor of:`

- If `c == prevColor`: `dp[i-1][prevColor][k] + currentCost`
- If `c != prevColor`: `dp[i-1][prevColor][k-1] + currentCost`

**Base case:**
For house 0:

- If already painted with color `p`: only `dp[0][p][1] = 0`
- If unpainted: `dp[0][c][1] = cost[0][c-1]` for all colors `c`

**Answer:**
`min(dp[m-1][c][target])` over all colors `c`

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n^2 * target) | Space: O(m * n * target)
def minCost(houses, cost, m, n, target):
    """
    houses: list of length m, 0 if unpainted, 1..n if already painted
    cost: m x n matrix, cost[i][j] = cost to paint house i with color j+1
    m: number of houses
    n: number of colors
    target: desired number of neighborhoods
    """

    # Initialize DP table with infinity (impossible states)
    # dp[i][c][k] = min cost for first i+1 houses ending with color c, having k neighborhoods
    # Using large number for infinity
    INF = float('inf')
    dp = [[[INF] * (target + 1) for _ in range(n + 1)] for _ in range(m)]

    # Base case: first house (i = 0)
    if houses[0] != 0:
        # House is already painted with fixed color
        color = houses[0]
        dp[0][color][1] = 0  # Cost 0, 1 neighborhood
    else:
        # House is unpainted, try all colors
        for color in range(1, n + 1):
            dp[0][color][1] = cost[0][color - 1]

    # Fill DP table for remaining houses
    for i in range(1, m):
        for color in range(1, n + 1):
            # Skip if current house is already painted with a different color
            if houses[i] != 0 and houses[i] != color:
                continue

            # Cost to paint current house with this color
            current_cost = 0 if houses[i] == color else cost[i][color - 1]

            # Try all possible previous colors
            for prev_color in range(1, n + 1):
                for k in range(1, target + 1):
                    if dp[i - 1][prev_color][k] == INF:
                        continue  # Previous state was impossible

                    # Calculate new neighborhood count
                    new_k = k if color == prev_color else k + 1
                    if new_k > target:
                        continue  # Would exceed target

                    # Update DP value
                    total_cost = dp[i - 1][prev_color][k] + current_cost
                    dp[i][color][new_k] = min(dp[i][color][new_k], total_cost)

    # Find minimum cost among all colors for last house with exactly target neighborhoods
    result = INF
    for color in range(1, n + 1):
        result = min(result, dp[m - 1][color][target])

    return -1 if result == INF else result
```

```javascript
// Time: O(m * n^2 * target) | Space: O(m * n * target)
function minCost(houses, cost, m, n, target) {
  // Initialize DP table with Infinity for impossible states
  const INF = Number.MAX_SAFE_INTEGER;

  // dp[i][c][k] = min cost for first i+1 houses ending with color c, having k neighborhoods
  const dp = Array(m);
  for (let i = 0; i < m; i++) {
    dp[i] = Array(n + 1);
    for (let c = 0; c <= n; c++) {
      dp[i][c] = Array(target + 1).fill(INF);
    }
  }

  // Base case: first house
  if (houses[0] !== 0) {
    // House already painted with fixed color
    const color = houses[0];
    dp[0][color][1] = 0; // Cost 0, 1 neighborhood
  } else {
    // House unpainted, try all colors
    for (let color = 1; color <= n; color++) {
      dp[0][color][1] = cost[0][color - 1];
    }
  }

  // Fill DP table for remaining houses
  for (let i = 1; i < m; i++) {
    for (let color = 1; color <= n; color++) {
      // Skip if house already painted with different color
      if (houses[i] !== 0 && houses[i] !== color) {
        continue;
      }

      // Cost to paint current house with this color
      const currentCost = houses[i] === color ? 0 : cost[i][color - 1];

      // Try all possible previous colors
      for (let prevColor = 1; prevColor <= n; prevColor++) {
        for (let k = 1; k <= target; k++) {
          if (dp[i - 1][prevColor][k] === INF) {
            continue; // Previous state impossible
          }

          // Calculate new neighborhood count
          const newK = color === prevColor ? k : k + 1;
          if (newK > target) {
            continue; // Would exceed target
          }

          // Update DP value
          const totalCost = dp[i - 1][prevColor][k] + currentCost;
          dp[i][color][newK] = Math.min(dp[i][color][newK], totalCost);
        }
      }
    }
  }

  // Find minimum cost for last house with exactly target neighborhoods
  let result = INF;
  for (let color = 1; color <= n; color++) {
    result = Math.min(result, dp[m - 1][color][target]);
  }

  return result === INF ? -1 : result;
}
```

```java
// Time: O(m * n^2 * target) | Space: O(m * n * target)
class Solution {
    public int minCost(int[] houses, int[][] cost, int m, int n, int target) {
        // Initialize DP table with large value for impossible states
        final int INF = Integer.MAX_VALUE / 2;  // Avoid overflow when adding
        int[][][] dp = new int[m][n + 1][target + 1];

        // Fill with INF
        for (int i = 0; i < m; i++) {
            for (int c = 0; c <= n; c++) {
                for (int k = 0; k <= target; k++) {
                    dp[i][c][k] = INF;
                }
            }
        }

        // Base case: first house
        if (houses[0] != 0) {
            // House already painted with fixed color
            int color = houses[0];
            dp[0][color][1] = 0;  // Cost 0, 1 neighborhood
        } else {
            // House unpainted, try all colors
            for (int color = 1; color <= n; color++) {
                dp[0][color][1] = cost[0][color - 1];
            }
        }

        // Fill DP table for remaining houses
        for (int i = 1; i < m; i++) {
            for (int color = 1; color <= n; color++) {
                // Skip if house already painted with different color
                if (houses[i] != 0 && houses[i] != color) {
                    continue;
                }

                // Cost to paint current house with this color
                int currentCost = (houses[i] == color) ? 0 : cost[i][color - 1];

                // Try all possible previous colors
                for (int prevColor = 1; prevColor <= n; prevColor++) {
                    for (int k = 1; k <= target; k++) {
                        if (dp[i - 1][prevColor][k] == INF) {
                            continue;  // Previous state impossible
                        }

                        // Calculate new neighborhood count
                        int newK = (color == prevColor) ? k : k + 1;
                        if (newK > target) {
                            continue;  // Would exceed target
                        }

                        // Update DP value
                        int totalCost = dp[i - 1][prevColor][k] + currentCost;
                        dp[i][color][newK] = Math.min(dp[i][color][newK], totalCost);
                    }
                }
            }
        }

        // Find minimum cost for last house with exactly target neighborhoods
        int result = INF;
        for (int color = 1; color <= n; color++) {
            result = Math.min(result, dp[m - 1][color][target]);
        }

        return result == INF ? -1 : result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n² * target)`

- We iterate through all houses: `m`
- For each house, we try all colors for current house: `n`
- For each current color, we try all previous colors: `n`
- For each previous color, we try all possible neighborhood counts up to `target`
- Total: `m * n * n * target = O(m * n² * target)`

**Space Complexity:** `O(m * n * target)`

- The DP table has dimensions: `m × (n+1) × (target+1)`
- We can optimize to `O(n * target)` by only storing previous row, but the problem constraints usually allow the full table

## Common Mistakes

1. **Forgetting to handle already-painted houses**: If a house is already painted color `p`, you can only use `color = p` for that house. Many candidates miss the check `if houses[i] != 0 and houses[i] != color: continue`.

2. **Off-by-one errors with color indices**: The problem uses 1-based colors (1 to `n`), but the cost matrix is 0-indexed. Remember: `cost[i][color-1]` gives cost for color `color`.

3. **Incorrect neighborhood counting**: When `color == prevColor`, neighborhoods count stays the same (`k`). When different, it becomes `k+1`. Mixing this up gives wrong answers.

4. **Not checking if newK > target**: If adding a neighborhood would exceed target, skip it. Otherwise, you'll access out-of-bounds or waste computation.

## When You'll See This Pattern

This type of **multi-dimensional DP with constraints** appears in problems where you need to:

1. Make a sequence of decisions (painting houses)
2. Track some cumulative metric (neighborhood count)
3. Have dependencies between consecutive decisions (color comparisons)

**Related problems:**

1. **Paint House I & II** (Easy/Medium): Simpler versions without the neighborhood constraint. Paint House II is especially similar but only minimizes total cost.
2. **Number of Distinct Roll Sequences** (Hard): Track previous two rolls in a sequence with constraints, similar multi-dimensional DP.
3. **Student Attendance Record II** (Hard): Track consecutive 'L's and total 'A's, another constrained sequence DP.

## Key Takeaways

1. **When you see "sequence of decisions with cumulative constraint," think multi-dimensional DP**. The dimensions are usually: position in sequence + state of last decision + cumulative metric.

2. **Define states clearly before writing transitions**. Write down exactly what `dp[i][c][k]` means. Clear state definition prevents transition errors.

3. **Handle special cases (already painted houses) early**. Check constraints at the beginning of each iteration to avoid propagating impossible states.

Related problems: [Number of Distinct Roll Sequences](/problem/number-of-distinct-roll-sequences), [Paint House IV](/problem/paint-house-iv)
