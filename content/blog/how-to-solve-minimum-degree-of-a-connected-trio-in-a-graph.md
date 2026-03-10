---
title: "How to Solve Minimum Degree of a Connected Trio in a Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Degree of a Connected Trio in a Graph. Hard difficulty, 44.3% acceptance rate. Topics: Graph Theory, Enumeration."
date: "2029-05-15"
category: "dsa-patterns"
tags: ["minimum-degree-of-a-connected-trio-in-a-graph", "graph-theory", "enumeration", "hard"]
---

# How to Solve Minimum Degree of a Connected Trio in a Graph

This problem asks us to find the minimum "degree" among all connected trios in an undirected graph. A connected trio is a set of three nodes where each node is directly connected to the other two (forming a triangle). The degree of a trio is defined as the total number of edges incident to its nodes, minus 6 (since the 3 edges within the triangle are counted twice when summing individual node degrees). What makes this problem tricky is that while the concept is straightforward, a naive approach would be far too slow for the constraints (n ≤ 400), requiring clever optimization through graph representation and careful enumeration.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider a graph with 5 nodes and these edges:

```
Edges: [[1,2],[1,3],[1,4],[2,3],[2,5],[3,4],[4,5]]
```

We're looking for triangles (connected trios) and need to compute each trio's degree. Let's find all triangles first:

1. **Triangle (1,2,3)**:
   - Node 1 connects to 2,3,4 → degree 3
   - Node 2 connects to 1,3,5 → degree 3
   - Node 3 connects to 1,2,4 → degree 3
   - Sum of degrees = 3+3+3 = 9
   - Subtract 6 (2×3 edges within triangle) = 3

2. **Triangle (1,3,4)**:
   - Node 1: degree 3
   - Node 3: degree 3
   - Node 4: degree 3 (connects to 1,3,5)
   - Sum = 9, minus 6 = 3

3. **Triangle (2,4,5)**:
   - Node 2: degree 3
   - Node 4: degree 3
   - Node 5: degree 2 (connects to 2,4)
   - Sum = 8, minus 6 = 2

The minimum degree among these trios is 2. Notice we had to check many node combinations to find triangles, and for each triangle, we needed to know each node's degree and their connections. This suggests we need efficient ways to check if three nodes form a triangle and to compute their external connections.

## Brute Force Approach

The most straightforward approach would be:

1. Check all possible combinations of 3 nodes (n choose 3)
2. For each combination, verify if they form a triangle (all three edges exist)
3. If they do, calculate the trio's degree by summing individual node degrees and subtracting 6

The problem with this approach is its time complexity: O(n³) to check all triples, and for n ≤ 400, that's 400³ = 64 million operations, which is too slow. Additionally, checking if edges exist would require either O(1) lookups with an adjacency matrix (O(n²) space) or O(d) lookups with adjacency lists, where d is the average degree.

A naive candidate might try to optimize by only checking nodes with high degree first, but this doesn't guarantee finding the minimum degree trio, and the worst-case complexity remains O(n³).

## Optimized Approach

The key insight is that we don't need to check all possible triples of nodes—we only need to check pairs of nodes that share a common neighbor. Here's the step-by-step reasoning:

1. **Represent the graph efficiently**: Use an adjacency list for compact storage and an adjacency matrix or set for O(1) edge existence checks.

2. **Find triangles efficiently**: Instead of checking all node triples, for each edge (u,v), check all their common neighbors w. If w is connected to both u and v, then (u,v,w) forms a triangle. This approach only examines actually connected structures rather than all possible combinations.

3. **Compute trio degree efficiently**: For a triangle (u,v,w), we need to count edges going outside the triangle. The formula `degree[u] + degree[v] + degree[w] - 6` works because:
   - Each node's degree counts all its edges
   - The three edges within the triangle are counted twice (once for each endpoint)
   - So we subtract 2×3 = 6 to get only external edges

4. **Optimization**: Sort nodes by degree and only check edges where both endpoints have degree ≥ current minimum degree found. If we find a trio with degree D, we can skip any edge where degree[u] + degree[v] - 4 ≥ D (since even with a third node of degree 0, the trio degree would be at least D).

The time complexity becomes O(E × d_max) where d_max is the maximum degree, which is much better than O(n³) for sparse graphs.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(E * d_max) where d_max is maximum degree, worst case O(n^3) for dense graphs
# Space: O(n^2) for adjacency matrix, O(E) for adjacency list
def minTrioDegree(n, edges):
    # Step 1: Build adjacency matrix for O(1) edge checks
    # We use a boolean matrix to quickly check if two nodes are connected
    adj_matrix = [[False] * (n + 1) for _ in range(n + 1)]

    # Step 2: Build adjacency list for efficient neighbor iteration
    # We'll need to iterate through neighbors when looking for triangles
    adj_list = [[] for _ in range(n + 1)]

    # Step 3: Store degree of each node for quick access
    # The degree is just the number of edges incident to the node
    degree = [0] * (n + 1)

    # Step 4: Populate data structures from edges
    for u, v in edges:
        adj_matrix[u][v] = True
        adj_matrix[v][u] = True
        adj_list[u].append(v)
        adj_list[v].append(u)
        degree[u] += 1
        degree[v] += 1

    # Step 5: Initialize answer to a large value
    # We'll update this whenever we find a trio with smaller degree
    min_degree = float('inf')

    # Step 6: Find all triangles and compute their degrees
    # We iterate through all edges (u,v) and find common neighbors w
    for u in range(1, n + 1):
        for v in adj_list[u]:
            # Only check each edge once (u < v)
            if u >= v:
                continue

            # Check all common neighbors w of u and v
            for w in adj_list[u]:
                # Ensure w is different from u and v, and connected to both
                if w <= v:
                    continue
                if adj_matrix[v][w]:
                    # Found a triangle (u, v, w)
                    # Compute trio degree: sum of degrees minus 6
                    trio_degree = degree[u] + degree[v] + degree[w] - 6
                    min_degree = min(min_degree, trio_degree)

    # Step 7: Return result (or -1 if no triangles found)
    return min_degree if min_degree != float('inf') else -1
```

```javascript
// Time: O(E * d_max) where d_max is maximum degree
// Space: O(n^2) for adjacency matrix, O(E) for adjacency list
function minTrioDegree(n, edges) {
  // Step 1: Build adjacency matrix for O(1) edge checks
  const adjMatrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(false));

  // Step 2: Build adjacency list for efficient neighbor iteration
  const adjList = Array.from({ length: n + 1 }, () => []);

  // Step 3: Store degree of each node
  const degree = Array(n + 1).fill(0);

  // Step 4: Populate data structures
  for (const [u, v] of edges) {
    adjMatrix[u][v] = true;
    adjMatrix[v][u] = true;
    adjList[u].push(v);
    adjList[v].push(u);
    degree[u]++;
    degree[v]++;
  }

  // Step 5: Initialize answer
  let minDegree = Infinity;

  // Step 6: Find all triangles
  for (let u = 1; u <= n; u++) {
    for (const v of adjList[u]) {
      // Check each edge only once
      if (u >= v) continue;

      // Check common neighbors
      for (const w of adjList[u]) {
        if (w <= v) continue;
        if (adjMatrix[v][w]) {
          // Found triangle (u, v, w)
          const trioDegree = degree[u] + degree[v] + degree[w] - 6;
          minDegree = Math.min(minDegree, trioDegree);
        }
      }
    }
  }

  // Step 7: Return result
  return minDegree !== Infinity ? minDegree : -1;
}
```

```java
// Time: O(E * d_max) where d_max is maximum degree
// Space: O(n^2) for adjacency matrix, O(E) for adjacency list
public int minTrioDegree(int n, int[][] edges) {
    // Step 1: Build adjacency matrix
    boolean[][] adjMatrix = new boolean[n + 1][n + 1];

    // Step 2: Build adjacency list
    List<Integer>[] adjList = new ArrayList[n + 1];
    for (int i = 0; i <= n; i++) {
        adjList[i] = new ArrayList<>();
    }

    // Step 3: Store degree of each node
    int[] degree = new int[n + 1];

    // Step 4: Populate data structures
    for (int[] edge : edges) {
        int u = edge[0];
        int v = edge[1];
        adjMatrix[u][v] = true;
        adjMatrix[v][u] = true;
        adjList[u].add(v);
        adjList[v].add(u);
        degree[u]++;
        degree[v]++;
    }

    // Step 5: Initialize answer
    int minDegree = Integer.MAX_VALUE;

    // Step 6: Find all triangles
    for (int u = 1; u <= n; u++) {
        for (int v : adjList[u]) {
            // Check each edge only once
            if (u >= v) continue;

            // Check common neighbors
            for (int w : adjList[u]) {
                if (w <= v) continue;
                if (adjMatrix[v][w]) {
                    // Found triangle (u, v, w)
                    int trioDegree = degree[u] + degree[v] + degree[w] - 6;
                    minDegree = Math.min(minDegree, trioDegree);
                }
            }
        }
    }

    // Step 7: Return result
    return minDegree != Integer.MAX_VALUE ? minDegree : -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(E × d_max) in practice, where d_max is the maximum degree of any node. In the worst case for dense graphs, this becomes O(n³). Here's why:

- We iterate through all edges (or more precisely, through all nodes and their neighbors)
- For each edge (u,v), we iterate through neighbors of u to find common neighbors w
- In the worst case, a node could have degree n-1, leading to O(n) neighbors to check per edge
- With E = O(n²) in dense graphs, this gives O(n³)

**Space Complexity**: O(n²) for the adjacency matrix. We could use a hash set for edge existence checks to reduce this to O(E), but the adjacency matrix gives us O(1) lookups which is crucial for performance. The adjacency list uses O(E) space, and the degree array uses O(n) space.

## Common Mistakes

1. **Checking all node triples O(n³)**: This is the most common mistake. Candidates try to iterate through all combinations of 3 nodes, which is too slow for n=400. Remember: only check actually connected structures by looking for common neighbors.

2. **Incorrect degree calculation**: Forgetting to subtract 6 from the sum of degrees. Each edge within the triangle is counted twice (once for each endpoint), so we need to subtract 2×3=6 to get only external edges.

3. **Double counting triangles**: When iterating through edges and common neighbors, ensure you use consistent ordering (u < v < w) to count each triangle only once. The condition `if (u >= v) continue` and `if (w <= v) continue` ensures this.

4. **Using only adjacency lists without fast edge checks**: Checking if v and w are connected using only adjacency lists would require scanning the neighbor list, adding O(d) time. The adjacency matrix gives O(1) checks, which is essential for performance.

## When You'll See This Pattern

This triangle-finding pattern appears in several graph problems:

1. **Number of Triangles in Undirected Graph**: Count all triangles in a graph using similar common-neighbor enumeration.

2. **Find All Triangles in a Graph**: Similar to our problem but returning all triangles instead of computing degrees.

3. **Friend Circles / Social Network Analysis**: Triangles often represent "friends of friends" connections in social networks.

The core technique—finding common neighbors of connected pairs—is useful whenever you need to analyze local structures (triangles, squares, etc.) in graphs efficiently.

## Key Takeaways

1. **Optimize enumeration by considering actual connections**: Instead of checking all possible combinations, only check structures that could potentially exist (like checking common neighbors of edges to find triangles).

2. **Use complementary data structures**: An adjacency list is great for iteration, while an adjacency matrix or hash set is great for existence checks. Using both gives you the best of both worlds.

3. **Understand the problem's constraints**: With n ≤ 400, O(n³) is borderline but might pass with optimizations. The common-neighbor approach is O(E × d_max), which is much better for sparse graphs.

Related problems: [Add Edges to Make Degrees of All Nodes Even](/problem/add-edges-to-make-degrees-of-all-nodes-even)
