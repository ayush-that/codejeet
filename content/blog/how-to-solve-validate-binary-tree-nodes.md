---
title: "How to Solve Validate Binary Tree Nodes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Validate Binary Tree Nodes. Medium difficulty, 44.1% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2026-11-25"
category: "dsa-patterns"
tags: ["validate-binary-tree-nodes", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Validate Binary Tree Nodes

You're given `n` nodes numbered from `0` to `n-1`, each with potential left and right children specified in arrays. Your task is to determine whether these nodes form exactly one valid binary tree. What makes this problem tricky is that you need to validate multiple constraints simultaneously: there must be exactly one root, no cycles, each node has at most one parent, and all nodes must be connected.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `n = 4` with:

- `leftChild = [1, -1, 3, -1]`
- `rightChild = [2, -1, -1, -1]`

Visually, this represents:

- Node 0 has left child 1 and right child 2
- Node 1 has no children
- Node 2 has left child 3
- Node 3 has no children

We need to check several conditions:

1. **Find the root**: Count how many nodes have no parent. In a valid tree, exactly one node should have no parent.
2. **Check for cycles**: Starting from the root, we should be able to visit all nodes without revisiting any.
3. **Check connectivity**: All nodes should be reachable from the root.

For our example:

- Node 0: Has no parent (not listed as anyone's child)
- Node 1: Parent is node 0
- Node 2: Parent is node 0
- Node 3: Parent is node 2

Exactly one node (node 0) has no parent ✓
No cycles when traversing from node 0 ✓
All 4 nodes are reachable from node 0 ✓

This is a valid binary tree!

## Brute Force Approach

A naive approach might try to simulate tree building by randomly selecting nodes as potential roots and checking if we can build a valid tree from each. For each potential root, we'd perform DFS/BFS to check for cycles and connectivity.

The problem with this brute force is:

1. We don't know which node is the root, so we'd need to try all `n` possibilities
2. For each potential root, we'd need to traverse up to `n` nodes
3. We'd also need to track visited nodes to detect cycles
4. This leads to O(n²) time complexity in worst case

Even worse, a candidate might try to build the tree without first identifying the root, leading to complex bookkeeping about which nodes have been assigned as children multiple times.

## Optimized Approach

The key insight is that we can validate a binary tree by checking these conditions in order:

1. **Exactly one root exists**: In a valid tree, exactly one node should have no parent. We can track parent counts for each node.
2. **No cycles exist**: Starting from the root, we should be able to traverse to all nodes without revisiting any.
3. **All nodes are connected**: The number of nodes visited from the root should equal `n`.

We can implement this efficiently using:

- A `parentCount` array to track how many parents each node has (0, 1, or more)
- DFS/BFS from the identified root to check for cycles and connectivity
- A visited set to detect cycles during traversal

The critical observation: if a node has more than one parent, it's immediately invalid. If no node or multiple nodes have zero parents, it's also invalid.

## Optimal Solution

Here's the complete solution implementing the optimized approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def validateBinaryTreeNodes(n, leftChild, rightChild):
    """
    Validates if the given nodes form exactly one valid binary tree.

    Args:
        n: Number of nodes
        leftChild: List of left children indices (-1 for no child)
        rightChild: List of right children indices (-1 for no child)

    Returns:
        True if valid binary tree, False otherwise
    """
    # Step 1: Track parent count for each node
    parent_count = [0] * n

    # Count parents for each node
    for i in range(n):
        left = leftChild[i]
        right = rightChild[i]

        # If node i has a left child, increment that child's parent count
        if left != -1:
            parent_count[left] += 1
            # If a node has more than 1 parent, it's invalid
            if parent_count[left] > 1:
                return False

        # If node i has a right child, increment that child's parent count
        if right != -1:
            parent_count[right] += 1
            # If a node has more than 1 parent, it's invalid
            if parent_count[right] > 1:
                return False

    # Step 2: Find the root (node with 0 parents)
    root = -1
    for i in range(n):
        if parent_count[i] == 0:
            # If we already found a root, there are multiple roots
            if root != -1:
                return False
            root = i

    # If no root found, the graph has cycles or disconnected components
    if root == -1:
        return False

    # Step 3: Perform BFS/DFS from root to check connectivity and cycles
    visited = [False] * n
    stack = [root]

    while stack:
        node = stack.pop()

        # If we've already visited this node, we have a cycle
        if visited[node]:
            return False

        visited[node] = True

        # Add left child to stack if it exists
        left = leftChild[node]
        if left != -1:
            stack.append(left)

        # Add right child to stack if it exists
        right = rightChild[node]
        if right != -1:
            stack.append(right)

    # Step 4: Check if all nodes were visited
    # If any node wasn't visited, the tree is disconnected
    return all(visited)
```

```javascript
// Time: O(n) | Space: O(n)
function validateBinaryTreeNodes(n, leftChild, rightChild) {
  /**
   * Validates if the given nodes form exactly one valid binary tree.
   *
   * @param {number} n - Number of nodes
   * @param {number[]} leftChild - Array of left children indices (-1 for no child)
   * @param {number[]} rightChild - Array of right children indices (-1 for no child)
   * @return {boolean} True if valid binary tree, False otherwise
   */

  // Step 1: Track parent count for each node
  const parentCount = new Array(n).fill(0);

  // Count parents for each node
  for (let i = 0; i < n; i++) {
    const left = leftChild[i];
    const right = rightChild[i];

    // If node i has a left child, increment that child's parent count
    if (left !== -1) {
      parentCount[left]++;
      // If a node has more than 1 parent, it's invalid
      if (parentCount[left] > 1) {
        return false;
      }
    }

    // If node i has a right child, increment that child's parent count
    if (right !== -1) {
      parentCount[right]++;
      // If a node has more than 1 parent, it's invalid
      if (parentCount[right] > 1) {
        return false;
      }
    }
  }

  // Step 2: Find the root (node with 0 parents)
  let root = -1;
  for (let i = 0; i < n; i++) {
    if (parentCount[i] === 0) {
      // If we already found a root, there are multiple roots
      if (root !== -1) {
        return false;
      }
      root = i;
    }
  }

  // If no root found, the graph has cycles or disconnected components
  if (root === -1) {
    return false;
  }

  // Step 3: Perform BFS/DFS from root to check connectivity and cycles
  const visited = new Array(n).fill(false);
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();

    // If we've already visited this node, we have a cycle
    if (visited[node]) {
      return false;
    }

    visited[node] = true;

    // Add left child to stack if it exists
    const left = leftChild[node];
    if (left !== -1) {
      stack.push(left);
    }

    // Add right child to stack if it exists
    const right = rightChild[node];
    if (right !== -1) {
      stack.push(right);
    }
  }

  // Step 4: Check if all nodes were visited
  // If any node wasn't visited, the tree is disconnected
  return visited.every((v) => v);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public boolean validateBinaryTreeNodes(int n, int[] leftChild, int[] rightChild) {
        /**
         * Validates if the given nodes form exactly one valid binary tree.
         *
         * @param n Number of nodes
         * @param leftChild Array of left children indices (-1 for no child)
         * @param rightChild Array of right children indices (-1 for no child)
         * @return True if valid binary tree, False otherwise
         */

        // Step 1: Track parent count for each node
        int[] parentCount = new int[n];

        // Count parents for each node
        for (int i = 0; i < n; i++) {
            int left = leftChild[i];
            int right = rightChild[i];

            // If node i has a left child, increment that child's parent count
            if (left != -1) {
                parentCount[left]++;
                // If a node has more than 1 parent, it's invalid
                if (parentCount[left] > 1) {
                    return false;
                }
            }

            // If node i has a right child, increment that child's parent count
            if (right != -1) {
                parentCount[right]++;
                // If a node has more than 1 parent, it's invalid
                if (parentCount[right] > 1) {
                    return false;
                }
            }
        }

        // Step 2: Find the root (node with 0 parents)
        int root = -1;
        for (int i = 0; i < n; i++) {
            if (parentCount[i] == 0) {
                // If we already found a root, there are multiple roots
                if (root != -1) {
                    return false;
                }
                root = i;
            }
        }

        // If no root found, the graph has cycles or disconnected components
        if (root == -1) {
            return false;
        }

        // Step 3: Perform BFS/DFS from root to check connectivity and cycles
        boolean[] visited = new boolean[n];
        Stack<Integer> stack = new Stack<>();
        stack.push(root);

        while (!stack.isEmpty()) {
            int node = stack.pop();

            // If we've already visited this node, we have a cycle
            if (visited[node]) {
                return false;
            }

            visited[node] = true;

            // Add left child to stack if it exists
            int left = leftChild[node];
            if (left != -1) {
                stack.push(left);
            }

            // Add right child to stack if it exists
            int right = rightChild[node];
            if (right != -1) {
                stack.push(right);
            }
        }

        // Step 4: Check if all nodes were visited
        // If any node wasn't visited, the tree is disconnected
        for (boolean v : visited) {
            if (!v) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all nodes once to count parents: O(n)
- We iterate through all nodes once to find the root: O(n)
- We traverse all nodes once from the root: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store parent counts for all nodes: O(n)
- We store visited status for all nodes: O(n)
- The stack/queue for traversal can hold up to n nodes in worst case: O(n)
- Total: O(3n) = O(n)

## Common Mistakes

1. **Forgetting to check for multiple parents**: A node can only have one parent in a tree. Candidates often miss checking if `parentCount[node] > 1` during the initial parent counting phase.

2. **Assuming node 0 is always the root**: The root isn't necessarily node 0. You must find the node with zero parents. Some candidates start traversal from node 0 without verifying it's actually the root.

3. **Not checking connectivity after cycle detection**: Even with no cycles and exactly one root, the tree might be disconnected. You must verify that all nodes are reachable from the root by checking if `all(visited)` is true.

4. **Using recursion without considering stack overflow**: For large `n`, recursive DFS might cause stack overflow. Iterative DFS/BFS is safer. Also, recursion makes cycle detection trickier unless you track the recursion stack.

## When You'll See This Pattern

This problem combines tree validation with graph theory concepts. You'll see similar patterns in:

1. **Course Schedule (LeetCode 207)**: Validating if courses can be taken given prerequisites (cycle detection in directed graph)
2. **Graph Valid Tree (LeetCode 261)**: Almost identical problem but for general graphs instead of binary trees
3. **Redundant Connection (LeetCode 684)**: Finding edges that create cycles in an undirected graph

The core technique of tracking parent/indegree counts and performing traversal to check connectivity and cycles appears in many graph validation problems.

## Key Takeaways

1. **Tree validation requires checking multiple constraints**: Always verify (1) exactly one root, (2) no cycles, (3) all nodes connected, and (4) each node has at most one parent.

2. **Parent counting is efficient for finding roots and detecting multiple parents**: Instead of complex bookkeeping, a simple `parentCount` array solves two validation checks simultaneously.

3. **Graph theory concepts apply to tree problems**: Trees are a special case of graphs (connected, acyclic, directed from parent to children). Thinking in graph terms often leads to cleaner solutions.

[Practice this problem on CodeJeet](/problem/validate-binary-tree-nodes)
