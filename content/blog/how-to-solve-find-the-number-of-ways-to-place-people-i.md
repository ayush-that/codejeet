---
title: "How to Solve Find the Number of Ways to Place People I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Number of Ways to Place People I. Medium difficulty, 64.0% acceptance rate. Topics: Array, Math, Geometry, Sorting, Enumeration."
date: "2027-03-12"
category: "dsa-patterns"
tags: ["find-the-number-of-ways-to-place-people-i", "array", "math", "geometry", "medium"]
---

# How to Solve "Find the Number of Ways to Place People I"

This problem asks us to count pairs of points `(A, B)` where point A is strictly to the left and above point B (upper-left quadrant), and there are no other points inside the rectangle formed by these two points. The challenge lies in efficiently checking the "no other points" condition without examining every point for every pair.

## Visual Walkthrough

Let's trace through an example with points: `[[1, 1], [2, 2], [3, 3]]`

We need to count pairs where:

1. `A.x < B.x` AND `A.y > B.y` (A is upper-left of B)
2. No other points exist in the rectangle with A as top-left and B as bottom-right

Let's examine all possible pairs:

**Pair ([1,1], [2,2])**:

- A.x=1 < B.x=2 ✓
- A.y=1 > B.y=2 ✗ (1 is not greater than 2)
- Not valid

**Pair ([1,1], [3,3])**:

- A.x=1 < B.x=3 ✓
- A.y=1 > B.y=3 ✗
- Not valid

**Pair ([2,2], [1,1])**:

- A.x=2 < B.x=1 ✗
- Not valid

**Pair ([2,2], [3,3])**:

- A.x=2 < B.x=3 ✓
- A.y=2 > B.y=3 ✗
- Not valid

**Pair ([3,3], [1,1])**:

- A.x=3 < B.x=1 ✗
- Not valid

**Pair ([3,3], [2,2])**:

- A.x=3 < B.x=2 ✗
- Not valid

Wait, none of these work! That's because all points are on the diagonal y=x line. Let's try a better example: `[[1, 3], [2, 1], [3, 2]]`

**Pair ([1,3], [2,1])**:

- A.x=1 < B.x=2 ✓
- A.y=3 > B.y=1 ✓
- Check rectangle between (1,3) and (2,1): Are there any points with x between 1 and 2, y between 1 and 3?
- Point [3,2] has x=3 which is >2, so not in rectangle
- Valid pair!

**Pair ([1,3], [3,2])**:

- A.x=1 < B.x=3 ✓
- A.y=3 > B.y=2 ✓
- Check rectangle: Points with x between 1 and 3, y between 2 and 3
- Point [2,1] has y=1 which is <2, so not in rectangle
- Valid pair!

**Pair ([2,1], [3,2])**:

- A.x=2 < B.x=3 ✓
- A.y=1 > B.y=2 ✗
- Not valid

Total valid pairs: 2

## Brute Force Approach

The brute force approach checks every pair of points `(i, j)` where `i ≠ j`:

1. Check if `points[i].x < points[j].x` and `points[i].y > points[j].y`
2. If yes, check all other points to see if any fall inside the rectangle
3. Count if no points are inside

This requires O(n³) time because:

- O(n²) pairs to check
- For each valid pair, O(n) points to check for being inside the rectangle

The brute force is too slow for constraints where n can be up to 1000 (would need ~10⁹ operations).

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def bruteForce(points):
    n = len(points)
    count = 0

    for i in range(n):
        for j in range(n):
            if i == j:
                continue

            # Check if A is upper-left of B
            if points[i][0] < points[j][0] and points[i][1] > points[j][1]:
                valid = True

                # Check all other points
                for k in range(n):
                    if k == i or k == j:
                        continue

                    # Check if point k is inside the rectangle
                    if (points[i][0] < points[k][0] < points[j][0] and
                        points[j][1] < points[k][1] < points[i][1]):
                        valid = False
                        break

                if valid:
                    count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(points) {
  let count = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      // Check if A is upper-left of B
      if (points[i][0] < points[j][0] && points[i][1] > points[j][1]) {
        let valid = true;

        // Check all other points
        for (let k = 0; k < n; k++) {
          if (k === i || k === j) continue;

          // Check if point k is inside the rectangle
          if (
            points[i][0] < points[k][0] &&
            points[k][0] < points[j][0] &&
            points[j][1] < points[k][1] &&
            points[k][1] < points[i][1]
          ) {
            valid = false;
            break;
          }
        }

        if (valid) count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int bruteForce(int[][] points) {
    int count = 0;
    int n = points.length;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) continue;

            // Check if A is upper-left of B
            if (points[i][0] < points[j][0] && points[i][1] > points[j][1]) {
                boolean valid = true;

                // Check all other points
                for (int k = 0; k < n; k++) {
                    if (k == i || k == j) continue;

                    // Check if point k is inside the rectangle
                    if (points[i][0] < points[k][0] && points[k][0] < points[j][0] &&
                        points[j][1] < points[k][1] && points[k][1] < points[i][1]) {
                        valid = false;
                        break;
                    }
                }

                if (valid) count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can sort the points by x-coordinate first. Then for each point B (potential bottom-right point), we only need to consider points A that come before B in the sorted order (since A.x must be < B.x).

For a fixed B, we need to count points A where:

1. A comes before B in sorted order (ensures A.x < B.x)
2. A.y > B.y (A is above B)
3. No point C exists between A and B in sorted order with y-coordinate between B.y and A.y

The third condition is the tricky part. We can maintain a running maximum y-coordinate as we iterate through points. For each B, we iterate through all A that come before it and track the maximum y-coordinate seen so far. If A.y is greater than this maximum AND greater than B.y, then there are no points between A and B in the rectangle.

Why does this work? When we iterate from left to right (sorted by x), for a given B, we check all A to its left. As we move from left to right toward B, we keep track of the maximum y-coordinate seen. If A.y is greater than all y-coordinates between A and B, then no point can be inside the rectangle formed by A and B.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numberOfPairs(points):
    """
    Count pairs (A, B) where A is upper-left of B and no points in between.

    Approach:
    1. Sort points by x, then by y (descending) for tie-breaking
    2. For each point as B (potential bottom-right), check all points before it as A
    3. Track max_y seen so far - if A.y > max_y and A.y > B.y, it's a valid pair
    """
    # Sort by x ascending, then by y descending
    # This ensures when x is equal, higher y comes first
    points.sort(key=lambda p: (p[0], -p[1]))

    n = len(points)
    count = 0

    # For each point as potential B (bottom-right)
    for i in range(n):
        # Track maximum y-coordinate seen so far while checking points to the left
        max_y = float('-inf')

        # Check all points to the left of B (potential A points)
        for j in range(i - 1, -1, -1):
            # A must be above B (A.y > B.y)
            if points[j][1] > points[i][1]:
                # If A.y is greater than all y's between A and B, no points in rectangle
                if points[j][1] > max_y:
                    count += 1
                    max_y = points[j][1]  # Update max_y for future checks
            else:
                # Even if A is not above B, update max_y for future A points
                max_y = max(max_y, points[j][1])

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numberOfPairs(points) {
  /**
   * Count pairs (A, B) where A is upper-left of B and no points in between.
   *
   * Approach:
   * 1. Sort points by x, then by y (descending) for tie-breaking
   * 2. For each point as B (potential bottom-right), check all points before it as A
   * 3. Track max_y seen so far - if A.y > max_y and A.y > B.y, it's a valid pair
   */

  // Sort by x ascending, then by y descending
  // This ensures when x is equal, higher y comes first
  points.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return b[1] - a[1]; // Descending y for same x
  });

  let count = 0;
  const n = points.length;

  // For each point as potential B (bottom-right)
  for (let i = 0; i < n; i++) {
    // Track maximum y-coordinate seen so far while checking points to the left
    let maxY = -Infinity;

    // Check all points to the left of B (potential A points)
    for (let j = i - 1; j >= 0; j--) {
      // A must be above B (A.y > B.y)
      if (points[j][1] > points[i][1]) {
        // If A.y is greater than all y's between A and B, no points in rectangle
        if (points[j][1] > maxY) {
          count++;
          maxY = points[j][1]; // Update maxY for future checks
        }
      } else {
        // Even if A is not above B, update maxY for future A points
        maxY = Math.max(maxY, points[j][1]);
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numberOfPairs(int[][] points) {
    /**
     * Count pairs (A, B) where A is upper-left of B and no points in between.
     *
     * Approach:
     * 1. Sort points by x, then by y (descending) for tie-breaking
     * 2. For each point as B (potential bottom-right), check all points before it as A
     * 3. Track max_y seen so far - if A.y > max_y and A.y > B.y, it's a valid pair
     */

    // Sort by x ascending, then by y descending
    // This ensures when x is equal, higher y comes first
    Arrays.sort(points, (a, b) -> {
        if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
        return Integer.compare(b[1], a[1]);  // Descending y for same x
    });

    int count = 0;
    int n = points.length;

    // For each point as potential B (bottom-right)
    for (int i = 0; i < n; i++) {
        // Track maximum y-coordinate seen so far while checking points to the left
        int maxY = Integer.MIN_VALUE;

        // Check all points to the left of B (potential A points)
        for (int j = i - 1; j >= 0; j--) {
            // A must be above B (A.y > B.y)
            if (points[j][1] > points[i][1]) {
                // If A.y is greater than all y's between A and B, no points in rectangle
                if (points[j][1] > maxY) {
                    count++;
                    maxY = points[j][1];  // Update maxY for future checks
                }
            } else {
                // Even if A is not above B, update maxY for future A points
                maxY = Math.max(maxY, points[j][1]);
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting takes O(n log n) time
- The nested loops: For each of n points as B, we check up to n points as A → O(n²)
- Total: O(n log n + n²) = O(n²)

**Space Complexity: O(1)** (excluding input storage)

- We only use a few variables (count, max_y, loop indices)
- Sorting may use O(log n) space for the algorithm's stack, but this is typically considered O(1) auxiliary space

## Common Mistakes

1. **Forgetting to handle points with same x-coordinate**: When two points have the same x, the one with higher y should come first in sorting. Otherwise, you might incorrectly count pairs where points are vertically aligned.

2. **Incorrect rectangle boundary check**: The condition for a point being inside the rectangle is `A.x < C.x < B.x` AND `B.y < C.y < A.y`. Common mistakes include using `≤` instead of `<` (points on the boundary don't count as inside) or mixing up the y-coordinate comparisons.

3. **Not updating max_y correctly**: When checking points to the left of B, you must update max_y even for points that aren't valid A candidates (those with y ≤ B.y). These points could still block other potential A points.

4. **O(n³) brute force attempt**: Some candidates try to optimize by only checking points between A and B in x-coordinate, but still end up with O(n³) by checking all points for each pair. The key insight is that tracking max_y eliminates the need for the inner loop.

## When You'll See This Pattern

This problem uses a **sweep line with tracking extremal values** pattern, which appears in several geometry and interval problems:

1. **Rectangle Area (LeetCode 223)**: Calculating the area of overlapping rectangles uses similar coordinate comparison logic.

2. **The Skyline Problem (LeetCode 218)**: Uses sweep line with tracking maximum height, similar to how we track max_y here.

3. **Merge Intervals (LeetCode 56)**: While not exactly the same, it involves sorting and tracking boundaries, which is a related skill.

The core pattern is: **sort by one dimension, then process in order while maintaining some statistic (max, min, count) about the other dimension**.

## Key Takeaways

1. **Sorting simplifies geometric constraints**: When dealing with "left of" or "right of" conditions, sorting by x-coordinate often reduces one dimension of the problem.

2. **Track extremal values during sweeps**: Instead of checking all points between two candidates, maintain running maximum/minimum values to answer "is there any point between?" questions in O(1) time.

3. **Handle edge cases in sorting**: When sorting 2D points, think carefully about tie-breaking. Here, we sort by x ascending, then y descending to handle vertical alignments correctly.

Related problems: [Rectangle Area](/problem/rectangle-area)
