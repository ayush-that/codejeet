---
title: "How to Solve Difference Between Maximum and Minimum Price Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Difference Between Maximum and Minimum Price Sum. Hard difficulty, 33.3% acceptance rate. Topics: Array, Dynamic Programming, Tree, Depth-First Search."
date: "2026-05-11"
category: "dsa-patterns"
tags:
  [
    "difference-between-maximum-and-minimum-price-sum",
    "array",
    "dynamic-programming",
    "tree",
    "hard",
  ]
---

# How to Solve Difference Between Maximum and Minimum Price Sum

This problem asks us to find the maximum possible difference between the sum of prices along two different paths in a tree, where we can choose any node as the root and any leaf as the endpoint for each path. The tricky part is that the tree is undirected and unrooted, so we need to consider all possible rootings while efficiently computing path sums.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider a tree with 4 nodes and prices = [6, 2, 5, 8]:

```
Nodes:   0(6)---1(2)
           |
         2(5)---3(8)
```

Edges: [[0,1], [0,2], [2,3]]

We need to find the maximum difference between:

- Max path sum (from any leaf to any leaf through a common root)
- Min path sum (from any leaf to any leaf through a common root)

**Step 1: Understanding what we're calculating**
For a given root node, the maximum path sum through that root is the sum of:

1. The maximum sum path from root to a leaf in one direction
2. The maximum sum path from root to a leaf in a different direction
3. The root's own price

Similarly, the minimum path sum uses the minimum sum paths.

**Step 2: Try root at node 0**

- From root 0 to leaves:
  - Path to leaf 1: 6 + 2 = 8
  - Path to leaf 3 (through 2): 6 + 5 + 8 = 19
- Max path sum through root 0: Take two best paths = 19 + 8 + 0? Wait, we already included root 0 in both paths, so we need to subtract it once: 19 + 8 - 6 = 21
- Min path sum through root 0: Both paths are positive, so min would be the smallest two: Actually 8 and 19 are both positive, so min path sum = 8 + 19 - 6 = 21 (same as max here)

**Step 3: The key insight**
We need to consider ALL possible roots. For each root, we need:

- The maximum sum from root to any leaf
- The minimum sum from root to any leaf
- The two largest maximums from different subtrees (for max path)
- The two smallest minimums from different subtrees (for min path)

This suggests we need to compute for each node: the best path sums to leaves in all directions.

## Brute Force Approach

A brute force approach would be:

1. For each node as root
2. For that rooting, compute all leaf-to-leaf paths through the root
3. Track the maximum and minimum of these
4. Return the difference

This requires O(n²) time because for each of n roots, we might explore O(n) paths. With n up to 10⁵, this is far too slow (10¹⁰ operations).

The brute force fails because it recomputes the same information repeatedly. When we change roots, we're essentially just looking at the tree from a different perspective, but the underlying path sums remain related.

## Optimized Approach

The key insight is that we can compute for each node:

- `maxDown[node]`: Maximum sum path from node to any leaf in its subtree
- `minDown[node]`: Minimum sum path from node to any leaf in its subtree

But since the tree is undirected, each node has multiple "subtrees" depending on which neighbor we consider as parent. This is a classic **rerooting DP** problem.

**Step-by-step reasoning:**

1. **First DFS (post-order):** Compute for each node, the best paths to leaves in its "downward" direction (treating the tree as rooted arbitrarily at node 0).
   - `maxDown[u] = price[u] + max(maxDown[v] for v in children)`
   - `minDown[u] = price[u] + min(minDown[v] for v in children)`
   - For leaves: `maxDown[leaf] = minDown[leaf] = price[leaf]`

2. **Second DFS (pre-order/rerooting):** Compute for each node, the best paths considering the rest of the tree (the "upward" direction from its parent).
   - When we move from parent `u` to child `v`, we need to tell `v` what's the best path through `u`'s other children
   - This gives us complete information to compute leaf-to-leaf paths through any node

3. **Calculating the answer:** For each node as potential root:
   - Get the two largest `maxDown` values from different neighbors
   - Get the two smallest `minDown` values from different neighbors
   - Max path sum through node = sum of two largest maxDowns - price[node] (since price[node] counted twice)
   - Min path sum through node = sum of two smallest minDowns - price[node]
   - Track maximum difference across all nodes

The rerooting technique allows us to compute everything in O(n) time with two DFS passes.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def maxOutput(self, n: int, edges: List[List[int]], price: List[int]) -> int:
        # Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # First DFS: compute maxDown and minDown for each node
        # maxDown[u] = maximum sum from u to any leaf in its subtree
        # minDown[u] = minimum sum from u to any leaf in its subtree
        maxDown = [0] * n
        minDown = [0] * n

        def dfs1(node, parent):
            # Initialize with node's own price (path of length 1)
            maxDown[node] = price[node]
            minDown[node] = price[node]

            for neighbor in graph[node]:
                if neighbor == parent:
                    continue
                dfs1(neighbor, node)
                # Update maxDown: take the best path from children and add current price
                maxDown[node] = max(maxDown[node], price[node] + maxDown[neighbor])
                # Update minDown: take the worst path from children and add current price
                minDown[node] = min(minDown[node], price[node] + minDown[neighbor])

        # Start DFS from node 0 (arbitrary root)
        dfs1(0, -1)

        # Second DFS: rerooting to compute answer for each node as root
        answer = 0

        def dfs2(node, parent, maxUp, minUp):
            nonlocal answer

            # Collect all candidate max values from neighbors
            maxValues = []
            minValues = []

            # Add values from children (computed in first DFS)
            for neighbor in graph[node]:
                if neighbor == parent:
                    continue
                maxValues.append(maxDown[neighbor])
                minValues.append(minDown[neighbor])

            # Add value from parent (passed as maxUp/minUp)
            if parent != -1:
                maxValues.append(maxUp)
                minValues.append(minUp)

            # We need at least 2 values to form a path through this node
            if len(maxValues) >= 2:
                # Sort to get two largest max values
                maxValues.sort(reverse=True)
                # Max path sum through this node = two largest maxDowns + price[node]
                # But price[node] is counted twice (once in each path), so subtract once
                maxPathSum = maxValues[0] + maxValues[1] + price[node]

                # Sort to get two smallest min values
                minValues.sort()
                # Min path sum through this node = two smallest minDowns + price[node]
                minPathSum = minValues[0] + minValues[1] + price[node]

                # Update answer with the difference
                answer = max(answer, maxPathSum - minPathSum)

            # Prepare to recurse to children
            for neighbor in graph[node]:
                if neighbor == parent:
                    continue

                # For child 'neighbor', we need to compute what maxUp/minUp would be
                # if we rerooted at 'neighbor'

                # Find the best maxDown from node's other children (excluding 'neighbor')
                bestMax = 0
                for other in graph[node]:
                    if other == parent or other == neighbor:
                        continue
                    bestMax = max(bestMax, maxDown[other])

                # Also consider the upward path from parent
                if parent != -1:
                    bestMax = max(bestMax, maxUp)

                # The maxUp for child = price[node] + bestMax (or just price[node] if no other paths)
                childMaxUp = price[node] + (bestMax if bestMax > 0 else 0)

                # Similarly for minUp
                bestMin = float('inf')
                hasOther = False
                for other in graph[node]:
                    if other == parent or other == neighbor:
                        continue
                    hasOther = True
                    bestMin = min(bestMin, minDown[other])

                if parent != -1:
                    hasOther = True
                    bestMin = min(bestMin, minUp)

                childMinUp = price[node] + (bestMin if hasOther else 0)

                # Recurse to child
                dfs2(neighbor, node, childMaxUp, childMinUp)

        # Start second DFS from node 0 with no parent
        dfs2(0, -1, 0, 0)

        return answer
```

```javascript
// Time: O(n) | Space: O(n)
var maxOutput = function (n, edges, price) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // First DFS: compute maxDown and minDown
  const maxDown = new Array(n).fill(0);
  const minDown = new Array(n).fill(0);

  function dfs1(node, parent) {
    // Start with node's own price
    maxDown[node] = price[node];
    minDown[node] = price[node];

    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue;
      dfs1(neighbor, node);
      // Update with best/worst paths from children
      maxDown[node] = Math.max(maxDown[node], price[node] + maxDown[neighbor]);
      minDown[node] = Math.min(minDown[node], price[node] + minDown[neighbor]);
    }
  }

  dfs1(0, -1);

  let answer = 0;

  // Second DFS: rerooting
  function dfs2(node, parent, maxUp, minUp) {
    // Collect all max and min values from neighbors
    const maxValues = [];
    const minValues = [];

    // Add child values
    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue;
      maxValues.push(maxDown[neighbor]);
      minValues.push(minDown[neighbor]);
    }

    // Add parent value if exists
    if (parent !== -1) {
      maxValues.push(maxUp);
      minValues.push(minUp);
    }

    // Need at least 2 values to form a path through this node
    if (maxValues.length >= 2) {
      // Get two largest max values
      maxValues.sort((a, b) => b - a);
      const maxPathSum = maxValues[0] + maxValues[1] + price[node];

      // Get two smallest min values
      minValues.sort((a, b) => a - b);
      const minPathSum = minValues[0] + minValues[1] + price[node];

      answer = Math.max(answer, maxPathSum - minPathSum);
    }

    // Recurse to children
    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue;

      // Compute best max from other paths (excluding current child)
      let bestMax = 0;
      for (const other of graph[node]) {
        if (other === parent || other === neighbor) continue;
        bestMax = Math.max(bestMax, maxDown[other]);
      }
      if (parent !== -1) {
        bestMax = Math.max(bestMax, maxUp);
      }
      const childMaxUp = price[node] + (bestMax > 0 ? bestMax : 0);

      // Compute best min from other paths
      let bestMin = Infinity;
      let hasOther = false;
      for (const other of graph[node]) {
        if (other === parent || other === neighbor) continue;
        hasOther = true;
        bestMin = Math.min(bestMin, minDown[other]);
      }
      if (parent !== -1) {
        hasOther = true;
        bestMin = Math.min(bestMin, minUp);
      }
      const childMinUp = price[node] + (hasOther ? bestMin : 0);

      dfs2(neighbor, node, childMaxUp, childMinUp);
    }
  }

  dfs2(0, -1, 0, 0);
  return answer;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private List<Integer>[] graph;
    private int[] price;
    private long[] maxDown, minDown;
    private long answer;

    public long maxOutput(int n, int[][] edges, int[] price) {
        this.price = price;

        // Build adjacency list
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // First DFS arrays
        maxDown = new long[n];
        minDown = new long[n];

        dfs1(0, -1);

        answer = 0;
        dfs2(0, -1, 0, 0);

        return answer;
    }

    private void dfs1(int node, int parent) {
        // Initialize with node's own price
        maxDown[node] = price[node];
        minDown[node] = price[node];

        for (int neighbor : graph[node]) {
            if (neighbor == parent) continue;
            dfs1(neighbor, node);
            // Update with best paths from children
            maxDown[node] = Math.max(maxDown[node], price[node] + maxDown[neighbor]);
            minDown[node] = Math.min(minDown[node], price[node] + minDown[neighbor]);
        }
    }

    private void dfs2(int node, int parent, long maxUp, long minUp) {
        // Collect values from all directions
        List<Long> maxValues = new ArrayList<>();
        List<Long> minValues = new ArrayList<>();

        // Add child values
        for (int neighbor : graph[node]) {
            if (neighbor == parent) continue;
            maxValues.add(maxDown[neighbor]);
            minValues.add(minDown[neighbor]);
        }

        // Add parent value if exists
        if (parent != -1) {
            maxValues.add(maxUp);
            minValues.add(minUp);
        }

        // Need at least 2 values for a path through this node
        if (maxValues.size() >= 2) {
            // Sort to get two largest max values
            maxValues.sort((a, b) -> Long.compare(b, a));
            long maxPathSum = maxValues.get(0) + maxValues.get(1) + price[node];

            // Sort to get two smallest min values
            minValues.sort(Long::compare);
            long minPathSum = minValues.get(0) + minValues.get(1) + price[node];

            answer = Math.max(answer, maxPathSum - minPathSum);
        }

        // Recurse to children
        for (int neighbor : graph[node]) {
            if (neighbor == parent) continue;

            // Compute best max from other paths
            long bestMax = 0;
            for (int other : graph[node]) {
                if (other == parent || other == neighbor) continue;
                bestMax = Math.max(bestMax, maxDown[other]);
            }
            if (parent != -1) {
                bestMax = Math.max(bestMax, maxUp);
            }
            long childMaxUp = price[node] + (bestMax > 0 ? bestMax : 0);

            // Compute best min from other paths
            long bestMin = Long.MAX_VALUE;
            boolean hasOther = false;
            for (int other : graph[node]) {
                if (other == parent || other == neighbor) continue;
                hasOther = true;
                bestMin = Math.min(bestMin, minDown[other]);
            }
            if (parent != -1) {
                hasOther = true;
                bestMin = Math.min(bestMin, minUp);
            }
            long childMinUp = price[node] + (hasOther ? bestMin : 0);

            dfs2(neighbor, node, childMaxUp, childMinUp);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We perform two DFS traversals of the tree
- Each traversal visits each node once and processes its edges
- At each node, we process all its neighbors, but each edge is processed exactly twice total (once from each endpoint)
- The sorting operations at each node are O(k log k) where k is the degree, but the sum of all degrees is 2(n-1), and the total work is bounded by O(n log n) in worst case. However, with careful implementation using partial sorts or tracking top two values, we can achieve O(n).

**Space Complexity:** O(n)

- Graph adjacency list: O(n) for n-1 edges
- maxDown and minDown arrays: O(n)
- DFS recursion stack: O(n) in worst case (for a skewed tree)
- Temporary arrays for neighbor values: O(max degree) per node

## Common Mistakes

1. **Forgetting to subtract the root's price when combining two paths**: When you take two paths through a root, the root's price is included in both paths. So if you simply add `maxDown[child1] + maxDown[child2] + price[root]`, you're counting `price[root]` three times instead of twice. The correct formula is `maxDown[child1] + maxDown[child2] + price[root]` (which counts root twice) or equivalently `(maxDown[child1] + price[root]) + (maxDown[child2] + price[root]) - price[root]`.

2. **Not handling nodes with only one neighbor (effectively leaves)**: When a node has only one neighbor, it can't form a path through itself (needs two directions). You must check that there are at least two candidate paths before computing the path sum.

3. **Confusing undirected tree with rooted tree**: This is the most subtle mistake. In an undirected tree, every node can be considered the root. The rerooting technique is essential. A common error is to compute paths only from a single root (like node 0) and miss better paths through other nodes.

4. **Integer overflow with large sums**: With n up to 10⁵ and prices up to 10⁵, path sums can reach 10¹⁰, which fits in 64-bit integers but overflows 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C).

## When You'll See This Pattern

The **rerooting DP** pattern appears in tree problems where you need to compute some value for each node as if it were the root, and the computation depends on values from subtrees. Key characteristics:

- The tree is undirected/unrooted
- You need an answer considering each possible root
- The computation for a node can be derived from its children's values

**Related problems:**

1. **Binary Tree Maximum Path Sum (LeetCode 124)** - Similar concept of finding the best path through a node, though in a binary tree rather than general tree.
2. **Sum of Distances in Tree (LeetCode 834)** - Classic rerooting problem where you compute sum of distances to all other nodes for each node.
3. **Tree Diameter (LeetCode 543)** - Finding the longest path uses similar two-DFS approach.

## Key Takeaways

1. **Rerooting DP is powerful for tree problems**: When you need to compute something for each node as root, do one DFS to compute "downward" values, then a second DFS to propagate "upward" values from parents.

2. **Leaf-to-leaf through a node requires two best values**: To find the best path through a node, you typically need the best two values from different subtrees. Track both the maximum and minimum for problems about differences.

3. **Undirected trees are symmetric**: Any node can be the root. If your first instinct is to root at node 0, consider whether you need to reroot to get answers for all nodes.

Related problems: [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum)
