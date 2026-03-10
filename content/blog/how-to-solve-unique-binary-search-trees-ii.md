---
title: "How to Solve Unique Binary Search Trees II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Binary Search Trees II. Medium difficulty, 62.0% acceptance rate. Topics: Dynamic Programming, Backtracking, Tree, Binary Search Tree, Binary Tree."
date: "2027-03-28"
category: "dsa-patterns"
tags: ["unique-binary-search-trees-ii", "dynamic-programming", "backtracking", "tree", "medium"]
---

# How to Solve Unique Binary Search Trees II

Given an integer `n`, we need to generate all possible structurally unique binary search trees (BSTs) that can be formed using values from 1 to `n`. This problem is interesting because it combines tree construction with combinatorial generation—we're not just counting the number of possible trees (as in the easier "Unique Binary Search Trees" problem), but actually building every possible tree structure.

## Visual Walkthrough

Let's trace through a small example with `n = 3` to build intuition. We need to generate all BSTs containing values [1, 2, 3].

**Step 1: Choose the root**
For any BST, the root determines how values are partitioned between left and right subtrees:

- If root = 1: Left subtree has values < 1 (empty), right subtree has values [2, 3]
- If root = 2: Left subtree has values < 2 ([1]), right subtree has values [3]
- If root = 3: Left subtree has values < 3 ([1, 2]), right subtree has values (empty)

**Step 2: Generate subtrees recursively**
For each root choice, we recursively generate all possible left and right subtrees:

- Root = 1: Left = [] (only empty tree), Right = all BSTs with values [2, 3]
  - For Right: Root can be 2 or 3
    - Root = 2: Left = [1], Right = [3] → Tree: 1 with right child 2 with right child 3
    - Root = 3: Left = [1, 2], Right = [] → Tree: 1 with right child 3 with left child 2
- Root = 2: Left = all BSTs with [1], Right = all BSTs with [3]
  - Left: Only one BST (single node 1)
  - Right: Only one BST (single node 3)
  - Combine: 2 with left child 1 and right child 3
- Root = 3: Left = all BSTs with [1, 2], Right = [] (only empty tree)
  - For Left: Root can be 1 or 2
    - Root = 1: Left = [], Right = [2] → Tree: 3 with left child 1 with right child 2
    - Root = 2: Left = [1], Right = [] → Tree: 3 with left child 2 with left child 1

**Result:** We get 5 unique BSTs, which matches the Catalan number C₃ = 5.

## Brute Force Approach

A naive approach would be to generate all permutations of [1..n], build a BST from each permutation, and filter out duplicates. However, this is extremely inefficient:

1. Generate all n! permutations of [1..n]
2. For each permutation, insert values in order to build a BST
3. Compare tree structures to remove duplicates

The problem with this approach:

- **Time complexity:** O(n! × n) for generating permutations and building trees
- **Space complexity:** O(n! × n) to store all permutations and trees
- **Duplicate checking:** Comparing tree structures is non-trivial and adds additional overhead

For n = 8, we'd have 40,320 permutations, and for n = 10, we'd have 3,628,800 permutations—completely impractical.

## Optimized Approach

The key insight is that **BST structure depends only on the number of nodes, not their specific values** (as long as they're in sorted order). For example, all BSTs with 3 nodes [1,2,3] have the same structures as BSTs with 3 nodes [4,5,6]—just with different values.

This leads to a recursive divide-and-conquer strategy:

1. For each value `i` from `start` to `end` (inclusive), consider it as the root
2. Recursively generate all possible left subtrees using values `[start, i-1]`
3. Recursively generate all possible right subtrees using values `[i+1, end]`
4. Combine each left subtree with each right subtree, attaching them to the root `i`

We can optimize this using memoization: since the structure depends only on the count of nodes, we can cache results for subproblems defined by `(start, end)` ranges.

## Optimal Solution

We'll implement a recursive solution with memoization. The base case is when `start > end`, which returns a list containing only `null` (representing an empty subtree).

<div class="code-group">

```python
# Time: O(n * G(n)) where G(n) is the nth Catalan number ≈ O(4^n / n^(3/2))
# Space: O(n * G(n)) for storing all trees
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def generateTrees(self, n: int) -> List[TreeNode]:
        # Memoization dictionary: (start, end) -> list of possible BST roots
        memo = {}

        def generate(start, end):
            # Base case: if start > end, return list with None (empty tree)
            if start > end:
                return [None]

            # Check if we've already computed this subproblem
            if (start, end) in memo:
                return memo[(start, end)]

            result = []
            # Try each value i as root
            for i in range(start, end + 1):
                # Generate all possible left subtrees with values [start, i-1]
                left_trees = generate(start, i - 1)
                # Generate all possible right subtrees with values [i+1, end]
                right_trees = generate(i + 1, end)

                # Combine each left subtree with each right subtree
                for left in left_trees:
                    for right in right_trees:
                        # Create root node with value i
                        root = TreeNode(i)
                        root.left = left
                        root.right = right
                        result.append(root)

            # Memoize the result for this (start, end) range
            memo[(start, end)] = result
            return result

        # Generate all trees for range [1, n]
        return generate(1, n) if n > 0 else []
```

```javascript
// Time: O(n * G(n)) where G(n) is the nth Catalan number ≈ O(4^n / n^(3/2))
// Space: O(n * G(n)) for storing all trees
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

var generateTrees = function (n) {
  // Memoization map: key = `${start}-${end}`, value = array of tree roots
  const memo = new Map();

  function generate(start, end) {
    // Base case: if start > end, return array with null (empty tree)
    if (start > end) {
      return [null];
    }

    // Check if we've already computed this subproblem
    const key = `${start}-${end}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    const result = [];
    // Try each value i as root
    for (let i = start; i <= end; i++) {
      // Generate all possible left subtrees with values [start, i-1]
      const leftTrees = generate(start, i - 1);
      // Generate all possible right subtrees with values [i+1, end]
      const rightTrees = generate(i + 1, end);

      // Combine each left subtree with each right subtree
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // Create root node with value i
          const root = new TreeNode(i);
          root.left = left;
          root.right = right;
          result.push(root);
        }
      }
    }

    // Memoize the result for this (start, end) range
    memo.set(key, result);
    return result;
  }

  // Generate all trees for range [1, n]
  return n > 0 ? generate(1, n) : [];
};
```

```java
// Time: O(n * G(n)) where G(n) is the nth Catalan number ≈ O(4^n / n^(3/2))
// Space: O(n * G(n)) for storing all trees
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    // Memoization map: key = start * (n+1) + end, value = list of tree roots
    private Map<String, List<TreeNode>> memo = new HashMap<>();

    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        return generate(1, n);
    }

    private List<TreeNode> generate(int start, int end) {
        List<TreeNode> result = new ArrayList<>();

        // Base case: if start > end, add null (empty tree)
        if (start > end) {
            result.add(null);
            return result;
        }

        // Check if we've already computed this subproblem
        String key = start + "-" + end;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        // Try each value i as root
        for (int i = start; i <= end; i++) {
            // Generate all possible left subtrees with values [start, i-1]
            List<TreeNode> leftTrees = generate(start, i - 1);
            // Generate all possible right subtrees with values [i+1, end]
            List<TreeNode> rightTrees = generate(i + 1, end);

            // Combine each left subtree with each right subtree
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    // Create root node with value i
                    TreeNode root = new TreeNode(i);
                    root.left = left;
                    root.right = right;
                    result.add(root);
                }
            }
        }

        // Memoize the result for this (start, end) range
        memo.put(key, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × G(n)), where G(n) is the nth Catalan number. The Catalan number G(n) counts the number of unique BSTs and grows as O(4ⁿ / n^(3/2)). For each tree structure, we spend O(n) time to construct it (creating n nodes). So the total time is O(n × 4ⁿ / n^(3/2)) = O(4ⁿ / √n).

**Space Complexity:** O(n × G(n)) for storing all the generated trees. Each tree has n nodes, and there are G(n) trees. The memoization cache also stores O(G(n)) entries, but this is dominated by the tree storage.

**Why memoization helps:** Without memoization, we'd have exponential recomputation. For example, when generating trees for [1..n], we'd generate trees for [2..n] multiple times. Memoization ensures each subproblem is solved only once.

## Common Mistakes

1. **Forgetting the base case for empty subtrees:** When `start > end`, we must return a list containing `null`, not an empty list. An empty list would cause the nested loops to skip creating any trees for that root value.

2. **Shallow copying tree nodes:** When combining left and right subtrees, you must create new root nodes. Reusing the same node object across multiple trees will create incorrect connections. Each tree must be independent.

3. **Incorrect range boundaries:** The recursive calls should use `[start, i-1]` for left subtrees and `[i+1, end]` for right subtrees. Using `[start, i]` and `[i, end]` would include the root value in both subtrees, violating BST properties.

4. **Not handling n = 0 case:** The problem states n is an integer, which could be 0. We should return an empty list in this case, not a list containing a null tree.

## When You'll See This Pattern

This "generate all structures" pattern appears in problems where you need to enumerate all possible combinatorial objects:

1. **"Different Ways to Add Parentheses" (LeetCode 241):** Similar recursive structure—for each operator, recursively compute all possible results for left and right subexpressions, then combine them.

2. **"All Possible Full Binary Trees" (LeetCode 894):** Generate all full binary trees with N nodes using similar divide-and-conquer approach.

3. **"Unique Binary Search Trees" (LeetCode 96):** The counting version of this problem—uses dynamic programming to count rather than generate trees.

The core pattern is: **For each possible "split point" or "root", recursively solve left and right subproblems, then combine results.**

## Key Takeaways

1. **BST generation is Catalan-number based:** The number of unique BSTs grows with the Catalan sequence. Recognizing this helps estimate the problem's scale.

2. **Divide-and-conquer with memoization:** When generating combinatorial structures, identify how to break the problem into independent subproblems that can be solved recursively and combined.

3. **Tree structure vs. node values:** In BST problems, structure often depends only on the count of nodes, not their specific values (when values are in sorted order). This insight simplifies the problem.

**Related problems:** [Unique Binary Search Trees](/problem/unique-binary-search-trees), [Different Ways to Add Parentheses](/problem/different-ways-to-add-parentheses)
