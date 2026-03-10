---
title: "How to Solve Find Nearest Point That Has the Same X or Y Coordinate — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Nearest Point That Has the Same X or Y Coordinate. Easy difficulty, 69.9% acceptance rate. Topics: Array."
date: "2026-12-06"
category: "dsa-patterns"
tags: ["find-nearest-point-that-has-the-same-x-or-y-coordinate", "array", "easy"]
---

# How to Solve "Find Nearest Point That Has the Same X or Y Coordinate"

You're given your current location `(x, y)` and a list of points. You need to find the **index** of the nearest valid point, where "valid" means it shares either the same x-coordinate or same y-coordinate as your location. If multiple points are equally close, return the smallest index. If no valid points exist, return -1.

What makes this problem interesting is that it's not about finding the absolute closest point (like in "K Closest Points to Origin"), but only considering points that align with you along one axis. This adds a filtering step before distance calculation.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- Current location: `x = 3, y = 4`
- Points: `[[1, 2], [3, 1], [3, 6], [2, 5], [3, 4]]`

**Step 1: Identify valid points**
We check each point to see if it shares either x=3 or y=4:

- `[1, 2]`: x=1 (≠3), y=2 (≠4) → **invalid**
- `[3, 1]`: x=3 (=3), y=1 (≠4) → **valid** (shares x-coordinate)
- `[3, 6]`: x=3 (=3), y=6 (≠4) → **valid** (shares x-coordinate)
- `[2, 5]`: x=2 (≠3), y=5 (≠4) → **invalid**
- `[3, 4]`: x=3 (=3), y=4 (=4) → **valid** (shares both)

**Step 2: Calculate Manhattan distances**
For valid points, we calculate Manhattan distance: `|x1 - x2| + |y1 - y2|`

- `[3, 1]`: |3-3| + |4-1| = 0 + 3 = 3
- `[3, 6]`: |3-3| + |4-6| = 0 + 2 = 2
- `[3, 4]`: |3-3| + |4-4| = 0 + 0 = 0

**Step 3: Find minimum distance**
The smallest distance is 0 (point `[3, 4]`).

**Step 4: Return index**
The index of `[3, 4]` is 4 (0-based indexing).

**Output:** `4`

## Brute Force Approach

The brute force approach is straightforward: iterate through all points, check if each is valid, calculate its distance if valid, and track the minimum distance and corresponding index.

While this approach is actually optimal for this problem (O(n) time, O(1) space), let's think about what a truly naive candidate might try:

1. **Store all valid points in a separate array** - This uses O(n) extra space unnecessarily
2. **Calculate Euclidean distance instead of Manhattan distance** - The problem specifies Manhattan distance, though both would work for comparison purposes
3. **Sort the points by distance** - This would be O(n log n) time when O(n) is sufficient

The key insight is that we don't need to store anything beyond tracking the current best candidate. We can process each point once, check validity, calculate distance, and update our answer if we find a better (or equally good but earlier) point.

## Optimal Solution

The optimal solution processes each point exactly once. For each point:

1. Check if it's valid (shares x or y coordinate)
2. If valid, calculate Manhattan distance
3. If this distance is smaller than our current minimum, update the minimum and answer
4. If the distance equals our current minimum but the index is smaller, update the answer (to handle tie-breaking)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def nearestValidPoint(x: int, y: int, points: List[List[int]]) -> int:
    """
    Find the index of the nearest valid point.
    A point is valid if it shares the same x or y coordinate.
    """
    min_distance = float('inf')  # Initialize with infinity
    answer = -1  # Default answer if no valid points found

    # Iterate through all points with their indices
    for i, (px, py) in enumerate(points):
        # Check if point is valid (shares x or y coordinate)
        if px == x or py == y:
            # Calculate Manhattan distance
            distance = abs(px - x) + abs(py - y)

            # Update answer if we found a closer point
            # OR if same distance but smaller index (tie-breaking)
            if distance < min_distance:
                min_distance = distance
                answer = i
            # Note: We don't need to check for equal distance with smaller index
            # because we're iterating in order, so earlier indices are processed first

    return answer
```

```javascript
// Time: O(n) | Space: O(1)
function nearestValidPoint(x, y, points) {
  /**
   * Find the index of the nearest valid point.
   * A point is valid if it shares the same x or y coordinate.
   */
  let minDistance = Infinity; // Initialize with largest possible value
  let answer = -1; // Default answer if no valid points found

  // Iterate through all points with their indices
  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];

    // Check if point is valid (shares x or y coordinate)
    if (px === x || py === y) {
      // Calculate Manhattan distance
      const distance = Math.abs(px - x) + Math.abs(py - y);

      // Update answer if we found a closer point
      // OR if same distance but smaller index (tie-breaking)
      if (distance < minDistance) {
        minDistance = distance;
        answer = i;
      }
      // Note: We don't need to check for equal distance with smaller index
      // because we're iterating in order, so earlier indices are processed first
    }
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int nearestValidPoint(int x, int y, int[][] points) {
        /**
         * Find the index of the nearest valid point.
         * A point is valid if it shares the same x or y coordinate.
         */
        int minDistance = Integer.MAX_VALUE;  // Initialize with largest possible value
        int answer = -1;  // Default answer if no valid points found

        // Iterate through all points with their indices
        for (int i = 0; i < points.length; i++) {
            int px = points[i][0];
            int py = points[i][1];

            // Check if point is valid (shares x or y coordinate)
            if (px == x || py == y) {
                // Calculate Manhattan distance
                int distance = Math.abs(px - x) + Math.abs(py - y);

                // Update answer if we found a closer point
                // OR if same distance but smaller index (tie-breaking)
                if (distance < minDistance) {
                    minDistance = distance;
                    answer = i;
                }
                // Note: We don't need to check for equal distance with smaller index
                // because we're iterating in order, so earlier indices are processed first
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the `points` array exactly once
- For each point, we perform O(1) operations: validity check, distance calculation, and comparison
- Total operations: n × O(1) = O(n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space: `min_distance` and `answer` variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle the "no valid points" case**
   - **Mistake:** Returning 0 or the last index when no valid points exist
   - **Fix:** Initialize `answer = -1` and only update when a valid point is found
   - **Test case:** `x=1, y=1, points=[[2,2],[3,3]]` should return `-1`

2. **Using Euclidean distance instead of Manhattan distance**
   - **Mistake:** Calculating `sqrt((x1-x2)² + (y1-y2)²)` which is more computationally expensive
   - **Fix:** Use Manhattan distance: `|x1-x2| + |y1-y2|`
   - **Why it matters:** While both work for comparison, Manhattan is simpler and avoids floating-point operations

3. **Incorrect tie-breaking logic**
   - **Mistake:** When distances are equal, returning the larger index instead of smaller
   - **Fix:** Since we iterate from start to end, the first valid point with minimum distance automatically gets selected
   - **Alternative:** Explicitly check `if distance == minDistance && i < answer`

4. **Not checking both x AND y coordinates for validity**
   - **Mistake:** Only checking if `px == x` (missing `py == y` cases)
   - **Fix:** Use `if px == x || py == y` to check both conditions
   - **Test case:** `x=1, y=2, points=[[3,2]]` should be valid (shares y-coordinate)

## When You'll See This Pattern

This problem combines two common patterns:

1. **Filter-then-process pattern**: First filter elements based on a condition, then process the filtered subset. Similar to:
   - **"K Closest Points to Origin"** - Filtering isn't based on coordinates but on distance, then sorting
   - **"Find All Numbers Disappeared in an Array"** - Filtering numbers that don't meet certain criteria

2. **Single-pass tracking pattern**: Maintaining the "best so far" while iterating once. Similar to:
   - **"Maximum Subarray" (Kadane's Algorithm)** - Track maximum sum seen so far
   - **"Best Time to Buy and Sell Stock"** - Track minimum price and maximum profit
   - **"Majority Element" (Boyer-Moore)** - Track candidate and count

The core idea is to avoid storing all valid points and instead update your answer incrementally as you find better candidates.

## Key Takeaways

1. **Filter before processing**: When a problem requires you to work with a subset of data, check the filtering condition first before performing expensive operations. This saves unnecessary computations.

2. **Single-pass is often enough**: Many array problems can be solved in O(n) time with O(1) extra space by tracking the "best answer so far" as you iterate.

3. **Manhattan vs Euclidean distance**: Know when to use each. Manhattan distance (`|dx| + |dy|`) is simpler and avoids square roots, which is useful when you only need to compare distances (not compute actual distances).

4. **Initialize carefully**: Use appropriate initial values (`Infinity` for minimum distance, `-1` for "not found") and update only when you find valid candidates.

Related problems: [K Closest Points to Origin](/problem/k-closest-points-to-origin)
