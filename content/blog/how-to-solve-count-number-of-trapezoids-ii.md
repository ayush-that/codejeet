---
title: "How to Solve Count Number of Trapezoids II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Number of Trapezoids II. Hard difficulty, 40.1% acceptance rate. Topics: Array, Hash Table, Math, Geometry."
date: "2028-05-16"
category: "dsa-patterns"
tags: ["count-number-of-trapezoids-ii", "array", "hash-table", "math", "hard"]
---

## How to Solve Count Number of Trapezoids II

You're given an array of 2D points and need to count how many unique trapezoids can be formed using any four distinct points. A trapezoid is defined as a convex quadrilateral with at least one pair of parallel sides. The challenge is that checking all combinations of 4 points would be O(n⁴), which is impossible for large inputs. The key insight is that parallel sides share the same slope, so we can group points by slope to find parallel line segments efficiently.

---

## Visual Walkthrough

Let's trace through a small example: `points = [[0,0], [1,1], [2,0], [3,1], [1,0]]`

We need to find sets of 4 points where at least one pair of opposite sides are parallel.

**Step 1: Identify parallel segments**

- Between (0,0) and (1,1): slope = 1
- Between (2,0) and (3,1): slope = 1
- These two segments are parallel!

**Step 2: Check if they can form a trapezoid**
We have points A(0,0), B(1,1), C(2,0), D(3,1). Segments AB and CD are parallel (both slope = 1). The other two sides (AC, BD) are not parallel to each other, so this is a valid trapezoid.

**Step 3: Count systematically**
Instead of checking all 4-point combinations (which would be 5 choose 4 = 5 combinations here), we can:

1. For each pair of points, compute their slope
2. Group all point pairs by slope
3. For each slope group, any two pairs that don't share points can form a trapezoid

This reduces the problem from O(n⁴) to roughly O(n²) for building slope groups, then counting combinations within each group.

---

## Brute Force Approach

A naive solution would check all combinations of 4 points:

1. Generate all combinations of 4 distinct points (n choose 4)
2. For each combination, check if it forms a convex quadrilateral
3. Check if at least one pair of opposite sides are parallel

The convex quadrilateral check alone requires verifying that no point lies inside the triangle formed by the other three, which is computationally expensive. Even worse, the time complexity is O(n⁴), which for n = 1000 would require checking about 10¹¹ combinations - completely infeasible.

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(n⁴) | Space: O(1)
def countTrapezoidsBrute(points):
    n = len(points)
    count = 0

    # Check all combinations of 4 points
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                for l in range(k+1, n):
                    p1, p2, p3, p4 = points[i], points[j], points[k], points[l]

                    # Check all permutations of the 4 points as quadrilateral vertices
                    # For each ordering, check if opposite sides are parallel
                    # This requires 3! = 6 checks per combination
                    # Implementation omitted for brevity but would be here

    return count
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n⁴) | Space: O(1)
function countTrapezoidsBrute(points) {
  const n = points.length;
  let count = 0;

  // Quadruple nested loops - extremely slow
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
          // Check if these 4 points form a trapezoid
          // Would need to check all orderings
        }
      }
    }
  }

  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n⁴) | Space: O(1)
public int countTrapezoidsBrute(int[][] points) {
    int n = points.length;
    int count = 0;

    // Four nested loops - impossible for n > 100
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                for (int l = k + 1; l < n; l++) {
                    // Check trapezoid condition
                    // Would require checking multiple orderings
                }
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 1000, n⁴ is about 10¹² operations. Even with optimizations, this is far too slow. We need a smarter approach that avoids checking all 4-point combinations explicitly.

---

## Optimized Approach

The key insight: **Two line segments are parallel if and only if they have the same slope.**

Instead of checking all 4-point combinations, we can:

1. Compute the slope between every pair of points (O(n²) pairs)
2. Group these pairs by their slope using a hash map
3. For each slope group, any two pairs that don't share endpoints can form the parallel sides of a trapezoid

**Step-by-step reasoning:**

1. **Slope representation:** We need a precise way to represent slopes to avoid floating-point errors. Use a reduced fraction (dx, dy) where:
   - dx = x2 - x1
   - dy = y2 - y1
   - Reduce by gcd so (1,2) and (2,4) become the same
   - Handle vertical lines (dx = 0) and horizontal lines (dy = 0) as special cases

2. **Grouping by slope:** For each slope, we store all point pairs (i, j) with that slope.

3. **Counting trapezoids:** For a given slope with k point pairs, we need to count how many ways to choose 2 pairs that don't share points. However, we must be careful:
   - If we choose pairs (A,B) and (C,D), we get points {A,B,C,D}
   - But the same 4 points could be counted multiple times if they have multiple parallel sides
   - We need to ensure we count each trapezoid only once

4. **Avoiding overcounting:** The cleanest approach is to iterate through all point pairs, and for each pair (as one parallel side), count how many other pairs with the same slope don't share points with it. Divide by 2 at the end since each trapezoid gets counted twice (once for each parallel side).

---

## Optimal Solution

Here's the efficient O(n²) solution:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) for storing all slopes
def countTrapezoids(points):
    from math import gcd
    from collections import defaultdict

    n = len(points)
    if n < 4:
        return 0

    # Step 1: Create a map from slope to list of point pairs with that slope
    slope_map = defaultdict(list)

    # For every pair of points
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i + 1, n):
            x2, y2 = points[j]

            # Compute slope as reduced fraction (dx, dy)
            dx = x2 - x1
            dy = y2 - y1

            # Reduce by gcd to normalize slope representation
            g = gcd(dx, dy)
            if g != 0:
                dx //= g
                dy //= g

            # Ensure consistent representation (e.g., make dx positive)
            if dx < 0 or (dx == 0 and dy < 0):
                dx = -dx
                dy = -dy

            # Store the pair indices with this slope
            slope_key = (dx, dy)
            slope_map[slope_key].append((i, j))

    # Step 2: Count trapezoids for each slope
    total_trapezoids = 0

    # For each slope group
    for pairs in slope_map.values():
        m = len(pairs)
        if m < 2:
            continue

        # We need to count pairs of pairs that don't share points
        # But we must avoid O(m²) for large m

        # Count how many times each point appears in this slope group
        point_count = [0] * n
        for i, j in pairs:
            point_count[i] += 1
            point_count[j] += 1

        # Total possible pairs of line segments = C(m, 2)
        total_pairs = m * (m - 1) // 2

        # Subtract invalid pairs (those sharing at least one point)
        invalid_pairs = 0
        for i, j in pairs:
            # For line segment (i,j), any other segment containing i or j is invalid
            # Count = (count_i - 1) + (count_j - 1) but we'll double count
            # We'll use a different approach: count for each point

            # Actually, simpler: count all pairs that share point k
            pass

        # Better approach: count for each point
        for k in range(n):
            cnt = point_count[k]
            if cnt >= 2:
                # C(cnt, 2) pairs share point k
                invalid_pairs += cnt * (cnt - 1) // 2

        # Each invalid pair was counted for each shared point, so divide by 2
        # Actually, a pair sharing 2 points was counted twice
        # Let's use inclusion-exclusion

        # Alternative simpler approach:
        valid_pairs = 0
        # For each pair (i,j), count how many pairs come after it that don't share points
        for idx1 in range(m):
            i1, j1 = pairs[idx1]
            # Track which points are used in first segment
            used_points = set([i1, j1])

            for idx2 in range(idx1 + 1, m):
                i2, j2 = pairs[idx2]
                # Check if segments share any points
                if i2 not in used_points and j2 not in used_points:
                    valid_pairs += 1

        total_trapezoids += valid_pairs

    return total_trapezoids


# More optimized version using combinatorics
def countTrapezoidsOptimized(points):
    from math import gcd
    from collections import defaultdict

    n = len(points)
    if n < 4:
        return 0

    slope_map = defaultdict(list)

    # Build slope map
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i + 1, n):
            x2, y2 = points[j]
            dx = x2 - x1
            dy = y2 - y1

            g = gcd(dx, dy)
            if g != 0:
                dx //= g
                dy //= g

            if dx < 0 or (dx == 0 and dy < 0):
                dx = -dx
                dy = -dy

            slope_map[(dx, dy)].append((i, j))

    total = 0

    # For each slope, count valid pairs of segments
    for pairs in slope_map.values():
        m = len(pairs)
        if m < 2:
            continue

        # Count occurrences of each point in this slope group
        point_count = [0] * n
        for i, j in pairs:
            point_count[i] += 1
            point_count[j] += 1

        # Total possible pairs of segments
        total_pairs = m * (m - 1) // 2

        # Subtract pairs that share at least one point
        # For each point k, C(point_count[k], 2) pairs share that point
        # But pairs sharing 2 points get subtracted twice, so add them back
        shared_one_point = 0
        shared_two_points = 0

        # Count pairs sharing at least one point
        for k in range(n):
            cnt = point_count[k]
            if cnt >= 2:
                shared_one_point += cnt * (cnt - 1) // 2

        # Count pairs sharing both points (same segment counted twice in different order)
        # Actually, each pair of identical segments would be counted
        # But we don't have identical segments since i < j always

        # Pairs sharing exactly 2 points: segments that share both endpoints
        # This can't happen with our representation since (i,j) is unique

        # However, we overcounted: a pair sharing 2 endpoints doesn't exist in our list
        # But a pair sharing 1 point gets counted for that point
        # A pair sharing 2 points would get counted twice (once for each point)

        # Actually simpler: use inclusion-exclusion
        invalid_pairs = 0
        for k in range(n):
            cnt = point_count[k]
            invalid_pairs += cnt * (cnt - 1) // 2

        # Each pair sharing 2 points was counted twice, so we over-subtracted
        # But in our data structure, can two segments share 2 points?
        # Yes: (i,j) and (j,i) but we only store i<j, so no

        # So invalid_pairs is correct
        valid_pairs = total_pairs - invalid_pairs
        total += valid_pairs

    return total
```

```javascript
// Time: O(n²) | Space: O(n²)
function countTrapezoids(points) {
  const n = points.length;
  if (n < 4) return 0;

  // Helper function to compute GCD
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Map from slope string to list of point pairs
  const slopeMap = new Map();

  // Step 1: Compute slopes for all point pairs
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = points[j];

      let dx = x2 - x1;
      let dy = y2 - y1;

      // Reduce by GCD to normalize slope
      const g = gcd(dx, dy);
      if (g !== 0) {
        dx /= g;
        dy /= g;
      }

      // Ensure consistent representation
      if (dx < 0 || (dx === 0 && dy < 0)) {
        dx = -dx;
        dy = -dy;
      }

      // Create slope key
      const slopeKey = `${dx},${dy}`;

      if (!slopeMap.has(slopeKey)) {
        slopeMap.set(slopeKey, []);
      }
      slopeMap.get(slopeKey).push([i, j]);
    }
  }

  let total = 0;

  // Step 2: Count trapezoids for each slope
  for (const pairs of slopeMap.values()) {
    const m = pairs.length;
    if (m < 2) continue;

    // Count point occurrences in this slope group
    const pointCount = new Array(n).fill(0);
    for (const [i, j] of pairs) {
      pointCount[i]++;
      pointCount[j]++;
    }

    // Total possible pairs of segments
    const totalPairs = (m * (m - 1)) / 2;

    // Subtract invalid pairs (sharing at least one point)
    let invalidPairs = 0;
    for (let k = 0; k < n; k++) {
      const cnt = pointCount[k];
      if (cnt >= 2) {
        invalidPairs += (cnt * (cnt - 1)) / 2;
      }
    }

    // Valid pairs form trapezoids
    const validPairs = totalPairs - invalidPairs;
    total += validPairs;
  }

  return total;
}
```

```java
// Time: O(n²) | Space: O(n²)
import java.util.*;

public class Solution {
    public int countTrapezoids(int[][] points) {
        int n = points.length;
        if (n < 4) return 0;

        // Map from slope to list of point pairs
        Map<String, List<int[]>> slopeMap = new HashMap<>();

        // Step 1: Compute slopes for all point pairs
        for (int i = 0; i < n; i++) {
            int x1 = points[i][0], y1 = points[i][1];
            for (int j = i + 1; j < n; j++) {
                int x2 = points[j][0], y2 = points[j][1];

                int dx = x2 - x1;
                int dy = y2 - y1;

                // Reduce by GCD
                int g = gcd(dx, dy);
                if (g != 0) {
                    dx /= g;
                    dy /= g;
                }

                // Ensure consistent representation
                if (dx < 0 || (dx == 0 && dy < 0)) {
                    dx = -dx;
                    dy = -dy;
                }

                // Create slope key
                String slopeKey = dx + "," + dy;

                slopeMap.putIfAbsent(slopeKey, new ArrayList<>());
                slopeMap.get(slopeKey).add(new int[]{i, j});
            }
        }

        int total = 0;

        // Step 2: Count trapezoids for each slope
        for (List<int[]> pairs : slopeMap.values()) {
            int m = pairs.size();
            if (m < 2) continue;

            // Count point occurrences
            int[] pointCount = new int[n];
            for (int[] pair : pairs) {
                pointCount[pair[0]]++;
                pointCount[pair[1]]++;
            }

            // Total possible pairs of segments
            long totalPairs = (long) m * (m - 1) / 2;

            // Subtract invalid pairs
            long invalidPairs = 0;
            for (int k = 0; k < n; k++) {
                long cnt = pointCount[k];
                if (cnt >= 2) {
                    invalidPairs += cnt * (cnt - 1) / 2;
                }
            }

            // Valid pairs form trapezoids
            long validPairs = totalPairs - invalidPairs;
            total += validPairs;
        }

        return total;
    }

    private int gcd(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n²)**

- We examine all pairs of points: n choose 2 = O(n²) pairs
- For each pair, we compute slope (O(1) with GCD) and update hash map (O(1) amortized)
- Processing each slope group takes O(m) where m is number of pairs with that slope
- Sum of m across all slopes = total pairs = O(n²)
- Overall: O(n²) + O(n²) = O(n²)

**Space Complexity: O(n²)**

- We store all point pairs grouped by slope
- In worst case, all pairs could have different slopes: O(n²) entries
- Point count array is O(n) but dominated by slope map

---

## Common Mistakes

1. **Floating-point slopes:** Using float/double for slopes leads to precision errors when comparing. Always use reduced fractions (dx, dy) with GCD.

2. **Overcounting trapezoids:** Counting every pair of parallel segments without checking if they share points. Segments AB and AC both contain point A, so {A,B,C,D} with AB∥CD is fine, but {A,B,A,C} isn't valid.

3. **Missing slope normalization:** Not reducing slopes by GCD means (1,2) and (2,4) are treated as different slopes. Not handling sign consistency means (1,2) and (-1,-2) might be separate.

4. **Forgetting edge cases:**
   - Vertical lines (dx = 0): need special handling
   - Horizontal lines (dy = 0): work with general approach
   - Duplicate points: problem states distinct points, but good to verify
   - Less than 4 points: return 0 immediately

---

## When You'll See This Pattern

This "group by property then count combinations" pattern appears in many geometry and combinatorics problems:

1. **149. Max Points on a Line** - Group points by slope to find lines with most points
2. **447. Number of Boomerangs** - For each point, count distances to other points, then count permutations
3. **939. Minimum Area Rectangle** - Group points by x-coordinate, then look for pairs with same y differences

The core idea: instead of checking all n-way combinations (O(nᵏ)), identify a property that partitions the data, then count within each group more efficiently.

---

## Key Takeaways

1. **Parallel lines = same slope:** In geometry problems, parallel lines are identified by equal slopes. Represent slopes as reduced fractions to avoid precision issues.

2. **Group then count:** When asked to count k-tuples satisfying a property, look for a way to group elements by some invariant, then count combinations within groups.

3. **Combinatorial counting:** Learn to count "valid pairs" using inclusion-exclusion: total pairs minus invalid pairs (those sharing elements).

---

[Practice this problem on CodeJeet](/problem/count-number-of-trapezoids-ii)
