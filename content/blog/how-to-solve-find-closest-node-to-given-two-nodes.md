---
title: "How to Solve Find Closest Node to Given Two Nodes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Closest Node to Given Two Nodes. Medium difficulty, 53.0% acceptance rate. Topics: Depth-First Search, Graph Theory."
date: "2026-06-10"
category: "dsa-patterns"
tags: ["find-closest-node-to-given-two-nodes", "depth-first-search", "graph-theory", "medium"]
---

# How to Solve Find Closest Node to Given Two Nodes

You're given a directed graph where each node has at most one outgoing edge, and you need to find the node that's reachable from both given nodes with the smallest maximum distance. The tricky part is that the graph isn't necessarily connected, nodes can form cycles, and you need to handle cases where nodes might not be reachable from each other.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `edges = [2,2,3,-1]`, `node1 = 0`, `node2 = 1`:

```
Nodes: 0 → 2 → 3 → -1 (no outgoing edge)
       1 ↗
```

From node 0: 0 → 2 → 3 (distances: 0:0, 2:1, 3:2)
From node 1: 1 → 2 → 3 (distances: 1:0, 2:1, 3:2)

Now we look for nodes reachable from both:

- Node 2: max(1, 1) = 1
- Node 3: max(2, 2) = 2

The smallest maximum distance is 1 at node 2, so the answer is 2.

What makes this interesting is that nodes can form cycles. Consider `edges = [1,2,0,-1]`, `node1 = 0`, `node2 = 2`:

```
Nodes: 0 → 1 → 2 → 0 (cycle)
       3 → -1
```

From node 0: 0→1→2→0→1... (distances: 0:0, 1:1, 2:2)
From node 2: 2→0→1→2... (distances: 2:0, 0:1, 1:2)

Common nodes: 0 (max=1), 1 (max=2), 2 (max=2). Answer is node 0.

## Brute Force Approach

A naive approach might be to try every node and check if it's reachable from both starting nodes, then compute the maximum distance. For each candidate node, we'd need to:

1. Find the distance from node1 to candidate (if reachable)
2. Find the distance from node2 to candidate (if reachable)
3. If both reachable, track the minimum maximum distance

The problem is that finding distances in a graph with cycles requires careful cycle detection. A simple BFS/DFS from each starting node to check reachability to every other node would be O(n²) in worst case, which is too slow for n up to 10⁵.

Even worse, if we're not careful, we might get stuck in infinite loops when cycles exist. The brute force approach doesn't efficiently handle the "at most one outgoing edge" constraint, which is key to the optimal solution.

## Optimized Approach

The key insight is that with "at most one outgoing edge" per node, the graph consists of chains that either terminate or form cycles. This structure allows us to compute distances efficiently using a single traversal from each starting node.

Here's the step-by-step reasoning:

1. **Graph Structure**: Each node has 0 or 1 outgoing edges. This means from any starting node, there's exactly one path forward (like following a linked list until we hit -1 or a visited node).

2. **Distance Calculation**: We can perform a simple traversal from each starting node, recording the distance to each visited node. Since each node has at most one outgoing edge, we don't need BFS/DFS - we can just follow the edges linearly.

3. **Cycle Handling**: We need to detect when we enter a cycle to avoid infinite loops. We can track visited nodes during each traversal.

4. **Finding the Answer**: After computing distances from both starting nodes, we look for nodes that are reachable from both. For each such node, we take the maximum of the two distances, then find the node with the smallest maximum distance.

The optimal approach uses two passes:

- First pass: Traverse from node1, record distances to all reachable nodes
- Second pass: Traverse from node2, record distances to all reachable nodes
- Third pass: Check all nodes that are reachable from both, find min(max(dist1, dist2))

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def closestMeetingNode(edges, node1, node2):
    """
    Find the node that minimizes the maximum distance from node1 and node2.

    Args:
        edges: List where edges[i] is the outgoing edge from node i, or -1 if none
        node1: Starting node 1
        node2: Starting node 2

    Returns:
        The node index that minimizes max(dist1, dist2), or -1 if no common node
    """
    n = len(edges)

    # Step 1: Calculate distances from node1 to all reachable nodes
    dist1 = [-1] * n  # -1 means unreachable
    distance = 0
    current = node1

    # Traverse from node1 until we hit -1 or a visited node
    while current != -1 and dist1[current] == -1:
        dist1[current] = distance
        distance += 1
        current = edges[current]  # Move to next node

    # Step 2: Calculate distances from node2 to all reachable nodes
    dist2 = [-1] * n
    distance = 0
    current = node2

    # Traverse from node2 until we hit -1 or a visited node
    while current != -1 and dist2[current] == -1:
        dist2[current] = distance
        distance += 1
        current = edges[current]

    # Step 3: Find the node with minimum max distance
    min_max_dist = float('inf')
    result_node = -1

    for i in range(n):
        # Check if node i is reachable from both starting nodes
        if dist1[i] != -1 and dist2[i] != -1:
            # Calculate the maximum distance from either starting node
            max_dist = max(dist1[i], dist2[i])

            # Update result if we found a better node
            # Tie-breaking: smaller node index wins
            if max_dist < min_max_dist or (max_dist == min_max_dist and i < result_node):
                min_max_dist = max_dist
                result_node = i

    return result_node
```

```javascript
// Time: O(n) | Space: O(n)
function closestMeetingNode(edges, node1, node2) {
  /**
   * Find the node that minimizes the maximum distance from node1 and node2.
   *
   * @param {number[]} edges - edges[i] is the outgoing edge from node i, or -1 if none
   * @param {number} node1 - Starting node 1
   * @param {number} node2 - Starting node 2
   * @return {number} The node index that minimizes max(dist1, dist2), or -1 if no common node
   */
  const n = edges.length;

  // Step 1: Calculate distances from node1 to all reachable nodes
  const dist1 = new Array(n).fill(-1); // -1 means unreachable
  let distance = 0;
  let current = node1;

  // Traverse from node1 until we hit -1 or a visited node
  while (current !== -1 && dist1[current] === -1) {
    dist1[current] = distance;
    distance++;
    current = edges[current]; // Move to next node
  }

  // Step 2: Calculate distances from node2 to all reachable nodes
  const dist2 = new Array(n).fill(-1);
  distance = 0;
  current = node2;

  // Traverse from node2 until we hit -1 or a visited node
  while (current !== -1 && dist2[current] === -1) {
    dist2[current] = distance;
    distance++;
    current = edges[current];
  }

  // Step 3: Find the node with minimum max distance
  let minMaxDist = Infinity;
  let resultNode = -1;

  for (let i = 0; i < n; i++) {
    // Check if node i is reachable from both starting nodes
    if (dist1[i] !== -1 && dist2[i] !== -1) {
      // Calculate the maximum distance from either starting node
      const maxDist = Math.max(dist1[i], dist2[i]);

      // Update result if we found a better node
      // Tie-breaking: smaller node index wins
      if (maxDist < minMaxDist || (maxDist === minMaxDist && i < resultNode)) {
        minMaxDist = maxDist;
        resultNode = i;
      }
    }
  }

  return resultNode;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int closestMeetingNode(int[] edges, int node1, int node2) {
        /**
         * Find the node that minimizes the maximum distance from node1 and node2.
         *
         * @param edges edges[i] is the outgoing edge from node i, or -1 if none
         * @param node1 Starting node 1
         * @param node2 Starting node 2
         * @return The node index that minimizes max(dist1, dist2), or -1 if no common node
         */
        int n = edges.length;

        // Step 1: Calculate distances from node1 to all reachable nodes
        int[] dist1 = new int[n];
        Arrays.fill(dist1, -1); // -1 means unreachable
        int distance = 0;
        int current = node1;

        // Traverse from node1 until we hit -1 or a visited node
        while (current != -1 && dist1[current] == -1) {
            dist1[current] = distance;
            distance++;
            current = edges[current]; // Move to next node
        }

        // Step 2: Calculate distances from node2 to all reachable nodes
        int[] dist2 = new int[n];
        Arrays.fill(dist2, -1);
        distance = 0;
        current = node2;

        // Traverse from node2 until we hit -1 or a visited node
        while (current != -1 && dist2[current] == -1) {
            dist2[current] = distance;
            distance++;
            current = edges[current];
        }

        // Step 3: Find the node with minimum max distance
        int minMaxDist = Integer.MAX_VALUE;
        int resultNode = -1;

        for (int i = 0; i < n; i++) {
            // Check if node i is reachable from both starting nodes
            if (dist1[i] != -1 && dist2[i] != -1) {
                // Calculate the maximum distance from either starting node
                int maxDist = Math.max(dist1[i], dist2[i]);

                // Update result if we found a better node
                // Tie-breaking: smaller node index wins
                if (maxDist < minMaxDist || (maxDist == minMaxDist && i < resultNode)) {
                    minMaxDist = maxDist;
                    resultNode = i;
                }
            }
        }

        return resultNode;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse from node1 until we hit -1 or a cycle: O(n) worst case
- We traverse from node2 until we hit -1 or a cycle: O(n) worst case
- We iterate through all n nodes to find the answer: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two distance arrays of size n: O(2n) = O(n)
- We use only a few extra variables: O(1)
- Total: O(n)

The linear time complexity is optimal because we need to examine the graph structure, and O(n) space is necessary to store distances from both starting nodes.

## Common Mistakes

1. **Not handling cycles correctly**: The most common mistake is getting stuck in infinite loops when the graph has cycles. Always check if you've visited a node before continuing the traversal. The condition `while current != -1 and dist[current] == -1` is crucial.

2. **Forgetting that nodes might be unreachable**: Candidates often assume both starting nodes can reach some common node. Always check for `-1` (unreachable) values when comparing distances. A node is only valid if `dist1[i] != -1 AND dist2[i] != -1`.

3. **Incorrect tie-breaking**: The problem requires returning the smallest node index when there's a tie in maximum distance. Many candidates miss this requirement and return the first node they find with the minimum max distance.

4. **Using BFS/DFS unnecessarily**: Since each node has at most one outgoing edge, a simple linear traversal is sufficient. BFS/DFS adds unnecessary complexity and overhead.

## When You'll See This Pattern

This pattern of traversing graphs with limited outgoing edges appears in several problems:

1. **Linked List Cycle Detection (LeetCode 141)**: Similar to detecting cycles in a linked list, but here we have at most one outgoing edge per node, creating a similar structure.

2. **Find the Duplicate Number (LeetCode 287)**: Uses the "at most one outgoing edge" concept to model the array as a graph where arr[i] points to the next node. The cycle detection technique is identical.

3. **Happy Number (LeetCode 202)**: While not exactly the same, it uses cycle detection in a sequence generated by a deterministic function, similar to following edges in a graph.

The core technique is recognizing that limited branching (especially exactly one or at most one outgoing edge) allows for simple linear traversal with cycle detection, rather than full graph search algorithms.

## Key Takeaways

1. **Special graph structures enable simpler algorithms**: When each node has at most one outgoing edge, the graph degenerates to chains and cycles, allowing O(n) traversal instead of general graph search.

2. **Cycle detection is crucial for directed graphs**: Always include visited checks when traversing directed graphs to avoid infinite loops. The pattern `while current != -1 and not visited[current]` is a reliable way to handle this.

3. **Two-pass distance calculation**: When comparing distances from multiple sources, it's often efficient to compute distances from each source separately, then combine the results. This is cleaner than trying to compute everything in one pass.

[Practice this problem on CodeJeet](/problem/find-closest-node-to-given-two-nodes)
