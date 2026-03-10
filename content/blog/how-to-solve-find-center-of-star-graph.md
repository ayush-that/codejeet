---
title: "How to Solve Find Center of Star Graph — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Center of Star Graph. Easy difficulty, 86.6% acceptance rate. Topics: Graph Theory."
date: "2027-06-29"
category: "dsa-patterns"
tags: ["find-center-of-star-graph", "graph-theory", "easy"]
---

# How to Solve Find Center of Star Graph

You're given a list of edges representing a star graph — a special type of graph where one central node connects directly to all other nodes, and no other connections exist. Your task is to find which node is the center. While this sounds like a graph theory problem, there's a clever observation that makes the solution much simpler than it initially appears.

What makes this problem interesting is that it looks like you need to build a full graph representation, but the star graph's unique structure allows for an O(1) space solution with minimal computation. The key insight is that in a star graph, the center node appears in every edge, while peripheral nodes appear in only one edge.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `n = 4` nodes and edges: `[[1,2], [2,3], [2,4]]`

This represents a star graph where node 2 is the center. Let's examine the edges:

1. Edge `[1,2]`: Contains nodes 1 and 2
2. Edge `[2,3]`: Contains nodes 2 and 3
3. Edge `[2,4]`: Contains nodes 2 and 4

Notice that node 2 appears in **all three edges**, while nodes 1, 3, and 4 each appear in only **one edge**. This pattern holds for any star graph: the center node will be present in every single edge, while every other node appears in exactly one edge (the edge connecting it to the center).

Now let's see how we can use this observation. We only need to look at the first two edges:

- First edge: `[1,2]`
- Second edge: `[2,3]`

The center must be the node that appears in both edges. Comparing these two edges, node 2 appears in both, while nodes 1 and 3 appear in only one each. Therefore, node 2 is the center.

This works because in a valid star graph, the center node will definitely appear in the first two edges (since it's connected to at least two other nodes). We don't even need to check all edges!

## Brute Force Approach

A naive approach would be to build a full adjacency list or count occurrences of each node, then find which node appears in `n-1` edges. While this works, it's overkill for this specific problem structure.

Here's what the brute force might look like:

1. Create a dictionary to count how many times each node appears
2. Iterate through all edges, incrementing counts for both nodes
3. Find which node has count equal to `n-1` (or simply the maximum count)

The problem with this approach isn't that it's too slow — it's actually O(E) time where E = n-1, which is fine. The issue is that it uses O(n) extra space and does more work than necessary. In an interview, while this solution would technically work, the interviewer would expect you to recognize the simpler pattern and optimize further.

## Optimal Solution

The optimal solution leverages the key observation: in a star graph, the center node appears in every edge. Therefore, if we just look at the first two edges, the common node between them must be the center.

Why does this work? Consider:

- The center is connected to at least two other nodes (since n ≥ 3 in a valid star graph)
- Therefore, the center must appear in both the first and second edges
- Any peripheral node appears in only one edge total, so it can't appear in both of the first two edges

This gives us an O(1) time and O(1) space solution — we only need to examine the first two edges!

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def findCenter(edges):
    """
    Find the center of a star graph.

    The key insight: In a star graph, the center node appears in every edge.
    Therefore, the node that appears in both the first and second edges
    must be the center.

    Args:
        edges: List of lists, where each inner list contains two node IDs

    Returns:
        The ID of the center node
    """
    # Get the first edge
    first_edge = edges[0]
    # Get the second edge
    second_edge = edges[1]

    # The center is the common node between the first two edges
    # Check if the first node of the first edge matches either node in the second edge
    if first_edge[0] == second_edge[0] or first_edge[0] == second_edge[1]:
        return first_edge[0]
    else:
        # If not, it must be the second node of the first edge
        return first_edge[1]
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Find the center of a star graph.
 *
 * The key insight: In a star graph, the center node appears in every edge.
 * Therefore, the node that appears in both the first and second edges
 * must be the center.
 *
 * @param {number[][]} edges - Array of edges, where each edge is [u, v]
 * @return {number} The ID of the center node
 */
function findCenter(edges) {
  // Get the first edge
  const firstEdge = edges[0];
  // Get the second edge
  const secondEdge = edges[1];

  // The center is the common node between the first two edges
  // Check if the first node of the first edge matches either node in the second edge
  if (firstEdge[0] === secondEdge[0] || firstEdge[0] === secondEdge[1]) {
    return firstEdge[0];
  } else {
    // If not, it must be the second node of the first edge
    return firstEdge[1];
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Find the center of a star graph.
     *
     * The key insight: In a star graph, the center node appears in every edge.
     * Therefore, the node that appears in both the first and second edges
     * must be the center.
     *
     * @param edges Array of edges, where each edge is {u, v}
     * @return The ID of the center node
     */
    public int findCenter(int[][] edges) {
        // Get the first edge
        int[] firstEdge = edges[0];
        // Get the second edge
        int[] secondEdge = edges[1];

        // The center is the common node between the first two edges
        // Check if the first node of the first edge matches either node in the second edge
        if (firstEdge[0] == secondEdge[0] || firstEdge[0] == secondEdge[1]) {
            return firstEdge[0];
        } else {
            // If not, it must be the second node of the first edge
            return firstEdge[1];
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We only examine the first two edges, regardless of the total number of edges
- The comparisons are constant-time operations
- This is optimal since we must at least read the first two edges to determine the center

**Space Complexity: O(1)**

- We only store references to the first two edges (or individual values)
- No additional data structures scale with input size
- The solution uses a constant amount of extra space

The reason we achieve O(1) time and space is the special structure of star graphs. In a general graph problem, we'd typically need O(V+E) time and space, but the constraints of this problem allow for this elegant optimization.

## Common Mistakes

1. **Building unnecessary data structures**: Many candidates immediately reach for adjacency lists or hash maps to count node degrees. While this works, it shows they didn't recognize the pattern specific to star graphs. Always look for special properties of the input before implementing a general solution.

2. **Assuming nodes are sorted or in order**: The problem doesn't guarantee that nodes are numbered consecutively or that edges are in any particular order. Our solution doesn't make this assumption — it works regardless of how nodes are numbered or how edges are arranged.

3. **Overcomplicating with graph theory**: Some candidates might try to use BFS/DFS to find the node with maximum degree or check if the graph is actually a star. Remember: the problem guarantees the input is a valid star graph, so we don't need to verify this.

4. **Not handling the n=2 case**: While the problem constraints state n ≥ 3, some candidates worry about edge cases. For n=2 (which isn't in the constraints), there would be only one edge `[u,v]`, and either node could be considered the "center." Our solution still works because with only one edge, we'd need to adjust the logic, but since n ≥ 3, we always have at least two edges.

## When You'll See This Pattern

This problem teaches the important skill of **looking for patterns in constraints**. When a problem gives you special guarantees about the input structure, there's often a much simpler solution than the general case.

Similar problems include:

1. **Maximum Star Sum of a Graph (Medium)**: While more complex, this problem also deals with star graphs and requires understanding their structure. You need to find the maximum sum you can get from a star centered at each node.

2. **Find the Town Judge (Easy)**: This problem has a similar "find the special node" structure. The town judge must be trusted by everyone and trust no one — a pattern you can detect by counting in-degrees and out-degrees.

3. **Find Celebrity (Medium)**: Another "special node" problem where the celebrity is known by everyone but knows no one. The optimal solution uses a clever elimination process rather than checking all pairs.

The common thread is recognizing when you can avoid building full graph representations by leveraging specific properties of the problem.

## Key Takeaways

1. **Always check for special input properties**: Before implementing a general graph algorithm, ask: "What's special about this problem's constraints?" Star graphs, trees, bipartite graphs, and other special structures often allow for optimizations.

2. **The center appears in every edge**: For star graphs specifically, this is the key insight. The center's degree is n-1, while all other nodes have degree 1. This extreme degree difference is what enables the simple two-edge comparison.

3. **Sometimes O(1) space is possible even for graph problems**: While most graph problems require O(V) or O(E) space, special cases like this one show that with the right insight, you can achieve constant space. This is a valuable pattern to recognize in interviews.

Remember: interviewers love when you notice these optimizations. It shows you're not just implementing algorithms by rote, but actually thinking about the problem.

Related problems: [Maximum Star Sum of a Graph](/problem/maximum-star-sum-of-a-graph)
