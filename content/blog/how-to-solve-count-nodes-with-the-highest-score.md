---
title: "How to Solve Count Nodes With the Highest Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Nodes With the Highest Score. Medium difficulty, 52.5% acceptance rate. Topics: Array, Tree, Depth-First Search, Binary Tree."
date: "2028-11-04"
category: "dsa-patterns"
tags: ["count-nodes-with-the-highest-score", "array", "tree", "depth-first-search", "medium"]
---

# How to Solve Count Nodes With the Highest Score

This problem asks us to find how many nodes in a binary tree have the highest possible "score" when removed. The score is defined as the product of the sizes of the three resulting components: the left subtree, the right subtree, and the rest of the tree (excluding the node and its subtrees). What makes this problem interesting is that we need to efficiently compute subtree sizes for every node while also tracking the size of the "remaining" tree component, all without actually removing nodes.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `parents = [-1,2,0,1,0]` which represents this tree:

- Node 0 is root (parent = -1)
- Node 1's parent is 2
- Node 2's parent is 0
- Node 3's parent is 1
- Node 4's parent is 0

Visually:

```
      0
     / \
    2   4
   /
  1
 /
3
```

Now let's calculate scores for each node:

**Node 0**: Removing root splits the tree into:

- Left subtree (node 2 and its descendants): size = 3 (nodes 2, 1, 3)
- Right subtree (node 4): size = 1
- Rest of tree: size = 0 (no nodes outside root's subtrees)
  Score = 3 × 1 × 1 = 3 (we treat empty component as size 1)

**Node 1**: Removing node 1 splits into:

- Left subtree (node 3): size = 1
- Right subtree: size = 0 (node 1 has no right child)
- Rest of tree: size = 3 (nodes 0, 2, 4)
  Score = 1 × 1 × 3 = 3

**Node 2**: Removing node 2 splits into:

- Left subtree (node 1 and its descendants): size = 2 (nodes 1, 3)
- Right subtree: size = 0
- Rest of tree: size = 2 (nodes 0, 4)
  Score = 2 × 1 × 2 = 4

**Node 3**: Removing leaf node 3:

- Left subtree: size = 0
- Right subtree: size = 0
- Rest of tree: size = 4 (all other nodes)
  Score = 1 × 1 × 4 = 4

**Node 4**: Removing leaf node 4:

- Left subtree: size = 0
- Right subtree: size = 0
- Rest of tree: size = 4
  Score = 1 × 1 × 4 = 4

The highest score is 4, achieved by nodes 2, 3, and 4. So the answer is 3.

## Brute Force Approach

A naive approach would be: for each node, physically remove it from the tree, calculate the sizes of the resulting components via DFS, compute the product, then restore the node. This requires O(n) DFS traversals for each of n nodes, giving O(n²) time complexity.

Even worse, we'd need to actually modify the tree structure or keep track of which node is "removed" during each calculation. The tree has up to 10⁵ nodes, making O(n²) completely infeasible (10¹⁰ operations).

What makes the brute force insufficient is the repeated work: we're traversing the same subtrees over and over. The key insight is that we can compute all subtree sizes in a single DFS pass and reuse them.

## Optimized Approach

The optimal solution uses a single DFS to compute subtree sizes for all nodes. Here's the step-by-step reasoning:

1. **Build the tree**: First, convert the `parents` array into an adjacency list so we can traverse from parent to children.

2. **Compute subtree sizes**: Perform DFS from the root to calculate the size of each node's subtree (including the node itself). Store these in an array.

3. **Calculate scores efficiently**: For each node, we need three components:
   - Left subtree size (if exists)
   - Right subtree size (if exists)
   - Rest of tree size = total nodes - current node's subtree size

   The product is: `(left_size or 1) × (right_size or 1) × (rest_size or 1)`
   We use 1 for missing components because multiplying by 1 doesn't change the product.

4. **Track maximum**: Keep track of the maximum score and count how many nodes achieve it.

The clever part is realizing that once we have all subtree sizes, we can compute any node's score in O(1) time using simple arithmetic.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countHighestScoreNodes(self, parents):
    n = len(parents)

    # Step 1: Build adjacency list for the tree
    children = [[] for _ in range(n)]
    for i in range(1, n):  # Skip root (0) since its parent is -1
        children[parents[i]].append(i)

    # Step 2: Compute subtree sizes using DFS
    subtree_size = [0] * n

    def dfs(node):
        """Returns the size of subtree rooted at node."""
        size = 1  # Count the current node

        # Recursively compute sizes of child subtrees
        for child in children[node]:
            child_size = dfs(child)
            size += child_size

        subtree_size[node] = size
        return size

    dfs(0)  # Start DFS from root

    # Step 3: Calculate scores and find maximum
    max_score = 0
    count = 0

    for node in range(n):
        # Initialize product with 1 (for multiplication)
        product = 1

        # Multiply by sizes of child subtrees
        for child in children[node]:
            product *= subtree_size[child]

        # Multiply by size of the rest of the tree
        # Rest size = total nodes - size of current subtree
        rest_size = n - subtree_size[node]
        if rest_size > 0:
            product *= rest_size

        # Update max score and count
        if product > max_score:
            max_score = product
            count = 1
        elif product == max_score:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
var countHighestScoreNodes = function (parents) {
  const n = parents.length;

  // Step 1: Build adjacency list for the tree
  const children = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    // Skip root (0) since its parent is -1
    children[parents[i]].push(i);
  }

  // Step 2: Compute subtree sizes using DFS
  const subtreeSize = new Array(n).fill(0);

  function dfs(node) {
    // Returns the size of subtree rooted at node
    let size = 1; // Count the current node

    // Recursively compute sizes of child subtrees
    for (const child of children[node]) {
      const childSize = dfs(child);
      size += childSize;
    }

    subtreeSize[node] = size;
    return size;
  }

  dfs(0); // Start DFS from root

  // Step 3: Calculate scores and find maximum
  let maxScore = 0;
  let count = 0;

  for (let node = 0; node < n; node++) {
    // Initialize product with 1 (for multiplication)
    let product = 1;

    // Multiply by sizes of child subtrees
    for (const child of children[node]) {
      product *= subtreeSize[child];
    }

    // Multiply by size of the rest of the tree
    // Rest size = total nodes - size of current subtree
    const restSize = n - subtreeSize[node];
    if (restSize > 0) {
      product *= restSize;
    }

    // Update max score and count
    if (product > maxScore) {
      maxScore = product;
      count = 1;
    } else if (product === maxScore) {
      count++;
    }
  }

  return count;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int countHighestScoreNodes(int[] parents) {
        int n = parents.length;

        // Step 1: Build adjacency list for the tree
        List<Integer>[] children = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            children[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (0) since its parent is -1
            children[parents[i]].add(i);
        }

        // Step 2: Compute subtree sizes using DFS
        int[] subtreeSize = new int[n];

        dfs(0, children, subtreeSize);

        // Step 3: Calculate scores and find maximum
        long maxScore = 0;
        int count = 0;

        for (int node = 0; node < n; node++) {
            // Initialize product with 1 (for multiplication)
            long product = 1;

            // Multiply by sizes of child subtrees
            for (int child : children[node]) {
                product *= subtreeSize[child];
            }

            // Multiply by size of the rest of the tree
            // Rest size = total nodes - size of current subtree
            int restSize = n - subtreeSize[node];
            if (restSize > 0) {
                product *= restSize;
            }

            // Update max score and count
            if (product > maxScore) {
                maxScore = product;
                count = 1;
            } else if (product == maxScore) {
                count++;
            }
        }

        return count;
    }

    private int dfs(int node, List<Integer>[] children, int[] subtreeSize) {
        // Returns the size of subtree rooted at node
        int size = 1;  // Count the current node

        // Recursively compute sizes of child subtrees
        for (int child : children[node]) {
            int childSize = dfs(child, children, subtreeSize);
            size += childSize;
        }

        subtreeSize[node] = size;
        return size;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time
- The DFS visits each node exactly once, performing O(1) work per node
- Calculating scores visits each node once, performing O(1) work per node (each node has at most 2 children in a binary tree)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The adjacency list stores up to n-1 edges: O(n)
- The subtreeSize array stores n integers: O(n)
- The recursion stack in DFS could be O(n) in the worst case (skewed tree)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle empty components**: When a node has no left child, left subtree size is 0, but the score calculation should use 1 instead. The problem states that if a component is empty, we treat its size as 1 for multiplication.

2. **Integer overflow**: The product of subtree sizes can be huge (up to n³ where n ≤ 10⁵). In Java, use `long` instead of `int` for the product. In Python, integers are arbitrary precision, but in JavaScript, use regular numbers (they're 64-bit floating point, which works for this problem's constraints).

3. **Incorrect rest size calculation**: The rest of the tree is `n - subtreeSize[node]`, not `n - 1`. We need to exclude the entire subtree rooted at the current node, not just the node itself.

4. **Assuming binary tree structure**: The problem says "binary tree" but the input doesn't guarantee each node has exactly 0, 1, or 2 children. Our solution handles any number of children correctly.

## When You'll See This Pattern

This problem uses **subtree size computation via DFS**, a pattern common in tree problems:

1. **Sum of Distances in Tree (LeetCode 834)**: Also uses DFS to compute subtree sizes and then applies a re-rooting technique to compute distances from each node.

2. **Maximum Product of Splitted Binary Tree (LeetCode 1339)**: Very similar—compute subtree sums via DFS, then find the maximum product when removing an edge.

3. **Delete Nodes And Return Forest (LeetCode 1110)**: Uses DFS with subtree information to determine which nodes become roots of new trees.

The core technique is: perform one DFS to gather subtree information (size, sum, etc.), then use that information to answer queries about each node in O(1) time.

## Key Takeaways

1. **Precompute subtree properties**: When you need information about every node's subtree, compute it once via DFS rather than recomputing for each node.

2. **Think in terms of components**: When removing a node from a tree, you always get at most three components: left subtree, right subtree, and the rest of the tree. The sizes of these components determine the score.

3. **Watch for overflow**: Tree problems often involve products or sums that can exceed 32-bit integer limits. Use appropriate data types (long in Java, regular int in Python, Number in JavaScript).

Related problems: [Sum of Distances in Tree](/problem/sum-of-distances-in-tree), [Delete Nodes And Return Forest](/problem/delete-nodes-and-return-forest), [Maximum Product of Splitted Binary Tree](/problem/maximum-product-of-splitted-binary-tree)
