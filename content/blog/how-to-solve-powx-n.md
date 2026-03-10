---
title: "How to Solve Pow(x, n) — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pow(x, n). Medium difficulty, 38.3% acceptance rate. Topics: Math, Recursion."
date: "2026-04-16"
category: "dsa-patterns"
tags: ["powx-n", "math", "recursion", "medium"]
---

# How to Solve Pow(x, n)

Implementing a power function seems straightforward at first glance, but the challenge lies in doing it efficiently for large exponents. The naive approach of multiplying `x` by itself `n` times becomes impractical when `n` is large (like 2³¹ - 1). This problem teaches the powerful technique of **exponentiation by squaring**, which reduces the time complexity from linear to logarithmic.

## Visual Walkthrough

Let's trace through calculating 2¹⁰ using the efficient approach:

**Step 1:** 2¹⁰ = (2²)⁵ = 4⁵  
**Step 2:** 4⁵ = 4 × 4⁴ = 4 × (4²)² = 4 × 16²  
**Step 3:** 16² = (16²)¹ = 256¹  
**Step 4:** 256¹ = 256 × 256⁰ = 256 × 1 = 256

Now let's see how this works with recursion:

- 2¹⁰: n is even → (2²)⁵ = 4⁵
- 4⁵: n is odd → 4 × 4⁴ = 4 × (4²)² = 4 × 16²
- 16²: n is even → (16²)¹ = 256¹
- 256¹: n is odd → 256 × 256⁰
- 256⁰: base case → 1

The key insight: instead of 10 multiplications, we only need 4! Each time we square the base, we effectively halve the exponent.

## Brute Force Approach

The most straightforward solution is to multiply `x` by itself `n` times:

```
result = 1
for i = 1 to n:
    result = result × x
return result
```

This approach has two major problems:

1. **Time complexity is O(n)**: For n = 2³¹ - 1, that's over 2 billion multiplications!
2. **Doesn't handle negative exponents properly**: We need to handle `x⁻ⁿ = 1/xⁿ`
3. **Overflow issues**: Large intermediate results can cause problems

Here's what the brute force code looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def myPow(x, n):
    if n == 0:
        return 1

    result = 1
    abs_n = abs(n)

    for _ in range(abs_n):
        result *= x

    # Handle negative exponent
    if n < 0:
        return 1 / result
    return result
```

```javascript
// Time: O(n) | Space: O(1)
function myPow(x, n) {
  if (n === 0) return 1;

  let result = 1;
  const absN = Math.abs(n);

  for (let i = 0; i < absN; i++) {
    result *= x;
  }

  // Handle negative exponent
  if (n < 0) {
    return 1 / result;
  }
  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public double myPow(double x, int n) {
    if (n == 0) return 1.0;

    double result = 1.0;
    long absN = Math.abs((long)n);  // Use long to handle Integer.MIN_VALUE

    for (long i = 0; i < absN; i++) {
        result *= x;
    }

    // Handle negative exponent
    if (n < 0) {
        return 1.0 / result;
    }
    return result;
}
```

</div>

This solution fails on large exponents due to timeout and doesn't handle edge cases well.

## Optimized Approach

The optimal solution uses **exponentiation by squaring**, also known as **binary exponentiation**. The key insight comes from these mathematical properties:

1. **Even exponent**: xⁿ = (x²)ⁿ/²
2. **Odd exponent**: xⁿ = x × xⁿ⁻¹ = x × (x²)⁽ⁿ⁻¹⁾/²

This allows us to reduce the exponent by half at each step instead of decreasing by 1. The algorithm works like this:

- If n is 0, return 1 (base case)
- If n is negative, convert to positive: x⁻ⁿ = 1/xⁿ
- If n is even: square the base, halve the exponent
- If n is odd: multiply result by current base, then square the base and floor halve the exponent

We can implement this recursively or iteratively. The iterative approach is generally preferred as it avoids recursion overhead and potential stack overflow.

## Optimal Solution

Here's the complete solution using iterative binary exponentiation:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def myPow(x, n):
    """
    Calculate x raised to the power n using binary exponentiation.

    Args:
        x: base (float)
        n: exponent (integer)

    Returns:
        x^n as float
    """
    # Handle negative exponent by converting to positive
    # x^(-n) = 1/(x^n)
    if n < 0:
        x = 1 / x
        n = -n

    result = 1.0
    current_product = x

    # Process each bit of n from least significant to most
    while n > 0:
        # If current bit is 1 (n is odd), multiply result by current_product
        if n % 2 == 1:
            result *= current_product

        # Square the base for the next bit position
        # This corresponds to x^(2^k) for the k-th bit
        current_product *= current_product

        # Move to the next bit by dividing n by 2 (right shift)
        n //= 2

    return result
```

```javascript
// Time: O(log n) | Space: O(1)
function myPow(x, n) {
  /**
   * Calculate x raised to the power n using binary exponentiation.
   *
   * @param {number} x - base
   * @param {number} n - exponent
   * @return {number} x^n
   */

  // Handle negative exponent by converting to positive
  // x^(-n) = 1/(x^n)
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  let result = 1.0;
  let currentProduct = x;

  // Process each bit of n from least significant to most
  while (n > 0) {
    // If current bit is 1 (n is odd), multiply result by currentProduct
    if (n % 2 === 1) {
      result *= currentProduct;
    }

    // Square the base for the next bit position
    // This corresponds to x^(2^k) for the k-th bit
    currentProduct *= currentProduct;

    // Move to the next bit by dividing n by 2 (right shift)
    // Using Math.floor for integer division
    n = Math.floor(n / 2);
  }

  return result;
}
```

```java
// Time: O(log n) | Space: O(1)
public double myPow(double x, int n) {
    /**
     * Calculate x raised to the power n using binary exponentiation.
     *
     * @param x base
     * @param n exponent
     * @return x^n
     */

    // Handle edge case: anything to the power 0 is 1
    if (n == 0) return 1.0;

    // Convert n to long to handle Integer.MIN_VALUE safely
    // Integer.MIN_VALUE = -2147483648, which becomes 2147483648 when negated
    // This overflows int, so we use long
    long N = n;

    // Handle negative exponent by converting to positive
    // x^(-n) = 1/(x^n)
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }

    double result = 1.0;
    double currentProduct = x;

    // Process each bit of N from least significant to most
    while (N > 0) {
        // If current bit is 1 (N is odd), multiply result by currentProduct
        if (N % 2 == 1) {
            result *= currentProduct;
        }

        // Square the base for the next bit position
        // This corresponds to x^(2^k) for the k-th bit
        currentProduct *= currentProduct;

        // Move to the next bit by dividing N by 2 (right shift)
        N /= 2;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- Each iteration halves the exponent (n → n/2 → n/4 → ... → 1)
- This creates a logarithmic number of iterations
- For n = 2³¹ - 1, we need only ~31 iterations instead of ~2 billion!

**Space Complexity: O(1)**

- We only use a constant amount of extra space (result, current_product variables)
- No recursion stack (iterative approach) or additional data structures

The logarithmic time complexity comes from the binary representation of n. If n has b bits, we need b iterations. Since b = log₂(n), we get O(log n) time.

## Common Mistakes

1. **Not handling Integer.MIN_VALUE in Java**: When n = Integer.MIN_VALUE (-2147483648), negating it causes integer overflow since 2147483648 > Integer.MAX_VALUE. Always convert to long first.

2. **Infinite recursion with negative exponents**: If you use recursion and don't properly handle the sign change, you might get infinite recursion. Always convert negative exponents to positive at the start.

3. **Forgetting to handle n = 0**: The base case is crucial. Anything to the power 0 is 1, including 0⁰ (which is defined as 1 in most programming contexts).

4. **Using integer division for halving**: In languages with integer division (like Python 2), make sure to use integer division (//) not float division (/).

5. **Not considering floating point precision**: For very small or very large results, floating point precision can be an issue. The problem typically accepts solutions within a reasonable tolerance.

## When You'll See This Pattern

The binary exponentiation pattern appears whenever you need to compute something that can be broken down by halving:

1. **Super Pow (LeetCode 372)**: Compute aᵇ mod 1337 where b is a very large array. Uses the same exponentiation by squaring but with modular arithmetic.

2. **Count Good Numbers (LeetCode 1922)**: Count numbers of length n that satisfy certain properties. The solution involves exponentiation with large n.

3. **Fibonacci Number (LeetCode 509)**: Can be computed in O(log n) using matrix exponentiation, which uses the same halving principle.

4. **Any problem involving large exponents**: Whenever you see "calculate xⁿ where n can be up to 10⁹", think binary exponentiation.

## Key Takeaways

1. **Divide and conquer through halving**: When a problem can be reduced by halving the input size at each step, you often get O(log n) solutions.

2. **Binary representation is powerful**: Many optimization problems become simpler when you think in terms of binary representation of numbers.

3. **Convert negatives early**: For exponent problems, handle negative exponents immediately by converting them to positive (x⁻ⁿ = 1/xⁿ).

4. **Iterative > Recursive for exponentiation**: While both work, iterative solutions avoid stack overflow and are usually more efficient.

Remember: When you need to compute powers, think "binary exponentiation" first. It's a fundamental technique that every competitive programmer should have in their toolkit.

Related problems: [Sqrt(x)](/problem/sqrtx), [Super Pow](/problem/super-pow), [Count Collisions of Monkeys on a Polygon](/problem/count-collisions-of-monkeys-on-a-polygon)
