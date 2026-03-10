---
title: "How to Solve Unique Binary Search Trees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Binary Search Trees. Medium difficulty, 63.3% acceptance rate. Topics: Math, Dynamic Programming, Tree, Binary Search Tree, Binary Tree."
date: "2026-11-28"
category: "dsa-patterns"
tags: ["unique-binary-search-trees", "math", "dynamic-programming", "tree", "medium"]
---

# How to Solve Unique Binary Search Trees

Given an integer `n`, you need to count how many structurally unique Binary Search Trees (BSTs) can be formed using exactly `n` distinct nodes with values from 1 to `n`. This problem is interesting because it looks like a tree construction problem, but the optimal solution uses dynamic programming and reveals a connection to the mathematical Catalan numbers.

## Visual Walkthrough

Let's build intuition with a small example: `n = 3`. We have nodes with values 1, 2, and 3.

The key insight is that in a BST, for any chosen root node, all smaller values must go in the left subtree, and all larger values must go in the right subtree.

**Case 1: Root = 1**

- Left subtree: empty (0 nodes)
- Right subtree: contains nodes 2 and 3 (2 nodes)
- Number of BSTs with root 1 = (BSTs with 0 nodes) × (BSTs with 2 nodes)

**Case 2: Root = 2**

- Left subtree: contains node 1 (1 node)
- Right subtree: contains node 3 (1 node)
- Number of BSTs with root 2 = (BSTs with 1 node) × (BSTs with 1 node)

**Case 3: Root = 3**

- Left subtree: contains nodes 1 and 2 (2 nodes)
- Right subtree: empty (0 nodes)
- Number of BSTs with root 3 = (BSTs with 2 nodes) × (BSTs with 0 nodes)

If we know how many unique BSTs exist for 0, 1, and 2 nodes, we can calculate for 3 nodes:

- BSTs(0) = 1 (empty tree)
- BSTs(1) = 1 (single node tree)
- BSTs(2):
  - Root=1: 1 × BSTs(1) = 1
  - Root=2: BSTs(1) × 1 = 1
  - Total = 2

Now BSTs(3) = BSTs(0)×BSTs(2) + BSTs(1)×BSTs(1) + BSTs(2)×BSTs(0) = 1×2 + 1×1 + 2×1 = 5

We can verify there are indeed 5 unique BSTs with 3 nodes.

## Brute Force Approach

A naive approach would be to actually generate all possible BSTs and count them. We could:

1. Generate all permutations of nodes 1 through n
2. For each permutation, insert nodes in order to build a BST
3. Check if we've seen this structure before (using tree serialization)
4. Count unique structures

This approach is extremely inefficient because:

- There are n! permutations (factorial growth)
- Building and comparing trees is expensive
- The time complexity would be O(n! × n) which is infeasible even for small n

Even a recursive brute force that tries every node as root and recursively builds left/right subtrees would have exponential time complexity because it recomputes the same subproblems many times.

## Optimized Approach

The key insight is that the number of unique BSTs depends only on the number of nodes, not their specific values. If we have nodes 1,2,3 or nodes 4,5,6, the number of unique BST structures is the same.

This leads to a dynamic programming solution:

- Let `dp[i]` = number of unique BSTs with `i` nodes
- Base case: `dp[0] = 1` (empty tree)
- For `i` from 1 to n:
  - Try each node `j` from 1 to i as the root
  - Left subtree has `j-1` nodes
  - Right subtree has `i-j` nodes
  - Number of trees with root `j` = `dp[j-1] × dp[i-j]`
  - Sum over all possible roots: `dp[i] = Σ(dp[j-1] × dp[i-j])` for j=1 to i

This is essentially computing the Catalan numbers: Cₙ = (2n)!/((n+1)!n!)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def numTrees(n: int) -> int:
    """
    Calculate the number of structurally unique BSTs with n nodes.

    The solution uses dynamic programming where dp[i] represents
    the number of unique BSTs that can be formed with i nodes.
    """
    # dp[i] = number of unique BSTs with i nodes
    dp = [0] * (n + 1)

    # Base case: empty tree counts as 1
    dp[0] = 1

    # For each total number of nodes from 1 to n
    for total_nodes in range(1, n + 1):
        # Try every node from 1 to total_nodes as the root
        for root_val in range(1, total_nodes + 1):
            # When root is 'root_val', left subtree has (root_val - 1) nodes
            left_count = root_val - 1
            # Right subtree has (total_nodes - root_val) nodes
            right_count = total_nodes - root_val

            # Number of trees with this root = combinations of left × right
            dp[total_nodes] += dp[left_count] * dp[right_count]

    return dp[n]
```

```javascript
// Time: O(n²) | Space: O(n)
/**
 * Calculate the number of structurally unique BSTs with n nodes.
 *
 * The solution uses dynamic programming where dp[i] represents
 * the number of unique BSTs that can be formed with i nodes.
 */
function numTrees(n) {
  // dp[i] = number of unique BSTs with i nodes
  const dp = new Array(n + 1).fill(0);

  // Base case: empty tree counts as 1
  dp[0] = 1;

  // For each total number of nodes from 1 to n
  for (let totalNodes = 1; totalNodes <= n; totalNodes++) {
    // Try every node from 1 to totalNodes as the root
    for (let rootVal = 1; rootVal <= totalNodes; rootVal++) {
      // When root is 'rootVal', left subtree has (rootVal - 1) nodes
      const leftCount = rootVal - 1;
      // Right subtree has (totalNodes - rootVal) nodes
      const rightCount = totalNodes - rootVal;

      // Number of trees with this root = combinations of left × right
      dp[totalNodes] += dp[leftCount] * dp[rightCount];
    }
  }

  return dp[n];
}
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    /**
     * Calculate the number of structurally unique BSTs with n nodes.
     *
     * The solution uses dynamic programming where dp[i] represents
     * the number of unique BSTs that can be formed with i nodes.
     */
    public int numTrees(int n) {
        // dp[i] = number of unique BSTs with i nodes
        int[] dp = new int[n + 1];

        // Base case: empty tree counts as 1
        dp[0] = 1;

        // For each total number of nodes from 1 to n
        for (int totalNodes = 1; totalNodes <= n; totalNodes++) {
            // Try every node from 1 to totalNodes as the root
            for (int rootVal = 1; rootVal <= totalNodes; rootVal++) {
                // When root is 'rootVal', left subtree has (rootVal - 1) nodes
                int leftCount = rootVal - 1;
                // Right subtree has (totalNodes - rootVal) nodes
                int rightCount = totalNodes - rootVal;

                // Number of trees with this root = combinations of left × right
                dp[totalNodes] += dp[leftCount] * dp[rightCount];
            }
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have an outer loop from 1 to n: O(n)
- For each i, we have an inner loop from 1 to i: O(i)
- Total operations: Σ(i) from i=1 to n = n(n+1)/2 = O(n²)

**Space Complexity:** O(n)

- We only need the dp array of size n+1
- No recursion stack needed (iterative solution)

## Common Mistakes

1. **Forgetting the base case dp[0] = 1**: Many candidates think "empty tree doesn't count," but mathematically we need dp[0]=1 because when we multiply left and right subtree counts, if one side is empty, we still have valid trees.

2. **Incorrect index calculations**: When root value is j, left subtree has j-1 nodes (values 1 to j-1), not j nodes. Right subtree has n-j nodes (values j+1 to n), not n-j-1.

3. **Trying to actually build trees**: Some candidates start implementing tree construction algorithms, which is unnecessary and inefficient. The problem only asks for the count, not the actual trees.

4. **Confusing with permutation counting**: The number of unique BSTs is NOT n! (which would count different insertion orders of the same structure). The Catalan numbers grow much slower than factorial.

## When You'll See This Pattern

This Catalan number/dynamic programming pattern appears in problems where you need to count combinatorial structures that have a recursive "left/right" or "before/after" decomposition:

1. **Unique Binary Search Trees II** (LeetCode 95): The follow-up problem that asks you to actually generate all the unique BSTs instead of just counting them.

2. **Different Ways to Add Parentheses** (LeetCode 241): Count or generate all ways to parenthesize an expression, which follows the same Catalan number pattern.

3. **Generate Parentheses** (LeetCode 22): Although solved with backtracking, the number of valid parentheses combinations is also the nth Catalan number.

4. **Number of Ways to Partition a Polygon** (LeetCode similar): Triangulation of convex polygons also follows Catalan numbers.

## Key Takeaways

1. **When a counting problem has a recursive "choose root/divide" structure**, think about dynamic programming with Catalan numbers. The formula dp[n] = Σ(dp[i-1] × dp[n-i]) is a classic pattern.

2. **The values of nodes don't matter for counting structures** in BST problems—only the count matters. This is why we can use dynamic programming instead of actually building trees.

3. **Empty structures often count as 1** in combinatorial problems because they're valid inputs to multiplication in recurrence relations.

Related problems: [Unique Binary Search Trees II](/problem/unique-binary-search-trees-ii)
