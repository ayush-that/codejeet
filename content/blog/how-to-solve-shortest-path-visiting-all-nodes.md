---
title: "How to Solve Shortest Path Visiting All Nodes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Path Visiting All Nodes. Hard difficulty, 65.8% acceptance rate. Topics: Dynamic Programming, Bit Manipulation, Breadth-First Search, Graph Theory, Bitmask."
date: "2026-09-22"
category: "dsa-patterns"
tags:
  [
    "shortest-path-visiting-all-nodes",
    "dynamic-programming",
    "bit-manipulation",
    "breadth-first-search",
    "hard",
  ]
---

# How to Solve Shortest Path Visiting All Nodes

You're given an undirected, connected graph and need to find the shortest path that visits every node at least once. You can start and end at any node. What makes this problem tricky is that you're not just finding a path between two nodes—you need to visit ALL nodes, and you can revisit nodes and edges as needed. This is essentially the Traveling Salesman Problem on a general graph, but with the twist that you can revisit nodes.

## Visual Walkthrough

Let's trace through a simple example: `graph = [[1,2,3],[0],[0],[0]]`

```
    1
    |
0---2
|
3
```

We have 4 nodes (0-3). Node 0 connects to 1, 2, and 3. Nodes 1, 2, and 3 only connect to node 0.

A brute force approach would try all permutations of nodes: 0→1→2→3, 0→1→3→2, etc. But we can do better by thinking in terms of state.

Key insight: Our state needs to track both **which node we're currently at** AND **which nodes we've visited so far**.

Let's use bitmasking to represent visited nodes:

- Bit 0 = node 0 visited
- Bit 1 = node 1 visited
- Bit 2 = node 2 visited
- Bit 3 = node 3 visited

State = (current_node, visited_mask)

Starting at node 0 with only node 0 visited: (0, 0001₂ = 1)

- From here, we can go to nodes 1, 2, or 3
- Going to node 1: state becomes (1, 0011₂ = 3)
- Going to node 2: state becomes (2, 0101₂ = 5)
- Going to node 3: state becomes (3, 1001₂ = 9)

We continue this BFS until we reach a state where all bits are set (mask = 1111₂ = 15).

The shortest path length is the BFS level when we first reach the "all visited" state.

## Brute Force Approach

A naive approach would be to try all permutations of nodes and find the shortest Hamiltonian path. However:

1. We'd need to check if each consecutive pair in the permutation is connected
2. We'd need to find the actual shortest path between each pair (not just if they're directly connected)
3. The number of permutations is n! which grows impossibly large even for modest n

Even if we tried to brute force with DFS, exploring all possible paths, we'd quickly hit exponential time complexity since we can revisit nodes. Without tracking visited states properly, we could get stuck in infinite loops.

The brute force approach is fundamentally flawed because it doesn't account for the fact that we need to track both position AND which nodes we've visited to avoid redundant exploration.

## Optimized Approach

The key insight is to use **BFS with state compression**:

1. **State representation**: Each state is (current_node, visited_mask)
   - current_node: where we are right now (0 to n-1)
   - visited_mask: bitmask where bit i is 1 if node i has been visited
2. **BFS exploration**: We explore states level by level
   - Start from all possible starting nodes (0 to n-1) with only that node visited
   - At each step, from current state (node, mask), try moving to all neighbors
   - Update mask: mask | (1 << neighbor)
   - If we've seen this (node, mask) state before, skip it (visited set)
3. **Goal state**: When mask == (1 << n) - 1 (all bits set to 1)

4. **Why BFS works**: BFS finds the shortest path in unweighted graphs. Each "step" in BFS corresponds to traversing one edge in the graph.

This is essentially a shortest path problem in the **state space graph**, where each state is (node, mask), and edges correspond to moving to adjacent nodes in the original graph.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n * 2^n)
def shortestPathLength(graph):
    """
    Find the shortest path that visits all nodes in an undirected graph.

    Args:
        graph: List of lists, where graph[i] contains neighbors of node i

    Returns:
        Minimum number of edges to traverse to visit all nodes
    """
    n = len(graph)  # Number of nodes
    if n == 1:
        return 0  # Only one node, no edges needed

    # Target mask when all nodes are visited
    target_mask = (1 << n) - 1

    # BFS queue: each element is (current_node, visited_mask)
    queue = []

    # visited[node][mask] tracks if we've been at node with this mask before
    visited = [[False] * (1 << n) for _ in range(n)]

    # Initialize BFS with all possible starting nodes
    for i in range(n):
        start_mask = 1 << i  # Only node i is visited
        queue.append((i, start_mask))
        visited[i][start_mask] = True

    steps = 0  # BFS level counter

    while queue:
        # Process all nodes at current BFS level
        level_size = len(queue)
        for _ in range(level_size):
            node, mask = queue.pop(0)

            # Check if we've visited all nodes
            if mask == target_mask:
                return steps

            # Try moving to all neighbors
            for neighbor in graph[node]:
                # Update mask to include the neighbor
                new_mask = mask | (1 << neighbor)

                # If we haven't seen this state before, add to queue
                if not visited[neighbor][new_mask]:
                    visited[neighbor][new_mask] = True
                    queue.append((neighbor, new_mask))

        # Move to next BFS level (one more edge traversed)
        steps += 1

    return -1  # Should never reach here for connected graphs
```

```javascript
// Time: O(n * 2^n) | Space: O(n * 2^n)
function shortestPathLength(graph) {
  /**
   * Find the shortest path that visits all nodes in an undirected graph.
   *
   * @param {number[][]} graph - Adjacency list where graph[i] contains neighbors of node i
   * @return {number} Minimum number of edges to traverse to visit all nodes
   */
  const n = graph.length; // Number of nodes
  if (n === 1) return 0; // Only one node, no edges needed

  // Target mask when all nodes are visited (all bits set to 1)
  const targetMask = (1 << n) - 1;

  // BFS queue: each element is [current_node, visited_mask]
  const queue = [];

  // visited[node][mask] tracks if we've been at node with this mask before
  const visited = Array.from({ length: n }, () => Array(1 << n).fill(false));

  // Initialize BFS with all possible starting nodes
  for (let i = 0; i < n; i++) {
    const startMask = 1 << i; // Only node i is visited
    queue.push([i, startMask]);
    visited[i][startMask] = true;
  }

  let steps = 0; // BFS level counter

  while (queue.length > 0) {
    // Process all nodes at current BFS level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [node, mask] = queue.shift();

      // Check if we've visited all nodes
      if (mask === targetMask) {
        return steps;
      }

      // Try moving to all neighbors
      for (const neighbor of graph[node]) {
        // Update mask to include the neighbor
        const newMask = mask | (1 << neighbor);

        // If we haven't seen this state before, add to queue
        if (!visited[neighbor][newMask]) {
          visited[neighbor][newMask] = true;
          queue.push([neighbor, newMask]);
        }
      }
    }

    // Move to next BFS level (one more edge traversed)
    steps++;
  }

  return -1; // Should never reach here for connected graphs
}
```

```java
// Time: O(n * 2^n) | Space: O(n * 2^n)
class Solution {
    public int shortestPathLength(int[][] graph) {
        /**
         * Find the shortest path that visits all nodes in an undirected graph.
         *
         * @param graph Adjacency list where graph[i] contains neighbors of node i
         * @return Minimum number of edges to traverse to visit all nodes
         */
        int n = graph.length;  // Number of nodes
        if (n == 1) return 0;  // Only one node, no edges needed

        // Target mask when all nodes are visited (all bits set to 1)
        int targetMask = (1 << n) - 1;

        // BFS queue: each element is int[2] where [0]=current_node, [1]=visited_mask
        Queue<int[]> queue = new LinkedList<>();

        // visited[node][mask] tracks if we've been at node with this mask before
        boolean[][] visited = new boolean[n][1 << n];

        // Initialize BFS with all possible starting nodes
        for (int i = 0; i < n; i++) {
            int startMask = 1 << i;  // Only node i is visited
            queue.offer(new int[]{i, startMask});
            visited[i][startMask] = true;
        }

        int steps = 0;  // BFS level counter

        while (!queue.isEmpty()) {
            // Process all nodes at current BFS level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int node = current[0];
                int mask = current[1];

                // Check if we've visited all nodes
                if (mask == targetMask) {
                    return steps;
                }

                // Try moving to all neighbors
                for (int neighbor : graph[node]) {
                    // Update mask to include the neighbor
                    int newMask = mask | (1 << neighbor);

                    // If we haven't seen this state before, add to queue
                    if (!visited[neighbor][newMask]) {
                        visited[neighbor][newMask] = true;
                        queue.offer(new int[]{neighbor, newMask});
                    }
                }
            }

            // Move to next BFS level (one more edge traversed)
            steps++;
        }

        return -1;  // Should never reach here for connected graphs
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2ⁿ)**

- We have n possible nodes and 2ⁿ possible masks (each node can be visited or not)
- In worst case, we visit each (node, mask) state once: n × 2ⁿ states
- For each state, we check all neighbors (up to n-1 edges)
- Total: O(n² × 2ⁿ) in theory, but in practice O(n × 2ⁿ) since average degree is constant

**Space Complexity: O(n × 2ⁿ)**

- We store visited states: n × 2ⁿ boolean values
- BFS queue can hold up to O(n × 2ⁿ) elements in worst case
- Total: O(n × 2ⁿ)

The exponential factor 2ⁿ makes this solution practical only for n ≤ 20-25, which is typical for bitmask DP problems.

## Common Mistakes

1. **Forgetting to track visited states**: Simply doing BFS from each starting node without tracking which nodes have been visited leads to infinite loops or incorrect results. You must track (node, mask) pairs.

2. **Wrong bitmask operations**: Common errors include:
   - Using `mask & (1 << i)` instead of `mask | (1 << i)` to update visited nodes
   - Incorrect target mask: should be `(1 << n) - 1`, not `(1 << (n-1))` or `n`
   - Off-by-one errors in bit positions

3. **Starting from only one node**: The problem allows starting at any node, so you must initialize BFS with ALL nodes as possible starting points. Starting from just node 0 might miss shorter paths.

4. **Using DFS instead of BFS**: DFS won't guarantee the shortest path. BFS is essential because each level corresponds to path length.

## When You'll See This Pattern

This "BFS with bitmask" pattern appears in several graph problems where you need to:

1. Visit multiple locations
2. Track which ones you've visited
3. Find the shortest path

Related problems:

1. **847. Shortest Path Visiting All Nodes** (this problem) - The canonical example
2. **864. Shortest Path to Get All Keys** - Similar state (position + keys collected), but with obstacles and keys/doors
3. **943. Find the Shortest Superstring** - Different domain (strings) but similar DP with bitmask approach
4. **Find the Minimum Cost Array Permutation** - Uses bitmask DP for permutation optimization

The pattern is: when you need to track a subset of visited items during traversal, and the subset size is small enough (n ≤ 20-25), bitmask DP with BFS/DFS is often the solution.

## Key Takeaways

1. **State compression with bitmasks** is powerful for tracking subsets when n is small. Each bit represents whether an element is included/visited.

2. **BFS in state space** transforms complex pathfinding into standard shortest path: define states (position + visited_set), transitions (move to neighbors), and goal state (all visited).

3. **Initialize from all starting points** when the problem allows starting anywhere. This is more efficient than trying each starting point separately.

Remember: when a problem involves visiting multiple locations and finding the shortest path, think about whether you can use (position, visited_mask) as your state.

Related problems: [Find the Minimum Cost Array Permutation](/problem/find-the-minimum-cost-array-permutation)
