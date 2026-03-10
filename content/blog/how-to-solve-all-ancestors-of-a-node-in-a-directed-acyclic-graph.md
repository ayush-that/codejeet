---
title: "How to Solve All Ancestors of a Node in a Directed Acyclic Graph — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Ancestors of a Node in a Directed Acyclic Graph. Medium difficulty, 62.1% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2026-07-26"
category: "dsa-patterns"
tags:
  [
    "all-ancestors-of-a-node-in-a-directed-acyclic-graph",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve All Ancestors of a Node in a Directed Acyclic Graph

You're given a directed acyclic graph (DAG) with `n` nodes and asked to find all ancestors for each node — that is, all nodes that can reach a given node via any path. The challenge is that ancestors aren't just immediate parents but all nodes in the chain leading to a node. This problem tests your understanding of graph traversal and efficient set operations in DAGs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** n = 8, edges = [[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]

**Graph visualization:**

```
0 → 3 → 5
    ↓   ↓
    6 ← 4 ← 2
    ↓       ↓
    7 ←-----┘
 ↑
1
```

**Step-by-step ancestor collection for node 7:**

1. Direct parents of node 7: nodes 3 and 2
2. Ancestors of node 3: nodes 0 and 1 (since 0→3 and 1→3)
3. Ancestors of node 2: none (node 2 has no incoming edges)
4. Ancestors of node 0: none
5. Ancestors of node 1: none
6. Therefore, all ancestors of node 7: {0, 1, 2, 3}

The key insight: ancestors propagate forward through the graph. If node A is an ancestor of node B, and node B is an ancestor of node C, then node A is also an ancestor of node C.

## Brute Force Approach

A naive approach would be to perform DFS/BFS from every node to find all reachable nodes, then invert the relationships. For each node `u`, we'd traverse the graph to find all nodes `v` that `u` can reach, then mark `u` as an ancestor of each `v`.

**Why this fails:**

- Time complexity: O(n × (n + e)) where e is the number of edges
- For n = 1000 and dense graphs, this becomes O(10⁶ × 10⁶) operations
- We're doing redundant work — the same paths get traversed multiple times

The brute force doesn't leverage the DAG structure or the fact that ancestor relationships are transitive.

## Optimized Approach

The key insight is that we can process nodes in **topological order** (from sources to sinks) and propagate ancestor sets forward. Here's the step-by-step reasoning:

1. **Build the graph adjacency list** in the forward direction (parents to children)
2. **Compute topological order** using Kahn's algorithm (BFS-based) or DFS
3. **Process nodes in topological order** from sources to sinks
4. **Propagate ancestor sets**: For each node `u`, add `u` to the ancestor sets of all its children, and also propagate all of `u`'s ancestors to its children
5. **Use sets for efficient union operations** to avoid duplicates

Why topological order works: When we process a node, all its ancestors have already been processed (since they come before it in topological order). This ensures we have complete ancestor information to propagate.

## Optimal Solution

We'll implement the topological sort approach using Kahn's algorithm (BFS-based) for clarity and to avoid recursion depth issues.

<div class="code-group">

```python
# Time: O(n^2) in worst case due to set unions, but O(n + e) for DAG traversal
# Space: O(n^2) for storing all ancestor sets
def getAncestors(n, edges):
    """
    Returns a list where each element i contains the list of ancestors of node i.
    Ancestors are sorted in ascending order.
    """
    # Step 1: Build graph and compute indegree for topological sort
    graph = [[] for _ in range(n)]  # adjacency list: parent -> children
    indegree = [0] * n  # number of incoming edges for each node

    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1

    # Step 2: Initialize ancestor sets for each node
    ancestors = [set() for _ in range(n)]

    # Step 3: Topological sort using Kahn's algorithm (BFS)
    queue = []
    # Start with nodes that have no incoming edges (sources)
    for i in range(n):
        if indegree[i] == 0:
            queue.append(i)

    # Process nodes in topological order
    while queue:
        current = queue.pop(0)  # BFS: process nodes level by level

        # Step 4: Propagate ancestors to children
        for child in graph[current]:
            # Add current node as a direct parent
            ancestors[child].add(current)
            # Propagate all ancestors of current to child
            ancestors[child].update(ancestors[current])

            # Decrease indegree and add to queue if it becomes 0
            indegree[child] -= 1
            if indegree[child] == 0:
                queue.append(child)

    # Step 5: Convert sets to sorted lists
    result = []
    for i in range(n):
        result.append(sorted(ancestors[i]))

    return result
```

```javascript
// Time: O(n^2) in worst case due to set operations, but O(n + e) for DAG traversal
// Space: O(n^2) for storing all ancestor sets
function getAncestors(n, edges) {
  // Step 1: Build graph and compute indegree for topological sort
  const graph = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    graph[u].push(v);
    indegree[v]++;
  }

  // Step 2: Initialize ancestor sets for each node
  const ancestors = Array.from({ length: n }, () => new Set());

  // Step 3: Topological sort using Kahn's algorithm (BFS)
  const queue = [];
  // Start with nodes that have no incoming edges (sources)
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }

  // Process nodes in topological order
  while (queue.length > 0) {
    const current = queue.shift(); // BFS: process nodes level by level

    // Step 4: Propagate ancestors to children
    for (const child of graph[current]) {
      // Add current node as a direct parent
      ancestors[child].add(current);
      // Propagate all ancestors of current to child
      for (const ancestor of ancestors[current]) {
        ancestors[child].add(ancestor);
      }

      // Decrease indegree and add to queue if it becomes 0
      indegree[child]--;
      if (indegree[child] === 0) {
        queue.push(child);
      }
    }
  }

  // Step 5: Convert sets to sorted arrays
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(Array.from(ancestors[i]).sort((a, b) => a - b));
  }

  return result;
}
```

```java
// Time: O(n^2) in worst case due to set operations, but O(n + e) for DAG traversal
// Space: O(n^2) for storing all ancestor sets
import java.util.*;

class Solution {
    public List<List<Integer>> getAncestors(int n, int[][] edges) {
        // Step 1: Build graph and compute indegree for topological sort
        List<Integer>[] graph = new ArrayList[n];
        int[] indegree = new int[n];

        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            indegree[v]++;
        }

        // Step 2: Initialize ancestor sets for each node
        Set<Integer>[] ancestors = new HashSet[n];
        for (int i = 0; i < n; i++) {
            ancestors[i] = new HashSet<>();
        }

        // Step 3: Topological sort using Kahn's algorithm (BFS)
        Queue<Integer> queue = new LinkedList<>();
        // Start with nodes that have no incoming edges (sources)
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        // Process nodes in topological order
        while (!queue.isEmpty()) {
            int current = queue.poll(); // BFS: process nodes level by level

            // Step 4: Propagate ancestors to children
            for (int child : graph[current]) {
                // Add current node as a direct parent
                ancestors[child].add(current);
                // Propagate all ancestors of current to child
                ancestors[child].addAll(ancestors[current]);

                // Decrease indegree and add to queue if it becomes 0
                indegree[child]--;
                if (indegree[child] == 0) {
                    queue.offer(child);
                }
            }
        }

        // Step 5: Convert sets to sorted lists
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<Integer> sortedAncestors = new ArrayList<>(ancestors[i]);
            Collections.sort(sortedAncestors);
            result.add(sortedAncestors);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² + n·e) in the worst case, but typically O(n + e) for the DAG traversal

- Building graph: O(e) where e is number of edges
- Topological sort: O(n + e)
- Set operations: Each edge may cause O(n) set union operations in worst case, giving O(n·e)
- Sorting ancestors: O(n² log n) in worst case if all nodes are ancestors of all others

**Space Complexity:** O(n²)

- Graph adjacency list: O(n + e)
- Ancestor sets: O(n²) in worst case (complete DAG)
- Queue for BFS: O(n)

The n² factor comes from potentially storing O(n) ancestors for each of n nodes. In practice, most graphs are sparse.

## Common Mistakes

1. **Forgetting that ancestors are transitive**: Only collecting direct parents misses indirect ancestors. Always propagate ancestor sets through the graph.

2. **Processing nodes in arbitrary order**: If you process a node before its ancestors, you'll have incomplete information. Topological sort ensures correct ordering.

3. **Using lists instead of sets for ancestors**: This leads to duplicates and requires O(n) lookups for each addition. Sets give O(1) amortized operations.

4. **Not handling disconnected components**: The graph might have multiple independent components. Our solution handles this because we initialize all nodes and process sources from all components.

5. **Confusing ancestors with descendants**: Remember, ancestors are nodes that can reach a node, not nodes that can be reached from it. Double-check edge direction.

## When You'll See This Pattern

This pattern of propagating information through a DAG in topological order appears in several graph problems:

1. **Course Schedule / Course Schedule II** (LeetCode 207/210): Finding if courses can be taken and in what order — similar topological sort with dependency propagation.

2. **Largest Color Value in a Directed Graph** (LeetCode 1857): Propagating color counts through a DAG to find maximum color frequency in any path.

3. **Parallel Courses** (LeetCode 1136): Finding minimum semesters to complete courses — similar level-by-level processing in topological order.

The core idea is always the same: when you have dependencies or information that flows through a DAG, process nodes in topological order so that when you reach a node, all information from its dependencies is already computed.

## Key Takeaways

1. **Topological sort is your friend for DAGs**: When you need to process nodes in dependency order, topological sort (Kahn's algorithm or DFS) is the go-to approach.

2. **Propagate, don't recompute**: Instead of finding ancestors for each node independently, propagate ancestor sets forward through edges. This eliminates redundant work.

3. **Sets optimize union operations**: When you need to merge collections without duplicates, use sets for O(1) operations instead of O(n) list operations.

Remember: In DAG problems, think about what information each node needs from its predecessors, and ensure those predecessors are processed first.

Related problems: [Number of Restricted Paths From First to Last Node](/problem/number-of-restricted-paths-from-first-to-last-node)
