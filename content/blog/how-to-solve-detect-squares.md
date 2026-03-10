---
title: "How to Solve Detect Squares — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Detect Squares. Medium difficulty, 52.3% acceptance rate. Topics: Array, Hash Table, Design, Counting, Data Stream."
date: "2027-05-09"
category: "dsa-patterns"
tags: ["detect-squares", "array", "hash-table", "design", "medium"]
---

# How to Solve Detect Squares

This problem asks you to design a data structure that can efficiently add points and count how many squares can be formed using a query point as one corner. The challenge is that points can have duplicates (which count as distinct), and squares can be axis-aligned but not necessarily with the query point at a specific corner—it could be any corner of the square.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we add these points:

- (1, 2)
- (1, 5)
- (3, 2)
- (3, 5)
- (1, 2) again (duplicate)

Now we query point (1, 2). How many squares can we form?

For a square, we need four points. Given our query point (1, 2), we look for other points that could form a square with it. The key insight: for axis-aligned squares, if we have two points with the same x-coordinate (vertical line) and two points with the same y-coordinate (horizontal line), we can check if the fourth point exists.

Let's find all points with x = 1 (same as query): (1, 5) and another (1, 2). For each of these, the vertical side length would be |5 - 2| = 3 or |2 - 2| = 0. A side length of 0 doesn't form a square, so we only consider (1, 5) with length 3.

Now we need points with y = 2 (same as query): (3, 2) and (1, 2). For each, we check if we can complete the square. With (1, 5) as the vertical point and (3, 2) as the horizontal point, we'd need point (3, 5) to complete the square. Does (3, 5) exist? Yes! So that's one square.

But wait, we have two (1, 2) points. So the query point (1, 2) could use either of them. And we have one (3, 2) point. So for the square using (1, 5), (3, 2), and (3, 5), we have:

- 2 choices for which (1, 2) to use as the query point
- 1 choice for (3, 2)
- 1 choice for (3, 5)
- 1 choice for (1, 5)

That's 2 × 1 × 1 × 1 = 2 squares from this configuration.

We need to count all such combinations systematically.

## Brute Force Approach

A naive approach would be: store all points in a list. When counting squares for a query point (x, y), iterate through all other points to find potential squares. For each point (x1, y1) in our list:

1. If x1 ≠ x and y1 ≠ y, it could be the diagonal opposite corner of a square
2. Check if (x1, y) and (x, y1) both exist in our list
3. If they do, count how many of each point we have and multiply the counts

The problem with this approach is efficiency. Each count query would be O(n²) where n is the number of points added so far. With up to 1000 calls to add and 500 calls to count, this could be up to 500 × (1000²) = 500 million operations, which is too slow.

## Optimized Approach

The key insight is that we don't need to check every pair of points. Instead, we can use a frequency map to quickly check if points exist. Here's the optimized strategy:

1. **Store points by frequency**: Use a hash map where the key is (x, y) and the value is how many times that point has been added. This handles duplicates efficiently.

2. **For counting squares**: Given query point (x, y):
   - Find all points with the same x-coordinate (vertical alignment with query)
   - For each such point (x, y1) where y1 ≠ y:
     - Calculate the side length: d = |y1 - y|
     - There are two possible squares:
       - Right square: Check if (x + d, y) and (x + d, y1) exist
       - Left square: Check if (x - d, y) and (x - d, y1) exist
     - For each valid square, multiply the counts of all four points

3. **Why this works**: By fixing the vertical side first, we ensure we're counting axis-aligned squares. The side length d gives us the exact positions where the other two points must be if a square exists.

## Optimal Solution

<div class="code-group">

```python
class DetectSquares:
    # Time: O(1) for add, O(n) for count where n is number of points with same x
    # Space: O(n) where n is number of unique points
    def __init__(self):
        # Dictionary to store frequency of each point
        # Key: (x, y) tuple, Value: count of how many times this point was added
        self.point_count = {}
        # Dictionary to store all y-coordinates for each x-coordinate
        # Key: x-coordinate, Value: list of y-coordinates with that x
        self.x_to_ys = {}

    def add(self, point):
        """
        Add a point to the data structure.
        point: List[int] - [x, y] coordinates
        """
        x, y = point
        key = (x, y)

        # Update the frequency count for this point
        self.point_count[key] = self.point_count.get(key, 0) + 1

        # Update the x -> y mapping for efficient lookup
        if x not in self.x_to_ys:
            self.x_to_ys[x] = []
        # Only add y if it's not already in the list for this x
        # We'll handle duplicates through the point_count dictionary
        if y not in self.x_to_ys[x]:
            self.x_to_ys[x].append(y)

    def count(self, point):
        """
        Count how many squares can be formed with the given point as a corner.
        point: List[int] - [x, y] coordinates of query point
        Returns: int - number of valid squares
        """
        x, y = point
        total = 0

        # If no points have the same x-coordinate as query point, no squares possible
        if x not in self.x_to_ys:
            return 0

        # Get all y-coordinates of points that share the same x as query point
        for y1 in self.x_to_ys[x]:
            # Skip the query point itself (we need a different point to form a side)
            if y1 == y:
                continue

            # Calculate the side length of potential square
            side_len = abs(y1 - y)

            # Check for square to the right (positive x-direction)
            x_right = x + side_len
            # Check if all required points exist for right square
            if (x_right, y) in self.point_count and (x_right, y1) in self.point_count:
                # Multiply counts of all four points
                total += (self.point_count[(x, y1)] *
                         self.point_count[(x_right, y)] *
                         self.point_count[(x_right, y1)])

            # Check for square to the left (negative x-direction)
            x_left = x - side_len
            # Check if all required points exist for left square
            if (x_left, y) in self.point_count and (x_left, y1) in self.point_count:
                # Multiply counts of all four points
                total += (self.point_count[(x, y1)] *
                         self.point_count[(x_left, y)] *
                         self.point_count[(x_left, y1)])

        return total
```

```javascript
class DetectSquares {
  constructor() {
    // Map to store frequency of each point
    // Key: string representation of point "x,y", Value: count
    this.pointCount = new Map();
    // Map to store all y-coordinates for each x-coordinate
    // Key: x-coordinate, Value: Set of y-coordinates
    this.xToYs = new Map();
  }

  /**
   * Add a point to the data structure.
   * @param {number[]} point - [x, y] coordinates
   */
  add(point) {
    const [x, y] = point;
    const key = `${x},${y}`;

    // Update frequency count for this point
    this.pointCount.set(key, (this.pointCount.get(key) || 0) + 1);

    // Update x -> y mapping
    if (!this.xToYs.has(x)) {
      this.xToYs.set(x, new Set());
    }
    this.xToYs.get(x).add(y);
  }

  /**
   * Count squares that can be formed with given point as a corner.
   * @param {number[]} point - [x, y] coordinates of query point
   * @return {number} - number of valid squares
   */
  count(point) {
    const [x, y] = point;
    let total = 0;

    // If no points share this x-coordinate, no squares possible
    if (!this.xToYs.has(x)) {
      return 0;
    }

    // Get all y-coordinates for points with same x as query
    const yCoords = this.xToYs.get(x);

    for (const y1 of yCoords) {
      // Skip the query point itself
      if (y1 === y) {
        continue;
      }

      // Calculate side length
      const sideLen = Math.abs(y1 - y);

      // Check square to the right
      const xRight = x + sideLen;
      const rightBottomKey = `${xRight},${y}`;
      const rightTopKey = `${xRight},${y1}`;
      const currentKey = `${x},${y1}`;

      if (this.pointCount.has(rightBottomKey) && this.pointCount.has(rightTopKey)) {
        total +=
          (this.pointCount.get(currentKey) || 0) *
          (this.pointCount.get(rightBottomKey) || 0) *
          (this.pointCount.get(rightTopKey) || 0);
      }

      // Check square to the left
      const xLeft = x - sideLen;
      const leftBottomKey = `${xLeft},${y}`;
      const leftTopKey = `${xLeft},${y1}`;

      if (this.pointCount.has(leftBottomKey) && this.pointCount.has(leftTopKey)) {
        total +=
          (this.pointCount.get(currentKey) || 0) *
          (this.pointCount.get(leftBottomKey) || 0) *
          (this.pointCount.get(leftTopKey) || 0);
      }
    }

    return total;
  }
}
```

```java
import java.util.*;

class DetectSquares {
    // Map to store frequency of each point
    // Key: String representation "x,y", Value: count
    private Map<String, Integer> pointCount;
    // Map to store all y-coordinates for each x-coordinate
    // Key: x-coordinate, Value: Set of y-coordinates
    private Map<Integer, Set<Integer>> xToYs;

    // Time: O(1) for add, O(n) for count where n is points with same x
    // Space: O(n) where n is number of unique points
    public DetectSquares() {
        pointCount = new HashMap<>();
        xToYs = new HashMap<>();
    }

    /**
     * Add a point to the data structure.
     * @param point - [x, y] coordinates
     */
    public void add(int[] point) {
        int x = point[0];
        int y = point[1];
        String key = x + "," + y;

        // Update frequency count
        pointCount.put(key, pointCount.getOrDefault(key, 0) + 1);

        // Update x -> y mapping
        xToYs.putIfAbsent(x, new HashSet<>());
        xToYs.get(x).add(y);
    }

    /**
     * Count squares that can be formed with given point as a corner.
     * @param point - [x, y] coordinates of query point
     * @return number of valid squares
     */
    public int count(int[] point) {
        int x = point[0];
        int y = point[1];
        int total = 0;

        // If no points share this x-coordinate, no squares possible
        if (!xToYs.containsKey(x)) {
            return 0;
        }

        // Get all y-coordinates for points with same x as query
        Set<Integer> yCoords = xToYs.get(x);

        for (int y1 : yCoords) {
            // Skip the query point itself
            if (y1 == y) {
                continue;
            }

            // Calculate side length
            int sideLen = Math.abs(y1 - y);

            // Check square to the right
            int xRight = x + sideLen;
            String rightBottomKey = xRight + "," + y;
            String rightTopKey = xRight + "," + y1;
            String currentKey = x + "," + y1;

            if (pointCount.containsKey(rightBottomKey) &&
                pointCount.containsKey(rightTopKey)) {
                total += pointCount.get(currentKey) *
                        pointCount.get(rightBottomKey) *
                        pointCount.get(rightTopKey);
            }

            // Check square to the left
            int xLeft = x - sideLen;
            String leftBottomKey = xLeft + "," + y;
            String leftTopKey = xLeft + "," + y1;

            if (pointCount.containsKey(leftBottomKey) &&
                pointCount.containsKey(leftTopKey)) {
                total += pointCount.get(currentKey) *
                        pointCount.get(leftBottomKey) *
                        pointCount.get(leftTopKey);
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `add(point)`: O(1) average case. We just update two hash maps.
- `count(point)`: O(k) where k is the number of points with the same x-coordinate as the query point. In the worst case, if all points have the same x, this could be O(n), but typically it's much less.

**Space Complexity:** O(n) where n is the number of unique points added. We store each point in the frequency map and maintain the x-to-y mapping.

## Common Mistakes

1. **Forgetting to handle duplicates properly**: Each duplicate point should count as a distinct point when forming squares. The solution must multiply counts, not just check existence.

2. **Not checking both directions for squares**: For each vertical side, there are two possible squares (left and right). Candidates often forget one direction.

3. **Incorrect side length calculation**: Using `y1 - y` without absolute value can miss squares or create negative side lengths that don't make sense geometrically.

4. **Not optimizing the lookup**: Some candidates store points in a list and iterate through all points for each count query, resulting in O(n²) time complexity instead of O(k).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with hash maps**: Similar to Two Sum (LeetCode 1) and 4Sum II (LeetCode 454), where we use hash maps to quickly check for existence and count combinations.

2. **Coordinate geometry with constraints**: Problems like Number of Islands (LeetCode 200) and Max Points on a Line (LeetCode 149) also involve reasoning about points and geometric relationships.

3. **Design problems with multiple operations**: Like LRU Cache (LeetCode 146) and Insert Delete GetRandom O(1) (LeetCode 380), this requires designing a data structure that supports different operations efficiently.

## Key Takeaways

1. **Use the right data structure for the job**: Hash maps provide O(1) lookups which are crucial for efficiency. Maintaining multiple indices (like x-to-y mapping) can optimize specific queries.

2. **Break down geometric constraints**: Instead of checking all quadruples of points, identify the constraints (axis-aligned, squares) to reduce the search space. Here, fixing one side first dramatically reduces possibilities.

3. **Handle multiplicities correctly**: When duplicates matter, store counts and multiply them when counting combinations, rather than just tracking existence.

[Practice this problem on CodeJeet](/problem/detect-squares)
