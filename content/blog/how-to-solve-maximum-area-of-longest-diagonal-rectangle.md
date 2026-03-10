---
title: "How to Solve Maximum Area of Longest Diagonal Rectangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Area of Longest Diagonal Rectangle. Easy difficulty, 45.9% acceptance rate. Topics: Array."
date: "2026-03-10"
category: "dsa-patterns"
tags: ["maximum-area-of-longest-diagonal-rectangle", "array", "easy"]
---

# How to Solve Maximum Area of Longest Diagonal Rectangle

This problem asks us to find the rectangle with the longest diagonal among a list of rectangles, and return its area. If multiple rectangles share the same longest diagonal length, we need to return the one with the largest area. While the problem is mathematically straightforward, it tests your ability to carefully implement comparison logic and handle multiple criteria correctly—a common pattern in real-world data processing.

**What makes this interesting:** The challenge isn't algorithmic complexity but precision. You need to calculate diagonals correctly, compare them with proper floating-point handling (or avoid floats entirely), and implement tie-breaking logic. Many candidates stumble on the tie-breaking condition or make subtle comparison errors.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

```
dimensions = [[3,4], [5,12], [6,8], [9,12]]
```

**Step 1: Understanding diagonal calculation**
For a rectangle with length `l` and width `w`, the diagonal length is `√(l² + w²)` by the Pythagorean theorem. However, we don't actually need to compute the square root for comparisons—we can compare squared values instead!

**Step 2: Process each rectangle**

1. Rectangle [3,4]:
   - Diagonal² = 3² + 4² = 9 + 16 = 25
   - Area = 3 × 4 = 12

2. Rectangle [5,12]:
   - Diagonal² = 5² + 12² = 25 + 144 = 169
   - Area = 5 × 12 = 60

3. Rectangle [6,8]:
   - Diagonal² = 6² + 8² = 36 + 64 = 100
   - Area = 6 × 8 = 48

4. Rectangle [9,12]:
   - Diagonal² = 9² + 12² = 81 + 144 = 225
   - Area = 9 × 12 = 108

**Step 3: Find maximum diagonal**
The largest diagonal² is 225 (from rectangle [9,12]). No other rectangle has diagonal² = 225, so we return its area: 108.

**Step 4: Consider a tie scenario**
What if we had another rectangle [12,9]?

- Diagonal² = 12² + 9² = 144 + 81 = 225 (same as [9,12])
- Area = 12 × 9 = 108 (same area in this case)

Both have same diagonal length and same area, so either answer is acceptable. The problem just says to return "the area" in case of ties, implying any rectangle with maximum diagonal and maximum area among those ties works.

## Brute Force Approach

The brute force approach is actually optimal for this problem since we must examine every rectangle at least once. However, let's think about what a truly naive implementation might look like:

A candidate might try to:

1. Calculate actual diagonal lengths using square roots
2. Store all rectangles in an array with their diagonals and areas
3. Sort the array by diagonal (descending) then area (descending)
4. Return the area of the first element

While this works, it's inefficient in terms of both time (O(n log n) due to sorting) and space (O(n) for storing all data). More importantly, using floating-point numbers for diagonal comparisons can lead to precision issues when comparing very close values.

The better approach is a single pass with careful comparison logic, which we'll see next.

## Optimal Solution

We can solve this in one pass through the array. The key insight is that we don't need to compute square roots—we can compare squared diagonal lengths directly. For two rectangles A and B:

- If A's diagonal² > B's diagonal², A has longer diagonal
- If diagonal² are equal, compare areas directly

We maintain two variables: `maxDiagonalSq` for the best diagonal found so far, and `maxArea` for the area of the rectangle with that diagonal. For each rectangle:

1. Calculate diagonal² = length² + width²
2. Compare with current best:
   - If diagonal² > maxDiagonalSq: update both variables
   - If diagonal² == maxDiagonalSq: update area if current area is larger
   - Otherwise: skip

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def areaOfMaxDiagonal(dimensions):
    """
    Find the rectangle with the longest diagonal.
    If multiple rectangles have the same longest diagonal,
    return the one with the largest area.
    """
    max_diagonal_sq = 0  # Track squared diagonal (avoid sqrt for precision)
    max_area = 0         # Track area of rectangle with max diagonal

    for length, width in dimensions:
        # Step 1: Calculate squared diagonal (length² + width²)
        diagonal_sq = length * length + width * width

        # Step 2: Compare with current best
        if diagonal_sq > max_diagonal_sq:
            # New longest diagonal found, update both values
            max_diagonal_sq = diagonal_sq
            max_area = length * width
        elif diagonal_sq == max_diagonal_sq:
            # Tie in diagonal length, check area
            current_area = length * width
            if current_area > max_area:
                max_area = current_area

    return max_area
```

```javascript
// Time: O(n) | Space: O(1)
function areaOfMaxDiagonal(dimensions) {
  /**
   * Find the rectangle with the longest diagonal.
   * If multiple rectangles have the same longest diagonal,
   * return the one with the largest area.
   */
  let maxDiagonalSq = 0; // Track squared diagonal (avoid sqrt for precision)
  let maxArea = 0; // Track area of rectangle with max diagonal

  for (const [length, width] of dimensions) {
    // Step 1: Calculate squared diagonal (length² + width²)
    const diagonalSq = length * length + width * width;

    // Step 2: Compare with current best
    if (diagonalSq > maxDiagonalSq) {
      // New longest diagonal found, update both values
      maxDiagonalSq = diagonalSq;
      maxArea = length * width;
    } else if (diagonalSq === maxDiagonalSq) {
      // Tie in diagonal length, check area
      const currentArea = length * width;
      if (currentArea > maxArea) {
        maxArea = currentArea;
      }
    }
  }

  return maxArea;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int areaOfMaxDiagonal(int[][] dimensions) {
        /**
         * Find the rectangle with the longest diagonal.
         * If multiple rectangles have the same longest diagonal,
         * return the one with the largest area.
         */
        int maxDiagonalSq = 0;  // Track squared diagonal (avoid sqrt for precision)
        int maxArea = 0;        // Track area of rectangle with max diagonal

        for (int[] rect : dimensions) {
            int length = rect[0];
            int width = rect[1];

            // Step 1: Calculate squared diagonal (length² + width²)
            int diagonalSq = length * length + width * width;

            // Step 2: Compare with current best
            if (diagonalSq > maxDiagonalSq) {
                // New longest diagonal found, update both values
                maxDiagonalSq = diagonalSq;
                maxArea = length * width;
            } else if (diagonalSq == maxDiagonalSq) {
                // Tie in diagonal length, check area
                int currentArea = length * width;
                if (currentArea > maxArea) {
                    maxArea = currentArea;
                }
            }
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, processing each rectangle exactly once
- For each rectangle, we perform constant-time operations: two multiplications, one addition, and comparisons
- Total operations = n × constant = O(n)

**Space Complexity: O(1)**

- We only use a fixed number of variables (`maxDiagonalSq`, `maxArea`)
- No additional data structures that grow with input size
- Even the input array is provided, not created by our algorithm

## Common Mistakes

1. **Using actual diagonal length with square root**: This introduces floating-point precision issues. When comparing `sqrt(a² + b²)` with `sqrt(c² + d²)`, rounding errors might cause incorrect comparisons. Always compare squared values instead.

2. **Forgetting the tie-breaking condition**: Some candidates only track the maximum diagonal and return its area, but if multiple rectangles share the same diagonal, the problem requires choosing the one with maximum area. Always check for equality in the diagonal comparison.

3. **Incorrect comparison order**: When you find a rectangle with longer diagonal, you must update BOTH the diagonal and area. Don't just update the diagonal and leave the old area—that area belongs to a different rectangle!

4. **Assuming rectangles are squares**: The problem clearly states rectangles have length and width, which may be different. Don't assume `dimensions[i][0] == dimensions[i][1]`.

## When You'll See This Pattern

This problem uses the **single-pass maximum tracking with tie-breaking** pattern, which appears in many problems:

1. **Maximum Product of Two Elements in an Array (LeetCode 1464)**: Find the maximum value of `(nums[i]-1)*(nums[j]-1)`. Similar single-pass tracking of top two values.

2. **Third Maximum Number (LeetCode 414)**: Find the third distinct maximum, requiring careful tracking of top three values with tie-handling.

3. **Maximum Average Subarray I (LeetCode 643)**: Find maximum average of any contiguous subarray of length k. Uses sliding window but similar maximum-tracking logic.

The core pattern is: iterate once, maintain "best so far" variables, and handle edge cases (ties, empty input, etc.) carefully.

## Key Takeaways

1. **Avoid unnecessary computations**: When comparing values that require expensive operations (like square roots), see if you can compare a simpler equivalent (like squared values). This improves both performance and precision.

2. **Single-pass algorithms are often optimal**: If you only need to find a maximum/minimum with some criteria, you usually don't need to store all data or sort—just track the best candidate as you go.

3. **Read tie-breaking conditions carefully**: Many "easy" problems become tricky because of tie-breaking rules. Always explicitly handle equality cases in your comparisons.

[Practice this problem on CodeJeet](/problem/maximum-area-of-longest-diagonal-rectangle)
