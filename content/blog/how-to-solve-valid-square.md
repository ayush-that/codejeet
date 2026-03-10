---
title: "How to Solve Valid Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Valid Square. Medium difficulty, 44.9% acceptance rate. Topics: Math, Geometry."
date: "2027-01-02"
category: "dsa-patterns"
tags: ["valid-square", "math", "geometry", "medium"]
---

## How to Solve Valid Square

Given four unordered points in 2D space, determine if they form a valid square. The challenge lies in handling the points in any order — they're not necessarily given in clockwise or adjacent order — and ensuring we correctly identify a square's geometric properties.

---

## Visual Walkthrough

Let's trace through an example:  
Points: `p1 = [0,0]`, `p2 = [1,1]`, `p3 = [1,0]`, `p4 = [0,1]`

Visually, these form a diamond/square rotated 45°.

**Step 1 – Calculate all distances**  
We need distances between every pair of points (6 total):

- p1-p2: √((1-0)² + (1-0)²) = √2 ≈ 1.414
- p1-p3: √((1-0)² + (0-0)²) = 1
- p1-p4: √((0-0)² + (1-0)²) = 1
- p2-p3: √((1-1)² + (0-1)²) = 1
- p2-p4: √((0-1)² + (1-1)²) = 1
- p3-p4: √((0-1)² + (1-0)²) = √2 ≈ 1.414

**Step 2 – Sort distances**  
Sorted: [1, 1, 1, 1, 1.414, 1.414]

**Step 3 – Check square properties**  
For a valid square:

1. The first 4 distances (shortest) must be equal → sides
2. The last 2 distances (longest) must be equal → diagonals
3. All distances > 0 (no duplicate points)
4. Diagonal length = side length × √2 (ensures 90° angles)

Here: 4 sides = 1, 2 diagonals = √2, and √2 = 1 × √2 ✓

---

## Brute Force Approach

A naive approach might try all permutations of point orders (4! = 24) and check if each consecutive pair forms equal sides and right angles. For each permutation:

1. Check if all four sides are equal
2. Check if one angle is 90° (using dot product)
3. Repeat for all permutations

**Why this fails:**

- 24 permutations is manageable, but the logic is error-prone
- Must handle floating-point precision carefully
- Doesn't generalize well to similar problems
- More code than necessary for an interview setting

The brute force teaches us that order matters, but there's a cleaner mathematical insight.

---

## Optimized Approach

**Key Insight:** In a square, there are only 2 unique distances between points:

1. Side length (appears 4 times)
2. Diagonal length (appears 2 times)

Additionally:

- All distances must be positive (no duplicate points)
- Diagonal² = 2 × Side² (Pythagorean theorem for 90° angles)

**Step-by-step reasoning:**

1. Calculate all 6 pairwise distances
2. Sort them to group equal distances together
3. Check:
   - First 4 are equal (sides)
   - Last 2 are equal (diagonals)
   - All distances > 0
   - Diagonal² = 2 × Side² (ensures right angles)

**Why this works regardless of order:**  
A square has 4 equal sides and 2 equal diagonals. By checking the distance distribution, we're testing the fundamental geometric property without needing to know point adjacency.

**Handling floating-point precision:**  
We compare squared distances (integers) instead of distances (floats) to avoid precision issues.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) - constant 6 distance calculations
# Space: O(1) - constant space for 6 distances
def validSquare(p1, p2, p3, p4):
    # Helper to calculate squared distance between two points
    def dist_sq(point_a, point_b):
        return (point_a[0] - point_b[0]) ** 2 + (point_a[1] - point_b[1]) ** 2

    # Calculate all 6 pairwise squared distances
    distances = [
        dist_sq(p1, p2),
        dist_sq(p1, p3),
        dist_sq(p1, p4),
        dist_sq(p2, p3),
        dist_sq(p2, p4),
        dist_sq(p3, p4)
    ]

    # Sort to group equal distances together
    distances.sort()

    # Check square properties:
    # 1. First 4 must be equal (sides) and > 0
    # 2. Last 2 must be equal (diagonals)
    # 3. Diagonal should be 2 × side (for 90° angle)
    return (
        distances[0] > 0 and  # No zero-length sides
        distances[0] == distances[1] == distances[2] == distances[3] and  # 4 equal sides
        distances[4] == distances[5] and  # 2 equal diagonals
        distances[4] == 2 * distances[0]  # Right angle check
    )
```

```javascript
// Time: O(1) - constant 6 distance calculations
// Space: O(1) - constant space for 6 distances
function validSquare(p1, p2, p3, p4) {
  // Helper to calculate squared distance between two points
  const distSq = (a, b) => {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  };

  // Calculate all 6 pairwise squared distances
  const distances = [
    distSq(p1, p2),
    distSq(p1, p3),
    distSq(p1, p4),
    distSq(p2, p3),
    distSq(p2, p4),
    distSq(p3, p4),
  ];

  // Sort to group equal distances together
  distances.sort((a, b) => a - b);

  // Check square properties:
  // 1. First 4 must be equal (sides) and > 0
  // 2. Last 2 must be equal (diagonals)
  // 3. Diagonal should be 2 × side (for 90° angle)
  return (
    distances[0] > 0 && // No zero-length sides
    distances[0] === distances[1] &&
    distances[1] === distances[2] &&
    distances[2] === distances[3] && // 4 equal sides
    distances[4] === distances[5] && // 2 equal diagonals
    distances[4] === 2 * distances[0] // Right angle check
  );
}
```

```java
// Time: O(1) - constant 6 distance calculations
// Space: O(1) - constant space for 6 distances
public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
    // Calculate all 6 pairwise squared distances
    long[] distances = new long[6];
    distances[0] = distSq(p1, p2);
    distances[1] = distSq(p1, p3);
    distances[2] = distSq(p1, p4);
    distances[3] = distSq(p2, p3);
    distances[4] = distSq(p2, p4);
    distances[5] = distSq(p3, p4);

    // Sort to group equal distances together
    Arrays.sort(distances);

    // Check square properties:
    // 1. First 4 must be equal (sides) and > 0
    // 2. Last 2 must be equal (diagonals)
    // 3. Diagonal should be 2 × side (for 90° angle)
    return distances[0] > 0 &&  // No zero-length sides
           distances[0] == distances[1] &&
           distances[1] == distances[2] &&
           distances[2] == distances[3] &&  // 4 equal sides
           distances[4] == distances[5] &&  // 2 equal diagonals
           distances[4] == 2 * distances[0];  // Right angle check
}

// Helper method to calculate squared distance
private long distSq(int[] a, int[] b) {
    return (long)(a[0] - b[0]) * (a[0] - b[0]) +
           (long)(a[1] - b[1]) * (a[1] - b[1]);
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(1)  
We calculate exactly 6 pairwise distances regardless of input size. Sorting 6 elements is also O(1).

**Space Complexity:** O(1)  
We store exactly 6 distances in an array/list. No additional data structures grow with input.

**Why constant time/space?**  
The problem always has exactly 4 points, so our operations are fixed, not dependent on a variable `n`.

---

## Common Mistakes

1. **Not checking for zero distances**  
   Forgetting to verify `distances[0] > 0` allows duplicate points to form a "square" (e.g., all points at [0,0]).

2. **Using floating-point comparisons**  
   Comparing `Math.sqrt()` results with `==` fails due to precision errors. Always compare squared distances (integers).

3. **Incomplete square validation**  
   Only checking 4 equal sides identifies a rhombus, not necessarily a square. Must also verify diagonals are equal and satisfy `diagonal² = 2 × side²`.

4. **Assuming points are in order**  
   The input points aren't given in clockwise/adjacent order. Solutions that assume `p1-p2-p3-p4` form consecutive sides will fail.

---

## When You'll See This Pattern

This "distance distribution" pattern appears in geometry problems where shape classification is needed:

1. **Valid Triangle** (LeetCode 611)  
   Check triangle inequality using sorted side lengths.

2. **Minimum Area Rectangle** (LeetCode 939)  
   Find rectangles by looking for points that form right angles using distance checks.

3. **Boomerangs** (LeetCode 447)  
   Count equal distances from a point to others (similar distance grouping logic).

The core technique: **Use pairwise distances to capture geometric properties without caring about point order.**

---

## Key Takeaways

1. **Square = 4 equal sides + 2 equal diagonals + right angles**  
   This three-part check is necessary and sufficient.

2. **Work with squared distances**  
   Avoid floating-point precision issues and keep calculations in integer domain when possible.

3. **Let sorting group equal elements**  
   When you need to check frequency of values, sorting is often cleaner than hash maps for small fixed-size inputs.

---

[Practice this problem on CodeJeet](/problem/valid-square)
