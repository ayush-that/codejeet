---
title: "How to Solve Verify Preorder Serialization of a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Verify Preorder Serialization of a Binary Tree. Medium difficulty, 47.1% acceptance rate. Topics: String, Stack, Tree, Binary Tree."
date: "2026-06-21"
category: "dsa-patterns"
tags: ["verify-preorder-serialization-of-a-binary-tree", "string", "stack", "tree", "medium"]
---

# How to Solve Verify Preorder Serialization of a Binary Tree

This problem asks us to verify whether a given string represents a valid preorder serialization of a binary tree. The tricky part is that we need to validate the structure without actually building the tree. We're given a comma-separated string where nodes are represented by numbers and null nodes by "#". The challenge lies in determining whether the sequence of nodes follows the rules of a binary tree's preorder traversal.

## Visual Walkthrough

Let's trace through the example `"9,3,4,#,#,1,#,#,2,#,6,#,#"` step by step:

1. Start with `9` - this is a non-null node, so it needs 2 children (left and right)
   - Available slots: 2 (we'll track this as a counter)
2. Process `3` - another non-null node, consumes 1 slot, adds 2 children
   - Slots: 2 - 1 + 2 = 3
3. Process `4` - non-null node, consumes 1 slot, adds 2 children
   - Slots: 3 - 1 + 2 = 4
4. Process `#` - null node, consumes 1 slot, adds 0 children
   - Slots: 4 - 1 + 0 = 3
5. Process `#` - null node, consumes 1 slot
   - Slots: 3 - 1 + 0 = 2
6. Process `1` - non-null node, consumes 1 slot, adds 2 children
   - Slots: 2 - 1 + 2 = 3
7. Process `#` - null node, consumes 1 slot
   - Slots: 3 - 1 + 0 = 2
8. Process `#` - null node, consumes 1 slot
   - Slots: 2 - 1 + 0 = 1
9. Process `2` - non-null node, consumes 1 slot, adds 2 children
   - Slots: 1 - 1 + 2 = 2
10. Process `#` - null node, consumes 1 slot
    - Slots: 2 - 1 + 0 = 1
11. Process `6` - non-null node, consumes 1 slot, adds 2 children
    - Slots: 1 - 1 + 2 = 2
12. Process `#` - null node, consumes 1 slot
    - Slots: 2 - 1 + 0 = 1
13. Process `#` - null node, consumes 1 slot
    - Slots: 1 - 1 + 0 = 0

At the end, we have 0 slots remaining, which means this is a valid serialization.

## Brute Force Approach

A naive approach would be to actually build the tree from the preorder serialization. The algorithm would work like this:

1. Split the string by commas to get a list of nodes
2. Use a recursive function that tries to build the tree:
   - If we run out of nodes, return False
   - If current node is "#", return True (null node is valid)
   - Otherwise, recursively build left subtree, then right subtree
   - If both subtrees are valid, return True

The problem with this approach is that it requires O(n) space for the recursion stack and has O(n) time complexity. While this might seem acceptable, the real issue is conceptual: we're building a tree when the problem only asks for validation. More importantly, this approach doesn't give us an early exit when the serialization is invalid - we have to process the entire string even when it's clearly wrong early on.

## Optimized Approach

The key insight is that we don't need to build the tree. Instead, we can track the number of available "slots" for nodes. Think of it this way:

- Each non-null node consumes 1 slot (to place itself) and creates 2 new slots (for its children)
- Each null node consumes 1 slot and creates 0 new slots
- Initially, we have 1 slot (for the root)
- At the end, all slots should be filled (counter should be 0)
- The counter should never drop below 0 during processing (that would mean we're trying to place a node where there's no slot)

This approach gives us O(1) space (excluding the split array) and O(n) time. More importantly, we can return False immediately if the counter ever becomes negative.

## Optimal Solution

Here's the complete solution using the slot counting approach:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the serialization
# Space: O(n) for the split array, O(1) additional space
class Solution:
    def isValidSerialization(self, preorder: str) -> bool:
        # Split the input string by commas to get individual nodes
        nodes = preorder.split(',')

        # Initialize slot counter: start with 1 slot for the root
        slots = 1

        # Process each node in the preorder sequence
        for node in nodes:
            # If we're trying to place a node but have no available slots,
            # the serialization is invalid
            if slots == 0:
                return False

            # Process current node
            if node == '#':
                # Null node consumes 1 slot
                slots -= 1
            else:
                # Non-null node consumes 1 slot and creates 2 new slots
                slots -= 1  # Consume slot for current node
                slots += 2  # Add slots for its children

        # Valid serialization if all slots are filled (counter is 0)
        return slots == 0
```

```javascript
// Time: O(n) where n is the number of nodes in the serialization
// Space: O(n) for the split array, O(1) additional space
/**
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function (preorder) {
  // Split the input string by commas to get individual nodes
  const nodes = preorder.split(",");

  // Initialize slot counter: start with 1 slot for the root
  let slots = 1;

  // Process each node in the preorder sequence
  for (const node of nodes) {
    // If we're trying to place a node but have no available slots,
    // the serialization is invalid
    if (slots === 0) {
      return false;
    }

    // Process current node
    if (node === "#") {
      // Null node consumes 1 slot
      slots--;
    } else {
      // Non-null node consumes 1 slot and creates 2 new slots
      slots--; // Consume slot for current node
      slots += 2; // Add slots for its children
    }
  }

  // Valid serialization if all slots are filled (counter is 0)
  return slots === 0;
};
```

```java
// Time: O(n) where n is the number of nodes in the serialization
// Space: O(n) for the split array, O(1) additional space
class Solution {
    public boolean isValidSerialization(String preorder) {
        // Split the input string by commas to get individual nodes
        String[] nodes = preorder.split(",");

        // Initialize slot counter: start with 1 slot for the root
        int slots = 1;

        // Process each node in the preorder sequence
        for (String node : nodes) {
            // If we're trying to place a node but have no available slots,
            // the serialization is invalid
            if (slots == 0) {
                return false;
            }

            // Process current node
            if (node.equals("#")) {
                // Null node consumes 1 slot
                slots--;
            } else {
                // Non-null node consumes 1 slot and creates 2 new slots
                slots--;  // Consume slot for current node
                slots += 2;  // Add slots for its children
            }
        }

        // Valid serialization if all slots are filled (counter is 0)
        return slots == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the serialization. We need to split the string (O(n)) and then iterate through all nodes once (O(n)).

**Space Complexity:** O(n) for storing the split array of nodes. The slot counter itself uses O(1) additional space. If we wanted to optimize further, we could process the string character by character without splitting, which would give us O(1) space, but the split approach is more readable and the complexity class remains the same for most interview contexts.

## Common Mistakes

1. **Forgetting to check if slots become negative during processing**: Some candidates only check if slots == 0 at the end, but if slots ever becomes negative, it means we're trying to place nodes where there are no available positions, which should immediately invalidate the serialization.

2. **Incorrect initial slot count**: Starting with 0 slots instead of 1 is a common error. Remember: we need 1 slot to place the root node before we start processing.

3. **Not handling the early exit condition**: When slots == 0 but we still have nodes to process, we should return False immediately. Continuing to process would incorrectly allow extra nodes.

4. **Mishandling the split operation**: Forgetting that split creates an array, and if the input is empty string, split("") returns [""] not []. Always test edge cases like empty string or single "#".

## When You'll See This Pattern

The slot counting technique is a form of **degree counting** or **capacity tracking** that appears in various tree validation problems:

1. **Serialize and Deserialize Binary Tree (LeetCode 297)**: While different in implementation, it uses similar concepts of representing tree structure as a sequence.

2. **Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)**: Also involves validating and constructing trees from serialized data, though with more information (two traversals instead of one).

3. **Check Completeness of a Binary Tree (LeetCode 958)**: Uses level-order traversal with similar slot-counting logic to determine if a tree is complete.

The core pattern is tracking "available positions" or "capacity" when processing sequential data that represents a hierarchical structure.

## Key Takeaways

1. **Think in terms of capacity**: When validating tree structures from serialized data, consider what "slots" or "positions" are available rather than trying to build the actual tree.

2. **Early exit optimization**: If you can determine invalidity before processing the entire input, return immediately. This shows good algorithmic thinking.

3. **Null nodes are informative**: In tree serialization problems, null nodes (#) provide crucial structural information about where subtrees end.

[Practice this problem on CodeJeet](/problem/verify-preorder-serialization-of-a-binary-tree)
