---
title: "How to Solve Count Number of Rectangles Containing Each Point — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Rectangles Containing Each Point. Medium difficulty, 37.4% acceptance rate. Topics: Array, Hash Table, Binary Search, Binary Indexed Tree, Sorting."
date: "2029-09-22"
category: "dsa-patterns"
tags:
  [
    "count-number-of-rectangles-containing-each-point",
    "array",
    "hash-table",
    "binary-search",
    "medium",
  ]
---

## How to Solve Count Number of Rectangles Containing Each Point

You’re given a list of axis-aligned rectangles (each defined by its length `li` and height `hi`) and a list of points. For each point, you need to count how many rectangles contain it. A rectangle contains a point if the point’s x-coordinate is ≤ the rectangle’s length **and** the point’s y-coordinate is ≤ the rectangle’s height. The challenge is that rectangles and points can each number up to 10⁵, making a brute-force check of every point against every rectangle far too slow.

What makes this problem interesting is the two-dimensional constraint. You can’t just sort by one dimension—you need a way to efficiently query rectangles that satisfy **both** the x and y conditions for each point.

---

## Visual Walkthrough

Let’s walk through a small example to build intuition.

**Input:**

```
rectangles = [[1, 2], [2, 3], [2, 5]]
points = [[2, 1], [1, 4]]
```

We want to know, for each point, how many rectangles have `li ≥ xj` and `hi ≥ yj`.

**Step 1 – Understanding containment**

- Rectangle `[1, 2]`: length=1, height=2
- Rectangle `[2, 3]`: length=2, height=3
- Rectangle `[2, 5]`: length=2, height=5

**Step 2 – Check point [2, 1]**

- Need rectangles with length ≥ 2 and height ≥ 1.
- Check each rectangle:
  - `[1, 2]`: length=1 (< 2) ❌
  - `[2, 3]`: length=2 (≥2), height=3 (≥1) ✅
  - `[2, 5]`: length=2 (≥2), height=5 (≥1) ✅
- Count = 2

**Step 3 – Check point [1, 4]**

- Need rectangles with length ≥ 1 and height ≥ 4.
- Check each:
  - `[1, 2]`: length=1 (≥1), height=2 (<4) ❌
  - `[2, 3]`: length=2 (≥1), height=3 (<4) ❌
  - `[2, 5]`: length=2 (≥1), height=5 (≥4) ✅
- Count = 1

**Output:** `[2, 1]`

The brute force approach works here, but with up to 10⁵ rectangles and 10⁵ points, checking every pair would take ~10¹⁰ operations, which is infeasible.

---

## Brute Force Approach

The straightforward solution is to iterate through each point and check every rectangle to see if it satisfies both conditions.

**Why it’s too slow:**

- Time complexity: O(n × m) where n = number of points, m = number of rectangles.
- In the worst case (10⁵ points and 10⁵ rectangles), that’s 10¹⁰ operations.
- Even with efficient per-check O(1) comparisons, this will time out.

**Brute force code (for illustration):**

<div class="code-group">

```python
# Time: O(n * m) | Space: O(1) excluding output
def countRectangles(rectangles, points):
    result = []
    for x, y in points:
        count = 0
        for l, h in rectangles:
            if x <= l and y <= h:
                count += 1
        result.append(count)
    return result
```

```javascript
// Time: O(n * m) | Space: O(1) excluding output
function countRectangles(rectangles, points) {
  const result = [];
  for (const [x, y] of points) {
    let count = 0;
    for (const [l, h] of rectangles) {
      if (x <= l && y <= h) {
        count++;
      }
    }
    result.push(count);
  }
  return result;
}
```

```java
// Time: O(n * m) | Space: O(1) excluding output
public int[] countRectangles(int[][] rectangles, int[][] points) {
    int[] result = new int[points.length];
    for (int i = 0; i < points.length; i++) {
        int x = points[i][0], y = points[i][1];
        int count = 0;
        for (int[] rect : rectangles) {
            int l = rect[0], h = rect[1];
            if (x <= l && y <= h) {
                count++;
            }
        }
        result[i] = count;
    }
    return result;
}
```

</div>

We need a smarter way to avoid checking every rectangle for every point.

---

## Optimized Approach

The key insight is to **decouple the two dimensions**:

1. For a given point `(x, y)`, we only care about rectangles with `length ≥ x`.
2. Among those rectangles, we need to count how many have `height ≥ y`.

**Step-by-step reasoning:**

1. **Group rectangles by height**: Since heights are integers up to 100, we can create an array `height_to_lengths` where `height_to_lengths[h]` stores a list of all lengths of rectangles with that height.
2. **Sort the length lists**: For each height, sort the lengths. Then, for a point `(x, y)`, to find rectangles with `height ≥ y` and `length ≥ x`, we can:
   - Iterate over all possible heights from `y` to 100.
   - For each height `h`, binary search the sorted lengths list to find how many lengths are `≥ x`.
3. **Why this works**:
   - Heights are limited to 100, so iterating over heights is cheap.
   - Binary search on sorted lengths gives O(log m) per height.
   - Total per point: O(100 × log m) which is efficient.

**Optimization detail**: Instead of iterating heights from `y` to 100 for each point, we can precompute prefix structures, but the height limit of 100 makes the direct iteration acceptable.

---

## Optimal Solution

We implement the grouped-by-height approach with binary search.

<div class="code-group">

```python
# Time: O(n * 100 * log m) where n=points, m=rectangles | Space: O(m + 100)
def countRectangles(rectangles, points):
    # Step 1: Group rectangles by height
    # heights range from 1 to 100 inclusive
    height_to_lengths = [[] for _ in range(101)]
    for l, h in rectangles:
        height_to_lengths[h].append(l)

    # Step 2: Sort length lists for binary search
    for h in range(101):
        height_to_lengths[h].sort()

    # Step 3: Process each point
    result = []
    for x, y in points:
        count = 0
        # Check all heights >= y
        for h in range(y, 101):
            lengths = height_to_lengths[h]
            if not lengths:
                continue
            # Binary search to find first length >= x
            left, right = 0, len(lengths)
            while left < right:
                mid = (left + right) // 2
                if lengths[mid] < x:
                    left = mid + 1
                else:
                    right = mid
            # All lengths from left to end satisfy length >= x
            count += len(lengths) - left
        result.append(count)
    return result
```

```javascript
// Time: O(n * 100 * log m) | Space: O(m + 100)
function countRectangles(rectangles, points) {
  // Step 1: Group rectangles by height (1 to 100)
  const heightToLengths = Array.from({ length: 101 }, () => []);
  for (const [l, h] of rectangles) {
    heightToLengths[h].push(l);
  }

  // Step 2: Sort length lists for binary search
  for (let h = 1; h <= 100; h++) {
    heightToLengths[h].sort((a, b) => a - b);
  }

  // Step 3: Process each point
  const result = [];
  for (const [x, y] of points) {
    let count = 0;
    // Check all heights >= y
    for (let h = y; h <= 100; h++) {
      const lengths = heightToLengths[h];
      if (lengths.length === 0) continue;

      // Binary search to find first length >= x
      let left = 0,
        right = lengths.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (lengths[mid] < x) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      // All lengths from left to end satisfy length >= x
      count += lengths.length - left;
    }
    result.push(count);
  }
  return result;
}
```

```java
// Time: O(n * 100 * log m) | Space: O(m + 100)
public int[] countRectangles(int[][] rectangles, int[][] points) {
    // Step 1: Group rectangles by height (1 to 100)
    List<Integer>[] heightToLengths = new ArrayList[101];
    for (int i = 0; i <= 100; i++) {
        heightToLengths[i] = new ArrayList<>();
    }
    for (int[] rect : rectangles) {
        int l = rect[0], h = rect[1];
        heightToLengths[h].add(l);
    }

    // Step 2: Sort length lists for binary search
    for (int h = 1; h <= 100; h++) {
        Collections.sort(heightToLengths[h]);
    }

    // Step 3: Process each point
    int[] result = new int[points.length];
    for (int i = 0; i < points.length; i++) {
        int x = points[i][0], y = points[i][1];
        int count = 0;
        // Check all heights >= y
        for (int h = y; h <= 100; h++) {
            List<Integer> lengths = heightToLengths[h];
            if (lengths.isEmpty()) continue;

            // Binary search to find first length >= x
            int left = 0, right = lengths.size();
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (lengths.get(mid) < x) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            // All lengths from left to end satisfy length >= x
            count += lengths.size() - left;
        }
        result[i] = count;
    }
    return result;
}
```

</div>

---

## Complexity Analysis

**Time Complexity:**

- Grouping rectangles: O(m) where m = number of rectangles
- Sorting length lists: O(m log m) in total (each rectangle sorted into its height bucket)
- Processing points: For each of n points, we iterate over at most 100 heights and perform binary search (O(log m)) per height → O(n × 100 × log m)
- **Total: O(m log m + n × 100 × log m)** which is efficient for m, n ≤ 10⁵.

**Space Complexity:**

- O(m + 100) to store the grouped rectangles and the result array.
- The height buckets store all rectangle lengths exactly once.

---

## Common Mistakes

1. **Forgetting to sort the length lists**: Binary search requires sorted data. If you skip sorting, the binary search won’t work correctly.
2. **Off-by-one in height iteration**: The problem states heights are between 1 and 100 inclusive. Iterating from `y` to 100 (inclusive) is correct. Starting from `y+1` or ending at 99 would miss rectangles.
3. **Incorrect binary search implementation**: When finding the first length ≥ x, use the standard lower-bound binary search pattern. A common mistake is to write a search that finds if x exists rather than the first element ≥ x.
4. **Not handling empty length lists**: When a height has no rectangles, skip it to avoid index errors during binary search.

---

## When You’ll See This Pattern

This problem combines **grouping by one dimension** and **binary search on the other**—a pattern useful for multi-dimensional range queries where one dimension has limited range.

**Related problems:**

1. **Queries on Number of Points Inside a Circle** (LeetCode 1828): Similar 2D query problem where you count points within a radius. The optimization often involves spatial partitioning or sorting by distance.
2. **Count Items Matching a Rule** (LeetCode 1773): Simpler version with categorical grouping.
3. **Range Sum Query 2D - Immutable** (LeetCode 304): Uses prefix sums for fast rectangle sum queries, another 2D optimization technique.

---

## Key Takeaways

1. **When one dimension has small range**, you can iterate over it and use efficient search on the other dimension. Here, height ≤ 100 lets us afford O(100) work per point.
2. **Group then sort** is a powerful pattern: Group data by one attribute, sort within groups, then use binary search for fast queries.
3. **Break 2D problems into 1D subproblems**: Instead of checking both conditions simultaneously, satisfy one condition by filtering (grouping by height), then efficiently count those satisfying the second condition (binary search on length).

---

Related problems: [Queries on Number of Points Inside a Circle](/problem/queries-on-number-of-points-inside-a-circle)
