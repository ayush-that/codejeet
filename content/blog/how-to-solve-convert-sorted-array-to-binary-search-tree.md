---
title: "How to Solve Convert Sorted Array to Binary Search Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert Sorted Array to Binary Search Tree. Easy difficulty, 75.2% acceptance rate. Topics: Array, Divide and Conquer, Tree, Binary Search Tree, Binary Tree."
date: "2026-06-25"
category: "dsa-patterns"
tags: ["convert-sorted-array-to-binary-search-tree", "array", "divide-and-conquer", "tree", "easy"]
---

# How to Solve Convert Sorted Array to Binary Search Tree

This problem asks us to convert a sorted integer array into a **height-balanced** binary search tree (BST). A height-balanced tree means the depths of any two leaf nodes differ by at most one. The challenge is that we must maintain both BST properties (left < root < right) and balance constraints using only the sorted array.

What makes this interesting: The sorted array is essentially the **inorder traversal** of a BST. We need to reconstruct the tree structure from this traversal while ensuring balance. The key insight is that the middle element makes the perfect root for balance.

## Visual Walkthrough

Let's trace through input `[-10, -3, 0, 5, 9]`:

**Step 1:** The entire array range is indices 0-4. The middle index is `(0+4)//2 = 2`. Value `0` becomes the root.

```
Root: 0 (index 2)
Left subtree: [-10, -3] (indices 0-1)
Right subtree: [5, 9] (indices 3-4)
```

**Step 2:** Build left subtree from indices 0-1:

- Middle index: `(0+1)//2 = 0`
- Value `-10` becomes left child of root 0
- Left subtree of -10: [] (empty)
- Right subtree of -10: [-3] (index 1)

**Step 3:** Build right subtree from indices 3-4:

- Middle index: `(3+4)//2 = 3`
- Value `5` becomes right child of root 0
- Left subtree of 5: [] (empty)
- Right subtree of 5: [9] (index 4)

**Final tree structure:**

```
      0
     / \
   -10  5
     \   \
     -3   9
```

This tree is height-balanced (depth 2-3) and maintains BST properties.

## Brute Force Approach

There's no true "brute force" for this problem since any valid BST construction from sorted array requires O(n) time. However, a common naive approach candidates consider is:

**Incorrect approach:** Always pick the first element as root, then recursively build left/right subtrees. For `[1,2,3,4,5]`:

- Root: 1
- Left: [] (empty)
- Right: [2,3,4,5] (unbalanced chain)

This creates a degenerate tree (essentially a linked list) with height O(n), violating the height-balanced requirement. The tree would be valid BST but not balanced.

Another incorrect approach: Trying all possible roots and checking balance. This would be O(n×n!) since there are n! possible BSTs from n elements.

The key realization: **For balance, the root must be the middle element**, dividing remaining elements equally between left and right subtrees.

## Optimal Solution

The optimal solution uses **divide and conquer**:

1. Find the middle element of the current subarray to be the root
2. Recursively build left subtree from elements before the middle
3. Recursively build right subtree from elements after the middle
4. Return the root

This ensures O(n) time complexity and O(log n) recursion stack space.

<div class="code-group">

```python
# Time: O(n) - we visit each element exactly once
# Space: O(log n) - recursion stack depth for height-balanced tree
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def sortedArrayToBST(self, nums):
        """
        Convert sorted array to height-balanced BST.

        Args:
            nums: List[int] - sorted ascending array

        Returns:
            TreeNode - root of balanced BST
        """
        # Helper function that builds BST from subarray nums[left:right+1]
        def buildBST(left, right):
            # Base case: empty subarray
            if left > right:
                return None

            # Choose middle element as root for balance
            # Using (left + right) // 2 avoids overflow (Python handles big ints,
            # but this is good practice for other languages)
            mid = (left + right) // 2

            # Create root node with middle value
            root = TreeNode(nums[mid])

            # Recursively build left subtree from left half
            root.left = buildBST(left, mid - 1)

            # Recursively build right subtree from right half
            root.right = buildBST(mid + 1, right)

            return root

        # Start building from entire array
        return buildBST(0, len(nums) - 1)
```

```javascript
// Time: O(n) - we visit each element exactly once
// Space: O(log n) - recursion stack depth for height-balanced tree
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * Convert sorted array to height-balanced BST.
 * @param {number[]} nums - Sorted ascending array
 * @return {TreeNode} - Root of balanced BST
 */
var sortedArrayToBST = function (nums) {
  // Helper function that builds BST from subarray nums[left:right+1]
  const buildBST = (left, right) => {
    // Base case: empty subarray
    if (left > right) {
      return null;
    }

    // Choose middle element as root for balance
    // Using Math.floor((left + right) / 2) ensures integer division
    const mid = Math.floor((left + right) / 2);

    // Create root node with middle value
    const root = new TreeNode(nums[mid]);

    // Recursively build left subtree from left half
    root.left = buildBST(left, mid - 1);

    // Recursively build right subtree from right half
    root.right = buildBST(mid + 1, right);

    return root;
  };

  // Start building from entire array
  return buildBST(0, nums.length - 1);
};
```

```java
// Time: O(n) - we visit each element exactly once
// Space: O(log n) - recursion stack depth for height-balanced tree
class TreeNode {
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
    public TreeNode sortedArrayToBST(int[] nums) {
        // Start building from entire array
        return buildBST(nums, 0, nums.length - 1);
    }

    /**
     * Helper function that builds BST from subarray nums[left:right+1]
     * @param nums - The sorted array
     * @param left - Left index of current subarray (inclusive)
     * @param right - Right index of current subarray (inclusive)
     * @return TreeNode - Root of subtree
     */
    private TreeNode buildBST(int[] nums, int left, int right) {
        // Base case: empty subarray
        if (left > right) {
            return null;
        }

        // Choose middle element as root for balance
        // Using left + (right - left) / 2 prevents potential integer overflow
        int mid = left + (right - left) / 2;

        // Create root node with middle value
        TreeNode root = new TreeNode(nums[mid]);

        // Recursively build left subtree from left half
        root.left = buildBST(nums, left, mid - 1);

        // Recursively build right subtree from right half
        root.right = buildBST(nums, mid + 1, right);

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We create exactly one node for each of the n elements in the array
- Each recursive call does O(1) work (finding middle, creating node)
- Total work: n × O(1) = O(n)

**Space Complexity: O(log n)**

- **Recursion stack:** The maximum depth equals the height of the tree
- Since we build a balanced BST, height = O(log n)
- **Output tree:** O(n) to store all nodes, but this is required output, not auxiliary space
- **Auxiliary space:** O(log n) for recursion stack

**Why not O(n) space?** The tree itself is output, not counted in space complexity. We only count extra space beyond input and output.

## Common Mistakes

1. **Off-by-one errors in indices:** Forgetting the base case `left > right` instead of `left >= right`. With `left >= right`, you might miss the last element when subarray has one element (`left == right` should process that element).

2. **Integer overflow when calculating mid:** In Java/C++, using `(left + right) / 2` can overflow for large arrays. Use `left + (right - left) / 2` instead. Python handles big integers, but it's still good practice.

3. **Creating unbalanced trees:** Not using the middle element as root. Some candidates try to build BST by inserting elements in order, which creates a degenerate tree (linked list) with height O(n).

4. **Handling empty array incorrectly:** Forgetting to check if `nums` is empty and returning `None/null` instead of trying to access `nums[0]`.

5. **Incorrect mid calculation for even-length arrays:** When array has even number of elements, there are two "middle" choices. Either works for balance. Our approach picks the left-middle (floor division), which is fine. Some candidates get confused thinking they must pick a specific one.

## When You'll See This Pattern

The **divide and conquer with middle element as root** pattern appears in problems where you need to build balanced structures from sorted data:

1. **Convert Sorted List to Binary Search Tree (LeetCode 109)** - Same problem but with linked list instead of array. The challenge is finding the middle efficiently without random access.

2. **Balance a Binary Search Tree (LeetCode 1382)** - First get inorder traversal (sorted), then apply the same middle-element-as-root approach.

3. **Sorted Array to Balanced BST variations** - Any problem asking for "balanced" or "height-balanced" BST from sorted data uses this pattern.

4. **Problems requiring O(n) construction from sorted data** - When you need to build any balanced tree structure where inorder traversal is sorted.

The core insight: **Sorted sequence = inorder traversal of BST. Middle element = root for balance.**

## Key Takeaways

1. **Middle element is key to balance:** In any sorted sequence, the middle element divides remaining elements equally, making it the ideal root for a balanced BST.

2. **Divide and conquer naturally fits tree construction:** Each recursive call handles a subarray and returns a subtree, perfectly matching the recursive nature of trees.

3. **Sorted array = Inorder traversal:** This equivalence is fundamental to many BST problems. If you have sorted data, you're looking at the inorder traversal of some BST.

4. **Time-space tradeoff:** We get O(n) time because we use array's random access to find middle in O(1). The linked list version (LeetCode 109) requires O(n log n) or clever O(n) approaches.

**Related problems:** [Convert Sorted List to Binary Search Tree](/problem/convert-sorted-list-to-binary-search-tree)
