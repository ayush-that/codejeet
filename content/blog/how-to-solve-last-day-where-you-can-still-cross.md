---
title: "How to Solve Last Day Where You Can Still Cross — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Last Day Where You Can Still Cross. Hard difficulty, 68.6% acceptance rate. Topics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union-Find."
date: "2026-12-28"
category: "dsa-patterns"
tags: ["last-day-where-you-can-still-cross", "array", "binary-search", "depth-first-search", "hard"]
---

# How to Solve Last Day Where You Can Still Cross

This problem presents a dynamic grid where water cells appear over time, and we need to find the last day when a path from the top row to the bottom row still exists through land cells. What makes this tricky is that the grid changes daily, and we need to efficiently determine connectivity across rows as water gradually floods the matrix. The challenge lies in avoiding repeated BFS/DFS searches for each day, which would be prohibitively slow.

## Visual Walkthrough

Let's trace through a small example with `row = 2`, `col = 2`, and `cells = [[1,1],[2,1],[1,2],[2,2]]`.

**Day 0:** All cells are land (0's). We can cross from top to bottom.

```
[0 0]
[0 0]  ✓ Can cross
```

**Day 1:** Cell (1,1) becomes water. Still can cross.

```
[1 0]
[0 0]  ✓ Can cross (use right column)
```

**Day 2:** Cell (2,1) becomes water. Still can cross.

```
[1 0]
[1 0]  ✓ Can cross (use right column)
```

**Day 3:** Cell (1,2) becomes water. Now blocked!

```
[1 1]
[1 0]  ✗ Cannot cross (top row all water)
```

**Day 4:** Cell (2,2) becomes water (all water now).

```
[1 1]
[1 1]  ✗ Cannot cross
```

The answer is day 2, since day 3 is the first day we cannot cross.

The key insight: Instead of checking each day from 0 to n, we can use **binary search** to find the transition point between "can cross" and "cannot cross", combined with **BFS/DFS** or **Union-Find** to check connectivity for a specific day.

## Brute Force Approach

A naive approach would simulate each day sequentially:

1. For each day `d` from 0 to `len(cells)`:
   - Create a grid with water cells up to day `d`
   - Run BFS/DFS from the top row to see if we can reach the bottom
2. Return the last day where crossing was possible

This approach has O((row×col)²) time complexity since we perform O(row×col) BFS operations, each taking O(row×col) time. For a 200×200 grid with 40,000 cells, this would be ~1.6 billion operations — far too slow.

## Optimized Approach

The optimal solution combines **binary search** with **Union-Find**:

**Why binary search works:**

- If we can cross on day `d`, we can certainly cross on all earlier days (since less water)
- If we cannot cross on day `d`, we cannot cross on any later days (since more water)
- This monotonic property (can cross → cannot cross) allows binary search

**Why Union-Find is efficient:**

- Instead of BFS/DFS for each binary search check, we can build connectivity incrementally
- We add land cells in reverse (from last day to first) and check connectivity
- Union-Find gives us O(α(n)) per operation, where α is the inverse Ackermann function

**Key insight:** We can think backwards! Instead of adding water cells day by day, we start with all water cells (final state) and gradually add land cells backwards in time. This way, we're looking for the first day (in reverse) when the grid becomes connected from top to bottom.

## Optimal Solution

We'll implement the binary search + Union-Find approach:

<div class="code-group">

```python
# Time: O((row*col) * α(row*col) * log(row*col)) | Space: O(row*col)
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

class Solution:
    def latestDayToCross(self, row: int, col: int, cells: List[List[int]]) -> int:
        # Convert to 0-based indexing for easier calculations
        cells = [(r-1, c-1) for r, c in cells]

        # Binary search for the answer
        left, right = 0, len(cells) - 1
        answer = 0

        while left <= right:
            mid = (left + right) // 2

            # Create grid with water up to day 'mid'
            grid = [[0] * col for _ in range(row)]
            for i in range(mid + 1):
                r, c = cells[i]
                grid[r][c] = 1  # 1 represents water

            # Initialize Union-Find with two extra nodes for top and bottom
            # We'll connect all top row cells to a virtual top node
            # and all bottom row cells to a virtual bottom node
            uf = UnionFind(row * col + 2)
            top_node = row * col
            bottom_node = row * col + 1

            # Connect top row to virtual top node
            for c in range(col):
                if grid[0][c] == 0:  # Land cell
                    uf.union(c, top_node)

            # Connect bottom row to virtual bottom node
            for c in range(col):
                if grid[row-1][c] == 0:  # Land cell
                    uf.union((row-1) * col + c, bottom_node)

            # Connect adjacent land cells
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            for r in range(row):
                for c in range(col):
                    if grid[r][c] == 1:  # Skip water cells
                        continue

                    current_idx = r * col + c

                    # Check all 4 neighbors
                    for dr, dc in directions:
                        nr, nc = r + dr, c + dc

                        # Check bounds and ensure neighbor is land
                        if 0 <= nr < row and 0 <= nc < col and grid[nr][nc] == 0:
                            neighbor_idx = nr * col + nc
                            uf.union(current_idx, neighbor_idx)

            # Check if top and bottom are connected
            if uf.find(top_node) == uf.find(bottom_node):
                # Can still cross on day 'mid'
                answer = mid
                left = mid + 1  # Try later days
            else:
                # Cannot cross on day 'mid'
                right = mid - 1  # Try earlier days

        # The answer is the last day we can cross, which is 'answer'
        # But we need to return day number (1-based), not index
        return answer + 1
```

```javascript
// Time: O((row*col) * α(row*col) * log(row*col)) | Space: O(row*col)
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false;
    }

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

/**
 * @param {number} row
 * @param {number} col
 * @param {number[][]} cells
 * @return {number}
 */
var latestDayToCross = function (row, col, cells) {
  // Convert to 0-based indexing
  cells = cells.map(([r, c]) => [r - 1, c - 1]);

  let left = 0,
    right = cells.length - 1;
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Create grid with water up to day 'mid'
    const grid = Array.from({ length: row }, () => new Array(col).fill(0));
    for (let i = 0; i <= mid; i++) {
      const [r, c] = cells[i];
      grid[r][c] = 1; // 1 represents water
    }

    // Initialize Union-Find with virtual top and bottom nodes
    const uf = new UnionFind(row * col + 2);
    const topNode = row * col;
    const bottomNode = row * col + 1;

    // Connect top row to virtual top node
    for (let c = 0; c < col; c++) {
      if (grid[0][c] === 0) {
        // Land cell
        uf.union(c, topNode);
      }
    }

    // Connect bottom row to virtual bottom node
    for (let c = 0; c < col; c++) {
      if (grid[row - 1][c] === 0) {
        // Land cell
        uf.union((row - 1) * col + c, bottomNode);
      }
    }

    // Connect adjacent land cells
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (let r = 0; r < row; r++) {
      for (let c = 0; c < col; c++) {
        if (grid[r][c] === 1) continue; // Skip water cells

        const currentIdx = r * col + c;

        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;

          // Check bounds and ensure neighbor is land
          if (nr >= 0 && nr < row && nc >= 0 && nc < col && grid[nr][nc] === 0) {
            const neighborIdx = nr * col + nc;
            uf.union(currentIdx, neighborIdx);
          }
        }
      }
    }

    // Check if top and bottom are connected
    if (uf.find(topNode) === uf.find(bottomNode)) {
      // Can still cross on day 'mid'
      answer = mid;
      left = mid + 1; // Try later days
    } else {
      // Cannot cross on day 'mid'
      right = mid - 1; // Try earlier days
    }
  }

  // Return day number (1-based)
  return answer + 1;
};
```

```java
// Time: O((row*col) * α(row*col) * log(row*col)) | Space: O(row*col)
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false;
        }

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}

class Solution {
    public int latestDayToCross(int row, int col, int[][] cells) {
        // Convert to 0-based indexing
        int[][] adjustedCells = new int[cells.length][2];
        for (int i = 0; i < cells.length; i++) {
            adjustedCells[i][0] = cells[i][0] - 1;
            adjustedCells[i][1] = cells[i][1] - 1;
        }

        int left = 0, right = cells.length - 1;
        int answer = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Create grid with water up to day 'mid'
            int[][] grid = new int[row][col];
            for (int i = 0; i <= mid; i++) {
                int r = adjustedCells[i][0];
                int c = adjustedCells[i][1];
                grid[r][c] = 1;  // 1 represents water
            }

            // Initialize Union-Find with virtual top and bottom nodes
            UnionFind uf = new UnionFind(row * col + 2);
            int topNode = row * col;
            int bottomNode = row * col + 1;

            // Connect top row to virtual top node
            for (int c = 0; c < col; c++) {
                if (grid[0][c] == 0) {  // Land cell
                    uf.union(c, topNode);
                }
            }

            // Connect bottom row to virtual bottom node
            for (int c = 0; c < col; c++) {
                if (grid[row - 1][c] == 0) {  // Land cell
                    uf.union((row - 1) * col + c, bottomNode);
                }
            }

            // Connect adjacent land cells
            int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
            for (int r = 0; r < row; r++) {
                for (int c = 0; c < col; c++) {
                    if (grid[r][c] == 1) continue;  // Skip water cells

                    int currentIdx = r * col + c;

                    for (int[] dir : directions) {
                        int nr = r + dir[0];
                        int nc = c + dir[1];

                        // Check bounds and ensure neighbor is land
                        if (nr >= 0 && nr < row && nc >= 0 && nc < col && grid[nr][nc] == 0) {
                            int neighborIdx = nr * col + nc;
                            uf.union(currentIdx, neighborIdx);
                        }
                    }
                }
            }

            // Check if top and bottom are connected
            if (uf.find(topNode) == uf.find(bottomNode)) {
                // Can still cross on day 'mid'
                answer = mid;
                left = mid + 1;  // Try later days
            } else {
                // Cannot cross on day 'mid'
                right = mid - 1;  // Try earlier days
            }
        }

        // Return day number (1-based)
        return answer + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((row×col) × α(row×col) × log(row×col))

- Binary search runs O(log(row×col)) times
- For each binary search check, we build the grid (O(row×col)) and perform Union-Find operations on all land cells
- Each Union-Find operation takes O(α(row×col)) time, where α is the inverse Ackermann function (effectively constant)
- Total: O((row×col) × α(row×col) × log(row×col))

**Space Complexity:** O(row×col)

- We store the grid: O(row×col)
- Union-Find data structures: O(row×col)
- Total: O(row×col)

## Common Mistakes

1. **Forgetting 1-based to 0-based conversion:** The input uses 1-based indexing, but our code uses 0-based. Forgetting to convert leads to index out of bounds errors.

2. **Incorrect binary search boundaries:** Using `while (left < right)` instead of `while (left <= right)` can miss the exact transition point. Remember to update `answer` when we find a valid day.

3. **Not using virtual nodes for top/bottom:** Trying to check connectivity between every top cell and every bottom cell is O(col²) per check. Virtual nodes reduce this to O(1).

4. **Checking water connectivity instead of land:** The problem asks for a path through land cells (0's), not water cells. Double-check your grid representation.

## When You'll See This Pattern

This "binary search + connectivity check" pattern appears in problems where:

1. You need to find a threshold or transition point
2. The property is monotonic (once it becomes false, it stays false)
3. Checking the property for a given threshold is expensive

**Related problems:**

- **Bricks Falling When Hit (Hard):** Similar grid connectivity problem where hits occur in sequence
- **Escape the Spreading Fire (Hard):** Finding the latest time to escape as fire spreads
- **Swim in Rising Water (Hard):** Finding the minimum time to swim as water rises

## Key Takeaways

1. **When you see "find the last day/time when something is possible," think binary search** — if the property is monotonic, binary search can reduce O(n) to O(log n).

2. **Union-Find is excellent for dynamic connectivity problems** — especially when you need to repeatedly check if two sets are connected as elements are added or removed.

3. **Virtual nodes simplify boundary conditions** — adding dummy nodes for "top" and "bottom" transforms a multi-source connectivity check into a simple two-node check.

Related problems: [Bricks Falling When Hit](/problem/bricks-falling-when-hit), [Escape the Spreading Fire](/problem/escape-the-spreading-fire)
