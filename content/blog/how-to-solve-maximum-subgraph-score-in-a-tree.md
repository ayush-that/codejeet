---
title: "How to Solve Maximum Subgraph Score in a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Subgraph Score in a Tree. Hard difficulty, 70.6% acceptance rate. Topics: Array, Dynamic Programming, Tree, Depth-First Search."
date: "2026-08-25"
category: "dsa-patterns"
tags: ["maximum-subgraph-score-in-a-tree", "array", "dynamic-programming", "tree", "hard"]
---

# How to Solve Maximum Subgraph Score in a Tree

You're given a tree with nodes that have "good" values (1 for good, 0 for bad), and you need to find the maximum possible score of a connected subgraph where the score equals the number of good nodes minus the number of bad nodes. The challenge is that you must find the optimal connected subgraph efficiently—trying all possible connected subgraphs would be exponential, which won't work for large trees.

What makes this problem interesting is that it's essentially finding the maximum sum subgraph in a tree, where each node has a weight of +1 (if good) or -1 (if bad). This is similar to the classic "Maximum Subarray Sum" problem (Kadane's algorithm), but adapted to trees instead of arrays.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
Tree: 0-1-2-3
       |
       4

good = [1, 0, 1, 0, 1]  (node 0: good, node 1: bad, node 2: good, node 3: bad, node 4: good)
```

Weights: node 0: +1, node 1: -1, node 2: +1, node 3: -1, node 4: +1

Let's think about possible connected subgraphs:

- Just node 0: score = 1
- Just node 2: score = 1
- Just node 4: score = 1
- Nodes 0-1: score = 1 + (-1) = 0
- Nodes 0-1-2: score = 1 + (-1) + 1 = 1
- Nodes 2-3: score = 1 + (-1) = 0
- Nodes 0-4: score = 1 + 1 = 2 (this is promising!)
- Nodes 0-1-2-3: score = 1 + (-1) + 1 + (-1) = 0
- All nodes: score = 1 + (-1) + 1 + (-1) + 1 = 1

The best we found is nodes 0-4 with score 2. But wait, can we do better? What about nodes 0-1-2-4? That's not connected (no path from 2 to 4 except through 0, but then 1 is included). Actually, the maximum is nodes 0-2-4 with score 3! Let me check connectivity: 0 connects to 2 through 1, so we'd need to include 1. So 0-1-2-4 gives us 1 + (-1) + 1 + 1 = 2.

Actually, the true maximum is nodes 0-2-4 with score 3, but that's not connected. The actual maximum connected subgraph is nodes 0-4 with score 2, or nodes 0-1-2 with score 1, or nodes 2-4-0-1 with score 2. Let me recalculate carefully...

Actually, the tree structure is:

```
0 -- 1 -- 2 -- 3
|
4
```

So the maximum connected subgraph is actually nodes 0-4 with score 2, or we could take nodes 0-1-2 with score 1. Wait, what about nodes 2 alone? Score 1. Or nodes 4 alone? Score 1.

The key insight is that we want to find a connected set of nodes where the sum of weights (good=+1, bad=-1) is maximized. This is like finding the "heaviest" connected component.

## Brute Force Approach

A naive approach would be to try all possible connected subgraphs. For a tree with n nodes, there are exponentially many connected subgraphs (roughly 2^n). We could:

1. Generate all subsets of nodes
2. Check if each subset forms a connected subgraph
3. Calculate the score for valid subsets
4. Track the maximum score

The problem is the exponential time complexity. For n=10^5 (typical constraint), 2^100000 is astronomically large—completely infeasible.

Even if we try to be slightly smarter by doing DFS from each node and exploring all connected subgraphs containing that node, we'd still have exponential complexity in the worst case (a star tree where the center connects to all other nodes).

## Optimized Approach

The key insight is that this problem is essentially finding the maximum sum path in a tree, but for connected subgraphs rather than simple paths. Actually, for trees, any connected subgraph is itself a tree. The maximum score connected subgraph will be the maximum sum subtree.

We can solve this using tree DP (dynamic programming on trees) with a post-order DFS traversal. Here's the reasoning:

1. **Transform the problem**: Assign each node a weight: +1 if good, -1 if bad. We want to find a connected subgraph (subtree) with maximum sum of weights.

2. **DP State**: Let `dp[u]` be the maximum sum we can achieve in the subtree rooted at `u`, **including node u** and possibly some of its descendants, but the subgraph must be connected and contain `u`.

3. **Recurrence Relation**:
   - Base case: For a leaf node, `dp[u] = weight[u]` (we can either take just this node)
   - For an internal node `u` with children `v1, v2, ...`:
     - We start with just node `u`: `dp[u] = weight[u]`
     - For each child `v`, if `dp[v] > 0`, we add it to our subgraph because it increases our total score
     - So: `dp[u] = weight[u] + sum(max(0, dp[v]) for v in children of u)`

4. **Why this works**:
   - The subgraph must be connected and contain `u`
   - We can choose to include a child's subtree only if it contributes positive value (`dp[v] > 0`)
   - We're essentially doing a "Kadane's algorithm" on a tree: at each node, we decide whether to include child subtrees based on whether they improve our score

5. **Finding the global maximum**: The answer isn't just `dp[root]` because the optimal subgraph might not include the root. So we need to track the maximum `dp[u]` value across all nodes during our DFS.

6. **Handling the tree as undirected**: We need to avoid revisiting parent nodes, so we pass a `parent` parameter in our DFS.

## Optimal Solution

Here's the complete solution using tree DP with DFS:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSubgraphScore(self, n: int, edges: List[List[int]], good: List[int]) -> int:
    # Step 1: Build adjacency list for the tree
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Step 2: Assign weights: +1 for good nodes, -1 for bad nodes
    weights = [1 if g == 1 else -1 for g in good]

    # Track the maximum score found so far
    max_score = float('-inf')

    # Step 3: DFS function that returns the maximum score of subtree rooted at u
    # that includes u and is connected
    def dfs(u, parent):
        nonlocal max_score

        # Start with just the current node's weight
        current_sum = weights[u]

        # Explore all neighbors except parent (to avoid cycles)
        for v in graph[u]:
            if v == parent:
                continue

            # Get the best score from child's subtree
            child_sum = dfs(v, u)

            # Only include child's subtree if it contributes positively
            if child_sum > 0:
                current_sum += child_sum

        # Update global maximum
        max_score = max(max_score, current_sum)

        # Return the best score for subtree rooted at u (must include u)
        return current_sum

    # Step 4: Start DFS from node 0 (any node works since tree is connected)
    dfs(0, -1)

    return max_score
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSubgraphScore(n, edges, good) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Assign weights: +1 for good nodes, -1 for bad nodes
  const weights = good.map((g) => (g === 1 ? 1 : -1));

  // Track the maximum score found so far
  let maxScore = -Infinity;

  // Step 3: DFS function that returns the maximum score of subtree rooted at u
  // that includes u and is connected
  function dfs(u, parent) {
    // Start with just the current node's weight
    let currentSum = weights[u];

    // Explore all neighbors except parent (to avoid cycles)
    for (const v of graph[u]) {
      if (v === parent) continue;

      // Get the best score from child's subtree
      const childSum = dfs(v, u);

      // Only include child's subtree if it contributes positively
      if (childSum > 0) {
        currentSum += childSum;
      }
    }

    // Update global maximum
    maxScore = Math.max(maxScore, currentSum);

    // Return the best score for subtree rooted at u (must include u)
    return currentSum;
  }

  // Step 4: Start DFS from node 0 (any node works since tree is connected)
  dfs(0, -1);

  return maxScore;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private List<Integer>[] graph;
    private int[] weights;
    private int maxScore;

    public int maximumSubgraphScore(int n, int[][] edges, int[] good) {
        // Step 1: Build adjacency list for the tree
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Assign weights: +1 for good nodes, -1 for bad nodes
        weights = new int[n];
        for (int i = 0; i < n; i++) {
            weights[i] = good[i] == 1 ? 1 : -1;
        }

        // Track the maximum score found so far
        maxScore = Integer.MIN_VALUE;

        // Step 3: Start DFS from node 0 (any node works since tree is connected)
        dfs(0, -1);

        return maxScore;
    }

    private int dfs(int u, int parent) {
        // Start with just the current node's weight
        int currentSum = weights[u];

        // Explore all neighbors except parent (to avoid cycles)
        for (int v : graph[u]) {
            if (v == parent) continue;

            // Get the best score from child's subtree
            int childSum = dfs(v, u);

            // Only include child's subtree if it contributes positively
            if (childSum > 0) {
                currentSum += childSum;
            }
        }

        // Update global maximum
        maxScore = Math.max(maxScore, currentSum);

        // Return the best score for subtree rooted at u (must include u)
        return currentSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We build the adjacency list in O(n) time (n-1 edges)
- We perform a single DFS traversal visiting each node exactly once
- At each node, we process all its edges, but each edge is processed twice total (once from each endpoint), so total edge processing is O(n)
- Overall: O(n) where n is the number of nodes

**Space Complexity: O(n)**

- Adjacency list uses O(n) space (2\*(n-1) entries for undirected edges)
- Recursion stack in DFS can be O(n) in the worst case (linear chain tree)
- Weights array uses O(n) space
- Overall: O(n)

## Common Mistakes

1. **Forgetting to track global maximum**: Some candidates only return `dp[root]`, but the optimal subgraph might not include the root. You must track the maximum `dp[u]` across all nodes during DFS.

2. **Incorrect weight assignment**: The problem says `good[i] = 1` if node i is good, but some candidates might think 0 means good. Carefully read: weight = +1 for good nodes (good[i] == 1), -1 for bad nodes (good[i] == 0).

3. **Not handling undirected trees properly**: When doing DFS on an undirected tree, you must pass and check a `parent` parameter to avoid going back to the parent and creating infinite recursion.

4. **Including negative child subtrees**: The recurrence only adds `dp[child]` if it's positive. If you always add it, you might decrease your score unnecessarily. Remember: we want to maximize the sum, so we only include child subtrees that improve our score.

## When You'll See This Pattern

This tree DP pattern appears in several other problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)** - Very similar! Instead of weights being +1/-1, they're arbitrary integers. The recurrence is almost identical: at each node, you compute the maximum path sum through that node, and you only include child contributions if they're positive.

2. **House Robber III (LeetCode 337)** - Another tree DP problem where you decide at each node whether to "take" it or not, with constraints (can't take adjacent nodes). The pattern of post-order DFS with DP states is the same.

3. **Diameter of Binary Tree (LeetCode 543)** - While not about sums, it uses the same tree traversal pattern where each node computes something based on its children and passes information up.

The core pattern is: **post-order DFS + DP on trees**. You process children first, combine their results at the parent, and pass information upward.

## Key Takeaways

1. **Tree DP often uses post-order DFS**: Process children before parent so you have all child information when computing the parent's value.

2. **For "maximum sum subgraph" problems on trees**: The optimal connected subgraph containing a node `u` is `weight[u] + sum of positive contributions from children's optimal subgraphs`. This is essentially Kadane's algorithm adapted to trees.

3. **Always track global maximum in tree DP**: The answer isn't always at the root. Use a global variable or return additional information to track the best solution anywhere in the tree.

[Practice this problem on CodeJeet](/problem/maximum-subgraph-score-in-a-tree)
