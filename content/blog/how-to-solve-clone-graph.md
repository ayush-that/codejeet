---
title: "How to Solve Clone Graph — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Clone Graph. Medium difficulty, 64.7% acceptance rate. Topics: Hash Table, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2026-06-08"
category: "dsa-patterns"
tags: ["clone-graph", "hash-table", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Clone Graph

This problem asks you to create a deep copy of a connected, undirected graph where each node has a value and a list of neighbors. The tricky part is that the graph can contain cycles, and you need to create new nodes while preserving the exact neighbor relationships between them. Simply copying node values isn't enough—you must reconstruct the entire graph structure.

## Visual Walkthrough

Let's trace through a simple example to build intuition. Suppose we have this graph:

```
Node 1 (val=1) -- Node 2 (val=2)
      |                 |
Node 3 (val=3) -- Node 4 (val=4)
```

In adjacency terms:

- Node 1 neighbors: [2, 3]
- Node 2 neighbors: [1, 4]
- Node 3 neighbors: [1, 4]
- Node 4 neighbors: [2, 3]

The challenge is that if we just create new nodes with the same values, we'll lose the connections. Even worse, if we try to recursively copy neighbors, we might create infinite loops due to cycles (like 1↔2).

Here's the step-by-step approach we'll use:

1. Start at the given node (say Node 1)
2. Create a copy of Node 1
3. For each neighbor of Node 1 (Node 2 and Node 3):
   - If we haven't seen Node 2 before, create its copy and connect it to Node 1's copy
   - If we HAVE seen Node 2 before (maybe from a different path), just connect the existing copy
4. Repeat this process for all nodes

This ensures we create each node exactly once and properly connect all neighbors.

## Brute Force Approach

A naive approach might try to create all nodes first, then connect them. But how would you know which new node corresponds to which original node? You could try to match by value, but multiple nodes can have the same value. You could try to match by position in some traversal order, but that's unreliable.

Another naive approach is to recursively copy each node and its neighbors without tracking what's been copied. This leads to infinite recursion in cyclic graphs and creates duplicate nodes instead of reusing them.

Here's what that flawed recursive approach might look like:

```python
# WRONG - Creates infinite loop and duplicates
def cloneGraph(node):
    if not node:
        return None

    # Create new node
    new_node = Node(node.val)

    # Recursively copy all neighbors
    new_node.neighbors = [cloneGraph(neighbor) for neighbor in node.neighbors]

    return new_node
```

This fails because:

1. When Node 1 copies Node 2, and Node 2 tries to copy Node 1, we get infinite recursion
2. Even if we could avoid recursion, Node 1 and Node 2 would each create their own copies of shared neighbors, resulting in disconnected graphs

## Optimized Approach

The key insight is that we need to **map original nodes to their copies**. This lets us:

1. Avoid recreating the same node multiple times
2. Properly connect copies by looking up neighbor copies in the map
3. Handle cycles safely by checking if we've already created a node

We can implement this with either DFS (depth-first search) or BFS (breadth-first search). Both work equally well—the choice depends on whether you prefer recursion (DFS) or iteration (BFS).

**DFS Approach:**

1. Create a hash map to store original → copy mappings
2. Use recursive DFS to traverse the graph
3. For each node:
   - If already copied, return the copy from the map
   - Otherwise, create copy, store in map, then recursively copy neighbors
4. Connect the copies based on original neighbor relationships

**BFS Approach:**

1. Create a hash map and a queue
2. Create copy of starting node, add to map and queue
3. While queue not empty:
   - Pop node, for each neighbor:
     - If neighbor not copied, create copy and add to map and queue
     - Connect current node's copy to neighbor's copy
4. Return copy of starting node

Both approaches have the same time and space complexity. DFS is more elegant but risks stack overflow on very deep graphs. BFS is more iterative and avoids deep recursion.

## Optimal Solution

Here's the complete solution using DFS (recursive) approach:

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        # Time: O(V + E) where V = vertices, E = edges
        # Space: O(V) for the hash map and recursion stack

        # Edge case: empty graph
        if not node:
            return None

        # Dictionary to map original nodes to their copies
        # This prevents infinite recursion and duplicate nodes
        node_map = {}

        def dfs(original):
            # If we've already copied this node, return the copy
            if original in node_map:
                return node_map[original]

            # Create a new node with the same value
            # Note: we don't set neighbors yet to avoid cycles
            copy = Node(original.val)

            # Store the mapping BEFORE recursing on neighbors
            # This is crucial to handle cycles
            node_map[original] = copy

            # Recursively copy all neighbors
            # This will create copies or retrieve existing ones from node_map
            for neighbor in original.neighbors:
                copy.neighbors.append(dfs(neighbor))

            return copy

        # Start DFS from the given node
        return dfs(node)
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function (node) {
  // Time: O(V + E) where V = vertices, E = edges
  // Space: O(V) for the hash map and recursion stack

  // Edge case: empty graph
  if (!node) return null;

  // Map to store original node -> copy node mappings
  const nodeMap = new Map();

  // DFS helper function
  const dfs = (original) => {
    // If we've already copied this node, return the copy
    if (nodeMap.has(original)) {
      return nodeMap.get(original);
    }

    // Create new node with same value
    // Don't set neighbors yet to avoid cycles
    const copy = new Node(original.val);

    // Store mapping BEFORE recursing on neighbors
    // This is crucial for handling cycles
    nodeMap.set(original, copy);

    // Recursively copy all neighbors
    // This will create copies or retrieve existing ones from nodeMap
    for (const neighbor of original.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }

    return copy;
  };

  // Start DFS from the given node
  return dfs(node);
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}
*/

class Solution {
    // Time: O(V + E) where V = vertices, E = edges
    // Space: O(V) for the hash map and recursion stack

    // Map to store original node -> copy node mappings
    private HashMap<Node, Node> nodeMap = new HashMap<>();

    public Node cloneGraph(Node node) {
        // Edge case: empty graph
        if (node == null) return null;

        // Start DFS from the given node
        return dfs(node);
    }

    private Node dfs(Node original) {
        // If we've already copied this node, return the copy
        if (nodeMap.containsKey(original)) {
            return nodeMap.get(original);
        }

        // Create new node with same value
        // Don't set neighbors yet to avoid cycles
        Node copy = new Node(original.val);

        // Store mapping BEFORE recursing on neighbors
        // This is crucial for handling cycles
        nodeMap.put(original, copy);

        // Recursively copy all neighbors
        // This will create copies or retrieve existing ones from nodeMap
        for (Node neighbor : original.neighbors) {
            copy.neighbors.add(dfs(neighbor));
        }

        return copy;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- We visit each vertex (node) exactly once: O(V)
- For each vertex, we iterate through all its edges (neighbors): O(E)
- Total: O(V + E), which is linear in the size of the graph

**Space Complexity: O(V)**

- The hash map stores one entry per vertex: O(V)
- The recursion stack (for DFS) can go as deep as V in the worst case (a straight line graph): O(V)
- Total: O(V)

Note: In an undirected graph, each edge is counted twice (once from each endpoint), but O(2E) = O(E).

## Common Mistakes

1. **Forgetting to handle the null/empty graph case**: Always check if the input node is null and return null immediately.

2. **Not storing the mapping before recursing on neighbors**: This causes infinite recursion on cycles. You MUST store `original → copy` in the map BEFORE the recursive calls to neighbors.

3. **Creating disconnected copies**: If you create copies without properly connecting them via the neighbor lists, you'll get isolated nodes instead of a connected graph.

4. **Using node values as keys in the map**: Multiple nodes can have the same value! You must use the node objects themselves as keys.

5. **Modifying the original graph**: The problem asks for a deep copy, so you shouldn't modify the original nodes or their neighbor lists.

## When You'll See This Pattern

This "copy with mapping" pattern appears whenever you need to duplicate a structure with references/pointers between elements:

1. **Copy List with Random Pointer (LeetCode 138)**: Similar to cloning a graph, but with a linked list where each node has a `next` and `random` pointer. You use the same hash map technique to map original nodes to copies.

2. **Clone Binary Tree With Random Pointer (LeetCode 1485)**: A binary tree where nodes also have random pointers. The approach combines tree traversal with the mapping technique.

3. **Clone N-ary Tree (LeetCode 1490)**: Similar to this problem but with trees instead of general graphs. The mapping technique still applies.

4. **Reconstruct itinerary (LeetCode 332)**: While not exactly the same, it involves graph traversal where you need to track visited nodes to avoid cycles.

## Key Takeaways

1. **Use a hash map to track original→copy mappings** when duplicating structures with internal references. This prevents infinite loops and ensures shared references are preserved.

2. **Store the mapping before processing dependencies** (neighbors, random pointers, etc.). This is crucial for handling cycles.

3. **DFS and BFS are equally valid** for graph traversal problems. Choose based on your preference and constraints (DFS is recursive and elegant, BFS avoids deep recursion stacks).

4. **The time complexity for graph traversal is typically O(V + E)**, where you visit each vertex once and process each edge once.

Related problems: [Copy List with Random Pointer](/problem/copy-list-with-random-pointer), [Clone Binary Tree With Random Pointer](/problem/clone-binary-tree-with-random-pointer), [Clone N-ary Tree](/problem/clone-n-ary-tree)
