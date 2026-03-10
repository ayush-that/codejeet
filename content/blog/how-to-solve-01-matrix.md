---
title: "How to Solve 01 Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 01 Matrix. Medium difficulty, 53.4% acceptance rate. Topics: Array, Dynamic Programming, Breadth-First Search, Matrix."
date: "2026-11-18"
category: "dsa-patterns"
tags: ["01-matrix", "array", "dynamic-programming", "breadth-first-search", "medium"]
---

# How to Solve 01 Matrix

You're given a binary matrix where each cell is either 0 or 1. Your task is to create a new matrix where each cell contains the distance to the nearest 0. The distance is measured as the number of steps between cells that share an edge (up, down, left, right). This problem is tricky because it's essentially finding the shortest path from every cell to a target cell (0), but doing this efficiently for every cell requires careful thinking about directionality and multiple passes.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Input:
[[0,0,0],
 [0,1,0],
 [1,1,1]]
```

We need to find the distance from each cell to the nearest 0. Let's think about what the answer should be:

- All 0s have distance 0 to themselves
- The center cell (1,1) is adjacent to four 0s, so distance = 1
- The bottom-left cell (2,0) is adjacent to a 0 above it, so distance = 1
- The bottom-middle cell (2,1) is adjacent to the center cell (distance 1), so distance = 2
- The bottom-right cell (2,2) is adjacent to the center cell (distance 1), so distance = 2

So the output should be:

```
[[0,0,0],
 [0,1,0],
 [1,2,1]]
```

Wait, that's not quite right! Let me recalculate: The bottom-right cell (2,2) is actually adjacent to cell (2,1) which has distance 2, making it distance 3... but that's not correct either. The actual shortest path from (2,2) to a 0 is: (2,2) → (2,1) → (1,1) → (0,1) which is 3 steps. But wait, there's a shorter path: (2,2) → (1,2) → (0,2) which is just 2 steps! So the correct output is:

```
[[0,0,0],
 [0,1,0],
 [1,2,1]]
```

Actually, let me trace this more carefully. Starting from the bottom row:

- (2,0): adjacent to (1,0) which is 0 → distance = 1
- (2,1): adjacent to (2,0)=1, (1,1)=1, (2,2)=? → minimum neighbor + 1
- (2,2): adjacent to (1,2)=0 → distance = 1

So the correct output is actually:

```
[[0,0,0],
 [0,1,0],
 [1,2,1]]
```

This shows why we need a systematic approach - it's easy to make mistakes when calculating these distances manually!

## Brute Force Approach

The most straightforward approach is to perform a BFS (Breadth-First Search) from every cell that contains a 1, searching for the nearest 0. For each cell with value 1, we would:

1. Initialize a queue with that cell's position
2. Perform BFS, expanding outward level by level
3. Stop when we find a 0
4. The number of levels expanded is the distance

The problem with this approach is its time complexity. For an m × n matrix with k cells containing 1, each BFS could take O(m × n) time in the worst case (searching the entire matrix). This gives us O(k × m × n) time complexity, which becomes O((m × n)²) when most cells are 1. For a 100×100 matrix, that's 100 million operations - too slow!

Here's what the brute force BFS approach would look like:

<div class="code-group">

```python
# Time: O((m*n)^2) | Space: O(m*n) for BFS queue
def updateMatrixBruteForce(mat):
    m, n = len(mat), len(mat[0])
    result = [[0] * n for _ in range(m)]

    for i in range(m):
        for j in range(n):
            if mat[i][j] == 1:
                # Perform BFS from this cell to find nearest 0
                queue = deque([(i, j)])
                visited = set([(i, j)])
                distance = 0
                found = False

                while queue and not found:
                    level_size = len(queue)
                    for _ in range(level_size):
                        x, y = queue.popleft()

                        if mat[x][y] == 0:
                            result[i][j] = distance
                            found = True
                            break

                        # Add neighbors
                        for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < m and 0 <= ny < n and (nx, ny) not in visited:
                                visited.add((nx, ny))
                                queue.append((nx, ny))

                    distance += 1

    return result
```

```javascript
// Time: O((m*n)^2) | Space: O(m*n) for BFS queue
function updateMatrixBruteForce(mat) {
  const m = mat.length,
    n = mat[0].length;
  const result = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 1) {
        // Perform BFS from this cell to find nearest 0
        const queue = [[i, j]];
        const visited = new Set([`${i},${j}`]);
        let distance = 0;
        let found = false;

        while (queue.length > 0 && !found) {
          const levelSize = queue.length;
          for (let k = 0; k < levelSize; k++) {
            const [x, y] = queue.shift();

            if (mat[x][y] === 0) {
              result[i][j] = distance;
              found = true;
              break;
            }

            // Add neighbors
            const directions = [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ];
            for (const [dx, dy] of directions) {
              const nx = x + dx,
                ny = y + dy;
              if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                queue.push([nx, ny]);
              }
            }
          }
          distance++;
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O((m*n)^2) | Space: O(m*n) for BFS queue
public int[][] updateMatrixBruteForce(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int[][] result = new int[m][n];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (mat[i][j] == 1) {
                // Perform BFS from this cell to find nearest 0
                Queue<int[]> queue = new LinkedList<>();
                queue.offer(new int[]{i, j});
                boolean[][] visited = new boolean[m][n];
                visited[i][j] = true;
                int distance = 0;
                boolean found = false;

                while (!queue.isEmpty() && !found) {
                    int levelSize = queue.size();
                    for (int k = 0; k < levelSize; k++) {
                        int[] cell = queue.poll();
                        int x = cell[0], y = cell[1];

                        if (mat[x][y] == 0) {
                            result[i][j] = distance;
                            found = true;
                            break;
                        }

                        // Add neighbors
                        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
                        for (int[] dir : directions) {
                            int nx = x + dir[0], ny = y + dir[1];
                            if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
                                visited[nx][ny] = true;
                                queue.offer(new int[]{nx, ny});
                            }
                        }
                    }
                    distance++;
                }
            }
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we can reverse the problem: instead of starting from each 1 and searching for the nearest 0, we can start from all 0s simultaneously and propagate distances outward. This is a **multi-source BFS** approach.

Think of it like a ripple effect in water: if you drop multiple stones (the 0s) into a pond at the same time, the ripples expand outward. When ripples from different stones meet, the cell takes the distance from whichever ripple reached it first (which will be the shortest distance).

Here's the step-by-step reasoning:

1. **Initialize**: All 0 cells have distance 0 (they're already at a 0). All 1 cells are initially set to infinity (or a large number) since we don't know their distance yet.

2. **Multi-source BFS**: Start a BFS from ALL 0 cells simultaneously. Add all 0 cells to the queue with distance 0.

3. **Propagate distances**: For each cell we process, check its four neighbors. If we can give a neighbor a shorter distance than it currently has, update it and add it to the queue to continue propagating.

4. **Why this works**: BFS guarantees that we process cells in order of increasing distance from the nearest 0. When we first visit a cell, we've found the shortest path to it from some 0.

An even more optimized approach uses **dynamic programming** with two passes:

- First pass: Top-left to bottom-right, considering only up and left neighbors
- Second pass: Bottom-right to top-left, considering only down and right neighbors

This works because the shortest path to a 0 could come from any direction, and by making two passes (one forward, one backward), we cover all possible directions.

## Optimal Solution

Here's the optimal solution using dynamic programming with two passes. This approach runs in O(m × n) time with O(1) extra space (if we modify the input matrix, or O(m × n) if we need to preserve it).

<div class="code-group">

```python
# Time: O(m*n) | Space: O(1) if we can modify input, otherwise O(m*n)
def updateMatrix(mat):
    """
    Returns a matrix where each cell contains the distance to the nearest 0.
    Uses dynamic programming with two passes to find minimum distances.
    """
    m, n = len(mat), len(mat[0])

    # Initialize result matrix with large values (greater than any possible distance)
    # We use a value larger than m+n since that's the maximum possible distance
    result = [[float('inf')] * n for _ in range(m)]

    # First pass: check for left and top neighbors
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 0:
                result[i][j] = 0
            else:
                # Check top neighbor if it exists
                if i > 0:
                    result[i][j] = min(result[i][j], result[i-1][j] + 1)
                # Check left neighbor if it exists
                if j > 0:
                    result[i][j] = min(result[i][j], result[i][j-1] + 1)

    # Second pass: check for right and bottom neighbors
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            if mat[i][j] != 0:  # Only need to update non-zero cells
                # Check bottom neighbor if it exists
                if i < m-1:
                    result[i][j] = min(result[i][j], result[i+1][j] + 1)
                # Check right neighbor if it exists
                if j < n-1:
                    result[i][j] = min(result[i][j], result[i][j+1] + 1)

    return result
```

```javascript
// Time: O(m*n) | Space: O(1) if we can modify input, otherwise O(m*n)
function updateMatrix(mat) {
  /**
   * Returns a matrix where each cell contains the distance to the nearest 0.
   * Uses dynamic programming with two passes to find minimum distances.
   */
  const m = mat.length,
    n = mat[0].length;

  // Initialize result matrix with large values (greater than any possible distance)
  // We use Infinity to represent unknown distances
  const result = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));

  // First pass: check for left and top neighbors
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        result[i][j] = 0;
      } else {
        // Check top neighbor if it exists
        if (i > 0) {
          result[i][j] = Math.min(result[i][j], result[i - 1][j] + 1);
        }
        // Check left neighbor if it exists
        if (j > 0) {
          result[i][j] = Math.min(result[i][j], result[i][j - 1] + 1);
        }
      }
    }
  }

  // Second pass: check for right and bottom neighbors
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (mat[i][j] !== 0) {
        // Only need to update non-zero cells
        // Check bottom neighbor if it exists
        if (i < m - 1) {
          result[i][j] = Math.min(result[i][j], result[i + 1][j] + 1);
        }
        // Check right neighbor if it exists
        if (j < n - 1) {
          result[i][j] = Math.min(result[i][j], result[i][j + 1] + 1);
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(m*n) | Space: O(1) if we can modify input, otherwise O(m*n)
public int[][] updateMatrix(int[][] mat) {
    /**
     * Returns a matrix where each cell contains the distance to the nearest 0.
     * Uses dynamic programming with two passes to find minimum distances.
     */
    int m = mat.length, n = mat[0].length;

    // Initialize result matrix with large values (greater than any possible distance)
    // We use Integer.MAX_VALUE - 100000 to avoid overflow when adding 1
    int[][] result = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            result[i][j] = Integer.MAX_VALUE - 100000;
        }
    }

    // First pass: check for left and top neighbors
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (mat[i][j] == 0) {
                result[i][j] = 0;
            } else {
                // Check top neighbor if it exists
                if (i > 0) {
                    result[i][j] = Math.min(result[i][j], result[i-1][j] + 1);
                }
                // Check left neighbor if it exists
                if (j > 0) {
                    result[i][j] = Math.min(result[i][j], result[i][j-1] + 1);
                }
            }
        }
    }

    // Second pass: check for right and bottom neighbors
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            if (mat[i][j] != 0) {  // Only need to update non-zero cells
                // Check bottom neighbor if it exists
                if (i < m - 1) {
                    result[i][j] = Math.min(result[i][j], result[i+1][j] + 1);
                }
                // Check right neighbor if it exists
                if (j < n - 1) {
                    result[i][j] = Math.min(result[i][j], result[i][j+1] + 1);
                }
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We make two passes over the entire matrix
- Each pass visits every cell exactly once
- For each cell, we do a constant amount of work (checking up to 4 neighbors)

**Space Complexity: O(m × n)**

- We need to store the result matrix
- If we're allowed to modify the input matrix, we could use it to store distances and achieve O(1) extra space
- The BFS queue approach would also use O(m × n) space in the worst case

The two-pass DP approach is optimal because we must examine every cell at least once to compute its distance, giving us a lower bound of Ω(m × n).

## Common Mistakes

1. **Infinite loop in BFS**: Forgetting to mark cells as visited when using the multi-source BFS approach. This can cause cells to be processed multiple times, leading to incorrect distances or infinite loops.

2. **Incorrect initialization**: Setting initial distances for 1 cells to 0 instead of a large value. This would make the algorithm think all 1s are already at distance 0 from a 0.

3. **Boundary condition errors**: Not checking array bounds when accessing neighbors. For example, trying to access `mat[i-1][j]` when `i = 0` will cause an index error.

4. **Only checking in one direction**: Some candidates try to solve this with a single pass, checking only left and top neighbors. This misses paths that come from the right or bottom. Always remember: the shortest path to a 0 could come from any direction.

5. **Integer overflow in Java**: When using `Integer.MAX_VALUE` as the initial "infinity" value, adding 1 to it causes overflow. Use `Integer.MAX_VALUE - 100000` or similar to avoid this.

## When You'll See This Pattern

This "multi-source BFS" or "two-pass DP" pattern appears in several grid-based shortest path problems:

1. **Rotting Oranges (LeetCode 994)**: Similar concept where you start BFS from all rotten oranges simultaneously and propagate the "rottenness" to fresh oranges.

2. **Walls and Gates (LeetCode Premium)**: Almost identical problem - fill each empty room with the distance to the nearest gate.

3. **Shortest Path in Binary Matrix (LeetCode 1091)**: Finding the shortest path from top-left to bottom-right in a binary matrix, though this is single-source rather than multi-source.

4. **As Far from Land as Possible (LeetCode 1162)**: Find a water cell with the maximum distance to any land cell, which is essentially the same problem but looking for maximums instead of minimums.

The key insight to recognize this pattern: when you need to compute distances from every cell to the nearest instance of a target cell type, think multi-source BFS or two-pass DP.

## Key Takeaways

1. **Reverse the problem**: Instead of searching from each cell to find a target, start from all targets and propagate outward. This changes O(k × m × n) to O(m × n).

2. **Two-pass DP for grid shortest paths**: When you need shortest paths in a grid with uniform edge weights (1), you can often solve it with two passes - one forward, one backward - to cover all directions.

3. **Multi-source BFS is BFS with multiple starting points**: The BFS algorithm naturally handles multiple sources - just initialize the queue with all starting points at distance 0.

4. **Grid problems often have O(m × n) optimal solutions**: Since you must at least look at every cell, O(m × n) is often the best you can do for matrix problems.

Remember: when you see "nearest" or "shortest distance" in a grid problem, think BFS or DP. If the problem asks for distances from every cell to multiple targets, think multi-source BFS or two-pass DP.

Related problems: [Shortest Path to Get Food](/problem/shortest-path-to-get-food), [Minimum Operations to Remove Adjacent Ones in Matrix](/problem/minimum-operations-to-remove-adjacent-ones-in-matrix), [Difference Between Ones and Zeros in Row and Column](/problem/difference-between-ones-and-zeros-in-row-and-column)
