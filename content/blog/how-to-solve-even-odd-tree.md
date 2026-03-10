---
title: "How to Solve Even Odd Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Even Odd Tree. Medium difficulty, 67.0% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2026-02-18"
category: "dsa-patterns"
tags: ["even-odd-tree", "tree", "breadth-first-search", "binary-tree", "medium"]
---

# How to Solve Even Odd Tree

This problem asks us to validate whether a binary tree follows specific parity rules: nodes at even levels must contain odd integers in strictly increasing order, while nodes at odd levels must contain even integers in strictly decreasing order. What makes this problem interesting is that we need to track both level parity and maintain ordering constraints within each level, which requires careful traversal and validation logic.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        1
       / \
      10  4
     /    / \
    3    7   9
```

**Level 0 (even):** Contains only node 1. Even levels require odd values, and 1 is odd ✓. Since there's only one node, ordering is trivially satisfied.

**Level 1 (odd):** Contains nodes 10 and 4. Odd levels require even values: 10 is even ✓, 4 is even ✓. They must be in strictly decreasing order: 10 > 4 ✓.

**Level 2 (even):** Contains nodes 3, 7, and 9. Even levels require odd values: 3, 7, and 9 are all odd ✓. They must be in strictly increasing order: 3 < 7 < 9 ✓.

Since all conditions are satisfied, this is a valid Even-Odd Tree.

Now let's see a failing example:

```
        5
       / \
      4   2
     / \   \
    3   3   7
```

**Level 0 (even):** Node 5 is odd ✓.

**Level 1 (odd):** Nodes 4 and 2 are both even ✓, but they must be strictly decreasing: 4 > 2 ✓.

**Level 2 (even):** Nodes 3, 3, and 7 are all odd ✓, but they must be strictly increasing: 3 < 3 is false (they're equal). This violates the strict ordering requirement, so the tree is invalid.

## Brute Force Approach

A naive approach might involve first collecting all nodes by level, then validating each level's conditions. While this would work, it's inefficient in terms of space because we'd need to store all nodes before validation. More importantly, a truly naive implementation might try to validate conditions while traversing without properly tracking the previous value at each level, leading to incorrect comparisons.

The brute force approach would:

1. Perform a BFS or DFS to collect all nodes grouped by level
2. For each level, check if all values satisfy the parity condition
3. For each level, check if values are in the correct order (increasing for even levels, decreasing for odd levels)

This approach uses O(n) extra space to store all nodes by level, which is unnecessary since we can validate as we traverse.

## Optimized Approach

The key insight is that we can validate the tree in a single BFS traversal while tracking:

1. The current level (to determine parity rules)
2. The previous value at the current level (to validate ordering)

**Step-by-step reasoning:**

1. Use BFS (level-order traversal) since we need to process nodes level by level
2. For each level, determine whether it's even or odd
3. For even levels: all values must be odd AND strictly increasing
4. For odd levels: all values must be even AND strictly decreasing
5. We can validate as we traverse by comparing each node with the previous node at the same level
6. If any condition fails, return false immediately

The critical optimization is that we don't need to store entire levels - we just need to remember the last value we saw at the current level to validate ordering.

## Optimal Solution

Here's the complete solution using BFS with level-by-level processing:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(w) where w is max width of tree
from collections import deque

def isEvenOddTree(root):
    """
    Validates if a binary tree is an Even-Odd Tree.

    Conditions:
    - Even levels (0, 2, 4...): all values must be odd and strictly increasing
    - Odd levels (1, 3, 5...): all values must be even and strictly decreasing

    Args:
        root: TreeNode - root of the binary tree

    Returns:
        bool: True if tree satisfies Even-Odd conditions, False otherwise
    """
    # Edge case: empty tree is trivially valid
    if not root:
        return True

    # Initialize queue for BFS, starting with root at level 0
    queue = deque([root])
    level = 0

    while queue:
        # Get number of nodes at current level
        level_size = len(queue)

        # Initialize previous value for ordering validation
        # For even levels, we want strictly increasing, so start with smallest possible
        # For odd levels, we want strictly decreasing, so start with largest possible
        prev_val = float('-inf') if level % 2 == 0 else float('inf')

        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            current_val = node.val

            # Validate parity condition based on level
            if level % 2 == 0:  # Even level
                # Value must be odd
                if current_val % 2 == 0:
                    return False
                # Values must be strictly increasing
                if current_val <= prev_val:
                    return False
            else:  # Odd level
                # Value must be even
                if current_val % 2 != 0:
                    return False
                # Values must be strictly decreasing
                if current_val >= prev_val:
                    return False

            # Update previous value for next comparison
            prev_val = current_val

            # Add children to queue for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        # Move to next level
        level += 1

    # All levels passed validation
    return True
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(w) where w is max width of tree
function isEvenOddTree(root) {
  /**
   * Validates if a binary tree is an Even-Odd Tree.
   *
   * Conditions:
   * - Even levels (0, 2, 4...): all values must be odd and strictly increasing
   * - Odd levels (1, 3, 5...): all values must be even and strictly decreasing
   *
   * @param {TreeNode} root - root of the binary tree
   * @return {boolean} True if tree satisfies Even-Odd conditions, False otherwise
   */

  // Edge case: empty tree is trivially valid
  if (!root) {
    return true;
  }

  // Initialize queue for BFS, starting with root at level 0
  const queue = [root];
  let level = 0;

  while (queue.length > 0) {
    // Get number of nodes at current level
    const levelSize = queue.length;

    // Initialize previous value for ordering validation
    // For even levels, we want strictly increasing, so start with -Infinity
    // For odd levels, we want strictly decreasing, so start with Infinity
    let prevVal = level % 2 === 0 ? -Infinity : Infinity;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      const currentVal = node.val;

      // Validate parity condition based on level
      if (level % 2 === 0) {
        // Even level
        // Value must be odd
        if (currentVal % 2 === 0) {
          return false;
        }
        // Values must be strictly increasing
        if (currentVal <= prevVal) {
          return false;
        }
      } else {
        // Odd level
        // Value must be even
        if (currentVal % 2 !== 0) {
          return false;
        }
        // Values must be strictly decreasing
        if (currentVal >= prevVal) {
          return false;
        }
      }

      // Update previous value for next comparison
      prevVal = currentVal;

      // Add children to queue for next level
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    // Move to next level
    level++;
  }

  // All levels passed validation
  return true;
}
```

```java
// Time: O(n) where n is number of nodes | Space: O(w) where w is max width of tree
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public boolean isEvenOddTree(TreeNode root) {
        /**
         * Validates if a binary tree is an Even-Odd Tree.
         *
         * Conditions:
         * - Even levels (0, 2, 4...): all values must be odd and strictly increasing
         * - Odd levels (1, 3, 5...): all values must be even and strictly decreasing
         *
         * @param root - root of the binary tree
         * @return True if tree satisfies Even-Odd conditions, False otherwise
         */

        // Edge case: empty tree is trivially valid
        if (root == null) {
            return true;
        }

        // Initialize queue for BFS, starting with root at level 0
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0;

        while (!queue.isEmpty()) {
            // Get number of nodes at current level
            int levelSize = queue.size();

            // Initialize previous value for ordering validation
            // For even levels, we want strictly increasing, so start with minimum
            // For odd levels, we want strictly decreasing, so start with maximum
            int prevVal = (level % 2 == 0) ? Integer.MIN_VALUE : Integer.MAX_VALUE;

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                int currentVal = node.val;

                // Validate parity condition based on level
                if (level % 2 == 0) {  // Even level
                    // Value must be odd
                    if (currentVal % 2 == 0) {
                        return false;
                    }
                    // Values must be strictly increasing
                    if (currentVal <= prevVal) {
                        return false;
                    }
                } else {  // Odd level
                    // Value must be even
                    if (currentVal % 2 != 0) {
                        return false;
                    }
                    // Values must be strictly decreasing
                    if (currentVal >= prevVal) {
                        return false;
                    }
                }

                // Update previous value for next comparison
                prevVal = currentVal;

                // Add children to queue for next level
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // Move to next level
            level++;
        }

        // All levels passed validation
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once during the BFS traversal.

**Space Complexity:** O(w) where w is the maximum width (number of nodes at the widest level) of the tree. In the worst case of a complete binary tree, the bottom level contains roughly n/2 nodes, giving us O(n) space. However, in practice we express it as O(w) to be more precise about what the queue stores.

The space complexity comes from the BFS queue, which at most holds all nodes at the widest level of the tree.

## Common Mistakes

1. **Forgetting to handle the strict ordering requirement:** Candidates often check only the parity condition (odd/even values) but forget that values must also be strictly increasing/decreasing. Remember: "strictly" means no equal values allowed.

2. **Incorrect initialization of previous value:** When starting a new level, you need to initialize `prev_val` appropriately:
   - For even levels (strictly increasing): initialize to negative infinity or a very small number
   - For odd levels (strictly decreasing): initialize to positive infinity or a very large number
     Using 0 for both cases will fail for certain test cases.

3. **Mixing up the parity rules:** It's easy to get confused that even levels require odd values and odd levels require even values. A helpful mnemonic: "Even level, odd value" and "Odd level, even value" - they're opposites.

4. **Not processing level by level in BFS:** If you don't track level boundaries (using `level_size`), you'll mix nodes from different levels when comparing ordering. Always process one complete level at a time.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Level-order tree traversal (BFS):** Used in problems where you need to process nodes level by level. Similar problems include:
   - **Binary Tree Level Order Traversal (LeetCode 102):** Basic BFS traversal
   - **Binary Tree Zigzag Level Order Traversal (LeetCode 103):** BFS with alternating direction
   - **Find Largest Value in Each Tree Row (LeetCode 515):** Processing each level independently

2. **Validation with constraints:** Problems where you need to validate a structure against specific rules. Similar problems include:
   - **Validate Binary Search Tree (LeetCode 98):** Validate BST properties
   - **Symmetric Tree (LeetCode 101):** Validate symmetry
   - **Check Completeness of Binary Tree (LeetCode 958):** Validate completeness

## Key Takeaways

1. **BFS is natural for level-based problems:** When a problem mentions "levels" or requires processing by depth, BFS with level tracking is often the right approach.

2. **Validate as you go when possible:** Instead of collecting all data then validating, check conditions during traversal to enable early termination when validation fails.

3. **Pay attention to boundary conditions:** "Strictly increasing/decreasing" means no equal values. Always think about edge cases like single-node levels, empty trees, and extreme values.

[Practice this problem on CodeJeet](/problem/even-odd-tree)
