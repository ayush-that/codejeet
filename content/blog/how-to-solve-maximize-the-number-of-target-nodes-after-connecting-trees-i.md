---
title: "How to Solve Maximize the Number of Target Nodes After Connecting Trees I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize the Number of Target Nodes After Connecting Trees I. Medium difficulty, 69.5% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search."
date: "2027-10-06"
category: "dsa-patterns"
tags:
  [
    "maximize-the-number-of-target-nodes-after-connecting-trees-i",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Maximize the Number of Target Nodes After Connecting Trees I

You are given two undirected trees with `n` and `m` nodes respectively. You need to connect them by adding exactly one edge between any node from the first tree and any node from the second tree. After connecting them, you want to maximize the number of nodes in the combined tree that are at most one edge away from every node in the first tree (these are called "target nodes"). The challenge lies in finding which connection point in the second tree will give you the most nodes that are close to the entire first tree.

What makes this problem interesting is that it's not about finding distances between specific nodes, but rather about understanding how connectivity changes when we merge two trees. The optimal connection point depends on the structure of both trees, particularly their "centers" or most accessible nodes.

## Visual Walkthrough

Let's walk through a small example to build intuition.

**Tree 1 (n=3):**  
Edges: [[0,1], [1,2]]  
This is a simple chain: 0-1-2

**Tree 2 (m=4):**  
Edges: [[0,1], [1,2], [1,3]]  
This is a star-like structure with node 1 at the center:

```
    0
    |
    1
   / \
  2   3
```

**Step 1 - Understanding the goal:**  
After connecting the trees, we want to maximize the number of nodes that are at most 1 edge away from EVERY node in Tree 1. In other words, for a node to count as a "target node," it must be adjacent to or the same as every node in Tree 1.

**Step 2 - Analyzing Tree 1:**  
In Tree 1, node 1 is already adjacent to both other nodes (0 and 2). So node 1 itself would qualify as a target node if we could somehow make it adjacent to all Tree 1 nodes in the combined tree.

**Step 3 - Trying different connection points:**  
If we connect Tree 1's node 1 to Tree 2's node 1:

- Tree 1 node 1 becomes adjacent to Tree 2 node 1
- Tree 1 node 1 is already adjacent to Tree 1 nodes 0 and 2
- So Tree 1 node 1 is adjacent to all Tree 1 nodes (0, 2) and one Tree 2 node (1)
- But wait, we need nodes that are adjacent to ALL Tree 1 nodes. Tree 2 node 1 is only adjacent to Tree 1 node 1, not to Tree 1 nodes 0 and 2.

Actually, let's think more carefully. After connecting the trees, we're looking for nodes in the COMBINED tree that are at most 1 edge away from every Tree 1 node. This means a node could be:

1. A Tree 1 node that's adjacent to all other Tree 1 nodes
2. A Tree 2 node that becomes adjacent to all Tree 1 nodes through the connection

**Step 4 - The key insight:**  
For a Tree 2 node to be adjacent to all Tree 1 nodes, it must be connected to a Tree 1 node that is itself adjacent to all other Tree 1 nodes. In other words, we need to find Tree 1 nodes with maximum degree (connections within Tree 1).

In our example:

- Tree 1 node 0: degree 1 (connected only to node 1)
- Tree 1 node 1: degree 2 (connected to nodes 0 and 2) ← highest!
- Tree 1 node 2: degree 1 (connected only to node 1)

So if we connect Tree 2 to Tree 1 node 1, then Tree 1 node 1 will be adjacent to:

- All other Tree 1 nodes (0 and 2)
- The connected Tree 2 node

Thus, Tree 1 node 1 qualifies as a target node. Additionally, if we connect to a Tree 2 node with high degree, that Tree 2 node might also become a target node if it's connected to enough Tree 1 nodes.

**Step 5 - Counting target nodes:**  
If we connect Tree 1 node 1 to Tree 2 node 1 (center of Tree 2):

- Tree 1 node 1: Adjacent to Tree 1 nodes 0, 2 and Tree 2 node 1 → covers all Tree 1 nodes ✓
- Tree 2 node 1: Adjacent to Tree 2 nodes 0, 2, 3 and Tree 1 node 1 → but NOT adjacent to Tree 1 nodes 0 and 2 ✗

So only 1 target node (Tree 1 node 1).

If we connect Tree 1 node 1 to Tree 2 node 0 (leaf in Tree 2):

- Tree 1 node 1: Adjacent to Tree 1 nodes 0, 2 and Tree 2 node 0 → covers all Tree 1 nodes ✓
- Tree 2 node 0: Adjacent only to Tree 2 node 1 and Tree 1 node 1 → NOT adjacent to Tree 1 nodes 0 and 2 ✗

Still only 1 target node.

The maximum we can get is 1 in this case.

## Brute Force Approach

A brute force approach would try every possible connection between the two trees:

1. For each node `u` in Tree 1
2. For each node `v` in Tree 2
3. Connect `u` and `v` with an edge
4. Count how many nodes in the combined tree are at most 1 edge away from every node in Tree 1
5. Track the maximum count

The counting step (step 4) requires checking for each node in the combined tree whether it's adjacent to all Tree 1 nodes. This would take O((n+m) × n) time for each connection, and with O(n×m) possible connections, the total time would be O(n²×m×(n+m)), which is far too slow for the constraints (n, m up to 10⁵).

The key insight we need is that we don't actually need to simulate every connection and count from scratch each time. We can precompute useful information about both trees.

## Optimized Approach

Let's think about what makes a node a "target node" (at most 1 edge away from every Tree 1 node):

1. **For a Tree 1 node to be a target:** It must already be adjacent to all other Tree 1 nodes in the original Tree 1. In other words, its degree within Tree 1 must be n-1 (it's connected to every other Tree 1 node).

2. **For a Tree 2 node to be a target:** After connecting it to some Tree 1 node `u`, it must be adjacent to all Tree 1 nodes. This means:
   - It's directly adjacent to `u` (via the new connection)
   - For every other Tree 1 node `w` (where w ≠ u), it must be adjacent to `w`
   - But the only way it can be adjacent to `w` is if `u` is adjacent to `w` in Tree 1
   - Therefore, `u` must be adjacent to ALL other Tree 1 nodes
   - So `u` must have degree n-1 in Tree 1

This gives us our optimization: We only need to consider connecting to Tree 1 nodes that have maximum possible degree (n-1). Let's call these "hub" nodes in Tree 1.

**Step-by-step reasoning:**

1. Find all nodes in Tree 1 with degree = n-1. These are the only nodes that can help create target nodes.
2. If there are no such nodes in Tree 1, then no Tree 2 node can become a target node, and the only possible target nodes are Tree 1 nodes that are already hubs (but there are none).
3. If there is at least one hub in Tree 1:
   - Each hub in Tree 1 is already a target node (it's adjacent to all other Tree 1 nodes)
   - When we connect a hub to a Tree 2 node, that Tree 2 node becomes adjacent to all Tree 1 nodes (via the hub), so it also becomes a target node
   - So the total target nodes = (number of hubs in Tree 1) + 1 (the connected Tree 2 node)
4. We want to maximize this, so we should connect to a Tree 2 node that gives us the most additional benefit. But wait, according to our reasoning above, ANY Tree 2 node connected to a hub will become a target node. So we get the same count regardless of which Tree 2 node we choose!

Actually, let's double-check this. If Tree 1 has k hubs, and we connect one of them to any Tree 2 node:

- All k hubs remain target nodes (they're adjacent to all Tree 1 nodes)
- The connected Tree 2 node becomes a target node (it's adjacent to the hub, which is adjacent to all other Tree 1 nodes)
- Total = k + 1

But what if we connect to a non-hub in Tree 1? Then:

- No Tree 2 node becomes a target node (because the connected Tree 1 node isn't adjacent to all other Tree 1 nodes)
- Only Tree 1 hubs (if any) are target nodes
- Total = k

So the maximum is always k + 1 if k > 0, otherwise it's 0.

Wait, there's one more case! What if a Tree 2 node is already adjacent to multiple Tree 1 nodes through different connections? No, that's not possible since we're only adding ONE edge between the trees.

So the solution simplifies to:

1. Count how many nodes in Tree 1 have degree = n-1 (call this count `k`)
2. If k > 0, answer = k + 1
3. If k = 0, answer = 0

But let's test this with our visual example:

- Tree 1 has 3 nodes
- Node 1 has degree 2, which equals n-1 = 2
- So k = 1
- Answer = 1 + 1 = 2

But our visual walkthrough gave us answer = 1. What's wrong?

Ah! I see the issue. In our visual example, Tree 1 node 1 has degree 2, which is n-1 (since n=3). So k=1. According to our formula, answer should be 2. But we only found 1 target node. Let's re-examine...

When we connect Tree 1 node 1 to Tree 2 node 1:

- Tree 1 node 1: Adjacent to Tree 1 nodes 0, 2 and Tree 2 node 1 → covers all Tree 1 nodes ✓
- Tree 2 node 1: Adjacent to Tree 2 nodes 0, 2, 3 and Tree 1 node 1 → needs to be adjacent to Tree 1 nodes 0 and 2 to qualify

Tree 2 node 1 is NOT adjacent to Tree 1 nodes 0 and 2! It's only adjacent to Tree 1 node 1. To be adjacent to Tree 1 nodes 0 and 2, it would need to be connected to them directly or through a node that's connected to them. But Tree 1 node 1 is connected to them, and Tree 2 node 1 is connected to Tree 1 node 1, so doesn't that make Tree 2 node 1 adjacent to Tree 1 nodes 0 and 2?

No! "Adjacent" means directly connected by an edge. Tree 2 node 1 is not directly connected to Tree 1 nodes 0 or 2. It's two edges away from them (Tree 2 node 1 → Tree 1 node 1 → Tree 1 node 0).

So our earlier reasoning was flawed. A Tree 2 node needs to be directly adjacent to every Tree 1 node to qualify. This is impossible unless n=1 (a single Tree 1 node).

Therefore, only Tree 1 nodes can be target nodes! And a Tree 1 node qualifies if it's adjacent to all other Tree 1 nodes in the ORIGINAL Tree 1 (before connecting to Tree 2).

So the answer is simply: count how many nodes in Tree 1 have degree = n-1.

Let's test this with our example:

- Tree 1 node 1 has degree 2 = n-1 = 2
- So answer = 1 ✓

This matches our visual walkthrough!

## Optimal Solution

The optimal solution is surprisingly simple once we understand the problem correctly. A node can only be a target node if it's at most 1 edge away from every Tree 1 node. For a Tree 2 node, this would require it to be directly connected to every Tree 1 node, which is impossible with only one connecting edge (unless n=1). Therefore, only Tree 1 nodes can be target nodes.

A Tree 1 node qualifies as a target node if and only if it's adjacent to all other Tree 1 nodes in the original tree. This means its degree within Tree 1 must be n-1.

So the solution is:

1. Build the degree count for each node in Tree 1
2. Count how many nodes have degree = n-1
3. Return this count

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxTargetNodes(n: int, edges1: List[List[int]]) -> int:
    """
    Returns the maximum number of target nodes after connecting two trees.

    A target node is a node that is at most 1 edge away from every node
    in the first tree. Only nodes from the first tree can satisfy this
    condition since we only add one edge between the trees.

    Args:
        n: Number of nodes in the first tree
        edges1: List of edges in the first tree

    Returns:
        Maximum number of target nodes
    """
    # Step 1: Initialize degree array for Tree 1 nodes
    # degree[i] will store how many edges node i has in Tree 1
    degree = [0] * n

    # Step 2: Count degrees for each node
    # For each edge [u, v], both u and v gain one degree
    for u, v in edges1:
        degree[u] += 1
        degree[v] += 1

    # Step 3: Count how many nodes have maximum possible degree (n-1)
    # A node with degree n-1 is connected to every other node in Tree 1
    count = 0
    for d in degree:
        if d == n - 1:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Returns the maximum number of target nodes after connecting two trees.
 *
 * A target node is a node that is at most 1 edge away from every node
 * in the first tree. Only nodes from the first tree can satisfy this
 * condition since we only add one edge between the trees.
 *
 * @param {number} n - Number of nodes in the first tree
 * @param {number[][]} edges1 - Edges in the first tree
 * @return {number} Maximum number of target nodes
 */
function maxTargetNodes(n, edges1) {
  // Step 1: Initialize degree array for Tree 1 nodes
  // degree[i] will store how many edges node i has in Tree 1
  const degree = new Array(n).fill(0);

  // Step 2: Count degrees for each node
  // For each edge [u, v], both u and v gain one degree
  for (const [u, v] of edges1) {
    degree[u]++;
    degree[v]++;
  }

  // Step 3: Count how many nodes have maximum possible degree (n-1)
  // A node with degree n-1 is connected to every other node in Tree 1
  let count = 0;
  for (const d of degree) {
    if (d === n - 1) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.List;

class Solution {
    /**
     * Returns the maximum number of target nodes after connecting two trees.
     *
     * A target node is a node that is at most 1 edge away from every node
     * in the first tree. Only nodes from the first tree can satisfy this
     * condition since we only add one edge between the trees.
     *
     * @param n Number of nodes in the first tree
     * @param edges1 Edges in the first tree
     * @return Maximum number of target nodes
     */
    public int maxTargetNodes(int n, List<List<Integer>> edges1) {
        // Step 1: Initialize degree array for Tree 1 nodes
        // degree[i] will store how many edges node i has in Tree 1
        int[] degree = new int[n];

        // Step 2: Count degrees for each node
        // For each edge [u, v], both u and v gain one degree
        for (List<Integer> edge : edges1) {
            int u = edge.get(0);
            int v = edge.get(1);
            degree[u]++;
            degree[v]++;
        }

        // Step 3: Count how many nodes have maximum possible degree (n-1)
        // A node with degree n-1 is connected to every other node in Tree 1
        int count = 0;
        for (int d : degree) {
            if (d == n - 1) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through all edges in Tree 1 once to build the degree array: O(n-1) operations
- We iterate through the degree array once to count nodes with degree n-1: O(n) operations
- Total: O(n) where n is the number of nodes in Tree 1

**Space Complexity:** O(n)

- We store a degree array of size n: O(n)
- The rest uses constant extra space

Note that the size of Tree 2 (m) doesn't affect our solution at all, which is a key insight!

## Common Mistakes

1. **Trying to simulate the connection:** Many candidates try to actually simulate connecting the trees and then BFS/DFS to find distances. This is unnecessary and inefficient. The key insight is that only Tree 1 nodes can be target nodes.

2. **Misunderstanding "at most 1 edge away":** Some candidates think this means "within distance 1" (which would include nodes 2 edges away if you go through the connecting edge). But "at most 1 edge away" means directly adjacent (distance 1) or the node itself (distance 0).

3. **Forgetting the n=1 edge case:** When n=1, the single Tree 1 node trivially satisfies the condition (it's 0 edges away from itself). Our solution handles this correctly since degree[0] = 0, and n-1 = 0, so it counts as a hub.

4. **Overcomplicating with Tree 2:** Candidates often waste time analyzing Tree 2, but it turns out Tree 2's structure doesn't matter at all for this problem! The answer depends only on Tree 1.

## When You'll See This Pattern

This problem teaches the important skill of **simplifying the problem statement** to its core logic. Instead of getting lost in the implementation details, we analyzed what the condition actually means and found it simplifies dramatically.

Similar problems that require reinterpreting the problem statement:

1. **Find Minimum Diameter After Merging Two Trees (Hard)** - The related problem mentioned in the prompt. It also involves connecting two trees but focuses on minimizing diameter rather than maximizing target nodes.

2. **Find Center of Star Graph (Easy)** - Finding the node connected to all other nodes in a star graph is similar to finding nodes with degree n-1.

3. **Find the Town Judge (Easy)** - The town judge is trusted by everyone else (similar to being "connected" to everyone), which can be solved by counting degrees/in-degrees.

## Key Takeaways

1. **Read the problem carefully and simplify:** "At most 1 edge away from every node in Tree 1" actually means "directly connected to every node in Tree 1" for any node other than the Tree 1 nodes themselves.

2. **Only Tree 1 nodes matter:** With only one connecting edge between the trees, Tree 2 nodes cannot be adjacent to all Tree 1 nodes (unless n=1).

3. **Degree counting is powerful:** Many tree/graph problems can be solved simply by analyzing node degrees rather than performing complex traversals.

Related problems: [Find Minimum Diameter After Merging Two Trees](/problem/find-minimum-diameter-after-merging-two-trees)
