---
title: "How to Solve Number of Provinces — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Provinces. Medium difficulty, 70.0% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2026-07-17"
category: "dsa-patterns"
tags: ["number-of-provinces", "depth-first-search", "breadth-first-search", "union-find", "medium"]
---

# How to Solve Number of Provinces

This problem asks us to find the number of connected components in an undirected graph represented by an adjacency matrix. The tricky part is recognizing that we're dealing with an **undirected graph** where connections are transitive (if A connects to B and B connects to C, then A connects to C), and we need to count distinct groups of connected cities. The adjacency matrix representation can be confusing because it's dense and symmetric, but it contains all the information we need.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have 4 cities with this adjacency matrix:

```
isConnected = [
    [1, 1, 0, 0],  # City 0 connects to itself and city 1
    [1, 1, 0, 0],  # City 1 connects to itself and city 0
    [0, 0, 1, 1],  # City 2 connects to itself and city 3
    [0, 0, 1, 1]   # City 3 connects to itself and city 2
]
```

Visually, we have two groups:

- Group 1: Cities 0 and 1 (connected to each other)
- Group 2: Cities 2 and 3 (connected to each other)

Here's how we'd discover this step by step:

1. Start with city 0. Mark it as visited.
2. From city 0, we see it connects to city 1 (since `isConnected[0][1] = 1`).
3. Visit city 1, mark it visited.
4. From city 1, we see it connects back to city 0 (already visited).
5. We've exhausted all connections from city 0's group. That's 1 province.
6. Move to city 2 (not visited yet). Mark it visited.
7. From city 2, we see it connects to city 3.
8. Visit city 3, mark it visited.
9. From city 3, we see it connects back to city 2 (already visited).
10. We've exhausted all connections from city 2's group. That's another province.
11. All cities visited. Total provinces = 2.

The key insight: Each time we find an unvisited city, we've discovered a new province, and we need to explore all cities connected to it (directly or indirectly).

## Brute Force Approach

A naive approach might try to examine every possible path between cities, but that quickly becomes exponential. Another brute force idea: for each city, check all other cities to see if they're connected, then check connections of those cities, and so on. This essentially becomes what we'll do in the optimized approach, but implemented inefficiently.

The real "brute force" here would be to treat the matrix as-is and try to manually trace connections without any systematic traversal. This would lead to:

- Missing indirect connections
- Double-counting provinces
- Inefficient repeated work

Let's see why we need a systematic approach: If we just look at row 0 and see it connects to city 1, we might think "that's one connection." But we also need to check if city 1 connects to others, and so on. Without tracking visited cities, we might follow circular paths forever or miss that city 2 and 3 form their own separate group.

## Optimized Approach

The key insight is that this is a **connected components in an undirected graph** problem. We have two optimal approaches:

1. **DFS/BFS (Graph Traversal)**: Treat each city as a node. Use DFS or BFS to explore all cities in a province when we encounter an unvisited city. Each time we start a new traversal from an unvisited city, we've found a new province.

2. **Union-Find (Disjoint Set Union)**: Initialize each city as its own set. For each connection `isConnected[i][j] = 1`, union the sets containing i and j. At the end, count the number of distinct sets.

Why both approaches work:

- The graph is undirected, so connections are symmetric
- Transitivity means we need to find the equivalence classes (groups where all members are connected)
- Both approaches efficiently handle the "indirect connection" requirement

The DFS/BFS approach is more intuitive for this problem since we're given an adjacency matrix. Union-Find is excellent when we're building connections incrementally, but here we have all connections up front.

## Optimal Solution

Here's the DFS solution, which is clean and intuitive for this problem:

<div class="code-group">

```python
# Time: O(n²) - We potentially check every cell in the matrix
# Space: O(n) - For the visited array and recursion stack
def findCircleNum(isConnected):
    """
    Find the number of provinces (connected components) in the graph.

    Args:
        isConnected: n x n adjacency matrix where isConnected[i][j] = 1
                     if city i and city j are directly connected

    Returns:
        Number of provinces
    """
    n = len(isConnected)  # Number of cities
    visited = [False] * n  # Track visited cities
    provinces = 0  # Count of provinces

    def dfs(city):
        """
        Depth-first search to mark all cities connected to 'city' as visited.

        Args:
            city: Current city index to explore from
        """
        # Mark current city as visited
        visited[city] = True

        # Check all other cities
        for neighbor in range(n):
            # If there's a connection and neighbor hasn't been visited
            if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                # Recursively explore the neighbor
                dfs(neighbor)

    # Iterate through all cities
    for city in range(n):
        # If city hasn't been visited, it's a new province
        if not visited[city]:
            provinces += 1  # Found a new province
            dfs(city)  # Mark all cities in this province as visited

    return provinces
```

```javascript
// Time: O(n²) - We potentially check every cell in the matrix
// Space: O(n) - For the visited array and recursion stack
function findCircleNum(isConnected) {
  /**
   * Find the number of provinces (connected components) in the graph.
   *
   * @param {number[][]} isConnected - n x n adjacency matrix where isConnected[i][j] = 1
   *                                   if city i and city j are directly connected
   * @return {number} Number of provinces
   */
  const n = isConnected.length; // Number of cities
  const visited = new Array(n).fill(false); // Track visited cities
  let provinces = 0; // Count of provinces

  /**
   * Depth-first search to mark all cities connected to 'city' as visited.
   *
   * @param {number} city - Current city index to explore from
   */
  function dfs(city) {
    // Mark current city as visited
    visited[city] = true;

    // Check all other cities
    for (let neighbor = 0; neighbor < n; neighbor++) {
      // If there's a connection and neighbor hasn't been visited
      if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
        // Recursively explore the neighbor
        dfs(neighbor);
      }
    }
  }

  // Iterate through all cities
  for (let city = 0; city < n; city++) {
    // If city hasn't been visited, it's a new province
    if (!visited[city]) {
      provinces++; // Found a new province
      dfs(city); // Mark all cities in this province as visited
    }
  }

  return provinces;
}
```

```java
// Time: O(n²) - We potentially check every cell in the matrix
// Space: O(n) - For the visited array and recursion stack
class Solution {
    public int findCircleNum(int[][] isConnected) {
        /**
         * Find the number of provinces (connected components) in the graph.
         *
         * @param isConnected n x n adjacency matrix where isConnected[i][j] = 1
         *                   if city i and city j are directly connected
         * @return Number of provinces
         */
        int n = isConnected.length;  // Number of cities
        boolean[] visited = new boolean[n];  // Track visited cities
        int provinces = 0;  // Count of provinces

        // Iterate through all cities
        for (int city = 0; city < n; city++) {
            // If city hasn't been visited, it's a new province
            if (!visited[city]) {
                provinces++;  // Found a new province
                dfs(city, isConnected, visited);  // Mark all cities in this province as visited
            }
        }

        return provinces;
    }

    /**
     * Depth-first search to mark all cities connected to 'city' as visited.
     *
     * @param city Current city index to explore from
     * @param isConnected Adjacency matrix
     * @param visited Array tracking visited cities
     */
    private void dfs(int city, int[][] isConnected, boolean[] visited) {
        // Mark current city as visited
        visited[city] = true;

        // Check all other cities
        for (int neighbor = 0; neighbor < isConnected.length; neighbor++) {
            // If there's a connection and neighbor hasn't been visited
            if (isConnected[city][neighbor] == 1 && !visited[neighbor]) {
                // Recursively explore the neighbor
                dfs(neighbor, isConnected, visited);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through all n cities in the outer loop
- For each city, in the worst case, the DFS might check all n cities (looking at the entire row in the adjacency matrix)
- In practice, we skip visited cities, but the worst case is when the graph is dense (all cities connected to all others)

**Space Complexity: O(n)**

- The `visited` array uses O(n) space
- The recursion stack in DFS could go up to O(n) in the worst case (a linear chain of connections)
- For BFS implementation, the queue would also use O(n) space

Why O(n²) is optimal: We must at least look at the upper triangle of the adjacency matrix to understand all connections, which has n(n-1)/2 elements = O(n²). We can't do better than this in the worst case.

## Common Mistakes

1. **Forgetting the graph is undirected**: Some candidates check only `isConnected[i][j]` but not `isConnected[j][i]`. Actually, the matrix is symmetric by definition (city i connected to j means j connected to i), but the mistake is not leveraging this symmetry to optimize.

2. **Not tracking visited cities**: This leads to infinite recursion or repeated counting. Without the `visited` array, DFS would keep revisiting the same cities in a cycle.

3. **Confusing city indices with matrix values**: The value `1` in the matrix means "connected," not "city 1." This is especially tricky because city indices start at 0, but the value 1 means true/connected.

4. **Missing the diagonal**: The problem states cities are always connected to themselves (`isConnected[i][i] = 1`). While our algorithm handles this (we mark a city visited when we start DFS on it), some candidates get confused by why the diagonal matters.

5. **Using adjacency matrix inefficiently**: Some candidates try to convert to adjacency list first. While this is valid, it's extra work. You can traverse directly from the matrix as shown.

## When You'll See This Pattern

This connected components pattern appears in many graph problems:

1. **Number of Connected Components in an Undirected Graph (LeetCode 323)**: Almost identical problem but with edge list instead of adjacency matrix.

2. **Friend Circles (LeetCode 547)**: This is literally the same problem with a different name!

3. **Surrounded Regions (LeetCode 130)**: Uses DFS/BFS to find connected regions, though with a twist (only regions not touching borders).

4. **Max Area of Island (LeetCode 695)**: Find connected components in a grid (2D matrix) and calculate their size.

The pattern: Whenever you need to find groups of connected nodes in an undirected graph, think DFS/BFS or Union-Find. The choice depends on:

- DFS/BFS: When you have the entire graph upfront and need to explore it
- Union-Find: When connections come incrementally or you need to dynamically merge sets

## Key Takeaways

1. **Recognize connected components problems**: When you see "groups of connected items" with transitivity (if A connects to B and B to C, then A connects to C), it's a connected components problem.

2. **DFS/BFS vs Union-Find**:
   - DFS/BFS is intuitive for complete graph traversal
   - Union-Find is better for incremental connection building
   - Both give O(n²) time for adjacency matrix, but Union-Find has better amortized complexity for dynamic graphs

3. **Adjacency matrix traversal trick**: You can DFS directly from the matrix without converting to adjacency list. Check `isConnected[i][j] == 1` to find neighbors.

4. **Count at traversal start**: Each time you start a DFS/BFS from an unvisited node, you've found a new component. Increment your counter there.

Remember: The core challenge is understanding that "indirect connections" mean we need to find transitive closure, which is exactly what connected components algorithms do.

Related problems: [Number of Connected Components in an Undirected Graph](/problem/number-of-connected-components-in-an-undirected-graph), [Robot Return to Origin](/problem/robot-return-to-origin), [Sentence Similarity](/problem/sentence-similarity)
