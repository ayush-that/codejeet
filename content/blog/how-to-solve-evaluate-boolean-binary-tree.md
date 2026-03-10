---
title: "How to Solve Evaluate Boolean Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Evaluate Boolean Binary Tree. Easy difficulty, 82.4% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-07-16"
category: "dsa-patterns"
tags: ["evaluate-boolean-binary-tree", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Evaluate Boolean Binary Tree

You're given a full binary tree where leaf nodes represent boolean values (0=False, 1=True) and internal nodes represent boolean operations (2=OR, 3=AND). Your task is to evaluate the entire tree to a single boolean value. What makes this problem interesting is that it's essentially implementing a boolean expression evaluator in tree form, which tests your understanding of tree traversal and recursion.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this tree:

```
         OR (2)
        /      \
     AND (3)   True (1)
    /      \
False (0)  True (1)
```

Step-by-step evaluation:

1. Start at the root (OR node, value 2)
2. To evaluate OR, we need both children's values
3. Evaluate left child (AND node, value 3)
   - To evaluate AND, we need both children's values
   - Evaluate left-left child (False, value 0) → returns False
   - Evaluate left-right child (True, value 1) → returns True
   - AND(False, True) = False
4. Evaluate right child (True, value 1) → returns True
5. OR(False, True) = True

Final result: True

The key insight: we need to traverse to the leaves first (post-order traversal) to get the boolean values, then combine them using the operations as we return back up the tree.

## Brute Force Approach

For this problem, there's really only one reasonable approach: recursive depth-first traversal. However, let's consider what a "brute force" might look like if someone didn't recognize the recursive nature:

A naive approach might try to evaluate the tree level by level from bottom to top, but this would require:

1. Finding the height of the tree
2. Processing each level separately
3. Maintaining complex data structures to track parent-child relationships

This approach would be unnecessarily complex (O(n²) time) and require extra space for tracking nodes by level. More importantly, it misses the elegant recursive solution that naturally follows the tree structure.

The recursive solution isn't actually "brute force" here—it's optimal. The "brute force" thinking would be trying to avoid recursion when recursion is the most natural fit for tree problems.

## Optimal Solution

The optimal solution uses depth-first search (DFS) with recursion. We traverse to the leaves, get their boolean values, and combine them using the specified operations as we return back up the call stack.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is height of the tree (recursion stack)
def evaluateTree(root):
    """
    Evaluates a boolean binary tree recursively.

    Args:
        root: TreeNode with val (0=False, 1=True, 2=OR, 3=AND)

    Returns:
        Boolean result of evaluating the entire tree
    """
    # Base case: leaf node (0 or 1)
    # If value is 0, return False; if 1, return True
    if root.val == 0:
        return False
    if root.val == 1:
        return True

    # Recursive case: internal node (2=OR, 3=AND)
    # Evaluate left and right subtrees first
    left_val = evaluateTree(root.left)
    right_val = evaluateTree(root.right)

    # Apply the boolean operation based on node value
    if root.val == 2:  # OR operation
        return left_val or right_val
    else:  # root.val == 3, AND operation
        return left_val and right_val
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
function evaluateTree(root) {
  /**
   * Evaluates a boolean binary tree recursively.
   *
   * @param {TreeNode} root - Tree node with val (0=False, 1=True, 2=OR, 3=AND)
   * @return {boolean} Boolean result of evaluating the entire tree
   */

  // Base case: leaf node (0 or 1)
  // If value is 0, return false; if 1, return true
  if (root.val === 0) return false;
  if (root.val === 1) return true;

  // Recursive case: internal node (2=OR, 3=AND)
  // Evaluate left and right subtrees first
  const leftVal = evaluateTree(root.left);
  const rightVal = evaluateTree(root.right);

  // Apply the boolean operation based on node value
  if (root.val === 2) {
    // OR operation
    return leftVal || rightVal;
  } else {
    // root.val === 3, AND operation
    return leftVal && rightVal;
  }
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
public boolean evaluateTree(TreeNode root) {
    /**
     * Evaluates a boolean binary tree recursively.
     *
     * @param root Tree node with val (0=False, 1=True, 2=OR, 3=AND)
     * @return Boolean result of evaluating the entire tree
     */

    // Base case: leaf node (0 or 1)
    // If value is 0, return false; if 1, return true
    if (root.val == 0) return false;
    if (root.val == 1) return true;

    // Recursive case: internal node (2=OR, 3=AND)
    // Evaluate left and right subtrees first
    boolean leftVal = evaluateTree(root.left);
    boolean rightVal = evaluateTree(root.right);

    // Apply the boolean operation based on node value
    if (root.val == 2) {  // OR operation
        return leftVal || rightVal;
    } else {  // root.val == 3, AND operation
        return leftVal && rightVal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once
- For each node, we perform constant-time operations (comparisons and boolean operations)
- Even though we have recursion, the total work is proportional to the number of nodes

**Space Complexity: O(h)** where h is the height of the tree

- The recursion stack depth equals the height of the tree
- In the worst case (a skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The problem states it's a full binary tree, but not necessarily balanced

## Common Mistakes

1. **Not handling the base cases correctly**: Some candidates try to check if a node is a leaf by checking if both children are null. While this works, it's more complex than checking the node value directly (0 or 1 means leaf in this problem). The simpler approach is what we used: check if val is 0 or 1.

2. **Forgetting that this is a full binary tree**: The problem guarantees it's a full binary tree, which means every node has either 0 or 2 children. Some candidates add unnecessary null checks for internal nodes. While defensive programming is good, understanding the problem constraints helps write cleaner code.

3. **Mixing up OR and AND operations**: It's easy to accidentally swap the operations (thinking 2 means AND instead of OR). Always double-check: 2 looks like "OR" (two letters), 3 looks like "AND" (three letters) is a common mnemonic.

4. **Not using short-circuit evaluation**: In languages that support it (like Python, JavaScript, and Java), `or`/`||` and `and`/`&&` use short-circuit evaluation. This can be more efficient but doesn't change the asymptotic complexity. The important thing is to evaluate both children before applying the operation at internal nodes.

## When You'll See This Pattern

This pattern of evaluating expression trees appears in several contexts:

1. **Mathematical expression evaluation**: Problems like [Design an Expression Tree With Evaluate Function](/problem/design-an-expression-tree-with-evaluate-function) use the same recursive evaluation pattern but with arithmetic operators (+, -, \*, /) instead of boolean operators.

2. **Syntax tree evaluation**: Compilers and interpreters use similar techniques to evaluate abstract syntax trees (ASTs). The pattern is: leaves are values/operands, internal nodes are operations.

3. **Decision tree evaluation**: In machine learning or game AI, decision trees are evaluated similarly - traverse to leaves based on conditions at internal nodes.

4. **Related LeetCode problems**:
   - [Check If Two Expression Trees are Equivalent](/problem/check-if-two-expression-trees-are-equivalent): Uses similar tree traversal to compare expression trees
   - [Minimum Flips in Binary Tree to Get Result](/problem/minimum-flips-in-binary-tree-to-get-result): Builds on this concept by finding minimum changes needed to get a desired result

## Key Takeaways

1. **Tree evaluation naturally uses post-order traversal**: For expression trees, you typically need to evaluate children before parents (post-order: left, right, root). This pattern appears whenever you need to compute something bottom-up in a tree.

2. **Recursion is the most natural fit for tree problems**: While iterative solutions exist using stacks, recursion mirrors the tree structure directly and is usually cleaner for tree traversal problems.

3. **Understand the problem constraints**: Knowing this is a full binary tree simplifies null checking. Always read problem constraints carefully—they're hints about what edge cases you don't need to handle.

4. **Base cases first**: When designing recursive solutions, always identify the base cases (leaves in this problem) before handling the recursive cases. This makes the logic clearer and prevents infinite recursion.

Related problems: [Check If Two Expression Trees are Equivalent](/problem/check-if-two-expression-trees-are-equivalent), [Design an Expression Tree With Evaluate Function](/problem/design-an-expression-tree-with-evaluate-function), [Minimum Flips in Binary Tree to Get Result](/problem/minimum-flips-in-binary-tree-to-get-result)
