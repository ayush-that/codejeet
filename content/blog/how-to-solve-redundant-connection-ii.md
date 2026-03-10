---
title: "How to Solve Redundant Connection II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Redundant Connection II. Hard difficulty, 35.9% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-08-18"
category: "dsa-patterns"
tags:
  ["redundant-connection-ii", "depth-first-search", "breadth-first-search", "union-find", "hard"]
---

# How to Solve Redundant Connection II

This problem asks us to find which edge to remove from a directed graph to make it a valid rooted tree. The tricky part is that we're dealing with a **directed** graph where nodes have exactly one parent (except the root), and we need to handle cases where a node might have two parents or there's a cycle. The challenge lies in systematically identifying which redundant edge to remove when multiple issues exist.

## Visual Walkthrough

Let's trace through example: `edges = [[1,2],[1,3],[2,3]]`

We have 3 nodes and 3 edges:

- Edge 1: 1 → 2 (node 2's parent is 1)
- Edge 2: 1 → 3 (node 3's parent is 1)
- Edge 3: 2 → 3 (node 3's parent is 2)

Looking at node 3, it has **two parents**: both node 1 and node 2. This violates the "every node has exactly one parent" rule. So we have a candidate conflict edge.

Now let's check for cycles. If we follow parents:

- Node 3's parent is 2
- Node 2's parent is 1
- Node 1 has no parent (would be root)

No cycle here. Since we found a node with two parents (node 3), and no cycle, we need to remove one of the edges pointing to node 3. Which one? The last one in the input that would still result in a valid tree. Edge `[2,3]` comes after `[1,3]`, so we remove `[2,3]`.

Now consider: `edges = [[1,2],[2,3],[3,4],[4,2],[1,5]]`

Here node 2 has parents from both node 1 and node 4. But more importantly, we have a cycle: 2→3→4→2. In this case, we need to find the edge in the cycle that's causing the problem. Since there's a cycle but no node with two parents, we remove the last edge that creates the cycle: `[4,2]`.

The hardest case is when we have **both** a node with two parents **and** a cycle. We'll need to carefully determine which edge to remove.

## Brute Force Approach

A naive approach would be to try removing each edge one by one and checking if the resulting graph is a valid rooted tree. For each edge removal candidate:

1. Build the graph without that edge
2. Check if every node (except root) has exactly one parent
3. Check if there are no cycles
4. Check if the graph is connected (all nodes reachable from root)

This requires O(n²) time since for each of n edges, we need to traverse the graph (O(n) each time). For n up to 1000, this could be 1,000,000 operations - potentially acceptable but not optimal. However, the real issue is correctly identifying which edge to remove when multiple issues exist. The brute force doesn't give us a systematic way to choose between conflicting edges.

## Optimized Approach

The key insight is to recognize there are three possible scenarios:

1. **No node has two parents, but there's a cycle** - similar to Redundant Connection I (undirected version)
2. **A node has two parents, but no cycle** - remove the later edge pointing to that node
3. **A node has two parents AND there's a cycle** - we must remove the edge that's part of the cycle

Our algorithm:

1. First pass: Identify if any node has two parents. Record both edges.
2. If no node has two parents, we have case 1. Use Union-Find to find the edge creating the cycle.
3. If a node has two parents but no cycle (case 2), remove the later edge.
4. If a node has two parents AND there's a cycle (case 3), we need to check which of the two candidate edges is part of the cycle. Remove the one in the cycle.

The clever part: We can temporarily ignore the second edge to the conflicted node and check if we can build a valid tree with the remaining edges. If yes, the second edge is redundant. If not, the first edge must be removed.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def findRedundantDirectedConnection(self, edges):
        n = len(edges)
        parent = [0] * (n + 1)  # Track parent of each node
        candidate1 = candidate2 = None
        node_with_two_parents = -1

        # Step 1: Check for node with two parents
        for u, v in edges:
            if parent[v] != 0:  # Node v already has a parent
                # Found node with two parents
                candidate1 = [parent[v], v]  # First edge to v
                candidate2 = [u, v]          # Second edge to v
                node_with_two_parents = v
                # Mark the second edge as invalid for now
                # We'll check later which one to remove
                break
            else:
                parent[v] = u

        # Step 2: Union-Find to detect cycle
        uf_parent = list(range(n + 1))

        def find(x):
            # Find root with path compression
            if uf_parent[x] != x:
                uf_parent[x] = find(uf_parent[x])
            return uf_parent[x]

        def union(x, y):
            # Union two sets
            root_x, root_y = find(x), find(y)
            if root_x == root_y:
                return False  # Cycle detected
            uf_parent[root_y] = root_x
            return True

        # Step 3: Try to build the tree, skipping candidate2 if it exists
        for u, v in edges:
            if [u, v] == candidate2:
                # Skip the second candidate edge for now
                continue

            if not union(u, v):
                # Found a cycle
                if candidate1:
                    # Case 3: Node with two parents AND cycle
                    # The cycle involves candidate1, so remove it
                    return candidate1
                else:
                    # Case 1: Cycle but no node with two parents
                    return [u, v]

        # Step 4: If we get here, no cycle was found
        # Case 2: Node with two parents but no cycle
        # Remove the later edge (candidate2)
        return candidate2
```

```javascript
// Time: O(n) | Space: O(n)
var findRedundantDirectedConnection = function (edges) {
  const n = edges.length;
  const parent = new Array(n + 1).fill(0); // Track parent of each node
  let candidate1 = null,
    candidate2 = null;
  let nodeWithTwoParents = -1;

  // Step 1: Check for node with two parents
  for (const [u, v] of edges) {
    if (parent[v] !== 0) {
      // Found node with two parents
      candidate1 = [parent[v], v]; // First edge to v
      candidate2 = [u, v]; // Second edge to v
      nodeWithTwoParents = v;
      // Mark the second edge as invalid for now
      // We'll check later which one to remove
      break;
    } else {
      parent[v] = u;
    }
  }

  // Step 2: Initialize Union-Find structure
  const ufParent = new Array(n + 1);
  for (let i = 1; i <= n; i++) {
    ufParent[i] = i;
  }

  // Find with path compression
  const find = (x) => {
    if (ufParent[x] !== x) {
      ufParent[x] = find(ufParent[x]);
    }
    return ufParent[x];
  };

  // Union two sets
  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) {
      return false; // Cycle detected
    }
    ufParent[rootY] = rootX;
    return true;
  };

  // Step 3: Try to build the tree, skipping candidate2 if it exists
  for (const [u, v] of edges) {
    // Skip candidate2 edge for now
    if (candidate2 && u === candidate2[0] && v === candidate2[1]) {
      continue;
    }

    if (!union(u, v)) {
      // Found a cycle
      if (candidate1) {
        // Case 3: Node with two parents AND cycle
        // The cycle involves candidate1, so remove it
        return candidate1;
      } else {
        // Case 1: Cycle but no node with two parents
        return [u, v];
      }
    }
  }

  // Step 4: If we get here, no cycle was found
  // Case 2: Node with two parents but no cycle
  // Remove the later edge (candidate2)
  return candidate2;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] findRedundantDirectedConnection(int[][] edges) {
        int n = edges.length;
        int[] parent = new int[n + 1]; // Track parent of each node
        int[] candidate1 = null, candidate2 = null;
        int nodeWithTwoParents = -1;

        // Step 1: Check for node with two parents
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            if (parent[v] != 0) {
                // Found node with two parents
                candidate1 = new int[]{parent[v], v}; // First edge to v
                candidate2 = new int[]{u, v};         // Second edge to v
                nodeWithTwoParents = v;
                // Mark the second edge as invalid for now
                // We'll check later which one to remove
                break;
            } else {
                parent[v] = u;
            }
        }

        // Step 2: Initialize Union-Find structure
        int[] ufParent = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            ufParent[i] = i;
        }

        // Find with path compression
        private int find(int x, int[] ufParent) {
            if (ufParent[x] != x) {
                ufParent[x] = find(ufParent[x], ufParent);
            }
            return ufParent[x];
        }

        // Union two sets
        private boolean union(int x, int y, int[] ufParent) {
            int rootX = find(x, ufParent);
            int rootY = find(y, ufParent);
            if (rootX == rootY) {
                return false; // Cycle detected
            }
            ufParent[rootY] = rootX;
            return true;
        }

        // Step 3: Try to build the tree, skipping candidate2 if it exists
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            // Skip candidate2 edge for now
            if (candidate2 != null && u == candidate2[0] && v == candidate2[1]) {
                continue;
            }

            if (!union(u, v, ufParent)) {
                // Found a cycle
                if (candidate1 != null) {
                    // Case 3: Node with two parents AND cycle
                    // The cycle involves candidate1, so remove it
                    return candidate1;
                } else {
                    // Case 1: Cycle but no node with two parents
                    return edge;
                }
            }
        }

        // Step 4: If we get here, no cycle was found
        // Case 2: Node with two parents but no cycle
        // Remove the later edge (candidate2)
        return candidate2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the number of edges (and nodes, since it's a tree with one extra edge). We make two passes through the edges: one to find nodes with two parents (O(n)), and another for Union-Find operations (O(nα(n)) where α is the inverse Ackermann function, effectively O(n)).

**Space Complexity: O(n)** for storing parent arrays and Union-Find structures. We use O(n) space for the `parent` array to track each node's parent, and O(n) for the Union-Find parent array.

## Common Mistakes

1. **Not handling all three cases separately**: The most common mistake is treating this like the undirected version (Redundant Connection I). Remember we have directed edges and three distinct scenarios.

2. **Incorrect cycle detection with directed edges**: Using standard undirected Union-Find won't work directly because edges are directed. We need to check if adding an edge creates a cycle in the parent-child relationship.

3. **Wrong edge removal when both issues exist**: When a node has two parents AND there's a cycle, candidates often remove the wrong edge. The key is to test which of the two candidate edges is part of the cycle by temporarily ignoring one and checking if a valid tree can be formed.

4. **Forgetting that root has no parent**: The root node should have no incoming edges. Make sure your algorithm accounts for this when checking for nodes with two parents.

## When You'll See This Pattern

This problem combines **Union-Find** for cycle detection with **graph validation** techniques. You'll see similar patterns in:

1. **Redundant Connection (Medium)** - The undirected version of this problem, which is simpler since you only need to detect cycles.

2. **Graph Valid Tree (Medium)** - Checking if a graph is a valid tree, which involves checking for cycles and connectivity.

3. **Accounts Merge (Medium)** - Uses Union-Find to merge connected components, similar to how we use it here to detect cycles.

The core pattern is using Union-Find to efficiently track connectivity and detect cycles in incremental graph building.

## Key Takeaways

1. **Directed trees have stricter rules**: Every node except root must have exactly one parent. This creates two types of violations: nodes with two parents, and cycles.

2. **Union-Find adapts to directed edges**: While typically used for undirected graphs, Union-Find can detect cycles in directed graphs when building a tree incrementally.

3. **Systematic case analysis is crucial**: Break complex problems into distinct cases (no double parent, double parent no cycle, both issues). Handle each case with specific logic.

Related problems: [Redundant Connection](/problem/redundant-connection)
