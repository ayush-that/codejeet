---
title: "How to Solve Minimum Lines to Represent a Line Chart — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Lines to Represent a Line Chart. Medium difficulty, 26.9% acceptance rate. Topics: Array, Math, Geometry, Sorting, Number Theory."
date: "2029-04-02"
category: "dsa-patterns"
tags: ["minimum-lines-to-represent-a-line-chart", "array", "math", "geometry", "medium"]
---

# How to Solve Minimum Lines to Represent a Line Chart

You're given stock price data as [day, price] points and need to find the minimum number of straight line segments needed to connect all points in order. The challenge is that points must be connected in day order, and you can only use a new line segment when the slope between consecutive points changes. This problem tests your understanding of slope calculations, precision handling, and geometric reasoning.

## Visual Walkthrough

Let's trace through an example: `stockPrices = [[1,1],[2,2],[3,3],[4,5],[5,4]]`

1. **Sort by day**: Already sorted in this case.
2. **Calculate slopes between consecutive points**:
   - Between (1,1) and (2,2): slope = (2-1)/(2-1) = 1/1 = 1
   - Between (2,2) and (3,3): slope = (3-2)/(3-2) = 1/1 = 1
   - Between (3,3) and (4,5): slope = (5-3)/(4-3) = 2/1 = 2
   - Between (4,5) and (5,4): slope = (4-5)/(5-4) = -1/1 = -1
3. **Count line segments**: We need a new segment whenever the slope changes:
   - Points 1-3 have slope 1 → 1 line segment
   - Slope changes to 2 at point 4 → new segment
   - Slope changes to -1 at point 5 → new segment
4. **Result**: 3 line segments total.

The tricky part: we can't use floating point for slope comparison due to precision issues. Between (1,7) and (2,14) the slope is 7, but floating point might represent it as 6.999999999999999.

## Brute Force Approach

A naive approach would be to calculate slopes between all consecutive points using floating point division, then count how many times the slope changes:

1. Sort points by day (if not already sorted)
2. For each consecutive pair, calculate slope as float
3. Compare current slope with previous slope
4. Count +1 whenever they differ

**Why this fails**: Floating point precision causes incorrect comparisons. For example, the slope between (1,1) and (3,2) is 0.5, and between (3,2) and (5,3) is also 0.5, but floating point might store them as 0.4999999999 and 0.5000000001, making them appear different.

Even if we use a tolerance (like `abs(slope1 - slope2) < 1e-9`), we still have issues with vertical lines (infinite slope) and the fact that we're comparing ratios, not the actual mathematical equality.

## Optimized Approach

The key insight: **Compare slopes using cross-multiplication to avoid floating point precision issues**.

Instead of comparing `(y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)`, compare `(y2-y1)*(x3-x2) == (y3-y2)*(x2-x1)`. This uses integer arithmetic and handles all cases correctly.

**Step-by-step reasoning**:

1. **Sort by x-coordinate (day)**: Points must be connected in day order.
2. **Handle edge cases**:
   - 0 or 1 point → 0 lines needed
   - 2 points → always 1 line
3. **Initialize counter**: Start with 1 line (for the first two points)
4. **Iterate through points**: For each triple of consecutive points (i-2, i-1, i):
   - Calculate `dx1 = x[i-1] - x[i-2]`, `dy1 = y[i-1] - y[i-2]`
   - Calculate `dx2 = x[i] - x[i-1]`, `dy2 = y[i] - y[i-1]`
   - Compare using cross-multiplication: `dy1 * dx2 != dy2 * dx1`
   - If slopes differ, increment line count
5. **Return line count**

**Why cross-multiplication works**:

- It avoids division, so no precision loss
- It handles vertical lines (dx=0) naturally
- It's mathematically equivalent to comparing slopes

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for processing → O(n log n)
# Space: O(1) if we sort in-place, O(n) if not
def minimumLines(stockPrices):
    # Edge cases: 0 or 1 point needs 0 lines
    if len(stockPrices) <= 1:
        return 0

    # Sort points by day (x-coordinate)
    stockPrices.sort(key=lambda x: x[0])

    # With 2 points, we always need exactly 1 line
    if len(stockPrices) == 2:
        return 1

    # Initialize line count: first two points form the first line
    lines = 1

    # Compare slopes for each triple of consecutive points
    for i in range(2, len(stockPrices)):
        # Get three consecutive points
        x1, y1 = stockPrices[i-2]
        x2, y2 = stockPrices[i-1]
        x3, y3 = stockPrices[i]

        # Calculate differences for slope comparison
        # Instead of comparing (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
        # We compare (y2-y1)*(x3-x2) != (y3-y2)*(x2-x1)
        # This avoids floating point precision issues
        dx1 = x2 - x1
        dy1 = y2 - y1
        dx2 = x3 - x2
        dy2 = y3 - y2

        # If slopes are different, we need a new line segment
        if dy1 * dx2 != dy2 * dx1:
            lines += 1

    return lines
```

```javascript
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) if we sort in-place, O(n) if not
function minimumLines(stockPrices) {
  // Edge cases: 0 or 1 point needs 0 lines
  if (stockPrices.length <= 1) {
    return 0;
  }

  // Sort points by day (x-coordinate)
  stockPrices.sort((a, b) => a[0] - b[0]);

  // With 2 points, we always need exactly 1 line
  if (stockPrices.length === 2) {
    return 1;
  }

  // Initialize line count: first two points form the first line
  let lines = 1;

  // Compare slopes for each triple of consecutive points
  for (let i = 2; i < stockPrices.length; i++) {
    // Get three consecutive points
    const [x1, y1] = stockPrices[i - 2];
    const [x2, y2] = stockPrices[i - 1];
    const [x3, y3] = stockPrices[i];

    // Calculate differences for slope comparison
    // Instead of comparing (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
    // We compare (y2-y1)*(x3-x2) != (y3-y2)*(x2-x1)
    // This avoids floating point precision issues
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x3 - x2;
    const dy2 = y3 - y2;

    // If slopes are different, we need a new line segment
    if (dy1 * dx2 !== dy2 * dx1) {
      lines++;
    }
  }

  return lines;
}
```

```java
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) if we sort in-place, O(n) if not
public int minimumLines(int[][] stockPrices) {
    // Edge cases: 0 or 1 point needs 0 lines
    if (stockPrices.length <= 1) {
        return 0;
    }

    // Sort points by day (x-coordinate)
    Arrays.sort(stockPrices, (a, b) -> Integer.compare(a[0], b[0]));

    // With 2 points, we always need exactly 1 line
    if (stockPrices.length == 2) {
        return 1;
    }

    // Initialize line count: first two points form the first line
    int lines = 1;

    // Compare slopes for each triple of consecutive points
    for (int i = 2; i < stockPrices.length; i++) {
        // Get three consecutive points
        int x1 = stockPrices[i-2][0];
        int y1 = stockPrices[i-2][1];
        int x2 = stockPrices[i-1][0];
        int y2 = stockPrices[i-1][1];
        int x3 = stockPrices[i][0];
        int y3 = stockPrices[i][1];

        // Calculate differences for slope comparison
        // Instead of comparing (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
        // We compare (y2-y1)*(x3-x2) != (y3-y2)*(x2-x1)
        // This avoids floating point precision issues
        // Use long to prevent integer overflow
        long dx1 = (long)x2 - x1;
        long dy1 = (long)y2 - y1;
        long dx2 = (long)x3 - x2;
        long dy2 = (long)y3 - y2;

        // If slopes are different, we need a new line segment
        if (dy1 * dx2 != dy2 * dx1) {
            lines++;
        }
    }

    return lines;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n)

- Sorting the points takes O(n log n) time
- The single pass through the sorted array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity**: O(1) or O(n)

- If we sort in-place: O(1) extra space
- If sorting creates a new array: O(n) extra space
- The algorithm itself uses only O(1) extra variables

## Common Mistakes

1. **Not sorting by day**: The problem says points are given in arbitrary order. If you don't sort first, you'll connect points in the wrong order and get incorrect results.

2. **Using floating point for slope comparison**: This is the most common mistake. Floating point precision causes `0.1 + 0.2 != 0.3` type issues. Always use cross-multiplication for exact comparison.

3. **Integer overflow in cross-multiplication**: When days and prices can be up to 10^9, multiplying differences can exceed 32-bit integer range. Use 64-bit integers (long in Java, BigInt in JavaScript if needed).

4. **Off-by-one in line counting**: Remember that n points need at least 1 line. Start with `lines = 1` (for the first two points) and increment when slope changes.

5. **Forgetting edge cases**: Handle 0 points (0 lines), 1 point (0 lines), and 2 points (always 1 line) separately.

## When You'll See This Pattern

This pattern of **comparing ratios without division** appears in several geometry problems:

1. **Max Points on a Line (Hard)**: Find the maximum number of points that lie on the same straight line. Uses the same cross-multiplication technique to group points by slope.

2. **Minimum Number of Lines to Cover Points (Medium)**: Similar to this problem but points don't need to be connected in order. Uses slope comparison to determine collinearity.

3. **Check If It Is a Straight Line (Easy)**: Determine if all points lie on a single straight line. Uses cross-multiplication to check if all consecutive slopes are equal.

The core technique is: when comparing slopes `(y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)`, use `(y2-y1)*(x3-x2) == (y3-y2)*(x2-x1)` instead to avoid precision issues.

## Key Takeaways

1. **Always sort coordinate-based problems** unless explicitly told they're pre-sorted. The order matters for line segments.

2. **Never use floating point for exact comparisons** of ratios. Use cross-multiplication to compare slopes exactly with integer arithmetic.

3. **Watch for integer overflow** when multiplying large numbers. Use 64-bit integers when values can be up to 10^9.

4. **The minimum lines problem reduces to counting slope changes** between consecutive point pairs when points are sorted.

Related problems: [Max Points on a Line](/problem/max-points-on-a-line), [Minimum Number of Lines to Cover Points](/problem/minimum-number-of-lines-to-cover-points)
