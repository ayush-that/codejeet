---
title: "How to Solve Sum of Distances in Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Distances in Tree. Hard difficulty, 65.5% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Graph Theory."
date: "2026-04-03"
category: "dsa-patterns"
tags: ["sum-of-distances-in-tree", "dynamic-programming", "tree", "depth-first-search", "hard"]
---

# How to Solve Sum of Distances in Tree

You're given a tree with `n` nodes and need to compute, for each node, the sum of distances from that node to every other node in the tree. The challenge is doing this efficiently — a brute force approach would require O(n²) time, but we need O(n) time. This problem is tricky because it requires two passes of depth-first search with careful mathematical reasoning about how distances change when moving between adjacent nodes.

## Visual Walkthrough

Let's trace through a simple example with 6 nodes and edges: [[0,1],[0,2],[2,3],[2,4],[2,5]]

```
    0
   / \
  1   2
     /|\
    3 4 5
```

For node 0:

- Distance to node 1: 1
- Distance to node 2: 1
- Distance to node 3: 2 (0→2→3)
- Distance to node 4: 2 (0→2→4)
- Distance to node 5: 2 (0→2→5)
  Sum = 1 + 1 + 2 + 2 + 2 = 8

For node 2:

- Distance to node 0: 1
- Distance to node 1: 2 (2→0→1)
- Distance to node 3: 1
- Distance to node 4: 1
- Distance to node 5: 1
  Sum = 1 + 2 + 1 + 1 + 1 = 6

The key insight: If we know the sum for node 0 is 8, what happens when we move to its neighbor node 2?

- All nodes in node 2's subtree (nodes 3,4,5) get 1 unit closer
- All nodes outside node 2's subtree (nodes 0,1) get 1 unit farther
- Node 2's subtree has 4 nodes (2,3,4,5)
- Outside has 2 nodes (0,1)
- New sum = 8 + (2 - 4) = 8 - 2 = 6 ✓

This relationship forms the basis for our optimized solution.

## Brute Force Approach

The most straightforward approach is to compute distances from each node to every other node using BFS or DFS:

1. For each node i (0 to n-1):
2. Run BFS/DFS starting from node i
3. Sum all distances to other nodes
4. Store the result in answer[i]

This requires O(n²) time since we perform n traversals, each visiting n-1 other nodes. For n up to 3×10⁴ (common constraint), this would be ~900 million operations — far too slow.

Even with optimizations like memoization, we'd still face O(n²) worst-case time because we need n² distance calculations. We need a smarter approach that leverages the tree structure.

## Optimized Approach

The optimal solution uses two DFS passes with a clever mathematical observation:

**First Pass (Post-order DFS):**

1. Compute `count[node]` = number of nodes in subtree rooted at `node` (including itself)
2. Compute `sumDist[root]` = sum of distances from root to all nodes in its subtree
3. For root node 0, compute total sum of distances to all nodes

**Key Insight:** For any edge (parent, child):

- When moving from parent to child:
  - All nodes in child's subtree get 1 unit closer (there are `count[child]` of them)
  - All nodes NOT in child's subtree get 1 unit farther (there are `n - count[child]` of them)
- Therefore: `answer[child] = answer[parent] + (n - count[child]) - count[child]`
  Simplified: `answer[child] = answer[parent] + n - 2*count[child]`

**Second Pass (Pre-order DFS):**

1. Starting from root (node 0) with its computed answer
2. For each child, compute its answer using the formula above
3. Recursively process all children

This gives us O(n) time complexity with two traversals.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def sumOfDistancesInTree(self, n: int, edges: List[List[int]]) -> List[int]:
        # Step 1: Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # count[node] = number of nodes in subtree rooted at node
        count = [1] * n
        # answer[0] will store sum of distances from node 0 to all other nodes
        answer = [0] * n

        # First DFS: post-order traversal to compute count and answer[0]
        def dfs1(node, parent):
            for neighbor in graph[node]:
                if neighbor != parent:  # Avoid going back to parent
                    dfs1(neighbor, node)
                    # Add count of child's subtree
                    count[node] += count[neighbor]
                    # Add distances: for each node in child's subtree,
                    # distance increases by 1, so add count[neighbor]
                    answer[node] += answer[neighbor] + count[neighbor]

        # Second DFS: pre-order traversal to compute answers for all nodes
        def dfs2(node, parent):
            for neighbor in graph[node]:
                if neighbor != parent:
                    # Key formula: when moving from node to neighbor:
                    # - Nodes in neighbor's subtree get 1 closer: -count[neighbor]
                    # - Nodes outside get 1 farther: + (n - count[neighbor])
                    answer[neighbor] = answer[node] + n - 2 * count[neighbor]
                    dfs2(neighbor, node)

        # Start DFS from node 0 (root)
        dfs1(0, -1)
        dfs2(0, -1)

        return answer
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
var sumOfDistancesInTree = function (n, edges) {
  // Step 1: Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // count[node] = number of nodes in subtree rooted at node
  const count = new Array(n).fill(1);
  // answer[0] will store sum of distances from node 0
  const answer = new Array(n).fill(0);

  // First DFS: post-order to compute count and answer[0]
  const dfs1 = (node, parent) => {
    for (const neighbor of graph[node]) {
      if (neighbor !== parent) {
        dfs1(neighbor, node);
        // Add child's subtree count
        count[node] += count[neighbor];
        // Add distances from child's subtree
        answer[node] += answer[neighbor] + count[neighbor];
      }
    }
  };

  // Second DFS: pre-order to compute all answers
  const dfs2 = (node, parent) => {
    for (const neighbor of graph[node]) {
      if (neighbor !== parent) {
        // Apply the transition formula
        answer[neighbor] = answer[node] + n - 2 * count[neighbor];
        dfs2(neighbor, node);
      }
    }
  };

  // Start DFS from node 0 as root
  dfs1(0, -1);
  dfs2(0, -1);

  return answer;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private List<Integer>[] graph;
    private int[] count;
    private int[] answer;
    private int n;

    public int[] sumOfDistancesInTree(int n, int[][] edges) {
        this.n = n;
        // Step 1: Build adjacency list
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        count = new int[n];
        Arrays.fill(count, 1);
        answer = new int[n];

        // First DFS: compute count and answer[0]
        dfs1(0, -1);
        // Second DFS: compute all answers
        dfs2(0, -1);

        return answer;
    }

    private void dfs1(int node, int parent) {
        for (int neighbor : graph[node]) {
            if (neighbor != parent) {
                dfs1(neighbor, node);
                // Accumulate child's subtree count
                count[node] += count[neighbor];
                // Add distances from child's subtree
                answer[node] += answer[neighbor] + count[neighbor];
            }
        }
    }

    private void dfs2(int node, int parent) {
        for (int neighbor : graph[node]) {
            if (neighbor != parent) {
                // Apply the transition formula
                answer[neighbor] = answer[node] + n - 2 * count[neighbor];
                dfs2(neighbor, node);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We build the adjacency list in O(n) time
- First DFS visits each node once: O(n)
- Second DFS visits each node once: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity:** O(n)

- Adjacency list stores 2×(n-1) edges: O(n)
- `count` array: O(n)
- `answer` array: O(n)
- Recursion stack depth up to n in worst-case (linear tree): O(n)
- Total: O(n)

The O(n) time is optimal since we must at least read the input and produce output of size n.

## Common Mistakes

1. **Forgetting to handle parent-child relationship in DFS:** When traversing the tree, you must pass and check the parent to avoid infinite recursion. Always include a `parent` parameter and skip the neighbor if it equals the parent.

2. **Incorrect transition formula:** The formula `answer[child] = answer[parent] + n - 2*count[child]` is derived from careful counting. A common mistake is to use `n - count[child] - count[child]` without considering that nodes in child's subtree get closer (subtract count[child]) while others get farther (add n - count[child]).

3. **Using BFS for distance calculation:** While BFS gives distances from one node, using it for all nodes would be O(n²). The two-pass DFS approach is essential for O(n) time.

4. **Not initializing count array to 1:** Each node counts itself in its subtree, so initial values should be 1, not 0. Starting with 0 would undercount and break the transition formula.

## When You'll See This Pattern

This "two-pass DFS with subtree counts" pattern appears in several tree problems:

1. **Distribute Coins in Binary Tree (LeetCode 979):** Uses similar two-pass DFS to calculate coin movements between nodes, tracking excess/deficit in subtrees.

2. **Count Nodes With the Highest Score (LeetCode 2049):** Requires computing subtree sizes to calculate scores when removing edges.

3. **Binary Tree Cameras (LeetCode 968):** Uses post-order traversal with state information propagating from leaves to root.

4. **Tree Diameter problems:** Often use two DFS/BFS passes: first to find farthest node, second to find diameter from that node.

The core idea is leveraging subtree information computed in a bottom-up pass, then using it in a top-down pass to compute final answers efficiently.

## Key Takeaways

1. **Tree re-rooting technique:** When you need answers for all nodes in a tree, compute for one root first, then use a mathematical relationship to compute for others. The transition between adjacent nodes often has a simple formula.

2. **Subtree counts are powerful:** Many tree problems become tractable when you track subtree sizes. This information helps quantify how changes propagate through the tree.

3. **Two-pass DFS is a versatile pattern:** First pass (post-order) gathers information from children to parent. Second pass (pre-order) distributes information from parent to children. This pattern appears in various tree DP problems.

Related problems: [Distribute Coins in Binary Tree](/problem/distribute-coins-in-binary-tree), [Count Nodes With the Highest Score](/problem/count-nodes-with-the-highest-score), [Collect Coins in a Tree](/problem/collect-coins-in-a-tree)
