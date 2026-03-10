---
title: "How to Solve Rank Transform of a Matrix — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Rank Transform of a Matrix. Hard difficulty, 42.1% acceptance rate. Topics: Array, Union-Find, Graph Theory, Topological Sort, Sorting."
date: "2029-06-28"
category: "dsa-patterns"
tags: ["rank-transform-of-a-matrix", "array", "union-find", "graph-theory", "hard"]
---

# How to Solve Rank Transform of a Matrix

This problem asks us to assign ranks to every element in a matrix where the rank represents an element's relative size compared to others. The tricky part is that ranks must satisfy two constraints simultaneously: 1) ranks must be consistent along rows and columns (equal elements share the same rank, and ranks must be strictly increasing along rows and columns), and 2) ranks should be as small as possible. This creates a complex dependency system where changing one element's rank can cascade through its entire row and column.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Matrix:
[[20, -21, 14],
 [-19,   4, 19],
 [22,  -47, 24]]
```

**Step 1: Sort all positions by value**
We need to process elements from smallest to largest:

- -47 at (2,1)
- -21 at (0,1)
- -19 at (1,0)
- 4 at (1,1)
- 14 at (0,2)
- 19 at (1,2)
- 20 at (0,0)
- 22 at (2,0)
- 24 at (2,2)

**Step 2: Process -47 (smallest)**
No constraints yet, so rank = 1

**Step 3: Process -21**
Check row 0: no other elements processed yet
Check column 1: no other elements processed yet
Rank = 1

**Step 4: Process -19**
Check row 1: no processed elements
Check column 0: no processed elements
Rank = 1

**Step 5: Process 4**
Check row 1: has -19 with rank 1
Check column 1: has -21 with rank 1
Maximum rank from constraints = 1
Rank = 1 + 1 = 2

**Step 6: Process 14**
Check row 0: has -21 with rank 1
Check column 2: no processed elements
Maximum rank = 1
Rank = 1 + 1 = 2

**Step 7: Process 19**
Check row 1: has -19 (rank 1) and 4 (rank 2)
Check column 2: no processed elements
Maximum rank = 2
Rank = 2 + 1 = 3

**Step 8: Process 20**
Check row 0: has -21 (rank 1) and 14 (rank 2)
Check column 0: no processed elements
Maximum rank = 2
Rank = 2 + 1 = 3

**Step 9: Process 22**
Check row 2: has -47 (rank 1)
Check column 0: no processed elements
Maximum rank = 1
Rank = 1 + 1 = 2

**Step 10: Process 24**
Check row 2: has -47 (rank 1) and 22 (rank 2)
Check column 2: has 14 (rank 2)
Maximum rank = 2
Rank = 2 + 1 = 3

Final ranks:
[[3, 1, 2],
 [1, 2, 3],
 [2, 1, 3]]

## Brute Force Approach

A naive approach might try to assign ranks greedily:

1. Sort all elements by value
2. For each element in sorted order, assign the smallest rank that satisfies:
   - Rank > max(rank of all smaller elements in same row)
   - Rank > max(rank of all smaller elements in same column)
   - Equal elements get the same rank

The problem with this approach is that when we process equal-valued elements, they might be in different rows and columns, creating complex dependencies. If we process them in the wrong order, we might assign inconsistent ranks. For example, if two equal elements are in the same row but different columns, and there's a third smaller element in one of those columns, we need to ensure both equal elements get the same rank, which must be greater than all constraints.

This brute force approach would require repeatedly scanning rows and columns for constraints and potentially backtracking when we discover inconsistencies among equal elements. In the worst case, this could lead to exponential time complexity.

## Optimized Approach

The key insight is to use **Union-Find (Disjoint Set Union)** to handle equal elements and **topological sorting** to handle dependencies. Here's the step-by-step reasoning:

1. **Group equal elements**: Elements with the same value must have the same rank, so we group them using Union-Find. All positions with the same value are connected.

2. **Build a dependency graph**: For each group of equal elements, we need to determine what rank they should have relative to other groups. We create a graph where:
   - Nodes are groups (connected components of equal elements)
   - Edges represent "must have greater rank than" relationships

3. **Find constraints**: For each row and column separately:
   - Sort positions in that row/column by value
   - For consecutive elements with different values, create an edge from the group of the smaller value to the group of the larger value

4. **Topological sort**: Process groups in order of increasing value (which corresponds to a topological order since edges always go from smaller to larger values). For each group:
   - Its rank = 1 + max(rank of all predecessor groups)
   - Assign this rank to all positions in the group

This approach works because:

- Union-Find ensures equal elements get the same rank
- The graph is a DAG (directed acyclic graph) since edges always go from smaller to larger values
- Processing in topological order ensures we satisfy all dependencies

## Optimal Solution

<div class="code-group">

```python
# Time: O(mn log(mn)) | Space: O(mn)
class DSU:
    """Disjoint Set Union (Union-Find) data structure"""
    def __init__(self):
        self.parent = {}
        self.size = {}

    def find(self, x):
        """Find root of x with path compression"""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        """Union two sets"""
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return
        # Union by size
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]

    def add(self, x):
        """Add a new element"""
        if x not in self.parent:
            self.parent[x] = x
            self.size[x] = 1

def matrixRankTransform(matrix):
    """
    Main function to compute rank transform of a matrix
    Strategy: Group equal elements with DSU, build dependency graph,
    then assign ranks in topological order
    """
    m, n = len(matrix), len(matrix[0])

    # Step 1: Group positions by value and initialize DSU
    value_to_positions = {}
    for i in range(m):
        for j in range(n):
            val = matrix[i][j]
            if val not in value_to_positions:
                value_to_positions[val] = []
            value_to_positions[val].append((i, j))

    # Step 2: Initialize DSU and group equal elements
    dsu = DSU()
    # Group by rows
    for i in range(m):
        # Map column index to position for this row
        col_to_pos = {}
        for j in range(n):
            val = matrix[i][j]
            pos = (i, j)
            dsu.add(pos)
            if val in col_to_pos:
                # Union current position with previous same-valued position in this row
                dsu.union(pos, col_to_pos[val])
            col_to_pos[val] = pos

    # Group by columns
    for j in range(n):
        # Map row index to position for this column
        row_to_pos = {}
        for i in range(m):
            val = matrix[i][j]
            pos = (i, j)
            dsu.add(pos)
            if val in row_to_pos:
                # Union current position with previous same-valued position in this column
                dsu.union(pos, row_to_pos[val])
            row_to_pos[val] = pos

    # Step 3: Build dependency graph between groups
    # Map root to list of positions in that group
    root_to_positions = {}
    for pos in dsu.parent:
        root = dsu.find(pos)
        if root not in root_to_positions:
            root_to_positions[root] = []
        root_to_positions[root].append(pos)

    # Build adjacency list for the graph
    # Nodes are roots (groups), edges go from smaller to larger values
    adj = {root: set() for root in root_to_positions}
    indegree = {root: 0 for root in root_to_positions}

    # Add edges from rows
    for i in range(m):
        # Sort positions in this row by value
        row_positions = [(j, matrix[i][j]) for j in range(n)]
        row_positions.sort(key=lambda x: x[1])

        for k in range(1, n):
            j1, val1 = row_positions[k-1]
            j2, val2 = row_positions[k]
            if val1 != val2:
                root1 = dsu.find((i, j1))
                root2 = dsu.find((i, j2))
                if root2 not in adj[root1]:
                    adj[root1].add(root2)
                    indegree[root2] += 1

    # Add edges from columns
    for j in range(n):
        # Sort positions in this column by value
        col_positions = [(i, matrix[i][j]) for i in range(m)]
        col_positions.sort(key=lambda x: x[1])

        for k in range(1, m):
            i1, val1 = col_positions[k-1]
            i2, val2 = col_positions[k]
            if val1 != val2:
                root1 = dsu.find((i1, j))
                root2 = dsu.find((i2, j))
                if root2 not in adj[root1]:
                    adj[root1].add(root2)
                    indegree[root2] += 1

    # Step 4: Topological sort (Kahn's algorithm)
    # Initialize queue with roots having indegree 0
    queue = [root for root in indegree if indegree[root] == 0]
    rank_map = {root: 1 for root in queue}  # Start with rank 1

    result = [[0] * n for _ in range(m)]

    while queue:
        current = queue.pop(0)
        # Assign rank to all positions in this group
        for i, j in root_to_positions[current]:
            result[i][j] = rank_map[current]

        # Process neighbors
        for neighbor in adj[current]:
            indegree[neighbor] -= 1
            # Update neighbor's rank to be at least current rank + 1
            rank_map[neighbor] = max(rank_map.get(neighbor, 0), rank_map[current] + 1)
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return result
```

```javascript
// Time: O(mn log(mn)) | Space: O(mn)
class DSU {
  constructor() {
    this.parent = new Map();
    this.size = new Map();
  }

  find(x) {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)));
    }
    return this.parent.get(x);
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;

    // Union by size
    if ((this.size.get(rootX) || 0) < (this.size.get(rootY) || 0)) {
      [rootX, rootY] = [rootY, rootX];
    }
    this.parent.set(rootY, rootX);
    this.size.set(rootX, (this.size.get(rootX) || 0) + (this.size.get(rootY) || 0));
  }

  add(x) {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.size.set(x, 1);
    }
  }
}

/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
function matrixRankTransform(matrix) {
  const m = matrix.length,
    n = matrix[0].length;

  // Step 1: Initialize DSU and group equal elements
  const dsu = new DSU();

  // Group by rows
  for (let i = 0; i < m; i++) {
    const valToPos = new Map();
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j];
      const pos = `${i},${j}`;
      dsu.add(pos);
      if (valToPos.has(val)) {
        dsu.union(pos, valToPos.get(val));
      }
      valToPos.set(val, pos);
    }
  }

  // Group by columns
  for (let j = 0; j < n; j++) {
    const valToPos = new Map();
    for (let i = 0; i < m; i++) {
      const val = matrix[i][j];
      const pos = `${i},${j}`;
      dsu.add(pos);
      if (valToPos.has(val)) {
        dsu.union(pos, valToPos.get(val));
      }
      valToPos.set(val, pos);
    }
  }

  // Step 2: Map roots to positions
  const rootToPositions = new Map();
  for (const [pos] of dsu.parent) {
    const root = dsu.find(pos);
    if (!rootToPositions.has(root)) {
      rootToPositions.set(root, []);
    }
    rootToPositions.get(root).push(pos);
  }

  // Step 3: Build dependency graph
  const adj = new Map();
  const indegree = new Map();

  // Initialize adjacency and indegree maps
  for (const root of rootToPositions.keys()) {
    adj.set(root, new Set());
    indegree.set(root, 0);
  }

  // Add edges from rows
  for (let i = 0; i < m; i++) {
    const rowPositions = [];
    for (let j = 0; j < n; j++) {
      rowPositions.push([j, matrix[i][j]]);
    }
    rowPositions.sort((a, b) => a[1] - b[1]);

    for (let k = 1; k < n; k++) {
      const [j1, val1] = rowPositions[k - 1];
      const [j2, val2] = rowPositions[k];
      if (val1 !== val2) {
        const root1 = dsu.find(`${i},${j1}`);
        const root2 = dsu.find(`${i},${j2}`);
        if (!adj.get(root1).has(root2)) {
          adj.get(root1).add(root2);
          indegree.set(root2, indegree.get(root2) + 1);
        }
      }
    }
  }

  // Add edges from columns
  for (let j = 0; j < n; j++) {
    const colPositions = [];
    for (let i = 0; i < m; i++) {
      colPositions.push([i, matrix[i][j]]);
    }
    colPositions.sort((a, b) => a[1] - b[1]);

    for (let k = 1; k < m; k++) {
      const [i1, val1] = colPositions[k - 1];
      const [i2, val2] = colPositions[k];
      if (val1 !== val2) {
        const root1 = dsu.find(`${i1},${j}`);
        const root2 = dsu.find(`${i2},${j}`);
        if (!adj.get(root1).has(root2)) {
          adj.get(root1).add(root2);
          indegree.set(root2, indegree.get(root2) + 1);
        }
      }
    }
  }

  // Step 4: Topological sort
  const queue = [];
  const rankMap = new Map();
  const result = Array.from({ length: m }, () => Array(n).fill(0));

  // Initialize queue with roots having indegree 0
  for (const [root, deg] of indegree) {
    if (deg === 0) {
      queue.push(root);
      rankMap.set(root, 1);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift();

    // Assign rank to all positions in this group
    for (const posStr of rootToPositions.get(current)) {
      const [i, j] = posStr.split(",").map(Number);
      result[i][j] = rankMap.get(current);
    }

    // Process neighbors
    for (const neighbor of adj.get(current)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);
      rankMap.set(neighbor, Math.max(rankMap.get(neighbor) || 0, rankMap.get(current) + 1));
      if (indegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}
```

```java
// Time: O(mn log(mn)) | Space: O(mn)
import java.util.*;

class Solution {
    static class DSU {
        Map<String, String> parent = new HashMap<>();
        Map<String, Integer> size = new HashMap<>();

        String find(String x) {
            if (!parent.get(x).equals(x)) {
                parent.put(x, find(parent.get(x)));
            }
            return parent.get(x);
        }

        void union(String x, String y) {
            String rootX = find(x);
            String rootY = find(y);
            if (rootX.equals(rootY)) return;

            // Union by size
            if (size.getOrDefault(rootX, 1) < size.getOrDefault(rootY, 1)) {
                String temp = rootX;
                rootX = rootY;
                rootY = temp;
            }
            parent.put(rootY, rootX);
            size.put(rootX, size.getOrDefault(rootX, 1) + size.getOrDefault(rootY, 1));
        }

        void add(String x) {
            if (!parent.containsKey(x)) {
                parent.put(x, x);
                size.put(x, 1);
            }
        }
    }

    public int[][] matrixRankTransform(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        DSU dsu = new DSU();

        // Step 1: Group equal elements by rows
        for (int i = 0; i < m; i++) {
            Map<Integer, String> valToPos = new HashMap<>();
            for (int j = 0; j < n; j++) {
                int val = matrix[i][j];
                String pos = i + "," + j;
                dsu.add(pos);
                if (valToPos.containsKey(val)) {
                    dsu.union(pos, valToPos.get(val));
                }
                valToPos.put(val, pos);
            }
        }

        // Step 2: Group equal elements by columns
        for (int j = 0; j < n; j++) {
            Map<Integer, String> valToPos = new HashMap<>();
            for (int i = 0; i < m; i++) {
                int val = matrix[i][j];
                String pos = i + "," + j;
                dsu.add(pos);
                if (valToPos.containsKey(val)) {
                    dsu.union(pos, valToPos.get(val));
                }
                valToPos.put(val, pos);
            }
        }

        // Step 3: Map roots to positions
        Map<String, List<String>> rootToPositions = new HashMap<>();
        for (String pos : dsu.parent.keySet()) {
            String root = dsu.find(pos);
            rootToPositions.computeIfAbsent(root, k -> new ArrayList<>()).add(pos);
        }

        // Step 4: Build dependency graph
        Map<String, Set<String>> adj = new HashMap<>();
        Map<String, Integer> indegree = new HashMap<>();

        for (String root : rootToPositions.keySet()) {
            adj.put(root, new HashSet<>());
            indegree.put(root, 0);
        }

        // Add edges from rows
        for (int i = 0; i < m; i++) {
            List<int[]> rowPositions = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                rowPositions.add(new int[]{j, matrix[i][j]});
            }
            rowPositions.sort((a, b) -> Integer.compare(a[1], b[1]));

            for (int k = 1; k < n; k++) {
                int j1 = rowPositions.get(k-1)[0];
                int val1 = rowPositions.get(k-1)[1];
                int j2 = rowPositions.get(k)[0];
                int val2 = rowPositions.get(k)[1];

                if (val1 != val2) {
                    String root1 = dsu.find(i + "," + j1);
                    String root2 = dsu.find(i + "," + j2);
                    if (!adj.get(root1).contains(root2)) {
                        adj.get(root1).add(root2);
                        indegree.put(root2, indegree.get(root2) + 1);
                    }
                }
            }
        }

        // Add edges from columns
        for (int j = 0; j < n; j++) {
            List<int[]> colPositions = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                colPositions.add(new int[]{i, matrix[i][j]});
            }
            colPositions.sort((a, b) -> Integer.compare(a[1], b[1]));

            for (int k = 1; k < m; k++) {
                int i1 = colPositions.get(k-1)[0];
                int val1 = colPositions.get(k-1)[1];
                int i2 = colPositions.get(k)[0];
                int val2 = colPositions.get(k)[1];

                if (val1 != val2) {
                    String root1 = dsu.find(i1 + "," + j);
                    String root2 = dsu.find(i2 + "," + j);
                    if (!adj.get(root1).contains(root2)) {
                        adj.get(root1).add(root2);
                        indegree.put(root2, indegree.get(root2) + 1);
                    }
                }
            }
        }

        // Step 5: Topological sort
        Queue<String> queue = new LinkedList<>();
        Map<String, Integer> rankMap = new HashMap<>();
        int[][] result = new int[m][n];

        for (Map.Entry<String, Integer> entry : indegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
                rankMap.put(entry.getKey(), 1);
            }
        }

        while (!queue.isEmpty()) {
            String current = queue.poll();

            // Assign rank to all positions in this group
            for (String posStr : rootToPositions.get(current)) {
                String[] parts = posStr.split(",");
                int i = Integer.parseInt(parts[0]);
                int j = Integer.parseInt(parts[1]);
                result[i][j] = rankMap.get(current);
            }

            // Process neighbors
            for (String neighbor : adj.get(current)) {
                indegree.put(neighbor, indegree.get(neighbor) - 1);
                rankMap.put(
                    neighbor,
                    Math.max(rankMap.getOrDefault(neighbor, 0), rankMap.get(current) + 1)
                );
                if (indegree.get(neighbor) == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(mn log(mn))**

- Building the DSU: O(mn α(mn)) where α is the inverse Ackermann function (effectively constant)
- Sorting positions in each row and column: O(m × n log n + n × m log m) = O(mn log(mn))
- Building the graph: O(mn) for traversing all positions
- Topological sort: O(V + E) where V = O(mn) and E = O(mn)

**Space Complexity: O(mn)**

- DSU data structures: O(mn)
- Graph adjacency list: O(mn)
- Root-to-positions mapping: O(mn)
- Queue and rank maps: O(mn)

## Common Mistakes

1. **Not handling equal elements correctly**: The most common mistake is treating equal elements independently. Equal elements must have the same rank, even if they're in different rows and columns. Solution: Use Union-Find to group equal elements before processing.

2. **Incorrect dependency direction**: Creating edges from larger to smaller values instead of smaller to larger. This creates cycles in the graph. Remember: an element's rank depends on smaller elements in its row/column, not larger ones.

3. **Forgetting to update ranks during topological sort**: When processing a node, you need to update all its neighbors' ranks to be at least current rank + 1. Some candidates only set it to current rank + 1, but a neighbor might have multiple predecessors requiring a higher rank.

4. **Inefficient position representation**: Using lists or arrays to represent positions in maps/sets can be inefficient. Use string representations (e.g., "i,j") or custom objects with proper hashCode/equals implementations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for grouping**: Used in problems where you need to group elements based on some equivalence relation. Similar problems:
   - "Number of Islands" (group connected land cells)
   - "Accounts Merge" (group accounts by email)
   - "Longest Consecutive Sequence" (group consecutive numbers)

2. **Topological sort for dependency resolution**: Used when you have constraints like "A must come before B". Similar problems:
   - "Course Schedule" (prerequisite dependencies)
   - "Alien Dictionary" (ordering constraints between letters)
   - "Sequence Reconstruction" (checking if sequence satisfies all constraints)

3. **Graph modeling from grid constraints**: Used when constraints in a grid create dependencies between cells. Similar problems:
   - "Sudoku Solver" (constraints between rows, columns, and boxes)
   - "N-Queens" (constraints along rows, columns, and diagonals)

## Key Takeaways

1. **When you see "equal elements must have same X"**, think Union-Find. It's the go-to data structure for grouping elements that must share some property.

2. **When dependencies form a partial order**, topological sort is your friend. If A must be processed before B, and B before C, but D is independent, topological sort finds a valid processing order.

3. **Complex constraints often decompose into simpler ones**. Here, the 2D row/column constraints were handled by building separate dependency graphs for rows and columns, then combining them.

Related problems: [Rank Transform of an Array](/problem/rank-transform-of-an-array), [GCD Sort of an Array](/problem/gcd-sort-of-an-array)
