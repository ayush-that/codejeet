---
title: "How to Solve Stamping the Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stamping the Grid. Hard difficulty, 35.0% acceptance rate. Topics: Array, Greedy, Matrix, Prefix Sum."
date: "2026-05-25"
category: "dsa-patterns"
tags: ["stamping-the-grid", "array", "greedy", "matrix", "hard"]
---

# How to Solve Stamping the Grid

You're given a binary matrix where `1` represents occupied cells and `0` represents empty cells, along with a stamp of given dimensions. The challenge is to determine if you can cover all empty cells with stamps without covering any occupied cells, where stamps can overlap but must stay within the grid boundaries. What makes this problem tricky is that stamps can overlap, which creates dependencies between stamp placements, and we need to verify coverage of all empty cells efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
Grid (3x4):
0 0 0 0
0 1 0 0
0 0 0 0

Stamp: 2x2
```

**Step 1: Identify where stamps CAN be placed**
A 2x2 stamp can be placed starting at any position (i,j) where:

- i ≤ 3-2 = 1 (rows 0 or 1)
- j ≤ 4-2 = 2 (columns 0, 1, or 2)

But we also need to ensure the stamp doesn't cover any `1`s. Let's check each possible position:

- (0,0): Covers cells (0,0), (0,1), (1,0), (1,1) → contains (1,1) which is `1` ❌
- (0,1): Covers (0,1), (0,2), (1,1), (1,2) → contains (1,1) which is `1` ❌
- (0,2): Covers (0,2), (0,3), (1,2), (1,3) → all `0`s ✅
- (1,0): Covers (1,0), (1,1), (2,0), (2,1) → contains (1,1) which is `1` ❌
- (1,1): Covers (1,1), (1,2), (2,1), (2,2) → contains (1,1) which is `1` ❌
- (1,2): Covers (1,2), (1,3), (2,2), (2,3) → all `0`s ✅

So stamps can be placed at (0,2) and (1,2).

**Step 2: Simulate stamping**
We need to cover all `0` cells. Let's track coverage:

Initial empty cells: All `0`s except (1,1)
After placing stamp at (0,2): Covers (0,2), (0,3), (1,2), (1,3)
After placing stamp at (1,2): Covers (1,2), (1,3), (2,2), (2,3)

Check uncovered `0`s: (0,0), (0,1), (1,0), (2,0), (2,1) remain uncovered! ❌

But wait - stamps can overlap! What if we placed stamps differently? Actually, with 2x2 stamps, we can't cover those remaining cells because they're isolated from the positions where stamps can be placed. The answer is `false`.

This example shows why we need a systematic approach: we need to check ALL possible stamp placements and their coverage, not just obvious ones.

## Brute Force Approach

A naive approach would be to try all possible stamp placements and check if we can cover all empty cells. Here's what that might look like:

1. Generate all possible stamp positions (top-left corners)
2. For each position, check if the stamp fits (doesn't cover any `1`s)
3. Try all combinations of valid stamp positions to see if they cover all `0`s

The problem with this approach is combinatorial explosion. For an m×n grid, there are O(m×n) possible stamp positions. Checking all combinations would be O(2^(m×n)), which is completely infeasible.

Even a greedy approach of placing stamps wherever possible and hoping they cover everything fails because:

- Stamps can overlap, so placing one stamp might make it harder to place others
- We need to ensure EVERY empty cell gets covered, not just most of them

## Optimized Approach

The key insight is to think in reverse: instead of placing stamps to cover empty cells, imagine we start with all cells "stamped" and remove stamps to reveal the original grid. This reversal is powerful because:

1. **Stamp removal is easier to track**: When we "remove" a stamp, we're effectively saying "this area could have been covered by a stamp"
2. **We can use difference arrays**: By tracking the net effect of stamp removals, we can efficiently compute which cells end up uncovered
3. **We process from bottom-right to top-left**: This ensures we handle dependencies correctly

Here's the step-by-step reasoning:

**Step 1: Precompute prefix sums**
We need to quickly check if a stamp area contains any `1`s. A 2D prefix sum lets us compute the sum of any rectangle in O(1) time. If the sum of `1`s in a potential stamp area is > 0, we can't place a stamp there.

**Step 2: Create a difference array**
We'll maintain a 2D difference array that tracks the net effect of stamp placements. When we decide a stamp CAN be placed at (i,j), we mark its effect in the difference array.

**Step 3: Process in reverse order**
We iterate from bottom-right to top-left. At each cell (i,j), we check if a stamp starting here would be valid (no `1`s in the area). If valid, we "apply" the stamp by updating the difference array.

**Step 4: Check final coverage**
After processing all possible stamp positions, we check if any empty cell remains uncovered. If all empty cells are covered, return `true`.

The clever part is that by processing in reverse and using a difference array, we ensure that if a cell needs to be covered by multiple stamps, we count it correctly.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def possibleToStamp(grid, stampHeight, stampWidth):
    """
    Returns True if all empty cells (0s) can be covered by stamps
    without covering any occupied cells (1s).
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Build prefix sum array for quick sum queries
    # prefix[i+1][j+1] = sum of grid[0..i][0..j]
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            prefix[i+1][j+1] = (grid[i][j]
                               + prefix[i][j+1]
                               + prefix[i+1][j]
                               - prefix[i][j])

    # Step 2: Create difference array to track stamp coverage
    # diff[i][j] tracks net stamps covering cell (i,j)
    diff = [[0] * (n + 1) for _ in range(m + 1)]

    # Step 3: Process from bottom-right to top-left
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            # Check if we can place a stamp with top-left at (i,j)
            if grid[i][j] == 0:
                # Calculate bottom-right corner of stamp
                x, y = i + stampHeight, j + stampWidth

                # Check if stamp fits within grid
                if x <= m and y <= n:
                    # Calculate sum of 1s in the stamp area using prefix sum
                    # If sum > 0, stamp would cover a 1 (invalid)
                    area_sum = (prefix[x][y]
                               - prefix[i][y]
                               - prefix[x][j]
                               + prefix[i][j])

                    # If no 1s in the area, we can place a stamp here
                    if area_sum == 0:
                        # Mark the stamp coverage in difference array
                        diff[i][j] += 1
                        diff[i][y] -= 1
                        diff[x][j] -= 1
                        diff[x][y] += 1

            # Propagate the difference values to current cell
            # This accumulates stamps covering (i,j) from cells below/right
            diff[i][j] += diff[i+1][j] + diff[i][j+1] - diff[i+1][j+1]

            # Step 4: Check if current empty cell is covered
            # If grid[i][j] is empty and no stamps cover it, return False
            if grid[i][j] == 0 and diff[i][j] == 0:
                return False

    return True
```

```javascript
// Time: O(m*n) | Space: O(m*n)
function possibleToStamp(grid, stampHeight, stampWidth) {
  const m = grid.length,
    n = grid[0].length;

  // Step 1: Build prefix sum array
  const prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      prefix[i + 1][j + 1] = grid[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }

  // Step 2: Create difference array
  const diff = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Step 3: Process from bottom-right to top-left
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // Check if we can place stamp at (i,j)
      if (grid[i][j] === 0) {
        const x = i + stampHeight,
          y = j + stampWidth;

        // Check if stamp fits
        if (x <= m && y <= n) {
          // Calculate sum in stamp area
          const areaSum = prefix[x][y] - prefix[i][y] - prefix[x][j] + prefix[i][j];

          // If no occupied cells in area, place stamp
          if (areaSum === 0) {
            diff[i][j] += 1;
            diff[i][y] -= 1;
            diff[x][j] -= 1;
            diff[x][y] += 1;
          }
        }
      }

      // Accumulate difference values
      diff[i][j] += diff[i + 1][j] + diff[i][j + 1] - diff[i + 1][j + 1];

      // Step 4: Check coverage
      if (grid[i][j] === 0 && diff[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}
```

```java
// Time: O(m*n) | Space: O(m*n)
class Solution {
    public boolean possibleToStamp(int[][] grid, int stampHeight, int stampWidth) {
        int m = grid.length, n = grid[0].length;

        // Step 1: Build prefix sum array
        int[][] prefix = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = grid[i][j] + prefix[i][j + 1] +
                                       prefix[i + 1][j] - prefix[i][j];
            }
        }

        // Step 2: Create difference array
        int[][] diff = new int[m + 1][n + 1];

        // Step 3: Process from bottom-right to top-left
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // Check if we can place stamp at (i,j)
                if (grid[i][j] == 0) {
                    int x = i + stampHeight, y = j + stampWidth;

                    // Check if stamp fits within bounds
                    if (x <= m && y <= n) {
                        // Calculate sum of 1s in stamp area
                        int areaSum = prefix[x][y] - prefix[i][y] -
                                     prefix[x][j] + prefix[i][j];

                        // If no occupied cells, place stamp
                        if (areaSum == 0) {
                            diff[i][j] += 1;
                            diff[i][y] -= 1;
                            diff[x][j] -= 1;
                            diff[x][y] += 1;
                        }
                    }
                }

                // Accumulate difference values from cells below and right
                diff[i][j] += diff[i + 1][j] + diff[i][j + 1] - diff[i + 1][j + 1];

                // Step 4: Check if current empty cell is covered
                if (grid[i][j] == 0 && diff[i][j] == 0) {
                    return false;
                }
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- Building the prefix sum array: O(m×n)
- Processing each cell in reverse order: O(m×n)
- Each cell does O(1) work (prefix sum queries and difference array updates)
- Total: O(m×n) + O(m×n) = O(m×n)

**Space Complexity: O(m×n)**

- Prefix sum array: (m+1)×(n+1) = O(m×n)
- Difference array: (m+1)×(n+1) = O(m×n)
- Total: O(m×n)

The space can be optimized to O(n) by using rolling arrays, but O(m×n) is usually acceptable for interview settings and keeps the code clearer.

## Common Mistakes

1. **Wrong iteration direction**: Processing top-left to bottom-right fails because you don't know if cells below/right will be covered. Reverse processing ensures you only place stamps where they're actually needed.

2. **Forgetting to check stamp bounds**: When calculating x = i + stampHeight and y = j + stampWidth, you must check x ≤ m and y ≤ n. Going out of bounds is a common off-by-one error.

3. **Incorrect prefix sum formula**: The formula for rectangle sum is:
   `sum = prefix[x][y] - prefix[i][y] - prefix[x][j] + prefix[i][j]`
   Getting the signs wrong or mixing up indices will give incorrect results.

4. **Not handling the difference array correctly**: The difference array update uses the "2D difference array" pattern:
   - +1 at top-left
   - -1 at top-right+1
   - -1 at bottom-left+1
   - +1 at bottom-right+1
     Missing any of these four updates breaks the accumulation.

## When You'll See This Pattern

This problem combines several important patterns:

1. **2D Prefix Sum**: Used in problems like:
   - **Matrix Block Sum (Medium)**: Calculate sum of submatrices efficiently
   - **Range Sum Query 2D (Medium)**: Similar prefix sum application

2. **Difference Array**: Used in problems like:
   - **Range Addition (Medium)**: Track multiple range updates efficiently
   - **Corporate Flight Bookings (Medium)**: Another difference array application

3. **Reverse Thinking/Greedy**: Used in problems like:
   - **Candy (Hard)**: Sometimes processing in reverse simplifies the logic
   - **Gas Station (Medium)**: Thinking about the problem backwards can help

The combination of prefix sums for quick area queries and difference arrays for tracking overlapping updates is powerful for grid-based problems with rectangular operations.

## Key Takeaways

1. **When you need to check rectangular areas quickly, think prefix sums**: The 2D prefix sum lets you compute the sum of any rectangle in O(1) time, which is essential for checking if a stamp would cover any occupied cells.

2. **Difference arrays efficiently track overlapping operations**: When multiple operations (stamp placements) can affect the same cells, a difference array with accumulation lets you compute the net effect in linear time.

3. **Sometimes reverse processing simplifies dependencies**: By processing from bottom-right to top-left, we ensure that when we consider placing a stamp at (i,j), we already know about stamps that could cover cells below or to the right, making the decision local and greedy.

Related problems: [Maximal Square](/problem/maximal-square), [Bomb Enemy](/problem/bomb-enemy), [Matrix Block Sum](/problem/matrix-block-sum)
