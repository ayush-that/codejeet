---
title: "How to Solve Convert Sorted List to Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Convert Sorted List to Binary Search Tree. Medium difficulty, 66.0% acceptance rate. Topics: Linked List, Divide and Conquer, Tree, Binary Search Tree, Binary Tree."
date: "2027-02-01"
category: "dsa-patterns"
tags:
  [
    "convert-sorted-list-to-binary-search-tree",
    "linked-list",
    "divide-and-conquer",
    "tree",
    "medium",
  ]
---

# How to Solve Convert Sorted List to Binary Search Tree

You're given the head of a singly linked list where elements are sorted in ascending order, and you need to convert it into a height-balanced binary search tree. The tricky part is that you can't directly access elements by index like in an array, yet you need to find the middle element efficiently to build a balanced BST. This problem tests your ability to combine linked list traversal with divide-and-conquer tree construction.

## Visual Walkthrough

Let's trace through the example: `[-10, -3, 0, 5, 9]`

We need to build a height-balanced BST where:

1. The left subtree contains only values less than the root
2. The right subtree contains only values greater than the root
3. The tree is balanced (height difference ≤ 1 between left and right subtrees)

The key insight: In a sorted list, the middle element makes the perfect root because:

- All elements before it are smaller (go to left subtree)
- All elements after it are larger (go to right subtree)

Step-by-step process:

1. Find the middle element of the entire list: `0` (3rd element)
2. Make `0` the root of our BST
3. Recursively:
   - Left subtree: Process `[-10, -3]`
   - Right subtree: Process `[5, 9]`
4. For left subtree `[-10, -3]`:
   - Middle element: `-3`
   - Left child of `-3`: `-10`
   - Right child: None
5. For right subtree `[5, 9]`:
   - Middle element: `9` (or `5` depending on implementation)
   - Left child of `9`: `5`
   - Right child: None

The resulting balanced BST:

```
      0
     / \
   -3   9
   /   /
-10   5
```

## Brute Force Approach

A naive approach would be:

1. Convert the linked list to an array (O(n) time, O(n) space)
2. Use the array solution from "Convert Sorted Array to Binary Search Tree"

While this works and produces a correct solution, it's not optimal in terms of space complexity. The problem becomes interesting because we're asked to work directly with the linked list without converting it to an array first.

However, let's examine what a truly naive approach might look like if we tried to work directly with the linked list:

```python
# Pseudo-code for inefficient approach
def sortedListToBST(head):
    if not head:
        return None

    # Find middle by traversing entire list each time: O(n) per call
    slow, fast = head, head
    prev = None
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next

    # Create root from middle node
    root = TreeNode(slow.val)

    # Disconnect left half (messy with linked list manipulation)
    if prev:
        prev.next = None
        root.left = sortedListToBST(head)

    # Process right half
    root.right = sortedListToBST(slow.next)

    return root
```

The problem with this approach is that disconnecting the left half from the linked list is messy and requires careful pointer manipulation. More importantly, we're traversing the list to find the middle repeatedly, leading to O(n log n) time complexity, which is worse than optimal.

## Optimized Approach

The optimal approach uses a clever combination of:

1. **In-order traversal simulation**: We build the BST following in-order traversal order
2. **Divide and conquer**: Recursively process left and right halves
3. **Two-pointer technique**: To find the middle without extra space

Key insight: Instead of finding the middle and then recursively processing left and right halves (which requires list splitting), we can simulate building the tree in the same order as in-order traversal would visit nodes in a BST.

Here's the step-by-step reasoning:

1. We know the BST should contain all elements in sorted order
2. In-order traversal of a BST visits nodes in sorted order
3. If we traverse the linked list in order while building the tree, we can match the sorted order
4. We need to know how many nodes are in each subtree to balance it
5. We can count the total nodes first, then recursively:
   - Build left subtree with first half of nodes
   - Create root with current node
   - Build right subtree with remaining nodes

This approach avoids:

- Modifying the original linked list
- Repeatedly traversing to find middles
- Extra space beyond recursion stack

## Optimal Solution

The optimal solution counts the total nodes first, then uses recursion with range boundaries to determine subtree sizes. We maintain a current pointer that moves through the linked list as we build nodes in in-order sequence.

<div class="code-group">

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def sortedListToBST(self, head: Optional[ListNode]) -> Optional[TreeNode]:
        """
        Time: O(n) - We visit each node exactly once
        Space: O(log n) - Recursion depth for balanced tree
        """
        # First, count total number of nodes in the linked list
        # This helps us determine subtree sizes
        def count_nodes(node):
            count = 0
            while node:
                count += 1
                node = node.next
            return count

        total_nodes = count_nodes(head)

        # Current pointer to traverse linked list in-order
        # We use a mutable list to store current node reference
        current = [head]

        def build_tree(start, end):
            """
            Build BST recursively using indices to determine subtree boundaries
            start: inclusive start index of current subtree in sorted list
            end: exclusive end index of current subtree in sorted list
            """
            # Base case: no nodes in this range
            if start >= end:
                return None

            # Find middle index (root of current subtree)
            mid = (start + end) // 2

            # Recursively build left subtree with first half of nodes
            # This will advance current pointer to the middle node
            left = build_tree(start, mid)

            # Create root node with current value
            # current[0] now points to the middle element after left subtree is built
            root = TreeNode(current[0].val)

            # Move current pointer to next node for right subtree
            current[0] = current[0].next

            # Recursively build right subtree with second half of nodes
            right = build_tree(mid + 1, end)

            # Connect left and right subtrees to root
            root.left = left
            root.right = right

            return root

        # Build the entire tree from index 0 to total_nodes
        return build_tree(0, total_nodes)
```

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
  /**
   * Time: O(n) - We visit each node exactly once
   * Space: O(log n) - Recursion depth for balanced tree
   */

  // Count total nodes in the linked list
  const countNodes = (node) => {
    let count = 0;
    while (node) {
      count++;
      node = node.next;
    }
    return count;
  };

  const totalNodes = countNodes(head);

  // Use an object to maintain mutable reference to current node
  let current = { node: head };

  const buildTree = (start, end) => {
    // Base case: no nodes in this range
    if (start >= end) {
      return null;
    }

    // Find middle index for current subtree
    const mid = Math.floor((start + end) / 2);

    // Recursively build left subtree (this advances current.node)
    const left = buildTree(start, mid);

    // Create root with current node's value
    const root = new TreeNode(current.node.val);

    // Move to next node for right subtree
    current.node = current.node.next;

    // Recursively build right subtree
    const right = buildTree(mid + 1, end);

    // Connect subtrees to root
    root.left = left;
    root.right = right;

    return root;
  };

  return buildTree(0, totalNodes);
};
```

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
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
    // Global pointer to traverse linked list in-order
    private ListNode current;

    public TreeNode sortedListToBST(ListNode head) {
        /**
         * Time: O(n) - We visit each node exactly once
         * Space: O(log n) - Recursion depth for balanced tree
         */

        // Count total nodes in the linked list
        int totalNodes = countNodes(head);

        // Initialize current pointer
        current = head;

        // Build the tree recursively
        return buildTree(0, totalNodes - 1);
    }

    private int countNodes(ListNode node) {
        int count = 0;
        while (node != null) {
            count++;
            node = node.next;
        }
        return count;
    }

    private TreeNode buildTree(int start, int end) {
        // Base case: no nodes in this range
        if (start > end) {
            return null;
        }

        // Find middle index for current subtree
        int mid = start + (end - start) / 2;

        // Recursively build left subtree (this advances current pointer)
        TreeNode left = buildTree(start, mid - 1);

        // Create root with current node's value
        TreeNode root = new TreeNode(current.val);

        // Move to next node for right subtree
        current = current.next;

        // Recursively build right subtree
        TreeNode right = buildTree(mid + 1, end);

        // Connect subtrees to root
        root.left = left;
        root.right = right;

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting nodes: O(n) - we traverse the entire list once
- Building the tree: O(n) - each node is created exactly once
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(log n)**

- Recursion stack depth: O(log n) for a balanced tree
- No additional data structures are used
- The tree itself is O(n) but doesn't count toward auxiliary space

The key to achieving O(n) time is that we traverse the linked list exactly once while building the tree, thanks to the in-order simulation approach.

## Common Mistakes

1. **Trying to find the middle repeatedly**: Some candidates try to find the middle node for each recursive call using the two-pointer technique. This leads to O(n log n) time because each level of recursion requires traversing portions of the list to find middles.

2. **Modifying the original linked list**: Attempting to split the list by setting `prev.next = null` can cause issues if the original list needs to be preserved or if there are multiple references to it.

3. **Incorrect index calculations**: When using the range-based approach, off-by-one errors are common. Remember that `start` is inclusive and `end` is exclusive in the Python/JS implementation, while Java uses inclusive bounds for both.

4. **Forgetting to advance the current pointer**: The current pointer must be advanced after creating each node. If you forget this, all nodes will have the same value (the first node's value).

5. **Not handling empty input**: Always check if `head` is `None`/`null` at the beginning and return `None`/`null` for an empty tree.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Divide and Conquer with Linked Lists**: Similar to merge sort on linked lists, where you find the middle and recursively process halves. See "Sort List" (LeetCode 148).

2. **In-order Traversal Simulation**: Useful when you need to build a BST from sorted data. The same pattern appears in "Convert Sorted Array to Binary Search Tree" (LeetCode 108), but with arrays you can access the middle directly.

3. **Two-Pointer Technique for Finding Middle**: The fast-slow pointer approach is used in many linked list problems like "Middle of the Linked List" (LeetCode 876) and "Palindrome Linked List" (LeetCode 234).

4. **Tree Construction from Traversal Sequences**: Problems like "Construct Binary Tree from Preorder and Inorder Traversal" (LeetCode 105) use similar recursive construction patterns.

## Key Takeaways

1. **When working with sorted data and BSTs, think in-order traversal**: A BST's in-order traversal gives you sorted order, so building a BST from sorted data often involves simulating in-order traversal.

2. **Divide and conquer works well with recursion boundaries**: Instead of physically splitting data structures, use index ranges or counts to represent subsets of data.

3. **Global/mutable references can track progress through data**: When you need to traverse a data structure once while building another, a global or mutable reference helps maintain your position.

4. **Counting elements first can simplify recursive algorithms**: Knowing the total size upfront helps determine balanced split points without repeated calculations.

Related problems: [Convert Sorted Array to Binary Search Tree](/problem/convert-sorted-array-to-binary-search-tree), [Create Binary Tree From Descriptions](/problem/create-binary-tree-from-descriptions)
