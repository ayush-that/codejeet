---
title: "How to Solve Regions Cut By Slashes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Regions Cut By Slashes. Medium difficulty, 77.5% acceptance rate. Topics: Array, Hash Table, Depth-First Search, Breadth-First Search, Union-Find."
date: "2026-09-11"
category: "dsa-patterns"
tags: ["regions-cut-by-slashes", "array", "hash-table", "depth-first-search", "medium"]
---

# How to Solve Regions Cut By Slashes

This problem asks us to count how many separate regions are created when we draw diagonal lines (forward and backward slashes) on an n×n grid. What makes this problem tricky is that the slashes don't just divide individual cells—they connect across cell boundaries to create larger, irregular regions that span multiple cells. A naive cell-by-cell approach fails because regions can cross cell boundaries in complex ways.

## Visual Walkthrough

Let's walk through a small example: `["/\\", "\\/"]` (a 2×2 grid).

**Step 1: Understanding the challenge**
Each cell contains either:

- `/`: a diagonal from top-right to bottom-left
- `\`: a diagonal from top-left to bottom-right
- ` `: empty (no diagonal)

The slashes divide the space into regions. But here's the key insight: to properly track regions that cross cell boundaries, we need to subdivide each cell into smaller parts.

**Step 2: Subdividing cells**
A common technique is to divide each cell into 4 triangles (like a 2×2 mini-grid within each cell):

- Top triangle (0)
- Right triangle (1)
- Bottom triangle (2)
- Left triangle (3)

So for a 2×2 grid, we actually have 2×2×4 = 16 mini-triangles to work with.

**Step 3: Connecting triangles within a cell**
Within each cell, the slash determines which triangles are connected:

- `/`: connects top-left and bottom-right triangles
- `\`: connects top-right and bottom-left triangles
- ` `: connects all four triangles

**Step 4: Connecting triangles between cells**
We also need to connect triangles across cell boundaries:

- A cell's top triangle connects to the bottom triangle of the cell above
- A cell's right triangle connects to the left triangle of the cell to the right
- And so on...

**Step 5: Counting regions**
After connecting all triangles (both within cells and between cells), each connected component of triangles forms one region. The number of connected components equals the number of regions.

For our example `["/\\", "\\/"]`, this approach would find 5 separate regions.

## Brute Force Approach

A naive approach might try to directly trace regions by following boundaries, but this quickly becomes complex. Consider these challenges:

1. **Boundary following is messy**: Regions have irregular shapes, and following their boundaries requires complex geometric reasoning.
2. **Multiple representations**: A region might be represented by disconnected pieces that are actually connected through other cells.
3. **Edge cases**: Handling cells on the grid boundary requires special cases.

While we could attempt a BFS/DFS on the "pixel" level (treating each cell as 3×3 pixels), this would be O(9n²) in time and space, which is acceptable but conceptually more complex than the union-find approach. The real "brute force" mistake would be trying to implement region detection without properly handling the connectivity between cells.

## Optimized Approach

The key insight is to transform this geometric problem into a graph connectivity problem:

1. **Subdivision**: Divide each cell into 4 triangles (numbered 0-3 as described above).
2. **Union-Find (Disjoint Set Union)**: Use DSU to track connections between triangles.
3. **Two types of unions**:
   - **Internal unions**: Within each cell, union triangles based on the slash character
   - **External unions**: Between adjacent cells, union triangles that touch each other
4. **Count components**: After all unions, count the number of distinct connected components.

Why this works: Each triangle represents a "piece" of space. When two triangles are connected (either within a cell or across cells), they're part of the same region. The union-find data structure efficiently tracks these connections and lets us count distinct regions at the end.

## Optimal Solution

Here's the complete solution using union-find:

<div class="code-group">

```python
# Time: O(n² * α(n²)) where α is the inverse Ackermann function (effectively O(1))
# Space: O(n²) for the DSU parent array
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Start with each element as its own component

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
            return False  # Already connected

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.count -= 1  # One less component after union
        return True

class Solution:
    def regionsBySlashes(self, grid):
        n = len(grid)
        # Each cell has 4 triangles, so total triangles = 4 * n * n
        dsu = DSU(4 * n * n)

        for i in range(n):
            for j in range(n):
                # Base index for the 4 triangles in cell (i, j)
                base = 4 * (i * n + j)
                char = grid[i][j]

                # Internal connections within the cell
                if char == '/':
                    # '/' connects triangle 0 (top) with triangle 3 (left)
                    # and triangle 1 (right) with triangle 2 (bottom)
                    dsu.union(base + 0, base + 3)
                    dsu.union(base + 1, base + 2)
                elif char == '\\':
                    # '\' connects triangle 0 (top) with triangle 1 (right)
                    # and triangle 2 (bottom) with triangle 3 (left)
                    dsu.union(base + 0, base + 1)
                    dsu.union(base + 2, base + 3)
                else:  # ' '
                    # Empty cell connects all 4 triangles
                    dsu.union(base + 0, base + 1)
                    dsu.union(base + 1, base + 2)
                    dsu.union(base + 2, base + 3)

                # External connections with neighboring cells
                # Connect with cell above (if not first row)
                if i > 0:
                    # Current cell's top triangle connects to above cell's bottom triangle
                    above_base = 4 * ((i - 1) * n + j)
                    dsu.union(base + 0, above_base + 2)

                # Connect with cell to the left (if not first column)
                if j > 0:
                    # Current cell's left triangle connects to left cell's right triangle
                    left_base = 4 * (i * n + (j - 1))
                    dsu.union(base + 3, left_base + 1)

        # The number of regions equals the number of connected components
        return dsu.count
```

```javascript
// Time: O(n² * α(n²)) where α is the inverse Ackermann function (effectively O(1))
// Space: O(n²) for the DSU parent array
class DSU {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);
    this.count = n; // Start with each element as its own component

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
      return false; // Already connected
    }

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.count--; // One less component after union
    return true;
  }
}

var regionsBySlashes = function (grid) {
  const n = grid.length;
  // Each cell has 4 triangles, so total triangles = 4 * n * n
  const dsu = new DSU(4 * n * n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Base index for the 4 triangles in cell (i, j)
      const base = 4 * (i * n + j);
      const char = grid[i][j];

      // Internal connections within the cell
      if (char === "/") {
        // '/' connects triangle 0 (top) with triangle 3 (left)
        // and triangle 1 (right) with triangle 2 (bottom)
        dsu.union(base + 0, base + 3);
        dsu.union(base + 1, base + 2);
      } else if (char === "\\") {
        // '\' connects triangle 0 (top) with triangle 1 (right)
        // and triangle 2 (bottom) with triangle 3 (left)
        dsu.union(base + 0, base + 1);
        dsu.union(base + 2, base + 3);
      } else {
        // ' '
        // Empty cell connects all 4 triangles
        dsu.union(base + 0, base + 1);
        dsu.union(base + 1, base + 2);
        dsu.union(base + 2, base + 3);
      }

      // External connections with neighboring cells
      // Connect with cell above (if not first row)
      if (i > 0) {
        // Current cell's top triangle connects to above cell's bottom triangle
        const aboveBase = 4 * ((i - 1) * n + j);
        dsu.union(base + 0, aboveBase + 2);
      }

      // Connect with cell to the left (if not first column)
      if (j > 0) {
        // Current cell's left triangle connects to left cell's right triangle
        const leftBase = 4 * (i * n + (j - 1));
        dsu.union(base + 3, leftBase + 1);
      }
    }
  }

  // The number of regions equals the number of connected components
  return dsu.count;
};
```

```java
// Time: O(n² * α(n²)) where α is the inverse Ackermann function (effectively O(1))
// Space: O(n²) for the DSU parent array
class DSU {
    int[] parent;
    int[] rank;
    int count;

    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;  // Start with each element as its own component

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
            return false;  // Already connected
        }

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        count--;  // One less component after union
        return true;
    }
}

class Solution {
    public int regionsBySlashes(String[] grid) {
        int n = grid.length;
        // Each cell has 4 triangles, so total triangles = 4 * n * n
        DSU dsu = new DSU(4 * n * n);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // Base index for the 4 triangles in cell (i, j)
                int base = 4 * (i * n + j);
                char c = grid[i].charAt(j);

                // Internal connections within the cell
                if (c == '/') {
                    // '/' connects triangle 0 (top) with triangle 3 (left)
                    // and triangle 1 (right) with triangle 2 (bottom)
                    dsu.union(base + 0, base + 3);
                    dsu.union(base + 1, base + 2);
                } else if (c == '\\') {
                    // '\' connects triangle 0 (top) with triangle 1 (right)
                    // and triangle 2 (bottom) with triangle 3 (left)
                    dsu.union(base + 0, base + 1);
                    dsu.union(base + 2, base + 3);
                } else {  // ' '
                    // Empty cell connects all 4 triangles
                    dsu.union(base + 0, base + 1);
                    dsu.union(base + 1, base + 2);
                    dsu.union(base + 2, base + 3);
                }

                // External connections with neighboring cells
                // Connect with cell above (if not first row)
                if (i > 0) {
                    // Current cell's top triangle connects to above cell's bottom triangle
                    int aboveBase = 4 * ((i - 1) * n + j);
                    dsu.union(base + 0, aboveBase + 2);
                }

                // Connect with cell to the left (if not first column)
                if (j > 0) {
                    // Current cell's left triangle connects to left cell's right triangle
                    int leftBase = 4 * (i * n + (j - 1));
                    dsu.union(base + 3, leftBase + 1);
                }
            }
        }

        // The number of regions equals the number of connected components
        return dsu.count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n² × α(n²)) where α is the inverse Ackermann function, which grows so slowly it's effectively constant. Here's why:

- We process n² cells
- For each cell, we perform up to 6 union operations (4 internal + 2 external)
- Each union/find operation takes amortized O(α(n)) time
- Total: O(6n² × α(4n²)) = O(n² × α(n²))

**Space Complexity**: O(n²)

- The DSU parent and rank arrays store 4n² elements (4 triangles per cell)
- Additional O(1) space for loop variables and indices

## Common Mistakes

1. **Wrong triangle numbering or connections**: The most common error is mixing up which triangles connect for each slash type. Remember:
   - `/` connects top (0) with left (3), and right (1) with bottom (2)
   - `\` connects top (0) with right (1), and bottom (2) with left (3)
     Always verify with a diagram.

2. **Forgetting external connections**: It's easy to focus on internal cell connections and forget to connect triangles across cell boundaries. Remember to connect:
   - Top triangle with the cell above's bottom triangle
   - Left triangle with the cell to the left's right triangle
     (We don't need to connect bottom/right because those will be handled when processing the cells below/right)

3. **Incorrect base index calculation**: The formula `4 * (i * n + j)` converts 2D cell coordinates to a 1D index for the 4 triangles. A common mistake is using `4 * i * n + j` (missing parentheses) or mixing up row/column order.

4. **Not handling empty cells correctly**: Empty cells (`' '`) should connect all 4 triangles. Some candidates mistakenly treat them like they have no connections.

## When You'll See This Pattern

This "subdivide and union-find" pattern appears in several grid connectivity problems:

1. **Number of Islands (LeetCode 200)**: Similar concept of counting connected components, though simpler since cells are either land or water without internal subdivisions.

2. **Surrounded Regions (LeetCode 130)**: Uses DFS/BFS to find connected components, with the twist of only capturing regions completely surrounded.

3. **Most Stones Removed with Same Row or Column (LeetCode 947)**: Uses union-find to connect stones sharing rows or columns, then counts components.

The key insight across these problems is transforming a spatial connectivity problem into a graph problem, then using union-find or search algorithms to count components.

## Key Takeaways

1. **Divide complex shapes into simpler units**: When dealing with irregular regions or shapes that don't align with grid boundaries, subdivide into smaller, regular pieces that are easier to work with.

2. **Union-find excels at incremental connectivity**: When you need to build up connections piece by piece and count components, union-find is often more efficient than repeatedly running BFS/DFS.

3. **Map spatial relationships to graph edges**: The core skill is recognizing that "these two pieces of space are connected" translates to "add an edge between these two nodes in a graph."

[Practice this problem on CodeJeet](/problem/regions-cut-by-slashes)
