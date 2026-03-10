---
title: "How to Solve Pseudo-Palindromic Paths in a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pseudo-Palindromic Paths in a Binary Tree. Medium difficulty, 68.4% acceptance rate. Topics: Bit Manipulation, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-06-14"
category: "dsa-patterns"
tags:
  [
    "pseudo-palindromic-paths-in-a-binary-tree",
    "bit-manipulation",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Pseudo-Palindromic Paths in a Binary Tree

This problem asks us to count all root-to-leaf paths in a binary tree where the node values (digits 1-9) can be rearranged to form a palindrome. What makes this problem interesting is that we need to check palindrome properties without actually generating all permutations (which would be exponential). The key insight is recognizing that for a sequence to be rearrangeable into a palindrome, at most one digit can appear an odd number of times.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        2
       / \
      3   1
     / \   \
    3   1   1
```

**Path 1: 2 → 3 → 3**

- Values: [2, 3, 3]
- Frequency: 2 appears once (odd), 3 appears twice (even)
- Can this form a palindrome? Yes! "323" is a palindrome
- Why? Only one digit (2) has odd count

**Path 2: 2 → 3 → 1**

- Values: [2, 3, 1]
- Frequency: All digits appear once (all odd counts)
- Can this form a palindrome? No! With three odd counts, no palindrome possible
- Why? More than one digit has odd count

**Path 3: 2 → 1 → 1**

- Values: [2, 1, 1]
- Frequency: 2 appears once (odd), 1 appears twice (even)
- Can this form a palindrome? Yes! "121" is a palindrome
- Why? Only one digit (2) has odd count

So for this tree, we have 2 pseudo-palindromic paths.

## Brute Force Approach

A naive approach would be:

1. Find all root-to-leaf paths (O(n) paths in worst case)
2. For each path, generate all permutations of its values
3. Check if any permutation is a palindrome
4. Count the paths where this is true

The problem with this approach is the permutation step. For a path of length L, there are L! permutations to check. Even for moderate L (say 10), that's 3.6 million permutations! This quickly becomes infeasible.

Even a slightly better brute force would check palindrome conditions directly: for each path, count frequencies and verify that at most one digit has odd count. While this avoids permutations, we'd still need to:

- Store each complete path (O(n) space per path)
- Process each path separately (recounting frequencies for overlapping prefixes)

This gives us O(n²) time in the worst case for a skewed tree, which is inefficient.

## Optimized Approach

The key insight is that we can track palindrome conditions **as we traverse** the tree using bit manipulation. Here's the step-by-step reasoning:

1. **Palindrome Condition**: A sequence can be rearranged into a palindrome if at most one digit has an odd frequency.

2. **Bitmask Representation**: Since digits are 1-9, we can use a 9-bit integer to track parity (odd/even) of each digit:
   - Bit 0 represents digit 1
   - Bit 1 represents digit 2
   - ... and so on
   - Toggle the bit each time we encounter a digit (XOR operation)

3. **DFS Traversal**: As we traverse from root to leaf:
   - Update the bitmask at each node
   - At leaf nodes, check if the bitmask has at most one bit set
   - Use the fact that `(mask & (mask - 1)) == 0` checks if at most one bit is set

4. **Why This Works**:
   - Each bit tracks whether we've seen a digit an odd (1) or even (0) number of times
   - XOR toggles the bit: 0→1 (first time odd), 1→0 (second time even)
   - At a leaf, if 0 or 1 bits are set, we have a valid path

This approach gives us O(n) time and O(h) space (for recursion stack), where h is the tree height.

## Optimal Solution

Here's the complete solution using DFS with bitmask:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is tree height (recursion stack)
class Solution:
    def pseudoPalindromicPaths(self, root: Optional[TreeNode]) -> int:
        def dfs(node, bitmask):
            # Base case: empty node
            if not node:
                return 0

            # Toggle the bit for current node's value
            # We subtract 1 because digits are 1-9 but bits are 0-indexed
            # Example: digit 3 corresponds to bit 2 (3-1=2)
            bitmask ^= (1 << (node.val - 1))

            # Check if this is a leaf node
            if not node.left and not node.right:
                # A path is pseudo-palindromic if at most one bit is set
                # (mask & (mask - 1)) == 0 checks if mask is 0 or a power of 2
                # This means 0 or 1 bits are set
                return 1 if (bitmask & (bitmask - 1)) == 0 else 0

            # Continue DFS on children, sum results
            left_count = dfs(node.left, bitmask)
            right_count = dfs(node.right, bitmask)
            return left_count + right_count

        # Start DFS from root with initial bitmask 0 (all digits even count)
        return dfs(root, 0)
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (recursion stack)
var pseudoPalindromicPaths = function (root) {
  const dfs = (node, bitmask) => {
    // Base case: empty node
    if (!node) return 0;

    // Toggle the bit for current node's value
    // We subtract 1 because digits are 1-9 but bits are 0-indexed
    // Example: digit 3 corresponds to bit 2 (3-1=2)
    bitmask ^= 1 << (node.val - 1);

    // Check if this is a leaf node
    if (!node.left && !node.right) {
      // A path is pseudo-palindromic if at most one bit is set
      // (mask & (mask - 1)) === 0 checks if mask is 0 or a power of 2
      // This means 0 or 1 bits are set
      return (bitmask & (bitmask - 1)) === 0 ? 1 : 0;
    }

    // Continue DFS on children, sum results
    const leftCount = dfs(node.left, bitmask);
    const rightCount = dfs(node.right, bitmask);
    return leftCount + rightCount;
  };

  // Start DFS from root with initial bitmask 0 (all digits even count)
  return dfs(root, 0);
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (recursion stack)
class Solution {
    public int pseudoPalindromicPaths(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int bitmask) {
        // Base case: empty node
        if (node == null) return 0;

        // Toggle the bit for current node's value
        // We subtract 1 because digits are 1-9 but bits are 0-indexed
        // Example: digit 3 corresponds to bit 2 (3-1=2)
        bitmask ^= (1 << (node.val - 1));

        // Check if this is a leaf node
        if (node.left == null && node.right == null) {
            // A path is pseudo-palindromic if at most one bit is set
            // (mask & (mask - 1)) == 0 checks if mask is 0 or a power of 2
            // This means 0 or 1 bits are set
            return (bitmask & (bitmask - 1)) == 0 ? 1 : 0;
        }

        // Continue DFS on children, sum results
        int leftCount = dfs(node.left, bitmask);
        int rightCount = dfs(node.right, bitmask);
        return leftCount + rightCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- At each node, we perform constant-time operations: bit manipulation and condition checks
- Even though we traverse each path from root to leaf, we don't revisit nodes for different paths (except at branching points, but that's still O(n) total)

**Space Complexity: O(h)**

- The recursion stack uses space proportional to the tree height
- In the worst case (skewed tree), h = n, giving O(n) space
- In the best case (balanced tree), h = log n, giving O(log n) space
- We use only O(1) additional space for the bitmask (an integer)

## Common Mistakes

1. **Forgetting to handle the digit-to-bit mapping correctly**: Digits are 1-9, but bits are 0-indexed. Using `1 << node.val` instead of `1 << (node.val - 1)` will shift too far and give wrong results.

2. **Not understanding the bit trick for checking single bit set**: The expression `(mask & (mask - 1)) == 0` is crucial. Some candidates try to count bits using loops or built-in functions, which works but is less elegant. Remember: this trick works because subtracting 1 flips all bits from the rightmost 1 to the end.

3. **Modifying the bitmask incorrectly when backtracking**: Since we're passing bitmask by value (not reference), we don't need to "undo" changes when backtracking. But if using a mutable approach, forgetting to undo would cause bugs. Our solution avoids this by passing the updated value to children but not modifying the parent's copy.

4. **Only checking exact palindromes instead of rearrangable ones**: The problem says "pseudo-palindromic" - the values don't need to be in palindrome order, just rearrangable into one. Checking the actual path order would give wrong answers.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree DFS with Path Information**: Similar to problems like "Binary Tree Paths" (LeetCode 257) or "Path Sum" (LeetCode 112), where we track information along a path from root to leaf.

2. **Bitmask for Frequency Tracking**: When dealing with limited character sets (especially when checking palindrome properties), bitmask is efficient. See "Find the Longest Substring Containing Vowels in Even Counts" (LeetCode 1371) or "Maximum Product of Word Lengths" (LeetCode 318).

3. **Palindrome Properties with Bit Manipulation**: The "at most one odd count" palindrome check appears in problems like "Longest Palindrome" (LeetCode 409) or "Palindrome Permutation" (LeetCode 266).

## Key Takeaways

1. **For palindrome rearrangement problems**, remember the core property: at most one character can have an odd count. This eliminates the need to check permutations.

2. **When dealing with limited character sets** (especially when tracking parity), bitmask manipulation is often the most space-efficient approach. Each bit can represent the odd/even state of one character.

3. **In tree path problems**, consider what information needs to be passed down during DFS. Passing by value (creating new copies for each recursive call) often simplifies backtracking logic compared to modifying and restoring shared state.

[Practice this problem on CodeJeet](/problem/pseudo-palindromic-paths-in-a-binary-tree)
