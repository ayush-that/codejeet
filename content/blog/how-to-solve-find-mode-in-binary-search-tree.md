---
title: "How to Solve Find Mode in Binary Search Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Mode in Binary Search Tree. Easy difficulty, 58.5% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-08-19"
category: "dsa-patterns"
tags:
  ["find-mode-in-binary-search-tree", "tree", "depth-first-search", "binary-search-tree", "easy"]
---

# How to Solve Find Mode in Binary Search Tree

This problem asks us to find all the most frequent values (modes) in a binary search tree that may contain duplicates. While it's categorized as "Easy," the challenge comes from efficiently tracking frequencies while leveraging the BST property — the in-order traversal gives us values in sorted order, allowing us to count consecutive duplicates without extra space for frequency maps.

## Visual Walkthrough

Let's trace through a concrete example. Consider this BST:

```
      5
     / \
    3   7
   / \   \
  3   4   7
```

**Step 1: In-order traversal gives sorted values**  
In-order traversal (left, root, right) yields: `[3, 3, 4, 5, 7, 7]`

**Step 2: Track current value and count**  
We traverse the sorted list:

- First `3`: current = 3, count = 1
- Second `3`: current = 3, count = 2
- `4`: different value! Reset: current = 4, count = 1
- `5`: different value! Reset: current = 5, count = 1
- First `7`: different value! Reset: current = 7, count = 1
- Second `7`: current = 7, count = 2

**Step 3: Track maximum frequency and modes**  
As we count:

- When count = 2 for `3`: maxCount = 2, modes = [3]
- When count = 1 for `4`: count < maxCount, no change
- When count = 1 for `5`: count < maxCount, no change
- When count = 2 for `7`: count = maxCount, add `7` to modes

**Result:** `[3, 7]` (or `[7, 3]` in any order)

The key insight: since BST in-order traversal gives sorted values, we can count consecutive duplicates without storing all frequencies in a hash map.

## Brute Force Approach

A naive solution would ignore the BST property entirely:

1. Traverse the tree (any order)
2. Store each value's frequency in a hash map
3. Find the maximum frequency
4. Collect all values with that frequency

**Why this isn't optimal:**  
While this approach works (O(n) time, O(n) space), it doesn't leverage the BST property. The problem becomes equivalent to "Find Mode in Any Tree" rather than specifically a BST. In interviews, you want to show you recognize and utilize the given structure.

## Optimal Solution

The optimal approach uses in-order traversal to process values in sorted order. We track:

- `currentVal`: the value we're currently counting
- `currentCount`: how many times we've seen it consecutively
- `maxCount`: the highest frequency seen so far
- `modes`: list of values with frequency = `maxCount`

During traversal:

1. If value equals `currentVal`, increment `currentCount`
2. If value differs, reset `currentVal` and `currentCount`
3. Compare `currentCount` with `maxCount`:
   - If equal, add value to `modes`
   - If greater, update `maxCount` and reset `modes` with new value

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding recursion stack, O(n) including it
class Solution:
    def findMode(self, root):
        """
        Find all modes (most frequent values) in a BST.
        Uses in-order traversal to process values in sorted order.
        """
        # Initialize tracking variables
        self.current_val = None
        self.current_count = 0
        self.max_count = 0
        self.modes = []

        # Start in-order traversal
        self.inorder(root)

        return self.modes

    def inorder(self, node):
        """Perform in-order traversal while tracking frequencies."""
        if not node:
            return

        # Traverse left subtree
        self.inorder(node.left)

        # Process current node
        self.handle_value(node.val)

        # Traverse right subtree
        self.inorder(node.right)

    def handle_value(self, val):
        """Update counts and modes for the current value."""
        if val == self.current_val:
            # Same value as previous node
            self.current_count += 1
        else:
            # New value encountered
            self.current_val = val
            self.current_count = 1

        # Check if current count matches or exceeds max count
        if self.current_count == self.max_count:
            # Same frequency as current modes
            self.modes.append(val)
        elif self.current_count > self.max_count:
            # New highest frequency found
            self.max_count = self.current_count
            self.modes = [val]  # Reset modes with only this value
```

```javascript
// Time: O(n) | Space: O(1) excluding recursion stack, O(n) including it
var findMode = function (root) {
  // Initialize tracking variables
  let currentVal = null;
  let currentCount = 0;
  let maxCount = 0;
  let modes = [];

  /**
   * Perform in-order traversal while tracking frequencies.
   * @param {TreeNode} node - Current node being processed
   */
  function inorder(node) {
    if (!node) return;

    // Traverse left subtree
    inorder(node.left);

    // Process current node
    handleValue(node.val);

    // Traverse right subtree
    inorder(node.right);
  }

  /**
   * Update counts and modes for the current value.
   * @param {number} val - Value of the current node
   */
  function handleValue(val) {
    if (val === currentVal) {
      // Same value as previous node
      currentCount++;
    } else {
      // New value encountered
      currentVal = val;
      currentCount = 1;
    }

    // Check if current count matches or exceeds max count
    if (currentCount === maxCount) {
      // Same frequency as current modes
      modes.push(val);
    } else if (currentCount > maxCount) {
      // New highest frequency found
      maxCount = currentCount;
      modes = [val]; // Reset modes with only this value
    }
  }

  // Start traversal
  inorder(root);
  return modes;
};
```

```java
// Time: O(n) | Space: O(1) excluding recursion stack, O(n) including it
class Solution {
    private Integer currentVal = null;
    private int currentCount = 0;
    private int maxCount = 0;
    private List<Integer> modes = new ArrayList<>();

    public int[] findMode(TreeNode root) {
        // Perform in-order traversal
        inorder(root);

        // Convert List to array for return type
        int[] result = new int[modes.size()];
        for (int i = 0; i < modes.size(); i++) {
            result[i] = modes.get(i);
        }
        return result;
    }

    private void inorder(TreeNode node) {
        if (node == null) return;

        // Traverse left subtree
        inorder(node.left);

        // Process current node
        handleValue(node.val);

        // Traverse right subtree
        inorder(node.right);
    }

    private void handleValue(int val) {
        if (currentVal != null && val == currentVal) {
            // Same value as previous node
            currentCount++;
        } else {
            // New value encountered
            currentVal = val;
            currentCount = 1;
        }

        // Check if current count matches or exceeds max count
        if (currentCount == maxCount) {
            // Same frequency as current modes
            modes.add(val);
        } else if (currentCount > maxCount) {
            // New highest frequency found
            maxCount = currentCount;
            modes.clear();      // Clear previous modes
            modes.add(val);     // Add new highest frequency value
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We visit each node exactly once during the in-order traversal. Each node's value is processed in O(1) time.

**Space Complexity:**

- **Best case (balanced tree):** O(log n) for recursion stack
- **Worst case (skewed tree):** O(n) for recursion stack
- **Auxiliary space:** O(1) for tracking variables (excluding recursion stack and output)

The space for storing modes is not counted in auxiliary space as it's part of the output. If we consider the recursion stack, worst-case space is O(n) for a completely unbalanced tree.

## Common Mistakes

1. **Using hash map without leveraging BST property**  
   While this gives correct results, interviewers expect you to recognize that in-order traversal yields sorted values, allowing O(1) extra space.

2. **Forgetting to reset modes list when new max is found**  
   When `currentCount > maxCount`, you must clear the modes list and start fresh with the new value. Candidates often append instead of replacing.

3. **Not handling the first node correctly**  
   The initial comparison `if val == currentVal` will fail if `currentVal` is uninitialized. Use `null` (or a sentinel value) and check for it.

4. **Assuming only one mode exists**  
   The problem states "return all the mode(s)" — there can be multiple values with the same maximum frequency. Always check for equality, not just greater-than.

## When You'll See This Pattern

This "in-order traversal with state tracking" pattern appears in several BST problems:

1. **Validate Binary Search Tree** - Track previous value during in-order traversal to ensure ascending order
2. **Minimum Absolute Difference in BST** - Track previous value to compute differences between consecutive sorted values
3. **Kth Smallest Element in BST** - Count nodes during in-order traversal until reaching k

The core idea: **BST in-order traversal gives sorted values**, allowing O(1) space algorithms for problems involving consecutive values, differences, or order statistics.

## Key Takeaways

1. **Leverage the sorted property of BST in-order traversal** - This is the single most important BST insight. When you need to process values in order or compare consecutive values, in-order traversal is your tool.

2. **Track state during traversal** - Use instance variables or parameters to maintain counters, previous values, or other state between recursive calls. This avoids needing to store all values.

3. **Consider space-time tradeoffs** - The hash map solution is simpler but uses O(n) space. The in-order approach uses O(1) extra space but requires more careful state management. In interviews, discuss both.

Related problems: [Validate Binary Search Tree](/problem/validate-binary-search-tree)
