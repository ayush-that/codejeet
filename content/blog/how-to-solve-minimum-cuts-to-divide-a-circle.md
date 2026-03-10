---
title: "How to Solve Minimum Cuts to Divide a Circle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Cuts to Divide a Circle. Easy difficulty, 56.1% acceptance rate. Topics: Math, Geometry."
date: "2028-01-19"
category: "dsa-patterns"
tags: ["minimum-cuts-to-divide-a-circle", "math", "geometry", "easy"]
---

# How to Solve Minimum Cuts to Divide a Circle

At first glance, this problem seems like a geometry puzzle, but it's actually a cleverly disguised math problem. The key insight is recognizing that the two types of "valid cuts" described in the problem are essentially the same thing: they're all diameters of the circle. A diameter is a line segment that passes through the center and connects two points on the circle's edge. Even the "one point" case is just a diameter where we're considering it as a line rather than a segment. This realization transforms a seemingly complex geometry problem into a simple mathematical pattern.

The tricky part is understanding that we're not actually dealing with arbitrary cuts - we're counting how many diameters we need to divide the circle into equal pieces. This is a classic example of how interview problems often hide simple mathematical relationships behind seemingly complex descriptions.

## Visual Walkthrough

Let's build intuition with concrete examples:

**Example 1: n = 4**

- We want to divide the circle into 4 equal pieces
- With 1 diameter (1 cut), we get 2 pieces
- With 2 diameters (2 cuts) that are perpendicular to each other, we get 4 pieces
- So for n = 4, we need 2 cuts

**Example 2: n = 3**

- We want to divide the circle into 3 equal pieces
- With 1 diameter (1 cut), we get 2 pieces
- With 2 diameters (2 cuts) at 60° angles, we get 4 pieces (not 3!)
- Wait, can we get exactly 3 pieces with diameters? No - diameters always create an even number of pieces because each diameter divides all existing pieces in half
- So for n = 3, we need 3 cuts (each cut goes from center to edge, not all the way across)

**Example 3: n = 6**

- We want to divide the circle into 6 equal pieces
- With 1 diameter: 2 pieces
- With 2 diameters at 60°: 4 pieces
- With 3 diameters at 60°: 6 pieces ✓
- So for n = 6, we need 3 cuts

The pattern emerges:

- If n is even: we need n/2 cuts (each cut is a full diameter)
- If n is odd: we need n cuts (each cut goes from center to edge)

## Brute Force Approach

A naive approach might try to simulate the cutting process or use geometric calculations. For example, one might try:

1. Start with 1 piece (the whole circle)
2. Add cuts one by one, trying to maximize the number of pieces
3. Count how many cuts are needed to reach exactly n pieces

However, this approach is problematic because:

- It's not clear how to choose where to place each cut
- The relationship between cut placement and resulting pieces is complex
- We'd need to consider all possible angles and positions, which is computationally expensive

Even if we tried a brute force search over possible cut positions, we'd quickly run into precision issues with floating-point numbers and the search space would be enormous. This problem doesn't lend itself to a traditional brute force simulation approach - the mathematical pattern is the only efficient way to solve it.

## Optimal Solution

The optimal solution comes from recognizing the mathematical pattern we observed in the visual walkthrough. Each full diameter (cut through the center connecting two edge points) always increases the piece count by 2 if placed at a new angle. However, if n is odd, we can't use full diameters exclusively because they always create an even number of pieces. In that case, we need to use cuts that go from the center to just one point on the edge, which only increase the count by 1.

The formula is simple:

- If n = 1: We already have 1 piece, so we need 0 cuts
- If n is even: We need n/2 cuts (each cut is a diameter that creates 2 new pieces)
- If n is odd: We need n cuts (each cut goes from center to edge, creating 1 new piece)

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def numberOfCuts(n: int) -> int:
    """
    Calculate the minimum number of cuts needed to divide a circle into n equal pieces.

    The key insight is that valid cuts are diameters (lines through the center).
    - If n = 1: Already 1 piece, no cuts needed
    - If n is even: Each diameter creates 2 pieces, so we need n/2 cuts
    - If n is odd: Diameters always create even numbers of pieces,
      so we need n cuts (each from center to edge)

    Args:
        n: The number of equal pieces we want to divide the circle into

    Returns:
        The minimum number of valid cuts required
    """
    # Special case: if n is 1, we already have the circle as one piece
    if n == 1:
        return 0

    # If n is even, we can use diameters (each creates 2 pieces)
    if n % 2 == 0:
        return n // 2

    # If n is odd, we need n cuts (each from center to edge)
    return n
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate the minimum number of cuts needed to divide a circle into n equal pieces.
 *
 * Valid cuts are diameters (lines through the center).
 * - If n = 1: Already 1 piece, no cuts needed
 * - If n is even: Each diameter creates 2 pieces, so we need n/2 cuts
 * - If n is odd: Diameters always create even numbers of pieces,
 *   so we need n cuts (each from center to edge)
 *
 * @param {number} n - The number of equal pieces we want to divide the circle into
 * @return {number} The minimum number of valid cuts required
 */
function numberOfCuts(n) {
  // Special case: if n is 1, we already have the circle as one piece
  if (n === 1) {
    return 0;
  }

  // If n is even, we can use diameters (each creates 2 pieces)
  if (n % 2 === 0) {
    return n / 2;
  }

  // If n is odd, we need n cuts (each from center to edge)
  return n;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate the minimum number of cuts needed to divide a circle into n equal pieces.
     *
     * Valid cuts are diameters (lines through the center).
     * - If n = 1: Already 1 piece, no cuts needed
     * - If n is even: Each diameter creates 2 pieces, so we need n/2 cuts
     * - If n is odd: Diameters always create even numbers of pieces,
     *   so we need n cuts (each from center to edge)
     *
     * @param n The number of equal pieces we want to divide the circle into
     * @return The minimum number of valid cuts required
     */
    public int numberOfCuts(int n) {
        // Special case: if n is 1, we already have the circle as one piece
        if (n == 1) {
            return 0;
        }

        // If n is even, we can use diameters (each creates 2 pieces)
        if (n % 2 == 0) {
            return n / 2;
        }

        // If n is odd, we need n cuts (each from center to edge)
        return n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We only perform a constant number of operations: one comparison (n == 1), one modulo operation (n % 2), and one division or return statement
- The runtime doesn't depend on the size of n

**Space Complexity: O(1)**

- We only use a constant amount of extra space regardless of input size
- No data structures are created that scale with n

## Common Mistakes

1. **Forgetting the n = 1 edge case**: Many candidates return n/2 for even n and n for odd n, but forget that when n = 1, we need 0 cuts, not 1. Always test the smallest possible input!

2. **Misunderstanding the cut types**: Some candidates think the two types of cuts are different, but they're both diameters. The "one point" description is just another way to think about a diameter as a ray from the center.

3. **Overcomplicating with geometry**: Candidates sometimes try to calculate angles or use trigonometric functions, which is unnecessary. The problem is purely about counting, not about precise angles.

4. **Integer division errors**: In languages like Java or C++, using integer division without proper casting can lead to incorrect results. However, in this problem, we're careful to use the modulo operator first to check parity.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification** - taking what seems like a complex problem and finding a simple mathematical relationship that solves it instantly. You'll see this pattern in:

1. **Smallest Even Multiple (LeetCode 2413)**: Finding the smallest number divisible by both 2 and n - it's just n if n is even, or 2n if n is odd. Another example of parity-based logic.

2. **Count Total Number of Colored Cells (LeetCode 2579)**: This problem about cells on a diagonal also has a mathematical formula solution rather than a simulation approach.

3. **Bulb Switcher (LeetCode 319)**: Another problem where the optimal solution is a simple mathematical insight (only perfect squares remain on) rather than simulating the switching process.

## Key Takeaways

1. **Look for mathematical patterns**: When a problem involves counting, dividing, or arranging things in a regular pattern, there's often a simple mathematical formula waiting to be discovered. Don't jump straight to simulation.

2. **Parity (even/odd) is a powerful concept**: Many problems have different behaviors for even and odd cases. Always check both and see if you can find a pattern.

3. **Simplify the problem statement**: The problem describes two types of cuts, but they're essentially the same thing. Always look for ways to simplify the problem description to its core mathematical essence.

Related problems: [Smallest Even Multiple](/problem/smallest-even-multiple), [Count Total Number of Colored Cells](/problem/count-total-number-of-colored-cells)
