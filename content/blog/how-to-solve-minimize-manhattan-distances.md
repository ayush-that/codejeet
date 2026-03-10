---
title: "How to Solve Minimize Manhattan Distances — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimize Manhattan Distances. Hard difficulty, 32.8% acceptance rate. Topics: Array, Math, Geometry, Sorting, Ordered Set."
date: "2026-05-19"
category: "dsa-patterns"
tags: ["minimize-manhattan-distances", "array", "math", "geometry", "hard"]
---

# How to Solve Minimize Manhattan Distances

This problem asks us to find the minimum possible value for the maximum Manhattan distance between any two points after removing exactly one point from the array. The Manhattan distance between points (x₁, y₁) and (x₂, y₂) is |x₁ - x₂| + |y₁ - y₂|. What makes this problem tricky is that we need to minimize the _maximum_ distance, not the average or sum, and we can only remove one point to achieve this.

## Visual Walkthrough

Let's trace through a small example: `points = [[1,2], [3,4], [5,6], [7,8]]`

Without removing any point, the maximum Manhattan distance is between (1,2) and (7,8):

- Distance = |1-7| + |2-8| = 6 + 6 = 12

Now let's try removing each point:

1. Remove (1,2): Remaining points are (3,4), (5,6), (7,8)
   - Max distance between (3,4) and (7,8): |3-7| + |4-8| = 4 + 4 = 8

2. Remove (3,4): Remaining points are (1,2), (5,6), (7,8)
   - Max distance between (1,2) and (7,8): 12 (same as original)

3. Remove (5,6): Remaining points are (1,2), (3,4), (7,8)
   - Max distance between (1,2) and (7,8): 12

4. Remove (7,8): Remaining points are (1,2), (3,4), (5,6)
   - Max distance between (1,2) and (5,6): |1-5| + |2-6| = 4 + 4 = 8

The minimum possible maximum distance is 8, achieved by removing either (1,2) or (7,8).

The key insight is that for Manhattan distance, the maximum distance between any two points is determined by extreme values in the transformed coordinates (x+y and x-y), not the original x and y coordinates separately.

## Brute Force Approach

A naive approach would be:

1. For each point we could remove (n possibilities)
2. For each removal, calculate all pairwise distances among the remaining n-1 points
3. Track the maximum distance for that removal
4. Return the minimum of these maximums

The time complexity would be O(n³) since we have:

- n choices of which point to remove
- For each removal, O((n-1)²) = O(n²) pairwise distances to check
- Each distance calculation is O(1)

This is far too slow for constraints where n can be up to 10⁵. Even for n=1000, this would be 10⁹ operations.

## Optimized Approach

The key insight comes from understanding Manhattan distance properties. For two points (x₁, y₁) and (x₂, y₂):

- Manhattan distance = |x₁ - x₂| + |y₁ - y₂|
- This can be rewritten as max of four expressions:
  1. (x₁ + y₁) - (x₂ + y₂)
  2. (x₁ - y₁) - (x₂ - y₂)
  3. (x₂ + y₂) - (x₁ + y₁)
  4. (x₂ - y₂) - (x₁ - y₁)

This means the maximum Manhattan distance between any two points equals:

```
max( max(x+y) - min(x+y), max(x-y) - min(x-y) )
```

So instead of checking all pairs, we just need to track the extreme values of (x+y) and (x-y).

When removing one point, we need to check if that point was contributing to any extreme value. We can precompute:

- The two maximum and two minimum values for (x+y)
- The two maximum and two minimum values for (x-y)

Then for each potential removal, we can quickly check what the new extremes would be without that point.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumDistance(points):
    """
    Returns the minimum possible maximum Manhattan distance after removing one point.

    The key insight: Manhattan distance between two points (x1,y1) and (x2,y2) is
    max(|(x1+y1) - (x2+y2)|, |(x1-y1) - (x2-y2)|).

    So we only need to track extreme values of (x+y) and (x-y).
    """
    n = len(points)

    # Step 1: Find the two largest and two smallest values for (x+y) and (x-y)
    # We need the top 2 and bottom 2 values to handle cases where removing
    # the extreme point changes which point is now the extreme.

    # For (x+y)
    max_sum1, max_sum2 = float('-inf'), float('-inf')
    min_sum1, min_sum2 = float('inf'), float('inf')
    max_sum_idx, min_sum_idx = -1, -1

    # For (x-y)
    max_diff1, max_diff2 = float('-inf'), float('-inf')
    min_diff1, min_diff2 = float('inf'), float('inf')
    max_diff_idx, min_diff_idx = -1, -1

    # Step 2: First pass to find all extreme values and their indices
    for i, (x, y) in enumerate(points):
        s = x + y
        d = x - y

        # Update max sums (x+y)
        if s > max_sum1:
            max_sum2 = max_sum1
            max_sum1 = s
            max_sum_idx = i
        elif s > max_sum2:
            max_sum2 = s

        # Update min sums (x+y)
        if s < min_sum1:
            min_sum2 = min_sum1
            min_sum1 = s
            min_sum_idx = i
        elif s < min_sum2:
            min_sum2 = s

        # Update max diffs (x-y)
        if d > max_diff1:
            max_diff2 = max_diff1
            max_diff1 = d
            max_diff_idx = i
        elif d > max_diff2:
            max_diff2 = d

        # Update min diffs (x-y)
        if d < min_diff1:
            min_diff2 = min_diff1
            min_diff1 = d
            min_diff_idx = i
        elif d < min_diff2:
            min_diff2 = d

    # Step 3: Try removing each of the four extreme points
    # We only need to check removing points that are extremes in either sum or diff
    candidates = set([max_sum_idx, min_sum_idx, max_diff_idx, min_diff_idx])
    result = float('inf')

    for idx in candidates:
        # Calculate new extremes after removing point at index idx
        # For (x+y)
        if idx == max_sum_idx:
            new_max_sum = max_sum2
        else:
            new_max_sum = max_sum1

        if idx == min_sum_idx:
            new_min_sum = min_sum2
        else:
            new_min_sum = min_sum1

        # For (x-y)
        if idx == max_diff_idx:
            new_max_diff = max_diff2
        else:
            new_max_diff = max_diff1

        if idx == min_diff_idx:
            new_min_diff = min_diff2
        else:
            new_min_diff = min_diff1

        # The maximum Manhattan distance without point idx is
        # max(range of sums, range of diffs)
        max_dist = max(new_max_sum - new_min_sum, new_max_diff - new_min_diff)
        result = min(result, max_dist)

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function minimumDistance(points) {
  /**
   * Returns the minimum possible maximum Manhattan distance after removing one point.
   *
   * Key insight: Manhattan distance = max(|(x1+y1) - (x2+y2)|, |(x1-y1) - (x2-y2)|)
   * So we only need to track extreme values of (x+y) and (x-y).
   */
  const n = points.length;

  // Step 1: Initialize variables for tracking extremes
  // For (x+y)
  let maxSum1 = -Infinity,
    maxSum2 = -Infinity;
  let minSum1 = Infinity,
    minSum2 = Infinity;
  let maxSumIdx = -1,
    minSumIdx = -1;

  // For (x-y)
  let maxDiff1 = -Infinity,
    maxDiff2 = -Infinity;
  let minDiff1 = Infinity,
    minDiff2 = Infinity;
  let maxDiffIdx = -1,
    minDiffIdx = -1;

  // Step 2: Find extreme values and their indices
  for (let i = 0; i < n; i++) {
    const [x, y] = points[i];
    const s = x + y;
    const d = x - y;

    // Update max sums (x+y)
    if (s > maxSum1) {
      maxSum2 = maxSum1;
      maxSum1 = s;
      maxSumIdx = i;
    } else if (s > maxSum2) {
      maxSum2 = s;
    }

    // Update min sums (x+y)
    if (s < minSum1) {
      minSum2 = minSum1;
      minSum1 = s;
      minSumIdx = i;
    } else if (s < minSum2) {
      minSum2 = s;
    }

    // Update max diffs (x-y)
    if (d > maxDiff1) {
      maxDiff2 = maxDiff1;
      maxDiff1 = d;
      maxDiffIdx = i;
    } else if (d > maxDiff2) {
      maxDiff2 = d;
    }

    // Update min diffs (x-y)
    if (d < minDiff1) {
      minDiff2 = minDiff1;
      minDiff1 = d;
      minDiffIdx = i;
    } else if (d < minDiff2) {
      minDiff2 = d;
    }
  }

  // Step 3: Try removing each of the four extreme points
  const candidates = new Set([maxSumIdx, minSumIdx, maxDiffIdx, minDiffIdx]);
  let result = Infinity;

  for (const idx of candidates) {
    // Calculate new extremes after removing point at index idx
    // For (x+y)
    const newMaxSum = idx === maxSumIdx ? maxSum2 : maxSum1;
    const newMinSum = idx === minSumIdx ? minSum2 : minSum1;

    // For (x-y)
    const newMaxDiff = idx === maxDiffIdx ? maxDiff2 : maxDiff1;
    const newMinDiff = idx === minDiffIdx ? minDiff2 : minDiff1;

    // Maximum Manhattan distance without point idx
    const maxDist = Math.max(newMaxSum - newMinSum, newMaxDiff - newMinDiff);
    result = Math.min(result, maxDist);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumDistance(int[][] points) {
        /**
         * Returns the minimum possible maximum Manhattan distance after removing one point.
         *
         * Manhattan distance between (x1,y1) and (x2,y2) is
         * max(|(x1+y1) - (x2+y2)|, |(x1-y1) - (x2-y2)|).
         * So we track extreme values of (x+y) and (x-y).
         */
        int n = points.length;

        // Step 1: Initialize variables for tracking extremes
        // For (x+y)
        int maxSum1 = Integer.MIN_VALUE, maxSum2 = Integer.MIN_VALUE;
        int minSum1 = Integer.MAX_VALUE, minSum2 = Integer.MAX_VALUE;
        int maxSumIdx = -1, minSumIdx = -1;

        // For (x-y)
        int maxDiff1 = Integer.MIN_VALUE, maxDiff2 = Integer.MIN_VALUE;
        int minDiff1 = Integer.MAX_VALUE, minDiff2 = Integer.MAX_VALUE;
        int maxDiffIdx = -1, minDiffIdx = -1;

        // Step 2: Find extreme values and their indices
        for (int i = 0; i < n; i++) {
            int x = points[i][0];
            int y = points[i][1];
            int s = x + y;
            int d = x - y;

            // Update max sums (x+y)
            if (s > maxSum1) {
                maxSum2 = maxSum1;
                maxSum1 = s;
                maxSumIdx = i;
            } else if (s > maxSum2) {
                maxSum2 = s;
            }

            // Update min sums (x+y)
            if (s < minSum1) {
                minSum2 = minSum1;
                minSum1 = s;
                minSumIdx = i;
            } else if (s < minSum2) {
                minSum2 = s;
            }

            // Update max diffs (x-y)
            if (d > maxDiff1) {
                maxDiff2 = maxDiff1;
                maxDiff1 = d;
                maxDiffIdx = i;
            } else if (d > maxDiff2) {
                maxDiff2 = d;
            }

            // Update min diffs (x-y)
            if (d < minDiff1) {
                minDiff2 = minDiff1;
                minDiff1 = d;
                minDiffIdx = i;
            } else if (d < minDiff2) {
                minDiff2 = d;
            }
        }

        // Step 3: Try removing each of the four extreme points
        Set<Integer> candidates = new HashSet<>();
        candidates.add(maxSumIdx);
        candidates.add(minSumIdx);
        candidates.add(maxDiffIdx);
        candidates.add(minDiffIdx);

        int result = Integer.MAX_VALUE;

        for (int idx : candidates) {
            // Calculate new extremes after removing point at index idx
            // For (x+y)
            int newMaxSum = (idx == maxSumIdx) ? maxSum2 : maxSum1;
            int newMinSum = (idx == minSumIdx) ? minSum2 : minSum1;

            // For (x-y)
            int newMaxDiff = (idx == maxDiffIdx) ? maxDiff2 : maxDiff1;
            int newMinDiff = (idx == minDiffIdx) ? minDiff2 : minDiff1;

            // Maximum Manhattan distance without point idx
            int maxDist = Math.max(newMaxSum - newMinSum, newMaxDiff - newMinDiff);
            result = Math.min(result, maxDist);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through all points to find extreme values: O(n)
- We then check at most 4 candidate points to remove: O(1)
- Total: O(n)

**Space Complexity: O(1)**

- We only store a constant number of variables regardless of input size
- The candidate set has at most 4 elements

## Common Mistakes

1. **Checking all points for removal instead of just extremes**: Some candidates try removing every point, which would be O(n²) if done efficiently or O(n³) if done naively. The insight is that only points contributing to extreme values can affect the maximum distance.

2. **Forgetting to track second extremes**: When removing an extreme point, you need to know what the next extreme value is. If you only track the single maximum and minimum, you won't know what happens when you remove that point.

3. **Incorrect Manhattan distance transformation**: Remembering that |x₁-x₂| + |y₁-y₂| = max(|(x₁+y₁)-(x₂+y₂)|, |(x₁-y₁)-(x₂-y₂)|) is crucial. Without this transformation, you can't reduce the problem to tracking extremes.

4. **Not handling duplicate extreme values**: If multiple points share the same extreme value, removing one of them doesn't change the extreme. The solution handles this correctly because if we remove a point that's tied for extreme, the other point with the same value becomes the new extreme.

## When You'll See This Pattern

This problem uses the **extreme value tracking** pattern combined with **coordinate transformation**:

1. **Minimum Time Difference (LeetCode 539)**: Similar extreme value tracking on a circular scale.
2. **Maximum Distance to Closest Person (LeetCode 849)**: Tracking distances between extremes in a 1D array.
3. **Best Meeting Point (LeetCode 296)**: Uses Manhattan distance properties and median finding.
4. **Minimum Area Rectangle (LeetCode 939)**: Uses coordinate transformations to simplify geometry problems.

The core technique is recognizing when a 2D distance metric can be decomposed into independent 1D components, allowing you to track extremes separately.

## Key Takeaways

1. **Manhattan distance transforms**: |x₁-x₂| + |y₁-y₂| = max(|(x₁+y₁)-(x₂+y₂)|, |(x₁-y₁)-(x₂-y₂)|). This lets you work with sums and differences separately.

2. **Extreme value optimization**: When minimizing/maximizing distances, often only the extreme points matter. Track not just the single extreme but also the second extreme to handle removals.

3. **Problem decomposition**: Break complex metrics into simpler components that can be analyzed independently. This is a powerful technique for geometry and optimization problems.

[Practice this problem on CodeJeet](/problem/minimize-manhattan-distances)
