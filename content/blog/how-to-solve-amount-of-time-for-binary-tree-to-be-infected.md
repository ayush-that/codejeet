---
title: "How to Solve Amount of Time for Binary Tree to Be Infected — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Amount of Time for Binary Tree to Be Infected. Medium difficulty, 65.1% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-10-05"
category: "dsa-patterns"
tags:
  [
    "amount-of-time-for-binary-tree-to-be-infected",
    "hash-table",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve "Amount of Time for Binary Tree to Be Infected"

This problem asks us to calculate how many minutes it takes for an infection to spread through a binary tree, starting from a specific node. The infection spreads one "step" per minute to adjacent nodes (parent, left child, right child). What makes this problem interesting is that while the input is a tree, the infection spreads in **all directions** — not just downward. This means we need to treat it as an **undirected graph** problem, where each node can infect its parent as well as its children. The challenge is converting the tree into a graph representation while efficiently tracking the spread.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree:
        1
       / \
      5   3
         / \
        4   10
       / \
      9   2
Start node: 3
```

**Minute 0:** Only node 3 is infected.

**Minute 1:** Infection spreads to adjacent nodes of 3:

- Parent: node 1
- Right child: node 10
- Left child: node 4

**Minute 2:** From newly infected nodes:

- From node 1 → node 5
- From node 10 → (no new adjacent nodes)
- From node 4 → nodes 9 and 2

**Minute 3:** From newly infected nodes:

- From node 5 → (no new adjacent nodes)
- From node 9 → (no new adjacent nodes)
- From node 2 → (no new adjacent nodes)

All nodes are now infected. Total time = **3 minutes**.

Notice that the infection doesn't just flow downward — it goes back up to the parent (node 1) and then down another branch. This is why we need to think in terms of a graph, not just a tree traversal.

## Brute Force Approach

A naive approach might try to repeatedly traverse the tree, marking infected nodes and checking their neighbors. However, without a way to efficiently track which nodes are adjacent to each other (especially parent relationships), we'd need to:

1. Search for the start node (O(n) time)
2. Each minute, traverse the entire tree to find nodes adjacent to infected nodes
3. Mark newly infected nodes
4. Repeat until no new infections occur

This could take O(n²) time in the worst case (a degenerate tree shaped like a linked list), as we might traverse the entire tree n times. We also can't easily find a node's parent without storing that information somewhere.

The key insight is that we need to **build an adjacency list** from the tree first, then perform a **BFS (breadth-first search)** from the start node to simulate the infection spread level by level.

## Optimized Approach

The optimal solution has two clear phases:

### Phase 1: Convert Tree to Undirected Graph

Since trees are typically represented with only child pointers (no parent pointers), we need to build a graph representation where each node knows all its neighbors. We can do this with a DFS traversal:

- For each node, add its children as neighbors
- Add the current node as a neighbor to its children (establishing the reverse connection)
- Store this in an adjacency list (hash map from node value → list of neighbor values)

### Phase 2: BFS to Simulate Infection Spread

Once we have the graph:

1. Start BFS from the infected node
2. Each "level" of BFS represents one minute of spread
3. Track visited nodes to avoid re-infection
4. Count the levels until all reachable nodes are infected

The BFS will naturally give us the maximum distance from the start node to any other node, which equals the total infection time.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) - we visit each node once to build graph, once for BFS
# Space: O(n) - adjacency list stores all nodes and edges
from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def amountOfTime(self, root: Optional[TreeNode], start: int) -> int:
        # Step 1: Build adjacency list (graph) from binary tree
        # We use a dictionary where key = node value, value = list of neighbor values
        graph = {}

        def build_graph(node: Optional[TreeNode], parent: Optional[TreeNode] = None):
            if not node:
                return

            # Initialize empty neighbor list for this node if not exists
            if node.val not in graph:
                graph[node.val] = []

            # If there's a parent, add it as a neighbor (undirected edge)
            if parent:
                graph[node.val].append(parent.val)
                # Also add current node to parent's neighbor list
                graph[parent.val].append(node.val)

            # Recursively process children
            build_graph(node.left, node)
            build_graph(node.right, node)

        # Build the graph starting from root (no parent)
        build_graph(root)

        # Step 2: BFS to simulate infection spread
        # Queue stores (node_value, minute_when_infected)
        queue = deque([(start, 0)])
        # Track infected nodes to avoid cycles
        infected = set([start])
        max_minutes = 0

        while queue:
            current_node, minute = queue.popleft()
            # Update maximum minutes seen so far
            max_minutes = max(max_minutes, minute)

            # Spread infection to all uninfected neighbors
            for neighbor in graph[current_node]:
                if neighbor not in infected:
                    infected.add(neighbor)
                    # Neighbor gets infected in the next minute
                    queue.append((neighbor, minute + 1))

        return max_minutes
```

```javascript
// Time: O(n) - visit each node once for graph building, once for BFS
// Space: O(n) - adjacency list stores all nodes and edges
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @param {number} start
 * @return {number}
 */
var amountOfTime = function (root, start) {
  // Step 1: Build adjacency list (graph) from binary tree
  const graph = new Map();

  // DFS to build undirected graph
  const buildGraph = (node, parent = null) => {
    if (!node) return;

    // Initialize neighbor array for this node if not exists
    if (!graph.has(node.val)) {
      graph.set(node.val, []);
    }

    // If there's a parent, add it as a neighbor
    if (parent !== null) {
      graph.get(node.val).push(parent.val);
      // Also add current node to parent's neighbor list
      graph.get(parent.val).push(node.val);
    }

    // Recursively process children
    buildGraph(node.left, node);
    buildGraph(node.right, node);
  };

  buildGraph(root);

  // Step 2: BFS to simulate infection spread
  const queue = [[start, 0]]; // [node_value, minute_when_infected]
  const infected = new Set([start]);
  let maxMinutes = 0;

  while (queue.length > 0) {
    const [currentNode, minute] = queue.shift();
    maxMinutes = Math.max(maxMinutes, minute);

    // Spread to all uninfected neighbors
    const neighbors = graph.get(currentNode) || [];
    for (const neighbor of neighbors) {
      if (!infected.has(neighbor)) {
        infected.add(neighbor);
        // Neighbor gets infected in the next minute
        queue.push([neighbor, minute + 1]);
      }
    }
  }

  return maxMinutes;
};
```

```java
// Time: O(n) - visit each node once for graph building, once for BFS
// Space: O(n) - adjacency list stores all nodes and edges
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public int amountOfTime(TreeNode root, int start) {
        // Step 1: Build adjacency list (graph) from binary tree
        Map<Integer, List<Integer>> graph = new HashMap<>();
        buildGraph(root, null, graph);

        // Step 2: BFS to simulate infection spread
        Queue<int[]> queue = new LinkedList<>(); // [node_value, minute_when_infected]
        queue.offer(new int[]{start, 0});
        Set<Integer> infected = new HashSet<>();
        infected.add(start);
        int maxMinutes = 0;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int currentNode = current[0];
            int minute = current[1];
            maxMinutes = Math.max(maxMinutes, minute);

            // Spread infection to all uninfected neighbors
            for (int neighbor : graph.getOrDefault(currentNode, new ArrayList<>())) {
                if (!infected.contains(neighbor)) {
                    infected.add(neighbor);
                    // Neighbor gets infected in the next minute
                    queue.offer(new int[]{neighbor, minute + 1});
                }
            }
        }

        return maxMinutes;
    }

    private void buildGraph(TreeNode node, TreeNode parent, Map<Integer, List<Integer>> graph) {
        if (node == null) return;

        // Initialize neighbor list for this node if not exists
        if (!graph.containsKey(node.val)) {
            graph.put(node.val, new ArrayList<>());
        }

        // If there's a parent, add it as a neighbor
        if (parent != null) {
            graph.get(node.val).add(parent.val);
            // Also add current node to parent's neighbor list
            graph.get(parent.val).add(node.val);
        }

        // Recursively process children
        buildGraph(node.left, node, graph);
        buildGraph(node.right, node, graph);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the graph: We perform a DFS traversal visiting each node exactly once → O(n)
- BFS traversal: In the worst case, we visit each node once → O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Graph storage: The adjacency list stores each node and its edges. A binary tree has n-1 edges, so total storage is O(n)
- BFS queue: In the worst case (balanced tree), stores O(n) nodes
- Visited set: Stores O(n) nodes
- Total: O(n) + O(n) + O(n) = O(n)

## Common Mistakes

1. **Forgetting to handle parent-child relationships bidirectionally**: Some candidates only add children as neighbors but forget that infection can spread upward to parents. Remember: trees in this problem are undirected for infection spread.

2. **Using DFS instead of BFS for infection simulation**: DFS would give incorrect results because infection spreads uniformly in all directions. BFS processes nodes level by level, which correctly models "one minute per level" of spread.

3. **Not tracking visited/infected nodes**: Without a visited set, BFS would get stuck in cycles (A infects B, B infects A, infinite loop).

4. **Assuming the tree is balanced or complete**: The solution must work for any binary tree structure, including degenerate trees (linked lists) and skewed trees.

## When You'll See This Pattern

This "tree to graph + BFS" pattern appears in several tree problems where you need to find distances or relationships that aren't strictly parent-to-child:

1. **All Nodes Distance K in Binary Tree (LeetCode 863)**: Find all nodes at distance K from a target node. Same approach: convert tree to graph, then BFS to find nodes at distance K.

2. **Shortest Path to Get Food (LeetCode 1730)**: While not a tree problem, it uses the same BFS-on-graph pattern for shortest path finding.

3. **Maximum Depth of Binary Tree (LeetCode 104)**: A simpler version where you only need downward traversal, but understanding BFS level counting helps with this problem.

The core pattern is: when you need to traverse in all directions (not just root-to-leaf or leaf-to-root), convert to a graph representation first.

## Key Takeaways

1. **Trees with non-directional relationships become graph problems**: When a problem involves movement or relationships that aren't strictly hierarchical (parent→child or child→parent), consider converting the tree to an undirected graph.

2. **BFS is for level-by-level spread, DFS is for path finding**: Use BFS when you need to process things in "waves" or find shortest paths in unweighted graphs. Use DFS when exploring all possible paths or traversing deeply.

3. **Two-phase solutions are common**: Many tree problems require (1) preprocessing/transformation followed by (2) the main algorithm. Don't try to do everything in one pass if it makes the logic clearer.

Related problems: [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree), [Shortest Path to Get Food](/problem/shortest-path-to-get-food), [All Nodes Distance K in Binary Tree](/problem/all-nodes-distance-k-in-binary-tree)
