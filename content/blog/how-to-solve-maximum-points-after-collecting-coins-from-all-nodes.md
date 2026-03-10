---
title: "How to Solve Maximum Points After Collecting Coins From All Nodes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Points After Collecting Coins From All Nodes. Hard difficulty, 36.3% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Tree, Depth-First Search."
date: "2026-05-04"
category: "dsa-patterns"
tags:
  [
    "maximum-points-after-collecting-coins-from-all-nodes",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Maximum Points After Collecting Coins From All Nodes

You're given a tree where each node has coins, and you can collect coins from nodes by paying a cost that depends on the number of coins you take. The twist: you can choose to take all coins at a node, or take half (floor division) of them for free, but only if you take half from ALL nodes in its subtree. This creates a complex trade-off between immediate collection and discounted collection that requires careful tree traversal and dynamic programming.

What makes this problem hard is the hierarchical dependency: your decision at a node affects all nodes in its subtree, and you need to consider all possible "discount levels" (how many times you've applied the half operation on the path from root) to find the optimal global solution.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Tree:**

- Nodes: 0 (root), 1, 2
- Edges: [[0,1], [0,2]]
- Coins: [10, 10, 10]
- k = 1 (we can apply the half operation at most once per node path)

**Step-by-step reasoning:**

1. **At leaf nodes (1 and 2):**
   - If we don't apply half: collect 10 coins, cost = 1 (since k=1)
   - If we apply half: collect floor(10/2) = 5 coins, cost = 0
   - For leaf nodes, applying half is better (5 > 10-1=9? Wait, let's calculate properly)

2. **Actually, we need to think in terms of points:**
   - Points = coins_collected - cost
   - Without half: 10 coins - 1 cost = 9 points
   - With half: 5 coins - 0 cost = 5 points
   - So for leaves, NOT applying half is better (9 > 5)

3. **But here's the catch:** If we apply half at node 0 (root), we MUST also apply it to all nodes in its subtree (nodes 1 and 2). So:
   - Option A: No half anywhere
     - Node 0: 10 - 1 = 9
     - Node 1: 10 - 1 = 9
     - Node 2: 10 - 1 = 9
     - Total: 27 points
   - Option B: Apply half at root (and thus to all nodes)
     - Node 0: floor(10/2) - 0 = 5
     - Node 1: floor(10/2) - 0 = 5
     - Node 2: floor(10/2) - 0 = 5
     - Total: 15 points
   - Option C: Apply half only at leaves? Not allowed! If we apply half at a node, it applies to entire subtree.

4. **The optimal is clearly Option A with 27 points.**

This simple example shows the core tension: applying half reduces coins but saves cost, and the decision propagates downward.

## Brute Force Approach

A naive approach would try all possible combinations of where to apply the half operation. For each node, we have 2 choices: apply half or don't. But because applying half at a node forces it on the entire subtree, we can think of this as choosing a set of nodes where we start the half operation.

The brute force would be: for every possible subset of nodes where we apply half (ensuring consistency: if a node is in the subset, all its descendants must also have half applied if any ancestor does), calculate the total points.

Why this fails:

1. **Exponential possibilities:** With n nodes, there are 2^n possible subsets to check
2. **Consistency checking is complex:** Need to ensure the half operation propagates correctly
3. **Even for moderate n (n=1000), 2^1000 is astronomically large**

The brute force is computationally impossible for any reasonable input size.

## Optimized Approach

The key insight is that this is a **tree DP (Dynamic Programming) problem with state**. At each node, we need to know: given that we've applied the half operation `t` times on the path from root to this node (where 0 ≤ t ≤ 14, since 10^4 < 2^14), what's the maximum points we can get from this subtree?

**Why t ≤ 14?** Because coins[i] ≤ 10^4, and applying floor(coin/2) repeatedly will reduce any coin to 0 after at most 14 operations (since 2^14 = 16384 > 10^4).

**DP State:** `dp[node][t]` = maximum points obtainable from the subtree rooted at `node`, given that we've already applied the half operation `t` times on the path from root to this node.

**Transition:**
At each node, we have two choices:

1. **Don't apply half here:**
   - Coins collected: floor(coins[node] / 2^t)
   - Cost: t (since we've applied half t times already)
   - Points from this node: floor(coins[node] / 2^t) - t
   - Add points from children (with same t, since we didn't increment it)
2. **Apply half here (if t < 14):**
   - Coins collected: floor(coins[node] / 2^(t+1))
   - Cost: t (cost is based on t before applying half at this node)
   - Points from this node: floor(coins[node] / 2^(t+1)) - t
   - Add points from children (with t+1, since we incremented it for the subtree)

We take the maximum of these two options.

**Base case:** For leaf nodes, we just compute the two options directly.

This approach works because:

- We consider all possibilities via DP states
- The tree structure lets us compute children independently
- The t parameter captures the essential "history" of half operations

## Optimal Solution

Here's the complete implementation using DFS with memoization:

<div class="code-group">

```python
# Time: O(n * min(k, 14)) where n is number of nodes, k is given parameter
# Space: O(n * min(k, 14)) for the DP table
class Solution:
    def maximumPoints(self, edges: List[List[int]], coins: List[int], k: int) -> int:
        n = len(coins)
        # Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # The key insight: we only need to consider up to 14 half operations
        # because 2^14 > 10^4 (max coin value), so more halves won't change coin value
        max_halves = min(14, k)

        # DP table: dp[node][t] = max points from subtree rooted at node
        # when t half operations have already been applied on the path from root
        dp = [[-1] * (max_halves + 1) for _ in range(n)]

        def dfs(node: int, parent: int, t: int) -> int:
            """Return max points from subtree rooted at node with t halves applied."""
            # If we've already computed this state, return cached result
            if dp[node][t] != -1:
                return dp[node][t]

            # Option 1: Don't apply half operation at this node
            # Coins we get: floor(coins[node] / 2^t)
            # Cost: t (number of halves applied so far)
            coins_without_half = coins[node] >> t  # Equivalent to floor(coins[node] / 2^t)
            points_without = coins_without_half - t

            # Option 2: Apply half operation at this node (if we haven't reached limit)
            points_with = 0
            if t < max_halves:
                coins_with_half = coins[node] >> (t + 1)  # floor(coins[node] / 2^(t+1))
                points_with = coins_with_half - t  # Cost is still t (before applying this half)

            # Now add contributions from children
            child_sum_without = 0
            child_sum_with = 0

            for neighbor in graph[node]:
                if neighbor == parent:
                    continue  # Skip parent to avoid going back up the tree

                # For option 1 (no half here), children inherit same t
                child_sum_without += dfs(neighbor, node, t)

                # For option 2 (half here), children inherit t+1
                if t < max_halves:
                    child_sum_with += dfs(neighbor, node, t + 1)

            # Total points for each option
            total_without = points_without + child_sum_without
            total_with = points_with + child_sum_with if t < max_halves else 0

            # Take the maximum of the two options
            dp[node][t] = max(total_without, total_with)
            return dp[node][t]

        # Start DFS from root (node 0) with 0 halves applied
        return dfs(0, -1, 0)
```

```javascript
// Time: O(n * min(k, 14)) where n is number of nodes, k is given parameter
// Space: O(n * min(k, 14)) for the DP table
var maximumPoints = function (edges, coins, k) {
  const n = coins.length;
  // Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Key insight: we only need to consider up to 14 half operations
  // because 2^14 > 10^4 (max coin value)
  const maxHalves = Math.min(14, k);

  // DP table: dp[node][t] = max points from subtree rooted at node
  // when t half operations have already been applied
  const dp = Array.from({ length: n }, () => Array(maxHalves + 1).fill(-1));

  // DFS function with memoization
  const dfs = (node, parent, t) => {
    // Return cached result if available
    if (dp[node][t] !== -1) {
      return dp[node][t];
    }

    // Option 1: Don't apply half at this node
    // Coins we get: Math.floor(coins[node] / 2^t)
    // Cost: t (number of halves applied so far)
    const coinsWithoutHalf = coins[node] >> t; // Right shift = divide by 2^t
    let pointsWithout = coinsWithoutHalf - t;

    // Option 2: Apply half at this node (if under limit)
    let pointsWith = 0;
    if (t < maxHalves) {
      const coinsWithHalf = coins[node] >> (t + 1); // Divide by 2^(t+1)
      pointsWith = coinsWithHalf - t; // Cost is still t (before this half)
    }

    // Sum contributions from children
    let childSumWithout = 0;
    let childSumWith = 0;

    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue;

      // For option 1: children inherit same t
      childSumWithout += dfs(neighbor, node, t);

      // For option 2: children inherit t+1
      if (t < maxHalves) {
        childSumWith += dfs(neighbor, node, t + 1);
      }
    }

    // Total points for each option
    const totalWithout = pointsWithout + childSumWithout;
    const totalWith = t < maxHalves ? pointsWith + childSumWith : 0;

    // Take maximum of the two options
    dp[node][t] = Math.max(totalWithout, totalWith);
    return dp[node][t];
  };

  // Start DFS from root (node 0) with 0 halves applied
  return dfs(0, -1, 0);
};
```

```java
// Time: O(n * min(k, 14)) where n is number of nodes, k is given parameter
// Space: O(n * min(k, 14)) for the DP table
class Solution {
    private List<Integer>[] graph;
    private int[] coins;
    private int[][] dp;
    private int maxHalves;

    public int maximumPoints(int[][] edges, int[] coins, int k) {
        int n = coins.length;
        this.coins = coins;

        // Build adjacency list for the tree
        graph = new List[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Key insight: we only need to consider up to 14 half operations
        // because 2^14 > 10^4 (max coin value)
        maxHalves = Math.min(14, k);

        // DP table: dp[node][t] = max points from subtree rooted at node
        // when t half operations have already been applied
        dp = new int[n][maxHalves + 1];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], -1);
        }

        // Start DFS from root (node 0) with 0 halves applied
        return dfs(0, -1, 0);
    }

    private int dfs(int node, int parent, int t) {
        // Return cached result if available
        if (dp[node][t] != -1) {
            return dp[node][t];
        }

        // Option 1: Don't apply half at this node
        // Coins we get: coins[node] / 2^t (integer division)
        // Cost: t (number of halves applied so far)
        int coinsWithoutHalf = coins[node] >> t;  // Right shift = divide by 2^t
        int pointsWithout = coinsWithoutHalf - t;

        // Option 2: Apply half at this node (if under limit)
        int pointsWith = 0;
        if (t < maxHalves) {
            int coinsWithHalf = coins[node] >> (t + 1);  // Divide by 2^(t+1)
            pointsWith = coinsWithHalf - t;  // Cost is still t (before this half)
        }

        // Sum contributions from children
        int childSumWithout = 0;
        int childSumWith = 0;

        for (int neighbor : graph[node]) {
            if (neighbor == parent) continue;

            // For option 1: children inherit same t
            childSumWithout += dfs(neighbor, node, t);

            // For option 2: children inherit t+1
            if (t < maxHalves) {
                childSumWith += dfs(neighbor, node, t + 1);
            }
        }

        // Total points for each option
        int totalWithout = pointsWithout + childSumWithout;
        int totalWith = (t < maxHalves) ? (pointsWith + childSumWith) : 0;

        // Take maximum of the two options
        dp[node][t] = Math.max(totalWithout, totalWith);
        return dp[node][t];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × min(k, 14))

- We have n nodes, and for each node we compute up to min(k, 14) states
- Each state computation involves iterating through the node's children (O(degree))
- But each edge is processed exactly twice (once from each endpoint), so total work is O(n × min(k, 14))
- The min(k, 14) bound is crucial: even if k is large, we never need more than 14 because coins become 0 after that

**Space Complexity:** O(n × min(k, 14))

- DP table stores n × (min(k, 14) + 1) integers
- Recursion stack uses O(n) space for DFS
- Adjacency list uses O(n) space

## Common Mistakes

1. **Not bounding t to 14:** Some candidates try to use k directly, which can be up to 10^5. This makes DP table impossibly large (n × 10^5). The key insight is that after 14 halves, any coin becomes 0, so t > 14 is equivalent to t = 14.

2. **Incorrect cost calculation:** The cost for a node is `t` (number of halves applied on the path TO this node), not `t+1` even if you apply half at this node. The problem states the cost is based on halves applied "so far" before collecting.

3. **Forgetting the tree is undirected:** When building the graph and doing DFS, you must track the parent to avoid infinite recursion. Each edge should be added in both directions, but DFS should skip going back to the parent.

4. **Using integer division instead of floor division:** For negative numbers these differ, but here coins are non-negative. Still, using `coins[node] / (1 << t)` in Java/C++ does integer division (floor for non-negatives), which is correct. In Python, use `//` or right shift.

## When You'll See This Pattern

This problem combines **tree DP** with **state compression** (tracking how many times an operation has been applied). Similar patterns appear in:

1. **House Robber III (LeetCode 337):** Tree DP where each node has two states (rob/don't rob) and decisions affect adjacent nodes.

2. **Binary Tree Maximum Path Sum (LeetCode 124):** Tree DP where you compute best path through each node, considering both left and right subtrees.

3. **Sum of Distances in Tree (LeetCode 834):** Tree DP where you compute answers for all nodes using subtree sums and parent contributions.

The key pattern: when a decision at a node affects or is affected by decisions in its subtree, think tree DP with state parameters that capture the necessary "context" from the path above.

## Key Takeaways

1. **Tree DP with state parameters:** When decisions have dependencies along tree paths, add state parameters to your DP that capture the essential history. Here, `t` tracks how many half operations were applied on the path from root.

2. **Look for bounds on state space:** The observation that `t ≤ 14` (because 2^14 > 10^4) is what makes this problem feasible. Always look for constraints that limit your state space.

3. **Bottom-up computation on trees:** For tree DP, DFS post-order traversal is natural: compute answers for children first, then combine them to compute answer for parent.

[Practice this problem on CodeJeet](/problem/maximum-points-after-collecting-coins-from-all-nodes)
