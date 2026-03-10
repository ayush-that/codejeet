---
title: "How to Solve Find Elements in a Contaminated Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Elements in a Contaminated Binary Tree. Medium difficulty, 84.1% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Design."
date: "2028-09-25"
category: "dsa-patterns"
tags:
  [
    "find-elements-in-a-contaminated-binary-tree",
    "hash-table",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Find Elements in a Contaminated Binary Tree

This problem presents a binary tree that was "contaminated" — all node values were set to -1, but we know the original structure and the rules that generated the original values. We need to design a class that can recover the original values and efficiently check if specific target values exist in the tree. The challenge lies in balancing the initialization cost with query performance — we need to answer queries in better than O(n) time.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have this tree structure:

```
     -1
    /   \
  -1     -1
  / \    / \
-1  -1 -1  -1
```

This is a complete binary tree with 7 nodes, all initially set to -1. According to the rules:

- Root gets value 0
- Left child gets 2 × parent + 1
- Right child gets 2 × parent + 2

Recovering the values step by step:

1. Root (level 0): value = 0
2. Left child of root: 2×0 + 1 = 1
3. Right child of root: 2×0 + 2 = 2
4. Left child of node 1: 2×1 + 1 = 3
5. Right child of node 1: 2×1 + 2 = 4
6. Left child of node 2: 2×2 + 1 = 5
7. Right child of node 2: 2×2 + 2 = 6

The recovered tree becomes:

```
     0
    /   \
   1     2
  / \   / \
 3   4 5   6
```

Now, if someone queries `find(4)`, we should return `true`. If they query `find(7)`, we should return `false`.

## Brute Force Approach

A naive approach would be to traverse the entire tree for every query. In the `FindElements` constructor, we could simply store the root reference. Then for each `find(target)` call, we would perform a DFS or BFS through the entire tree, checking if any node has the target value.

The problem with this approach is performance: each query would take O(n) time where n is the number of nodes. If we have k queries, the total time becomes O(k × n), which is unacceptable for large trees or many queries.

Even worse, we're not leveraging the predictable pattern in node values. The values follow a specific mathematical relationship based on parent-child positions, which we can use to optimize.

## Optimized Approach

The key insight is that the tree values form a complete binary tree numbering starting from 0. This is exactly how array representations of binary heaps work! Each node's value determines its position in this implicit structure.

Here's the step-by-step reasoning:

1. **Recovery Phase**: During initialization, we traverse the tree once and recover all values using the given formulas:
   - Left child value = 2 × parent + 1
   - Right child value = 2 × parent + 2
     We start with root = 0 and propagate downward.

2. **Storage Strategy**: We need to store the recovered values in a way that allows O(1) lookup. A hash set is perfect for this — we can add each recovered value to a set during the recovery traversal.

3. **Query Phase**: For each `find(target)` call, we simply check if the target exists in our hash set, giving us O(1) average time complexity.

4. **Alternative Approach**: Instead of storing all values, we could use the tree structure to navigate to where the target value _should_ be if it exists. Given a target value, we can determine the path from root to where that node would be by examining the binary representation of (target + 1). However, the hash set approach is simpler and more intuitive for most interview settings.

## Optimal Solution

The optimal solution performs a single traversal to recover all values, stores them in a hash set, and provides O(1) queries. Here's the implementation:

<div class="code-group">

```python
# Time: O(n) for initialization, O(1) for find | Space: O(n)
class FindElements:
    def __init__(self, root: Optional[TreeNode]):
        """
        Initialize the object with the contaminated binary tree.
        We'll recover all values and store them in a set for O(1) lookup.
        """
        self.recovered_values = set()  # Store all recovered values
        self._recover_tree(root, 0)    # Start recovery from root with value 0

    def _recover_tree(self, node: Optional[TreeNode], value: int) -> None:
        """
        Helper function to traverse the tree and recover values recursively.
        node: current tree node
        value: the recovered value for this node
        """
        if not node:
            return

        # Recover current node's value
        node.val = value
        self.recovered_values.add(value)

        # Recursively recover left and right children
        # Left child: 2*x + 1, Right child: 2*x + 2
        self._recover_tree(node.left, 2 * value + 1)
        self._recover_tree(node.right, 2 * value + 2)

    def find(self, target: int) -> bool:
        """
        Check if target value exists in the recovered tree.
        O(1) average time complexity due to hash set lookup.
        """
        return target in self.recovered_values
```

```javascript
// Time: O(n) for initialization, O(1) for find | Space: O(n)
class FindElements {
  /**
   * Initialize the object with the contaminated binary tree.
   * @param {TreeNode} root - The contaminated binary tree root
   */
  constructor(root) {
    this.recoveredValues = new Set(); // Store all recovered values
    this._recoverTree(root, 0); // Start recovery from root with value 0
  }

  /**
   * Helper function to traverse the tree and recover values recursively.
   * @param {TreeNode} node - current tree node
   * @param {number} value - the recovered value for this node
   */
  _recoverTree(node, value) {
    if (!node) return;

    // Recover current node's value
    node.val = value;
    this.recoveredValues.add(value);

    // Recursively recover left and right children
    // Left child: 2*x + 1, Right child: 2*x + 2
    this._recoverTree(node.left, 2 * value + 1);
    this._recoverTree(node.right, 2 * value + 2);
  }

  /**
   * Check if target value exists in the recovered tree.
   * @param {number} target - value to search for
   * @return {boolean} true if target exists, false otherwise
   */
  find(target) {
    return this.recoveredValues.has(target);
  }
}
```

```java
// Time: O(n) for initialization, O(1) for find | Space: O(n)
class FindElements {
    private Set<Integer> recoveredValues;  // Store all recovered values

    /**
     * Initialize the object with the contaminated binary tree.
     * @param root - The contaminated binary tree root
     */
    public FindElements(TreeNode root) {
        recoveredValues = new HashSet<>();
        recoverTree(root, 0);  // Start recovery from root with value 0
    }

    /**
     * Helper function to traverse the tree and recover values recursively.
     * @param node - current tree node
     * @param value - the recovered value for this node
     */
    private void recoverTree(TreeNode node, int value) {
        if (node == null) return;

        // Recover current node's value
        node.val = value;
        recoveredValues.add(value);

        // Recursively recover left and right children
        // Left child: 2*x + 1, Right child: 2*x + 2
        recoverTree(node.left, 2 * value + 1);
        recoverTree(node.right, 2 * value + 2);
    }

    /**
     * Check if target value exists in the recovered tree.
     * @param target - value to search for
     * @return true if target exists, false otherwise
     */
    public boolean find(int target) {
        return recoveredValues.contains(target);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization (`__init__`/`constructor`):** O(n) where n is the number of nodes in the tree. We perform a single DFS/BFS traversal to recover all values.
- **Query (`find`):** O(1) average case. Hash set lookups have constant time complexity on average.

**Space Complexity:**

- **Overall:** O(n) where n is the number of nodes. This comes from:
  1. The hash set storing all recovered values: O(n)
  2. The recursion stack (implicit in DFS): O(h) where h is the tree height, but this is dominated by the hash set storage.
  3. In the worst case (skewed tree), the recursion stack could be O(n), but the hash set already gives us O(n) space.

## Common Mistakes

1. **Forgetting to actually recover the node values:** Some candidates only store values in the hash set without updating `node.val`. While this might pass automated tests, it violates the problem's intent and could fail in interviews where the interviewer checks the tree state.

2. **Using BFS without considering space:** While BFS works for recovery, it requires a queue that can grow to O(n) in the worst case (last level of a complete tree). DFS recursion is more elegant here, but be prepared to discuss both.

3. **Not handling the empty tree case:** If `root` is `null`, the recovery function should handle this gracefully. Our base case `if not node: return` handles this correctly.

4. **Trying to optimize prematurely with the binary path approach:** Some candidates try to implement the "follow the binary path" approach without fully understanding it. This approach works by:
   - Adding 1 to the target (since root is 0)
   - Converting to binary and ignoring the first '1'
   - Following the path where '0' means left, '1' means right
     While this uses O(h) time per query and O(1) space, it's more complex and error-prone. The hash set approach is usually preferred in interviews for its simplicity.

## When You'll See This Pattern

This problem combines tree traversal with efficient lookup, a common pattern in coding interviews:

1. **Two Sum IV - Input is a BST (LeetCode 653):** Similar concept of storing values during traversal for O(1) lookup, though here you're checking complements rather than exact matches.

2. **Find Mode in Binary Search Tree (LeetCode 501):** Uses hash maps to count frequencies during tree traversal, similar to how we collect values here.

3. **Most Frequent Subtree Sum (LeetCode 508):** Another example of computing values during tree traversal and storing them for efficient analysis.

The core pattern is: **"Traverse once, store computed information, answer queries efficiently."** This is fundamental to many tree problems where you need to answer multiple queries about tree properties.

## Key Takeaways

1. **Precomputation is powerful:** When you have many queries, it's often optimal to spend O(n) time once to build a lookup structure, then answer each query in O(1) time. This gives O(n + k) total time instead of O(k × n).

2. **Hash sets provide O(1) membership testing:** Whenever you need to check if values exist in a collection, consider using a hash set. The tradeoff is O(n) space, but this is often acceptable.

3. **Tree recovery follows predictable patterns:** Many tree problems involve computing node values based on parent values. The recursive "pass information downward" pattern is fundamental to solving these problems.

[Practice this problem on CodeJeet](/problem/find-elements-in-a-contaminated-binary-tree)
