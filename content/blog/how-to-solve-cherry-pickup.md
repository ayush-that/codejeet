---
title: "How to Solve Cherry Pickup — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cherry Pickup. Hard difficulty, 39.1% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2027-04-16"
category: "dsa-patterns"
tags: ["cherry-pickup", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Cherry Pickup

Cherry Pickup is a challenging grid-based dynamic programming problem where you need to find two paths from (0,0) to (n-1,n-1) and back that collect the maximum number of cherries. The twist is that cherries picked on the first path disappear and can't be collected again on the return trip. This makes the problem interesting because you can't simply find two independent maximum paths — the paths interact through the cherries they collect.

What makes this problem tricky is that the "go and return" formulation is misleading. A better way to think about it is as two people starting at (0,0) and walking to (n-1,n-1) simultaneously, collecting cherries along their paths. When both people land on the same cell, they only collect its cherry once if it exists.

## Visual Walkthrough

Let's trace through a 3x3 example to build intuition:

```
grid = [
    [0, 1, -1],
    [1, 0, -1],
    [1, 1, 1]
]
```

We need to get from (0,0) to (2,2) and back, but thinking as two people starting together:

**Step 1: Both start at (0,0)**

- Collect cherry at (0,0): 0 cherries (it's empty)
- Total: 0

**Step 2: Possible moves**
Both can move right (R) or down (D). Let's consider one optimal path:

- Person A: R to (0,1), Person B: D to (1,0)
- Person A collects cherry at (0,1): +1
- Person B collects cherry at (1,0): +1
- Total: 2

**Step 3: Continue moving**

- Person A: D to (1,1), Person B: R to (1,1)
- Both reach (1,1) simultaneously
- Collect cherry at (1,1): +1 (only once since they're together)
- Total: 3

**Step 4: Final moves**

- Person A: D to (2,1), Person B: D to (2,1)
- Collect cherry at (2,1): +1
- Total: 4

**Step 5: End**

- Both: R to (2,2)
- Collect cherry at (2,2): +1
- Total: 5

This gives us 5 cherries, which is indeed optimal. Notice how we avoided the thorns at (0,2) and (1,2).

## Brute Force Approach

A naive approach would be to:

1. Find all possible paths from (0,0) to (n-1,n-1)
2. For each path, mark cherries collected
3. Find all possible return paths from (n-1,n-1) to (0,0)
4. For each combination, calculate total cherries (not double-counting)
5. Return the maximum

The problem with this approach is the exponential number of paths. In an n×n grid, there are C(2n-2, n-1) possible paths (choose when to go down vs right), which is roughly O(4ⁿ/√n) — far too large for n up to 50.

Even if we try to optimize by finding the best forward path and then the best backward path independently, this fails because it doesn't account for cherry disappearance. Consider:

```
grid = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
```

The independent approach might take all cherries on the forward path, leaving none for the return, giving 5 + 0 = 5. But we can actually get all 9 cherries by coordinating the two trips.

## Optimized Approach

The key insight is to model this as **two people starting at (0,0) and walking to (n-1,n-1) simultaneously**. At each step, both move one cell (right or down), so after k steps, person A is at (r₁, c₁) and person B at (r₂, c₂), with r₁ + c₁ = r₂ + c₂ = k.

This gives us a 3D DP state: `dp[k][r₁][r₂]` = maximum cherries collected after k steps, with person A at row r₁ and person B at row r₂. We can derive columns from k: c₁ = k - r₁, c₂ = k - r₂.

**Why this works:**

1. Both people always move together in terms of total steps
2. If they land on the same cell, we only count its cherry once
3. We need to check if cells are valid (within bounds and not thorns)
4. We have 4 choices at each step (RR, RD, DR, DD for the two people)

**Transition:**
`dp[k][r₁][r₂] = max(over 4 move combinations) + cherries at (r₁, c₁) + cherries at (r₂, c₂) - correction if same cell`

The correction subtracts one cherry count if both people are on the same cell to avoid double-counting.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^3)
def cherryPickup(grid):
    """
    Calculate maximum cherries two people can collect walking from (0,0) to (n-1,n-1)
    """
    n = len(grid)

    # dp[k][r1][r2] = max cherries after k steps with person1 at row r1, person2 at row r2
    # We only need 2 layers since we only reference k-1
    dp = [[[-float('inf')] * n for _ in range(n)] for _ in range(2 * n - 1)]

    # Base case: both start at (0,0), 0 steps taken
    dp[0][0][0] = grid[0][0]

    # Iterate over total steps taken
    for k in range(1, 2 * n - 1):
        # r1 ranges from max(0, k-(n-1)) to min(k, n-1)
        for r1 in range(max(0, k - (n - 1)), min(k, n - 1) + 1):
            c1 = k - r1
            # Skip if cell is a thorn or out of bounds (c1 check)
            if c1 < 0 or c1 >= n or grid[r1][c1] == -1:
                continue

            for r2 in range(max(0, k - (n - 1)), min(k, n - 1) + 1):
                c2 = k - r2
                # Skip if cell is a thorn or out of bounds
                if c2 < 0 or c2 >= n or grid[r2][c2] == -1:
                    continue

                # Cherries collected at current positions
                cherries = grid[r1][c1]
                if r1 != r2 or c1 != c2:  # Different cells
                    cherries += grid[r2][c2]

                # Try all 4 combinations of previous moves
                best_prev = -float('inf')

                # Previous positions could be:
                # Both came from up, both from left, or one up one left
                for dr1 in (r1 - 1, r1):
                    for dr2 in (r2 - 1, r2):
                        if dr1 >= 0 and dr2 >= 0:
                            best_prev = max(best_prev, dp[k-1][dr1][dr2])

                # If we found a valid previous state, update current
                if best_prev != -float('inf'):
                    dp[k][r1][r2] = best_prev + cherries

    # Return result from reaching (n-1, n-1) with both people
    # If unreachable, return 0
    result = dp[2 * n - 2][n - 1][n - 1]
    return max(0, result) if result != -float('inf') else 0
```

```javascript
// Time: O(n^3) | Space: O(n^3)
function cherryPickup(grid) {
  const n = grid.length;

  // dp[k][r1][r2] = max cherries after k steps
  // We need 2n-1 steps total to reach (n-1, n-1)
  const dp = Array(2 * n - 1)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(n).fill(-Infinity))
    );

  // Base case: start at (0,0)
  dp[0][0][0] = grid[0][0];

  // Iterate over total steps
  for (let k = 1; k < 2 * n - 1; k++) {
    // Valid row range for this step count
    const minRow = Math.max(0, k - (n - 1));
    const maxRow = Math.min(k, n - 1);

    for (let r1 = minRow; r1 <= maxRow; r1++) {
      const c1 = k - r1;
      // Skip invalid cells
      if (c1 < 0 || c1 >= n || grid[r1][c1] === -1) {
        continue;
      }

      for (let r2 = minRow; r2 <= maxRow; r2++) {
        const c2 = k - r2;
        // Skip invalid cells
        if (c2 < 0 || c2 >= n || grid[r2][c2] === -1) {
          continue;
        }

        // Calculate cherries at current positions
        let cherries = grid[r1][c1];
        if (r1 !== r2 || c1 !== c2) {
          cherries += grid[r2][c2];
        }

        // Try all 4 combinations of previous moves
        let bestPrev = -Infinity;

        // Previous rows could be r1-1 or r1, r2-1 or r2
        for (let dr1 of [r1 - 1, r1]) {
          for (let dr2 of [r2 - 1, r2]) {
            if (dr1 >= 0 && dr2 >= 0) {
              bestPrev = Math.max(bestPrev, dp[k - 1][dr1][dr2]);
            }
          }
        }

        // Update if we found a valid path
        if (bestPrev !== -Infinity) {
          dp[k][r1][r2] = bestPrev + cherries;
        }
      }
    }
  }

  const result = dp[2 * n - 2][n - 1][n - 1];
  return result !== -Infinity ? Math.max(0, result) : 0;
}
```

```java
// Time: O(n^3) | Space: O(n^3)
class Solution {
    public int cherryPickup(int[][] grid) {
        int n = grid.length;

        // dp[k][r1][r2] = max cherries after k steps
        int[][][] dp = new int[2 * n - 1][n][n];

        // Initialize with -infinity (use Integer.MIN_VALUE/2 to avoid overflow)
        for (int k = 0; k < 2 * n - 1; k++) {
            for (int r1 = 0; r1 < n; r1++) {
                for (int r2 = 0; r2 < n; r2++) {
                    dp[k][r1][r2] = Integer.MIN_VALUE / 2;
                }
            }
        }

        // Base case
        dp[0][0][0] = grid[0][0];

        // Iterate over steps
        for (int k = 1; k < 2 * n - 1; k++) {
            int minRow = Math.max(0, k - (n - 1));
            int maxRow = Math.min(k, n - 1);

            for (int r1 = minRow; r1 <= maxRow; r1++) {
                int c1 = k - r1;
                if (c1 < 0 || c1 >= n || grid[r1][c1] == -1) {
                    continue;
                }

                for (int r2 = minRow; r2 <= maxRow; r2++) {
                    int c2 = k - r2;
                    if (c2 < 0 || c2 >= n || grid[r2][c2] == -1) {
                        continue;
                    }

                    // Cherries at current positions
                    int cherries = grid[r1][c1];
                    if (r1 != r2 || c1 != c2) {
                        cherries += grid[r2][c2];
                    }

                    // Try previous moves
                    int bestPrev = Integer.MIN_VALUE / 2;

                    // Check all 4 combinations
                    for (int dr1 = r1 - 1; dr1 <= r1; dr1++) {
                        if (dr1 < 0) continue;
                        for (int dr2 = r2 - 1; dr2 <= r2; dr2++) {
                            if (dr2 < 0) continue;
                            bestPrev = Math.max(bestPrev, dp[k-1][dr1][dr2]);
                        }
                    }

                    // Update if valid path exists
                    if (bestPrev != Integer.MIN_VALUE / 2) {
                        dp[k][r1][r2] = bestPrev + cherries;
                    }
                }
            }
        }

        int result = dp[2 * n - 2][n - 1][n - 1];
        return result > 0 ? result : 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³)

- We iterate over k from 0 to 2n-2: O(n) steps
- For each k, we iterate over r1 and r2: O(n²) combinations
- Total: O(n) × O(n²) = O(n³)

**Space Complexity:** O(n³)

- The DP table has dimensions (2n-1) × n × n
- We could optimize to O(n²) by only storing two layers (current and previous k), but the O(n³) solution is clearer for understanding

## Common Mistakes

1. **Trying to find two independent maximum paths**: This fails because cherries disappear after being picked. The forward and return trips are interdependent.

2. **Incorrect bounds checking**: Forgetting to check that c1 and c2 are within [0, n-1] when computing from k and r. The relationship c = k - r must yield valid column indices.

3. **Double-counting cherries when both people are on the same cell**: This is subtle — when r1 = r2 AND c1 = c2, we should only add grid[r1][c1] once, not twice.

4. **Not handling unreachable cases**: If (n-1, n-1) is blocked by thorns or unreachable, we should return 0. The DP might remain at -∞, which needs to be converted to 0.

## When You'll See This Pattern

This "two simultaneous paths" DP pattern appears in problems where you need to coordinate multiple agents or find non-interfering paths:

1. **Minimum Path Sum**: Simpler version with one path, uses 2D DP. Cherry Pickup extends this to two coordinated paths.

2. **Dungeon Game**: Also uses grid DP but with different state (minimum health needed). Both require careful state definition and transitions.

3. **Maximum Path Quality of a Graph**: Different domain (graph vs grid) but similar concept of collecting values along paths with constraints.

The key pattern is: when you need to coordinate multiple movements in a grid, consider modeling them as simultaneous processes with a combined state.

## Key Takeaways

1. **Reformulate the problem**: The "go and return" trip is equivalent to two people going from start to end simultaneously. This reformulation enables the DP solution.

2. **Look for synchronization opportunities**: When multiple agents move in a grid, they often move in lockstep (same total steps), which reduces the state space.

3. **Watch for double-counting**: When multiple agents can occupy the same cell, ensure you don't double-count the value of that cell.

Related problems: [Minimum Path Sum](/problem/minimum-path-sum), [Dungeon Game](/problem/dungeon-game), [Maximum Path Quality of a Graph](/problem/maximum-path-quality-of-a-graph)
