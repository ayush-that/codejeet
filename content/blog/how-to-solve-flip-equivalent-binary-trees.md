---
title: "How to Solve Flip Equivalent Binary Trees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flip Equivalent Binary Trees. Medium difficulty, 69.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-03-27"
category: "dsa-patterns"
tags: ["flip-equivalent-binary-trees", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Flip Equivalent Binary Trees

This problem asks us to determine whether two binary trees are "flip equivalent" — meaning we can transform one into the other by repeatedly swapping left and right subtrees at any nodes. What makes this interesting is that it's not just about checking if trees are identical, but whether they're identical _under a flexible transformation_ that preserves structure but can mirror subtrees. The challenge lies in designing an algorithm that efficiently explores both possibilities (flipped or not flipped) at each node.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these two trees:

```
Tree 1:       1           Tree 2:       1
             / \                       / \
            2   3                     3   2
           / \                           / \
          4   5                         5   4
```

**Step 1:** Compare roots. Both are 1 → match.

**Step 2:** Check children of node 1. In Tree 1, left child is 2, right child is 3. In Tree 2, left child is 3, right child is 2. They don't match directly, but maybe Tree 2 is flipped at the root.

**Step 3:** Try both possibilities:

- **No flip:** Compare Tree 1's left (2) with Tree 2's left (3) → values don't match.
- **With flip:** Compare Tree 1's left (2) with Tree 2's right (2) → values match! And Tree 1's right (3) with Tree 2's left (3) → values match!

**Step 4:** Now compare subtrees recursively. For node 2:

- In Tree 1: left child is 4, right child is 5
- In Tree 2 (after accounting for root flip): node 2 is now in right position, with left child 5, right child 4
- Values don't match directly, so try flipping again

**Step 5:** For node 2's children:

- **No flip:** Compare Tree 1's left (4) with Tree 2's left (5) → no match
- **With flip:** Compare Tree 1's left (4) with Tree 2's right (4) → match! And Tree 1's right (5) with Tree 2's left (5) → match!

**Step 6:** All nodes match with appropriate flips → trees are flip equivalent.

The key insight: at each node, we need to check both the "no flip" scenario (left-left and right-right comparisons) AND the "flip" scenario (left-right and right-left comparisons).

## Brute Force Approach

A naive approach might try to generate all possible flipped versions of one tree and check if any match the other. For a tree with n nodes, there are 2^n possible flip configurations (each node can be flipped or not). Generating and comparing all these would take O(2^n \* n) time — exponential and completely impractical.

Another brute force idea: try to match the trees by checking all possible pairings of nodes. But without a systematic way to explore the flip possibilities, this becomes messy and inefficient.

The problem with brute force is it doesn't leverage the recursive structure of the problem. We need an approach that makes local decisions at each node without exploring the entire exponential search space.

## Optimized Approach

The optimal solution uses **recursive DFS with early pruning**. Here's the step-by-step reasoning:

1. **Base cases:**
   - If both nodes are null → they're equivalent (empty trees are flip equivalent)
   - If one is null and the other isn't → not equivalent
   - If values differ → not equivalent

2. **Recursive case:** Both nodes exist and have the same value. Now we need to check if their subtrees are flip equivalent. There are two possibilities:
   - **No flip at current node:** Check if left subtree of tree1 matches left subtree of tree2 AND right subtree of tree1 matches right subtree of tree2
   - **Flip at current node:** Check if left subtree of tree1 matches right subtree of tree2 AND right subtree of tree1 matches left subtree of tree2

3. **Key optimization:** We don't need to explore both possibilities fully if one works. We can use logical OR to short-circuit: if the "no flip" case works, we're done; otherwise try the "flip" case.

4. **Why this works:** The flip operation is commutative and associative — flipping at a node and then flipping its children is equivalent to flipping the children first. This means we can make local decisions at each node without worrying about global consistency.

The algorithm naturally handles all cases in O(n) time where n is the number of nodes, since we visit each node exactly once in the worst case.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is min(number of nodes in both trees)
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def flipEquiv(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
        # Base case 1: Both nodes are None -> they're equivalent
        if not root1 and not root2:
            return True

        # Base case 2: One is None, the other isn't -> not equivalent
        if not root1 or not root2:
            return False

        # Base case 3: Values differ -> not equivalent
        if root1.val != root2.val:
            return False

        # Recursive case: Check both flip possibilities
        # Option 1: No flip - compare left with left and right with right
        no_flip = (self.flipEquiv(root1.left, root2.left) and
                   self.flipEquiv(root1.right, root2.right))

        # Option 2: Flip - compare left with right and right with left
        with_flip = (self.flipEquiv(root1.left, root2.right) and
                     self.flipEquiv(root1.right, root2.left))

        # Trees are equivalent if either option works
        return no_flip or with_flip
```

```javascript
// Time: O(n) where n is min(number of nodes in both trees)
// Space: O(h) where h is the height of the tree (recursion stack)
function flipEquiv(root1, root2) {
  // Base case 1: Both nodes are null -> they're equivalent
  if (root1 === null && root2 === null) {
    return true;
  }

  // Base case 2: One is null, the other isn't -> not equivalent
  if (root1 === null || root2 === null) {
    return false;
  }

  // Base case 3: Values differ -> not equivalent
  if (root1.val !== root2.val) {
    return false;
  }

  // Recursive case: Check both flip possibilities
  // Option 1: No flip - compare left with left and right with right
  const noFlip = flipEquiv(root1.left, root2.left) && flipEquiv(root1.right, root2.right);

  // Option 2: Flip - compare left with right and right with left
  const withFlip = flipEquiv(root1.left, root2.right) && flipEquiv(root1.right, root2.left);

  // Trees are equivalent if either option works
  return noFlip || withFlip;
}
```

```java
// Time: O(n) where n is min(number of nodes in both trees)
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public boolean flipEquiv(TreeNode root1, TreeNode root2) {
        // Base case 1: Both nodes are null -> they're equivalent
        if (root1 == null && root2 == null) {
            return true;
        }

        // Base case 2: One is null, the other isn't -> not equivalent
        if (root1 == null || root2 == null) {
            return false;
        }

        // Base case 3: Values differ -> not equivalent
        if (root1.val != root2.val) {
            return false;
        }

        // Recursive case: Check both flip possibilities
        // Option 1: No flip - compare left with left and right with right
        boolean noFlip = flipEquiv(root1.left, root2.left) &&
                         flipEquiv(root1.right, root2.right);

        // Option 2: Flip - compare left with right and right with left
        boolean withFlip = flipEquiv(root1.left, root2.right) &&
                           flipEquiv(root1.right, root2.left);

        // Trees are equivalent if either option works
        return noFlip || withFlip;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the minimum number of nodes between the two trees. In the worst case, we visit every node in both trees exactly once. Even though we make up to 4 recursive calls at each node (2 for no-flip case, 2 for flip case), the short-circuit evaluation with logical AND means we don't always explore all branches. Each node pair is compared at most once.

**Space Complexity:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), h = n, giving O(n) space. In the best case (balanced tree), h = log n.

## Common Mistakes

1. **Forgetting to check values before recursing:** Some candidates jump straight to comparing children without verifying the current nodes have the same value. This would incorrectly return true for trees with different root values but matching structure.

2. **Not handling null cases properly:** Failing to check if one node is null while the other isn't leads to null pointer exceptions or incorrect results. Always check both null cases first.

3. **Overcomplicating with tree transformations:** Some candidates try to actually flip the trees or build new structures. This is unnecessary and inefficient. The recursive comparison approach is cleaner and more efficient.

4. **Missing the short-circuit optimization:** Writing separate if-statements for both cases instead of using logical OR can lead to redundant computations. The `return noFlip || withFlip` pattern is optimal.

## When You'll See This Pattern

This "two-possibility recursion" pattern appears in several tree comparison problems:

1. **Symmetric Tree (LeetCode 101)** - Check if a tree is symmetric around its center. The solution compares left.left with right.right AND left.right with right.left, similar to our flip check.

2. **Same Tree (LeetCode 100)** - Simpler version without flips, just direct comparison of left-left and right-right.

3. **Subtree of Another Tree (LeetCode 572)** - Uses tree comparison as a subroutine, checking if one tree matches any subtree of another.

The core pattern is: when comparing hierarchical structures, define clear base cases, then recursively compare substructures, considering any symmetries or transformations allowed by the problem.

## Key Takeaways

1. **Recursive tree comparison follows a template:** Check null cases → check values → recursively compare children. Variations come from how children are paired (left-left/right-right vs left-right/right-left).

2. **Consider symmetries locally:** When a problem allows transformations (like flipping), check all valid pairings at each node rather than trying to track global transformations.

3. **Short-circuit evaluation is your friend:** Use `&&` and `||` operators to avoid unnecessary recursive calls when the answer is already determined.

[Practice this problem on CodeJeet](/problem/flip-equivalent-binary-trees)
