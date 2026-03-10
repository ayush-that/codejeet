---
title: "How to Solve Widest Vertical Area Between Two Points Containing No Points — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Widest Vertical Area Between Two Points Containing No Points. Easy difficulty, 87.1% acceptance rate. Topics: Array, Sorting."
date: "2028-10-15"
category: "dsa-patterns"
tags: ["widest-vertical-area-between-two-points-containing-no-points", "array", "sorting", "easy"]
---

# How to Solve Widest Vertical Area Between Two Points Containing No Points

This problem asks us to find the maximum horizontal distance between two points where no other points lie between them vertically. The key insight is that the y-coordinates don't matter at all — we're looking at vertical "slices" that extend infinitely up and down, so only the x-coordinates determine where these slices begin and end. What makes this problem interesting is how it disguises a simple sorting problem as a 2D geometry problem.

## Visual Walkthrough

Let's trace through an example: `points = [[8,7],[9,9],[7,4],[9,7]]`

**Step 1: Extract x-coordinates**
We only care about the x-values: `[8, 9, 7, 9]`

**Step 2: Sort the x-coordinates**
Sorted: `[7, 8, 9, 9]`

**Step 3: Find consecutive differences**

- Between 7 and 8: difference = 1
- Between 8 and 9: difference = 1
- Between 9 and 9: difference = 0

**Step 4: Identify the maximum difference**
The maximum difference is 1, so the widest vertical area has width 1.

Why does this work? Imagine drawing vertical lines at each x-coordinate. Between any two consecutive x-values, there are no other points (because we sorted them). The vertical area between these lines extends infinitely up and down, containing no points. The widest such area is simply the largest gap between consecutive sorted x-values.

## Brute Force Approach

A naive approach might try to check all pairs of points:

1. For each pair of points (i, j)
2. Check if any other point has x-coordinate between xᵢ and xⱼ
3. If no points in between, calculate the horizontal distance |xᵢ - xⱼ|
4. Track the maximum such distance

This would be O(n³) time: O(n²) pairs, and for each pair we check O(n) other points. Even with optimization, checking all pairs is O(n²), which is too slow for typical constraints (n up to 10⁵).

The brute force fails because it doesn't recognize that:

1. Only x-coordinates matter
2. The optimal solution always involves consecutive x-values in sorted order
3. We don't need to check all pairs — sorting gives us structure to find the answer efficiently

## Optimal Solution

The optimal solution is straightforward once you realize the y-coordinates are irrelevant. We extract all x-coordinates, sort them, and find the maximum difference between consecutive values.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxWidthOfVerticalArea(points):
    """
    Find the widest vertical area between two points containing no points.

    Args:
        points: List of [x, y] coordinates

    Returns:
        Maximum width between consecutive x-coordinates after sorting
    """
    # Step 1: Extract all x-coordinates from the points
    # We only care about horizontal positions for vertical areas
    x_coords = [x for x, _ in points]

    # Step 2: Sort the x-coordinates in ascending order
    # Sorting allows us to easily find consecutive points
    x_coords.sort()

    # Step 3: Initialize max_width to track the largest gap found
    max_width = 0

    # Step 4: Iterate through sorted x-coordinates
    # Compare each pair of consecutive x-values
    for i in range(1, len(x_coords)):
        # Calculate the horizontal distance between current and previous x
        current_width = x_coords[i] - x_coords[i - 1]

        # Update max_width if we found a larger gap
        # Note: We use max() instead of if statement for cleaner code
        max_width = max(max_width, current_width)

    # Step 5: Return the maximum width found
    return max_width
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxWidthOfVerticalArea(points) {
  /**
   * Find the widest vertical area between two points containing no points.
   *
   * @param {number[][]} points - Array of [x, y] coordinates
   * @return {number} Maximum width between consecutive x-coordinates after sorting
   */

  // Step 1: Extract all x-coordinates from the points
  // We use map() to create an array containing only x-values
  const xCoords = points.map((point) => point[0]);

  // Step 2: Sort the x-coordinates in ascending order
  // Default sort converts to strings, so we need a compare function for numbers
  xCoords.sort((a, b) => a - b);

  // Step 3: Initialize maxWidth to track the largest gap found
  let maxWidth = 0;

  // Step 4: Iterate through sorted x-coordinates
  // Compare each pair of consecutive x-values
  for (let i = 1; i < xCoords.length; i++) {
    // Calculate the horizontal distance between current and previous x
    const currentWidth = xCoords[i] - xCoords[i - 1];

    // Update maxWidth if we found a larger gap
    // Math.max() is efficient and clear for this comparison
    maxWidth = Math.max(maxWidth, currentWidth);
  }

  // Step 5: Return the maximum width found
  return maxWidth;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int maxWidthOfVerticalArea(int[][] points) {
        /**
         * Find the widest vertical area between two points containing no points.
         *
         * @param points Array of [x, y] coordinates
         * @return Maximum width between consecutive x-coordinates after sorting
         */

        // Step 1: Extract all x-coordinates from the points
        // Create an array to store only x-values
        int[] xCoords = new int[points.length];
        for (int i = 0; i < points.length; i++) {
            xCoords[i] = points[i][0];
        }

        // Step 2: Sort the x-coordinates in ascending order
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(xCoords);

        // Step 3: Initialize maxWidth to track the largest gap found
        int maxWidth = 0;

        // Step 4: Iterate through sorted x-coordinates
        // Compare each pair of consecutive x-values
        for (int i = 1; i < xCoords.length; i++) {
            // Calculate the horizontal distance between current and previous x
            int currentWidth = xCoords[i] - xCoords[i - 1];

            // Update maxWidth if we found a larger gap
            // Using Math.max() for clear comparison
            maxWidth = Math.max(maxWidth, currentWidth);
        }

        // Step 5: Return the maximum width found
        return maxWidth;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Extracting x-coordinates: O(n) — we iterate through all points once
- Sorting: O(n log n) — this is the dominant operation for typical sorting algorithms
- Finding maximum gap: O(n) — single pass through sorted array
- Overall: O(n log n) dominated by the sorting step

**Space Complexity: O(n)**

- We store all x-coordinates in a separate array: O(n)
- Sorting may require additional O(log n) to O(n) space depending on the algorithm, but we typically say O(n) for the extracted array
- If we sorted in-place on the original array (modifying input), we could achieve O(1) space, but that's generally not recommended unless specified

## Common Mistakes

1. **Including y-coordinates in calculations**: The most common mistake is trying to use y-values. Remember: vertical areas extend infinitely along the y-axis, so only x-coordinates determine boundaries. If you find yourself looking at y-values, you're overcomplicating the problem.

2. **Forgetting to sort**: Some candidates try to find the maximum and minimum x-values and return their difference. This gives the total span, not the largest gap with no points inside. You must sort to find consecutive pairs.

3. **Off-by-one errors in the loop**: When iterating to find consecutive differences, starting at index 0 instead of 1 will cause an index error when accessing `i-1`. Always verify your loop bounds: `for i in range(1, len(x_coords))`.

4. **Not handling duplicate x-coordinates**: Duplicate x-values have a difference of 0, which is fine — they don't contribute to the maximum width. The code handles this naturally, but some candidates worry about needing special handling.

## When You'll See This Pattern

This problem uses the **"sort and scan for maximum gap"** pattern, which appears in several other LeetCode problems:

1. **Maximum Gap (Hard)**: The exact same pattern but with an added constraint to solve in O(n) time using bucket sort or radix sort. This is essentially a harder version of our problem.

2. **Maximum Consecutive Floors Without Special Floors (Medium)**: Given a list of special floors and total floors, find the longest sequence of consecutive non-special floors. Sort the special floors and find maximum gaps between them.

3. **Array Partition I (Easy)**: Sort the array and take alternating elements to maximize the sum of minimums in pairs. The sorting step is similar, though the objective differs.

The core insight is that when you need to find relationships between elements (gaps, pairs, sequences), sorting often gives you the structure needed for an efficient solution.

## Key Takeaways

1. **Read the problem carefully**: The phrase "vertical area extending infinitely along the y-axis" is the clue that y-coordinates don't matter. Always look for such simplifying conditions in geometry problems.

2. **Sorting transforms relationship problems**: When you need to find gaps, distances, or sequences between elements, sorting is often the first step. It converts an O(n²) pairwise comparison problem into an O(n log n) sorted scan.

3. **Consecutive elements in sorted order often hold the answer**: For "maximum gap" or "minimum difference" problems, the optimal solution typically involves consecutive elements after sorting, not arbitrary pairs.

Related problems: [Maximum Gap](/problem/maximum-gap), [Maximum Consecutive Floors Without Special Floors](/problem/maximum-consecutive-floors-without-special-floors)
