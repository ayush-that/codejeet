---
title: "How to Solve Number Complement — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number Complement. Easy difficulty, 70.4% acceptance rate. Topics: Bit Manipulation."
date: "2027-04-17"
category: "dsa-patterns"
tags: ["number-complement", "bit-manipulation", "easy"]
---

# How to Solve Number Complement

The problem asks us to find the bitwise complement of a given integer — flipping all 0s to 1s and all 1s to 0s in its binary representation. What makes this interesting is that we can't simply use the bitwise NOT operator (`~`) directly, because that flips _all_ bits including leading zeros, giving us a negative number. The key challenge is determining exactly how many bits we need to flip.

## Visual Walkthrough

Let's trace through `num = 5` (binary `101`):

1. **Binary representation**: `5` in binary is `101`
2. **What we want**: Flip each bit → `010` (which is decimal `2`)
3. **The problem with direct NOT**: If we use `~5`, we get `...11111010` (in 32-bit representation), which is `-6`, not `2`
4. **The solution**: We need to create a **mask** that has `1`s only in the positions where `num` has significant bits
   - For `5` (binary `101`), we need a mask of `111` (binary)
   - `111` in decimal is `7`
5. **Apply the mask**: `~5 & 7 = ...11111010 & 00000111 = 00000010 = 2`

Let's try another example with `num = 10` (binary `1010`):

1. Binary: `1010`
2. Desired complement: `0101` (decimal `5`)
3. Mask needed: `1111` (binary, decimal `15`)
4. Calculation: `~10 & 15 = ...11110101 & 00001111 = 00000101 = 5`

The pattern is clear: we need to find the smallest power of two greater than `num`, subtract 1 to get our mask, then apply `~num & mask`.

## Brute Force Approach

A naive approach might convert the number to a binary string, flip each character, then convert back:

1. Convert `num` to binary string (e.g., `bin(5)[2:]` → `"101"`)
2. Create a new string by flipping each character (`"0"` → `"1"`, `"1"` → `"0"`)
3. Convert the flipped binary string back to integer

While this works, it's inefficient for large numbers and misses the opportunity to demonstrate bit manipulation skills. More importantly, it doesn't handle the leading zeros issue elegantly — we'd need to manually track the number of significant bits.

The string approach has O(k) time complexity where k is the number of bits, which is acceptable but not optimal. However, interviewers typically expect the bit manipulation solution for this problem.

## Optimal Solution

The optimal solution uses bit manipulation with a mask. Here's the step-by-step reasoning:

1. **Find the highest set bit**: We need to determine how many bits are significant in `num`
2. **Create a mask**: Build a number with `1`s in all positions from bit 0 up to the highest set bit
3. **Apply the mask**: Use `~num & mask` to flip only the relevant bits

There are two common ways to create the mask:

- **Method 1**: Find the next power of two greater than `num`, then subtract 1
- **Method 2**: Build the mask iteratively by shifting bits

We'll implement Method 2 as it's more intuitive and doesn't risk overflow.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since integers have fixed bit length (32 or 64 bits), this is constant time
def findComplement(num: int) -> int:
    """
    Returns the bitwise complement of num, flipping only the significant bits.

    Approach:
    1. Create a mask with 1s in all positions where num has bits
    2. XOR num with mask to flip the bits (or use NOT AND mask)

    Example: num = 5 (101)
    - mask = 111 (7)
    - ~5 & 7 = 010 (2)
    """
    # Start with mask = num (we'll build from this)
    mask = num

    # Propagate 1-bits to the right to create a full mask
    # This technique sets all bits to the right of the highest set bit to 1
    mask |= mask >> 1
    mask |= mask >> 2
    mask |= mask >> 4
    mask |= mask >> 8
    mask |= mask >> 16

    # For 64-bit integers, you would add: mask |= mask >> 32

    # Now mask has 1s in all positions from bit 0 to the highest set bit
    # Example: if num = 5 (00000101), mask becomes 00000111

    # Flip num and apply mask to keep only the relevant bits
    return ~num & mask

# Alternative implementation that might be more intuitive:
def findComplementAlt(num: int) -> int:
    """
    Alternative approach: Build mask by finding highest bit position.
    """
    # Find the highest bit position
    bit_length = 0
    n = num
    while n > 0:
        bit_length += 1
        n >>= 1

    # Create mask with bit_length number of 1s
    # (1 << bit_length) gives us 1000... with bit_length zeros
    # Subtract 1 to get 111... with bit_length ones
    mask = (1 << bit_length) - 1 if num > 0 else 1

    # Flip and mask
    return ~num & mask
```

```javascript
// Time: O(1) | Space: O(1)
// JavaScript uses 32-bit signed integers for bitwise operations
/**
 * Returns the bitwise complement of num, flipping only the significant bits.
 *
 * @param {number} num - The input integer
 * @return {number} - The complement of num
 */
function findComplement(num) {
  // Create a mask with 1s in all positions where num has bits
  let mask = num;

  // Propagate 1-bits to the right to create a full mask
  // This technique efficiently sets all bits to the right of MSB to 1
  mask |= mask >>> 1; // Use >>> for unsigned right shift
  mask |= mask >>> 2;
  mask |= mask >>> 4;
  mask |= mask >>> 8;
  mask |= mask >>> 16;

  // For completeness, though JavaScript bitwise ops use 32 bits
  mask |= mask >>> 32;

  // Flip num and apply mask to keep only relevant bits
  // Note: JavaScript bitwise NOT (~) works on 32-bit signed integers
  return ~num & mask;
}

// Alternative implementation:
function findComplementAlt(num) {
  // Handle edge case: complement of 0 is 1
  if (num === 0) return 1;

  // Find the position of the highest set bit
  let bitLength = 0;
  let temp = num;
  while (temp > 0) {
    bitLength++;
    temp >>= 1; // Right shift to check next bit
  }

  // Create mask with bitLength number of 1s
  // (1 << bitLength) gives 1000... then subtract 1 for 111...
  const mask = (1 << bitLength) - 1;

  // Flip bits and apply mask
  return ~num & mask;
}
```

```java
// Time: O(1) | Space: O(1)
// Java uses 32-bit integers for int type
class Solution {
    /**
     * Returns the bitwise complement of num, flipping only the significant bits.
     *
     * @param num The input integer
     * @return The complement of num
     */
    public int findComplement(int num) {
        // Edge case: complement of 0 is 1
        if (num == 0) return 1;

        // Create mask by propagating the highest set bit
        int mask = num;

        // Fill mask with 1s from MSB down to bit 0
        // This is an efficient way to create (2^(bitLength) - 1)
        mask |= mask >> 1;
        mask |= mask >> 2;
        mask |= mask >> 4;
        mask |= mask >> 8;
        mask |= mask >> 16;

        // For 64-bit long integers, you'd add: mask |= mask >> 32;

        // Flip all bits of num, then keep only the bits within our mask
        // The mask ensures we don't get negative numbers from flipping leading zeros
        return ~num & mask;
    }

    // Alternative implementation for clarity:
    public int findComplementAlt(int num) {
        if (num == 0) return 1;

        // Calculate the number of bits needed
        int bitCount = 0;
        int temp = num;
        while (temp > 0) {
            bitCount++;
            temp = temp >> 1;  // Shift right to count bits
        }

        // Create mask: if bitCount = 3, mask = 111 (binary) = 7
        // (1 << bitCount) gives 1000 (binary 8), subtract 1 gives 0111 (7)
        int mask = (1 << bitCount) - 1;

        // Flip bits and mask
        return ~num & mask;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- All operations work on a fixed number of bits (32 or 64 depending on language)
- The bit propagation technique uses a constant number of shift operations (5-6 steps)
- Even the alternative approach with a while loop runs at most 32 or 64 times for integer types

**Space Complexity: O(1)**

- We use only a constant amount of extra space regardless of input size
- No additional data structures that grow with input

The constant factors are excellent — this solution executes in just a handful of CPU operations regardless of the input value.

## Common Mistakes

1. **Using `~num` directly without a mask**: This is the most common mistake. Candidates forget that `~` flips all 32 or 64 bits, including leading zeros, resulting in a negative number. Always remember to mask the result.

2. **Incorrect mask calculation for num = 0**: The complement of 0 is 1 (binary `0` → `1`), but some implementations fail here. When `num = 0`, `bitLength = 0`, so `(1 << 0) - 1 = 0`, which gives the wrong result. Always handle this edge case explicitly.

3. **Off-by-one errors in mask creation**: When using `(1 << bitLength) - 1`, ensure `bitLength` counts correctly. For `num = 5` (binary `101`), `bitLength` should be 3, not 2. Test with `num = 1` (binary `1`) — complement should be 0, not 1.

4. **Using arithmetic shift instead of logical shift**: In Java and JavaScript, `>>` is arithmetic shift (preserves sign), while `>>>` in JavaScript is logical shift (fills with zeros). For mask propagation, we want logical shift. In Python, there's no distinction for positive numbers.

## When You'll See This Pattern

This mask-and-flip pattern appears in several bit manipulation problems:

1. **Reverse Bits (LeetCode 190)**: Similar masking techniques are used to isolate and rearrange bits. Instead of flipping 0↔1, you're moving bits to mirrored positions.

2. **Single Number II (LeetCode 137)**: While more complex, it uses bit masking to track counts modulo 3. The concept of isolating specific bits with masks is fundamental.

3. **Counting Bits (LeetCode 338)**: Uses bit manipulation including masks to efficiently count set bits. The relationship `num & (num-1)` clears the lowest set bit, a complementary operation to what we do here.

4. **Bitwise AND of Numbers Range (LeetCode 201)**: Requires finding common prefix of binary representations, which involves similar mask creation techniques.

The core idea — creating a mask to isolate specific bits — is fundamental to bit manipulation and appears in optimization problems, cryptography, and low-level systems programming.

## Key Takeaways

1. **Always mask after bitwise NOT**: The `~` operator flips all bits in the integer representation, not just the significant ones. You need a mask to limit the operation to relevant bits.

2. **Two ways to create the mask**:
   - Count bits and calculate `(1 << bitCount) - 1`
   - Propagate the highest set bit using shift operations: `mask |= mask >> 1`, etc.

3. **Test edge cases**: Always test with `num = 0`, `num = 1`, and `num = MAX_INT` (or a large power of two). These reveal off-by-one errors and overflow issues.

4. **Bit manipulation is often O(1)**: Because integers have fixed width, most bit operations have constant time complexity, making them extremely efficient for certain problems.

[Practice this problem on CodeJeet](/problem/number-complement)
