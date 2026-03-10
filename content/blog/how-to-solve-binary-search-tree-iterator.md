---
title: "How to Solve Binary Search Tree Iterator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Search Tree Iterator. Medium difficulty, 76.2% acceptance rate. Topics: Stack, Tree, Design, Binary Search Tree, Binary Tree."
date: "2026-09-30"
category: "dsa-patterns"
tags: ["binary-search-tree-iterator", "stack", "tree", "design", "medium"]
---

# How to Solve Binary Search Tree Iterator

This problem asks you to implement an iterator that traverses a binary search tree in ascending order (in-order traversal) one element at a time. The challenge is that you need to support `next()` and `hasNext()` operations efficiently without storing all elements in memory at once. What makes this interesting is balancing between time efficiency and space efficiency—you can't just flatten the entire tree into an array (too much space), but you also can't traverse from the root each time (too slow).

## Visual Walkthrough

Let's trace through a small BST example to build intuition:

```
      7
     / \
    3  15
       / \
      9   20
```

**Step-by-step iterator behavior:**

1. `BSTIterator iterator = new BSTIterator(root)` initializes with root=7
2. `iterator.hasNext()` → returns `true` (there are nodes to traverse)
3. `iterator.next()` → returns 3 (the smallest element)
4. `iterator.next()` → returns 7
5. `iterator.next()` → returns 9
6. `iterator.next()` → returns 15
7. `iterator.next()` → returns 20
8. `iterator.hasNext()` → returns `false` (all nodes visited)

The key insight: In-order traversal follows "left-root-right" order. For the iterator to work efficiently, we need a way to pause and resume traversal between calls to `next()`.

## Brute Force Approach

A naive solution would perform a full in-order traversal during initialization, storing all node values in an array, then use a pointer to iterate through that array:

1. In constructor: Perform recursive in-order traversal, store all values in a list
2. `next()`: Return the next value from the list and increment pointer
3. `hasNext()`: Check if pointer is within bounds of the list

**Why this isn't optimal:**

- **Space:** O(n) to store all values, where n is number of nodes
- **Constructor time:** O(n) for the initial traversal
- While this meets the time requirements for `next()` and `hasNext()` (O(1) each), it violates the spirit of an iterator—an iterator should ideally use minimal additional space and allow lazy evaluation (process elements as needed).

The problem constraints don't explicitly forbid this, but interviewers expect the more space-efficient stack-based solution.

## Optimized Approach

The key insight is that we can simulate the recursive in-order traversal **iteratively** using a stack. Instead of using the call stack (recursion) or storing all values upfront, we maintain our own stack that mimics the recursion state:

1. **Initialization:** Push all leftmost nodes onto the stack (this gets us to the smallest element)
2. **next():**
   - Pop the top node from stack (this is the current smallest)
   - If the popped node has a right child, push that child and all its left descendants onto the stack
   - Return the popped node's value
3. **hasNext():** Simply check if the stack is non-empty

**Why this works:**

- The stack always contains the next nodes to be visited in correct order
- When we process a node, we ensure its right subtree (which comes after the node in in-order traversal) is properly queued up
- We only store O(h) nodes in the stack at any time (where h is tree height), not O(n)

**Step-by-step for our example:**

1. Initialize: Push 7, then push 3 (left child of 7). Stack: [7, 3]
2. First `next()`: Pop 3. No right child. Stack: [7]. Return 3
3. Second `next()`: Pop 7. Has right child 15. Push 15, then push 9 (left child of 15). Stack: [15, 9]. Return 7
4. Third `next()`: Pop 9. No right child. Stack: [15]. Return 9
5. Fourth `next()`: Pop 15. Has right child 20. Push 20. Stack: [20]. Return 15
6. Fifth `next()`: Pop 20. No right child. Stack: []. Return 20

## Optimal Solution

Here's the complete implementation using the stack-based approach:

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class BSTIterator:
    # Time:
    #   Constructor: O(h) where h is tree height
    #   next(): Amortized O(1) (each node pushed/popped once)
    #   hasNext(): O(1)
    # Space: O(h) for the stack

    def __init__(self, root: Optional[TreeNode]):
        # Initialize stack to store traversal path
        self.stack = []
        # Push all leftmost nodes to reach the smallest element
        self._push_left(root)

    def _push_left(self, node: Optional[TreeNode]):
        # Helper to push all nodes along the left path
        while node:
            self.stack.append(node)
            node = node.left

    def next(self) -> int:
        # Get the next smallest element
        # Pop the top node (current smallest)
        node = self.stack.pop()

        # If this node has a right subtree, push its leftmost path
        # This ensures the next call to next() returns the correct node
        if node.right:
            self._push_left(node.right)

        # Return the value of the popped node
        return node.val

    def hasNext(self) -> bool:
        # Check if there are more elements to traverse
        return len(self.stack) > 0
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

class BSTIterator {
  // Time:
  //   Constructor: O(h) where h is tree height
  //   next(): Amortized O(1) (each node pushed/popped once)
  //   hasNext(): O(1)
  // Space: O(h) for the stack

  /**
   * @param {TreeNode} root
   */
  constructor(root) {
    // Initialize stack to store traversal path
    this.stack = [];
    // Push all leftmost nodes to reach the smallest element
    this._pushLeft(root);
  }

  /**
   * Helper function to push all nodes along the left path
   * @param {TreeNode} node
   */
  _pushLeft(node) {
    while (node !== null) {
      this.stack.push(node);
      node = node.left;
    }
  }

  /**
   * @return {number}
   */
  next() {
    // Get the next smallest element
    // Pop the top node (current smallest)
    const node = this.stack.pop();

    // If this node has a right subtree, push its leftmost path
    // This ensures the next call to next() returns the correct node
    if (node.right !== null) {
      this._pushLeft(node.right);
    }

    // Return the value of the popped node
    return node.val;
  }

  /**
   * @return {boolean}
   */
  hasNext() {
    // Check if there are more elements to traverse
    return this.stack.length > 0;
  }
}
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode() {}
//     TreeNode(int val) { this.val = val; }
//     TreeNode(int val, TreeNode left, TreeNode right) {
//         this.val = val;
//         this.left = left;
//         this.right = right;
//     }
// }

class BSTIterator {
    // Time:
    //   Constructor: O(h) where h is tree height
    //   next(): Amortized O(1) (each node pushed/popped once)
    //   hasNext(): O(1)
    // Space: O(h) for the stack

    private Stack<TreeNode> stack;

    public BSTIterator(TreeNode root) {
        // Initialize stack to store traversal path
        stack = new Stack<>();
        // Push all leftmost nodes to reach the smallest element
        pushLeft(root);
    }

    /**
     * Helper function to push all nodes along the left path
     * @param node current node
     */
    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }

    public int next() {
        // Get the next smallest element
        // Pop the top node (current smallest)
        TreeNode node = stack.pop();

        // If this node has a right subtree, push its leftmost path
        // This ensures the next call to next() returns the correct node
        if (node.right != null) {
            pushLeft(node.right);
        }

        // Return the value of the popped node
        return node.val;
    }

    public boolean hasNext() {
        // Check if there are more elements to traverse
        return !stack.isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor:** O(h) where h is the height of the tree. In the worst case (skewed tree), h = n, but for balanced BST, h = log n.
- **next():** Amortized O(1). Each node is pushed onto and popped from the stack exactly once across all calls to `next()`, so the total time for n calls is O(n), making the amortized cost per call O(1).
- **hasNext():** O(1) since it just checks if the stack is empty.

**Space Complexity:** O(h) where h is the height of the tree. The stack stores at most h nodes at any time (the current path from root to the leftmost unvisited node). For a balanced BST, this is O(log n); for a skewed tree, it's O(n).

## Common Mistakes

1. **Forgetting to handle the right subtree in `next()`:** After popping a node, if it has a right child, you must push the leftmost path of that right subtree onto the stack. Otherwise, you'll skip the entire right subtree.

2. **Using recursion for traversal:** While recursive in-order traversal is simpler, it uses O(n) space for the call stack in worst case and doesn't allow pausing/resuming between calls. The iterative stack approach gives you control over the traversal state.

3. **Not understanding amortized time complexity:** Candidates sometimes think `next()` is O(h) in the worst case, but it's actually amortized O(1). Each node is processed exactly once (pushed and popped), so over n calls, total time is O(n).

4. **Edge case handling:** Forgetting to check for null root during initialization, or not handling the case where `next()` is called when there are no more elements (the problem guarantees valid usage, but it's good practice to consider).

## When You'll See This Pattern

This "controlled iterative traversal" pattern appears whenever you need to:

- Traverse a tree in a specific order but pause/resume between elements
- Implement lazy evaluation for tree traversal
- Convert recursive algorithms to iterative ones with state preservation

**Related problems:**

1. **Binary Tree Inorder Traversal (Easy):** The core traversal algorithm this iterator is based on. Mastering iterative in-order traversal is prerequisite for this problem.
2. **Flatten 2D Vector (Medium):** Similar concept of implementing an iterator for a 2D data structure, requiring careful state management.
3. **Binary Search Tree Iterator II (Medium):** Extension that also requires `prev()` operation, needing a more complex state management.
4. **Zigzag Iterator (Medium):** Another iterator design problem that requires alternating between multiple data sources.

## Key Takeaways

1. **Iterative tree traversal with a stack** lets you pause and resume traversal, which is perfect for iterator implementation. The stack stores the "future work" in LIFO order.

2. **Amortized analysis matters:** Even if a single operation might be O(h), over the entire sequence of operations, the average cost can be O(1). This is a common pattern in iterator design.

3. **Think about state preservation:** When converting recursive algorithms to iterative ones (or when designing iterators), you need to explicitly manage the state that would normally be on the call stack.

**Related problems:** [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal), [Flatten 2D Vector](/problem/flatten-2d-vector), [Zigzag Iterator](/problem/zigzag-iterator)
