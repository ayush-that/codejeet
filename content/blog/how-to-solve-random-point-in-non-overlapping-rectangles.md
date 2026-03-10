---
title: "How to Solve Random Point in Non-overlapping Rectangles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Random Point in Non-overlapping Rectangles. Medium difficulty, 39.4% acceptance rate. Topics: Array, Math, Binary Search, Reservoir Sampling, Prefix Sum."
date: "2028-07-05"
category: "dsa-patterns"
tags: ["random-point-in-non-overlapping-rectangles", "array", "math", "binary-search", "medium"]
---

# How to Solve Random Point in Non-overlapping Rectangles

You're given an array of non-overlapping rectangles and need to design a system that picks a random integer point uniformly from all the points in the union of these rectangles. The challenge is that rectangles can have different areas (different numbers of integer points), so you can't just pick a rectangle uniformly at random—you must weight each rectangle by its number of integer points to ensure true uniform sampling across all points.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have:

```
rects = [[1,1,2,3], [3,3,5,5]]
```

Rectangle 1: bottom-left (1,1), top-right (2,3)

- Integer points: (1,1), (1,2), (1,3), (2,1), (2,2), (2,3) → 6 points

Rectangle 2: bottom-left (3,3), top-right (5,5)

- Integer points: (3,3), (3,4), (3,5), (4,3), (4,4), (4,5), (5,3), (5,4), (5,5) → 9 points

Total points: 6 + 9 = 15 points

If we naively pick a rectangle first (50% chance each), then pick a random point within it:

- Rectangle 1 (6 points): 50% chance × uniform over 6 points = 1/12 chance per point
- Rectangle 2 (9 points): 50% chance × uniform over 9 points = 1/18 chance per point

This is NOT uniform! Points in rectangle 1 have higher probability (1/12 ≈ 0.083) than points in rectangle 2 (1/18 ≈ 0.056).

The correct approach: Weight each rectangle by its number of points:

- Rectangle 1 weight: 6/15 = 0.4
- Rectangle 2 weight: 9/15 = 0.6

Now if we pick rectangle 1 with probability 0.4, then a random point within it:

- Rectangle 1: 0.4 × 1/6 = 1/15 chance per point
- Rectangle 2: 0.6 × 1/9 = 1/15 chance per point

Perfect uniformity! Every point has exactly 1/15 probability.

## Brute Force Approach

A naive approach would be to precompute all integer points from all rectangles, store them in a list, and then use `random.randint(0, len(points)-1)` to pick one. While this guarantees uniformity, it's extremely inefficient in both time and space.

Consider a rectangle from (0,0) to (1000,1000): it contains 1,001,001 integer points! Storing all points for multiple large rectangles would quickly exhaust memory.

Even if we generate points on the fly without storing them, we'd need to:

1. Pick a random rectangle with probability proportional to its area
2. Generate a random point within that rectangle

The challenge is step 1: we need to quickly select a rectangle weighted by its number of integer points. A brute force approach would calculate total points, generate a random number between 0 and total-1, then iterate through rectangles subtracting their point counts until we find the right rectangle. This makes `pick()` O(n) time where n is the number of rectangles.

While O(n) might be acceptable for small n, we can do better with binary search.

## Optimized Approach

The key insight is that we can use **prefix sums** of point counts to enable **binary search** for rectangle selection. Here's the step-by-step reasoning:

1. **Calculate point counts**: For each rectangle `[a,b,x,y]`, the number of integer points is `(x-a+1) * (y-b+1)`. We add 1 because both endpoints are inclusive.

2. **Build prefix sums**: Create an array where `prefix[i]` = total points in rectangles 0 through i-1. So `prefix[0] = 0`, `prefix[1] = points in rect[0]`, `prefix[2] = points in rect[0] + points in rect[1]`, etc.

3. **Random selection**: Generate a random integer `r` in `[0, total_points-1]`. We need to find which rectangle contains the r-th point (0-indexed).

4. **Binary search**: Since `prefix` is sorted, we can binary search to find the smallest index `i` where `prefix[i] > r`. This tells us rectangle `i-1` contains point `r`.

5. **Point generation**: Once we have the rectangle index, we need to map `r` to a specific point within that rectangle. The offset within rectangle `i-1` is `offset = r - prefix[i-1]`. Then we can convert this 1D offset to 2D coordinates.

6. **Coordinate calculation**: If the rectangle has width `w = x-a+1` columns, then:
   - Column = `offset % w`
   - Row = `offset // w`
   - Final point: `(a + column, b + row)`

This approach gives us O(log n) time for `pick()` after O(n) preprocessing.

## Optimal Solution

<div class="code-group">

```python
import random
import bisect

class Solution:
    """
    Time Complexity:
    - __init__: O(n) where n = number of rectangles
    - pick: O(log n) for binary search

    Space Complexity: O(n) for storing prefix sums
    """

    def __init__(self, rects: List[List[int]]):
        self.rects = rects
        self.prefix_sums = []
        total = 0

        # Step 1: Calculate prefix sums of point counts
        for a, b, x, y in rects:
            # Number of integer points in this rectangle
            # +1 because both endpoints are inclusive
            points = (x - a + 1) * (y - b + 1)
            total += points
            self.prefix_sums.append(total)

        self.total_points = total

    def pick(self) -> List[int]:
        # Step 2: Pick a random point index
        # randint is inclusive on both ends, so [0, total_points-1]
        target = random.randint(0, self.total_points - 1)

        # Step 3: Binary search to find which rectangle contains this point
        # bisect_right returns the index where target would be inserted
        # to maintain order (first index where prefix_sum > target)
        rect_index = bisect.bisect_right(self.prefix_sums, target)

        # Step 4: Get the actual rectangle
        a, b, x, y = self.rects[rect_index]

        # Step 5: Calculate offset within this rectangle
        # Points before this rectangle
        prev_sum = self.prefix_sums[rect_index - 1] if rect_index > 0 else 0
        offset = target - prev_sum

        # Step 6: Convert 1D offset to 2D coordinates
        width = x - a + 1  # Number of columns
        col = offset % width
        row = offset // width

        return [a + col, b + row]
```

```javascript
/**
 * Time Complexity:
 * - constructor: O(n) where n = number of rectangles
 * - pick: O(log n) for binary search
 *
 * Space Complexity: O(n) for storing prefix sums
 */

class Solution {
  /**
   * @param {number[][]} rects
   */
  constructor(rects) {
    this.rects = rects;
    this.prefixSums = [];
    let total = 0;

    // Step 1: Calculate prefix sums of point counts
    for (const [a, b, x, y] of rects) {
      // Number of integer points in this rectangle
      // +1 because both endpoints are inclusive
      const points = (x - a + 1) * (y - b + 1);
      total += points;
      this.prefixSums.push(total);
    }

    this.totalPoints = total;
  }

  /**
   * @return {number[]}
   */
  pick() {
    // Step 2: Pick a random point index
    // Math.random() gives [0, 1), multiply by totalPoints and floor to get [0, totalPoints-1]
    const target = Math.floor(Math.random() * this.totalPoints);

    // Step 3: Binary search to find which rectangle contains this point
    let left = 0,
      right = this.prefixSums.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefixSums[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const rectIndex = left;

    // Step 4: Get the actual rectangle
    const [a, b, x, y] = this.rects[rectIndex];

    // Step 5: Calculate offset within this rectangle
    // Points before this rectangle
    const prevSum = rectIndex > 0 ? this.prefixSums[rectIndex - 1] : 0;
    const offset = target - prevSum;

    // Step 6: Convert 1D offset to 2D coordinates
    const width = x - a + 1; // Number of columns
    const col = offset % width;
    const row = Math.floor(offset / width);

    return [a + col, b + row];
  }
}
```

```java
import java.util.Random;

class Solution {
    private int[][] rects;
    private int[] prefixSums;
    private int totalPoints;
    private Random rand;

    /**
     * Time Complexity:
     * - constructor: O(n) where n = number of rectangles
     * - pick: O(log n) for binary search
     *
     * Space Complexity: O(n) for storing prefix sums
     */
    public Solution(int[][] rects) {
        this.rects = rects;
        this.prefixSums = new int[rects.length];
        this.rand = new Random();
        int total = 0;

        // Step 1: Calculate prefix sums of point counts
        for (int i = 0; i < rects.length; i++) {
            int a = rects[i][0], b = rects[i][1], x = rects[i][2], y = rects[i][3];
            // Number of integer points in this rectangle
            // +1 because both endpoints are inclusive
            int points = (x - a + 1) * (y - b + 1);
            total += points;
            prefixSums[i] = total;
        }

        this.totalPoints = total;
    }

    public int[] pick() {
        // Step 2: Pick a random point index
        // nextInt(totalPoints) gives [0, totalPoints-1]
        int target = rand.nextInt(totalPoints);

        // Step 3: Binary search to find which rectangle contains this point
        int left = 0, right = prefixSums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (prefixSums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        int rectIndex = left;

        // Step 4: Get the actual rectangle
        int a = rects[rectIndex][0], b = rects[rectIndex][1];
        int x = rects[rectIndex][2], y = rects[rectIndex][3];

        // Step 5: Calculate offset within this rectangle
        // Points before this rectangle
        int prevSum = rectIndex > 0 ? prefixSums[rectIndex - 1] : 0;
        int offset = target - prevSum;

        // Step 6: Convert 1D offset to 2D coordinates
        int width = x - a + 1;  // Number of columns
        int col = offset % width;
        int row = offset / width;

        return new int[]{a + col, b + row};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor (`__init__`)**: O(n), where n is the number of rectangles. We iterate once through all rectangles to calculate point counts and build prefix sums.
- **`pick()` method**: O(log n) for the binary search to find the correct rectangle. The coordinate calculation is O(1).

**Space Complexity:** O(n) for storing the prefix sums array. We also store the rectangles themselves, but that's given as input.

The key advantage is that `pick()` is logarithmic rather than linear, which matters when there are many rectangles or many calls to `pick()`.

## Common Mistakes

1. **Incorrect point count calculation**: Forgetting the `+1` in `(x-a+1)*(y-b+1)`. Remember that integer points include both endpoints. A rectangle from (0,0) to (0,0) has 1 point, not 0.

2. **Off-by-one errors in binary search**: When implementing custom binary search (instead of using library functions), candidates often get the termination condition wrong. Test with edge cases: first rectangle, last rectangle, and single rectangle.

3. **Wrong rectangle probability**: Picking rectangles with equal probability instead of weighting by point count. This breaks uniformity. Always weight by `(width × height)`.

4. **Incorrect offset to coordinate conversion**: Mixing up row/column calculation or forgetting that `offset // width` gives the row and `offset % width` gives the column. Draw a small example to verify.

5. **Not handling the 0-indexed vs 1-indexed correctly**: The random target is 0-indexed (0 to total_points-1), but prefix sums are cumulative counts. The binary search finds the first prefix sum **greater than** the target, not greater than or equal.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Weighted Random Selection (Prefix Sum + Binary Search)**: Used whenever you need to select items with different probabilities. The prefix sum array lets you map a uniform random number to a weighted selection in O(log n) time.
   - **Random Pick with Weight (LC 528)**: Exactly the same pattern—prefix sums of weights followed by binary search.
   - **Random Pick Index (LC 398)**: Reservoir sampling variant for equal probability.

2. **Mapping 1D index to 2D grid**: Converting a linear index to matrix coordinates using division and modulus operations.
   - **Flatten 2D Vector (LC 251)**: Similar index mapping for iterating over 2D structures.
   - **Search a 2D Matrix (LC 74)**: Treating a 2D matrix as a 1D array for binary search.

The core technique of prefix sums + binary search appears in many problems involving ranges, cumulative frequencies, or weighted distributions.

## Key Takeaways

1. **Weighted selection requires prefix sums**: When items have different weights/ probabilities, build a prefix sum array where each entry represents the cumulative weight up to that point. A random number in `[0, total_weight)` can then be mapped to an item via binary search.

2. **Binary search on prefix sums is efficient**: O(log n) selection beats O(n) linear scanning, especially when `pick()` is called many times. This is a classic space-time tradeoff: O(n) preprocessing for O(log n) queries.

3. **Test edge cases systematically**: Single rectangle, rectangles with 1 point, large rectangles, and the first/last rectangle in the array. These often reveal off-by-one errors in the binary search or point count calculations.

Related problems: [Random Pick with Weight](/problem/random-pick-with-weight), [Generate Random Point in a Circle](/problem/generate-random-point-in-a-circle)
