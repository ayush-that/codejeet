---
title: "How to Solve Power of Four — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Power of Four. Easy difficulty, 51.8% acceptance rate. Topics: Math, Bit Manipulation, Recursion."
date: "2026-09-29"
category: "dsa-patterns"
tags: ["power-of-four", "math", "bit-manipulation", "recursion", "easy"]
---

# How to Solve Power of Four

This problem asks us to determine whether a given integer `n` is a power of four. That means there must exist some integer `x` such that `n == 4^x`. While this seems straightforward, the challenge lies in doing it efficiently without using loops or recursion when possible. The interesting part is that powers of four have very specific mathematical and binary properties that allow for clever optimizations.

## Visual Walkthrough

Let's trace through some examples to build intuition:

**Example 1: n = 16**

- 16 = 4² (since 4 × 4 = 16)
- In binary: 16 = 10000₂
- Notice: Only one '1' bit, and it's in an odd position (counting from the right, starting at position 1)
- This should return `true`

**Example 2: n = 64**

- 64 = 4³ (since 4 × 4 × 4 = 64)
- In binary: 64 = 1000000₂
- Only one '1' bit, in an odd position
- This should return `true`

**Example 3: n = 32**

- 32 = 2⁵, but NOT a power of four
- In binary: 32 = 100000₂
- Only one '1' bit, but in an even position
- This should return `false`

**Example 4: n = 18**

- Not a power of two or four
- In binary: 18 = 10010₂
- Has multiple '1' bits
- This should return `false`

From these examples, we can see that powers of four must:

1. Be greater than 0
2. Have exactly one '1' bit in their binary representation (like powers of two)
3. Have that '1' bit in an odd position (1st, 3rd, 5th, etc. from the right)

## Brute Force Approach

The most straightforward approach is to repeatedly divide `n` by 4 until we can't anymore, checking if we eventually reach 1:

1. If `n ≤ 0`, return `false` (negative numbers and zero can't be powers of four)
2. While `n % 4 == 0`, keep dividing `n` by 4
3. At the end, check if `n == 1`

While this approach works and has O(log₄n) time complexity, it's not the most efficient. More importantly, interviewers expect candidates to recognize the bit manipulation patterns in problems like this. The brute force approach misses the opportunity to showcase understanding of binary number properties.

## Optimal Solution

The optimal solution uses bit manipulation to check three conditions in O(1) time:

1. `n > 0` (positive numbers only)
2. `(n & (n - 1)) == 0` (checks if n is a power of two - only one '1' bit)
3. `(n & 0xAAAAAAAA) == 0` (checks if the '1' bit is in an odd position)

The third condition needs explanation: `0xAAAAAAAA` in binary is `10101010101010101010101010101010` (32 bits). This mask has '1's in all even positions (counting from the right, starting at position 1). By ANDing with this mask, we check that our number doesn't have a '1' in any even position, which means the single '1' must be in an odd position.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isPowerOfFour(n: int) -> bool:
    # Check 1: n must be positive (powers of four are always positive)
    if n <= 0:
        return False

    # Check 2: n must be a power of two (only one '1' bit in binary)
    # n & (n-1) == 0 is a classic trick to check if a number is power of two
    # For example: 8 (1000) & 7 (0111) = 0
    if (n & (n - 1)) != 0:
        return False

    # Check 3: The single '1' bit must be in an odd position
    # 0xAAAAAAAA has '1's in all even positions (1-indexed from right)
    # So if n & 0xAAAAAAAA == 0, the '1' bit is in an odd position
    return (n & 0xAAAAAAAA) == 0
```

```javascript
// Time: O(1) | Space: O(1)
function isPowerOfFour(n) {
  // Check 1: n must be positive (powers of four are always positive)
  if (n <= 0) {
    return false;
  }

  // Check 2: n must be a power of two (only one '1' bit in binary)
  // n & (n-1) == 0 is a classic trick to check if a number is power of two
  // For example: 8 (1000) & 7 (0111) = 0
  if ((n & (n - 1)) !== 0) {
    return false;
  }

  // Check 3: The single '1' bit must be in an odd position
  // 0xAAAAAAAA has '1's in all even positions (1-indexed from right)
  // So if n & 0xAAAAAAAA == 0, the '1' bit is in an odd position
  return (n & 0xaaaaaaaa) === 0;
}
```

```java
// Time: O(1) | Space: O(1)
public boolean isPowerOfFour(int n) {
    // Check 1: n must be positive (powers of four are always positive)
    if (n <= 0) {
        return false;
    }

    // Check 2: n must be a power of two (only one '1' bit in binary)
    // n & (n-1) == 0 is a classic trick to check if a number is power of two
    // For example: 8 (1000) & 7 (0111) = 0
    if ((n & (n - 1)) != 0) {
        return false;
    }

    // Check 3: The single '1' bit must be in an odd position
    // 0xAAAAAAAA has '1's in all even positions (1-indexed from right)
    // So if n & 0xAAAAAAAA == 0, the '1' bit is in an odd position
    return (n & 0xAAAAAAAA) == 0;
}
```

</div>

**Alternative Mathematical Approach:**
Another O(1) approach uses the fact that (n-1) must be divisible by 3 for powers of four:

- For powers of four: 4^x - 1 = (4-1)(4^(x-1) + 4^(x-2) + ... + 4 + 1)
- This is always divisible by 3
- So we can check: `n > 0 && (n & (n-1)) == 0 && (n-1) % 3 == 0`

## Complexity Analysis

**Time Complexity:** O(1)

- All operations are constant time: comparisons, bitwise AND, subtraction
- No loops or recursion involved

**Space Complexity:** O(1)

- We only use a few integer variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to check for n ≤ 0:** Many candidates jump straight into the bit manipulation without checking if n is positive. Powers of four are always positive, so negative numbers and zero should immediately return false.

2. **Confusing the mask for checking bit position:** Using `0x55555555` instead of `0xAAAAAAAA`. Remember: `0xAAAAAAAA` has '1's in even positions (we want these to be 0), while `0x55555555` has '1's in odd positions (we could use this with a different check).

3. **Not understanding why n & (n-1) works:** This is a classic bit trick for checking if a number is a power of two. When you subtract 1 from a power of two, all bits after the single '1' bit become '1', and the '1' bit becomes '0'. The AND operation then yields 0. For example: 8 (1000) & 7 (0111) = 0.

4. **Overcomplicating with loops or recursion:** While the loop approach (repeated division by 4) works, it's less efficient and doesn't demonstrate understanding of bit manipulation patterns that interviewers look for in these types of problems.

## When You'll See This Pattern

This pattern of using bit manipulation to check number properties appears in several related problems:

1. **Power of Two (LeetCode 231):** Uses `n > 0 && (n & (n-1)) == 0` without the position check.
2. **Power of Three (LeetCode 326):** Often solved with mathematical properties or repeated division, since there's no simple bit trick for base 3.
3. **Number of 1 Bits (LeetCode 191):** Uses `n & (n-1)` to clear the lowest set bit, counting how many times you can do this until n becomes 0.
4. **Single Number (LeetCode 136):** Uses XOR bit manipulation to find the unique element in an array.

The key insight is recognizing when numbers have special properties in their binary representation that allow for efficient checks without iteration.

## Key Takeaways

1. **Powers of two have exactly one '1' bit** in their binary representation, which can be checked with `(n & (n-1)) == 0` for positive n.

2. **Powers of four are a subset of powers of two** where the single '1' bit is in an odd position (1-indexed from the right). This can be checked with `(n & 0xAAAAAAAA) == 0`.

3. **Bit manipulation often provides O(1) solutions** for problems involving number properties, making it superior to iterative approaches when applicable.

Remember: Always check edge cases first (n ≤ 0), then apply the mathematical or bitwise properties specific to the problem.

Related problems: [Power of Two](/problem/power-of-two), [Power of Three](/problem/power-of-three)
