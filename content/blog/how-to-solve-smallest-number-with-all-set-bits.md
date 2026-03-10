---
title: "How to Solve Smallest Number With All Set Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Number With All Set Bits. Easy difficulty, 80.3% acceptance rate. Topics: Math, Bit Manipulation."
date: "2026-05-15"
category: "dsa-patterns"
tags: ["smallest-number-with-all-set-bits", "math", "bit-manipulation", "easy"]
---

# How to Solve Smallest Number With All Set Bits

You are given a positive integer `n` and must find the smallest number `x ≥ n` whose binary representation consists entirely of `1`s (all bits set). This problem is interesting because while it appears to be about bit manipulation, the optimal solution relies on a mathematical insight about the structure of numbers with all bits set.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 10` (binary `1010`).

Numbers with all bits set are of the form `2^k - 1`:

- `1` (binary `1`) = 2¹ - 1
- `3` (binary `11`) = 2² - 1
- `7` (binary `111`) = 2³ - 1
- `15` (binary `1111`) = 2⁴ - 1
- `31` (binary `11111`) = 2⁵ - 1

For `n = 10`, we need the smallest `2^k - 1 ≥ 10`:

- 7 < 10 (too small)
- 15 ≥ 10 ✓

So the answer is `15`. Notice that `15` in binary is `1111`, which has all bits set.

Another example: `n = 7` (binary `111`). Since 7 itself is already all set bits, the answer is `7`.

The key insight: **We need to find the smallest power of two greater than `n`, then subtract 1.** Why? Because if `n` is not already all set bits, the next number with all set bits will be `(1 << k) - 1` where `k` is the number of bits needed to represent `n`.

## Brute Force Approach

A naive approach would be to start from `n` and check each subsequent number until we find one with all bits set:

1. Start with `x = n`
2. While `x` doesn't have all bits set (i.e., `x & (x + 1) != 0` or checking bits individually)
3. Increment `x` by 1
4. Return `x` when condition is met

This approach is inefficient because:

- In the worst case (when `n = 2^k`), we might need to check up to `2^k` numbers
- For large `n` (up to 10⁹), this could mean checking billions of numbers
- Time complexity is O(2^k) where k is the number of bits in `n`, which is exponential in the input size

The brute force fails because it doesn't leverage the mathematical structure of numbers with all bits set.

## Optimal Solution

The optimal solution uses bit manipulation to find the answer in constant time. Here's the reasoning:

1. If `n` already has all bits set, return `n`
2. Otherwise, find the position of the most significant bit (MSB) of `n`
3. The answer is `(1 << (MSB + 1)) - 1`

Why does this work? Consider `n = 10` (binary `1010`):

- MSB position = 3 (bits are numbered from 0, so bit 3 is the leftmost 1)
- `1 << (3 + 1)` = `1 << 4` = 16
- `16 - 1 = 15` ✓

For `n = 7` (binary `111`):

- MSB position = 2
- `(1 << (2 + 1)) - 1` = `(1 << 3) - 1` = `8 - 1 = 7` ✓

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def smallestAllSetBits(n: int) -> int:
    """
    Returns the smallest number >= n with all bits set.

    Approach:
    1. If n already has all bits set, return n
    2. Otherwise, find the position of the most significant bit (MSB)
    3. The answer is (1 << (MSB + 1)) - 1

    Example: n = 10 (1010)
    - MSB position = 3
    - (1 << 4) - 1 = 16 - 1 = 15 (1111)
    """

    # Check if n already has all bits set
    # A number has all bits set if n & (n + 1) == 0
    # Example: 7 (111) & 8 (1000) = 0
    if (n & (n + 1)) == 0:
        return n

    # Find the position of the most significant bit (MSB)
    # We can do this by counting how many times we need to right shift
    # until n becomes 0
    msb_pos = 0
    temp = n
    while temp > 0:
        temp >>= 1
        msb_pos += 1

    # Alternative: use bit_length() method in Python
    # msb_pos = n.bit_length()

    # The smallest number with all bits set and >= n is
    # (1 << (msb_pos + 1)) - 1
    # This creates a number with msb_pos+1 bits all set to 1
    return (1 << msb_pos) - 1
```

```javascript
// Time: O(1) | Space: O(1)
function smallestAllSetBits(n) {
  /**
   * Returns the smallest number >= n with all bits set.
   *
   * Approach:
   * 1. If n already has all bits set, return n
   * 2. Otherwise, find the position of the most significant bit (MSB)
   * 3. The answer is (1 << (MSB + 1)) - 1
   */

  // Check if n already has all bits set
  // A number has all bits set if n & (n + 1) === 0
  if ((n & (n + 1)) === 0) {
    return n;
  }

  // Find the position of the most significant bit (MSB)
  let msbPos = 0;
  let temp = n;
  while (temp > 0) {
    temp >>= 1; // Right shift by 1
    msbPos++;
  }

  // Alternative: use Math.floor(Math.log2(n)) + 1
  // But careful with n = 0 (not possible here since n is positive)

  // The smallest number with all bits set and >= n is
  // (1 << (msbPos + 1)) - 1
  // This creates a number with msbPos+1 bits all set to 1
  return (1 << msbPos) - 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int smallestAllSetBits(int n) {
        /**
         * Returns the smallest number >= n with all bits set.
         *
         * Approach:
         * 1. If n already has all bits set, return n
         * 2. Otherwise, find the position of the most significant bit (MSB)
         * 3. The answer is (1 << (MSB + 1)) - 1
         */

        // Check if n already has all bits set
        // A number has all bits set if n & (n + 1) == 0
        if ((n & (n + 1)) == 0) {
            return n;
        }

        // Find the position of the most significant bit (MSB)
        int msbPos = 0;
        int temp = n;
        while (temp > 0) {
            temp >>= 1;  // Right shift by 1
            msbPos++;
        }

        // Alternative: use Integer.toBinaryString(n).length()
        // But that creates string overhead

        // The smallest number with all bits set and >= n is
        // (1 << (msbPos + 1)) - 1
        // This creates a number with msbPos+1 bits all set to 1
        // Note: 1 << msbPos would give us 2^msbPos
        // Subtracting 1 gives us all bits set
        return (1 << msbPos) - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The while loop to find the MSB position runs at most 32 times for 32-bit integers (or 64 times for 64-bit)
- In asymptotic analysis, this is considered constant time since the number of iterations is bounded by the word size
- All other operations (bitwise AND, addition, subtraction) are O(1)

**Space Complexity: O(1)**

- We use only a constant amount of extra space (a few integer variables)
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting to check if `n` already has all bits set**: Some candidates jump straight to finding the MSB and computing `(1 << (msb + 1)) - 1`. This works for most cases but returns the wrong answer when `n` itself is already all set bits (like `n = 7`). Always check the edge case first.

2. **Off-by-one errors with bit positions**: Remember that bit positions are typically 0-indexed from the right. If `n = 4` (binary `100`), the MSB is at position 2, not 3. The formula should be `(1 << (msb_pos + 1)) - 1`, not `(1 << msb_pos) - 1`.

3. **Integer overflow with large `n`**: When `n` is close to the maximum integer value (e.g., `2^31 - 1`), computing `(1 << (msb_pos + 1))` could overflow. However, since the problem guarantees the answer fits in the integer type, this isn't an issue in practice, but it's good to be aware of.

4. **Using logarithms instead of bit shifting**: Some candidates try `Math.floor(Math.log2(n)) + 1` to find the MSB position. While this works mathematically, it's less efficient and can have floating-point precision issues for very large `n`. Bit shifting is more reliable and faster.

## When You'll See This Pattern

This problem teaches the pattern of **recognizing numbers with specific bit patterns** and using **bit manipulation to find boundaries**. You'll see similar patterns in:

1. **Power of Two problems**: Checking if a number is a power of two (`n & (n-1) == 0`) uses similar bit manipulation techniques.

2. **Bitmask generation**: Problems that require generating masks with specific bit patterns often use `(1 << k) - 1` to create masks with `k` bits set.

3. **Range queries with bitwise operations**: Some segment tree and binary indexed tree problems use similar techniques to compute ranges based on bit patterns.

Specific related problems:

- **231. Power of Two**: Uses `n & (n-1) == 0` to check if a number is a power of two
- **342. Power of Four**: Extends the power of two concept with additional constraints
- **476. Number Complement**: Involves finding bit masks similar to `(1 << k) - 1`

## Key Takeaways

1. **Numbers with all bits set have the form `2^k - 1`**: This mathematical insight is crucial for solving the problem efficiently. Recognizing special forms of numbers (powers of two, numbers with all bits set, etc.) is a valuable skill in bit manipulation problems.

2. **Use `n & (n + 1) == 0` to check if all bits are set**: This is a useful bit trick to remember. Similarly, `n & (n - 1) == 0` checks if a number is a power of two.

3. **Finding the MSB position is key to many bit manipulation problems**: Whether through counting right shifts or using built-in functions, being able to quickly find the most significant bit position enables solutions to many problems involving bit ranges and masks.

Related problems: [Minimum Number of K Consecutive Bit Flips](/problem/minimum-number-of-k-consecutive-bit-flips), [Minimum Bit Flips to Convert Number](/problem/minimum-bit-flips-to-convert-number), [Find Sum of Array Product of Magical Sequences](/problem/find-sum-of-array-product-of-magical-sequences)
