---
title: "How to Solve Rectangle Overlap — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rectangle Overlap. Easy difficulty, 46.5% acceptance rate. Topics: Math, Geometry."
date: "2026-04-05"
category: "dsa-patterns"
tags: ["rectangle-overlap", "math", "geometry", "easy"]
---

# How to Solve Rectangle Overlap

This problem asks us to determine whether two axis-aligned rectangles overlap. Each rectangle is represented as `[x1, y1, x2, y2]`, where `(x1, y1)` is the bottom-left corner and `(x2, y2)` is the top-right corner. While the problem seems straightforward, it's tricky because there are multiple ways rectangles can _not_ overlap, and the intuitive "check if one is inside the other" approach can lead to complex conditional logic. The key insight is that it's easier to check when rectangles _don't_ overlap than when they do.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider two rectangles:

Rectangle A: `[1, 1, 3, 3]` (bottom-left at (1,1), top-right at (3,3))
Rectangle B: `[2, 2, 4, 4]` (bottom-left at (2,2), top-right at (4,4))

Visually, these rectangles overlap in a small square region from (2,2) to (3,3). Now let's think about how they could _not_ overlap:

1. **B is completely to the left of A**: B's right edge is left of A's left edge
2. **B is completely to the right of A**: B's left edge is right of A's right edge
3. **B is completely below A**: B's top edge is below A's bottom edge
4. **B is completely above A**: B's bottom edge is above A's top edge

If _none_ of these conditions are true, then the rectangles must overlap. Let's check our example:

- Is B completely to the left of A? No, B's right edge (4) is not left of A's left edge (1)
- Is B completely to the right of A? No, B's left edge (2) is not right of A's right edge (3)
- Is B completely below A? No, B's top edge (4) is not below A's bottom edge (1)
- Is B completely above A? No, B's bottom edge (2) is not above A's top edge (3)

Since none of the "no overlap" conditions are met, the rectangles must overlap.

## Brute Force Approach

A naive approach might try to check all possible overlap scenarios directly: partial overlap from left/right/top/bottom, complete containment, edge touching, etc. This leads to complex conditional logic with many edge cases:

```python
# Messy brute force approach (don't use this!)
def isRectangleOverlap(rec1, rec2):
    # Check if one rectangle is completely inside another
    if (rec1[0] >= rec2[0] and rec1[2] <= rec2[2] and
        rec1[1] >= rec2[1] and rec1[3] <= rec2[3]):
        return True
    if (rec2[0] >= rec1[0] and rec2[2] <= rec1[2] and
        rec2[1] >= rec1[1] and rec2[3] <= rec1[3]):
        return True

    # Check partial overlaps... (this gets messy quickly)
    # ... more complex conditions
```

This approach is problematic because:

1. It's hard to get all the conditions right
2. It's easy to miss edge cases
3. The logic becomes convoluted and hard to maintain
4. It doesn't scale well if we needed to check more than two rectangles

The key insight is that checking for _non-overlap_ is much simpler than checking for overlap directly.

## Optimal Solution

The optimal solution uses the observation that two rectangles overlap if and only if:

1. Their projections on the x-axis overlap
2. Their projections on the y-axis overlap

We can think of this as checking if there's a gap between the rectangles in either dimension. If there's a gap in x or y, they don't overlap. Otherwise, they do.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isRectangleOverlap(rec1, rec2):
    """
    Check if two axis-aligned rectangles overlap.

    Two rectangles overlap if:
    1. The left edge of rec1 is to the left of rec2's right edge AND
    2. The right edge of rec1 is to the right of rec2's left edge AND
    3. The bottom edge of rec1 is below rec2's top edge AND
    4. The top edge of rec1 is above rec2's bottom edge

    This is equivalent to checking that the rectangles overlap
    on both the x-axis and y-axis projections.
    """
    # Unpack coordinates for clarity
    # rec1: [x1, y1, x2, y2] where (x1,y1) is bottom-left, (x2,y2) is top-right
    x1, y1, x2, y2 = rec1
    x3, y3, x4, y4 = rec2

    # Check for overlap in x-direction
    # Rectangles overlap in x if rec1's left edge is left of rec2's right edge
    # AND rec1's right edge is right of rec2's left edge
    overlap_x = x1 < x4 and x2 > x3

    # Check for overlap in y-direction
    # Rectangles overlap in y if rec1's bottom edge is below rec2's top edge
    # AND rec1's top edge is above rec2's bottom edge
    overlap_y = y1 < y4 and y2 > y3

    # Both x and y projections must overlap for rectangles to overlap
    return overlap_x and overlap_y
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Check if two axis-aligned rectangles overlap.
 *
 * Two rectangles overlap if:
 * 1. The left edge of rec1 is to the left of rec2's right edge AND
 * 2. The right edge of rec1 is to the right of rec2's left edge AND
 * 3. The bottom edge of rec1 is below rec2's top edge AND
 * 4. The top edge of rec1 is above rec2's bottom edge
 *
 * This is equivalent to checking that the rectangles overlap
 * on both the x-axis and y-axis projections.
 */
function isRectangleOverlap(rec1, rec2) {
  // Destructure coordinates for clarity
  // rec: [x1, y1, x2, y2] where (x1,y1) is bottom-left, (x2,y2) is top-right
  const [x1, y1, x2, y2] = rec1;
  const [x3, y3, x4, y4] = rec2;

  // Check for overlap in x-direction
  // Rectangles overlap in x if rec1's left edge is left of rec2's right edge
  // AND rec1's right edge is right of rec2's left edge
  const overlapX = x1 < x4 && x2 > x3;

  // Check for overlap in y-direction
  // Rectangles overlap in y if rec1's bottom edge is below rec2's top edge
  // AND rec1's top edge is above rec2's bottom edge
  const overlapY = y1 < y4 && y2 > y3;

  // Both x and y projections must overlap for rectangles to overlap
  return overlapX && overlapY;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Check if two axis-aligned rectangles overlap.
     *
     * Two rectangles overlap if:
     * 1. The left edge of rec1 is to the left of rec2's right edge AND
     * 2. The right edge of rec1 is to the right of rec2's left edge AND
     * 3. The bottom edge of rec1 is below rec2's top edge AND
     * 4. The top edge of rec1 is above rec2's bottom edge
     *
     * This is equivalent to checking that the rectangles overlap
     * on both the x-axis and y-axis projections.
     */
    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
        // Extract coordinates for clarity
        // rec: [x1, y1, x2, y2] where (x1,y1) is bottom-left, (x2,y2) is top-right
        int x1 = rec1[0], y1 = rec1[1], x2 = rec1[2], y2 = rec1[3];
        int x3 = rec2[0], y3 = rec2[1], x4 = rec2[2], y4 = rec2[3];

        // Check for overlap in x-direction
        // Rectangles overlap in x if rec1's left edge is left of rec2's right edge
        // AND rec1's right edge is right of rec2's left edge
        boolean overlapX = x1 < x4 && x2 > x3;

        // Check for overlap in y-direction
        // Rectangles overlap in y if rec1's bottom edge is below rec2's top edge
        // AND rec1's top edge is above rec2's bottom edge
        boolean overlapY = y1 < y4 && y2 > y3;

        // Both x and y projections must overlap for rectangles to overlap
        return overlapX && overlapY;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of comparisons (4 comparisons total)
- The runtime doesn't depend on the size of the input
- Each comparison is a simple integer comparison

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- We store the coordinates in local variables (or destructure them)
- No additional data structures are needed

The constant time and space complexity makes this solution extremely efficient. Even if we needed to check thousands of rectangle pairs, each check would take the same constant time.

## Common Mistakes

1. **Using ≤ or ≥ instead of < and > for edge cases**: The problem states that two rectangles that share only a side or corner don't count as overlapping. If you use `x1 <= x4` instead of `x1 < x4`, you'll incorrectly return `true` for rectangles that just touch at an edge. Always use strict inequalities (`<` and `>`).

2. **Checking if one rectangle is completely inside another first**: Some candidates try to check for complete containment as a special case, but this is unnecessary. The projection check (`x1 < x4 and x2 > x3 and y1 < y4 and y2 > y3`) correctly handles all overlap cases including complete containment.

3. **Getting the inequality directions wrong**: It's easy to accidentally write `x1 > x4` instead of `x1 < x4`. Remember: for rectangles to overlap in the x-direction, rec1's left edge must be to the left of rec2's right edge (`x1 < x4`) AND rec1's right edge must be to the right of rec2's left edge (`x2 > x3`).

4. **Not understanding the coordinate system**: The coordinates are given as `[x1, y1, x2, y2]` where `(x1, y1)` is bottom-left and `(x2, y2)` is top-right. Some candidates mistakenly think `y1` is the top edge. Remember: in standard coordinate systems, larger y-values are higher (up).

## When You'll See This Pattern

The "projection check" pattern appears in many geometry and interval problems:

1. **Rectangle Area (LeetCode 223)**: This problem extends rectangle overlap to calculate the total area covered by two rectangles. You need to check if they overlap, and if so, calculate the overlap area using similar projection logic.

2. **Merge Intervals (LeetCode 56)**: When checking if two intervals overlap, you use the same principle: intervals `[a, b]` and `[c, d]` overlap if `a < d` and `b > c`. This is essentially a 1D version of our rectangle overlap check.

3. **My Calendar I (LeetCode 729)**: When booking events in a calendar, you need to check if time intervals overlap. The logic is identical to checking if 1D "rectangles" (time intervals) overlap.

4. **Image Overlap (LeetCode 835)**: While more complex, the core idea of checking alignment and overlap between shapes builds on similar spatial reasoning.

This pattern teaches you to decompose 2D problems into 1D projections, which is a powerful technique for simplifying spatial reasoning.

## Key Takeaways

1. **Check for non-overlap instead of overlap**: It's often easier to check when two shapes _don't_ overlap than when they do. For axis-aligned rectangles, they don't overlap if there's a gap in either the x-direction or y-direction.

2. **Decompose 2D problems into 1D projections**: Many 2D geometry problems become simpler when you consider the x and y dimensions separately. If two rectangles overlap, their projections on both axes must overlap.

3. **Use strict inequalities for "touching doesn't count"**: When the problem specifies that sharing edges doesn't count as overlap, use `<` and `>` instead of `≤` and `≥`. This is a common requirement in geometry problems.

4. **The pattern generalizes to intervals**: The same logic applies to checking if intervals overlap in 1D: intervals `[a, b]` and `[c, d]` overlap if `a < d` and `b > c`.

Related problems: [Rectangle Area](/problem/rectangle-area)
