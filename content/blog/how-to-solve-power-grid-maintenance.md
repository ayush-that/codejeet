---
title: "How to Solve Power Grid Maintenance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Power Grid Maintenance. Medium difficulty, 56.3% acceptance rate. Topics: Array, Hash Table, Depth-First Search, Breadth-First Search, Union-Find."
date: "2027-08-08"
category: "dsa-patterns"
tags: ["power-grid-maintenance", "array", "hash-table", "depth-first-search", "medium"]
---

# How to Solve Power Grid Maintenance

You’re given a power grid of `c` stations connected by `n` bidirectional cables. The grid is initially fully connected, but some cables may be redundant. Your task is to find the minimum number of cables that can be removed while keeping all stations reachable from each other. This is essentially finding the number of redundant connections in a connected graph—a classic problem that tests your understanding of graph connectivity and cycle detection.

**Why this is tricky:** The problem disguises a fundamental graph theory concept: in a connected graph with `c` nodes, you need exactly `c-1` edges to keep it connected (a spanning tree). Any extra edges are redundant. The challenge is recognizing this property and efficiently counting how many edges exceed this minimum.

## Visual Walkthrough

Let’s walk through a small example:

**Input:**

```
c = 5
connections = [[1,2], [2,3], [3,4], [4,5], [1,3]]
```

We have 5 stations and 5 connections.

**Step-by-step reasoning:**

1. A connected graph with 5 nodes requires **at least 4 edges** to stay connected (like a tree).
2. We have 5 edges total.
3. Therefore, the number of redundant edges = total edges - (c - 1) = 5 - 4 = 1.
4. But wait—this formula only works if the graph is _already connected_. What if some stations aren’t reachable?
5. Actually, the problem states the grid is _initially fully connected_, so we know all nodes are reachable from the start.
6. Thus, any edges beyond the first `c-1` that connect already-connected components are redundant.

Let’s trace Union-Find to see this:

- Start with each node as its own component.
- Process [1,2]: union them → components: {1,2}, {3}, {4}, {5}
- Process [2,3]: union {1,2} with {3} → components: {1,2,3}, {4}, {5}
- Process [3,4]: union {1,2,3} with {4} → components: {1,2,3,4}, {5}
- Process [4,5]: union {1,2,3,4} with {5} → components: {1,2,3,4,5}
- Process [1,3]: nodes 1 and 3 are already in the same component → **this edge is redundant!**

We found 1 redundant connection, matching our calculation.

## Brute Force Approach

A naive approach might try to remove each cable one by one and check if the graph remains connected using DFS/BFS. For each of `n` edges, we’d run a traversal costing O(c + n), leading to O(n×(c+n)) time—far too slow for large graphs.

**Why it fails:**

- With c up to 10⁵ and n up to 10⁵, O(n×(c+n)) could be ~10¹⁰ operations.
- The brute force misses the key insight: we don’t need to test removals if we can identify redundant edges during graph construction.

## Optimized Approach

The key insight is that **in a connected graph, any edge connecting two nodes already in the same connected component is redundant**. This is a perfect scenario for Union-Find (Disjoint Set Union):

1. **Union-Find tracks connected components** efficiently with near-constant time operations.
2. **Initialize** each station as its own component.
3. **Process each connection**:
   - If the two stations are in different components, union them (this edge is necessary).
   - If they’re already in the same component, this edge is redundant—count it.
4. **Result** = count of redundant edges found.

**Why this works:**

- Initially, we need `c-1` edges to connect all components.
- Each time we union different components, we use one “necessary” edge.
- Once all components are united, any remaining edges connecting nodes within the same component are extra.
- Since the graph starts connected, we’ll always end with all nodes in one component.

## Optimal Solution

Here’s the complete implementation using Union-Find with path compression and union by rank:

<div class="code-group">

```python
# Time: O(n * α(c)) where α is the inverse Ackermann function (near-constant)
# Space: O(c) for the parent and rank arrays
def min_cables_to_remove(c, connections):
    """
    Returns the minimum number of cables that can be removed while keeping
    all power stations connected.

    Args:
        c: Number of power stations (1 to c)
        connections: List of [u, v] pairs representing cables

    Returns:
        Integer count of removable cables
    """
    # Initialize Union-Find structures
    parent = list(range(c + 1))  # 1-based indexing for stations
    rank = [0] * (c + 1)

    def find(x):
        """Find root of x with path compression."""
        if parent[x] != x:
            parent[x] = find(parent[x])  # Path compression
        return parent[x]

    def union(x, y):
        """Union sets containing x and y using union by rank."""
        root_x = find(x)
        root_y = find(y)

        # If already in same set, this edge is redundant
        if root_x == root_y:
            return True  # Redundant edge found

        # Union by rank: attach smaller tree under larger tree
        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
        else:
            parent[root_y] = root_x
            rank[root_x] += 1

        return False  # Edge was necessary

    redundant_count = 0

    # Process each connection
    for u, v in connections:
        if union(u, v):
            redundant_count += 1

    return redundant_count
```

```javascript
// Time: O(n * α(c)) where α is the inverse Ackermann function (near-constant)
// Space: O(c) for the parent and rank arrays
function minCablesToRemove(c, connections) {
  /**
   * Returns the minimum number of cables that can be removed while keeping
   * all power stations connected.
   *
   * @param {number} c - Number of power stations (1 to c)
   * @param {number[][]} connections - Array of [u, v] pairs representing cables
   * @return {number} - Count of removable cables
   */

  // Initialize Union-Find structures
  const parent = Array.from({ length: c + 1 }, (_, i) => i); // 1-based indexing
  const rank = new Array(c + 1).fill(0);

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  };

  // Union with union by rank
  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);

    // If already in same set, this edge is redundant
    if (rootX === rootY) {
      return true; // Redundant edge found
    }

    // Union by rank: attach smaller tree under larger tree
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }

    return false; // Edge was necessary
  };

  let redundantCount = 0;

  // Process each connection
  for (const [u, v] of connections) {
    if (union(u, v)) {
      redundantCount++;
    }
  }

  return redundantCount;
}
```

```java
// Time: O(n * α(c)) where α is the inverse Ackermann function (near-constant)
// Space: O(c) for the parent and rank arrays
class Solution {
    public int minCablesToRemove(int c, int[][] connections) {
        /**
         * Returns the minimum number of cables that can be removed while keeping
         * all power stations connected.
         *
         * @param c: Number of power stations (1 to c)
         * @param connections: Array of [u, v] pairs representing cables
         * @return: Count of removable cables
         */

        // Initialize Union-Find structures
        int[] parent = new int[c + 1]; // 1-based indexing
        int[] rank = new int[c + 1];

        for (int i = 1; i <= c; i++) {
            parent[i] = i;
            rank[i] = 0;
        }

        int redundantCount = 0;

        // Process each connection
        for (int[] conn : connections) {
            int u = conn[0];
            int v = conn[1];

            if (union(parent, rank, u, v)) {
                redundantCount++;
            }
        }

        return redundantCount;
    }

    // Find with path compression
    private int find(int[] parent, int x) {
        if (parent[x] != x) {
            parent[x] = find(parent, parent[x]); // Path compression
        }
        return parent[x];
    }

    // Union with union by rank
    private boolean union(int[] parent, int[] rank, int x, int y) {
        int rootX = find(parent, x);
        int rootY = find(parent, y);

        // If already in same set, this edge is redundant
        if (rootX == rootY) {
            return true; // Redundant edge found
        }

        // Union by rank: attach smaller tree under larger tree
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        return false; // Edge was necessary
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × α(c))

- We process each of the `n` connections once.
- Each Union-Find operation (find/union) takes amortized O(α(c)) time, where α is the inverse Ackermann function (extremely slow-growing, effectively constant for practical inputs).
- Overall: O(n × α(c)) ≈ O(n) for practical purposes.

**Space Complexity:** O(c)

- We store two arrays of size `c+1` (parent and rank) for the Union-Find structure.
- The input storage is not counted toward auxiliary space.

## Common Mistakes

1. **Forgetting the graph starts connected:** Some candidates try to check connectivity at the end, but the problem guarantees initial full connectivity. This simplifies the solution—we just count redundant edges.

2. **Using DFS/BFS for each edge:** Attempting to check connectivity after removing each edge leads to O(n×(c+n)) time. Recognize that Union-Find is the right tool for incremental connectivity queries.

3. **Off-by-one errors with 1-based indexing:** Stations are numbered 1 to c, but arrays are 0-indexed. Always allocate size `c+1` and ignore index 0, or carefully map station IDs to 0-based indices.

4. **Missing path compression or union by rank:** Without these optimizations, Union-Find degrades to O(n log n) or worse. Always implement both for interview solutions.

## When You'll See This Pattern

This problem uses **Union-Find for cycle detection in undirected graphs**, a pattern that appears in many connectivity problems:

1. **LeetCode 684: Redundant Connection** — Almost identical problem: find an edge that can be removed to make a tree. The same Union-Find approach works directly.

2. **LeetCode 547: Number of Provinces** — Count connected components in an undirected graph. Union-Find can track components as you process edges.

3. **LeetCode 1319: Number of Operations to Make Network Connected** — Similar to this problem but asks how many edges are needed to connect the graph rather than how many are redundant.

**Recognize this pattern when:** You need to process edges incrementally while tracking connectivity, especially when looking for cycles or redundant connections in undirected graphs.

## Key Takeaways

1. **In a connected undirected graph with c nodes, exactly c-1 edges are needed** (a spanning tree). Any additional edges are redundant—this is the core math behind the solution.

2. **Union-Find is optimal for incremental connectivity queries** — When you need to repeatedly check if two nodes are connected as you add edges, Union-Find with path compression and union by rank provides near-constant time operations.

3. **The problem guarantees initial connectivity** — This simplifies the solution since we don't need to verify connectivity at the end; we just count edges that connect already-connected components.

[Practice this problem on CodeJeet](/problem/power-grid-maintenance)
