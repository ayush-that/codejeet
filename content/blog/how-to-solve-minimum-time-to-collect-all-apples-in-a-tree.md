---
title: "How to Solve Minimum Time to Collect All Apples in a Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Collect All Apples in a Tree. Medium difficulty, 63.6% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search."
date: "2026-08-25"
category: "dsa-patterns"
tags:
  [
    "minimum-time-to-collect-all-apples-in-a-tree",
    "hash-table",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Minimum Time to Collect All Apples in a Tree

This problem asks us to find the minimum time to collect all apples in a tree, starting from vertex 0 and returning to it. The tricky part is that we need to walk through edges to reach apples, but we don't need to traverse edges that don't lead to any apples. The key insight is recognizing that we only need to visit subtrees that contain apples, and each edge on the path to those apples must be traversed twice (going there and coming back).

## Visual Walkthrough

Let's trace through a small example:

- n = 7
- edges = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]]
- hasApple = [false,false,true,false,true,true,false]

The tree structure:

```
      0
     / \
    1   2
   / \ / \
  4  5 3  6
```

Apples are at vertices 2, 4, and 5.

**Step-by-step reasoning:**

1. Starting at vertex 0, we need to collect apples at 2, 4, and 5
2. Path to vertex 2: 0→2 (1 edge, 1 second)
3. Path to vertex 4: 0→1→4 (2 edges, 2 seconds)
4. Path to vertex 5: 0→1→5 (2 edges, 2 seconds)

But wait - we can optimize! If we visit vertex 1, we can collect both apples at 4 and 5 in one trip:

- Go 0→1→4→1→5→1→0
- That's edges: 0-1, 1-4, 4-1, 1-5, 5-1, 1-0 = 6 edges = 6 seconds

Similarly for vertex 2: 0→2→0 = 2 edges = 2 seconds

Total: 6 + 2 = 8 seconds

The key observation: We only need to traverse edges that lead to apples. Vertex 6 has no apple and its subtree (just itself) has no apples, so we skip it entirely. Vertex 3 also has no apple and no apples in its subtree, so we skip it too.

## Brute Force Approach

A naive approach might try to find all paths to apples and sum their lengths, but this would double-count shared path segments. Another brute force might try all possible traversal orders, but with n up to 10^5, this is impossible (factorial complexity).

What a candidate might initially try:

1. Find all apples' positions
2. For each apple, find the shortest path from 0 to that apple
3. Sum all path lengths

The problem: This counts edges multiple times. In our example, edge 0-1 would be counted for both apple 4 and apple 5, but in reality we only traverse it once going down and once coming back up, not once per apple.

This approach would also be inefficient: O(n × apples) time complexity, which could be O(n²) in worst case.

## Optimized Approach

The key insight is a **post-order DFS traversal**:

1. We only need to visit a child subtree if it contains apples
2. If a subtree contains apples, we must traverse the edge to that child twice (down and back)
3. We can compute this bottom-up: each node tells its parent whether its subtree contains apples

**Step-by-step reasoning:**

1. Build an adjacency list from the edges to represent the tree
2. Perform DFS starting from node 0
3. For each node, check all its children (except the parent to avoid cycles)
4. If a child's subtree contains apples, add 2 (for the edge to that child) plus the time from that child's subtree
5. Return whether the current node's subtree has apples (either the node itself has an apple, or any child's subtree has apples)

This works because:

- We process children before parent (post-order)
- We only add time for edges that lead to apples
- Each such edge is counted exactly twice (down and back)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(n) for adjacency list and recursion stack
class Solution:
    def minTime(self, n: int, edges: List[List[int]], hasApple: List[bool]) -> int:
        # Step 1: Build adjacency list representation of the tree
        # We need to know all neighbors for each node
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # Step 2: DFS function returns (time_for_subtree, has_apple_in_subtree)
        # We use parent parameter to avoid going back to parent (prevent cycles)
        def dfs(node, parent):
            total_time = 0
            subtree_has_apple = hasApple[node]  # Start with whether current node has apple

            # Step 3: Explore all neighbors except parent
            for neighbor in adj[node]:
                if neighbor == parent:
                    continue  # Skip going back to parent

                # Step 4: Recursively process child subtree
                child_time, child_has_apple = dfs(neighbor, node)

                # Step 5: If child's subtree has apples, we need to visit it
                if child_has_apple:
                    total_time += child_time + 2  # +2 for edge to child (down and back)
                    subtree_has_apple = True  # Our subtree now has apples

            # Step 6: Return time for this subtree and whether it has apples
            return total_time, subtree_has_apple

        # Step 7: Start DFS from root (node 0) with parent -1
        total_time, _ = dfs(0, -1)
        return total_time
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for adjacency list and recursion stack
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {boolean[]} hasApple
 * @return {number}
 */
var minTime = function (n, edges, hasApple) {
  // Step 1: Build adjacency list representation of the tree
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: DFS function returns [time_for_subtree, has_apple_in_subtree]
  const dfs = (node, parent) => {
    let totalTime = 0;
    let subtreeHasApple = hasApple[node]; // Start with current node's apple status

    // Step 3: Explore all neighbors except parent
    for (const neighbor of adj[node]) {
      if (neighbor === parent) {
        continue; // Skip going back to parent
      }

      // Step 4: Recursively process child subtree
      const [childTime, childHasApple] = dfs(neighbor, node);

      // Step 5: If child's subtree has apples, we need to visit it
      if (childHasApple) {
        totalTime += childTime + 2; // +2 for edge to child (down and back)
        subtreeHasApple = true; // Our subtree now has apples
      }
    }

    // Step 6: Return time for this subtree and whether it has apples
    return [totalTime, subtreeHasApple];
  };

  // Step 7: Start DFS from root (node 0) with parent -1
  const [totalTime] = dfs(0, -1);
  return totalTime;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for adjacency list and recursion stack
class Solution {
    public int minTime(int n, int[][] edges, List<Boolean> hasApple) {
        // Step 1: Build adjacency list representation of the tree
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        // Step 2: DFS function returns array [time_for_subtree, has_apple_in_subtree]
        // has_apple_in_subtree: 1 for true, 0 for false
        int[] result = dfs(0, -1, adj, hasApple);
        return result[0];
    }

    private int[] dfs(int node, int parent, List<List<Integer>> adj, List<Boolean> hasApple) {
        int totalTime = 0;
        int subtreeHasApple = hasApple.get(node) ? 1 : 0; // 1 if true, 0 if false

        // Step 3: Explore all neighbors except parent
        for (int neighbor : adj.get(node)) {
            if (neighbor == parent) {
                continue; // Skip going back to parent
            }

            // Step 4: Recursively process child subtree
            int[] childResult = dfs(neighbor, node, adj, hasApple);
            int childTime = childResult[0];
            int childHasApple = childResult[1];

            // Step 5: If child's subtree has apples, we need to visit it
            if (childHasApple == 1) {
                totalTime += childTime + 2; // +2 for edge to child (down and back)
                subtreeHasApple = 1; // Our subtree now has apples
            }
        }

        // Step 6: Return time for this subtree and whether it has apples
        return new int[]{totalTime, subtreeHasApple};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We build the adjacency list by iterating through all edges: O(n)
- We perform a DFS traversal visiting each node exactly once: O(n)
- Each edge is considered exactly twice (once from each endpoint), but in DFS we only process it once due to the parent check

**Space Complexity: O(n)**

- Adjacency list stores all edges: O(n)
- Recursion stack in worst case (skewed tree) could be O(n)
- No additional data structures scale with n

## Common Mistakes

1. **Forgetting to handle the parent parameter in DFS**: Without tracking the parent, you'll get infinite recursion as you go back and forth between nodes. Always include a parent parameter in tree DFS.

2. **Double-counting edges**: Some candidates try to sum distances from root to each apple, but this counts shared path segments multiple times. Remember: edges are traversed at most twice (down and back), not once per apple in the subtree.

3. **Not checking if subtree has apples before adding time**: The condition `if child_has_apple` is crucial. Without it, you'd add time for edges that lead to subtrees with no apples, resulting in overcounting.

4. **Using BFS instead of DFS**: While BFS could work, DFS is more natural for this bottom-up computation. With BFS, you'd need to process nodes from leaves upward, which requires topological ordering or multiple passes.

## When You'll See This Pattern

This problem uses **post-order tree traversal with subtree aggregation**, a common pattern in tree problems:

1. **Sum of Distances in Tree (LeetCode 834)**: Similar concept of aggregating subtree information and propagating it upward.

2. **Binary Tree Maximum Path Sum (LeetCode 124)**: Uses post-order traversal to compute maximum path sums in subtrees and combine them.

3. **House Robber III (LeetCode 337)**: Requires computing optimal values for subtrees and combining them at parent nodes.

The pattern is: when you need to compute something about a tree where each node's value depends on its children's values, think post-order DFS with return values that aggregate subtree information.

## Key Takeaways

1. **Tree problems often require DFS with parent tracking** to avoid cycles. The parent parameter is essential for undirected trees.

2. **When computation depends on subtree results, use post-order traversal** (process children before parent). This enables bottom-up computation.

3. **For "minimum time/path" problems in trees, consider edge usage**: Each edge might need to be traversed a fixed number of times (often 0, 1, or 2) based on whether it leads to required nodes.

[Practice this problem on CodeJeet](/problem/minimum-time-to-collect-all-apples-in-a-tree)
