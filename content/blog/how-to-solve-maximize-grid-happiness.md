---
title: "How to Solve Maximize Grid Happiness — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Grid Happiness. Hard difficulty, 40.9% acceptance rate. Topics: Dynamic Programming, Bit Manipulation, Memoization, Bitmask."
date: "2026-07-16"
category: "dsa-patterns"
tags: ["maximize-grid-happiness", "dynamic-programming", "bit-manipulation", "memoization", "hard"]
---

# How to Solve Maximize Grid Happiness

This problem asks you to place introverts and extroverts on an m×n grid to maximize "happiness" based on neighbor interactions. What makes it tricky is that happiness depends on who lives next to whom, creating complex dependencies between cells. With constraints up to m=5, n=6, and up to 6 people of each type, brute force trying all placements is impossible (3^(m×n) possibilities). This requires a clever dynamic programming approach with state compression.

## Visual Walkthrough

Let's trace through a small example: m=2, n=2, introvertsCount=1, extrovertsCount=1.

**Grid positions:**

```
(0,0) (0,1)
(1,0) (1,1)
```

**Happiness rules:**

- Introvert: +120 happiness when placed, -30 for each neighbor
- Extrovert: +40 happiness when placed, +20 for each neighbor
- Neighbors only count if they're directly above or left (we process row by row)

**Step-by-step placement:**

1. **Place introvert at (0,0):**
   - Base happiness: +120
   - No neighbors yet: total = 120

2. **Place extrovert at (0,1):**
   - Base happiness: +40
   - Left neighbor is introvert: -30 for introvert, +20 for extrovert
   - Net change: -30 + 20 = -10
   - Total happiness: 120 + 40 - 10 = 150

3. **Alternative: Place extrovert at (0,0), introvert at (0,1):**
   - Extrovert at (0,0): +40
   - Introvert at (0,1): +120, neighbor is extrovert: -30 for introvert, +20 for extrovert
   - Net: 40 + 120 - 30 + 20 = 150

4. **Better: Place them diagonally (no neighbors):**
   - Introvert at (0,0): +120
   - Extrovert at (1,1): +40
   - Total: 160 (optimal!)

This shows neighbor placement matters significantly. We need to systematically try all placements while tracking remaining people and neighbor relationships.

## Brute Force Approach

A naive brute force would try all possible assignments for each cell: empty, introvert, or extrovert. For an m×n grid, that's 3^(m×n) possibilities. With m=5, n=6, that's 3^30 ≈ 2×10^14 possibilities - completely infeasible.

Even with pruning (stopping when we run out of people), the search space is enormous because:

1. We need to track neighbor relationships
2. The order of placement matters for happiness calculation
3. We must respect counts of each person type

The brute force code would involve recursive DFS trying all 3 options per cell, calculating happiness by checking all four neighbors each time. The time complexity O(3^(m×n)) makes it impossible for the given constraints.

## Optimized Approach

The key insight is that we only need to know about the **previous row** to calculate happiness for the current cell. Why? Because:

- Happiness from neighbor interactions only occurs between adjacent cells
- When placing a cell at position (i,j), we only need to know:
  1. What's in the cell above (i-1,j) - vertical neighbor
  2. What's in the cell to the left (i,j-1) - horizontal neighbor
  3. What's in the cell above-left? No, that's not adjacent!

This leads to a **DP with bitmask** approach:

- Process cells row by row, left to right
- Represent each row's state as a base-3 number (0=empty, 1=introvert, 2=extrovert)
- Since n≤6, each row state fits in 3^6 = 729 possibilities
- DP state: dp[pos][prev_row_mask][introverts_left][extroverts_left]
- At each position, try all 3 options, calculate happiness change from left and above neighbors
- Use memoization to avoid recomputation

**Why bitmask works:**

1. Base-3 encoding lets us store empty/introvert/extrovert in 2 bits each
2. We can extract neighbor information using modular arithmetic
3. The state space is manageable: positions × masks × introverts × extroverts = 30 × 729 × 7 × 7 ≈ 1 million states

## Optimal Solution

We implement DP with memoization, processing cells in row-major order. The key function `dfs` takes:

- `pos`: current cell index (0 to m×n-1)
- `prev_row_mask`: base-3 encoded state of previous row
- `in_rem`: introverts remaining
- `ex_rem`: extroverts remaining

For each cell, we try 3 options and calculate happiness contribution from:

1. The cell itself (+120 for introvert, +40 for extrovert)
2. Left neighbor (if exists in current row)
3. Above neighbor (from prev_row_mask)

<div class="code-group">

```python
# Time: O(m*n*3^n*in_rem*ex_rem) ≈ 1M operations
# Space: O(m*n*3^n*in_rem*ex_rem) for memoization
class Solution:
    def getMaxGridHappiness(self, m: int, n: int, introvertsCount: int, extrovertsCount: int) -> int:
        # Base-3 powers for mask operations
        p3 = [1] * (n + 1)
        for i in range(1, n + 1):
            p3[i] = p3[i-1] * 3

        # Memoization dictionary
        memo = {}

        # Precompute happiness changes for neighbor interactions
        # change[a][b] where a=current, b=neighbor
        # 0=empty, 1=introvert, 2=extrovert
        change = [[0]*3 for _ in range(3)]
        change[1][1] = -60  # introvert next to introvert: both lose 30
        change[1][2] = -10  # introvert next to extrovert: -30 + 20
        change[2][1] = -10  # extrovert next to introvert: same as above
        change[2][2] = 40   # extrovert next to extrovert: both gain 20

        def dfs(pos, prev_row_mask, in_rem, ex_rem):
            # Base case: processed all cells
            if pos == m * n:
                return 0

            # Check memoization
            key = (pos, prev_row_mask, in_rem, ex_rem)
            if key in memo:
                return memo[key]

            # Calculate row and column from position
            i, j = divmod(pos, n)

            # Get the state of the cell above (from previous row mask)
            # If we're at first row, there's no cell above
            above = 0 if i == 0 else (prev_row_mask // p3[n-1-j]) % 3

            # Try placing empty cell
            best = dfs(pos + 1, (prev_row_mask * 3) % p3[n], in_rem, ex_rem)

            # Try placing introvert if available
            if in_rem > 0:
                # Base happiness for introvert
                happiness = 120
                # Check left neighbor (in current row)
                if j > 0:
                    left = (prev_row_mask // p3[n-j]) % 3
                    happiness += change[1][left]
                # Check above neighbor
                happiness += change[1][above]
                # Recurse with updated state
                new_mask = prev_row_mask * 3 + 1
                best = max(best, happiness + dfs(pos + 1, new_mask % p3[n], in_rem - 1, ex_rem))

            # Try placing extrovert if available
            if ex_rem > 0:
                # Base happiness for extrovert
                happiness = 40
                # Check left neighbor
                if j > 0:
                    left = (prev_row_mask // p3[n-j]) % 3
                    happiness += change[2][left]
                # Check above neighbor
                happiness += change[2][above]
                # Recurse with updated state
                new_mask = prev_row_mask * 3 + 2
                best = max(best, happiness + dfs(pos + 1, new_mask % p3[n], in_rem, ex_rem - 1))

            memo[key] = best
            return best

        return dfs(0, 0, introvertsCount, extrovertsCount)
```

```javascript
// Time: O(m*n*3^n*in_rem*ex_rem) ≈ 1M operations
// Space: O(m*n*3^n*in_rem*ex_rem) for memoization
var getMaxGridHappiness = function (m, n, introvertsCount, extrovertsCount) {
  // Precompute powers of 3 for mask operations
  const p3 = new Array(n + 1).fill(1);
  for (let i = 1; i <= n; i++) {
    p3[i] = p3[i - 1] * 3;
  }

  // Memoization map
  const memo = new Map();

  // Happiness change matrix: change[current][neighbor]
  // 0=empty, 1=introvert, 2=extrovert
  const change = Array(3)
    .fill()
    .map(() => Array(3).fill(0));
  change[1][1] = -60; // introvert next to introvert
  change[1][2] = -10; // introvert next to extrovert
  change[2][1] = -10; // extrovert next to introvert
  change[2][2] = 40; // extrovert next to extrovert

  function dfs(pos, prevRowMask, inRem, exRem) {
    // Base case: all cells processed
    if (pos === m * n) {
      return 0;
    }

    // Check memoization
    const key = `${pos},${prevRowMask},${inRem},${exRem}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Calculate row and column
    const i = Math.floor(pos / n);
    const j = pos % n;

    // Get state of cell above (from previous row)
    const above = i === 0 ? 0 : Math.floor(prevRowMask / p3[n - 1 - j]) % 3;

    // Try empty cell
    let best = dfs(pos + 1, (prevRowMask * 3) % p3[n], inRem, exRem);

    // Try introvert if available
    if (inRem > 0) {
      let happiness = 120; // base happiness

      // Check left neighbor
      if (j > 0) {
        const left = Math.floor(prevRowMask / p3[n - j]) % 3;
        happiness += change[1][left];
      }

      // Check above neighbor
      happiness += change[1][above];

      // Recurse with updated state
      const newMask = prevRowMask * 3 + 1;
      const result = happiness + dfs(pos + 1, newMask % p3[n], inRem - 1, exRem);
      best = Math.max(best, result);
    }

    // Try extrovert if available
    if (exRem > 0) {
      let happiness = 40; // base happiness

      // Check left neighbor
      if (j > 0) {
        const left = Math.floor(prevRowMask / p3[n - j]) % 3;
        happiness += change[2][left];
      }

      // Check above neighbor
      happiness += change[2][above];

      // Recurse with updated state
      const newMask = prevRowMask * 3 + 2;
      const result = happiness + dfs(pos + 1, newMask % p3[n], inRem, exRem - 1);
      best = Math.max(best, result);
    }

    memo.set(key, best);
    return best;
  }

  return dfs(0, 0, introvertsCount, extrovertsCount);
};
```

```java
// Time: O(m*n*3^n*in_rem*ex_rem) ≈ 1M operations
// Space: O(m*n*3^n*in_rem*ex_rem) for memoization
class Solution {
    private int m, n;
    private int[] p3;
    private int[][][][] memo;
    private int[][] change;

    public int getMaxGridHappiness(int m, int n, int introvertsCount, int extrovertsCount) {
        this.m = m;
        this.n = n;

        // Precompute powers of 3
        p3 = new int[n + 1];
        p3[0] = 1;
        for (int i = 1; i <= n; i++) {
            p3[i] = p3[i-1] * 3;
        }

        // Initialize memoization array
        // Dimensions: pos × mask × introverts × extroverts
        memo = new int[m*n][p3[n]][introvertsCount + 1][extrovertsCount + 1];
        for (int[][][] arr3 : memo) {
            for (int[][] arr2 : arr3) {
                for (int[] arr1 : arr2) {
                    Arrays.fill(arr1, -1);
                }
            }
        }

        // Happiness change matrix
        change = new int[3][3];
        change[1][1] = -60;  // introvert next to introvert
        change[1][2] = -10;  // introvert next to extrovert
        change[2][1] = -10;  // extrovert next to introvert
        change[2][2] = 40;   // extrovert next to extrovert

        return dfs(0, 0, introvertsCount, extrovertsCount);
    }

    private int dfs(int pos, int prevRowMask, int inRem, int exRem) {
        // Base case: processed all cells
        if (pos == m * n) {
            return 0;
        }

        // Check memoization
        if (memo[pos][prevRowMask][inRem][exRem] != -1) {
            return memo[pos][prevRowMask][inRem][exRem];
        }

        // Calculate row and column
        int i = pos / n;
        int j = pos % n;

        // Get state of cell above
        int above = (i == 0) ? 0 : (prevRowMask / p3[n-1-j]) % 3;

        // Try empty cell
        int best = dfs(pos + 1, (prevRowMask * 3) % p3[n], inRem, exRem);

        // Try introvert if available
        if (inRem > 0) {
            int happiness = 120;  // base happiness

            // Check left neighbor
            if (j > 0) {
                int left = (prevRowMask / p3[n-j]) % 3;
                happiness += change[1][left];
            }

            // Check above neighbor
            happiness += change[1][above];

            // Recurse with updated state
            int newMask = prevRowMask * 3 + 1;
            int result = happiness + dfs(pos + 1, newMask % p3[n], inRem - 1, exRem);
            best = Math.max(best, result);
        }

        // Try extrovert if available
        if (exRem > 0) {
            int happiness = 40;  // base happiness

            // Check left neighbor
            if (j > 0) {
                int left = (prevRowMask / p3[n-j]) % 3;
                happiness += change[2][left];
            }

            // Check above neighbor
            happiness += change[2][above];

            // Recurse with updated state
            int newMask = prevRowMask * 3 + 2;
            int result = happiness + dfs(pos + 1, newMask % p3[n], inRem, exRem - 1);
            best = Math.max(best, result);
        }

        memo[pos][prevRowMask][inRem][exRem] = best;
        return best;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × 3^n × introvertsCount × extrovertsCount)

- We have m×n positions
- For each position, we consider 3^n possible previous row states (but actually much less due to constraints)
- We also track remaining introverts and extroverts (up to 6 each)
- In practice: 30 × 729 × 7 × 7 ≈ 1.07 million states
- Each state does O(1) work (just trying 3 options)

**Space Complexity:** O(m × n × 3^n × introvertsCount × extrovertsCount) for memoization

- Same as time complexity for storing all DP states
- Can be optimized to O(3^n × introvertsCount × extrovertsCount) by only storing current and previous rows

## Common Mistakes

1. **Forgetting to mod the mask:** When building the new mask for the next cell, we must take `% p3[n]` to keep it within bounds for the row length. Without this, masks grow infinitely large.

2. **Incorrect neighbor calculation:** The trickiest part is extracting left and above neighbors from the mask. Remember:
   - Left neighbor: `(mask / p3[n-j]) % 3` (not n-1-j)
   - Above neighbor: `(mask / p3[n-1-j]) % 3`
   - Test these with small examples!

3. **Double-counting happiness changes:** When two neighbors affect each other, the happiness change must be counted for BOTH cells. Our `change` matrix handles this correctly by including both sides' contributions.

4. **Not using memoization:** Some candidates try pure DFS without memoization, which leads to exponential time. The constraints demand DP/memoization.

## When You'll See This Pattern

This **DP with bitmask** pattern appears in grid problems where:

1. The state of each cell affects neighbors
2. The grid dimensions are small (usually ≤ 10-15)
3. You need to track a "profile" of the previous row

**Related LeetCode problems:**

1. **Number of Ways to Paint N×3 Grid (LeetCode 1411)** - Similar DP with color states, but simpler neighbor constraints
2. **Maximum Students Taking Exam (LeetCode 1349)** - Students can't sit next to each other, uses similar row mask DP
3. **Tiling a Rectangle with the Fewest Squares (LeetCode 1240)** - Different but uses similar state compression techniques

## Key Takeaways

1. **Row-by-row DP with bitmask** works when neighbor interactions are limited to adjacent cells. Encode each row's state as a base-k number where k is the number of possible cell states.

2. **Small constraints hint at state compression** - When m,n ≤ 5-6 and people counts ≤ 6, think about DP with dimensions tracking all these constraints.

3. **Precompute interaction costs** - Creating a `change` matrix upfront makes the code cleaner and avoids complex conditional logic when calculating happiness changes.

[Practice this problem on CodeJeet](/problem/maximize-grid-happiness)
