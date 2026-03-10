---
title: "How to Solve Reverse Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Bits. Easy difficulty, 67.8% acceptance rate. Topics: Divide and Conquer, Bit Manipulation."
date: "2026-08-16"
category: "dsa-patterns"
tags: ["reverse-bits", "divide-and-conquer", "bit-manipulation", "easy"]
---

# How to Solve Reverse Bits

Reverse Bits asks you to reverse the binary representation of a 32-bit unsigned integer. While the concept is straightforward, this problem is interesting because it tests your understanding of bit manipulation fundamentals—a crucial skill for systems programming, embedded development, and optimization problems. The challenge lies in efficiently extracting and rearranging bits without using string conversions or excessive memory.

## Visual Walkthrough

Let's trace through reversing the bits of a small 8-bit number (for simplicity) to build intuition before tackling the 32-bit version.

**Example:** Reverse the bits of `13` (8-bit representation)

1. **Binary representation:** `13` in binary is `00001101`
2. **Goal:** We want to reverse this to get `10110000` (which is `176` in decimal)

**Step-by-step process:**

- Start with `result = 00000000` (all zeros)
- Original number: `00001101`

**Iteration 1:**

- Extract rightmost bit of original: `00001101 & 1 = 1`
- Shift result left: `00000000 << 1 = 00000000`
- Add extracted bit: `00000000 | 1 = 00000001`
- Shift original right: `00001101 >> 1 = 00000110`

**Iteration 2:**

- Extract rightmost bit: `00000110 & 1 = 0`
- Shift result left: `00000001 << 1 = 00000010`
- Add extracted bit: `00000010 | 0 = 00000010`
- Shift original right: `00000110 >> 1 = 00000011`

**Iteration 3:**

- Extract rightmost bit: `00000011 & 1 = 1`
- Shift result left: `00000010 << 1 = 00000100`
- Add extracted bit: `00000100 | 1 = 00000101`
- Shift original right: `00000011 >> 1 = 00000001`

Continue this process for all 8 bits. After 8 iterations, we'll have the fully reversed number.

## Brute Force Approach

A naive approach might convert the number to a binary string, reverse the string, and convert back to integer. While this works conceptually, it's inefficient and doesn't demonstrate bit manipulation skills that interviewers want to see.

**Why this approach is problematic:**

1. **Inefficient:** String operations have overhead compared to bitwise operations
2. **Missing the point:** Interviewers ask bit manipulation problems to test your understanding of bits, not string manipulation
3. **Edge cases:** Need to handle leading zeros properly when converting to/from strings
4. **32-bit constraint:** Must ensure we're working with exactly 32 bits

Even though the problem is marked "Easy," using string manipulation would be considered a suboptimal solution in a coding interview setting. Interviewers expect to see bitwise operations.

## Optimal Solution

The optimal solution uses bit manipulation to extract bits from the input one by one and build the reversed result. We iterate 32 times (for 32-bit integers), each time:

1. Extract the rightmost bit of the input
2. Shift our result left to make room for the new bit
3. Add the extracted bit to the result
4. Shift the input right to process the next bit

This approach is efficient, uses constant space, and demonstrates strong understanding of bit operations.

<div class="code-group">

```python
# Time: O(1) - Always 32 iterations | Space: O(1) - Constant extra space
def reverseBits(n: int) -> int:
    """
    Reverse the bits of a 32-bit unsigned integer.

    Args:
        n: 32-bit unsigned integer to reverse

    Returns:
        The integer with bits reversed
    """
    result = 0  # Initialize result to 0

    # Process all 32 bits
    for i in range(32):
        # Step 1: Extract the rightmost bit of n
        # Using bitwise AND with 1 gives us the least significant bit
        bit = n & 1

        # Step 2: Shift result left to make room for the new bit
        # This moves all existing bits one position to the left
        result <<= 1

        # Step 3: Add the extracted bit to the result
        # Using bitwise OR places the bit in the least significant position
        result |= bit

        # Step 4: Shift n right to process the next bit
        # This moves the next bit into the least significant position
        n >>= 1

    return result

# Alternative one-liner (less readable but demonstrates Python's capabilities):
# def reverseBits(n):
#     return int(bin(n)[2:].zfill(32)[::-1], 2)
```

```javascript
// Time: O(1) - Always 32 iterations | Space: O(1) - Constant extra space
/**
 * Reverse the bits of a 32-bit unsigned integer.
 *
 * @param {number} n - 32-bit unsigned integer to reverse
 * @return {number} The integer with bits reversed
 */
function reverseBits(n) {
  let result = 0; // Initialize result to 0

  // Process all 32 bits
  for (let i = 0; i < 32; i++) {
    // Step 1: Extract the rightmost bit of n
    // Using bitwise AND with 1 gives us the least significant bit
    const bit = n & 1;

    // Step 2: Shift result left to make room for the new bit
    // This moves all existing bits one position to the left
    result <<= 1;

    // Step 3: Add the extracted bit to the result
    // Using bitwise OR places the bit in the least significant position
    result |= bit;

    // Step 4: Shift n right to process the next bit
    // This moves the next bit into the least significant position
    n >>>= 1; // Use unsigned right shift for JavaScript
  }

  // In JavaScript, we need to convert to unsigned 32-bit integer
  return result >>> 0;
}
```

```java
// Time: O(1) - Always 32 iterations | Space: O(1) - Constant extra space
public class Solution {
    /**
     * Reverse the bits of a 32-bit unsigned integer.
     *
     * @param n 32-bit unsigned integer to reverse
     * @return The integer with bits reversed
     */
    public int reverseBits(int n) {
        int result = 0;  // Initialize result to 0

        // Process all 32 bits
        for (int i = 0; i < 32; i++) {
            // Step 1: Extract the rightmost bit of n
            // Using bitwise AND with 1 gives us the least significant bit
            int bit = n & 1;

            // Step 2: Shift result left to make room for the new bit
            // This moves all existing bits one position to the left
            result <<= 1;

            // Step 3: Add the extracted bit to the result
            // Using bitwise OR places the bit in the least significant position
            result |= bit;

            // Step 4: Shift n right to process the next bit
            // This moves the next bit into the least significant position
            n >>>= 1;  // Use unsigned right shift in Java
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We always perform exactly 32 iterations regardless of the input value
- Each iteration performs a constant number of bitwise operations (AND, OR, shifts)
- This is the optimal time complexity for this problem

**Space Complexity:** O(1)

- We only use a few integer variables (`result`, `bit`, loop counter)
- No additional data structures that grow with input size
- Memory usage is constant regardless of input

The O(1) complexity might seem surprising since we're processing bits, but remember that 32-bit integers have a fixed size. If we were dealing with arbitrary-precision integers (BigInt), the complexity would be O(log n) where n is the input value.

## Common Mistakes

1. **Using signed right shift instead of unsigned:** In Java and JavaScript, `>>` is signed right shift (preserves sign bit), while `>>>` is unsigned right shift (fills with zeros). Using `>>` can cause incorrect results for negative numbers or lead to infinite loops.

2. **Not handling all 32 bits:** Some candidates try to be clever by stopping when `n` becomes 0, but this fails for numbers with leading zeros. We must always process all 32 bits.

3. **Forgetting to shift result before adding the bit:** The order matters! If you add the bit first then shift, you'll be off by one position. Always shift result left, then add the new bit to the least significant position.

4. **Integer overflow in languages without unsigned types:** In Java, which doesn't have unsigned integers, you need to be careful. The solution above handles this correctly by using `>>>` for right shifts and returning an `int` that represents the unsigned value.

## When You'll See This Pattern

This bit-by-bit extraction and reconstruction pattern appears in many bit manipulation problems:

1. **Number of 1 Bits (LeetCode 191):** Similar extraction of bits using `n & 1` and `n >>= 1`, but instead of building a reversed number, you count the 1s.

2. **Power of Two (LeetCode 231):** Uses bitwise AND to check if a number has exactly one bit set: `n & (n-1) == 0`.

3. **Single Number (LeetCode 136):** Uses XOR to find the unique element in an array where every other element appears twice.

4. **Sum of Two Integers (LeetCode 371):** Uses bitwise operations to add numbers without the `+` operator.

The core technique of extracting bits with `& 1`, shifting with `<<` and `>>`, and combining with `|` is fundamental to many bit manipulation problems.

## Key Takeaways

1. **Bit extraction pattern:** To process bits from least significant to most significant, repeatedly use `bit = n & 1` followed by `n >>= 1`. This is a fundamental pattern for many bit manipulation problems.

2. **Bit construction pattern:** To build a number bit by bit, repeatedly use `result <<= 1` followed by `result |= bit`. This places new bits in the least significant position.

3. **Fixed-width operations:** When working with fixed-width integers (like 32-bit), time complexity is often O(1) because you process a constant number of bits regardless of the input value.

4. **Shift operator nuances:** Remember the difference between signed (`>>`) and unsigned (`>>>`) right shifts, especially in Java and JavaScript where integers are signed by default.

Mastering these bit manipulation fundamentals will help you solve more complex problems involving bits, optimization, and low-level programming concepts.

**Related problems:** [Reverse Integer](/problem/reverse-integer), [Number of 1 Bits](/problem/number-of-1-bits), [A Number After a Double Reversal](/problem/a-number-after-a-double-reversal)
