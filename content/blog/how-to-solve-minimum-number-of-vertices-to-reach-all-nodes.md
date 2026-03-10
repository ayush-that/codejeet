---
title: "How to Solve Minimum Number of Vertices to Reach All Nodes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Vertices to Reach All Nodes. Medium difficulty, 81.5% acceptance rate. Topics: Graph Theory."
date: "2028-07-01"
category: "dsa-patterns"
tags: ["minimum-number-of-vertices-to-reach-all-nodes", "graph-theory", "medium"]
---

# How to Solve Minimum Number of Vertices to Reach All Nodes

This problem asks us to find the smallest set of starting nodes in a directed acyclic graph (DAG) from which we can reach every other node. What makes this interesting is that we don't need to actually traverse the graph or find paths—there's a clever observation about node indegrees that gives us an O(n) solution.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider a DAG with 6 nodes (0-5) and these edges:

```
edges = [[0,1], [0,2], [2,5], [3,4], [4,2]]
```

Visually, the graph looks like:

```
0 → 1
0 → 2 → 5
3 → 4 → 2
```

Now, which nodes can reach all others? Let's think about reachability:

- From node 0: Can reach 1, 2, and 5 (via 2)
- From node 3: Can reach 4, 2, and 5 (via 2)
- But neither 0 nor 3 alone can reach all nodes: 0 can't reach 3 or 4, and 3 can't reach 0 or 1

The key insight: **A node that has incoming edges can be reached from somewhere else**. So if we want the minimum set of starting points, we should only include nodes that have NO incoming edges—these are the ones that can't be reached from anywhere else, so we MUST start from them.

Let's check indegrees (number of incoming edges):

- Node 0: No incoming edges (indegree = 0) ← MUST include
- Node 1: One incoming edge from 0 (indegree = 1)
- Node 2: Two incoming edges from 0 and 4 (indegree = 2)
- Node 3: No incoming edges (indegree = 0) ← MUST include
- Node 4: One incoming edge from 3 (indegree = 1)
- Node 5: One incoming edge from 2 (indegree = 1)

So our answer is [0, 3]. From these two nodes, we can indeed reach all others:

- From 0: reach 1, 2, 5
- From 3: reach 4, 2, 5 (and 2 reaches 5)

## Brute Force Approach

A naive approach might try to test all possible subsets of nodes, checking if they can reach all nodes. For each subset:

1. Perform BFS/DFS starting from all nodes in the subset
2. Check if all nodes are visited
3. Keep track of the smallest subset that works

This is extremely inefficient—there are 2^n possible subsets, and each requires O(n + e) traversal time. For n=10^5 (as in the constraints), this is completely infeasible.

Another brute force idea: start from each node individually, check if it can reach all others. This is O(n\*(n+e)), which is still too slow for large graphs.

The problem with brute force is it doesn't leverage the key property: in a DAG, nodes with indegree 0 are unavoidable starting points.

## Optimized Approach

The optimal solution comes from this observation: **In any directed graph, the nodes with indegree 0 must be in the answer.** Why?

1. If a node has indegree 0, no other node can reach it. Therefore, we MUST include it in our starting set.
2. Conversely, any node with indegree > 0 can be reached from some other node. We don't need to start from it because we can reach it through its incoming edges.
3. In a DAG, starting from all nodes with indegree 0 guarantees we can reach all nodes. This is because every node either has indegree 0 (we start there) or has a path from some indegree-0 node (since the graph is acyclic and connected in terms of reachability).

The algorithm becomes simple:

1. Create a boolean array or set to track which nodes have incoming edges
2. Mark all nodes that appear as destinations in edges
3. Return all nodes that were NOT marked (nodes with no incoming edges)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + e) where n = number of nodes, e = number of edges
# Space: O(n) for the has_incoming array
def findSmallestSetOfVertices(n, edges):
    """
    Find the minimum set of vertices from which all nodes are reachable.

    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from_i, to_i]

    Returns:
        List of vertices that have no incoming edges
    """
    # Step 1: Create array to track which nodes have incoming edges
    # Initialize all to False (no incoming edges)
    has_incoming = [False] * n

    # Step 2: Mark all destination nodes as having incoming edges
    # For each edge [u, v], node v has an incoming edge from u
    for u, v in edges:
        has_incoming[v] = True

    # Step 3: Collect all nodes that still have False (no incoming edges)
    result = []
    for node in range(n):
        if not has_incoming[node]:
            result.append(node)

    return result
```

```javascript
// Time: O(n + e) where n = number of nodes, e = number of edges
// Space: O(n) for the hasIncoming array
function findSmallestSetOfVertices(n, edges) {
  /**
   * Find the minimum set of vertices from which all nodes are reachable.
   *
   * @param {number} n - Number of vertices (0 to n-1)
   * @param {number[][]} edges - Array of directed edges [from_i, to_i]
   * @return {number[]} - Vertices that have no incoming edges
   */

  // Step 1: Create array to track which nodes have incoming edges
  // Initialize all to false (no incoming edges)
  const hasIncoming = new Array(n).fill(false);

  // Step 2: Mark all destination nodes as having incoming edges
  // For each edge [u, v], node v has an incoming edge from u
  for (const [u, v] of edges) {
    hasIncoming[v] = true;
  }

  // Step 3: Collect all nodes that still have false (no incoming edges)
  const result = [];
  for (let node = 0; node < n; node++) {
    if (!hasIncoming[node]) {
      result.push(node);
    }
  }

  return result;
}
```

```java
// Time: O(n + e) where n = number of nodes, e = number of edges
// Space: O(n) for the hasIncoming array
import java.util.*;

class Solution {
    public List<Integer> findSmallestSetOfVertices(int n, List<List<Integer>> edges) {
        /**
         * Find the minimum set of vertices from which all nodes are reachable.
         *
         * @param n - Number of vertices (0 to n-1)
         * @param edges - List of directed edges [from_i, to_i]
         * @return List of vertices that have no incoming edges
         */

        // Step 1: Create array to track which nodes have incoming edges
        // Initialize all to false (no incoming edges)
        boolean[] hasIncoming = new boolean[n];

        // Step 2: Mark all destination nodes as having incoming edges
        // For each edge [u, v], node v has an incoming edge from u
        for (List<Integer> edge : edges) {
            int v = edge.get(1);  // destination node
            hasIncoming[v] = true;
        }

        // Step 3: Collect all nodes that still have false (no incoming edges)
        List<Integer> result = new ArrayList<>();
        for (int node = 0; node < n; node++) {
            if (!hasIncoming[node]) {
                result.add(node);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + e)**

- We iterate through all edges once to mark destination nodes: O(e)
- We iterate through all nodes once to collect results: O(n)
- Total: O(n + e)

**Space Complexity: O(n)**

- We use a boolean array of size n to track incoming edges
- The result list could be up to size n in the worst case (if no edges exist)

This is optimal because we must at least examine each edge and node once.

## Common Mistakes

1. **Forgetting that nodes are numbered 0 to n-1**: Some candidates assume 1-based indexing or miss that n is given separately from edges. Always check the problem constraints: vertices are 0-indexed.

2. **Trying to actually traverse the graph**: The most common mistake is implementing BFS/DFS from different starting points. This misses the elegant indegree observation and leads to inefficient solutions.

3. **Incorrectly handling the boolean array initialization**: In languages like Java, boolean arrays default to false, but in some implementations, candidates might initialize incorrectly or use the wrong size.

4. **Missing the "acyclic" guarantee**: While our solution works for any directed graph (returning indegree-0 nodes), some candidates worry about cycles. The problem guarantees it's a DAG, so we don't need cycle detection.

5. **Returning nodes with outdegree 0 instead of indegree 0**: This is a conceptual mix-up. Nodes with no outgoing edges (sinks) are where paths end, not where they should start.

## When You'll See This Pattern

This "indegree counting" pattern appears in several graph problems:

1. **Course Schedule (LeetCode 207)**: Finding if you can finish all courses (cycle detection using indegrees in topological sort)
2. **Find the Town Judge (LeetCode 997)**: The judge has indegree n-1 and outdegree 0
3. **Minimum Height Trees (LeetCode 310)**: Repeatedly removing leaves (nodes with degree 1) until 1-2 nodes remain
4. **Topological Sort problems**: Kahn's algorithm uses indegree counting to find valid orderings

The core insight is that **indegree/outdegree properties often reveal special nodes** in graphs without needing full traversal.

## Key Takeaways

1. **Look for degree-based insights in graph problems**: Before implementing traversal, check if counting indegrees/outdegrees gives a simpler solution. Many graph problems have elegant solutions based on node degrees.

2. **Nodes with indegree 0 are unavoidable starting points**: In reachability problems, if a node can't be reached from anywhere else, you must start from it. This is more efficient than testing all possible starting points.

3. **The problem constraints guide the solution**: The fact that it's a DAG (guaranteed acyclic) and we only need the minimum set (not the paths) suggests there's a mathematical property we can exploit rather than a traversal algorithm.

[Practice this problem on CodeJeet](/problem/minimum-number-of-vertices-to-reach-all-nodes)
