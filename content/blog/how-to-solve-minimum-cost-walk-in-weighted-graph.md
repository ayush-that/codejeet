---
title: "How to Solve Minimum Cost Walk in Weighted Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost Walk in Weighted Graph. Hard difficulty, 68.3% acceptance rate. Topics: Array, Bit Manipulation, Union-Find, Graph Theory."
date: "2027-05-08"
category: "dsa-patterns"
tags: ["minimum-cost-walk-in-weighted-graph", "array", "bit-manipulation", "union-find", "hard"]
---

# How to Solve Minimum Cost Walk in Weighted Graph

This problem asks us to find the minimum cost walk between two vertices in a weighted graph, where the cost of a walk is defined as the bitwise AND of all edge weights along the path. The challenge lies in efficiently finding the path that minimizes this bitwise AND operation, which requires understanding how connectivity and bit manipulation interact.

What makes this problem interesting is that unlike typical shortest path problems where costs add up, here we're dealing with bitwise operations that can only decrease or stay the same as we traverse more edges. This changes the entire approach needed for an efficient solution.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

```
n = 4
edges = [[0,1,5], [1,2,3], [2,3,7], [0,3,9]]
queries = [[0,3], [1,2]]
```

**Step 1 - Understanding the operation:**
For query [0,3], we need to find a walk from vertex 0 to 3 that minimizes the bitwise AND of all edge weights along the path.

**Step 2 - Possible paths from 0 to 3:**

1. Direct path: 0→3 with weight 9 → cost = 9
2. Path through 1 and 2: 0→1→2→3 → weights: 5, 3, 7
   - First AND: 5 & 3 = 1 (binary: 101 & 011 = 001)
   - Then: 1 & 7 = 1 (binary: 001 & 111 = 001)
   - Final cost = 1

**Step 3 - Key insight:**
The path 0→1→2→3 gives cost 1, which is better than the direct path's cost 9. Notice that:

- 5 & 3 = 1 (we lost the higher bits)
- 1 & 7 = 1 (7 has all bits set where 1 has them)

**Step 4 - Another important observation:**
If we had an edge with weight 0 anywhere in the graph, any path containing that edge would have cost 0 (since anything AND 0 = 0). So the minimum possible cost is always 0 if there's a path containing a zero-weight edge.

**Step 5 - Bitwise AND properties:**

- AND can only clear bits, never set them
- The more edges we traverse, the more bits get cleared (or stay the same)
- To minimize the result, we want to clear as many high-order bits as possible

## Brute Force Approach

A naive approach would be to try all possible walks between the two vertices and compute the bitwise AND for each. However, this is infeasible because:

1. In a dense graph, there could be exponentially many paths
2. Even if we limit to simple paths (no repeated vertices), there could be O(n!) paths in the worst case
3. The problem constraints (n up to 10^5) make any exponential approach impossible

What a naive candidate might try:

- Use DFS/BFS to find all paths and compute their AND values
- Use Dijkstra's algorithm with AND as the "sum" operation

Both fail because:

- Finding all paths is exponential time
- Dijkstra's algorithm relies on the property that costs are additive and non-decreasing, which doesn't hold for AND operations

## Optimized Approach

The key insight comes from understanding bitwise operations and connectivity:

**Core Insight 1:** The minimum AND value between two connected vertices is determined by the set of edges that connect them in any way. Since AND can only clear bits, we want to use edges that have 0s in as many bit positions as possible.

**Core Insight 2:** For each bit position (from highest to lowest), we can ask: "Can we travel from u to v using only edges that have 0 in this bit position?" If yes, then we can clear that bit in our result.

**Core Insight 3:** This leads to a union-find approach:

1. Start with all bits set (all 1s in binary)
2. Process bits from highest to lowest (most significant to least)
3. For each bit, temporarily remove all edges that have 1 in that bit position
4. Check if u and v are still connected in the remaining graph
5. If they are connected, we can clear that bit (set it to 0)
6. Otherwise, we need to keep that bit set to 1

**Why this works:**

- If there exists a path using only edges with 0 in a particular bit position, then the AND along that path will have 0 in that position
- We want to clear as many high-order bits as possible, so we process from highest to lowest
- The union-find data structure lets us efficiently check connectivity as we remove edges

## Optimal Solution

The optimal solution uses a variation of the union-find approach with bitmask optimization:

<div class="code-group">

```python
# Time: O((n + m + q) * logW) where W is max weight (up to 2^30)
# Space: O(n + m) for union-find and edge storage
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

    def connected(self, x, y):
        # Check if two nodes are in the same component
        return self.find(x) == self.find(y)

class Solution:
    def minimumCost(self, n: int, edges: List[List[int]], queries: List[List[int]]) -> List[int]:
        # Step 1: Initialize result array
        result = []

        # Step 2: Process each query independently
        for u, v in queries:
            if u == v:
                # Same node: cost is all bits set (bitwise AND of empty path)
                # By convention, this is typically -1 (all bits set) or 0
                result.append(0)
                continue

            # Step 3: Start with all bits set (maximum possible value)
            # For 32-bit integers, this is (1 << 31) - 1
            current_mask = (1 << 30) - 1  # Since wi <= 10^9 < 2^30

            # Step 4: Try to clear bits from highest to lowest
            for bit in range(29, -1, -1):  # From bit 29 down to 0
                # Create a new union-find for this bit check
                uf = UnionFind(n)

                # Step 5: Add all edges that don't have this bit set
                for x, y, w in edges:
                    # Check if the bit at position 'bit' is 0 in w
                    if not (w >> bit) & 1:
                        uf.union(x, y)

                # Step 6: Check if u and v are connected using only edges without this bit
                if uf.connected(u, v):
                    # We can clear this bit
                    current_mask &= ~(1 << bit)
                # If not connected, we must keep this bit set

            # Step 7: Add the result for this query
            result.append(current_mask)

        return result
```

```javascript
// Time: O((n + m + q) * logW) where W is max weight (up to 2^30)
// Space: O(n + m) for union-find and edge storage
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
    if (rootX === rootY) return false;

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

  connected(x, y) {
    // Check if two nodes are in the same component
    return this.find(x) === this.find(y);
  }
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[][]} queries
 * @return {number[]}
 */
var minimumCost = function (n, edges, queries) {
  const result = [];

  // Process each query
  for (const [u, v] of queries) {
    if (u === v) {
      // Same node: cost is 0 (bitwise AND of empty path)
      result.push(0);
      continue;
    }

    // Start with all bits set (maximum possible value)
    let currentMask = (1 << 30) - 1; // Since wi <= 10^9 < 2^30

    // Try to clear bits from highest to lowest
    for (let bit = 29; bit >= 0; bit--) {
      // Create a new union-find for this bit check
      const uf = new UnionFind(n);

      // Add all edges that don't have this bit set
      for (const [x, y, w] of edges) {
        // Check if the bit at position 'bit' is 0 in w
        if (!((w >> bit) & 1)) {
          uf.union(x, y);
        }
      }

      // Check if u and v are connected using only edges without this bit
      if (uf.connected(u, v)) {
        // We can clear this bit
        currentMask &= ~(1 << bit);
      }
      // If not connected, we must keep this bit set
    }

    result.push(currentMask);
  }

  return result;
};
```

```java
// Time: O((n + m + q) * logW) where W is max weight (up to 2^30)
// Space: O(n + m) for union-find and edge storage
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
        if (rootX == rootY) return false;

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

    public boolean connected(int x, int y) {
        // Check if two nodes are in the same component
        return find(x) == find(y);
    }
}

class Solution {
    public int[] minimumCost(int n, int[][] edges, int[][] queries) {
        int[] result = new int[queries.length];

        // Process each query
        for (int i = 0; i < queries.length; i++) {
            int u = queries[i][0];
            int v = queries[i][1];

            if (u == v) {
                // Same node: cost is 0 (bitwise AND of empty path)
                result[i] = 0;
                continue;
            }

            // Start with all bits set (maximum possible value)
            int currentMask = (1 << 30) - 1;  // Since wi <= 10^9 < 2^30

            // Try to clear bits from highest to lowest
            for (int bit = 29; bit >= 0; bit--) {
                // Create a new union-find for this bit check
                UnionFind uf = new UnionFind(n);

                // Add all edges that don't have this bit set
                for (int[] edge : edges) {
                    int x = edge[0];
                    int y = edge[1];
                    int w = edge[2];

                    // Check if the bit at position 'bit' is 0 in w
                    if (((w >> bit) & 1) == 0) {
                        uf.union(x, y);
                    }
                }

                // Check if u and v are connected using only edges without this bit
                if (uf.connected(u, v)) {
                    // We can clear this bit
                    currentMask &= ~(1 << bit);
                }
                // If not connected, we must keep this bit set
            }

            result[i] = currentMask;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m + q) \* logW)

- `n`: number of vertices
- `m`: number of edges
- `q`: number of queries
- `logW`: number of bits needed to represent the maximum weight (up to 30 for weights ≤ 10^9)

For each query, we process up to 30 bits. For each bit, we:

1. Create a new union-find (O(n))
2. Process all edges to build the graph (O(m))
3. Check connectivity (O(α(n)) where α is inverse Ackermann, effectively constant)

**Space Complexity:** O(n + m)

- O(n) for the union-find data structure
- O(m) for storing the edges
- The space is reused for each bit check, so it doesn't multiply by the number of bits

## Common Mistakes

1. **Using Dijkstra or Floyd-Warshall with AND as the operation:** These algorithms assume the triangle inequality and additive costs, which don't hold for bitwise AND. AND is not associative in the way addition is for pathfinding.

2. **Not processing bits from highest to lowest:** If you process from lowest to highest, you might clear a low bit but then find out you need to keep a higher bit set, which could have been avoided if you processed in the correct order.

3. **Forgetting to handle the case where u == v:** When the start and end are the same vertex, the cost should be 0 (or all bits set, depending on definition). Always check for this edge case.

4. **Creating a new union-find for each query-bit combination:** While our solution does this for clarity, in practice you might want to precompute connectivity for each bit mask to optimize multiple queries. However, the naive approach of rebuilding for each query-bit is easier to understand and implement correctly.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for Connectivity:** Problems like "Number of Connected Components in an Undirected Graph" (LeetCode 323) use union-find to track connectivity as edges are added or removed.

2. **Bitmask DP/Greedy:** Problems like "Partition to K Equal Sum Subsets" (LeetCode 698) or "Maximum Product of Word Lengths" (LeetCode 318) use bitmasks to represent sets or states.

3. **Graph Problems with Bitwise Operations:** Problems like "Minimum Cost to Connect Two Groups of Points" (LeetCode 1595) combine graph theory with bitwise constraints.

The key insight is recognizing that when an operation can only decrease values (like AND clearing bits), you can often process constraints in a greedy manner from most significant to least significant.

## Key Takeaways

1. **Bitwise operations on paths require different thinking than additive costs:** When costs combine via AND/OR/XOR instead of addition, standard shortest-path algorithms often don't apply. Look for greedy bit-by-bit approaches instead.

2. **Union-find is powerful for connectivity queries:** When you need to repeatedly check if nodes are connected as you modify the graph (adding/removing edges), union-find provides near-constant time operations.

3. **Process constraints from most significant to least significant:** For minimization problems with bitwise operations, clearing high-order bits first gives the biggest reduction in value. This greedy approach is often optimal.

[Practice this problem on CodeJeet](/problem/minimum-cost-walk-in-weighted-graph)
