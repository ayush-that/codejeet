---
title: "How to Solve Redundant Connection — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Redundant Connection. Medium difficulty, 67.3% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-02-23"
category: "dsa-patterns"
tags: ["redundant-connection", "depth-first-search", "breadth-first-search", "union-find", "medium"]
---

# How to Solve Redundant Connection

You're given an undirected graph that was originally a tree (connected, acyclic) with `n` nodes labeled 1 to `n`, but one extra edge was added. This edge connects two different vertices and creates exactly one cycle in the graph. Your task is to identify and return the edge that should be removed to restore the tree structure. If multiple edges could be removed, return the one that appears last in the input.

What makes this problem interesting is that we need to detect cycles in an undirected graph, but with a twist: we know exactly one cycle exists, and we need to find the specific edge that created it. The challenge lies in efficiently tracking connectivity as we process edges.

## Visual Walkthrough

Let's trace through a concrete example: `edges = [[1,2], [2,3], [3,4], [1,4], [1,5]]`

We have 5 nodes (1-5). The original tree would have been 4 edges (n-1 edges for n nodes), but we have 5 edges, meaning one is redundant.

**Step-by-step processing:**

1. Edge [1,2]: Nodes 1 and 2 are not connected yet. Connect them.
2. Edge [2,3]: Nodes 2 and 3 are not connected (2 connects to 1, but 3 is separate). Connect 3 to 2's component.
3. Edge [3,4]: Nodes 3 and 4 are not connected. Connect 4 to 3's component.
4. Edge [1,4]: Now check: Are 1 and 4 already connected?
   - 1 connects to 2, which connects to 3, which connects to 4
   - Yes! They're in the same connected component. This edge [1,4] creates a cycle.
5. Edge [1,5]: Nodes 1 and 5 are not connected. Connect them.

The redundant edge is [1,4] because it's the first edge we encounter that connects two nodes already in the same connected component.

## Brute Force Approach

A naive approach would be: For each edge, temporarily remove it from the graph and check if the remaining graph is a valid tree (connected and acyclic). If it is, that edge is redundant.

**Why this fails:**

1. **Time complexity:** O(E × (V+E)) where E is number of edges and V is number of vertices. For each edge removal, we need to run DFS/BFS to check connectivity and acyclicity.
2. **Inefficient:** We're doing redundant work. Each check rebuilds the graph and traverses it.
3. **Edge ordering:** We'd need to track which edge to return when multiple could work.

The brute force helps us understand what we're looking for (an edge whose removal makes the graph a tree), but it's too slow for constraints where n can be up to 1000.

## Optimized Approach

The key insight: **In an undirected graph, if you add an edge between two nodes that are already connected, you create a cycle.**

This leads us to Union-Find (Disjoint Set Union), which is perfect for this problem because:

1. It efficiently tracks connected components
2. It can detect when two nodes are already connected in near-constant time
3. We process edges in order, so the first edge that connects already-connected nodes is our answer

**Union-Find intuition:**

- Each node starts in its own component
- As we process edges, we union the components of the two nodes
- Before unioning, we check: are these nodes already in the same component?
- If yes, this edge creates a cycle → it's our answer
- If no, we union them and continue

**Why this works for the "last in input" requirement:**
We process edges in the given order. The first edge that creates a cycle is necessarily the one we want to remove (since removing any earlier edge would disconnect the graph or leave other cycles).

## Optimal Solution

Here's the complete Union-Find solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * α(n)) ≈ O(n) where α is inverse Ackermann function (very slow growing)
# Space: O(n) for parent and rank arrays
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        parent = list(range(n + 1))  # 1-indexed for nodes 1..n
        rank = [0] * (n + 1)  # Union by rank for optimization

        def find(x: int) -> int:
            """Find root of x with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression: make parent point to root
            return parent[x]

        def union(x: int, y: int) -> bool:
            """Union components containing x and y. Returns False if already connected."""
            root_x = find(x)
            root_y = find(y)

            if root_x == root_y:
                # Already in same component - this edge creates a cycle
                return False

            # Union by rank: attach smaller tree under larger tree
            if rank[root_x] < rank[root_y]:
                parent[root_x] = root_y
            elif rank[root_x] > rank[root_y]:
                parent[root_y] = root_x
            else:
                # Same rank, choose one as root and increment its rank
                parent[root_y] = root_x
                rank[root_x] += 1
            return True

        # Process edges in order
        for u, v in edges:
            if not union(u, v):
                # This edge connects already-connected nodes -> cycle created
                return [u, v]

        # According to problem constraints, we should always find a redundant edge
        return []
```

```javascript
// Time: O(n * α(n)) ≈ O(n) where α is inverse Ackermann function
// Space: O(n) for parent and rank arrays
/**
 * @param {number[][]} edges
 * @return {number[]}
 */
var findRedundantConnection = function (edges) {
  const n = edges.length;
  const parent = new Array(n + 1); // 1-indexed for nodes 1..n
  const rank = new Array(n + 1).fill(0); // Union by rank for optimization

  // Initialize each node as its own parent
  for (let i = 1; i <= n; i++) {
    parent[i] = i;
  }

  /**
   * Find root of x with path compression
   * @param {number} x - node to find root of
   * @return {number} root of x
   */
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  }

  /**
   * Union components containing x and y
   * @param {number} x - first node
   * @param {number} y - second node
   * @return {boolean} false if x and y already connected (cycle detected)
   */
  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) {
      // Already in same component - this edge creates a cycle
      return false;
    }

    // Union by rank: attach smaller tree under larger tree
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      // Same rank, choose one as root and increment its rank
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  // Process edges in order
  for (const [u, v] of edges) {
    if (!union(u, v)) {
      // This edge connects already-connected nodes -> cycle created
      return [u, v];
    }
  }

  // According to problem constraints, we should always find a redundant edge
  return [];
};
```

```java
// Time: O(n * α(n)) ≈ O(n) where α is inverse Ackermann function
// Space: O(n) for parent and rank arrays
class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        int[] parent = new int[n + 1];  // 1-indexed for nodes 1..n
        int[] rank = new int[n + 1];    // Union by rank for optimization

        // Initialize each node as its own parent
        for (int i = 1; i <= n; i++) {
            parent[i] = i;
        }

        // Process edges in order
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];

            if (!union(u, v, parent, rank)) {
                // This edge connects already-connected nodes -> cycle created
                return edge;
            }
        }

        // According to problem constraints, we should always find a redundant edge
        return new int[0];
    }

    /**
     * Find root of x with path compression
     * @param x - node to find root of
     * @param parent - parent array
     * @return root of x
     */
    private int find(int x, int[] parent) {
        if (parent[x] != x) {
            parent[x] = find(parent[x], parent);  // Path compression
        }
        return parent[x];
    }

    /**
     * Union components containing x and y
     * @param x - first node
     * @param y - second node
     * @param parent - parent array
     * @param rank - rank array for union by rank
     * @return false if x and y already connected (cycle detected)
     */
    private boolean union(int x, int y, int[] parent, int[] rank) {
        int rootX = find(x, parent);
        int rootY = find(y, parent);

        if (rootX == rootY) {
            // Already in same component - this edge creates a cycle
            return false;
        }

        // Union by rank: attach smaller tree under larger tree
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            // Same rank, choose one as root and increment its rank
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × α(n)) ≈ O(n)

- We process each of the n edges once
- For each edge, we perform two `find` operations and possibly one `union`
- With path compression and union by rank, each operation takes α(n) time, where α is the inverse Ackermann function
- α(n) is extremely slow-growing (≤ 4 for all practical n), so effectively constant time

**Space Complexity:** O(n)

- We store two arrays of size n+1: `parent` and `rank`
- The recursion depth in `find` is limited by path compression

## Common Mistakes

1. **Forgetting 1-indexing:** The nodes are labeled 1 to n, but arrays are 0-indexed. Many candidates create arrays of size n instead of n+1, leading to index-out-of-bounds errors.

2. **Missing path compression:** Without path compression in the `find` operation, the time complexity degrades to O(n²) in worst case. Always implement `parent[x] = find(parent[x])` instead of just returning `find(parent[x])`.

3. **Not checking connectivity before union:** The core logic is checking if two nodes are already connected BEFORE unioning them. If you union first and then check, you'll miss the cycle detection.

4. **Returning wrong edge when multiple cycles:** Remember we need the last edge in the input that could be removed. Since we process edges in order, the first edge that creates a cycle is actually the answer (because removing any earlier edge would leave the graph disconnected or still cyclic).

## When You'll See This Pattern

Union-Find is a fundamental pattern for connectivity problems in graphs:

1. **Redundant Connection II (Hard)** - The directed version of this problem. You need to handle cases where the extra edge creates a node with two parents or creates a cycle.

2. **Accounts Merge (Medium)** - Merge accounts with common emails. Each email is a node, and accounts provide edges. Union-Find groups connected emails.

3. **Number of Connected Components in an Undirected Graph (Medium)** - Direct application of Union-Find to count components after adding edges.

4. **Graph Valid Tree (Medium)** - Very similar to this problem: check if a graph is a valid tree (connected and acyclic).

The pattern is recognizable when you need to:

- Track connectivity between elements
- Merge groups/sets
- Detect cycles in undirected graphs
- Process edges/connections incrementally

## Key Takeaways

1. **Union-Find is ideal for incremental connectivity:** When you need to process edges/connections one by one and track which nodes are connected, Union-Find with path compression and union by rank provides near-constant time operations.

2. **Cycle detection in undirected graphs:** An edge creates a cycle if and only if its endpoints are already connected. This simple observation is the key to many graph problems.

3. **Process edges in order for "last occurrence" problems:** When you need the last edge satisfying some property (like creating a cycle), process edges in the given order and return the first one that meets the condition.

Related problems: [Redundant Connection II](/problem/redundant-connection-ii), [Accounts Merge](/problem/accounts-merge), [Maximum Employees to Be Invited to a Meeting](/problem/maximum-employees-to-be-invited-to-a-meeting)
