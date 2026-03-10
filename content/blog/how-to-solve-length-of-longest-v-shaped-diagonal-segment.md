---
title: "How to Solve Length of Longest V-Shaped Diagonal Segment — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Length of Longest V-Shaped Diagonal Segment. Hard difficulty, 56.3% acceptance rate. Topics: Array, Dynamic Programming, Memoization, Matrix."
date: "2027-12-28"
category: "dsa-patterns"
tags:
  [
    "length-of-longest-v-shaped-diagonal-segment",
    "array",
    "dynamic-programming",
    "memoization",
    "hard",
  ]
---

# How to Solve Length of Longest V-Shaped Diagonal Segment

This problem asks us to find the longest diagonal segment in a matrix where elements follow a specific alternating pattern. What makes this tricky is that we need to track sequences along four diagonal directions (northeast, northwest, southeast, southwest) while maintaining the correct pattern sequence. The pattern must start with `1` and then alternate between `2` and `0` indefinitely.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
grid = [
    [1, 2, 0],
    [2, 0, 2],
    [0, 2, 1]
]
```

We need to check all four diagonal directions from each cell. Let's trace what happens from cell `(0,0)`:

**From (0,0) with value 1:**

- Northeast direction (up-right): Can't go further (out of bounds)
- Northwest direction (up-left): Can't go further
- Southeast direction (down-right): Next cell is `(1,1)` with value `0`. But our pattern requires `2` after `1`, so sequence stops here. Length = 1.
- Southwest direction (down-left): Next cell is `(1,0)` with value `2`. This matches the pattern! Continue to `(2,-1)` which is out of bounds. Length = 2.

**From (0,1) with value 2:**

- Not a valid starting point (must start with `1`)

**From (0,2) with value 0:**

- Not a valid starting point

**From (1,0) with value 2:**

- Not a valid starting point

**From (1,1) with value 0:**

- Not a valid starting point

**From (1,2) with value 2:**

- Not a valid starting point

**From (2,0) with value 0:**

- Not a valid starting point

**From (2,1) with value 2:**

- Not a valid starting point

**From (2,2) with value 1:**

- Northeast: `(1,3)` out of bounds
- Northwest: `(1,1)` has value `0`. Pattern requires `2` after `1`, so stop. Length = 1.
- Southeast: `(3,3)` out of bounds
- Southwest: `(3,1)` out of bounds

The longest V-shaped diagonal segment we found has length 2 (from `(0,0)` southwest direction).

## Brute Force Approach

The brute force approach would be to check every cell as a potential starting point, and for each starting cell, check all four diagonal directions until the pattern breaks or we go out of bounds.

For each cell `(i,j)`:

1. If `grid[i][j] != 1`, skip (not a valid start)
2. For each of the 4 diagonal directions:
   - Initialize length = 1
   - Move in that direction, checking if the next cell has the expected value
   - Expected values alternate: after `1` comes `2`, then `0`, then `2`, then `0`, etc.
   - Continue until pattern breaks or out of bounds
3. Track the maximum length found

This approach has O(n × m × min(n,m)) time complexity because for each of the n×m cells, we might traverse up to min(n,m) cells in a diagonal direction. For a 1000×1000 grid, this could be up to 10⁹ operations, which is too slow.

## Optimized Approach

The key insight is that we can use **dynamic programming with memoization** to avoid redundant calculations. Instead of recomputing the length from each cell for each direction, we can store the results and reuse them.

For each diagonal direction, we can define a DP state:

- `dp_ne[i][j]`: Length of valid sequence starting at `(i,j)` going northeast
- `dp_nw[i][j]`: Length of valid sequence starting at `(i,j)` going northwest
- `dp_se[i][j]`: Length of valid sequence starting at `(i,j)` going southeast
- `dp_sw[i][j]`: Length of valid sequence starting at `(i,j)` going southwest

The recurrence relation depends on the expected next value in the pattern. For example, for the northeast direction:

- If `grid[i][j] == 1`, then `dp_ne[i][j] = 1 + (dp_ne[i-1][j+1] if next cell has value 2 else 0)`
- If `grid[i][j] == 2`, then we need to check if we're continuing a sequence: `dp_ne[i][j] = 1 + (dp_ne[i-1][j+1] if next cell has value 0 else 0)`
- If `grid[i][j] == 0`, then `dp_ne[i][j] = 1 + (dp_ne[i-1][j+1] if next cell has value 2 else 0)`

We need to process cells in the correct order so that when we compute `dp[i][j]`, we've already computed the DP value for the next cell in that direction.

## Optimal Solution

We'll implement a DP solution that processes the matrix in different orders for different directions to ensure dependencies are resolved.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(n * m)
def longestVShapedDiagonal(grid):
    """
    Find the length of the longest V-shaped diagonal segment in the grid.
    A V-shaped diagonal segment starts with 1 and follows the pattern: 2, 0, 2, 0, ...
    """
    if not grid or not grid[0]:
        return 0

    n, m = len(grid), len(grid[0])

    # DP arrays for each diagonal direction
    # dp_ne: northeast (up-right), dp_nw: northwest (up-left)
    # dp_se: southeast (down-right), dp_sw: southwest (down-left)
    dp_ne = [[0] * m for _ in range(n)]
    dp_nw = [[0] * m for _ in range(n)]
    dp_se = [[0] * m for _ in range(n)]
    dp_sw = [[0] * m for _ in range(n)]

    # Helper function to check if coordinates are within bounds
    def in_bounds(i, j):
        return 0 <= i < n and 0 <= j < m

    # Process northeast direction: we need to process from bottom-left to top-right
    # because dp_ne[i][j] depends on dp_ne[i+1][j-1] (which is the next cell in northeast direction)
    for i in range(n-1, -1, -1):  # from bottom to top
        for j in range(m):        # from left to right
            if grid[i][j] == 1:
                # Starting a new sequence
                if in_bounds(i-1, j+1) and grid[i-1][j+1] == 2:
                    dp_ne[i][j] = 1 + dp_ne[i-1][j+1]
                else:
                    dp_ne[i][j] = 1
            elif grid[i][j] == 2:
                # Continuing a sequence, expecting 0 next
                if in_bounds(i-1, j+1) and grid[i-1][j+1] == 0:
                    dp_ne[i][j] = 1 + dp_ne[i-1][j+1]
                else:
                    dp_ne[i][j] = 0  # Not part of a valid sequence starting with 1
            elif grid[i][j] == 0:
                # Continuing a sequence, expecting 2 next
                if in_bounds(i-1, j+1) and grid[i-1][j+1] == 2:
                    dp_ne[i][j] = 1 + dp_ne[i-1][j+1]
                else:
                    dp_ne[i][j] = 0  # Not part of a valid sequence starting with 1

    # Process northwest direction: process from bottom-right to top-left
    for i in range(n-1, -1, -1):  # from bottom to top
        for j in range(m-1, -1, -1):  # from right to left
            if grid[i][j] == 1:
                if in_bounds(i-1, j-1) and grid[i-1][j-1] == 2:
                    dp_nw[i][j] = 1 + dp_nw[i-1][j-1]
                else:
                    dp_nw[i][j] = 1
            elif grid[i][j] == 2:
                if in_bounds(i-1, j-1) and grid[i-1][j-1] == 0:
                    dp_nw[i][j] = 1 + dp_nw[i-1][j-1]
                else:
                    dp_nw[i][j] = 0
            elif grid[i][j] == 0:
                if in_bounds(i-1, j-1) and grid[i-1][j-1] == 2:
                    dp_nw[i][j] = 1 + dp_nw[i-1][j-1]
                else:
                    dp_nw[i][j] = 0

    # Process southeast direction: process from top-left to bottom-right
    for i in range(n):  # from top to bottom
        for j in range(m):  # from left to right
            if grid[i][j] == 1:
                if in_bounds(i+1, j+1) and grid[i+1][j+1] == 2:
                    dp_se[i][j] = 1 + dp_se[i+1][j+1]
                else:
                    dp_se[i][j] = 1
            elif grid[i][j] == 2:
                if in_bounds(i+1, j+1) and grid[i+1][j+1] == 0:
                    dp_se[i][j] = 1 + dp_se[i+1][j+1]
                else:
                    dp_se[i][j] = 0
            elif grid[i][j] == 0:
                if in_bounds(i+1, j+1) and grid[i+1][j+1] == 2:
                    dp_se[i][j] = 1 + dp_se[i+1][j+1]
                else:
                    dp_se[i][j] = 0

    # Process southwest direction: process from top-right to bottom-left
    for i in range(n):  # from top to bottom
        for j in range(m-1, -1, -1):  # from right to left
            if grid[i][j] == 1:
                if in_bounds(i+1, j-1) and grid[i+1][j-1] == 2:
                    dp_sw[i][j] = 1 + dp_sw[i+1][j-1]
                else:
                    dp_sw[i][j] = 1
            elif grid[i][j] == 2:
                if in_bounds(i+1, j-1) and grid[i+1][j-1] == 0:
                    dp_sw[i][j] = 1 + dp_sw[i+1][j-1]
                else:
                    dp_sw[i][j] = 0
            elif grid[i][j] == 0:
                if in_bounds(i+1, j-1) and grid[i+1][j-1] == 2:
                    dp_sw[i][j] = 1 + dp_sw[i+1][j-1]
                else:
                    dp_sw[i][j] = 0

    # Find the maximum length among all directions
    max_length = 0
    for i in range(n):
        for j in range(m):
            # Only consider sequences that start with 1
            if grid[i][j] == 1:
                max_length = max(max_length, dp_ne[i][j], dp_nw[i][j], dp_se[i][j], dp_sw[i][j])

    return max_length
```

```javascript
// Time: O(n * m) | Space: O(n * m)
function longestVShapedDiagonal(grid) {
  /**
   * Find the length of the longest V-shaped diagonal segment in the grid.
   * A V-shaped diagonal segment starts with 1 and follows the pattern: 2, 0, 2, 0, ...
   */
  if (!grid || !grid.length || !grid[0].length) {
    return 0;
  }

  const n = grid.length;
  const m = grid[0].length;

  // DP arrays for each diagonal direction
  const dpNE = Array(n)
    .fill()
    .map(() => Array(m).fill(0));
  const dpNW = Array(n)
    .fill()
    .map(() => Array(m).fill(0));
  const dpSE = Array(n)
    .fill()
    .map(() => Array(m).fill(0));
  const dpSW = Array(n)
    .fill()
    .map(() => Array(m).fill(0));

  // Helper function to check bounds
  const inBounds = (i, j) => i >= 0 && i < n && j >= 0 && j < m;

  // Process northeast direction (bottom-left to top-right)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        if (inBounds(i - 1, j + 1) && grid[i - 1][j + 1] === 2) {
          dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
        } else {
          dpNE[i][j] = 1;
        }
      } else if (grid[i][j] === 2) {
        if (inBounds(i - 1, j + 1) && grid[i - 1][j + 1] === 0) {
          dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
        } else {
          dpNE[i][j] = 0;
        }
      } else if (grid[i][j] === 0) {
        if (inBounds(i - 1, j + 1) && grid[i - 1][j + 1] === 2) {
          dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
        } else {
          dpNE[i][j] = 0;
        }
      }
    }
  }

  // Process northwest direction (bottom-right to top-left)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (grid[i][j] === 1) {
        if (inBounds(i - 1, j - 1) && grid[i - 1][j - 1] === 2) {
          dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
        } else {
          dpNW[i][j] = 1;
        }
      } else if (grid[i][j] === 2) {
        if (inBounds(i - 1, j - 1) && grid[i - 1][j - 1] === 0) {
          dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
        } else {
          dpNW[i][j] = 0;
        }
      } else if (grid[i][j] === 0) {
        if (inBounds(i - 1, j - 1) && grid[i - 1][j - 1] === 2) {
          dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
        } else {
          dpNW[i][j] = 0;
        }
      }
    }
  }

  // Process southeast direction (top-left to bottom-right)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        if (inBounds(i + 1, j + 1) && grid[i + 1][j + 1] === 2) {
          dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
        } else {
          dpSE[i][j] = 1;
        }
      } else if (grid[i][j] === 2) {
        if (inBounds(i + 1, j + 1) && grid[i + 1][j + 1] === 0) {
          dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
        } else {
          dpSE[i][j] = 0;
        }
      } else if (grid[i][j] === 0) {
        if (inBounds(i + 1, j + 1) && grid[i + 1][j + 1] === 2) {
          dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
        } else {
          dpSE[i][j] = 0;
        }
      }
    }
  }

  // Process southwest direction (top-right to bottom-left)
  for (let i = 0; i < n; i++) {
    for (let j = m - 1; j >= 0; j--) {
      if (grid[i][j] === 1) {
        if (inBounds(i + 1, j - 1) && grid[i + 1][j - 1] === 2) {
          dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
        } else {
          dpSW[i][j] = 1;
        }
      } else if (grid[i][j] === 2) {
        if (inBounds(i + 1, j - 1) && grid[i + 1][j - 1] === 0) {
          dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
        } else {
          dpSW[i][j] = 0;
        }
      } else if (grid[i][j] === 0) {
        if (inBounds(i + 1, j - 1) && grid[i + 1][j - 1] === 2) {
          dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
        } else {
          dpSW[i][j] = 0;
        }
      }
    }
  }

  // Find the maximum length
  let maxLength = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        maxLength = Math.max(maxLength, dpNE[i][j], dpNW[i][j], dpSE[i][j], dpSW[i][j]);
      }
    }
  }

  return maxLength;
}
```

```java
// Time: O(n * m) | Space: O(n * m)
class Solution {
    public int longestVShapedDiagonal(int[][] grid) {
        /**
         * Find the length of the longest V-shaped diagonal segment in the grid.
         * A V-shaped diagonal segment starts with 1 and follows the pattern: 2, 0, 2, 0, ...
         */
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int n = grid.length;
        int m = grid[0].length;

        // DP arrays for each diagonal direction
        int[][] dpNE = new int[n][m];
        int[][] dpNW = new int[n][m];
        int[][] dpSE = new int[n][m];
        int[][] dpSW = new int[n][m];

        // Process northeast direction (bottom-left to top-right)
        for (int i = n - 1; i >= 0; i--) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 1) {
                    if (inBounds(i - 1, j + 1, n, m) && grid[i - 1][j + 1] == 2) {
                        dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
                    } else {
                        dpNE[i][j] = 1;
                    }
                } else if (grid[i][j] == 2) {
                    if (inBounds(i - 1, j + 1, n, m) && grid[i - 1][j + 1] == 0) {
                        dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
                    } else {
                        dpNE[i][j] = 0;
                    }
                } else if (grid[i][j] == 0) {
                    if (inBounds(i - 1, j + 1, n, m) && grid[i - 1][j + 1] == 2) {
                        dpNE[i][j] = 1 + dpNE[i - 1][j + 1];
                    } else {
                        dpNE[i][j] = 0;
                    }
                }
            }
        }

        // Process northwest direction (bottom-right to top-left)
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                if (grid[i][j] == 1) {
                    if (inBounds(i - 1, j - 1, n, m) && grid[i - 1][j - 1] == 2) {
                        dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
                    } else {
                        dpNW[i][j] = 1;
                    }
                } else if (grid[i][j] == 2) {
                    if (inBounds(i - 1, j - 1, n, m) && grid[i - 1][j - 1] == 0) {
                        dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
                    } else {
                        dpNW[i][j] = 0;
                    }
                } else if (grid[i][j] == 0) {
                    if (inBounds(i - 1, j - 1, n, m) && grid[i - 1][j - 1] == 2) {
                        dpNW[i][j] = 1 + dpNW[i - 1][j - 1];
                    } else {
                        dpNW[i][j] = 0;
                    }
                }
            }
        }

        // Process southeast direction (top-left to bottom-right)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 1) {
                    if (inBounds(i + 1, j + 1, n, m) && grid[i + 1][j + 1] == 2) {
                        dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
                    } else {
                        dpSE[i][j] = 1;
                    }
                } else if (grid[i][j] == 2) {
                    if (inBounds(i + 1, j + 1, n, m) && grid[i + 1][j + 1] == 0) {
                        dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
                    } else {
                        dpSE[i][j] = 0;
                    }
                } else if (grid[i][j] == 0) {
                    if (inBounds(i + 1, j + 1, n, m) && grid[i + 1][j + 1] == 2) {
                        dpSE[i][j] = 1 + dpSE[i + 1][j + 1];
                    } else {
                        dpSE[i][j] = 0;
                    }
                }
            }
        }

        // Process southwest direction (top-right to bottom-left)
        for (int i = 0; i < n; i++) {
            for (int j = m - 1; j >= 0; j--) {
                if (grid[i][j] == 1) {
                    if (inBounds(i + 1, j - 1, n, m) && grid[i + 1][j - 1] == 2) {
                        dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
                    } else {
                        dpSW[i][j] = 1;
                    }
                } else if (grid[i][j] == 2) {
                    if (inBounds(i + 1, j - 1, n, m) && grid[i + 1][j - 1] == 0) {
                        dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
                    } else {
                        dpSW[i][j] = 0;
                    }
                } else if (grid[i][j] == 0) {
                    if (inBounds(i + 1, j - 1, n, m) && grid[i + 1][j - 1] == 2) {
                        dpSW[i][j] = 1 + dpSW[i + 1][j - 1];
                    } else {
                        dpSW[i][j] = 0;
                    }
                }
            }
        }

        // Find the maximum length
        int maxLength = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 1) {
                    maxLength = Math.max(maxLength,
                                        Math.max(dpNE[i][j],
                                                Math.max(dpNW[i][j],
                                                        Math.max(dpSE[i][j], dpSW[i][j]))));
                }
            }
        }

        return maxLength;
    }

    private boolean inBounds(int i, int j, int n, int m) {
        return i >= 0 && i < n && j >= 0 && j < m;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- We process each cell exactly 4 times (once for each diagonal direction)
- Each processing operation is O(1) - just checking the next cell and accessing DP values
- Total operations: 4 × n × m = O(n × m)

**Space Complexity:** O(n × m)

- We maintain 4 DP arrays of size n × m
- Each array uses n × m space, so total space is 4 × n × m = O(n × m)
- We could optimize to O(min(n,m)) by processing one direction at a time and reusing space, but the code would be more complex

## Common Mistakes

1. **Incorrect traversal order for DP:** The most common mistake is not processing cells in the correct order for each direction. For northeast direction, you must process from bottom-left to top-right because `dp[i][j]` depends on `dp[i-1][j+1]`. If you process top-left to bottom-right, you'll access uncomputed DP values.

2. **Forgetting that only sequences starting with 1 count:** When computing the final answer, some candidates might take the maximum of all DP values. But we should only consider sequences that start with `1`, so we should only look at cells where `grid[i][j] == 1`.

3. **Incorrect pattern checking:** The pattern is `1, 2, 0, 2, 0, ...` not `1, 2, 0, 1, 2, 0, ...`. After the initial `1`, it alternates between `2` and `0` indefinitely. Some candidates mistakenly think the pattern repeats `1, 2, 0`.

4. **Not handling non-starting cells correctly:** For cells with value `2` or `0`, if they don't continue a valid sequence, their DP value should be `0`, not `1`. These cells might be part of a sequence but not at the start.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Matrix DP with directional dependencies:** Similar to problems like:
   - **Longest Increasing Path in a Matrix** (LeetCode 329): Find the longest increasing path in a matrix where you can move in 4 directions.
   - **Bomb Enemy** (LeetCode 361): Calculate enemy kills in 4 directions with DP.

2. **Sequence validation with state:** The pattern checking is similar to:
   - **Valid Parentheses** (LeetCode 20): Checking if a sequence follows specific rules.
   - **Longest Valid Parentheses** (LeetCode 32): Finding the longest valid substring.

3. **Diagonal traversal in matrices:** Many matrix problems require diagonal processing:
   - **Diagonal Traverse** (LeetCode 498): Traverse a matrix in diagonal order.
   - **Toeplitz Matrix** (LeetCode 766): Check if all diagonals have the same elements.

## Key Takeaways

1. **Directional DP requires careful ordering:** When using DP for directional problems in matrices, you must process cells in an order that ensures dependencies are resolved. For opposite directions, you need opposite traversal orders.

2. **Separate state for different directions:** When a problem involves multiple independent directions, maintain separate DP states for each direction. This keeps the logic clean and understandable.

3. **Pattern validation can be incorporated into DP transitions:** Instead of checking the entire pattern from scratch at each step, encode the pattern rules into your DP recurrence relations. This is more efficient than repeatedly validating the same subsequences.

[Practice this problem on CodeJeet](/problem/length-of-longest-v-shaped-diagonal-segment)
