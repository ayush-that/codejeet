---
title: "How to Solve Detonate the Maximum Bombs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Detonate the Maximum Bombs. Medium difficulty, 49.9% acceptance rate. Topics: Array, Math, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2026-05-06"
category: "dsa-patterns"
tags: ["detonate-the-maximum-bombs", "array", "math", "depth-first-search", "medium"]
---

# How to Solve Detonate the Maximum Bombs

This problem asks: given a list of bombs with coordinates and blast radii, if one bomb detonates, it can trigger any bomb within its blast radius. We need to find the **maximum number of bombs** that can be detonated if we choose the optimal starting bomb. The tricky part is that detonation chains can propagate through the grid, creating a directed graph where each bomb can trigger others within its radius, but not necessarily vice versa.

## Visual Walkthrough

Let's walk through a small example: `bombs = [[1,2,3], [2,3,1], [3,4,2]]`

**Bomb 0** at (1,2) with radius 3:

- Distance to bomb 1: √((2-1)² + (3-2)²) = √(1+1) = √2 ≈ 1.41 ≤ 3 → can trigger bomb 1
- Distance to bomb 2: √((3-1)² + (4-2)²) = √(4+4) = √8 ≈ 2.83 ≤ 3 → can trigger bomb 2
- Starting from bomb 0, we can detonate all 3 bombs.

**Bomb 1** at (2,3) with radius 1:

- Distance to bomb 0: √2 ≈ 1.41 > 1 → cannot trigger bomb 0
- Distance to bomb 2: √((3-2)² + (4-3)²) = √(1+1) = √2 ≈ 1.41 > 1 → cannot trigger bomb 2
- Starting from bomb 1, only bomb 1 detonates.

**Bomb 2** at (3,4) with radius 2:

- Distance to bomb 0: √8 ≈ 2.83 > 2 → cannot trigger bomb 0
- Distance to bomb 1: √2 ≈ 1.41 ≤ 2 → can trigger bomb 1
- Starting from bomb 2: bomb 2 triggers bomb 1, but bomb 1's radius is too small to trigger bomb 0 → only bombs 2 and 1 detonate.

The maximum is 3 bombs by starting with bomb 0. This shows we need to consider the **directed nature** of the relationships: bomb A can trigger bomb B doesn't mean bomb B can trigger bomb A.

## Brute Force Approach

A naive approach would be to simulate all possible detonation sequences for each starting bomb. For each bomb, we'd recursively explore all bombs it can trigger, then all bombs those can trigger, and so on. We'd need to track visited bombs to avoid cycles.

The brute force code would look like this:

```python
def maximumDetonation(bombs):
    n = len(bombs)
    max_count = 0

    for i in range(n):
        visited = set()
        stack = [i]
        visited.add(i)

        while stack:
            curr = stack.pop()
            x1, y1, r1 = bombs[curr]

            for j in range(n):
                if j not in visited:
                    x2, y2, _ = bombs[j]
                    distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
                    if distance <= r1:
                        visited.add(j)
                        stack.append(j)

        max_count = max(max_count, len(visited))

    return max_count
```

**Why this is inefficient:** This approach is O(n³) in the worst case because for each of n starting bombs, we check all n other bombs, and we might do this repeatedly in the BFS/DFS. With n up to 100, this could be 1,000,000 operations, which might pass but isn't optimal. More importantly, we're recalculating distances repeatedly.

## Optimized Approach

The key insight is to **precompute the adjacency list** once. For each bomb, we calculate which other bombs are within its blast radius and store these relationships in a graph. Then we perform DFS/BFS from each bomb to count reachable bombs.

**Step-by-step reasoning:**

1. **Graph Construction:** Create a directed graph where each node is a bomb, and there's an edge from bomb i to bomb j if bomb i can detonate bomb j (distance ≤ radius of bomb i).
2. **Avoid Floating Point:** Use squared distances to avoid precision issues: `(x2-x1)² + (y2-y1)² ≤ r1²`
3. **DFS/BFS Traversal:** For each bomb as starting point, perform DFS/BFS to count all reachable bombs in the directed graph.
4. **Track Maximum:** Keep track of the maximum count across all starting bombs.

This reduces repeated distance calculations and gives us O(n²) time for graph construction plus O(n²) for DFS in worst case (dense graph).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^3) worst case, O(n^2) average | Space: O(n^2) for adjacency list
def maximumDetonation(bombs):
    n = len(bombs)

    # Step 1: Build adjacency list - directed graph
    # graph[i] = list of bombs that bomb i can detonate
    graph = [[] for _ in range(n)]

    for i in range(n):
        x1, y1, r1 = bombs[i]
        for j in range(n):
            if i == j:
                continue  # Skip self

            x2, y2, _ = bombs[j]
            # Calculate squared distance
            dx = x2 - x1
            dy = y2 - y1
            distance_squared = dx * dx + dy * dy

            # Check if bomb i can detonate bomb j (distance ≤ radius)
            if distance_squared <= r1 * r1:
                graph[i].append(j)

    # Step 2: DFS function to count reachable bombs from a starting bomb
    def dfs(start, visited):
        stack = [start]
        visited[start] = True
        count = 1  # Count the starting bomb

        while stack:
            curr = stack.pop()
            # Visit all neighbors (bombs that current bomb can detonate)
            for neighbor in graph[curr]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    stack.append(neighbor)
                    count += 1

        return count

    # Step 3: Try each bomb as starting point and track maximum
    max_detonated = 0

    for i in range(n):
        # Reset visited array for each starting bomb
        visited = [False] * n
        detonated = dfs(i, visited)
        max_detonated = max(max_detonated, detonated)

        # Early exit: if we can detonate all bombs, we're done
        if max_detonated == n:
            break

    return max_detonated
```

```javascript
// Time: O(n^3) worst case, O(n^2) average | Space: O(n^2) for adjacency list
function maximumDetonation(bombs) {
  const n = bombs.length;

  // Step 1: Build adjacency list - directed graph
  // graph[i] = array of bombs that bomb i can detonate
  const graph = Array.from({ length: n }, () => []);

  for (let i = 0; i < n; i++) {
    const [x1, y1, r1] = bombs[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Skip self

      const [x2, y2] = bombs[j];
      // Calculate squared distance
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distanceSquared = dx * dx + dy * dy;

      // Check if bomb i can detonate bomb j (distance ≤ radius)
      if (distanceSquared <= r1 * r1) {
        graph[i].push(j);
      }
    }
  }

  // Step 2: DFS function to count reachable bombs from a starting bomb
  function dfs(start, visited) {
    const stack = [start];
    visited[start] = true;
    let count = 1; // Count the starting bomb

    while (stack.length > 0) {
      const curr = stack.pop();
      // Visit all neighbors (bombs that current bomb can detonate)
      for (const neighbor of graph[curr]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
          count++;
        }
      }
    }

    return count;
  }

  // Step 3: Try each bomb as starting point and track maximum
  let maxDetonated = 0;

  for (let i = 0; i < n; i++) {
    // Reset visited array for each starting bomb
    const visited = new Array(n).fill(false);
    const detonated = dfs(i, visited);
    maxDetonated = Math.max(maxDetonated, detonated);

    // Early exit: if we can detonate all bombs, we're done
    if (maxDetonated === n) break;
  }

  return maxDetonated;
}
```

```java
// Time: O(n^3) worst case, O(n^2) average | Space: O(n^2) for adjacency list
class Solution {
    public int maximumDetonation(int[][] bombs) {
        int n = bombs.length;

        // Step 1: Build adjacency list - directed graph
        // graph[i] = list of bombs that bomb i can detonate
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int i = 0; i < n; i++) {
            long x1 = bombs[i][0], y1 = bombs[i][1], r1 = bombs[i][2];
            for (int j = 0; j < n; j++) {
                if (i == j) continue;  // Skip self

                long x2 = bombs[j][0], y2 = bombs[j][1];
                // Calculate squared distance
                long dx = x2 - x1;
                long dy = y2 - y1;
                long distanceSquared = dx * dx + dy * dy;

                // Check if bomb i can detonate bomb j (distance ≤ radius)
                if (distanceSquared <= r1 * r1) {
                    graph[i].add(j);
                }
            }
        }

        // Step 2: DFS function to count reachable bombs from a starting bomb
        int maxDetonated = 0;

        for (int i = 0; i < n; i++) {
            // Reset visited array for each starting bomb
            boolean[] visited = new boolean[n];
            int detonated = dfs(i, graph, visited);
            maxDetonated = Math.max(maxDetonated, detonated);

            // Early exit: if we can detonate all bombs, we're done
            if (maxDetonated == n) break;
        }

        return maxDetonated;
    }

    private int dfs(int start, List<Integer>[] graph, boolean[] visited) {
        Stack<Integer> stack = new Stack<>();
        stack.push(start);
        visited[start] = true;
        int count = 1;  // Count the starting bomb

        while (!stack.isEmpty()) {
            int curr = stack.pop();
            // Visit all neighbors (bombs that current bomb can detonate)
            for (int neighbor : graph[curr]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³) in the worst case, O(n²) on average.

- Graph construction: O(n²) - we compare each pair of bombs once
- DFS from each bomb: O(n²) in worst case (dense graph where each bomb connects to all others)
- Total: O(n² + n²) = O(n²) but technically O(n³) in worst dense case

**Space Complexity:** O(n²)

- Adjacency list: O(n²) in worst case (each bomb connects to all others)
- Visited array: O(n)
- DFS stack: O(n) in worst case

## Common Mistakes

1. **Using floating point for distance comparison:** Calculating √((x2-x1)² + (y2-y1)²) and comparing to radius can cause precision errors. Always use squared distances: (x2-x1)² + (y2-y1)² ≤ r².

2. **Assuming symmetry in relationships:** Just because bomb A can detonate bomb B doesn't mean bomb B can detonate bomb A. This is a **directed graph**, not undirected.

3. **Forgetting to reset visited array:** You must create a new visited array for each starting bomb. Reusing the same array without resetting will give incorrect results.

4. **Integer overflow with large coordinates:** When coordinates are large (up to 10⁵), squaring them can exceed 32-bit integer limits. Use 64-bit integers (long in Java, normal int in Python handles big integers).

## When You'll See This Pattern

This problem combines **graph construction** with **reachability analysis**, similar to:

1. **Number of Provinces (LeetCode 547):** Also builds a graph (undirected) and counts connected components through DFS/BFS.
2. **Max Area of Island (LeetCode 695):** Uses DFS/BFS to explore connected regions in a grid.
3. **Course Schedule (LeetCode 207):** Involves directed graph traversal to check for cycles and reachability.

The pattern is: when you have entities with relationships defined by some condition (distance, adjacency, dependency), build a graph and use traversal algorithms to analyze connectivity.

## Key Takeaways

1. **Graph modeling is powerful:** Many problems that involve relationships between entities can be modeled as graphs. The key is identifying what constitutes an "edge" between "nodes."

2. **Directed vs undirected matters:** Pay attention to whether relationships are symmetric (A→B implies B→A) or asymmetric (A→B doesn't imply B→A).

3. **Precomputation saves time:** Building an adjacency list upfront avoids recalculating relationships during traversal, especially when the condition (like distance calculation) is expensive.

4. **Early termination helps:** If you find a solution that detonates all bombs, you can stop early since that's the maximum possible.

Related problems: [Minesweeper](/problem/minesweeper), [Number of Provinces](/problem/number-of-provinces), [Max Area of Island](/problem/max-area-of-island)
