---
title: "How to Solve Find the Pivot Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Pivot Integer. Easy difficulty, 83.8% acceptance rate. Topics: Math, Prefix Sum."
date: "2028-01-14"
category: "dsa-patterns"
tags: ["find-the-pivot-integer", "math", "prefix-sum", "easy"]
---

# How to Solve Find the Pivot Integer

This problem asks us to find an integer `x` between 1 and `n` where the sum of numbers from 1 to `x` equals the sum from `x` to `n`. While the problem seems straightforward, the interesting part is recognizing that there's a mathematical shortcut that makes the solution much more efficient than brute force checking. The challenge lies in deriving and applying the mathematical relationship rather than just implementing the obvious checking approach.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 8`. We're looking for an `x` where:

Sum(1 to x) = Sum(x to n)

For `x = 6`:

- Left sum = 1+2+3+4+5+6 = 21
- Right sum = 6+7+8 = 21

So `x = 6` works! Let's see why this happens mathematically.

The sum from 1 to x is given by the formula: x(x+1)/2
The sum from x to n is: (n(n+1)/2) - (x(x-1)/2)

Setting them equal:
x(x+1)/2 = n(n+1)/2 - x(x-1)/2

Multiply both sides by 2:
x(x+1) = n(n+1) - x(x-1)

Expand:
x² + x = n(n+1) - x² + x

Simplify:
x² + x = n(n+1) - x² + x
2x² = n(n+1)
x² = n(n+1)/2

So `x` must be the square root of n(n+1)/2, and it must be an integer!

For n = 8:
n(n+1)/2 = 8×9/2 = 36
√36 = 6 (integer) ✓

For n = 4:
n(n+1)/2 = 4×5/2 = 10
√10 ≈ 3.16 (not integer) ✗

## Brute Force Approach

The most straightforward approach is to check every possible `x` from 1 to `n`:

1. For each candidate `x` from 1 to `n`:
   - Calculate sum from 1 to x
   - Calculate sum from x to n
   - Compare the two sums

This approach has O(n²) time complexity if we calculate sums naively, or O(n) if we use running sums. Even with O(n) time, we can do better with the mathematical insight.

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def pivotInteger_brute(n):
    for x in range(1, n + 1):
        left_sum = sum(range(1, x + 1))  # O(x) time
        right_sum = sum(range(x, n + 1))  # O(n-x+1) time

        if left_sum == right_sum:
            return x
    return -1
```

```javascript
// Time: O(n²) | Space: O(1)
function pivotIntegerBrute(n) {
  for (let x = 1; x <= n; x++) {
    let leftSum = 0;
    for (let i = 1; i <= x; i++) leftSum += i;

    let rightSum = 0;
    for (let i = x; i <= n; i++) rightSum += i;

    if (leftSum === rightSum) return x;
  }
  return -1;
}
```

```java
// Time: O(n²) | Space: O(1)
public int pivotIntegerBrute(int n) {
    for (int x = 1; x <= n; x++) {
        int leftSum = 0;
        for (int i = 1; i <= x; i++) leftSum += i;

        int rightSum = 0;
        for (int i = x; i <= n; i++) rightSum += i;

        if (leftSum == rightSum) return x;
    }
    return -1;
}
```

</div>

While this works, it's inefficient for large `n`. We can optimize it to O(n) using prefix sums, but the mathematical solution gives us O(1) time!

## Optimal Solution

From our derivation, we know that `x = √[n(n+1)/2]`. The solution is simple:

1. Calculate `total = n(n+1)/2`
2. Take the square root of `total`
3. If the square root is an integer, return it; otherwise return -1

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def pivotInteger(n):
    # Step 1: Calculate total sum from 1 to n using formula n(n+1)/2
    total_sum = n * (n + 1) // 2

    # Step 2: The pivot x must satisfy x² = total_sum
    # So x is the square root of total_sum
    x = int(total_sum ** 0.5)  # Integer square root

    # Step 3: Verify that x² equals total_sum exactly
    # This check handles floating point precision issues
    if x * x == total_sum:
        return x
    else:
        return -1
```

```javascript
// Time: O(1) | Space: O(1)
function pivotInteger(n) {
  // Step 1: Calculate total sum from 1 to n using formula n(n+1)/2
  const totalSum = (n * (n + 1)) / 2;

  // Step 2: The pivot x must satisfy x² = totalSum
  // So x is the square root of totalSum
  const x = Math.sqrt(totalSum);

  // Step 3: Verify that x is an integer (no floating point remainder)
  // Math.floor(x) === x checks if x is already an integer
  if (Math.floor(x) === x) {
    return x;
  } else {
    return -1;
  }
}
```

```java
// Time: O(1) | Space: O(1)
public int pivotInteger(int n) {
    // Step 1: Calculate total sum from 1 to n using formula n(n+1)/2
    int totalSum = n * (n + 1) / 2;

    // Step 2: The pivot x must satisfy x² = totalSum
    // So x is the square root of totalSum
    int x = (int) Math.sqrt(totalSum);

    // Step 3: Verify that x² equals totalSum exactly
    // This handles cases where sqrt returns a truncated value
    if (x * x == totalSum) {
        return x;
    } else {
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of arithmetic operations: multiplication, division, and square root
- No loops or recursion, so runtime doesn't depend on input size

**Space Complexity: O(1)**

- We only use a few variables to store intermediate results
- Memory usage doesn't grow with input size

## Common Mistakes

1. **Off-by-one errors in sum calculations**: When implementing brute force, candidates often use `range(1, x)` instead of `range(1, x+1)` or similar mistakes. Always test with small cases like n=1 or n=2.

2. **Floating point precision issues**: When checking if a square root is an integer, comparing `x == int(x)` might fail due to floating point rounding. Always verify by checking `x * x == totalSum` or using integer arithmetic.

3. **Forgetting the mathematical derivation**: Some candidates try to solve the equation incorrectly. Remember the key steps:
   - Sum(1 to x) = x(x+1)/2
   - Sum(x to n) = n(n+1)/2 - x(x-1)/2
   - Setting them equal gives: x² = n(n+1)/2

4. **Not handling the edge case n=1 correctly**: For n=1, the pivot is 1 since both sums are just 1. Our formula works: total = 1×2/2 = 1, √1 = 1.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification** for what appears to be a computational problem. You'll see similar patterns in:

1. **Bulb Switcher (LeetCode 319)**: Instead of simulating bulb toggles, you realize only perfect squares remain on due to divisors coming in pairs.

2. **Count Primes (LeetCode 204)**: The Sieve of Eratosthenes is much more efficient than checking each number individually for primality.

3. **Happy Number (LeetCode 202)**: The mathematical insight that all numbers eventually reach a cycle, allowing Floyd's cycle detection.

The key insight is recognizing when a problem that seems to require iteration or simulation can be solved with a closed-form mathematical formula.

## Key Takeaways

1. **Always look for mathematical simplifications**: Before implementing a brute force solution, ask: "Can I derive a formula?" Many "easy" problems have mathematical shortcuts.

2. **Test your derivation with examples**: Use small test cases to verify your mathematical reasoning. If n=8 gives x=6, does your formula produce that result?

3. **Integer vs floating point matters**: When dealing with square roots and perfect squares, be careful with floating point precision. Use integer multiplication to verify results.

Related problems: [Bulb Switcher](/problem/bulb-switcher)
