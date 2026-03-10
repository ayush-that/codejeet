---
title: "How to Solve Sqrt(x) — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sqrt(x). Easy difficulty, 41.4% acceptance rate. Topics: Math, Binary Search."
date: "2026-03-28"
category: "dsa-patterns"
tags: ["sqrtx", "math", "binary-search", "easy"]
---

# How to Solve Sqrt(x)

This problem asks us to find the integer square root of a non-negative integer `x`, rounded down to the nearest whole number. The challenge comes from the constraint: we cannot use any built-in exponent or square root functions. This forces us to think algorithmically about how to compute square roots manually, which reveals a classic application of binary search on a monotonic function.

## Visual Walkthrough

Let's walk through finding the integer square root of `x = 27` step by step:

We're looking for the largest integer `ans` such that `ans * ans ≤ 27`.

**Step 1: Define our search space**

- The square root of 27 must be between 0 and 27 itself (since 27² > 27)
- So our initial search range is `left = 0`, `right = 27`

**Step 2: First binary search step**

- Calculate midpoint: `mid = (0 + 27) // 2 = 13`
- Check: `13 * 13 = 169` which is > 27
- Since `mid² > x`, we know the answer must be less than 13
- Update: `right = mid - 1 = 12`

**Step 3: Second step**

- `mid = (0 + 12) // 2 = 6`
- Check: `6 * 6 = 36` which is > 27
- Update: `right = 5`

**Step 4: Third step**

- `mid = (0 + 5) // 2 = 2`
- Check: `2 * 2 = 4` which is ≤ 27 ✓
- Since this might be our answer, store it: `ans = 2`
- We can try larger numbers: update `left = mid + 1 = 3`

**Step 5: Fourth step**

- `mid = (3 + 5) // 2 = 4`
- Check: `4 * 4 = 16` which is ≤ 27 ✓
- Update: `ans = 4`, `left = 5`

**Step 6: Fifth step**

- `mid = (5 + 5) // 2 = 5`
- Check: `5 * 5 = 25` which is ≤ 27 ✓
- Update: `ans = 5`, `left = 6`

**Step 7: Sixth step**

- Now `left = 6`, `right = 5` → search ends
- Final answer: `5`

Indeed, `5² = 25 ≤ 27` and `6² = 36 > 27`, so 5 is the correct integer square root.

## Brute Force Approach

The most straightforward approach is to check every integer from 0 up to `x`:

1. Start with `ans = 0`
2. While `(ans + 1) * (ans + 1) ≤ x`, increment `ans`
3. Return `ans`

This works because we're simply finding the largest integer whose square doesn't exceed `x`. However, this approach has a major flaw: for large values of `x` (like 2³¹ - 1), we might need to check up to 2³¹ numbers, which is far too slow.

<div class="code-group">

```python
# Time: O(√x) | Space: O(1)
def mySqrtBruteForce(x: int) -> int:
    # Start with 0 as our candidate answer
    ans = 0

    # Keep incrementing while the next integer squared is ≤ x
    while (ans + 1) * (ans + 1) <= x:
        ans += 1

    return ans
```

```javascript
// Time: O(√x) | Space: O(1)
function mySqrtBruteForce(x) {
  // Start with 0 as our candidate answer
  let ans = 0;

  // Keep incrementing while the next integer squared is ≤ x
  while ((ans + 1) * (ans + 1) <= x) {
    ans++;
  }

  return ans;
}
```

```java
// Time: O(√x) | Space: O(1)
public int mySqrtBruteForce(int x) {
    // Start with 0 as our candidate answer
    int ans = 0;

    // Keep incrementing while the next integer squared is ≤ x
    // Use long to prevent overflow when squaring
    while ((long)(ans + 1) * (ans + 1) <= x) {
        ans++;
    }

    return ans;
}
```

</div>

**Why this isn't optimal:** For `x = 2,147,483,647` (the maximum 32-bit integer), we'd need to check up to 46,340 numbers. While this might seem acceptable, binary search can solve it with just ~16 checks, making it dramatically faster.

## Optimal Solution

The key insight is that the function `f(n) = n²` is monotonically increasing for `n ≥ 0`. This means we can use binary search to find the largest `n` where `n² ≤ x`. We'll search in the range `[0, x]` (or `[0, x//2 + 1]` for optimization).

<div class="code-group">

```python
# Time: O(log x) | Space: O(1)
def mySqrt(x: int) -> int:
    # Handle edge case: square root of 0 is 0
    if x == 0:
        return 0

    # Initialize binary search bounds
    # We can start right at x, but x//2 + 1 is sufficient for x ≥ 1
    left, right = 1, x // 2 + 1

    # Variable to store our best answer found so far
    ans = 0

    # Binary search loop
    while left <= right:
        # Calculate midpoint - use // for integer division
        mid = left + (right - left) // 2

        # Check if mid squared equals x
        if mid * mid == x:
            return mid  # Found exact square root

        # If mid squared is less than x, this could be our answer
        elif mid * mid < x:
            ans = mid      # Update best answer found so far
            left = mid + 1 # Try larger numbers

        # If mid squared is greater than x, search left half
        else:
            right = mid - 1

    # Return the largest integer whose square is ≤ x
    return ans
```

```javascript
// Time: O(log x) | Space: O(1)
function mySqrt(x) {
  // Handle edge case: square root of 0 is 0
  if (x === 0) return 0;

  // Initialize binary search bounds
  // We can start right at x, but Math.floor(x/2) + 1 is sufficient for x ≥ 1
  let left = 1;
  let right = Math.floor(x / 2) + 1;

  // Variable to store our best answer found so far
  let ans = 0;

  // Binary search loop
  while (left <= right) {
    // Calculate midpoint - use Math.floor for integer division
    const mid = left + Math.floor((right - left) / 2);

    // Check if mid squared equals x
    if (mid * mid === x) {
      return mid; // Found exact square root
    }

    // If mid squared is less than x, this could be our answer
    else if (mid * mid < x) {
      ans = mid; // Update best answer found so far
      left = mid + 1; // Try larger numbers
    }

    // If mid squared is greater than x, search left half
    else {
      right = mid - 1;
    }
  }

  // Return the largest integer whose square is ≤ x
  return ans;
}
```

```java
// Time: O(log x) | Space: O(1)
public int mySqrt(int x) {
    // Handle edge case: square root of 0 is 0
    if (x == 0) return 0;

    // Initialize binary search bounds
    // We can start right at x, but x/2 + 1 is sufficient for x ≥ 1
    int left = 1;
    int right = x / 2 + 1;

    // Variable to store our best answer found so far
    int ans = 0;

    // Binary search loop
    while (left <= right) {
        // Calculate midpoint - careful with overflow
        int mid = left + (right - left) / 2;

        // Use long to prevent overflow when squaring
        long square = (long) mid * mid;

        // Check if mid squared equals x
        if (square == x) {
            return mid;  // Found exact square root
        }

        // If mid squared is less than x, this could be our answer
        else if (square < x) {
            ans = mid;       // Update best answer found so far
            left = mid + 1;  // Try larger numbers
        }

        // If mid squared is greater than x, search left half
        else {
            right = mid - 1;
        }
    }

    // Return the largest integer whose square is ≤ x
    return ans;
}
```

</div>

**Key implementation details:**

1. **Midpoint calculation**: We use `left + (right - left) // 2` instead of `(left + right) // 2` to avoid potential integer overflow when `left` and `right` are large.
2. **Search bounds optimization**: For `x ≥ 1`, the square root is at most `x // 2 + 1`, which reduces the search space.
3. **Answer tracking**: We store `ans` whenever we find a valid candidate (`mid² < x`) because we need the largest such number, not just any valid one.
4. **Early exit**: If we find an exact match (`mid² == x`), we can return immediately.

## Complexity Analysis

**Time Complexity:** O(log x)

- Each iteration of the binary search halves the search space
- Starting with a search space of size approximately x/2, we need O(log(x/2)) = O(log x) iterations
- For the maximum 32-bit integer (2,147,483,647), this is about 16 iterations

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables (`left`, `right`, `mid`, `ans`)
- No additional data structures are created

## Common Mistakes

1. **Infinite loop with binary search termination**
   - **Mistake**: Using `while left < right` instead of `while left <= right`
   - **Why it fails**: When `left == right`, we still need to check that value. Using `<` might skip the final candidate.
   - **Fix**: Use `while left <= right` for inclusive bounds.

2. **Integer overflow when calculating mid²**
   - **Mistake**: `if mid * mid <= x` without considering that `mid * mid` might overflow
   - **Why it fails**: For `x = 2,147,483,647`, when `mid = 46,341`, `mid * mid` exceeds 32-bit integer range
   - **Fix**: Use `long` type for the multiplication (Java) or ensure Python/JavaScript handle big integers

3. **Incorrect search bounds initialization**
   - **Mistake**: Starting with `right = x` for all cases
   - **Why it's inefficient**: For large `x`, this makes the search space unnecessarily large. The square root of `x` is at most `x/2 + 1` for `x ≥ 4`.
   - **Fix**: Use `right = x // 2 + 1` for `x ≥ 1`

4. **Forgetting the x = 0 edge case**
   - **Mistake**: Not handling `x = 0` separately
   - **Why it fails**: With `left = 1, right = 0`, the binary search loop never executes
   - **Fix**: Add an early return for `x == 0`

## When You'll See This Pattern

The "binary search on answer" pattern appears whenever:

1. You're looking for a value in a monotonic function
2. You can easily check if a candidate value is too high or too low
3. The search space is too large for linear search

**Related problems:**

1. **Pow(x, n)** (Medium) - Similar binary search approach for exponentiation
2. **Valid Perfect Square** (Easy) - Almost identical to this problem, checking if a number is a perfect square
3. **Find Peak Element** (Medium) - Binary search on a non-monotonic but locally informative function
4. **Search in Rotated Sorted Array** (Medium) - Binary search with additional logic for rotation

## Key Takeaways

1. **Binary search isn't just for arrays**: You can apply binary search to any monotonic function where you can evaluate `f(mid)` and determine which half contains the answer.

2. **"Binary search on answer" pattern**: When asked to find the maximum/minimum value satisfying some condition, and you can test candidates efficiently, consider binary searching over the possible answer range.

3. **Integer overflow awareness**: Always consider whether intermediate calculations might overflow, especially when dealing with squares or products of large numbers.

4. **Edge cases matter**: Always test `x = 0`, `x = 1`, and large values near integer limits.

Related problems: [Pow(x, n)](/problem/powx-n), [Valid Perfect Square](/problem/valid-perfect-square)
