---
title: "How to Solve Convert a Number to Hexadecimal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert a Number to Hexadecimal. Easy difficulty, 53.3% acceptance rate. Topics: Math, String, Bit Manipulation."
date: "2028-08-24"
category: "dsa-patterns"
tags: ["convert-a-number-to-hexadecimal", "math", "string", "bit-manipulation", "easy"]
---

# How to Solve Convert a Number to Hexadecimal

This problem asks us to convert a 32-bit integer into its hexadecimal string representation, handling negative numbers using two's complement. While it's labeled "Easy," it becomes interesting because you can't simply use built-in conversion functions for negative numbers in most languages—you need to understand how two's complement works and handle the 32-bit constraint properly.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: Positive number (26)**

```
Decimal: 26
Binary: 0000 0000 0000 0000 0000 0000 0001 1010 (32-bit representation)

Group into 4-bit chunks (hex digits):
0000 = 0
0000 = 0
0000 = 0
0000 = 0
0000 = 0
0000 = 0
0000 = 0
0001 1010 = 1A

Result: "1a" (leading zeros are dropped)
```

**Example 2: Negative number (-1)**

```
Decimal: -1
Two's complement representation (32-bit):
1111 1111 1111 1111 1111 1111 1111 1111

Group into 4-bit chunks:
1111 = f
1111 = f
1111 = f
1111 = f
1111 = f
1111 = f
1111 = f
1111 = f

Result: "ffffffff"
```

The key insight: For negative numbers, we need to work with their two's complement representation, which for a 32-bit integer `num` is equivalent to `num + 2^32` (or `num & 0xffffffff` in bitwise operations).

## Brute Force Approach

A naive approach might try to repeatedly divide by 16 and track remainders. However, this fails for negative numbers because the sign affects the division. Consider -26:

```
-26 ÷ 16 = -1 remainder -10 (but remainders should be positive!)
```

We could convert to positive first, but that loses the two's complement representation we need. Another naive approach might convert to binary string first, then group into 4-bit chunks, but this is inefficient and requires handling padding to 32 bits.

The real issue is that we need to handle the 32-bit constraint properly. If we simply use `abs(num)` and convert, we'll get wrong results for negative numbers because we're not working with their two's complement representation.

## Optimal Solution

The optimal approach uses bit manipulation to handle both positive and negative numbers uniformly. We'll:

1. Handle the special case of 0
2. Map hex digits 0-15 to characters '0'-'9' and 'a'-'f'
3. Use a mask (0xf) to extract the last 4 bits
4. Right shift by 4 bits to process the next group
5. Continue until all 32 bits are processed (8 hex digits maximum)

The trick is to convert negative numbers to their unsigned 32-bit equivalent using `num & 0xffffffff` (Python/JavaScript) or by working directly with the bits (Java).

<div class="code-group">

```python
# Time: O(1) - Always process at most 8 hex digits (32 bits ÷ 4 bits per hex)
# Space: O(1) - Fixed size arrays and string builder
class Solution:
    def toHex(self, num: int) -> str:
        # Handle edge case: 0 maps directly to "0"
        if num == 0:
            return "0"

        # Map each possible 4-bit value (0-15) to its hex character
        hex_chars = "0123456789abcdef"

        result = []

        # Convert negative numbers to their 32-bit unsigned equivalent
        # For negative numbers, this gives us the two's complement representation
        # For positive numbers, it remains unchanged (since 0xffffffff has all bits set)
        num &= 0xffffffff

        # Process each 4-bit chunk (hex digit) from right to left
        while num > 0:
            # Extract the last 4 bits using bitwise AND with 0xf (binary 1111)
            digit = num & 0xf

            # Convert the 4-bit value to its hex character
            result.append(hex_chars[digit])

            # Right shift by 4 bits to process the next hex digit
            # Using >>= ensures we work with the next 4 bits in the next iteration
            num >>= 4

        # We processed from right to left (least significant digit first),
        # so we need to reverse the result to get the correct order
        return ''.join(reversed(result))
```

```javascript
// Time: O(1) - Always process at most 8 hex digits (32 bits ÷ 4 bits per hex)
// Space: O(1) - Fixed size arrays and string builder
/**
 * @param {number} num
 * @return {string}
 */
var toHex = function (num) {
  // Handle edge case: 0 maps directly to "0"
  if (num === 0) {
    return "0";
  }

  // Map each possible 4-bit value (0-15) to its hex character
  const hexChars = "0123456789abcdef";

  const result = [];

  // Convert negative numbers to their 32-bit unsigned equivalent
  // In JavaScript, we use >>> 0 to get the unsigned 32-bit representation
  // This handles two's complement for negative numbers
  let unsignedNum = num >>> 0;

  // Process each 4-bit chunk (hex digit) from right to left
  while (unsignedNum > 0) {
    // Extract the last 4 bits using bitwise AND with 0xf (binary 1111)
    const digit = unsignedNum & 0xf;

    // Convert the 4-bit value to its hex character
    result.push(hexChars[digit]);

    // Right shift by 4 bits to process the next hex digit
    // Using >>> ensures we treat the number as unsigned during shifting
    unsignedNum >>>= 4;
  }

  // We processed from right to left (least significant digit first),
  // so we need to reverse the result to get the correct order
  return result.reverse().join("");
};
```

```java
// Time: O(1) - Always process at most 8 hex digits (32 bits ÷ 4 bits per hex)
// Space: O(1) - Fixed size arrays and string builder
class Solution {
    public String toHex(int num) {
        // Handle edge case: 0 maps directly to "0"
        if (num == 0) {
            return "0";
        }

        // Map each possible 4-bit value (0-15) to its hex character
        char[] hexChars = "0123456789abcdef".toCharArray();

        StringBuilder result = new StringBuilder();

        // Process each 4-bit chunk (hex digit)
        // We need to process all 32 bits (8 hex digits) for consistency
        // Using a fixed loop ensures we handle negative numbers correctly
        for (int i = 7; i >= 0; i--) {
            // Extract 4 bits at position i (each hex digit represents 4 bits)
            // Shift right by i*4 to bring the target bits to the rightmost position
            // Then mask with 0xf to get only the last 4 bits
            int digit = (num >> (i * 4)) & 0xf;

            // Skip leading zeros
            if (result.length() == 0 && digit == 0) {
                continue;
            }

            // Convert the 4-bit value to its hex character
            result.append(hexChars[digit]);
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We process at most 8 hex digits (32 bits ÷ 4 bits per hex digit)
- Even with the while loop, it runs at most 8 times
- The Java for loop always runs exactly 8 times
- All operations inside the loop are constant time

**Space Complexity: O(1)**

- We use a fixed-size character map (16 characters)
- The result string grows to at most 8 characters
- No additional data structures scale with input size
- Auxiliary space is constant regardless of input

## Common Mistakes

1. **Not handling negative numbers correctly**: The most common mistake is using `abs(num)` or simple division for negative numbers. Remember that negative numbers in two's complement have a specific bit pattern that `abs()` doesn't capture. Always use bit masking (`& 0xffffffff`) or unsigned right shift (`>>>`) to get the correct representation.

2. **Forgetting to handle zero**: If you start with `while (num > 0)` or similar, you'll return an empty string for input `0`. Always check for zero as a special case at the beginning.

3. **Incorrect digit mapping**: Using `chr(digit + 48)` for 0-9 and `chr(digit + 87)` for 10-15 is error-prone. It's safer to use a lookup table `"0123456789abcdef"` which is clearer and less prone to off-by-one errors.

4. **Not reversing the result**: When building the string from least significant digit to most significant (right to left), you must reverse the final result. If you forget this, you'll get the hex digits in reverse order.

5. **Infinite loop with negative numbers**: If you use `while (num != 0)` without converting to unsigned, negative numbers will never become 0 with right shifting in some languages (Python preserves sign with `>>`, Java doesn't with `>>>`).

## When You'll See This Pattern

This problem teaches several important patterns:

1. **Bit manipulation for base conversion**: Similar problems include:
   - [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/) - Also uses bit extraction and shifting
   - [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) - Counts set bits using similar masking techniques
   - [405. Convert a Number to Hexadecimal](https://leetcode.com/problems/convert-a-number-to-hexadecimal/) (this problem)

2. **Two's complement understanding**: Essential for:
   - [371. Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) - Uses bitwise operations without + operator
   - Any problem dealing with binary representation of negative numbers

3. **Working with fixed-width integers**: Important for:
   - Problems that specify 32-bit or 64-bit constraints
   - Systems programming or low-level bit manipulation questions

## Key Takeaways

1. **Bit masking is your friend**: When working with specific bits, use `&` with a mask to extract them. For hex digits, `& 0xf` extracts the last 4 bits.

2. **Right shift to process bits in chunks**: After processing a group of bits, right shift to bring the next group into position. Remember the difference between signed (`>>`) and unsigned (`>>>`) right shift.

3. **Handle edge cases first**: Always check for 0, maximum/minimum values, or other special cases before entering your main logic loop.

4. **Two's complement conversion**: For negative numbers in a fixed-width system, `value & ((1 << n) - 1)` gives the unsigned representation, where `n` is the number of bits (32 in this case).

[Practice this problem on CodeJeet](/problem/convert-a-number-to-hexadecimal)
