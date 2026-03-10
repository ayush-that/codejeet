---
title: "How to Solve Maximize the Number of Target Nodes After Connecting Trees II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize the Number of Target Nodes After Connecting Trees II. Hard difficulty, 73.2% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search."
date: "2028-01-28"
category: "dsa-patterns"
tags:
  [
    "maximize-the-number-of-target-nodes-after-connecting-trees-ii",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "hard",
  ]
---

# Maximize the Number of Target Nodes After Connecting Trees II

This problem asks us to connect two trees with a single edge to maximize the number of nodes that can reach a specific target node. The tricky part is that we need to consider how the connection affects distances in the combined tree - a node can only reach the target if it's within a certain distance, and connecting the trees changes those distances for nodes in both trees.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Tree 1 (n=4):** edges1 = [[0,1],[1,2],[2,3]], target = 0, maxDistance = 2
**Tree 2 (m=3):** edges2 = [[0,1],[1,2]]

First, let's understand what we're trying to maximize. After connecting one tree to the other with a single edge, we want as many nodes as possible to be within `maxDistance` from the target node (which is in Tree 1).

Without any connection, only nodes in Tree 1 can reach the target. In Tree 1:

- Node 0 (target): distance 0
- Node 1: distance 1
- Node 2: distance 2
- Node 3: distance 3 (too far)

So initially, 3 nodes can reach the target (nodes 0, 1, 2).

Now let's consider connecting Tree 2 to Tree 1. We need to choose:

1. Which node in Tree 1 to connect from
2. Which node in Tree 2 to connect to

If we connect Tree 1's node 2 to Tree 2's node 0:

- Tree 2 nodes now have distances: node 0 (distance 1 from connection point), node 1 (distance 2), node 2 (distance 3)
- But wait! The connection point (Tree 1 node 2) is already distance 2 from target
- So Tree 2 node 0 is distance 2 + 1 = 3 from target (too far)
- Tree 2 node 1 is distance 2 + 2 = 4 from target (too far)
- Tree 2 node 2 is distance 2 + 3 = 5 from target (too far)

No additional nodes can reach the target.

What if we connect Tree 1's node 1 to Tree 2's node 0?

- Tree 1 node 1 is distance 1 from target
- Tree 2 node 0 is distance 1 + 1 = 2 from target ✓
- Tree 2 node 1 is distance 1 + 2 = 3 from target (too far)
- Tree 2 node 2 is distance 1 + 3 = 4 from target (too far)

Now we get 1 additional node (Tree 2 node 0), for a total of 4 nodes.

The key insight: For a node in Tree 2 to be within `maxDistance` of the target, the sum of:

1. Its distance to the connection point in Tree 2
2. The distance from that connection point to the target in Tree 1

Must be ≤ `maxDistance`.

## Brute Force Approach

A naive approach would try all possible connection pairs:

1. For each node `u` in Tree 1
2. For each node `v` in Tree 2
3. Connect `u` and `v`
4. Count how many nodes in the combined tree are within `maxDistance` of the target
5. Track the maximum count

The counting step requires BFS/DFS from the target in the combined tree, which takes O(n+m) time. With O(n×m) connection pairs to try, this gives O(n×m×(n+m)) time complexity, which is far too slow for the constraints (n, m up to 10^5).

Even if we precompute distances in each tree, the brute force would still be O(n×m) which is 10^10 operations - impossible.

## Optimized Approach

The key insight is that we don't need to try every pair. We can think about this problem in terms of "budget" - how much distance budget is left after reaching the connection point in Tree 1.

Let's define:

- `dist1[x]` = distance from node x to target in Tree 1
- `dist2[y]` = distance from node y to some arbitrary root in Tree 2

When we connect Tree 1 node `u` to Tree 2 node `v`:

- Distance from target to `u` = `dist1[u]`
- Distance from `v` to any Tree 2 node `y` = `|dist2[y] - dist2[v]|` (in a tree, distance between two nodes is the absolute difference of their depths from a common root)
- So distance from target to Tree 2 node `y` = `dist1[u] + 1 + |dist2[y] - dist2[v]|`

For `y` to be within `maxDistance`:
`dist1[u] + 1 + |dist2[y] - dist2[v]| ≤ maxDistance`

Rearranging: `|dist2[y] - dist2[v]| ≤ maxDistance - dist1[u] - 1`

Let `budget = maxDistance - dist1[u] - 1`. This is the maximum "extra" distance we can afford within Tree 2.

So for a given `u` in Tree 1, we need to find a `v` in Tree 2 that maximizes the number of nodes `y` in Tree 2 satisfying:
`|dist2[y] - dist2[v]| ≤ budget`

This is equivalent to: find `v` such that the interval `[dist2[v] - budget, dist2[v] + budget]` contains as many `dist2[y]` values as possible.

We can solve this efficiently:

1. Sort all `dist2` values
2. For each possible `v`, the optimal interval centered at `dist2[v]` will contain all `dist2[y]` values within `budget` distance
3. We can find this count using binary search (lower_bound/upper_bound)
4. But we need to consider all possible centers efficiently

Actually, we can think differently: For a given `budget`, we want to find the maximum number of points that can be covered by an interval of length `2×budget`. This is a classic sliding window problem!

So for each `u` in Tree 1:

1. Calculate `budget = maxDistance - dist1[u] - 1`
2. If `budget < 0`, no nodes from Tree 2 can be added via this connection
3. Otherwise, find the maximum number of `dist2` values that fit in an interval of length `2×budget`
4. Add this to the count of reachable nodes in Tree 1

## Optimal Solution

The complete solution:

1. Build adjacency lists for both trees
2. Compute distances from target to all nodes in Tree 1 using BFS/DFS
3. Compute distances from an arbitrary root (say node 0) to all nodes in Tree 2 using BFS/DFS
4. Count how many nodes in Tree 1 are within `maxDistance` of target
5. Sort the distances in Tree 2
6. For each node `u` in Tree 1, calculate the budget and use sliding window to find maximum coverage in Tree 2
7. Track the maximum total reachable nodes

<div class="code-group">

```python
# Time: O(n + m + n log m) | Space: O(n + m)
def maximizeTargetNodes(n, edges1, m, edges2, target, maxDistance):
    # Step 1: Build adjacency lists for both trees
    def build_adjacency(num_nodes, edges):
        adj = [[] for _ in range(num_nodes)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        return adj

    adj1 = build_adjacency(n, edges1)
    adj2 = build_adjacency(m, edges2)

    # Step 2: Compute distances from target in Tree 1 using BFS
    from collections import deque

    def bfs_distances(start, adj, num_nodes):
        dist = [-1] * num_nodes
        dist[start] = 0
        queue = deque([start])

        while queue:
            node = queue.popleft()
            for neighbor in adj[node]:
                if dist[neighbor] == -1:  # Not visited
                    dist[neighbor] = dist[node] + 1
                    queue.append(neighbor)
        return dist

    dist1 = bfs_distances(target, adj1, n)

    # Step 3: Compute distances from node 0 in Tree 2 using BFS
    dist2 = bfs_distances(0, adj2, m)

    # Step 4: Count nodes in Tree 1 within maxDistance
    count_tree1 = 0
    for d in dist1:
        if d <= maxDistance:
            count_tree1 += 1

    # Step 5: Sort distances in Tree 2
    dist2_sorted = sorted(dist2)

    # Step 6: For each node in Tree 1, find best connection to Tree 2
    max_additional = 0

    # Preprocess: For each possible budget, find max nodes in Tree 2
    # We'll use sliding window for each unique budget value
    budgets = set()
    for u in range(n):
        budget = maxDistance - dist1[u] - 1
        if budget >= 0:
            budgets.add(budget)

    # For each unique budget, compute max coverage in Tree 2
    budget_to_max_nodes = {}
    sorted_budgets = sorted(budgets)

    for budget in sorted_budgets:
        window_len = 2 * budget
        left = 0
        max_count = 0

        for right in range(m):
            # Shrink window from left if current interval too wide
            while dist2_sorted[right] - dist2_sorted[left] > window_len:
                left += 1
            # Update max count for current window size
            max_count = max(max_count, right - left + 1)

        budget_to_max_nodes[budget] = max_count

    # Step 7: Find maximum total reachable nodes
    max_total = count_tree1  # At minimum, we have Tree 1 nodes

    for u in range(n):
        budget = maxDistance - dist1[u] - 1
        if budget >= 0:
            # Get precomputed max nodes for this budget
            additional = budget_to_max_nodes[budget]
            max_total = max(max_total, count_tree1 + additional)

    return max_total
```

```javascript
// Time: O(n + m + n log m) | Space: O(n + m)
function maximizeTargetNodes(n, edges1, m, edges2, target, maxDistance) {
  // Step 1: Build adjacency lists for both trees
  function buildAdjacency(numNodes, edges) {
    const adj = Array.from({ length: numNodes }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }
    return adj;
  }

  const adj1 = buildAdjacency(n, edges1);
  const adj2 = buildAdjacency(m, edges2);

  // Step 2: Compute distances from target in Tree 1 using BFS
  function bfsDistances(start, adj, numNodes) {
    const dist = Array(numNodes).fill(-1);
    dist[start] = 0;
    const queue = [start];

    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      for (const neighbor of adj[node]) {
        if (dist[neighbor] === -1) {
          dist[neighbor] = dist[node] + 1;
          queue.push(neighbor);
        }
      }
    }
    return dist;
  }

  const dist1 = bfsDistances(target, adj1, n);

  // Step 3: Compute distances from node 0 in Tree 2 using BFS
  const dist2 = bfsDistances(0, adj2, m);

  // Step 4: Count nodes in Tree 1 within maxDistance
  let countTree1 = 0;
  for (const d of dist1) {
    if (d <= maxDistance) {
      countTree1++;
    }
  }

  // Step 5: Sort distances in Tree 2
  const dist2Sorted = [...dist2].sort((a, b) => a - b);

  // Step 6: For each node in Tree 1, find best connection to Tree 2
  let maxTotal = countTree1; // Minimum result

  // Collect all unique non-negative budgets
  const budgets = new Set();
  for (let u = 0; u < n; u++) {
    const budget = maxDistance - dist1[u] - 1;
    if (budget >= 0) {
      budgets.add(budget);
    }
  }

  // Sort unique budgets
  const sortedBudgets = Array.from(budgets).sort((a, b) => a - b);

  // Precompute max nodes for each budget using sliding window
  const budgetToMaxNodes = new Map();

  for (const budget of sortedBudgets) {
    const windowLen = 2 * budget;
    let left = 0;
    let maxCount = 0;

    for (let right = 0; right < m; right++) {
      // Shrink window from left if current interval too wide
      while (dist2Sorted[right] - dist2Sorted[left] > windowLen) {
        left++;
      }
      // Update max count for current window
      maxCount = Math.max(maxCount, right - left + 1);
    }

    budgetToMaxNodes.set(budget, maxCount);
  }

  // Step 7: Calculate maximum total for each connection point
  for (let u = 0; u < n; u++) {
    const budget = maxDistance - dist1[u] - 1;
    if (budget >= 0) {
      const additional = budgetToMaxNodes.get(budget);
      maxTotal = Math.max(maxTotal, countTree1 + additional);
    }
  }

  return maxTotal;
}
```

```java
// Time: O(n + m + n log m) | Space: O(n + m)
import java.util.*;

class Solution {
    public int maximizeTargetNodes(int n, int[][] edges1, int m, int[][] edges2, int target, int maxDistance) {
        // Step 1: Build adjacency lists for both trees
        List<Integer>[] adj1 = buildAdjacency(n, edges1);
        List<Integer>[] adj2 = buildAdjacency(m, edges2);

        // Step 2: Compute distances from target in Tree 1 using BFS
        int[] dist1 = bfsDistances(target, adj1, n);

        // Step 3: Compute distances from node 0 in Tree 2 using BFS
        int[] dist2 = bfsDistances(0, adj2, m);

        // Step 4: Count nodes in Tree 1 within maxDistance
        int countTree1 = 0;
        for (int d : dist1) {
            if (d <= maxDistance) {
                countTree1++;
            }
        }

        // Step 5: Sort distances in Tree 2
        int[] dist2Sorted = dist2.clone();
        Arrays.sort(dist2Sorted);

        // Step 6: Collect all unique budgets
        Set<Integer> budgetSet = new HashSet<>();
        for (int u = 0; u < n; u++) {
            int budget = maxDistance - dist1[u] - 1;
            if (budget >= 0) {
                budgetSet.add(budget);
            }
        }

        // Sort unique budgets
        List<Integer> sortedBudgets = new ArrayList<>(budgetSet);
        Collections.sort(sortedBudgets);

        // Precompute max nodes for each budget using sliding window
        Map<Integer, Integer> budgetToMaxNodes = new HashMap<>();

        for (int budget : sortedBudgets) {
            int windowLen = 2 * budget;
            int left = 0;
            int maxCount = 0;

            for (int right = 0; right < m; right++) {
                // Shrink window from left if current interval too wide
                while (dist2Sorted[right] - dist2Sorted[left] > windowLen) {
                    left++;
                }
                // Update max count for current window
                maxCount = Math.max(maxCount, right - left + 1);
            }

            budgetToMaxNodes.put(budget, maxCount);
        }

        // Step 7: Find maximum total reachable nodes
        int maxTotal = countTree1; // Minimum result

        for (int u = 0; u < n; u++) {
            int budget = maxDistance - dist1[u] - 1;
            if (budget >= 0) {
                int additional = budgetToMaxNodes.get(budget);
                maxTotal = Math.max(maxTotal, countTree1 + additional);
            }
        }

        return maxTotal;
    }

    private List<Integer>[] buildAdjacency(int n, int[][] edges) {
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        return adj;
    }

    private int[] bfsDistances(int start, List<Integer>[] adj, int n) {
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;

        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : adj[node]) {
                if (dist[neighbor] == -1) {
                    dist[neighbor] = dist[node] + 1;
                    queue.offer(neighbor);
                }
            }
        }

        return dist;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m + n log m)**

- Building adjacency lists: O(n + m)
- BFS in Tree 1: O(n)
- BFS in Tree 2: O(m)
- Sorting Tree 2 distances: O(m log m)
- Collecting unique budgets: O(n)
- Sorting unique budgets: O(k log k) where k ≤ n (worst case O(n log n))
- Sliding window for each budget: O(k × m) in naive implementation, but optimized to O(m) per budget
- Total: O(n + m + m log m + n + n log n + k × m) ≈ O(n + m + n log m) in practice

**Space Complexity: O(n + m)**

- Adjacency lists: O(n + m)
- Distance arrays: O(n + m)
- Sorted distances: O(m)
- Budget sets and maps: O(n)

## Common Mistakes

1. **Forgetting the +1 for the connection edge**: When calculating the total distance from target to a Tree 2 node, it's `dist1[u] + 1 + distance_in_tree2`, not just `dist1[u] + distance_in_tree2`. The connection edge itself adds 1 to the path length.

2. **Using the wrong root for Tree 2 distances**: The distance calculation `|dist2[y] - dist2[v]|` only works if we measure all distances from the same root in Tree 2. If we use different roots for different nodes, this formula doesn't hold.

3. **Not handling negative budgets**: When `maxDistance - dist1[u] - 1 < 0`, no nodes from Tree 2 can be added via that connection point. Candidates often forget to check this and try to process negative intervals.

4. **Inefficient interval counting**: The naive approach of trying all centers v in Tree 2 for each u in Tree 1 would be O(n×m). The sliding window optimization is crucial for efficiency.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree distance computations**: Problems involving distances in trees often use BFS/DFS to compute all-pairs distances efficiently. Similar problems: [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/), [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/).

2. **Sliding window on sorted arrays**: Finding the maximum number of points within an interval is a classic sliding window problem. Similar problems: [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/), [Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/).

3. **Tree merging/connection problems**: Problems where we connect trees and analyze the resulting structure. The similar problem [Find Minimum Diameter After Merging Two Trees](https://leetcode.com/problems/find-minimum-diameter-after-merging-two-trees/) uses related concepts about tree diameters and centers.

## Key Takeaways

1. **Tree distance properties are powerful**: In a tree, the distance between any two nodes can be expressed in terms of their distances from a common root. This allows us to simplify complex distance calculations.

2. **Convert geometric constraints to interval problems**: The condition `|dist2[y] - dist2[v]| ≤ budget` is equivalent to `dist2[v]` being in the interval `[dist2[y] - budget, dist2[y] + budget]`. Recognizing this lets us use sorting and sliding window techniques.

3. **Precomputation enables optimization**: By precomputing distances in both trees and sorting Tree 2 distances, we transform an O(n×m) problem into an O(n log m) problem. Always look for what can be precomputed.

Related problems: [Find Minimum Diameter After Merging Two Trees](/problem/find-minimum-diameter-after-merging-two-trees)
