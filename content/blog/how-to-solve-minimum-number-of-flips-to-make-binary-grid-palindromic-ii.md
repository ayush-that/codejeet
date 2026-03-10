---
title: "How to Solve Minimum Number of Flips to Make Binary Grid Palindromic II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Flips to Make Binary Grid Palindromic II. Medium difficulty, 25.4% acceptance rate. Topics: Array, Two Pointers, Matrix."
date: "2026-04-04"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-flips-to-make-binary-grid-palindromic-ii",
    "array",
    "two-pointers",
    "matrix",
    "medium",
  ]
---

# How to Solve Minimum Number of Flips to Make Binary Grid Palindromic II

This problem asks us to transform a binary matrix so that every row and column becomes palindromic by flipping the minimum number of cells. What makes this interesting is that we need to consider both rows AND columns simultaneously — a cell flip affects both its row and column palindromes. The challenge is finding the optimal way to satisfy both constraints with minimal operations.

## Visual Walkthrough

Let's work through a small example to build intuition:

```
Grid:
1 0 1
0 1 0
1 0 1
```

We need to make all rows and columns palindromic. Let's examine the constraints:

**Row 0:** [1, 0, 1] - Already palindromic (1 == 1)
**Row 1:** [0, 1, 0] - Already palindromic (0 == 0)  
**Row 2:** [1, 0, 1] - Already palindromic (1 == 1)

**Column 0:** [1, 0, 1] - Already palindromic (1 == 1)
**Column 1:** [0, 1, 0] - Already palindromic (0 == 0)
**Column 2:** [1, 0, 1] - Already palindromic (1 == 1)

This grid is already fully palindromic! Minimum flips = 0.

Now let's try a trickier example:

```
Grid:
1 0
0 1
```

**Row 0:** [1, 0] - Not palindromic (1 ≠ 0)
**Row 1:** [0, 1] - Not palindromic (0 ≠ 1)
**Column 0:** [1, 0] - Not palindromic (1 ≠ 0)
**Column 1:** [0, 1] - Not palindromic (0 ≠ 1)

The key insight: Each cell belongs to exactly one row and one column. For position (i,j), it must match:

1. Its row palindrome partner at (i, n-1-j)
2. Its column palindrome partner at (m-1-i, j)

These four positions form a "palindrome group" that must all have the same value. Let's trace this:

For (0,0):

- Row partner: (0, 1) → value 0
- Column partner: (1, 0) → value 0
- The group is {(0,0)=1, (0,1)=0, (1,0)=0, (1,1)=1}

All four positions must have the same value. Currently we have two 1s and two 0s. Minimum flips = min(flip both 1s to 0, flip both 0s to 1) = min(2, 2) = 2.

We could flip (0,0) and (1,1) to 0, or flip (0,1) and (1,0) to 1. Either way takes 2 flips.

## Brute Force Approach

A naive approach would try all possible combinations of flips. For an m×n grid, there are 2^(m×n) possible flip configurations. For each configuration, we'd need to check all m rows and n columns for palindrome property, costing O(m×n) time. This gives O(2^(m×n) × m×n) time complexity — completely infeasible even for small grids like 10×10.

Another brute force idea: Try to satisfy rows first, then columns. But this fails because fixing rows might break columns, and vice versa. We need a systematic way to handle both constraints simultaneously.

## Optimized Approach

The key insight is that palindrome constraints create groups of positions that must have identical values. For position (i,j):

- Its row palindrome partner is (i, n-1-j)
- Its column palindrome partner is (m-1-i, j)
- The row partner's column partner is (m-1-i, n-1-j)

These four positions form a "palindrome quartet" that must all be equal. However, there are special cases:

1. When i = m-1-i (middle row) or j = n-1-j (middle column), positions can coincide
2. For odd dimensions, some positions are their own partners

We need to process all unique groups and for each group:

- Count how many are currently 0 and how many are 1
- The minimum flips for that group = min(#zeros, #ones) — we flip the minority to match the majority

But wait — there's a catch! When a position appears in multiple groups (like the center of an odd×odd grid), we need to be careful. Actually, each position belongs to exactly one group defined by the equivalence relation: "two positions are equivalent if they must have the same value."

We can find these groups using a union-find (disjoint set union) approach, or by systematic traversal. The cleanest approach: Traverse only the top-left quadrant and for each position, find all positions in its palindrome group.

## Optimal Solution

The algorithm works as follows:

1. Create a visited matrix to track processed positions
2. For each unvisited cell in the grid:
   - Find all positions in its palindrome group using BFS/DFS
   - Count zeros and ones in the group
   - Add min(#zeros, #ones) to total flips
   - Mark all group positions as visited
3. Return total flips

The palindrome group for (i,j) includes:

- (i, j)
- (i, n-1-j) — row mirror
- (m-1-i, j) — column mirror
- (m-1-i, n-1-j) — both mirrors

We need to handle duplicates when positions coincide (middle rows/columns).

<div class="code-group">

```python
# Time: O(m×n) | Space: O(m×n)
def minFlips(grid):
    m, n = len(grid), len(grid[0])
    visited = [[False] * n for _ in range(m)]
    total_flips = 0

    for i in range(m):
        for j in range(n):
            if visited[i][j]:
                continue

            # Find all positions in this palindrome group
            zeros = ones = 0
            stack = [(i, j)]
            visited[i][j] = True

            while stack:
                x, y = stack.pop()

                # Count current cell's value
                if grid[x][y] == 0:
                    zeros += 1
                else:
                    ones += 1

                # Add palindrome partners if not visited
                partners = [
                    (x, n - 1 - y),      # Row mirror
                    (m - 1 - x, y),      # Column mirror
                    (m - 1 - x, n - 1 - y)  # Both mirrors
                ]

                for nx, ny in partners:
                    if 0 <= nx < m and 0 <= ny < n and not visited[nx][ny]:
                        visited[nx][ny] = True
                        stack.append((nx, ny))

            # Minimum flips for this group = flip minority to majority
            total_flips += min(zeros, ones)

    return total_flips
```

```javascript
// Time: O(m×n) | Space: O(m×n)
function minFlips(grid) {
  const m = grid.length,
    n = grid[0].length;
  const visited = Array.from({ length: m }, () => Array(n).fill(false));
  let totalFlips = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (visited[i][j]) continue;

      // Find all positions in this palindrome group
      let zeros = 0,
        ones = 0;
      const stack = [[i, j]];
      visited[i][j] = true;

      while (stack.length > 0) {
        const [x, y] = stack.pop();

        // Count current cell's value
        if (grid[x][y] === 0) {
          zeros++;
        } else {
          ones++;
        }

        // Add palindrome partners if not visited
        const partners = [
          [x, n - 1 - y], // Row mirror
          [m - 1 - x, y], // Column mirror
          [m - 1 - x, n - 1 - y], // Both mirrors
        ];

        for (const [nx, ny] of partners) {
          if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
            visited[nx][ny] = true;
            stack.push([nx, ny]);
          }
        }
      }

      // Minimum flips for this group = flip minority to majority
      totalFlips += Math.min(zeros, ones);
    }
  }

  return totalFlips;
}
```

```java
// Time: O(m×n) | Space: O(m×n)
public int minFlips(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    boolean[][] visited = new boolean[m][n];
    int totalFlips = 0;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (visited[i][j]) continue;

            // Find all positions in this palindrome group
            int zeros = 0, ones = 0;
            Stack<int[]> stack = new Stack<>();
            stack.push(new int[]{i, j});
            visited[i][j] = true;

            while (!stack.isEmpty()) {
                int[] pos = stack.pop();
                int x = pos[0], y = pos[1];

                // Count current cell's value
                if (grid[x][y] == 0) {
                    zeros++;
                } else {
                    ones++;
                }

                // Add palindrome partners if not visited
                int[][] partners = {
                    {x, n - 1 - y},      // Row mirror
                    {m - 1 - x, y},      // Column mirror
                    {m - 1 - x, n - 1 - y}  // Both mirrors
                };

                for (int[] partner : partners) {
                    int nx = partner[0], ny = partner[1];
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
                        visited[nx][ny] = true;
                        stack.push(new int[]{nx, ny});
                    }
                }
            }

            // Minimum flips for this group = flip minority to majority
            totalFlips += Math.min(zeros, ones);
        }
    }

    return totalFlips;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n) where m = rows, n = columns. We visit each cell exactly once when we process its palindrome group. Even though we check up to 3 partners for each cell, each partner relationship is symmetric, so total operations are linear in the number of cells.

**Space Complexity:** O(m×n) for the visited matrix. The stack/queue for BFS/DFS could grow up to O(m×n) in worst case, but in practice it's much smaller since we're processing groups.

## Common Mistakes

1. **Double-counting flips**: When a cell belongs to multiple palindrome constraints (row and column), candidates might try to satisfy them separately. This leads to overcounting. Remember: Each cell flip affects both its row and column simultaneously.

2. **Missing the center cell in odd dimensions**: For an m×n grid where both m and n are odd, the center cell at (m//2, n//2) has no distinct partners — it's its own row and column mirror. It forms a singleton group. Forgetting this special case leads to incorrect grouping.

3. **Incorrect group identification**: Some candidates only consider row partners or only column partners. You must consider BOTH constraints simultaneously, which creates groups of up to 4 positions that must be equal.

4. **Off-by-one in mirror indices**: Common error: using n-j instead of n-1-j for column mirror. Remember array indices go from 0 to n-1, so the mirror of index j is n-1-j, not n-j.

## When You'll See This Pattern

This "palindrome grouping" pattern appears in several matrix transformation problems:

1. **Minimum Operations to Make Array Palindrome** (similar 1D version) — Group positions that must be equal when making an array palindrome.

2. **Matrix Similarity After Cyclic Shifts** — Another problem where positions are linked through transformation rules.

3. **Minimum Swaps to Make Strings Equal** — Group theory approach to find minimum operations to make strings identical under constraints.

The core technique is identifying equivalence classes of positions that must have the same value, then optimizing within each class independently.

## Key Takeaways

1. **Constraint propagation creates equivalence classes**: When multiple constraints (row palindrome + column palindrome) apply to matrix elements, they create groups of positions that must have identical values. These groups can be found by exploring partner relationships.

2. **Optimize locally, combine globally**: The overall minimum is the sum of minima for each independent group. This "separability" property is key — we don't need to consider interactions between different groups.

3. **Systematic traversal avoids double-counting**: By marking visited positions and processing each group exactly once, we ensure correct counting without overcomplicating the logic.

[Practice this problem on CodeJeet](/problem/minimum-number-of-flips-to-make-binary-grid-palindromic-ii)
