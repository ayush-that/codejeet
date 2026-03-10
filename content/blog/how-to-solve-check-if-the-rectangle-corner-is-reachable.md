---
title: "How to Solve Check if the Rectangle Corner Is Reachable — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check if the Rectangle Corner Is Reachable. Hard difficulty, 25.3% acceptance rate. Topics: Array, Math, Depth-First Search, Breadth-First Search, Union-Find."
date: "2026-07-07"
category: "dsa-patterns"
tags: ["check-if-the-rectangle-corner-is-reachable", "array", "math", "depth-first-search", "hard"]
---

# How to Solve "Check if the Rectangle Corner Is Reachable"

You need to determine whether you can travel from the origin (0,0) to the rectangle's top-right corner (xCorner, yCorner) without entering any of the given circles. The challenge is that circles create forbidden regions, and you must find if a continuous path exists around them. This is tricky because you can't simply check line intersections—you need to determine if circles block all possible paths, which becomes a connectivity problem in the space _between_ obstacles.

## Visual Walkthrough

Let's walk through an example:  
`xCorner = 10, yCorner = 8`  
`circles = [[3, 4, 2], [7, 5, 3]]`

We have two circles:

1. Circle A: center (3,4), radius 2
2. Circle B: center (7,5), radius 3

The rectangle spans from (0,0) to (10,8). We need to check if we can go from (0,0) to (10,8) without touching these circles.

**Key insight**: Instead of checking every possible path (impossible!), we can think about what _blocks_ a path:

- If a circle touches the left/bottom edges, it blocks paths starting from (0,0)
- If a circle touches the right/top edges, it blocks paths reaching (xCorner, yCorner)
- If two circles overlap or touch each other, they can form a connected barrier
- If circles connect from left/bottom to right/top, they create an impassable wall

In our example:

1. Circle A doesn't touch left/bottom edges (distance from (0,0) to circle edge is √(3²+4²)-2 ≈ 3.0)
2. Circle B doesn't touch right/top edges directly
3. Check if circles touch each other: distance between centers = √((7-3)²+(5-4)²) = √17 ≈ 4.12  
   Sum of radii = 2+3 = 5  
   Since 4.12 < 5, the circles overlap!

Now we check if this overlapping chain connects left/bottom to right/top:

- Neither circle touches left/bottom alone
- Neither circle touches right/top alone
- But together, they might form a barrier

We need to check if the overlapping circles collectively touch both boundaries. This is where graph connectivity comes in.

## Brute Force Approach

A naive approach might try to discretize the space and use BFS/DFS to find a path, but this fails because:

1. Coordinates can be large (up to 10⁹), making grid-based approaches impossible
2. Even with floating-point precision, checking infinite points is infeasible
3. The continuous nature means we need to reason about geometry, not just discrete points

What some candidates might try:

- Check if the straight line from (0,0) to (xCorner, yCorner) intersects any circle
- But this is insufficient! Even if the direct line is blocked, there might be alternative paths around the circles

The brute force would need to consider all possible curves around circles, which is computationally intractable. We need a smarter approach.

## Optimized Approach

The key insight is to transform this continuous geometry problem into a discrete graph connectivity problem:

1. **Represent circles as nodes** in a graph
2. **Add two special nodes**: "start" (representing left/bottom boundaries) and "end" (representing right/top boundaries)
3. **Create edges between nodes** when circles overlap or touch (distance between centers ≤ sum of radii)
4. **Connect start node** to any circle that touches or intersects the left or bottom edges
5. **Connect end node** to any circle that touches or intersects the right or top edges
6. **If there's a path from start to end** in this graph, then circles form a connected barrier blocking all paths

**Why this works**: If circles form a connected component that touches both the starting boundary (left/bottom) and the ending boundary (right/top), then this connected component acts as a wall separating the start from the destination. This is a consequence of the Jordan curve theorem in topology.

**Step-by-step reasoning**:

1. For each pair of circles, check if they intersect (distance ≤ r1 + r2)
2. For each circle, check if it blocks the starting area:
   - Touches left edge (xi ≤ ri)
   - Touches bottom edge (yi ≤ ri)
3. For each circle, check if it blocks the ending area:
   - Touches right edge (xi ≥ xCorner - ri)
   - Touches top edge (yi ≥ yCorner - ri)
4. Build graph and check connectivity from "blocked start" to "blocked end"

## Optimal Solution

We'll use Union-Find (Disjoint Set Union) for efficient connectivity checks. The algorithm:

1. Initialize DSU with n+2 nodes (n circles + start + end)
2. Union circles that intersect
3. Union start with circles touching left/bottom
4. Union end with circles touching right/top
5. Check if start and end are connected

<div class="code-group">

```python
# Time: O(n²) where n = len(circles) | Space: O(n)
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
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

def canReachCorner(xCorner: int, yCorner: int, circles: List[List[int]]) -> bool:
    n = len(circles)
    # DSU indices: 0 to n-1 for circles, n for start, n+1 for end
    dsu = DSU(n + 2)
    start = n
    end = n + 1

    # Check each pair of circles for intersection
    for i in range(n):
        xi, yi, ri = circles[i]

        # Check if circle touches start boundary (left or bottom)
        if xi <= ri or yi <= ri:
            dsu.union(i, start)

        # Check if circle touches end boundary (right or top)
        if xi >= xCorner - ri or yi >= yCorner - ri:
            dsu.union(i, end)

        # Check intersection with other circles
        for j in range(i + 1, n):
            xj, yj, rj = circles[j]
            # Calculate squared distance between centers
            dx = xi - xj
            dy = yi - yj
            dist_sq = dx * dx + dy * dy
            # Circles intersect if distance <= sum of radii
            # Compare squared distances to avoid sqrt
            if dist_sq <= (ri + rj) * (ri + rj):
                dsu.union(i, j)

    # If start and end are connected, path is blocked
    return dsu.find(start) != dsu.find(end)
```

```javascript
// Time: O(n²) where n = circles.length | Space: O(n)
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
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }
}

function canReachCorner(xCorner, yCorner, circles) {
  const n = circles.length;
  // DSU indices: 0 to n-1 for circles, n for start, n+1 for end
  const dsu = new DSU(n + 2);
  const start = n;
  const end = n + 1;

  // Check each pair of circles for intersection
  for (let i = 0; i < n; i++) {
    const [xi, yi, ri] = circles[i];

    // Check if circle touches start boundary (left or bottom)
    if (xi <= ri || yi <= ri) {
      dsu.union(i, start);
    }

    // Check if circle touches end boundary (right or top)
    if (xi >= xCorner - ri || yi >= yCorner - ri) {
      dsu.union(i, end);
    }

    // Check intersection with other circles
    for (let j = i + 1; j < n; j++) {
      const [xj, yj, rj] = circles[j];
      // Calculate squared distance between centers
      const dx = xi - xj;
      const dy = yi - yj;
      const distSq = dx * dx + dy * dy;
      // Circles intersect if distance <= sum of radii
      // Compare squared distances to avoid Math.sqrt
      if (distSq <= (ri + rj) * (ri + rj)) {
        dsu.union(i, j);
      }
    }
  }

  // If start and end are connected, path is blocked
  return dsu.find(start) !== dsu.find(end);
}
```

```java
// Time: O(n²) where n = circles.length | Space: O(n)
class DSU {
    private int[] parent;
    private int[] rank;

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

    public void union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}

public boolean canReachCorner(int xCorner, int yCorner, int[][] circles) {
    int n = circles.length;
    // DSU indices: 0 to n-1 for circles, n for start, n+1 for end
    DSU dsu = new DSU(n + 2);
    int start = n;
    int end = n + 1;

    // Check each pair of circles for intersection
    for (int i = 0; i < n; i++) {
        int xi = circles[i][0];
        int yi = circles[i][1];
        int ri = circles[i][2];

        // Check if circle touches start boundary (left or bottom)
        if (xi <= ri || yi <= ri) {
            dsu.union(i, start);
        }

        // Check if circle touches end boundary (right or top)
        if (xi >= xCorner - ri || yi >= yCorner - ri) {
            dsu.union(i, end);
        }

        // Check intersection with other circles
        for (int j = i + 1; j < n; j++) {
            int xj = circles[j][0];
            int yj = circles[j][1];
            int rj = circles[j][2];
            // Calculate squared distance between centers
            long dx = xi - xj;
            long dy = yi - yj;
            long distSq = dx * dx + dy * dy;
            // Circles intersect if distance <= sum of radii
            // Compare squared distances to avoid Math.sqrt
            long sumRadii = ri + rj;
            if (distSq <= sumRadii * sumRadii) {
                dsu.union(i, j);
            }
        }
    }

    // If start and end are connected, path is blocked
    return dsu.find(start) != dsu.find(end);
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) where n is the number of circles

- We check all pairs of circles: n(n-1)/2 = O(n²) comparisons
- Each DSU operation (find/union) is amortized O(α(n)) ≈ O(1) for practical n
- Boundary checks for each circle: O(n)

**Space Complexity**: O(n)

- DSU arrays: O(n) for parent and rank
- No additional significant storage

The O(n²) time might seem high, but constraints typically allow it (n ≤ 1000 gives ~500k operations). For larger n, we could optimize with spatial partitioning, but that's beyond interview scope.

## Common Mistakes

1. **Using Euclidean distance without squaring**: Calculating `Math.sqrt(dx² + dy²) ≤ r1 + r2` is correct but slower and introduces floating-point errors. Always compare squared distances: `dx² + dy² ≤ (r1 + r2)²`.

2. **Missing boundary conditions**: Forgetting that circles can touch edges at exactly the boundary. Use `≤` and `≥` not `<` and `>` when checking edge contact.

3. **Incorrect DSU initialization**: Creating DSU with n nodes instead of n+2 (for start/end dummy nodes). The start and end need to be in the same DSU structure.

4. **Overlooking circle-rectangle intersection logic**: A circle touches the left edge if `xi ≤ ri`, not `xi - ri ≤ 0`. Similarly for other edges with rectangle bounds.

## When You'll See This Pattern

This "geometry to graph connectivity" pattern appears in problems where continuous barriers create discrete connectivity:

1. **Number of Islands (Medium)**: Grid cells become nodes, adjacent land creates edges
2. **Regions Cut By Slashes (Medium)**: Small geometric elements form graph components
3. **Escape a Large Maze (Hard)**: Similar concept of blocked cells forming barriers
4. **Check if Point Is Reachable (Hard)**: The namesake problem uses GCD-based connectivity

The core idea is recognizing when a continuous blocking condition can be modeled as graph connectivity, then using Union-Find or BFS/DFS to check connectivity between "source" and "target" regions.

## Key Takeaways

1. **Transform continuous geometry to discrete graphs**: When dealing with obstacles/barriers in continuous space, check if they form connected components that block paths. Represent obstacles as nodes and connections as edges.

2. **Use DSU for dynamic connectivity**: When you only need to know if two nodes are connected (not the path), Union-Find is more efficient than BFS/DFS for incremental connections.

3. **Watch for precision issues**: With geometric problems, prefer integer comparisons when possible (compare squared distances instead of using sqrt).

Related problems: [Queries on Number of Points Inside a Circle](/problem/queries-on-number-of-points-inside-a-circle), [Check if Point Is Reachable](/problem/check-if-point-is-reachable)
