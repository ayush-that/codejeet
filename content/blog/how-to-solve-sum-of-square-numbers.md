---
title: "How to Solve Sum of Square Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Square Numbers. Medium difficulty, 36.7% acceptance rate. Topics: Math, Two Pointers, Binary Search."
date: "2027-06-30"
category: "dsa-patterns"
tags: ["sum-of-square-numbers", "math", "two-pointers", "binary-search", "medium"]
---

# How to Solve Sum of Square Numbers

You're given a non-negative integer `c`, and you need to determine whether there exist two integers `a` and `b` such that `a² + b² = c`. The integers can be zero, and `a` and `b` can be equal. What makes this problem interesting is that while it looks simple, the naive approach is too slow for large inputs, forcing you to think about mathematical properties and efficient search techniques.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `c = 25`. We need to find integers `a` and `b` where `a² + b² = 25`.

We can think of this as searching for pairs where `a² ≤ c` and `b² = c - a²`. Let's start with `a = 0`:

- `a = 0`, `a² = 0`, then `b² = 25 - 0 = 25`. Is 25 a perfect square? Yes, `b = 5` works. So `0² + 5² = 25`.

But what if we didn't find it immediately? Let's try `c = 13`:

- `a = 0`: `b² = 13 - 0 = 13`. 13 is not a perfect square.
- `a = 1`: `b² = 13 - 1 = 12`. Not a perfect square.
- `a = 2`: `b² = 13 - 4 = 9`. 9 is a perfect square (`b = 3`). So `2² + 3² = 13`.

Notice that we only need to check `a` values up to `√c`, because if `a > √c`, then `a² > c`, making `b²` negative. This gives us our search boundary.

## Brute Force Approach

The most straightforward approach is to try all possible pairs of integers `a` and `b` and check if `a² + b² = c`. Since `a` and `b` can range from 0 to `√c`, we'd have a double loop:

<div class="code-group">

```python
# Time: O(c) - Actually O(√c * √c) = O(c)
# Space: O(1)
def judgeSquareSum_brute(c):
    # Check all possible a values
    for a in range(int(c**0.5) + 1):
        # Check all possible b values
        for b in range(int(c**0.5) + 1):
            if a*a + b*b == c:
                return True
    return False
```

```javascript
// Time: O(c) | Space: O(1)
function judgeSquareSumBrute(c) {
  // Check all possible a values
  for (let a = 0; a <= Math.sqrt(c); a++) {
    // Check all possible b values
    for (let b = 0; b <= Math.sqrt(c); b++) {
      if (a * a + b * b === c) return true;
    }
  }
  return false;
}
```

```java
// Time: O(c) | Space: O(1)
public boolean judgeSquareSumBrute(int c) {
    // Check all possible a values
    for (long a = 0; a * a <= c; a++) {
        // Check all possible b values
        for (long b = 0; b * b <= c; b++) {
            if (a * a + b * b == c) return true;
        }
    }
    return false;
}
```

</div>

This brute force solution has a time complexity of O(c), which is too slow for large `c` values (like 2³¹ - 1). We need a more efficient approach.

## Optimized Approach

The key insight is that for each possible `a`, we don't need to try all possible `b` values. Instead, we can calculate `b² = c - a²` and check if it's a perfect square. This reduces the problem from O(c) to O(√c).

Here's the step-by-step reasoning:

1. For `a` from 0 to `√c`:
   - Calculate `b_squared = c - a²`
   - Check if `b_squared` is a perfect square
2. To check if a number is a perfect square, we can:
   - Take its square root
   - Check if the square of the integer part equals the original number

But we can do even better using a two-pointer approach:

1. Set `left = 0` and `right = √c` (integer floor)
2. While `left ≤ right`:
   - Calculate `sum = left² + right²`
   - If `sum == c`: return true
   - If `sum < c`: increment `left` (we need a larger sum)
   - If `sum > c`: decrement `right` (we need a smaller sum)

This two-pointer approach is efficient because it takes advantage of the sorted nature of squares. As `left` increases, `left²` increases. As `right` decreases, `right²` decreases. This lets us adjust the sum toward our target `c`.

## Optimal Solution

Here's the complete solution using the two-pointer approach:

<div class="code-group">

```python
# Time: O(√c) | Space: O(1)
def judgeSquareSum(c):
    """
    Determines if there exist two integers a and b such that a² + b² = c.
    Uses a two-pointer approach for optimal efficiency.
    """
    # Initialize pointers: left starts at 0, right starts at √c
    left = 0
    right = int(c**0.5)  # Integer square root

    # Search while left hasn't passed right
    while left <= right:
        # Calculate current sum of squares
        current_sum = left * left + right * right

        # Check if we found the target
        if current_sum == c:
            return True
        # If sum is too small, move left pointer right to increase sum
        elif current_sum < c:
            left += 1
        # If sum is too large, move right pointer left to decrease sum
        else:
            right -= 1

    # If we exit the loop, no pair was found
    return False
```

```javascript
// Time: O(√c) | Space: O(1)
function judgeSquareSum(c) {
  /**
   * Determines if there exist two integers a and b such that a² + b² = c.
   * Uses a two-pointer approach for optimal efficiency.
   */
  // Initialize pointers: left starts at 0, right starts at √c
  let left = 0;
  let right = Math.floor(Math.sqrt(c));

  // Search while left hasn't passed right
  while (left <= right) {
    // Calculate current sum of squares
    // Use BigInt to avoid overflow for large numbers
    const currentSum = left * left + right * right;

    // Check if we found the target
    if (currentSum === c) {
      return true;
    }
    // If sum is too small, move left pointer right to increase sum
    else if (currentSum < c) {
      left++;
    }
    // If sum is too large, move right pointer left to decrease sum
    else {
      right--;
    }
  }

  // If we exit the loop, no pair was found
  return false;
}
```

```java
// Time: O(√c) | Space: O(1)
public boolean judgeSquareSum(int c) {
    /**
     * Determines if there exist two integers a and b such that a² + b² = c.
     * Uses a two-pointer approach for optimal efficiency.
     */
    // Initialize pointers: left starts at 0, right starts at √c
    // Use long to avoid integer overflow when squaring
    long left = 0;
    long right = (long) Math.sqrt(c);

    // Search while left hasn't passed right
    while (left <= right) {
        // Calculate current sum of squares
        long currentSum = left * left + right * right;

        // Check if we found the target
        if (currentSum == c) {
            return true;
        }
        // If sum is too small, move left pointer right to increase sum
        else if (currentSum < c) {
            left++;
        }
        // If sum is too large, move right pointer left to decrease sum
        else {
            right--;
        }
    }

    // If we exit the loop, no pair was found
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(√c)

- The two pointers start at the ends and move toward each other
- In the worst case, `left` goes from 0 to `√c`, which is O(√c) iterations
- Each iteration does constant work (multiplication and comparison)

**Space Complexity:** O(1)

- We only use a few variables (`left`, `right`, `current_sum`)
- No additional data structures that grow with input size

## Common Mistakes

1. **Integer overflow when squaring:** When `c` is large (up to 2³¹ - 1), squaring integers can overflow 32-bit integers. Always use 64-bit integers (long in Java, BigInt in JavaScript for very large numbers, Python handles big integers natively).

2. **Forgetting that a and b can be 0:** Some candidates start with `left = 1`, missing solutions like `0² + √c² = c`. Always include 0 in your search space.

3. **Incorrect loop condition:** Using `while (left < right)` instead of `while (left <= right)` can miss cases where `a = b`, like `2² + 2² = 8`.

4. **Not handling the case where right² exceeds c:** When initializing `right`, make sure to take the integer square root. Using `right = c` instead of `right = √c` would make the algorithm much slower.

## When You'll See This Pattern

The two-pointer technique used here appears in many problems involving sorted arrays or sequences:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167):** Similar two-pointer approach to find two numbers that sum to a target in a sorted array.

2. **Container With Most Water (LeetCode 11):** Uses two pointers starting at ends and moving inward to maximize area.

3. **3Sum (LeetCode 15):** Extends the two-pointer concept to three pointers for finding triplets that sum to zero.

The pattern is recognizable when you need to find pairs in a sorted space (or a space that can be traversed in order) that satisfy some condition. The key insight is that moving one pointer in one direction predictably changes the result in a known way.

## Key Takeaways

1. **When searching for pairs in a sorted or monotonic space, consider two pointers:** Starting from opposite ends and moving inward often gives O(n) solutions to problems that seem like they require O(n²).

2. **Mathematical constraints can reduce search space:** Recognizing that `a` and `b` only need to go up to `√c` is crucial. Always look for mathematical properties that limit your search.

3. **Watch for integer overflow in mathematical problems:** When dealing with squares or products of potentially large numbers, use appropriate data types to avoid overflow errors.

Related problems: [Valid Perfect Square](/problem/valid-perfect-square), [Sum of Squares of Special Elements](/problem/sum-of-squares-of-special-elements)
