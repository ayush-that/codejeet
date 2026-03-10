---
title: "How to Solve Path In Zigzag Labelled Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path In Zigzag Labelled Binary Tree. Medium difficulty, 75.7% acceptance rate. Topics: Math, Tree, Binary Tree."
date: "2028-06-21"
category: "dsa-patterns"
tags: ["path-in-zigzag-labelled-binary-tree", "math", "tree", "binary-tree", "medium"]
---

# How to Solve Path In Zigzag Labelled Binary Tree

This problem asks us to find the path from a given node label back to the root in a special binary tree where node labels follow a zigzag pattern: odd rows are labeled left-to-right, while even rows are labeled right-to-left. The challenge is that we can't actually build this infinite tree—we need to mathematically determine parent-child relationships based solely on the labeling pattern.

## Visual Walkthrough

Let's trace through an example with label = 14 to build intuition. Here's how the first few rows look:

```
Row 1: 1
Row 2: 3 ← 2
Row 3: 4 → 5 → 6 → 7
Row 4: 15 ← 14 ← 13 ← 12 ← 11 ← 10 ← 9 ← 8
```

We want the path from label 14 to the root:

1. **Start at 14** (in row 4, which is even → labeled right-to-left)
2. **Find 14's parent**:
   - Row 4 has labels 15 down to 8
   - In a normal binary tree (left-to-right labeling), the parent of 14 would be floor(14/2) = 7
   - But because row 4 is even (right-to-left), we need to adjust this
   - The "mirror" position of 14 in row 4: first label in row 4 is 15, last is 8
   - Position from left: 15(1st), 14(2nd), 13(3rd), etc.
   - In normal labeling: 8(1st), 9(2nd), 10(3rd), etc.
   - So 14 corresponds to position 2 from left in zigzag, which would be label 9 in normal labeling
   - Parent of label 9 in normal tree: floor(9/2) = 4
   - But 4 is in row 3 (odd, left-to-right), so no adjustment needed
3. **Continue upward**:
   - Parent of 4: floor(4/2) = 2
   - 2 is in row 2 (even, right-to-left), so adjust...
   - This pattern continues until we reach the root

The key insight: we can work backwards by finding the "normal" label at each level, then adjusting for the zigzag pattern.

## Brute Force Approach

A naive approach would be to actually build the tree up to the given label, then trace the path back. However, this is impossible because:

1. The tree is infinite—we don't know how many rows we need
2. Even if we built up to the given label, we'd need O(n) space where n is the label value
3. For large labels (up to 10^6), this would be prohibitively slow and memory-intensive

What some candidates might try is to calculate row by row:

1. Determine which row the label is in
2. Calculate all labels in that row
3. Find the parent, repeat

But calculating an entire row just to find one parent is wasteful. We need a mathematical approach that works directly with the label numbers.

## Optimized Approach

The optimal solution uses mathematical relationships:

1. **Find the row number**: For label `n`, the row is `floor(log₂(n)) + 1`
2. **Key insight**: In each row, labels are symmetric around the midpoint of the row's label range
3. **Parent calculation**:
   - In a normal binary tree: parent = floor(child/2)
   - In our zigzag tree: we need to find the "normal" equivalent label, get its parent, then convert back
4. **Conversion formula**:
   - For a label `x` in row `r`:
     - Row minimum = 2^(r-1)
     - Row maximum = 2^r - 1
     - Normal position = x - min
     - Zigzag position (for even rows) = max - x
     - So: normal equivalent = min + (max - x) for even rows, or just x for odd rows

But there's an even cleaner approach: work from the bottom up, adjusting at each level:

1. Start with the given label
2. While not at root:
   - Calculate current row
   - Find parent in normal tree: parent_normal = floor(label/2)
   - Adjust for zigzag: find what label in previous row corresponds to parent_normal
   - This becomes the new label
3. Reverse the path at the end

## Optimal Solution

The most elegant solution uses this observation: if we reverse the labels in even rows, we get a normal binary tree. So we can:

1. Start from the given label
2. At each step, find what the label would be in a "normalized" tree
3. Get the parent in that normalized tree
4. Convert back to zigzag labeling

<div class="code-group">

```python
# Time: O(log n) | Space: O(log n) for the result path
def pathInZigZagTree(label: int):
    """
    Find path from given label to root in zigzag labeled binary tree.

    Key insight: In a normal binary tree, parent = child // 2.
    In our zigzag tree, we need to adjust labels in even rows
    to their "mirror" positions before applying this formula.
    """
    result = []

    # Work from the given label up to the root
    while label > 0:
        result.append(label)

        # Find which row the current label is in
        # Row r has labels from 2^(r-1) to 2^r - 1
        # We can find r using log2
        row = label.bit_length()  # same as floor(log2(label)) + 1

        # Calculate the range of labels in this row
        row_min = 1 << (row - 1)  # 2^(row-1)
        row_max = (1 << row) - 1  # 2^row - 1

        # For the parent calculation, we need to find what position
        # our label occupies in a "normal" (non-zigzag) tree
        # In even rows, labels are reversed, so we need to find
        # the mirror position
        if row % 2 == 0:  # Even row: labels are right-to-left
            # Position from the start in zigzag labeling
            pos_in_row = label - row_min
            # Mirror position in normal labeling
            mirror_pos = (row_max - row_min) - pos_in_row
            # Corresponding label in normal tree
            normal_label = row_min + mirror_pos
        else:  # Odd row: labels are left-to-right (already normal)
            normal_label = label

        # In a normal binary tree, parent = child // 2
        parent_normal = normal_label // 2

        # Now convert this parent back to zigzag labeling for the previous row
        if parent_normal > 0:
            prev_row = row - 1
            prev_min = 1 << (prev_row - 1)  # 2^(prev_row-1)
            prev_max = (1 << prev_row) - 1  # 2^prev_row - 1

            if prev_row % 2 == 0:  # Previous row is even (right-to-left)
                # Position in normal labeling
                pos_in_normal = parent_normal - prev_min
                # Mirror to get zigzag position
                mirror_pos = (prev_max - prev_min) - pos_in_normal
                # Get zigzag label
                label = prev_min + mirror_pos
            else:  # Previous row is odd (left-to-right, already normal)
                label = parent_normal
        else:
            label = 0  # Reached the root

    # We built the path from leaf to root, need to reverse it
    return result[::-1]
```

```javascript
// Time: O(log n) | Space: O(log n) for the result path
function pathInZigZagTree(label) {
  /**
   * Find path from given label to root in zigzag labeled binary tree.
   *
   * Key insight: In a normal binary tree, parent = Math.floor(child / 2).
   * In our zigzag tree, we need to adjust labels in even rows
   * to their "mirror" positions before applying this formula.
   */
  const result = [];

  // Work from the given label up to the root
  while (label > 0) {
    result.push(label);

    // Find which row the current label is in
    // Row r has labels from 2^(r-1) to 2^r - 1
    const row = Math.floor(Math.log2(label)) + 1;

    // Calculate the range of labels in this row
    const rowMin = 1 << (row - 1); // 2^(row-1)
    const rowMax = (1 << row) - 1; // 2^row - 1

    let normalLabel;
    if (row % 2 === 0) {
      // Even row: labels are right-to-left
      // Position from the start in zigzag labeling
      const posInRow = label - rowMin;
      // Mirror position in normal labeling
      const mirrorPos = rowMax - rowMin - posInRow;
      // Corresponding label in normal tree
      normalLabel = rowMin + mirrorPos;
    } else {
      // Odd row: labels are left-to-right (already normal)
      normalLabel = label;
    }

    // In a normal binary tree, parent = Math.floor(child / 2)
    const parentNormal = Math.floor(normalLabel / 2);

    // Convert parent back to zigzag labeling for the previous row
    if (parentNormal > 0) {
      const prevRow = row - 1;
      const prevMin = 1 << (prevRow - 1); // 2^(prev_row-1)
      const prevMax = (1 << prevRow) - 1; // 2^prev_row - 1

      if (prevRow % 2 === 0) {
        // Previous row is even (right-to-left)
        // Position in normal labeling
        const posInNormal = parentNormal - prevMin;
        // Mirror to get zigzag position
        const mirrorPos = prevMax - prevMin - posInNormal;
        // Get zigzag label
        label = prevMin + mirrorPos;
      } else {
        // Previous row is odd (left-to-right, already normal)
        label = parentNormal;
      }
    } else {
      label = 0; // Reached the root
    }
  }

  // We built the path from leaf to root, need to reverse it
  return result.reverse();
}
```

```java
// Time: O(log n) | Space: O(log n) for the result path
import java.util.*;

class Solution {
    public List<Integer> pathInZigZagTree(int label) {
        /**
         * Find path from given label to root in zigzag labeled binary tree.
         *
         * Key insight: In a normal binary tree, parent = child / 2.
         * In our zigzag tree, we need to adjust labels in even rows
         * to their "mirror" positions before applying this formula.
         */
        List<Integer> result = new ArrayList<>();

        // Work from the given label up to the root
        while (label > 0) {
            result.add(label);

            // Find which row the current label is in
            // Row r has labels from 2^(r-1) to 2^r - 1
            int row = (int)(Math.log(label) / Math.log(2)) + 1;

            // Calculate the range of labels in this row
            int rowMin = 1 << (row - 1);  // 2^(row-1)
            int rowMax = (1 << row) - 1;  // 2^row - 1

            int normalLabel;
            if (row % 2 == 0) {
                // Even row: labels are right-to-left
                // Position from the start in zigzag labeling
                int posInRow = label - rowMin;
                // Mirror position in normal labeling
                int mirrorPos = (rowMax - rowMin) - posInRow;
                // Corresponding label in normal tree
                normalLabel = rowMin + mirrorPos;
            } else {
                // Odd row: labels are left-to-right (already normal)
                normalLabel = label;
            }

            // In a normal binary tree, parent = child / 2
            int parentNormal = normalLabel / 2;

            // Convert parent back to zigzag labeling for the previous row
            if (parentNormal > 0) {
                int prevRow = row - 1;
                int prevMin = 1 << (prevRow - 1);  // 2^(prev_row-1)
                int prevMax = (1 << prevRow) - 1;  // 2^prev_row - 1

                if (prevRow % 2 == 0) {
                    // Previous row is even (right-to-left)
                    // Position in normal labeling
                    int posInNormal = parentNormal - prevMin;
                    // Mirror to get zigzag position
                    int mirrorPos = (prevMax - prevMin) - posInNormal;
                    // Get zigzag label
                    label = prevMin + mirrorPos;
                } else {
                    // Previous row is odd (left-to-right, already normal)
                    label = parentNormal;
                }
            } else {
                label = 0;  // Reached the root
            }
        }

        // We built the path from leaf to root, need to reverse it
        Collections.reverse(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- We process one level of the tree at each iteration
- The tree height is log₂(n) since it's a binary tree
- Each iteration does constant work (arithmetic operations, bit manipulations)

**Space Complexity: O(log n)**

- We store the path from leaf to root
- The path length equals the tree height, which is log₂(n)
- The recursion/iteration itself uses O(1) additional space

## Common Mistakes

1. **Forgetting to reverse the path at the end**: We build the path from leaf to root (starting with the given label and finding parents), but the problem asks for root-to-leaf path. Always check the required order.

2. **Incorrect row calculation**: Using `log2(n)` without adding 1, or using integer division incorrectly. Remember: row 1 has label 1, row 2 has labels 2-3, row 3 has labels 4-7, etc.

3. **Mixing up even/odd row handling**: In even rows (2, 4, 6...), labels go right-to-left. In odd rows (1, 3, 5...), labels go left-to-right. Getting this reversed will give wrong parent calculations.

4. **Off-by-one errors in mirror calculations**: When computing mirror positions, remember that if row labels go from `min` to `max`, then the mirror of position `p` is `(max - min) - p`, not `(max - min) - p + 1` or other variations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Mathematical tree traversal**: Problems where you need to navigate a tree using mathematical relationships rather than building the actual tree structure. Similar to:
   - **"K-th Symbol in Grammar"** (LeetCode 779): Determining symbols based on binary tree patterns
   - **"Cycle Length Queries in a Tree"** (LeetCode 2509): Finding paths in a perfect binary tree using bit manipulation

2. **Zigzag/alternating patterns**: Problems where behavior alternates between levels or steps:
   - **"Binary Tree Zigzag Level Order Traversal"** (LeetCode 103): Alternating direction of traversal
   - **"Diagonal Traverse"** (LeetCode 498): Alternating diagonal directions

3. **Bit manipulation for tree problems**: Using bit operations to navigate perfect binary trees:
   - **"Find K-th Bit in Nth Binary String"** (LeetCode 1545): Building strings based on binary tree patterns
   - Many segment tree problems use similar bit manipulation techniques

## Key Takeaways

1. **Perfect binary trees have predictable mathematical properties**: In a perfect binary tree, you can compute parent/child relationships, row numbers, and positions using simple formulas without building the tree.

2. **When faced with a modified structure, find the "normal" equivalent**: The zigzag labeling complicates things, but by converting to a normal binary tree, applying the standard parent formula, then converting back, we simplify the problem.

3. **Logarithmic height means logarithmic solutions**: Any problem involving perfect binary trees with n nodes will have O(log n) height, suggesting that optimal solutions should often be O(log n) time.

Related problems: [Cycle Length Queries in a Tree](/problem/cycle-length-queries-in-a-tree)
