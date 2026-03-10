---
title: "How to Solve Count Pairs of Connectable Servers in a Weighted Tree Network — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Pairs of Connectable Servers in a Weighted Tree Network. Medium difficulty, 55.6% acceptance rate. Topics: Array, Tree, Depth-First Search."
date: "2030-02-04"
category: "dsa-patterns"
tags:
  [
    "count-pairs-of-connectable-servers-in-a-weighted-tree-network",
    "array",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Count Pairs of Connectable Servers in a Weighted Tree Network

This problem asks us to count how many servers can connect to each other through a central server, where a connection is valid if the total path distance is divisible by the signal speed. The challenge lies in efficiently computing these divisible-distance paths in a tree structure without repeatedly traversing the same edges. What makes this interesting is that we need to count pairs of servers that connect through each possible central server, requiring careful subtree analysis.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- n = 4 servers (0, 1, 2, 3)
- edges = [[0,1,1], [1,2,2], [1,3,4]]
- signalSpeed = 3

Our tree looks like:

```
0 --1-- 1 --2-- 2
        |
        4
        |
        3
```

We need to find for each server i, how many pairs (a,b) exist where:

1. a and b are different servers
2. The path from a to i and from i to b both have distances divisible by signalSpeed (3)
3. a and b are in different subtrees relative to i

Let's examine server 1 as the central server:

- Subtree through edge to 0: Distances from 1 to nodes in this subtree:
  - Node 0: distance = 1 (not divisible by 3)
  - Count of divisible-distance nodes = 0
- Subtree through edge to 2: Distances from 1 to nodes:
  - Node 2: distance = 2 (not divisible by 3)
  - Count = 0
- Subtree through edge to 3: Distances from 1 to nodes:
  - Node 3: distance = 4 (not divisible by 3)
  - Count = 0

Total pairs through server 1 = 0 (since no subtree has divisible-distance nodes)

Now let's check server 0 as central:

- Only one subtree (toward server 1), so we can't have pairs in different subtrees
- Result = 0

Similarly for servers 2 and 3: result = 0

So final answer = [0, 0, 0, 0]

The key insight: For each central server, we need to count how many nodes in each subtree have distances divisible by signalSpeed, then combine these counts to get pairs.

## Brute Force Approach

A naive approach would be: For each possible central server i, for every pair of distinct servers (a,b), check if:

1. i lies on the path between a and b
2. distance(a,i) % signalSpeed == 0
3. distance(b,i) % signalSpeed == 0

To check if i is on the path between a and b, we could find the Lowest Common Ancestor (LCA) in the tree. The distance check would require computing paths.

This brute force has several issues:

1. We'd need to compute distances between all pairs: O(n²) pairs
2. For each pair, we need to find if i is on their path: O(n) with simple DFS
3. Total complexity: O(n³) which is far too slow for n up to 1000

Even with LCA preprocessing (O(n log n) setup, O(1) queries), we'd still have O(n³) for checking all triples (i,a,b).

The problem requires O(n²) or better solution.

## Optimized Approach

The key insight is that for a fixed central server i, we can:

1. Treat i as the root of the tree
2. For each neighbor (subtree) of i, perform DFS to count how many nodes in that subtree have distance from i divisible by signalSpeed
3. For pairs (a,b) to be connectable through i, a and b must be in different subtrees (otherwise i wouldn't be between them)
4. The number of pairs = sum over all pairs of subtrees: (count_in_subtree1 × count_in_subtree2)

Why does this work? Because in a tree:

- If i is between a and b, then a and b must be in different subtrees when i is the root
- The path a-i-b distance = distance(a,i) + distance(b,i)
- We require both distances individually divisible by signalSpeed

We can compute this efficiently by:

1. For each server i as potential central server (O(n) iterations)
2. For each neighbor of i, run DFS to count divisible-distance nodes in that subtree (O(n) total per i)
3. Combine counts from different subtrees (O(k²) where k is degree of i)

Total complexity: O(n²) which is acceptable for n ≤ 1000.

## Optimal Solution

The solution uses DFS from each node to count divisible-distance nodes in each subtree. We need to be careful to avoid double-counting and to handle the tree structure correctly.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
class Solution:
    def countPairsOfConnectableServers(self, edges: List[List[int]], signalSpeed: int) -> List[int]:
        n = len(edges) + 1  # n vertices, n-1 edges

        # Build adjacency list for the tree
        # Each entry: (neighbor, weight)
        graph = [[] for _ in range(n)]
        for a, b, w in edges:
            graph[a].append((b, w))
            graph[b].append((a, w))

        result = [0] * n

        # For each server as the potential central server
        for center in range(n):
            # List to store counts from each subtree
            subtree_counts = []

            # DFS to count nodes with distance divisible by signalSpeed
            # from center in each subtree
            for neighbor, weight in graph[center]:
                # Count how many nodes in this subtree have
                # (distance from center) % signalSpeed == 0
                count = self.dfs(
                    graph, neighbor, center,
                    weight % signalSpeed, signalSpeed
                )
                subtree_counts.append(count)

            # Calculate number of pairs connectable through center
            # Pairs must come from different subtrees
            total_pairs = 0
            m = len(subtree_counts)

            # For each pair of different subtrees
            for i in range(m):
                for j in range(i + 1, m):
                    # Each node from subtree i can pair with each node from subtree j
                    total_pairs += subtree_counts[i] * subtree_counts[j]

            result[center] = total_pairs

        return result

    def dfs(self, graph, node, parent, current_dist_mod, signalSpeed):
        """
        Count nodes in subtree rooted at 'node' (with parent 'parent')
        where (distance from original center) % signalSpeed == 0.

        current_dist_mod: current distance modulo signalSpeed from the center
        Returns: count of nodes in this subtree satisfying the condition
        """
        # Check if current node satisfies the condition
        count = 1 if current_dist_mod == 0 else 0

        # Explore all neighbors except the parent (to avoid going back)
        for neighbor, weight in graph[node]:
            if neighbor == parent:
                continue

            # Update distance modulo signalSpeed
            new_dist_mod = (current_dist_mod + weight) % signalSpeed

            # Recursively count in child subtree
            count += self.dfs(
                graph, neighbor, node,
                new_dist_mod, signalSpeed
            )

        return count
```

```javascript
// Time: O(n²) | Space: O(n)
/**
 * @param {number[][]} edges
 * @param {number} signalSpeed
 * @return {number[]}
 */
var countPairsOfConnectableServers = function (edges, signalSpeed) {
  const n = edges.length + 1;

  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b, w] of edges) {
    graph[a].push([b, w]);
    graph[b].push([a, w]);
  }

  const result = new Array(n).fill(0);

  // DFS helper function
  const dfs = (node, parent, currentDistMod) => {
    // Count current node if distance mod signalSpeed is 0
    let count = currentDistMod === 0 ? 1 : 0;

    // Explore all neighbors except parent
    for (const [neighbor, weight] of graph[node]) {
      if (neighbor === parent) continue;

      // Update distance modulo signalSpeed
      const newDistMod = (currentDistMod + weight) % signalSpeed;

      // Recursively count in child subtree
      count += dfs(neighbor, node, newDistMod);
    }

    return count;
  };

  // For each server as potential center
  for (let center = 0; center < n; center++) {
    const subtreeCounts = [];

    // Get counts from each subtree
    for (const [neighbor, weight] of graph[center]) {
      const count = dfs(neighbor, center, weight % signalSpeed);
      subtreeCounts.push(count);
    }

    // Calculate pairs from different subtrees
    let totalPairs = 0;
    const m = subtreeCounts.length;

    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        totalPairs += subtreeCounts[i] * subtreeCounts[j];
      }
    }

    result[center] = totalPairs;
  }

  return result;
};
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    public int[] countPairsOfConnectableServers(int[][] edges, int signalSpeed) {
        int n = edges.length + 1;

        // Build adjacency list
        List<int[]>[] graph = new List[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int a = edge[0], b = edge[1], w = edge[2];
            graph[a].add(new int[]{b, w});
            graph[b].add(new int[]{a, w});
        }

        int[] result = new int[n];

        // For each server as potential center
        for (int center = 0; center < n; center++) {
            List<Integer> subtreeCounts = new ArrayList<>();

            // Get counts from each subtree
            for (int[] neighborInfo : graph[center]) {
                int neighbor = neighborInfo[0];
                int weight = neighborInfo[1];

                int count = dfs(
                    graph, neighbor, center,
                    weight % signalSpeed, signalSpeed
                );
                subtreeCounts.add(count);
            }

            // Calculate pairs from different subtrees
            int totalPairs = 0;
            int m = subtreeCounts.size();

            for (int i = 0; i < m; i++) {
                for (int j = i + 1; j < m; j++) {
                    totalPairs += subtreeCounts.get(i) * subtreeCounts.get(j);
                }
            }

            result[center] = totalPairs;
        }

        return result;
    }

    private int dfs(List<int[]>[] graph, int node, int parent,
                   int currentDistMod, int signalSpeed) {
        // Count current node if distance mod signalSpeed is 0
        int count = (currentDistMod == 0) ? 1 : 0;

        // Explore all neighbors except parent
        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0];
            int weight = neighborInfo[1];

            if (neighbor == parent) continue;

            // Update distance modulo signalSpeed
            int newDistMod = (currentDistMod + weight) % signalSpeed;

            // Recursively count in child subtree
            count += dfs(graph, neighbor, node, newDistMod, signalSpeed);
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through each of n nodes as potential center: O(n)
- For each center, we run DFS on each subtree. Each DFS visits each node in that subtree exactly once
- Across all DFS calls for a given center, we visit all n-1 other nodes: O(n)
- Combining subtree counts takes O(k²) where k is the degree of the center. In worst case (star tree), k = n-1, giving O(n²)
- Total: O(n × n) = O(n²)

**Space Complexity: O(n)**

- Graph adjacency list: O(n) for n nodes, storing 2×(n-1) edges
- DFS recursion stack: O(n) in worst case (linear tree)
- Subtree counts list: O(n) in worst case (star tree)
- Total: O(n)

## Common Mistakes

1. **Not handling modulo arithmetic correctly**: Forgetting to take `weight % signalSpeed` when starting DFS from neighbors of the center. If we don't do this, distances can overflow, and more importantly, we need to track distance modulo signalSpeed, not the actual distance.

2. **Counting pairs within the same subtree**: The problem requires servers to be in different subtrees relative to the center. If you count all pairs of divisible-distance nodes without checking they're in different subtrees, you'll overcount.

3. **Forgetting that the center itself can be counted**: If distance from center to itself is 0, and 0 % signalSpeed == 0, then the center should be included in counts. Our DFS doesn't include the center because we start from neighbors, but when a neighbor's subtree has distance divisible by signalSpeed, it correctly counts nodes in that subtree.

4. **Inefficient pair counting**: After getting subtree counts [c1, c2, c3, ...], some candidates might sum all c_i × c_j for i ≠ j using nested loops but forget to divide by 2 or use the wrong indices. The correct approach is to sum c_i × c_j for all i < j.

## When You'll See This Pattern

This "root at each node and analyze subtrees" pattern appears in several tree problems:

1. **Minimum Height Trees (LeetCode 310)**: To find the root that minimizes tree height, you can think about the longest path from each node to leaves in all subtrees. The optimal roots are the centers of the longest path in the tree.

2. **Sum of Distances in Tree (LeetCode 834)**: This uses a similar two-pass DFS approach where you first compute subtree sizes and distances from root, then use those to compute distances from every other node.

3. **Count Subtrees With Max Distance Between Cities (LeetCode 1617)**: Another problem requiring subtree analysis and distance calculations in trees.

The common theme is analyzing properties (distances, counts) in subtrees when treating different nodes as roots, often using DFS with parent parameters to avoid cycles.

## Key Takeaways

1. **Tree centroid thinking**: When a problem asks about paths through a specific node, consider making that node the root and analyzing its subtrees separately. The "different subtrees" condition is key for ensuring the node lies between the paired elements.

2. **Modulo distance tracking**: For divisibility conditions on path lengths, track distances modulo the divisor during DFS rather than full distances. This saves space and handles large weights.

3. **Pair counting from groups**: When counting pairs from different groups (subtrees), the formula is sum over all i<j of (count_i × count_j). This avoids double-counting and is more efficient than checking all pairs individually.

Related problems: [Minimum Height Trees](/problem/minimum-height-trees), [Sum of Distances in Tree](/problem/sum-of-distances-in-tree)
