---
title: "How to Solve Minimum Flips to Make a OR b Equal to c — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Flips to Make a OR b Equal to c. Medium difficulty, 71.9% acceptance rate. Topics: Bit Manipulation."
date: "2026-02-15"
category: "dsa-patterns"
tags: ["minimum-flips-to-make-a-or-b-equal-to-c", "bit-manipulation", "medium"]
---

# How to Solve Minimum Flips to Make a OR b Equal to c

This problem asks us to find the minimum number of single-bit flips needed in two numbers `a` and `b` so that their bitwise OR equals a third number `c`. What makes this interesting is that for each bit position, we have three bits to consider (from `a`, `b`, and `c`), and we need to choose which bits to flip to minimize total flips while achieving the desired OR result.

## Visual Walkthrough

Let's trace through a concrete example: `a = 2`, `b = 6`, `c = 5`

First, convert to binary (using 4 bits for clarity):

- `a = 2` → `0010`
- `b = 6` → `0110`
- `c = 5` → `0101`

We need to examine each bit position from right to left (least significant to most significant):

**Bit position 0 (rightmost):**

- `a` bit: `0`
- `b` bit: `0`
- `c` bit: `1`
- Current OR: `0 OR 0 = 0`
- Desired OR: `1`

We need `(a OR b)` to be `1` at this position. Since both `a` and `b` are `0`, flipping either one to `1` will work. Minimum flips: **1** (flip either `a` or `b`).

**Bit position 1:**

- `a` bit: `1`
- `b` bit: `1`
- `c` bit: `0`
- Current OR: `1 OR 1 = 1`
- Desired OR: `0`

We need `(a OR b)` to be `0`, but currently it's `1`. The OR is `1` because at least one of `a` or `b` is `1`. To make it `0`, we must flip BOTH `a` and `b` from `1` to `0`. Minimum flips: **2**.

**Bit position 2:**

- `a` bit: `0`
- `b` bit: `1`
- `c` bit: `1`
- Current OR: `0 OR 1 = 1`
- Desired OR: `1`

Already matches! No flips needed: **0**.

**Bit position 3:**

- `a` bit: `0`
- `b` bit: `0`
- `c` bit: `0`
- Current OR: `0 OR 0 = 0`
- Desired OR: `0`

Already matches! No flips needed: **0**.

Total flips = 1 + 2 + 0 + 0 = **3**.

This walkthrough reveals the pattern: for each bit position, we look at the three bits and decide how many flips are needed based on the relationship between the current OR and the desired OR.

## Brute Force Approach

A naive approach might try all possible combinations of flips across all bits of `a` and `b`, but that would be exponential (2^(2n) where n is number of bits). Another brute force would be to iterate through all numbers from 0 to some maximum, but that's also exponential in the number of bits.

What a candidate might initially try is converting all numbers to binary strings, padding them to equal length, then checking each position. While this approach would work, it's not truly "brute force" in the sense of trying all possibilities - it's actually the optimal approach! The interesting insight is that each bit position can be considered independently because flips at one position don't affect other positions.

The real "brute force" thinking would be: "Let me try flipping bits in `a` and `b` randomly until I get the right OR" - which is clearly infeasible. Instead, we need to recognize that bit positions are independent.

## Optimized Approach

The key insight is **bit independence**: each bit position can be analyzed separately because the OR operation and flips at one position don't affect other positions. This means we can process bits one by one and sum the flips needed at each position.

For each bit position `i`, we need to consider:

1. The `i`-th bit of `a` (call it `aBit`)
2. The `i`-th bit of `b` (call it `bBit`)
3. The `i`-th bit of `c` (call it `cBit`)
4. The current OR: `currentOR = aBit | bBit`

Now we have four cases:

**Case 1: `currentOR == cBit`**

- No flips needed. Continue to next bit.

**Case 2: `currentOR == 0` and `cBit == 1`**

- We need the OR to become `1`, but both bits are `0`
- Flip EITHER `aBit` or `bBit` from `0` to `1`
- Minimum flips: **1**

**Case 3: `currentOR == 1` and `cBit == 0`**

- We need the OR to become `0`, but at least one bit is `1`
- If BOTH `aBit` and `bBit` are `1`: must flip BOTH to `0` → **2 flips**
- If only ONE of them is `1`: flip that one to `0` → **1 flip**

We process all bits from least significant to most significant until we've covered all bits in the largest number.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k) where k is the number of bits in the largest number (max(a, b, c))
# Space: O(1) - we only use a few variables
def minFlips(a: int, b: int, c: int) -> int:
    flips = 0

    # Continue until all bits in a, b, and c are processed
    while a > 0 or b > 0 or c > 0:
        # Extract the least significant bit of each number
        a_bit = a & 1  # Get last bit of a
        b_bit = b & 1  # Get last bit of b
        c_bit = c & 1  # Get last bit of c

        # Calculate current OR of the two bits
        current_or = a_bit | b_bit

        if current_or != c_bit:
            if c_bit == 1:
                # Case: Need OR to be 1, but both are 0
                # Flip either a or b from 0 to 1
                flips += 1
            else:
                # Case: Need OR to be 0, but at least one is 1
                # If both are 1, need 2 flips (flip both to 0)
                # If only one is 1, need 1 flip
                flips += (a_bit + b_bit)  # This gives 1 or 2

        # Right shift all numbers to process next bit
        a >>= 1
        b >>= 1
        c >>= 1

    return flips
```

```javascript
// Time: O(k) where k is the number of bits in the largest number (max(a, b, c))
// Space: O(1) - we only use a few variables
function minFlips(a, b, c) {
  let flips = 0;

  // Continue until all bits in a, b, and c are processed
  while (a > 0 || b > 0 || c > 0) {
    // Extract the least significant bit of each number
    const aBit = a & 1; // Get last bit of a
    const bBit = b & 1; // Get last bit of b
    const cBit = c & 1; // Get last bit of c

    // Calculate current OR of the two bits
    const currentOr = aBit | bBit;

    if (currentOr !== cBit) {
      if (cBit === 1) {
        // Case: Need OR to be 1, but both are 0
        // Flip either a or b from 0 to 1
        flips += 1;
      } else {
        // Case: Need OR to be 0, but at least one is 1
        // If both are 1, need 2 flips (flip both to 0)
        // If only one is 1, need 1 flip
        flips += aBit + bBit; // This gives 1 or 2
      }
    }

    // Right shift all numbers to process next bit
    a >>= 1;
    b >>= 1;
    c >>= 1;
  }

  return flips;
}
```

```java
// Time: O(k) where k is the number of bits in the largest number (max(a, b, c))
// Space: O(1) - we only use a few variables
class Solution {
    public int minFlips(int a, int b, int c) {
        int flips = 0;

        // Continue until all bits in a, b, and c are processed
        while (a > 0 || b > 0 || c > 0) {
            // Extract the least significant bit of each number
            int aBit = a & 1;  // Get last bit of a
            int bBit = b & 1;  // Get last bit of b
            int cBit = c & 1;  // Get last bit of c

            // Calculate current OR of the two bits
            int currentOr = aBit | bBit;

            if (currentOr != cBit) {
                if (cBit == 1) {
                    // Case: Need OR to be 1, but both are 0
                    // Flip either a or b from 0 to 1
                    flips += 1;
                } else {
                    // Case: Need OR to be 0, but at least one is 1
                    // If both are 1, need 2 flips (flip both to 0)
                    // If only one is 1, need 1 flip
                    flips += (aBit + bBit);  // This gives 1 or 2
                }
            }

            // Right shift all numbers to process next bit
            a >>= 1;
            b >>= 1;
            c >>= 1;
        }

        return flips;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k)** where k is the number of bits in the largest number among `a`, `b`, and `c`. Since we process each bit exactly once, and the number of bits is at most 32 (for 32-bit integers) or 64 (for 64-bit integers), this is effectively O(1) for fixed-width integers. However, in asymptotic analysis where numbers can be arbitrarily large, it's O(log(max(a, b, c))).

**Space Complexity: O(1)** as we only use a constant amount of extra space regardless of input size. We don't create any data structures that grow with input size.

## Common Mistakes

1. **Forgetting to handle the case where both bits are 1 and cBit is 0**: This requires 2 flips, not 1. Candidates often miss that when `aBit = 1`, `bBit = 1`, and `cBit = 0`, you need to flip BOTH bits to 0.

2. **Incorrect loop condition**: Using `while (a > 0 && b > 0 && c > 0)` instead of `||` (OR). If you use `&&`, the loop stops as soon as any number becomes 0, potentially missing bits from the other numbers.

3. **Not considering all bits of the largest number**: Some candidates stop when `c` becomes 0, but `a` or `b` might have more bits that need to be flipped to 0 if `c` has fewer bits.

4. **Using string conversion unnecessarily**: Converting to binary strings and padding is less efficient and more error-prone than using bitwise operations directly. It also uses O(n) extra space.

## When You'll See This Pattern

This problem uses **bitwise operations with case analysis**, a pattern common in many bit manipulation problems:

1. **Minimum Bit Flips to Convert Number** (LeetCode 2220): Similar concept of counting bit differences, but with only two numbers instead of three.

2. **Hamming Distance** (LeetCode 461): Counting differing bits between two numbers using XOR.

3. **Number of 1 Bits** (LeetCode 191): Counting set bits using bit manipulation techniques.

4. **Single Number** (LeetCode 136): Using XOR properties to find the unique element.

The core pattern is: when dealing with bit manipulation problems, consider each bit position independently, use bitwise operators (&, |, ^, ~, <<, >>) to extract and manipulate bits, and process numbers from LSB to MSB or vice versa.

## Key Takeaways

1. **Bit independence is powerful**: When operations like OR, AND, XOR work on individual bits without affecting others, you can process bits independently and sum results.

2. **Case analysis simplifies complex problems**: Breaking down the problem into all possible cases (4 in this problem) makes it manageable and less error-prone.

3. **Bitwise operators are more efficient than string operations**: For bit manipulation problems, prefer `& 1` to get LSB and `>> 1` to shift, rather than converting to strings which uses extra memory and time.

Related problems: [Minimum Bit Flips to Convert Number](/problem/minimum-bit-flips-to-convert-number)
