---
title: "How to Solve Min Cost to Connect All Points — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Min Cost to Connect All Points. Medium difficulty, 70.4% acceptance rate. Topics: Array, Union-Find, Graph Theory, Minimum Spanning Tree."
date: "2027-06-11"
category: "dsa-patterns"
tags: ["min-cost-to-connect-all-points", "array", "union-find", "graph-theory", "medium"]
---

# How to Solve Min Cost to Connect All Points

You need to connect all points on a 2D plane with minimum total cost, where the cost between any two points is their Manhattan distance. This is essentially finding the **Minimum Spanning Tree (MST)** of a complete graph where every point is connected to every other point. The challenge is that a complete graph with n points has O(n²) edges, so we need efficient MST algorithms that don't require explicitly storing all edges.

## Visual Walkthrough

Let's trace through a small example: `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]`

We need to connect all 5 points with minimum total Manhattan distance cost. The Manhattan distance between two points is simply the sum of the absolute differences in their x and y coordinates.

**Step-by-step MST construction using Prim's Algorithm:**

1. Start at point [0,0] (cost = 0)
2. From [0,0], the closest point is [2,2] with distance |0-2| + |0-2| = 4
3. Now connected points: {[0,0], [2,2]}. From these, the closest unconnected point is [5,2] with distance min(4+? from [2,2], 0+? from [0,0]) = |2-5| + |2-2| = 3 from [2,2]
4. Connected: {[0,0], [2,2], [5,2]}. Closest unconnected point is [7,0] with distance min(3+? from [5,2], 4+? from [2,2], 0+? from [0,0]) = |5-7| + |2-0| = 4 from [5,2]
5. Connected: {[0,0], [2,2], [5,2], [7,0]}. Last point [3,10] connects to [0,0] with distance |0-3| + |0-10| = 13

Total cost = 4 + 3 + 4 + 13 = 24

## Brute Force Approach

A naive approach would be to:

1. Generate all possible edges between points (n\*(n-1)/2 edges)
2. Sort edges by weight
3. Use Kruskal's algorithm with Union-Find to build MST

The problem with this approach is the O(n²) space needed to store all edges. For n=1000 points, that's nearly 500,000 edges. While this would technically work (O(n² log n) time), it's inefficient in both time and space.

<div class="code-group">

```python
# Time: O(n² log n) | Space: O(n²)
def minCostConnectPointsBrute(points):
    n = len(points)
    if n <= 1:
        return 0

    # Generate all edges - O(n²) space
    edges = []
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i+1, n):
            x2, y2 = points[j]
            cost = abs(x1 - x2) + abs(y1 - y2)
            edges.append((cost, i, j))

    # Sort edges - O(n² log n) time
    edges.sort()

    # Union-Find for Kruskal's algorithm
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        rootX, rootY = find(x), find(y)
        if rootX == rootY:
            return False
        if rank[rootX] < rank[rootY]:
            parent[rootX] = rootY
        elif rank[rootX] > rank[rootY]:
            parent[rootY] = rootX
        else:
            parent[rootY] = rootX
            rank[rootX] += 1
        return True

    # Build MST
    total_cost = 0
    edges_used = 0

    for cost, u, v in edges:
        if union(u, v):
            total_cost += cost
            edges_used += 1
            if edges_used == n - 1:
                break

    return total_cost
```

```javascript
// Time: O(n² log n) | Space: O(n²)
function minCostConnectPointsBrute(points) {
  const n = points.length;
  if (n <= 1) return 0;

  // Generate all edges
  const edges = [];
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = points[j];
      const cost = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      edges.push([cost, i, j]);
    }
  }

  // Sort edges by cost
  edges.sort((a, b) => a[0] - b[0]);

  // Union-Find implementation
  const parent = Array(n)
    .fill()
    .map((_, i) => i);
  const rank = Array(n).fill(0);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) return false;

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

  // Build MST
  let totalCost = 0;
  let edgesUsed = 0;

  for (const [cost, u, v] of edges) {
    if (union(u, v)) {
      totalCost += cost;
      edgesUsed++;
      if (edgesUsed === n - 1) break;
    }
  }

  return totalCost;
}
```

```java
// Time: O(n² log n) | Space: O(n²)
import java.util.*;

public class Solution {
    public int minCostConnectPointsBrute(int[][] points) {
        int n = points.length;
        if (n <= 1) return 0;

        // Generate all edges
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int cost = Math.abs(points[i][0] - points[j][0]) +
                          Math.abs(points[i][1] - points[j][1]);
                edges.add(new int[]{cost, i, j});
            }
        }

        // Sort edges by cost
        Collections.sort(edges, (a, b) -> a[0] - b[0]);

        // Union-Find
        int[] parent = new int[n];
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int totalCost = 0;
        int edgesUsed = 0;

        for (int[] edge : edges) {
            int cost = edge[0];
            int u = edge[1];
            int v = edge[2];

            if (union(u, v, parent, rank)) {
                totalCost += cost;
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }

        return totalCost;
    }

    private int find(int x, int[] parent) {
        if (parent[x] != x) {
            parent[x] = find(parent[x], parent);
        }
        return parent[x];
    }

    private boolean union(int x, int y, int[] parent, int[] rank) {
        int rootX = find(x, parent);
        int rootY = find(y, parent);
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
}
```

</div>

## Optimized Approach

The key insight is that we don't need to store all edges explicitly. We can use **Prim's Algorithm** with a min-heap to build the MST incrementally:

1. Start from any point (say point 0)
2. Maintain a min-heap of edges from the current MST to unvisited points
3. At each step, take the smallest edge from the heap, add its endpoint to MST
4. Add all edges from this new point to unvisited points into the heap
5. Repeat until all points are connected

This gives us O(n² log n) time but only O(n) space, since we only store edges from the current MST frontier.

Even better: We can optimize further by maintaining an array `minDist` that tracks the minimum distance from each unvisited point to the MST. This gives us O(n²) time with O(n) space using the optimized Prim's algorithm (similar to Dijkstra's).

## Optimal Solution

Here's the optimized Prim's algorithm implementation:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def minCostConnectPoints(points):
    n = len(points)
    if n <= 1:
        return 0

    # minDist[i] = minimum distance from point i to the MST
    min_dist = [float('inf')] * n
    min_dist[0] = 0  # Start from point 0

    # visited[i] = whether point i is in the MST
    visited = [False] * n

    total_cost = 0

    # We need to add n points to the MST
    for _ in range(n):
        # Find the unvisited point with minimum distance to MST
        current_point = -1
        current_min = float('inf')

        for i in range(n):
            if not visited[i] and min_dist[i] < current_min:
                current_min = min_dist[i]
                current_point = i

        # Add this point to MST
        visited[current_point] = True
        total_cost += current_min

        # Update minimum distances for all unvisited points
        x1, y1 = points[current_point]
        for i in range(n):
            if not visited[i]:
                x2, y2 = points[i]
                dist = abs(x1 - x2) + abs(y1 - y2)
                if dist < min_dist[i]:
                    min_dist[i] = dist

    return total_cost
```

```javascript
// Time: O(n²) | Space: O(n)
function minCostConnectPoints(points) {
  const n = points.length;
  if (n <= 1) return 0;

  // minDist[i] = minimum distance from point i to the MST
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0; // Start from point 0

  // visited[i] = whether point i is in the MST
  const visited = new Array(n).fill(false);

  let totalCost = 0;

  // We need to add n points to the MST
  for (let count = 0; count < n; count++) {
    // Find the unvisited point with minimum distance to MST
    let currentPoint = -1;
    let currentMin = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited[i] && minDist[i] < currentMin) {
        currentMin = minDist[i];
        currentPoint = i;
      }
    }

    // Add this point to MST
    visited[currentPoint] = true;
    totalCost += currentMin;

    // Update minimum distances for all unvisited points
    const [x1, y1] = points[currentPoint];
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const [x2, y2] = points[i];
        const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
        if (dist < minDist[i]) {
          minDist[i] = dist;
        }
      }
    }
  }

  return totalCost;
}
```

```java
// Time: O(n²) | Space: O(n)
public class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        if (n <= 1) return 0;

        // minDist[i] = minimum distance from point i to the MST
        int[] minDist = new int[n];
        boolean[] visited = new boolean[n];

        // Initialize all distances to infinity
        for (int i = 0; i < n; i++) {
            minDist[i] = Integer.MAX_VALUE;
        }
        minDist[0] = 0;  // Start from point 0

        int totalCost = 0;

        // We need to add n points to the MST
        for (int count = 0; count < n; count++) {
            // Find the unvisited point with minimum distance to MST
            int currentPoint = -1;
            int currentMin = Integer.MAX_VALUE;

            for (int i = 0; i < n; i++) {
                if (!visited[i] && minDist[i] < currentMin) {
                    currentMin = minDist[i];
                    currentPoint = i;
                }
            }

            // Add this point to MST
            visited[currentPoint] = true;
            totalCost += currentMin;

            // Update minimum distances for all unvisited points
            int x1 = points[currentPoint][0];
            int y1 = points[currentPoint][1];

            for (int i = 0; i < n; i++) {
                if (!visited[i]) {
                    int x2 = points[i][0];
                    int y2 = points[i][1];
                    int dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
                    if (dist < minDist[i]) {
                        minDist[i] = dist;
                    }
                }
            }
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have an outer loop that runs n times (adding n points to MST)
- Each iteration finds the minimum unvisited point (O(n)) and updates distances to all unvisited points (O(n))
- Total: O(n × n) = O(n²)

**Space Complexity: O(n)**

- We store two arrays of size n: `minDist` and `visited`
- No adjacency matrix or edge list needed

This is optimal for dense graphs (which this complete graph is) since any MST algorithm must consider Ω(n²) distances in the worst case.

## Common Mistakes

1. **Using Euclidean distance instead of Manhattan distance**: The problem clearly states Manhattan distance (|x1-x2| + |y1-y2|), not Euclidean distance (√((x1-x2)² + (y1-y2)²)). Always read the problem statement carefully.

2. **Forgetting to handle the n=0 or n=1 case**: When there are 0 or 1 points, the cost should be 0. Always check for edge cases at the beginning of your solution.

3. **Incorrect heap implementation with Prim's**: When using a heap-based Prim's, candidates often push duplicate edges or forget to mark nodes as visited before processing their edges, leading to infinite loops or incorrect costs.

4. **Not updating distances efficiently**: In the optimized Prim's, after adding a new point to MST, you must update `minDist` for all unvisited points with the minimum of their current distance and distance to the newly added point.

## When You'll See This Pattern

This Minimum Spanning Tree pattern appears in problems where you need to connect nodes with minimum total cost:

1. **Network Connection Problems**: Connecting cities with minimum cable length, connecting servers with minimum network cable cost.
2. **Clustering Problems**: Grouping points into clusters while minimizing inter-cluster distances.
3. **Path Optimization**: Finding the most efficient way to visit all locations (though MST gives a tree, not necessarily a path).

**Related LeetCode Problems:**

- **1584. Min Cost to Connect All Points** (this problem)
- **1135. Connecting Cities With Minimum Cost** - Almost identical but with given edges instead of complete graph
- **1168. Optimize Water Distribution in a Village** - MST with an extra "virtual node" trick
- **1489. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree** - Advanced MST problem

## Key Takeaways

1. **Recognize MST problems**: When you need to connect all nodes with minimum total edge weight, think Minimum Spanning Tree.
2. **Choose the right MST algorithm**: For dense graphs (many edges), use Prim's O(n²) algorithm. For sparse graphs, use Kruskal's O(E log E) with Union-Find.
3. **Manhattan distance trick**: In grid/coordinate problems, Manhattan distance often leads to simpler calculations than Euclidean distance.

Related problems: [Minimum Number of Lines to Cover Points](/problem/minimum-number-of-lines-to-cover-points)
