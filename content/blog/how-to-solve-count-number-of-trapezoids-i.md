---
title: "How to Solve Count Number of Trapezoids I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Trapezoids I. Medium difficulty, 48.0% acceptance rate. Topics: Array, Hash Table, Math, Geometry."
date: "2027-03-04"
category: "dsa-patterns"
tags: ["count-number-of-trapezoids-i", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Number of Trapezoids I

This problem asks us to count the number of horizontal trapezoids that can be formed from a set of points. A trapezoid is defined as a convex quadrilateral with at least one pair of horizontal sides (parallel to the x-axis). The tricky part is that we need to efficiently count combinations of points that satisfy geometric constraints without actually checking all possible quadrilaterals, which would be prohibitively expensive.

What makes this problem interesting is that it combines geometric reasoning with hash table optimizations. We need to recognize that horizontal sides come from points sharing the same y-coordinate, and then systematically count valid pairs of these horizontal segments.

## Visual Walkthrough

Let's work through a concrete example to build intuition. Consider these points:

```
points = [[1,2], [3,2], [5,2], [2,4], [4,4], [6,4]]
```

Visually, we have:

- Three points at y=2: (1,2), (3,2), (5,2)
- Three points at y=4: (2,4), (4,4), (6,4)

A horizontal trapezoid requires at least one pair of horizontal sides. The most straightforward way to form one is to take two points at the same y-coordinate (forming one horizontal side) and two points at another y-coordinate (forming another horizontal side).

For example:

- Take (1,2) and (3,2) from y=2 (bottom side)
- Take (2,4) and (4,4) from y=4 (top side)
- These four points form a trapezoid with two horizontal sides

The key insight: For each pair of y-coordinates (y1, y2), we can count how many pairs of points we can form at each y-level, then multiply them together. If we have `m` points at y1, we can form `C(m,2) = m*(m-1)/2` pairs. Similarly for y2 with `n` points: `C(n,2) = n*(n-1)/2`.

In our example:

- At y=2: 3 points → 3 pairs
- At y=4: 3 points → 3 pairs
- Total trapezoids between y=2 and y=4: 3 × 3 = 9

But wait! We also need to consider that a trapezoid could have only ONE horizontal side (with the other side being non-horizontal). However, the problem states "at least one pair of horizontal sides," which means we're looking for quadrilaterals with either one or two pairs of parallel sides. For our counting approach, we're actually counting quadrilaterals with TWO horizontal sides (both pairs parallel to x-axis), which is a subset of what's allowed.

Actually, let me correct that: The problem says "at least one pair of horizontal sides." A trapezoid with exactly one horizontal side would have three other sides that aren't horizontal. But in our coordinate system, if we have two points at the same y (forming a horizontal segment), and two other points not at the same y, we don't necessarily get a quadrilateral with exactly one horizontal side - we might get no quadrilateral at all if the points aren't arranged properly.

The critical realization is that for four points to form any convex quadrilateral with at least one horizontal side, we need at least two points at one y-coordinate. So our approach of counting pairs of horizontal segments between different y-levels actually counts all valid trapezoids.

## Brute Force Approach

The most straightforward approach would be to check all combinations of 4 points:

1. Generate all combinations of 4 points from the input
2. For each combination, check if they form a convex quadrilateral
3. Check if the quadrilateral has at least one pair of horizontal sides

The checking would involve:

- Verifying the points form a convex quadrilateral (no points inside the triangle formed by the other three)
- Checking if at least two points share the same y-coordinate

This brute force approach has several problems:

1. **Time complexity**: O(n⁴) for generating all 4-point combinations, where n is the number of points
2. **Geometric complexity**: Checking convexity and trapezoid properties is non-trivial
3. **Redundant work**: We're doing expensive geometric checks when we could use counting

Even for moderate n (like 1000 points), O(n⁴) is completely infeasible (10¹² operations).

## Optimized Approach

The key insight is that we don't need to check geometric properties directly. Instead, we can count combinatorially:

1. **Group points by y-coordinate**: Points with the same y-coordinate lie on a horizontal line
2. **For each y-coordinate with at least 2 points**: We can form horizontal segments by choosing any 2 points
3. **For each pair of different y-coordinates**: The number of trapezoids with horizontal sides at these two y-levels is the product of the number of point pairs at each level

Mathematically:

- Let count[y] = number of points with y-coordinate = y
- For a single y with count[y] = m, number of horizontal segments = C(m,2) = m\*(m-1)/2
- For two different y-values y1 and y2, number of trapezoids = C(count[y1], 2) × C(count[y2], 2)

We sum this product over all pairs of distinct y-values.

Why does this work? Each trapezoid is uniquely determined by:

- Choosing 2 points from one horizontal line (forming one side)
- Choosing 2 points from another horizontal line (forming the parallel side)

The quadrilateral formed by these 4 points will always have two horizontal sides (the ones we explicitly chose), satisfying the "at least one pair" condition.

## Optimal Solution

Now let's implement this efficient counting approach:

<div class="code-group">

```python
# Time: O(n + k^2) where n = number of points, k = number of unique y-values
# Space: O(k) for storing counts per y-value
def countTrapezoids(points):
    """
    Count the number of horizontal trapezoids that can be formed from given points.
    A trapezoid is defined as a convex quadrilateral with at least one pair
    of horizontal sides (parallel to x-axis).
    """
    from collections import defaultdict

    # Step 1: Count how many points share each y-coordinate
    y_count = defaultdict(int)
    for x, y in points:
        y_count[y] += 1

    # Step 2: Get list of y-values that have at least 2 points
    # We need at least 2 points at a y-level to form a horizontal segment
    y_values = [y for y, count in y_count.items() if count >= 2]

    # Step 3: Precompute C(count, 2) for each y-value
    # C(n, 2) = n * (n-1) // 2 (number of ways to choose 2 from n)
    combinations = []
    for y in y_values:
        n = y_count[y]
        combinations.append(n * (n - 1) // 2)

    # Step 4: Count trapezoids by considering all pairs of different y-values
    total = 0
    m = len(y_values)

    # For each pair of distinct y-values (i < j to avoid double counting)
    for i in range(m):
        for j in range(i + 1, m):
            # Number of trapezoids with horizontal sides at y_values[i] and y_values[j]
            # is the product of number of point pairs at each level
            total += combinations[i] * combinations[j]

    return total
```

```javascript
// Time: O(n + k^2) where n = number of points, k = number of unique y-values
// Space: O(k) for storing counts per y-value
function countTrapezoids(points) {
  /**
   * Count the number of horizontal trapezoids that can be formed from given points.
   * A trapezoid is defined as a convex quadrilateral with at least one pair
   * of horizontal sides (parallel to x-axis).
   */

  // Step 1: Count how many points share each y-coordinate
  const yCount = new Map();
  for (const [x, y] of points) {
    yCount.set(y, (yCount.get(y) || 0) + 1);
  }

  // Step 2: Get list of y-values that have at least 2 points
  // We need at least 2 points at a y-level to form a horizontal segment
  const yValues = [];
  for (const [y, count] of yCount) {
    if (count >= 2) {
      yValues.push(y);
    }
  }

  // Step 3: Precompute C(count, 2) for each y-value
  // C(n, 2) = n * (n-1) / 2 (number of ways to choose 2 from n)
  const combinations = [];
  for (const y of yValues) {
    const n = yCount.get(y);
    combinations.push((n * (n - 1)) / 2);
  }

  // Step 4: Count trapezoids by considering all pairs of different y-values
  let total = 0;
  const m = yValues.length;

  // For each pair of distinct y-values (i < j to avoid double counting)
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      // Number of trapezoids with horizontal sides at yValues[i] and yValues[j]
      // is the product of number of point pairs at each level
      total += combinations[i] * combinations[j];
    }
  }

  return total;
}
```

```java
// Time: O(n + k^2) where n = number of points, k = number of unique y-values
// Space: O(k) for storing counts per y-value
import java.util.*;

public class Solution {
    public int countTrapezoids(int[][] points) {
        /**
         * Count the number of horizontal trapezoids that can be formed from given points.
         * A trapezoid is defined as a convex quadrilateral with at least one pair
         * of horizontal sides (parallel to x-axis).
         */

        // Step 1: Count how many points share each y-coordinate
        Map<Integer, Integer> yCount = new HashMap<>();
        for (int[] point : points) {
            int y = point[1];
            yCount.put(y, yCount.getOrDefault(y, 0) + 1);
        }

        // Step 2: Get list of y-values that have at least 2 points
        // We need at least 2 points at a y-level to form a horizontal segment
        List<Integer> yValues = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : yCount.entrySet()) {
            if (entry.getValue() >= 2) {
                yValues.add(entry.getKey());
            }
        }

        // Step 3: Precompute C(count, 2) for each y-value
        // C(n, 2) = n * (n-1) / 2 (number of ways to choose 2 from n)
        List<Long> combinations = new ArrayList<>();
        for (int y : yValues) {
            long n = yCount.get(y);
            combinations.add(n * (n - 1) / 2);
        }

        // Step 4: Count trapezoids by considering all pairs of different y-values
        long total = 0;  // Use long to avoid integer overflow
        int m = yValues.size();

        // For each pair of distinct y-values (i < j to avoid double counting)
        for (int i = 0; i < m; i++) {
            for (int j = i + 1; j < m; j++) {
                // Number of trapezoids with horizontal sides at yValues[i] and yValues[j]
                // is the product of number of point pairs at each level
                total += combinations.get(i) * combinations.get(j);
            }
        }

        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k²)**

- `O(n)`: We iterate through all points once to count points per y-coordinate
- `O(k)`: We filter y-values with at least 2 points (where k is number of unique y-values)
- `O(k²)`: We iterate through all pairs of y-values to count trapezoids

In the worst case, all points have different y-coordinates, so k = n, giving O(n²). However, in practice, many points often share y-coordinates, making this efficient.

**Space Complexity: O(k)**

- We store counts for each unique y-coordinate
- We store lists of y-values and their combination counts
- k ≤ n, so worst-case O(n) when all points have different y-values

## Common Mistakes

1. **Not filtering y-values with fewer than 2 points**: If a y-coordinate has only 1 point, you can't form a horizontal segment from it. Always check `count >= 2` before including a y-value in your calculations.

2. **Double counting trapezoids**: When iterating through pairs of y-values, make sure to use `i < j` not `i != j`. Otherwise, you'll count each pair twice (once as (y1, y2) and once as (y2, y1)).

3. **Integer overflow with large counts**: When n is large (up to 1000), `n*(n-1)/2` can be up to ~500,000. Multiplying two such values gives ~2.5×10¹¹, which exceeds 32-bit integer range. Use 64-bit integers (long in Java, normal int in Python handles big integers).

4. **Misunderstanding the problem definition**: Some candidates try to check if four arbitrary points form a trapezoid. The key insight is that we only need to count, not verify geometric properties, by using the combinatorial approach.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grouping/counting by key**: Similar to "Group Anagrams" (LeetCode 49) where we group strings by their sorted version, here we group points by y-coordinate.

2. **Combinatorial counting**: Like "Number of Good Pairs" (LeetCode 1512) where we count pairs (i,j) with nums[i] == nums[j], here we count pairs of points with same y-coordinate.

3. **Pairwise products for combinations**: This pattern appears in problems like "Count Number of Maximum Bitwise-OR Subsets" where you need to count combinations across different groups.

The core technique is: when you need to count combinations across categories, first count within each category, then combine across categories using multiplication (for independent choices).

## Key Takeaways

1. **Transform geometric problems into counting problems**: Instead of checking geometric properties directly, look for combinatorial relationships that let you count valid configurations.

2. **Group by shared properties**: When points share a property (like y-coordinate), group them together. The count within each group often gives you the building blocks for the solution.

3. **Watch for integer overflow in combinatorial problems**: Products of combinations can grow very large. Always consider whether you need 64-bit integers or modular arithmetic.

[Practice this problem on CodeJeet](/problem/count-number-of-trapezoids-i)
