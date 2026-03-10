---
title: "How to Solve Maximum Xor Product — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Xor Product. Medium difficulty, 29.6% acceptance rate. Topics: Math, Greedy, Bit Manipulation."
date: "2030-03-05"
category: "dsa-patterns"
tags: ["maximum-xor-product", "math", "greedy", "bit-manipulation", "medium"]
---

# How to Solve Maximum Xor Product

This problem asks us to find an integer `x` (where `0 ≤ x < 2ⁿ`) that maximizes the product `(a XOR x) * (b XOR x)`. The challenge lies in efficiently exploring the exponential search space of possible `x` values without brute force enumeration. The key insight is that we can determine each bit of `x` independently by analyzing how it affects the product.

## Visual Walkthrough

Let's trace through a concrete example: `a = 12`, `b = 5`, `n = 4`.

**Binary representations:**

- `a = 12` = 1100₂
- `b = 5` = 0101₂
- `x` can be any value from 0 to 15 (since `2⁴ = 16`)

**Goal:** Maximize `(12 XOR x) * (5 XOR x)`

Let's think bit by bit from most significant to least significant (bit position 3 down to 0):

**Bit 3 (value 8):**

- `a` has bit 3 = 1, `b` has bit 3 = 0
- If we set `x`'s bit 3 to 0:
  - `a XOR x` gets 1 (12 becomes 12)
  - `b XOR x` gets 0 (5 becomes 5)
- If we set `x`'s bit 3 to 1:
  - `a XOR x` gets 0 (12 becomes 4)
  - `b XOR x` gets 1 (5 becomes 13)

We want to maximize the product. The product depends on both numbers. When `a` and `b` have different bits at a position, setting `x`'s bit flips both values in opposite directions. We need to consider which choice brings the two numbers closer together (since for a fixed sum, product is maximized when numbers are equal).

**Key observation:** For each bit position `i`:

- If `a` and `b` have the same bit value (both 0 or both 1), we can set `x`'s bit to flip both to 1 (if they're 0) or both to 0 (if they're 1), effectively maximizing both numbers.
- If `a` and `b` have different bits, flipping changes one up and the other down. We should choose to make the numbers more equal.

Let's continue our example systematically:

**Step-by-step construction of optimal x:**

1. Start with `x = 0`, `A = a = 12`, `B = b = 5`
2. Bit 3 (8): `a`=1, `b`=0 (different)
   - If we don't flip (x_bit=0): A=12, B=5 (difference = 7)
   - If we flip (x_bit=1): A=4, B=13 (difference = 9)
   - Better to keep difference smaller, so choose x_bit=0
3. Bit 2 (4): `a`=1, `b`=1 (same)
   - Both are 1, so flip to make both 0 (set x_bit=1)
   - Now A=8, B=1
4. Bit 1 (2): `a`=0, `b`=0 (same)
   - Both are 0, so flip to make both 1 (set x_bit=1)
   - Now A=10, B=3
5. Bit 0 (1): `a`=0, `b`=1 (different)
   - Current A=10, B=3 (difference = 7)
   - If we flip (x_bit=1): A=11, B=2 (difference = 9)
   - Better not to flip, so x_bit=0

Final: `x = 0b0110 = 6`, product = `(12 XOR 6) * (5 XOR 6) = (10) * (3) = 30`

Let's verify this is optimal by checking a few values around it:

- `x=5`: product = `(9) * (0) = 0`
- `x=7`: product = `(11) * (2) = 22`
- `x=6`: product = `(10) * (3) = 30` ✓

## Brute Force Approach

The brute force solution would try every possible `x` from `0` to `2ⁿ - 1`, compute `(a XOR x) * (b XOR x)`, and track the maximum.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(1)
def maximumXorProduct_brute(a: int, b: int, n: int) -> int:
    MOD = 10**9 + 7
    max_product = 0

    for x in range(1 << n):  # Try all x from 0 to 2^n - 1
        product = (a ^ x) * (b ^ x)
        max_product = max(max_product, product)

    return max_product % MOD
```

```javascript
// Time: O(2^n) | Space: O(1)
function maximumXorProductBrute(a, b, n) {
  const MOD = 1_000_000_007n;
  let maxProduct = 0n;

  for (let x = 0; x < 1 << n; x++) {
    const product = BigInt(a ^ x) * BigInt(b ^ x);
    if (product > maxProduct) {
      maxProduct = product;
    }
  }

  return Number(maxProduct % MOD);
}
```

```java
// Time: O(2^n) | Space: O(1)
public int maximumXorProductBrute(int a, int b, int n) {
    final int MOD = 1_000_000_007;
    long maxProduct = 0;

    for (int x = 0; x < (1 << n); x++) {
        long product = (long)(a ^ x) * (b ^ x);
        maxProduct = Math.max(maxProduct, product);
    }

    return (int)(maxProduct % MOD);
}
```

</div>

**Why this fails:** The time complexity is O(2ⁿ), which is exponential. For `n` up to 50 (as in the problem constraints), 2⁵⁰ is about 1.1 quadrillion operations - completely infeasible.

## Optimized Approach

The key insight is that we can determine each bit of `x` independently from most significant to least significant. For each bit position `i` (from n-1 down to 0):

1. **If a and b have the same bit at position i:**
   - If both are 0, we should set x's bit to 1 to flip both to 1 (increasing both numbers)
   - If both are 1, we should set x's bit to 1 to flip both to 0 (decreasing both numbers)
   - Wait, decreasing both might not seem good, but consider: if we don't flip, both remain 1. The product with both as 1 is 1. If we flip both to 0, the product is 0. So actually, we should NOT flip when both are 1! Let's correct this.

Actually, let's think more carefully. When both bits are the same:

- If both are 0: Setting x's bit to 1 makes both become 1, increasing the numbers
- If both are 1: Setting x's bit to 1 makes both become 0, decreasing the numbers
  We want to maximize the product, so we should only flip when it increases both numbers (when both are 0).

2. **If a and b have different bits at position i:**
   - This is trickier. Flipping with x_bit=1 will make:
     - The number with 0 becomes 1 (increases by 2ⁱ)
     - The number with 1 becomes 0 (decreases by 2ⁱ)
   - We need to decide which choice makes the two numbers more equal (since for fixed sum, product is maximized when numbers are equal).

We need to track the current values of A = a XOR x and B = b XOR x as we build x bit by bit. When we encounter a position where a and b have different bits:

- If currently A < B, we should try to increase A and decrease B (set x_bit to flip)
- If currently A > B, we should try to decrease A and increase B (set x_bit to NOT flip)
- If A == B, either choice gives same result

But there's a subtlety: we're building from most significant to least significant bits, so early decisions have bigger impact. We should make decisions that minimize |A - B|.

**Even better approach:** We can think about this differently. Let's define:

- For bits where a and b are the same: we can set x's bit to maximize both (set to 1 if both are 0, 0 if both are 1)
- For bits where a and b are different: these bits create an opportunity to adjust the balance between A and B

Actually, the cleanest way: For bits where a and b differ, we have a choice: we can give the 1 to either A or B. We want to give 1s to the smaller number to balance them out.

## Optimal Solution

The optimal solution processes bits from most significant to least significant (n-1 down to 0). We maintain current A and B values. For each bit:

1. If a_bit == b_bit: Set x_bit to make both 1 (if they're 0) or keep both as 1 (if they're 1)
2. If a_bit != b_bit: We have a "free bit" that can be given to either A or B. We give it to the smaller current value to balance them.

However, there's an even more elegant approach: All bits where a and b are the same are determined (we set x to flip 0s to 1s). For bits where they differ, we can assign them to minimize |A - B|. We can do this greedily from most significant to least significant.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumXorProduct(a: int, b: int, n: int) -> int:
    MOD = 10**9 + 7

    # Start with x = 0, so initially A = a, B = b
    A, B = a, b

    # Process bits from most significant (n-1) to least significant (0)
    for i in range(n - 1, -1, -1):
        mask = 1 << i  # Mask for the current bit position

        a_bit = (a & mask) != 0  # True if a has 1 at this bit
        b_bit = (b & mask) != 0  # True if b has 1 at this bit

        if a_bit == b_bit:
            # When bits are the same, we can set x's bit to 1 to flip both
            # But only if both are 0 (flipping 0s to 1s increases both)
            # If both are 1, flipping would decrease both, so we don't flip
            if not a_bit:  # Both are 0
                # Flip both to 1 by setting x's bit to 1
                A |= mask   # Set bit in A
                B |= mask   # Set bit in B
            # If both are 1, we do nothing (keep them as 1)
        else:
            # When bits are different, we have a choice
            # We want to give the 1 to the smaller number to balance them
            if A < B:
                # Give the 1 to A (which currently has 0 at this bit)
                # Since a_bit != b_bit, and we want A to get 1:
                # If a has 0, we need to flip (set x_bit=1)
                # If a has 1, we need to NOT flip (set x_bit=0)
                # Actually simpler: We want to set A's bit to 1
                # If a has 0, we need x_bit=1 to flip it to 1
                # If a has 1, we need x_bit=0 to keep it as 1
                # But wait, we're not tracking x, we're tracking A and B directly
                # If A < B, we want to increase A
                # The bit where they differ: one has 0, one has 1
                # If a has 0 at this bit, then A currently has 0
                # We can give it 1 by setting x_bit=1
                if not a_bit:  # a has 0, b has 1
                    A |= mask   # Give 1 to A
                    # B already has 1 (from b), and x_bit=1 flips it to 0
                    B &= ~mask  # Remove 1 from B
                # If a has 1, then A already has 1, we keep it
                # and B has 0, we keep it 0
            else:
                # Give the 1 to B (which is smaller or equal)
                if not b_bit:  # b has 0, a has 1
                    B |= mask   # Give 1 to B
                    A &= ~mask  # Remove 1 from A

    # Compute result modulo MOD
    return (A % MOD) * (B % MOD) % MOD
```

```javascript
// Time: O(n) | Space: O(1)
function maximumXorProduct(a, b, n) {
  const MOD = BigInt(1_000_000_007);

  // Use BigInt to handle large numbers
  let A = BigInt(a);
  let B = BigInt(b);
  let bigA = BigInt(a);
  let bigB = BigInt(b);

  // Process bits from most significant to least
  for (let i = n - 1; i >= 0; i--) {
    const mask = 1n << BigInt(i);

    const aBit = (bigA & mask) !== 0n;
    const bBit = (bigB & mask) !== 0n;

    if (aBit === bBit) {
      // Both bits are the same
      if (!aBit) {
        // Both are 0
        // Flip both to 1
        A |= mask;
        B |= mask;
      }
      // If both are 1, do nothing (keep as 1)
    } else {
      // Bits are different
      if (A < B) {
        // Give the 1 to A (the smaller number)
        if (!aBit) {
          // a has 0, b has 1
          A |= mask; // Give 1 to A
          B &= ~mask; // Remove 1 from B
        }
        // If a has 1, A already has it, do nothing
      } else {
        // Give the 1 to B
        if (!bBit) {
          // b has 0, a has 1
          B |= mask; // Give 1 to B
          A &= ~mask; // Remove 1 from A
        }
      }
    }
  }

  // Compute result modulo MOD
  return Number(((A % MOD) * (B % MOD)) % MOD);
}
```

```java
// Time: O(n) | Space: O(1)
public int maximumXorProduct(int a, int b, int n) {
    final long MOD = 1_000_000_007L;

    // Use long to avoid overflow during intermediate calculations
    long A = a;
    long B = b;

    // Process bits from most significant to least
    for (int i = n - 1; i >= 0; i--) {
        long mask = 1L << i;

        boolean aBit = (a & mask) != 0;
        boolean bBit = (b & mask) != 0;

        if (aBit == bBit) {
            // Both bits are the same
            if (!aBit) {  // Both are 0
                // Flip both to 1
                A |= mask;
                B |= mask;
            }
            // If both are 1, do nothing (keep as 1)
        } else {
            // Bits are different
            if (A < B) {
                // Give the 1 to A (the smaller number)
                if (!aBit) {  // a has 0, b has 1
                    A |= mask;    // Give 1 to A
                    B &= ~mask;   // Remove 1 from B
                }
                // If a has 1, A already has it, do nothing
            } else {
                // Give the 1 to B
                if (!bBit) {  // b has 0, a has 1
                    B |= mask;    // Give 1 to B
                    A &= ~mask;   // Remove 1 from A
                }
            }
        }
    }

    // Compute result modulo MOD
    A %= MOD;
    B %= MOD;
    return (int)((A * B) % MOD);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through `n` bits exactly once
- Each iteration performs constant-time bit operations
- This is optimal since we need to examine each bit at least once

**Space Complexity:** O(1)

- We use only a constant amount of extra space (variables for A, B, masks, etc.)
- No data structures that grow with input size

## Common Mistakes

1. **Not using modulo correctly for large products:** The product can be enormous (up to ~(2⁵⁰)² ≈ 2¹⁰⁰). Candidates often forget to apply modulo to intermediate results or apply it incorrectly. Always compute `(A % MOD) * (B % MOD) % MOD`.

2. **Processing bits in wrong order:** Bits must be processed from most significant to least significant. Early decisions have larger impact on the product. Processing from LSB to MSB leads to suboptimal results.

3. **Incorrect handling when a and b bits are both 1:** When both bits are 1, some candidates incorrectly flip them to 0, thinking "flipping is good." But flipping 1s to 0s decreases both numbers, reducing the product. Only flip when both are 0.

4. **Forgetting about integer overflow:** In languages like Java, using `int` for intermediate calculations can overflow. Use `long` for intermediate results. In JavaScript, use `BigInt` for large numbers.

## When You'll See This Pattern

This problem combines **bit manipulation** with **greedy decision-making**. Similar patterns appear in:

1. **Maximum XOR of Two Numbers in an Array (LeetCode 421):** Also uses bit-by-bit construction to maximize XOR value, though with a different optimization goal.

2. **Maximum XOR After Operations (LeetCode 2317):** Similar bit manipulation where you choose operations to maximize XOR results.

3. **Find Maximum Number of String Pairs (LeetCode 2741):** While not exactly the same, it involves making optimal bitwise decisions to maximize a value.

The core pattern is: when you need to maximize a function of XOR results and have control over the XOR operand, think about processing bits independently from MSB to LSB, making greedy decisions at each step.

## Key Takeaways

1. **Bit independence:** In XOR maximization problems, bits can often be considered independently when making decisions, especially from most significant to least significant.

2. **Greedy from MSB to LSB:** When building an optimal value bit by bit, always start from the most significant bit - each decision there has exponentially more impact than decisions at lower bits.

3. **Balance for maximum product:** For product maximization with two variables, bringing the values closer together (minimizing their difference) often leads to better results when the sum is not fixed but can be increased.

Related problems: [Maximum XOR After Operations](/problem/maximum-xor-after-operations)
