---
title: "How to Solve Minimum Increments to Equalize Leaf Paths — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Increments to Equalize Leaf Paths. Medium difficulty, 41.1% acceptance rate. Topics: Array, Dynamic Programming, Tree, Depth-First Search."
date: "2030-02-15"
category: "dsa-patterns"
tags:
  ["minimum-increments-to-equalize-leaf-paths", "array", "dynamic-programming", "tree", "medium"]
---

# How to Solve Minimum Increments to Equalize Leaf Paths

You're given a rooted tree where each node has a cost, and you need to make all root-to-leaf path sums equal by only increasing node values (never decreasing). The challenge is finding the minimum total increments needed. What makes this tricky is that increasing a node affects all paths passing through it—you can't treat paths independently. The optimal solution requires understanding how to propagate constraints from leaves upward.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have this tree:

```
Node 0 (cost: 5)
├── Node 1 (cost: 2)
│   ├── Node 3 (cost: 1)  // leaf
│   └── Node 4 (cost: 4)  // leaf
└── Node 2 (cost: 3)
    └── Node 5 (cost: 2)  // leaf
```

**Step 1: Calculate initial path sums**

- Path 0→1→3: 5 + 2 + 1 = 8
- Path 0→1→4: 5 + 2 + 4 = 11
- Path 0→2→5: 5 + 3 + 2 = 10

**Step 2: Identify the target**
We need all paths to reach at least the maximum path sum (11). But we can't just increase leaves—we must increase nodes to affect multiple paths efficiently.

**Step 3: Work bottom-up**

- At leaf nodes (3, 4, 5): They need no adjustment yet. Their "required" value is just their cost.
- At node 1: Its children (nodes 3 and 4) have path sums from node 1 of 2+1=3 and 2+4=6. The maximum is 6. To make both paths equal from node 1 downward, we need to increase node 3 by 3 (making its path sum 6). Total increments so far: 3.
- At node 2: Only child is node 5 with path sum 3+2=5. No adjustment needed.
- At node 0: Children have adjusted path sums of 6 (from node 1) and 5 (from node 2). The maximum is 6. We need to increase the path through node 2 by 1. We could increase node 2 or node 5—but increasing node 2 affects both nodes below it more efficiently. We increase node 2 by 1. Total increments: 3 + 1 = 4.

**Final check**: All paths now sum to 11. We used 4 total increments.

## Brute Force Approach

A naive approach might try all possible target sums and compute increments needed. Since we can only increase values, the target must be at least the maximum original path sum. We could:

1. Find all root-to-leaf paths (O(n) paths, each O(n) length)
2. For each possible target from max_sum to some upper bound, calculate increments needed
3. Track the minimum increments

The problem? The upper bound isn't obvious, and checking each target would be exponential. Even if we bound it, recalculating increments for each target requires traversing the tree repeatedly.

Another brute force: Try all ways to distribute increments across nodes. This is combinatorial explosion—with n nodes and potentially large increments, it's infeasible.

The key insight we need: **We don't need to guess the target. By working bottom-up, we can determine exactly what increments are necessary at each node to equalize its subtree's paths.**

## Optimized Approach

The optimal solution uses **post-order DFS (depth-first search)** with a clever observation:

1. **Bottom-up processing**: When we process a node, we already know the "required" path sum for each of its child subtrees (the sum needed from that child downward to make all paths in that subtree equal).

2. **Propagate maximum requirement**: For a node with children, the paths through different children might require different sums from this node downward. We need to raise the lower ones to match the highest one. The most efficient place to add these increments is as close to the current node as possible (to affect multiple leaves).

3. **State we track**: For each node, we compute:
   - `max_child_sum`: The maximum path sum required from this node to any leaf in its subtree (after adjustments)
   - `total_increments`: Total increments made in this subtree

4. **Algorithm**:
   - Base case (leaf): `max_child_sum = cost[node]`, `increments = 0`
   - Internal node: Get `max_child_sum` from each child. Find the maximum of these.
   - For each child, if its `max_child_sum` is less than the maximum, we need to add the difference somewhere in that child's subtree. The optimal place is at the child node itself (affects all leaves in that subtree equally).
   - Add these differences to `total_increments`.
   - Return `max_child_sum + cost[node]` for this node (path sum from this node upward will add `cost[node]`).

This works because we're effectively "pulling up" requirements from leaves to the root, making local optimal decisions at each node.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for recursion stack
class Solution:
    def minIncrements(self, n: int, edges: List[List[int]], cost: List[int]) -> int:
        # Build adjacency list for the tree
        # Since it's an undirected tree rooted at 0, we need to build parent-child relationships
        from collections import defaultdict, deque

        # Build graph
        graph = defaultdict(list)
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Build tree structure with root at 0 using BFS
        children = defaultdict(list)
        visited = [False] * n
        queue = deque([0])
        visited[0] = True

        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    children[node].append(neighbor)
                    queue.append(neighbor)

        # DFS function returns (max_path_sum_from_node, total_increments_in_subtree)
        def dfs(node):
            # If leaf node (no children)
            if not children[node]:
                # For leaf, max path sum from this node is just its cost
                # No increments needed in this subtree
                return cost[node], 0

            # Process all children first (post-order traversal)
            child_results = []
            for child in children[node]:
                child_results.append(dfs(child))

            # Find the maximum path sum among children
            max_child_sum = max(child_max for child_max, _ in child_results)

            # Calculate increments needed for this node's subtree
            increments = 0
            for child_max, child_inc in child_results:
                # For each child, if its max path sum is less than the maximum,
                # we need to add the difference somewhere in that child's subtree
                # The optimal place is at the child node itself
                increments += (max_child_sum - child_max) + child_inc

            # Return: max path sum from this node (including its own cost),
            # and total increments in this subtree
            return max_child_sum + cost[node], increments

        # Start DFS from root (node 0)
        _, total_increments = dfs(0)
        return total_increments
```

```javascript
// Time: O(n) | Space: O(n) for recursion stack
function minIncrements(n, edges, cost) {
  // Build adjacency list
  const graph = new Array(n).fill(0).map(() => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Build tree structure with root at 0 using BFS
  const children = new Array(n).fill(0).map(() => []);
  const visited = new Array(n).fill(false);
  const queue = [0];
  visited[0] = true;

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        children[node].push(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // DFS function returns [maxPathSumFromNode, totalIncrementsInSubtree]
  function dfs(node) {
    // If leaf node (no children)
    if (children[node].length === 0) {
      // For leaf, max path sum from this node is just its cost
      // No increments needed in this subtree
      return [cost[node], 0];
    }

    // Process all children first (post-order traversal)
    const childResults = [];
    for (const child of children[node]) {
      childResults.push(dfs(child));
    }

    // Find the maximum path sum among children
    let maxChildSum = 0;
    for (const [childMax] of childResults) {
      maxChildSum = Math.max(maxChildSum, childMax);
    }

    // Calculate increments needed for this node's subtree
    let increments = 0;
    for (const [childMax, childInc] of childResults) {
      // For each child, if its max path sum is less than the maximum,
      // we need to add the difference somewhere in that child's subtree
      // The optimal place is at the child node itself
      increments += maxChildSum - childMax + childInc;
    }

    // Return: max path sum from this node (including its own cost),
    // and total increments in this subtree
    return [maxChildSum + cost[node], increments];
  }

  // Start DFS from root (node 0)
  const [, totalIncrements] = dfs(0);
  return totalIncrements;
}
```

```java
// Time: O(n) | Space: O(n) for recursion stack
class Solution {
    public int minIncrements(int n, int[][] edges, int[] cost) {
        // Build adjacency list
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Build tree structure with root at 0 using BFS
        List<Integer>[] children = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            children[i] = new ArrayList<>();
        }
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        visited[0] = true;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    children[node].add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        // DFS function returns a long array [maxPathSumFromNode, totalIncrementsInSubtree]
        // Using long to prevent overflow
        long[] result = dfs(0, children, cost);
        return (int) result[1];
    }

    private long[] dfs(int node, List<Integer>[] children, int[] cost) {
        // If leaf node (no children)
        if (children[node].isEmpty()) {
            // For leaf, max path sum from this node is just its cost
            // No increments needed in this subtree
            return new long[]{cost[node], 0};
        }

        // Process all children first (post-order traversal)
        List<long[]> childResults = new ArrayList<>();
        for (int child : children[node]) {
            childResults.add(dfs(child, children, cost));
        }

        // Find the maximum path sum among children
        long maxChildSum = 0;
        for (long[] childResult : childResults) {
            maxChildSum = Math.max(maxChildSum, childResult[0]);
        }

        // Calculate increments needed for this node's subtree
        long increments = 0;
        for (long[] childResult : childResults) {
            long childMax = childResult[0];
            long childInc = childResult[1];
            // For each child, if its max path sum is less than the maximum,
            // we need to add the difference somewhere in that child's subtree
            // The optimal place is at the child node itself
            increments += (maxChildSum - childMax) + childInc;
        }

        // Return: max path sum from this node (including its own cost),
        // and total increments in this subtree
        return new long[]{maxChildSum + cost[node], increments};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list: O(n) where n is number of nodes (process n-1 edges)
- BFS to build parent-child relationships: O(n) visits each node once
- DFS traversal: O(n) visits each node once
- Each node is processed exactly once in DFS, with O(1) work per node (aside from processing children, but each child is processed only by its parent)

**Space Complexity: O(n)**

- Graph adjacency list: O(n) stores 2\*(n-1) edges
- Children list: O(n) stores parent-child relationships
- Recursion stack: O(n) in worst case (skewed tree)
- BFS queue: O(n) in worst case

The linear time and space make this efficient for trees with up to 10^5 nodes.

## Common Mistakes

1. **Not handling undirected edges properly**: The input gives undirected edges, but we need a rooted tree. Forgetting to build proper parent-child relationships (e.g., using DFS without tracking visited nodes) causes infinite recursion or incorrect traversal.

2. **Adding increments at wrong level**: Some candidates try to add increments at leaves instead of as close to the current node as possible. Adding at leaves would require more total increments when multiple leaves share a common ancestor.

3. **Overflow with large values**: When costs can be up to 10^5 and n up to 10^5, path sums can exceed 32-bit integer range. Use 64-bit integers (long in Java, default in Python).

4. **Confusing path sums**: Remember we're computing "path sum from this node downward" not "path sum from root to this node." The recursive function should return the former.

## When You'll See This Pattern

This **bottom-up tree DP with post-order traversal** pattern appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar bottom-up approach where each node returns the maximum path sum starting from that node, while tracking the global maximum.

2. **Distribute Coins in Binary Tree (LeetCode 979)**: Another "balance the tree" problem where you compute excess/deficit at each node and propagate upward.

3. **Sum of Distances in Tree (LeetCode 834)**: Uses post-order then pre-order traversal to compute sums efficiently.

The key signature: When you need to compute something for the whole tree based on subtree results, and decisions at higher nodes depend on aggregated results from lower nodes.

## Key Takeaways

1. **Bottom-up tree processing is powerful**: When a problem involves making all paths/subsystems "equal" or balanced, consider post-order DFS to propagate requirements upward.

2. **Local optimality leads to global optimality**: By making the optimal decision at each node (adding increments as close to the current node as possible), we get the globally optimal solution. This is a form of greedy algorithm that works because of the tree structure.

3. **Tree DP state design matters**: The state returned from each node (`max_path_sum_from_here`, `increments_in_subtree`) captures exactly what parent nodes need to know. Designing the right state is crucial for tree DP problems.

[Practice this problem on CodeJeet](/problem/minimum-increments-to-equalize-leaf-paths)
