---
title: "How to Solve Power of Two — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Power of Two. Easy difficulty, 49.9% acceptance rate. Topics: Math, Bit Manipulation, Recursion."
date: "2026-05-20"
category: "dsa-patterns"
tags: ["power-of-two", "math", "bit-manipulation", "recursion", "easy"]
---

# How to Solve Power of Two

The problem asks us to determine if a given integer `n` is a power of two — meaning there exists some integer `x` such that `n == 2^x`. While this seems straightforward mathematically, the challenge lies in finding an efficient solution that handles edge cases like negative numbers, zero, and large integers. The most elegant solutions use bit manipulation, which reveals why this problem is a favorite in coding interviews despite its "Easy" classification.

## Visual Walkthrough

Let's trace through what powers of two look like in binary representation:

- 2^0 = 1 → binary: 0001
- 2^1 = 2 → binary: 0010
- 2^2 = 4 → binary: 0100
- 2^3 = 8 → binary: 1000
- 2^4 = 16 → binary: 10000

Notice a pattern: every power of two has exactly **one** bit set to 1, with all other bits 0. Now let's look at numbers that aren't powers of two:

- 3 → binary: 0011 (two 1-bits)
- 5 → binary: 0101 (two 1-bits)
- 6 → binary: 0110 (two 1-bits)
- 7 → binary: 0111 (three 1-bits)
- 12 → binary: 1100 (two 1-bits)

The binary pattern gives us a crucial insight: if `n` is a power of two, then `n & (n-1)` should equal 0. Let's test this:

For n = 8 (1000):

- n-1 = 7 (0111)
- 1000 & 0111 = 0000 = 0 ✓

For n = 6 (0110):

- n-1 = 5 (0101)
- 0110 & 0101 = 0100 = 4 ≠ 0 ✗

This works because subtracting 1 from a power of two flips all the bits from the rightmost 1-bit onward, creating a perfect bitmask that yields zero when ANDed with the original number.

## Brute Force Approach

The most straightforward approach is to repeatedly divide `n` by 2 until we either reach 1 (if it's a power of two) or get an odd number greater than 1 (if it's not). We need to handle special cases: negative numbers and zero cannot be powers of two.

**Why this approach is inefficient:**

- For large numbers, we might need up to log₂(n) divisions
- While O(log n) time complexity isn't terrible, the bit manipulation solution is both faster and more elegant
- The division approach requires explicit handling of floating-point precision if we try mathematical approaches like `log2(n)`

Here's what the brute force solution looks like:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def isPowerOfTwo(n: int) -> bool:
    # Negative numbers and zero cannot be powers of two
    if n <= 0:
        return False

    # Keep dividing by 2 while n is even
    while n % 2 == 0:
        n //= 2

    # If we end up with 1, it was a power of two
    return n == 1
```

```javascript
// Time: O(log n) | Space: O(1)
function isPowerOfTwo(n) {
  // Negative numbers and zero cannot be powers of two
  if (n <= 0) {
    return false;
  }

  // Keep dividing by 2 while n is even
  while (n % 2 === 0) {
    n = Math.floor(n / 2);
  }

  // If we end up with 1, it was a power of two
  return n === 1;
}
```

```java
// Time: O(log n) | Space: O(1)
public boolean isPowerOfTwo(int n) {
    // Negative numbers and zero cannot be powers of two
    if (n <= 0) {
        return false;
    }

    // Keep dividing by 2 while n is even
    while (n % 2 == 0) {
        n /= 2;
    }

    // If we end up with 1, it was a power of two
    return n == 1;
}
```

</div>

## Optimal Solution

The optimal solution uses bit manipulation. As we observed in the visual walkthrough, powers of two have exactly one bit set. We can check this using the property `n & (n-1) == 0` for positive `n`. This approach runs in constant time and uses constant space.

**Key insight:** For any positive power of two, subtracting 1 flips all bits from the rightmost 1-bit to the end. When we AND this with the original number, we get 0.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isPowerOfTwo(n: int) -> bool:
    # Step 1: Handle edge cases - powers of two must be positive
    # Zero and negative numbers cannot be powers of two
    if n <= 0:
        return False

    # Step 2: Use the bitwise trick
    # For powers of two: n has exactly one 1-bit, so n & (n-1) == 0
    # Example: n = 8 (1000), n-1 = 7 (0111), 1000 & 0111 = 0000
    return (n & (n - 1)) == 0
```

```javascript
// Time: O(1) | Space: O(1)
function isPowerOfTwo(n) {
  // Step 1: Handle edge cases - powers of two must be positive
  // Zero and negative numbers cannot be powers of two
  if (n <= 0) {
    return false;
  }

  // Step 2: Use the bitwise trick
  // For powers of two: n has exactly one 1-bit, so n & (n-1) == 0
  // Example: n = 8 (1000), n-1 = 7 (0111), 1000 & 0111 = 0000
  return (n & (n - 1)) === 0;
}
```

```java
// Time: O(1) | Space: O(1)
public boolean isPowerOfTwo(int n) {
    // Step 1: Handle edge cases - powers of two must be positive
    // Zero and negative numbers cannot be powers of two
    if (n <= 0) {
        return false;
    }

    // Step 2: Use the bitwise trick
    // For powers of two: n has exactly one 1-bit, so n & (n-1) == 0
    // Example: n = 8 (1000), n-1 = 7 (0111), 1000 & 0111 = 0000
    return (n & (n - 1)) == 0;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- The bit manipulation solution performs a constant number of operations regardless of input size
- We only do one subtraction, one bitwise AND, and one comparison

**Space Complexity:** O(1)

- We use only a constant amount of extra space
- No additional data structures are created

**Why this is optimal:** Any solution must at least examine the input, which takes O(1) time for fixed-size integers. Our solution achieves this lower bound.

## Common Mistakes

1. **Forgetting to handle n ≤ 0:** The expression `n & (n-1)` works mathematically for positive powers of two, but for n=0, we get `0 & (-1)` which equals 0 in two's complement, incorrectly returning true. Always check for n ≤ 0 first.

2. **Using floating-point math:** Some candidates try `math.log2(n) % 1 == 0`. This fails due to floating-point precision issues with large numbers and requires importing math libraries.

3. **Incorrect bit check:** Writing `n & (n-1) == 0` without parentheses can lead to operator precedence issues. In most languages, `&` has lower precedence than `==`, so you need `(n & (n-1)) == 0`.

4. **Overcomplicating with loops:** While the division approach works, it's less efficient and more verbose than the bit manipulation solution. Recognizing the binary pattern is key.

## When You'll See This Pattern

The `n & (n-1)` trick appears in several bit manipulation problems:

1. **Number of 1 Bits (LeetCode 191):** `n & (n-1)` clears the lowest set bit, which can be used to count set bits efficiently.

2. **Power of Four (LeetCode 342):** Similar to power of two, but with an additional check that the single 1-bit is in an even position.

3. **Bitwise AND of Numbers Range (LeetCode 201):** Understanding how `n & (n-1)` works helps solve this problem about finding common prefix bits.

The pattern teaches you to look for binary representations when dealing with powers of numbers, especially powers of two. Many optimization problems involving subsets, bitmasks, or binary operations benefit from this insight.

## Key Takeaways

1. **Powers of two have unique binary properties:** They contain exactly one 1-bit, which makes `n & (n-1) == 0` a perfect test (for n > 0).

2. **Always handle edge cases first:** For bit manipulation problems, check for zero and negative inputs before applying the main logic.

3. **Recognize when problems are about binary patterns:** Any problem involving powers of two, counting bits, or checking divisibility by powers of two likely has a bit manipulation solution.

This problem demonstrates how understanding number representation at the bit level can lead to elegant, efficient solutions that outperform more obvious mathematical approaches.

Related problems: [Number of 1 Bits](/problem/number-of-1-bits), [Power of Three](/problem/power-of-three), [Power of Four](/problem/power-of-four)
