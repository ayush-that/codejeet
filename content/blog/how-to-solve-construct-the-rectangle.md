---
title: "How to Solve Construct the Rectangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Construct the Rectangle. Easy difficulty, 63.1% acceptance rate. Topics: Math."
date: "2026-06-17"
category: "dsa-patterns"
tags: ["construct-the-rectangle", "math", "easy"]
---

# How to Solve Construct the Rectangle

This problem asks us to find the length (L) and width (W) of a rectangle given its area, with the constraint that L ≥ W and the difference between L and W should be as small as possible. While mathematically straightforward, the challenge lies in efficiently finding the optimal integer dimensions without checking every possible pair. The "difference minimized" requirement makes this more interesting than simply finding any factor pair.

## Visual Walkthrough

Let's trace through an example with area = 12.

We need to find integer pairs (L, W) where:

1. L × W = 12
2. L ≥ W
3. |L - W| is minimized

Let's list all possible factor pairs:

- 12 × 1 = 12 (difference = 11)
- 6 × 2 = 12 (difference = 4)
- 4 × 3 = 12 (difference = 1)
- 3 × 4 = 12 (invalid since L < W)
- 2 × 6 = 12 (invalid since L < W)
- 1 × 12 = 12 (invalid since L < W)

The pair with L ≥ W and minimal difference is [4, 3]. Notice that as we move from the extremes toward the middle, the difference decreases. The optimal solution will be the factor pair where W is as large as possible while still being ≤ √area.

For area = 12, √12 ≈ 3.46. Starting from W = 3 (the largest integer ≤ √12), we check if 12 % 3 == 0. It is, so L = 12/3 = 4. We found our optimal solution in one check!

## Brute Force Approach

A naive approach would check all possible W values from 1 to area:

1. For each W from 1 to area
2. Check if area % W == 0
3. Calculate L = area / W
4. If L ≥ W, track the pair with minimal |L - W|

This works but is inefficient with O(n) time complexity. For area = 10^7, we'd need 10 million iterations. We can do much better by recognizing that for any factor W, there's a corresponding factor L = area/W. The optimal solution will have W close to √area, so we should start from there and work downward.

## Optimal Solution

The key insight: For a given area, the rectangle dimensions that minimize |L - W| will be the factor pair where W is the largest possible divisor of area that is ≤ √area. We start from the integer part of √area and decrement until we find a divisor.

Why this works:

1. If W > √area, then L = area/W < √area, which means L < W, violating L ≥ W
2. Starting from the largest possible W gives us the smallest possible L while maintaining L ≥ W
3. This automatically minimizes |L - W| because we're finding the factor pair closest to a square

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def constructRectangle(area):
    """
    Find the optimal rectangle dimensions for a given area.

    Args:
        area: The target area of the rectangle

    Returns:
        List[int]: [L, W] where L ≥ W and |L-W| is minimized
    """
    # Start from the square root and work downwards
    # Using integer division to get the floor of sqrt(area)
    width = int(area ** 0.5)

    # Decrement width until we find a divisor of area
    while area % width != 0:
        width -= 1

    # Calculate length from the found width
    length = area // width

    # Return as [length, width] since length ≥ width by construction
    return [length, width]
```

```javascript
// Time: O(√n) | Space: O(1)
function constructRectangle(area) {
  /**
   * Find the optimal rectangle dimensions for a given area.
   *
   * @param {number} area - The target area of the rectangle
   * @return {number[]} - [L, W] where L ≥ W and |L-W| is minimized
   */

  // Start from the square root and work downwards
  // Math.floor gives us the integer part of sqrt(area)
  let width = Math.floor(Math.sqrt(area));

  // Decrement width until we find a divisor of area
  while (area % width !== 0) {
    width--;
  }

  // Calculate length from the found width
  const length = area / width;

  // Return as [length, width] since length ≥ width by construction
  return [length, width];
}
```

```java
// Time: O(√n) | Space: O(1)
public int[] constructRectangle(int area) {
    /**
     * Find the optimal rectangle dimensions for a given area.
     *
     * @param area - The target area of the rectangle
     * @return int[] - [L, W] where L ≥ W and |L-W| is minimized
     */

    // Start from the square root and work downwards
    // Cast to int to get the floor of sqrt(area)
    int width = (int) Math.sqrt(area);

    // Decrement width until we find a divisor of area
    while (area % width != 0) {
        width--;
    }

    // Calculate length from the found width
    int length = area / width;

    // Return as [length, width] since length ≥ width by construction
    return new int[]{length, width};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)**

- In the worst case, we might need to decrement from √area down to 1
- This gives us at most √area iterations
- For example, if area is prime (like 17), we'll check √17 ≈ 4.12 → 4, 3, 2, 1 = 4 iterations

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Starting from 1 instead of √area**: Some candidates iterate from W = 1 upward, tracking the best pair. This is O(n) instead of O(√n) and misses the optimization. Always look for mathematical properties that can reduce search space.

2. **Forgetting integer division**: When calculating width = √area, we need the floor (integer part). Using regular division or not casting to int properly can lead to floating-point issues or infinite loops.

3. **Returning [W, L] instead of [L, W]**: The problem specifies returning [L, W] where L ≥ W. While our algorithm ensures L ≥ W, accidentally returning them in the wrong order is a common oversight.

4. **Not handling edge cases**: While the problem constraints (1 ≤ area ≤ 10^7) guarantee area ≥ 1, in interviews you should mention handling area = 1 (returns [1, 1]) and verifying the input is positive.

## When You'll See This Pattern

This "start from √n and work downward" pattern appears in several factorization and divisor problems:

1. **Count Primes (LeetCode 204)**: The Sieve of Eratosthenes uses √n as an optimization bound when marking multiples.

2. **Valid Perfect Square (LeetCode 367)**: Checking if a number is a perfect square by testing divisors up to √n.

3. **Bulb Switcher (LeetCode 319)**: The solution involves counting perfect squares ≤ n, which relates to divisors and √n.

The core insight is recognizing that for any factor pair (a, b) of n where a ≤ b, we have a ≤ √n ≤ b. This halves the search space and is crucial for efficient divisor-related algorithms.

## Key Takeaways

- **Mathematical properties optimize algorithms**: Recognizing that the optimal rectangle dimensions involve factors near √area transforms an O(n) search into O(√n).

- **Work from the middle outward**: When searching for factor pairs with minimal difference, start from the square root and move toward the extremes. This finds the optimal solution faster.

- **Integer operations matter**: Use integer division and floor operations carefully when dealing with square roots to avoid floating-point issues and ensure correct loop termination.

[Practice this problem on CodeJeet](/problem/construct-the-rectangle)
