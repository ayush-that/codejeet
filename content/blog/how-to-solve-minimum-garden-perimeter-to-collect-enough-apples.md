---
title: "How to Solve Minimum Garden Perimeter to Collect Enough Apples — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Garden Perimeter to Collect Enough Apples. Medium difficulty, 55.5% acceptance rate. Topics: Math, Binary Search."
date: "2029-10-21"
category: "dsa-patterns"
tags: ["minimum-garden-perimeter-to-collect-enough-apples", "math", "binary-search", "medium"]
---

# How to Solve Minimum Garden Perimeter to Collect Enough Apples

This problem asks us to find the smallest square plot (centered at the origin) that contains enough apples, where each tree at coordinate `(i, j)` has `|i| + |j|` apples. The tricky part is efficiently calculating apples in a growing square region without simulating every coordinate.

## Visual Walkthrough

Let's trace through `neededApples = 13`:

- **Square with side length 1** (radius 0): Only contains `(0,0)` with `|0| + |0| = 0` apples. Total = 0 < 13.
- **Square with side length 3** (radius 1): Contains coordinates where `-1 ≤ i,j ≤ 1`. Let's calculate systematically:
  - Corner points: `(1,1)`, `(1,-1)`, `(-1,1)`, `(-1,-1)` each have `1+1=2` apples → 4×2=8
  - Edge centers: `(1,0)`, `(0,1)`, `(-1,0)`, `(0,-1)` each have `1+0=1` apple → 4×1=4
  - Center: `(0,0)` has 0 apples
  - Total = 8 + 4 + 0 = 12 < 13
- **Square with side length 5** (radius 2): Now contains coordinates where `-2 ≤ i,j ≤ 2`. Calculating:
  - Corners: `(2,2)`, `(2,-2)`, `(-2,2)`, `(-2,-2)` each have `2+2=4` apples → 4×4=16
  - Other edge points: `(2,1)`, `(2,0)`, `(2,-1)`, etc. We need a systematic approach...
  - Total apples = 60 (we'll derive the formula next)
  - 60 ≥ 13, so side length 5 works

The pattern: side length increases by 2 each time (1, 3, 5, 7...), and we need a formula to calculate apples without enumerating all points.

## Brute Force Approach

A naive solution would incrementally increase the square size and sum apples for all coordinates within each square:

<div class="code-group">

```python
def minimumPerimeter(neededApples: int) -> int:
    radius = 0  # half of (side length - 1)
    while True:
        side = 2 * radius + 1
        total = 0
        # Sum apples for all coordinates in [-radius, radius]
        for i in range(-radius, radius + 1):
            for j in range(-radius, radius + 1):
                total += abs(i) + abs(j)
        if total >= neededApples:
            return 4 * side  # perimeter = 4 × side length
        radius += 1
```

```javascript
function minimumPerimeter(neededApples) {
  let radius = 0;
  while (true) {
    const side = 2 * radius + 1;
    let total = 0;
    // Sum apples for all coordinates in [-radius, radius]
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        total += Math.abs(i) + Math.abs(j);
      }
    }
    if (total >= neededApples) {
      return 4 * side; // perimeter = 4 × side length
    }
    radius++;
  }
}
```

```java
public long minimumPerimeter(long neededApples) {
    long radius = 0;
    while (true) {
        long side = 2 * radius + 1;
        long total = 0;
        // Sum apples for all coordinates in [-radius, radius]
        for (long i = -radius; i <= radius; i++) {
            for (long j = -radius; j <= radius; j++) {
                total += Math.abs(i) + Math.abs(j);
            }
        }
        if (total >= neededApples) {
            return 4 * side;  // perimeter = 4 × side length
        }
        radius++;
    }
}
```

</div>

**Why this fails:** For large `neededApples` (up to 10¹⁵), the double loop becomes impossibly slow. Each iteration processes `(2r+1)²` points, leading to O(r³) total time as we try larger radii.

## Optimized Approach

The key insight is that we can derive a **closed-form formula** for apples in a square of radius `r` (where side length = `2r+1`).

Let's think layer by layer:

1. **For a fixed `x = i`**: The y-coordinates range from `-r` to `r`, so the sum of `|j|` for that column is `2 × (1 + 2 + ... + r) = r(r+1)`.
2. **Add `|i|` for each point in column `i`**: There are `(2r+1)` points in column `i`, each contributing `|i|`, so total from `|i|` is `(2r+1) × |i|`.
3. **Sum over all x from `-r` to `r`**:
   - The `|j|` contribution: Each of the `(2r+1)` columns has the same `r(r+1)` from y-values → `(2r+1) × r(r+1)`
   - The `|i|` contribution: Sum of `(2r+1) × |i|` for `i = -r..r` = `(2r+1) × 2 × (1 + 2 + ... + r)` = `(2r+1) × r(r+1)`
4. **Total apples** = `2 × (2r+1) × r(r+1)` = `2r(r+1)(2r+1)`

Wait, that's exactly the formula for **sum of squares of first r integers** multiplied by 8! Let's verify:

- Known identity: `1² + 2² + ... + r² = r(r+1)(2r+1)/6`
- Our formula `2r(r+1)(2r+1)` = `12 × [r(r+1)(2r+1)/6]` = `12 × sum of squares`

Actually, let's test with r=1: Our formula gives `2×1×2×3=12`, which matches our earlier calculation. Perfect!

So **apples(r) = 2r(r+1)(2r+1)**.

Now we can:

1. Use **binary search** to find the smallest r where apples(r) ≥ neededApples
2. Return perimeter = `8r` (since side length = `2r+1`, perimeter = `4×(2r+1)` = `8r+4`, wait... let's check carefully)

Actually: side length = `2r+1`, so perimeter = `4 × (2r+1)` = `8r + 4`.

## Optimal Solution

We'll binary search for the minimum radius `r` that satisfies `2r(r+1)(2r+1) ≥ neededApples`, then compute the perimeter.

<div class="code-group">

```python
def minimumPerimeter(neededApples: int) -> int:
    """
    Find minimum square perimeter centered at (0,0) containing enough apples.
    Each tree at (i,j) has |i| + |j| apples.

    Key formula: For square with 'radius' r (coordinates from -r to r),
    total apples = 2 * r * (r + 1) * (2r + 1)

    We binary search for smallest r satisfying the condition.
    """
    # Binary search bounds: r can be 0 to ~10^5 (since apples grow as r^3)
    left, right = 0, 100000

    while left < right:
        mid = (left + right) // 2

        # Calculate apples for radius = mid
        # Using 64-bit integers to prevent overflow
        apples = 2 * mid * (mid + 1) * (2 * mid + 1)

        if apples >= neededApples:
            # This radius works, try smaller
            right = mid
        else:
            # Need larger radius
            left = mid + 1

    # left is the minimum radius that works
    # Perimeter = 4 * side_length = 4 * (2r + 1) = 8r + 4
    return 8 * left + 4
```

```javascript
function minimumPerimeter(neededApples) {
  /**
   * Find minimum square perimeter centered at (0,0) containing enough apples.
   * Each tree at (i,j) has |i| + |j| apples.
   *
   * Key formula: For square with 'radius' r (coordinates from -r to r),
   * total apples = 2 * r * (r + 1) * (2r + 1)
   *
   * We binary search for smallest r satisfying the condition.
   */
  // Binary search bounds: r can be 0 to ~10^5 (since apples grow as r^3)
  let left = 0n;
  let right = 100000n;
  const needed = BigInt(neededApples);

  while (left < right) {
    const mid = (left + right) / 2n;

    // Calculate apples for radius = mid
    // Using BigInt to prevent overflow
    const apples = 2n * mid * (mid + 1n) * (2n * mid + 1n);

    if (apples >= needed) {
      // This radius works, try smaller
      right = mid;
    } else {
      // Need larger radius
      left = mid + 1n;
    }
  }

  // left is the minimum radius that works
  // Perimeter = 4 * side_length = 4 * (2r + 1) = 8r + 4
  return Number(8n * left + 4n);
}
```

```java
public long minimumPerimeter(long neededApples) {
    /**
     * Find minimum square perimeter centered at (0,0) containing enough apples.
     * Each tree at (i,j) has |i| + |j| apples.
     *
     * Key formula: For square with 'radius' r (coordinates from -r to r),
     * total apples = 2 * r * (r + 1) * (2r + 1)
     *
     * We binary search for smallest r satisfying the condition.
     */
    // Binary search bounds: r can be 0 to ~10^5 (since apples grow as r^3)
    long left = 0, right = 100000;

    while (left < right) {
        long mid = left + (right - left) / 2;

        // Calculate apples for radius = mid
        // Using long to prevent overflow (mid up to 100k is safe)
        long apples = 2 * mid * (mid + 1) * (2 * mid + 1);

        if (apples >= neededApples) {
            // This radius works, try smaller
            right = mid;
        } else {
            // Need larger radius
            left = mid + 1;
        }
    }

    // left is the minimum radius that works
    // Perimeter = 4 * side_length = 4 * (2r + 1) = 8r + 4
    return 8 * left + 4;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log N)**

- We perform binary search over possible radius values
- The search space size is O(∛neededApples) ≈ O(10⁵) for max input 10¹⁵
- Each iteration computes the formula in O(1) time
- Total: O(log(∛neededApples)) = O(log N)

**Space Complexity: O(1)**

- We only use a few variables for binary search bounds and calculations
- No additional data structures needed

## Common Mistakes

1. **Off-by-one in perimeter calculation**: Forgetting that side length = `2r+1` not `2r`, leading to perimeter = `4×(2r+1)` = `8r+4` not `8r`. Test with r=0: square of side 1 has perimeter 4, not 0.

2. **Integer overflow**: Calculating `2r(r+1)(2r+1)` with 32-bit integers when r ~ 10⁵ gives ~10¹⁸ which overflows. Use 64-bit (long in Java/C++) or BigInt in JavaScript.

3. **Incorrect binary search bounds**: Setting right bound too small (like neededApples) when we need ∛neededApples. For neededApples=10¹⁵, r ≈ 10⁵, so bound should be at least 10⁵.

4. **Misunderstanding the coordinate system**: Thinking the square includes points like (r,r) when radius=r means coordinates from -r to r inclusive, so side length = 2r+1.

## When You'll See This Pattern

This problem combines **mathematical derivation** with **binary search on answer**:

1. **Koko Eating Bananas (LeetCode 875)**: Binary search for minimum eating speed, with a validation function calculating total hours.

2. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Binary search for minimum capacity, with validation checking if packages can be shipped within D days.

3. **Divide Chocolate (LeetCode 1231)**: Binary search for maximum minimum sweetness, with validation checking if we can get enough pieces.

The pattern: When you need to find the minimum/maximum value satisfying a condition, and you can efficiently check if a candidate value works, binary search is often optimal.

## Key Takeaways

1. **Look for mathematical patterns**: Instead of simulating, derive formulas for aggregate sums. Here, symmetry around axes simplified the calculation dramatically.

2. **Binary search on answer**: When the problem asks for "minimum X such that condition holds" and checking a candidate X is efficient, binary search often gives logarithmic time.

3. **Handle large numbers carefully**: With constraints up to 10¹⁵, watch for integer overflow and use appropriate data types (long, BigInt).

[Practice this problem on CodeJeet](/problem/minimum-garden-perimeter-to-collect-enough-apples)
