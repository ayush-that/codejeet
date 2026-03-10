---
title: "How to Solve Number of Boomerangs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Boomerangs. Medium difficulty, 57.3% acceptance rate. Topics: Array, Hash Table, Math."
date: "2027-03-02"
category: "dsa-patterns"
tags: ["number-of-boomerangs", "array", "hash-table", "math", "medium"]
---

# How to Solve Number of Boomerangs

This problem asks us to count all ordered triples of points `(i, j, k)` where the distance from `i` to `j` equals the distance from `i` to `k`. The key challenge is that `i` must be the "center" point, and we need to efficiently count all pairs `(j, k)` that are equidistant from each `i`. What makes this interesting is that we're not just finding equal distances, but counting permutations of pairs that share the same distance from a common point.

## Visual Walkthrough

Let's trace through a concrete example: `points = [[0,0],[1,0],[2,0]]`

For each point as the center `i`:

1. **Center point [0,0]**:
   - Distance to [1,0] = 1
   - Distance to [2,0] = 2
   - No equal distances → 0 boomerangs

2. **Center point [1,0]**:
   - Distance to [0,0] = 1
   - Distance to [2,0] = 1
   - Two points at distance 1 from center
   - Number of ordered pairs: 2 × 1 = 2 boomerangs
     - ([1,0], [0,0], [2,0])
     - ([1,0], [2,0], [0,0])

3. **Center point [2,0]**:
   - Distance to [0,0] = 2
   - Distance to [1,0] = 1
   - No equal distances → 0 boomerangs

Total: 2 boomerangs

The pattern emerges: for each center point, we need to count how many other points are at each distance. If `n` points share the same distance from the center, they form `n × (n-1)` ordered pairs.

## Brute Force Approach

The most straightforward solution is to check all possible triples `(i, j, k)`:

1. For each point `i` as the center
2. For each point `j` where `j ≠ i`
3. For each point `k` where `k ≠ i` and `k ≠ j`
4. Check if `distance(i, j) == distance(i, k)`

This gives us O(n³) time complexity since we have three nested loops over `n` points. For each triple, we compute distances twice and compare them. With `n` up to 500 in typical constraints, this would be 500³ = 125 million operations, which is too slow.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numberOfBoomerangs_brute(points):
    n = len(points)
    count = 0

    for i in range(n):
        xi, yi = points[i]
        for j in range(n):
            if j == i:
                continue
            xj, yj = points[j]
            dist_ij = (xi - xj)**2 + (yi - yj)**2

            for k in range(n):
                if k == i or k == j:
                    continue
                xk, yk = points[k]
                dist_ik = (xi - xk)**2 + (yi - yk)**2

                if dist_ij == dist_ik:
                    count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numberOfBoomerangsBrute(points) {
  let count = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const [xi, yi] = points[i];
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const [xj, yj] = points[j];
      const distIJ = (xi - xj) ** 2 + (yi - yj) ** 2;

      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const [xk, yk] = points[k];
        const distIK = (xi - xk) ** 2 + (yi - yk) ** 2;

        if (distIJ === distIK) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numberOfBoomerangsBrute(int[][] points) {
    int count = 0;
    int n = points.length;

    for (int i = 0; i < n; i++) {
        int xi = points[i][0], yi = points[i][1];
        for (int j = 0; j < n; j++) {
            if (j == i) continue;
            int xj = points[j][0], yj = points[j][1];
            int distIJ = (xi - xj) * (xi - xj) + (yi - yj) * (yi - yj);

            for (int k = 0; k < n; k++) {
                if (k == i || k == j) continue;
                int xk = points[k][0], yk = points[k][1];
                int distIK = (xi - xk) * (xi - xk) + (yi - yk) * (yi - yk);

                if (distIJ == distIK) {
                    count++;
                }
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that for each point `i` as the center, we don't need to compare every pair `(j, k)` individually. Instead:

1. For each center point `i`, compute distances to all other points `j`
2. Group these distances using a hash map: `distance → count of points at that distance`
3. For each distance that has `n` points, those `n` points can form `n × (n-1)` ordered pairs
4. Sum this for all distances, then repeat for each center point

Why does this work? If `n` points are at the same distance from center `i`, we can choose any of them as `j` (n choices), then any of the remaining `n-1` as `k`. Since order matters in the tuple `(i, j, k)`, this gives us `n × (n-1)` permutations.

We use squared distances to avoid floating-point precision issues and because we only need to compare distances, not compute actual distances.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def numberOfBoomerangs(points):
    """
    Count all ordered triples (i, j, k) where distance(i,j) = distance(i,k).

    For each point i as center:
    1. Compute squared distances to all other points
    2. Count how many points are at each distance using a hash map
    3. For each distance with n points, add n*(n-1) to total count
    """
    total = 0
    n = len(points)

    # For each point as the center of potential boomerangs
    for i in range(n):
        x1, y1 = points[i]
        distance_count = {}

        # Calculate distances from current center to all other points
        for j in range(n):
            if i == j:
                continue  # Skip comparing point to itself

            x2, y2 = points[j]
            # Use squared distance to avoid floating-point issues
            dx = x1 - x2
            dy = y1 - y2
            dist = dx * dx + dy * dy

            # Count how many points are at this distance from center i
            distance_count[dist] = distance_count.get(dist, 0) + 1

        # For each distance, if we have n points at that distance,
        # they can form n*(n-1) ordered pairs (j, k)
        for count in distance_count.values():
            total += count * (count - 1)

    return total
```

```javascript
// Time: O(n²) | Space: O(n)
function numberOfBoomerangs(points) {
  let total = 0;
  const n = points.length;

  // For each point as the center of potential boomerangs
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    const distanceCount = new Map();

    // Calculate distances from current center to all other points
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Skip comparing point to itself

      const [x2, y2] = points[j];
      // Use squared distance to avoid floating-point issues
      const dx = x1 - x2;
      const dy = y1 - y2;
      const dist = dx * dx + dy * dy;

      // Count how many points are at this distance from center i
      distanceCount.set(dist, (distanceCount.get(dist) || 0) + 1);
    }

    // For each distance, if we have n points at that distance,
    // they can form n*(n-1) ordered pairs (j, k)
    for (const count of distanceCount.values()) {
      total += count * (count - 1);
    }
  }

  return total;
}
```

```java
// Time: O(n²) | Space: O(n)
public int numberOfBoomerangs(int[][] points) {
    int total = 0;
    int n = points.length;

    // For each point as the center of potential boomerangs
    for (int i = 0; i < n; i++) {
        int x1 = points[i][0], y1 = points[i][1];
        Map<Integer, Integer> distanceCount = new HashMap<>();

        // Calculate distances from current center to all other points
        for (int j = 0; j < n; j++) {
            if (i == j) continue;  // Skip comparing point to itself

            int x2 = points[j][0], y2 = points[j][1];
            // Use squared distance to avoid floating-point issues
            int dx = x1 - x2;
            int dy = y1 - y2;
            int dist = dx * dx + dy * dy;

            // Count how many points are at this distance from center i
            distanceCount.put(dist, distanceCount.getOrDefault(dist, 0) + 1);
        }

        // For each distance, if we have n points at that distance,
        // they can form n*(n-1) ordered pairs (j, k)
        for (int count : distanceCount.values()) {
            total += count * (count - 1);
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Outer loop runs `n` times (once for each point as center)
- Inner loop runs `n` times for each center point
- Hash map operations (insert and lookup) are O(1) on average
- Total: O(n × n) = O(n²)

**Space Complexity: O(n)**

- We store a hash map for each center point
- In the worst case, all distances from a center are unique, requiring O(n) space
- We reuse the hash map for each center, so maximum O(n) space at any time

## Common Mistakes

1. **Using actual distance instead of squared distance**: Calculating `sqrt(dx² + dy²)` introduces floating-point precision issues. Two distances that should be equal might compare as unequal due to rounding errors. Always compare squared distances when possible.

2. **Forgetting that order matters**: The problem states "the order of the tuple matters." If `n` points are at the same distance, the number of ordered pairs is `n × (n-1)`, not `n choose 2`. Candidates often use combinations instead of permutations.

3. **Including the center point in distance calculations**: Remember that `j` and `k` must be different from `i` and from each other. When building the distance map, skip `j = i`. The formula `n × (n-1)` already accounts for `j ≠ k`.

4. **Not resetting the distance map for each center**: The distance counts are specific to each center point `i`. You must create a new hash map for each center, or clear the existing one.

## When You'll See This Pattern

This "group by distance from a center" pattern appears in several geometry and hashing problems:

1. **Line Reflection (Medium)**: Given points, check if there's a line parallel to y-axis that reflects all points. You group points by their y-coordinate and check symmetry.

2. **Max Points on a Line (Hard)**: For each point, compute slopes to all other points and group by slope to find collinear points. Similar to grouping by distance here.

3. **4Sum II (Medium)**: Group sums from two arrays to reduce O(n⁴) to O(n²). The core idea of grouping intermediate results to avoid nested loops is similar.

The common theme is using a hash map to group elements by some computed property (distance, slope, sum) to transform an O(n³) or O(n⁴) problem into O(n²).

## Key Takeaways

1. **Group and count to avoid nested loops**: When you need to count pairs satisfying a condition, consider grouping elements by the property being compared. This can reduce O(n³) to O(n²).

2. **Squared distances avoid precision issues**: In geometry problems involving distance comparisons, use squared distances to work with integers and avoid floating-point errors.

3. **Order matters vs. doesn't matter**: Always check if the problem asks for ordered tuples or unordered sets. The counting formula changes from permutations to combinations.

Related problems: [Line Reflection](/problem/line-reflection)
