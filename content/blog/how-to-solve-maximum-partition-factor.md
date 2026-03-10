---
title: "How to Solve Maximum Partition Factor — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Partition Factor. Hard difficulty, 31.1% acceptance rate. Topics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union-Find."
date: "2026-08-05"
category: "dsa-patterns"
tags: ["maximum-partition-factor", "array", "binary-search", "depth-first-search", "hard"]
---

# How to Solve Maximum Partition Factor

You're given `n` points on a Cartesian plane and need to split them into exactly `k` non-empty groups such that the minimum Manhattan distance between any two points in the same group is maximized. This is essentially a "maximize the minimum" problem, which is a classic pattern that often suggests binary search over the answer space. The challenge lies in efficiently checking whether a given minimum distance is achievable for exactly `k` groups.

## Visual Walkthrough

Let's walk through a small example with points `[[1,1], [2,2], [3,3], [8,8]]` and `k = 2`. We want to find the maximum `d` such that we can split these 4 points into exactly 2 groups where points within the same group are at least `d` apart.

If we try `d = 5`:

- Start with point `[1,1]` as group 1
- `[2,2]` is only 2 units away (|1-2| + |1-2| = 2) - too close, must be in different group
- `[3,3]` is 4 units from `[1,1]` - still too close for same group
- `[8,8]` is 14 units from `[1,1]` - can be in same group
  So we have group 1: `{[1,1], [8,8]}` and group 2: `{[2,2], [3,3]}`. That's 2 groups with minimum intra-group distance of 5 (actually 14 in group 1 and 2 in group 2, but we only care about the minimum being ≥5).

If we try `d = 6`:

- `[1,1]` and `[8,8]` can be together (distance 14 ≥ 6)
- `[2,2]` and `[3,3]` cannot be together (distance 2 < 6)
- But we have 4 points and need exactly 2 groups. With `d=6`, we might end up with 3 or 4 groups instead.

The key insight: For a given `d`, we can build a graph where edges connect points with distance < `d`. Then the number of connected components tells us the minimum number of groups needed. If this number ≤ `k`, then `d` is achievable (we can always merge components to get exactly `k` groups).

## Brute Force Approach

A naive approach would be to try all possible partitions of `n` points into `k` groups, compute the minimum intra-group distance for each partition, and take the maximum. However, the number of ways to partition `n` points into `k` non-empty groups is given by Stirling numbers of the second kind, which grows exponentially. For `n=100`, this is completely infeasible.

Even checking a single candidate `d` by trying all partitions would be too slow. We need a smarter way to determine if a given `d` allows exactly `k` groups.

## Optimized Approach

The problem follows a classic pattern: "maximize the minimum" suggests **binary search** on the answer. We need to:

1. Determine the search range for `d` (minimum possible to maximum possible distance)
2. For each candidate `d`, check if we can form exactly `k` groups where points in the same group are ≥ `d` apart

The clever part is how to check feasibility for a given `d`:

- Build a graph where vertices are points and edges exist between points with Manhattan distance < `d`
- Find connected components using DFS/BFS/Union-Find
- Each connected component represents points that are "too close" to be in different groups
- The number of components is the **minimum** number of groups needed
- If `components ≤ k ≤ n`, then `d` is feasible (we can split larger components to reach exactly `k` groups)

Why does this work? If two points are closer than `d`, they must be in different groups to maintain the minimum distance `d` within groups. In graph terms, adjacent vertices (points closer than `d`) must have different "colors" (groups). This is equivalent to checking if the graph's chromatic number ≤ `k`. For this specific constraint (distance threshold), the graph is defined by a proximity relation, and the chromatic number equals the number of connected components.

## Optimal Solution

We'll use binary search on `d` from 0 to the maximum Manhattan distance between any two points. For each `d`, we build the graph and count connected components using DFS.

<div class="code-group">

```python
# Time: O(n^2 * log(max_distance)) - n^2 for graph building, log(max_distance) for binary search
# Space: O(n^2) for adjacency list in worst case (complete graph)
def maximumPartitionFactor(points, k):
    n = len(points)

    # Helper function to check if we can achieve minimum distance d
    def canAchieve(d):
        # Build adjacency list for points with distance < d
        adj = [[] for _ in range(n)]
        for i in range(n):
            x1, y1 = points[i]
            for j in range(i + 1, n):
                x2, y2 = points[j]
                # Manhattan distance
                dist = abs(x1 - x2) + abs(y1 - y2)
                if dist < d:
                    # Points too close, must be in different groups
                    adj[i].append(j)
                    adj[j].append(i)

        # Count connected components using DFS
        visited = [False] * n
        components = 0

        def dfs(node):
            visited[node] = True
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    dfs(neighbor)

        for i in range(n):
            if not visited[i]:
                components += 1
                dfs(i)

        # We need exactly k groups
        # If we have fewer components than k, we can split some components
        # If we have more components than k, we cannot merge them (would violate d)
        return components <= k

    # Binary search for the maximum d
    # Minimum possible distance is 0 (all points in same group)
    # Maximum possible distance is max Manhattan distance between any two points
    max_dist = 0
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i + 1, n):
            x2, y2 = points[j]
            max_dist = max(max_dist, abs(x1 - x2) + abs(y1 - y2))

    left, right = 0, max_dist + 1  # +1 to handle case where max_dist is achievable
    while left < right:
        mid = (left + right + 1) // 2  # Upper mid for binary search on maximum
        if canAchieve(mid):
            left = mid  # Try for larger d
        else:
            right = mid - 1  # d too large, reduce

    return left
```

```javascript
// Time: O(n^2 * log(max_distance))
// Space: O(n^2) for adjacency list in worst case
function maximumPartitionFactor(points, k) {
  const n = points.length;

  // Helper function to check if we can achieve minimum distance d
  const canAchieve = (d) => {
    // Build adjacency list for points with distance < d
    const adj = Array(n)
      .fill()
      .map(() => []);
    for (let i = 0; i < n; i++) {
      const [x1, y1] = points[i];
      for (let j = i + 1; j < n; j++) {
        const [x2, y2] = points[j];
        // Manhattan distance
        const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
        if (dist < d) {
          // Points too close, must be in different groups
          adj[i].push(j);
          adj[j].push(i);
        }
      }
    }

    // Count connected components using DFS
    const visited = Array(n).fill(false);
    let components = 0;

    const dfs = (node) => {
      visited[node] = true;
      for (const neighbor of adj[node]) {
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      }
    };

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        components++;
        dfs(i);
      }
    }

    // We need exactly k groups
    // If we have fewer components than k, we can split some components
    // If we have more components than k, we cannot merge them (would violate d)
    return components <= k;
  };

  // Binary search for the maximum d
  // Find maximum Manhattan distance between any two points
  let maxDist = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = points[j];
      maxDist = Math.max(maxDist, Math.abs(x1 - x2) + Math.abs(y1 - y2));
    }
  }

  let left = 0,
    right = maxDist + 1; // +1 to handle case where maxDist is achievable
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2); // Upper mid
    if (canAchieve(mid)) {
      left = mid; // Try for larger d
    } else {
      right = mid - 1; // d too large, reduce
    }
  }

  return left;
}
```

```java
// Time: O(n^2 * log(max_distance))
// Space: O(n^2) for adjacency list in worst case
import java.util.*;

public class Solution {
    public int maximumPartitionFactor(int[][] points, int k) {
        int n = points.length;

        // Helper function to check if we can achieve minimum distance d
        // Using interface for cleaner code structure
        java.util.function.IntPredicate canAchieve = (d) -> {
            // Build adjacency list for points with distance < d
            List<Integer>[] adj = new ArrayList[n];
            for (int i = 0; i < n; i++) {
                adj[i] = new ArrayList<>();
            }

            for (int i = 0; i < n; i++) {
                int x1 = points[i][0], y1 = points[i][1];
                for (int j = i + 1; j < n; j++) {
                    int x2 = points[j][0], y2 = points[j][1];
                    // Manhattan distance
                    int dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
                    if (dist < d) {
                        // Points too close, must be in different groups
                        adj[i].add(j);
                        adj[j].add(i);
                    }
                }
            }

            // Count connected components using DFS
            boolean[] visited = new boolean[n];
            int components = 0;

            for (int i = 0; i < n; i++) {
                if (!visited[i]) {
                    components++;
                    // DFS stack
                    Stack<Integer> stack = new Stack<>();
                    stack.push(i);
                    visited[i] = true;

                    while (!stack.isEmpty()) {
                        int node = stack.pop();
                        for (int neighbor : adj[node]) {
                            if (!visited[neighbor]) {
                                visited[neighbor] = true;
                                stack.push(neighbor);
                            }
                        }
                    }
                }
            }

            // We need exactly k groups
            // If we have fewer components than k, we can split some components
            // If we have more components than k, we cannot merge them (would violate d)
            return components <= k;
        };

        // Binary search for the maximum d
        // Find maximum Manhattan distance between any two points
        int maxDist = 0;
        for (int i = 0; i < n; i++) {
            int x1 = points[i][0], y1 = points[i][1];
            for (int j = i + 1; j < n; j++) {
                int x2 = points[j][0], y2 = points[j][1];
                maxDist = Math.max(maxDist, Math.abs(x1 - x2) + Math.abs(y1 - y2));
            }
        }

        int left = 0, right = maxDist + 1;  // +1 to handle case where maxDist is achievable
        while (left < right) {
            int mid = left + (right - left + 1) / 2;  // Upper mid to avoid infinite loop
            if (canAchieve.test(mid)) {
                left = mid;  // Try for larger d
            } else {
                right = mid - 1;  // d too large, reduce
            }
        }

        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* log(max_distance))

- Building the adjacency list for each `d` check takes O(n²) since we compare all pairs of points
- DFS to count components takes O(n + edges), which is O(n²) in worst case (complete graph)
- Binary search runs O(log(max_distance)) times, where max_distance ≤ 2 \* 10⁴ (since coordinates ≤ 10⁴)
- Total: O(n² \* log(max_distance))

**Space Complexity:** O(n²)

- Adjacency list can have O(n²) edges in worst case when all points are close to each other
- Visited array and recursion stack use O(n) space

## Common Mistakes

1. **Wrong feasibility check:** Some candidates think they need exactly `k` connected components. Actually, we need _at most_ `k` components. If we have fewer than `k`, we can always split a component into multiple groups (since splitting doesn't violate the distance constraint).

2. **Incorrect binary search bounds:** Forgetting to add +1 to `max_dist` can miss the case where the maximum distance itself is achievable. The binary search should be over [0, max_dist] inclusive.

3. **Confusing Manhattan with Euclidean distance:** The problem specifies Manhattan distance (|x1-x2| + |y1-y2|), not Euclidean distance (√((x1-x2)² + (y1-y2)²)). Using the wrong distance formula gives incorrect results.

4. **Not handling k > n:** The problem guarantees 1 ≤ k ≤ n, but in interviews, it's good to mention this edge case. If k > n, it's impossible to have exactly k non-empty groups with n points.

## When You'll See This Pattern

This "maximize the minimum distance" pattern with binary search and graph connectivity appears in several problems:

1. **LeetCode 1552: Magnetic Force Between Two Balls** - Similar "maximize minimum distance" but with placing balls in baskets. Uses binary search with greedy placement check.

2. **LeetCode 778: Swim in Rising Water** - Binary search on time/height with DFS/BFS to check connectivity.

3. **LeetCode 1102: Path With Maximum Minimum Value** - Another "maximize the minimum" problem with binary search and DFS/BFS.

The core pattern: When you need to maximize a minimum value (or minimize a maximum value), think binary search on the answer space with a feasibility check function.

## Key Takeaways

1. **"Maximize the minimum" suggests binary search:** When you see problems asking for the maximum possible minimum distance/value, binary search on the answer is often the right approach.

2. **Feasibility checks can use graph connectivity:** For distance-based constraints, building a graph where edges represent "conflict" (points too close) and checking connectivity properties is a powerful technique.

3. **Connected components give lower bound on groups:** In grouping problems with distance constraints, the number of connected components in the "conflict graph" gives the minimum number of groups needed.

[Practice this problem on CodeJeet](/problem/maximum-partition-factor)
