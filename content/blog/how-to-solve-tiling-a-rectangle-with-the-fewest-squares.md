---
title: "How to Solve Tiling a Rectangle with the Fewest Squares — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Tiling a Rectangle with the Fewest Squares. Hard difficulty, 54.8% acceptance rate. Topics: Backtracking."
date: "2029-06-24"
category: "dsa-patterns"
tags: ["tiling-a-rectangle-with-the-fewest-squares", "backtracking", "hard"]
---

# How to Solve Tiling a Rectangle with the Fewest Squares

You're given an `n × m` rectangle and need to tile it completely with integer-sided squares, using the fewest squares possible. This problem is tricky because the optimal tiling isn't always obvious—for example, a 5×6 rectangle requires 5 squares, not the 6 you might expect from a greedy approach. The problem becomes a complex optimization challenge where backtracking with pruning is essential.

## Visual Walkthrough

Let's trace through a small example: `n = 5, m = 6`. A naive greedy approach might take the largest possible square (5×5), leaving a 5×1 strip that requires 5 more squares, totaling 6. But the optimal solution uses 5 squares:

1. Place a 3×3 square in the top-left corner
2. Place a 2×2 square in the top-right corner (fits because 3+2=5)
3. Place a 1×1 square in the remaining top-right corner
4. Place a 2×2 square in the bottom-left corner
5. Place a 3×3 square in the bottom-right corner

This gives us 5 squares total. The key insight is that sometimes using a slightly smaller square creates opportunities for better packing elsewhere. This non-greedy behavior is why we need systematic search with backtracking.

## Brute Force Approach

A truly brute force approach would try every possible placement of squares in every possible order, which is astronomically large. Even for a modest 5×6 rectangle, the search space is enormous because:

- At each step, you could place a square of any size from 1 to min(current width, current height)
- You could place it in any available position
- The number of possible sequences grows factorially

A naive candidate might try a greedy "always take the largest square" approach, but as we saw with 5×6, this fails to find the optimal solution. Another naive approach would be dynamic programming based on the rectangle dimensions alone, but this doesn't work because the optimal tiling depends on the specific shape of the remaining area, not just its dimensions.

The problem requires tracking the exact configuration of the rectangle as squares are placed, which leads us to backtracking with state representation.

## Optimized Approach

The key insight is to use backtracking with pruning and memoization:

1. **State representation**: We track the heights of each column from the bottom up. For an `m`-wide rectangle, we maintain an array `heights` of length `m`, where `heights[j]` is how much of column `j` has been filled from the bottom.

2. **Pruning strategies**:
   - Always fill from the lowest available position (leftmost among lowest)
   - Try squares from largest possible size down to smallest
   - Stop if current count exceeds the best found so far
   - Use memoization to avoid revisiting identical states

3. **Optimization**: The problem has known special cases where the answer is simply `max(n, m) / min(n, m)` when one dimension divides the other, but in general we need backtracking.

The algorithm works by:

- Finding the lowest unfilled position
- Trying all possible square sizes that fit there
- Placing a square, updating the heights, and recursing
- Removing the square (backtracking) to try other possibilities

## Optimal Solution

<div class="code-group">

```python
# Time: O(m^n) in worst case, but heavily pruned in practice
# Space: O(m) for the heights array plus recursion depth
class Solution:
    def tilingRectangle(self, n: int, m: int) -> int:
        # Special case: if one dimension divides the other
        if n == m:
            return 1

        # Make sure n <= m for consistency
        if n > m:
            n, m = m, n

        # Initialize heights array - all columns start at height 0
        heights = [0] * m
        self.best = n * m  # Worst case: all 1x1 squares

        def dfs(count):
            # Prune: if we already have more squares than best solution found
            if count >= self.best:
                return

            # Find the lowest unfilled position
            min_height = min(heights)
            if min_height == n:  # All columns filled to the top
                self.best = min(self.best, count)
                return

            # Find leftmost column with minimum height
            start = heights.index(min_height)

            # Try squares from largest possible size down to 1
            # Max size is limited by remaining height and width
            max_size = min(n - min_height, m - start)

            # Important: We need to consider that the square might not fit
            # in all columns from start to start+size-1
            for size in range(max_size, 0, -1):
                # Check if all columns in range [start, start+size-1] have height == min_height
                if all(heights[j] == min_height for j in range(start, start + size)):
                    # Place the square
                    for j in range(start, start + size):
                        heights[j] += size

                    # Recurse
                    dfs(count + 1)

                    # Backtrack: remove the square
                    for j in range(start, start + size):
                        heights[j] -= size
                else:
                    # Can't place this size square here, try smaller
                    break

        dfs(0)
        return self.best
```

```javascript
// Time: O(m^n) in worst case, but heavily pruned in practice
// Space: O(m) for the heights array plus recursion depth
var tilingRectangle = function (n, m) {
  // Special case: if one dimension divides the other
  if (n === m) return 1;

  // Make sure n <= m for consistency
  if (n > m) [n, m] = [m, n];

  // Initialize heights array - all columns start at height 0
  const heights = new Array(m).fill(0);
  let best = n * m; // Worst case: all 1x1 squares

  function dfs(count) {
    // Prune: if we already have more squares than best solution found
    if (count >= best) return;

    // Find the lowest unfilled position
    const minHeight = Math.min(...heights);
    if (minHeight === n) {
      // All columns filled to the top
      best = Math.min(best, count);
      return;
    }

    // Find leftmost column with minimum height
    let start = heights.indexOf(minHeight);

    // Try squares from largest possible size down to 1
    // Max size is limited by remaining height and width
    let maxSize = Math.min(n - minHeight, m - start);

    // Important: We need to consider that the square might not fit
    // in all columns from start to start+size-1
    for (let size = maxSize; size >= 1; size--) {
      // Check if all columns in range [start, start+size-1] have height == minHeight
      let canPlace = true;
      for (let j = start; j < start + size; j++) {
        if (heights[j] !== minHeight) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        // Place the square
        for (let j = start; j < start + size; j++) {
          heights[j] += size;
        }

        // Recurse
        dfs(count + 1);

        // Backtrack: remove the square
        for (let j = start; j < start + size; j++) {
          heights[j] -= size;
        }
      } else {
        // Can't place this size square here, break to try smaller sizes
        // (since if we can't place size k, we can't place any larger size)
        break;
      }
    }
  }

  dfs(0);
  return best;
};
```

```java
// Time: O(m^n) in worst case, but heavily pruned in practice
// Space: O(m) for the heights array plus recursion depth
class Solution {
    private int best;

    public int tilingRectangle(int n, int m) {
        // Special case: if one dimension divides the other
        if (n == m) return 1;

        // Make sure n <= m for consistency
        if (n > m) {
            int temp = n;
            n = m;
            m = temp;
        }

        // Initialize heights array - all columns start at height 0
        int[] heights = new int[m];
        best = n * m;  // Worst case: all 1x1 squares

        dfs(heights, 0, n, m);
        return best;
    }

    private void dfs(int[] heights, int count, int n, int m) {
        // Prune: if we already have more squares than best solution found
        if (count >= best) return;

        // Find the lowest unfilled position
        int minHeight = Integer.MAX_VALUE;
        for (int h : heights) {
            if (h < minHeight) minHeight = h;
        }

        if (minHeight == n) {  // All columns filled to the top
            best = Math.min(best, count);
            return;
        }

        // Find leftmost column with minimum height
        int start = 0;
        for (int i = 0; i < m; i++) {
            if (heights[i] == minHeight) {
                start = i;
                break;
            }
        }

        // Try squares from largest possible size down to 1
        // Max size is limited by remaining height and width
        int maxSize = Math.min(n - minHeight, m - start);

        // Important: We need to consider that the square might not fit
        // in all columns from start to start+size-1
        for (int size = maxSize; size >= 1; size--) {
            // Check if all columns in range [start, start+size-1] have height == minHeight
            boolean canPlace = true;
            for (int j = start; j < start + size; j++) {
                if (heights[j] != minHeight) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                // Place the square
                for (int j = start; j < start + size; j++) {
                    heights[j] += size;
                }

                // Recurse
                dfs(heights, count + 1, n, m);

                // Backtrack: remove the square
                for (int j = start; j < start + size; j++) {
                    heights[j] -= size;
                }
            } else {
                // Can't place this size square here, break to try smaller sizes
                // (since if we can't place size k, we can't place any larger size)
                break;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: In the worst case, the algorithm explores all possible tilings, which is exponential. For an `n × m` rectangle, the worst-case time is roughly `O(m^n)`. However, in practice, the pruning is very effective:

- We always fill the lowest position first, reducing symmetry
- We try larger squares first, which tends to find good solutions quickly
- We prune when `count >= best`
- The actual runtime is manageable for reasonable `n` and `m` (up to about 13)

**Space Complexity**: `O(m)` for the `heights` array, plus `O(n)` for the recursion depth in the worst case, giving us `O(n + m)` total space.

## Common Mistakes

1. **Assuming greedy works**: Many candidates try "always place the largest square" first. This fails for cases like 5×6 where the optimal solution uses a mix of sizes. Always verify greedy approaches with counterexamples.

2. **Forgetting to backtrack properly**: When placing a square, you must update ALL columns it covers. When removing it, you must decrement ALL those same columns. Missing even one column corrupts the state.

3. **Incorrect state representation**: Some candidates try to use a 2D boolean array to track filled cells. This works but is less efficient than the heights array approach. The heights array compactly represents the "skyline" of filled area.

4. **Missing the "all columns must have same height" check**: Before placing a square of size `k`, you must verify that ALL `k` columns have exactly the same current height. Otherwise, the square would overlap already-filled areas.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in many optimization problems:

1. **Sudoku Solver (LeetCode 37)**: Similar backtracking where you try numbers in empty cells, with pruning based on row/column/box constraints.

2. **N-Queens (LeetCode 51)**: Backtracking to place queens on a chessboard, pruning invalid placements early.

3. **Word Search II (LeetCode 212)**: Backtracking through a grid to find words, with Trie-based pruning.

The common theme is exploring a solution space systematically while eliminating branches that can't lead to a better solution than one already found.

## Key Takeaways

1. **Backtracking with pruning** is essential for combinatorial optimization problems where greedy approaches fail. Always look for ways to eliminate branches early (pruning) and avoid redundant work (memoization).

2. **Choosing the right state representation** dramatically affects efficiency. The heights array here is more compact than tracking individual cells.

3. **Start with largest possibilities** when searching often finds good solutions quickly, enabling more aggressive pruning of remaining branches.

Related problems: [Selling Pieces of Wood](/problem/selling-pieces-of-wood)
