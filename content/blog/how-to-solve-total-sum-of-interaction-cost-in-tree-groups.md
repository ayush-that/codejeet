---
title: "How to Solve Total Sum of Interaction Cost in Tree Groups — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Total Sum of Interaction Cost in Tree Groups. Hard difficulty, 53.5% acceptance rate. Topics: Array, Tree, Depth-First Search."
date: "2026-07-25"
category: "dsa-patterns"
tags:
  ["total-sum-of-interaction-cost-in-tree-groups", "array", "tree", "depth-first-search", "hard"]
---

# How to Solve Total Sum of Interaction Cost in Tree Groups

This problem asks us to calculate the total "interaction cost" in a tree where nodes are grouped. The interaction cost between two nodes is defined as the product of their group values multiplied by the distance between them. We need to sum this cost over all pairs of nodes in the tree. What makes this problem tricky is that we can't simply check all pairs (O(n²) is too slow for n up to 10⁵), so we need a clever way to compute the sum by leveraging the tree structure.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
n = 4
edges = [[0,1],[1,2],[1,3]]
group = [2,3,1,4]
```

We have a tree where node 1 is connected to nodes 0, 2, and 3. The group values are shown above each node.

First, let's understand what we're calculating. For each pair of nodes (u,v), we compute:

- Distance between u and v (number of edges on the path)
- Multiply by group[u] × group[v]
- Sum over all pairs

Let's compute manually for our small tree:

**Pairs and their costs:**

- (0,1): distance = 1, cost = 2×3×1 = 6
- (0,2): distance = 2, cost = 2×1×2 = 4
- (0,3): distance = 2, cost = 2×4×2 = 16
- (1,2): distance = 1, cost = 3×1×1 = 3
- (1,3): distance = 1, cost = 3×4×1 = 12
- (2,3): distance = 2, cost = 1×4×2 = 8

**Total sum:** 6 + 4 + 16 + 3 + 12 + 8 = 49

The brute force approach would compute all n(n-1)/2 pairs, but with n up to 10⁵, that's 5×10⁹ operations - far too many. We need a smarter approach.

## Brute Force Approach

The most straightforward solution would be:

1. Build the tree adjacency list
2. For each pair of nodes (u,v):
   - Use BFS/DFS to find distance between u and v
   - Add group[u] × group[v] × distance to total
3. Return total

This approach has O(n³) time complexity if we use BFS for each pair (O(n²) pairs × O(n) BFS), or O(n²) if we precompute all-pairs shortest paths using Floyd-Warshall, but that still requires O(n²) memory which is impossible for n=10⁵.

The key insight is that we don't need to compute distances between every pair directly. Instead, we can think about how each edge contributes to the total sum.

## Optimized Approach

The crucial observation is that for any edge connecting two parts of the tree, every path between nodes on opposite sides of that edge must cross it. This means we can calculate each edge's contribution to the total sum.

**Step-by-step reasoning:**

1. **Edge contribution thinking:** Consider an edge (u,v). If we remove this edge, the tree splits into two components. Every path from a node in component A to a node in component B must cross edge (u,v). So edge (u,v) contributes to the distance between all such pairs.

2. **Counting contributions:** For edge (u,v), it will be counted in the distance for every pair (x,y) where x is in u's component and y is in v's component (after removing the edge). So edge (u,v) contributes: (sum of group values in u's component) × (sum of group values in v's component).

3. **Efficient computation:** We need to compute, for each edge, the sum of group values on each side. We can do this with DFS:
   - Root the tree at any node (say node 0)
   - For each node, compute the sum of group values in its subtree
   - For edge (u,v) where u is parent of v:
     - Sum in v's subtree = subtree_sum[v]
     - Sum in the rest of the tree = total_sum - subtree_sum[v]
     - Contribution = subtree_sum[v] × (total_sum - subtree_sum[v])

4. **Final formula:** Total cost = Σ over all edges (subtree_sum[v] × (total_sum - subtree_sum[v]))

This works because each edge contributes exactly once to the distance between every pair of nodes that are separated by that edge.

## Optimal Solution

Here's the complete implementation using DFS to compute subtree sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def totalInteractionCost(n, edges, group):
    """
    Calculate total interaction cost for all node pairs in a tree.

    Args:
        n: Number of nodes
        edges: List of undirected edges
        group: List of group values for each node

    Returns:
        Total interaction cost modulo 10^9+7
    """
    MOD = 10**9 + 7

    # Step 1: Build adjacency list for the tree
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    # Step 2: Compute total sum of all group values
    total_sum = sum(group) % MOD

    # Step 3: DFS to compute subtree sums and accumulate result
    result = 0
    visited = [False] * n

    def dfs(node, parent):
        nonlocal result
        visited[node] = True

        # Start with current node's group value
        subtree_sum = group[node]

        # Process all neighbors except parent
        for neighbor in adj[node]:
            if neighbor == parent:
                continue

            # Get sum from child's subtree
            child_sum = dfs(neighbor, node)

            # Add child's sum to current subtree
            subtree_sum = (subtree_sum + child_sum) % MOD

            # Calculate this edge's contribution:
            # For edge (node, neighbor), where neighbor is child:
            # - Sum in child's subtree = child_sum
            # - Sum in rest of tree = total_sum - child_sum
            # Each path from node in child's subtree to node outside
            # must cross this edge, so it contributes child_sum * (total_sum - child_sum)
            contribution = (child_sum * (total_sum - child_sum)) % MOD
            result = (result + contribution) % MOD

        return subtree_sum

    # Start DFS from node 0 (any node works)
    dfs(0, -1)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate total interaction cost for all node pairs in a tree.
 *
 * @param {number} n - Number of nodes
 * @param {number[][]} edges - List of undirected edges
 * @param {number[]} group - List of group values for each node
 * @return {number} Total interaction cost modulo 10^9+7
 */
function totalInteractionCost(n, edges, group) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Build adjacency list for the tree
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: Compute total sum of all group values
  let totalSum = 0;
  for (const val of group) {
    totalSum = (totalSum + val) % MOD;
  }

  // Step 3: DFS to compute subtree sums and accumulate result
  let result = 0;
  const visited = new Array(n).fill(false);

  function dfs(node, parent) {
    visited[node] = true;

    // Start with current node's group value
    let subtreeSum = group[node];

    // Process all neighbors except parent
    for (const neighbor of adj[node]) {
      if (neighbor === parent) continue;

      // Get sum from child's subtree
      const childSum = dfs(neighbor, node);

      // Add child's sum to current subtree
      subtreeSum = (subtreeSum + childSum) % MOD;

      // Calculate this edge's contribution
      // For edge (node, neighbor), where neighbor is child:
      // - Sum in child's subtree = childSum
      // - Sum in rest of tree = totalSum - childSum
      const contribution = (childSum * (totalSum - childSum)) % MOD;
      result = (result + contribution) % MOD;
    }

    return subtreeSum;
  }

  // Start DFS from node 0 (any node works)
  dfs(0, -1);

  // Ensure result is non-negative
  return (result + MOD) % MOD;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    private static final int MOD = 1_000_000_007;
    private List<Integer>[] adj;
    private int[] group;
    private long totalSum;
    private long result;

    public int totalInteractionCost(int n, int[][] edges, int[] group) {
        // Step 1: Build adjacency list for the tree
        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        this.group = group;

        // Step 2: Compute total sum of all group values
        totalSum = 0;
        for (int val : group) {
            totalSum = (totalSum + val) % MOD;
        }

        // Step 3: DFS to compute subtree sums and accumulate result
        result = 0;
        boolean[] visited = new boolean[n];
        dfs(0, -1, visited);

        return (int)(result % MOD);
    }

    private long dfs(int node, int parent, boolean[] visited) {
        visited[node] = true;

        // Start with current node's group value
        long subtreeSum = group[node];

        // Process all neighbors except parent
        for (int neighbor : adj[node]) {
            if (neighbor == parent) continue;

            // Get sum from child's subtree
            long childSum = dfs(neighbor, node, visited);

            // Add child's sum to current subtree
            subtreeSum = (subtreeSum + childSum) % MOD;

            // Calculate this edge's contribution
            // For edge (node, neighbor), where neighbor is child:
            // - Sum in child's subtree = childSum
            // - Sum in rest of tree = totalSum - childSum
            long contribution = (childSum * (totalSum - childSum)) % MOD;
            result = (result + contribution) % MOD;
        }

        return subtreeSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We build the adjacency list in O(n) time (n-1 edges)
- We compute total sum in O(n) time
- We perform a single DFS traversal visiting each node once: O(n)
- Each edge is processed exactly once in DFS: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity:** O(n)

- Adjacency list stores 2×(n-1) edges: O(n)
- Visited array: O(n)
- Recursion stack depth up to n in worst case (linear tree): O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting modulo operations:** The result can be huge (up to n² × max(group)²), so we need to apply modulo 10⁹+7 at each addition/multiplication. A common mistake is to compute everything then mod at the end, which can cause integer overflow.

2. **Incorrect edge contribution formula:** Some candidates try to compute contribution as `subtree_sum × (n - subtree_size)` instead of `subtree_sum × (total_sum - subtree_sum)`. Remember we're working with group value sums, not node counts.

3. **Double-counting edges:** When processing an edge (u,v), we must ensure we count it only once. In our DFS approach, we only process edges where we go from parent to child, not both directions.

4. **Not handling large recursion depth:** For a linear tree with n=10⁵, recursion depth could be 10⁵ which might cause stack overflow in some languages. An iterative DFS using a stack is safer for production code.

## When You'll See This Pattern

This "edge contribution" or "path decomposition" pattern appears in several tree problems:

1. **Sum of Distances in a Tree (LeetCode 834):** Very similar concept - instead of group values, we count nodes, and instead of multiplying by group values, we just sum distances. The edge contribution idea is identical.

2. **Binary Tree Cameras (LeetCode 968):** Uses tree DP with state transitions, similar to how we propagate subtree information upward.

3. **Tree Diameter (LeetCode 543):** Involves computing properties of subtrees and combining them, though simpler than this problem.

The key insight across these problems is that instead of considering all pairs directly, we think about how each edge or node contributes to the final answer based on subtree properties.

## Key Takeaways

1. **Think in terms of contributions:** When asked to compute a sum over all pairs in a tree, consider how each edge contributes to the total. This often leads to O(n) solutions instead of O(n²).

2. **Subtree sums are powerful:** Many tree problems can be solved by computing subtree sums (of values, sizes, or other properties) and using them to calculate contributions efficiently.

3. **DFS is your friend for trees:** Depth-first search naturally computes subtree properties in a bottom-up manner, making it ideal for problems where we need information about entire subtrees.

[Practice this problem on CodeJeet](/problem/total-sum-of-interaction-cost-in-tree-groups)
