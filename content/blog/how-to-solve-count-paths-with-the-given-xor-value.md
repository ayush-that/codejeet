---
title: "How to Solve Count Paths With the Given XOR Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Paths With the Given XOR Value. Medium difficulty, 40.5% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Matrix."
date: "2029-10-24"
category: "dsa-patterns"
tags:
  [
    "count-paths-with-the-given-xor-value",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Count Paths With the Given XOR Value

You're given an `m x n` grid and need to count all paths from top-left to bottom-right where the XOR of all values along the path equals a target `k`. The challenge is that XOR isn't additive like sum—you can't use standard DP without tracking all possible XOR values at each cell. This makes the problem interesting because while it looks like a standard grid DP problem, the XOR operation forces us to think differently about state representation.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[2, 1],
        [3, 4]]
k = 2
```

We need paths from (0,0) to (1,1) where XOR of all values equals 2.

**Path 1: Right then Down**

- Start at (0,0): XOR = 2
- Move right to (0,1): XOR = 2 ^ 1 = 3
- Move down to (1,1): XOR = 3 ^ 4 = 7 (not equal to k=2)

**Path 2: Down then Right**

- Start at (0,0): XOR = 2
- Move down to (1,0): XOR = 2 ^ 3 = 1
- Move right to (1,1): XOR = 1 ^ 4 = 5 (not equal to k=2)

So for this grid, there are 0 paths with XOR = 2.

Now let's try a grid where we can find a valid path:

```
grid = [[1, 2],
        [3, 1]]
k = 3
```

**Path 1: Right then Down**

- (0,0): XOR = 1
- (0,1): XOR = 1 ^ 2 = 3
- (1,1): XOR = 3 ^ 1 = 2 (not equal to 3)

**Path 2: Down then Right**

- (0,0): XOR = 1
- (1,0): XOR = 1 ^ 3 = 2
- (1,1): XOR = 2 ^ 1 = 3 ✓ (equal to k=3)

So we have 1 valid path.

The key insight: At each cell, we need to track ALL possible XOR values that can be obtained by different paths reaching that cell. We can't just store the "best" or "minimum" XOR because XOR doesn't have optimal substructure like sum or min operations do.

## Brute Force Approach

The most straightforward approach is to explore all possible paths using DFS or BFS. For an `m x n` grid, there are `C(m+n-2, m-1)` possible paths (choosing which `m-1` steps are down moves out of `m+n-2` total steps). This grows exponentially with grid size.

The brute force would:

1. Generate all paths from (0,0) to (m-1,n-1)
2. For each path, compute the XOR of all values along it
3. Count how many paths have XOR equal to `k`

**Why this fails:**
For a 20x20 grid, there are already ~35 billion paths. The time complexity is exponential: O(2^(m+n)), which is completely impractical for typical constraints (m,n up to 20 in many problems).

Even with memoization, we can't use a simple DP like `dp[i][j] = number of paths to (i,j)` because that doesn't track the XOR values. We need to track which XOR values are possible at each cell.

## Optimized Approach

The key insight is that while we need to track all possible XOR values, the number of distinct XOR values is limited. Since grid values are integers (typically up to 2^16 or so in constraints), and XOR of integers stays within a bounded range, we can use dynamic programming where state is `(row, col, xor_value)`.

However, storing `dp[i][j][xor]` for all possible XOR values would be too large if XOR can be any 32-bit integer. The optimization comes from realizing that at each cell, we only need to track XOR values that are actually reachable from previous cells. The number of distinct reachable XOR values grows but is bounded by the number of paths to that cell.

Better approach: Use a DP array where `dp[i][j]` is a dictionary/hashmap mapping XOR values to the count of paths achieving that XOR value at cell `(i,j)`. We build this bottom-up:

1. Start at (0,0): Only one XOR value is possible = `grid[0][0]`
2. For each cell (i,j), look at cells above (i-1,j) and left (i,j-1)
3. For each XOR value `x` in the previous cell's map, the new XOR value at (i,j) would be `x ^ grid[i][j]`
4. Sum the counts for each resulting XOR value

At the end, check `dp[m-1][n-1][k]` for the answer.

**Why this works:**

- We're effectively doing DP over all reachable XOR states
- The number of distinct XOR values at each cell is limited (worst case: all possible XOR values from all paths)
- Time complexity becomes O(m _ n _ S) where S is the number of distinct XOR values

## Optimal Solution

The optimal solution uses the DP with hashmap approach described above. We'll implement it with careful memory management—since we only need the previous row and current row, we can optimize space to O(n \* S).

<div class="code-group">

```python
# Time: O(m * n * S) where S is number of distinct XOR values (bounded)
# Space: O(n * S) for storing two rows of XOR maps
def countPathsWithXorValue(grid, k):
    m, n = len(grid), len(grid[0])

    # dp[j] will store a dictionary mapping XOR value -> count of paths
    # for the current row at column j
    prev_row = [{} for _ in range(n)]

    # Initialize first cell
    prev_row[0][grid[0][0]] = 1

    for i in range(m):
        curr_row = [{} for _ in range(n)]

        for j in range(n):
            # Skip if we're at the starting cell and it's not the first iteration
            if i == 0 and j == 0:
                # Copy from prev_row[0] which we already initialized
                curr_row[0] = prev_row[0].copy()
                continue

            # We can come from above (if i > 0) or from left (if j > 0)
            from_above = {}
            from_left = {}

            # Check cell above (i-1, j)
            if i > 0:
                for xor_val, count in prev_row[j].items():
                    new_xor = xor_val ^ grid[i][j]
                    from_above[new_xor] = from_above.get(new_xor, 0) + count

            # Check cell to the left (i, j-1)
            if j > 0:
                for xor_val, count in curr_row[j-1].items():
                    new_xor = xor_val ^ grid[i][j]
                    from_left[new_xor] = from_left.get(new_xor, 0) + count

            # Merge results from above and left
            merged = {}
            # Add paths from above
            for xor_val, count in from_above.items():
                merged[xor_val] = merged.get(xor_val, 0) + count
            # Add paths from left
            for xor_val, count in from_left.items():
                merged[xor_val] = merged.get(xor_val, 0) + count

            curr_row[j] = merged

        # Move to next row
        prev_row = curr_row

    # Answer is in the bottom-right cell's map at key k
    return prev_row[n-1].get(k, 0)
```

```javascript
// Time: O(m * n * S) where S is number of distinct XOR values
// Space: O(n * S) for storing two rows of XOR maps
function countPathsWithXorValue(grid, k) {
  const m = grid.length;
  const n = grid[0].length;

  // prevRow[j] stores Map of XOR value -> count for column j in previous row
  let prevRow = new Array(n);
  for (let j = 0; j < n; j++) {
    prevRow[j] = new Map();
  }

  // Initialize first cell
  prevRow[0].set(grid[0][0], 1);

  for (let i = 0; i < m; i++) {
    // Current row's maps
    let currRow = new Array(n);
    for (let j = 0; j < n; j++) {
      currRow[j] = new Map();
    }

    for (let j = 0; j < n; j++) {
      // Skip initialization for first cell on first iteration
      if (i === 0 && j === 0) {
        // Copy from prevRow[0]
        prevRow[0].forEach((count, xorVal) => {
          currRow[0].set(xorVal, count);
        });
        continue;
      }

      // Maps to store paths coming from above and left
      const fromAbove = new Map();
      const fromLeft = new Map();

      // Check cell above (i-1, j)
      if (i > 0) {
        prevRow[j].forEach((count, xorVal) => {
          const newXor = xorVal ^ grid[i][j];
          fromAbove.set(newXor, (fromAbove.get(newXor) || 0) + count);
        });
      }

      // Check cell to the left (i, j-1)
      if (j > 0) {
        currRow[j - 1].forEach((count, xorVal) => {
          const newXor = xorVal ^ grid[i][j];
          fromLeft.set(newXor, (fromLeft.get(newXor) || 0) + count);
        });
      }

      // Merge results from above and left
      const merged = new Map();

      // Add paths from above
      fromAbove.forEach((count, xorVal) => {
        merged.set(xorVal, (merged.get(xorVal) || 0) + count);
      });

      // Add paths from left
      fromLeft.forEach((count, xorVal) => {
        merged.set(xorVal, (merged.get(xorVal) || 0) + count);
      });

      currRow[j] = merged;
    }

    // Move to next row
    prevRow = currRow;
  }

  // Return count for XOR = k in bottom-right cell, or 0 if not found
  return prevRow[n - 1].get(k) || 0;
}
```

```java
// Time: O(m * n * S) where S is number of distinct XOR values
// Space: O(n * S) for storing two rows of XOR maps
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int countPathsWithXorValue(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;

        // prevRow[j] stores HashMap of XOR value -> count for column j in previous row
        Map<Integer, Integer>[] prevRow = new HashMap[n];
        for (int j = 0; j < n; j++) {
            prevRow[j] = new HashMap<>();
        }

        // Initialize first cell
        prevRow[0].put(grid[0][0], 1);

        for (int i = 0; i < m; i++) {
            // Current row's maps
            Map<Integer, Integer>[] currRow = new HashMap[n];
            for (int j = 0; j < n; j++) {
                currRow[j] = new HashMap<>();
            }

            for (int j = 0; j < n; j++) {
                // Skip initialization for first cell on first iteration
                if (i == 0 && j == 0) {
                    // Copy from prevRow[0]
                    currRow[0].putAll(prevRow[0]);
                    continue;
                }

                // Maps to store paths coming from above and left
                Map<Integer, Integer> fromAbove = new HashMap<>();
                Map<Integer, Integer> fromLeft = new HashMap<>();

                // Check cell above (i-1, j)
                if (i > 0) {
                    for (Map.Entry<Integer, Integer> entry : prevRow[j].entrySet()) {
                        int xorVal = entry.getKey();
                        int count = entry.getValue();
                        int newXor = xorVal ^ grid[i][j];
                        fromAbove.put(newXor, fromAbove.getOrDefault(newXor, 0) + count);
                    }
                }

                // Check cell to the left (i, j-1)
                if (j > 0) {
                    for (Map.Entry<Integer, Integer> entry : currRow[j-1].entrySet()) {
                        int xorVal = entry.getKey();
                        int count = entry.getValue();
                        int newXor = xorVal ^ grid[i][j];
                        fromLeft.put(newXor, fromLeft.getOrDefault(newXor, 0) + count);
                    }
                }

                // Merge results from above and left
                Map<Integer, Integer> merged = new HashMap<>();

                // Add paths from above
                for (Map.Entry<Integer, Integer> entry : fromAbove.entrySet()) {
                    int xorVal = entry.getKey();
                    int count = entry.getValue();
                    merged.put(xorVal, merged.getOrDefault(xorVal, 0) + count);
                }

                // Add paths from left
                for (Map.Entry<Integer, Integer> entry : fromLeft.entrySet()) {
                    int xorVal = entry.getKey();
                    int count = entry.getValue();
                    merged.put(xorVal, merged.getOrDefault(xorVal, 0) + count);
                }

                currRow[j] = merged;
            }

            // Move to next row
            prevRow = currRow;
        }

        // Return count for XOR = k in bottom-right cell, or 0 if not found
        return prevRow[n-1].getOrDefault(k, 0);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × S)

- We iterate through all m × n cells
- For each cell, we process up to S distinct XOR values from the cell above and S from the cell to the left
- S is the number of distinct XOR values possible at a cell. In worst case, S could be large (up to number of paths to that cell), but in practice it's bounded by the range of XOR values (which depends on grid values)

**Space Complexity:** O(n × S)

- We store two rows of hash maps (previous and current)
- Each hash map at position j stores up to S key-value pairs
- This is much better than O(m × n × S) which we'd get with a 3D DP array

## Common Mistakes

1. **Using simple count DP without tracking XOR values:** Candidates often try `dp[i][j] = dp[i-1][j] + dp[i][j-1]` which counts total paths but doesn't track which XOR values those paths have. Remember: XOR doesn't have the property that paths with same endpoint have same XOR.

2. **Not handling the starting cell correctly:** The first cell `(0,0)` has XOR value `grid[0][0]`, not 0. A common mistake is initializing with XOR 0 or forgetting to include the first cell's value in the XOR chain.

3. **Memory overflow with 3D DP:** Creating a 3D array `dp[m][n][max_xor]` can easily exceed memory limits since `max_xor` could be up to 2^20 or more. Using hash maps to store only reachable XOR values is crucial.

4. **Forgetting to merge counts from multiple sources:** When a cell can be reached from both above and left, you need to sum the counts for each XOR value from both sources, not just take one or the other.

## When You'll See This Pattern

This "DP with state tracking" pattern appears in problems where:

- You need to count paths or ways subject to a constraint
- The constraint involves a non-aggregatable operation (like XOR, OR, AND)
- The operation value needs to be tracked throughout the path

**Related problems:**

1. **Target Sum (LeetCode 494)** - Count ways to assign +/- to get target sum. Similar state tracking with sum values.
2. **Partition Array Into Two Arrays to Minimize Sum Difference (LeetCode 2035)** - Track possible sums from subsets.
3. **Number of Submatrices That Sum to Target (LeetCode 1074)** - Different problem but uses similar prefix-based counting with hash maps.

## Key Takeaways

1. **When operations aren't aggregatable** (like XOR, OR, AND in paths), you can't use simple DP that only stores counts. You need to track the distribution of all possible operation results at each state.

2. **Hash maps are efficient for sparse state spaces** - Instead of allocating arrays for all possible values (which could be huge), use dictionaries to store only values that actually occur.

3. **Space optimization is often possible** - If you only need the previous row/column, you can reduce space from O(m×n×S) to O(n×S) or O(m×S).

Related problems: [Count Pairs With XOR in a Range](/problem/count-pairs-with-xor-in-a-range)
