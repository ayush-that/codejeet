---
title: "How to Solve Find Duplicate Subtrees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Duplicate Subtrees. Medium difficulty, 60.6% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Binary Tree."
date: "2027-12-13"
category: "dsa-patterns"
tags: ["find-duplicate-subtrees", "hash-table", "tree", "depth-first-search", "medium"]
---

# How to Solve Find Duplicate Subtrees

This problem asks us to find all duplicate subtrees in a binary tree. A duplicate subtree is defined as having identical structure and node values. The tricky part is efficiently identifying when we've seen the same subtree structure before without comparing every subtree against every other subtree, which would be prohibitively slow for larger trees.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

```
      1
     / \
    2   3
   /   / \
  4   2   4
     /
    4
```

We need to find all duplicate subtrees. Let's look at the subtrees:

1. Single node subtrees: [4] appears three times (left of 2, left of left 2, right of 3)
2. Two-node subtree: [2,4] appears twice (root's left child, right child's left child)

The challenge is: how do we efficiently recognize that we've seen the same subtree before?

Key insight: If we can create a unique "signature" or "serialization" for each subtree, we can use a hash map to track which signatures we've seen before. When we see the same signature again, we've found a duplicate subtree.

## Brute Force Approach

The most straightforward approach would be to compare every subtree against every other subtree:

1. Generate all possible subtrees in the tree
2. For each subtree, compare it against all other subtrees to check for duplicates
3. Track duplicates and return one root from each duplicate group

The problem with this approach is the time complexity. For a tree with n nodes:

- There are O(n) subtrees (each node can be the root of a subtree)
- Comparing two trees takes O(k) time where k is the number of nodes in the smaller tree
- This leads to O(n³) time complexity in the worst case (when comparing large subtrees against each other)

Even with optimizations like comparing sizes first, this approach is too slow for the constraints of this problem.

## Optimized Approach

The key insight is that we need a way to quickly identify when we've seen a subtree before. We can do this by creating a unique string representation (serialization) of each subtree. Here's the step-by-step reasoning:

1. **Post-order traversal**: We process children before parents because a subtree's signature depends on its children's signatures.

2. **Serialization**: Convert each subtree to a string representation that captures both structure and values. A common format is: `"value,leftSignature,rightSignature"` where `leftSignature` and `rightSignature` are the serializations of the left and right children.

3. **Hash map tracking**: Use a dictionary/map to count how many times we've seen each serialization. When we see a serialization for the second time, we've found a duplicate subtree.

4. **Why post-order works**: When we're at a node, we need to know the serializations of its children to create its own serialization. Post-order (left, right, root) gives us exactly that.

5. **Handling null children**: We need a special marker (like "#" or "null") for null children so that structure is preserved. Without this, different structures could have the same serialization.

## Optimal Solution

Here's the complete solution using post-order traversal with serialization:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes
# Space: O(n) for the hash map and recursion stack
class Solution:
    def findDuplicateSubtrees(self, root):
        """
        Find all duplicate subtrees in a binary tree.

        Approach: Use post-order traversal to serialize each subtree.
        Track serializations in a hash map to identify duplicates.
        """
        # Dictionary to count occurrences of each serialization
        # Key: serialization string, Value: count of occurrences
        serial_count = {}

        # List to store the root nodes of duplicate subtrees
        duplicates = []

        def serialize(node):
            """
            Serialize a subtree rooted at 'node' using post-order traversal.
            Returns the serialization string for the subtree.
            """
            # Base case: null node represented by special marker
            if not node:
                return "#"

            # Post-order: left, right, then current node
            left_serial = serialize(node.left)
            right_serial = serialize(node.right)

            # Create serialization for current subtree
            # Format: "value,leftSerial,rightSerial"
            serial = f"{node.val},{left_serial},{right_serial}"

            # Check if we've seen this serialization before
            # Increment count for this serialization
            serial_count[serial] = serial_count.get(serial, 0) + 1

            # If this is the second time we see this serialization,
            # add current node to duplicates list
            # We check for == 2 to add each duplicate only once
            if serial_count[serial] == 2:
                duplicates.append(node)

            return serial

        # Start serialization from the root
        serialize(root)

        return duplicates
```

```javascript
// Time: O(n) where n is the number of nodes
// Space: O(n) for the hash map and recursion stack
/**
 * Find all duplicate subtrees in a binary tree.
 *
 * Approach: Use post-order traversal to serialize each subtree.
 * Track serializations in a hash map to identify duplicates.
 */
var findDuplicateSubtrees = function (root) {
  // Map to count occurrences of each serialization
  // Key: serialization string, Value: count of occurrences
  const serialCount = new Map();

  // Array to store the root nodes of duplicate subtrees
  const duplicates = [];

  /**
   * Serialize a subtree rooted at 'node' using post-order traversal.
   * Returns the serialization string for the subtree.
   */
  function serialize(node) {
    // Base case: null node represented by special marker
    if (!node) {
      return "#";
    }

    // Post-order: left, right, then current node
    const leftSerial = serialize(node.left);
    const rightSerial = serialize(node.right);

    // Create serialization for current subtree
    // Format: "value,leftSerial,rightSerial"
    const serial = `${node.val},${leftSerial},${rightSerial}`;

    // Check if we've seen this serialization before
    // Get current count or 0 if not seen
    const count = serialCount.get(serial) || 0;

    // Increment count for this serialization
    serialCount.set(serial, count + 1);

    // If this is the second time we see this serialization,
    // add current node to duplicates array
    // We check for === 2 to add each duplicate only once
    if (count + 1 === 2) {
      duplicates.push(node);
    }

    return serial;
  }

  // Start serialization from the root
  serialize(root);

  return duplicates;
};
```

```java
// Time: O(n) where n is the number of nodes
// Space: O(n) for the hash map and recursion stack
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
    // Map to count occurrences of each serialization
    // Key: serialization string, Value: count of occurrences
    private Map<String, Integer> serialCount = new HashMap<>();

    // List to store the root nodes of duplicate subtrees
    private List<TreeNode> duplicates = new ArrayList<>();

    /**
     * Find all duplicate subtrees in a binary tree.
     *
     * Approach: Use post-order traversal to serialize each subtree.
     * Track serializations in a hash map to identify duplicates.
     */
    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        // Start serialization from the root
        serialize(root);
        return duplicates;
    }

    /**
     * Serialize a subtree rooted at 'node' using post-order traversal.
     * Returns the serialization string for the subtree.
     */
    private String serialize(TreeNode node) {
        // Base case: null node represented by special marker
        if (node == null) {
            return "#";
        }

        // Post-order: left, right, then current node
        String leftSerial = serialize(node.left);
        String rightSerial = serialize(node.right);

        // Create serialization for current subtree
        // Format: "value,leftSerial,rightSerial"
        String serial = node.val + "," + leftSerial + "," + rightSerial;

        // Check if we've seen this serialization before
        // Get current count or 0 if not seen
        int count = serialCount.getOrDefault(serial, 0);

        // Increment count for this serialization
        serialCount.put(serial, count + 1);

        // If this is the second time we see this serialization,
        // add current node to duplicates list
        // We check for == 2 to add each duplicate only once
        if (count + 1 == 2) {
            duplicates.add(node);
        }

        return serial;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the post-order traversal
- For each node, we create a serialization string by concatenating values, which takes O(1) amortized time with string builders (Python/Java) or template literals (JavaScript)
- The total work is proportional to the number of nodes

**Space Complexity: O(n)**

- The recursion stack can go as deep as the height of the tree, which is O(n) in the worst case (skewed tree)
- We store serializations for each subtree in the hash map: O(n) entries
- Each serialization string can be up to O(n) characters long, but in practice, the total character storage is O(n) because each node's value appears in exactly one serialization at each level of the tree

## Common Mistakes

1. **Using pre-order instead of post-order**: Pre-order traversal (root, left, right) doesn't work because when serializing a node, we need to know the serializations of its children first. Post-order ensures children are processed before parents.

2. **Forgetting to handle null children**: Without a special marker for null children (like "#"), different tree structures could produce the same serialization. For example, a node with only a left child vs. a node with only a right child would both serialize as "value,childSerial" without null markers.

3. **Adding duplicates multiple times**: When we see a serialization for the 3rd, 4th, etc. time, we shouldn't add it to the result again. That's why we check `if count == 2` instead of `if count > 1`.

4. **Inefficient string concatenation**: In languages like Java, using `+` for string concatenation in a loop creates many intermediate strings. In practice, for this problem it's acceptable, but for maximum efficiency, you could use `StringBuilder`.

## When You'll See This Pattern

This pattern of "serialize and compare" appears in several tree problems:

1. **Serialize and Deserialize Binary Tree (Hard)**: Uses similar serialization techniques to convert a tree to a string and back.

2. **Construct String from Binary Tree (Medium)**: Builds a string representation of a binary tree with proper parentheses to preserve structure.

3. **Subtree of Another Tree (Easy)**: Checks if one tree is a subtree of another, often using serialization or recursive comparison.

The core idea is that complex structures (like trees) can be reduced to strings or hashes for efficient comparison. This is essentially a form of memoization where we compute a signature for each subtree once and reuse it.

## Key Takeaways

1. **Post-order traversal is natural for subtree problems**: When you need information from children to compute something for the parent, post-order traversal (process children first) is often the right choice.

2. **Serialization enables efficient comparison**: Converting complex structures to strings or hashes allows O(1) comparison via hash maps instead of O(n) structural comparison.

3. **Hash maps track seen patterns**: When looking for duplicates or patterns in any data structure, consider using a hash map to count occurrences of signatures.

Related problems: [Serialize and Deserialize Binary Tree](/problem/serialize-and-deserialize-binary-tree), [Serialize and Deserialize BST](/problem/serialize-and-deserialize-bst), [Construct String from Binary Tree](/problem/construct-string-from-binary-tree)
