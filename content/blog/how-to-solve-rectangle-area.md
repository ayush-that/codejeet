---
title: "How to Solve Rectangle Area — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rectangle Area. Medium difficulty, 49.0% acceptance rate. Topics: Math, Geometry."
date: "2028-02-22"
category: "dsa-patterns"
tags: ["rectangle-area", "math", "geometry", "medium"]
---

# How to Solve Rectangle Area

This problem asks us to compute the total area covered by two axis-aligned rectangles given their bottom-left and top-right coordinates. The tricky part is that the rectangles may overlap, and we must avoid double-counting the overlapping region in our total area calculation. This is a classic geometry problem that tests your ability to think about spatial relationships and handle edge cases cleanly.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- Rectangle A: bottom-left (1, 1), top-right (4, 3)
- Rectangle B: bottom-left (2, 2), top-right (5, 4)

First, let's calculate the area of each rectangle individually:

- Area A = (4 - 1) × (3 - 1) = 3 × 2 = 6
- Area B = (5 - 2) × (4 - 2) = 3 × 2 = 6

Now, if the rectangles didn't overlap, the total area would simply be 6 + 6 = 12. But they do overlap! The overlapping region is:

- x-range: from max(1, 2) = 2 to min(4, 5) = 4
- y-range: from max(1, 2) = 2 to min(3, 4) = 3

So the overlap area = (4 - 2) × (3 - 2) = 2 × 1 = 2

The total area covered = Area A + Area B - Overlap Area = 6 + 6 - 2 = 10

The key insight is that when rectangles overlap, we need to subtract the overlapping area once to avoid counting it twice.

## Brute Force Approach

A naive approach might try to simulate the entire grid, but that's impractical for large coordinate values (coordinates can be up to 10^4, creating grids of up to 10^8 cells). Another brute force approach would be to check every possible point, but that's also inefficient.

What some candidates might try is to manually handle all possible overlap configurations (no overlap, partial overlap, one rectangle inside another, etc.), but this leads to complex conditional logic that's error-prone. The problem with this approach is it requires considering many edge cases separately, making the code difficult to write and maintain.

## Optimized Approach

The optimal approach uses a simple mathematical formula:

**Total Area = Area1 + Area2 - OverlapArea**

Where:

- Area1 = (ax2 - ax1) × (ay2 - ay1)
- Area2 = (bx2 - bx1) × (by2 - by1)
- OverlapArea = max(0, min(ax2, bx2) - max(ax1, bx1)) × max(0, min(ay2, by2) - max(ay1, by1))

The key insight is that two rectangles overlap if and only if:

1. Their x-ranges overlap: max(ax1, bx1) < min(ax2, bx2)
2. Their y-ranges overlap: max(ay1, by1) < min(ay2, by2)

If either dimension doesn't overlap, the overlap area is zero. The formula `max(0, min(right1, right2) - max(left1, left2))` elegantly handles both overlapping and non-overlapping cases: if the rectangles don't overlap, this expression becomes negative, and `max(0, negative)` gives us 0.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def computeArea(ax1: int, ay1: int, ax2: int, ay2: int,
                bx1: int, by1: int, bx2: int, by2: int) -> int:
    """
    Calculate the total area covered by two rectangles.

    The formula is: Area1 + Area2 - OverlapArea
    """

    # Step 1: Calculate area of first rectangle
    # Width = right x - left x, Height = top y - bottom y
    area_a = (ax2 - ax1) * (ay2 - ay1)

    # Step 2: Calculate area of second rectangle
    area_b = (bx2 - bx1) * (by2 - by1)

    # Step 3: Calculate overlap in x-direction
    # The overlap width is the smaller right edge minus the larger left edge
    # If there's no overlap, this will be negative, so we take max with 0
    overlap_x = max(0, min(ax2, bx2) - max(ax1, bx1))

    # Step 4: Calculate overlap in y-direction
    # Same logic as x-direction
    overlap_y = max(0, min(ay2, by2) - max(ay1, by1))

    # Step 5: Calculate overlap area (0 if no overlap in either dimension)
    overlap_area = overlap_x * overlap_y

    # Step 6: Total area is sum of individual areas minus overlap
    return area_a + area_b - overlap_area
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * @param {number} ax1
 * @param {number} ay1
 * @param {number} ax2
 * @param {number} ay2
 * @param {number} bx1
 * @param {number} by1
 * @param {number} bx2
 * @param {number} by2
 * @return {number}
 */
function computeArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  // Step 1: Calculate area of first rectangle
  // Width = right x - left x, Height = top y - bottom y
  const areaA = (ax2 - ax1) * (ay2 - ay1);

  // Step 2: Calculate area of second rectangle
  const areaB = (bx2 - bx1) * (by2 - by1);

  // Step 3: Calculate overlap in x-direction
  // The overlap width is the smaller right edge minus the larger left edge
  // If there's no overlap, this will be negative, so we take max with 0
  const overlapX = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));

  // Step 4: Calculate overlap in y-direction
  // Same logic as x-direction
  const overlapY = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));

  // Step 5: Calculate overlap area (0 if no overlap in either dimension)
  const overlapArea = overlapX * overlapY;

  // Step 6: Total area is sum of individual areas minus overlap
  return areaA + areaB - overlapArea;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int computeArea(int ax1, int ay1, int ax2, int ay2,
                           int bx1, int by1, int bx2, int by2) {
        // Step 1: Calculate area of first rectangle
        // Width = right x - left x, Height = top y - bottom y
        int areaA = (ax2 - ax1) * (ay2 - ay1);

        // Step 2: Calculate area of second rectangle
        int areaB = (bx2 - bx1) * (by2 - by1);

        // Step 3: Calculate overlap in x-direction
        // The overlap width is the smaller right edge minus the larger left edge
        // If there's no overlap, this will be negative, so we take max with 0
        int overlapX = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));

        // Step 4: Calculate overlap in y-direction
        // Same logic as x-direction
        int overlapY = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));

        // Step 5: Calculate overlap area (0 if no overlap in either dimension)
        int overlapArea = overlapX * overlapY;

        // Step 6: Total area is sum of individual areas minus overlap
        return areaA + areaB - overlapArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of arithmetic operations (subtractions, multiplications, min/max comparisons)
- The runtime doesn't depend on the input size or coordinate values

**Space Complexity: O(1)**

- We only use a constant amount of extra space to store intermediate calculations
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle negative overlap calculation**: When rectangles don't overlap, `min(right1, right2) - max(left1, left2)` gives a negative value. Some candidates forget to take `max(0, ...)` and end up with negative overlap areas, which leads to incorrect total area.

2. **Assuming rectangles always overlap**: Some candidates calculate overlap area without checking if overlap exists first. They might calculate `(min(ax2, bx2) - max(ax1, bx1)) * (min(ay2, by2) - max(ay1, by1))` directly, which gives negative values for non-overlapping rectangles.

3. **Confusing coordinate order**: The problem guarantees ax1 < ax2 and ay1 < ay2 (and similarly for rectangle B), but candidates sometimes assume coordinates might be given in different orders. While the problem guarantees valid input, it's good practice to note this assumption.

4. **Integer overflow**: While not an issue in Python (which has arbitrary precision integers), in Java and JavaScript, multiplying large coordinates could theoretically overflow. However, with the given constraints (coordinates up to 10^4), the maximum area is 10^8 × 10^8 = 10^16, which fits within Java's `long` and JavaScript's safe integer range.

## When You'll See This Pattern

This "interval overlap" pattern appears in many geometry and scheduling problems:

1. **Rectangle Overlap (LeetCode 836)**: This is essentially the overlap detection part of our problem. It asks whether two rectangles overlap, which we solve by checking if both x and y intervals overlap.

2. **Meeting Rooms II (LeetCode 253)**: While not about rectangles, it uses similar interval logic to find the maximum number of overlapping meetings, which is analogous to finding overlapping x or y intervals.

3. **Insert Interval (LeetCode 57)**: This problem requires merging overlapping intervals, using similar logic to determine when intervals overlap.

The core pattern is: **To check if two 1D intervals [a1, a2] and [b1, b2] overlap, check if `max(a1, b1) < min(a2, b2)`**. For 2D rectangles, this check needs to be true for both dimensions.

## Key Takeaways

1. **Decompose 2D problems into 1D**: Rectangle overlap can be broken down into checking x-interval overlap AND y-interval overlap separately. This simplification makes the problem much easier to reason about.

2. **Use `max(0, ...)` for elegant overlap calculation**: The expression `max(0, min(right1, right2) - max(left1, left2))` elegantly handles both overlapping and non-overlapping cases in one line, avoiding complex conditional logic.

3. **The inclusion-exclusion principle**: The formula `Area1 + Area2 - OverlapArea` is a specific case of the inclusion-exclusion principle, which is useful in many combinatorial and geometry problems where you need to avoid double-counting.

Related problems: [Rectangle Overlap](/problem/rectangle-overlap), [Find the Number of Ways to Place People II](/problem/find-the-number-of-ways-to-place-people-ii), [Find the Number of Ways to Place People I](/problem/find-the-number-of-ways-to-place-people-i)
