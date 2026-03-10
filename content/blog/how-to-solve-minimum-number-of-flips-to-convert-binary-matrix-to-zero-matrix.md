---
title: "How to Solve Minimum Number of Flips to Convert Binary Matrix to Zero Matrix — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Flips to Convert Binary Matrix to Zero Matrix. Hard difficulty, 72.4% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix."
date: "2028-12-04"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix",
    "array",
    "hash-table",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Minimum Number of Flips to Convert Binary Matrix to Zero Matrix

You’re given an `m x n` binary matrix. In one move, you can flip a cell and all its four orthogonal neighbors (up, down, left, right). The goal is to find the **minimum number of moves** to turn the entire matrix into all zeros. What makes this problem tricky is that flips are **non-commutative**—the order matters because flipping a cell twice cancels out—and each move affects multiple cells, creating complex dependencies across the matrix.

## Visual Walkthrough

Let’s build intuition with a small example. Suppose we have:

```
mat = [[1, 1],
       [1, 0]]
```

We want to reach `[[0,0],[0,0]]`. Let’s try a sequence:

1. **Flip (0,0)** → flips (0,0), (0,1), (1,0):

   ```
   Before:    After:
   1 1        0 0
   1 0        0 1
   ```

   Now we have `[[0,0],[0,1]]`.

2. **Flip (1,1)** → flips (1,1) and its neighbors (0,1), (1,0):

   ```
   Before:    After:
   0 0        0 1
   0 1        1 0
   ```

   That made it worse! This shows that flipping a cell can undo previous progress.

3. Let’s restart and try a different sequence:
   - Start: `[[1,1],[1,0]]`
   - **Flip (0,1)** → flips (0,1), (0,0), (1,1):
     ```
     0 0
     1 1
     ```
   - **Flip (1,0)** → flips (1,0), (0,0), (1,1):
     ```
     1 0
     0 0
     ```
   - **Flip (0,0)** → flips (0,0), (0,1), (1,0):
     ```
     0 0
     0 0
     ```
     That took 3 moves. Is there a better way? Yes: flip (0,0) then (1,1) → 2 moves. This demonstrates that we need a systematic way to explore possibilities.

## Brute Force Approach

A naive brute force would try all possible sequences of flips. Since each cell can be flipped or not, there are `2^(m*n)` possible flip patterns. For each pattern, we’d simulate the flips and check if the matrix becomes zero. Even for a small 3×3 matrix, that’s `2^9 = 512` patterns—but for 4×4 it’s `2^16 = 65,536`, which grows exponentially.

Why this fails: The search space explodes quickly. We need to prune unnecessary searches. Notice that flipping the same cell twice is useless (it cancels), so each cell needs at most one flip. But even with that, we still have `2^(m*n)` possibilities to check.

## Optimized Approach

The key insight is that **the order of flips doesn’t matter** for the final state—only the parity (odd/even count) of flips on each cell matters. However, because each flip affects neighbors, we can’t decide each cell independently.

We can think of this as a **constraint satisfaction problem**: each cell’s final value depends on its initial value plus the number of times it was flipped (mod 2). Since each flip affects a cell and its neighbors, we get a system of linear equations over GF(2) (binary field).

But solving this exactly is complex. A more practical approach is **BFS over states**. We can represent the entire matrix as a state (e.g., a bitmask or string) and use BFS to find the shortest path to the zero state. Each move corresponds to flipping one cell and its neighbors.

However, BFS on the full state space is still `O(2^(m*n))` in worst case. We need to reduce the search space.

**Critical optimization**: Once we decide the flip pattern for the first row, the rest of the rows are forced. Why? Because for any cell in row `i > 0`, the only way to fix it (if it’s 1) is to flip the cell directly below it in row `i+1` (since flipping cells in the same row or above would affect already-processed cells). This gives us a **row-by-row greedy strategy**:

1. Try all `2^n` possible flip patterns for the first row.
2. For each pattern, simulate flips and propagate: after fixing row `i`, any remaining 1s in row `i` must be fixed by flipping the corresponding cell in row `i+1`.
3. After processing all rows, check if the last row becomes all zeros. If yes, count the flips.
4. Take the minimum over all first-row patterns.

This reduces the search from `2^(m*n)` to `O(m*n*2^n)`, which is feasible when `n` is small (typical constraints: `m, n ≤ 3` in some versions, but here `m, n ≤ 10`).

## Optimal Solution

We implement the row-by-row propagation. For each possible first-row mask (0 to `2^n - 1`), we:

- Copy the original matrix to avoid mutation.
- Flip cells according to the mask in row 0.
- For each subsequent row, flip cells where the cell above is 1.
- After processing all rows, if the last row is all zeros, record the flip count.
- Keep the minimum.

<div class="code-group">

```python
# Time: O(m * n * 2^n) | Space: O(m * n) for the copy matrix
class Solution:
    def minFlips(self, mat: List[List[int]]) -> int:
        m, n = len(mat), len(mat[0])
        ans = float('inf')

        # Try all possible flip patterns for the first row
        for mask in range(1 << n):
            # Copy the matrix to avoid modifying the original
            curr = [row[:] for row in mat]
            flips = 0

            # Apply the mask to the first row
            for j in range(n):
                if mask >> j & 1:  # If j-th bit in mask is 1, flip (0, j)
                    self.flip_cell(curr, 0, j, m, n)
                    flips += 1

            # Propagate flips row by row
            for i in range(1, m):
                for j in range(n):
                    # If the cell above is 1, we must flip current cell
                    if curr[i-1][j] == 1:
                        self.flip_cell(curr, i, j, m, n)
                        flips += 1

            # Check if the last row is all zeros
            if all(cell == 0 for cell in curr[m-1]):
                ans = min(ans, flips)

        return ans if ans != float('inf') else -1

    def flip_cell(self, mat, i, j, m, n):
        # Flip the cell (i, j) and its four neighbors if they exist
        mat[i][j] ^= 1  # XOR with 1 flips the bit
        if i > 0:
            mat[i-1][j] ^= 1
        if i < m - 1:
            mat[i+1][j] ^= 1
        if j > 0:
            mat[i][j-1] ^= 1
        if j < n - 1:
            mat[i][j+1] ^= 1
```

```javascript
// Time: O(m * n * 2^n) | Space: O(m * n) for the copy matrix
var minFlips = function (mat) {
  const m = mat.length,
    n = mat[0].length;
  let ans = Infinity;

  // Helper to flip a cell and its neighbors
  const flipCell = (grid, i, j) => {
    grid[i][j] ^= 1;
    if (i > 0) grid[i - 1][j] ^= 1;
    if (i < m - 1) grid[i + 1][j] ^= 1;
    if (j > 0) grid[i][j - 1] ^= 1;
    if (j < n - 1) grid[i][j + 1] ^= 1;
  };

  // Try all possible first-row masks
  for (let mask = 0; mask < 1 << n; mask++) {
    // Deep copy the matrix
    const curr = mat.map((row) => [...row]);
    let flips = 0;

    // Apply mask to first row
    for (let j = 0; j < n; j++) {
      if ((mask >> j) & 1) {
        flipCell(curr, 0, j);
        flips++;
      }
    }

    // Propagate downwards
    for (let i = 1; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (curr[i - 1][j] === 1) {
          flipCell(curr, i, j);
          flips++;
        }
      }
    }

    // Check if last row is all zeros
    if (curr[m - 1].every((cell) => cell === 0)) {
      ans = Math.min(ans, flips);
    }
  }

  return ans === Infinity ? -1 : ans;
};
```

```java
// Time: O(m * n * 2^n) | Space: O(m * n) for the copy matrix
class Solution {
    public int minFlips(int[][] mat) {
        int m = mat.length, n = mat[0].length;
        int ans = Integer.MAX_VALUE;

        // Try all possible masks for the first row
        for (int mask = 0; mask < (1 << n); mask++) {
            // Copy the matrix
            int[][] curr = new int[m][n];
            for (int i = 0; i < m; i++) {
                curr[i] = mat[i].clone();
            }
            int flips = 0;

            // Apply mask to first row
            for (int j = 0; j < n; j++) {
                if ((mask >> j & 1) == 1) {
                    flipCell(curr, 0, j, m, n);
                    flips++;
                }
            }

            // Propagate flips row by row
            for (int i = 1; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (curr[i-1][j] == 1) {
                        flipCell(curr, i, j, m, n);
                        flips++;
                    }
                }
            }

            // Check if last row is all zeros
            boolean allZero = true;
            for (int j = 0; j < n; j++) {
                if (curr[m-1][j] == 1) {
                    allZero = false;
                    break;
                }
            }
            if (allZero) {
                ans = Math.min(ans, flips);
            }
        }

        return ans == Integer.MAX_VALUE ? -1 : ans;
    }

    private void flipCell(int[][] mat, int i, int j, int m, int n) {
        mat[i][j] ^= 1;
        if (i > 0) mat[i-1][j] ^= 1;
        if (i < m - 1) mat[i+1][j] ^= 1;
        if (j > 0) mat[i][j-1] ^= 1;
        if (j < n - 1) mat[i][j+1] ^= 1;
    }
}
```

</div>

## Complexity Analysis

- **Time complexity**: `O(m * n * 2^n)`. We iterate over `2^n` possible first-row masks. For each mask, we process all `m * n` cells to propagate flips and check the final state. The `flip_cell` operation is O(1).
- **Space complexity**: `O(m * n)` for the copied matrix. We could optimize to O(n) by processing rows in place and keeping only two rows, but the clarity of copying is worth the extra space in an interview.

Why is this optimal? For small `n` (≤ 10), `2^n` is at most 1024, and `m * n` ≤ 100, so ~100k operations is fine. There’s no known polynomial-time algorithm for this problem—it’s essentially a constraint satisfaction problem that’s NP-hard in general, but the row-propagation trick exploits the grid structure.

## Common Mistakes

1. **Not copying the matrix for each mask**: If you mutate the original matrix, subsequent mask trials will start from a modified state. Always create a fresh copy for each mask.
2. **Forgetting to flip neighbors correctly**: The flip operation affects up to 5 cells. Missing boundary checks (e.g., flipping a neighbor that doesn’t exist) causes index errors.
3. **Incorrect propagation logic**: The rule is: after fixing row `i-1`, any remaining 1 in row `i-1` must be fixed by flipping the cell at `(i, j)`. Some candidates try to fix it by flipping `(i-1, j)` again, which would mess up earlier rows.
4. **Returning -1 incorrectly**: If no mask yields a zero matrix, return -1. Some forget this edge case.

## When You’ll See This Pattern

This row-by-row propagation with brute force on the first row appears in several grid flip problems:

1. **Minimum Operations to Remove Adjacent Ones in Matrix (LeetCode 2123)**: Similar flip constraints, often solved with BFS or row propagation.
2. **Remove All Ones With Row and Column Flips (LeetCode 2128)**: Simpler version where entire rows or columns are flipped. The pattern is deciding the first row/column and propagating.
3. **Lights Out puzzle**: Classic puzzle with the exact same mechanics—flipping a cell toggles neighbors. The solution uses Gaussian elimination over GF(2) or BFS.

The core idea is: when operations affect local neighbors, you can often decide the first row/column and let the rest be determined.

## Key Takeaways

- **Row propagation reduces exponential search**: Instead of `2^(m*n)`, try all possibilities for the first row (`2^n`) and derive the rest deterministically.
- **Flip order doesn’t matter for feasibility**: Only the parity of flips on each cell matters, which lets us treat each cell as flipped at most once.
- **BFS over states is an alternative**: For small grids (e.g., 3×3), you could BFS from the initial matrix state to the zero state. Each move flips a cell and neighbors. This is simpler to code but slower for larger grids.

Related problems: [Minimum Operations to Remove Adjacent Ones in Matrix](/problem/minimum-operations-to-remove-adjacent-ones-in-matrix), [Remove All Ones With Row and Column Flips](/problem/remove-all-ones-with-row-and-column-flips), [Remove All Ones With Row and Column Flips II](/problem/remove-all-ones-with-row-and-column-flips-ii)
