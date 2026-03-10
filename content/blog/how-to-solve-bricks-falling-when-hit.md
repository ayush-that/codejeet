---
title: "How to Solve Bricks Falling When Hit — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Bricks Falling When Hit. Hard difficulty, 36.9% acceptance rate. Topics: Array, Union-Find, Matrix."
date: "2028-12-27"
category: "dsa-patterns"
tags: ["bricks-falling-when-hit", "array", "union-find", "matrix", "hard"]
---

# How to Solve Bricks Falling When Hit

This problem presents a grid of bricks where bricks are "stable" if they're connected to the top row either directly or through other stable bricks. When we hit bricks (remove them), we need to determine how many bricks fall (become unstable) after each hit. The challenge is that removing one brick can cause a chain reaction—bricks that were previously stable can become disconnected from the top, causing them to fall too. This makes a naive simulation approach extremely inefficient.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
Initial grid (3x3):
1 1 1
1 1 1
1 1 1

Hits: [[1,1], [0,0]]
```

**Step 1: Initial state**
All bricks are stable because they're all connected to the top row.

**Step 2: First hit at [1,1]**
We remove the center brick:

```
1 1 1
1 0 1
1 1 1
```

Now check what falls:

- Top row bricks remain stable (connected to top)
- Brick at [1,0] is stable (connected to [0,0])
- Brick at [1,2] is stable (connected to [0,2])
- Brick at [2,0] is stable (connected to [1,0])
- Brick at [2,1] is stable (connected to [2,0] and [2,2])
- Brick at [2,2] is stable (connected to [1,2])

No bricks fall! The answer for first hit is 0.

**Step 3: Second hit at [0,0]**
We remove the top-left brick:

```
0 1 1
1 0 1
1 1 1
```

Now check what falls:

- Brick at [0,1] is still stable (connected to top row at [0,2])
- Brick at [0,2] is stable (connected to top)
- Brick at [1,0] loses its connection to top through [0,0]
- Brick at [2,0] loses connection through [1,0]
- Brick at [2,1] loses connection through [2,0]
- Brick at [1,2] and [2,2] remain stable

We need to check connectivity: The left column [1,0] and [2,0] are now disconnected from top. Brick [2,1] is also disconnected since it only connects through [2,0]. So 3 bricks fall.

The key insight: Instead of checking stability after each removal (which is O(m×n) per hit), we need a way to track connectivity efficiently.

## Brute Force Approach

The brute force approach would be:

1. For each hit in sequence:
2. Remove the brick at the hit location
3. Perform BFS/DFS from the top row to find all bricks still connected to top
4. Count how many bricks are no longer connected (these fell)
5. Actually remove the fallen bricks from the grid

This approach has several problems:

- Each hit requires O(m×n) time for BFS/DFS
- We need to actually update the grid after counting fallen bricks
- With h hits, complexity becomes O(h × m × n), which is too slow for constraints (m,n up to 200, h up to 10^4)

The fundamental issue is that we're recomputing connectivity from scratch after each hit, even though most of the grid hasn't changed.

## Optimized Approach

The key insight is to work **backwards**:

1. Instead of removing bricks and seeing what falls, add bricks back in reverse order and see what gets reconnected
2. Use Union-Find (Disjoint Set Union) to efficiently track connectivity
3. Create a special "top" node that represents connection to the top row

Why backwards?

- When we add a brick back, we only need to check its neighbors
- If adding a brick connects a component to the top, we know those bricks would have fallen when it was removed
- We can track component sizes to know how many bricks get reconnected

Steps for the optimal solution:

1. Mark all hit locations as empty (temporarily remove all hit bricks)
2. Build Union-Find with all bricks that remain after all hits
3. Process hits in reverse order:
   - Add the brick back at hit location
   - Union it with any neighboring bricks
   - If this connects the component to the top, count how many bricks were in that component before the connection
   - The difference is how many bricks fell when this brick was hit

## Optimal Solution

<div class="code-group">

```python
# Time: O((m*n + h) * α(m*n)) where α is inverse Ackermann (near constant)
# Space: O(m*n) for Union-Find data structures
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return
        # Union by size
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]

    def get_size(self, x):
        # Get size of component containing x
        return self.size[self.find(x)]

class Solution:
    def hitBricks(self, grid: List[List[int]], hits: List[List[int]]) -> List[int]:
        m, n = len(grid), len(grid[0])

        # Step 1: Create a copy of grid and mark all hits as 0
        # We'll process hits in reverse, so we need to know original state
        grid_copy = [row[:] for row in grid]
        for r, c in hits:
            grid_copy[r][c] = 0

        # Step 2: Initialize Union-Find with an extra node for "top"
        uf = UnionFind(m * n + 1)  # Last node is "top" node
        top_node = m * n  # Index of the special top node

        # Helper to convert 2D coordinates to 1D index
        def index(r, c):
            return r * n + c

        # Step 3: Connect all remaining bricks after all hits
        # First, connect all top-row bricks to the top node
        for c in range(n):
            if grid_copy[0][c] == 1:
                uf.union(index(0, c), top_node)

        # Connect neighboring bricks
        for r in range(m):
            for c in range(n):
                if grid_copy[r][c] == 1:
                    # Check right neighbor
                    if c + 1 < n and grid_copy[r][c + 1] == 1:
                        uf.union(index(r, c), index(r, c + 1))
                    # Check down neighbor
                    if r + 1 < m and grid_copy[r + 1][c] == 1:
                        uf.union(index(r, c), index(r + 1, c))

        # Step 4: Process hits in reverse order
        result = [0] * len(hits)
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

        for i in range(len(hits) - 1, -1, -1):
            r, c = hits[i]

            # If there was no brick here originally, skip
            if grid[r][c] == 0:
                continue

            # Record size of top-connected component before adding this brick
            prev_top_size = uf.get_size(top_node)

            # Add the brick back
            grid_copy[r][c] = 1

            # If this brick is in top row, connect it to top node
            if r == 0:
                uf.union(index(r, c), top_node)

            # Connect to neighboring bricks
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid_copy[nr][nc] == 1:
                    uf.union(index(r, c), index(nr, nc))

            # Get new size of top-connected component
            new_top_size = uf.get_size(top_node)

            # The number of bricks that fell when this brick was hit is:
            # (new size - old size - 1) because:
            # - We subtract 1 for the brick we just added back
            # - Only count if new size > old size (brick connected to top)
            if new_top_size > prev_top_size:
                result[i] = new_top_size - prev_top_size - 1

        return result
```

```javascript
// Time: O((m*n + h) * α(m*n)) where α is inverse Ackermann (near constant)
// Space: O(m*n) for Union-Find data structures
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;

    // Union by size
    if (this.size[rootX] < this.size[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }
    this.parent[rootY] = rootX;
    this.size[rootX] += this.size[rootY];
  }

  getSize(x) {
    // Get size of component containing x
    return this.size[this.find(x)];
  }
}

/**
 * @param {number[][]} grid
 * @param {number[][]} hits
 * @return {number[]}
 */
var hitBricks = function (grid, hits) {
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Create a copy of grid and mark all hits as 0
  const gridCopy = grid.map((row) => [...row]);
  for (const [r, c] of hits) {
    gridCopy[r][c] = 0;
  }

  // Step 2: Initialize Union-Find with an extra node for "top"
  const uf = new UnionFind(m * n + 1);
  const topNode = m * n; // Index of the special top node

  // Helper to convert 2D coordinates to 1D index
  const index = (r, c) => r * n + c;

  // Step 3: Connect all remaining bricks after all hits
  // First, connect all top-row bricks to the top node
  for (let c = 0; c < n; c++) {
    if (gridCopy[0][c] === 1) {
      uf.union(index(0, c), topNode);
    }
  }

  // Connect neighboring bricks
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (gridCopy[r][c] === 1) {
        // Check right neighbor
        if (c + 1 < n && gridCopy[r][c + 1] === 1) {
          uf.union(index(r, c), index(r, c + 1));
        }
        // Check down neighbor
        if (r + 1 < m && gridCopy[r + 1][c] === 1) {
          uf.union(index(r, c), index(r + 1, c));
        }
      }
    }
  }

  // Step 4: Process hits in reverse order
  const result = Array(hits.length).fill(0);
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (let i = hits.length - 1; i >= 0; i--) {
    const [r, c] = hits[i];

    // If there was no brick here originally, skip
    if (grid[r][c] === 0) {
      continue;
    }

    // Record size of top-connected component before adding this brick
    const prevTopSize = uf.getSize(topNode);

    // Add the brick back
    gridCopy[r][c] = 1;

    // If this brick is in top row, connect it to top node
    if (r === 0) {
      uf.union(index(r, c), topNode);
    }

    // Connect to neighboring bricks
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && gridCopy[nr][nc] === 1) {
        uf.union(index(r, c), index(nr, nc));
      }
    }

    // Get new size of top-connected component
    const newTopSize = uf.getSize(topNode);

    // The number of bricks that fell when this brick was hit is:
    // (new size - old size - 1) because:
    // - We subtract 1 for the brick we just added back
    // - Only count if new size > old size (brick connected to top)
    if (newTopSize > prevTopSize) {
      result[i] = newTopSize - prevTopSize - 1;
    }
  }

  return result;
};
```

```java
// Time: O((m*n + h) * α(m*n)) where α is inverse Ackermann (near constant)
// Space: O(m*n) for Union-Find data structures
class UnionFind {
    private int[] parent;
    private int[] size;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;

        // Union by size
        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
    }

    public int getSize(int x) {
        // Get size of component containing x
        return size[find(x)];
    }
}

class Solution {
    public int[] hitBricks(int[][] grid, int[][] hits) {
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Create a copy of grid and mark all hits as 0
        int[][] gridCopy = new int[m][n];
        for (int i = 0; i < m; i++) {
            gridCopy[i] = grid[i].clone();
        }
        for (int[] hit : hits) {
            gridCopy[hit[0]][hit[1]] = 0;
        }

        // Step 2: Initialize Union-Find with an extra node for "top"
        UnionFind uf = new UnionFind(m * n + 1);
        int topNode = m * n;  // Index of the special top node

        // Helper to convert 2D coordinates to 1D index
        int index(int r, int c) {
            return r * n + c;
        }

        // Step 3: Connect all remaining bricks after all hits
        // First, connect all top-row bricks to the top node
        for (int c = 0; c < n; c++) {
            if (gridCopy[0][c] == 1) {
                uf.union(index(0, c), topNode);
            }
        }

        // Connect neighboring bricks
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (gridCopy[r][c] == 1) {
                    // Check right neighbor
                    if (c + 1 < n && gridCopy[r][c + 1] == 1) {
                        uf.union(index(r, c), index(r, c + 1));
                    }
                    // Check down neighbor
                    if (r + 1 < m && gridCopy[r + 1][c] == 1) {
                        uf.union(index(r, c), index(r + 1, c));
                    }
                }
            }
        }

        // Step 4: Process hits in reverse order
        int[] result = new int[hits.length];
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

        for (int i = hits.length - 1; i >= 0; i--) {
            int r = hits[i][0];
            int c = hits[i][1];

            // If there was no brick here originally, skip
            if (grid[r][c] == 0) {
                continue;
            }

            // Record size of top-connected component before adding this brick
            int prevTopSize = uf.getSize(topNode);

            // Add the brick back
            gridCopy[r][c] = 1;

            // If this brick is in top row, connect it to top node
            if (r == 0) {
                uf.union(index(r, c), topNode);
            }

            // Connect to neighboring bricks
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && gridCopy[nr][nc] == 1) {
                    uf.union(index(r, c), index(nr, nc));
                }
            }

            // Get new size of top-connected component
            int newTopSize = uf.getSize(topNode);

            // The number of bricks that fell when this brick was hit is:
            // (new size - old size - 1) because:
            // - We subtract 1 for the brick we just added back
            // - Only count if new size > old size (brick connected to top)
            if (newTopSize > prevTopSize) {
                result[i] = newTopSize - prevTopSize - 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((m×n + h) × α(m×n))

- Building the initial Union-Find after all hits: O(m×n × α(m×n))
- Processing each hit in reverse: O(h × α(m×n))
- The α(m×n) is the inverse Ackermann function, which grows extremely slowly (effectively constant for practical input sizes)

**Space Complexity:** O(m×n)

- Union-Find data structures: O(m×n) for parent and size arrays
- Grid copy: O(m×n)
- Total: O(m×n)

The key advantage over brute force (O(h × m × n)) is that we only check local neighborhoods when adding bricks back, rather than traversing the entire grid.

## Common Mistakes

1. **Processing hits in forward order**: This is the most common mistake. When you remove a brick, you need to check all connected bricks to see if they're still connected to the top. This requires full BFS/DFS each time. Working backwards is the key insight.

2. **Forgetting to check if a hit actually had a brick**: Some hits might target empty spaces. The problem states we're given hits, not that all hits necessarily hit bricks. Always check `grid[r][c] == 1` before counting fallen bricks.

3. **Incorrectly counting fallen bricks**: When adding a brick back, the number of bricks that fell is `new_top_size - old_top_size - 1`, not just `new_top_size - old_top_size`. We subtract 1 because the brick we just added back wasn't part of the fallen count—it was the brick that was hit.

4. **Not using union by size/rank with path compression**: A naive Union-Find implementation can degenerate to O(n) per operation. Always implement both optimizations for near-constant time operations.

## When You'll See This Pattern

The "process operations in reverse" pattern combined with Union-Find appears in several graph connectivity problems:

1. **Last Day Where You Can Still Cross (Hard)**: Similar backward processing—instead of adding water cells (making land disconnected), process in reverse to add land cells and check when connectivity is restored.

2. **Number of Islands II (Hard)**: Adding land to water and counting islands—very similar to adding bricks back and checking connectivity.

3. **Removing Stones to Minimize Total (not exactly the same but similar)**: Problems where removal causes cascading effects often benefit from reverse thinking.

The pattern is: When you have a sequence of destructive operations (removals) that affect connectivity, consider processing in reverse (additions) and use Union-Find to efficiently track connectivity changes.

## Key Takeaways

1. **Reverse processing is powerful for destructive operations**: When operations remove elements and you need to track state changes, working backwards (adding elements) often simplifies the problem because additions only affect local neighborhoods.

2. **Union-Find with component sizes solves connectivity queries efficiently**: Not only can Union-Find tell you if two elements are connected, but by tracking component sizes, you can answer "how many elements become connected" questions.

3. **Special nodes simplify boundary conditions**: Creating a special "top" node that all top-row bricks connect to makes it easy to check if any brick is connected to the top—just check if it's in the same component as the top node.

Related problems: [Last Day Where You Can Still Cross](/problem/last-day-where-you-can-still-cross), [Number of Ways to Build Sturdy Brick Wall](/problem/number-of-ways-to-build-sturdy-brick-wall)
