---
title: "How to Solve Cycle Length Queries in a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cycle Length Queries in a Tree. Hard difficulty, 60.2% acceptance rate. Topics: Array, Tree, Binary Tree."
date: "2029-12-05"
category: "dsa-patterns"
tags: ["cycle-length-queries-in-a-tree", "array", "tree", "binary-tree", "hard"]
---

# How to Solve Cycle Length Queries in a Tree

This problem asks you to find the length of the cycle between two nodes in a **complete binary tree** with `2^n - 1` nodes. Given multiple queries `(a, b)`, you need to return the number of edges in the path from node `a` to node `b`. What makes this problem interesting is that you're not given the tree structure directly—you need to work with the mathematical properties of node numbering in a complete binary tree. The challenge is finding an efficient way to compute distances without building the actual tree.

## Visual Walkthrough

Let's understand the problem with a concrete example. Suppose `n = 3`, which means we have a complete binary tree with `2^3 - 1 = 7` nodes numbered from 1 to 7:

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

Now consider a query `(4, 7)`. We need to find the path from node 4 to node 7:

- Path from 4 to root: 4 → 2 → 1
- Path from 7 to root: 7 → 3 → 1

The cycle length (total edges in the path) is the sum of edges from both nodes to their lowest common ancestor (LCA), minus any double counting. In this case:

- Distance from 4 to LCA (node 1): 2 edges (4→2, 2→1)
- Distance from 7 to LCA (node 1): 2 edges (7→3, 3→1)
- Total cycle length: 2 + 2 = 4 edges

But wait—this counts the edges from LCA to both nodes, but we want the cycle that goes from `a` to `b` and back to `a`. Actually, the problem defines "cycle length" as the number of edges in the unique path from `a` to `b`. So for `(4, 7)`, the path is: 4 → 2 → 1 → 3 → 7, which has 4 edges.

The key insight: In a complete binary tree with standard numbering, we can find the path between any two nodes by finding their lowest common ancestor using simple integer division.

## Brute Force Approach

A naive approach would be to actually build the tree and then perform BFS/DFS to find the path between nodes for each query. Here's what that might look like:

1. Build the complete binary tree with `2^n - 1` nodes
2. For each query `(a, b)`:
   - Find the path from `a` to root
   - Find the path from `b` to root
   - Find the lowest common ancestor (LCA)
   - Calculate distance as: `depth(a) + depth(b) - 2 * depth(LCA)`

The problem with this approach is the tree size: when `n = 30`, we'd have over 1 billion nodes! Building such a tree is impossible in terms of both time and memory. Even if we could build it, traversing it for each query would be too slow when we have up to 10^5 queries.

## Optimized Approach

The optimal solution leverages the mathematical structure of the tree without building it. In a complete binary tree with standard numbering:

- Parent of node `x` is `floor(x / 2)` (or `x // 2` in integer division)
- Depth of node `x` is `floor(log₂(x))`

For any two nodes `a` and `b`, we can find their LCA by repeatedly moving the deeper node up to its parent until they meet. The distance between them is the number of steps `a` needs to reach LCA plus the number of steps `b` needs to reach LCA.

Here's the step-by-step reasoning:

1. Initialize `distance = 0`
2. While `a ≠ b`:
   - If `a > b`, then `a` is deeper in the tree (or at the same level but in a different branch)
   - Move the larger node up to its parent: `a = a // 2`
   - Increment `distance` by 1
3. When `a == b`, we've found the LCA, and `distance` is the total number of edges in the path

Why does this work? Because in a complete binary tree with this numbering scheme, the parent relationship is exactly `parent = child // 2`. By repeatedly moving the deeper node up, we're essentially tracing both paths toward the root until they meet at the LCA.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(q * log(max(a, b))) where q = number of queries
# Space: O(1) excluding output array
def cycleLengthQueries(n, queries):
    """
    Calculate cycle lengths for multiple queries in a complete binary tree.

    Args:
        n: Height of the complete binary tree (not directly used in calculation)
        queries: List of [a, b] pairs representing node values

    Returns:
        List of cycle lengths (edges in path between a and b)
    """
    result = []

    for a, b in queries:
        distance = 0

        # Continue until both nodes meet at their lowest common ancestor
        while a != b:
            # Move the larger node up (deeper in the tree)
            if a > b:
                a //= 2  # Parent of a
            else:
                b //= 2  # Parent of b

            distance += 1  # Each move adds one edge to the path

        # The cycle length is distance + 1 because we need to include
        # the edge that connects a and b in the cycle
        # Actually, the problem defines cycle length as just the path from a to b,
        # so we use distance directly
        result.append(distance)

    return result
```

```javascript
// Time: O(q * log(max(a, b))) where q = number of queries
// Space: O(1) excluding output array
function cycleLengthQueries(n, queries) {
  /**
   * Calculate cycle lengths for multiple queries in a complete binary tree.
   *
   * @param {number} n - Height of the complete binary tree
   * @param {number[][]} queries - Array of [a, b] pairs representing node values
   * @return {number[]} - Array of cycle lengths (edges in path between a and b)
   */
  const result = [];

  for (const [a, b] of queries) {
    let nodeA = a;
    let nodeB = b;
    let distance = 0;

    // Continue until both nodes meet at their lowest common ancestor
    while (nodeA !== nodeB) {
      // Move the larger node up (deeper in the tree)
      if (nodeA > nodeB) {
        nodeA = Math.floor(nodeA / 2); // Parent of nodeA
      } else {
        nodeB = Math.floor(nodeB / 2); // Parent of nodeB
      }

      distance++; // Each move adds one edge to the path
    }

    result.push(distance);
  }

  return result;
}
```

```java
// Time: O(q * log(max(a, b))) where q = number of queries
// Space: O(1) excluding output array
import java.util.*;

class Solution {
    public int[] cycleLengthQueries(int n, int[][] queries) {
        /**
         * Calculate cycle lengths for multiple queries in a complete binary tree.
         *
         * @param n - Height of the complete binary tree
         * @param queries - Array of [a, b] pairs representing node values
         * @return int[] - Array of cycle lengths (edges in path between a and b)
         */
        int[] result = new int[queries.length];

        for (int i = 0; i < queries.length; i++) {
            int a = queries[i][0];
            int b = queries[i][1];
            int distance = 0;

            // Continue until both nodes meet at their lowest common ancestor
            while (a != b) {
                // Move the larger node up (deeper in the tree)
                if (a > b) {
                    a /= 2;  // Parent of a
                } else {
                    b /= 2;  // Parent of b
                }

                distance++;  // Each move adds one edge to the path
            }

            result[i] = distance;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(q \* log(max(a, b))) where q is the number of queries.

- For each query, we repeatedly divide the node values by 2 until they meet
- In the worst case, both nodes are leaves at maximum depth, which requires O(log(max(a, b))) operations
- Since maximum node value is 2^n - 1, and n ≤ 30, log(max(a, b)) ≤ 30

**Space Complexity:** O(1) excluding the output array

- We only use a few integer variables regardless of input size
- The algorithm operates in-place without additional data structures

## Common Mistakes

1. **Building the actual tree:** Attempting to construct the complete binary tree when n can be as large as 30. This would require creating 2^30 - 1 ≈ 1 billion nodes, which is impossible within memory constraints.

2. **Incorrect parent calculation:** Using `(x - 1) / 2` instead of `x // 2`. While both give the same result for integers, the integer division approach is clearer and works correctly in all languages.

3. **Off-by-one errors in distance calculation:** Forgetting to increment distance for each move, or adding an extra +1 at the end. Remember: each time we move a node to its parent, we're traversing one edge.

4. **Assuming symmetric path:** Thinking the distance from a to b is the same as from b to a (which is true) but implementing asymmetric logic that treats a and b differently based on their values rather than their depths.

## When You'll See This Pattern

This problem uses the **lowest common ancestor (LCA) in binary trees** pattern, but with a twist: we exploit the mathematical properties of a perfectly balanced binary tree with standard numbering. You'll see similar patterns in:

1. **Lowest Common Ancestor of a Binary Tree (Medium)** - The general case where you need to find LCA without special tree properties. This problem is easier because we have a mathematical formula for finding parents.

2. **Path In Zigzag Labelled Binary Tree (Medium)** - Another problem that uses mathematical relationships in a specially-numbered binary tree to find paths without building the tree.

3. **Populating Next Right Pointers in Each Node (Medium)** - While not directly about LCA, it also deals with complete binary trees and requires understanding the level-order structure.

## Key Takeaways

1. **Mathematical properties beat brute force:** When dealing with specially structured trees (complete, perfect, or with mathematical numbering), look for formulas that describe relationships between nodes rather than building the entire tree.

2. **LCA via parent climbing:** The technique of repeatedly moving nodes to their parents until they meet is a fundamental approach for finding lowest common ancestors. In balanced trees, this is efficient (O(log n) per query).

3. **Think in terms of depths:** In tree distance problems, the distance between two nodes is often `depth(a) + depth(b) - 2 * depth(LCA)`. In this problem, we compute this implicitly by counting steps as we climb toward the LCA.

Related problems: [Populating Next Right Pointers in Each Node](/problem/populating-next-right-pointers-in-each-node), [Lowest Common Ancestor of a Binary Tree](/problem/lowest-common-ancestor-of-a-binary-tree), [Path In Zigzag Labelled Binary Tree](/problem/path-in-zigzag-labelled-binary-tree)
