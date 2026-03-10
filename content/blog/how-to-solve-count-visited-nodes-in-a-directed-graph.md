---
title: "How to Solve Count Visited Nodes in a Directed Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Visited Nodes in a Directed Graph. Hard difficulty, 30.3% acceptance rate. Topics: Dynamic Programming, Graph Theory, Memoization."
date: "2026-02-27"
category: "dsa-patterns"
tags:
  [
    "count-visited-nodes-in-a-directed-graph",
    "dynamic-programming",
    "graph-theory",
    "memoization",
    "hard",
  ]
---

# How to Solve Count Visited Nodes in a Directed Graph

This problem presents a directed graph where each node has exactly one outgoing edge, forming functional graphs that always contain cycles. The challenge is to determine, for each starting node, how many distinct nodes you'll visit before revisiting a node. The tricky part is that naive simulation for each node would be O(n²), but we can leverage memoization and cycle detection to achieve O(n) efficiency.

## Visual Walkthrough

Let's trace through a small example: `edges = [1, 2, 0, 4, 5, 3]` with `n = 6`.

**Graph structure:**

- Node 0 → 1
- Node 1 → 2
- Node 2 → 0 (forms cycle 0→1→2→0)
- Node 3 → 4
- Node 4 → 5
- Node 5 → 3 (forms cycle 3→4→5→3)

**Starting from node 0:**

- Path: 0 → 1 → 2 → 0 (revisits 0)
- Distinct nodes visited: {0, 1, 2} = 3 nodes

**Starting from node 3:**

- Path: 3 → 4 → 5 → 3 (revisits 3)
- Distinct nodes visited: {3, 4, 5} = 3 nodes

But what about nodes that lead into cycles? Let's add a node 6 that points to 0: `edges = [1, 2, 0, 4, 5, 3, 0]`

**Starting from node 6:**

- Path: 6 → 0 → 1 → 2 → 0 (revisits 0)
- Distinct nodes: {6, 0, 1, 2} = 4 nodes

Notice that once we reach a cycle, all nodes in that cycle have the same answer (3 in the first cycle). Nodes leading into cycles have answers equal to their distance to the cycle plus the cycle size.

## Brute Force Approach

The most straightforward approach is to simulate the process for each starting node:

1. For each node i from 0 to n-1:
   - Start from node i
   - Follow edges until we encounter a node we've seen before
   - Count distinct nodes visited
   - Store the count for node i

This brute force has two major issues:

1. **Time Complexity:** O(n²) in worst case (when graph is a single long chain)
2. **Repeated Work:** We're recomputing the same paths multiple times

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force(edges):
    n = len(edges)
    result = [0] * n

    for i in range(n):
        visited = set()
        current = i

        # Follow edges until we revisit a node
        while current not in visited:
            visited.add(current)
            current = edges[current]

        result[i] = len(visited)

    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForce(edges) {
  const n = edges.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const visited = new Set();
    let current = i;

    // Follow edges until we revisit a node
    while (!visited.has(current)) {
      visited.add(current);
      current = edges[current];
    }

    result[i] = visited.size;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public int[] bruteForce(int[] edges) {
    int n = edges.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        Set<Integer> visited = new HashSet<>();
        int current = i;

        // Follow edges until we revisit a node
        while (!visited.contains(current)) {
            visited.add(current);
            current = edges[current];
        }

        result[i] = visited.size();
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that our graph has special properties we can exploit:

1. **Each node has exactly one outgoing edge** - This creates functional graphs where every path eventually leads to a cycle
2. **Cycles are inevitable** - With n nodes and n edges, every path must eventually enter a cycle
3. **Memoization is possible** - Once we compute the answer for a node in a cycle, all nodes in that cycle have the same answer

The optimal approach uses DFS with state tracking:

- **UNVISITED:** Node hasn't been processed yet
- **VISITING:** Node is in the current DFS path (helps detect cycles)
- **VISITED:** Node has been fully processed

When we detect a cycle, we can compute the cycle size and assign that value to all nodes in the cycle. For nodes leading into cycles, we compute their distance to the cycle plus the cycle size.

## Optimal Solution

We'll use DFS with three states and memoization to avoid redundant computations.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countVisitedNodes(edges):
    n = len(edges)
    # States: 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * n
    # Memoization: stores answer for each node once computed
    memo = [0] * n

    def dfs(node):
        # If we've already computed answer for this node, return it
        if state[node] == 2:
            return memo[node]

        # If we encounter a node currently being visited, we found a cycle
        if state[node] == 1:
            # We're in a cycle - need to compute cycle size
            # Start from current node and follow edges until we return
            cycle_start = node
            current = edges[node]
            cycle_size = 1

            # Count nodes in the cycle
            while current != cycle_start:
                cycle_size += 1
                current = edges[current]

            # All nodes in cycle get the cycle size as answer
            current = cycle_start
            for _ in range(cycle_size):
                memo[current] = cycle_size
                state[current] = 2  # Mark as fully processed
                current = edges[current]

            return cycle_size

        # Mark as visiting (in current DFS path)
        state[node] = 1

        # Recursively process the next node
        result = 1 + dfs(edges[node])

        # If we haven't computed answer for this node yet (not in a cycle)
        if state[node] != 2:
            memo[node] = result
            state[node] = 2

        return result

    # Process each node
    for i in range(n):
        if state[i] == 0:  # Only process unvisited nodes
            dfs(i)

    return memo
```

```javascript
// Time: O(n) | Space: O(n)
function countVisitedNodes(edges) {
  const n = edges.length;
  // States: 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Array(n).fill(0);
  // Memoization: stores answer for each node once computed
  const memo = new Array(n).fill(0);

  function dfs(node) {
    // If we've already computed answer for this node, return it
    if (state[node] === 2) {
      return memo[node];
    }

    // If we encounter a node currently being visited, we found a cycle
    if (state[node] === 1) {
      // We're in a cycle - need to compute cycle size
      // Start from current node and follow edges until we return
      const cycleStart = node;
      let current = edges[node];
      let cycleSize = 1;

      // Count nodes in the cycle
      while (current !== cycleStart) {
        cycleSize++;
        current = edges[current];
      }

      // All nodes in cycle get the cycle size as answer
      current = cycleStart;
      for (let i = 0; i < cycleSize; i++) {
        memo[current] = cycleSize;
        state[current] = 2; // Mark as fully processed
        current = edges[current];
      }

      return cycleSize;
    }

    // Mark as visiting (in current DFS path)
    state[node] = 1;

    // Recursively process the next node
    const result = 1 + dfs(edges[node]);

    // If we haven't computed answer for this node yet (not in a cycle)
    if (state[node] !== 2) {
      memo[node] = result;
      state[node] = 2;
    }

    return result;
  }

  // Process each node
  for (let i = 0; i < n; i++) {
    if (state[i] === 0) {
      // Only process unvisited nodes
      dfs(i);
    }
  }

  return memo;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] countVisitedNodes(List<Integer> edges) {
        int n = edges.size();
        // States: 0 = unvisited, 1 = visiting, 2 = visited
        int[] state = new int[n];
        // Memoization: stores answer for each node once computed
        int[] memo = new int[n];

        for (int i = 0; i < n; i++) {
            if (state[i] == 0) {  // Only process unvisited nodes
                dfs(i, edges, state, memo);
            }
        }

        return memo;
    }

    private int dfs(int node, List<Integer> edges, int[] state, int[] memo) {
        // If we've already computed answer for this node, return it
        if (state[node] == 2) {
            return memo[node];
        }

        // If we encounter a node currently being visited, we found a cycle
        if (state[node] == 1) {
            // We're in a cycle - need to compute cycle size
            // Start from current node and follow edges until we return
            int cycleStart = node;
            int current = edges.get(node);
            int cycleSize = 1;

            // Count nodes in the cycle
            while (current != cycleStart) {
                cycleSize++;
                current = edges.get(current);
            }

            // All nodes in cycle get the cycle size as answer
            current = cycleStart;
            for (int i = 0; i < cycleSize; i++) {
                memo[current] = cycleSize;
                state[current] = 2;  // Mark as fully processed
                current = edges.get(current);
            }

            return cycleSize;
        }

        // Mark as visiting (in current DFS path)
        state[node] = 1;

        // Recursively process the next node
        int result = 1 + dfs(edges.get(node), edges, state, memo);

        // If we haven't computed answer for this node yet (not in a cycle)
        if (state[node] != 2) {
            memo[node] = result;
            state[node] = 2;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each node is processed exactly once when we mark it as visited
- Each edge is followed exactly once during DFS
- Cycle detection adds at most O(n) additional work since we traverse each cycle once

**Space Complexity: O(n)**

- `state` array: O(n) to track node states
- `memo` array: O(n) to store computed answers
- Recursion stack: O(n) in worst case (when graph is a single chain)

The linear complexity comes from memoization - without it, we'd have exponential redundant computations.

## Common Mistakes

1. **Not handling cycles correctly:** The most common error is treating cycles like regular paths. Remember that all nodes in a cycle have the same answer (the cycle size), not increasing values.

2. **Forgetting to mark nodes as fully processed:** If you don't properly update the state array, you might get infinite recursion or incorrect results for nodes that lead into cycles.

3. **Incorrect cycle size calculation:** When detecting a cycle, make sure to count all nodes in the cycle, not just from the detection point. The cycle starts from the first node where `state[node] == 1`.

4. **Not using memoization for nodes outside cycles:** Nodes that lead into cycles need their distances computed. Without memoization, you'll recompute these paths multiple times.

## When You'll See This Pattern

This pattern of DFS with state tracking for cycle detection appears in several graph problems:

1. **Course Schedule (LeetCode 207):** Detecting cycles in a directed graph to determine if courses can be scheduled. Uses similar three-state DFS.

2. **Find the Duplicate Number (LeetCode 287):** Can be solved using Floyd's cycle detection (tortoise and hare) in a functional graph.

3. **Linked List Cycle II (LeetCode 142):** Finding the start of a cycle in a linked list, which is essentially a functional graph with n nodes and n edges.

The key similarity is working with functional graphs (each node has exactly one outgoing edge) and needing to detect/analyze cycles efficiently.

## Key Takeaways

1. **Functional graphs always contain cycles:** When each node has exactly one outgoing edge in an n-node graph, every path must eventually enter a cycle. This structural property enables efficient solutions.

2. **Three-state DFS is powerful for cycle detection:** Using UNVISITED/VISITING/VISITED states allows you to detect cycles during DFS traversal and handle them specially.

3. **Memoization eliminates redundant work:** Once you compute the answer for a node (especially in a cycle), store it so you don't recompute the same path multiple times.

Remember: When you see a problem where each element points to exactly one other element, think about cycles and consider using state-tracking DFS with memoization.

[Practice this problem on CodeJeet](/problem/count-visited-nodes-in-a-directed-graph)
