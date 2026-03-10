---
title: "How to Solve Two Sum IV - Input is a BST — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Two Sum IV - Input is a BST. Easy difficulty, 63.0% acceptance rate. Topics: Hash Table, Two Pointers, Tree, Depth-First Search, Breadth-First Search."
date: "2027-01-04"
category: "dsa-patterns"
tags: ["two-sum-iv-input-is-a-bst", "hash-table", "two-pointers", "tree", "easy"]
---

# How to Solve Two Sum IV - Input is a BST

This problem asks us to determine whether a Binary Search Tree (BST) contains two distinct nodes whose values sum to a given target `k`. While the classic Two Sum problem uses arrays, here the data is organized in a tree structure. The challenge is to leverage the BST properties efficiently while avoiding O(n²) comparisons between all node pairs.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this BST:

```
      5
     / \
    3   6
   / \   \
  2   4   7
```

Target: `k = 9`

**Step 1:** Start with the smallest value. In a BST, the smallest value is found by traversing left as far as possible (node 2).

**Step 2:** Start with the largest value. The largest value is found by traversing right as far as possible (node 7).

**Step 3:** Check the sum: 2 + 7 = 9. Since 9 equals our target, we've found our pair!

If the sum were different, we'd adjust our search:

- If sum < target: We need a larger sum, so we move the smaller pointer to the next larger value (in-order successor).
- If sum > target: We need a smaller sum, so we move the larger pointer to the next smaller value (in-order predecessor).

This two-pointer approach works because a BST's in-order traversal yields sorted values. We can simulate this without storing all values first.

## Brute Force Approach

The most straightforward approach is to traverse the tree and collect all node values into an array, then apply the standard Two Sum solution using a hash set.

**Algorithm:**

1. Perform any tree traversal (in-order, pre-order, post-order) to collect all node values
2. For each value `val` in the array:
   - Check if `k - val` exists in a hash set
   - If yes, return `true`
   - Otherwise, add `val` to the hash set
3. Return `false` if no pair is found

**Why it's inefficient:**
While this approach has O(n) time complexity, it requires O(n) extra space to store all values. More importantly, it doesn't leverage the BST property at all. In an interview, you'd be expected to optimize further or at least discuss how the BST structure could be used.

## Optimal Solution

The optimal solution uses the BST's ordered property with an in-order traversal iterator approach. We create two iterators: one that gives values in ascending order (left-to-right) and another that gives values in descending order (right-to-left). Then we apply the classic two-pointer technique.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is the height of the tree
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class BSTIterator:
    def __init__(self, root: TreeNode, reverse: bool):
        # Stack to simulate in-order traversal
        self.stack = []
        # Flag to determine if we traverse in ascending (False) or descending (True) order
        self.reverse = reverse
        # Initialize by pushing all nodes along the traversal path
        self._push_all(root)

    def _push_all(self, node: TreeNode):
        # Push nodes according to traversal direction
        while node:
            self.stack.append(node)
            # For ascending order, go left; for descending, go right
            node = node.left if not self.reverse else node.right

    def next(self) -> int:
        # Get the next node in traversal order
        node = self.stack.pop()
        # After processing current node, push all nodes along the next path
        # For ascending: push all left nodes of the right child
        # For descending: push all right nodes of the left child
        self._push_all(node.right if not self.reverse else node.left)
        return node.val

    def hasNext(self) -> bool:
        # Check if there are more nodes to traverse
        return len(self.stack) > 0

class Solution:
    def findTarget(self, root: TreeNode, k: int) -> bool:
        # Edge case: empty tree
        if not root:
            return False

        # Initialize two iterators: left for ascending, right for descending
        left_iterator = BSTIterator(root, False)  # Ascending order
        right_iterator = BSTIterator(root, True)  # Descending order

        # Get initial values: smallest and largest
        left_val = left_iterator.next()
        right_val = right_iterator.next()

        # Two-pointer approach
        while left_val < right_val:
            current_sum = left_val + right_val

            if current_sum == k:
                # Found the pair
                return True
            elif current_sum < k:
                # Sum is too small, move left pointer to next larger value
                left_val = left_iterator.next()
            else:
                # Sum is too large, move right pointer to next smaller value
                right_val = right_iterator.next()

        # No pair found
        return False
```

```javascript
// Time: O(n) | Space: O(h) where h is the height of the tree
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

class BSTIterator {
  constructor(root, reverse) {
    this.stack = [];
    this.reverse = reverse; // false for ascending, true for descending
    this._pushAll(root);
  }

  _pushAll(node) {
    // Push nodes along the traversal path
    while (node !== null) {
      this.stack.push(node);
      // For ascending: go left, for descending: go right
      node = this.reverse ? node.right : node.left;
    }
  }

  next() {
    // Get the next node in traversal order
    const node = this.stack.pop();
    // Push nodes for next iteration
    this._pushAll(this.reverse ? node.left : node.right);
    return node.val;
  }

  hasNext() {
    // Check if more nodes exist
    return this.stack.length > 0;
  }
}

/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {boolean}
 */
var findTarget = function (root, k) {
  // Edge case: empty tree
  if (!root) return false;

  // Initialize two iterators
  const leftIterator = new BSTIterator(root, false); // Ascending
  const rightIterator = new BSTIterator(root, true); // Descending

  // Get initial values
  let leftVal = leftIterator.next();
  let rightVal = rightIterator.next();

  // Two-pointer approach
  while (leftVal < rightVal) {
    const sum = leftVal + rightVal;

    if (sum === k) {
      return true;
    } else if (sum < k) {
      // Need larger sum, move left pointer
      leftVal = leftIterator.next();
    } else {
      // Need smaller sum, move right pointer
      rightVal = rightIterator.next();
    }
  }

  return false;
};
```

```java
// Time: O(n) | Space: O(h) where h is the height of the tree
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

class BSTIterator {
    private Stack<TreeNode> stack = new Stack<>();
    private boolean reverse; // false for ascending, true for descending

    public BSTIterator(TreeNode root, boolean reverse) {
        this.reverse = reverse;
        pushAll(root);
    }

    private void pushAll(TreeNode node) {
        // Push nodes along the traversal path
        while (node != null) {
            stack.push(node);
            // For ascending: go left, for descending: go right
            node = reverse ? node.right : node.left;
        }
    }

    public int next() {
        // Get the next node in traversal order
        TreeNode node = stack.pop();
        // Push nodes for next iteration
        pushAll(reverse ? node.left : node.right);
        return node.val;
    }

    public boolean hasNext() {
        // Check if more nodes exist
        return !stack.isEmpty();
    }
}

class Solution {
    public boolean findTarget(TreeNode root, int k) {
        // Edge case: empty tree
        if (root == null) return false;

        // Initialize two iterators
        BSTIterator left = new BSTIterator(root, false); // Ascending
        BSTIterator right = new BSTIterator(root, true);  // Descending

        // Get initial values
        int leftVal = left.next();
        int rightVal = right.next();

        // Two-pointer approach
        while (leftVal < rightVal) {
            int sum = leftVal + rightVal;

            if (sum == k) {
                return true;
            } else if (sum < k) {
                // Need larger sum, move left pointer
                leftVal = left.next();
            } else {
                // Need smaller sum, move right pointer
                rightVal = right.next();
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Each node is visited at most twice (once by each iterator)
- The `next()` operation is amortized O(1) because each node is pushed and popped from the stack exactly once
- In the worst case, we might traverse almost all nodes (when the pair doesn't exist or is found at the end)

**Space Complexity:** O(h) where h is the height of the tree

- We maintain two stacks, each of which can grow to the height of the tree
- For a balanced BST: O(log n)
- For a skewed BST: O(n)
- This is better than O(n) space required by the hash set approach

## Common Mistakes

1. **Forgetting that nodes must be distinct:** The problem requires two _different_ nodes. Some candidates might incorrectly check if `k/2` exists twice in the tree. Always ensure you're comparing different nodes.

2. **Not leveraging BST properties:** Using a hash set without considering the BST's ordered nature misses optimization opportunities. Even if you implement the hash set solution, you should mention that the BST allows for O(h) space solutions.

3. **Incorrect iterator implementation:** When implementing the in-order traversal iterators, a common mistake is to not handle the reverse traversal correctly. Remember:
   - Ascending: go left first, then right
   - Descending: go right first, then left

4. **Not handling edge cases:** Always check for:
   - Empty tree (root is null)
   - Single node tree (can't form a pair)
   - Negative values (the BST property still holds, but your logic should handle them)

## When You'll See This Pattern

This problem combines several important patterns:

1. **Two Pointers on Sorted Data:** Used in problems like:
   - **Two Sum II - Input Array Is Sorted**: Same two-pointer approach but on arrays
   - **3Sum**: Extends the concept to three elements
   - **Container With Most Water**: Uses two pointers moving inward

2. **BST Iterator Pattern:** Used in problems like:
   - **Binary Search Tree Iterator**: The core iterator implementation
   - **Kth Smallest Element in a BST**: Uses similar traversal logic
   - **Validate Binary Search Tree**: Requires understanding of in-order traversal

3. **Space-Optimized Tree Traversal:** The stack-based iterator approach appears in:
   - **Flatten Binary Tree to Linked List**: Uses similar stack manipulation
   - **Recover Binary Search Tree**: Needs in-order traversal with O(h) space

## Key Takeaways

1. **BSTs provide implicit sorting:** The in-order traversal of a BST yields sorted values. This allows you to apply array-based techniques (like two pointers) to trees.

2. **Iterators enable O(h) space traversal:** By using stacks to simulate traversal, you can process BST elements in sorted order without storing all values, saving space from O(n) to O(h).

3. **Combine known patterns:** This problem shows how to combine the Two Sum pattern with tree traversal techniques. Recognizing when to apply patterns from different domains is key to solving complex problems.

Related problems: [Two Sum](/problem/two-sum), [Two Sum II - Input Array Is Sorted](/problem/two-sum-ii-input-array-is-sorted), [Two Sum III - Data structure design](/problem/two-sum-iii-data-structure-design)
