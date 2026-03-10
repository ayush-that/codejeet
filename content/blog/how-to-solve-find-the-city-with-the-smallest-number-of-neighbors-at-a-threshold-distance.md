---
title: "How to Solve Find the City With the Smallest Number of Neighbors at a Threshold Distance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the City With the Smallest Number of Neighbors at a Threshold Distance. Medium difficulty, 72.2% acceptance rate. Topics: Dynamic Programming, Graph Theory, Shortest Path."
date: "2027-12-12"
category: "dsa-patterns"
tags:
  [
    "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
    "dynamic-programming",
    "graph-theory",
    "shortest-path",
    "medium",
  ]
---

# How to Solve "Find the City With the Smallest Number of Neighbors at a Threshold Distance"

This problem presents a classic graph challenge: given bidirectional weighted edges between cities, find which city has the fewest reachable neighbors within a maximum distance threshold. The tricky part is that we need to compute shortest paths between all pairs of cities efficiently, then count reachable neighbors for each city, and finally break ties by choosing the city with the largest number when multiple cities have the same minimum reachable count.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- n = 4 cities (0, 1, 2, 3)
- edges = [[0,1,3], [1,2,1], [2,3,4], [0,3,7]]
- distanceThreshold = 4

**Step 1: Understand the graph**
We have 4 cities with these connections:

- City 0 connects to city 1 (distance 3) and city 3 (distance 7)
- City 1 connects to city 0 (distance 3) and city 2 (distance 1)
- City 2 connects to city 1 (distance 1) and city 3 (distance 4)
- City 3 connects to city 0 (distance 7) and city 2 (distance 4)

**Step 2: Find shortest paths between all cities**
We need to know the shortest distance between every pair:

- 0→1: 3 (direct)
- 0→2: 4 (0→1→2: 3+1=4)
- 0→3: 7 (direct) or 0→1→2→3: 3+1+4=8, so 7
- 1→2: 1 (direct)
- 1→3: 5 (1→2→3: 1+4=5)
- 2→3: 4 (direct)

**Step 3: Count reachable neighbors for each city (distance ≤ 4)**

- City 0: Can reach city 1 (3 ≤ 4) and city 2 (4 ≤ 4) → 2 neighbors
- City 1: Can reach city 0 (3 ≤ 4) and city 2 (1 ≤ 4) → 2 neighbors
- City 2: Can reach city 0 (4 ≤ 4), city 1 (1 ≤ 4), city 3 (4 ≤ 4) → 3 neighbors
- City 3: Can reach city 2 (4 ≤ 4) → 1 neighbor

**Step 4: Find city with smallest reachable count**
City 3 has only 1 reachable neighbor, which is the smallest.

**Step 5: Handle ties (if any)**
If multiple cities had 1 reachable neighbor, we'd choose the one with the largest city number. Here, city 3 is our answer.

## Brute Force Approach

A naive approach would be to run Dijkstra's algorithm or BFS from each city to find all reachable cities within the threshold. For each of the n cities, we'd explore the graph to find reachable neighbors:

1. For each city i (0 to n-1):
   - Run Dijkstra's algorithm starting from city i
   - Count how many other cities have shortest distance ≤ distanceThreshold
2. Track the city with the smallest count, breaking ties by choosing the larger city number

**Why this isn't optimal:**

- Dijkstra's algorithm runs in O(E log V) time using a priority queue
- Running it n times gives O(n × E log V) = O(n³ log n) in dense graphs
- We can do better by computing all-pairs shortest paths more efficiently

## Optimized Approach

The key insight is that we need **all-pairs shortest paths** - the shortest distance between every pair of cities. Once we have this, counting reachable neighbors for each city becomes trivial.

**Floyd-Warshall Algorithm** is perfect for this:

- Designed specifically for all-pairs shortest paths
- Works with adjacency matrix representation
- Handles negative weights (though not needed here)
- Simple to implement with triple nested loops

**Step-by-step reasoning:**

1. Initialize an n×n distance matrix with infinity (or a large number) for all pairs
2. Set distance[i][i] = 0 (distance from a city to itself is 0)
3. Fill in direct edge weights (bidirectional, so both directions get the same weight)
4. Run Floyd-Warshall: for each intermediate city k, check if going through k gives a shorter path between i and j
5. After computing all shortest paths, for each city i, count how many j ≠ i have distance[i][j] ≤ distanceThreshold
6. Find the city with the smallest count, breaking ties by choosing the larger city number

**Why Floyd-Warshall works well:**

- Time complexity O(n³) which is reasonable for n ≤ 100 (typical constraint)
- Space complexity O(n²) for the distance matrix
- Much simpler than running Dijkstra n times
- The triple loop structure is easy to remember and implement

## Optimal Solution

Here's the complete solution using Floyd-Warshall algorithm:

<div class="code-group">

```python
# Time: O(n³) | Space: O(n²)
def findTheCity(self, n: int, edges: List[List[int]], distanceThreshold: int) -> int:
    # Step 1: Initialize distance matrix with infinity
    # We use float('inf') to represent unreachable cities
    dist = [[float('inf')] * n for _ in range(n)]

    # Step 2: Distance from a city to itself is 0
    for i in range(n):
        dist[i][i] = 0

    # Step 3: Fill in direct edge weights (bidirectional)
    for u, v, w in edges:
        dist[u][v] = w
        dist[v][u] = w

    # Step 4: Floyd-Warshall algorithm - find shortest paths between all pairs
    # The key idea: for each intermediate city k, check if path i->k->j is shorter than i->j
    for k in range(n):  # Intermediate city
        for i in range(n):  # Source city
            for j in range(n):  # Destination city
                # If going through k gives a shorter path, update the distance
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    # Step 5: Count reachable cities for each city and find the answer
    min_reachable = n  # Start with worst case (all cities reachable)
    result_city = -1

    for i in range(n):
        # Count how many cities j (j != i) are within distanceThreshold from i
        reachable_count = 0
        for j in range(n):
            if i != j and dist[i][j] <= distanceThreshold:
                reachable_count += 1

        # Update answer if this city has fewer reachable cities,
        # or same number but larger city number (due to tie-breaking rule)
        if reachable_count < min_reachable or (reachable_count == min_reachable and i > result_city):
            min_reachable = reachable_count
            result_city = i

    return result_city
```

```javascript
// Time: O(n³) | Space: O(n²)
var findTheCity = function (n, edges, distanceThreshold) {
  // Step 1: Initialize distance matrix with Infinity
  const dist = Array(n)
    .fill()
    .map(() => Array(n).fill(Infinity));

  // Step 2: Distance from a city to itself is 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  // Step 3: Fill in direct edge weights (bidirectional)
  for (const [u, v, w] of edges) {
    dist[u][v] = w;
    dist[v][u] = w;
  }

  // Step 4: Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    // Intermediate city
    for (let i = 0; i < n; i++) {
      // Source city
      for (let j = 0; j < n; j++) {
        // Destination city
        // If path through k is shorter, update distance
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Step 5: Find city with fewest reachable neighbors
  let minReachable = n; // Start with maximum possible
  let resultCity = -1;

  for (let i = 0; i < n; i++) {
    let reachableCount = 0;

    // Count cities within threshold distance
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] <= distanceThreshold) {
        reachableCount++;
      }
    }

    // Update result based on count and tie-breaking rule
    if (reachableCount < minReachable || (reachableCount === minReachable && i > resultCity)) {
      minReachable = reachableCount;
      resultCity = i;
    }
  }

  return resultCity;
};
```

```java
// Time: O(n³) | Space: O(n²)
class Solution {
    public int findTheCity(int n, int[][] edges, int distanceThreshold) {
        // Step 1: Initialize distance matrix with a large value
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE / 2); // Avoid overflow
            dist[i][i] = 0;  // Distance to self is 0
        }

        // Step 2: Fill in direct edge weights (bidirectional)
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            dist[u][v] = w;
            dist[v][u] = w;
        }

        // Step 3: Floyd-Warshall algorithm
        for (int k = 0; k < n; k++) {          // Intermediate city
            for (int i = 0; i < n; i++) {      // Source city
                for (int j = 0; j < n; j++) {  // Destination city
                    // Avoid integer overflow by checking before adding
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }

        // Step 4: Find city with fewest reachable neighbors
        int minReachable = n;  // Start with worst case
        int resultCity = -1;

        for (int i = 0; i < n; i++) {
            int reachableCount = 0;

            // Count cities within threshold distance
            for (int j = 0; j < n; j++) {
                if (i != j && dist[i][j] <= distanceThreshold) {
                    reachableCount++;
                }
            }

            // Update result based on count and tie-breaking rule
            if (reachableCount < minReachable ||
                (reachableCount == minReachable && i > resultCity)) {
                minReachable = reachableCount;
                resultCity = i;
            }
        }

        return resultCity;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- The Floyd-Warshall algorithm has three nested loops over n cities: O(n × n × n) = O(n³)
- The final counting step is O(n²) (n cities × n checks each), which is dominated by O(n³)
- For n ≤ 100 (typical constraint), n³ = 1,000,000 operations is acceptable

**Space Complexity: O(n²)**

- We store an n × n distance matrix to track shortest paths between all pairs
- Each entry stores an integer distance value
- No additional significant space is used

## Common Mistakes

1. **Forgetting to initialize diagonal to 0**: The distance from a city to itself should be 0, not infinity. Without this, the algorithm won't work correctly.

2. **Not handling bidirectional edges properly**: When adding edge weights, you must set both `dist[u][v]` and `dist[v][u]` to the weight. The problem states edges are bidirectional.

3. **Integer overflow in Java/C++**: When using large values for "infinity", adding them can cause overflow. Use `Integer.MAX_VALUE / 2` or similar to avoid this.

4. **Incorrect tie-breaking logic**: The problem requires that when multiple cities have the same minimum reachable count, we return the city with the largest number. Candidates often return the smallest number instead.

5. **Counting self as a neighbor**: When counting reachable cities, make sure to exclude the city itself (i ≠ j check). A city is not its own neighbor.

## When You'll See This Pattern

The Floyd-Warshall algorithm for all-pairs shortest paths appears in several graph problems:

1. **Network Delay Time (LeetCode 743)**: Similar concept of finding shortest paths, though typically solved with Dijkstra's since we only need from one source.

2. **Cheapest Flights Within K Stops (LeetCode 787)**: While often solved with Bellman-Ford, Floyd-Warshall can be adapted for limited stops.

3. **Evaluate Division (LeetCode 399)**: Uses a similar "all-pairs" approach but for multiplicative relationships rather than additive distances.

4. **Minimum Cost to Reach Destination in Time (LeetCode 1928)**: Combines shortest paths with additional constraints.

The key pattern to recognize: when you need shortest paths between **all pairs** of nodes in a graph, especially when n is relatively small (≤ 200), Floyd-Warshall is often the simplest solution.

## Key Takeaways

1. **Floyd-Warshall is your go-to for all-pairs shortest paths** when the graph is small enough (n ≤ 200). Its O(n³) time and O(n²) space are acceptable for these constraints, and the implementation is straightforward.

2. **The triple loop structure is worth memorizing**: `for k in range(n): for i in range(n): for j in range(n):` with the update `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.

3. **Always check problem constraints carefully**: For larger graphs (n > 200), you'd need a different approach like running Dijkstra from each node, but for typical contest problems with n ≤ 100, Floyd-Warshall is perfect.

4. **Pay attention to tie-breaking rules**: Many graph problems have specific requirements for handling ties. Read the problem statement carefully and implement the exact logic required.

Related problems: [Second Minimum Time to Reach Destination](/problem/second-minimum-time-to-reach-destination)
