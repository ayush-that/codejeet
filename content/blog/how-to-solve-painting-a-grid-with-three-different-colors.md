---
title: "How to Solve Painting a Grid With Three Different Colors — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Painting a Grid With Three Different Colors. Hard difficulty, 77.3% acceptance rate. Topics: Dynamic Programming."
date: "2027-12-12"
category: "dsa-patterns"
tags: ["painting-a-grid-with-three-different-colors", "dynamic-programming", "hard"]
---

# How to Solve Painting a Grid With Three Different Colors

You're given an `m x n` grid where each cell must be painted red, green, or blue, but no two adjacent cells (horizontally or vertically) can share the same color. The challenge is counting all valid colorings. What makes this problem tricky is that constraints propagate in two dimensions—each cell's color depends on both its left and top neighbors. With `m` up to 5 and `n` up to 1000, brute force exploring all `3^(m×n)` possibilities is impossible. This is a classic **dynamic programming with state compression** problem where we track the color pattern of each row.

## Visual Walkthrough

Let's trace through a small example: `m = 2, n = 3` (2 rows, 3 columns).

**Step 1: Understanding adjacency rules**

- Cells are adjacent if they share an edge (horizontal or vertical)
- Diagonal cells don't count as adjacent
- This means each cell must differ from:
  - The cell above it (if in row > 0)
  - The cell to its left (if in column > 0)

**Step 2: First row possibilities**
For the first row (row 0), we only need to ensure horizontal adjacency. With 3 colors and 2 columns:

- Valid patterns: RG, RB, GR, GB, BR, BG
- Invalid patterns: RR, GG, BB (adjacent same colors)

So for `m=2`, there are 6 valid first rows.

**Step 3: Second row constraints**
Now for row 1, each cell must:

1. Differ from the cell above it
2. Differ from the cell to its left (within row 1)

Let's take first row pattern `RG`:

- Column 0: Can't be R (above is R), so can be G or B
- Column 1: Can't be G (above is G), and must differ from column 0's choice

If column 0 = G:

- Column 1 can't be G (above) and can't be G (left) → can be R or B

If column 0 = B:

- Column 1 can't be G (above) and can't be B (left) → can be R or G

So for first row `RG`, second row has 2 + 2 = 4 possibilities.

**Step 4: Counting systematically**
We need to count all valid pairs of rows, then extend to `n` columns. The key insight: we only need to know the **color pattern** of the previous row to compute the current row. With `m=2`, there are `3^2 = 9` possible patterns, but only 6 are valid (no horizontal conflicts).

## Brute Force Approach

A naive solution would try all `3^(m×n)` colorings and check each one:

1. Generate all possible color assignments (3 choices per cell)
2. For each assignment, verify no adjacent cells share colors
3. Count valid assignments

The code would use DFS/backtracking:

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW for constraints
def colorTheGrid_brute(m, n):
    MOD = 10**9 + 7
    grid = [[0] * n for _ in range(m)]
    count = 0

    def is_valid():
        for i in range(m):
            for j in range(n):
                if i > 0 and grid[i][j] == grid[i-1][j]:
                    return False
                if j > 0 and grid[i][j] == grid[i][j-1]:
                    return False
        return True

    def dfs(pos):
        nonlocal count
        if pos == m * n:
            if is_valid():
                count = (count + 1) % MOD
            return

        i, j = divmod(pos, n)
        for color in range(3):
            grid[i][j] = color
            dfs(pos + 1)

    dfs(0)
    return count
```

```javascript
// BRUTE FORCE - TOO SLOW
function colorTheGridBrute(m, n) {
  const MOD = 1e9 + 7;
  const grid = Array(m)
    .fill()
    .map(() => Array(n).fill(0));
  let count = 0;

  function isValid() {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (i > 0 && grid[i][j] === grid[i - 1][j]) return false;
        if (j > 0 && grid[i][j] === grid[i][j - 1]) return false;
      }
    }
    return true;
  }

  function dfs(pos) {
    if (pos === m * n) {
      if (isValid()) count = (count + 1) % MOD;
      return;
    }
    const i = Math.floor(pos / n);
    const j = pos % n;
    for (let color = 0; color < 3; color++) {
      grid[i][j] = color;
      dfs(pos + 1);
    }
  }

  dfs(0);
  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW
public class Solution {
    private static final int MOD = 1_000_000_007;
    private int count = 0;
    private int[][] grid;

    public int colorTheGridBrute(int m, int n) {
        grid = new int[m][n];
        dfs(0, m, n);
        return count;
    }

    private boolean isValid(int m, int n) {
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i > 0 && grid[i][j] == grid[i-1][j]) return false;
                if (j > 0 && grid[i][j] == grid[i][j-1]) return false;
            }
        }
        return true;
    }

    private void dfs(int pos, int m, int n) {
        if (pos == m * n) {
            if (isValid(m, n)) count = (count + 1) % MOD;
            return;
        }
        int i = pos / n;
        int j = pos % n;
        for (int color = 0; color < 3; color++) {
            grid[i][j] = color;
            dfs(pos + 1, m, n);
        }
    }
}
```

</div>

**Why this fails:** With `m=5, n=1000`, there are `3^(5000)` possibilities—an astronomically large number. Even with pruning, the search space is too large. We need a smarter approach that leverages the structure of the problem.

## Optimized Approach

The key insight is **dynamic programming with state compression**:

1. **State representation**: Since `m ≤ 5`, we can represent a row's color pattern as a base-3 number. Each digit (0,1,2) represents a color at that position.
2. **Valid states**: Not all `3^m` patterns are valid—we need patterns with no horizontal conflicts (adjacent cells in same row can't share colors).

3. **Transition**: For each valid current row pattern, we need to find all valid next row patterns where:
   - No vertical conflicts (same column different rows)
   - The next row itself has no horizontal conflicts

4. **DP definition**: `dp[col][state]` = number of ways to color first `col` columns ending with row pattern `state`

5. **Optimization**: Since `n` can be up to 1000, we only need to keep track of previous column's states (space optimization).

The algorithm:

1. Generate all valid single-row patterns (no horizontal conflicts)
2. Build compatibility matrix: which patterns can follow which others
3. Use DP to count ways: for each column, for each pattern, sum compatible patterns from previous column

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(n * 3^m * 3^m) but optimized with precomputation
# Space: O(3^m) for DP arrays
def colorTheGrid(m, n):
    MOD = 10**9 + 7

    # Step 1: Generate all valid row patterns (no horizontal conflicts)
    def is_valid_pattern(pattern):
        # Check that no two adjacent cells in the pattern have same color
        for i in range(1, m):
            if (pattern // (3 ** (m - 1 - i))) % 3 == (pattern // (3 ** (m - i))) % 3:
                return False
        return True

    # Step 2: Generate all valid patterns
    valid_patterns = []
    pattern_to_index = {}
    for pattern in range(3 ** m):
        if is_valid_pattern(pattern):
            pattern_to_index[pattern] = len(valid_patterns)
            valid_patterns.append(pattern)

    k = len(valid_patterns)  # Number of valid patterns

    # Step 3: Precompute compatibility between patterns
    # compatible[i] = list of pattern indices that can follow pattern i
    compatible = [[] for _ in range(k)]

    # Helper to get color at position pos in pattern
    def get_color(pattern, pos):
        return (pattern // (3 ** (m - 1 - pos))) % 3

    for i, pattern1 in enumerate(valid_patterns):
        for j, pattern2 in enumerate(valid_patterns):
            valid = True
            # Check vertical adjacency: each column must have different colors
            for row in range(m):
                if get_color(pattern1, row) == get_color(pattern2, row):
                    valid = False
                    break
            if valid:
                compatible[i].append(j)

    # Step 4: Dynamic Programming
    # dp[pattern_index] = ways to end at current column with this pattern
    dp = [1] * k  # First column: each valid pattern counts as 1 way

    # Process remaining columns
    for col in range(1, n):
        new_dp = [0] * k
        for curr_idx in range(k):
            # Sum over all compatible previous patterns
            for prev_idx in compatible[curr_idx]:
                new_dp[curr_idx] = (new_dp[curr_idx] + dp[prev_idx]) % MOD
        dp = new_dp

    # Step 5: Sum all ways for last column
    return sum(dp) % MOD
```

```javascript
// Time: O(n * 3^m * 3^m) with optimizations
// Space: O(3^m) for DP arrays
function colorTheGrid(m, n) {
  const MOD = 1e9 + 7;

  // Helper: check if pattern has no horizontal conflicts
  function isValidPattern(pattern) {
    for (let i = 1; i < m; i++) {
      const color1 = Math.floor(pattern / Math.pow(3, m - 1 - i)) % 3;
      const color2 = Math.floor(pattern / Math.pow(3, m - i)) % 3;
      if (color1 === color2) return false;
    }
    return true;
  }

  // Generate all valid patterns
  const validPatterns = [];
  const patternToIndex = new Map();
  for (let pattern = 0; pattern < Math.pow(3, m); pattern++) {
    if (isValidPattern(pattern)) {
      patternToIndex.set(pattern, validPatterns.length);
      validPatterns.push(pattern);
    }
  }

  const k = validPatterns.length;

  // Helper: get color at position pos in pattern
  function getColor(pattern, pos) {
    return Math.floor(pattern / Math.pow(3, m - 1 - pos)) % 3;
  }

  // Precompute compatibility matrix
  const compatible = Array(k)
    .fill()
    .map(() => []);
  for (let i = 0; i < k; i++) {
    const pattern1 = validPatterns[i];
    for (let j = 0; j < k; j++) {
      const pattern2 = validPatterns[j];
      let valid = true;
      // Check vertical adjacency
      for (let row = 0; row < m; row++) {
        if (getColor(pattern1, row) === getColor(pattern2, row)) {
          valid = false;
          break;
        }
      }
      if (valid) {
        compatible[i].push(j);
      }
    }
  }

  // DP: dp[patternIndex] = ways for current column
  let dp = Array(k).fill(1); // First column

  // Process remaining columns
  for (let col = 1; col < n; col++) {
    const newDp = Array(k).fill(0);
    for (let currIdx = 0; currIdx < k; currIdx++) {
      for (const prevIdx of compatible[currIdx]) {
        newDp[currIdx] = (newDp[currIdx] + dp[prevIdx]) % MOD;
      }
    }
    dp = newDp;
  }

  // Sum all possibilities for last column
  return dp.reduce((sum, val) => (sum + val) % MOD, 0);
}
```

```java
// Time: O(n * 3^m * 3^m) with optimizations
// Space: O(3^m) for DP arrays
class Solution {
    private static final int MOD = 1_000_000_007;

    public int colorTheGrid(int m, int n) {
        // Step 1: Generate all valid patterns
        List<Integer> validPatterns = new ArrayList<>();
        Map<Integer, Integer> patternToIndex = new HashMap<>();

        for (int pattern = 0; pattern < (int)Math.pow(3, m); pattern++) {
            if (isValidPattern(pattern, m)) {
                patternToIndex.put(pattern, validPatterns.size());
                validPatterns.add(pattern);
            }
        }

        int k = validPatterns.size();

        // Step 2: Build compatibility matrix
        List<List<Integer>> compatible = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            compatible.add(new ArrayList<>());
        }

        for (int i = 0; i < k; i++) {
            int pattern1 = validPatterns.get(i);
            for (int j = 0; j < k; j++) {
                int pattern2 = validPatterns.get(j);
                if (isCompatible(pattern1, pattern2, m)) {
                    compatible.get(i).add(j);
                }
            }
        }

        // Step 3: Dynamic Programming
        int[] dp = new int[k];
        Arrays.fill(dp, 1);  // First column

        for (int col = 1; col < n; col++) {
            int[] newDp = new int[k];
            for (int currIdx = 0; currIdx < k; currIdx++) {
                for (int prevIdx : compatible.get(currIdx)) {
                    newDp[currIdx] = (newDp[currIdx] + dp[prevIdx]) % MOD;
                }
            }
            dp = newDp;
        }

        // Step 4: Sum results
        int result = 0;
        for (int count : dp) {
            result = (result + count) % MOD;
        }
        return result;
    }

    private boolean isValidPattern(int pattern, int m) {
        for (int i = 1; i < m; i++) {
            int color1 = (pattern / (int)Math.pow(3, m - 1 - i)) % 3;
            int color2 = (pattern / (int)Math.pow(3, m - i)) % 3;
            if (color1 == color2) return false;
        }
        return true;
    }

    private boolean isCompatible(int pattern1, int pattern2, int m) {
        for (int row = 0; row < m; row++) {
            int color1 = (pattern1 / (int)Math.pow(3, m - 1 - row)) % 3;
            int color2 = (pattern2 / (int)Math.pow(3, m - 1 - row)) % 3;
            if (color1 == color2) return false;
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n * k^2)` where `k` is the number of valid patterns.

- Generating valid patterns: `O(3^m * m)` to check each of `3^m` patterns
- Building compatibility matrix: `O(k^2 * m)` to check all pairs of valid patterns
- DP: `O(n * k^2)` for `n` columns, each checking `k^2` transitions
- Since `m ≤ 5`, `k ≤ 3^5 = 243`, and in practice much smaller due to horizontal constraints

**Space Complexity**: `O(k^2 + k)`

- `O(k^2)` for compatibility matrix (can be optimized to `O(k * avg_compatible)` using adjacency lists)
- `O(k)` for DP arrays
- With `m=5`, maximum `k ≈ 48`, so space usage is very manageable

## Common Mistakes

1. **Forgetting to check horizontal constraints within a row**: When generating valid patterns, candidates often only check vertical compatibility between rows but forget that adjacent cells in the same row must also differ.

2. **Incorrect base-3 encoding/decoding**: Getting the color at position `pos` requires careful integer division. Common error: `(pattern // 3**pos) % 3` instead of `(pattern // 3**(m-1-pos)) % 3` when encoding left-to-right.

3. **Not using modulo operations early**: With large `n`, counts grow exponentially. You must apply `MOD` after each addition, not just at the end, to avoid integer overflow.

4. **Confusing rows and columns**: The problem states `m x n` grid, but the efficient DP goes column-by-column (or row-by-row). Be consistent in your implementation.

## When You'll See This Pattern

This **DP with state compression** pattern appears in problems where:

1. You have a grid or sequence with constraints between adjacent elements
2. The "state" of a row/column can be encoded compactly
3. Transitions depend only on the previous state

Related problems:

- **Number of Ways to Paint N × 3 Grid** (LeetCode 1411): Almost identical problem with fixed `m=3`
- **Student Attendance Record II** (LeetCode 552): State tracks consecutive 'L's and total 'A's
- **Domino and Tromino Tiling** (LeetCode 790): State represents how the previous column was filled

## Key Takeaways

1. **State compression is powerful for small dimensions**: When one dimension is small (≤ 5-6), encoding it as a bitmask or base-N number enables efficient DP.

2. **Precompute compatibility for speed**: Building a transition matrix between valid states upfront avoids repeated checks during DP.

3. **Think in terms of layers**: For grid coloring problems, process the grid layer by layer (row-by-row or column-by-column), where each layer's state depends only on the previous layer.

Related problems: [Number of Ways to Paint N × 3 Grid](/problem/number-of-ways-to-paint-n-3-grid)
