---
title: "How to Solve Number of Possible Sets of Closing Branches — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Possible Sets of Closing Branches. Hard difficulty, 50.7% acceptance rate. Topics: Bit Manipulation, Graph Theory, Heap (Priority Queue), Enumeration, Shortest Path."
date: "2026-05-18"
category: "dsa-patterns"
tags:
  [
    "number-of-possible-sets-of-closing-branches",
    "bit-manipulation",
    "graph-theory",
    "heap-(priority-queue)",
    "hard",
  ]
---

# How to Solve "Number of Possible Sets of Closing Branches"

This problem asks us to determine how many subsets of branches we can close while maintaining connectivity between all remaining branches, with the additional constraint that the maximum travel distance between any two remaining branches doesn't exceed a given threshold. The tricky part is balancing graph connectivity with distance constraints across all possible branch closures.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Example:**

- n = 3 branches (0, 1, 2)
- roads: 0-1 (distance 2), 1-2 (distance 3), 0-2 (distance 5)
- maxDistance = 4

**Step 1: Calculate all-pairs shortest paths**
We need to know the shortest distance between every pair of branches:

- 0 to 1: 2 (direct)
- 0 to 2: min(5, 2+3=5) = 5
- 1 to 2: 3 (direct)

**Step 2: Check each possible subset of branches**
We'll check all 2³ = 8 possible subsets:

1. {} (empty set): No branches remain → not valid
2. {0}: Single branch → valid (no distances to check)
3. {1}: Single branch → valid
4. {2}: Single branch → valid
5. {0,1}: Distance between them is 2 ≤ 4 → valid
6. {0,2}: Distance is 5 > 4 → invalid
7. {1,2}: Distance is 3 ≤ 4 → valid
8. {0,1,2}: Need to check all pairs:
   - 0-1: 2 ≤ 4 ✓
   - 0-2: 5 > 4 ✗ → invalid

**Valid subsets:** {0}, {1}, {2}, {0,1}, {1,2} → 5 possible sets

The key insight is that we need to check every possible subset of branches, but we can optimize the distance checking using precomputed shortest paths.

## Brute Force Approach

A naive approach would:

1. Generate all 2ⁿ possible subsets of branches
2. For each subset:
   - Check if the induced subgraph is connected
   - Check if all pairwise distances ≤ maxDistance
3. Count valid subsets

**Why this fails:**

- Generating all subsets is O(2ⁿ), which is already exponential
- For each subset of size k, checking connectivity is O(k²) with BFS/DFS
- Checking all pairwise distances is O(k²)
- Total complexity: O(2ⁿ × n²), which is infeasible for n up to 10

However, n ≤ 10 in this problem, so 2ⁿ = 1024 is manageable! The real challenge is efficiently checking the distance constraints.

## Optimized Approach

The key insight is that with n ≤ 10, we can use **bitmask enumeration** to represent subsets and **Floyd-Warshall** to precompute all-pairs shortest paths.

**Step-by-step reasoning:**

1. **Precompute distances**: Use Floyd-Warshall to find shortest paths between all pairs of branches in O(n³) time.

2. **Bitmask representation**: Represent each subset as an integer where bit i = 1 means branch i is open.

3. **Efficient validation**: For each subset:
   - Extract the list of open branches from the bitmask
   - Check if the subgraph is connected (using BFS/DFS on only open branches)
   - Check if all pairwise distances between open branches ≤ maxDistance

4. **Optimization**: We can combine connectivity and distance checks by only checking distances between branches that would be connected if we consider the complete graph of open branches with edges where distance ≤ maxDistance.

The clever part is realizing that with n ≤ 10, even O(2ⁿ × n²) is acceptable (1024 × 100 = 102,400 operations).

## Optimal Solution

Here's the complete solution using bitmask enumeration and precomputed shortest paths:

<div class="code-group">

```python
# Time: O(2^n * n^2 + n^3) where n ≤ 10
# Space: O(n^2) for distance matrix
from typing import List
from collections import deque

class Solution:
    def numberOfSets(self, n: int, maxDistance: int, roads: List[List[int]]) -> int:
        # Step 1: Initialize distance matrix with infinity
        INF = 10**9
        dist = [[INF] * n for _ in range(n)]

        # Distance from a node to itself is 0
        for i in range(n):
            dist[i][i] = 0

        # Step 2: Fill in given road distances
        # Note: There might be multiple roads between same branches
        for u, v, w in roads:
            # Keep the minimum distance if multiple roads exist
            dist[u][v] = min(dist[u][v], w)
            dist[v][u] = min(dist[v][u], w)

        # Step 3: Floyd-Warshall to compute all-pairs shortest paths
        for k in range(n):
            for i in range(n):
                for j in range(n):
                    # If going through k gives a shorter path, update
                    if dist[i][k] + dist[k][j] < dist[i][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]

        # Step 4: Count valid subsets using bitmask enumeration
        count = 0

        # Iterate through all possible subsets (0 to 2^n - 1)
        for mask in range(1 << n):
            # Extract list of open branches from bitmask
            open_branches = []
            for i in range(n):
                if mask & (1 << i):  # Check if bit i is set
                    open_branches.append(i)

            # Skip empty subset (no branches open)
            if not open_branches:
                continue

            # Step 5: Check if all pairwise distances ≤ maxDistance
            valid = True
            m = len(open_branches)

            # Check all pairs of open branches
            for i in range(m):
                for j in range(i + 1, m):
                    u, v = open_branches[i], open_branches[j]
                    if dist[u][v] > maxDistance:
                        valid = False
                        break
                if not valid:
                    break

            # Step 6: Check connectivity of open branches
            if valid:
                # Build adjacency list for open branches only
                # Two open branches are connected if distance ≤ maxDistance
                adj = [[] for _ in range(n)]
                for i in range(m):
                    for j in range(i + 1, m):
                        u, v = open_branches[i], open_branches[j]
                        if dist[u][v] <= maxDistance:
                            adj[u].append(v)
                            adj[v].append(u)

                # BFS to check connectivity
                visited = [False] * n
                queue = deque([open_branches[0]])
                visited[open_branches[0]] = True
                visited_count = 1

                while queue:
                    node = queue.popleft()
                    for neighbor in adj[node]:
                        if not visited[neighbor]:
                            visited[neighbor] = True
                            visited_count += 1
                            queue.append(neighbor)

                # All open branches must be visited
                if visited_count == m:
                    count += 1

        return count
```

```javascript
// Time: O(2^n * n^2 + n^3) where n ≤ 10
// Space: O(n^2) for distance matrix
/**
 * @param {number} n
 * @param {number} maxDistance
 * @param {number[][]} roads
 * @return {number}
 */
var numberOfSets = function (n, maxDistance, roads) {
  // Step 1: Initialize distance matrix with infinity
  const INF = 10 ** 9;
  const dist = Array(n)
    .fill()
    .map(() => Array(n).fill(INF));

  // Distance from a node to itself is 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  // Step 2: Fill in given road distances
  for (const [u, v, w] of roads) {
    // Keep the minimum distance if multiple roads exist
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }

  // Step 3: Floyd-Warshall to compute all-pairs shortest paths
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // If going through k gives a shorter path, update
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Step 4: Count valid subsets using bitmask enumeration
  let count = 0;

  // Iterate through all possible subsets (0 to 2^n - 1)
  for (let mask = 0; mask < 1 << n; mask++) {
    // Extract list of open branches from bitmask
    const openBranches = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // Check if bit i is set
        openBranches.push(i);
      }
    }

    // Skip empty subset (no branches open)
    if (openBranches.length === 0) {
      continue;
    }

    // Step 5: Check if all pairwise distances ≤ maxDistance
    let valid = true;
    const m = openBranches.length;

    // Check all pairs of open branches
    for (let i = 0; i < m && valid; i++) {
      for (let j = i + 1; j < m; j++) {
        const u = openBranches[i],
          v = openBranches[j];
        if (dist[u][v] > maxDistance) {
          valid = false;
          break;
        }
      }
    }

    // Step 6: Check connectivity of open branches
    if (valid) {
      // Build adjacency list for open branches only
      const adj = Array(n)
        .fill()
        .map(() => []);
      for (let i = 0; i < m; i++) {
        for (let j = i + 1; j < m; j++) {
          const u = openBranches[i],
            v = openBranches[j];
          if (dist[u][v] <= maxDistance) {
            adj[u].push(v);
            adj[v].push(u);
          }
        }
      }

      // BFS to check connectivity
      const visited = Array(n).fill(false);
      const queue = [openBranches[0]];
      visited[openBranches[0]] = true;
      let visitedCount = 1;

      while (queue.length > 0) {
        const node = queue.shift();
        for (const neighbor of adj[node]) {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            visitedCount++;
            queue.push(neighbor);
          }
        }
      }

      // All open branches must be visited
      if (visitedCount === m) {
        count++;
      }
    }
  }

  return count;
};
```

```java
// Time: O(2^n * n^2 + n^3) where n ≤ 10
// Space: O(n^2) for distance matrix
import java.util.*;

class Solution {
    public int numberOfSets(int n, int maxDistance, int[][] roads) {
        // Step 1: Initialize distance matrix with infinity
        final int INF = 1000000000;
        int[][] dist = new int[n][n];

        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            dist[i][i] = 0;  // Distance to itself is 0
        }

        // Step 2: Fill in given road distances
        for (int[] road : roads) {
            int u = road[0], v = road[1], w = road[2];
            // Keep the minimum distance if multiple roads exist
            dist[u][v] = Math.min(dist[u][v], w);
            dist[v][u] = Math.min(dist[v][u], w);
        }

        // Step 3: Floyd-Warshall to compute all-pairs shortest paths
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    // If going through k gives a shorter path, update
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }

        // Step 4: Count valid subsets using bitmask enumeration
        int count = 0;

        // Iterate through all possible subsets (0 to 2^n - 1)
        for (int mask = 0; mask < (1 << n); mask++) {
            // Extract list of open branches from bitmask
            List<Integer> openBranches = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {  // Check if bit i is set
                    openBranches.add(i);
                }
            }

            // Skip empty subset (no branches open)
            if (openBranches.isEmpty()) {
                continue;
            }

            // Step 5: Check if all pairwise distances ≤ maxDistance
            boolean valid = true;
            int m = openBranches.size();

            // Check all pairs of open branches
            for (int i = 0; i < m && valid; i++) {
                for (int j = i + 1; j < m; j++) {
                    int u = openBranches.get(i), v = openBranches.get(j);
                    if (dist[u][v] > maxDistance) {
                        valid = false;
                        break;
                    }
                }
            }

            // Step 6: Check connectivity of open branches
            if (valid) {
                // Build adjacency list for open branches only
                List<Integer>[] adj = new ArrayList[n];
                for (int i = 0; i < n; i++) {
                    adj[i] = new ArrayList<>();
                }

                for (int i = 0; i < m; i++) {
                    for (int j = i + 1; j < m; j++) {
                        int u = openBranches.get(i), v = openBranches.get(j);
                        if (dist[u][v] <= maxDistance) {
                            adj[u].add(v);
                            adj[v].add(u);
                        }
                    }
                }

                // BFS to check connectivity
                boolean[] visited = new boolean[n];
                Queue<Integer> queue = new LinkedList<>();
                queue.offer(openBranches.get(0));
                visited[openBranches.get(0)] = true;
                int visitedCount = 1;

                while (!queue.isEmpty()) {
                    int node = queue.poll();
                    for (int neighbor : adj[node]) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            visitedCount++;
                            queue.offer(neighbor);
                        }
                    }
                }

                // All open branches must be visited
                if (visitedCount == m) {
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

**Time Complexity:**

- Floyd-Warshall: O(n³) = O(10³) = 1000 operations
- Subset enumeration: O(2ⁿ) = O(1024) subsets
- For each subset: O(m²) where m ≤ n for distance checking and adjacency building
- BFS connectivity check: O(m²) in worst case
- Total: O(2ⁿ × n² + n³) = O(1024 × 100 + 1000) ≈ 103,400 operations

**Space Complexity:**

- Distance matrix: O(n²) = O(100) integers
- Adjacency list: O(n²) worst case
- BFS queue and visited array: O(n)
- Total: O(n²) = O(100) space

The constraints (n ≤ 10) make this exponential approach feasible. For larger n, we would need more sophisticated techniques.

## Common Mistakes

1. **Forgetting to handle multiple roads between same branches**: The problem states there can be multiple roads connecting the same branches. Always take the minimum distance when initializing the distance matrix.

2. **Not checking connectivity properly**: It's not enough that all pairwise distances ≤ maxDistance. The branches must also form a connected graph. Two branches might have distance ≤ maxDistance but not be connected through other open branches.

3. **Including the empty subset**: The empty set (no branches open) should not be counted as valid. Always check `if not open_branches: continue`.

4. **Inefficient distance checking**: Recomputing shortest paths for each subset is wasteful. Precomputing with Floyd-Warshall is crucial for efficiency.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask enumeration for subsets**: Used when n ≤ 20 and you need to consider all subsets. Related problems:
   - LeetCode 78: Subsets - Generate all subsets of a set
   - LeetCode 464: Can I Win - Game theory with state represented as bitmask

2. **All-pairs shortest paths**: Floyd-Warshall is perfect for dense graphs with n ≤ 100. Related problems:
   - LeetCode 1334: Find the City With Smallest Number of Neighbors - Uses Floyd-Warshall
   - LeetCode 743: Network Delay Time - Single-source shortest path

3. **Connectivity checking with constraints**: Problems where you need to maintain connectivity while applying constraints. Related problems:
   - LeetCode 1319: Number of Operations to Make Network Connected
   - LeetCode 1584: Min Cost to Connect All Points

## Key Takeaways

1. **Small n suggests brute force**: When n ≤ 15-20, consider enumerating all subsets using bitmask representation. The 2ⁿ complexity might be acceptable.

2. **Precompute expensive operations**: If you need to repeatedly query distances between nodes, precompute all-pairs shortest paths once using Floyd-Warshall (O(n³)) rather than running Dijkstra for each pair.

3. **Combine constraints efficiently**: When checking multiple constraints (distance and connectivity), look for ways to combine checks or use one check to optimize the other.

[Practice this problem on CodeJeet](/problem/number-of-possible-sets-of-closing-branches)
