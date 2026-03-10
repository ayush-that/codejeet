---
title: "How to Solve Valid Arrangement of Pairs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Valid Arrangement of Pairs. Hard difficulty, 66.5% acceptance rate. Topics: Array, Depth-First Search, Graph Theory, Eulerian Circuit."
date: "2027-11-01"
category: "dsa-patterns"
tags: ["valid-arrangement-of-pairs", "array", "depth-first-search", "graph-theory", "hard"]
---

# How to Solve Valid Arrangement of Pairs

You're given pairs of integers `[start, end]` and must rearrange them into a sequence where each pair's `end` matches the next pair's `start`. This is essentially finding an Eulerian path through a directed graph where each pair is an edge from `start` to `end`. The challenge lies in efficiently reconstructing the path when multiple valid arrangements exist.

## Visual Walkthrough

Let's trace through example input: `pairs = [[5,1],[4,5],[1,2],[2,3],[3,4]]`

We can think of this as a directed graph:

- Node 5 → Node 1 (edge [5,1])
- Node 4 → Node 5 (edge [4,5])
- Node 1 → Node 2 (edge [1,2])
- Node 2 → Node 3 (edge [2,3])
- Node 3 → Node 4 (edge [3,4])

Visually: 5→1→2→3→4→5→1...

Notice this forms a cycle: 1→2→3→4→5→1. But we need to start somewhere. Let's try starting at node 1:

1. Start with [1,2]
2. Then [2,3] (2 matches end of previous)
3. Then [3,4]
4. Then [4,5]
5. Then [5,1]

This gives us: `[[1,2],[2,3],[3,4],[4,5],[5,1]]` — a valid arrangement!

The key insight: This is exactly finding an Eulerian path (a path using every edge exactly once) in a directed graph. We need to:

1. Find the starting node (node with outdegree = indegree + 1, or any node if all balanced)
2. Perform Hierholzer's algorithm (DFS that builds the path in reverse)

## Brute Force Approach

A naive approach would try all permutations of the pairs and check each one:

1. Generate all permutations of the pairs array
2. For each permutation, verify if `pairs[i][1] == pairs[i+1][0]` for all i
3. Return the first valid permutation

This has factorial time complexity O(n!) which is completely impractical even for small inputs (10 pairs = 3.6 million permutations).

Even a backtracking approach that builds the sequence incrementally would still be exponential. We need to recognize this as a graph theory problem.

## Optimized Approach

The problem reduces to finding an Eulerian path in a directed multigraph:

- Each pair `[u,v]` is a directed edge from u to v
- We need to use every edge exactly once
- The path must be contiguous (end of one edge = start of next)

**Key observations:**

1. This is exactly the "Eulerian path" problem for directed graphs
2. For Eulerian paths to exist in directed graphs:
   - At most one node has outdegree = indegree + 1 (start node)
   - At most one node has indegree = outdegree + 1 (end node)
   - All other nodes have balanced degrees
3. The input guarantees a valid arrangement exists

**Hierholzer's Algorithm for directed graphs:**

1. Build adjacency lists with edges stored in a stack/queue
2. Find the starting node (node with outdegree > indegree, or any node if all balanced)
3. Perform DFS, removing edges as we traverse them
4. Add nodes to the result path when we backtrack (post-order)
5. Reverse the result to get the correct order

**Why this works:** The algorithm efficiently finds Eulerian paths by always following available edges until stuck, then backtracking to find unused edges. The post-order collection ensures we build the path correctly.

## Optimal Solution

We'll implement Hierholzer's algorithm with adjacency lists using stacks for efficient edge removal.

<div class="code-group">

```python
# Time: O(n) where n = number of pairs
# Space: O(n) for adjacency list and recursion stack
from collections import defaultdict, deque

def validArrangement(pairs):
    """
    Returns any valid arrangement of pairs where each pair's end
    matches the next pair's start.
    """
    # Step 1: Build adjacency list and track degrees
    graph = defaultdict(list)
    indegree = defaultdict(int)
    outdegree = defaultdict(int)

    for u, v in pairs:
        graph[u].append(v)  # Add edge u->v
        outdegree[u] += 1   # u has one more outgoing edge
        indegree[v] += 1    # v has one more incoming edge

    # Step 2: Find starting node for Eulerian path
    # In Eulerian path, start node has outdegree = indegree + 1
    # If all balanced, any node works (we'll use first pair's start)
    start = pairs[0][0]  # Default starting node
    for node in graph:
        if outdegree[node] == indegree[node] + 1:
            start = node  # Found the actual start node
            break

    # Step 3: Hierholzer's algorithm (DFS-based)
    result = []

    def dfs(node):
        # Process all outgoing edges from this node
        while graph[node]:
            # Remove the last edge (pop from stack)
            next_node = graph[node].pop()
            dfs(next_node)
        # Add node to result in post-order (when backtracking)
        result.append(node)

    # Start DFS from the determined starting node
    dfs(start)

    # Step 4: The result is built in reverse (post-order DFS)
    # We need to reverse it and convert to pairs
    result.reverse()

    # Convert node sequence back to pairs
    arranged_pairs = []
    for i in range(len(result) - 1):
        arranged_pairs.append([result[i], result[i + 1]])

    return arranged_pairs
```

```javascript
// Time: O(n) where n = number of pairs
// Space: O(n) for adjacency list and recursion stack
function validArrangement(pairs) {
  // Step 1: Build adjacency list and track degrees
  const graph = new Map();
  const indegree = new Map();
  const outdegree = new Map();

  for (const [u, v] of pairs) {
    // Initialize maps if needed
    if (!graph.has(u)) graph.set(u, []);
    if (!indegree.has(u)) indegree.set(u, 0);
    if (!outdegree.has(u)) outdegree.set(u, 0);
    if (!indegree.has(v)) indegree.set(v, 0);
    if (!outdegree.has(v)) outdegree.set(v, 0);

    // Add edge and update degrees
    graph.get(u).push(v);
    outdegree.set(u, outdegree.get(u) + 1);
    indegree.set(v, indegree.get(v) + 1);
  }

  // Step 2: Find starting node for Eulerian path
  let start = pairs[0][0]; // Default starting node
  for (const [node, out] of outdegree) {
    const inDeg = indegree.get(node) || 0;
    if (out === inDeg + 1) {
      start = node; // Found the actual start node
      break;
    }
  }

  // Step 3: Hierholzer's algorithm (DFS-based)
  const result = [];

  function dfs(node) {
    const neighbors = graph.get(node) || [];
    // Process all outgoing edges from this node
    while (neighbors.length > 0) {
      // Remove the last edge (pop from stack)
      const nextNode = neighbors.pop();
      dfs(nextNode);
    }
    // Add node to result in post-order (when backtracking)
    result.push(node);
  }

  // Start DFS from the determined starting node
  dfs(start);

  // Step 4: The result is built in reverse (post-order DFS)
  // We need to reverse it and convert to pairs
  result.reverse();

  // Convert node sequence back to pairs
  const arrangedPairs = [];
  for (let i = 0; i < result.length - 1; i++) {
    arrangedPairs.push([result[i], result[i + 1]]);
  }

  return arrangedPairs;
}
```

```java
// Time: O(n) where n = number of pairs
// Space: O(n) for adjacency list and recursion stack
import java.util.*;

class Solution {
    public int[][] validArrangement(int[][] pairs) {
        // Step 1: Build adjacency list and track degrees
        Map<Integer, List<Integer>> graph = new HashMap<>();
        Map<Integer, Integer> indegree = new HashMap<>();
        Map<Integer, Integer> outdegree = new HashMap<>();

        for (int[] pair : pairs) {
            int u = pair[0], v = pair[1];

            // Add edge to adjacency list
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);

            // Update degrees
            outdegree.put(u, outdegree.getOrDefault(u, 0) + 1);
            indegree.put(v, indegree.getOrDefault(v, 0) + 1);
        }

        // Step 2: Find starting node for Eulerian path
        int start = pairs[0][0]; // Default starting node
        for (int node : graph.keySet()) {
            int out = outdegree.getOrDefault(node, 0);
            int in = indegree.getOrDefault(node, 0);
            if (out == in + 1) {
                start = node; // Found the actual start node
                break;
            }
        }

        // Step 3: Hierholzer's algorithm (DFS-based)
        List<Integer> result = new ArrayList<>();

        // Use iterative DFS to avoid stack overflow for large inputs
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(start);

        while (!stack.isEmpty()) {
            int node = stack.peek();
            List<Integer> neighbors = graph.get(node);

            if (neighbors != null && !neighbors.isEmpty()) {
                // Remove the last edge (more efficient than removing from front)
                int nextNode = neighbors.remove(neighbors.size() - 1);
                stack.push(nextNode);
            } else {
                // No more outgoing edges, add to result
                result.add(node);
                stack.pop();
            }
        }

        // Step 4: The result is built in reverse (post-order DFS)
        // We need to reverse it and convert to pairs
        Collections.reverse(result);

        // Convert node sequence back to pairs
        int[][] arrangedPairs = new int[pairs.length][2];
        for (int i = 0; i < result.size() - 1; i++) {
            arrangedPairs[i][0] = result.get(i);
            arrangedPairs[i][1] = result.get(i + 1);
        }

        return arrangedPairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building adjacency list and degree maps: O(n)
- Finding start node: O(k) where k is number of unique nodes (≤ n)
- Hierholzer's algorithm: O(n) since we process each edge exactly once
- Reversing result and building output: O(n)

**Space Complexity: O(n)**

- Adjacency list stores all edges: O(n)
- Degree maps store counts for each node: O(k) where k ≤ n
- Recursion stack (or explicit stack): O(n) in worst case
- Result storage: O(n)

The linear time complexity is optimal since we must at least examine all input pairs.

## Common Mistakes

1. **Not handling multiple edges between same nodes**: The adjacency list must support multiple edges between the same nodes. Using a list/stack for neighbors handles this correctly.

2. **Wrong starting node selection**: Forgetting that in Eulerian paths, the start node has `outdegree = indegree + 1`. If all nodes are balanced (Eulerian circuit), any node works.

3. **Incorrect edge removal order**: When using DFS, we must remove edges as we traverse them. Using `pop()` from a stack ensures O(1) removal. Removing from the front would be O(n).

4. **Forgetting to reverse the result**: Hierholzer's algorithm builds the path in reverse order (post-order DFS). Candidates often return the result without reversing, getting the wrong sequence.

5. **Stack overflow in recursion**: For large inputs, recursive DFS can cause stack overflow. The Java solution shows an iterative approach using an explicit stack.

## When You'll See This Pattern

This Eulerian path/circuit pattern appears in problems involving:

- **Reconstructing sequences** where elements must chain together
- **Finding paths using all edges** in a graph
- **Word chaining problems** where last letter of one word = first letter of next

Related LeetCode problems:

1. **Reconstruct Itinerary (Hard)** - Almost identical problem but with lexical ordering requirement
2. **Cracking the Safe (Hard)** - Finding de Bruijn sequence, which is an Eulerian circuit problem
3. **Find if Path Exists in Graph (Easy)** - Simpler connectivity problem, good warm-up for graph concepts

## Key Takeaways

1. **Recognize Eulerian path problems**: When you need to use every "connection" exactly once in a chain, think of Eulerian paths in graphs.

2. **Hierholzer's algorithm is the key**: For Eulerian paths/circuits in directed graphs, Hierholzer's O(n) algorithm is optimal. Remember it builds the path in reverse.

3. **Start node matters**: In Eulerian paths (not circuits), the start node has one more outgoing than incoming edge. In circuits (all balanced), any node works.

4. **Graph representation choice**: For efficiency, use adjacency lists with stacks/queues for neighbors to enable O(1) edge removal during traversal.

Related problems: [Reconstruct Itinerary](/problem/reconstruct-itinerary), [Find if Path Exists in Graph](/problem/find-if-path-exists-in-graph)
