---
title: "How to Solve Complement of Base 10 Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Complement of Base 10 Integer. Easy difficulty, 60.6% acceptance rate. Topics: Bit Manipulation."
date: "2027-11-30"
category: "dsa-patterns"
tags: ["complement-of-base-10-integer", "bit-manipulation", "easy"]
---

# How to Solve Complement of Base 10 Integer

This problem asks us to find the bitwise complement of a given integer. While it sounds straightforward, the tricky part lies in handling binary representations correctly—especially dealing with leading zeros that don't actually exist in the binary representation but affect the complement calculation. The complement operation should only flip the bits in the actual binary representation of the number, not all 32 bits of an integer.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we're given `n = 5`:

1. **Binary representation**: 5 in binary is `101`
2. **Complement operation**: Flip each bit: `1→0`, `0→1`, `1→0`
3. **Result**: `010` in binary
4. **Convert to decimal**: `010₂ = 2₁₀`

But what about `n = 7`?

1. **Binary**: `111`
2. **Complement**: `000`
3. **Result**: `0`

Now consider `n = 10`:

1. **Binary**: `1010`
2. **Complement**: `0101`
3. **Result**: `0101₂ = 5₁₀`

The pattern emerges: we need to flip only the bits that are part of the number's binary representation, not all 32 bits. For `n = 5` (binary `101`), we shouldn't flip 29 leading zeros that don't exist in the actual representation.

## Brute Force Approach

A naive approach would be to:

1. Convert the integer to a binary string
2. Flip each character in the string
3. Convert back to integer

However, this approach has issues with leading zeros in the binary string representation. Python's `bin()` function returns a string like `'0b101'` for `5`, and when we flip bits, we need to handle the `'0b'` prefix and ensure we're only flipping the actual bits.

Here's what the brute force might look like:

```python
def bitwiseComplement(n):
    # Convert to binary string and remove '0b' prefix
    binary = bin(n)[2:]

    # Flip each bit
    flipped = ''
    for bit in binary:
        flipped += '1' if bit == '0' else '0'

    # Convert back to integer
    return int(flipped, 2) if flipped else 0
```

While this works, it's not the most efficient approach, and it doesn't teach the bit manipulation techniques that interviewers often look for. The string operations are relatively slow compared to bitwise operations.

## Optimal Solution

The optimal solution uses bit manipulation. The key insight is that we can create a **bitmask** that has `1`s in all positions where `n` has significant bits, then XOR `n` with this mask.

For example, with `n = 5` (binary `101`):

- We need a mask of `111` (binary)
- XOR operation: `101 ^ 111 = 010` (which is 2)

How do we create this mask? We find the smallest power of 2 greater than `n`, then subtract 1. For `n = 5`:

- Smallest power of 2 greater than 5 is 8 (binary `1000`)
- Subtract 1: `8 - 1 = 7` (binary `111`)
- This gives us exactly the mask we need!

Special case: when `n = 0`, its complement is `1` (binary `0` becomes `1`).

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def bitwiseComplement(n: int) -> int:
    # Handle edge case: complement of 0 is 1
    if n == 0:
        return 1

    # Create a bitmask with all 1's in the positions
    # where n has significant bits
    # For n = 5 (binary 101), we need mask = 111

    # Start with mask = 1 (binary 1)
    mask = 1

    # Keep shifting mask left until it's greater than n
    # For n = 5: mask goes 1→10→100→1000 (binary)
    while mask <= n:
        mask <<= 1  # Shift left by 1 bit (multiply by 2)

    # Subtract 1 to get all 1's in the lower bits
    # mask = 1000 (binary 8) becomes 0111 (binary 7)
    mask -= 1

    # XOR n with mask to flip all bits
    # 101 ^ 111 = 010 (5 ^ 7 = 2)
    return n ^ mask
```

```javascript
// Time: O(1) | Space: O(1)
function bitwiseComplement(n) {
  // Handle edge case: complement of 0 is 1
  if (n === 0) {
    return 1;
  }

  // Create a bitmask with all 1's in the positions
  // where n has significant bits
  // For n = 5 (binary 101), we need mask = 111

  // Start with mask = 1 (binary 1)
  let mask = 1;

  // Keep shifting mask left until it's greater than n
  // For n = 5: mask goes 1→10→100→1000 (binary)
  while (mask <= n) {
    mask <<= 1; // Shift left by 1 bit (multiply by 2)
  }

  // Subtract 1 to get all 1's in the lower bits
  // mask = 1000 (binary 8) becomes 0111 (binary 7)
  mask -= 1;

  // XOR n with mask to flip all bits
  // 101 ^ 111 = 010 (5 ^ 7 = 2)
  return n ^ mask;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int bitwiseComplement(int n) {
        // Handle edge case: complement of 0 is 1
        if (n == 0) {
            return 1;
        }

        // Create a bitmask with all 1's in the positions
        // where n has significant bits
        // For n = 5 (binary 101), we need mask = 111

        // Start with mask = 1 (binary 1)
        int mask = 1;

        // Keep shifting mask left until it's greater than n
        // For n = 5: mask goes 1→10→100→1000 (binary)
        while (mask <= n) {
            mask <<= 1;  // Shift left by 1 bit (multiply by 2)
        }

        // Subtract 1 to get all 1's in the lower bits
        // mask = 1000 (binary 8) becomes 0111 (binary 7)
        mask -= 1;

        // XOR n with mask to flip all bits
        // 101 ^ 111 = 010 (5 ^ 7 = 2)
        return n ^ mask;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- While we have a loop that runs while `mask <= n`, in practice this loop runs at most 31 times for 32-bit integers (or 63 times for 64-bit integers). Since the number of iterations is bounded by the fixed number of bits in an integer, this is considered constant time.

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the `mask` variable), regardless of the input size.

## Common Mistakes

1. **Forgetting the n = 0 edge case**: When `n = 0`, the binary representation is just `0`. Its complement should be `1` (binary `1`), not `0`. Many candidates return `0` for this case.

2. **Incorrect mask calculation**: Some candidates try to create a mask of all 1's (like `~0` or `0xFFFFFFFF`), but this flips all 32 bits, not just the significant bits. For `n = 5`, this would give the wrong result.

3. **Off-by-one errors in the loop condition**: Using `while (mask < n)` instead of `while (mask <= n)` fails for numbers that are powers of 2. For `n = 4` (binary `100`), we need a mask of `111`, which requires `mask` to become `1000` (8) before subtracting 1.

4. **Using arithmetic instead of bitwise operations**: Some candidates convert to string, manipulate, and convert back. While this works, it's less efficient and doesn't demonstrate bit manipulation skills that interviewers look for.

## When You'll See This Pattern

This problem teaches the important technique of using bitmasks and XOR operations, which appear in many bit manipulation problems:

1. **Single Number** (LeetCode 136): Uses XOR to find the unique number in an array where every other number appears twice. The pattern `a ^ a = 0` and `a ^ 0 = a` is key.

2. **Number of 1 Bits** (LeetCode 191): Counts the number of set bits in an integer using bit manipulation techniques like `n & (n-1)` to clear the lowest set bit.

3. **Reverse Bits** (LeetCode 190): Reverses the bits of a given integer, often using bitmasks to extract and reposition individual bits.

The core pattern is using bitwise operations (AND, OR, XOR, shifts) and masks to manipulate specific bits without affecting others.

## Key Takeaways

1. **Bitmask technique**: When you need to manipulate specific bits while preserving others, create a mask with 1's in the positions you want to affect and 0's elsewhere. XOR with a mask flips bits, AND clears bits, OR sets bits.

2. **Creating all-1's mask**: To create a mask with `k` least significant bits set to 1, use `(1 << k) - 1`. This is a useful pattern to remember.

3. **Handling edge cases**: Always test with 0, 1, maximum values, and powers of 2. These often reveal off-by-one errors in bit manipulation problems.

[Practice this problem on CodeJeet](/problem/complement-of-base-10-integer)
