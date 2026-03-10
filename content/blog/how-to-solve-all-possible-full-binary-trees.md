---
title: "How to Solve All Possible Full Binary Trees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Possible Full Binary Trees. Medium difficulty, 82.7% acceptance rate. Topics: Dynamic Programming, Tree, Recursion, Memoization, Binary Tree."
date: "2028-08-22"
category: "dsa-patterns"
tags: ["all-possible-full-binary-trees", "dynamic-programming", "tree", "recursion", "medium"]
---

# How to Solve All Possible Full Binary Trees

This problem asks us to generate all structurally distinct full binary trees with exactly `n` nodes, where each node's value is 0. A full binary tree is a tree where every node has either 0 or 2 children. The challenge is that we need to generate **all possible tree structures**, not just count them, which requires careful combinatorial construction.

What makes this problem interesting: We can't just randomly assign nodes - the "full binary tree" constraint (0 or 2 children per node) creates a specific combinatorial pattern. Also, `n` must be odd since a full binary tree with `n` nodes always has an odd number of nodes (you can prove this by induction).

## Visual Walkthrough

Let's trace through `n = 5` to build intuition:

1. **Base understanding**: With 5 nodes, we need a root node (1 node), which leaves 4 nodes to distribute between left and right subtrees.
2. **Key constraint**: Both left and right subtrees must also be full binary trees, and their node counts must sum to 4 (since root uses 1).
3. **Valid distributions**: For two full binary trees to sum to 4 nodes, both must have odd numbers. The possible pairs are (1, 3) and (3, 1).
   - (1, 3): Left subtree has 1 node (just a leaf), right subtree has 3 nodes
   - (3, 1): Left subtree has 3 nodes, right subtree has 1 node (just a leaf)
4. **Recursive construction**:
   - For (1, 3): The 1-node tree is just a single node. The 3-node tree can only be a root with two leaves.
   - For (3, 1): Mirror of above.
5. **Result**: We get 2 distinct tree structures for `n = 5`.

For `n = 7`, we'd have distributions: (1, 5), (3, 3), and (5, 1). Each of these requires recursively generating all possible trees for those sizes and combining them.

## Brute Force Approach

A naive approach would try to generate all possible binary trees with `n` nodes and filter out those that aren't full binary trees. However, this is astronomically inefficient:

1. Generate all possible binary tree structures with `n` nodes (Catalan number Cₙ possibilities)
2. For each structure, check if it's a full binary tree (every node has 0 or 2 children)
3. Return the valid ones

The problem? Even for moderate `n`, the number of binary trees grows exponentially (Catalan numbers). For `n = 15`, there are already 9,694,845 possible binary trees. Checking each one would be far too slow.

Even a slightly better brute force would try recursive construction but without memoization, leading to massive recomputation. For example, when generating trees for `n = 7`, we'd generate trees for `n = 3` multiple times across different recursive branches.

## Optimized Approach

The key insight is **dynamic programming with memoization**:

1. **Mathematical insight**: A full binary tree must have an odd number of nodes. If `n` is even, return empty list immediately.
2. **Recursive decomposition**: Any full binary tree with `n` nodes consists of:
   - A root node
   - A left subtree with `i` nodes (where `i` is odd and `1 ≤ i < n`)
   - A right subtree with `n-1-i` nodes (which must also be odd)
3. **Base case**: When `n = 1`, the only possible tree is a single node.
4. **Memoization**: Store computed results for each `n` to avoid recomputation. When we need all trees for size `k`, check if we've already computed it.
5. **Construction**: For each valid `(i, n-1-i)` pair, combine all left subtrees with all right subtrees to form new trees.

This approach works because the problem has **optimal substructure** (solutions to larger problems can be constructed from solutions to smaller problems) and **overlapping subproblems** (we solve the same subproblems multiple times).

## Optimal Solution

Here's the complete solution using memoization:

<div class="code-group">

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def allPossibleFBT(self, n: int) -> List[TreeNode]:
        # Time: O(2^n) in theory, but memoization makes it feasible for n ≤ 20
        # Space: O(2^n) for storing all possible trees

        # Memoization dictionary: n -> list of all possible FBTs with n nodes
        memo = {}

        def generate_trees(k):
            """Return all possible full binary trees with k nodes."""
            # Base case: if k is even, no full binary trees possible
            if k % 2 == 0:
                return []

            # Base case: single node tree
            if k == 1:
                return [TreeNode(0)]

            # Check if we've already computed this
            if k in memo:
                return memo[k]

            result = []
            # Try all possible distributions of nodes between left and right subtrees
            # i represents number of nodes in left subtree (must be odd)
            for i in range(1, k, 2):
                # Left subtree gets i nodes, right subtree gets k-1-i nodes
                # (subtract 1 for the root node)
                left_trees = generate_trees(i)
                right_trees = generate_trees(k - 1 - i)

                # Combine every left tree with every right tree
                for left in left_trees:
                    for right in right_trees:
                        # Create new tree with current left and right subtrees
                        root = TreeNode(0)
                        root.left = left
                        root.right = right
                        result.append(root)

            # Memoize the result before returning
            memo[k] = result
            return result

        return generate_trees(n)
```

```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {number} n
 * @return {TreeNode[]}
 */
var allPossibleFBT = function (n) {
  // Time: O(2^n) in theory, but memoization makes it feasible for n ≤ 20
  // Space: O(2^n) for storing all possible trees

  // Memoization map: n -> array of all possible FBTs with n nodes
  const memo = new Map();

  function generateTrees(k) {
    // Base case: if k is even, no full binary trees possible
    if (k % 2 === 0) {
      return [];
    }

    // Base case: single node tree
    if (k === 1) {
      return [new TreeNode(0)];
    }

    // Check if we've already computed this
    if (memo.has(k)) {
      return memo.get(k);
    }

    const result = [];
    // Try all possible distributions of nodes between left and right subtrees
    // i represents number of nodes in left subtree (must be odd)
    for (let i = 1; i < k; i += 2) {
      // Left subtree gets i nodes, right subtree gets k-1-i nodes
      // (subtract 1 for the root node)
      const leftTrees = generateTrees(i);
      const rightTrees = generateTrees(k - 1 - i);

      // Combine every left tree with every right tree
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // Create new tree with current left and right subtrees
          const root = new TreeNode(0);
          root.left = left;
          root.right = right;
          result.push(root);
        }
      }
    }

    // Memoize the result before returning
    memo.set(k, result);
    return result;
  }

  return generateTrees(n);
};
```

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    // Memoization map: n -> list of all possible FBTs with n nodes
    Map<Integer, List<TreeNode>> memo = new HashMap<>();

    public List<TreeNode> allPossibleFBT(int n) {
        // Time: O(2^n) in theory, but memoization makes it feasible for n ≤ 20
        // Space: O(2^n) for storing all possible trees

        // Base case: if n is even, no full binary trees possible
        if (n % 2 == 0) {
            return new ArrayList<>();
        }

        // Check if we've already computed this
        if (memo.containsKey(n)) {
            return memo.get(n);
        }

        List<TreeNode> result = new ArrayList<>();

        // Base case: single node tree
        if (n == 1) {
            result.add(new TreeNode(0));
            memo.put(1, result);
            return result;
        }

        // Try all possible distributions of nodes between left and right subtrees
        // i represents number of nodes in left subtree (must be odd)
        for (int i = 1; i < n; i += 2) {
            // Left subtree gets i nodes, right subtree gets n-1-i nodes
            // (subtract 1 for the root node)
            List<TreeNode> leftTrees = allPossibleFBT(i);
            List<TreeNode> rightTrees = allPossibleFBT(n - 1 - i);

            // Combine every left tree with every right tree
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    // Create new tree with current left and right subtrees
                    TreeNode root = new TreeNode(0);
                    root.left = left;
                    root.right = right;
                    result.add(root);
                }
            }
        }

        // Memoize the result before returning
        memo.put(n, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: The theoretical upper bound is O(2ⁿ) since we're generating all possible trees, but memoization significantly reduces the actual work. For each odd `n`, we try all odd `i` from 1 to `n-2`, and for each pair `(i, n-1-i)`, we combine all trees of those sizes. The number of full binary trees with `n` nodes is the Catalan number for `(n-1)/2`, which grows exponentially.

**Space Complexity**: O(2ⁿ) to store all possible trees in memory. We also use O(n) space for the recursion stack and memoization dictionary.

**Why these complexities?**: We're literally generating every possible tree structure, and the number of such structures grows exponentially with `n`. The memoization doesn't reduce the number of trees we need to store, but it prevents us from recomputing the same subtrees multiple times.

## Common Mistakes

1. **Forgetting that n must be odd**: The most common mistake is not handling the even `n` case immediately. A full binary tree always has an odd number of nodes, so if `n` is even, return an empty list right away.

2. **Not using memoization**: Without memoization, the solution becomes exponentially slower due to repeated computation of the same subtree sizes. For example, when computing trees for `n = 7`, you'd compute trees for `n = 3` multiple times.

3. **Incorrect node distribution**: Some candidates try distributions where both left and right subtrees have even numbers of nodes. Remember: both subtrees must be full binary trees, so they need odd numbers of nodes.

4. **Shallow copying vs deep copying**: When combining trees, you must create new root nodes. If you reuse the same subtree objects in multiple trees, you'll create incorrect structures where modifying one tree affects others.

## When You'll See This Pattern

This **recursive decomposition with memoization** pattern appears in many combinatorial generation problems:

1. **Generate Parentheses (LeetCode 22)**: Similar recursive construction where you build valid strings from smaller valid strings, with memoization to avoid recomputation.

2. **Unique Binary Search Trees II (LeetCode 95)**: Almost identical structure - generate all BSTs with values 1...n by trying all possible roots and combining left and right subtrees.

3. **Different Ways to Add Parentheses (LeetCode 241)**: Break expression at each operator, recursively compute results for left and right parts, then combine.

The common thread: problems asking for **all possible structures** (not just counts) that can be built by combining solutions to smaller instances of the same problem.

## Key Takeaways

1. **Recursive decomposition is powerful for generation problems**: When asked to generate "all possible" structures, look for ways to build larger solutions from smaller ones of the same type.

2. **Memoization is essential for efficiency**: If you're solving the same subproblems repeatedly (which happens in tree/graph generation problems), store results to avoid exponential blowup.

3. **Understand the mathematical constraints**: Recognizing that full binary trees require odd `n` and that subtrees must also be full binary trees with odd node counts is key to the correct recursive breakdown.

[Practice this problem on CodeJeet](/problem/all-possible-full-binary-trees)
