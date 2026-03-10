---
title: "How to Solve Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree. Hard difficulty, 66.3% acceptance rate. Topics: Union-Find, Graph Theory, Sorting, Minimum Spanning Tree, Strongly Connected Component."
date: "2028-01-20"
category: "dsa-patterns"
tags:
  [
    "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
    "union-find",
    "graph-theory",
    "sorting",
    "hard",
  ]
---

# How to Solve Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree

This problem asks us to classify every edge in a weighted, undirected, connected graph as either **critical**, **pseudo-critical**, or **non-critical** with respect to the graph's minimum spanning trees (MSTs). An edge is **critical** if it appears in _every_ MST of the graph. An edge is **pseudo-critical** if it appears in _some but not all_ MSTs. Otherwise, it's **non-critical**. The challenge lies in efficiently determining these classifications without enumerating all possible MSTs, which would be computationally infeasible for larger graphs.

What makes this problem particularly interesting is that it requires a deep understanding of MST properties (specifically the **cut property** and **cycle property**) and clever application of Union-Find (Disjoint Set Union) to test edge importance through inclusion/exclusion experiments.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider a graph with 4 vertices (0-3) and these edges:

```
edges = [[0,1,1], [1,2,1], [2,3,1], [3,0,2], [0,2,2]]
indices:    0         1         2         3         4
```

**Step 1: Find the MST weight**
First, we need to know the minimum total weight of any spanning tree. Sorting edges by weight:

- Weight 1: (0,1), (1,2), (2,3)
- Weight 2: (3,0), (0,2)

Using Kruskal's algorithm (adding edges in sorted order if they don't create cycles):

1. Add (0,1) - connects 0 and 1
2. Add (1,2) - connects 0,1,2
3. Add (2,3) - connects all vertices (0,1,2,3)
   Total weight = 3. We have our MST weight.

**Step 2: Testing if edge 0 (0,1,1) is critical**
We exclude edge 0 and try to build an MST without it. The remaining edges are:
(1,2,1), (2,3,1), (3,0,2), (0,2,2)

We can still build an MST with weight 3 using edges (1,2), (2,3), and (3,0) or (0,2). Since we can achieve the same minimum weight without edge 0, it's NOT critical.

**Step 3: Testing if edge 0 is pseudo-critical**
We force-include edge 0 and try to build an MST. Starting with edge 0 already included (connecting 0 and 1), we add other edges in sorted order:

1. Edge 0 already included (0,1)
2. Add (1,2) - connects 0,1,2
3. Add (2,3) - connects all vertices
   Total weight = 3, same as MST weight. So edge 0 CAN appear in some MST, making it pseudo-critical.

**Step 4: Testing edge 3 (3,0,2)**
If we exclude edge 3, we can still build MST weight 3 using (0,1), (1,2), (2,3). So not critical.
If we force-include edge 3, we start with (3,0) weight 2, then add (0,1) weight 1, then (1,2) weight 1. Total weight = 4 > 3. So edge 3 cannot appear in any MST - it's non-critical.

This manual process gives us the intuition: we need to test each edge by excluding it and forcing its inclusion to see how it affects MST construction.

## Brute Force Approach

A naive approach would be:

1. Find all possible MSTs of the graph (exponential in number of edges)
2. For each edge, check if it appears in all MSTs (critical), some MSTs (pseudo-critical), or no MSTs (non-critical)

This is completely impractical because:

- The number of MSTs can be exponential in the number of edges
- Even finding one MST takes O(E log E) time with Kruskal's algorithm
- Checking all combinations would be O(2^E) in the worst case

Even a slightly better brute force would be: for each edge, try building an MST without it, and try building an MST with it forced. But doing this independently for each edge with a full Kruskal's algorithm each time would be O(E² log E), which is still too slow for constraints where E can be up to 10⁵.

## Optimized Approach

The key insight comes from two fundamental MST properties:

1. **Cycle Property**: For any cycle in the graph, the edge with maximum weight on that cycle cannot be in any MST (unless there are multiple edges with the same maximum weight).

2. **Cut Property**: For any cut of the graph, the minimum weight edge crossing the cut must be in every MST (unless there are multiple edges with the same minimum weight).

Our optimized approach uses Kruskal's algorithm as a subroutine and performs two tests per edge:

**Test 1: Is the edge critical?**
Exclude the edge and try to build an MST using only the other edges. If:

- We cannot connect all vertices (graph becomes disconnected), OR
- The MST weight increases when we exclude this edge
  Then the edge is critical (must be in every MST).

**Test 2: Is the edge pseudo-critical?**
Force-include the edge first, then try to build an MST with the remaining edges. If the resulting spanning tree has the same weight as the original MST weight, then this edge can appear in some MST.

The optimization comes from:

1. Sorting edges once and reusing the sorted order
2. Using Union-Find (DSU) for efficient cycle detection
3. Implementing a generic `kruskal()` function that can exclude or force-include specific edges

## Optimal Solution

The solution involves three main steps:

1. Sort edges with their original indices preserved
2. Compute the original MST weight
3. For each edge, test if it's critical by excluding it, and test if it's pseudo-critical by forcing it

<div class="code-group">

```python
# Time: O(E^2 * α(n)) where α is inverse Ackermann function (near constant)
# Space: O(E + n) for storing edges and Union-Find data structures
class DSU:
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
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        return True

class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        # Step 1: Add original indices to edges before sorting
        m = len(edges)
        edges_with_index = [(w, u, v, i) for i, (u, v, w) in enumerate(edges)]
        edges_with_index.sort()  # Sort by weight

        # Step 2: Helper function for Kruskal's algorithm
        def kruskal(exclude_edge=None, include_edge=None):
            """
            Run Kruskal's algorithm with optional edge exclusion/force-inclusion.
            Returns MST weight and whether all vertices are connected.
            """
            dsu = DSU(n)
            weight = 0
            edges_used = 0

            # If we need to force-include an edge, add it first
            if include_edge is not None:
                w, u, v, idx = edges_with_index[include_edge]
                if dsu.union(u, v):
                    weight += w
                    edges_used += 1

            # Process edges in sorted order
            for i, (w, u, v, idx) in enumerate(edges_with_index):
                # Skip excluded edge
                if exclude_edge is not None and i == exclude_edge:
                    continue

                # Add edge if it doesn't create a cycle
                if dsu.union(u, v):
                    weight += w
                    edges_used += 1

            # Check if we connected all vertices (n-1 edges for spanning tree)
            return weight, edges_used == n - 1

        # Step 3: Find original MST weight
        original_weight, _ = kruskal()

        # Step 4: Test each edge
        critical = []
        pseudo_critical = []

        for i in range(m):
            # Test if edge i is critical by excluding it
            weight_without, connected = kruskal(exclude_edge=i)

            # If graph becomes disconnected or weight increases, edge is critical
            if not connected or weight_without > original_weight:
                critical.append(edges_with_index[i][3])  # Store original index
            else:
                # Test if edge i is pseudo-critical by forcing it
                weight_with, connected = kruskal(include_edge=i)
                # If we can build MST with same weight including this edge, it's pseudo-critical
                if connected and weight_with == original_weight:
                    pseudo_critical.append(edges_with_index[i][3])

        return [critical, pseudo_critical]
```

```javascript
// Time: O(E^2 * α(n)) where α is inverse Ackermann function (near constant)
// Space: O(E + n) for storing edges and Union-Find data structures
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
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
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return false;

    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[][]}
 */
var findCriticalAndPseudoCriticalEdges = function (n, edges) {
  // Step 1: Add original indices to edges before sorting
  const m = edges.length;
  const edgesWithIndex = edges.map(([u, v, w], idx) => [w, u, v, idx]);
  edgesWithIndex.sort((a, b) => a[0] - b[0]); // Sort by weight

  // Step 2: Helper function for Kruskal's algorithm
  const kruskal = (excludeEdge = null, includeEdge = null) => {
    /**
     * Run Kruskal's algorithm with optional edge exclusion/force-inclusion.
     * Returns [MST weight, whether all vertices are connected].
     */
    const dsu = new DSU(n);
    let weight = 0;
    let edgesUsed = 0;

    // If we need to force-include an edge, add it first
    if (includeEdge !== null) {
      const [w, u, v, idx] = edgesWithIndex[includeEdge];
      if (dsu.union(u, v)) {
        weight += w;
        edgesUsed++;
      }
    }

    // Process edges in sorted order
    for (let i = 0; i < m; i++) {
      // Skip excluded edge
      if (excludeEdge !== null && i === excludeEdge) continue;

      const [w, u, v, idx] = edgesWithIndex[i];
      // Add edge if it doesn't create a cycle
      if (dsu.union(u, v)) {
        weight += w;
        edgesUsed++;
      }
    }

    // Check if we connected all vertices (n-1 edges for spanning tree)
    return [weight, edgesUsed === n - 1];
  };

  // Step 3: Find original MST weight
  const [originalWeight] = kruskal();

  // Step 4: Test each edge
  const critical = [];
  const pseudoCritical = [];

  for (let i = 0; i < m; i++) {
    // Test if edge i is critical by excluding it
    const [weightWithout, connected] = kruskal(i);

    // If graph becomes disconnected or weight increases, edge is critical
    if (!connected || weightWithout > originalWeight) {
      critical.push(edgesWithIndex[i][3]); // Store original index
    } else {
      // Test if edge i is pseudo-critical by forcing it
      const [weightWith, connectedWith] = kruskal(null, i);
      // If we can build MST with same weight including this edge, it's pseudo-critical
      if (connectedWith && weightWith === originalWeight) {
        pseudoCritical.push(edgesWithIndex[i][3]);
      }
    }
  }

  return [critical, pseudoCritical];
};
```

```java
// Time: O(E^2 * α(n)) where α is inverse Ackermann function (near constant)
// Space: O(E + n) for storing edges and Union-Find data structures
class DSU {
    int[] parent;
    int[] rank;

    public DSU(int n) {
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
        int px = find(x);
        int py = find(y);
        if (px == py) return false;

        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
}

class Solution {
    public List<List<Integer>> findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
        // Step 1: Add original indices to edges before sorting
        int m = edges.length;
        int[][] edgesWithIndex = new int[m][4];
        for (int i = 0; i < m; i++) {
            edgesWithIndex[i][0] = edges[i][2]; // weight
            edgesWithIndex[i][1] = edges[i][0]; // u
            edgesWithIndex[i][2] = edges[i][1]; // v
            edgesWithIndex[i][3] = i;           // original index
        }

        // Sort by weight
        Arrays.sort(edgesWithIndex, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 2: Helper function for Kruskal's algorithm
        class KruskalResult {
            int weight;
            boolean connected;
            KruskalResult(int w, boolean c) { weight = w; connected = c; }
        }

        java.util.function.BiFunction<Integer, Integer, KruskalResult> kruskal =
            (Integer excludeEdge, Integer includeEdge) -> {
                DSU dsu = new DSU(n);
                int weight = 0;
                int edgesUsed = 0;

                // If we need to force-include an edge, add it first
                if (includeEdge != null) {
                    int[] edge = edgesWithIndex[includeEdge];
                    if (dsu.union(edge[1], edge[2])) {
                        weight += edge[0];
                        edgesUsed++;
                    }
                }

                // Process edges in sorted order
                for (int i = 0; i < m; i++) {
                    // Skip excluded edge
                    if (excludeEdge != null && i == excludeEdge) continue;

                    int[] edge = edgesWithIndex[i];
                    // Add edge if it doesn't create a cycle
                    if (dsu.union(edge[1], edge[2])) {
                        weight += edge[0];
                        edgesUsed++;
                    }
                }

                // Check if we connected all vertices (n-1 edges for spanning tree)
                return new KruskalResult(weight, edgesUsed == n - 1);
            };

        // Step 3: Find original MST weight
        KruskalResult original = kruskal.apply(null, null);
        int originalWeight = original.weight;

        // Step 4: Test each edge
        List<Integer> critical = new ArrayList<>();
        List<Integer> pseudoCritical = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            // Test if edge i is critical by excluding it
            KruskalResult without = kruskal.apply(i, null);

            // If graph becomes disconnected or weight increases, edge is critical
            if (!without.connected || without.weight > originalWeight) {
                critical.add(edgesWithIndex[i][3]);  // Store original index
            } else {
                // Test if edge i is pseudo-critical by forcing it
                KruskalResult with = kruskal.apply(null, i);
                // If we can build MST with same weight including this edge, it's pseudo-critical
                if (with.connected && with.weight == originalWeight) {
                    pseudoCritical.add(edgesWithIndex[i][3]);
                }
            }
        }

        List<List<Integer>> result = new ArrayList<>();
        result.add(critical);
        result.add(pseudoCritical);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(E² \* α(n)) where E is the number of edges, n is the number of vertices, and α is the inverse Ackermann function (effectively constant).

- We run Kruskal's algorithm once to find the original MST weight: O(E log E + E \* α(n))
- For each of the E edges, we run Kruskal's algorithm twice (exclusion test and inclusion test): O(2E _ (E log E + E _ α(n))) ≈ O(E² \* α(n))
- The dominant factor is O(E²) because we're running Kruskal's algorithm O(E) times

**Space Complexity:** O(E + n)

- O(E) to store the edges with their original indices
- O(n) for the Union-Find data structures (parent and rank arrays)
- O(E) for the output lists in the worst case

## Common Mistakes

1. **Forgetting to preserve original indices**: When sorting edges by weight, you must store the original index with each edge. Otherwise, you won't be able to return the correct indices in the result. Always add the index as part of the edge tuple before sorting.

2. **Incorrectly handling equal-weight edges**: When multiple edges have the same weight, there can be multiple MSTs with the same total weight. Our algorithm correctly handles this because we test both exclusion and inclusion. A common mistake is assuming edges with unique weights have unique classifications.

3. **Not checking connectivity in exclusion test**: When testing if an edge is critical by excluding it, you must check if the graph remains connected. If excluding the edge disconnects the graph, then the edge is definitely critical (a bridge in MST terms).

4. **Confusing critical and pseudo-critical logic**: Remember the exact definitions:
   - Critical: MUST be in EVERY MST → exclusion test fails (higher weight or disconnected)
   - Pseudo-critical: CAN be in SOME MST → inclusion test succeeds (same weight) AND exclusion test doesn't fail
     The order of tests matters: test for critical first, then pseudo-critical for the remaining edges.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Union-Find (Disjoint Set Union)**: Used in Kruskal's algorithm for MST construction. Similar patterns appear in:
   - LeetCode 684: "Redundant Connection" - Find edges that create cycles
   - LeetCode 547: "Number of Provinces" - Count connected components
   - LeetCode 1319: "Number of Operations to Make Network Connected" - Use DSU to determine connectivity

2. **Minimum Spanning Tree Algorithms**: Both Kruskal's and Prim's algorithms are common interview topics. This problem tests deep understanding of MST properties.

3. **Edge Classification in Graphs**: Similar problems involve classifying edges as tree edges, back edges, forward edges, or cross edges in DFS trees (for directed graphs).

4. **Optimization with Subroutine Reuse**: The pattern of writing a helper function (kruskal) and calling it multiple times with different parameters is common in optimization problems where you need to test "what if" scenarios.

## Key Takeaways

1. **MST properties are powerful tools**: The cycle property and cut property provide theoretical foundation for edge classification without enumerating all MSTs. Understanding these properties helps reason about edge importance.

2. **Union-Find is versatile**: Beyond just detecting cycles, DSU can be used to test connectivity, force inclusions/exclusions, and efficiently manage dynamic connectivity queries.

3. **Test edges through inclusion/exclusion**: When analyzing graph edges for importance, systematically test each edge by forcing it and excluding it. This two-test approach works for many graph property problems.

4. **Preserve indices when sorting**: Whenever you need to sort data but return results based on original positions, always store the original index alongside the data before sorting.

[Practice this problem on CodeJeet](/problem/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree)
