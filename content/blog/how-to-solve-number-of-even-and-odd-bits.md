---
title: "How to Solve Number of Even and Odd Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Even and Odd Bits. Easy difficulty, 73.4% acceptance rate. Topics: Bit Manipulation."
date: "2028-02-12"
category: "dsa-patterns"
tags: ["number-of-even-and-odd-bits", "bit-manipulation", "easy"]
---

# How to Solve Number of Even and Odd Bits

This problem asks us to count how many 1-bits appear at even positions versus odd positions in the binary representation of a positive integer. The tricky part is understanding that bit positions are indexed from the right (least significant bit), and we need to track which bits are at even indices (0, 2, 4, ...) versus odd indices (1, 3, 5, ...). This is a classic bit manipulation problem that tests your understanding of binary representation and bitwise operations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `n = 17`:

**Step 1: Find the binary representation**

- 17 in binary is `10001` (16 + 1)
- We write it with positions labeled from right to left:
  - Position 0 (rightmost): 1
  - Position 1: 0
  - Position 2: 0
  - Position 3: 0
  - Position 4: 1

**Step 2: Count even-positioned 1-bits**

- Even positions: 0, 2, 4
- Position 0: value = 1 ✓
- Position 2: value = 0 ✗
- Position 4: value = 1 ✓
- Total even-positioned 1-bits = 2

**Step 3: Count odd-positioned 1-bits**

- Odd positions: 1, 3
- Position 1: value = 0 ✗
- Position 3: value = 0 ✗
- Total odd-positioned 1-bits = 0

**Step 4: Result**

- `even = 2`, `odd = 0`
- Return `[2, 0]`

The key insight is that we need to examine each bit one by one, checking if it's a 1, and then determine if its position is even or odd.

## Brute Force Approach

A naive approach would be to:

1. Convert the integer to a binary string
2. Reverse the string (since bits are indexed from right to left)
3. Iterate through the reversed string, checking each character
4. Count 1s at even and odd indices

While this approach works, it's inefficient because:

- Converting to a string creates unnecessary overhead
- Reversing the string adds extra computation
- We're working with strings instead of direct bit operations

However, the problem constraints are small enough that even this approach would pass, but it doesn't demonstrate optimal bit manipulation skills that interviewers look for.

## Optimal Solution

The optimal approach uses bitwise operations directly:

1. Initialize counters for even and odd positions
2. Use a position counter starting at 0
3. While `n > 0`, check the least significant bit (LSB)
4. If LSB is 1, increment the appropriate counter based on position parity
5. Right shift `n` to examine the next bit
6. Increment position counter

This approach is efficient because:

- We process bits directly without string conversion
- We use bitwise AND to check individual bits
- We use right shift to move through bits
- Time complexity is O(log n) since we process each bit once

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def evenOddBit(n: int):
    """
    Count 1-bits at even and odd positions in binary representation.
    Positions are indexed from right to left (LSB = position 0).
    """
    even = 0  # Counter for even-positioned 1-bits
    odd = 0   # Counter for odd-positioned 1-bits
    pos = 0   # Current position (starting from LSB = position 0)

    # Process each bit until n becomes 0
    while n > 0:
        # Check if current LSB is 1 using bitwise AND with 1
        if n & 1 == 1:
            # If position is even (pos % 2 == 0), increment even counter
            if pos % 2 == 0:
                even += 1
            else:
                # Otherwise, position is odd, increment odd counter
                odd += 1

        # Right shift n by 1 to examine the next bit
        n >>= 1
        # Move to the next position
        pos += 1

    return [even, odd]
```

```javascript
// Time: O(log n) | Space: O(1)
function evenOddBit(n) {
  /**
   * Count 1-bits at even and odd positions in binary representation.
   * Positions are indexed from right to left (LSB = position 0).
   */
  let even = 0; // Counter for even-positioned 1-bits
  let odd = 0; // Counter for odd-positioned 1-bits
  let pos = 0; // Current position (starting from LSB = position 0)

  // Process each bit until n becomes 0
  while (n > 0) {
    // Check if current LSB is 1 using bitwise AND with 1
    if ((n & 1) === 1) {
      // If position is even (pos % 2 === 0), increment even counter
      if (pos % 2 === 0) {
        even++;
      } else {
        // Otherwise, position is odd, increment odd counter
        odd++;
      }
    }

    // Right shift n by 1 to examine the next bit
    n >>= 1;
    // Move to the next position
    pos++;
  }

  return [even, odd];
}
```

```java
// Time: O(log n) | Space: O(1)
public int[] evenOddBit(int n) {
    /**
     * Count 1-bits at even and odd positions in binary representation.
     * Positions are indexed from right to left (LSB = position 0).
     */
    int even = 0;  // Counter for even-positioned 1-bits
    int odd = 0;   // Counter for odd-positioned 1-bits
    int pos = 0;   // Current position (starting from LSB = position 0)

    // Process each bit until n becomes 0
    while (n > 0) {
        // Check if current LSB is 1 using bitwise AND with 1
        if ((n & 1) == 1) {
            // If position is even (pos % 2 == 0), increment even counter
            if (pos % 2 == 0) {
                even++;
            } else {
                // Otherwise, position is odd, increment odd counter
                odd++;
            }
        }

        // Right shift n by 1 to examine the next bit
        n >>= 1;
        // Move to the next position
        pos++;
    }

    return new int[]{even, odd};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- We process each bit of the number exactly once
- The number of bits in binary representation is log₂(n)
- Each iteration does constant-time operations (bitwise AND, modulo, increment, right shift)

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (even, odd, pos)
- No additional data structures that grow with input size
- The output array of size 2 is not counted in space complexity analysis

## Common Mistakes

1. **Incorrect bit indexing**: Forgetting that positions start from the right (LSB = position 0) instead of the left. This leads to reversed even/odd counts. Always remember: least significant bit is position 0.

2. **Not resetting counters**: Forgetting to initialize `even` and `odd` to 0, or reusing them between test cases in an interview setting. Always initialize your variables.

3. **Infinite loop with negative numbers**: The problem states `n` is positive, but if you extend the solution to handle all integers, using `while (n != 0)` with right shift on negative numbers can cause issues in some languages. For positive numbers, `while (n > 0)` is safe.

4. **Off-by-one in position tracking**: Starting position at 1 instead of 0, or incrementing position before checking the bit. The LSB is always position 0, so start there and increment after processing each bit.

## When You'll See This Pattern

This problem uses fundamental bit manipulation techniques that appear in many coding problems:

1. **Counting set bits (Hamming weight)**: Problems like [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) use similar bit checking with `n & 1` and right shifting.

2. **Bit position analysis**: Problems like [Reverse Bits](https://leetcode.com/problems/reverse-bits/) require examining bits at specific positions and reconstructing numbers.

3. **Binary representation analysis**: Problems like [Binary Gap](https://leetcode.com/problems/binary-gap/) involve finding patterns in binary representations by examining individual bits.

The core pattern is: use `n & 1` to check the LSB, use `n >>= 1` to shift to the next bit, and track position/index as you go through bits.

## Key Takeaways

1. **Bitwise operations are efficient**: When working with binary representations, direct bit manipulation is usually more efficient than string conversion. Use `& 1` to check bits and `>>` to shift.

2. **Position matters**: Always clarify whether bit positions are indexed from left or right. In this problem, LSB = position 0 is a critical detail.

3. **Iterate until zero**: When processing all bits of a positive integer, `while (n > 0)` is a clean way to iterate through each bit without needing to know the total number of bits in advance.

Related problems: [Find Numbers with Even Number of Digits](/problem/find-numbers-with-even-number-of-digits)
