---
title: "How to Solve Maximum Area Rectangle With Point Constraints II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Area Rectangle With Point Constraints II. Hard difficulty, 23.7% acceptance rate. Topics: Array, Math, Binary Indexed Tree, Segment Tree, Geometry."
date: "2026-09-26"
category: "dsa-patterns"
tags:
  [
    "maximum-area-rectangle-with-point-constraints-ii",
    "array",
    "math",
    "binary-indexed-tree",
    "hard",
  ]
---

# How to Solve Maximum Area Rectangle With Point Constraints II

This problem asks us to find the maximum area rectangle that can be formed using four points from a given set. The challenge is that we need to efficiently check for valid rectangles among potentially thousands of points, where a rectangle requires both parallel sides and right angles—not just any quadrilateral.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have points: (1,1), (1,3), (2,1), (2,3), (3,2), (4,2).

1. **Understanding rectangle formation**: For four points to form a rectangle, they must satisfy:
   - Two pairs of points share the same x-coordinate (vertical sides)
   - Two pairs of points share the same y-coordinate (horizontal sides)
   - The points form right angles

2. **Key observation**: If we have two points with the same x-coordinate (vertical line) and two other points with the same x-coordinate (another vertical line), AND if the y-coordinates match up properly, we have a rectangle.

   For example: (1,1) and (1,3) form a vertical line at x=1
   (2,1) and (2,3) form a vertical line at x=2

   The y-coordinates match: both have y=1 and y=3
   This gives us rectangle corners: (1,1), (1,3), (2,3), (2,1)

3. **Area calculation**: Area = |x₂ - x₁| × |y₂ - y₁|
   In our example: |2-1| × |3-1| = 1 × 2 = 2

The tricky part is efficiently finding all such matching y-coordinate pairs between different x-coordinates.

## Brute Force Approach

The most straightforward approach would be to check all combinations of 4 points:

1. Generate all combinations of 4 points (n choose 4)
2. For each combination, check if they form a rectangle
3. Calculate the area and track the maximum

However, this approach has several problems:

- Time complexity: O(n⁴) for generating combinations
- Checking if 4 points form a rectangle requires additional computations
- For n=1000, this would be completely infeasible (≈ 4.1×10¹⁰ operations)

Even a slightly better brute force would be O(n³): pick 3 points, try to find the 4th. But this is still too slow for the constraints.

## Optimized Approach

The key insight is that we don't need to check arbitrary combinations of 4 points. Instead, we can:

1. **Group points by x-coordinate**: All points with the same x-value lie on a vertical line
2. **For each pair of x-values (vertical lines)**, find all y-values they have in common
3. **For each pair of common y-values**, we have a potential rectangle
4. **Track the maximum area** across all such rectangles

The optimization comes from:

- Using a hash map to group points by x-coordinate: O(n)
- For each pair of x-values, finding common y-values efficiently
- Using sorting and two-pointer technique or hash sets to find common y-values

**Step-by-step reasoning**:

1. First, group all points by their x-coordinate. Each x-value gets a list of y-values.
2. Sort these x-values (for consistent processing).
3. For each pair of x-values (x1, x2), get their y-value lists.
4. Find the intersection of these two y-lists (common y-values).
5. For each pair of common y-values (y1, y2), we have rectangle corners:
   - (x1, y1), (x1, y2), (x2, y2), (x2, y1)
6. Calculate area: |x2 - x1| × |y2 - y1|
7. Track the maximum area found.

The critical optimization is in step 4: finding common y-values efficiently. We can:

- Sort each y-list (O(k log k) for k points at that x)
- Use two-pointer technique to find intersections in O(k1 + k2) time
- Or use hash sets for O(k1 + k2) intersection

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n²) in worst case, but typically much better due to sparse points
# Space: O(n) for storing points grouped by x-coordinate
def maxAreaRectangle(xCoord, yCoord):
    """
    Find maximum area rectangle formed by four points from given coordinates.

    Args:
        xCoord: List of x-coordinates
        yCoord: List of y-coordinates

    Returns:
        Maximum area rectangle area, or 0 if no rectangle exists
    """
    from collections import defaultdict

    # Step 1: Group points by x-coordinate
    # We'll store y-values for each x in a sorted list for efficient intersection
    x_to_ys = defaultdict(list)
    for x, y in zip(xCoord, yCoord):
        x_to_ys[x].append(y)

    # Step 2: Sort y-lists for each x and sort x-values themselves
    # Sorting y-lists enables two-pointer intersection finding
    for x in x_to_ys:
        x_to_ys[x].sort()

    # Get sorted list of x-values for consistent processing
    sorted_xs = sorted(x_to_ys.keys())
    n = len(sorted_xs)

    max_area = 0

    # Step 3: Check all pairs of x-values (vertical lines)
    for i in range(n):
        x1 = sorted_xs[i]
        ys1 = x_to_ys[x1]

        # Skip x-values with less than 2 points (can't form vertical side)
        if len(ys1) < 2:
            continue

        for j in range(i + 1, n):
            x2 = sorted_xs[j]
            ys2 = x_to_ys[x2]

            # Skip if not enough points on this vertical line
            if len(ys2) < 2:
                continue

            # Step 4: Find common y-values between the two vertical lines
            # Using two-pointer technique since both lists are sorted
            common_ys = []
            p1, p2 = 0, 0

            while p1 < len(ys1) and p2 < len(ys2):
                if ys1[p1] == ys2[p2]:
                    common_ys.append(ys1[p1])
                    p1 += 1
                    p2 += 1
                elif ys1[p1] < ys2[p2]:
                    p1 += 1
                else:
                    p2 += 1

            # Step 5: For each pair of common y-values, we have a rectangle
            # We need at least 2 common y-values to form a rectangle
            if len(common_ys) >= 2:
                # The width is fixed for this x1,x2 pair
                width = abs(x2 - x1)

                # Find maximum height among consecutive common y-values
                # Consecutive y-values give the largest height for fixed width
                for k in range(1, len(common_ys)):
                    height = common_ys[k] - common_ys[k-1]
                    area = width * height
                    max_area = max(max_area, area)

    return max_area
```

```javascript
// Time: O(n²) in worst case, but typically much better due to sparse points
// Space: O(n) for storing points grouped by x-coordinate
function maxAreaRectangle(xCoord, yCoord) {
  // Step 1: Group points by x-coordinate
  const xToYs = new Map();

  for (let i = 0; i < xCoord.length; i++) {
    const x = xCoord[i];
    const y = yCoord[i];

    if (!xToYs.has(x)) {
      xToYs.set(x, []);
    }
    xToYs.get(x).push(y);
  }

  // Step 2: Sort y-lists for each x and get sorted x-values
  const sortedXs = [];
  for (const [x, ys] of xToYs) {
    if (ys.length >= 2) {
      // Only consider x with at least 2 points
      ys.sort((a, b) => a - b);
      sortedXs.push(x);
    }
  }
  sortedXs.sort((a, b) => a - b);

  let maxArea = 0;

  // Step 3: Check all pairs of x-values
  for (let i = 0; i < sortedXs.length; i++) {
    const x1 = sortedXs[i];
    const ys1 = xToYs.get(x1);

    for (let j = i + 1; j < sortedXs.length; j++) {
      const x2 = sortedXs[j];
      const ys2 = xToYs.get(x2);

      // Step 4: Find common y-values using two-pointer technique
      const commonYs = [];
      let p1 = 0,
        p2 = 0;

      while (p1 < ys1.length && p2 < ys2.length) {
        if (ys1[p1] === ys2[p2]) {
          commonYs.push(ys1[p1]);
          p1++;
          p2++;
        } else if (ys1[p1] < ys2[p2]) {
          p1++;
        } else {
          p2++;
        }
      }

      // Step 5: Calculate maximum area for this x-pair
      if (commonYs.length >= 2) {
        const width = Math.abs(x2 - x1);

        // Check all consecutive y-pairs for maximum height
        for (let k = 1; k < commonYs.length; k++) {
          const height = commonYs[k] - commonYs[k - 1];
          const area = width * height;
          maxArea = Math.max(maxArea, area);
        }
      }
    }
  }

  return maxArea;
}
```

```java
// Time: O(n²) in worst case, but typically much better due to sparse points
// Space: O(n) for storing points grouped by x-coordinate
import java.util.*;

public class Solution {
    public int maxAreaRectangle(int[] xCoord, int[] yCoord) {
        // Step 1: Group points by x-coordinate
        Map<Integer, List<Integer>> xToYs = new HashMap<>();

        for (int i = 0; i < xCoord.length; i++) {
            int x = xCoord[i];
            int y = yCoord[i];

            xToYs.putIfAbsent(x, new ArrayList<>());
            xToYs.get(x).add(y);
        }

        // Step 2: Sort y-lists and collect x-values with at least 2 points
        List<Integer> sortedXs = new ArrayList<>();
        for (Map.Entry<Integer, List<Integer>> entry : xToYs.entrySet()) {
            List<Integer> ys = entry.getValue();
            if (ys.size() >= 2) {
                Collections.sort(ys);
                sortedXs.add(entry.getKey());
            }
        }
        Collections.sort(sortedXs);

        int maxArea = 0;

        // Step 3: Check all pairs of x-values
        for (int i = 0; i < sortedXs.size(); i++) {
            int x1 = sortedXs.get(i);
            List<Integer> ys1 = xToYs.get(x1);

            for (int j = i + 1; j < sortedXs.size(); j++) {
                int x2 = sortedXs.get(j);
                List<Integer> ys2 = xToYs.get(x2);

                // Step 4: Find common y-values using two-pointer technique
                List<Integer> commonYs = new ArrayList<>();
                int p1 = 0, p2 = 0;

                while (p1 < ys1.size() && p2 < ys2.size()) {
                    if (ys1.get(p1).equals(ys2.get(p2))) {
                        commonYs.add(ys1.get(p1));
                        p1++;
                        p2++;
                    } else if (ys1.get(p1) < ys2.get(p2)) {
                        p1++;
                    } else {
                        p2++;
                    }
                }

                // Step 5: Calculate maximum area for this x-pair
                if (commonYs.size() >= 2) {
                    int width = Math.abs(x2 - x1);

                    // Check all consecutive y-pairs
                    for (int k = 1; k < commonYs.size(); k++) {
                        int height = commonYs.get(k) - commonYs.get(k - 1);
                        int area = width * height;
                        maxArea = Math.max(maxArea, area);
                    }
                }
            }
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) in the worst case, but typically much better

- Grouping points by x-coordinate: O(n)
- Sorting y-lists: O(∑ k log k) where k is points per x-value
- Processing x-pairs: O(m² × avg(k)) where m is number of x-values with ≥2 points
- In worst case (all points have same y but different x): O(n²)
- In practice, points are often sparse, making it much faster

**Space Complexity**: O(n)

- Storing points grouped by x-coordinate: O(n)
- Additional lists for common y-values: O(min(k₁, k₂)) per x-pair

## Common Mistakes

1. **Not checking for at least 2 points per x-value**: A vertical line needs at least 2 points to form a side. Always check `len(ys) >= 2` before processing.

2. **Forgetting to sort y-lists**: The two-pointer intersection technique requires sorted lists. Without sorting, you'd need O(k₁ × k₂) time to find common y-values.

3. **Calculating area incorrectly**: Remember area = width × height, where width = |x₂ - x₁| and height = |y₂ - y₁|. Some candidates mistakenly use non-consecutive y-values.

4. **Not handling duplicate points**: The problem doesn't specify unique points. If duplicates exist, they should be handled properly (our solution handles them since we store lists, not sets).

## When You'll See This Pattern

This problem uses several important patterns:

1. **Grouping by a key then processing pairs**: Similar to "Group Anagrams" (LeetCode 49) where you group strings by their sorted version, then process each group.

2. **Finding intersections of sorted lists**: The two-pointer technique for finding common elements appears in problems like "Intersection of Two Arrays" (LeetCode 349) and "Merge Sorted Arrays" (LeetCode 88).

3. **Geometric constraints for rectangle formation**: Similar to "Minimum Area Rectangle" (LeetCode 939), but here we maximize instead of minimize. Both problems use the same core insight about parallel sides and common coordinates.

## Key Takeaways

1. **Group then process**: When dealing with geometric constraints, often the first step is to group points by some property (here, x-coordinate) to reveal structure.

2. **Look for pairs, not quadruples**: Instead of checking all 4-point combinations, look for pairs of features (vertical lines) that can combine to form rectangles. This reduces O(n⁴) to O(m²) where m is often much smaller than n.

3. **Sorted data enables efficient intersections**: Whenever you need to find common elements between collections, consider if sorting them first would allow a faster O(n+m) two-pointer solution instead of O(n×m) nested loops.

Related problems: [Minimum Area Rectangle](/problem/minimum-area-rectangle)
