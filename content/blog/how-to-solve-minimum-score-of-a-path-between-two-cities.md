---
title: "How to Solve Minimum Score of a Path Between Two Cities — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Score of a Path Between Two Cities. Medium difficulty, 58.6% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-04-25"
category: "dsa-patterns"
tags:
  [
    "minimum-score-of-a-path-between-two-cities",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Minimum Score of a Path Between Two Cities

You're given `n` cities connected by bidirectional roads with distances, and you need to find the minimum possible score of any path between city 1 and city n. The "score" of a path is defined as the minimum distance edge along that path. This problem is interesting because it's not about finding the shortest path (like Dijkstra's algorithm), but rather about finding the path with the largest minimum edge weight. The twist is that you can travel any path between the two cities, not just direct connections.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
n = 4
roads = [[1,2,9],[2,3,6],[2,4,5],[1,4,7]]
```

We have 4 cities with the following connections:

- City 1 ↔ City 2 (distance 9)
- City 2 ↔ City 3 (distance 6)
- City 2 ↔ City 4 (distance 5)
- City 1 ↔ City 4 (distance 7)

We need to find the minimum score of any path from city 1 to city 4. Let's examine possible paths:

1. **Direct path**: 1 → 4 (edge weight 7)
   - Score = min(7) = 7

2. **Path through city 2**: 1 → 2 → 4
   - Edge weights: 9 and 5
   - Score = min(9, 5) = 5

3. **Path through city 2 and 3**: 1 → 2 → 3 → 2 → 4
   - Edge weights: 9, 6, 6, 5
   - Score = min(9, 6, 6, 5) = 5

Notice that we can traverse roads multiple times! This means we can include any edge in the connected component containing cities 1 and 4. Since all cities 1, 2, and 4 are connected, the minimum edge weight in this entire connected component is 5 (the edge between 2 and 4).

**Key insight**: The minimum score between city 1 and city n is simply the minimum edge weight in the entire connected component that contains both cities. We can reach any edge in this component by traversing back and forth, so the bottleneck becomes the smallest edge in the component.

## Brute Force Approach

A naive approach would be to try all possible paths from city 1 to city n and calculate the score for each path. We could use DFS or BFS to explore all paths, keeping track of the minimum edge weight along each path, and then take the maximum of these minimums (since we want the best path).

However, this approach has several problems:

1. The graph can have cycles, leading to infinite paths
2. Even with cycle detection, the number of paths can be exponential
3. The problem constraints (n up to 10^5) make this completely infeasible

The brute force would have exponential time complexity, which is why we need a smarter approach.

## Optimized Approach

The key insight is that **you can traverse any edge multiple times**. This means if cities 1 and n are in the same connected component, you can include any edge from that component in your path. Therefore:

1. Find the connected component containing both city 1 and city n
2. The answer is the minimum edge weight in that entire component

We can solve this using either:

- **DFS/BFS**: Traverse from city 1, collect all reachable nodes and edges, find the minimum edge weight among them
- **Union-Find (Disjoint Set Union)**: Connect cities based on roads, then find the minimum edge weight in the component containing city 1

Both approaches work, but Union-Find is particularly elegant for this problem since we're dealing with connectivity.

**Step-by-step reasoning:**

1. Build an adjacency list from the roads
2. Start BFS/DFS from city 1
3. Track all visited cities
4. Keep track of the minimum edge weight encountered
5. If we reach city n (or determine it's in the same component), return the minimum edge weight

## Optimal Solution

Here's the complete solution using BFS/DFS:

<div class="code-group">

```python
# Time: O(n + m) where n = number of cities, m = number of roads
# Space: O(n + m) for adjacency list and visited set
class Solution:
    def minScore(self, n: int, roads: List[List[int]]) -> int:
        # Step 1: Build adjacency list
        # Each city maps to list of (neighbor, distance) pairs
        adj = [[] for _ in range(n + 1)]

        for a, b, dist in roads:
            adj[a].append((b, dist))
            adj[b].append((a, dist))  # Bidirectional road

        # Step 2: Initialize BFS/DFS to explore the connected component
        # We'll use BFS for simplicity (DFS would work too)
        visited = [False] * (n + 1)
        min_score = float('inf')

        # Queue for BFS
        queue = deque([1])
        visited[1] = True

        # Step 3: Explore the entire connected component starting from city 1
        while queue:
            city = queue.popleft()

            # Check all neighbors of current city
            for neighbor, dist in adj[city]:
                # Update minimum edge weight seen so far
                min_score = min(min_score, dist)

                # If neighbor not visited, add to queue
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

        # Step 4: Return the minimum edge weight in the component
        # Since we started from city 1 and city n must be in the same component
        # (problem guarantees a path exists), this is our answer
        return min_score
```

```javascript
// Time: O(n + m) where n = number of cities, m = number of roads
// Space: O(n + m) for adjacency list and visited array
/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
var minScore = function (n, roads) {
  // Step 1: Build adjacency list
  // Each city maps to array of [neighbor, distance] pairs
  const adj = Array.from({ length: n + 1 }, () => []);

  for (const [a, b, dist] of roads) {
    adj[a].push([b, dist]);
    adj[b].push([a, dist]); // Bidirectional road
  }

  // Step 2: Initialize BFS to explore the connected component
  const visited = new Array(n + 1).fill(false);
  let minScore = Infinity;

  // Queue for BFS
  const queue = [1];
  visited[1] = true;

  // Step 3: Explore the entire connected component starting from city 1
  while (queue.length > 0) {
    const city = queue.shift();

    // Check all neighbors of current city
    for (const [neighbor, dist] of adj[city]) {
      // Update minimum edge weight seen so far
      minScore = Math.min(minScore, dist);

      // If neighbor not visited, add to queue
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }

  // Step 4: Return the minimum edge weight in the component
  // City n must be in the same component as city 1
  return minScore;
};
```

```java
// Time: O(n + m) where n = number of cities, m = number of roads
// Space: O(n + m) for adjacency list and visited array
class Solution {
    public int minScore(int n, int[][] roads) {
        // Step 1: Build adjacency list
        // Each city maps to list of int arrays [neighbor, distance]
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int[] road : roads) {
            int a = road[0], b = road[1], dist = road[2];
            adj.get(a).add(new int[]{b, dist});
            adj.get(b).add(new int[]{a, dist});  // Bidirectional road
        }

        // Step 2: Initialize BFS to explore the connected component
        boolean[] visited = new boolean[n + 1];
        int minScore = Integer.MAX_VALUE;

        // Queue for BFS
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(1);
        visited[1] = true;

        // Step 3: Explore the entire connected component starting from city 1
        while (!queue.isEmpty()) {
            int city = queue.poll();

            // Check all neighbors of current city
            for (int[] neighborInfo : adj.get(city)) {
                int neighbor = neighborInfo[0];
                int dist = neighborInfo[1];

                // Update minimum edge weight seen so far
                minScore = Math.min(minScore, dist);

                // If neighbor not visited, add to queue
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }

        // Step 4: Return the minimum edge weight in the component
        // City n must be in the same component as city 1
        return minScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the adjacency list takes O(m) time, where m is the number of roads
- BFS/DFS traversal visits each city and each edge once, taking O(n + m) time
- Overall: O(n + m), which is linear in the size of the input

**Space Complexity: O(n + m)**

- Adjacency list stores all edges: O(m) space
- Visited array: O(n) space
- BFS queue in worst case: O(n) space
- Overall: O(n + m)

## Common Mistakes

1. **Using Dijkstra's algorithm**: Candidates familiar with shortest path problems might try Dijkstra's algorithm, but this problem isn't about minimizing total distance. The score is the minimum edge weight along a path, not the sum.

2. **Not understanding the problem statement**: Some candidates miss that you can traverse roads multiple times. This is crucial - it means you're not looking for a simple path but can include any edge in the connected component.

3. **Only checking direct connections**: A naive approach might only check edges directly connected to cities 1 or n, but the optimal path might go through intermediate cities.

4. **Forgetting bidirectional edges**: The roads are bidirectional, so you need to add edges in both directions when building the adjacency list.

5. **Index off-by-one errors**: Cities are numbered from 1 to n, but arrays are 0-indexed. Always allocate n+1 elements for adjacency lists and visited arrays.

## When You'll See This Pattern

This problem uses **connected component analysis** combined with **edge property aggregation** (finding the minimum edge weight in a component). You'll see similar patterns in:

1. **Checking Existence of Edge Length Limited Paths (LeetCode 1697)**: Also involves connectivity with edge weight constraints, though more complex with multiple queries.

2. **Number of Operations to Make Network Connected (LeetCode 1319)**: Focuses on connectivity in a graph and counting components.

3. **Most Stones Removed with Same Row or Column (LeetCode 947)**: Uses Union-Find to connect stones and count components.

4. **Graph problems where you need to find some extremal property (min/max) across a connected component** rather than along a specific path.

## Key Takeaways

1. **When you can traverse edges multiple times**, you're effectively working with the entire connected component, not just specific paths. This simplifies the problem from path-finding to component analysis.

2. **The problem's definition of "score"** (minimum edge weight along a path) combined with unrestricted traversal means the answer is simply the minimum edge weight in the component containing both endpoints.

3. **BFS/DFS and Union-Find are interchangeable** for connectivity problems. Choose based on what's simpler for the specific problem - BFS/DFS for traversal with additional processing, Union-Find for pure connectivity queries.

4. **Always read the problem statement carefully** - the ability to traverse edges multiple times is the key insight that makes this problem much simpler than it initially appears.

Related problems: [Checking Existence of Edge Length Limited Paths](/problem/checking-existence-of-edge-length-limited-paths), [Checking Existence of Edge Length Limited Paths II](/problem/checking-existence-of-edge-length-limited-paths-ii)
