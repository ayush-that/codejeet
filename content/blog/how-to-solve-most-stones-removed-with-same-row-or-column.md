---
title: "How to Solve Most Stones Removed with Same Row or Column — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Stones Removed with Same Row or Column. Medium difficulty, 62.7% acceptance rate. Topics: Hash Table, Depth-First Search, Union-Find, Graph Theory."
date: "2027-08-09"
category: "dsa-patterns"
tags:
  [
    "most-stones-removed-with-same-row-or-column",
    "hash-table",
    "depth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Most Stones Removed with Same Row or Column

This problem asks us to find the maximum number of stones we can remove from a 2D grid, where we can only remove a stone if it shares a row or column with another stone that hasn't been removed yet. What makes this problem interesting is that it looks like a game of removing stones, but it's actually a graph connectivity problem in disguise. The tricky part is recognizing that stones in the same row or column form connections, and the solution depends on counting connected components.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider stones at positions: `[[0,0], [0,1], [1,0], [1,2], [2,1], [2,2]]`

```
Coordinates:
(0,0)  (0,1)  (0,2)
(1,0)  (1,1)  (1,2)
(2,0)  (2,1)  (2,2)

Stones at: (0,0), (0,1), (1,0), (1,2), (2,1), (2,2)
```

Let's visualize the connections:

- Stone at (0,0) connects to (0,1) (same row) and (1,0) (same column)
- Stone at (0,1) connects to (0,0) (same row) and (2,1) (same column)
- Stone at (1,0) connects to (0,0) (same column) and (2,0) (same column, but no stone at (2,0))
- Stone at (1,2) connects to (0,2) (same column, but no stone at (0,2)) and (2,2) (same column)
- Stone at (2,1) connects to (0,1) (same column) and (2,2) (same row)
- Stone at (2,2) connects to (1,2) (same column) and (2,1) (same row)

If we draw these connections, we get two connected components:

1. Component 1: (0,0) ↔ (0,1) ↔ (2,1) ↔ (2,2) ↔ (1,2) ↔ (1,0) ↔ (0,0)
2. Component 2: Actually, all stones are connected! Let me trace:
   - (0,0) connects to (0,1)
   - (0,1) connects to (2,1)
   - (2,1) connects to (2,2)
   - (2,2) connects to (1,2)
   - (1,2) connects to... wait, it doesn't directly connect to (1,0)
   - But (1,0) connects to (0,0), which we already have

So actually, ALL stones are in one connected component. This means we can remove all stones except one (we need to leave at least one stone in each connected component as an "anchor"). So maximum stones removed = 6 - 1 = 5.

The key insight: **In each connected component of stones (where connection means sharing a row or column), we can remove all stones except one.** So the answer is: total stones minus number of connected components.

## Brute Force Approach

A naive approach might try to simulate the removal process: repeatedly find stones that can be removed, remove them, and continue until no more can be removed. We could try all possible removal orders to find the maximum.

However, this approach has several problems:

1. There are n! possible removal orders to check
2. Even with a greedy approach, it's not clear which stone to remove first
3. The simulation would be O(n²) per step, leading to O(n³) overall

More importantly, this misses the key insight about connected components. Without recognizing the graph structure, we'd be stuck with exponential complexity.

## Optimized Approach

The optimal solution uses Union-Find (Disjoint Set Union) to count connected components. Here's the step-by-step reasoning:

1. **Model as a graph problem**: Each stone is a node. Two stones are connected if they share the same row OR the same column.

2. **Key insight**: If stones are connected (directly or indirectly through other stones), they form a connected component. In each connected component, we can remove all stones except one. Why? Because we can always find a removal order: start from a leaf stone (connected to only one other stone), remove it, and continue.

3. **Union-Find approach**: Instead of building the entire graph (which could have O(n²) edges), we can use a clever trick:
   - For each stone at (x, y), union the stone with all other stones in row x
   - For each stone at (x, y), union the stone with all other stones in column y

   But this still seems like O(n²). Here's the optimization: We don't need to union with specific stones; we can union row indices with column indices!

4. **Clever encoding**: Encode rows and columns separately. For a stone at (x, y), we union `x` with `~y` (or `y + OFFSET`). This ensures that:
   - All stones in the same row get connected (they all union with the same row index)
   - All stones in the same column get connected (they all union with the same column index)
   - Stones that share a row or column become connected through these unions

5. **Count components**: After processing all stones, count how many unique parents exist among all the row/column indices we've seen. Each unique parent represents a connected component.

6. **Final answer**: Maximum removable stones = total stones - number of connected components.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * α(n)) where α is the inverse Ackermann function (almost constant)
# Space: O(n) for the Union-Find data structure
class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        # We'll use Union-Find to connect stones that share rows or columns
        # Instead of connecting stones directly, we'll connect their row and column indices
        # This is more efficient than building the full graph

        # Create a Union-Find class
        class UnionFind:
            def __init__(self):
                self.parent = {}
                self.rank = {}

            def find(self, x):
                # Path compression
                if self.parent[x] != x:
                    self.parent[x] = self.find(self.parent[x])
                return self.parent[x]

            def union(self, x, y):
                # Initialize nodes if not already present
                if x not in self.parent:
                    self.parent[x] = x
                    self.rank[x] = 0
                if y not in self.parent:
                    self.parent[y] = y
                    self.rank[y] = 0

                # Find roots
                root_x = self.find(x)
                root_y = self.find(y)

                # If already in same set, do nothing
                if root_x == root_y:
                    return

                # Union by rank
                if self.rank[root_x] < self.rank[root_y]:
                    self.parent[root_x] = root_y
                elif self.rank[root_x] > self.rank[root_y]:
                    self.parent[root_y] = root_x
                else:
                    self.parent[root_y] = root_x
                    self.rank[root_x] += 1

        # Initialize Union-Find
        uf = UnionFind()

        # Process each stone
        for x, y in stones:
            # We need to differentiate rows and columns to avoid collisions
            # A common trick: use ~y or y + OFFSET for columns
            # Here we'll use x and ~y (bitwise NOT of y)
            # This ensures row indices (x) and column indices (~y) are in different ranges
            uf.union(x, ~y)
            # Why ~y instead of -y? ~y = -y-1, which is always negative for non-negative y
            # This guarantees no collision between row and column indices

        # Count the number of unique parents (connected components)
        # Each stone connects a row and column, so each connected component
        # corresponds to a set of rows and columns that are connected
        unique_roots = set()
        for x, y in stones:
            # Find the root for this stone's row
            root = uf.find(x)
            unique_roots.add(root)

        # The answer is: total stones - number of connected components
        # In each connected component, we can remove all but one stone
        return len(stones) - len(unique_roots)
```

```javascript
// Time: O(n * α(n)) where α is the inverse Ackermann function (almost constant)
// Space: O(n) for the Union-Find data structure
/**
 * @param {number[][]} stones
 * @return {number}
 */
var removeStones = function (stones) {
  // Union-Find implementation
  class UnionFind {
    constructor() {
      this.parent = new Map();
      this.rank = new Map();
    }

    find(x) {
      // Initialize if not present
      if (!this.parent.has(x)) {
        this.parent.set(x, x);
        this.rank.set(x, 0);
        return x;
      }

      // Path compression
      if (this.parent.get(x) !== x) {
        this.parent.set(x, this.find(this.parent.get(x)));
      }
      return this.parent.get(x);
    }

    union(x, y) {
      const rootX = this.find(x);
      const rootY = this.find(y);

      // If already in same set, do nothing
      if (rootX === rootY) return;

      // Union by rank
      const rankX = this.rank.get(rootX);
      const rankY = this.rank.get(rootY);

      if (rankX < rankY) {
        this.parent.set(rootX, rootY);
      } else if (rankX > rankY) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, rankX + 1);
      }
    }
  }

  // Initialize Union-Find
  const uf = new UnionFind();

  // Process each stone
  for (const [x, y] of stones) {
    // Connect row x with column y
    // Use ~y to differentiate columns from rows
    // ~y = -y-1, which is always negative for non-negative y
    uf.union(x, ~y);
  }

  // Count unique roots (connected components)
  const uniqueRoots = new Set();
  for (const [x, y] of stones) {
    // Find the root for this stone's row
    const root = uf.find(x);
    uniqueRoots.add(root);
  }

  // Maximum stones we can remove = total stones - number of connected components
  return stones.length - uniqueRoots.size;
};
```

```java
// Time: O(n * α(n)) where α is the inverse Ackermann function (almost constant)
// Space: O(n) for the Union-Find data structure
class Solution {
    public int removeStones(int[][] stones) {
        // We'll use Union-Find to connect rows and columns
        // Map to store parent relationships
        Map<Integer, Integer> parent = new HashMap<>();
        Map<Integer, Integer> rank = new HashMap<>();

        // Process each stone
        for (int[] stone : stones) {
            int x = stone[0];
            int y = stone[1];

            // Connect row x with column y
            // Use ~y to differentiate columns from rows
            // In Java, ~y = -y-1
            union(x, ~y, parent, rank);
        }

        // Count unique roots (connected components)
        Set<Integer> uniqueRoots = new HashSet<>();
        for (int[] stone : stones) {
            int root = find(stone[0], parent);
            uniqueRoots.add(root);
        }

        // Maximum stones we can remove = total stones - number of connected components
        return stones.length - uniqueRoots.size();
    }

    private int find(int x, Map<Integer, Integer> parent) {
        // Initialize if not present
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            return x;
        }

        // Path compression
        if (parent.get(x) != x) {
            parent.put(x, find(parent.get(x), parent));
        }
        return parent.get(x);
    }

    private void union(int x, int y, Map<Integer, Integer> parent, Map<Integer, Integer> rank) {
        int rootX = find(x, parent);
        int rootY = find(y, parent);

        // If already in same set, do nothing
        if (rootX == rootY) return;

        // Union by rank
        int rankX = rank.getOrDefault(rootX, 0);
        int rankY = rank.getOrDefault(rootY, 0);

        if (rankX < rankY) {
            parent.put(rootX, rootY);
        } else if (rankX > rankY) {
            parent.put(rootY, rootX);
        } else {
            parent.put(rootY, rootX);
            rank.put(rootX, rankX + 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n \* α(n)), where n is the number of stones and α is the inverse Ackermann function. This function grows extremely slowly and is effectively constant for all practical purposes. The O(n) comes from processing each stone once, and the α(n) factor comes from the Union-Find operations (find and union).

**Space Complexity**: O(n) for the Union-Find data structure. We need to store parent and rank information for each unique row and column index we encounter. In the worst case, if all stones are in different rows and columns, we could have up to 2n unique indices.

## Common Mistakes

1. **Building the full graph**: Some candidates try to build an adjacency list connecting each stone to all other stones in the same row or column. This creates O(n²) edges and leads to O(n²) time and space complexity. The Union-Find approach avoids this by connecting row and column indices instead of individual stones.

2. **Forgetting to differentiate rows and columns**: If you use the same namespace for row and column indices (e.g., treating (x, y) as node x and node y), you might accidentally connect unrelated components. Using `~y` or `y + OFFSET` ensures rows and columns are in different namespaces.

3. **Incorrect component counting**: Some candidates count components by checking every possible index instead of just the ones that actually have stones. Remember: we only care about indices that have stones, so we should iterate through the stones array when counting unique roots.

4. **Misunderstanding the answer formula**: The formula is `total stones - number of connected components`, not `total stones - number of edges` or other variations. Each connected component must leave at least one stone as an "anchor".

## When You'll See This Pattern

This problem uses Union-Find to solve what appears to be a game theory problem but is actually a connectivity problem. You'll see similar patterns in:

1. **Number of Islands (LeetCode 200)**: Uses DFS/BFS/Union-Find to count connected components in a grid. The key insight is recognizing adjacent cells as connected.

2. **Accounts Merge (LeetCode 721)**: Uses Union-Find to merge accounts that share emails. Similar to connecting stones that share rows/columns.

3. **Redundant Connection (LeetCode 684)**: Uses Union-Find to detect cycles in an undirected graph. The Union-Find structure is the same, but applied to a different problem.

4. **Minimum Moves to Get a Peaceful Board**: The similar problem mentioned in the prompt likely uses the same row/column connectivity concept.

## Key Takeaways

1. **Recognize connectivity problems**: When a problem involves connections between entities (sharing attributes, being adjacent, etc.), think about graph connectivity and connected components.

2. **Union-Find is efficient for dynamic connectivity**: When you need to repeatedly merge sets and check connectivity, Union-Find with path compression and union by rank provides near-constant time operations.

3. **Encode problems cleverly**: The trick of connecting row and column indices instead of individual stones is a powerful optimization technique. Look for ways to reduce the problem size by encoding relationships at a higher level.

Related problems: [Minimum Moves to Get a Peaceful Board](/problem/minimum-moves-to-get-a-peaceful-board)
