---
title: "How to Solve Valid Perfect Square — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Perfect Square. Easy difficulty, 44.7% acceptance rate. Topics: Math, Binary Search."
date: "2026-11-11"
category: "dsa-patterns"
tags: ["valid-perfect-square", "math", "binary-search", "easy"]
---

# How to Solve Valid Perfect Square

This problem asks us to determine whether a given positive integer is a perfect square without using any built-in square root functions. While it seems simple at first glance, the challenge lies in doing this efficiently for potentially large numbers. The naive approach of checking every integer would be too slow, so we need a smarter method.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we're given `num = 36`.

**Step 1:** We need to find if there exists an integer `x` such that `x * x = 36`.

**Step 2:** Instead of checking every number from 1 to 36, we can use binary search. We know the answer must be between 1 and `num` (inclusive).

**Step 3:** Initialize `left = 1` and `right = 36`.

**Step 4:** Calculate mid: `(1 + 36) // 2 = 18`. Check `18 * 18 = 324`. Since 324 > 36, we know the answer must be in the left half. Update `right = 17`.

**Step 5:** New mid: `(1 + 17) // 2 = 9`. Check `9 * 9 = 81`. Still too large. Update `right = 8`.

**Step 6:** New mid: `(1 + 8) // 2 = 4`. Check `4 * 4 = 16`. Too small. Update `left = 5`.

**Step 7:** New mid: `(5 + 8) // 2 = 6`. Check `6 * 6 = 36`. Perfect match! Return `true`.

This binary search approach dramatically reduces the number of checks from 36 to just 4.

## Brute Force Approach

The most straightforward solution is to iterate through all integers from 1 to `num` and check if the square equals `num`. While this works for small numbers, it becomes impractical for large inputs.

**Why it's inefficient:**

- For `num = 1,000,000,000`, we'd need to check up to 1,000,000,000 numbers
- Time complexity is O(n), which is too slow for large inputs
- We can do much better with binary search (O(log n))

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isPerfectSquare(num: int) -> bool:
    # Check every number from 1 to num
    for i in range(1, num + 1):
        square = i * i
        if square == num:
            return True
        # Early exit if square exceeds num
        if square > num:
            return False
    return False
```

```javascript
// Time: O(n) | Space: O(1)
function isPerfectSquare(num) {
  // Check every number from 1 to num
  for (let i = 1; i <= num; i++) {
    const square = i * i;
    if (square === num) {
      return true;
    }
    // Early exit if square exceeds num
    if (square > num) {
      return false;
    }
  }
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean isPerfectSquare(int num) {
    // Check every number from 1 to num
    for (int i = 1; i <= num; i++) {
        long square = (long) i * i;  // Use long to avoid overflow
        if (square == num) {
            return true;
        }
        // Early exit if square exceeds num
        if (square > num) {
            return false;
        }
    }
    return false;
}
```

</div>

## Optimal Solution

The optimal solution uses binary search to find the square root in logarithmic time. Since the square root of `num` must be between 1 and `num`, we can repeatedly halve our search space until we find the answer or exhaust all possibilities.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def isPerfectSquare(num: int) -> bool:
    # Edge case: 0 and 1 are perfect squares
    if num < 2:
        return True

    # Initialize binary search bounds
    left, right = 2, num // 2

    # Binary search for the square root
    while left <= right:
        # Calculate middle point (avoid overflow with //)
        mid = left + (right - left) // 2

        # Calculate square of mid
        square = mid * mid

        # Check if we found the perfect square
        if square == num:
            return True
        # If square is too large, search left half
        elif square > num:
            right = mid - 1
        # If square is too small, search right half
        else:
            left = mid + 1

    # No perfect square found
    return False
```

```javascript
// Time: O(log n) | Space: O(1)
function isPerfectSquare(num) {
  // Edge case: 0 and 1 are perfect squares
  if (num < 2) {
    return true;
  }

  // Initialize binary search bounds
  let left = 2;
  let right = Math.floor(num / 2);

  // Binary search for the square root
  while (left <= right) {
    // Calculate middle point (avoid overflow with Math.floor)
    const mid = Math.floor(left + (right - left) / 2);

    // Calculate square of mid
    const square = mid * mid;

    // Check if we found the perfect square
    if (square === num) {
      return true;
    }
    // If square is too large, search left half
    else if (square > num) {
      right = mid - 1;
    }
    // If square is too small, search right half
    else {
      left = mid + 1;
    }
  }

  // No perfect square found
  return false;
}
```

```java
// Time: O(log n) | Space: O(1)
public boolean isPerfectSquare(int num) {
    // Edge case: 0 and 1 are perfect squares
    if (num < 2) {
        return true;
    }

    // Initialize binary search bounds
    long left = 2;  // Use long to avoid overflow
    long right = num / 2;

    // Binary search for the square root
    while (left <= right) {
        // Calculate middle point (avoid overflow)
        long mid = left + (right - left) / 2;

        // Calculate square of mid (use long to avoid overflow)
        long square = mid * mid;

        // Check if we found the perfect square
        if (square == num) {
            return true;
        }
        // If square is too large, search left half
        else if (square > num) {
            right = mid - 1;
        }
        // If square is too small, search right half
        else {
            left = mid + 1;
        }
    }

    // No perfect square found
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- Each iteration of the binary search halves the search space
- We start with a search space of size n/2 (since we know the square root must be ≤ n/2 for n > 2)
- After k iterations, the search space is reduced to (n/2)/2^k
- Solving for when this reaches 1 gives us k = O(log n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (left, right, mid, square)
- No additional data structures are created
- The space usage doesn't grow with input size

## Common Mistakes

1. **Integer overflow when calculating square**: When `mid` is large (close to 2^31-1), `mid * mid` can overflow a 32-bit integer. Always use 64-bit integers (long in Java/C++, long long in C) for intermediate calculations.

2. **Incorrect binary search bounds**: Starting with `right = num` instead of `num // 2` works but is less efficient. More importantly, forgetting to handle the edge cases `num = 0` and `num = 1` can lead to infinite loops or incorrect results.

3. **Off-by-one errors in loop condition**: Using `while (left < right)` instead of `while (left <= right)` can miss cases where the perfect square is exactly at the boundary. Always test with small perfect squares like 4, 9, 16.

4. **Forgetting to update bounds correctly**: When `square > num`, you should set `right = mid - 1`, not `right = mid`. Similarly, when `square < num`, set `left = mid + 1`. This ensures the search space shrinks properly.

## When You'll See This Pattern

This binary search pattern appears whenever you need to find a value in a sorted range or when you're looking for a specific property that follows a monotonic pattern (always increasing or decreasing).

**Related LeetCode problems:**

1. **Sqrt(x) (Easy)**: Almost identical problem - instead of returning a boolean, you return the integer square root. The same binary search approach works perfectly.

2. **Sum of Square Numbers (Medium)**: Determines if a number can be expressed as the sum of two perfect squares. You can use binary search to check if `c - a²` is a perfect square for each possible `a`.

3. **Find Peak Element (Medium)**: While not about squares, it uses binary search on a property (the peak) rather than a specific value, showing how binary search can be adapted to various monotonic conditions.

## Key Takeaways

1. **Binary search isn't just for arrays**: You can use binary search on any monotonic function or property, including mathematical functions like `f(x) = x²`.

2. **Always consider edge cases**: For mathematical problems, test with 0, 1, large numbers, and numbers just below/above perfect squares (e.g., 35 and 37 when testing with 36).

3. **Watch for integer overflow**: When dealing with squares or products of potentially large numbers, use larger data types (long instead of int) to avoid silent overflow bugs.

Related problems: [Sqrt(x)](/problem/sqrtx), [Sum of Square Numbers](/problem/sum-of-square-numbers)
