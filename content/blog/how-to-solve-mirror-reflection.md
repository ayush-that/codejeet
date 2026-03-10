---
title: "How to Solve Mirror Reflection — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Mirror Reflection. Medium difficulty, 61.9% acceptance rate. Topics: Math, Geometry, Number Theory."
date: "2027-09-13"
category: "dsa-patterns"
tags: ["mirror-reflection", "math", "geometry", "number-theory", "medium"]
---

# How to Solve Mirror Reflection

This problem asks us to determine which receptor (0, 1, or 2) a laser beam will hit in a square mirrored room. The laser starts from the southwest corner and travels toward a point on the east wall that's `q` units from the south wall, with the room having side length `p`. What makes this problem tricky is that it appears to be a geometry problem but actually requires number theory thinking — we need to find a mathematical pattern rather than simulate the beam's path.

## Visual Walkthrough

Let's trace through an example with `p = 2, q = 1`:

1. The laser starts at the southwest corner (0,0) and heads toward point (2,1) on the east wall
2. When it hits the east wall at (2,1), it reflects toward the west wall
3. The reflection hits the north wall at (1,2), then reflects toward the south wall
4. Finally, it hits the west wall at (0,1) and reflects to receptor 2

```
Receptors: 2 (NW)    1 (NE)
           ┌───────┐
           │       │
           │       │
           │       │
           └───────┘
Receptor 0 (SE)   Start (SW)
```

The key insight: Instead of tracking reflections, we can "unfold" the room. Each time the beam hits a wall, imagine creating a mirror image of the room. The beam continues in a straight line through these virtual rooms.

For `p=2, q=1`:

- After unfolding once vertically: the beam goes to (2,3) which is in a virtual room above
- This point corresponds to receptor 1 in the original room

The pattern emerges: We need to find the smallest `k` where `k*q` is divisible by `p`. Then:

- If `k` is odd and `(k*q/p)` is odd → receptor 1
- If `k` is odd and `(k*q/p)` is even → receptor 0
- If `k` is even and `(k*q/p)` is odd → receptor 2

## Brute Force Approach

A naive approach would be to simulate the beam's path step by step, calculating reflections using geometry. For each segment:

1. Calculate where the beam hits the next wall
2. Update direction based on which wall was hit
3. Check if we've reached a corner

The problem with this approach is that the beam could bounce many times before hitting a receptor, especially when `p` and `q` are large or have a complex ratio. In the worst case, the beam might bounce indefinitely if we don't handle it properly. This simulation approach would be inefficient and error-prone due to floating-point precision issues when calculating intersection points.

## Optimized Approach

The optimal solution uses number theory instead of geometry. Here's the step-by-step reasoning:

1. **Unfolding Concept**: Instead of reflecting the beam, reflect the room. Each reflection creates a mirror image. The beam travels in a straight line through these virtual rooms.

2. **Mathematical Transformation**: The beam will hit a receptor when both coordinates are integer multiples of `p`:
   - The x-coordinate after unfolding: `m * p` (where m is number of rooms horizontally)
   - The y-coordinate after unfolding: `n * q` (where n is number of segments vertically)
   - We need `m * p = n * q` for the beam to hit a corner

3. **Finding the Pattern**: We need the smallest positive integers `m` and `n` such that `m * p = n * q`. This is equivalent to finding the least common multiple (LCM) of `p` and `q`.

4. **Receptor Determination**:
   - `k = n` (number of vertical segments)
   - If `k` is even: beam ends on north wall → receptor 2
   - If `k` is odd: check horizontal segments `m = k*q/p`
     - If `m` is odd → receptor 1 (northeast corner)
     - If `m` is even → receptor 0 (southeast corner)

5. **Simplification**: We can find `k` by repeatedly dividing both `p` and `q` by 2 until one is odd. This works because we only care about parity (odd/even) of the number of reflections.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(min(p, q))) | Space: O(1)
def mirrorReflection(p: int, q: int) -> int:
    """
    Determine which receptor the laser hits in a square mirrored room.

    The key insight is to use the "unfolding rooms" technique and
    track the parity of reflections until both dimensions are odd.
    """
    # Keep reducing until either p or q is odd
    # This counts how many times we can divide by 2
    while p % 2 == 0 and q % 2 == 0:
        p //= 2
        q //= 2

    # After reduction:
    # - If p is even and q is odd: beam hits north wall (receptor 2)
    # - If p is odd and q is odd: beam hits northeast corner (receptor 1)
    # - If p is odd and q is even: beam hits southeast corner (receptor 0)

    if p % 2 == 0:  # p is even
        return 2
    elif q % 2 == 0:  # p is odd, q is even
        return 0
    else:  # both p and q are odd
        return 1
```

```javascript
// Time: O(log(min(p, q))) | Space: O(1)
function mirrorReflection(p, q) {
  /**
   * Determine which receptor the laser hits in a square mirrored room.
   *
   * The key insight is to use the "unfolding rooms" technique and
   * track the parity of reflections until both dimensions are odd.
   */

  // Keep reducing until either p or q is odd
  // This counts how many times we can divide by 2
  while (p % 2 === 0 && q % 2 === 0) {
    p /= 2;
    q /= 2;
  }

  // After reduction:
  // - If p is even and q is odd: beam hits north wall (receptor 2)
  // - If p is odd and q is odd: beam hits northeast corner (receptor 1)
  // - If p is odd and q is even: beam hits southeast corner (receptor 0)

  if (p % 2 === 0) {
    // p is even
    return 2;
  } else if (q % 2 === 0) {
    // p is odd, q is even
    return 0;
  } else {
    // both p and q are odd
    return 1;
  }
}
```

```java
// Time: O(log(min(p, q))) | Space: O(1)
class Solution {
    public int mirrorReflection(int p, int q) {
        /**
         * Determine which receptor the laser hits in a square mirrored room.
         *
         * The key insight is to use the "unfolding rooms" technique and
         * track the parity of reflections until both dimensions are odd.
         */

        // Keep reducing until either p or q is odd
        // This counts how many times we can divide by 2
        while (p % 2 == 0 && q % 2 == 0) {
            p /= 2;
            q /= 2;
        }

        // After reduction:
        // - If p is even and q is odd: beam hits north wall (receptor 2)
        // - If p is odd and q is odd: beam hits northeast corner (receptor 1)
        // - If p is odd and q is even: beam hits southeast corner (receptor 0)

        if (p % 2 == 0) {  // p is even
            return 2;
        } else if (q % 2 == 0) {  // p is odd, q is even
            return 0;
        } else {  // both p and q are odd
            return 1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(log(min(p, q)))

- We repeatedly divide both numbers by 2 in the while loop
- In the worst case, we divide until one number becomes odd
- This takes logarithmic time relative to the smaller input

**Space Complexity**: O(1)

- We only use a constant amount of extra space
- All operations are done in-place on the input parameters

## Common Mistakes

1. **Trying to simulate reflections geometrically**: This leads to floating-point precision issues and infinite loops. The beam might bounce thousands of times before hitting a receptor, making simulation impractical.

2. **Misunderstanding the coordinate system**: Remember the receptors are at corners: 0 (southeast), 1 (northeast), 2 (northwest). The laser starts at the southwest corner.

3. **Forgetting to reduce by common factors**: The while loop that divides by 2 is crucial. Without it, you might get the wrong parity for the number of reflections.

4. **Incorrect parity logic**: The three cases must be checked in the right order. Check if p is even first, then if q is even, otherwise both are odd.

## When You'll See This Pattern

This "unfolding" or "mirror" technique appears in several problems:

1. **Water and Jug Problem (LeetCode 365)**: Similar number theory approach to determine if you can measure a target amount using two jugs.

2. **Reach a Number (LeetCode 754)**: Finding the minimum steps to reach a target number by taking steps of increasing size uses similar parity reasoning.

3. **Angle Between Hands of a Clock (LeetCode 1344)**: While not identical, it shares the theme of converting a geometric problem into a mathematical formula.

The core pattern is recognizing when a seemingly geometric problem can be reduced to number theory or modular arithmetic.

## Key Takeaways

1. **Look for mathematical patterns**: When a problem involves repeated reflections, rotations, or periodic behavior, there's often a mathematical formula or number theory insight that simplifies it.

2. **Parity (odd/even) matters**: Many problems become simpler when you focus on whether values are odd or even rather than their exact magnitudes.

3. **Reduce by common factors**: When dealing with ratios or proportions, dividing by common factors often reveals the underlying pattern.

[Practice this problem on CodeJeet](/problem/mirror-reflection)
