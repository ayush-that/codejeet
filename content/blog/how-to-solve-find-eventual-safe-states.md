---
title: "How to Solve Find Eventual Safe States — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Eventual Safe States. Medium difficulty, 70.3% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2027-04-07"
category: "dsa-patterns"
tags:
  [
    "find-eventual-safe-states",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve Find Eventual Safe States

This problem asks us to identify "safe" nodes in a directed graph — nodes where all possible paths eventually reach a terminal node (a node with no outgoing edges). The tricky part is that cycles make nodes unsafe, but not all nodes in a cycle are necessarily unsafe if they can escape the cycle. This requires careful tracking of each node's state during traversal.

## Visual Walkthrough

Let's trace through a concrete example: `graph = [[1,2],[2,3],[5],[0],[5],[],[]]`

We have 7 nodes (0-6):

- Node 0 → [1, 2]
- Node 1 → [2, 3]
- Node 2 → [5]
- Node 3 → [0]
- Node 4 → [5]
- Node 5 → [] (terminal)
- Node 6 → [] (terminal)

**Step-by-step reasoning:**

1. **Terminal nodes (5 and 6)** are safe by definition — they have no outgoing edges.
2. **Node 4** only goes to node 5 (terminal), so node 4 is safe.
3. **Node 2** only goes to node 5 (terminal), so node 2 is safe.
4. **Node 1** goes to nodes 2 and 3. Node 2 is safe, but we need to check node 3.
5. **Node 3** goes to node 0, creating a cycle: 0→1→3→0. Since this cycle has no path to a terminal node, all nodes in this cycle (0, 1, 3) are unsafe.
6. **Node 6** is terminal, so safe.

**Result:** Safe nodes are [2, 4, 5, 6] (sorted).

The key insight: We need to detect cycles that don't lead to terminals, but also identify nodes that can escape cycles to reach terminals.

## Brute Force Approach

A naive approach might try to explore all paths from each node:

1. For each node, perform DFS to explore all possible paths
2. If any path enters a cycle without reaching a terminal, mark the node unsafe
3. If all paths eventually reach a terminal, mark the node safe

**Why this fails:**

- Exponential time complexity — exploring all paths could be O(n!)
- Redundant work — we'd recompute the same subproblems repeatedly
- Difficult to detect cycles efficiently without getting stuck in infinite recursion

The brute force approach is impractical for graphs with even moderate size (n up to 10^4 in this problem).

## Optimized Approach

The optimal solution uses **DFS with state tracking** (also known as the "white-gray-black" algorithm):

**Key Insight:** We can classify each node into one of three states:

- **UNVISITED (0):** Node hasn't been processed yet
- **VISITING (1):** Node is currently in the recursion stack (part of an active DFS path)
- **SAFE (2):** Node has been confirmed as safe (all paths lead to terminals)

**How it works:**

1. Perform DFS from each unvisited node
2. If we encounter a node marked VISITING during DFS, we've found a cycle → all nodes in that path are unsafe
3. If we reach a terminal node or a node already marked SAFE, we can mark the current path as safe
4. Only mark a node as SAFE after confirming all its neighbors are safe

This approach has O(n + e) time complexity where n is nodes and e is edges, since each node and edge is processed at most once.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + e) where n = nodes, e = edges | Space: O(n)
class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        # 0 = unvisited, 1 = visiting (in current path), 2 = safe
        state = [0] * n

        def dfs(node: int) -> bool:
            """Returns True if node is safe, False if unsafe."""
            # If already visited, return cached result
            if state[node] != 0:
                return state[node] == 2

            # Mark as currently visiting (part of current DFS path)
            state[node] = 1

            # Check all neighbors
            for neighbor in graph[node]:
                # If neighbor is unsafe or part of current path (cycle), this node is unsafe
                if not dfs(neighbor):
                    return False

            # All neighbors are safe, so this node is safe
            state[node] = 2
            return True

        # Check each node
        safe_nodes = []
        for i in range(n):
            if dfs(i):
                safe_nodes.append(i)

        return safe_nodes
```

```javascript
// Time: O(n + e) where n = nodes, e = edges | Space: O(n)
/**
 * @param {number[][]} graph
 * @return {number[]}
 */
var eventualSafeNodes = function (graph) {
  const n = graph.length;
  // 0 = unvisited, 1 = visiting (in current path), 2 = safe
  const state = new Array(n).fill(0);

  const dfs = (node) => {
    // If already visited, return cached result
    if (state[node] !== 0) {
      return state[node] === 2;
    }

    // Mark as currently visiting (part of current DFS path)
    state[node] = 1;

    // Check all neighbors
    for (const neighbor of graph[node]) {
      // If neighbor is unsafe or part of current path (cycle), this node is unsafe
      if (!dfs(neighbor)) {
        return false;
      }
    }

    // All neighbors are safe, so this node is safe
    state[node] = 2;
    return true;
  };

  // Check each node
  const safeNodes = [];
  for (let i = 0; i < n; i++) {
    if (dfs(i)) {
      safeNodes.push(i);
    }
  }

  return safeNodes;
};
```

```java
// Time: O(n + e) where n = nodes, e = edges | Space: O(n)
class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        // 0 = unvisited, 1 = visiting (in current path), 2 = safe
        int[] state = new int[n];
        List<Integer> safeNodes = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (dfs(i, graph, state)) {
                safeNodes.add(i);
            }
        }

        return safeNodes;
    }

    private boolean dfs(int node, int[][] graph, int[] state) {
        // If already visited, return cached result
        if (state[node] != 0) {
            return state[node] == 2;
        }

        // Mark as currently visiting (part of current DFS path)
        state[node] = 1;

        // Check all neighbors
        for (int neighbor : graph[node]) {
            // If neighbor is unsafe or part of current path (cycle), this node is unsafe
            if (!dfs(neighbor, graph, state)) {
                return false;
            }
        }

        // All neighbors are safe, so this node is safe
        state[node] = 2;
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + e)**

- We visit each node exactly once (O(n))
- We traverse each edge exactly once (O(e))
- The DFS ensures we don't reprocess nodes whose state is already determined

**Space Complexity: O(n)**

- The `state` array uses O(n) space
- Recursion stack depth could be O(n) in worst case (linear chain)
- Overall auxiliary space is O(n)

## Common Mistakes

1. **Forgetting to handle cycles properly:** Simply marking nodes as visited isn't enough. You need to distinguish between "visited in current path" (cycle detection) and "visited in previous search" (already processed).

2. **Incorrect state transitions:** Marking a node as safe too early — you must confirm ALL neighbors are safe before marking a node as safe. The order matters: check neighbors first, then update current node.

3. **Not returning sorted results:** The problem expects the result in ascending order. While our DFS approach naturally processes nodes 0 to n-1 and adds them in order, some implementations might need explicit sorting.

4. **Confusing terminal nodes with safe nodes:** All terminal nodes are safe, but not all safe nodes are terminal. A node is safe if ALL paths from it lead to terminals, which means it might have outgoing edges as long as they all eventually reach terminals.

## When You'll See This Pattern

This "DFS with state tracking" pattern appears in many graph problems involving cycle detection and dependency resolution:

1. **Course Schedule (LeetCode 207):** Detect cycles in course prerequisites using almost identical state tracking (0=unvisited, 1=visiting, 2=visited).

2. **Course Schedule II (LeetCode 210):** Same cycle detection but also produces topological ordering.

3. **Find All Possible Recipes from Given Supplies (LeetCode 2115):** Similar dependency checking with cycle detection in recipe ingredients.

4. **Longest Increasing Path in a Matrix (LeetCode 329):** Uses memoization with DFS to avoid recomputation, similar to our state caching.

The pattern is: when you need to explore paths but might encounter cycles, use state tracking to avoid infinite loops and memoize results to avoid redundant work.

## Key Takeaways

1. **Three-state DFS is powerful for cycle detection:** The UNVISITED/VISITING/SAFE (or VISITED) pattern elegantly handles cycles while allowing result caching.

2. **Think in terms of "all paths must satisfy":** For a node to be safe, ALL outgoing paths must lead to terminals. This is different from problems where ANY path satisfying a condition is sufficient.

3. **Terminal nodes are your base case:** In recursive graph problems, always identify the base cases first. Here, terminal nodes (no outgoing edges) are inherently safe.

4. **The problem is essentially topological sort in reverse:** Safe nodes are those that can reach the "sink" nodes in the reversed graph. An alternative solution uses Kahn's algorithm on the reversed graph.

Related problems: [Build a Matrix With Conditions](/problem/build-a-matrix-with-conditions)
