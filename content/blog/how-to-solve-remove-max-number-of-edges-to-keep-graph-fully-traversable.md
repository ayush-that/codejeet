---
title: "How to Solve Remove Max Number of Edges to Keep Graph Fully Traversable — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Remove Max Number of Edges to Keep Graph Fully Traversable. Hard difficulty, 70.2% acceptance rate. Topics: Union-Find, Graph Theory."
date: "2026-10-12"
category: "dsa-patterns"
tags:
  [
    "remove-max-number-of-edges-to-keep-graph-fully-traversable",
    "union-find",
    "graph-theory",
    "hard",
  ]
---

# How to Solve "Remove Max Number of Edges to Keep Graph Fully Traversable"

This problem asks us to maximize the number of edges we can remove from a graph while keeping it fully traversable for both Alice and Bob. The twist is that edges have different types: some work only for Alice, some only for Bob, and some work for both. What makes this problem interesting is that we need to maintain connectivity for two separate "users" while maximizing deletions, which requires careful prioritization of edge types.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have `n = 4` nodes and these edges:

1. `[3, 1, 2]` - Type 3 (both can use)
2. `[3, 2, 3]` - Type 3 (both can use)
3. `[1, 1, 3]` - Type 1 (Alice only)
4. `[2, 3, 4]` - Type 2 (Bob only)
5. `[1, 2, 4]` - Type 1 (Alice only)
6. `[2, 2, 4]` - Type 2 (Bob only)

**Step 1: Process Type 3 edges first** (most valuable)

- Edge 1 (type 3): Connect nodes 1-2 for both Alice and Bob
- Edge 2 (type 3): Connect nodes 2-3 for both Alice and Bob
- Now Alice and Bob both have components: {1,2,3} and {4}

**Step 2: Process Type 1 edges for Alice**

- Edge 3 (type 1): Connect 1-3 for Alice, but they're already connected via type 3 edges → can remove this edge!
- Edge 5 (type 1): Connect 2-4 for Alice → needed to connect component {4} to {1,2,3}

**Step 3: Process Type 2 edges for Bob**

- Edge 4 (type 2): Connect 3-4 for Bob → needed to connect component {4} to {1,2,3}
- Edge 6 (type 2): Connect 2-4 for Bob, but 4 is already connected via edge 4 → can remove this edge!

**Result**: We removed edges 3 and 6 (2 edges total). Both Alice and Bob can traverse the entire graph with the remaining edges.

## Brute Force Approach

A naive approach would be to try all subsets of edges and check if each subset keeps the graph fully traversable for both Alice and Bob. For each subset:

1. Build Alice's graph with type 1 and type 3 edges
2. Build Bob's graph with type 2 and type 3 edges
3. Check if both graphs are connected (all nodes reachable from any node)

**Why this fails**: With `m` edges, there are `2^m` possible subsets. For each subset, checking connectivity takes `O(n + m)` time. Even for moderate `m = 100`, `2^100` is astronomically large. This exponential approach is completely infeasible.

## Optimized Approach

The key insight is that **connectivity problems often benefit from Union-Find (Disjoint Set Union)**. Here's the step-by-step reasoning:

1. **Type 3 edges are most valuable** because they serve both Alice and Bob with a single edge. We should use these first whenever possible.

2. **We need two separate Union-Find structures**: one for Alice and one for Bob, since they have different accessible edges.

3. **Process edges in order of decreasing type**: Type 3 → Type 1 → Type 2. For each edge:
   - If it connects already-connected nodes for the relevant user(s), we can remove it.
   - Otherwise, we must keep it to maintain connectivity.

4. **Check final connectivity**: After processing all edges, both Alice and Bob must have fully connected graphs (one component each). If not, return -1.

This greedy approach works because:

- Type 3 edges give the most "bang for the buck" - one edge helps both users
- If nodes are already connected, adding another edge between them is redundant
- Union-Find lets us check connectivity in near-constant time

## Optimal Solution

Here's the complete solution using Union-Find with path compression and union by rank:

<div class="code-group">

```python
# Time: O(m * α(n)) where α is inverse Ackermann (near constant)
# Space: O(n) for the Union-Find structures
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed nodes
        self.rank = [0] * (n + 1)
        self.components = n  # Track number of connected components

    def find(self, x):
        # Path compression: flatten the tree
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree to larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False  # Already connected, edge is redundant

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.components -= 1
        return True  # Successfully connected

class Solution:
    def maxNumEdgesToRemove(self, n: int, edges: List[List[int]]) -> int:
        # Initialize Union-Find for Alice and Bob separately
        alice_uf = UnionFind(n)
        bob_uf = UnionFind(n)

        edges_removed = 0

        # Process type 3 edges first (most valuable)
        for type_i, u, v in edges:
            if type_i == 3:
                # Try to add to both Alice and Bob
                alice_connected = alice_uf.union(u, v)
                bob_connected = bob_uf.union(u, v)

                # If already connected for both, we can remove this edge
                if not alice_connected and not bob_connected:
                    edges_removed += 1

        # Process type 1 edges (Alice only)
        for type_i, u, v in edges:
            if type_i == 1:
                # Try to add to Alice's graph
                if not alice_uf.union(u, v):
                    edges_removed += 1  # Already connected

        # Process type 2 edges (Bob only)
        for type_i, u, v in edges:
            if type_i == 2:
                # Try to add to Bob's graph
                if not bob_uf.union(u, v):
                    edges_removed += 1  # Already connected

        # Check if both Alice and Bob have fully connected graphs
        if alice_uf.components != 1 or bob_uf.components != 1:
            return -1

        return edges_removed
```

```javascript
// Time: O(m * α(n)) where α is inverse Ackermann (near constant)
// Space: O(n) for the Union-Find structures
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n + 1 }, (_, i) => i); // 1-indexed nodes
    this.rank = new Array(n + 1).fill(0);
    this.components = n; // Track number of connected components
  }

  find(x) {
    // Path compression: flatten the tree
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree to larger tree
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already connected, edge is redundant
    }

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.components--;
    return true; // Successfully connected
  }
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var maxNumEdgesToRemove = function (n, edges) {
  // Initialize Union-Find for Alice and Bob separately
  const aliceUF = new UnionFind(n);
  const bobUF = new UnionFind(n);

  let edgesRemoved = 0;

  // Process type 3 edges first (most valuable)
  for (const [type, u, v] of edges) {
    if (type === 3) {
      // Try to add to both Alice and Bob
      const aliceConnected = aliceUF.union(u, v);
      const bobConnected = bobUF.union(u, v);

      // If already connected for both, we can remove this edge
      if (!aliceConnected && !bobConnected) {
        edgesRemoved++;
      }
    }
  }

  // Process type 1 edges (Alice only)
  for (const [type, u, v] of edges) {
    if (type === 1) {
      // Try to add to Alice's graph
      if (!aliceUF.union(u, v)) {
        edgesRemoved++; // Already connected
      }
    }
  }

  // Process type 2 edges (Bob only)
  for (const [type, u, v] of edges) {
    if (type === 2) {
      // Try to add to Bob's graph
      if (!bobUF.union(u, v)) {
        edgesRemoved++; // Already connected
      }
    }
  }

  // Check if both Alice and Bob have fully connected graphs
  if (aliceUF.components !== 1 || bobUF.components !== 1) {
    return -1;
  }

  return edgesRemoved;
};
```

```java
// Time: O(m * α(n)) where α is inverse Ackermann (near constant)
// Space: O(n) for the Union-Find structures
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int components;

    public UnionFind(int n) {
        parent = new int[n + 1]; // 1-indexed nodes
        rank = new int[n + 1];
        components = n; // Track number of connected components

        for (int i = 1; i <= n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression: flatten the tree
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        // Union by rank: attach smaller tree to larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false; // Already connected, edge is redundant
        }

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        components--;
        return true; // Successfully connected
    }

    public int getComponents() {
        return components;
    }
}

class Solution {
    public int maxNumEdgesToRemove(int n, int[][] edges) {
        // Initialize Union-Find for Alice and Bob separately
        UnionFind aliceUF = new UnionFind(n);
        UnionFind bobUF = new UnionFind(n);

        int edgesRemoved = 0;

        // Process type 3 edges first (most valuable)
        for (int[] edge : edges) {
            int type = edge[0];
            int u = edge[1];
            int v = edge[2];

            if (type == 3) {
                // Try to add to both Alice and Bob
                boolean aliceConnected = aliceUF.union(u, v);
                boolean bobConnected = bobUF.union(u, v);

                // If already connected for both, we can remove this edge
                if (!aliceConnected && !bobConnected) {
                    edgesRemoved++;
                }
            }
        }

        // Process type 1 edges (Alice only)
        for (int[] edge : edges) {
            int type = edge[0];
            int u = edge[1];
            int v = edge[2];

            if (type == 1) {
                // Try to add to Alice's graph
                if (!aliceUF.union(u, v)) {
                    edgesRemoved++; // Already connected
                }
            }
        }

        // Process type 2 edges (Bob only)
        for (int[] edge : edges) {
            int type = edge[0];
            int u = edge[1];
            int v = edge[2];

            if (type == 2) {
                // Try to add to Bob's graph
                if (!bobUF.union(u, v)) {
                    edgesRemoved++; // Already connected
                }
            }
        }

        // Check if both Alice and Bob have fully connected graphs
        if (aliceUF.getComponents() != 1 || bobUF.getComponents() != 1) {
            return -1;
        }

        return edgesRemoved;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(m * α(n))` where:

- `m` is the number of edges (we process each edge a constant number of times)
- `α(n)` is the inverse Ackermann function, which grows extremely slowly (effectively constant for practical `n`)
- We make three passes through the edges (for types 3, 1, and 2), but this is still `O(m)`

**Space Complexity**: `O(n)` for:

- Two Union-Find structures (Alice and Bob), each requiring `O(n)` space
- The parent and rank arrays for each Union-Find

## Common Mistakes

1. **Processing edges in wrong order**: If you process type 1 or 2 edges before type 3, you might use single-user edges when a type 3 edge could have served both users, resulting in fewer edges removed.

2. **Forgetting to check final connectivity**: After processing all edges, you must verify that both Alice and Bob have fully connected graphs (one component each). If not, return -1.

3. **Using inefficient Union-Find**: Without path compression and union by rank, Union-Find operations become `O(n)` instead of near-constant, making the solution too slow for large inputs.

4. **Mixing up 0-indexed vs 1-indexed nodes**: The problem uses 1-indexed nodes, but arrays are 0-indexed. Be careful with array sizes and indices.

## When You'll See This Pattern

This problem combines **Union-Find** with **greedy edge selection**, a pattern that appears in several graph connectivity problems:

1. **"Redundant Connection" (LeetCode 684)**: Find an edge that can be removed to make a tree. Similar Union-Find approach but simpler since there's only one graph.

2. **"Connecting Cities With Minimum Cost" (LeetCode 1135)**: Minimum spanning tree problem that also uses Union-Find with greedy edge selection (Kruskal's algorithm).

3. **"Number of Operations to Make Network Connected" (LeetCode 1319)**: Count how many edges can be removed/reused to connect a graph, using Union-Find to track components.

The key pattern is: when you need to build or maintain connectivity while optimizing some edge-related metric (min/max edges to add/remove), think Union-Find with greedy processing.

## Key Takeaways

1. **Union-Find is your go-to for connectivity problems**: When you need to repeatedly check if nodes are connected or merge components, Union-Find with path compression and union by rank provides near-constant time operations.

2. **Process shared resources first in greedy approaches**: Type 3 edges benefit both Alice and Bob, so using them first maximizes their value. This is a common greedy strategy: use the most "valuable" options first.

3. **Separate but related constraints need separate tracking**: Alice and Bob have different accessible edges, so we need separate Union-Find structures, but we can process type 3 edges for both simultaneously.

[Practice this problem on CodeJeet](/problem/remove-max-number-of-edges-to-keep-graph-fully-traversable)
